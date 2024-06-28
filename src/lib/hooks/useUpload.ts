import { useState } from "react";
import axios from "axios";
import useAuth from "./useAuth";

const CHUNK_SIZE = 1024 * 1024 * 4;

const useUpload = () => {
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const { session }: any = useAuth();

  const uploadChunk = async (
    file: File,
    chunkIndex: number,
    totalChunks: number,
  ): Promise<boolean> => {
    const start = chunkIndex * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("chunkIndex", chunkIndex.toString());
    formData.append("fileName", file.name);

    try {
      await axios.post("https://api.aionsites.com/upload/chunk", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${session.jwt}`,
        },
      });

      setProgress(() => Math.round(((chunkIndex + 1) / totalChunks) * 100));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    setError(null);
    setProgress(0);
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const success = await uploadChunk(file, chunkIndex, totalChunks);
      if (!success) {
        setError("Failed to upload chunk");
        return null;
      }
    }

    try {
      const response = await axios.post(
        "https://api.aionsites.com/upload/complete",
        { fileName: file.name },
        {
          headers: {
            Authorization: `Bearer ${session.jwt}`,
          },
        },
      );

      if (response.status !== 200) {
        throw new Error("Failed to complete upload");
      }

      return response.data.url; // Adjust this according to the response structure
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  return { uploadImage, error, progress };
};

export default useUpload;

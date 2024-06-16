import { useState } from "react";
import axios from "axios";
import useAuth from "./useAuth";

const useUpload = () => {
  const [error, setError] = useState<string | null>(null);
  const { session }: any = useAuth();

  const uploadImage = async (file: File): Promise<string | null> => {
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file); // Ensure the key matches what multer is expecting

      const response = await axios.post(
        "http://localhost:8080/upload/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${session.jwt}`,
          },
        },
      );

      if (response.status !== 200) {
        throw new Error("Failed to upload image");
      }

      const data = await response.data;
      return data.url; // Adjust this according to the response structure
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  return { uploadImage, error };
};

export default useUpload;

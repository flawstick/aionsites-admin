"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Image, Upload } from "lucide-react";
import { useRestaurantStore } from "@/lib/store/restaurantStore";
import useAuth from "@/lib/hooks/useAuth";
import useUpload from "@/lib/hooks/useUpload";

export default function RestaurantProfileSettings() {
  const { selectedRestaurant, fetchSelectedRestaurant, updateRestaurant } =
    useRestaurantStore();
  const { session } = useAuth();
  const { uploadImage, error, progress } = useUpload();

  const [name, setName] = useState(selectedRestaurant?.name || "");
  const [configurableUrl, setConfigurableUrl] = useState(
    selectedRestaurant?.configurableUrl || "",
  );
  const [banner, setBanner] = useState(
    selectedRestaurant?.profile?.banner || "",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // @ts-ignore
    fetchSelectedRestaurant(session.jwt);
  }, []);

  useEffect(() => {
    setName(selectedRestaurant?.name || "");
    setConfigurableUrl(selectedRestaurant?.configurableUrl || "");
    setBanner(selectedRestaurant?.profile?.banner || "");
  }, [selectedRestaurant]);

  // Track if there are unsaved changes
  useEffect(() => {
    setHasChanges(
      name !== selectedRestaurant?.name ||
        configurableUrl !== selectedRestaurant?.configurableUrl ||
        banner !== selectedRestaurant?.profile?.banner,
    );
  }, [name, configurableUrl, banner, selectedRestaurant]);

  const handleSave = async () => {
    setIsSaving(true);
    await updateRestaurant(
      // @ts-ignore
      session.jwt,
      {
        name,
        configurableUrl,
        banner,
      } as any,
      selectedRestaurant?._id as string,
    );
    setIsSaving(false);
  };

  const handleBannerUpload = async (file: File) => {
    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      setBanner(imageUrl);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold mb-4">Restaurant Name</h2>
        <p className="text-gray-600 mb-2">
          This is your restaurant's visible name within the platform.
        </p>
        <Input
          placeholder="Enter restaurant name"
          className="max-w-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p className="text-sm text-gray-500 mt-2">
          Please use 32 characters at maximum.
        </p>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Restaurant URL</h2>
        <p className="text-gray-600 mb-2">
          This is your restaurant's URL on our platform.
        </p>
        <div className="flex max-w-md">
          <span className="inline-flex items-center px-3 text-sm bg-muted border border-r-0 border-muted rounded-l-md">
            grubapp.co/
          </span>
          <Input
            placeholder="your-restaurant"
            value={configurableUrl}
            onChange={(e) => setConfigurableUrl(e.target.value)}
            className="rounded-l-none"
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Please use 48 characters at maximum.
        </p>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Restaurant Banner</h2>
        <p className="text-gray-600 mb-2">
          This banner will be displayed at the top of your restaurant page.
        </p>
        <div className="flex items-center space-x-4">
          <div className="w-64 h-24 bg-gray-200 rounded flex items-center justify-center">
            {banner ? (
              <img
                src={banner}
                alt="Restaurant Banner"
                className="object-cover h-full w-full rounded"
              />
            ) : (
              <Image className="h-10 w-10 text-gray-400" />
            )}
          </div>
          <label
            htmlFor="banner-upload"
            className="cursor-pointer flex items-center space-x-2"
          >
            <Upload className="h-5 w-5 text-gray-500" />
            <span>Change Banner</span>
            <input
              id="banner-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleBannerUpload(e.target.files[0]);
                }
              }}
            />
          </label>
        </div>
        {progress > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            Upload Progress: {progress}%
          </p>
        )}
        {error && <p className="text-sm text-red-500 mt-2">Error: {error}</p>}
      </div>
      <div className="pt-6">
        <Button
          onClick={handleSave}
          variant="default"
          disabled={!hasChanges || isSaving}
          className={`${hasChanges ? "bg-primary" : "bg-gray-400"} text-white`}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

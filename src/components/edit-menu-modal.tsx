import { useEffect, useState, useRef } from "react";
import { Flame, Leaf, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRestaurantStore } from "@/lib/store/restaurantStore";
import useUpload from "@/lib/hooks/useUpload";
import useMenuStore from "@/lib/store/menuStore";
import { useItems } from "@/lib/hooks/useItems";
import { toast } from "sonner";

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface EditMenuItemDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
}

export default function EditMenuItemDrawer({
  isOpen,
  onClose,
  item,
}: EditMenuItemDrawerProps) {
  const [name, setName] = useState(item?.name || "");
  const [description, setDescription] = useState(item?.description || "");
  const [price, setPrice] = useState(item?.price.toString() || "");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    item?.imageUrl || null,
  );
  const [selectedDays, setSelectedDays] = useState<number[]>(
    item?.indexDaysAvailable && item.indexDaysAvailable.length > 0
      ? item.indexDaysAvailable
      : [0, 1, 2, 3, 4, 5, 6],
  );
  const [isSpicy, setIsSpicy] = useState(item?.isSpicy || false);
  const [isVegan, setIsVegan] = useState(item?.vegan || false);
  const [category, setCategory] = useState(item?.category || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [validationError, setValidationError] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const { selectedRestaurant } = useRestaurantStore();
  const { uploadImage } = useUpload();
  const { categories } = useMenuStore();
  const { editItem } = useItems();

  useEffect(() => {
    if (item) {
      setName(item?.name);
      setDescription(item?.description);
      setPrice(item?.price.toString());
      setImagePreview(item?.imageUrl || null);
      setSelectedDays(
        item?.indexDaysAvailable && item.indexDaysAvailable.length > 0
          ? item.indexDaysAvailable
          : [0, 1, 2, 3, 4, 5, 6],
      );
      setIsSpicy(item?.isSpicy);
      setIsVegan(item?.vegan);
      setCategory(item?.category);
    }
  }, [item]);

  const handleDayChange = (dayIndex: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((d) => d !== dayIndex)
        : [...prev, dayIndex],
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setImage(null);
    setImagePreview(null);
    setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
    setIsSpicy(false);
    setIsVegan(false);
    setCategory("");
    setValidationError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price || !category) {
      setValidationError("All fields must be filled.");
      return;
    }

    // Optional: Prevent submission if no days are selected
    if (selectedDays.length === 0) {
      setValidationError("Please select at least one available day.");
      return;
    }

    let imageUrl = imagePreview;
    if (image) {
      try {
        imageUrl = (await uploadImage(image)) as string;
        if (!imageUrl) {
          throw new Error("Image upload failed.");
        }
      } catch (error) {
        setValidationError("Failed to upload image.");
        return;
      }
    }

    setEditLoading(true);

    const updatedItem = {
      _id: item._id,
      restaurantId: selectedRestaurant?._id,
      name,
      description,
      price: parseFloat(price),
      category,
      imageUrl,
      isSpicy,
      vegan: !!isVegan,
      indexDaysAvailable: selectedDays,
      modifiers: [],
      quantity: 1,
    };

    try {
      if (await editItem(updatedItem)) {
        toast("Menu item updated successfully", {
          actionButtonStyle: {
            backgroundColor: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
          },
          action: { label: "yay!", onClick: () => {} },
        });
      } else {
        toast("Failed to update menu item", {
          actionButtonStyle: {
            backgroundColor: "hsl(var(--destructive))",
            color: "hsl(var(--primary-foreground))",
          },
          action: {
            label: "Retry",
            onClick: () => {
              handleSubmit(e);
            },
          },
        });
      }
      onClose();
    } catch (error) {
      setValidationError("Failed to edit menu item.");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-screen flex flex-col">
        <div className="mx-auto w-full xl:max-w-[80vw] h-full flex flex-col">
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="px-4 py-4 border-b">
              <h2 className="text-lg font-semibold">Edit Menu Item</h2>
              <p className="text-sm text-muted-foreground">
                Update the details for the menu item.
              </p>
            </div>
            <ScrollArea className="flex-grow px-4 py-4">
              <div className="space-y-6 pr-2 mx-2">
                {validationError && (
                  <div className="text-red-500">{validationError}</div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Select Image
                    </Button>
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Menu item preview"
                          className="w-16 h-16 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={handleRemoveImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Properties</Label>
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant={isSpicy ? "default" : "outline"}
                      className="flex items-center space-x-2"
                      onClick={() => setIsSpicy(!isSpicy)}
                    >
                      <Flame
                        className={`h-4 w-4 ${
                          isSpicy ? "text-red-100 drop-shadow-md" : ""
                        }`}
                      />
                      <span className={`${isSpicy ? "drop-shadow-md" : ""}`}>
                        Spicy
                      </span>
                    </Button>
                    <Button
                      type="button"
                      variant={isVegan ? "default" : "outline"}
                      className="flex items-center space-x-2"
                      onClick={() => setIsVegan(!isVegan)}
                    >
                      <Leaf
                        className={`h-4 w-4 ${isVegan ? "text-green-500" : ""}`}
                      />
                      <span className={`${isVegan ? "drop-shadow-md" : ""}`}>
                        Vegan
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Available Days</Label>
                  <div className="flex flex-wrap gap-2">
                    {weekDays.map((day, index) => (
                      <Button
                        key={day}
                        type="button"
                        variant={
                          selectedDays.includes(index) ? "default" : "outline"
                        }
                        onClick={() => handleDayChange(index)}
                        className="px-3 py-2 flex items-center space-x-2"
                      >
                        <span>{day}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                <Button type="button" variant="outline" className="w-full">
                  Select Modifiers
                </Button>
              </div>
            </ScrollArea>
            <div className="flex flex-row px-4 py-4 mb-2 border-t items-center justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={editLoading}>
                {editLoading ? "Updating..." : "Update Item"}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

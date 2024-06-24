"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Trash2Icon } from "@/components/icons";
import { useRestaurantStore } from "@/lib/store/restaurantStore";
import useUpload from "@/lib/hooks/useUpload";

interface Addition {
  name: string;
  price: number;
}

interface EditMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemData: {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    additions: Addition[];
  } | null;
  onSave: (data: any) => void;
}

const EditMenuModal: React.FC<EditMenuModalProps> = ({
  isOpen,
  onClose,
  itemData,
}) => {
  const { updateMenuItem } = useRestaurantStore();
  const { uploadImage, error: uploadError } = useUpload();

  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState(0);
  const [itemCategory, setItemCategory] = useState("");
  const [itemImage, setItemImage] = useState<File | null>(null);
  const [mealAdditions, setMealAdditions] = useState<Addition[]>([]);
  const [validationError, setValidationError] = useState("");
  const [itemImageUrl, setItemImageUrl] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (itemData) {
      setItemName(itemData.name);
      setItemDescription(itemData.description);
      setItemPrice(itemData.price);
      setItemCategory(itemData.category);
      setItemImageUrl(itemData.imageUrl);
      setMealAdditions(itemData.additions);
    }
  }, [itemData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setItemImageUrl(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
      setItemImage(e.target.files[0]);
    }
  };

  const handleAdditionChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const newAdditions = [...mealAdditions];
    newAdditions[index] = { ...newAdditions[index], [field]: value };
    setMealAdditions(newAdditions);
  };

  const handleRemoveAddition = (index: number) => {
    const newAdditions = mealAdditions.filter((_, i) => i !== index);
    setMealAdditions(newAdditions);
  };

  const handleAddAddition = () => {
    setMealAdditions([...mealAdditions, { name: "", price: 0 }]);
  };

  const handleSaveEditedItem = async () => {
    if (!itemName || !itemDescription || itemPrice < 0 || !itemCategory) {
      setValidationError("Please fill in all fields correctly.");
      return;
    }

    let imageUrl = itemImageUrl;
    if (itemImage) {
      try {
        imageUrl = (await uploadImage(itemImage)) as string;
        if (!imageUrl) {
          throw new Error("Image upload failed.");
        }
      } catch (error) {
        setValidationError("Failed to upload image.");
        return;
      }
    }

    setValidationError("");
    const updatedItem = {
      ...itemData,
      name: itemName,
      description: itemDescription,
      price: itemPrice,
      category: itemCategory,
      imageUrl,
      additions: mealAdditions,
    };

    setSaveLoading(true);
    updateMenuItem(updatedItem as any);
    setSaveLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
          <DialogDescription>
            Update the details below to edit the item in the menu.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 max-h-[60vh] px-3 overflow-y-auto">
          {validationError && (
            <div className="text-red-500">{validationError}</div>
          )}
          <div className="grid gap-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="price">Price</Label>
            <div className="flex items-center">
              <span className="mr-2 text-xl mb-2 text-gray-500">₪</span>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={itemPrice}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value >= 0) setItemPrice(value);
                }}
              />
            </div>
          </div>
          <div className="grid gap-1">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={itemCategory}
              onChange={(e) => setItemCategory(e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {itemImageUrl && (
              <img
                src={itemImageUrl}
                alt="Item"
                className="w-24 h-24 object-cover rounded mt-2"
              />
            )}
          </div>
          <div className="grid gap-1">
            <Label>Meal Additions</Label>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mealAdditions.map((addition, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={addition.name}
                        onChange={(e) =>
                          handleAdditionChange(index, "name", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="mr-2 text-xl mb-2 text-gray-500">
                          ₪
                        </span>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={addition.price}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (value >= 0)
                              handleAdditionChange(index, "price", value);
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveAddition(index)}
                      >
                        <Trash2Icon className="w-4 h-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button variant="outline" onClick={handleAddAddition}>
              Add Addition
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={saveLoading} onClick={handleSaveEditedItem}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditMenuModal;

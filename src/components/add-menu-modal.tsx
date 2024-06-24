"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
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
import { useRestaurantStore } from "@/lib/store/restaurantStore";
import useUpload from "@/lib/hooks/useUpload";
import { Trash2Icon } from "@/components/icons";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose }) => {
  const { addMenuItem, selectedRestaurant } = useRestaurantStore();
  const { uploadImage, error: uploadError } = useUpload();

  const [newItemName, setNewItemName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemPrice, setNewItemPrice] = useState(0);
  const [newItemCategory, setNewItemCategory] = useState("");
  const [newItemImage, setNewItemImage] = useState<File | null>(null);
  const [mealAdditions, setMealAdditions] = useState([{ name: "", price: 0 }]);
  const [validationError, setValidationError] = useState("");
  const [newItemImageUrl, setNewItemImageUrl] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const handleSaveNewItem = async () => {
    if (
      !newItemName ||
      !newItemDescription ||
      !newItemPrice ||
      !newItemCategory
    ) {
      setValidationError("All fields must be filled.");
      return;
    }

    for (const addition of mealAdditions) {
      if (addition.name && !addition.price) {
        setValidationError("All additions must have both name and price.");
        return;
      }
      if (!addition.name && addition.price) {
        setValidationError("All additions must have both name and price.");
        return;
      }
    }

    let imageUrl = "";
    if (newItemImage) {
      try {
        imageUrl = (await uploadImage(newItemImage)) as string;
        if (!imageUrl) {
          throw new Error("Image upload failed.");
        }
      } catch (error) {
        setValidationError("Failed to upload image.");
        return;
      }
    }

    setAddLoading(true);
    const newItem = {
      restaurantId: selectedRestaurant?._id,
      name: newItemName,
      description: newItemDescription,
      price: newItemPrice,
      category: newItemCategory,
      imageUrl,
      additions: mealAdditions as [{ name: string; price: number }],
    };

    addMenuItem(newItem);
    setAddLoading(false);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setNewItemName("");
    setNewItemDescription("");
    setNewItemPrice(0);
    setNewItemCategory("");
    setNewItemImage(null);
    setNewItemImageUrl("");
    setMealAdditions([{ name: "", price: 0 }]);
    setValidationError("");
  };

  const handleAdditionChange = (index: number, field: string, value: any) => {
    const newAdditions: any = [...mealAdditions];
    newAdditions[index][field] = value;
    setMealAdditions(newAdditions);
  };

  const handleAddAddition = () => {
    setMealAdditions([...mealAdditions, { name: "", price: 0 }]);
  };

  const handleRemoveAddition = (index: number) => {
    const newAdditions = mealAdditions.filter((_, i) => i !== index);
    setMealAdditions(newAdditions);
  };

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    setNewItemImage(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Menu Item</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new item to the menu.
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
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newItemDescription}
              onChange={(e) => setNewItemDescription(e.target.value)}
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
                value={newItemPrice}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value >= 0) setNewItemPrice(value);
                }}
              />
            </div>
          </div>
          <div className="grid gap-1">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
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
            {newItemImageUrl && (
              <img
                src={newItemImageUrl}
                alt="New item"
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
          <Button variant="outline" onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button disabled={addLoading} onClick={handleSaveNewItem}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemModal;

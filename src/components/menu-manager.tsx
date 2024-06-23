"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2Icon, FilePenIcon } from "./icons";
import { useRestaurantStore } from "@/lib/store/restaurantStore";
import useAuth from "@/lib/hooks/useAuth";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import useUpload from "@/lib/hooks/useUpload";
import { SaveMenuButton } from "./save-menu-button";

export default function MenuManager() {
  const { session }: any = useAuth();
  const {
    menu,
    addMenuItem,
    removeMenuItem,
    fetchMenu,
    saveMenu,
    selectedRestaurant,
    loadFromCache,
  } = useRestaurantStore();
  const { uploadImage, error: uploadError } = useUpload();

  // New item modal state
  const [newItemModal, setNewItemModal] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemPrice, setNewItemPrice] = useState(0);
  const [newItemCategory, setNewItemCategory] = useState("");
  const [newItemImage, setNewItemImage] = useState<File | null>(null);
  const [mealAdditions, setMealAdditions] = useState([{ name: "", price: 0 }]);
  const [validationError, setValidationError] = useState("");
  const [newItemImageUrl, setNewItemImageUrl] = useState("");

  // Loading state for saving
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session) {
      fetchMenu(session.jwt);
    }
    loadFromCache();
  }, [session, fetchMenu, loadFromCache]);

  const handleAddNewItem = () => {
    setNewItemModal(true);
  };

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
    setNewItemModal(false);
    setNewItemName("");
    setNewItemDescription("");
    setNewItemPrice(0);
    setNewItemCategory("");
    setNewItemImage(null);
    setNewItemImageUrl("");
    setMealAdditions([{ name: "", price: 0 }]);
    setValidationError("");
  };

  const handleDeleteItem = (itemId: string) => {
    removeMenuItem(itemId);
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

  if (!menu.items) return null;
  const categories = Array.from(
    new Set(menu.items.map((item: any) => item.category)),
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Menu Items Manager</h1>
      <div className="grid grid-cols-1 gap-8">
        {categories.map((category) => (
          <Card key={category as string}>
            <CardHeader>
              <CardTitle>{category as string}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table className="align-top">
                <TableHeader>
                  <TableRow>
                    <TableHead className="align-top">Item</TableHead>
                    <TableHead className="align-top">Description</TableHead>
                    <TableHead className="align-top">Price</TableHead>
                    <TableHead className="align-top">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menu.items &&
                    menu.items
                      .filter((item: any) => item.category === category)
                      .map((item: any) => (
                        <TableRow key={item._id}>
                          <TableCell className="font-medium flex items-center space-x-2">
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <span>{item.name}</span>
                          </TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>₪{item.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteItem(item._id)}
                            >
                              <Trash2Icon className="w-4 h-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                            <Button variant="ghost" size="icon">
                              <FilePenIcon className="w-4 h-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="fixed bottom-4 right-4 flex space-x-2">
        <Dialog open={newItemModal} onOpenChange={setNewItemModal}>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={handleAddNewItem}>
              Add Item
            </Button>
          </DialogTrigger>
          <SaveMenuButton />
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
                              handleAdditionChange(
                                index,
                                "name",
                                e.target.value,
                              )
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
              <Button variant="outline" onClick={() => setNewItemModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveNewItem}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

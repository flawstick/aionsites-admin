"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useRestaurantStore } from "@/lib/store/restaurantStore";
import useUpload from "@/lib/hooks/useUpload";
import { Trash2Icon } from "@/components/icons";
import { MoreHorizontal } from "lucide-react";

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
  const [modifiers, setModifiers] = useState([
    {
      name: "",
      required: false,
      multiple: false,
      options: [{ name: "", price: 0 }],
    },
  ]);
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

    for (const modifier of modifiers) {
      if (modifier.name && (!modifier.options || !modifier.options.length)) {
        setValidationError("All modifiers must have at least one option.");
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
      modifiers,
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
    setModifiers([
      {
        name: "",
        required: false,
        multiple: false,
        options: [{ name: "", price: 0 }],
      },
    ]);
    setValidationError("");
  };

  const handleModifierChange = (index: number, field: string, value: any) => {
    const newModifiers: any = [...modifiers];
    newModifiers[index][field] = value;
    setModifiers(newModifiers);
  };

  const handleOptionChange = (
    modifierIndex: number,
    optionIndex: number,
    field: string,
    value: any,
  ) => {
    const newModifiers: any = [...modifiers];
    newModifiers[modifierIndex].options[optionIndex][field] = value;
    setModifiers(newModifiers);
  };

  const handleAddModifier = () => {
    setModifiers([
      ...modifiers,
      {
        name: "",
        required: false,
        multiple: false,
        options: [{ name: "", price: 0 }],
      },
    ]);
  };

  const handleRemoveModifier = (index: number) => {
    const newModifiers = modifiers.filter((_, i) => i !== index);
    setModifiers(newModifiers);
  };

  const handleAddOption = (modifierIndex: number) => {
    const newModifiers: any = [...modifiers];
    newModifiers[modifierIndex].options.push({ name: "", price: 0 });
    setModifiers(newModifiers);
  };

  const handleRemoveOption = (modifierIndex: number, optionIndex: number) => {
    const newModifiers: any = [...modifiers];
    newModifiers[modifierIndex].options = newModifiers[
      modifierIndex
    ].options.filter((_: any, i: any) => i !== optionIndex);
    setModifiers(newModifiers);
  };

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    setNewItemImage(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[70vh]">
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
            <Label>Modifiers</Label>
            {modifiers.map((modifier, modifierIndex) => (
              <div key={modifierIndex} className="border p-2 rounded mb-2">
                <div className="grid gap-1">
                  <Label htmlFor={`modifier-name-${modifierIndex}`}>
                    Modifier Name
                  </Label>
                  <div className="flex flex-row gap-1">
                    <Input
                      id={`modifier-name-${modifierIndex}`}
                      value={modifier.name}
                      onChange={(e) =>
                        handleModifierChange(
                          modifierIndex,
                          "name",
                          e.target.value,
                        )
                      }
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="self-end"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => handleRemoveModifier(modifierIndex)}
                        >
                          <Trash2Icon className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="flex w-full items-center px-2 mt-1 mb-4">
                  <div className="flex flex-row items-center gap-4">
                    <div className="flex items-center my-2">
                      <Checkbox
                        id={`modifier-required-${modifierIndex}`}
                        checked={modifier.required}
                        onCheckedChange={(checked) =>
                          handleModifierChange(
                            modifierIndex,
                            "required",
                            checked,
                          )
                        }
                      />
                      <Label
                        htmlFor={`modifier-required-${modifierIndex}`}
                        className="ml-2"
                      >
                        Required
                      </Label>
                    </div>
                    <div className="flex items-center my-2">
                      <Checkbox
                        id={`modifier-multiple-${modifierIndex}`}
                        checked={modifier.multiple}
                        onCheckedChange={(checked) =>
                          handleModifierChange(
                            modifierIndex,
                            "multiple",
                            checked,
                          )
                        }
                      />
                      <Label
                        htmlFor={`modifier-multiple-${modifierIndex}`}
                        className="ml-2"
                      >
                        Multiple
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="grid gap-1">
                  <Label>Options</Label>
                  {modifier.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center mb-2">
                      <Input
                        value={option.name}
                        onChange={(e) =>
                          handleOptionChange(
                            modifierIndex,
                            optionIndex,
                            "name",
                            e.target.value,
                          )
                        }
                        className="mr-2"
                      />
                      <div className="flex items-center">
                        <span className="mr-2 text-xl mb-2 text-gray-500">
                          ₪
                        </span>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={option.price}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (value >= 0)
                              handleOptionChange(
                                modifierIndex,
                                optionIndex,
                                "price",
                                value,
                              );
                          }}
                          className="mr-2"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleRemoveOption(modifierIndex, optionIndex)
                        }
                      >
                        <Trash2Icon className="w-4 h-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => handleAddOption(modifierIndex)}
                  >
                    Add Option
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={handleAddModifier}>
              Add Modifier
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

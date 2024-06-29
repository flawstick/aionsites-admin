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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2Icon } from "@/components/icons";
import { MoreHorizontal } from "lucide-react";
import { useRestaurantStore } from "@/lib/store/restaurantStore";
import useUpload from "@/lib/hooks/useUpload";

interface ModifierOption {
  name: string;
  price: number;
}

interface Modifier {
  name: string;
  required: boolean;
  multiple: boolean;
  options: ModifierOption[];
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
    modifiers: Modifier[];
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
  const [modifiers, setModifiers] = useState<Modifier[]>([]);
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
      setModifiers(itemData.modifiers || []);
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

  const handleModifierChange = (
    index: number,
    field: string,
    value: string | boolean,
  ) => {
    const newModifiers = [...modifiers];
    newModifiers[index] = { ...newModifiers[index], [field]: value };
    setModifiers(newModifiers);
  };

  const handleOptionChange = (
    modifierIndex: number,
    optionIndex: number,
    field: string,
    value: string | number,
  ) => {
    const newModifiers = [...modifiers];
    newModifiers[modifierIndex].options[optionIndex] = {
      ...newModifiers[modifierIndex].options[optionIndex],
      [field]: value,
    };
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
    const newModifiers = [...modifiers];
    newModifiers[modifierIndex].options.push({ name: "", price: 0 });
    setModifiers(newModifiers);
  };

  const handleRemoveOption = (modifierIndex: number, optionIndex: number) => {
    const newModifiers = [...modifiers];
    newModifiers[modifierIndex].options = newModifiers[
      modifierIndex
    ].options.filter((_, i) => i !== optionIndex);
    setModifiers(newModifiers);
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
        if (uploadError) {
          setValidationError("Failed to upload image.");
          return;
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
      modifiers,
    };

    setSaveLoading(true);
    updateMenuItem(updatedItem as any);
    setSaveLoading(false);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setValidationError("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[70vh]">
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

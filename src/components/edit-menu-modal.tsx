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
import { IconBxShekel } from "./icons";
import ItemModifiers from "./menu/items/modifiers-list";
import { useDirection } from "@/hooks/use-direction";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("item");
  const days = [
    t("days.sunday"),
    t("days.monday"),
    t("days.tuesday"),
    t("days.wednesday"),
    t("days.thursday"),
    t("days.friday"),
    t("days.saturday"),
  ];

  const [name, setName] = useState(item?.name || "");
  const [description, setDescription] = useState(item?.description || "");
  const [price, setPrice] = useState(item?.price.toString() || "");
  const [image, setImage] = useState<File | null>(null);
  const [modifiers, setModifiers] = useState<string[]>(item?.modifiers || []);
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
  const { direction } = useDirection();

  useEffect(() => {
    if (item) {
      setName(item.name || "");
      setDescription(item.description || "");
      setPrice(item.price.toString() || "");
      setImagePreview(item.imageUrl || null);
      setModifiers(item.modifiers || []);
      setSelectedDays(
        item.indexDaysAvailable && item.indexDaysAvailable.length > 0
          ? item.indexDaysAvailable
          : [0, 1, 2, 3, 4, 5, 6],
      );
      setIsSpicy(item.isSpicy || false);
      setIsVegan(item.vegan || false);
      setCategory(item.category || "");
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
      setValidationError(t("validationError"));
      return;
    }

    if (selectedDays.length === 0) {
      setValidationError(t("pleaseSelectDay"));
      return;
    }

    let imageUrl = imagePreview;
    if (image) {
      try {
        imageUrl = (await uploadImage(image)) as string;
        if (!imageUrl) {
          throw new Error(t("failedImageUpload"));
        }
      } catch (error) {
        setValidationError(t("failedImageUpload"));
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
      vegan: isVegan,
      indexDaysAvailable: selectedDays,
      modifiers,
    };

    try {
      if (await editItem(updatedItem)) {
        toast(t("menuItemUpdated"), {
          actionButtonStyle: {
            backgroundColor: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
          },
          action: { label: "OK", onClick: () => {} },
        });
      } else {
        toast(t("failedUpdate"), {
          actionButtonStyle: {
            backgroundColor: "hsl(var(--destructive))",
            color: "hsl(var(--primary-foreground))",
          },
          action: {
            label: t("retry"),
            onClick: () => handleSubmit(e),
          },
        });
      }
      onClose();
    } catch (error) {
      setValidationError(t("failedUpdate"));
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-screen flex flex-col" dir={direction}>
        <div className="mx-auto w-full xl:max-w-[80vw] h-full flex flex-col">
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="px-4 py-4 border-b">
              <h2 className="text-lg font-semibold">{t("editMenuItem")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("updateDetails")}
              </p>
            </div>
            <ScrollArea className="flex-grow px-4" dir={direction}>
              <div className="space-y-6 ltr:pr-2 rtl:pl-2 mx-2 my-4">
                {validationError && (
                  <div className="text-red-500">{validationError}</div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">{t("name")}</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">{t("description")}</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">{t("price")}</Label>
                  <div className="flex flex-row items-center justify-center gap-2">
                    <IconBxShekel className="h-6 w-6 text-primary-foreground" />
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">{t("image")}</Label>
                  <div className="flex items-center gap-2">
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
                      {t("selectImage")}
                    </Button>
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt={t("menuItemPreview")}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 ltr:-right-2 rtl:-left-2 h-6 w-6"
                          onClick={handleRemoveImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("category")}</Label>
                  <Select
                    value={category}
                    onValueChange={setCategory}
                    dir={direction}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectCategory")} />
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
                  <Label>{t("properties")}</Label>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={isSpicy ? "default" : "outline"}
                      onClick={() => setIsSpicy(!isSpicy)}
                    >
                      <Flame
                        className={`h-4 w-4 ${isSpicy ? "text-red-500" : ""}`}
                      />
                      {t("spicy")}
                    </Button>
                    <Button
                      type="button"
                      variant={isVegan ? "default" : "outline"}
                      onClick={() => setIsVegan(!isVegan)}
                    >
                      <Leaf
                        className={`h-4 w-4 ${isVegan ? "text-green-500" : ""}`}
                      />
                      {t("vegan")}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("availableDays")}</Label>
                  <div className="flex flex-wrap gap-2">
                    {days.map((day: string, index: number) => (
                      <Button
                        key={index}
                        type="button"
                        variant={
                          selectedDays.includes(index) ? "default" : "outline"
                        }
                        onClick={() => handleDayChange(index)}
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
                <ItemModifiers item={item} updateItemModifiers={setModifiers} />
              </div>
            </ScrollArea>
            <div className="flex flex-row px-4 py-4 border-t justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={editLoading}>
                {editLoading ? t("updating") : t("updateItem")}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

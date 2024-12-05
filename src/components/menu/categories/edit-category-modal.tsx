import { useState, useEffect, act } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCategories } from "@/lib/hooks/useCategories";
import { useTranslations } from "next-intl";

interface EditCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: { _id: string; name: string; description: string; index: number };
}

export function EditCategoryModal({
  open,
  onOpenChange,
  category,
}: EditCategoryModalProps) {
  const t = useTranslations("category");
  const { editCategory } = useCategories();
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    setFormData({ name: category.name, description: category.description });
  }, [category]);

  useEffect(() => {
    return () => {
      document.body.style.pointerEvents = "auto";
    };
  }, [open]);

  const handleSaveCategory = async () => {
    if (formData.name.trim() === "") {
      toast(t("categoryNameIsRequired"), {
        actionButtonStyle: {
          backgroundColor: "hsl(var(--destructive))",
          color: "hsl(var(--primary-foreground))",
        },
        action: {
          label: t("ok"),
          onClick: () => {},
        },
      });
      return;
    }
    const updatedCategory = { ...category, ...formData };
    if (await editCategory(updatedCategory)) {
      toast(t("categoryUpdatedSuccessfully"), {
        actionButtonStyle: {
          backgroundColor: "hsl(var(--primary))",
          color: "hsl(var(--primary-foreground))",
        },
        action: {
          label: t("yay"),
          onClick: () => {},
        },
      });
    } else {
      toast(t("failedToUpdateCategory"), {
        actionButtonStyle: {
          backgroundColor: "hsl(var(--destructive))",
          color: "hsl(var(--primary-foreground))",
        },

        action: {
          label: t("retry"),
          onClick: () => {
            handleSaveCategory();
          },
        },
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("editCategory")}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveCategory();
          }}
        >
          <div className="flex flex-col">
            <span className="text-sm font-bold mt-2">{t("name")}</span>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder={t("categoryName")}
              required
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold mt-2">{t("description")}</span>
            <Input
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder={t("categoryDescription")}
            />
          </div>
          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button variant="outline">{t("cancel")}</Button>
            </DialogClose>
            <Button type="submit">{t("save")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

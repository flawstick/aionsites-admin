import { useState } from "react";
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
import { useDirection } from "@/hooks/use-direction";
import { useTranslations } from "next-intl";

interface AddCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryAdded: (category: any) => void;
}

export function AddCategoryModal({
  open,
  onOpenChange,
  onCategoryAdded,
}: AddCategoryModalProps) {
  const t = useTranslations("category");
  const { createCategory } = useCategories();
  const { direction } = useDirection();
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleAddCategory = async () => {
    if (formData.name.trim() === "") {
      toast(t("categoryNameIsRequired"));
      return;
    }
    const newCategory = { ...formData, index: 0 }; // Placeholder for index
    if (await createCategory(newCategory)) {
      toast(t("categoryAddedSuccessfully"), {
        actionButtonStyle: {
          backgroundColor: "hsl(var(--primary))",
          color: "hsl(var(--primary-foreground))",
        },

        action: { label: t("yay"), onClick: () => {} },
      });
      onCategoryAdded(newCategory); // Refresh categories in parent component
    } else {
      toast(t("failedToAddCategory"), {
        actionButtonStyle: {
          backgroundColor: "hsl(var(--destructive))",
          color: "hsl(var(--primary-foreground))",
        },
        action: {
          label: t("retry"),
          onClick: () => {
            handleAddCategory();
          },
        },
      });
    }
    onOpenChange(false);
    setFormData({ name: "", description: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir={direction}>
        <DialogHeader>
          <DialogTitle>{t("createCategory")}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddCategory();
          }}
        >
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t("categoryName")}
            required
            className="mt-4"
          />
          <Input
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder={t("categoryDescription")}
            className="mt-2"
          />
          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button variant="outline">{t("cancel")}</Button>
            </DialogClose>
            <Button type="submit">{t("create")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

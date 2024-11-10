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
      toast("Category name is required", {
        actionButtonStyle: {
          backgroundColor: "hsl(var(--destructive))",
          color: "hsl(var(--primary-foreground))",
        },
        action: {
          label: "ok",
          onClick: () => {},
        },
      });
      return;
    }
    const updatedCategory = { ...category, ...formData };
    if (await editCategory(updatedCategory)) {
      toast("Category updated successfully", {
        actionButtonStyle: {
          backgroundColor: "hsl(var(--primary))",
          color: "hsl(var(--primary-foreground))",
        },
        action: {
          label: "yay!",
          onClick: () => {},
        },
      });
    } else {
      toast("Failed to update category", {
        actionButtonStyle: {
          backgroundColor: "hsl(var(--destructive))",
          color: "hsl(var(--primary-foreground))",
        },

        action: {
          label: "Retry",
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
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveCategory();
          }}
        >
          <div className="flex flex-col">
            <span className="text-sm font-bold mt-2">Name</span>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Category name"
              required
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold mt-2">Description</span>
            <Input
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Category description"
            />
          </div>
          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
  const { createCategory } = useCategories();
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleAddCategory = async () => {
    if (formData.name.trim() === "") {
      toast("Category name is required");
      return;
    }
    const newCategory = { ...formData, index: 0 }; // Placeholder for index
    if (await createCategory(newCategory)) {
      toast("Category added successfully", {
        actionButtonStyle: {
          backgroundColor: "hsl(var(--primary))",
          color: "hsl(var(--primary-foreground))",
        },

        action: { label: "yay!", onClick: () => {} },
      });
      onCategoryAdded(newCategory); // Refresh categories in parent component
    } else {
      toast("Failed to add category", {
        actionButtonStyle: {
          backgroundColor: "hsl(var(--destructive))",
          color: "hsl(var(--primary-foreground))",
        },
        action: {
          label: "Retry",
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
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
            placeholder="Category name"
            required
            className="mt-4"
          />
          <Input
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Category description"
            className="mt-2"
          />
          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

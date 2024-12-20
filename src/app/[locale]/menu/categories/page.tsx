"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Toaster as Sonner, toast } from "sonner";
import { useCategories } from "@/lib/hooks/useCategories";

import { AddCategoryModal } from "@/components/menu/categories/add-category-modal";
import { AddCategoryButton } from "@/components/menu/categories/add-category-button";
import { EditCategoryModal } from "@/components/menu/categories/edit-category-modal";

import useMenuStore from "@/lib/store/menuStore";
import { useRestaurantStore } from "@/lib/store/restaurantStore";
import SortableCategoryList from "@/components/menu/categories/sortable-list";
import { arrayMove } from "@dnd-kit/sortable";
import { Category } from "@/types";
import { useDirection } from "@/hooks/use-direction";
import { useTranslations } from "next-intl";

export default function MenuManager() {
  const t = useTranslations("categories");
  const {
    createCategory,
    deleteCategory,
    undoDeleteCategory,
    updateCategoryOrder,
  } = useCategories();
  const { categories, setCategories, fetchCategories } = useMenuStore();
  const { direction } = useDirection();
  const { selectedRestaurant } = useRestaurantStore();

  const [editDialogOpen, setEditDialogOpen] = React.useState<boolean>(false);
  const [addDialogOpen, setAddDialogOpen] = React.useState<boolean>(false);
  const [editCategory, setEditCategory] = React.useState<Category | null>(null);

  React.useEffect(() => {
    if (!selectedRestaurant) return;
    fetchCategories();

    return () => {
      setCategories([]);
    };
  }, [selectedRestaurant]);

  const openEditDialog = (category: Category | null = null) => {
    setEditCategory(category);
    setEditDialogOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (await deleteCategory(categoryId)) {
      toast(t("categoryDeletedSuccessfully"), {
        actionButtonStyle: {
          backgroundColor: "hsl(var(--primary))",
          color: "hsl(var(--primary-foreground))",
        },
        action: {
          label: t("undo"),
          onClick: async () => {
            if (await undoDeleteCategory(categoryId)) {
              toast(t("deletionUndoneSuccessfully"));
            } else {
              toast(t("failedToUndoDeletion"));
            }
          },
        },
      });
    } else {
      toast(t("failedToDeleteCategory"));
    }
  };

  const handleMoveCategory = async (
    index: number,
    direction: "up" | "down",
  ) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const reorderedCategories = arrayMove(categories, index, targetIndex);
    reorderedCategories.forEach((cat, i) => (cat.index = i));
    setCategories(reorderedCategories);

    // Prepare the updated order
    const updatedOrder = reorderedCategories.map((cat) => ({
      _id: cat._id,
      index: cat.index,
    }));

    // Call the function to handle the updated order
    updateCategoryOrder(updatedOrder);
  };

  return (
    <main className="flex w-full mb-4">
      <Card className="w-full shadow-lg" dir={direction}>
        <CardHeader className="flex flex-row items-center justify-between space-y-1">
          <div className="flex flex-col">
            <CardTitle className="text-2xl">
              {t("draggableCategories")}
            </CardTitle>
            <CardDescription>{t("dragCategoriesToReorder")}</CardDescription>
          </div>

          <AddCategoryButton onClick={() => setAddDialogOpen(true)} />
        </CardHeader>
        <CardContent>
          {categories?.length > 0 && (
            <SortableCategoryList
              categories={categories}
              openEditDialog={openEditDialog}
              handleMoveCategory={handleMoveCategory}
              handleDeleteCategory={handleDeleteCategory}
            />
          )}
          <div className="mt-4 space-y-4">
            {editCategory && (
              <EditCategoryModal
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                category={editCategory}
              />
            )}
            {categories.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {t("currentOrder")}:{" "}
                {categories
                  ?.sort((a, b) => a.index - b.index)
                  .map((cat) => cat.name)
                  .join(", ")}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Sonner
        className="toaster group z-50 bottom-20 right-4 fixed"
        toastOptions={{
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            description: "group-[.toast]:text-muted-foreground",
            actionButton:
              "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            cancelButton:
              "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          },
        }}
      />
      <AddCategoryModal
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onCategoryAdded={createCategory}
      />
    </main>
  );
}

"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { MenuSidebar } from "@/components/menu-sidebar";
import { Header } from "@/components/nav";
import AuthProvider from "@/components/auth-provider";

export default function MenuManager() {
  const {
    createCategory,
    deleteCategory,
    undoDeleteCategory,
    updateCategoryOrder,
  } = useCategories();
  const { categories, setCategories, fetchCategories } = useMenuStore();
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
      toast("Category deleted successfully", {
        actionButtonStyle: {
          backgroundColor: "hsl(var(--primary))",
          color: "hsl(var(--primary-foreground))",
        },
        action: {
          label: "Undo",
          onClick: async () => {
            if (await undoDeleteCategory(categoryId)) {
              toast("Deletion undone successfully");
            } else {
              toast("Failed to undo deletion");
            }
          },
        },
      });
    } else {
      toast("Failed to delete category");
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

  let breadcrumbs = [
    { title: "Menu", url: "/menu" },
    { title: "Categories", url: "/menu/categories" },
  ];

  return (
    <AuthProvider>
      <Header>
        <MenuSidebar breadcrumbs={breadcrumbs}>
          <main className="flex w-full">
            <Card className="w-full shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-1">
                <div className="flex flex-col">
                  <CardTitle className="text-2xl">
                    Draggable Categories
                  </CardTitle>
                  <CardDescription>
                    Drag the categories to reorder them
                  </CardDescription>
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
                      Current order:{" "}
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
        </MenuSidebar>
      </Header>
    </AuthProvider>
  );
}

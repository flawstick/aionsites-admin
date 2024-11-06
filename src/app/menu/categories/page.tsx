"use client";

import * as React from "react";
import {
  Edit,
  GripVertical,
  MoreHorizontal,
  MoveUp,
  MoveDown,
  Plus,
  Trash2,
  MoveVertical,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AuthProvider from "@/components/auth-provider";
import { MenuSidebar } from "@/components/menu-sidebar";
import { Header } from "@/components/nav";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Toaster as Sonner, toast } from "sonner";
import { useCategories } from "@/lib/hooks/useCategories";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import useMenuStore from "@/lib/store/menuStore";
import { useRestaurantStore } from "@/lib/store/restaurantStore";

type Category = {
  _id: string;
  name: string;
  description: string;
  index: number;
};

export default function MenuManager() {
  const {
    createCategory,
    editCategory: updateCategory,
    deleteCategory,
    undoDeleteCategory,
  } = useCategories();
  const { categories, setCategories, fetchCategories } = useMenuStore();
  const { selectedRestaurant } = useRestaurantStore();

  const [draggedItem, setDraggedItem] = React.useState<Category | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editCategory, setEditCategory] = React.useState<Category | null>(null);
  const [newCategoryData, setNewCategoryData] = React.useState({
    name: "",
    description: "",
  });

  React.useEffect(() => {
    if (!selectedRestaurant) return;
    fetchCategories();

    return () => {
      setCategories([]);
    };
  }, [selectedRestaurant]);

  React.useEffect(() => {
    document.body.style.pointerEvents = "auto";
    return () => {
      document.body.style.pointerEvents = "auto";
    };
  }, [editDialogOpen]);

  const onDragStart = (
    e: React.DragEvent<HTMLLIElement>,
    category: Category,
  ) => {
    setDraggedItem(category);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", category._id);
  };

  const onDragOver = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.preventDefault();
    if (draggedItem && draggedItem !== categories[index]) {
      setDragOverIndex(index);
    }
  };

  const onDrop = async (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.preventDefault();
    if (draggedItem) {
      const reorderedCategories = categories.filter(
        (cat) => cat._id !== draggedItem._id,
      );
      reorderedCategories.splice(index, 0, draggedItem);
      reorderedCategories.forEach((cat, i) => (cat.index = i));
      setCategories(reorderedCategories);
    }
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleAddCategory = async () => {
    if (newCategoryData.name.trim() === "") return;
    const newCategory = {
      name: newCategoryData.name,
      description: newCategoryData.description,
      index: categories.length,
    };

    if (await createCategory(newCategory)) {
      toast("Category added successfully");
    } else {
      toast("Failed to add category");
    }
    setNewCategoryData({ name: "", description: "" });
    setEditDialogOpen(false);
  };

  const openEditDialog = (category: Category | null = null) => {
    setEditCategory(category);
    setNewCategoryData({
      name: category?.name || "",
      description: category?.description || "",
    });
    setEditDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!editCategory || newCategoryData.name.trim() === "") return;
    const updatedCategory = { ...editCategory, ...newCategoryData };

    if (await updateCategory(updatedCategory)) {
      toast("Category updated successfully");
    } else {
      toast("Failed to update category");
    }
    setEditDialogOpen(false);
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
            if (await undoDeleteCategory(categoryId))
              toast("Deletion undone successfully");
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

    const reorderedCategories = [...categories];
    [reorderedCategories[index], reorderedCategories[targetIndex]] = [
      reorderedCategories[targetIndex],
      reorderedCategories[index],
    ];
    reorderedCategories.forEach((cat, i) => (cat.index = i));
    setCategories(reorderedCategories);
  };

  return (
    <AuthProvider>
      <Header>
        <MenuSidebar
          breadcrumbs={[
            { title: "Menu", url: "/menu/items" },
            { title: "Categories", url: "/menu/items" },
          ]}
        >
          <main className="flex min-h-screen w-full mt-20 mx-auto px-8">
            <ScrollArea className="w-full">
              <Card className="w-full shadow-lg">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">
                    Draggable Categories
                  </CardTitle>
                  <CardDescription>
                    Drag the categories to reorder them
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {categories?.length > 0 && (
                    <ul className="space-y-2">
                      {categories
                        ?.sort((a, b) => a.index - b.index)
                        .map((category, index) => (
                          <li
                            key={category._id}
                            draggable
                            onDragStart={(e) => onDragStart(e, category)}
                            onDragOver={(e) => onDragOver(e, index)}
                            onDrop={(e) => onDrop(e, index)}
                            onDragEnd={() => setDraggedItem(null)}
                            className={`group flex items-center justify-between p-4 rounded-lg bg-background hover:bg-accent/50 cursor-grab active:cursor-grabbing ${
                              dragOverIndex === index
                                ? "border-2 border-dashed border-accent"
                                : ""
                            } ${
                              draggedItem && draggedItem._id === category._id
                                ? "opacity-50"
                                : ""
                            }`}
                          >
                            <div className="flex flex-row justify-center items-center gap-1 mr-4">
                              <h3 className="font-medium">{category.name}</h3>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                  >
                                    <MoreHorizontal className="h-5 w-5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuGroup>
                                    <DropdownMenuItem
                                      onClick={() => openEditDialog(category)}
                                    >
                                      <Edit className="h-4 w-4 mr-2" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSub>
                                      <DropdownMenuSubTrigger>
                                        <MoveVertical className="h-4 w-4 mr-2" />{" "}
                                        Move...
                                      </DropdownMenuSubTrigger>
                                      <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                          <DropdownMenuItem
                                            onClick={() =>
                                              handleMoveCategory(index, "up")
                                            }
                                          >
                                            <MoveUp className="h-4 w-4 mr-2" />{" "}
                                            Move Up
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() =>
                                              handleMoveCategory(index, "down")
                                            }
                                          >
                                            <MoveDown className="h-4 w-4 mr-2" />{" "}
                                            Move Down
                                          </DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                      </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                  </DropdownMenuGroup>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-500"
                                    onClick={() =>
                                      handleDeleteCategory(category._id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted">
                              <GripVertical className="h-5 w-5" />
                            </div>
                          </li>
                        ))}
                    </ul>
                  )}
                  <div className="mt-4 space-y-4">
                    <Dialog
                      open={editDialogOpen}
                      onOpenChange={setEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => openEditDialog()}
                          className="w-full"
                        >
                          <Plus className="mr-2 h-4 w-4" /> Add Category
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {editCategory ? "Edit Category" : "Add Category"}
                          </DialogTitle>
                        </DialogHeader>
                        <Input
                          value={newCategoryData.name}
                          onChange={(e) =>
                            setNewCategoryData({
                              ...newCategoryData,
                              name: e.target.value,
                            })
                          }
                          placeholder="Category name"
                          className="mt-4"
                        />
                        <Input
                          value={newCategoryData.description}
                          onChange={(e) =>
                            setNewCategoryData({
                              ...newCategoryData,
                              description: e.target.value,
                            })
                          }
                          placeholder="Category description"
                          className="mt-2"
                        />
                        <DialogFooter>
                          <Button
                            onClick={
                              editCategory
                                ? handleSaveCategory
                                : handleAddCategory
                            }
                          >
                            {editCategory ? "Save" : "Add"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    {categories.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        Current order:{" "}
                        {categories?.map((cat) => cat.name).join(", ")}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
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
          </main>
        </MenuSidebar>
      </Header>
    </AuthProvider>
  );
}

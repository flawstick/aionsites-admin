"use client";

import * as React from "react";
import {
  Edit,
  GripVertical,
  MoreHorizontal,
  Move,
  MoveDown,
  MoveUp,
  MoveVertical,
  Plus,
  Trash2,
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
import useMenuStore from "@/lib/store/menuStore";
import { useRestaurantStore } from "@/lib/store/restaurantStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

type Category = string;

export default function MenuManager() {
  const { categories, fetchMenuItems, setCategories } = useMenuStore();
  const { selectedRestaurant } = useRestaurantStore();
  const [draggedItem, setDraggedItem] = React.useState<Category | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!selectedRestaurant) return;
    fetchMenuItems();
  }, [selectedRestaurant]);

  const onDragStart = (
    e: React.DragEvent<HTMLLIElement>,
    category: Category,
  ) => {
    setDraggedItem(category);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", category);
  };

  const onDragOver = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.preventDefault();
    if (draggedItem && draggedItem !== categories[index]) {
      setDragOverIndex(index);
    }
  };

  const onDragLeave = () => {
    setDragOverIndex(null);
  };

  const onDrop = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.preventDefault();
    if (draggedItem) {
      const newCategories = categories.filter((cat) => cat !== draggedItem);
      newCategories.splice(index, 0, draggedItem);
      setCategories(newCategories);
    }
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const onDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const addCategory = () => {
    const newCategory: Category = "New Category";
    setCategories([...categories, newCategory]);
  };

  const breadCrumbsPath = [
    { title: "Menu", url: "/menu/items" },
    { title: "Categories", url: "/menu/items" },
  ];

  return (
    <AuthProvider>
      <Header>
        <MenuSidebar breadcrumbs={breadCrumbsPath}>
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
                  <ul className="space-y-2">
                    {categories.map((category, index) => (
                      <li
                        key={category}
                        draggable
                        onDragStart={(e) => onDragStart(e, category)}
                        onDragOver={(e) => onDragOver(e, index)}
                        onDragLeave={onDragLeave}
                        onDrop={(e) => onDrop(e, index)}
                        onDragEnd={onDragEnd}
                        className={`group flex items-center justify-between p-4 rounded-lg bg-background hover:bg-accent/50 cursor-grab active:cursor-grabbing ${
                          dragOverIndex === index
                            ? "border-2 border-dashed border-accent"
                            : ""
                        } ${
                          draggedItem && draggedItem === category
                            ? "opacity-50"
                            : ""
                        }`}
                      >
                        <div className="flex flex-row justify-center items-center gap-1 mr-4">
                          <h3 className="font-medium">{category}</h3>
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
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSub>
                                  <DropdownMenuSubTrigger>
                                    <MoveVertical className="h-4 w-4 mr-2" />
                                    Move...
                                  </DropdownMenuSubTrigger>
                                  <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                      <DropdownMenuItem>
                                        <MoveUp className="h-4 w-4 mr-2" />
                                        Up
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <MoveDown className="h-4 w-4 mr-2" />
                                        Down
                                      </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                  </DropdownMenuPortal>
                                </DropdownMenuSub>
                              </DropdownMenuGroup>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-500">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
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
                  <div className="mt-4 space-y-4">
                    <Button onClick={addCategory} className="w-full">
                      <Plus className="mr-2 h-4 w-4" /> Add Category
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      Current order: {categories.map((cat) => cat).join(", ")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          </main>
        </MenuSidebar>
      </Header>
    </AuthProvider>
  );
}

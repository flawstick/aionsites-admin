"use client";

import * as React from "react";
import { GripVertical, Plus } from "lucide-react";
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

interface Category {
  id: string;
  name: string;
  description: string;
}

const initialCategories: Category[] = [
  { id: "cat1", name: "Electronics", description: "Gadgets and devices" },
  { id: "cat2", name: "Clothing", description: "Apparel and accessories" },
  { id: "cat3", name: "Books", description: "Literature and textbooks" },
  { id: "cat4", name: "Home & Garden", description: "Furniture and decor" },
  { id: "cat5", name: "Sports", description: "Athletic equipment" },
];

export default function MenuManager() {
  const [categories, setCategories] = React.useState(initialCategories);
  const [draggedItem, setDraggedItem] = React.useState<Category | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);

  const onDragStart = (
    e: React.DragEvent<HTMLLIElement>,
    category: Category,
  ) => {
    setDraggedItem(category);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", category.id);
  };

  const onDragOver = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.preventDefault();
    if (draggedItem && draggedItem.id !== categories[index].id) {
      setDragOverIndex(index);
    }
  };

  const onDragLeave = () => {
    setDragOverIndex(null);
  };

  const onDrop = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.preventDefault();
    if (draggedItem) {
      const newCategories = categories.filter(
        (cat) => cat.id !== draggedItem.id,
      );
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
    const newCategory: Category = {
      id: `cat${categories.length + 1}`,
      name: `New Category ${categories.length + 1}`,
      description: "Description pending",
    };
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
                        key={category.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, category)}
                        onDragOver={(e) => onDragOver(e, index)}
                        onDragLeave={onDragLeave}
                        onDrop={(e) => onDrop(e, index)}
                        onDragEnd={onDragEnd}
                        className={`flex items-center justify-between p-4 rounded-lg bg-background hover:bg-accent/50 cursor-grab active:cursor-grabbing ${
                          dragOverIndex === index
                            ? "border-2 border-dashed border-accent"
                            : ""
                        } ${
                          draggedItem && draggedItem.id === category.id
                            ? "opacity-50"
                            : ""
                        }`}
                      >
                        <div className="flex-1 mr-4">
                          <h3 className="font-medium">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {19} items
                          </p>
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
                      Current order:{" "}
                      {categories.map((cat) => cat.name).join(", ")}
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

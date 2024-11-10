"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Header } from "@/components/nav";
import AuthProvider from "@/components/auth-provider";
import { MenuSidebar } from "@/components/menu-sidebar";
import { CreateModifierDrawer } from "@/components/menu/modifiers/add-modifier-drawer";
import useMenuStore, { MenuItem, Modifier } from "@/lib/store/menuStore";
import { useRestaurantStore } from "@/lib/store/restaurantStore";
import { EditModifierDrawer } from "@/components/menu/modifiers/edit-modifier-drawer";
import { useModifiers } from "@/lib/hooks/useModifiers";
import { Toaster as Sonner, toast } from "sonner";
import { AddModifierButton } from "@/components/menu/modifiers/add-modifier-button";
import { DeleteModifier } from "@/components/menu/modifiers/detele-modifier";

// Constants
const MAX_ENTRIES = 20;

interface Category {
  name: string;
  items: MenuItem[];
}

function ModifierManagement() {
  const [activeTab, setActiveTab] = useState<"categories" | "all">(
    "categories",
  );
  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedModifier, setSelectedModifier] = useState<Modifier | null>(
    null,
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const items = useMenuStore((state) => state.menuItems);
  let { modifiers, fetchMenuItems, fetchModifiers } = useMenuStore();
  const { createModifier, deleteModifier, undoDeleteModifier } = useModifiers();
  const { selectedRestaurant } = useRestaurantStore();

  // Fetch data on mount
  useEffect(() => {
    if (!selectedRestaurant) return;
    fetchMenuItems();
    fetchModifiers();
  }, [selectedRestaurant]);

  // Categorize items
  useEffect(() => {
    const categoryMap: { [key: string]: MenuItem[] } = {};
    items.forEach((item) => {
      const category = item.category || "Uncategorized";
      if (!categoryMap[category]) {
        categoryMap[category] = [];
      }
      categoryMap[category].push(item);
    });
    setCategories(
      Object.keys(categoryMap).map((name) => ({
        name,
        items: categoryMap[name],
      })),
    );
  }, [items]);

  const handleRowClick = (modifier: Modifier) => {};

  const handleEditModifier = (modifier: Modifier) => {
    setSelectedModifier(modifier);
    setEditOpen(true);
  };

  const handleDeleteModifier = (modifier: Modifier) => {
    setSelectedModifier(modifier);
    setDeleteOpen(true);
  };
  const handleDuplicateModifier = async (modifier: Modifier) => {
    if (await createModifier(modifier))
      toast(`Duplicated ${modifier.name} successfully`);
    else toast(`Failed to duplicate ${modifier.name}`);
  };

  const getModifiersForItem = (itemId: string) => {
    if (!modifiers) return [];

    return modifiers
      .filter((modifier) => modifier.options.some((opt) => opt.name === itemId))
      .slice(0, MAX_ENTRIES);
  };

  const getItemsForModifier = (modifier: Modifier, category: Category) => {
    return category.items
      .filter((item) => modifier.options.some((opt) => opt.name === item._id))
      .map((item) => item.name)
      .join(", ");
  };

  return (
    <main className="flex flex-col min-h-screen w-full mx-auto">
      <h1 className="mt-12 text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        Modifier Management
      </h1>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "categories" | "all")}
        className="mb-4 sm:mb-6 "
      >
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="categories">By Category</TabsTrigger>
            <TabsTrigger value="all">All Modifiers</TabsTrigger>
          </TabsList>
          <AddModifierButton onClick={() => setOpen(true)} />
        </div>

        <TabsContent value="categories">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {categories?.map((category, index) => (
              <AccordionItem value={`category-${index}`} key={index}>
                <AccordionTrigger>{category.name}</AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardHeader>
                      <CardTitle>Modifiers in {category.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Modifier Name</TableHead>
                            <TableHead className="hidden sm:table-cell">
                              Options
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                              Assigned Items
                            </TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getModifiersForItem(category.name).map(
                            (modifier) => (
                              <TableRow
                                key={modifier._id}
                                onClick={() => handleRowClick(modifier)}
                                className="cursor-pointer"
                              >
                                <TableCell>{modifier.name}</TableCell>
                                <TableCell className="hidden sm:table-cell">
                                  {modifier.options
                                    .map((opt) => opt.name)
                                    .join(", ")}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {getItemsForModifier(modifier, category)}
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                      >
                                        <span className="sr-only">
                                          Open menu
                                        </span>
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>
                                        Actions
                                      </DropdownMenuLabel>
                                      <DropdownMenuItem
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditModifier(modifier);
                                        }}
                                      >
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDuplicateModifier(modifier);
                                        }}
                                      >
                                        Duplicate
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteModifier(modifier);
                                        }}
                                        className="text-red-600"
                                      >
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ),
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Modifiers</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Modifier Name</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Options
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Assigned Items
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Categories
                    </TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modifiers?.slice(0, MAX_ENTRIES).map((modifier) => {
                    const assignedItems = items.filter((item) =>
                      modifier.options.some((opt) => opt.name === item._id),
                    );
                    const assignedCategories = [
                      // @ts-ignore
                      ...new Set(
                        assignedItems.map(
                          (item) => item.category || "Uncategorized",
                        ),
                      ),
                    ];
                    return (
                      <TableRow
                        key={modifier._id}
                        onClick={() => handleRowClick(modifier)}
                        className="cursor-pointer"
                      >
                        <TableCell>{modifier.name}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {modifier.options.map((opt) => opt.name).join(", ")}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {assignedItems.map((item) => item.name).join(", ")}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {assignedCategories.join(", ")}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditModifier(modifier);
                                }}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDuplicateModifier(modifier);
                                }}
                              >
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteModifier(modifier);
                                }}
                                className="text-red-600"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateModifierDrawer open={open} onOpenChange={setOpen} />
      <EditModifierDrawer
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) {
            setSelectedModifier(null);
          }
        }}
        modifierData={selectedModifier as any}
      />
      <DeleteModifier
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
        }}
        handleDelete={deleteModifier}
        handleUndo={undoDeleteModifier as any}
        modifierId={selectedModifier?._id as any}
      />
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
  );
}

const breadCrumbsPath = [
  { title: "Menu", url: "/menu/items" },
  { title: "Modifiers", url: "/menu/modifiers" },
];

export default function Page() {
  return (
    <AuthProvider>
      <Header>
        <MenuSidebar breadcrumbs={breadCrumbsPath}>
          <ModifierManagement />
        </MenuSidebar>
      </Header>
    </AuthProvider>
  );
}

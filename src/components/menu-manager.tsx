"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2Icon, FilePenIcon, RefreshIcon } from "./icons";
import { useRestaurantStore } from "@/lib/store/restaurantStore";
import { SaveMenuButton } from "./save-menu-button";
import useAuth from "@/lib/hooks/useAuth";
import AddItemModal from "./add-menu-modal";
import EditMenuModal from "./edit-menu-modal";

export default function MenuManager() {
  const { session }: any = useAuth();
  const { menu, removeMenuItem, fetchMenu, loadFromCache } =
    useRestaurantStore();

  // Add item modal state
  const [newItemModal, setNewItemModal] = useState(false);

  // Edit item modal state
  const [editItemModal, setEditItemModal] = useState(false);
  const [editItemData, setEditItemData] = useState<any>(null);

  // Animation keuframer
  const [isSpinning, setSpinning] = useState(false);

  useEffect(() => {
    if (session) fetchMenu(session.jwt);
  }, []);

  useEffect(() => {
    loadFromCache();
  }, [session, fetchMenu, loadFromCache]);

  const handleAddNewItem = () => {
    setNewItemModal(true);
  };

  const handleEditItem = (item: any) => {
    setEditItemData(item);
    setEditItemModal(true);
  };

  const handleSaveEditedItem = async (updatedItem: any) => {
    // Implement the save logic here
  };

  const handleDeleteItem = (itemId: string) => {
    removeMenuItem(itemId);
  };

  const refreshMenu = () => {
    setSpinning(true);
    fetchMenu(session.jwt);
    setTimeout(() => setSpinning(false), 500);
  };

  if (!menu.items) return null;
  const categories = Array.from(
    new Set(menu.items.map((item: any) => item.category)),
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-8">Menu Items Manager</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                size="icon"
                variant="ghost"
                onClick={refreshMenu}
                className={`${isSpinning ? "animate-spin" : ""}`}
              >
                <RefreshIcon className="w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="grid grid-cols-1 gap-8">
        {categories.map((category) => (
          <Card key={category as string}>
            <CardHeader>
              <CardTitle>{category as string}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table className="align-top">
                <TableHeader>
                  <TableRow>
                    <TableHead className="align-top">Item</TableHead>
                    <TableHead className="align-top">Description</TableHead>
                    <TableHead className="align-top">Price</TableHead>
                    <TableHead className="align-top">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menu.items &&
                    menu.items
                      .filter((item: any) => item.category === category)
                      .map((item: any) => (
                        <TableRow key={item._id}>
                          <TableCell className="font-medium flex items-center space-x-2">
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <span>{item.name}</span>
                          </TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>₪{item.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <Trash2Icon className="w-4 h-4" />
                                        <span className="sr-only">Delete</span>
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. This
                                          will permanently delete your account
                                          and remove your data from our servers.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleDeleteItem(item._id)
                                          }
                                        >
                                          Continue
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </TooltipTrigger>
                                <TooltipContent>Delete</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditItem(item)}
                                  >
                                    <FilePenIcon className="w-4 h-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
      <EditMenuModal
        isOpen={editItemModal}
        onClose={() => setEditItemModal(false)}
        itemData={editItemData}
        onSave={handleSaveEditedItem}
      />
      <AddItemModal
        isOpen={newItemModal}
        onClose={() => setNewItemModal(false)}
      />
      <div className="fixed bottom-4 right-4 flex space-x-2">
        <Button variant="outline" onClick={handleAddNewItem}>
          Add Item
        </Button>
        <SaveMenuButton />
      </div>
    </div>
  );
}

"use client";

import React, { useState, useCallback } from "react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Trash2Icon, FilePenIcon, RefreshIcon } from "./icons";
import { SaveMenuButton } from "./save-menu-button";
import AddItemModal from "./add-menu-modal";
import EditMenuModal from "./edit-menu-modal";
import useMenuStore from "@/lib/store/menuStore";
import { useItems } from "@/lib/hooks/useItems";
import { RefreshCcw, RefreshCwIcon } from "lucide-react";
import { AddItemButton } from "./menu/items/add-item-button";
import { toast, Toaster as Sonner } from "sonner";

type MenuItem = any;

export default function MenuManager() {
  const { fetchMenuItems, menuItems, categories } = useMenuStore();
  const { deleteItem, undoDeleteItem } = useItems();

  // Modal state
  const [modalState, setModalState] = useState<{
    newItem: boolean;
    editItem: boolean;
    editItemData: MenuItem | null;
  }>({
    newItem: false,
    editItem: false,
    editItemData: null,
  });

  // Animation state
  const [isSpinning, setSpinning] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleAddNewItem = () => {
    setModalState((prev) => ({ ...prev, newItem: true }));
  };

  const handleEditItem = useCallback((item: MenuItem) => {
    setModalState({ newItem: false, editItem: true, editItemData: item });
  }, []);

  const handleDeleteItem = useCallback(
    async (itemId: string) => {
      if (await deleteItem(itemId)) {
        toast("Item deleted successfully", {
          actionButtonStyle: {
            backgroundColor: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
          },
          action: {
            label: "Undo",
            onClick: () => {
              undoDeleteItem(itemId);
            },
          },
        });
      } else {
        toast("Failed to delete item", {
          actionButtonStyle: {
            backgroundColor: "hsl(var(--destructive))",
            color: "hsl(var(--primary-foreground))",
          },
          action: { label: "Retry", onClick: () => handleDeleteItem(itemId) },
        });
      }
    },
    [deleteItem],
  );

  const refreshMenu = () => {
    setSpinning(true);
    fetchMenuItems();
    setTimeout(() => setSpinning(false), 500);
  };

  if (!menuItems) return null;

  // Component for rendering individual item rows
  const ItemRow = ({ item }: { item: MenuItem }) => (
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2Icon className="w-4 h-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TooltipTrigger>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this item.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteItem(item._id)}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
  );

  // Component for rendering tables of items
  const ItemTable = ({
    categoryName,
    items,
  }: {
    categoryName: string;
    items: MenuItem[];
  }) => (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{categoryName}</CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto">
        <Table className="align-top min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="align-top w-1/4">Item</TableHead>
              <TableHead className="align-top w-1/2">Description</TableHead>
              <TableHead className="align-top w-1/8">Price</TableHead>
              <TableHead className="align-top w-1/8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <ItemRow key={item._id} item={item} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  // Group items by category
  const categorizedItems = categories.map((category) => ({
    category,
    items: menuItems.filter((item) => item.category === category._id),
  }));

  // Uncategorized items
  const uncategorizedItems = menuItems.filter((item) =>
    categories.every((cat) => cat._id !== item.category),
  );

  // Pagination logic for all items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = menuItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(menuItems.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Render pagination items using ShadCN UI components
  const renderPaginationItems = () => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 5;

    if (totalPages <= maxPageNumbersToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }

    return pageNumbers.map((pageNumber, index) => {
      if (pageNumber === "...") {
        return (
          <PaginationItem key={`ellipsis-${index}`}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        return (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              href="#"
              isActive={currentPage === pageNumber}
              onClick={() => paginate(pageNumber as number)}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        );
      }
    });
  };

  return (
    <div className="container mx-auto pb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Menu Items Manager</h1>
      </div>

      <Tabs defaultValue="all">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" onClick={refreshMenu}>
                    <RefreshCwIcon
                      className={`${isSpinning ? "animate-spin" : ""} w-6 h-6`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Refresh</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <AddItemButton onClick={handleAddNewItem} />
          </div>
        </div>

        {/* Categorized Items Tab */}
        <TabsContent value="categories">
          <div className="grid grid-cols-1 gap-8 mt-4">
            {categorizedItems.map(({ category, items }) => (
              <ItemTable
                key={category._id}
                categoryName={category.name}
                items={items}
              />
            ))}
            {uncategorizedItems.length > 0 && (
              <ItemTable
                categoryName="Uncategorized"
                items={uncategorizedItems}
              />
            )}
          </div>
        </TabsContent>

        {/* All Items Tab with Pagination */}
        <TabsContent value="all">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>All Items</CardTitle>
            </CardHeader>
            <CardContent className="overflow-auto">
              <Table className="align-top min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="align-top w-1/4">Item</TableHead>
                    <TableHead className="align-top w-1/2">
                      Description
                    </TableHead>
                    <TableHead className="align-top w-1/8">Price</TableHead>
                    <TableHead className="align-top w-1/8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((item) => (
                    <ItemRow key={item._id} item={item} />
                  ))}
                </TableBody>
              </Table>
              {/* Pagination Component */}
              <div className="mt-4 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    {/* Previous Button */}
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          currentPage > 1 && paginate(currentPage - 1)
                        }
                        href="#"
                      />
                    </PaginationItem>

                    {/* Page Numbers */}
                    {renderPaginationItems()}

                    {/* Next Button */}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          currentPage < totalPages && paginate(currentPage + 1)
                        }
                        href="#"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <EditMenuModal
        isOpen={modalState.editItem}
        onClose={() =>
          setModalState((prev) => ({
            ...prev,
            editItem: false,
            editItemData: null,
          }))
        }
        item={modalState.editItemData}
      />
      <AddItemModal
        isOpen={modalState.newItem}
        onClose={() => setModalState((prev) => ({ ...prev, newItem: false }))}
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
    </div>
  );
}

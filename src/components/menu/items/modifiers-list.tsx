"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  KeyboardSensor,
  MeasuringStrategy,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  GripVertical,
  Check,
  X,
  ChevronRight,
  Flame,
  MoreHorizontal,
  Trash2Icon,
} from "lucide-react";
import useMenuStore from "@/lib/store/menuStore";
import { AddModifiersDialog } from "./add-item-modifiers-button";
import { Modifier } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { IconBxShekel } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ItemModifiersProps {
  item: any;
  updateItemModifiers: (modifiers: any[]) => void;
}

interface SortableItemProps {
  id: string;
  modifier: Modifier;
  removeItem: (id: string) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  modifier,
  removeItem,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
  };

  return (
    <Dialog>
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center w-full p-4 mb-3 bg-muted border rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all duration-300 group"
      >
        <div
          className="mr-3 w-8 flex justify-center items-center py-2 rounded-full hover:bg-gray-500/20 transition-colors duration-200 cursor-move"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="text-primary-foreground transition-colors duration-300" />
        </div>
        <div className="flex-grow">
          <span className="flex items-center justify-start font-semibold text-lg text-primary-foreground gap-1">
            {modifier.name}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-all duration-300 "
                >
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={() => removeItem(id)}
                  >
                    <Trash2Icon className="w-4 h-4 mr-1" />
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </span>
        </div>
        <Badge
          variant={modifier.required ? "default" : "secondary"}
          className="mr-2"
        >
          {modifier.required ? "Required" : "Optional"}
        </Badge>
        <DialogTrigger asChild>
          <div className="flex items-center justify-center border bg-background rounded-lg p-1 cursor-pointer">
            <ChevronRight className="text-primary-foreground/70 group-hover:text-primary-foreground transition-colors duration-300" />
          </div>
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">
            {modifier.name}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6 space-y-6">
          <div className="flex flex-wrap gap-3">
            <Badge
              variant={modifier.required ? "default" : "secondary"}
              className="text-sm px-3 py-1"
            >
              {modifier.required ? "Required" : "Optional"}
            </Badge>
            <Badge
              variant={modifier.multiple ? "default" : "secondary"}
              className="text-sm px-3 py-1"
            >
              {modifier.multiple ? "Multiple" : "Single"}
            </Badge>
            {modifier.max !== undefined && (
              <Badge variant="outline" className="text-sm px-3 py-1">
                Max: {modifier.max}
              </Badge>
            )}
          </div>
          {modifier.indexDaysAvailable && (
            <div>
              <Label className="block mb-2 text-sm font-medium text-primary-foreground/50">
                Available Days
              </Label>
              <div className="flex flex-wrap gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day, index) => (
                    <Badge
                      key={day}
                      variant={
                        modifier.indexDaysAvailable?.includes(index)
                          ? "default"
                          : "secondary"
                      }
                      className="px-3 py-1 text-xs font-medium"
                    >
                      {day}
                    </Badge>
                  ),
                )}
              </div>
            </div>
          )}
          <Separator className="my-6" />
          <div>
            <Label className="block mb-4 text-xl font-semibold">Options</Label>
            <ScrollArea className="h-[350px] pr-4">
              <div className="space-y-4">
                {modifier.options.map((option, index) => (
                  <div
                    key={index}
                    className="p-5 bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-semibold">
                        {option.name}
                      </span>
                      <Badge variant="outline" className="px-3 py-1">
                        <IconBxShekel className="w-4 h-4 mr-1" />
                        {option.price.toFixed(2)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {option.multiple !== undefined && (
                        <div className="flex items-center">
                          <Label className="mr-2">Multiple:</Label>
                          {option.multiple ? (
                            <Check className="w-5 h-5 text-green-500" />
                          ) : (
                            <X className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      )}
                      {option.max !== undefined && (
                        <div className="flex items-center">
                          <Label className="mr-2">Max:</Label>
                          <span className="font-medium">{option.max}</span>
                        </div>
                      )}
                      {option.vegan !== undefined && (
                        <div className="flex items-center">
                          <Label className="mr-2">Vegan:</Label>
                          {option.vegan ? (
                            <Check className="w-5 h-5 text-green-500" />
                          ) : (
                            <X className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      )}
                      {option.isSpicy !== undefined && (
                        <div className="flex items-center">
                          <Label className="mr-2 text-gray-600">Spicy:</Label>
                          {option.isSpicy ? (
                            <Flame className="w-5 h-5 text-red-500" />
                          ) : (
                            <X className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      )}
                      {option.spiceLevel !== undefined && (
                        <div className="flex items-center">
                          <Label className="mr-2">Spice Level:</Label>
                          <div className="flex">
                            {Array.from({ length: option.spiceLevel }).map(
                              (_, i) => (
                                <Flame
                                  key={i}
                                  className="w-4 h-4 text-red-500"
                                />
                              ),
                            )}
                          </div>
                        </div>
                      )}
                      {option.indexDaysAvailable && (
                        <div className="col-span-2">
                          <Separator className="w-full my-4" />
                          <Label className="mr-2 text-primary-foreground/50">
                            Days Available:
                          </Label>
                          <span className="font-medium">
                            {option.indexDaysAvailable
                              ?.map(
                                (day) =>
                                  [
                                    "Sun",
                                    "Mon",
                                    "Tue",
                                    "Wed",
                                    "Thu",
                                    "Fri",
                                    "Sat",
                                  ][day],
                              )
                              .join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ItemModifiers: React.FC<ItemModifiersProps> = ({
  item,
  updateItemModifiers,
}) => {
  const { modifiers: allModifiers } = useMenuStore();

  const [modifiers, setModifiers] = useState<Modifier[]>(() => {
    if (item?.modifiers && allModifiers.length > 0) {
      return allModifiers.filter((mod: Modifier) =>
        item.modifiers.includes(mod._id),
      );
    } else {
      return [];
    }
  });

  const handleRemoveItem = (modifierId: string) => {
    setModifiers((prevModifiers) =>
      prevModifiers.filter((mod) => mod._id !== modifierId),
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && over?.id) {
      setModifiers((prevModifiers) => {
        const oldIndex = prevModifiers.findIndex(
          (mod) => mod._id === active.id,
        );
        const newIndex = prevModifiers.findIndex((mod) => mod._id === over.id);

        const newModifiers = arrayMove(prevModifiers, oldIndex, newIndex);

        // Update the item's modifiers with the new order
        updateItemModifiers(newModifiers.map((mod) => mod._id));

        return newModifiers;
      });
    }
  };

  const handleModifiersUpdate = (newModifierIds: string[]) => {
    const updatedModifiers = allModifiers.filter((mod) =>
      newModifierIds.includes(mod._id),
    );
    setModifiers(updatedModifiers);

    // Update the item's modifiers with the new list
    updateItemModifiers(updatedModifiers.map((mod) => mod._id));
  };

  return (
    <div className="flex flex-col items-center">
      <Separator className="w-full my-4" />
      <div className="flex items-center justify-between w-full mt-4">
        <span className="flex-grow text-md font-semibold text-primary-foreground">
          Item Modifiers
        </span>
        <AddModifiersDialog
          availableModifiers={allModifiers}
          selectedModifierIds={modifiers.map((mod) => mod._id)}
          onSave={handleModifiersUpdate}
        />
      </div>
      <Card className="w-full p-8 mx-auto bg-card rounded-xl shadow-lg">
        <CardContent className="w-full">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            measuring={{
              droppable: {
                strategy: MeasuringStrategy.Always,
              },
            }}
          >
            <SortableContext
              items={modifiers.map((mod) => mod._id)}
              strategy={verticalListSortingStrategy}
            >
              {modifiers.map((modifier) => (
                <SortableItem
                  key={modifier._id}
                  id={modifier._id}
                  modifier={modifier}
                  removeItem={handleRemoveItem}
                />
              ))}
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemModifiers;

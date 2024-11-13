"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
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
  DollarSign,
  Flame,
} from "lucide-react";
import useMenuStore from "@/lib/store/menuStore";
import { AddModifiersDialog } from "./add-item-modifiers-button";
import { Modifier } from "@/types";
import { useItems } from "@/lib/hooks/useItems";
import { Card, CardContent } from "@/components/ui/card";

interface ItemModifiersProps {
  item: any;
}

const SortableItem = ({ id, modifier }: { id: string; modifier: Modifier }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          className="flex flex-row bg-muted w-full border rounded-lg p-4 mb-3 cursor-move shadow-sm hover:shadow-md transition-all duration-300 flex items-center group"
        >
          <GripVertical className="mr-3 text-primary-foreground group-hover:text-primary-foreground/80 transition-colors duration-300" />
          <span className="flex-grow font-medium text-primary-foreground">
            {modifier.name}
          </span>
          <Badge
            variant={modifier.required ? "default" : "secondary"}
            className="mr-2"
          >
            {modifier.required ? "Required" : "Optional"}
          </Badge>
          <ChevronRight className="text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
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
              <Label className="text-sm font-medium text-gray-500 mb-2 block">
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
            <Label className="text-xl font-semibold text-gray-800 mb-4 block">
              Options
            </Label>
            <ScrollArea className="h-[350px] pr-4">
              <div className="space-y-4">
                {modifier.options.map((option, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold text-lg text-gray-800">
                        {option.name}
                      </span>
                      <Badge variant="outline" className="px-3 py-1">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {option.price.toFixed(2)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {option.multiple !== undefined && (
                        <div className="flex items-center">
                          <Label className="mr-2 text-gray-600">
                            Multiple:
                          </Label>
                          {option.multiple ? (
                            <Check className="text-green-500 w-5 h-5" />
                          ) : (
                            <X className="text-red-500 w-5 h-5" />
                          )}
                        </div>
                      )}
                      {option.max !== undefined && (
                        <div className="flex items-center">
                          <Label className="mr-2 text-gray-600">Max:</Label>
                          <span className="font-medium">{option.max}</span>
                        </div>
                      )}
                      {option.vegan !== undefined && (
                        <div className="flex items-center">
                          <Label className="mr-2 text-gray-600">Vegan:</Label>
                          {option.vegan ? (
                            <Check className="text-green-500 w-5 h-5" />
                          ) : (
                            <X className="text-red-500 w-5 h-5" />
                          )}
                        </div>
                      )}
                      {option.isSpicy !== undefined && (
                        <div className="flex items-center">
                          <Label className="mr-2 text-gray-600">Spicy:</Label>
                          {option.isSpicy ? (
                            <Flame className="text-red-500 w-5 h-5" />
                          ) : (
                            <X className="text-red-500 w-5 h-5" />
                          )}
                        </div>
                      )}
                      {option.spiceLevel !== undefined && (
                        <div className="flex items-center">
                          <Label className="mr-2 text-gray-600">
                            Spice Level:
                          </Label>
                          <div className="flex">
                            {[...Array(option.spiceLevel)].map((_, i) => (
                              <Flame key={i} className="text-red-500 w-4 h-4" />
                            ))}
                          </div>
                        </div>
                      )}
                      {option.indexDaysAvailable && (
                        <div className="col-span-2">
                          <Label className="mr-2 text-gray-600">
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

const ItemModifiers: React.FC<ItemModifiersProps> = ({ item }) => {
  const { modifiers: allModifiers } = useMenuStore();
  const { updateModifiers: updateItemModifiers } = useItems();
  const [filteredModifiers, setFilteredModifiers] = useState<any[]>([]);

  useEffect(() => {
    const relevantModifiers = allModifiers.filter(
      (mod: any) => item?.modifiers.includes(mod._id),
    );
    setFilteredModifiers(relevantModifiers as any);
  }, [allModifiers, item?.modifiers]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setFilteredModifiers((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Update the item.modifiers order based on the new order
        updateItemModifiers(newItems.map((mod) => mod._id));

        return newItems;
      });
    }
  };

  const handleModifiersUpdate = (newModifierIds: string[]) => {
    const updatedModifiers = allModifiers.filter((mod) =>
      newModifierIds.includes(mod._id),
    );
    setFilteredModifiers(updatedModifiers);

    // Update the item.modifiers with the new list
    updateItemModifiers(updatedModifiers.map((mod) => mod._id));
  };

  return (
    <div className="flex flex-col items-center space-x-2">
      <Separator className="w-full my-4" />
      <div className="flex flex-row w-full items-center justify-between mt-4">
        <span className="flex-grow font-semibold text-md text-primary-foreground">
          Item Modifiers
        </span>
        <AddModifiersDialog
          availableModifiers={allModifiers as any}
          selectedModifierIds={filteredModifiers.map((mod) => mod._id)}
          onSave={handleModifiersUpdate}
        />
      </div>
      <Card className="flex w-full mx-auto p-8 bg-card rounded-xl shadow-lg">
        <CardContent className="flex w-full">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredModifiers.map((m) => m._id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredModifiers.map((modifier) => (
                <SortableItem
                  key={modifier._id}
                  id={modifier._id}
                  modifier={modifier}
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

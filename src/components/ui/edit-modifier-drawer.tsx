"use client";

import { useState } from "react";
import { Plus, Trash2, Hash, Flame, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Toaster as Sonner } from "sonner";
import { toast } from "sonner";

interface EditModifierDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modifierData: IModifier; // Preloaded data for the modifier being edited
  onSave: (updatedModifier: IModifier) => void;
}

export function EditModifierDrawer({
  open,
  onOpenChange,
  modifierData,
  onSave,
}: EditModifierDrawerProps) {
  const [modifier, setModifier] = useState<IModifier>(modifierData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setModifier((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setModifier((prev) => ({ ...prev, [name]: checked }));
  };

  const addOption = () => {
    setModifier((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        {
          name: "",
          price: 0,
          indexDaysAvailable: ALL_DAYS,
          isSpicy: false,
          vegan: false,
        },
      ],
    }));
  };

  const removeOption = (index: number) => {
    setModifier((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleOptionChange = (
    index: number,
    field: keyof IAddition,
    value: any,
  ) => {
    setModifier((prev) => ({
      ...prev,
      options: prev.options.map((option, i) =>
        i === index ? { ...option, [field]: value } : option,
      ),
    }));
  };

  const handleDayToggle = (index: number | null, day: number) => {
    if (index === null) {
      setModifier((prev) => {
        const newDays = prev.indexDaysAvailable.includes(day)
          ? prev.indexDaysAvailable.filter((d) => d !== day)
          : [...prev.indexDaysAvailable, day];
        return { ...prev, indexDaysAvailable: newDays };
      });
    } else {
      setModifier((prev) => ({
        ...prev,
        options: prev.options.map((option, i) => {
          if (i === index) {
            const newDays = option.indexDaysAvailable.includes(day)
              ? option.indexDaysAvailable.filter((d) => d !== day)
              : [...option.indexDaysAvailable, day];
            return { ...option, indexDaysAvailable: newDays };
          }
          return option;
        }),
      }));
    }
  };

  const handlePropertyToggle = (
    index: number,
    property: "isSpicy" | "vegan",
  ) => {
    setModifier((prev) => ({
      ...prev,
      options: prev.options.map((option, i) => {
        if (i === index) {
          const newOption = { ...option, [property]: !option[property] };
          if (property === "isSpicy" && newOption.isSpicy) {
            newOption.spiceLevel = SPICE_LEVELS[0].value;
          } else if (property === "isSpicy" && !newOption.isSpicy) {
            newOption.spiceLevel = undefined;
          }
          return newOption;
        }
        return option;
      }),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onSave(modifier);
      toast("Modifier updated successfully", {
        actionButtonStyle: {
          backgroundColor: "hsl(var(--primary))",
          color: "hsl(var(--primary-foreground))",
        },
        action: {
          label: "Undo",
          onClick: () => {},
        },
      });
    } catch (error) {
      toast("Failed to update modifier");
      console.error(error);
    }
    onOpenChange(false);
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="flex w-screen h-full max-h-[100vh] items-center">
          <div className="flex flex-col h-full min-w-[80%]">
            <DrawerHeader className="border-b border-border">
              <DrawerTitle className="text-2xl font-bold">
                Edit Modifier
              </DrawerTitle>
            </DrawerHeader>
            <ScrollArea className="flex">
              <form onSubmit={handleSubmit} className="space-y-6 p-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Modifier Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={modifier.name}
                    onChange={handleInputChange}
                    placeholder="Enter modifier name"
                    className="w-full"
                    required
                  />
                </div>
                {/* Similar to CreateModifierDrawer but using the current data */}
                <div className="space-y-2">
                  <Label>Days Available</Label>
                  <div className="flex gap-2">
                    {DAYS_OF_WEEK.map((day, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleDayToggle(null, i)}
                        className={`flex items-center justify-center rounded-md text-sm font-medium transition-colors
                          ${
                            modifier.indexDaysAvailable.includes(i)
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          }`}
                      >
                        <span className="flex p-2">{day}</span>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Option editing */}
                <div className="space-y-4">
                  <Label>Edit Additions</Label>
                  <Accordion type="single" collapsible className="w-full">
                    {modifier.options.map((option, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="hover:no-underline">
                          {option.name || `Addition ${index + 1}`}
                        </AccordionTrigger>
                        <AccordionContent>
                          <Card>
                            <CardContent className="space-y-4 pt-4">
                              {/* Additional option fields */}
                              <div className="flex justify-between items-center">
                                <div className="flex flex-wrap gap-2">
                                  {option.max && (
                                    <Badge variant="secondary">
                                      <Hash className="w-3 h-3 mr-1" />
                                      Max: {option.max}
                                    </Badge>
                                  )}
                                </div>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeOption(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  <Button
                    type="button"
                    onClick={addOption}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Addition
                  </Button>
                </div>
              </form>
            </ScrollArea>
            <DrawerFooter className="bg-background border-t border-border mt-auto pb-2">
              <Button type="submit" onClick={handleSubmit} className="w-full">
                Save Changes
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}


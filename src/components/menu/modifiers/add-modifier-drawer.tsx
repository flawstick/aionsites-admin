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
import { useModifiers } from "@/lib/hooks/useModifiers";
import { toast } from "sonner";
import { useDirection } from "@/hooks/use-direction";

interface IAddition {
  name: string;
  price: number;
  multiple?: boolean;
  indexDaysAvailable: number[];
  max?: number;
  isSpicy: boolean;
  vegan: boolean;
  spiceLevel?: string;
}

interface IModifier {
  name: string;
  required: boolean;
  multiple: boolean;
  options: IAddition[];
  max?: number;
  indexDaysAvailable: number[];
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
const SPICE_LEVELS = [
  { value: "mild", label: "Mildly Spicy" },
  { value: "medium", label: "Medium Spice" },
  { value: "hot", label: "Tongue Thrasher" },
];

interface CreateModifierDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateModifierDrawer({
  open,
  onOpenChange,
}: CreateModifierDrawerProps) {
  const { createModifier } = useModifiers();
  const { direction } = useDirection();
  const [modifier, setModifier] = useState<IModifier>({
    name: "",
    required: false,
    multiple: false,
    options: [],
    max: undefined,
    indexDaysAvailable: ALL_DAYS,
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (await createModifier(modifier)) {
        toast("Modifier Added Successfully", {
          actionButtonStyle: {
            backgroundColor: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
          },
          action: {
            label: "Yay!",
            onClick: () => {},
          },
        });
      }
    } catch (error) {
      toast("Failed to save menu");
      console.error(error);
    }
    onOpenChange(false);
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent
          className="flex w-screen h-full max-h-[100vh] items-center"
          dir={direction}
        >
          <div className="flex flex-col h-full min-w-[80%]" dir={direction}>
            <DrawerHeader className="border-b border-border">
              <DrawerTitle className="text-2xl font-bold">
                Create New Modifier
              </DrawerTitle>
            </DrawerHeader>
            <ScrollArea className="flex" dir={direction}>
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
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="required">Required</Label>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="required"
                      checked={modifier.required}
                      onCheckedChange={handleSwitchChange("required")}
                    />
                    {modifier.required ? "Yes" : "No"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="multiple">Allow Multiple</Label>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="multiple"
                      checked={modifier.multiple}
                      onCheckedChange={handleSwitchChange("multiple")}
                    />
                    {modifier.multiple ? "Yes" : "No"}
                  </div>
                </div>
                {modifier.multiple && (
                  <div className="space-y-2">
                    <Label htmlFor="max">Max Selections</Label>
                    <Select
                      value={modifier.max?.toString() || "infinity"}
                      onValueChange={(value) =>
                        setModifier((prev) => ({
                          ...prev,
                          max:
                            value === "infinity" ? undefined : parseInt(value),
                        }))
                      }
                      dir={direction}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select max selections" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(10)].map((_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1}
                          </SelectItem>
                        ))}
                        <SelectItem value="infinity">Infinity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
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
                <div className="space-y-4">
                  <Label>Additions</Label>
                  <Accordion type="single" collapsible className="w-full">
                    {modifier.options.map((option, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="hover:no-underline">
                          {option.name || `Addition ${index + 1}`}
                        </AccordionTrigger>
                        <AccordionContent>
                          <Card>
                            <CardContent className="space-y-4 pt-4">
                              <div className="space-y-2">
                                <Label htmlFor={`name-${index}`}>Name</Label>
                                <Input
                                  id={`name-${index}`}
                                  value={option.name}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      index,
                                      "name",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Addition name"
                                  className="w-full"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`price-${index}`}>Price</Label>
                                <Input
                                  id={`price-${index}`}
                                  type="number"
                                  value={option.price}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      index,
                                      "price",
                                      parseFloat(e.target.value),
                                    )
                                  }
                                  placeholder="Price"
                                  className="w-full"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`multiple-${index}`}>
                                  Multiple
                                </Label>
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id={`multiple-${index}`}
                                    checked={option.multiple || false}
                                    onCheckedChange={(checked) =>
                                      handleOptionChange(
                                        index,
                                        "multiple",
                                        checked,
                                      )
                                    }
                                  />
                                  <span>{option.multiple ? "Yes" : "No"}</span>
                                </div>
                              </div>
                              {option.multiple && (
                                <div className="space-y-2">
                                  <Label htmlFor={`max-${index}`}>Max</Label>
                                  <Select
                                    value={option.max?.toString() || "infinity"}
                                    onValueChange={(value) =>
                                      handleOptionChange(
                                        index,
                                        "max",
                                        value === "infinity"
                                          ? undefined
                                          : parseInt(value),
                                      )
                                    }
                                    dir={direction}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select max" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {[...Array(10)].map((_, i) => (
                                        <SelectItem
                                          key={i + 1}
                                          value={(i + 1).toString()}
                                        >
                                          {i + 1}
                                        </SelectItem>
                                      ))}
                                      <SelectItem value="infinity">
                                        Infinity
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                              <div className="space-y-2">
                                <Label>Days Available</Label>
                                <div className="flex gap-2">
                                  {DAYS_OF_WEEK.map((day, i) => (
                                    <button
                                      key={i}
                                      type="button"
                                      onClick={() => handleDayToggle(index, i)}
                                      className={`p-2 flex items-center justify-center rounded-md text-sm font-medium transition-colors
                                        ${
                                          option.indexDaysAvailable.includes(i)
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                        }`}
                                    >
                                      {day}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Properties</Label>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handlePropertyToggle(index, "isSpicy")
                                    }
                                    className={`flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors
                                      ${
                                        option.isSpicy
                                          ? "bg-primary text-primary-foreground"
                                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                      }`}
                                  >
                                    <Flame className="w-4 h-4 mr-2" />
                                    Spicy
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handlePropertyToggle(index, "vegan")
                                    }
                                    className={`flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors
                                      ${
                                        option.vegan
                                          ? "bg-primary text-primary-foreground"
                                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                      }`}
                                  >
                                    <Leaf className="w-4 h-4 mr-2" />
                                    Vegan
                                  </button>
                                </div>
                              </div>
                              {option.isSpicy && (
                                <div className="space-y-2">
                                  <Label>Spice Level</Label>
                                  <RadioGroup
                                    defaultValue={SPICE_LEVELS[0].value}
                                    value={option.spiceLevel}
                                    onValueChange={(value) =>
                                      handleOptionChange(
                                        index,
                                        "spiceLevel",
                                        value,
                                      )
                                    }
                                    className="flex flex-col space-y-2"
                                    dir={direction}
                                  >
                                    {SPICE_LEVELS.map((level) => (
                                      <div
                                        key={level.value}
                                        className="flex items-center space-x-2"
                                      >
                                        <RadioGroupItem
                                          value={level.value}
                                          id={`spice-${index}-${level.value}`}
                                        />
                                        <Label
                                          htmlFor={`spice-${index}-${level.value}`}
                                        >
                                          {level.label}
                                        </Label>
                                      </div>
                                    ))}
                                  </RadioGroup>
                                </div>
                              )}
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
                Create Modifier
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

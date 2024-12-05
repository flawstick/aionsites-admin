import { useEffect, useState } from "react";
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
import { useTranslations } from "next-intl";

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

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

interface EditModifierDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modifierData: IModifier;
}

export function EditModifierDrawer({
  open,
  onOpenChange,
  modifierData,
}: EditModifierDrawerProps) {
  const t = useTranslations("modifier");
  const { editModifier: updateModifier } = useModifiers();
  const { direction } = useDirection();
  const [modifier, setModifier] = useState<IModifier>(modifierData);

  const DAYS_OF_WEEK = [
    t("days.sunday"),
    t("days.monday"),
    t("days.tuesday"),
    t("days.wednesday"),
    t("days.thursday"),
    t("days.friday"),
    t("days.saturday"),
  ];
  const SPICE_LEVELS = [
    { value: "mild", label: t("mildlySpicy") },
    { value: "medium", label: t("mediumSpice") },
    { value: "hot", label: t("tongueThrasher") },
  ];

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

  // set the document to pointer-events: auto
  useEffect(() => {
    if (open) {
      document.body.style.pointerEvents = "auto";
    }

    return () => {
      document.body.style.pointerEvents = "auto";
    };
  }, [open]);

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
      if (await updateModifier(modifier)) {
        toast(t("modifierUpdatedSuccessfully"), {
          actionButtonStyle: {
            backgroundColor: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
          },
          action: {
            label: t("yay"),
            onClick: () => {},
          },
        });
      }
    } catch (error) {
      toast(t("failedToUpdateModifier"));
      console.error(error);
    }
    onOpenChange(false);
  };

  useEffect(() => {
    if (open && modifierData) {
      setModifier(modifierData);
    }
  }, [open, modifierData]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className="flex w-screen h-full h-screen items-center"
        dir={direction}
      >
        <div className="flex flex-col h-full min-w-[80%]" dir={direction}>
          <DrawerHeader className="border-b border-border">
            <DrawerTitle className="text-2xl font-bold">
              {t("editModifier")}
            </DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex" dir={direction}>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t("modifierName")}</Label>
                <Input
                  id="name"
                  name="name"
                  value={modifier?.name}
                  onChange={handleInputChange}
                  placeholder={t("enterModifierName")}
                  className="w-full"
                  required
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="required">{t("required")}</Label>
                <div className="flex items-center gap-2">
                  <Switch
                    id="required"
                    checked={modifier?.required}
                    onCheckedChange={handleSwitchChange("required")}
                  />
                  {modifier?.required ? t("yes") : t("no")}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="multiple">{t("allowMultiple")}</Label>
                <div className="flex items-center gap-2">
                  <Switch
                    id="multiple"
                    checked={modifier?.multiple}
                    onCheckedChange={handleSwitchChange("multiple")}
                  />
                  {modifier?.multiple ? t("yes") : t("no")}
                </div>
              </div>
              {modifier?.multiple && (
                <div className="space-y-2">
                  <Label htmlFor="max">{t("maxSelections")}</Label>
                  <Select
                    value={modifier?.max?.toString() || "infinity"}
                    onValueChange={(value) =>
                      setModifier((prev) => ({
                        ...prev,
                        max: value === "infinity" ? undefined : parseInt(value),
                      }))
                    }
                    dir={direction}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("selectMaxSelections")} />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                      <SelectItem value="infinity">{t("infinity")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label>{t("daysAvailable")}</Label>
                <div className="flex gap-2">
                  {DAYS_OF_WEEK.map((day, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleDayToggle(null, i)}
                      className={`flex items-center justify-center rounded-md text-sm font-medium transition-colors
                          ${
                            modifier?.indexDaysAvailable.includes(i)
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
                <Label>{t("additions")}</Label>
                <Accordion type="single" collapsible className="w-full">
                  {modifier?.options.map((option, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="hover:no-underline">
                        {option.name || `${t("addition")} ${index + 1}`}
                      </AccordionTrigger>
                      <AccordionContent>
                        <Card>
                          <CardContent className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label htmlFor={`name-${index}`}>
                                {t("name")}
                              </Label>
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
                                placeholder={t("additionName")}
                                className="w-full"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`price-${index}`}>
                                {t("price")}
                              </Label>
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
                                placeholder={t("price")}
                                className="w-full"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`multiple-${index}`}>
                                {t("multiple")}
                              </Label>
                              <div className="flex items-center gap-2">
                                <Switch
                                  dir="ltr"
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
                                <span>
                                  {option.multiple ? t("yes") : t("no")}
                                </span>
                              </div>
                            </div>
                            {option.multiple && (
                              <div className="space-y-2">
                                <Label htmlFor={`max-${index}`}>
                                  {t("max")}
                                </Label>
                                <Select
                                  value={option.max?.toString() || "infinity"}
                                  dir={direction}
                                  onValueChange={(value) =>
                                    handleOptionChange(
                                      index,
                                      "max",
                                      value === "infinity"
                                        ? undefined
                                        : parseInt(value),
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t("selectMax")} />
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
                                      {t("infinity")}
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                            <div className="space-y-2">
                              <Label>{t("daysAvailable")}</Label>
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
                              <Label>{t("properties")}</Label>
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
                                  <Flame className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                                  {t("spicy")}
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
                                  <Leaf className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                                  {t("vegan")}
                                </button>
                              </div>
                            </div>
                            {option.isSpicy && (
                              <div className="space-y-2">
                                <Label>{t("spiceLevel")}</Label>
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
                                  dir={direction}
                                  className="flex flex-col space-y-2"
                                >
                                  {SPICE_LEVELS.map((level) => (
                                    <div
                                      key={level.value}
                                      className="flex items-center gap-2"
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
                                    {t("max")}: {option.max}
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
                  <Plus className="mr-2 h-4 w-4" /> {t("addAddition")}
                </Button>
              </div>
            </form>
          </ScrollArea>
          <DrawerFooter className="bg-background border-t border-border mt-auto pb-2">
            <Button type="submit" onClick={handleSubmit} className="w-full">
              {t("updateModifier")}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                {t("cancel")}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

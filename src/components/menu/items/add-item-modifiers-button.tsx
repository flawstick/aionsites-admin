import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Modifier } from "@/types";
import { Plus } from "lucide-react";

interface AddModifiersDialogProps {
  availableModifiers: Modifier[];
  selectedModifierIds: string[];
  onSave: (selectedIds: string[]) => void;
}

export const AddModifiersDialog: React.FC<AddModifiersDialogProps> = ({
  availableModifiers,
  selectedModifierIds,
  onSave,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedModifierIds);

  const handleModifierToggle = (modifierId: string) => {
    setSelectedIds((prev) =>
      prev.includes(modifierId)
        ? prev.filter((id) => id !== modifierId)
        : [...prev, modifierId],
    );
  };

  const handleSave = () => {
    onSave(selectedIds);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="mb-4">
          <Plus size={16} />
          Add Modifiers
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Modifiers</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          {availableModifiers.map((modifier) => (
            <div
              key={modifier._id}
              className="flex items-center space-x-2 mb-4"
            >
              <Checkbox
                id={modifier._id}
                checked={selectedIds.includes(modifier._id)}
                onCheckedChange={() => handleModifierToggle(modifier._id)}
              />
              <Label
                htmlFor={modifier._id}
                className="text-sm font-medium leading-none"
              >
                {modifier.name}
                {modifier.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
                {modifier.multiple && (
                  <span className="text-blue-500 ml-1">(Multiple)</span>
                )}
              </Label>
            </div>
          ))}
        </ScrollArea>
        <DialogFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

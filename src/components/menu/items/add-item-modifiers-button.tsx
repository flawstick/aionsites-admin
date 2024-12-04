import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Modifier } from "@/types";
import { availableMemory } from "process";
import { useDirection } from "@/hooks/use-direction";

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
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { direction } = useDirection();

  const handleModifierToggle = (modifierId: string) => {
    setTempSelectedIds((prev) => {
      const isSelected = prev.includes(modifierId);
      if (isSelected) {
        return prev.filter((id) => id !== modifierId);
      } else {
        return [...prev, modifierId];
      }
    });
  };

  const handleSave = () => {
    onSave(tempSelectedIds);
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setTempSelectedIds(selectedModifierIds);
    }
    setOpen(newOpen);
  };

  const filteredModifiers = availableModifiers.filter((modifier) =>
    modifier.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" className="mb-4">
          <Search size={16} />
          Add Modifiers
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2/3" dir={direction}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            Add Modifiers
          </DialogTitle>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              placeholder="Search modifiers..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </DialogHeader>
        <ScrollArea
          className="h-[60vh] ltr:pr-4 rtl:pl-4 -mb-4 "
          dir={direction}
        >
          {filteredModifiers.length > 0 ? (
            filteredModifiers.map((modifier) => {
              const isSelected = tempSelectedIds.includes(modifier._id);
              return (
                <Card
                  key={modifier._id}
                  className={`mb-4 cursor-pointer ${
                    isSelected ? "border-primary" : "border-border"
                  }`}
                  onClick={() => handleModifierToggle(modifier._id)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg flex justify-between items-center">
                      {modifier.name}
                      <div>
                        {modifier.required && (
                          <Badge variant="destructive" className="mr-2">
                            Required
                          </Badge>
                        )}
                        {modifier.multiple && (
                          <Badge variant="secondary">Multiple</Badge>
                        )}
                      </div>
                    </CardTitle>
                    <CardDescription>
                      {isSelected ? "Selected" : "Click to select"}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })
          ) : (
            <p className="text-center text-muted-foreground">
              No modifiers found.
            </p>
          )}
        </ScrollArea>
        <DialogFooter className="border-t py-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Add Selected Modifiers</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

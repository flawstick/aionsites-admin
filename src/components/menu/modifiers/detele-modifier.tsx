import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { toast } from "sonner";

interface DeleteModifierProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modifierId: string;
  handleDelete: (modifierId: string) => Promise<boolean>;
  handleUndo: (modifierId: string) => Promise<boolean>;
}

export function DeleteModifier({
  open,
  onOpenChange,
  modifierId,
  handleDelete,
  handleUndo,
}: DeleteModifierProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.pointerEvents = "auto";
    }

    return () => {
      document.body.style.pointerEvents = "auto";
    };
  }, [open]);

  const handleAction = useCallback(async () => {
    if (await handleDelete(modifierId)) {
      toast("Modifier deleted successfully", {
        actionButtonStyle: {
          backgroundColor: "hsl(var(--primary))",
          color: "hsl(var(--primary-foreground))",
        },
        action: {
          label: "Undo",
          onClick: async () => {
            if (await handleUndo(modifierId))
              toast("Deletion undone successfully");
          },
        },
      });
    } else {
      toast("Failed to delete modifier", {
        actionButtonStyle: {
          backgroundColor: "hsl(var(--primary))",
          color: "hsl(var(--primary-foreground))",
        },
        action: {
          label: "Retry",
          onClick: handleAction, // Recursively retry
        },
      });
    }
  }, [modifierId, handleDelete, handleUndo]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogTitle>You sure you wanna?</AlertDialogTitle>
        <AlertDialogHeader>
          This deletes it off the database, all gone.
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleAction} asChild>
            <Button variant="destructive">Delete</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

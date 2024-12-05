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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("modifier");

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
      toast(t("modifierDeletedSuccessfully"), {
        actionButtonStyle: {
          backgroundColor: "hsl(var(--primary))",
          color: "hsl(var(--primary-foreground))",
        },
        action: {
          label: t("undo"),
          onClick: async () => {
            if (await handleUndo(modifierId))
              toast(t("deletionUndoneSuccessfully"));
          },
        },
      });
    } else {
      toast(t("failedToDeleteModifier"), {
        actionButtonStyle: {
          backgroundColor: "hsl(var(--primary))",
          color: "hsl(var(--primary-foreground))",
        },
        action: {
          label: t("retry"),
          onClick: handleAction, // Recursively retry
        },
      });
    }
  }, [modifierId, handleDelete, handleUndo, t]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogTitle>{t("deleteConfirmationTitle")}</AlertDialogTitle>
        <AlertDialogHeader>
          {t("deleteConfirmationDescription")}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleAction} asChild>
            <Button variant="destructive">{t("delete")}</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

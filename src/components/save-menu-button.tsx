"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { toast, Toaster as Sonner } from "sonner";
import { Button } from "@/components/ui/button";
import { useRestaurantStore } from "@/lib/store/restaurantStore";
import useAuth from "@/lib/hooks/useAuth";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const SaveMenuButton = ({ ...props }: ToasterProps) => {
  const { session }: any = useAuth();
  const { saveMenu } = useRestaurantStore();
  const [isLoading, setIsLoading] = useState(false);
  const [lastSavedMenu, setLastSavedMenu] = useState<any[]>([]);

  const handleSave = async () => {
    setIsLoading(true);

    const currentMenu = useRestaurantStore.getState().menu.items;
    setLastSavedMenu([...(currentMenu as any[])]);

    const success = await saveMenu(session.jwt);

    if (success) {
      toast("Menu saved successfully", {
        action: {
          label: "Undo",
          onClick: handleUndo,
        },
        onDismiss: () => {
          setLastSavedMenu([]);
        },
        onAutoClose: () => {
          setLastSavedMenu([]);
        },
      });
    } else {
      toast("Failed to save menu");
    }
    setIsLoading(false);
  };

  const handleUndo = async () => {
    setIsLoading(true);
    await saveMenu(session.jwt, lastSavedMenu);
    setIsLoading(false);
  };

  return (
    <>
      <Button
        variant="default"
        onClick={handleSave}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? "Saving..." : "Save Menu"}
      </Button>
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
        {...props}
      />
    </>
  );
};

export { SaveMenuButton };

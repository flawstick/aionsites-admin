"use client";

import * as React from "react";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useAuth from "@/lib/hooks/useAuth";
import RegisterRestaurant from "./create-resturant";
import { useRestaurantStore } from "@/lib/store/restaurantStore";
import { Skeleton } from "./ui/skeleton";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {}

export default function TeamSwitcher({ className }: TeamSwitcherProps) {
  const { session }: any = useAuth();
  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const {
    restaurants,
    setSelectedRestaurant,
    selectedRestaurant,
    fetchRestaurants,
  } = useRestaurantStore();

  React.useEffect(() => {
    if (session) fetchRestaurants(session.jwt, session.user._id);
  }, [session]);

  if (!selectedRestaurant) {
    return <Skeleton className="h-8 w-[200px] rounded-lg" />;
  }

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-[200px] justify-between", className)}
          >
            <Avatar className="ltr:mr-2 rtl:ml-2 h-5 w-5">
              <AvatarImage
                src={selectedRestaurant?.profile?.picture}
                alt={selectedRestaurant?.name}
                className="grayscale"
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            {selectedRestaurant ? selectedRestaurant.name : "Select a team"}
            <CaretSortIcon className="ltr:ml-auto rtl:mr-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search team..." className="rtl:mr-2" />
              <CommandEmpty>No team found.</CommandEmpty>
              {restaurants.length > 0 && (
                <CommandGroup heading="Teams">
                  {restaurants.map((team) => (
                    <CommandItem
                      key={team._id}
                      onSelect={() => {
                        setSelectedRestaurant(session.jwt, team._id as string);
                        setOpen(false);
                      }}
                      className="text-sm"
                    >
                      <Avatar className="ltr:mr-2 rtl:ml-2 h-5 w-5">
                        <AvatarImage
                          src={team?.profile?.picture}
                          alt={team.name}
                          className="grayscale"
                        />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      {team.name}
                      <CheckIcon
                        className={cn(
                          "ltr:ml-auto rtl:mr-auto h-4 w-4",
                          selectedRestaurant?._id === team._id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewTeamDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="ltr:mr-2 rtl:ml-2 h-5 w-5" />
                    Create Team
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <RegisterRestaurant
        onClose={() => {
          setShowNewTeamDialog(false);
        }}
      />
    </Dialog>
  );
}

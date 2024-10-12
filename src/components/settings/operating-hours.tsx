"use client";

import { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock } from "lucide-react";
import { useRestaurantStore } from "@/lib/store/restaurantStore";
import { Card } from "../ui/card";
import useAuth from "@/lib/hooks/useAuth";

export default function OperatingHours() {
  const { selectedRestaurant, updateRestaurant, fetchSelectedRestaurant } =
    useRestaurantStore();
  const { session } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    // @ts-ignore
    fetchSelectedRestaurant(session.jwt);
    setIsOpen(selectedRestaurant?.operatingData?.status === "open");
  }, []);

  // Days of the week to include in the hours state
  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const initializeHours = () => {
    const defaultHours = Object.fromEntries(
      daysOfWeek.map((day) => [
        day,
        { open: "Choose time", close: "Choose time", isClosed: false },
      ]),
    );

    return selectedRestaurant?.operatingData
      ? {
          ...defaultHours,
          status: selectedRestaurant.operatingData.status ?? "closed",
          ...Object.fromEntries(
            Object.entries(selectedRestaurant.operatingData)
              .filter(([day]) => daysOfWeek.includes(day.toLowerCase())) // Include only days of the week
              .map(([day, hours]: any) => [
                day.toLowerCase(),
                {
                  open: hours?.open ?? "Choose time",
                  close: hours?.close ?? "Choose time",
                  isClosed: hours?.isClosed ?? false,
                },
              ]),
          ),
        }
      : { ...defaultHours, status: "closed" };
  };

  const [hours, setHours] = useState(initializeHours);
  const [currentDay, setCurrentDay] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const manualStatusChange = useRef(false); // Track manual status changes

  const handleTimeChange = (
    day: string,
    type: "open" | "close",
    value: string,
  ) => {
    setHours((prevHours: any) => ({
      ...prevHours,
      [day]: { ...prevHours[day], [type]: value },
    }));
  };

  const toggleClosed = (day: string) => {
    setHours((prevHours: any) => ({
      ...prevHours,
      [day]: { ...prevHours[day], isClosed: !prevHours[day].isClosed },
    }));
  };

  const toggleRestaurantStatus = (status: "open" | "closed") => {
    manualStatusChange.current = true; // Set manual status change flag
    setHours((prevHours: any) => ({
      ...prevHours,
      status,
    }));
    setIsOpen(status === "open");
  };

  useEffect(() => {
    // Debounced check for open status based on current time and hours
    const checkIfOpen = () => {
      const now = new Date();
      const dayOfWeek = daysOfWeek[now.getDay()];
      setCurrentDay(dayOfWeek);

      const currentTime = now.getHours() * 60 + now.getMinutes();
      const todayHours = hours[dayOfWeek];

      if (todayHours.isClosed) {
        setHours((prevHours: any) => ({ ...prevHours, status: "closed" }));
      } else {
        const [openHour, openMinute] = todayHours.open.split(":").map(Number);
        const [closeHour, closeMinute] = todayHours.close
          .split(":")
          .map(Number);
        const openTime = openHour * 60 + openMinute;
        const closeTime = closeHour * 60 + closeMinute;

        const isOpen = currentTime >= openTime && currentTime < closeTime;
        setHours((prevHours: any) => ({
          ...prevHours,
          status: isOpen ? "open" : "closed",
        }));
      }
    };

    // Only run check if not a manual status change
    if (!manualStatusChange.current) {
      const interval = setInterval(checkIfOpen, 60000); // Check every minute

      return () => clearInterval(interval);
    } else {
      // Reset manual status change flag after processing
      manualStatusChange.current = false;
    }
  }, [hours]);

  const handleSave = async () => {
    setIsSaving(true);
    const updatedOperatingData = {
      ...Object.fromEntries(
        Object.entries(hours).map(([day, { open, close, isClosed }]: any) => [
          day.toLowerCase(),
          {
            open: open === "Choose time" ? null : open,
            close: close === "Choose time" ? null : close,
            isClosed,
          },
        ]),
      ),
      status: hours.status, // Include status in the saved data
    };

    await updateRestaurant(
      // @ts-ignore
      session.jwt,
      // @ts-ignore
      { operatingData: updatedOperatingData },
      selectedRestaurant?._id as string,
    );
    setIsSaving(false);

    // @ts-ignore
    fetchSelectedRestaurant(session.jwt);
  };

  return (
    <div className="w-full p-6 bg-background relative mb-32">
      <Card className="max-w-6xl mx-auto pb-24 p-8">
        <h2 className="text-3xl font-bold mb-6 flex items-center">
          <Clock className="mr-2 h-8 w-8" />
          Operating Hours
        </h2>
        <div className="p-8 rounded-lg shadow-sm">
          {daysOfWeek.map((day) => {
            const { open, close, isClosed } = hours[day];
            return (
              <div key={day} className="mb-8 last:mb-0">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-xl font-semibold capitalize">
                    {day}
                  </Label>
                  <Button
                    variant={isClosed ? "default" : "outline"}
                    size="lg"
                    onClick={() => toggleClosed(day)}
                    className="w-32"
                  >
                    {isClosed ? "Closed" : "Open"}
                  </Button>
                </div>
                <div className="flex space-x-8">
                  <div className="flex-1">
                    <Label
                      htmlFor={`${day}-open`}
                      className="text-sm text-gray-600 mb-2 block"
                    >
                      Opening Time
                    </Label>
                    <Select
                      value={open}
                      onValueChange={(value) =>
                        handleTimeChange(day, "open", value)
                      }
                      disabled={isClosed}
                    >
                      <SelectTrigger id={`${day}-open`} className="w-full">
                        <SelectValue placeholder="Choose time" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                          <SelectItem
                            key={hour}
                            value={`${hour.toString().padStart(2, "0")}:00`}
                          >
                            {`${hour.toString().padStart(2, "0")}:00`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label
                      htmlFor={`${day}-close`}
                      className="text-sm text-gray-600 mb-2 block"
                    >
                      Closing Time
                    </Label>
                    <Select
                      value={close}
                      onValueChange={(value) =>
                        handleTimeChange(day, "close", value)
                      }
                      disabled={isClosed}
                    >
                      <SelectTrigger id={`${day}-close`} className="w-full">
                        <SelectValue placeholder="Choose time" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                          <SelectItem
                            key={hour}
                            value={`${hour.toString().padStart(2, "0")}:00`}
                          >
                            {`${hour.toString().padStart(2, "0")}:00`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      <div className="fixed flex bottom-16 right-10 left-100 border bg-muted rounded-full shadow-lg flex items-center justify-between px-6 py-3">
        <div className="flex items-center mx-2">
          <div
            className={`w-3 h-3 rounded-full ${
              hours.status === "open" ? "bg-green-500" : "bg-red-500"
            } mr-2`}
          ></div>
          <span className="font-semibold">
            {hours.status === "open" ? "Open Now" : "Closed Now"}
          </span>
          <span className="ml-2 text-gray-500">
            {currentDay &&
              `(${currentDay}: ${hours[currentDay].open} - ${hours[currentDay].close})`}
          </span>
        </div>

        <div className="flex items-center flex-row gap-2 justify-center">
          {!isOpen ? (
            <Button
              onClick={() => toggleRestaurantStatus("open")}
              variant="outline"
            >
              Open Now
            </Button>
          ) : (
            <Button
              onClick={() => toggleRestaurantStatus("closed")}
              variant="destructive"
            >
              Close Now
            </Button>
          )}
          <Button onClick={handleSave} variant="default" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

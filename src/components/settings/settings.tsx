"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronsUpDown,
  UtensilsCrossed,
  Clock,
  MapPin,
  DollarSign,
  Image,
  Bell,
  Mail,
  Phone,
} from "lucide-react";
import { Header } from "../nav";
import OperatingHours from "./operating-hours";
import { useRestaurantStore } from "@/lib/store/restaurantStore";

export default function RestaurantSettings() {
  const [activeSection, setActiveSection] = useState("general");
  const { selectedRestaurant } = useRestaurantStore();

  const renderContent = () => {
    switch (activeSection) {
      case "general":
        return (
          <div className="space-y-8 max-w-2xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold mb-4">Restaurant Name</h2>
              <p className="text-gray-600 mb-2">
                This is your restaurant's visible name within the platform.
              </p>
              <Input placeholder="Enter restaurant name" className="max-w-md" />
              <p className="text-sm text-gray-500 mt-2">
                Please use 32 characters at maximum.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Restaurant URL</h2>
              <p className="text-gray-600 mb-2">
                This is your restaurant's URL on our platform.
              </p>
              <div className="flex max-w-md">
                <span className="inline-flex items-center px-3 text-sm bg-muted border border-r-0 border-muted rounded-l-md">
                  grubapp.co/
                </span>
                <Input
                  placeholder="your-restaurant"
                  value={selectedRestaurant?.configurableUrl}
                  className="rounded-l-none"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Please use 48 characters at maximum.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Restaurant Banner</h2>
              <p className="text-gray-600 mb-2">
                This banner will be displayed at the top of your restaurant
                page.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-64 h-24 bg-gray-200 rounded flex items-center justify-center">
                  <Image className="h-10 w-10 text-gray-400" />
                </div>
                <Button>Change Banner</Button>
              </div>
            </div>
          </div>
        );
      case "details":
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Restaurant Details</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cuisine">Cuisine Type</Label>
                <Select>
                  <SelectTrigger id="cuisine">
                    <SelectValue placeholder="Select cuisine type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="italian">Italian</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="mexican">Mexican</SelectItem>
                    <SelectItem value="indian">Indian</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your restaurant"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Full address" />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@yourrestaurant.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Contact Phone</Label>
                <Input id="phone" type="tel" placeholder="(123) 456-7890" />
              </div>
            </div>
          </div>
        );
      case "hours":
        return <OperatingHours />;
      default:
        return null;
    }
  };

  return (
    <Header noBorder>
      <div className="flex bg-background">
        <aside className="w-64 bg-background p-6">
          <div className="mb-6">
            <Input type="search" placeholder="Search..." className="w-full" />
          </div>
          <nav className="space-y-2">
            {[
              { name: "General", icon: ChevronsUpDown, id: "general" },
              {
                name: "Restaurant Details",
                icon: UtensilsCrossed,
                id: "details",
              },
              { name: "Operating Hours", icon: Clock, id: "hours" },
            ].map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveSection(item.id)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            ))}
          </nav>
          <div className="mt-auto pt-6">
            <Button variant="ghost" className="w-full justify-start">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Button>
          </div>
        </aside>
        <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
      </div>
    </Header>
  );
}

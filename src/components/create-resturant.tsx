"use client";

import React, { useState, useEffect } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Libraries,
} from "@react-google-maps/api";
import { LoadingAnimation } from "./animations";
import axios from "axios";
import useAuth from "@/lib/hooks/useAuth";
import { motion } from "framer-motion";

const libraries: Libraries = ["places"];

export default function RegisterRestaurant({
  onClose,
}: {
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const { session }: any = useAuth();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  useEffect(() => {
    if (address) {
      const geocodeAddress = async () => {
        try {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ address }, (results: any, status: any) => {
            if (status === "OK" && results[0]) {
              const location = results[0].geometry.location;
              setCoordinates({ lat: location.lat(), lng: location.lng() });
            } else {
              console.error(
                "Geocode was not successful for the following reason: " +
                  status,
              );
            }
          });
        } catch (error) {
          console.error("Error geocoding address:", error);
        }
      };

      geocodeAddress();
    }
  }, [address]);

  const handleSubmit = async (event: React.FormEvent) => {
    setIsLoading(true);
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/restaurants/create",
        {
          name,
          contactEmail: email,
          contactPhone: phone,
          address,
          coordinates,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.jwt}`,
          },
        },
      );

      if (response.status === 201) {
        animationVariants.animate = { opacity: 0 };
        setRequestSent(true);
        setIsLoading(false);
      } else {
        console.error("Error registering restaurant:", response.data);
      }
    } catch (error) {
      console.error("Error registering restaurant:", error);
    }
  };

  const animationVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  };

  return (
    <DialogContent className="sm:max-w-[900px] sm:max-h-[800px] overflow-hidden">
      <DialogHeader>
        <motion.div variants={animationVariants} transition={{ duration: 0.3 }}>
          <DialogTitle className="text-center">
            Register Your Restaurant
          </DialogTitle>
          <DialogDescription className="text-center">
            Fill out the form below to register your restaurant with us. We'll
            get in touch with you shortly after.
          </DialogDescription>
        </motion.div>
      </DialogHeader>
      {!isLoading && !requestSent && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-4 py-4"
        >
          <div className="flex flex-col w-full space-y-2">
            <Label htmlFor="name" className="self-start">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Restaurant Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-col w-full space-y-2">
            <Label htmlFor="email" className="self-start">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="hello@restaurant.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-col w-full space-y-2">
            <Label htmlFor="phone" className="self-start">
              Phone
            </Label>
            <Input
              id="phone"
              placeholder="+1 (555) 555-5555"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-col w-full space-y-2">
            <Label htmlFor="address" className="self-start">
              Address
            </Label>
            <Input
              id="address"
              placeholder="123 Main St, Anytown USA"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-col w-full space-y-2">
            <div className="relative h-[300px] w-full rounded-lg overflow-hidden">
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={coordinates}
                zoom={15}
              >
                <Marker position={coordinates} />
              </GoogleMap>
            </div>
          </div>
          <div className="flex flex-col w-full space-y-2">
            <Button onClick={() => console.log("gay")} type="submit">
              Register
            </Button>
          </div>
        </form>
      )}
      {isLoading && <LoadingAnimation />}
      {requestSent && <CheckAnimation handleClose={onClose} />}
    </DialogContent>
  );
}

function CheckAnimation({ handleClose }: { handleClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", duration: 0.5 }}
      className="flex flex-col w-full items-center justify-center space-y-4"
    >
      <motion.svg
        initial={{ width: 0 }}
        animate={{ width: 69 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="text-green-500"
        xmlns="http://www.w3.org/2000/svg"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          d="M4 12l5 5 11-11"
        />
      </motion.svg>
      <h2 className="text-2xl font-bold">Thank you!</h2>
      <p className="text-gray-500">Your message has been sent.</p>
      <Button className="mt-4" onClick={handleClose}>
        Close
      </Button>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddItemButtonProps extends HTMLMotionProps<"button"> {}

export function AddItemButton(props: AddItemButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className="group relative overflow-hidden px-4 py-2 rounded-full text-white font-semibold text-md shadow-lg"
      style={{
        background: "linear-gradient(135deg, #fd8000 0%, #ffa500 100%)",
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      <motion.div
        className="absolute inset-0 flex flex-col justify-end"
        initial={{ height: "0%" }}
        animate={isHovered ? { height: "100%" } : { height: "0%" }}
        transition={{
          duration: 0.5,
          ease: [0.33, 1, 0.68, 1], // custom spring physics
        }}
      >
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            className="w-full"
            style={{
              backgroundColor: `hsl(${36 + index * 5}, 100%, ${
                50 + index * 5
              }%)`,
              height: "20%",
            }}
            initial={{ scaleY: 0 }}
            animate={isHovered ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: [0.33, 1, 0.68, 1],
            }}
          />
        ))}
      </motion.div>
      <motion.span
        className={cn(
          "relative z-10 flex items-center justify-center",
          "group-hover:drop-shadow-lg transition-all duration-300 ease-in-out",
        )}
        transition={{ duration: 0.3 }}
      >
        <Plus className="mr-1" size={18} strokeWidth={2.5} />
        Add Item
      </motion.span>
    </motion.button>
  );
}

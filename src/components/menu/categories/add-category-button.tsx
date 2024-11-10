"use client";

import { useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface AddCategoryButtonProps extends ButtonProps {}

export function AddCategoryButton(props: AddCategoryButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
      <Button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative overflow-hidden px-6 py-3 rounded-full text-lg font-semibold text-white shadow-md transition-all duration-300 ease-in-out"
        style={{
          background: isHovered
            ? "linear-gradient(45deg, #fd8000, #ffb060)"
            : "linear-gradient(45deg, #fd7000, #fd9020)",
          boxShadow: isHovered
            ? "0 4px 15px rgba(253, 128, 0, 0.3)"
            : "0 2px 10px rgba(253, 112, 0, 0.2)",
        }}
        {...props}
      >
        <motion.div
          className="flex items-center justify-center gap-2"
          initial={false}
          animate={{ y: isHovered ? -30 : 0, opacity: isHovered ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <Plus className="w-5 h-5" />
          <span>Add Category</span>
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: isHovered ? 0 : 30, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <span>Create New</span>
        </motion.div>
      </Button>
    </motion.div>
  );
}

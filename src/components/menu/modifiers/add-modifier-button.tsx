import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface AddModifierButtonProps {
  onClick: () => void;
}

export function AddModifierButton({ onClick }: AddModifierButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className="relative px-5 py-2 font-semibold text-white rounded-full shadow-lg flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 overflow-hidden"
      initial={{
        background: "linear-gradient(90deg, #fd8000 0%, #cc5500 100%)",
        filter: "brightness(1)",
      }}
      animate={{
        background: isHovered
          ? "linear-gradient(90deg, #fd8000 0%, #ff9933 50%, #cc5500 100%)"
          : "linear-gradient(90deg, #fd8000 0%, #cc5500 100%)",
        filter: isHovered ? "brightness(1.05)" : "brightness(1)",
        transition: { duration: 0.3 },
      }}
      whileHover={{
        scale: 1.05,
      }}
      whileTap={{
        scale: 0.95,
        rotate: -3,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      <motion.div
        animate={
          isHovered
            ? {
                rotate: 180,
                scale: [1, 1.2, 1],
                transition: {
                  rotate: { duration: 0.3 },
                  scale: {
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 0.5,
                  },
                },
              }
            : { rotate: 0, scale: 1 }
        }
      >
        <Plus className="w-5 h-5" />
      </motion.div>
      <motion.span
        animate={{
          textShadow: isHovered ? "0 0 8px rgba(255,255,255,0.3)" : "none",
        }}
      >
        Add Modifier
      </motion.span>
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: isHovered
            ? "0 0 0 2px rgba(253, 128, 0, 0.3)"
            : "0 0 0 0px rgba(253, 128, 0, 0)",
        }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      />
    </motion.button>
  );
}

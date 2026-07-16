"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playCorrectSound } from "@/lib/sounds";

const MESSAGES = [
  "You're doing great!",
  "Nice work!",
  "Keep going!",
  "That’s it!",
  "Smart thinking!",
  "You're on fire!",
  "One step closer!",
  "Brilliant!",
];

interface EncouragementToastProps {
  trigger: number;
  playSound?: boolean;
}

export default function EncouragementToast({ trigger, playSound = true }: EncouragementToastProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (trigger === 0) {
      setMessage(null);
      return;
    }

    const text = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    setMessage(text);
    setKey(prev => prev + 1); // force re-animation
    
    if (playSound) {
      playCorrectSound();
    }

    // Shorter duration + auto-clear
    const t = setTimeout(() => {
      setMessage(null);
    }, 1400);

    return () => clearTimeout(t);
  }, [trigger, playSound]);

  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 15, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-[65] px-4 py-2 rounded-full bg-foreground text-white text-sm font-semibold shadow-xl pointer-events-none"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

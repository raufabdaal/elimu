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

  useEffect(() => {
    if (trigger === 0) {
      setMessage(null);
      return;
    }
    
    const text = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    setMessage(text);
    
    if (playSound) {
      playCorrectSound();
    }

    const t = setTimeout(() => setMessage(null), 1800);
    return () => clearTimeout(t);
  }, [trigger, playSound]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[70] px-5 py-2.5 rounded-full bg-foreground text-white text-sm font-semibold shadow-lg pointer-events-none"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
}

export default function EncouragementToast({ trigger }: EncouragementToastProps) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (trigger === 0) return;
    const text = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    setMessage(text);
    const t = setTimeout(() => setMessage(null), 2200);
    return () => clearTimeout(t);
  }, [trigger]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[70] px-5 py-2.5 rounded-full bg-foreground text-white text-sm font-semibold shadow-lg pointer-events-none"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

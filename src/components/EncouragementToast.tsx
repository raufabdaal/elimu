"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { playCorrectSound } from "@/lib/sounds";

const MESSAGES = [
  "You're doing fantastic! 🌟",
  "Spot on! Keep rolling! 🔥",
  "Smart thinking! 💡",
  "Uganda's future champion! 🏆",
  "That’s how it's done! ✨",
  "Unstoppable focus! 🚀",
  "Brilliant answer! 🎉",
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

    const t = setTimeout(() => {
      setMessage(null);
    }, 1600);

    return () => clearTimeout(t);
  }, [trigger, playSound]);

  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.div
          key={trigger}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 450, damping: 28 }}
          className="fixed sm:absolute top-20 left-0 right-0 z-50 flex justify-center pointer-events-none px-4"
        >
          <div className="bg-slate-900/95 text-white font-bold text-[14.5px] px-5 py-3 rounded-2xl shadow-xl border border-slate-700/80 flex items-center gap-2 backdrop-blur-md">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

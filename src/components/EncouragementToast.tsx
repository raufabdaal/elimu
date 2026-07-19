"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star } from "lucide-react";
import { playCorrectSound } from "@/lib/sounds";

const MESSAGES = [
  "You're doing fantastic! 🌟",
  "Spot on! Keep rolling! 🔥",
  "Smart thinking! 💡",
  "Uganda's future champion! 🏆",
  "That's how it's done! ✨",
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
    }, 1500);

    return () => clearTimeout(t);
  }, [trigger, playSound]);

  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.div
          key={trigger}
          initial={{ opacity: 0, y: 30, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 500, damping: 26 }}
          className="fixed sm:absolute top-20 left-0 right-0 z-60 flex justify-center pointer-events-none px-4"
        >
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white font-extrabold text-[14.5px] px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 backdrop-blur-md relative overflow-hidden pointer-events-none">
            <motion.div
              animate={{ rotate: [0, 360], scale: [1, 1.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="text-amber-400 shrink-0"
            >
              <Sparkles className="w-5 h-5 fill-amber-400" />
            </motion.div>
            <span>{message}</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0 opacity-80" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Sparkles } from "lucide-react";

interface CelebrationProps {
  show: boolean;
  message?: string;
  onDone?: () => void;
}

export default function Celebration({ show, message = "Great job!", onDone }: CelebrationProps) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        onDone?.();
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none bg-foreground/5"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-surface rounded-3xl px-8 py-6 shadow-lg text-center"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: 2 }}
              className="flex justify-center text-warning mb-3"
            >
              <Star className="w-12 h-12 fill-warning" />
            </motion.div>
            <h3 className="text-xl mb-1">{message}</h3>
            <p className="text-sm text-muted">Keep it up!</p>
          </motion.div>
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                y: [0, -120 - Math.random() * 80],
                x: [(i - 4) * 30, (i - 4) * 60],
                scale: [0, 1, 0],
                rotate: [0, 180],
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute text-accent"
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Sparkles, Award } from "lucide-react";

interface CelebrationProps {
  show: boolean;
  message?: string;
  subMessage?: string;
  onDone?: () => void;
}

export default function Celebration({ show, message = "Brilliant job!", subMessage = "+15 XP Earned", onDone }: CelebrationProps) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        onDone?.();
      }, 2000);
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
          className="fixed sm:absolute inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none p-4"
        >
          <motion.div
            initial={{ scale: 0.6, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            className="bg-white rounded-[32px] p-8 max-w-sm w-full border-4 border-emerald-400 shadow-2xl text-center pointer-events-auto"
          >
            <div className="relative flex justify-center items-center mb-4">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.25, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-300 flex items-center justify-center text-emerald-600 shadow-inner"
              >
                <Award className="w-10 h-10 fill-emerald-500 text-emerald-600" />
              </motion.div>
              <motion.div
                animate={{ y: [-10, -25, -10], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -top-2 right-12 text-amber-500"
              >
                <Sparkles className="w-6 h-6 fill-amber-400" />
              </motion.div>
              <motion.div
                animate={{ y: [-5, -18, -5], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: 0.4 }}
                className="absolute -top-1 left-12 text-amber-500"
              >
                <Star className="w-5 h-5 fill-amber-400" />
              </motion.div>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 mb-1">{message}</h3>
            <p className="text-[15px] font-bold text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full inline-block mt-2">
              {subMessage}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

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

export default function Celebration({
  show,
  message = "Brilliant job!",
  subMessage = "+15 XP Earned",
  onDone,
}: CelebrationProps) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        onDone?.();
      }, 1400); // Shorter, snappy 1.4s max duration
      return () => clearTimeout(t);
    } else {
      // Instantly hide celebration if parent changes `show` to false (e.g. advancing to next question!)
      setVisible(false);
    }
  }, [show, onDone]);

  // Generate 12 random confetti sparkles
  const particles = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    angle: (i * 360) / 12,
    distance: 70 + (i % 3) * 25,
    color: ["#F59E0B", "#10B981", "#3B82F6", "#EC4899", "#8B5CF6"][i % 5],
  }));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed sm:absolute inset-0 z-[80] flex items-center justify-center bg-black/45 backdrop-blur-sm pointer-events-none p-4 overflow-hidden"
        >
          <motion.div
            initial={{ scale: 0.5, y: 35, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 26 }}
            className="bg-white rounded-[32px] p-8 max-w-sm w-full border-4 border-emerald-400 shadow-2xl text-center pointer-events-none relative"
          >
            {/* Particle burst ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
              {particles.map((p) => {
                const rad = (p.angle * Math.PI) / 180;
                const x = Math.cos(rad) * p.distance;
                const y = Math.sin(rad) * p.distance;
                return (
                  <motion.div
                    key={p.id}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                    animate={{ x, y, scale: [0, 1.2, 0.4], opacity: [1, 1, 0] }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                    className="absolute w-3 h-3 rounded-full"
                    style={{ backgroundColor: p.color }}
                  />
                );
              })}
            </div>

            <div className="relative flex justify-center items-center mb-5">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 border-4 border-emerald-300 flex items-center justify-center text-white shadow-lg relative z-10"
              >
                <Award className="w-10 h-10 stroke-[2.5]" />
              </motion.div>
              <motion.div
                animate={{ y: [-10, -25, -10], rotate: [0, 20, 0], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="absolute -top-3 right-12 text-amber-500 z-20"
              >
                <Sparkles className="w-7 h-7 fill-amber-400" />
              </motion.div>
              <motion.div
                animate={{ y: [-5, -18, -5], rotate: [0, -20, 0], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.7, repeat: Infinity, delay: 0.3 }}
                className="absolute -top-2 left-12 text-amber-500 z-20"
              >
                <Star className="w-6 h-6 fill-amber-400" />
              </motion.div>
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-1 leading-snug">{message}</h3>
            <motion.p
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-sm font-extrabold text-emerald-800 bg-emerald-100 px-4 py-2 rounded-2xl inline-block mt-2 shadow-inner border border-emerald-300"
            >
              {subMessage}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakProps {
  days: number;
  className?: string;
}

export default function Streak({ days, className = "" }: StreakProps) {
  return (
    <div 
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 shadow-sm ${className}`}
      aria-label={`${days} day streak`}
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="text-amber-500 flex items-center"
      >
        <Flame className="w-5 h-5 fill-amber-500 text-amber-600" />
      </motion.div>
      <span className="font-mono font-bold text-[14px] text-amber-950">{days}</span>
      <span className="text-[11.5px] font-bold uppercase tracking-wider text-amber-800/80">days</span>
    </div>
  );
}

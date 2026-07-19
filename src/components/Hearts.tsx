"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface HeartsProps {
  count: number;
  max?: number;
  className?: string;
  showCount?: boolean;
}

export default function Hearts({ count, max = 5, className = "", showCount = false }: HeartsProps) {
  return (
    <div 
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 shadow-sm ${className}`}
      aria-label={`${count} of ${max} hearts`}
    >
      <div className="flex items-center gap-1">
        {Array.from({ length: max }).map((_, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={i < count ? { scale: [1, 1.15, 1], opacity: 1 } : { scale: 0.85, opacity: 0.3 }}
            transition={{ type: "spring", stiffness: 400, damping: 15, delay: i * 0.05 }}
          >
            <Heart
              className={`w-4 h-4 sm:w-4 sm:h-4 ${i < count ? "fill-rose-500 text-rose-600" : "fill-slate-300 text-slate-400"}`}
              strokeWidth={2.2}
            />
          </motion.div>
        ))}
      </div>
      {showCount && (
        <span className="font-mono font-bold text-[13.5px] text-rose-950 ml-0.5">
          {count}/{max}
        </span>
      )}
    </div>
  );
}

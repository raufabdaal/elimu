"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface EnergyBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
}

export default function EnergyBar({ value, className = "", showLabel = true }: EnergyBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={`w-full ${className}`} aria-label={`Energy ${clamped}%`}>
      {showLabel && (
        <div className="flex items-center justify-between text-[11.5px] font-bold uppercase tracking-wider text-amber-900/80 mb-1.5">
          <span className="flex items-center gap-1">
            <Zap className="w-4 h-4 fill-amber-500 text-amber-600" />
            Energy Pool
          </span>
          <span className="font-mono text-amber-950 font-extrabold">{clamped}%</span>
        </div>
      )}
      <div className="h-3 w-full bg-amber-100/80 border border-amber-200/80 rounded-full overflow-hidden p-0.5 shadow-inner">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 shadow-sm"
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

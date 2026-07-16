"use client";

import { motion } from "framer-motion";

interface EnergyBarProps {
  value: number;
}

export default function EnergyBar({ value }: EnergyBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full" aria-label={`Energy ${clamped}%`}>
      <div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-muted mb-1">
        <span>Energy</span>
        <span className="font-mono">{clamped}%</span>
      </div>
      <div className="h-2 w-full bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-warning"
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

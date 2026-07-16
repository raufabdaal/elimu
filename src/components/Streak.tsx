"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakProps {
  days: number;
}

export default function Streak({ days }: StreakProps) {
  return (
    <div className="flex items-center gap-2" aria-label={`${days} day streak`}>
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="text-warning"
      >
        <Flame className="w-5 h-5 fill-warning" />
      </motion.div>
      <span className="font-mono font-bold text-foreground">{days}</span>
      <span className="text-xs text-muted">day streak</span>
    </div>
  );
}

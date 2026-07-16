"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface HeartsProps {
  count: number;
  max?: number;
}

export default function Hearts({ count, max = 5 }: HeartsProps) {
  return (
    <div className="flex items-center gap-1" aria-label={`${count} of ${max} hearts`}>
      {Array.from({ length: max }).map((_, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={i < count ? { scale: 1 } : { scale: 0.9, opacity: 0.35 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <Heart
            className={`w-5 h-5 ${i < count ? "fill-error text-error" : "text-muted"}`}
            strokeWidth={2}
          />
        </motion.div>
      ))}
    </div>
  );
}

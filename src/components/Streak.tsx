"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, CheckCircle2, ShieldAlert, Sparkles, X } from "lucide-react";

interface StreakProps {
  days: number;
  className?: string;
}

export default function Streak({ days, className = "" }: StreakProps) {
  const [showModal, setShowModal] = useState(false);
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 active:scale-95 border border-amber-200 shadow-2xs transition-all cursor-pointer ${className}`}
        aria-label={`${days} day streak. Click for details.`}
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="text-amber-500 flex items-center"
        >
          <Flame className="w-5 h-5 fill-amber-500 text-amber-600" />
        </motion.div>
        <span className="font-mono font-black text-sm sm:text-[14px] text-amber-950">{days}</span>
        <span className="text-[11.5px] font-bold uppercase tracking-wider text-amber-800/90 hidden sm:inline">days</span>
      </button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 10, opacity: 0 }}
              transition={{ type: "spring", stiffness: 450, damping: 26 }}
              className="bg-white rounded-[32px] p-6 max-w-sm w-full shadow-2xl border-2 border-amber-400 text-center relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600" />

              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-400" /> Daily Streak
                </span>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              <div className="my-5">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 rounded-full bg-amber-100 border-4 border-amber-300 mx-auto flex items-center justify-center text-amber-600 mb-3 shadow-inner"
                >
                  <Flame className="w-10 h-10 fill-amber-500 text-amber-600" />
                </motion.div>
                <h3 className="text-2xl font-black text-slate-900">
                  {days} Day Streak! 🔥
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-1 max-w-[260px] mx-auto">
                  You are building unstoppable study habits. Study every day to keep the flame alive!
                </p>
              </div>

              {/* Weekly Calendar Tracker */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 my-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3 text-left">
                  This Week&apos;s Activity
                </span>
                <div className="grid grid-cols-7 gap-1.5">
                  {weekDays.map((d, i) => {
                    const isCompletedDay = i < Math.min(days, 7);
                    return (
                      <div key={d} className="flex flex-col items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500">{d}</span>
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                            isCompletedDay
                              ? "bg-amber-500 text-white shadow-xs"
                              : "bg-slate-200/70 text-slate-400"
                          }`}
                        >
                          {isCompletedDay ? <CheckCircle2 className="w-4 h-4 stroke-[3]" /> : "•"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-amber-50/80 rounded-2xl p-3 border border-amber-200/80 flex items-start gap-2.5 text-left text-xs text-amber-950 mt-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Streak Protection:</strong> Complete at least one 3-minute drill or practice session every 24 hours to preserve your streak!
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn btn-primary w-full py-3.5 font-extrabold mt-5 shadow-md"
              >
                Keep Burning Bright 🔥
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ClassLevel, Profile } from "@/lib/types";
import { CLASS_LABELS } from "@/lib/data";
import { saveState, loadState } from "@/lib/store";
import Hearts from "./Hearts";
import Streak from "./Streak";
import { ChevronDown, RefreshCw } from "lucide-react";

interface HeaderStatsProps {
  profile: Profile;
  hearts: number;
  maxHearts?: number;
  streakDays: number;
  showClassSwitcher?: boolean;
  shakeHearts?: boolean;
  onClassChange?: (newClass: ClassLevel) => void;
}

export default function HeaderStats({
  profile,
  hearts,
  maxHearts = 5,
  streakDays,
  showClassSwitcher = true,
  shakeHearts = false,
  onClassChange,
}: HeaderStatsProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const classes: ClassLevel[] = ["p4", "p5", "p6", "p7"];

  const handleSelectClass = (cls: ClassLevel) => {
    const s = loadState();
    saveState({
      profile: {
        ...s.profile,
        classLevel: cls,
      },
    });
    setShowModal(false);
    if (onClassChange) {
      onClassChange(cls);
    } else {
      router.refresh();
      window.location.reload();
    }
  };

  return (
    <>
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 px-4 py-3 sm:rounded-t-[36px]">
        <div className="flex items-center justify-between gap-2">
          {/* Avatar & Class Switcher Trigger */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-extrabold text-lg flex items-center justify-center shadow-md shrink-0">
              {(profile.name || "S").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[15px] text-slate-900 truncate">
                  {profile.name || "Pupil"}
                </span>
                {profile.role === "parent" && (
                  <span className="bg-purple-100 text-purple-800 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md border border-purple-200">
                    Parent
                  </span>
                )}
              </div>
              
              {showClassSwitcher ? (
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-1 text-[12px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200/80 transition-all mt-0.5"
                >
                  <span>{CLASS_LABELS[profile.classLevel || "p5"]}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="text-[12px] font-semibold text-slate-500 block mt-0.5">
                  {CLASS_LABELS[profile.classLevel || "p5"]}
                </span>
              )}
            </div>
          </div>

          {/* Gamification Stats */}
          <div className="flex items-center gap-2 shrink-0">
            <Streak days={streakDays} />
            <div className={shakeHearts ? "animate-shake" : ""}>
              <Hearts count={hearts} max={maxHearts} showCount={true} />
            </div>
          </div>
        </div>
      </header>

      {/* Class Level Switch Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed sm:absolute inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 10, opacity: 0 }}
              transition={{ type: "spring", stiffness: 450, damping: 26 }}
              className="bg-white rounded-[28px] p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Switch Primary Class</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    Explore NCDC curriculum topics across all four primary classes
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2.5 my-4">
                {classes.map((cls) => {
                  const isCurrent = (profile.classLevel || "p5") === cls;
                  return (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => handleSelectClass(cls)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all text-left ${
                        isCurrent
                          ? "border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 font-semibold text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                            isCurrent ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {cls.toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-bold">{CLASS_LABELS[cls]}</div>
                          <div className="text-[11px] text-slate-500">
                            4 Core Subjects · NCDC Aligned
                          </div>
                        </div>
                      </div>
                      {isCurrent && (
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  Switching updates available subjects & questions
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    router.push("/onboarding/");
                  }}
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Full Profile Setup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

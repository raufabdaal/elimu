"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ClassLevel, Profile } from "@/lib/types";
import { CLASS_LABELS } from "@/lib/data";
import { saveState, loadState } from "@/lib/store";
import Hearts from "./Hearts";
import { Menu, X, RefreshCw, Sparkles, BookOpen, ShieldCheck } from "lucide-react";

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
  const [showDrawer, setShowDrawer] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const classes: ClassLevel[] = ["p4", "p5", "p6", "p7"];

  const handleSelectClass = (cls: ClassLevel) => {
    const s = loadState();
    saveState({
      profile: {
        ...s.profile,
        classLevel: cls,
      },
    });
    setShowClassModal(false);
    setShowDrawer(false);
    if (onClassChange) {
      onClassChange(cls);
    } else {
      router.refresh();
      window.location.reload();
    }
  };

  const handleSwitchToParent = () => {
    const s = loadState();
    saveState({
      profile: {
        ...s.profile,
        role: "parent",
      },
    });
    setShowDrawer(false);
    router.push("/parent/");
  };

  return (
    <>
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 px-4 py-3 sm:rounded-t-[36px] shadow-2xs">
        <div className="flex items-center justify-between gap-3 w-full">
          {/* Left: Brand + Class Level Badge */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-lg sm:text-xl flex items-center justify-center shadow-xs shrink-0">
              E
            </div>
            <div className="min-w-0 flex items-center gap-2">
              <span className="font-black text-base sm:text-lg text-slate-900 tracking-tight">
                ELIMU
              </span>
              <span className="bg-slate-100 text-slate-700 text-xs font-black px-2.5 py-0.5 rounded-lg border border-slate-200 shrink-0">
                {(profile.classLevel || "p5").toUpperCase()}
              </span>
              {profile.role === "parent" && (
                <span className="bg-purple-100 text-purple-800 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md border border-purple-200 shrink-0">
                  Parent
                </span>
              )}
            </div>
          </div>

          {/* Right: Hamburger Menu Drawer Button (`Dead Simple & Clutter-Free`) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowDrawer(true)}
              aria-label="Open Menu and Stats"
              className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 flex items-center justify-center transition-all shadow-2xs border border-slate-200/60"
            >
              <Menu className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </header>

      {/* Hamburger Menu Slide-Over Drawer */}
      <AnimatePresence>
        {showDrawer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end"
            onClick={() => setShowDrawer(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="bg-white w-full max-w-xs h-full shadow-2xl flex flex-col justify-between overflow-y-auto p-6 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white font-extrabold text-lg flex items-center justify-center shrink-0 shadow-sm">
                      {(profile.name || "S").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-black text-slate-900 truncate">
                        {profile.name || "Student"}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500">
                        {CLASS_LABELS[profile.classLevel || "p5"]}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDrawer(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 shrink-0"
                  >
                    <X className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

                {/* Gamification Summary Inside Menu */}
                <div className="my-5 flex flex-col gap-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Your Study Progress
                  </span>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
                    <span className="text-xs font-bold text-slate-600">Daily Streak</span>
                    <div className="flex items-center gap-1 font-mono font-black text-amber-600">
                      <span>🔥</span>
                      <span>{streakDays} Days</span>
                    </div>
                  </div>

                  <div className={`bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs ${shakeHearts ? "animate-shake" : ""}`}>
                    <span className="text-xs font-bold text-slate-600">Hearts Remaining</span>
                    <div className="flex items-center gap-1">
                      <Hearts count={hearts} max={maxHearts} showCount={true} />
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
                    <span className="text-xs font-bold text-slate-600">Total Experience</span>
                    <div className="flex items-center gap-1 font-mono font-black text-emerald-600">
                      <Sparkles className="w-4 h-4 fill-emerald-500 text-emerald-600" />
                      <span>{loadState().progress.xp} XP</span>
                    </div>
                  </div>
                </div>

                {/* Switch Primary Class Action */}
                {showClassSwitcher && (
                  <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Primary Grade Level
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowClassModal(true)}
                      className="w-full p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-300/80 text-emerald-900 font-extrabold text-sm flex items-center justify-between transition-all shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-emerald-600" />
                        <span>Switch Class ({CLASS_LABELS[profile.classLevel || "p5"]})</span>
                      </div>
                      <span>→</span>
                    </button>
                  </div>
                )}

                {/* Portal Switcher Action */}
                <div className="mt-4 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleSwitchToParent}
                    className="w-full p-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100/80 border border-purple-300/80 text-purple-900 font-extrabold text-sm flex items-center justify-between transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-purple-600" />
                      <span>Switch to Parent Portal</span>
                    </div>
                    <span>→</span>
                  </button>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowDrawer(false);
                    router.push("/onboarding/");
                  }}
                  className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset / Reconfigure Profile</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Class Level Switch Modal */}
      <AnimatePresence>
        {showClassModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed sm:absolute inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowClassModal(false)}
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
                    Select your NCDC curriculum grade level
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowClassModal(false)}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

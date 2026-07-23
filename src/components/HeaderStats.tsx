"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ClassLevel, Profile } from "@/lib/types";
import { CLASS_LABELS } from "@/lib/data";
import { saveState, loadState } from "@/lib/store";
import { getAccountSummary } from "@/lib/cloud-profile";
import Streak from "./Streak";
import { BookOpen, GraduationCap, Heart, Menu, RefreshCw, ShieldCheck, UserRound, X, LockKeyhole } from "lucide-react";

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
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const classes: ClassLevel[] = ["p4", "p5", "p6", "p7"];
  const isParent = profile.role === "parent";

  useEffect(() => {
    if (isParent) return;
    let cancelled = false;
    getAccountSummary()
      .then((summary) => {
        if (!cancelled) setPairingCode(summary?.student?.pairing_code || null);
      })
      .catch(() => {
        if (!cancelled) setPairingCode(null);
      });
    return () => {
      cancelled = true;
    };
  }, [isParent]);

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

  const closeAndGo = (href: string) => {
    setShowDrawer(false);
    router.push(href);
  };

  return (
    <>
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 px-4 py-3 sm:rounded-t-[36px] shadow-2xs">
        <div className="flex items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-lg sm:text-xl flex items-center justify-center shadow-xs shrink-0">
              E
            </div>
            <div className="min-w-0 flex items-center gap-2">
              <span className="font-black text-base sm:text-lg text-slate-900 tracking-tight">
                ELIMU
              </span>
              <span className={`${isParent ? "bg-purple-100 text-purple-800 border-purple-200" : "bg-slate-100 text-slate-700 border-slate-200"} text-xs font-black px-2.5 py-0.5 rounded-lg border shrink-0`}>
                {isParent ? "Parent" : (profile.classLevel || "p5").toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {!isParent && (
              <>
                <Streak days={streakDays} />
                <div
                  className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-rose-700 shadow-sm ${shakeHearts ? "animate-shake" : ""}`}
                  aria-label={`${hearts} of ${maxHearts} hearts`}
                >
                  <Heart className="h-4 w-4 fill-rose-500 text-rose-600" />
                  <span className="font-mono text-sm font-black text-rose-950">{hearts}</span>
                </div>
              </>
            )}
            <button
              type="button"
              onClick={() => setShowDrawer(true)}
              aria-label="Open menu"
              className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 flex items-center justify-center transition-all shadow-2xs border border-slate-200/60 ml-0.5"
            >
              <Menu className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </header>

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
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`${isParent ? "bg-purple-600" : "bg-emerald-600"} w-11 h-11 rounded-2xl text-white font-extrabold text-lg flex items-center justify-center shrink-0 shadow-sm`}>
                      {(profile.name || (isParent ? "P" : "S")).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-black text-slate-900 truncate">
                        {isParent ? "Parent Dashboard" : profile.name || "Student"}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500">
                        {isParent ? `Linked to ${(profile.name || "student").trim()}` : CLASS_LABELS[profile.classLevel || "p5"]}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDrawer(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 shrink-0"
                    aria-label="Close menu"
                  >
                    <X className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

                {!isParent ? (
                  <>
                    <div className="my-5 grid grid-cols-2 gap-2.5">
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-center">
                        <span className="block text-[10px] font-black uppercase tracking-wider text-amber-800">Streak</span>
                        <span className="mt-0.5 block font-mono text-lg font-black text-amber-950">🔥 {streakDays}</span>
                      </div>
                      <div className={`rounded-2xl border border-rose-200 bg-rose-50 p-3 text-center ${shakeHearts ? "animate-shake" : ""}`}>
                        <span className="block text-[10px] font-black uppercase tracking-wider text-rose-800">Hearts</span>
                        <span className="mt-0.5 inline-flex items-center justify-center gap-1 font-mono text-lg font-black text-rose-950">
                          <Heart className="h-4 w-4 fill-rose-500 text-rose-600" /> {hearts}/{maxHearts}
                        </span>
                      </div>
                    </div>

                    {pairingCode && (
                      <button
                        type="button"
                        onClick={() => navigator.clipboard?.writeText(pairingCode).catch(() => undefined)}
                        className="mb-4 w-full rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-left active:scale-[0.99]"
                      >
                        <span className="block text-[10px] font-black uppercase tracking-wider text-emerald-700">Parent Pairing Code</span>
                        <span className="mt-1 block font-mono text-2xl font-black tracking-[0.18em] text-emerald-950">{pairingCode}</span>
                        <span className="mt-1 block text-[11px] font-bold text-emerald-700">Tap to copy. Share this with your parent/guardian.</span>
                      </button>
                    )}

                    <div className="flex flex-col gap-2.5 pt-2">
                      <MenuAction
                        icon={<BookOpen className="w-4 h-4 text-emerald-600" />}
                        title="Learning Home"
                        onClick={() => closeAndGo("/home/")}
                      />
                      <MenuAction
                        icon={<GraduationCap className="w-4 h-4 text-slate-600" />}
                        title="Choose Subjects"
                        onClick={() => closeAndGo("/subjects/")}
                      />
                      {showClassSwitcher && (
                        <MenuAction
                          icon={<RefreshCw className="w-4 h-4 text-amber-600" />}
                          title={`Switch Class (${CLASS_LABELS[profile.classLevel || "p5"]})`}
                          onClick={() => setShowClassModal(true)}
                        />
                      )}
                      <MenuAction
                        icon={<LockKeyhole className="w-4 h-4 text-slate-600" />}
                        title="Sign in / Sign out"
                        onClick={() => closeAndGo(`/auth/?role=learner&class=${profile.classLevel || "p5"}`)}
                      />
                    </div>
                  </>
                ) : (
                  <div className="mt-5 flex flex-col gap-2.5">
                    <MenuAction
                      icon={<UserRound className="w-4 h-4 text-purple-600" />}
                      title="Parent Dashboard"
                      onClick={() => closeAndGo("/parent/")}
                    />
                    <MenuAction
                      icon={<LockKeyhole className="w-4 h-4 text-slate-600" />}
                      title="Sign in / Sign out"
                      onClick={() => closeAndGo("/auth/?role=parent")}
                    />
                    <MenuAction
                      icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
                      title="Pair Another Child"
                      onClick={() => closeAndGo("/onboarding/?role=parent")}
                    />
                  </div>
                )}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                    Choose the student&apos;s current class.
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
                          <div className="text-[11px] text-slate-500">Uganda Primary Curriculum</div>
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

function MenuAction({ icon, title, onClick }: { icon: React.ReactNode; title: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-900 font-extrabold text-sm flex items-center justify-between transition-all shadow-2xs"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {icon}
        <span className="truncate">{title}</span>
      </div>
      <span className="text-slate-400">→</span>
    </button>
  );
}

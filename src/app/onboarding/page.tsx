"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { loadState, saveState, linkStudent } from "@/lib/store";
import { CLASS_LABELS } from "@/lib/data";
import { ClassLevel, Role } from "@/lib/types";
import AppShell from "@/components/AppShell";
import { User, GraduationCap, ArrowRight, ShieldCheck, ArrowLeft, BookOpen } from "lucide-react";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role>("learner");
  const [name, setName] = useState("");
  const [classLevel, setClassLevel] = useState<ClassLevel | null>(null);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const s = loadState();
    if (s.profile.name && s.profile.name !== "Amina") {
      setName(s.profile.name);
    }
    const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    if (searchParams?.get("role") === "parent") {
      setRole("parent");
      setStep(2);
    }
  }, []);

  if (!mounted) return null;

  const handleRole = (r: Role) => {
    setRole(r);
    setStep(2);
  };

  const handleClass = (c: ClassLevel) => {
    setClassLevel(c);
    setStep(3);
  };

  const handleParentLink = () => {
    const student = linkStudent(code.trim());
    if (student || code.trim() === "739104") {
      saveState({
        profile: {
          ...loadState().profile,
          role: "parent",
          name: name || "Parent Portal",
          linkedStudentId: "student_001",
        },
      });
      router.push("/parent/");
    } else {
      setCodeError("Code not recognized. Try 739104 for the demo student.");
    }
  };

  const finishLearner = () => {
    const current = loadState();
    saveState({
      profile: {
        ...current.profile,
        role: "learner",
        name: name.trim() || "Amina",
        classLevel: classLevel || "p5",
      },
    });
    router.push("/subjects/");
  };

  return (
    <AppShell showTabBar={false} noScrollPad role="learner">
      <div className="relative flex flex-col justify-between min-h-[90vh] px-6 py-8 max-w-[460px] mx-auto w-full overflow-hidden">
        {/* Subtle Decorative Fade Blobs */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Branding & Step Indicator */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white font-black text-2xl flex items-center justify-center shadow-md">
                E
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 block">
                  Elimu Uganda
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Primary P4–P7 NCDC Edtech
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    step === num
                      ? "w-7 bg-emerald-600 shadow-2xs"
                      : step > num
                      ? "w-2.5 bg-emerald-300"
                      : "w-2.5 bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  Who is using Elimu today?
                </h1>
                <p className="text-sm font-semibold text-slate-500 mt-1.5 leading-relaxed">
                  Pick your profile type below to customize your study tools and interactive lessons.
                </p>

                <div className="flex flex-col gap-4 mt-7">
                  <button
                    type="button"
                    onClick={() => handleRole("learner")}
                    className="relative overflow-hidden group p-6 rounded-[28px] border-2 border-slate-200/90 bg-gradient-to-br from-white via-white to-emerald-50/40 hover:border-emerald-500 hover:bg-emerald-50/80 transition-all text-left flex items-start gap-4 shadow-sm hover:shadow-md"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 group-hover:bg-emerald-600 text-emerald-700 group-hover:text-white flex items-center justify-center transition-colors shrink-0 shadow-inner">
                      <GraduationCap className="w-7 h-7 stroke-[2.3]" />
                    </div>
                    <div className="grow min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-black text-lg sm:text-xl text-slate-900 group-hover:text-emerald-950">
                          I am a Student (Learner)
                        </h3>
                        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 transition-transform group-hover:translate-x-1 shrink-0" />
                      </div>
                      <p className="text-xs sm:text-[13px] font-semibold text-slate-500 mt-1 leading-relaxed">
                        Primary 4 to Primary 7. Master your 4 core subjects with interactive drills, streaks, and rewards!
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRole("parent")}
                    className="relative overflow-hidden group p-6 rounded-[28px] border-2 border-slate-200/90 bg-gradient-to-br from-white via-white to-purple-50/40 hover:border-purple-500 hover:bg-purple-50/80 transition-all text-left flex items-start gap-4 shadow-sm hover:shadow-md"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-purple-100 group-hover:bg-purple-600 text-purple-700 group-hover:text-white flex items-center justify-center transition-colors shrink-0 shadow-inner">
                      <User className="w-7 h-7 stroke-[2.3]" />
                    </div>
                    <div className="grow min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-black text-lg sm:text-xl text-slate-900 group-hover:text-purple-950">
                          I am a Parent / Guardian
                        </h3>
                        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-purple-600 transition-transform group-hover:translate-x-1 shrink-0" />
                      </div>
                      <p className="text-xs sm:text-[13px] font-semibold text-slate-500 mt-1 leading-relaxed">
                        Pair with your child&apos;s device to review study minutes, track accuracy, and send live motivation.
                      </p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && role === "learner" && (
              <motion.div
                key="step-2-learner"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  Select your primary class
                </h1>
                <p className="text-sm font-semibold text-slate-500 mt-1.5 leading-relaxed">
                  We will tailor all 4 core subjects precisely to your grade level.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-7">
                  {(Object.keys(CLASS_LABELS) as ClassLevel[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleClass(c)}
                      className={`p-4 rounded-[22px] border-2 transition-all text-left flex items-center justify-between gap-3 ${
                        classLevel === c
                          ? "border-emerald-600 bg-emerald-50/90 text-emerald-950 font-bold shadow-md scale-[1.01]"
                          : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50 font-semibold text-slate-700 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shrink-0 transition-colors ${
                            classLevel === c ? "bg-emerald-600 text-white shadow-sm" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {c.toUpperCase()}
                        </div>
                        <div>
                          <div className="text-base font-black text-slate-900">{CLASS_LABELS[c]}</div>
                          <div className="text-xs text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                            <BookOpen className="w-3 h-3 text-emerald-600" /> 4 Core Subjects
                          </div>
                        </div>
                      </div>
                      <ChevronArrow />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && role === "parent" && (
              <motion.div
                key="step-2-parent"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  Pair Student Device
                </h1>
                <p className="text-sm font-semibold text-slate-500 mt-1.5 leading-relaxed">
                  Enter the 6-digit numeric pairing code displayed on your child&apos;s Elimu screen.
                </p>

                <div className="mt-7">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="______"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.replace(/\D/g, ""));
                      setCodeError("");
                    }}
                    className="answer-input text-center text-3xl font-mono tracking-widest uppercase bg-white border-2 border-slate-300 py-4 shadow-sm"
                  />
                  {codeError && <p className="feedback bad mt-2 text-center text-xs font-bold">{codeError}</p>}

                  <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/90 mt-5 flex items-start gap-3 shadow-2xs">
                    <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-black text-amber-950 block">Testing Demo Linkage?</span>
                      <span className="text-xs font-semibold text-amber-900/80 leading-relaxed block mt-0.5">
                        Use demo code <strong className="font-mono text-amber-950 underline">739104</strong> to link instantly to student Amina (P5).
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="button"
                    className="btn btn-primary w-full py-4 text-base font-black shadow-md flex items-center justify-center gap-2"
                    disabled={code.length !== 6}
                    onClick={handleParentLink}
                  >
                    <span>Connect Parent Portal</span> <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && role === "learner" && (
              <motion.div
                key="step-3-learner"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  What is your name?
                </h1>
                <p className="text-sm font-semibold text-slate-500 mt-1.5 leading-relaxed">
                  This will appear on your dashboard and streak certificates.
                </p>

                <div className="mt-7">
                  <input
                    type="text"
                    placeholder="e.g. Amina"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && finishLearner()}
                    autoFocus
                    className="answer-input text-xl py-4 bg-white shadow-sm"
                  />
                </div>

                <div className="mt-8">
                  <button
                    type="button"
                    className="btn btn-primary w-full py-4 text-base font-black shadow-md flex items-center justify-center gap-2"
                    onClick={finishLearner}
                  >
                    <span>Start Learning Now</span> <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Back navigation footer */}
        <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-between mt-8">
          {step > 1 ? (
            <button
              type="button"
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 py-2 transition-colors"
              onClick={() => setStep(step - 1)}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <span />
          )}
          <span className="text-[11px] font-bold text-slate-400">
            Uganda Primary P4–P7
          </span>
        </div>
      </div>
    </AppShell>
  );
}

function ChevronArrow() {
  return (
    <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
    </svg>
  );
}

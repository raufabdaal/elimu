"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { loadState, saveState, linkStudent } from "@/lib/store";
import { CLASS_LABELS } from "@/lib/data";
import { ClassLevel, Role } from "@/lib/types";
import AppShell from "@/components/AppShell";
import { User, GraduationCap, ArrowRight, ShieldCheck, ArrowLeft } from "lucide-react";

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
    router.push("/home/");
  };

  return (
    <AppShell showTabBar={false} noScrollPad role="learner">
      <div className="flex flex-col justify-between min-h-[90vh] px-6 py-8 max-w-[440px] mx-auto w-full">
        {/* Top Branding & Step Indicator */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-xl flex items-center justify-center shadow-md">
                E
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 block">
                  Elimu Uganda
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Primary P4–P7 NCDC Edtech
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    step === num
                      ? "w-6 bg-emerald-600"
                      : step > num
                      ? "w-2 bg-emerald-300"
                      : "w-2 bg-slate-200"
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
                <h1 className="text-2xl font-black text-slate-900 leading-tight">
                  Who is using Elimu today?
                </h1>
                <p className="text-sm font-semibold text-slate-500 mt-1">
                  Pick your profile type to tailor your learning or tracking tools.
                </p>

                <div className="flex flex-col gap-3.5 mt-6">
                  <button
                    type="button"
                    onClick={() => handleRole("learner")}
                    className="p-5 rounded-3xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/60 transition-all text-left group flex items-start gap-4 shadow-xs"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 group-hover:bg-emerald-600 text-emerald-700 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                      <GraduationCap className="w-6 h-6 stroke-[2.3]" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-950">
                        I am a Pupil (Learner)
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5 leading-relaxed">
                        Primary 4 to Primary 7. Master subjects with quick interactive quizzes, earn streaks, and collect hearts!
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRole("parent")}
                    className="p-5 rounded-3xl border-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50/60 transition-all text-left group flex items-start gap-4 shadow-xs"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 group-hover:bg-purple-600 text-purple-700 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                      <User className="w-6 h-6 stroke-[2.3]" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 group-hover:text-purple-950">
                        I am a Parent / Guardian
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5 leading-relaxed">
                        Pair with your child&apos;s student account to view study minutes, track accuracy, and send live motivation.
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
                <h1 className="text-2xl font-black text-slate-900 leading-tight">
                  Select your primary class
                </h1>
                <p className="text-sm font-semibold text-slate-500 mt-1">
                  We&apos;ll customize your 4 core subjects and topics to your grade level.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                  {(Object.keys(CLASS_LABELS) as ClassLevel[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleClass(c)}
                      className={`p-4 rounded-2xl border-2 transition-all text-left flex items-center justify-between gap-3 ${
                        classLevel === c
                          ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 font-semibold text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-base shrink-0 ${
                            classLevel === c ? "bg-emerald-600 text-white shadow-xs" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {c.toUpperCase()}
                        </div>
                        <div>
                          <div className="text-base font-extrabold text-slate-900">{CLASS_LABELS[c]}</div>
                          <div className="text-[11px] text-slate-500 font-semibold">
                            4 NCDC Subjects
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
                <h1 className="text-2xl font-black text-slate-900 leading-tight">
                  Pair Student Device
                </h1>
                <p className="text-sm font-semibold text-slate-500 mt-1">
                  Enter the 6-digit numeric pairing code displayed on your child&apos;s Elimu screen.
                </p>

                <div className="mt-6">
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
                    className="answer-input text-center text-3xl font-mono tracking-widest uppercase bg-slate-50 border-2 border-slate-300 py-4"
                  />
                  {codeError && <p className="feedback bad mt-2 text-center">{codeError}</p>}

                  <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 mt-4 flex items-start gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-amber-950 block">Testing Demo Linkage?</span>
                      <span className="text-xs font-semibold text-amber-900/80">
                        Use demo code <strong className="font-mono text-amber-950 underline">739104</strong> to link instantly to student Amina (P5).
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="button"
                    className="btn btn-primary w-full py-4 text-base font-black shadow-md"
                    disabled={code.length !== 6}
                    onClick={handleParentLink}
                  >
                    Connect Parent Portal →
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
                <h1 className="text-2xl font-black text-slate-900 leading-tight">
                  What is your name?
                </h1>
                <p className="text-sm font-semibold text-slate-500 mt-1">
                  This will appear on your home screen and streak certificates.
                </p>

                <div className="mt-6">
                  <input
                    type="text"
                    placeholder="e.g. Amina"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && finishLearner()}
                    autoFocus
                    className="answer-input text-xl py-4 bg-white"
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
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-8">
          {step > 1 ? (
            <button
              type="button"
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 py-2"
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
    <svg className="w-5 h-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
    </svg>
  );
}

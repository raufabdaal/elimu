"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { loadState, saveState, linkStudent } from "@/lib/store";
import { CLASS_LABELS } from "@/lib/data";
import { ClassLevel, Role } from "@/lib/types";
import PhoneShell from "@/components/PhoneShell";

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
    if (student) {
      saveState({
        profile: {
          ...loadState().profile,
          role: "parent",
          name: name || "Parent",
          linkedStudentId: "student_001",
        },
      });
      router.push("/parent/");
    } else {
      setCodeError("Code not found. Try 739104 for the demo.");
    }
  };

  const finishLearner = () => {
    const current = loadState();
    saveState({
      profile: {
        ...current.profile,
        role: "learner",
        name: name || "Amina",
        classLevel: classLevel || "p5",
      },
    });
    router.push("/home/");
  };

  return (
    <PhoneShell showTabBar={false} noScrollPad>
      <div className="onboard-top">
        <div className="logo-mark">E</div>
        <p className="eyebrow">ELIMU · UGANDA PRIMARY</p>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="h2">Who is using Elimu?</h1>
            <p className="lead mt-sm">Pick your role so we can show the right experience.</p>
            <div className="flex flex-col gap-3 mt-6">
              <button
                type="button"
                className={`option !items-start !text-left ${role === "learner" ? "selected" : ""}`}
                onClick={() => handleRole("learner")}
              >
                <span className="grade">I am a pupil</span>
                <span className="label">P4–P7. Learn with quizzes and streaks.</span>
              </button>
              <button
                type="button"
                className={`option !items-start !text-left ${role === "parent" ? "selected" : ""}`}
                onClick={() => handleRole("parent")}
              >
                <span className="grade">I am a parent</span>
                <span className="label">Track my child’s progress and study time.</span>
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && role === "learner" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="h2">Which class are you in?</h1>
            <p className="lead mt-sm">Lessons match your level. You can change this later.</p>
            <div className="option-grid mt-6">
              {(Object.keys(CLASS_LABELS) as ClassLevel[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`option ${classLevel === c ? "selected" : ""}`}
                  onClick={() => handleClass(c)}
                >
                  <span className="grade">{c.toUpperCase()}</span>
                  <span className="label">{CLASS_LABELS[c]}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && role === "parent" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="h2">Link to your child</h1>
            <p className="lead mt-sm">Enter the 6-digit code from their Elimu app.</p>
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
              className="answer-input text-3xl mt-6"
            />
            {codeError && <p className="feedback bad mt-2">{codeError}</p>}
            <p className="meta mt-3">Demo code: <span className="font-mono font-semibold text-foreground">739104</span></p>
            <div className="mt-6">
              <button
                type="button"
                className="btn btn-primary w-full"
                disabled={code.length !== 6}
                onClick={handleParentLink}
              >
                Link account
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && role === "learner" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="h2">What should we call you?</h1>
            <p className="lead mt-sm">This name appears on your home screen.</p>
            <input
              type="text"
              placeholder="Your first name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="answer-input text-2xl mt-6"
            />
            <div className="mt-6">
              <button
                type="button"
                className="btn btn-primary w-full"
                onClick={finishLearner}
              >
                Start learning
              </button>
            </div>
          </motion.div>
        )}

        {step > 1 && (
          <button
            type="button"
            className="mt-6 text-sm text-muted font-medium hover:text-foreground"
            onClick={() => setStep(step - 1)}
          >
            ← Back
          </button>
        )}
      </div>
    </PhoneShell>
  );
}

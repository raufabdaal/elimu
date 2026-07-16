"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { loadState, saveState } from "@/lib/store";
import { getLesson } from "@/lib/data";
import PhoneShell from "@/components/PhoneShell";
import Celebration from "@/components/Celebration";
import EncouragementToast from "@/components/EncouragementToast";

function ModuleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectId = (searchParams.get("subject") as "math" | "sst") || "math";
  const lesson = getLesson(subjectId);

  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"ok" | "bad" | "">("");
  const [celebrate, setCelebrate] = useState(false);
  const [encourage, setEncourage] = useState(0);

  const handleChoice = (id: string) => {
    if (answered) return;
    setSelected(id);
    setAnswered(true);

    const choice = lesson.choices.find((c) => c.id === id);
    const correct = !!choice?.correct;

    if (correct) {
      setFeedback("Correct. " + lesson.explain);
      setFeedbackType("ok");
      setCelebrate(true);
      setEncourage((n) => n + 1);
      const s = loadState();
      saveState({
        continue: {
          ...s.continue,
          progress: Math.min(100, (s.continue?.progress || 40) + 20),
          module: (s.continue?.module || 1) + 1,
        },
        progress: {
          ...s.progress,
          modulesDone: s.progress.modulesDone + 1,
          xp: s.progress.xp + 15,
        },
      });
    } else {
      setFeedback("Not quite. " + lesson.explain);
      setFeedbackType("bad");
    }
  };

  return (
    <PhoneShell showTabBar={false} noScrollPad>
      <header className="app-head">
        <Link href="/subjects/" className="icon-btn" aria-label="Back to subjects">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </Link>
        <div className="title-block">
          <p className="meta">{lesson.crumb}</p>
          <h1 style={{ fontSize: 17, fontWeight: 700 }}>{lesson.label}</h1>
        </div>
        <span className="pill">{lesson.count}</span>
      </header>

      <div className="scroll no-tab" style={{ paddingBottom: 0 }}>
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="module-article"
          dangerouslySetInnerHTML={{ __html: lesson.html }}
        />

        <div className="quiz-dock">
          <h3>{lesson.prompt}</h3>
          <div className="stack-sm mt-4">
            <AnimatePresence>
              {lesson.choices.map((choice) => {
                const isSelected = selected === choice.id;
                const showCorrect = answered && choice.correct;
                const showWrong = answered && isSelected && !choice.correct;
                return (
                  <motion.button
                    key={choice.id}
                    type="button"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    disabled={answered}
                    className={`choice ${isSelected ? "selected" : ""} ${showCorrect ? "correct" : ""} ${showWrong ? "wrong" : ""}`}
                    onClick={() => handleChoice(choice.id)}
                  >
                    {choice.text}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          <p className={`feedback mt-4 ${feedbackType}`}>{feedback}</p>

          {answered && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              type="button"
              className="btn btn-primary mt-4"
              onClick={() => router.push("/practice/")}
            >
              Next: Practice →
            </motion.button>
          )}
        </div>
      </div>

      <Celebration show={celebrate} message="Great job!" />
      <EncouragementToast trigger={encourage} />
    </PhoneShell>
  );
}

export default function Module() {
  return (
    <Suspense fallback={<PhoneShell showTabBar={false} noScrollPad><div className="p-10 text-center text-muted">Loading module…</div></PhoneShell>}>
      <ModuleContent />
    </Suspense>
  );
}

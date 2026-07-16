"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { loadState, saveState, recordAnswer, loseHeart } from "@/lib/store";
import { getTopic } from "@/lib/data";
import AppShell from "@/components/AppShell";
import Celebration from "@/components/Celebration";
import EncouragementToast from "@/components/EncouragementToast";

function ModuleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicId = searchParams.get("topic") || "fractions";
  const topic = getTopic(topicId);

  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"ok" | "bad" | "">("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [encourage, setEncourage] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!topic) {
    return (
      <AppShell showTabBar={false} noScrollPad>
        <div className="pt-10 text-center">
          <p className="text-muted">Topic not found.</p>
          <Link href="/subjects/" className="btn btn-primary mt-4">
            Back to subjects
          </Link>
        </div>
      </AppShell>
    );
  }

  const questions = topic.questions;
  const q = questions[index];

  const normalize = (v: string) => v.trim().replace(/\s+/g, "").toLowerCase();

  const handleCheck = () => {
    if (locked || !q) return;

    let correct = false;
    if (q.type === "short_answer") {
      correct = normalize(input) === normalize(q.answer || "");
    } else {
      const option = q.options?.find((o) => o.id === selectedOption);
      correct = !!option?.correct;
    }

    setLocked(true);
    recordAnswer(`${topic.subjectId}-${topic.id}`, correct);

    if (correct) {
      setFeedback("Correct. " + q.explanation);
      setFeedbackType("ok");
      setCelebrate(true);
      setEncourage((n) => n + 1);
    } else {
      loseHeart();
      setFeedback("Not quite. " + q.explanation);
      setFeedbackType("bad");
    }

    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (index >= questions.length - 1) {
      const s = loadState();
      saveState({
        progress: {
          ...s.progress,
          modulesDone: s.progress.modulesDone + 1,
          xp: s.progress.xp + 25,
        },
        continue: {
          ...s.continue,
          progress: Math.min(100, (s.continue?.progress || 0) + 25),
        },
      });
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setInput("");
    setSelectedOption(null);
    setLocked(false);
    setFeedback("");
    setFeedbackType("");
    setShowExplanation(false);
    setCelebrate(false);
  };

  if (finished) {
    return (
      <AppShell showTabBar={false} noScrollPad>
        <div className="pt-10 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          <h1 className="h2">Topic complete!</h1>
          <p className="meta mt-2">You finished {topic.name}.</p>
          <div className="mt-8 flex flex-col gap-3">
            <button type="button" className="btn btn-primary" onClick={() => router.push("/subjects/")}>
              More topics
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => router.push("/practice/")}>
              Practice
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell showTabBar={false} noScrollPad>
      <header className="app-head">
        <Link href="/subjects/" className="icon-btn" aria-label="Back to subjects">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </Link>
        <div className="title-block">
          <p className="meta">{topic.subjectId === "math" ? "Mathematics" : "Social Studies"} · {topic.name}</p>
          <h1 style={{ fontSize: 17, fontWeight: 700 }}>Question {index + 1} of {questions.length}</h1>
        </div>
        <span className="pill">{index + 1}/{questions.length}</span>
      </header>

      <div className="question-stage">
        <div className="progress mb-md">
          <span style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
        </div>

        <motion.div
          key={`q-${index}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p className="eyebrow">{topic.name.toUpperCase()}</p>
          <p className="practice-q">{q.question}</p>
          {q.hint && <p className="meta mb-md">{q.hint}</p>}

          <AnimatePresence mode="wait">
            {q.type === "short_answer" ? (
              <motion.div
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <label className="sr-only" htmlFor="answer">
                  Your answer
                </label>
                <input
                  id="answer"
                  type="text"
                  inputMode={/\d/.test(q.answer || "") ? "numeric" : "text"}
                  autoComplete="off"
                  placeholder="?"
                  value={input}
                  disabled={locked}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                  className="answer-input"
                />
              </motion.div>
            ) : (
              <motion.div
                key="choices"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="stack-sm"
              >
                {q.options?.map((opt) => {
                  const showCorrect = locked && opt.correct;
                  const showWrong = locked && selectedOption === opt.id && !opt.correct;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={locked}
                      className={`choice ${selectedOption === opt.id ? "selected" : ""} ${showCorrect ? "correct" : ""} ${showWrong ? "wrong" : ""}`}
                      onClick={() => setSelectedOption(opt.id)}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          <p className={`feedback ${feedbackType}`}>{feedback}</p>

          {!showExplanation && (
            <button
              type="button"
              className="btn btn-primary mt-md"
              onClick={handleCheck}
              disabled={q.type === "short_answer" ? !input : !selectedOption}
            >
              Check
            </button>
          )}
        </motion.div>

        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="explanation-card mt-md"
            >
              <h4 style={{ color: feedbackType === "ok" ? "var(--success)" : "var(--danger)" }}>
                {feedbackType === "ok" ? "That’s right" : "Here’s why"}
              </h4>
              <p>{q.deepDive || q.explanation}</p>
              <button type="button" className="btn btn-primary mt-md" onClick={nextQuestion}>
                {index === questions.length - 1 ? "Finish topic" : "Next question"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Celebration show={celebrate} message="Correct!" onDone={() => setCelebrate(false)} />
      <EncouragementToast trigger={encourage} />
    </AppShell>
  );
}

export default function Module() {
  return (
    <Suspense fallback={<AppShell showTabBar={false} noScrollPad><div className="p-10 text-center meta">Loading topic…</div></AppShell>}>
      <ModuleContent />
    </Suspense>
  );
}

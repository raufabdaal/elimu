"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { loadState, saveState, loseHeart, recordAnswer } from "@/lib/store";
import { PRACTICE_QUESTIONS } from "@/lib/data";

import PhoneShell from "@/components/PhoneShell";
import Hearts from "@/components/Hearts";
import Celebration from "@/components/Celebration";
import EncouragementToast from "@/components/EncouragementToast";

export default function Practice() {
  const router = useRouter();
  const [state, setState] = useState(loadState());
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState("");
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"ok" | "bad" | "">("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [encourage, setEncourage] = useState(0);
  const [finished, setFinished] = useState(false);

  const questions = PRACTICE_QUESTIONS;
  const q = questions[index];

  useEffect(() => {
    const s = loadState();
    setState(s);
  }, []);

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
    recordAnswer(q.topicId, correct);
    setState(loadState());

    if (correct) {
      setScore((s) => s + 1);
      setFeedback("Correct. " + q.explanation);
      setFeedbackType("ok");
      setCelebrate(true);
      setEncourage((n) => n + 1);
    } else {
      setFeedback("Not quite. " + q.explanation);
      setFeedbackType("bad");
      loseHeart();
      setState(loadState());
    }

    setTimeout(() => {
      nextQuestion();
    }, 1400);
  };

  const nextQuestion = () => {
    if (index >= questions.length - 1) {
      const s = loadState();
      saveState({
        progress: {
          ...s.progress,
          streakDays: s.progress.streakDays + 1,
        },
      });
      setState(loadState());
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setInput("");
    setSelectedOption(null);
    setLocked(false);
    setFeedback("");
    setFeedbackType("");
    setCelebrate(false);
  };

  const handleSkip = () => {
    if (locked) return;
    setLocked(true);
    setFeedback("Skipped. " + q.explanation);
    setFeedbackType("");
    setTimeout(nextQuestion, 800);
  };

  if (finished) {
    return (
      <PhoneShell activeTab="practice">
        <div className="pt-10 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          <h1 className="h2">Session complete!</h1>
          <p className="text-muted mt-2">
            You got <span className="font-mono font-bold text-foreground">{score}</span> of{" "}
            <span className="font-mono font-bold text-foreground">{questions.length}</span> correct.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <button type="button" className="btn btn-primary" onClick={() => router.push("/home/")}>
              Back to home
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => window.location.reload()}>
              Practice again
            </button>
          </div>
        </div>
      </PhoneShell>
    );
  }

  return (
    <PhoneShell activeTab="practice">
      <header className="app-head">
        <Link href="/home/" className="icon-btn" aria-label="Back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </Link>
        <div className="title-block">
          <h1>Practice</h1>
          <p className="sub">Mixed questions</p>
        </div>
        <span className="pill">
          {index + 1} / {questions.length}
        </span>
      </header>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-4">
          <Hearts count={state.progress.hearts} max={state.progress.maxHearts} />
          <span className="text-xs font-mono text-muted">XP {state.progress.xp}</span>
        </div>

        <div className="progress mb-6">
          <span style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
        </div>

        <p className="eyebrow">QUICK DRILL</p>
        <p className="practice-q">{q.question}</p>
        <p className="meta mb-6">{q.hint}</p>

        <AnimatePresence mode="wait">
          {q.type === "short_answer" ? (
            <motion.div key={`input-${index}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
            <motion.div key={`choices-${index}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="stack-sm">
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

        <p className={`feedback mt-4 ${feedbackType}`}>{feedback}</p>

        <div className="btn-row mt-6">
          <button type="button" className="btn btn-secondary" onClick={handleSkip} disabled={locked}>
            Skip
          </button>
          <button type="button" className="btn btn-primary" onClick={handleCheck} disabled={locked || (q.type === "short_answer" ? !input : !selectedOption)}>
            Check
          </button>
        </div>

        <section className="card mt-6">
          <div className="row-between">
            <div>
              <p className="meta">THIS SESSION</p>
              <p className="h3 mt-1">Correct answers</p>
            </div>
            <p className="text-3xl font-mono font-bold text-accent">{score}</p>
          </div>
        </section>
      </motion.div>

      <Celebration show={celebrate} message="Correct!" onDone={() => setCelebrate(false)} />
      <EncouragementToast trigger={encourage} />
    </PhoneShell>
  );
}

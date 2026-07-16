"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { loadState, saveState, loseHeart, recordAnswer } from "@/lib/store";
import { PRACTICE_QUESTIONS } from "@/lib/data";
import { checkAnswer } from "@/lib/scoring";
import AppShell from "@/components/AppShell";
import Hearts from "@/components/Hearts";
import Celebration from "@/components/Celebration";
import EncouragementToast from "@/components/EncouragementToast";
import QuestionRenderer, { getInitialState, isAnswered, QuestionState } from "@/components/QuestionRenderer";

export default function Practice() {
  const router = useRouter();
  const [appState, setAppState] = useState(loadState());
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [state, setState] = useState<QuestionState | null>(null);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"ok" | "bad" | "">("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [encourage, setEncourage] = useState(0);
  const [finished, setFinished] = useState(false);

  const questions = PRACTICE_QUESTIONS;
  const q = questions[index];

  useEffect(() => {
    const s = loadState();
    setAppState(s);
  }, []);

  // Initialize state when question changes
  if (!state || !q || state.type !== q.type) {
    if (q) setState(getInitialState(q));
    return null;
  }

  const handleCheck = () => {
    if (locked || !q) return;
    const { correct, partial } = checkAnswer(q, state);

    setLocked(true);
    recordAnswer(q.topicId, correct, partial);
    setAppState(loadState());

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
      setAppState(loadState());
    }

    setShowExplanation(true);
    setTimeout(() => {
      nextQuestion();
    }, 2000);
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
      setAppState(loadState());
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setState(getInitialState(questions[index + 1]));
    setLocked(false);
    setFeedback("");
    setFeedbackType("");
    setShowExplanation(false);
    setCelebrate(false);
  };

  const handleSkip = () => {
    if (locked) return;
    setLocked(true);
    setFeedback("Skipped. " + q.explanation);
    setFeedbackType("");
    setShowExplanation(true);
    setTimeout(nextQuestion, 1200);
  };

  if (finished) {
    return (
      <AppShell activeTab="practice">
        <div className="pt-10 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          <h1 className="h2">Session complete!</h1>
          <p className="meta mt-2">
            You got <span className="num font-bold" style={{ color: "var(--fg)" }}>{score}</span> of{" "}
            <span className="num font-bold" style={{ color: "var(--fg)" }}>{questions.length}</span> correct.
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
      </AppShell>
    );
  }

  return (
    <AppShell activeTab="practice">
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
        <div className="row-between mb-md">
          <Hearts count={appState.progress.hearts} max={appState.progress.maxHearts} />
          <span className="meta">XP {appState.progress.xp}</span>
        </div>

        <div className="progress mb-md">
          <span style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
        </div>

        <p className="eyebrow">QUICK DRILL</p>
        <p className="practice-q">{q.question}</p>
        {q.hint && <p className="meta mb-md">{q.hint}</p>}

        <QuestionRenderer
          question={q}
          state={state}
          locked={locked}
          onStateChange={setState}
          onSubmit={handleCheck}
        />

        <p className={`feedback ${feedbackType}`}>{feedback}</p>

        {!showExplanation && (
          <div className="btn-row mt-md">
            <button type="button" className="btn btn-secondary" onClick={handleSkip} disabled={locked}>
              Skip
            </button>
            <button type="button" className="btn btn-primary" onClick={handleCheck} disabled={locked || !isAnswered(q, state)}>
              Check
            </button>
          </div>
        )}

        <section className="card mt-lg">
          <div className="row-between">
            <div>
              <p className="meta">THIS SESSION</p>
              <p className="h3 mt-sm">Correct answers</p>
            </div>
            <p className="display-num" style={{ fontSize: 30, color: "var(--accent)" }}>{score}</p>
          </div>
        </section>
      </motion.div>

      <Celebration show={celebrate} message="Correct!" onDone={() => setCelebrate(false)} />
      <EncouragementToast trigger={encourage} />
    </AppShell>
  );
}

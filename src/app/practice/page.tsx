"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { loadState, saveState, loseHeart, recordAnswer } from "@/lib/store";
import { PRACTICE_QUESTIONS } from "@/lib/data";
import { checkAnswer } from "@/lib/scoring";
import { playWrongSound, playHeartLossSound, playCorrectSound } from "@/lib/sounds";
import AppShell from "@/components/AppShell";
import HeaderStats from "@/components/HeaderStats";
import Celebration from "@/components/Celebration";
import EncouragementToast from "@/components/EncouragementToast";
import QuestionRenderer, { getInitialState, isAnswered, QuestionState } from "@/components/QuestionRenderer";
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, Sparkles, Zap, SkipForward } from "lucide-react";

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
  const [shakeHearts, setShakeHearts] = useState(false);

  const questions = PRACTICE_QUESTIONS.length > 0 ? PRACTICE_QUESTIONS : [];
  const q = questions[index];

  useEffect(() => {
    setAppState(loadState());
  }, [index, locked]);

  // Initialize state when question changes
  if (!state || !q || state.type !== q.type) {
    if (q) setState(getInitialState(q));
    return null;
  }

  const handleCheck = () => {
    if (locked || !q || !isAnswered(q, state)) return;
    const { correct, partial } = checkAnswer(q, state);

    setLocked(true);
    recordAnswer(q.topicId, correct, partial);
    setAppState(loadState());

    if (correct) {
      setScore((s) => s + 1);
      setFeedback("Spot on! " + q.explanation);
      setFeedbackType("ok");
      setCelebrate(true);
      setEncourage((n) => n + 1);
      playCorrectSound();
    } else {
      setFeedback("Not quite. " + q.explanation);
      setFeedbackType("bad");
      loseHeart();
      playWrongSound();
      playHeartLossSound();
      setShakeHearts(true);
      setTimeout(() => setShakeHearts(false), 600);
      setAppState(loadState());
    }

    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (index >= questions.length - 1) {
      const s = loadState();
      saveState({
        progress: {
          ...s.progress,
          streakDays: s.progress.streakDays + 1,
          xp: s.progress.xp + score * 15 + 50,
        },
      });
      setCelebrate(false);
      setEncourage(0);
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
    setEncourage(0);
  };

  const handleSkip = () => {
    if (locked || !q) return;
    setLocked(true);
    setFeedback("Question skipped. " + q.explanation);
    setFeedbackType("bad");
    setShowExplanation(true);
  };

  if (finished) {
    const totalXP = score * 15 + 50;
    const accuracy = Math.round((score / questions.length) * 100);

    return (
      <AppShell activeTab="practice" role={appState.profile.role}>
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 26 }}
            className="bg-white rounded-[36px] p-8 max-w-sm w-full border-4 border-amber-400 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600" />

            <motion.div
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-24 h-24 rounded-full bg-amber-100 border-4 border-amber-300 mx-auto flex items-center justify-center text-amber-600 mb-4 shadow-inner"
            >
              <Sparkles className="w-12 h-12 fill-amber-500 text-amber-600" />
            </motion.div>

            <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-900">
              ⚡ Rapid Review Complete
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-2">
              Unstoppable Effort!
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              You correctly solved {score} out of {questions.length} mixed curriculum drills!
            </p>

            <div className="grid grid-cols-2 gap-3 my-6">
              <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200">
                <span className="text-[11px] font-bold uppercase text-amber-800 block">Total XP Gained</span>
                <span className="text-xl font-mono font-black text-amber-950 flex items-center justify-center gap-1 mt-0.5">
                  <Zap className="w-4 h-4 fill-amber-500 text-amber-600" /> +{totalXP} XP
                </span>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200">
                <span className="text-[11px] font-bold uppercase text-emerald-800 block">Review Score</span>
                <span className="text-xl font-mono font-black text-emerald-950 mt-0.5 block">
                  {accuracy}%
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                className="btn btn-primary w-full py-3.5 shadow-md font-extrabold flex items-center justify-center gap-2"
                onClick={() => router.push("/home/")}
              >
                <span>Back to Home</span> <ArrowRight className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="btn btn-secondary w-full py-3.5 font-bold"
                onClick={() => window.location.reload()}
              >
                Practice Again 🔄
              </button>
            </div>
          </motion.div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell activeTab="practice" role={appState.profile.role}>
      <HeaderStats
        profile={appState.profile}
        hearts={appState.progress.hearts}
        maxHearts={appState.progress.maxHearts}
        streakDays={appState.progress.streakDays}
        showClassSwitcher={false}
        shakeHearts={shakeHearts}
      />

      <div className="question-stage px-4 sm:px-6 pt-3 pb-36 max-w-[440px] mx-auto w-full">
        {/* Practice Banner & Progress */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2 bg-amber-100/90 text-amber-950 px-3 py-1 rounded-full border border-amber-300 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
            <span>🔥 2x Streak Multiplier Active</span>
          </div>
          <span className="font-mono text-xs font-black text-slate-500">
            {index + 1}/{questions.length}
          </span>
        </div>

        <div className="progress mb-4">
          <span style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
        </div>

        <motion.div
          key={`practice-q-${index}`}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex flex-col gap-3"
        >
          <p className="eyebrow text-amber-700">MIXED REVIEW DRILL</p>
          <h2 className="practice-q text-slate-900 font-extrabold leading-snug">
            {q.question}
          </h2>

          {q.hint && (
            <div className="flex items-center gap-2 bg-emerald-50/80 border border-emerald-200 text-emerald-950 px-3.5 py-2 rounded-2xl text-xs font-bold mb-1 shadow-2xs">
              <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Hint: {q.hint}</span>
            </div>
          )}

          <div className="mt-2">
            <QuestionRenderer
              question={q}
              state={state}
              locked={locked}
              onStateChange={setState}
              onSubmit={handleCheck}
            />
          </div>

          {!showExplanation && (
            <div className="flex items-center gap-2.5 mt-4 pt-2">
              <button
                type="button"
                className="btn btn-secondary py-3.5 px-4 text-sm font-bold flex items-center justify-center gap-1.5 shrink-0"
                onClick={handleSkip}
                disabled={locked}
              >
                <SkipForward className="w-4 h-4" /> Skip
              </button>
              <button
                type="button"
                className="btn btn-primary grow py-3.5 text-base font-black shadow-md flex items-center justify-center gap-2"
                onClick={handleCheck}
                disabled={locked || !isAnswered(q, state)}
              >
                <span>Check Answer</span>
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Fixed Bottom Feedback Sheet (`Tactile Sheet`) */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className={`feedback-sheet ${feedbackType} fixed sm:absolute bottom-0 left-0 right-0 z-50 p-5 sm:rounded-t-[32px] border-t-4 shadow-[0_-12px_40px_rgba(0,0,0,0.18)] ${
              feedbackType === "ok" ? "bg-emerald-50 border-emerald-500" : "bg-rose-50 border-rose-500"
            }`}
          >
            <div className="max-w-[440px] mx-auto">
              <div className="flex items-center gap-2.5 mb-3">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-sm shrink-0 ${
                  feedbackType === "ok" ? "bg-emerald-600" : "bg-rose-600"
                }`}>
                  {feedbackType === "ok" ? <CheckCircle2 className="w-5 h-5 stroke-[2.8]" /> : <XCircle className="w-5 h-5 stroke-[2.8]" />}
                </div>
                <h3 className={`text-lg font-black ${feedbackType === "ok" ? "text-emerald-950" : "text-rose-950"}`}>
                  {feedbackType === "ok" ? "🎉 Correct! +15 XP" : "❌ Reviewing why"}
                </h3>
              </div>

              <div className="text-[14.5px] font-bold text-slate-700 leading-relaxed bg-white/80 p-3.5 rounded-2xl border border-slate-200/60 mb-4 max-h-[22vh] overflow-y-auto">
                <p className="font-extrabold text-slate-900 mb-1.5">{feedback}</p>
                {q.deepDive ? (
                  q.deepDive.split("\n\n").map((paragraph: string, i: number) => (
                    <p key={i} className="mb-2 last:mb-0 text-slate-600 font-semibold">{paragraph}</p>
                  ))
                ) : null}
              </div>

              <button
                type="button"
                autoFocus
                className={`btn w-full py-4 text-base font-black shadow-md flex items-center justify-center gap-2 ${
                  feedbackType === "ok"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white border-b-4 border-emerald-800 active:border-b-0"
                    : "bg-slate-900 hover:bg-slate-800 text-white border-b-4 border-black active:border-b-0"
                }`}
                onClick={nextQuestion}
              >
                <span>{index === questions.length - 1 ? "Finish Practice Review 🏆" : "Next Question →"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Celebration show={celebrate} message="Spot On!" subMessage="+15 XP Earned" onDone={() => setCelebrate(false)} />
      <EncouragementToast trigger={encourage} playSound={true} />
    </AppShell>
  );
}

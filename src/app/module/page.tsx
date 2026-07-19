"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { loadState, saveState, recordAnswer, loseHeart, consumeEnergy } from "@/lib/store";
import { getTopic, getModule } from "@/lib/data";
import { checkAnswer } from "@/lib/scoring";
import { playWrongSound, playHeartLossSound, playCorrectSound } from "@/lib/sounds";
import AppShell from "@/components/AppShell";
import Celebration from "@/components/Celebration";
import EncouragementToast from "@/components/EncouragementToast";
import Hearts from "@/components/Hearts";
import Streak from "@/components/Streak";
import QuestionRenderer, { getInitialState, isAnswered, QuestionState } from "@/components/QuestionRenderer";
import { SUBJECT_THEMES } from "@/components/SubjectIcons";
import { ArrowLeft, CheckCircle2, XCircle, HelpCircle, Award, ArrowRight, Sparkles } from "lucide-react";

function ModuleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicId = searchParams.get("topic") || "p5-math-fractions";
  const moduleId = searchParams.get("moduleId") || undefined;
  const modData = getModule(topicId, moduleId);
  const topic = modData?.topic || getTopic(topicId);
  const currentModule = modData?.module || (topic?.modules ? topic.modules[0] : undefined);

  const [index, setIndex] = useState(0);
  const [state, setState] = useState<QuestionState | null>(null);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"ok" | "bad" | "">("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [encourage, setEncourage] = useState(0);
  const [finished, setFinished] = useState(false);
  const [appState, setAppState] = useState(loadState());
  const [shakeHearts, setShakeHearts] = useState(false);

  const questions = currentModule?.questions || topic?.questions || [];
  const q = questions[index];

  useEffect(() => {
    setAppState(loadState());
  }, [index, locked]);

  if (!topic || questions.length === 0) {
    return (
      <AppShell showTabBar={false} noScrollPad>
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl mb-4 shadow-inner">
            📚
          </div>
          <h2 className="text-xl font-black text-slate-900">Module Under Construction</h2>
          <p className="text-sm font-semibold text-slate-500 mt-1 max-w-xs">
            We are curating NCDC curriculum questions for this specific module right now.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <Link href="/subjects/" className="btn btn-primary btn-sm">
              Explore Available Modules
            </Link>
            <Link href="/home/" className="btn btn-secondary btn-sm">
              Back to Home
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  // Initialize state when question changes
  if (!state || state.type !== q.type) {
    setState(getInitialState(q));
    return null;
  }

  const handleCheck = () => {
    if (locked || !q || !isAnswered(q, state)) return;

    const hasEnergy = consumeEnergy();
    if (!hasEnergy) {
      alert("⚡ Your energy pool is recharging! Take a quick break or review notes.");
      return;
    }

    const { correct, partial } = checkAnswer(q, state);

    setLocked(true);
    recordAnswer(`${topic.subjectId}-${topic.id}-${currentModule?.id || "m1"}`, correct, partial);
    setAppState(loadState());

    if (correct) {
      setFeedback("That's exactly right! " + q.explanation);
      setFeedbackType("ok");
      setCelebrate(true);
      setEncourage((n) => n + 1);
      playCorrectSound();
    } else {
      loseHeart();
      playWrongSound();
      playHeartLossSound();
      setFeedback("Not quite right. " + q.explanation);
      setFeedbackType("bad");
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
          modulesDone: s.progress.modulesDone + 1,
          xp: s.progress.xp + 35,
        },
        continue: {
          ...s.continue,
          progress: Math.min(100, (s.continue?.progress || 0) + 25),
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

  const theme = SUBJECT_THEMES[topic.subjectId] || SUBJECT_THEMES.math;

  if (finished) {
    const nextModIdx = topic.modules?.findIndex((m) => m.id === currentModule?.id) ?? -1;
    const nextMod = nextModIdx >= 0 && nextModIdx < (topic.modules?.length || 0) - 1 ? topic.modules![nextModIdx + 1] : null;

    return (
      <AppShell showTabBar={false} noScrollPad>
        <div className="flex flex-col items-center justify-center min-h-[85vh] p-6 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            className="bg-white rounded-[36px] p-8 max-w-sm w-full border-4 border-emerald-400 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600" />
            
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-24 h-24 rounded-full bg-emerald-100 border-4 border-emerald-300 mx-auto flex items-center justify-center text-emerald-600 mb-4 shadow-inner"
            >
              <Award className="w-12 h-12 fill-emerald-500 text-emerald-600" />
            </motion.div>

            <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              Module Mastered ⭐
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-2 leading-tight">
              {currentModule?.name || topic.name}
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              You solved all {questions.length} interactive drill questions in this module!
            </p>

            <div className="grid grid-cols-2 gap-3 my-6">
              <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200">
                <span className="text-[11px] font-bold uppercase text-amber-800 block">XP Earned</span>
                <span className="text-xl font-mono font-black text-amber-950 flex items-center justify-center gap-1 mt-0.5">
                  <Sparkles className="w-4 h-4 fill-amber-500 text-amber-600" /> +35 XP
                </span>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200">
                <span className="text-[11px] font-bold uppercase text-emerald-800 block">Accuracy</span>
                <span className="text-xl font-mono font-black text-emerald-950 mt-0.5 block">
                  100%
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              {nextMod ? (
                <button
                  type="button"
                  className="btn btn-primary w-full py-4 shadow-md flex items-center justify-center gap-2 text-base font-extrabold"
                  onClick={() => router.push(`/module/?topic=${encodeURIComponent(topic.id)}&moduleId=${encodeURIComponent(nextMod.id)}`)}
                >
                  <span>Next: {nextMod.name}</span> <ArrowRight className="w-5 h-5 shrink-0" />
                </button>
              ) : null}
              <button
                type="button"
                className={`${nextMod ? "btn btn-secondary" : "btn btn-primary"} w-full py-3.5 font-bold flex items-center justify-center gap-2`}
                onClick={() => router.push("/subjects/")}
              >
                Explore Topic Modules <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                href="/home/"
                className="text-xs font-extrabold text-slate-500 hover:text-slate-800 py-2 inline-block"
              >
                Back to Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell showTabBar={false} noScrollPad>
      {/* Sleek Gamified Header */}
      <header className="app-head flex items-center justify-between pb-3 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <Link href="/subjects/" className="icon-btn shrink-0" aria-label="Back to subjects">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
              <span className={`w-2 h-2 rounded-full shrink-0 ${theme.progressBg}`} />
              <span className="truncate">{topic.name}</span>
            </div>
            <h1 className="text-base font-extrabold text-slate-900 truncate">
              {currentModule?.name || topic.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Streak days={appState.progress.streakDays} className="hidden sm:inline-flex" />
          <div className={shakeHearts ? "animate-shake" : ""}>
            <Hearts count={appState.progress.hearts} max={appState.progress.maxHearts} showCount={true} />
          </div>
        </div>
      </header>

      {/* Main Question Area (`Tactile & Spacious`) */}
      <div className="question-stage px-4 sm:px-6 pt-3 pb-36 max-w-[440px] mx-auto w-full">
        {/* Progress Bar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="progress grow">
            <span style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
          </div>
          <span className="font-mono text-xs font-black text-slate-500 shrink-0">
            {index + 1}/{questions.length}
          </span>
        </div>

        <motion.div
          key={`q-${index}`}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${theme.badgeBg} ${theme.badgeText}`}>
              Question {index + 1}
            </span>
          </div>

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
            <div className="mt-4 pt-2">
              <button
                type="button"
                className="btn btn-primary w-full py-4 text-lg font-black shadow-md flex items-center justify-center gap-2"
                onClick={handleCheck}
                disabled={!isAnswered(q, state)}
              >
                <span>Check Answer</span>
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Fixed Bottom Feedback Sheet (`Tactile Duolingo Sheet`) */}
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
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-sm shrink-0 ${
                    feedbackType === "ok" ? "bg-emerald-600" : "bg-rose-600"
                  }`}>
                    {feedbackType === "ok" ? <CheckCircle2 className="w-5 h-5 stroke-[2.8]" /> : <XCircle className="w-5 h-5 stroke-[2.8]" />}
                  </div>
                  <div>
                    <h3 className={`text-lg font-black ${feedbackType === "ok" ? "text-emerald-950" : "text-rose-950"}`}>
                      {feedbackType === "ok" ? "🎉 Excellent! That's right!" : "❌ Incorrect — let's review why"}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Explanation Paragraphs */}
              <div className="text-[14.5px] font-bold text-slate-700 leading-relaxed bg-white/80 p-3.5 rounded-2xl border border-slate-200/60 mb-4 max-h-[22vh] overflow-y-auto">
                <p className="font-extrabold text-slate-900 mb-1.5">{feedback}</p>
                {q.deepDive ? (
                  q.deepDive.split("\n\n").map((paragraph, i) => (
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
                <span>{index === questions.length - 1 ? "Complete Module ⭐" : "Continue to Next →"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Celebration show={celebrate} message="Brilliant!" onDone={() => setCelebrate(false)} />
      <EncouragementToast trigger={encourage} playSound={true} />
    </AppShell>
  );
}

export default function Module() {
  return (
    <Suspense fallback={<AppShell showTabBar={false} noScrollPad><div className="p-10 text-center font-bold text-slate-500">Loading NCDC quiz module…</div></AppShell>}>
      <ModuleContent />
    </Suspense>
  );
}

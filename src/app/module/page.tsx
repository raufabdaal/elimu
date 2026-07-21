"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { loadState, saveState, recordAnswer, loseHeart, consumeEnergy } from "@/lib/store";
import { getTopic, getModule, getSubjects } from "@/lib/data";
import { checkAnswer, shuffleArray } from "@/lib/scoring";
import { playWrongSound, playHeartLossSound, playCorrectSound } from "@/lib/sounds";
import AppShell from "@/components/AppShell";
import Celebration from "@/components/Celebration";
import EncouragementToast from "@/components/EncouragementToast";
import Hearts from "@/components/Hearts";
import Streak from "@/components/Streak";
import QuestionRenderer, { getInitialState, isAnswered, QuestionState } from "@/components/QuestionRenderer";
import { SUBJECT_THEMES } from "@/components/SubjectIcons";
import { ArrowLeft, CheckCircle2, XCircle, HelpCircle, Award, ArrowRight, Sparkles, Shuffle } from "lucide-react";
import { Question } from "@/lib/types";

function ModuleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicId = searchParams.get("topic") || "p5-math-fractions";
  const moduleId = searchParams.get("moduleId") || undefined;
  const modData = getModule(topicId, moduleId);
  const topic = modData?.topic || getTopic(topicId);
  const currentModule = modData?.module || (topic?.modules ? topic.modules[0] : undefined);

  const [questions, setQuestions] = useState<Question[]>(() => {
    const raw = currentModule?.questions || topic?.questions || [];
    return shuffleArray(raw);
  });
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

  useEffect(() => {
    setAppState(loadState());
  }, [index, locked]);

  useEffect(() => {
    const raw = currentModule?.questions || topic?.questions || [];
    setQuestions(shuffleArray(raw));
    setIndex(0);
    setState(null);
    setLocked(false);
    setFeedback("");
    setFeedbackType("");
    setShowExplanation(false);
    setFinished(false);
  }, [currentModule?.id, topic?.id, currentModule?.questions, topic?.questions]);

  const handleReshuffleModule = () => {
    const raw = currentModule?.questions || topic?.questions || [];
    setQuestions(shuffleArray(raw));
    setIndex(0);
    setState(null);
    setLocked(false);
    setFeedback("");
    setFeedbackType("");
    setShowExplanation(false);
    setCelebrate(false);
    setEncourage(0);
    setFinished(false);
  };

  const q = questions[index];

  if (!topic || questions.length === 0) {
    return (
      <AppShell showTabBar={false} noScrollPad>
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl mb-4 shadow-inner">
            📚
          </div>
          <h2 className="text-xl font-black text-slate-900">Module Under Construction</h2>
          <p className="text-sm font-semibold text-slate-500 mt-1 max-w-xs">
            We are preparing more engaging interactive curriculum exercises for this unit.
          </p>
          <div className="mt-6 flex flex-col gap-3 w-full max-w-[220px]">
            <Link
              href="/subjects/"
              className="btn btn-primary w-full py-3.5 shadow-md font-extrabold flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> <span>Explore Subjects</span>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  // Initialize state when question changes
  if (!state || !q || state.type !== q.type) {
    if (q) setState(getInitialState(q));
    return null;
  }

  const handleCheck = () => {
    if (locked || !q || !isAnswered(q, state)) return;

    const hasEnergy = consumeEnergy();
    if (!hasEnergy) {
      alert("⚡ Your energy pool is recharging! Take a quick break or review notes.");
      return;
    }

    const { correct, partial, keywordMatch } = checkAnswer(q, state);

    setLocked(true);
    recordAnswer(`${topic.subjectId}-${topic.id}-${currentModule?.id || "m1"}`, correct, partial);
    setAppState(loadState());

    if (correct) {
      const prefix = keywordMatch && q.type === "short_answer"
        ? `✨ Keyword Match! Standard model answer: "${q.answer}". `
        : "That's exactly right! ";
      setFeedback(prefix + q.explanation);
      setFeedbackType("ok");
      setCelebrate(true);
      setEncourage((n) => n + 1);
      playCorrectSound();
    } else {
      loseHeart();
      playWrongSound();
      playHeartLossSound();
      const prefix = q.type === "short_answer"
        ? `Standard model answer: "${q.answer}". `
        : "Not quite right. ";
      setFeedback(prefix + q.explanation);
      setFeedbackType("bad");
      setShakeHearts(true);
      setTimeout(() => setShakeHearts(false), 600);
      setAppState(loadState());
    }

    setShowExplanation(true);
    setTimeout(() => {
      const sheetEl = document.querySelector(".feedback-sheet");
      if (sheetEl) {
        sheetEl.scrollIntoView({ behavior: "smooth", block: "end" });
      } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }
    }, 120);
  };

  const nextQuestion = () => {
    if (index >= questions.length - 1) {
      const s = loadState();
      const newModulesDone = s.progress.modulesDone + 1;
      const isMockRequired = newModulesDone % 4 === 0;
      saveState({
        progress: {
          ...s.progress,
          modulesDone: newModulesDone,
          xp: s.progress.xp + 35,
          pendingMockExam: isMockRequired ? true : s.progress.pendingMockExam,
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

  // Determine Topic number and Step number cleanly
  const allSubs = getSubjects(appState.profile.classLevel || "p5");
  const currentSub = allSubs.find((s) => s.id === topic.subjectId);
  const topicIdx = currentSub ? currentSub.topics.findIndex((t) => t.id === topic.id) : -1;
  const modIdx = topic.modules ? topic.modules.findIndex((m) => m.id === currentModule?.id) : -1;
  const cleanTopicName = topicIdx >= 0 ? `Topic ${topicIdx + 1}` : topic.name.split(" (")[0];
  const cleanStepName = modIdx >= 0 ? `Step ${modIdx + 1}` : "Step 1";

  if (finished) {
    const nextModIdx = topic.modules?.findIndex((m) => m.id === currentModule?.id) ?? -1;
    const nextMod = nextModIdx >= 0 && nextModIdx < (topic.modules?.length || 0) - 1 ? topic.modules![nextModIdx + 1] : null;

    return (
      <AppShell showTabBar={false} noScrollPad>
        <div className="flex flex-col items-center justify-center min-h-[85vh] p-6 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 26 }}
            className="bg-white rounded-[36px] p-8 max-w-sm w-full border-4 border-emerald-400 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600" />

            <motion.div
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-24 h-24 rounded-full bg-emerald-100 border-4 border-emerald-300 mx-auto flex items-center justify-center text-emerald-600 mb-4 shadow-inner"
            >
              <Award className="w-12 h-12 stroke-[2.5]" />
            </motion.div>

            <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-900">
              🎉 {cleanStepName} Completed
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-2">
              Outstanding Work!
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              You successfully mastered <span className="text-slate-900 font-bold">{cleanTopicName} ({cleanStepName})</span>
            </p>

            <div className="grid grid-cols-2 gap-3 my-6">
              <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200">
                <span className="text-[11px] font-bold uppercase text-amber-800 block">Reward Earned</span>
                <span className="text-xl font-mono font-black text-amber-950 flex items-center justify-center gap-1 mt-0.5">
                  <Sparkles className="w-4 h-4 text-amber-600 fill-amber-400" /> +35 XP
                </span>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200">
                <span className="text-[11px] font-bold uppercase text-emerald-800 block">Mastery Score</span>
                <span className="text-xl font-mono font-black text-emerald-950 mt-0.5 block">
                  100%
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              {nextMod ? (
                <Link
                  href={`/module?topic=${topic.id}&moduleId=${nextMod.id}`}
                  className="btn btn-primary w-full py-3.5 shadow-md font-extrabold flex items-center justify-center gap-2"
                >
                  <span>Start Next Step</span> <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  href={`/subjects/`}
                  className="btn btn-primary w-full py-3.5 shadow-md font-extrabold flex items-center justify-center gap-2"
                >
                  <span>Back to Subjects</span> <ArrowRight className="w-5 h-5" />
                </Link>
              )}

              <button
                type="button"
                className="btn btn-secondary w-full py-3 font-bold flex items-center justify-center gap-2 text-xs"
                onClick={handleReshuffleModule}
              >
                <Shuffle className="w-4 h-4" /> Practice Again (Shuffled) 🔀
              </button>
            </div>
          </motion.div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell showTabBar={false} noScrollPad>
      {/* Sticky Header (`Crisp & Clutter-Free`) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/60 px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/subjects/`}
            className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-95 transition-all shrink-0 shadow-2xs"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-sm font-extrabold text-slate-900 truncate">
              {cleanTopicName}
            </h1>
            <p className="text-[11px] font-bold text-slate-500 truncate">
              {cleanStepName} · {topic.name.split(" (")[0]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Streak days={appState.progress.streakDays} className="hidden sm:inline-flex" />
          <div className={shakeHearts ? "animate-shake" : ""}>
            <Hearts count={appState.progress.hearts} max={appState.progress.maxHearts} showCount={true} />
          </div>
        </div>
      </header>

      {/* Main Question Area */}
      <div className="question-stage px-4 sm:px-8 lg:px-12 pt-4 pb-48 max-w-[460px] md:max-w-2xl lg:max-w-3xl mx-auto w-full">
        {/* Module Step Switcher Bar */}
        {topic.modules && topic.modules.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-3 no-scrollbar border-b border-slate-200/60">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1 shrink-0">
              Steps:
            </span>
            {topic.modules.map((mod, mIdx) => {
              const isCurrentMod = mod.id === currentModule?.id;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => router.push(`/module/?topic=${encodeURIComponent(topic.id)}&moduleId=${encodeURIComponent(mod.id)}`)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 border ${
                    isCurrentMod
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : mod.completed
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span>Step {mIdx + 1}</span>
                  {mod.completed && <span>✓</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* Progress Bar with Clean Icon Shuffle */}
        <div className="flex items-center gap-3 mb-5">
          <div className="progress grow">
            <span style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
          </div>
          <button
            type="button"
            onClick={handleReshuffleModule}
            title="Reshuffle Questions"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 flex items-center justify-center transition-colors shrink-0 shadow-2xs border border-slate-200/80 active:scale-95"
          >
            <Shuffle className="w-4 h-4 stroke-[2.5]" />
          </button>
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
              <span>Hint: {q.hint.replace(/^hint:\s*/i, "")}</span>
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

      {/* Fixed Bottom Feedback Sheet */}
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
            <div className="max-w-[460px] md:max-w-2xl lg:max-w-3xl mx-auto">
              <div className="flex items-center gap-2.5 mb-3">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-sm shrink-0 ${
                  feedbackType === "ok" ? "bg-emerald-600" : "bg-rose-600"
                }`}>
                  {feedbackType === "ok" ? <CheckCircle2 className="w-5 h-5 stroke-[2.8]" /> : <XCircle className="w-5 h-5 stroke-[2.8]" />}
                </div>
                <h3 className={`text-lg font-black ${feedbackType === "ok" ? "text-emerald-950" : "text-rose-950"}`}>
                  {feedbackType === "ok" ? "🎉 Excellent! +15 XP" : "❌ Let's Review"}
                </h3>
              </div>

              <div className="text-[14px] sm:text-[14.5px] font-bold text-slate-700 leading-relaxed bg-white/90 p-4 rounded-2xl border border-slate-200/80 mb-4 max-h-[28vh] sm:max-h-[30vh] overflow-y-auto shadow-inner">
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
                <span>{index === questions.length - 1 ? "Finish Step 🏁" : "Continue to Next →"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Celebration show={celebrate} message="Well Done!" subMessage="+15 XP Earned" onDone={() => setCelebrate(false)} />
      <EncouragementToast trigger={encourage} playSound={true} />
    </AppShell>
  );
}

export default function ModulePage() {
  return (
    <Suspense
      fallback={
        <AppShell showTabBar={false}>
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </AppShell>
      }
    >
      <ModuleContent />
    </Suspense>
  );
}

"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { loadState, saveState, loseHeart, recordAnswer } from "@/lib/store";
import { PRACTICE_QUESTIONS } from "@/lib/data";
import { checkAnswer, shuffleArray } from "@/lib/scoring";
import { playWrongSound, playHeartLossSound, playCorrectSound } from "@/lib/sounds";
import AppShell from "@/components/AppShell";
import HeaderStats from "@/components/HeaderStats";
import Celebration from "@/components/Celebration";
import EncouragementToast from "@/components/EncouragementToast";
import QuestionRenderer, { getInitialState, isAnswered, QuestionState } from "@/components/QuestionRenderer";
import { SubjectIcon, SUBJECT_THEMES } from "@/components/SubjectIcons";
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, Sparkles, Zap, SkipForward, Shuffle, Filter, Award } from "lucide-react";
import { Question, SubjectId } from "@/lib/types";

function PracticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMockMode = searchParams.get("mode") === "mock";
  const batchSize = isMockMode ? 20 : 15;

  const [appState, setAppState] = useState(loadState());
  const [activeSub, setActiveSub] = useState<"all" | SubjectId>("all");
  const [questions, setQuestions] = useState<Question[]>(() => {
    const pool = PRACTICE_QUESTIONS.length > 0 ? PRACTICE_QUESTIONS : [];
    return shuffleArray(pool).slice(0, batchSize);
  });
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

  const q = questions[index];

  useEffect(() => {
    setAppState(loadState());
  }, [index, locked]);

  useEffect(() => {
    const pool = PRACTICE_QUESTIONS.length > 0 ? PRACTICE_QUESTIONS : [];
    setQuestions(shuffleArray(pool).slice(0, batchSize));
    setIndex(0);
    setState(null);
    setLocked(false);
    setFinished(false);
  }, [isMockMode, batchSize]);

  const handleSelectSubject = (sub: "all" | SubjectId) => {
    if (isMockMode) return;
    setActiveSub(sub);
    const pool = PRACTICE_QUESTIONS.filter((item) => {
      if (sub === "all") return true;
      return item.topicId?.startsWith(`${sub}-`) || item.topicId?.includes(`-${sub}-`) || item.id.startsWith(sub);
    });
    setQuestions(shuffleArray(pool).slice(0, batchSize));
    setIndex(0);
    setState(null);
    setLocked(false);
    setFeedback("");
    setFeedbackType("");
    setShowExplanation(false);
    setFinished(false);
  };

  // Initialize state when question changes
  if (!state || !q || state.type !== q.type) {
    if (q) setState(getInitialState(q));
    return null;
  }

  const handleReshuffle = () => {
    const pool = PRACTICE_QUESTIONS.filter((item) => {
      if (activeSub === "all" || isMockMode) return true;
      return item.topicId?.startsWith(`${activeSub}-`) || item.topicId?.includes(`-${activeSub}-`) || item.id.startsWith(activeSub);
    });
    setQuestions(shuffleArray(pool).slice(0, batchSize));
    setIndex(0);
    setState(null);
    setLocked(false);
    setFeedback("");
    setFeedbackType("");
    setShowExplanation(false);
    setCelebrate(false);
    setEncourage(0);
  };

  const handleCheck = () => {
    if (locked || !q || !isAnswered(q, state)) return;
    const { correct, partial, keywordMatch } = checkAnswer(q, state);

    setLocked(true);
    recordAnswer(q.topicId || "general-practice", correct, partial);
    setAppState(loadState());

    if (correct) {
      setScore((s) => s + 1);
      const prefix = keywordMatch && q.type === "short_answer"
        ? `✨ Keyword Match! Standard model answer: "${q.answer}". `
        : "Spot on! ";
      setFeedback(prefix + q.explanation);
      setFeedbackType("ok");
      setCelebrate(true);
      setEncourage((n) => n + 1);
      playCorrectSound();
    } else {
      const prefix = q.type === "short_answer"
        ? `Standard model answer: "${q.answer}". `
        : "Not quite. ";
      setFeedback(prefix + q.explanation);
      setFeedbackType("bad");
      loseHeart();
      playWrongSound();
      playHeartLossSound();
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
      const accuracy = Math.round((score / questions.length) * 100);
      saveState({
        progress: {
          ...s.progress,
          streakDays: s.progress.streakDays + 1,
          xp: s.progress.xp + score * 15 + (isMockMode ? 100 : 50),
          pendingMockExam: isMockMode ? false : s.progress.pendingMockExam,
          lastMockScore: isMockMode ? accuracy : s.progress.lastMockScore,
          mockExamsPassed: isMockMode ? (s.progress.mockExamsPassed || 0) + 1 : s.progress.mockExamsPassed,
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
    const prefix = q.type === "short_answer" ? `Model answer: "${q.answer}". ` : "Question skipped. ";
    setFeedback(prefix + q.explanation);
    setFeedbackType("bad");
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

  const subCode = q.topicId?.split("-")[1] || (q.topicId?.startsWith("p") ? q.topicId.split("-")[1] : "math");
  const subTheme = SUBJECT_THEMES[subCode as SubjectId] || SUBJECT_THEMES.math;
  const rawTopicName = q.topicId?.split("-").slice(2).join(" ").toUpperCase() || "CORE DRILL";

  if (finished) {
    const totalXP = score * 15 + (isMockMode ? 100 : 50);
    const accuracy = Math.round((score / questions.length) * 100);

    return (
      <AppShell activeTab="practice" role={appState.profile.role} showTabBar={false} noScrollPad={true}>
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 26 }}
            className={`bg-white rounded-[36px] p-8 max-w-sm w-full border-4 shadow-2xl relative overflow-hidden ${
              isMockMode ? "border-emerald-500" : "border-amber-400"
            }`}
          >
            <div className={`absolute top-0 left-0 right-0 h-2 ${
              isMockMode
                ? "bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600"
                : "bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600"
            }`} />

            <motion.div
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={`w-24 h-24 rounded-full border-4 mx-auto flex items-center justify-center mb-4 shadow-inner ${
                isMockMode
                  ? "bg-emerald-100 border-emerald-300 text-emerald-600"
                  : "bg-amber-100 border-amber-300 text-amber-600"
              }`}
            >
              {isMockMode ? <Award className="w-12 h-12 stroke-[2.5]" /> : <Sparkles className="w-12 h-12 fill-amber-500 text-amber-600" />}
            </motion.div>

            <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
              isMockMode ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"
            }`}>
              {isMockMode ? "🎓 Weekly Mock Verified ✓" : "⚡ Practice Session Complete"}
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-2">
              {isMockMode ? "Checkpoint Passed!" : "Unstoppable Effort!"}
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              You correctly solved {score} out of {questions.length} {isMockMode ? "weekly mock exam" : "curriculum"} drills!
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
                onClick={() => router.push("/subjects/")}
              >
                <span>Back to Subjects</span> <ArrowRight className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="btn btn-secondary w-full py-3.5 font-bold flex items-center justify-center gap-2"
                onClick={() => {
                  handleReshuffle();
                  setFinished(false);
                }}
              >
                <span>{isMockMode ? "Take Another Mock 🔄" : "Practice Again 🔄"}</span>
              </button>
            </div>
          </motion.div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell activeTab="practice" role={appState.profile.role} showTabBar={false} noScrollPad={true}>
      <HeaderStats
        profile={appState.profile}
        hearts={appState.progress.hearts}
        maxHearts={appState.progress.maxHearts}
        streakDays={appState.progress.streakDays}
        showClassSwitcher={false}
        shakeHearts={shakeHearts}
      />

      <div className="question-stage px-4 sm:px-8 lg:px-12 pt-4 pb-48 max-w-[460px] md:max-w-2xl lg:max-w-3xl mx-auto w-full">
        {/* Subject / Topic Filter Bar (`Hidden in Mock Mode`) */}
        {!isMockMode ? (
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-2 no-scrollbar border-b border-slate-200/60">
            <button
              type="button"
              onClick={() => handleSelectSubject("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 border ${
                activeSub === "all"
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm scale-105"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Mixed Practice</span>
            </button>
            {(["math", "sst", "sci", "eng"] as SubjectId[]).map((s) => {
              const isSel = activeSub === s;
              const theme = SUBJECT_THEMES[s];
              const names: Record<SubjectId, string> = { math: "Mathematics", sst: "Social Studies", sci: "Science", eng: "English" };
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSelectSubject(s)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 border ${
                    isSel
                      ? `${theme.iconBg} text-white border-transparent shadow-sm scale-105`
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <SubjectIcon subjectId={s} className="w-4 h-4 stroke-[2.4]" />
                  <span>{names[s]}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-200/80 bg-emerald-50/70 px-4 py-2.5 rounded-2xl">
            <span className="text-xs font-black uppercase text-emerald-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" /> Weekly Mock Examination Checkpoint
            </span>
            <span className="text-[11px] font-bold text-emerald-700 font-mono">
              20 Questions Required
            </span>
          </div>
        )}

        {/* Practice Banner & Progress (`Zero 4,363 Count Display`) */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2 bg-amber-100/90 text-amber-950 px-3 py-1 rounded-full border border-amber-300 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
            <span>{isMockMode ? "🎓 Mock Exam in Progress" : "🔥 2x Streak Multiplier Active"}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReshuffle}
              title="Reshuffle Questions"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-700 flex items-center justify-center transition-colors shrink-0 shadow-2xs border border-slate-200/80 active:scale-95"
            >
              <Shuffle className="w-4 h-4 stroke-[2.5]" />
            </button>
            <span className="font-mono text-xs font-black text-slate-500">
              {index + 1}/{questions.length}
            </span>
          </div>
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
          {/* Subject & Topic Badge */}
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5 ${subTheme.badgeBg} ${subTheme.badgeText}`}>
              <SubjectIcon subjectId={subCode as SubjectId} className="w-3.5 h-3.5 stroke-[2.4]" />
              <span>{rawTopicName}</span>
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
                  {feedbackType === "ok" ? "🎉 Correct! +15 XP" : "❌ Reviewing why"}
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

export default function Practice() {
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
      <PracticeContent />
    </Suspense>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { loadState } from "@/lib/store";
import { getSubjects } from "@/lib/data";
import { AppState, Subject } from "@/lib/types";
import AppShell from "@/components/AppShell";
import HeaderStats from "@/components/HeaderStats";
import { SubjectIcon, SUBJECT_THEMES } from "@/components/SubjectIcons";
import { Flame, Send, CheckCircle2, BarChart2, Share2, Award, Sparkles } from "lucide-react";

export default function Parent() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sentToast, setSentToast] = useState<string | null>(null);

  useEffect(() => {
    const s = loadState();
    setState(s);
    setSubjects(getSubjects(s.profile.classLevel || "p5"));
  }, []);

  if (!state) return null;

  const { profile, progress, session, continue: continueState } = state;
  const isLinked = !!profile.linkedStudentId || profile.role === "parent";
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const maxWeeklyMin = Math.max(...session.weeklyMinutes, 40);

  const handleSendCheers = (cheer: string) => {
    try {
      const existing = JSON.parse(localStorage.getItem("elimu_inbox_cheers") || "[]");
      const newCheer = {
        id: Date.now().toString(),
        text: cheer,
        sender: "Parent Portal",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      localStorage.setItem("elimu_inbox_cheers", JSON.stringify([newCheer, ...existing]));
    } catch (e) {
      console.error(e);
    }
    setSentToast(`Sent "${cheer}" directly to ${profile.name || "your child"}'s inbox! ✨`);
    setTimeout(() => {
      setSentToast(null);
    }, 2800);
  };

  const handleShareReport = () => {
    const text = `🌟 ELIMU UGANDA WEEKLY REPORT CARD 🌟\n\nStudent: ${profile.name || "Amina"} (${(profile.classLevel || "p5").toUpperCase()})\nWeekly Accuracy: ${progress.practiceAccuracy}%\nConsistency Streak: 🔥 ${progress.streakDays} Days\nCurriculum Coverage: ${progress.modulesDone} Modules Completed\nLatest Mock Exam: ${progress.lastMockScore || 85}% (${progress.mockExamsPassed || 2} Passed Checkpoints)\n\nVerified by Elimu Edtech • NCDC Primary Aligned 🚀`;
    if (navigator.share) {
      navigator.share({
        title: "Elimu Uganda Weekly Report Card",
        text: text,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setSentToast("Copied weekly report card! Share via WhatsApp or SMS 📋✨");
      setTimeout(() => setSentToast(null), 2800);
    }
  };

  return (
    <AppShell activeTab="parent" role="parent">
      <HeaderStats
        profile={{ ...profile, role: "parent" }}
        hearts={progress.hearts}
        maxHearts={progress.maxHearts}
        streakDays={progress.streakDays}
        showClassSwitcher={true}
        onClassChange={(newClass) => {
          const updated: AppState = { ...state, profile: { ...state.profile, classLevel: newClass } };
          setState(updated);
          setSubjects(getSubjects(newClass));
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-5 pt-3"
      >
        {/* Toast Notification when Parent sends encouragement */}
        <AnimatePresence>
          {sentToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed sm:absolute top-20 left-4 right-4 z-[70] bg-emerald-900 text-white font-extrabold text-sm px-4 py-3 rounded-2xl shadow-xl border border-emerald-600 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{sentToast}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isLinked && (
          <section className="card bg-amber-50 border-amber-300 p-4 text-slate-900">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <span className="text-[11px] font-black uppercase text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
                  Pairing Required
                </span>
                <h3 className="text-base font-black text-amber-950 mt-1">
                  Link your child&apos;s student account
                </h3>
                <p className="text-xs font-semibold text-amber-900/80 mt-0.5 leading-relaxed">
                  Enter their 6-digit numeric code (e.g., 739104) to track real-time study habits and struggle areas.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm py-2.5 px-4 rounded-xl mt-3 shadow-xs"
              onClick={() => router.push("/onboarding/")}
            >
              Link Student Account →
            </button>
          </section>
        )}

        {/* Executive Pupil Overview Card (`Explicit Indigo Card — guaranteed dark background & white text`) */}
        <section className="card card-indigo p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/10 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-black text-xl flex items-center justify-center shadow-md shrink-0">
                {(profile.name || "S").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-black text-white truncate">{profile.name || "Pupil"}</h2>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10.5px] font-extrabold uppercase px-2 py-0.5 rounded-full shrink-0">
                    Active Link
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-300 mt-0.5 truncate">
                  Primary {(profile.classLevel || "p5").toUpperCase().replace("P", "")} · Uganda NCDC Curriculum
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div className="bg-white/10 rounded-2xl p-3 border border-white/10 text-center backdrop-blur-xs">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-300 block truncate">Day Streak</span>
              <span className="text-2xl font-mono font-black text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                <Flame className="w-5 h-5 fill-amber-400 shrink-0" /> {progress.streakDays}
              </span>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 border border-white/10 text-center backdrop-blur-xs">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-300 block truncate">Accuracy</span>
              <span className="text-2xl font-mono font-black text-emerald-400 mt-0.5 block">
                {progress.practiceAccuracy}%
              </span>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 border border-white/10 text-center backdrop-blur-xs">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-300 block truncate">Modules Done</span>
              <span className="text-2xl font-mono font-black text-white mt-0.5 block">
                {progress.modulesDone}
              </span>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 border border-white/10 text-center backdrop-blur-xs">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-300 block truncate">Today&apos;s Time</span>
              <span className="text-2xl font-mono font-black text-cyan-300 mt-0.5 block">
                {session.todayMinutes}m
              </span>
            </div>
          </div>

          <p className="text-xs font-semibold text-slate-300 mt-4 bg-black/20 p-3 rounded-xl border border-white/10 leading-relaxed">
            💡 <strong>Parent Insight:</strong> {profile.name || "Your child"} is maintaining an excellent {progress.practiceAccuracy}% practice accuracy on {continueState.topic || "Fractions"}. A 5-minute review drill tonight keeps them right on track!
          </p>
        </section>

        {/* Send Encouragement to Pupil (`Interactive Parent Feature`) */}
        <section className="card bg-white p-4 border-2 border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Send Live Encouragement</span>
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Tap to send instant cheer directly to {profile.name || "your child"}&apos;s screen during their study session!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => handleSendCheers("High Five! 🙌")}
              className="p-3 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all group flex items-center justify-between"
            >
              <div className="min-w-0">
                <div className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-950 truncate">🙌 High Five!</div>
                <div className="text-[11px] text-slate-500 truncate">Boost motivation</div>
              </div>
              <span className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center font-bold text-sm transition-colors shrink-0 ml-2">
                +✨
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSendCheers("Proud of your streak! 🔥")}
              className="p-3 rounded-2xl border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 text-left transition-all group flex items-center justify-between"
            >
              <div className="min-w-0">
                <div className="font-extrabold text-sm text-slate-900 group-hover:text-amber-950 truncate">🔥 Keep the Streak!</div>
                <div className="text-[11px] text-slate-500 truncate">Celebrate habit</div>
              </div>
              <span className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center font-bold text-sm transition-colors shrink-0 ml-2">
                +🔥
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSendCheers("You're a super scholar! 🌟")}
              className="p-3 rounded-2xl border-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 text-left transition-all group flex items-center justify-between"
            >
              <div className="min-w-0">
                <div className="font-extrabold text-sm text-slate-900 group-hover:text-purple-950 truncate">🌟 Super Scholar!</div>
                <div className="text-[11px] text-slate-500 truncate">Praise effort</div>
              </div>
              <span className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center font-bold text-sm transition-colors shrink-0 ml-2">
                +🌟
              </span>
            </button>
          </div>
        </section>

        {/* Weekly Study Habits Bar Chart */}
        <section className="card bg-white p-5 border-2 border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 flex-wrap gap-2">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>7-Day Study Activity</span>
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Daily active learning minutes across subjects
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 shrink-0">
              Total: {session.weeklyMinutes.reduce((a, b) => a + b, 0)} min
            </span>
          </div>

          <div className="flex items-end justify-between gap-1.5 sm:gap-2 h-32 pt-2 px-1">
            {session.weeklyMinutes.map((mins, idx) => {
              const heightPct = Math.round((mins / maxWeeklyMin) * 100);
              const isToday = idx === 4; // Friday or current demo day

              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 sm:gap-2 flex-1 h-full justify-end">
                  <div className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-600">
                    {mins > 0 ? `${mins}m` : ""}
                  </div>
                  <div className="w-full max-w-[32px] bg-slate-100 rounded-t-xl h-24 flex items-end overflow-hidden p-0.5 border border-slate-200">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(6, heightPct)}%` }}
                      transition={{ duration: 0.6, delay: idx * 0.05 }}
                      className={`w-full rounded-t-lg ${
                        isToday ? "bg-gradient-to-t from-emerald-600 to-teal-400" : mins > 0 ? "bg-slate-700" : "bg-slate-200"
                      }`}
                    />
                  </div>
                  <span className={`text-[11px] sm:text-xs font-bold ${isToday ? "text-emerald-700 underline font-black" : "text-slate-500"}`}>
                    {daysOfWeek[idx]}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4 Core Subjects Mastery Breakdown */}
        <section className="card bg-white p-5 border-2 border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 flex-wrap gap-2">
            <div>
              <h3 className="text-base font-black text-slate-900">NCDC Core Subjects Breakdown</h3>
              <p className="text-xs font-semibold text-slate-500">
                Curriculum coverage for Primary {(profile.classLevel || "p5").toUpperCase().replace("P", "")}
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
              4 Subjects
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {subjects.map((sub) => {
              const theme = SUBJECT_THEMES[sub.id] || SUBJECT_THEMES.math;
              const completedTopics = sub.topics.filter((t) => t.completed).length;
              const totalTopics = sub.topics.length;
              const pct = totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0;

              return (
                <div key={sub.id} className="flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-50/70 border border-slate-200/60">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 ${theme.iconBg}`}>
                        <SubjectIcon subjectId={sub.id} className="w-4 h-4 stroke-[2.4]" />
                      </div>
                      <span className="font-extrabold text-sm text-slate-900 truncate">{sub.name}</span>
                    </div>
                    <span className="font-mono text-xs font-black text-slate-700 shrink-0">
                      {completedTopics}/{totalTopics} topics ({pct}%)
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden mt-1 p-0.5">
                    <div
                      className={`h-full rounded-full ${theme.progressBg} transition-all duration-500`}
                      style={{ width: `${Math.max(6, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Shareable Weekly Report Card (`Organic Branded Marketing`) */}
        <section className="card bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 relative overflow-hidden text-white border-2 border-indigo-400/40 shadow-xl rounded-[32px]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between pb-4 border-b border-white/15 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-sm shrink-0">
                <Award className="w-6 h-6 stroke-[2.4]" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                  Official Verification
                </span>
                <h3 className="text-lg font-black text-white">
                  Weekly Scholar Report Card
                </h3>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-white/10 px-3 py-1 rounded-xl border border-white/15">
              ELIMU EDTECH
            </span>
          </div>

          <div className="my-5 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-3 backdrop-blur-xs">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
              <span className="text-xs text-slate-300 font-bold">Student Name:</span>
              <span className="text-sm font-black text-white">{profile.name || "Amina"} · {(profile.classLevel || "p5").toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Accuracy</span>
                <span className="text-base font-mono font-black text-emerald-400 mt-0.5 block">{progress.practiceAccuracy}%</span>
              </div>
              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Streak</span>
                <span className="text-base font-mono font-black text-amber-400 mt-0.5 block">🔥 {progress.streakDays}d</span>
              </div>
              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Mastered</span>
                <span className="text-base font-mono font-black text-cyan-300 mt-0.5 block">{progress.modulesDone}</span>
              </div>
              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Mock Exam</span>
                <span className="text-base font-mono font-black text-purple-300 mt-0.5 block">{progress.lastMockScore || 85}% ✓</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-left w-full sm:w-auto min-w-0">
              <span className="text-xs font-extrabold text-emerald-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 shrink-0" /> Branded Family Certificate
              </span>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                Share this weekly summary on WhatsApp & family groups!
              </p>
            </div>
            <button
              type="button"
              onClick={handleShareReport}
              className="btn bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs sm:text-sm py-3 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shrink-0 w-full sm:w-auto"
            >
              <Share2 className="w-4 h-4 stroke-[2.4]" />
              <span>Share Report Card</span>
            </button>
          </div>
        </section>
      </motion.div>
    </AppShell>
  );
}

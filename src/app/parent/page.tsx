"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { freshLearningState, loadState } from "@/lib/store";
import { getSubjects } from "@/lib/data";
import { AppState, Subject } from "@/lib/types";
import { CloudAnswerEvent, getFirstLinkedStudentSummary } from "@/lib/cloud-profile";
import AppShell from "@/components/AppShell";
import HeaderStats from "@/components/HeaderStats";
import SubscriptionNotice from "@/components/SubscriptionNotice";
import { SubjectIcon, SUBJECT_THEMES } from "@/components/SubjectIcons";
import { Flame, Send, CheckCircle2, BarChart2, Share2, Award, Sparkles, Target, Clock, BookOpen, MessageSquareHeart } from "lucide-react";

export default function Parent() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sentToast, setSentToast] = useState<string | null>(null);
  const [hasLinkedCloudStudent, setHasLinkedCloudStudent] = useState(false);
  const [recentEvents, setRecentEvents] = useState<CloudAnswerEvent[]>([]);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  useEffect(() => {
    const loadParentDashboard = async () => {
      const local = loadState();
      setState(local);
      setSubjects(getSubjects(local.profile.classLevel || "p5"));

      const linked = await getFirstLinkedStudentSummary().catch(() => null);
      if (!linked) return;
      setHasLinkedCloudStudent(true);
      setRecentEvents(linked.recentEvents || []);
      setLastSyncedAt(linked.snapshot?.synced_at || null);

      const classLevel = linked.profile.class_level || linked.student?.class_level || "p5";
      const fresh = freshLearningState({
        role: "learner",
        name: linked.profile.full_name,
        classLevel,
      });

      const childState: AppState = {
        ...fresh,
        progress: {
          ...fresh.progress,
          ...(linked.snapshot?.progress_json || {}),
        },
        session: {
          ...fresh.session,
          ...(linked.snapshot?.session_json || {}),
        },
        topicProgress: linked.snapshot?.topic_progress_json || {},
        continue: linked.snapshot?.continue_json || {},
      };

      setState(childState);
      setSubjects(getSubjects(classLevel));
    };

    loadParentDashboard();
  }, []);

  const handleSendCheers = (cheer: string) => {
    if (!state) return;
    try {
      const existing = JSON.parse(localStorage.getItem("elimu_inbox_cheers") || "[]");
      const newCheer = {
        id: Date.now().toString(),
        text: cheer,
        sender: "Parent",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      localStorage.setItem("elimu_inbox_cheers", JSON.stringify([newCheer, ...existing]));
    } catch (e) {
      console.error(e);
    }
    setSentToast(`Encouragement sent to ${state.profile.name || "your child"}.`);
    setTimeout(() => setSentToast(null), 2600);
  };

  const subjectStats = useMemo(() => {
    const topicProgressForStats = state?.topicProgress || {};
    return subjects.map((sub) => {
      const completedTopics = sub.topics.filter((t) => t.completed).length;
      const totalTopics = sub.topics.length;
      const coverage = totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0;
      const subjectEvents = recentEvents.filter((event) => event.subject_id === sub.id || event.topic_id?.startsWith(`${sub.id}-`));
      const eventAttempts = subjectEvents.length;
      const eventScore = subjectEvents.reduce((sum, event) => sum + Number(event.partial_score || 0), 0);
      const relatedProgress = Object.entries(topicProgressForStats).filter(([key]) =>
        key.includes(`${sub.id}-`) || key.includes(`-${sub.id}-`) || key.startsWith(sub.id)
      );
      const progressAttempts = relatedProgress.reduce((sum, [, value]) => sum + (value.attempts || 0), 0);
      const progressAccuracy = progressAttempts
        ? Math.round(
            relatedProgress.reduce((sum, [, value]) => sum + (value.accuracy || 0) * (value.attempts || 0), 0) / progressAttempts * 100
          )
        : Math.max(coverage, 0);
      const attempts = eventAttempts || progressAttempts;
      const accuracy = eventAttempts ? Math.round((eventScore / eventAttempts) * 100) : progressAccuracy;
      return {
        ...sub,
        completedTopics,
        totalTopics,
        coverage,
        attempts,
        accuracy,
      };
    });
  }, [subjects, state?.topicProgress, recentEvents]);

  const weakestSubject = useMemo(() => {
    if (!subjectStats.length) return null;
    return [...subjectStats].sort((a, b) => {
      const aScore = a.attempts ? a.accuracy : a.coverage;
      const bScore = b.attempts ? b.accuracy : b.coverage;
      return aScore - bScore;
    })[0];
  }, [subjectStats]);

  const strongestSubject = useMemo(() => {
    if (!subjectStats.length) return null;
    return [...subjectStats].sort((a, b) => b.coverage + b.accuracy - (a.coverage + a.accuracy))[0];
  }, [subjectStats]);

  if (!state) return null;

  const { profile, progress, session } = state;
  const studentName = profile.name || "Student";
  const classLabel = (profile.classLevel || "p5").toUpperCase();
  const isLinked = hasLinkedCloudStudent || !!profile.linkedStudentId || profile.role === "parent";
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyTotal = session.weeklyMinutes.reduce((a, b) => a + b, 0);
  const activeDays = session.weeklyMinutes.filter((mins) => mins > 0).length;
  const maxWeeklyMin = Math.max(...session.weeklyMinutes, 40);
  const recentAttempts = recentEvents.length;
  const recentAccuracy = recentAttempts
    ? Math.round((recentEvents.reduce((sum, event) => sum + Number(event.partial_score || 0), 0) / recentAttempts) * 100)
    : progress.practiceAccuracy;
  const lastSyncedText = lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    : "Waiting for first sync";

  const needsSupportText = weakestSubject
    ? `${studentName} needs the most support in ${weakestSubject.name}. A short focused practice today will help.`
    : `${studentName} needs a short focused practice session today.`;
  const parentAction = weakestSubject
    ? `Ask ${studentName} to complete one ${weakestSubject.name} practice set, then send encouragement after the session.`
    : `Ask ${studentName} to complete one practice set, then send encouragement after the session.`;

  const handleShareReport = () => {
    const weakLine = weakestSubject ? `Needs Support: ${weakestSubject.name}` : "Needs Support: Keep practising steadily";
    const text = `ELIMU UGANDA WEEKLY REPORT\n\nStudent: ${studentName} (${classLabel})\nStudy Time: ${weeklyTotal} minutes across ${activeDays} active day(s)\nRecent Accuracy: ${recentAccuracy}%\nRecent Questions: ${recentAttempts}\nStreak: ${progress.streakDays} day(s)\nLessons Completed: ${progress.modulesDone}\nLatest Mock Exam: ${progress.lastMockScore ? `${progress.lastMockScore}%` : "Not taken yet"}\nLast Updated: ${lastSyncedText}\n${weakLine}\n\nSuggested Parent Action: ${parentAction}\n\nElimu Uganda`;
    if (navigator.share) {
      navigator.share({ title: "Elimu Uganda Weekly Report", text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setSentToast("Weekly report copied. You can share it by WhatsApp or SMS.");
      setTimeout(() => setSentToast(null), 2600);
    }
  };

  return (
    <AppShell activeTab="parent" role="parent">
      <HeaderStats
        profile={{ ...profile, role: "parent" }}
        hearts={progress.hearts}
        maxHearts={progress.maxHearts}
        streakDays={progress.streakDays}
        showClassSwitcher={false}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-5 pt-3"
      >
        <SubscriptionNotice />

        <AnimatePresence>
          {sentToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed sm:absolute top-20 left-4 right-4 z-[70] bg-emerald-900 text-white font-extrabold text-sm px-4 py-3 rounded-2xl shadow-xl border border-emerald-600 flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{sentToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {!isLinked && (
          <section className="card bg-amber-50 border-amber-300 p-4 text-slate-900">
            <span className="text-[11px] font-black uppercase text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
              Pairing Required
            </span>
            <h3 className="text-base font-black text-amber-950 mt-1">Link your child&apos;s account</h3>
            <p className="text-xs font-semibold text-amber-900/80 mt-0.5 leading-relaxed">
              Pair a student account to see learning progress and weekly reports.
            </p>
            <button
              type="button"
              className="btn bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm py-2.5 px-4 rounded-xl mt-3 shadow-xs"
              onClick={() => router.push("/onboarding/?role=parent")}
            >
              Pair Child →
            </button>
          </section>
        )}

        {/* Parent Value Summary */}
        <section className="card card-indigo p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between gap-3 pb-4 border-b border-white/10 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-black text-xl flex items-center justify-center shadow-md shrink-0">
                {studentName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 block">This Week</span>
                <h2 className="text-xl font-black text-white truncate">{studentName}</h2>
                <p className="text-xs font-semibold text-slate-300 mt-0.5 truncate">
                  {classLabel} · Uganda Primary Curriculum
                </p>
              </div>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10.5px] font-extrabold uppercase px-2.5 py-1 rounded-full shrink-0">
              Linked
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <MetricCard label="Study Time" value={`${weeklyTotal}m`} tone="cyan" icon={<Clock className="w-4 h-4" />} />
            <MetricCard label="Recent Accuracy" value={`${recentAccuracy}%`} tone="emerald" icon={<Target className="w-4 h-4" />} />
            <MetricCard label="Recent Qs" value={`${recentAttempts}`} tone="purple" icon={<Award className="w-4 h-4" />} />
            <MetricCard label="Streak" value={`${progress.streakDays}d`} tone="amber" icon={<Flame className="w-4 h-4 fill-amber-400" />} />
          </div>

          <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-[11px] font-bold text-slate-300">
            Last updated: <span className="text-white">{lastSyncedText}</span>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" /> Needs Support
              </span>
              <p className="text-sm font-bold text-white mt-1 leading-snug">{needsSupportText}</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Suggested Parent Action
              </span>
              <p className="text-sm font-bold text-white mt-1 leading-snug">{parentAction}</p>
            </div>
          </div>
        </section>

        {/* Encouragement */}
        <section className="card bg-white p-4 border-2 border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <MessageSquareHeart className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Send Encouragement</span>
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                A short message from home helps the student keep going.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <CheerButton label="Proud of you" sub="Praise effort" onClick={() => handleSendCheers("I am proud of your effort. Keep going! 🌟")} />
            <CheerButton label="Keep the streak" sub="Build habit" onClick={() => handleSendCheers("Keep your streak alive today. You can do it! 🔥")} />
            <CheerButton label="Try one more" sub="Gentle push" onClick={() => handleSendCheers("Try one more short practice. Small steps count! 🙌")} />
          </div>
        </section>

        {/* Weekly Study Activity */}
        <section className="card bg-white p-5 border-2 border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 flex-wrap gap-2">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>7-Day Study Activity</span>
              </h3>
              <p className="text-xs font-semibold text-slate-500">Active learning minutes this week</p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 shrink-0">
              {activeDays}/7 active days
            </span>
          </div>

          <div className="flex items-end justify-between gap-1.5 sm:gap-2 h-32 pt-2 px-1">
            {session.weeklyMinutes.map((mins, idx) => {
              const heightPct = Math.round((mins / maxWeeklyMin) * 100);
              const isToday = idx === session.weeklyMinutes.length - 1;

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

        {/* Subject Breakdown */}
        <section className="card bg-white p-5 border-2 border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 flex-wrap gap-2">
            <div>
              <h3 className="text-base font-black text-slate-900">Subject Progress</h3>
              <p className="text-xs font-semibold text-slate-500">Use this to guide home support.</p>
            </div>
            {strongestSubject && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                Strongest: {strongestSubject.name}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {subjectStats.map((sub) => {
              const theme = SUBJECT_THEMES[sub.id] || SUBJECT_THEMES.math;
              const isWeak = weakestSubject?.id === sub.id;
              const pct = sub.attempts ? sub.accuracy : sub.coverage;

              return (
                <div key={sub.id} className={`flex flex-col gap-1.5 p-3 rounded-2xl border ${isWeak ? "bg-amber-50/80 border-amber-200" : "bg-slate-50/70 border-slate-200/60"}`}>
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 ${theme.iconBg}`}>
                        <SubjectIcon subjectId={sub.id} className="w-4 h-4 stroke-[2.4]" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-extrabold text-sm text-slate-900 truncate block">{sub.name}</span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {sub.attempts ? `${sub.attempts} attempts` : `${sub.completedTopics}/${sub.totalTopics} topics`}
                        </span>
                      </div>
                    </div>
                    <span className={`font-mono text-xs font-black shrink-0 ${isWeak ? "text-amber-800" : "text-slate-700"}`}>
                      {pct}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden mt-1 p-0.5">
                    <div className={`h-full rounded-full ${theme.progressBg} transition-all duration-500`} style={{ width: `${Math.max(6, pct)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Weekly Report */}
        <section className="card bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 relative overflow-hidden text-white border-2 border-indigo-400/40 shadow-xl rounded-[32px]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between pb-4 border-b border-white/15 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-sm shrink-0">
                <Award className="w-6 h-6 stroke-[2.4]" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">Weekly Summary</span>
                <h3 className="text-lg font-black text-white">Parent Report Card</h3>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-white/10 px-3 py-1 rounded-xl border border-white/15">ELIMU</span>
          </div>

          <div className="my-5 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-3 backdrop-blur-xs">
            <ReportRow label="Student" value={`${studentName} · ${classLabel}`} />
            <ReportRow label="Study Time" value={`${weeklyTotal} minutes across ${activeDays} active day(s)`} />
            <ReportRow label="Recent Accuracy" value={`${recentAccuracy}%`} />
            <ReportRow label="Recent Questions" value={`${recentAttempts}`} />
            <ReportRow label="Needs Support" value={weakestSubject?.name || "Keep practising steadily"} />
            <ReportRow label="Latest Mock" value={progress.lastMockScore ? `${progress.lastMockScore}%` : "Not taken yet"} />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-left w-full sm:w-auto min-w-0">
              <span className="text-xs font-extrabold text-emerald-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 shrink-0" /> Ready to share
              </span>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Send the weekly summary to a guardian or teacher.</p>
            </div>
            <button
              type="button"
              onClick={handleShareReport}
              className="btn bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs sm:text-sm py-3 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shrink-0 w-full sm:w-auto"
            >
              <Share2 className="w-4 h-4 stroke-[2.4]" />
              <span>Share Report</span>
            </button>
          </div>
        </section>
      </motion.div>
    </AppShell>
  );
}

function MetricCard({ label, value, icon, tone }: { label: string; value: string; icon: ReactNode; tone: "cyan" | "emerald" | "amber" | "purple" }) {
  const tones = {
    cyan: "text-cyan-300",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    purple: "text-purple-300",
  };
  return (
    <div className="bg-white/10 rounded-2xl p-3 border border-white/10 text-center backdrop-blur-xs">
      <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-300 block truncate">{label}</span>
      <span className={`text-xl font-mono font-black ${tones[tone]} flex items-center justify-center gap-1 mt-0.5`}>
        {icon} {value}
      </span>
    </div>
  );
}

function CheerButton({ label, sub, onClick }: { label: string; sub: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-3 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all group flex items-center justify-between"
    >
      <div className="min-w-0">
        <div className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-950 truncate">{label}</div>
        <div className="text-[11px] text-slate-500 truncate">{sub}</div>
      </div>
      <Send className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0 ml-2" />
    </button>
  );
}

function ReportRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2.5 last:border-b-0 last:pb-0">
      <span className="text-xs text-slate-300 font-bold">{label}</span>
      <span className="text-sm font-black text-white text-right">{value}</span>
    </div>
  );
}

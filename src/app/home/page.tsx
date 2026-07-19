"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { loadState } from "@/lib/store";
import { getSubjects } from "@/lib/data";
import { AppState, ClassLevel, Subject } from "@/lib/types";
import AppShell from "@/components/AppShell";
import HeaderStats from "@/components/HeaderStats";
import EnergyBar from "@/components/EnergyBar";
import { SubjectIcon, SUBJECT_THEMES } from "@/components/SubjectIcons";
import { Play, Sparkles, Clock, Award, ArrowRight, BookOpen, ChevronRight } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const s = loadState();
    setState(s);
    setSubjects(getSubjects(s.profile.classLevel || "p5"));
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good morning ☀️" : hour < 17 ? "Good afternoon 🌤️" : "Good evening 🌙");
  }, []);

  const handleClassChange = (newClass: ClassLevel) => {
    if (!state) return;
    const updatedState: AppState = {
      ...state,
      profile: { ...state.profile, classLevel: newClass },
    };
    setState(updatedState);
    setSubjects(getSubjects(newClass));
  };

  if (!state) return null;

  const { profile, progress, continue: continueState } = state;

  // Determine continue topic link based on class or previous session
  const continueLink = profile.classLevel === "p7"
    ? "/module/?topic=p7-uganda-session-1"
    : "/module/?topic=p5-math-fractions";

  return (
    <AppShell activeTab="home" role={profile.role}>
      {/* Gamified Sticky Top Header */}
      <HeaderStats
        profile={profile}
        hearts={progress.hearts}
        maxHearts={progress.maxHearts}
        streakDays={progress.streakDays}
        showClassSwitcher={true}
        onClassChange={handleClassChange}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-5 pt-3"
      >
        {/* Welcome Greeting Banner */}
        <div className="flex items-center justify-between px-1">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{greeting}</p>
            <h1 className="text-2xl font-black text-slate-900 mt-0.5">
              Ready to learn, {profile.name || "Champion"}?
            </h1>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-2xl shadow-xs">
            <Award className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span className="font-mono font-black text-sm text-amber-950">{progress.xp} XP</span>
          </div>
        </div>

        {/* Hero Continue Card (`Tactile Duolingo Portal`) */}
        <section
          className="card card-continue card-press cursor-pointer relative overflow-hidden"
          onClick={() => router.push(continueLink)}
          role="link"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") router.push(continueLink);
          }}
        >
          {/* Background decoration */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 pointer-events-none blur-xl" />
          <div className="absolute right-4 top-4 w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-white backdrop-blur-md shadow-inner">
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-extrabold text-[11px] uppercase tracking-wider border border-white/30 backdrop-blur-sm">
              🚀 Quick Resume
            </span>
            <span className="text-xs font-bold text-emerald-100">
              {continueState.progress || 42}% Mastery
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-white mt-3 leading-snug">
            {profile.classLevel === "p7" ? "Our Country Uganda (SST)" : (continueState.topic || "Fractions & Decimals")}
          </h2>
          <p className="text-xs font-semibold text-emerald-100/90 mt-1 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 opacity-80" />
            {profile.classLevel === "p7" ? "Session 1 · Location & Position" : (continueState.subtopic || "What is a fraction?")}
          </p>

          <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden mt-4 p-0.5 border border-white/15">
            <motion.div
              className="h-full rounded-full bg-white shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${continueState.progress || 42}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/15">
            <div className="flex items-center gap-3 text-xs font-bold text-white/90">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> ~5 min drill
              </span>
              <span>•</span>
              <span className="text-amber-300 font-extrabold">🔥 +25 XP</span>
            </div>
            <span className="text-xs font-black bg-white text-emerald-900 px-3.5 py-1.5 rounded-xl shadow-sm flex items-center gap-1 group-hover:bg-emerald-50">
              Start Quiz <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </section>

        {/* 4 Core Subjects Portal Grid */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>NCDC Core Subjects</span>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                  {profile.classLevel?.toUpperCase()}
                </span>
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Uganda Primary Curriculum · 4 Subjects
              </p>
            </div>
            <Link
              href="/subjects/"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
            >
              View All Topics <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subjects.map((subject) => {
              const theme = SUBJECT_THEMES[subject.id] || SUBJECT_THEMES.math;
              const completedTopics = subject.topics.filter((t) => t.completed).length;
              const totalTopics = subject.topics.length;
              const pct = totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0;

              return (
                <Link
                  key={subject.id}
                  href={`/subjects/#${subject.id}`}
                  className="card card-press flex flex-col justify-between p-4 group relative overflow-hidden bg-white hover:border-slate-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0 ${theme.iconBg} text-white group-hover:scale-105 transition-transform`}>
                      <SubjectIcon subjectId={subject.id} className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${theme.badgeBg} ${theme.badgeText}`}>
                      {completedTopics}/{totalTopics} Mastered
                    </span>
                  </div>

                  <div className="mt-3">
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      {totalTopics} NCDC Topics · Interactive Quizzes
                    </p>
                  </div>

                  <div className="mt-3.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
                      <span>Progress</span>
                      <span className="font-mono">{pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                      <div
                        className={`h-full rounded-full ${theme.progressBg} transition-all duration-500`}
                        style={{ width: `${Math.max(8, pct)}%` }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Gamification & Daily Goal Card */}
        <section className="card bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white border-none shadow-md p-5 mt-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[11px] uppercase tracking-wider border border-amber-500/30 flex items-center gap-1 w-fit">
                <Sparkles className="w-3.5 h-3.5" /> Daily Practice Challenge
              </span>
              <h3 className="text-lg font-black text-white mt-2">
                Keep your {progress.streakDays}-day streak alive! 🔥
              </h3>
              <p className="text-xs font-semibold text-slate-300 mt-1 max-w-xs">
                Complete a 3-minute mixed review across Math, SST, Science & English to earn +50 XP and protect your hearts.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10">
            <EnergyBar value={progress.energy} className="mb-3 text-white/90" />
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 mt-4">
              <Link
                href="/practice/"
                className="btn bg-amber-400 hover:bg-amber-300 text-slate-950 font-black border-b-4 border-amber-600 active:border-b-0 py-3 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-md flex-1 text-center"
              >
                <Sparkles className="w-5 h-5 fill-slate-950" />
                Launch Practice Review
              </Link>
              {profile.role === "parent" && (
                <Link
                  href="/parent/"
                  className="btn bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-2xl border border-white/20 text-center sm:w-auto"
                >
                  Parent Dashboard →
                </Link>
              )}
            </div>
          </div>
        </section>
      </motion.div>
    </AppShell>
  );
}

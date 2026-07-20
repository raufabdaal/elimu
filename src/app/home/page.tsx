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
import { SubjectIcon, SUBJECT_THEMES } from "@/components/SubjectIcons";
import { ArrowRight, BookOpen } from "lucide-react";

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
      {/* Clean Header with Hamburger Drawer */}
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
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-6 pt-4 px-1"
      >
        {/* Welcome Greeting */}
        <div className="flex flex-col">
          <p className="text-xs font-black uppercase tracking-wider text-slate-400">{greeting}</p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
            Welcome, {profile.name || "Student"}
          </h1>
        </div>

        {/* Clean, Simple Continue Bar (`Dead Simple & High Action`) */}
        <section
          onClick={() => router.push(continueLink)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") router.push(continueLink);
          }}
          className="bg-white hover:bg-emerald-50/60 border-2 border-emerald-600/80 rounded-[28px] p-5 flex items-center justify-between gap-4 cursor-pointer transition-all shadow-sm hover:shadow-md group"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6 stroke-[2.3]" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 block">
                Resume Where You Left Off
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 truncate mt-0.5 group-hover:text-emerald-950">
                {profile.classLevel === "p7" ? "Our Country Uganda (SST)" : (continueState.topic || "Fractions & Decimals")}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1 text-emerald-700 font-extrabold text-sm shrink-0 bg-emerald-100/80 px-3.5 py-2 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </section>

        {/* 4 Core Subjects Grid (`High-Visibility & Centered`) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-900">
              Your Primary Subjects
            </h2>
            <Link
              href="/subjects/"
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subjects.map((subject) => {
              const theme = SUBJECT_THEMES[subject.id] || SUBJECT_THEMES.math;
              return (
                <Link
                  key={subject.id}
                  href={`/subjects/?subject=${subject.id}#${subject.id}`}
                  className="card card-press flex flex-col items-center justify-center p-6 text-center group relative overflow-hidden bg-white hover:border-slate-300 border-2 rounded-[28px] shadow-sm hover:shadow-md transition-all"
                >
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-sm shrink-0 ${theme.iconBg} text-white group-hover:scale-110 transition-transform mb-4`}>
                    <SubjectIcon subjectId={subject.id} className="w-8 h-8 stroke-[2.2]" />
                  </div>

                  <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {subject.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 mt-1">
                    {subject.topics.length} Curriculum Topics
                  </p>

                  <div className="mt-5 w-full pt-4 border-t border-slate-100 flex items-center justify-center text-xs font-extrabold text-emerald-700 gap-1 group-hover:gap-2 transition-all">
                    <span>Open Subject</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </motion.div>
    </AppShell>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { loadState } from "@/lib/store";
import { getSubjects } from "@/lib/data";
import { AppState, ClassLevel, Subject, SubjectId } from "@/lib/types";
import AppShell from "@/components/AppShell";
import HeaderStats from "@/components/HeaderStats";
import { SubjectIcon, SUBJECT_THEMES } from "@/components/SubjectIcons";
import { CheckCircle2, Play, ChevronRight, Filter } from "lucide-react";

export default function Subjects() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | SubjectId>("all");

  useEffect(() => {
    const s = loadState();
    setState(s);
    setSubjects(getSubjects(s.profile.classLevel || "p5"));
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

  const { profile, progress } = state;

  const filteredSubjects = activeFilter === "all"
    ? subjects
    : subjects.filter((s) => s.id === activeFilter);

  return (
    <AppShell activeTab="subjects" role={profile.role}>
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
        className="flex flex-col gap-4 pt-3"
      >
        {/* Title & Filter Bar */}
        <div>
          <h1 className="text-2xl font-black text-slate-900">Curriculum Topics</h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Select any NCDC topic to start a question-first drill
          </p>
        </div>

        {/* Horizontal Subject Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 border ${
              activeFilter === "all"
                ? "bg-slate-900 text-white border-slate-900 shadow-sm scale-105"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>All Subjects ({subjects.length})</span>
          </button>

          {subjects.map((sub) => {
            const theme = SUBJECT_THEMES[sub.id] || SUBJECT_THEMES.math;
            const isSelected = activeFilter === sub.id;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => setActiveFilter(sub.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all shrink-0 flex items-center gap-2 border ${
                  isSelected
                    ? `${theme.iconBg} text-white border-transparent shadow-sm scale-105`
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <SubjectIcon subjectId={sub.id} className="w-4 h-4 stroke-[2.4]" />
                <span>{sub.name}</span>
              </button>
            );
          })}
        </div>

        {/* Subject Sections */}
        <div className="flex flex-col gap-6 mt-1">
          {filteredSubjects.map((subject) => {
            const theme = SUBJECT_THEMES[subject.id] || SUBJECT_THEMES.math;
            const completedTopics = subject.topics.filter((t) => t.completed).length;
            const totalTopics = subject.topics.length;
            const pct = totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0;

            return (
              <section key={subject.id} className="card bg-white p-5 border-2 border-slate-200/80 shadow-sm" id={subject.id}>
                {/* Subject Header Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-sm ${theme.iconBg}`}>
                      <SubjectIcon subjectId={subject.id} className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900 leading-snug">{subject.name}</h2>
                      <p className="text-xs font-semibold text-slate-500">
                        {completedTopics} of {totalTopics} topics complete
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${theme.badgeBg} ${theme.badgeText}`}>
                    {pct}% Done
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden my-4 p-0.5 border border-slate-200">
                  <div
                    className={`h-full rounded-full ${theme.progressBg} transition-all duration-500`}
                    style={{ width: `${Math.max(6, pct)}%` }}
                  />
                </div>

                {/* Topics List (`Tactile Duolingo Topic Rows`) */}
                <div className="flex flex-col gap-2.5">
                  {subject.topics.map((topic, idx) => {
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => {
                          router.push(`/module/?topic=${encodeURIComponent(topic.id)}`);
                        }}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 group ${
                          topic.completed
                            ? "bg-emerald-50/50 border-emerald-200 hover:border-emerald-400"
                            : topic.inProgress
                            ? "bg-amber-50/40 border-amber-300 hover:border-amber-400 shadow-xs"
                            : "bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-mono font-black text-sm shrink-0 transition-transform group-hover:scale-105 ${
                              topic.completed
                                ? "bg-emerald-600 text-white shadow-xs"
                                : topic.inProgress
                                ? "bg-amber-500 text-white shadow-xs"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {topic.completed ? (
                              <CheckCircle2 className="w-6 h-6 stroke-[2.4]" />
                            ) : topic.inProgress ? (
                              <Play className="w-5 h-5 fill-white ml-0.5" />
                            ) : (
                              <span>#{idx + 1}</span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-extrabold text-[15px] text-slate-900 truncate group-hover:text-emerald-800 transition-colors">
                              {topic.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5 text-xs font-semibold text-slate-500">
                              <span>{topic.subtopicCount} questions</span>
                              <span>•</span>
                              <span className={topic.completed ? "text-emerald-700 font-bold" : topic.inProgress ? "text-amber-700 font-bold" : ""}>
                                {topic.completed ? "⭐ Mastered" : topic.inProgress ? "🚀 In progress" : "Ready to practice"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          {topic.accuracy && (
                            <span className="hidden sm:inline-block text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700">
                              {topic.accuracy}% accuracy
                            </span>
                          )}
                          <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:border-emerald-400 transition-all">
                            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </motion.div>
    </AppShell>
  );
}

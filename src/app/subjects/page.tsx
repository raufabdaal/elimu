"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { loadState } from "@/lib/store";
import { getSubjects } from "@/lib/data";
import { AppState, ClassLevel, Subject, SubjectId, Topic } from "@/lib/types";
import AppShell from "@/components/AppShell";
import HeaderStats from "@/components/HeaderStats";
import { SubjectIcon, SUBJECT_THEMES } from "@/components/SubjectIcons";
import { CheckCircle2, Play, Filter, ArrowRight } from "lucide-react";

export default function Subjects() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | SubjectId>("all");

  useEffect(() => {
    const s = loadState();
    setState(s);
    const loadedSubjects = getSubjects(s.profile.classLevel || "p5");
    setSubjects(loadedSubjects);

    const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const querySub = searchParams?.get("subject") as SubjectId | null;
    const hashSub = typeof window !== "undefined" ? (window.location.hash.replace("#", "") as SubjectId) : null;
    const targetSubjectId = querySub || hashSub;

    if (targetSubjectId && ["math", "sst", "sci", "eng"].includes(targetSubjectId)) {
      setActiveFilter(targetSubjectId);
      setTimeout(() => {
        const el = document.getElementById(targetSubjectId);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, []);

  const handleClassChange = (newClass: ClassLevel) => {
    if (!state) return;
    const updatedState: AppState = {
      ...state,
      profile: { ...state.profile, classLevel: newClass },
    };
    setState(updatedState);
    const newSubjects = getSubjects(newClass);
    setSubjects(newSubjects);
  };

  if (!state) return null;

  const { profile, progress } = state;

  const filteredSubjects = activeFilter === "all"
    ? subjects
    : subjects.filter((s) => s.id === activeFilter);

  const handleTopicClick = (topic: Topic) => {
    const firstMod = topic.modules?.[0]?.id || "";
    router.push(`/module/?topic=${encodeURIComponent(topic.id)}${firstMod ? `&moduleId=${encodeURIComponent(firstMod)}` : ""}`);
  };

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
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-4 pt-4 px-1"
      >
        {/* Title & Filter Bar */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Curriculum Topics</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Tap a topic or select a specific step pill to jump straight into bite-sized interactive drills
          </p>
        </div>

        {/* Horizontal Subject Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 border ${
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
                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 flex items-center gap-2 border ${
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

        {/* If 'all' is selected, show only the 4 clean Subject Portal Cards first */}
        {activeFilter === "all" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-3">
            {subjects.map((subject) => {
              const theme = SUBJECT_THEMES[subject.id] || SUBJECT_THEMES.math;
              const completedTopics = subject.topics.filter((t) => t.completed).length;
              const totalTopics = subject.topics.length;
              const pct = totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0;

              return (
                <div
                  key={subject.id}
                  onClick={() => setActiveFilter(subject.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setActiveFilter(subject.id);
                  }}
                  className="card card-press flex flex-col items-center justify-center p-6 text-center group relative overflow-hidden bg-white hover:border-slate-300 border-2 rounded-[32px] shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-sm shrink-0 ${theme.iconBg} text-white group-hover:scale-110 transition-transform mb-4`}>
                    <SubjectIcon subjectId={subject.id} className="w-8 h-8 stroke-[2.2]" />
                  </div>

                  <span className={`text-[10.5px] font-black uppercase tracking-wider px-3 py-1 rounded-full mb-2 ${theme.badgeBg} ${theme.badgeText}`}>
                    {completedTopics}/{totalTopics} Mastered ({pct}%)
                  </span>

                  <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {subject.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 mt-1">
                    {totalTopics} Curriculum Topics · Interactive Quizzes
                  </p>

                  <div className="mt-5 w-full pt-4 border-t border-slate-100 flex items-center justify-center text-xs font-extrabold text-emerald-700 gap-1 group-hover:gap-2 transition-all">
                    <span>Explore {subject.name} Topics</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* If a specific subject is selected, display its topics cleanly */
          <div className="flex flex-col gap-6 mt-2">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className="text-xs font-black text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <span>← Back to All Subjects</span>
              </button>
            </div>

            {filteredSubjects.map((subject) => {
              const theme = SUBJECT_THEMES[subject.id] || SUBJECT_THEMES.math;
              const completedTopics = subject.topics.filter((t) => t.completed).length;
              const totalTopics = subject.topics.length;
              const pct = totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0;

              return (
                <section key={subject.id} className="card bg-white p-6 border-2 border-slate-200/90 rounded-[32px] shadow-sm" id={subject.id}>
                  {/* Subject Header Bar */}
                  <div className="flex items-center justify-between pb-5 border-b border-slate-100 flex-wrap gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-13 h-13 rounded-2xl flex items-center justify-center text-white shadow-sm shrink-0 ${theme.iconBg}`}>
                        <SubjectIcon subjectId={subject.id} className="w-7 h-7 stroke-[2.2]" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-slate-900 leading-snug">{subject.name}</h2>
                        <p className="text-xs font-bold text-slate-500 mt-0.5">
                          {completedTopics} of {totalTopics} topics mastered
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider ${theme.badgeBg} ${theme.badgeText}`}>
                      {pct}% Mastered
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden my-5 p-0.5 border border-slate-200">
                    <div
                      className={`h-full rounded-full ${theme.progressBg} transition-all duration-500`}
                      style={{ width: `${Math.max(6, pct)}%` }}
                    />
                  </div>

                  {/* Direct-Entry Topics List (`Simplified Topic 1, Topic 2 Naming + Step Pills`) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    {subject.topics.map((topic, idx) => {
                      const shortSubName = topic.name.split(" (")[0];
                      const isCompleted = topic.completed;
                      const isInProgress = topic.inProgress || (!isCompleted && idx === 0);

                      return (
                        <div
                          key={topic.id}
                          onClick={() => handleTopicClick(topic)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") handleTopicClick(topic);
                          }}
                          className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 group cursor-pointer active:scale-[0.99] shadow-2xs ${
                            isCompleted
                              ? "bg-emerald-50/70 border-emerald-200 hover:border-emerald-500"
                              : isInProgress
                              ? "bg-amber-50/80 border-amber-300 hover:border-amber-500 shadow-sm"
                              : "bg-slate-50/70 border-slate-200/90 hover:bg-white hover:border-emerald-500"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4 w-full">
                            <div className="flex items-center gap-4 min-w-0">
                              <div
                                className={`w-11 h-11 rounded-2xl flex items-center justify-center font-mono font-black text-sm shrink-0 transition-transform group-hover:scale-105 shadow-xs ${
                                  isCompleted
                                    ? "bg-emerald-600 text-white"
                                    : isInProgress
                                    ? "bg-amber-500 text-white"
                                    : "bg-slate-200 text-slate-700 group-hover:bg-slate-900 group-hover:text-white"
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                                ) : isInProgress ? (
                                  <Play className="w-5 h-5 fill-white ml-0.5" />
                                ) : (
                                  <span>#{idx + 1}</span>
                                )}
                              </div>

                              <div className="min-w-0 grow">
                                <div className="flex items-center gap-2">
                                  <span className="font-black text-base sm:text-lg text-slate-900 group-hover:text-emerald-800 transition-colors">
                                    Topic {idx + 1}
                                  </span>
                                  {isCompleted && (
                                    <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                                      Done
                                    </span>
                                  )}
                                </div>
                                <p className="font-semibold text-xs sm:text-[13px] text-slate-500 truncate mt-0.5">
                                  {shortSubName}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-xs font-black text-emerald-700 bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-colors flex items-center gap-1 shadow-2xs">
                                <span>{isCompleted ? "Review" : "Start"}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </div>

                          {/* Direct Module Step Pills inside Topic Card */}
                          {topic.modules && topic.modules.length > 1 && (
                            <div className="flex items-center gap-1.5 pt-2.5 border-t border-slate-200/60 overflow-x-auto no-scrollbar w-full">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1 shrink-0">
                                Steps:
                              </span>
                              {topic.modules.map((mod, mIdx) => {
                                const isModCompleted = mod.completed;
                                const isModInProgress = mod.inProgress || (!isModCompleted && isInProgress && mIdx === 0);
                                return (
                                  <button
                                    key={mod.id}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(`/module/?topic=${encodeURIComponent(topic.id)}&moduleId=${encodeURIComponent(mod.id)}`);
                                    }}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all shrink-0 flex items-center gap-1 border ${
                                      isModCompleted
                                        ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                                        : isModInProgress
                                        ? "bg-amber-500 text-white border-amber-500 shadow-2xs"
                                        : "bg-white text-slate-600 border-slate-300 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-400"
                                    }`}
                                  >
                                    <span>Step {mIdx + 1}</span>
                                    {isModCompleted && <span>✓</span>}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}      </motion.div>
    </AppShell>
  );
}

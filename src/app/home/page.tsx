"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { loadState } from "@/lib/store";
import { getSubjects } from "@/lib/data";
import { AppState, ClassLevel, Subject } from "@/lib/types";
import AppShell from "@/components/AppShell";
import HeaderStats from "@/components/HeaderStats";
import { SubjectIcon, SUBJECT_THEMES } from "@/components/SubjectIcons";
import { ArrowRight, BookOpen, MessageSquareHeart, Heart, X } from "lucide-react";

interface InboxCheer {
  id: string;
  text: string;
  sender: string;
  time: string;
}

export default function Home() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [greeting, setGreeting] = useState("Good morning");

  const [inboxCheers, setInboxCheers] = useState<InboxCheer[]>([]);
  const [showInboxModal, setShowInboxModal] = useState(false);

  useEffect(() => {
    const s = loadState();
    setState(s);
    setSubjects(getSubjects(s.profile.classLevel || "p5"));
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good morning ☀️" : hour < 17 ? "Good afternoon 🌤️" : "Good evening 🌙");
    try {
      const stored = JSON.parse(localStorage.getItem("elimu_inbox_cheers") || "[]");
      setInboxCheers(stored);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleClearInbox = () => {
    try {
      localStorage.removeItem("elimu_inbox_cheers");
      setInboxCheers([]);
      setShowInboxModal(false);
    } catch (e) {
      console.error(e);
    }
  };

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

  const allTopics = subjects.flatMap((subject) => subject.topics);
  const storedTopic = continueState.topicId
    ? allTopics.find((topic) => topic.id === continueState.topicId)
    : undefined;
  const fallbackTopic =
    allTopics.find((topic) => topic.inProgress) ||
    allTopics.find((topic) => !topic.completed) ||
    allTopics[0];
  const activeTopic = storedTopic || fallbackTopic;
  const storedModule = activeTopic?.modules?.find((module) => module.id === continueState.moduleId);
  const fallbackModule =
    activeTopic?.modules?.find((module) => module.inProgress) ||
    activeTopic?.modules?.find((module) => !module.completed) ||
    activeTopic?.modules?.[0];
  const activeModule = storedModule || fallbackModule;
  const continueLink = activeTopic
    ? `/module/?topic=${encodeURIComponent(activeTopic.id)}${activeModule ? `&moduleId=${encodeURIComponent(activeModule.id)}` : ""}`
    : "/subjects/";
  const continueTitle = storedTopic && continueState.topic
    ? continueState.topic
    : activeTopic?.name?.split(" (")[0] || "Your next lesson";

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
        {/* Welcome Greeting & Parent Cheers Inbox Banner */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex flex-col">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">{greeting}</p>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
              Welcome, {profile.name || "Student"}
            </h1>
          </div>

          {inboxCheers.length > 0 && (
            <button
              type="button"
              onClick={() => setShowInboxModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-xs px-3.5 py-2 rounded-2xl shadow-md hover:scale-105 transition-all animate-pulse"
            >
              <MessageSquareHeart className="w-4 h-4 shrink-0" />
              <span>💌 Parent Cheers ({inboxCheers.length})</span>
            </button>
          )}
        </div>

        {/* Weekly Mock Exam Gate Banner */}
        {progress.pendingMockExam && (
          <div
            onClick={() => router.push("/practice/?mode=mock")}
            role="button"
            tabIndex={0}
            className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white p-5 rounded-[28px] shadow-lg cursor-pointer flex items-center justify-between gap-4 border-2 border-emerald-400 animate-pulse"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center font-black text-2xl shrink-0">
                🎓
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-200 block">
                  Required Weekly Checkpoint
                </span>
                <h3 className="text-base sm:text-lg font-black text-white truncate">
                  Launch 20-Question Mock Exam
                </h3>
              </div>
            </div>
            <span className="text-xs font-black bg-white text-emerald-950 px-3.5 py-2 rounded-xl shrink-0">
              Start Now →
            </span>
          </div>
        )}

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
                {continueTitle}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
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

      {/* Parent Cheers Inbox Modal */}
      <AnimatePresence>
        {showInboxModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setShowInboxModal(false)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 10, opacity: 0 }}
              transition={{ type: "spring", stiffness: 450, damping: 26 }}
              className="bg-white rounded-[32px] p-6 max-w-sm w-full shadow-2xl border-2 border-amber-400 text-center relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600" />

              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-900 flex items-center gap-1">
                  💌 Parent Portal Cheers
                </span>
                <button
                  type="button"
                  onClick={() => setShowInboxModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              <div className="my-4 flex flex-col gap-3 max-h-[40vh] overflow-y-auto pr-1 text-left">
                {inboxCheers.map((item, idx) => (
                  <div key={idx} className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 shadow-2xs flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-800">
                      <span>{item.sender || "Parent"}</span>
                      <span>{item.time || "Today"}</span>
                    </div>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5 leading-snug">
                      &ldquo;{item.text}&rdquo;
                    </p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleClearInbox}
                className="btn btn-primary w-full py-3.5 font-extrabold mt-3 shadow-md flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Say Thanks & Mark Read</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}

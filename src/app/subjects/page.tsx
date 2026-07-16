"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { loadState } from "@/lib/store";
import { getSubjects } from "@/lib/data";
import { AppState, Subject } from "@/lib/types";
import PhoneShell from "@/components/PhoneShell";
import { MathIcon, SSTIcon } from "@/components/SubjectIcons";

export default function Subjects() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const s = loadState();
    setState(s);
    setSubjects(getSubjects(s.profile.classLevel || "p5"));
  }, []);

  if (!state) return null;

  return (
    <PhoneShell activeTab="subjects">
      <header className="app-head">
        <Link href="/home/" className="icon-btn" aria-label="Back to home">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </Link>
        <div className="title-block">
          <h1>Subjects</h1>
          <p className="sub">Primary {(state.profile.classLevel || "p5").toUpperCase().replace("P", "")}</p>
        </div>
      </header>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {subjects.map((subject) => {
          const completed = subject.topics.filter((t) => t.completed).length;
          const total = subject.topics.length;
          const pct = total ? Math.round((completed / total) * 100) : 0;

          return (
            <section key={subject.id} className="card mb-6" id={subject.id}>
              <div className="row">
                <span className={`subject-mark ${subject.icon}`}>
                  {subject.icon === "math" ? <MathIcon /> : <SSTIcon />}
                </span>
                <div className="grow">
                  <h2 className="h3">{subject.name}</h2>
                  <p className="meta mt-1">
                    {completed} of {total} topics complete
                  </p>
                </div>
                <span className="pill pill-muted">{pct}%</span>
              </div>
              <div className="progress mt-4">
                <span style={{ width: `${pct}%` }} />
              </div>

              <div className="mt-4">
                {subject.topics.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    className="topic-row"
                    onClick={() => router.push(`/module/?subject=${subject.id}&topic=${topic.id}`)}
                  >
                    <span className={`topic-check ${topic.completed ? "done" : ""}`}>
                      {topic.completed && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5">
                          <path d="M5 12l5 5L19 7" />
                        </svg>
                      )}
                    </span>
                    <div className="grow">
                      <p className="topic-name">{topic.name}</p>
                      <p className="meta">
                        {topic.subtopicCount} subtopics · {topic.completed ? "Done" : topic.inProgress ? "In progress" : "Not started"}
                      </p>
                    </div>
                    <span className="chev">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 6l6 6-6 6" />
                      </svg>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </motion.div>
    </PhoneShell>
  );
}

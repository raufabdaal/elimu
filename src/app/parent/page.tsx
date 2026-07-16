"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { loadState } from "@/lib/store";
import { AppState } from "@/lib/types";
import AppShell from "@/components/AppShell";

export default function Parent() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    const s = loadState();
    setState(s);
  }, []);

  if (!state) return null;

  const { profile, progress, session, continue: continueState } = state;
  const isLinked = !!profile.linkedStudentId;

  return (
    <AppShell activeTab="parent">
      <header className="app-head">
        <div className="title-block">
          <p className="meta">PARENT VIEW</p>
          <h1>{profile.name || "Student"}’s progress</h1>
        </div>
        <span className="pill">{profile.classLevel?.toUpperCase() || "P5"}</span>
      </header>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {!isLinked && (
          <section className="card mb-lg" style={{ background: "var(--warn-soft)", borderColor: "color-mix(in oklch, var(--warn) 20%, transparent)" }}>
            <p className="eyebrow" style={{ color: "var(--warn)" }}>NOT LINKED</p>
            <p className="meta mt-2">
              Enter your child’s 6-digit code on the onboarding screen to see their progress.
            </p>
            <button type="button" className="btn btn-secondary mt-md" onClick={() => router.push("/onboarding/")}>
              Link now
            </button>
          </section>
        )}

        <section className="parent-hero">
          <div className="row">
            <div className="avatar">{(profile.name || "S").charAt(0).toUpperCase()}</div>
            <div className="grow">
              <p className="meta">THIS WEEK</p>
              <p className="h3 mt-sm">
                On track · <span className="num">4</span> sessions
              </p>
            </div>
          </div>
          <p className="meta mt-md" style={{ lineHeight: 1.45 }}>
            Steady pace on {continueState.topic || "fractions"}. One short practice tonight keeps the streak without stress.
          </p>
        </section>

        <div className="grid-2 mb-lg">
          <div className="stat-tile">
            <p className="value num">{progress.modulesDone}</p>
            <p className="label">Modules done</p>
          </div>
          <div className="stat-tile">
            <p className="value num">{progress.streakDays}</p>
            <p className="label">Day streak</p>
          </div>
          <div className="stat-tile">
            <p className="value num">{session.todayMinutes}</p>
            <p className="label">Minutes today</p>
          </div>
          <div className="stat-tile">
            <p className="value num">{progress.practiceAccuracy}%</p>
            <p className="label">Practice accuracy</p>
          </div>
        </div>

        <section className="card mb-lg">
          <div className="section-label" style={{ marginBottom: 14 }}>
            <h2 className="h3">By subject</h2>
          </div>
          <div className="stack-sm">
            <div className="bar-row">
              <span className="label">Maths</span>
              <div className="bar-track">
                <i style={{ width: "33%" }} />
              </div>
              <span className="pct num">33%</span>
            </div>
            <div className="bar-row">
              <span className="label">SST</span>
              <div className="bar-track">
                <i style={{ width: "22%" }} />
              </div>
              <span className="pct num">22%</span>
            </div>
          </div>
          <div className="chip-row" style={{ marginTop: 14 }}>
            <span className="chip">
              Focus: <strong>Fractions</strong>
            </span>
            <span className="chip">
              Next: <strong>Decimals</strong>
            </span>
          </div>
        </section>

        <section className="card mb-lg">
          <div className="section-label" style={{ marginBottom: 6 }}>
            <h2 className="h3">Recent activity</h2>
          </div>
          <div className="activity-row">
            <div>
              <p className="title">Fractions · Question 1</p>
              <p className="meta">Mathematics · Today · 2 min</p>
            </div>
            <span className="pill pill-ok">Done</span>
          </div>
          <div className="activity-row">
            <div>
              <p className="title">Practice drill</p>
              <p className="meta">
                <span className="num">4</span> of <span className="num">5</span> correct · Today
              </p>
            </div>
            <span className="pill pill-ok">Good</span>
          </div>
          <div className="activity-row">
            <div>
              <p className="title">Our country Uganda</p>
              <p className="meta">Social Studies · Yesterday</p>
            </div>
            <span className="pill pill-muted">Read</span>
          </div>
        </section>

        <section className="card">
          <p className="eyebrow">TONIGHT</p>
          <p className="h3">10 quiet minutes on fractions</p>
          <p className="meta mt-sm" style={{ lineHeight: 1.45 }}>
            {profile.name || "Your child"} is mid-way through the topic. One short drill keeps momentum without pressure.
          </p>
          <Link href="/practice/" className="btn btn-secondary mt-md no-underline">
            Open practice
          </Link>
        </section>
      </motion.div>
    </AppShell>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { loadState, resetState } from "@/lib/store";
import { AppState } from "@/lib/types";
import AppShell from "@/components/AppShell";
import Streak from "@/components/Streak";
import Hearts from "@/components/Hearts";
import EnergyBar from "@/components/EnergyBar";
import { MathIcon, SSTIcon } from "@/components/SubjectIcons";

export default function Home() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const s = loadState();
    setState(s);
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening");
  }, []);

  const handleSwitch = () => {
    resetState();
    router.push("/onboarding/");
  };

  if (!state) return null;

  const { profile, progress, continue: continueState } = state;

  return (
    <AppShell activeTab="home">
      <header className="app-head">
        <div className="avatar">{(profile.name || "S").charAt(0).toUpperCase()}</div>
        <div className="title-block">
          <p className="meta">{greeting}</p>
          <h1>{profile.name || "Student"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="pill">{profile.classLevel?.toUpperCase() || "P5"}</span>
          <button
            type="button"
            onClick={handleSwitch}
            className="icon-btn"
            aria-label="Switch profile"
            title="Switch profile / class"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <path d="M12 8v4M8 12h8" />
            </svg>
          </button>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <section
          className="card home-continue card-press cursor-pointer"
          onClick={() => router.push("/module/?topic=fractions")}
          role="link"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") router.push("/module/?topic=fractions");
          }}
        >
          <div className="row-between">
            <p className="eyebrow" style={{ color: "var(--accent)", marginBottom: 0 }}>PICK UP HERE</p>
            <span className="meta" style={{ color: "var(--muted)" }}>
              {continueState.progress || 42}%
            </span>
          </div>
          <h2 className="h2 mt-sm" style={{ fontSize: 22, color: "var(--fg)" }}>
            {continueState.topic || "Fractions"} · {continueState.subtopic || "Continue"}
          </h2>
          <p className="meta mt-sm" style={{ color: "var(--muted)" }}>
            {continueState.subject || "Mathematics"} · Question {continueState.module || 1} of 4
          </p>
          <div className="progress mt-md">
            <span style={{ width: `${continueState.progress || 42}%` }} />
          </div>
          <div className="chip-row">
            <span className="chip">~6 min left</span>
            <span className="chip">Keep the streak</span>
          </div>
          <span className="btn btn-primary btn-sm mt-md">Resume →</span>
        </section>

        <div className="section-label">
          <h2 className="h3">Your subjects</h2>
        </div>

        <div className="stack">
          <Link href="/subjects/#math" className="card card-press row no-underline" style={{ color: "var(--fg)" }}>
            <span className="subject-mark math">
              <MathIcon />
            </span>
            <div className="grow">
              <h3 className="h3">Mathematics</h3>
              <p className="meta mt-sm">3 topics · 0 done</p>
              <div className="progress mt-sm" style={{ maxWidth: 140 }}>
                <span style={{ width: "15%" }} />
              </div>
            </div>
            <span className="chev">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </span>
          </Link>

          <Link href="/subjects/#sst" className="card card-press row no-underline" style={{ color: "var(--fg)" }}>
            <span className="subject-mark sst">
              <SSTIcon />
            </span>
            <div className="grow">
              <h3 className="h3">Social Studies</h3>
              <p className="meta mt-sm">3 topics · 1 done</p>
              <div className="progress mt-sm" style={{ maxWidth: 140 }}>
                <span style={{ width: "35%" }} />
              </div>
            </div>
            <span className="chev">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
        </div>

        <section className="card mt-lg">
          <div className="row items-start">
            <div className="grow">
              <p className="meta">GAMIFICATION</p>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <Hearts count={progress.hearts} max={progress.maxHearts} />
                <Streak days={progress.streakDays} />
              </div>
              <div className="mt-4">
                <EnergyBar value={progress.energy} />
              </div>
            </div>
          </div>
          <p className="meta mt-md">One short drill keeps the chain. No pressure — just show up.</p>
          <Link href="/practice/" className="btn btn-secondary mt-md no-underline">
            Open practice
          </Link>
        </section>
      </motion.div>
    </AppShell>
  );
}

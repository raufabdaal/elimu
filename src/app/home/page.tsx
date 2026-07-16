"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { loadState } from "@/lib/store";
import { AppState } from "@/lib/types";
import PhoneShell from "@/components/PhoneShell";
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
    if (!s.profile.classLevel && s.profile.role !== "parent") {
      router.replace("/onboarding/");
      return;
    }
    setState(s);
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening");
  }, [router]);

  if (!state) return null;

  const { profile, progress, continue: continueState } = state;

  return (
    <PhoneShell activeTab="home">
      <header className="app-head">
        <div className="avatar">{(profile.name || "S").charAt(0).toUpperCase()}</div>
        <div className="title-block">
          <p className="meta">{greeting}</p>
          <h1>{profile.name || "Student"}</h1>
        </div>
        <span className="pill">{profile.classLevel?.toUpperCase() || "P5"}</span>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <section
          className="card home-continue card-press cursor-pointer"
          onClick={() => router.push("/module/")}
          role="link"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") router.push("/module/");
          }}
        >
          <div className="row-between">
            <p className="eyebrow !text-white/80 !mb-0">PICK UP HERE</p>
            <span className="text-white/80 text-xs font-mono">
              {continueState.progress || 42}%
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl mt-2 text-white font-semibold">
            {continueState.topic || "Fractions"} · {continueState.subtopic || "Continue"}
          </h2>
          <p className="text-white/70 text-xs mt-2">
            {continueState.subject || "Mathematics"} · Module {continueState.module || 1} of 4
          </p>
          <div className="progress mt-4 bg-white/20">
            <span style={{ width: `${continueState.progress || 42}%` }} />
          </div>
          <div className="chip-row">
            <span className="chip">~6 min left</span>
            <span className="chip">1 check question</span>
          </div>
          <span className="btn btn-primary btn-sm mt-4">Resume lesson →</span>
        </section>

        <div className="section-label">
          <h2 className="h3">Your subjects</h2>
        </div>

        <div className="stack">
          <Link href="/subjects/#math" className="card card-press row no-underline text-foreground">
            <span className="subject-mark math">
              <MathIcon />
            </span>
            <div className="grow">
              <h3 className="h3">Mathematics</h3>
              <p className="meta mt-1">12 topics · 4 done</p>
              <div className="progress mt-2 max-w-[140px]">
                <span style={{ width: "33%" }} />
              </div>
            </div>
            <span className="chev">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </span>
          </Link>

          <Link href="/subjects/#sst" className="card card-press row no-underline text-foreground">
            <span className="subject-mark sst">
              <SSTIcon />
            </span>
            <div className="grow">
              <h3 className="h3">Social Studies</h3>
              <p className="meta mt-1">9 topics · 2 done</p>
              <div className="progress mt-2 max-w-[140px]">
                <span style={{ width: "22%" }} />
              </div>
            </div>
            <span className="chev">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
        </div>

        <section className="card mt-6">
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
          <p className="meta mt-4">One short drill keeps the chain. No pressure — just show up.</p>
          <Link href="/practice/" className="btn btn-secondary mt-4 no-underline">
            Open practice
          </Link>
        </section>
      </motion.div>
    </PhoneShell>
  );
}

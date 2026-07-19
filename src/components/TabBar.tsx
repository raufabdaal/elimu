"use client";

import Link from "next/link";
import { Home, BookOpen, Sparkles, User } from "lucide-react";

interface TabBarProps {
  active: "home" | "subjects" | "practice" | "parent";
  role?: "learner" | "parent";
}

const learnerTabs = [
  { id: "home", label: "Home", href: "/home/", Icon: Home },
  { id: "subjects", label: "Subjects", href: "/subjects/", Icon: BookOpen },
  { id: "practice", label: "Practice", href: "/practice/", Icon: Sparkles },
] as const;

const parentTabs = [
  { id: "home", label: "Pupil Home", href: "/home/", Icon: Home },
  { id: "parent", label: "Parent Portal", href: "/parent/", Icon: User },
] as const;

export default function TabBar({ active, role = "learner" }: TabBarProps) {
  const tabs = role === "parent" ? parentTabs : learnerTabs;

  return (
    <nav 
      className="tabbar fixed sm:absolute bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]"
      style={{ height: "68px", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Main navigation"
    >
      <div className="max-w-[420px] mx-auto h-full flex justify-around items-center px-4">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`tab flex flex-col items-center justify-center py-1.5 px-3 transition-all rounded-2xl min-w-[76px] ${
                isActive ? "bg-emerald-50/80 text-[var(--accent)] scale-105" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <tab.Icon 
                strokeWidth={isActive ? 2.6 : 2} 
                className={`w-6 h-6 mb-0.5 transition-all ${isActive ? "text-[var(--accent)] scale-110" : "text-slate-500"}`} 
              />
              <span className={`text-[11.5px] font-bold tracking-tight ${isActive ? "text-[var(--accent)]" : "text-slate-500"}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

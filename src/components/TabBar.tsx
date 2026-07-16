"use client";

import Link from "next/link";
import { Home, List, Clock, User } from "lucide-react";

interface TabBarProps {
  active: "home" | "subjects" | "practice" | "parent";
  role?: "learner" | "parent";
}

const learnerTabs = [
  { id: "home", label: "Home", href: "/home/", Icon: Home },
  { id: "subjects", label: "Subjects", href: "/subjects/", Icon: List },
  { id: "practice", label: "Practice", href: "/practice/", Icon: Clock },
] as const;

const parentTabs = [
  { id: "home", label: "Home", href: "/home/", Icon: Home },
  { id: "parent", label: "Parent", href: "/parent/", Icon: User },
] as const;

export default function TabBar({ active, role = "learner" }: TabBarProps) {
  const tabs = role === "parent" ? parentTabs : learnerTabs;

  return (
    <nav 
      className="tabbar fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-bottom"
      aria-label="Main navigation"
    >
      <div className="max-w-[420px] mx-auto flex justify-around px-4 py-1">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`tab flex flex-col items-center justify-center py-2 px-4 text-xs transition-all rounded-2xl min-w-[70px] ${isActive ? "active" : "hover:bg-gray-100"}`}
              aria-current={isActive ? "page" : undefined}
            >
              <tab.Icon 
                strokeWidth={isActive ? 2.8 : 2.2} 
                className={`w-6 h-6 mb-0.5 transition-all ${isActive ? "scale-110" : ""}`} 
              />
              <span className={`font-semibold tracking-tight ${isActive ? "text-[var(--accent)]" : "text-gray-600"}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

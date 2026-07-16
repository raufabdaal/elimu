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
      <div className="max-w-[420px] mx-auto grid grid-cols-3 gap-1 px-2">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`tab flex flex-col items-center justify-center py-3 px-2 text-xs transition-all rounded-xl ${isActive ? "active" : "hover:bg-gray-50"}`}
              aria-current={isActive ? "page" : undefined}
            >
              <tab.Icon strokeWidth={isActive ? 2.5 : 2} className="w-5 h-5 mb-1" />
              <span className="font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

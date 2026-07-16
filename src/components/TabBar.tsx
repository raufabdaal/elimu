"use client";

import Link from "next/link";
import { Home, List, Clock, User } from "lucide-react";

interface TabBarProps {
  active: "home" | "subjects" | "practice" | "parent";
}

const tabs = [
  { id: "home", label: "Home", href: "/home/", Icon: Home },
  { id: "subjects", label: "Subjects", href: "/subjects/", Icon: List },
  { id: "practice", label: "Practice", href: "/practice/", Icon: Clock },
  { id: "parent", label: "Parent", href: "/parent/", Icon: User },
] as const;

export default function TabBar({ active }: TabBarProps) {
  return (
    <nav className="tabbar" aria-label="Main">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`tab ${isActive ? "active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            <tab.Icon strokeWidth={isActive ? 2.2 : 1.8} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

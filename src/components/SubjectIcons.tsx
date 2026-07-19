import React from "react";
import { SubjectId } from "@/lib/types";

export function MathIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 8h6M8 5v6M13 16h6M5 16l6-6M13 8l6 6" />
    </svg>
  );
}

export function SSTIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16M12 4c2.5 2.8 2.5 13.2 0 16M12 4c-2.5 2.8-2.5 13.2 0 16" />
    </svg>
  );
}

export function ScienceIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10 2v7.31M14 2v7.31M8.5 2h7M14 9.3l4.66 7.76a2 2 0 0 1-1.71 3.03H7.05a2 2 0 0 1-1.72-3.03L10 9.3" />
      <circle cx="12" cy="16" r="2" />
    </svg>
  );
}

export function EnglishIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-0.5-5.02" />
      <path d="M12 6h4M12 10h4M12 14h2" />
    </svg>
  );
}

export function SubjectIcon({ subjectId, className = "w-6 h-6" }: { subjectId: SubjectId | string; className?: string }) {
  switch (subjectId) {
    case "math":
      return <MathIcon className={className} />;
    case "sst":
      return <SSTIcon className={className} />;
    case "sci":
      return <ScienceIcon className={className} />;
    case "eng":
      return <EnglishIcon className={className} />;
    default:
      return <MathIcon className={className} />;
  }
}

export const SUBJECT_THEMES: Record<SubjectId, {
  name: string;
  badgeBg: string;
  badgeText: string;
  border: string;
  cardBg: string;
  progressBg: string;
  iconBg: string;
  iconColor: string;
}> = {
  math: {
    name: "Mathematics",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-800",
    border: "border-blue-200",
    cardBg: "from-blue-50/80 to-indigo-50/40",
    progressBg: "bg-blue-600",
    iconBg: "bg-blue-500",
    iconColor: "text-white",
  },
  sst: {
    name: "Social Studies",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-800",
    border: "border-amber-200",
    cardBg: "from-amber-50/80 to-orange-50/40",
    progressBg: "bg-amber-600",
    iconBg: "bg-amber-500",
    iconColor: "text-white",
  },
  sci: {
    name: "Integrated Science",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-800",
    border: "border-emerald-200",
    cardBg: "from-emerald-50/80 to-teal-50/40",
    progressBg: "bg-emerald-600",
    iconBg: "bg-emerald-500",
    iconColor: "text-white",
  },
  eng: {
    name: "English Language",
    badgeBg: "bg-rose-100",
    badgeText: "text-rose-800",
    border: "border-rose-200",
    cardBg: "from-rose-50/80 to-pink-50/40",
    progressBg: "bg-rose-600",
    iconBg: "bg-rose-500",
    iconColor: "text-white",
  },
};

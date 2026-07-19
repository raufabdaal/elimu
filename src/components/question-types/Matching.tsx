"use client";

import { useState, useMemo } from "react";
import { Question } from "@/lib/types";
import { CheckCircle2, XCircle, Sparkles, RefreshCcw } from "lucide-react";

interface MatchingProps {
  question: Extract<Question, { type: "matching" }>;
  matches: Record<string, string>;
  locked: boolean;
  onMatch: (matches: Record<string, string>) => void;
}

const PAIR_THEMES = [
  { name: "Blue", bg: "bg-blue-500", lightBg: "bg-blue-50", text: "text-blue-900", border: "border-blue-400", badge: "bg-blue-600 text-white" },
  { name: "Purple", bg: "bg-purple-500", lightBg: "bg-purple-50", text: "text-purple-900", border: "border-purple-400", badge: "bg-purple-600 text-white" },
  { name: "Amber", bg: "bg-amber-500", lightBg: "bg-amber-50", text: "text-amber-900", border: "border-amber-400", badge: "bg-amber-600 text-white" },
  { name: "Rose", bg: "bg-rose-500", lightBg: "bg-rose-50", text: "text-rose-900", border: "border-rose-400", badge: "bg-rose-600 text-white" },
  { name: "Teal", bg: "bg-teal-500", lightBg: "bg-teal-50", text: "text-teal-900", border: "border-teal-400", badge: "bg-teal-600 text-white" },
];

export default function Matching({ question, matches, locked, onMatch }: MatchingProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);

  // Shuffle right items once per question instance so it's a real puzzle
  const shuffledRightItems = useMemo(() => {
    const rights = question.pairs.map((p) => p.right);
    return [...rights].sort((a, b) => (a.length * 7 + a.charCodeAt(0)) % 11 - (b.length * 7 + b.charCodeAt(0)) % 11);
  }, [question.pairs]);

  const handleLeftClick = (leftId: string) => {
    if (locked) return;

    if (selectedRight) {
      // Complete match (Right was picked first, now Left picked)
      const newMatches = { ...matches };
      delete newMatches[leftId];
      Object.keys(newMatches).forEach((k) => {
        if (newMatches[k] === selectedRight) delete newMatches[k];
      });
      newMatches[leftId] = selectedRight;
      onMatch(newMatches);
      setSelectedLeft(null);
      setSelectedRight(null);
    } else if (matches[leftId]) {
      // Unmatch if already matched and tapped again
      const newMatches = { ...matches };
      delete newMatches[leftId];
      onMatch(newMatches);
      setSelectedLeft(null);
    } else {
      setSelectedLeft(selectedLeft === leftId ? null : leftId);
    }
  };

  const handleRightClick = (rightValue: string) => {
    if (locked) return;

    if (selectedLeft) {
      // Complete match (Left was picked first, now Right picked)
      const newMatches = { ...matches };
      delete newMatches[selectedLeft];
      Object.keys(newMatches).forEach((k) => {
        if (newMatches[k] === rightValue) delete newMatches[k];
      });
      newMatches[selectedLeft] = rightValue;
      onMatch(newMatches);
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      // Find if right is already matched, unmatch it if tapped
      const matchedLeftKey = Object.keys(matches).find((k) => matches[k] === rightValue);
      if (matchedLeftKey) {
        const newMatches = { ...matches };
        delete newMatches[matchedLeftKey];
        onMatch(newMatches);
        setSelectedRight(null);
      } else {
        setSelectedRight(selectedRight === rightValue ? null : rightValue);
      }
    }
  };

  const getPairIndex = (leftId: string) => {
    return question.pairs.findIndex((p) => p.id === leftId);
  };

  const getLeftIdForRight = (rightValue: string) => {
    return Object.keys(matches).find((k) => matches[k] === rightValue);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1 mb-1">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-900 bg-purple-100/80 px-3 py-1 rounded-full flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          Tap a pair to connect them
        </span>
        {Object.keys(matches).length > 0 && !locked && (
          <button
            type="button"
            onClick={() => onMatch({})}
            className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Left Column - Terms */}
        <div className="flex flex-col gap-2">
          <p className="text-[11.5px] font-extrabold uppercase tracking-wider text-slate-400 px-1">Term</p>
          {question.pairs.map((pair, idx) => {
            const isSelected = selectedLeft === pair.id;
            const matchedRight = matches[pair.id];
            const theme = PAIR_THEMES[idx % PAIR_THEMES.length];
            const isCorrect = locked && matchedRight === pair.right;

            let cardClass = "choice flex-col items-start justify-center p-3.5 mb-0 min-h-[72px]";
            if (locked && matchedRight) {
              cardClass += isCorrect ? " correct" : " wrong";
            } else if (isSelected) {
              cardClass += " selected ring-2 ring-emerald-500";
            } else if (matchedRight) {
              cardClass += ` ${theme.lightBg} ${theme.border}`;
            }

            return (
              <button
                key={pair.id}
                type="button"
                disabled={locked}
                onClick={() => handleLeftClick(pair.id)}
                className={cardClass}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-[14.5px] leading-snug">{pair.left}</span>
                  {matchedRight && !locked && (
                    <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${theme.badge}`}>
                      {idx + 1}
                    </span>
                  )}
                  {locked && matchedRight && (
                    isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </div>
                {matchedRight && !locked && (
                  <span className="text-[11px] font-semibold text-slate-500 truncate w-full mt-1">
                    → {matchedRight}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Column - Matches */}
        <div className="flex flex-col gap-2">
          <p className="text-[11.5px] font-extrabold uppercase tracking-wider text-slate-400 px-1">Definition / Match</p>
          {shuffledRightItems.map((rightValue) => {
            const matchedLeftId = getLeftIdForRight(rightValue);
            const leftIdx = matchedLeftId ? getPairIndex(matchedLeftId) : -1;
            const theme = leftIdx >= 0 ? PAIR_THEMES[leftIdx % PAIR_THEMES.length] : null;
            const isSelected = selectedRight === rightValue;
            const isCorrect = locked && matchedLeftId && question.pairs.find((p) => p.id === matchedLeftId)?.right === rightValue;

            let cardClass = "choice flex-col items-start justify-center p-3.5 mb-0 min-h-[72px]";
            if (locked && matchedLeftId) {
              cardClass += isCorrect ? " correct" : " wrong";
            } else if (isSelected) {
              cardClass += " selected ring-2 ring-emerald-500";
            } else if (theme) {
              cardClass += ` ${theme.lightBg} ${theme.border}`;
            }

            return (
              <button
                key={rightValue}
                type="button"
                disabled={locked}
                onClick={() => handleRightClick(rightValue)}
                className={cardClass}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-[14px] leading-snug">{rightValue}</span>
                  {theme && !locked && (
                    <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${theme.badge}`}>
                      {leftIdx + 1}
                    </span>
                  )}
                  {locked && matchedLeftId && (
                    isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

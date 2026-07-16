"use client";

import { useState } from "react";
import { Question } from "@/lib/types";

interface MatchingProps {
  question: Extract<Question, { type: "matching" }>;
  matches: Record<string, string>;
  locked: boolean;
  onMatch: (matches: Record<string, string>) => void;
}

export default function Matching({ question, matches, locked, onMatch }: MatchingProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  const handleLeft = (leftId: string) => {
    if (locked) return;
    setSelectedLeft(leftId);
  };

  const handleRight = (rightValue: string) => {
    if (locked || !selectedLeft) return;
    const next = { ...matches, [selectedLeft]: rightValue };
    onMatch(next);
    setSelectedLeft(null);
  };

  const usedRights = Object.values(matches);

  return (
    <div className="space-y-4">
      <p className="meta">Tap a word, then tap its match.</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="stack-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Word</p>
          {question.pairs.map((pair) => (
            <button
              key={pair.id}
              type="button"
              disabled={locked}
              className={`choice text-left ${selectedLeft === pair.id ? "selected" : ""} ${locked && matches[pair.id] === pair.right ? "correct" : ""}`}
              onClick={() => handleLeft(pair.id)}
            >
              {pair.left}
            </button>
          ))}
        </div>
        <div className="stack-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Meaning</p>
          {question.pairs.map((pair, idx) => {
            const matchedPair = question.pairs.find((p) => matches[p.id] === pair.right);
            const isUsed = usedRights.includes(pair.right);
            return (
              <button
                key={idx}
                type="button"
                disabled={locked || (!selectedLeft && !matchedPair)}
                className={`choice text-left ${matchedPair ? "correct" : isUsed ? "opacity-40" : ""}`}
                onClick={() => handleRight(pair.right)}
              >
                {pair.right}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

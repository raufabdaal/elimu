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

  const handleLeftClick = (leftId: string) => {
    if (locked) return;
    setSelectedLeft(selectedLeft === leftId ? null : leftId);
  };

  const handleRightClick = (rightValue: string) => {
    if (locked || !selectedLeft) return;

    // Remove any existing match for this left item
    const newMatches = { ...matches };
    delete newMatches[selectedLeft];

    // Also remove if this right value was already matched to something else
    Object.keys(newMatches).forEach((key) => {
      if (newMatches[key] === rightValue) {
        delete newMatches[key];
      }
    });

    newMatches[selectedLeft] = rightValue;
    onMatch(newMatches);
    setSelectedLeft(null);
  };

  const isCorrectMatch = (leftId: string) => {
    const pair = question.pairs.find(p => p.id === leftId);
    return pair && matches[leftId] === pair.right;
  };

  const usedRightValues = Object.values(matches);

  return (
    <div className="space-y-4">
      <p className="meta">Tap a word on the left, then tap its match on the right.</p>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column - Words */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Word</p>
          <div className="space-y-2">
            {question.pairs.map((pair) => {
              const isSelected = selectedLeft === pair.id;
              const isMatched = !!matches[pair.id];
              const isCorrect = isCorrectMatch(pair.id);

              return (
                <button
                  key={pair.id}
                  type="button"
                  disabled={locked}
                  onClick={() => handleLeftClick(pair.id)}
                  className={`choice w-full text-left transition-all ${
                    isSelected ? "selected ring-2 ring-[var(--accent)]" : ""
                  } ${
                    isMatched && !isSelected
                      ? isCorrect 
                        ? "correct border-[var(--success)]" 
                        : "border-[var(--danger)]"
                      : ""
                  }`}
                >
                  {pair.left}
                  {isMatched && (
                    <span className="ml-2 text-xs opacity-70">
                      → {matches[pair.id]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column - Meanings */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Meaning</p>
          <div className="space-y-2">
            {question.pairs.map((pair) => {
              const rightValue = pair.right;
              const isUsed = usedRightValues.includes(rightValue);
              const isMatchedToSelected = selectedLeft && matches[selectedLeft] === rightValue;

              return (
                <button
                  key={pair.id}
                  type="button"
                  disabled={locked || (!selectedLeft && !isMatchedToSelected)}
                  onClick={() => handleRightClick(rightValue)}
                  className={`choice w-full text-left transition-all ${
                    isUsed && !isMatchedToSelected ? "opacity-40" : ""
                  } ${isMatchedToSelected ? "selected" : ""}`}
                >
                  {rightValue}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {Object.keys(matches).length > 0 && (
        <p className="text-xs text-center text-muted">
          {Object.keys(matches).length} of {question.pairs.length} matched
        </p>
      )}
    </div>
  );
}

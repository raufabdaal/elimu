"use client";

import { Question, Choice } from "@/lib/types";

interface MultiSelectProps {
  question: Extract<Question, { type: "multi_select" }>;
  selected: string[];
  locked: boolean;
  onToggle: (id: string) => void;
}

export default function MultiSelect({ question, selected, locked, onToggle }: MultiSelectProps) {
  return (
    <div className="stack-sm">
      {question.options.map((opt: Choice) => {
        const isSelected = selected.includes(opt.id);
        const showCorrect = locked && opt.correct;
        const showWrong = locked && isSelected && !opt.correct;
        return (
          <button
            key={opt.id}
            type="button"
            disabled={locked}
            className={`choice ${isSelected ? "selected" : ""} ${showCorrect ? "correct" : ""} ${showWrong ? "wrong" : ""}`}
            onClick={() => onToggle(opt.id)}
          >
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 rounded border flex items-center justify-center" style={{ borderColor: "currentColor" }}>
                {isSelected && <span className="w-2 h-2 rounded-sm bg-current" />}
              </span>
              {opt.text}
            </span>
          </button>
        );
      })}
    </div>
  );
}

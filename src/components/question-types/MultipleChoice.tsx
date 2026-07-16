"use client";

import { Question, Choice } from "@/lib/types";

interface MultipleChoiceProps {
  question: Extract<Question, { type: "multiple_choice" }>;
  selected: string | null;
  locked: boolean;
  onSelect: (id: string) => void;
}

export default function MultipleChoice({ question, selected, locked, onSelect }: MultipleChoiceProps) {
  return (
    <div className="stack-sm">
      {question.options.map((opt: Choice) => {
        const showCorrect = locked && opt.correct;
        const showWrong = locked && selected === opt.id && !opt.correct;
        return (
          <button
            key={opt.id}
            type="button"
            disabled={locked}
            className={`choice ${selected === opt.id ? "selected" : ""} ${showCorrect ? "correct" : ""} ${showWrong ? "wrong" : ""}`}
            onClick={() => onSelect(opt.id)}
          >
            {opt.text}
          </button>
        );
      })}
    </div>
  );
}

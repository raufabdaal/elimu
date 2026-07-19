"use client";

import { Question, Choice } from "@/lib/types";
import { CheckCircle2, XCircle } from "lucide-react";

interface MultipleChoiceProps {
  question: Extract<Question, { type: "multiple_choice" }>;
  selected: string | null;
  locked: boolean;
  onSelect: (id: string) => void;
}

export default function MultipleChoice({ question, selected, locked, onSelect }: MultipleChoiceProps) {
  const letters = ["A", "B", "C", "D", "E", "F"];

  return (
    <div className="flex flex-col gap-2.5">
      {question.options.map((opt: Choice, index: number) => {
        const isSelected = selected === opt.id;
        const showCorrect = locked && opt.correct;
        const showWrong = locked && isSelected && !opt.correct;

        let cardClass = "choice";
        if (showCorrect) {
          cardClass += " correct";
        } else if (showWrong) {
          cardClass += " wrong";
        } else if (isSelected) {
          cardClass += " selected";
        }

        return (
          <button
            key={opt.id}
            type="button"
            disabled={locked}
            className={cardClass}
            onClick={() => onSelect(opt.id)}
          >
            <div className="flex items-center gap-3">
              <span 
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                  showCorrect ? "bg-emerald-600 text-white border-2 border-emerald-600" :
                  showWrong ? "bg-rose-600 text-white border-2 border-rose-600" :
                  isSelected ? "bg-emerald-600 text-white border-2 border-emerald-600" :
                  "bg-slate-100 text-slate-600 border-2 border-slate-200 group-hover:border-emerald-400"
                }`}
              >
                {letters[index] || (index + 1)}
              </span>
              <span className="text-left font-bold text-[15.5px] leading-snug">{opt.text}</span>
            </div>

            {showCorrect && (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 ml-2 animate-bounce-soft" />
            )}
            {showWrong && (
              <XCircle className="w-6 h-6 text-rose-600 shrink-0 ml-2 animate-shake" />
            )}
          </button>
        );
      })}
    </div>
  );
}

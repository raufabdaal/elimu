"use client";

import { Question, Choice } from "@/lib/types";
import { CheckCircle2, XCircle } from "lucide-react";

interface MultiSelectProps {
  question: Extract<Question, { type: "multi_select" }>;
  selected: string[];
  locked: boolean;
  onToggle: (id: string) => void;
}

export default function MultiSelect({ question, selected, locked, onToggle }: MultiSelectProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between px-1 mb-1">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full">
          ⚡ Select all correct options
        </span>
        <span className="text-xs font-semibold text-slate-500">
          {selected.length} selected
        </span>
      </div>

      {question.options.map((opt: Choice) => {
        const isSelected = selected.includes(opt.id);
        const showCorrect = locked && opt.correct;
        const showWrong = locked && isSelected && !opt.correct;
        const missedCorrect = locked && !isSelected && opt.correct;

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
            onClick={() => onToggle(opt.id)}
          >
            <div className="flex items-center gap-3.5">
              <span className="shrink-0 text-slate-600 transition-colors">
                {isSelected ? (
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    showCorrect ? "bg-emerald-600 text-white" :
                    showWrong ? "bg-rose-600 text-white" :
                    "bg-emerald-600 text-white"
                  }`}>
                    ✓
                  </div>
                ) : (
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
                    missedCorrect ? "border-amber-500 bg-amber-50 text-amber-700 font-bold" : "border-slate-300 bg-slate-50"
                  }`}>
                    {missedCorrect ? "!" : ""}
                  </div>
                )}
              </span>
              <span className="text-left font-bold text-[15.5px] leading-snug break-words w-full">{opt.text}</span>
            </div>

            {showCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 ml-2 animate-bounce-soft" />}
            {showWrong && <XCircle className="w-6 h-6 text-rose-600 shrink-0 ml-2 animate-shake" />}
            {missedCorrect && (
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md ml-2 shrink-0">
                Missed
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

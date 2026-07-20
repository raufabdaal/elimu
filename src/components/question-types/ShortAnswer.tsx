"use client";

import { Question } from "@/lib/types";
import { HelpCircle, CornerDownLeft, CheckCircle2, KeyRound } from "lucide-react";

interface ShortAnswerProps {
  question: Extract<Question, { type: "short_answer" }>;
  value: string;
  locked: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export default function ShortAnswer({ question, value, locked, onChange, onSubmit }: ShortAnswerProps) {
  return (
    <div className="flex flex-col gap-3 my-1">
      {question.hint && (
        <div className="flex items-center gap-2 bg-emerald-50/80 border border-emerald-200 text-emerald-900 px-3.5 py-2 rounded-xl text-xs font-bold">
          <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Hint: {question.hint}</span>
        </div>
      )}

      <div className="relative">
        <label className="sr-only" htmlFor="answer">
          Your answer
        </label>
        <input
          id="answer"
          type="text"
          inputMode={/\d/.test(question.answer || "") ? "numeric" : "text"}
          autoComplete="off"
          placeholder="Type your answer here..."
          value={value}
          disabled={locked}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !locked && value.trim() && onSubmit()}
          className="answer-input pr-12 text-slate-900 placeholder:text-slate-400 font-bold disabled:bg-slate-50 disabled:text-slate-700 disabled:border-slate-300"
        />
        {!locked && value.trim() && (
          <button
            type="button"
            onClick={onSubmit}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-transform active:scale-95 shadow-sm"
            title="Press Enter to Check"
          >
            <CornerDownLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {!locked ? (
        <p className="text-[11.5px] font-semibold text-slate-400 px-1">
          Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-600 font-mono font-bold text-[10px]">ENTER</kbd> or click Check below when done
        </p>
      ) : (
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 mt-1 flex flex-col gap-2 shadow-2xs">
          <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Standard Model Answer:
            </span>
            <span className="text-xs sm:text-sm font-mono font-extrabold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2.5 py-1 rounded-xl">
              {question.answer}
            </span>
          </div>
          {question.keywords && question.keywords.length > 0 ? (
            <div className="flex items-center justify-between gap-2 text-xs text-slate-600 pt-0.5">
              <span className="font-bold flex items-center gap-1.5 text-slate-500">
                <KeyRound className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Scored Keywords:
              </span>
              <span className="font-mono text-slate-800 font-semibold bg-slate-200/80 px-2.5 py-0.5 rounded-lg text-right">
                {question.keywords.join(", ")}
              </span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

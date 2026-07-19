"use client";

import { Question } from "@/lib/types";
import { CheckCircle2, XCircle, ThumbsUp, ThumbsDown } from "lucide-react";

interface TrueFalseProps {
  question: Extract<Question, { type: "true_false" }>;
  selected: "true" | "false" | null;
  locked: boolean;
  onSelect: (value: "true" | "false") => void;
}

export default function TrueFalse({ question, selected, locked, onSelect }: TrueFalseProps) {
  const options: { id: "true" | "false"; label: string; Icon: typeof ThumbsUp }[] = [
    { id: "true", label: "True / Correct", Icon: ThumbsUp },
    { id: "false", label: "False / Incorrect", Icon: ThumbsDown },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 my-2">
      {options.map((opt) => {
        const isSelected = selected === opt.id;
        const isCorrectOption = question.answer === opt.id;
        const showCorrect = locked && isCorrectOption;
        const showWrong = locked && isSelected && !isCorrectOption;

        let cardClass = "choice flex-col justify-center items-center py-6 text-center gap-2";
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
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                showCorrect ? "bg-emerald-600 text-white" :
                showWrong ? "bg-rose-600 text-white" :
                isSelected ? "bg-emerald-600 text-white scale-110" :
                "bg-slate-100 text-slate-600"
              }`}
            >
              <opt.Icon className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-lg mt-1">{opt.label.split(" / ")[0]}</span>
            <span className="text-[11.5px] font-semibold text-slate-500 uppercase tracking-wider">
              {opt.label.split(" / ")[1]}
            </span>

            {showCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-600 absolute top-3 right-3 animate-bounce-soft" />}
            {showWrong && <XCircle className="w-6 h-6 text-rose-600 absolute top-3 right-3 animate-shake" />}
          </button>
        );
      })}
    </div>
  );
}

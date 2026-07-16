"use client";

import { Question } from "@/lib/types";

interface TrueFalseProps {
  question: Extract<Question, { type: "true_false" }>;
  selected: "true" | "false" | null;
  locked: boolean;
  onSelect: (value: "true" | "false") => void;
}

export default function TrueFalse({ selected, locked, onSelect }: TrueFalseProps) {
  const options: { id: "true" | "false"; label: string }[] = [
    { id: "true", label: "True" },
    { id: "false", label: "False" },
  ];

  return (
    <div className="stack-sm">
      {options.map((opt) => {
        const isSelected = selected === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            disabled={locked}
            className={`choice ${isSelected ? "selected" : ""}`}
            onClick={() => onSelect(opt.id)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

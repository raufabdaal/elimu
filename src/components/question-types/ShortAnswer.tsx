"use client";

import { Question } from "@/lib/types";

interface ShortAnswerProps {
  question: Extract<Question, { type: "short_answer" }>;
  value: string;
  locked: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export default function ShortAnswer({ question, value, locked, onChange, onSubmit }: ShortAnswerProps) {
  return (
    <>
      <label className="sr-only" htmlFor="answer">
        Your answer
      </label>
      <input
        id="answer"
        type="text"
        inputMode={/\d/.test(question.answer || "") ? "numeric" : "text"}
        autoComplete="off"
        placeholder="?"
        value={value}
        disabled={locked}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        className="answer-input"
      />
    </>
  );
}

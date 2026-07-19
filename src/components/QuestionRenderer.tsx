"use client";

import { Question } from "@/lib/types";
import MultipleChoice from "./question-types/MultipleChoice";
import ShortAnswer from "./question-types/ShortAnswer";
import TrueFalse from "./question-types/TrueFalse";
import MultiSelect from "./question-types/MultiSelect";
import Ordering from "./question-types/Ordering";
import Matching from "./question-types/Matching";

interface QuestionRendererProps {
  question: Question;
  state: QuestionState;
  locked: boolean;
  onStateChange: (state: QuestionState) => void;
  onSubmit: () => void;
}

export type QuestionState =
  | { type: "multiple_choice"; selected: string | null }
  | { type: "short_answer"; value: string }
  | { type: "true_false"; selected: "true" | "false" | null }
  | { type: "multi_select"; selected: string[] }
  | { type: "ordering"; order: string[] }
  | { type: "matching"; matches: Record<string, string> };

export function getInitialState(question: Question): QuestionState {
  switch (question.type) {
    case "multiple_choice":
      return { type: "multiple_choice", selected: null };
    case "short_answer":
      return { type: "short_answer", value: "" };
    case "true_false":
      return { type: "true_false", selected: null };
    case "multi_select":
      return { type: "multi_select", selected: [] };
    case "ordering":
      return { type: "ordering", order: shuffle([...question.items.map((i) => i.id)]) };
    case "matching":
      return { type: "matching", matches: {} };
  }
}

export function isAnswered(question: Question, state: QuestionState): boolean {
  if (state.type !== question.type) return false;

  switch (state.type) {
    case "multiple_choice":
      return state.selected !== null;
    case "short_answer":
      return state.value.trim().length > 0;
    case "true_false":
      return state.selected !== null;
    case "multi_select":
      return state.selected.length > 0;
    case "ordering":
      return state.order.length > 0;
    case "matching":
      return Object.keys(state.matches).length > 0;
  }
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function QuestionRenderer({
  question,
  state,
  locked,
  onStateChange,
  onSubmit,
}: QuestionRendererProps) {
  if (state.type !== question.type) return null;

  switch (state.type) {
    case "multiple_choice":
      if (question.type !== "multiple_choice") return null;
      return (
        <MultipleChoice
          question={question}
          selected={state.selected}
          locked={locked}
          onSelect={(selected) => onStateChange({ type: "multiple_choice", selected })}
        />
      );
    case "short_answer":
      if (question.type !== "short_answer") return null;
      return (
        <ShortAnswer
          question={question}
          value={state.value}
          locked={locked}
          onChange={(value) => onStateChange({ type: "short_answer", value })}
          onSubmit={onSubmit}
        />
      );
    case "true_false":
      if (question.type !== "true_false") return null;
      return (
        <TrueFalse
          question={question}
          selected={state.selected}
          locked={locked}
          onSelect={(selected) => onStateChange({ type: "true_false", selected })}
        />
      );
    case "multi_select":
      if (question.type !== "multi_select") return null;
      return (
        <MultiSelect
          question={question}
          selected={state.selected}
          locked={locked}
          onToggle={(id) => {
            const current = state.selected;
            const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
            onStateChange({ type: "multi_select", selected: next });
          }}
        />
      );
    case "ordering":
      if (question.type !== "ordering") return null;
      return (
        <Ordering
          question={question}
          order={state.order}
          locked={locked}
          onReorder={(order) => onStateChange({ type: "ordering", order })}
        />
      );
    case "matching":
      if (question.type !== "matching") return null;
      return (
        <Matching
          question={question}
          matches={state.matches}
          locked={locked}
          onMatch={(matches) => onStateChange({ type: "matching", matches })}
        />
      );
  }
}

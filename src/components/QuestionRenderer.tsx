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

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function isAnswered(question: Question, state: QuestionState): boolean {
  switch (question.type) {
    case "multiple_choice":
      return (state as Extract<QuestionState, { type: "multiple_choice" }>).selected !== null;
    case "short_answer":
      return (state as Extract<QuestionState, { type: "short_answer" }>).value.trim() !== "";
    case "true_false":
      return (state as Extract<QuestionState, { type: "true_false" }>).selected !== null;
    case "multi_select":
      return (state as Extract<QuestionState, { type: "multi_select" }>).selected.length > 0;
    case "ordering":
      return true;
    case "matching":
      return Object.keys((state as Extract<QuestionState, { type: "matching" }>).matches).length === question.pairs.length;
  }
}

export default function QuestionRenderer({ question, state, locked, onStateChange, onSubmit }: QuestionRendererProps) {
  switch (question.type) {
    case "multiple_choice":
      return (
        <MultipleChoice
          question={question}
          selected={(state as Extract<QuestionState, { type: "multiple_choice" }>).selected}
          locked={locked}
          onSelect={(id) => onStateChange({ type: "multiple_choice", selected: id })}
        />
      );
    case "short_answer":
      return (
        <ShortAnswer
          question={question}
          value={(state as Extract<QuestionState, { type: "short_answer" }>).value}
          locked={locked}
          onChange={(value) => onStateChange({ type: "short_answer", value })}
          onSubmit={onSubmit}
        />
      );
    case "true_false":
      return (
        <TrueFalse
          question={question}
          selected={(state as Extract<QuestionState, { type: "true_false" }>).selected}
          locked={locked}
          onSelect={(value) => onStateChange({ type: "true_false", selected: value })}
        />
      );
    case "multi_select":
      return (
        <MultiSelect
          question={question}
          selected={(state as Extract<QuestionState, { type: "multi_select" }>).selected}
          locked={locked}
          onToggle={(id) => {
            const current = (state as Extract<QuestionState, { type: "multi_select" }>).selected;
            const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
            onStateChange({ type: "multi_select", selected: next });
          }}
        />
      );
    case "ordering":
      return (
        <Ordering
          question={question}
          order={(state as Extract<QuestionState, { type: "ordering" }>).order}
          locked={locked}
          onReorder={(order) => onStateChange({ type: "ordering", order })}
        />
      );
    case "matching":
      return (
        <Matching
          question={question}
          matches={(state as Extract<QuestionState, { type: "matching" }>).matches}
          locked={locked}
          onMatch={(matches) => onStateChange({ type: "matching", matches })}
        />
      );
  }
}

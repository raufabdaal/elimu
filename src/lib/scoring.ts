import { Question } from "@/lib/types";
import { QuestionState } from "@/components/QuestionRenderer";

export function normalizeAnswer(value: string): string {
  return value.trim().replace(/\s+/g, "").toLowerCase();
}

export function checkAnswer(question: Question, state: QuestionState): { correct: boolean; partial: number } {
  switch (question.type) {
    case "multiple_choice": {
      const selected = (state as Extract<QuestionState, { type: "multiple_choice" }>).selected;
      const option = question.options.find((o) => o.id === selected);
      return { correct: !!option?.correct, partial: option?.correct ? 1 : 0 };
    }
    case "short_answer": {
      const value = (state as Extract<QuestionState, { type: "short_answer" }>).value;
      const correct = normalizeAnswer(value) === normalizeAnswer(question.answer);
      return { correct, partial: correct ? 1 : 0 };
    }
    case "true_false": {
      const selected = (state as Extract<QuestionState, { type: "true_false" }>).selected;
      const correct = selected === question.answer;
      return { correct, partial: correct ? 1 : 0 };
    }
    case "multi_select": {
      const selected = (state as Extract<QuestionState, { type: "multi_select" }>).selected;
      const correctIds = question.options.filter((o) => o.correct).map((o) => o.id);
      const allCorrectSelected = correctIds.every((id) => selected.includes(id));
      const noWrongSelected = selected.every((id) => correctIds.includes(id));
      const correct = allCorrectSelected && noWrongSelected;
      const partial = correctIds.length > 0 ? selected.filter((id) => correctIds.includes(id)).length / correctIds.length : 0;
      return { correct, partial };
    }
    case "ordering": {
      const order = (state as Extract<QuestionState, { type: "ordering" }>).order;
      const correct = JSON.stringify(order) === JSON.stringify(question.correctOrder);
      return { correct, partial: correct ? 1 : 0 };
    }
    case "matching": {
      const matches = (state as Extract<QuestionState, { type: "matching" }>).matches;
      const correctCount = question.pairs.filter((p) => matches[p.id] === p.right).length;
      const correct = correctCount === question.pairs.length;
      return { correct, partial: question.pairs.length > 0 ? correctCount / question.pairs.length : 0 };
    }
  }
}

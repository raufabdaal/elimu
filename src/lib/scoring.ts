import { Question } from "@/lib/types";
import { QuestionState } from "@/components/QuestionRenderer";

export function normalizeAnswer(value: string): string {
  return value.trim().replace(/\s+/g, "").toLowerCase();
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export interface CheckAnswerResult {
  correct: boolean;
  partial: number;
  keywordMatch?: boolean;
  standardAnswer?: string;
  scoredKeywords?: string[];
}

export function checkAnswer(question: Question, state: QuestionState): CheckAnswerResult {
  switch (question.type) {
    case "multiple_choice": {
      const selected = (state as Extract<QuestionState, { type: "multiple_choice" }>).selected;
      const option = question.options.find((o) => o.id === selected);
      return { correct: !!option?.correct, partial: option?.correct ? 1 : 0 };
    }
    case "short_answer": {
      const value = (state as Extract<QuestionState, { type: "short_answer" }>).value;
      const userNorm = normalizeAnswer(value);
      const exactNorm = normalizeAnswer(question.answer);
      const exactMatch = userNorm === exactNorm;

      if (exactMatch) {
        return { correct: true, partial: 1, keywordMatch: false, standardAnswer: question.answer };
      }

      // Check if this is a Mathematics or strictly number-based question
      const isMathOrNumeric = question.topicId?.includes("-math") ||
        question.id.includes("math") ||
        question.id.includes("nm") ||
        question.id.includes("am") ||
        question.id.includes("st") ||
        (/\d/.test(question.answer) && /^[\d\s+\-*/.,=()^%°$€£¥A-Za-z:;]+$/.test(question.answer.trim()));

      if (isMathOrNumeric) {
        // Strict exact evaluation for math/numbers without fuzzy keyword matching
        const cleanUserNum = userNorm.replace(/,/g, "");
        const cleanExactNum = exactNorm.replace(/,/g, "");
        if (cleanUserNum === cleanExactNum) {
          return { correct: true, partial: 1, keywordMatch: false, standardAnswer: question.answer };
        }
        // Check fraction/decimal equivalence if numeric
        const parseFractionOrDecimal = (str: string): number | null => {
          if (!isNaN(Number(str))) return Number(str);
          if (str.includes("/")) {
            const parts = str.trim().split(/\s+/);
            if (parts.length === 2 && parts[1].includes("/")) {
              const [whole, frac] = parts;
              const [num, den] = frac.split("/").map(Number);
              if (den && !isNaN(Number(whole)) && !isNaN(num)) return Number(whole) + num / den;
            } else if (parts.length === 1 && str.includes("/")) {
              const [num, den] = str.split("/").map(Number);
              if (den && !isNaN(num)) return num / den;
            }
          }
          return null;
        };
        const uVal = parseFractionOrDecimal(value.trim());
        const eVal = parseFractionOrDecimal(question.answer.trim());
        if (uVal !== null && eVal !== null && Math.abs(uVal - eVal) < 0.0001) {
          return { correct: true, partial: 1, keywordMatch: false, standardAnswer: question.answer };
        }
        return { correct: false, partial: 0, keywordMatch: false, standardAnswer: question.answer };
      }

      // For English, Social Studies, and non-numeric Science short answers: run intelligent keyword scoring
      const userClean = value.trim().toLowerCase();
      const ansClean = question.answer.trim().toLowerCase();

      let keywords: string[] = question.keywords && question.keywords.length > 0
        ? question.keywords.map((k) => k.trim().toLowerCase())
        : [];

      if (keywords.length === 0 && ansClean.length > 2) {
        const stopWords = new Set([
          "the", "a", "an", "is", "of", "to", "in", "on", "at", "for", "by", "with",
          "and", "or", "lake", "mount", "mt", "st", "river", "district", "city", "town"
        ]);
        const words = ansClean
          .split(/[\s,.\-_/()]+/)
          .filter((w) => w.length > 2 && !stopWords.has(w));
        if (words.length > 0) {
          keywords = words;
        }
      }

      let keywordMatch = false;
      let matchedList: string[] = [];

      if (keywords.length > 0) {
        matchedList = keywords.filter((k) => userClean.includes(k) || k.includes(userClean));
        if (matchedList.length > 0) {
          keywordMatch = true;
        }
      } else if (ansClean.includes(userClean) || userClean.includes(ansClean)) {
        keywordMatch = true;
        matchedList = [ansClean];
      }

      if (keywordMatch) {
        return {
          correct: true,
          partial: 1,
          keywordMatch: true,
          standardAnswer: question.answer,
          scoredKeywords: matchedList,
        };
      }

      return {
        correct: false,
        partial: 0,
        keywordMatch: false,
        standardAnswer: question.answer,
        scoredKeywords: keywords,
      };
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

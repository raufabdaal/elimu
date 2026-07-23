import { Question } from "@/lib/types";
import { QuestionState } from "@/components/QuestionRenderer";

function normalizeQuotes(value: string): string {
  return value
    .replace(/[‘’‛`]/g, "'")
    .replace(/[“”„]/g, '"')
    .replace(/\u00A0/g, " ");
}

export function normalizeAnswer(value: string): string {
  return normalizeQuotes(value).trim().replace(/\s+/g, "").toLowerCase();
}

function normalizeLooseText(value: string): string {
  return normalizeQuotes(value).trim().replace(/\s+/g, " ").toLowerCase();
}

function normalizeKeywordText(value: string): string {
  return normalizeLooseText(value)
    .replace(/[.,!?;:"()\[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const PUNCTUATION_ALIASES: Array<{ symbol: string; names: string[] }> = [
  { symbol: ".", names: ["full stop", "period", "dot"] },
  { symbol: ",", names: ["comma"] },
  { symbol: "?", names: ["question mark"] },
  { symbol: "!", names: ["exclamation mark", "exclamation point"] },
  { symbol: "'", names: ["apostrophe", "single quote", "single quotation mark", "inverted comma"] },
  { symbol: '"', names: ["quotation mark", "quotation marks", "speech mark", "speech marks", "inverted commas", "double quote"] },
  { symbol: ":", names: ["colon"] },
  { symbol: ";", names: ["semicolon", "semi colon"] },
  { symbol: "-", names: ["hyphen"] },
  { symbol: "(", names: ["opening bracket", "left bracket", "open bracket"] },
  { symbol: ")", names: ["closing bracket", "right bracket", "close bracket"] },
];

function normalizePunctuationName(value: string): string {
  return normalizeLooseText(value)
    .replace(/^(a|an|the)\s+/, "")
    .replace(/[._,!?;:"'()\[\]{}]/g, " ")
    .replace(/[-\s]+/g, "")
    .trim();
}

function punctuationAliasKeysForAnswer(answer: string): Set<string> {
  const answerLoose = normalizeLooseText(answer).replace(/^(a|an|the)\s+/, "").trim();
  const answerName = normalizePunctuationName(answer);
  const keys = new Set<string>();

  for (const item of PUNCTUATION_ALIASES) {
    const names = item.names.map(normalizePunctuationName);
    const answerIsThisMark = answerLoose === item.symbol || names.includes(answerName);
    if (!answerIsThisMark) continue;

    keys.add(item.symbol);
    for (const name of item.names) keys.add(normalizePunctuationName(name));
  }

  return keys;
}

function punctuationAliasMatch(userAnswer: string, modelAnswer: string): boolean {
  const validKeys = punctuationAliasKeysForAnswer(modelAnswer);
  if (validKeys.size === 0) return false;

  const userLoose = normalizeLooseText(userAnswer).trim();
  const userName = normalizePunctuationName(userAnswer);
  return validKeys.has(userLoose) || validKeys.has(userName);
}

function isMathOrNumericQuestion(question: Extract<Question, { type: "short_answer" }>): boolean {
  const id = question.id.toLowerCase();
  const topicId = (question.topicId || "").toLowerCase();
  const answer = question.answer.trim();

  const isMathTopic =
    topicId.startsWith("math-") ||
    topicId.includes("-math-") ||
    /(^|-)math($|-)/.test(id) ||
    /^p[4-7]-(st|nm|am|fm|dm|im|gm|me)\d/.test(id) ||
    /^p[4-7](st|nm|am|fm|dm|im|gm|me)\d/.test(id);

  const isStrictNumericAnswer =
    /\d/.test(answer) &&
    /^[\d\s+\-*/.,=()^%°$€£¥:;\/]+$/.test(answer);

  return isMathTopic || isStrictNumericAnswer;
}

function isEnglishQuestion(question: Extract<Question, { type: "short_answer" }>): boolean {
  const id = question.id.toLowerCase();
  const topicId = (question.topicId || "").toLowerCase();
  const combined = `${question.question} ${question.answer} ${question.hint || ""}`.toLowerCase();

  return (
    topicId.startsWith("eng-") ||
    topicId.includes("-eng-") ||
    /(^|-)eng($|-)/.test(id) ||
    /^p[4-7]-(eg|eng|er|ew|co)/.test(id) ||
    /^p[4-7](eg|er|ew|co)\d/.test(id) ||
    /\b(grammar|punctuation|apostrophe|comma|full stop|question mark|exclamation|quotation|direct speech|capital letter|spelling|prefix|suffix|conjunction|preposition|adverb|adjective|verb|noun|pronoun|composition)\b/.test(combined)
  );
}

function requiresExactEnglishText(question: Extract<Question, { type: "short_answer" }>): boolean {
  if (!isEnglishQuestion(question)) return false;

  const combined = `${question.question} ${question.answer} ${question.hint || ""}`.toLowerCase();
  const hasExplicitKeywords = !!(question.keywords && question.keywords.length > 0);
  const mechanicsOrFormQuestion = /(punctuat|apostrophe|comma|full stop|question mark|exclamation|quotation|speech mark|inverted comma|capital|capitalize|capitalise|contracted|contraction|corrected word|corrected sentence|correctly written|spell|spelling|plural form|singular form|prefix|suffix|rewrite|write only|direct speech)/.test(combined);

  return mechanicsOrFormQuestion || !hasExplicitKeywords;
}

function parseFractionOrDecimal(str: string): number | null {
  const cleaned = str.trim().replace(/,/g, "");
  if (!Number.isNaN(Number(cleaned)) && cleaned !== "") return Number(cleaned);
  if (cleaned.includes("/")) {
    const parts = cleaned.trim().split(/\s+/);
    if (parts.length === 2 && parts[1].includes("/")) {
      const [whole, frac] = parts;
      const [num, den] = frac.split("/").map(Number);
      if (den && !Number.isNaN(Number(whole)) && !Number.isNaN(num)) return Number(whole) + num / den;
    } else if (parts.length === 1 && cleaned.includes("/")) {
      const [num, den] = cleaned.split("/").map(Number);
      if (den && !Number.isNaN(num)) return num / den;
    }
  }
  return null;
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
  selectedCorrectCount?: number;
  totalCorrectCount?: number;
  missingOptions?: string[];
  wrongSelections?: string[];
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

      if (exactMatch || punctuationAliasMatch(value, question.answer)) {
        return { correct: true, partial: 1, keywordMatch: false, standardAnswer: question.answer };
      }

      if (isMathOrNumericQuestion(question)) {
        const cleanUserNum = userNorm.replace(/,/g, "");
        const cleanExactNum = exactNorm.replace(/,/g, "");
        if (cleanUserNum === cleanExactNum) {
          return { correct: true, partial: 1, keywordMatch: false, standardAnswer: question.answer };
        }

        const uVal = parseFractionOrDecimal(value);
        const eVal = parseFractionOrDecimal(question.answer);
        if (uVal !== null && eVal !== null && Math.abs(uVal - eVal) < 0.0001) {
          return { correct: true, partial: 1, keywordMatch: false, standardAnswer: question.answer };
        }
        return { correct: false, partial: 0, keywordMatch: false, standardAnswer: question.answer };
      }

      if (requiresExactEnglishText(question)) {
        return { correct: false, partial: 0, keywordMatch: false, standardAnswer: question.answer };
      }

      const userClean = normalizeKeywordText(value);
      const ansClean = normalizeKeywordText(question.answer);
      const qText = normalizeKeywordText(question.question);
      const meaningfulUser = userClean.length >= 3;

      const domainMap: { [key: string]: string[] } = {
        "national park": ["bwindi", "queen elizabeth", "murchison", "kidepo", "mgahinga", "lake mburo", "semuliki", "rwenzori", "elgon", "kibale"],
        "equator": ["kasese", "kamwenge", "ibanda", "kiruhura", "sembabule", "mpigi", "masaka", "kalangala", "kayabwe", "0 degree", "zero degree", "0°"],
        "lake": ["victoria", "albert", "kyoga", "edward", "george", "bunyonyi", "mutanda", "bisina"],
        "river": ["nile", "victoria nile", "katonga", "kafue", "achwa", "semliki", "kagera", "mpologoma"],
        "vector": ["mosquito", "anopheles", "aedes", "housefly", "tsetse", "fly", "rat", "flea", "cockroach", "snail"],
        "photosynthesis": ["photosynthesis", "chlorophyll", "sunlight", "carbon dioxide", "glucose", "stomata", "water"],
        "first aid": ["first aid", "help", "immediate", "temporary", "bandage", "gauze", "antiseptic", "cool water"],
        "mountain": ["rwenzori", "elgon", "mufumbiro", "moroto", "kadam", "margherita", "wagagai"],
        "tribe": ["baganda", "banyankole", "basoga", "bakiga", "acholi", "iteso", "langi", "lugbara", "banyoro", "batoro", "karamojong"],
        "cash crop": ["coffee", "tea", "cotton", "tobacco", "sugarcane", "vanilla", "cocoa", "sunflower"],
        "food crop": ["matooke", "banana", "cassava", "sweet potato", "maize", "beans", "millet", "sorghum", "groundnuts"],
      };

      let keywordMatch = false;
      let matchedList: string[] = [];
      let keywords: string[] = [];

      if (meaningfulUser) {
        for (const [key, validAnswers] of Object.entries(domainMap)) {
          if (qText.includes(key) || ansClean.includes(key)) {
            const matched = validAnswers.filter((va) => userClean.includes(va) || va.includes(userClean));
            if (matched.length > 0) {
              keywordMatch = true;
              matchedList = matched;
              keywords = validAnswers;
              break;
            }
          }
        }
      }

      if (!keywordMatch) {
        keywords = question.keywords && question.keywords.length > 0
          ? question.keywords.map((k) => normalizeKeywordText(k)).filter(Boolean)
          : [];

        if (keywords.length === 0 && ansClean.length > 2 && !isEnglishQuestion(question)) {
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

        if (keywords.length > 0 && meaningfulUser) {
          matchedList = keywords.filter((k) => userClean.includes(k) || (userClean.length >= 4 && k.includes(userClean)));
          if (matchedList.length > 0) {
            keywordMatch = true;
          }
        } else if (meaningfulUser && (ansClean.includes(userClean) || userClean.includes(ansClean))) {
          keywordMatch = true;
          matchedList = [ansClean];
        }
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
      const correctOptions = question.options.filter((o) => o.correct);
      const correctIds = correctOptions.map((o) => o.id);
      const selectedCorrectOptions = correctOptions.filter((o) => selected.includes(o.id));
      const wrongSelectedOptions = question.options.filter((o) => selected.includes(o.id) && !o.correct);
      const missingOptions = correctOptions.filter((o) => !selected.includes(o.id));
      const allCorrectSelected = correctIds.every((id) => selected.includes(id));
      const noWrongSelected = selected.every((id) => correctIds.includes(id));
      const correct = allCorrectSelected && noWrongSelected;
      const partial = correctIds.length > 0 ? selectedCorrectOptions.length / correctIds.length : 0;
      return {
        correct,
        partial,
        selectedCorrectCount: selectedCorrectOptions.length,
        totalCorrectCount: correctOptions.length,
        missingOptions: missingOptions.map((o) => o.text),
        wrongSelections: wrongSelectedOptions.map((o) => o.text),
      };
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

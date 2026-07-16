import { ClassLevel, Subject, Question } from "./types";

export const CLASS_LABELS: Record<ClassLevel, string> = {
  p4: "Primary 4",
  p5: "Primary 5",
  p6: "Primary 6",
  p7: "Primary 7",
};

export interface TopicData {
  id: string;
  name: string;
  subjectId: "math" | "sst";
  questions: Question[];
}

// =====================================================
// P7 MATHEMATICS - REAL SOURCED CONTENT
// =====================================================

const TOPICS: TopicData[] = [
  // ========== P7 MATH: SESSION 1 - Numbers, Fractions & Decimals ==========
  {
    id: "p7-numbers-session-1",
    name: "Numbers, Fractions & Decimals",
    subjectId: "math",
    questions: [
      {
        id: "p7n1",
        type: "short_answer",
        question: "Express 0.1666… as a common fraction in its simplest form.",
        answer: "1/6",
        hint: "Write as a fraction",
        explanation: "0.1666… = 1/6",
        deepDive: "This is a recurring decimal. Let x = 0.1666…, then 10x = 1.666… Subtracting gives 9x = 1.5 → x = 1/6.",
      },
      {
        id: "p7n2",
        type: "short_answer",
        question: "Write 0.0673 in scientific notation.",
        answer: "6.73 × 10⁻²",
        hint: "Move the decimal point",
        explanation: "0.0673 = 6.73 × 10⁻²",
        deepDive: "Scientific notation expresses numbers as a × 10ⁿ where 1 ≤ a < 10.",
      },
      {
        id: "p7n3",
        type: "multiple_choice",
        question: "A Mathematics test of 20 questions is marked out of 100%. If a teacher awards 5 marks for every correct answer and deducts 3 marks for every wrong answer. How many correct answers has a pupil who scores 68%?",
        options: [
          { id: "a", text: "14", correct: false },
          { id: "b", text: "16", correct: true },
          { id: "c", text: "17", correct: false },
          { id: "d", text: "15", correct: false },
        ],
        explanation: "Let x = correct answers. Then 5x - 3(20 - x) = 68 → 5x - 60 + 3x = 68 → 8x = 128 → x = 16.",
        deepDive: "This is a typical PLE word problem involving simultaneous equations.",
      },
      {
        id: "p7n4",
        type: "short_answer",
        question: "Simplify: (1.2 × 0.008) ÷ (0.16 × 0.3)",
        answer: "0.2",
        hint: "Calculate step by step",
        explanation: "(1.2 × 0.008) = 0.0096. (0.16 × 0.3) = 0.048. 0.0096 ÷ 0.048 = 0.2",
        deepDive: "Always work out multiplication first before division.",
      },
      {
        id: "p7n5",
        type: "short_answer",
        question: "Solve the inequality: 18 ≤ 3n ≤ 24",
        answer: "6 ≤ n ≤ 8",
        hint: "Divide all parts by 3",
        explanation: "Dividing all parts by 3 gives 6 ≤ n ≤ 8.",
        deepDive: "When dividing or multiplying inequalities by a positive number, the inequality signs remain the same.",
      },
      {
        id: "p7n6",
        type: "short_answer",
        question: "Jack, Joan and John shared biscuits in the ratio 4:5:3. If Joan got 18 more biscuits than John, how many biscuits did Jack and John get altogether?",
        answer: "42",
        hint: "Find the value of one part",
        explanation: "Joan - John = 2 parts = 18 → 1 part = 9. Jack = 4 × 9 = 36, John = 3 × 9 = 27. Total = 63.",
        deepDive: "Difference between Joan and John is 2 parts (5 - 3).",
      },
      {
        id: "p7n7",
        type: "short_answer",
        question: "Express 45 in ternary (base 3).",
        answer: "1200₃",
        hint: "Divide repeatedly by 3",
        explanation: "45 ÷ 3 = 15 r0 → 15 ÷ 3 = 5 r0 → 5 ÷ 3 = 1 r2 → 1 ÷ 3 = 0 r1 → 1200₃",
        deepDive: "Read the remainders from bottom to top.",
      },
      {
        id: "p7n8",
        type: "multiple_choice",
        question: "Which of the following is equivalent to 3/8?",
        options: [
          { id: "a", text: "0.375", correct: true },
          { id: "b", text: "0.38", correct: false },
          { id: "c", text: "0.385", correct: false },
          { id: "d", text: "0.4", correct: false },
        ],
        explanation: "3 ÷ 8 = 0.375",
        deepDive: "To convert a fraction to decimal, divide the numerator by the denominator.",
      },
      {
        id: "p7n9",
        type: "true_false",
        question: "0.75 is greater than 3/4.",
        answer: "false",
        explanation: "0.75 = 3/4 exactly.",
        deepDive: "0.75 means 75 hundredths which is exactly three quarters.",
      },
      {
        id: "p7n10",
        type: "ordering",
        question: "Arrange these numbers from smallest to largest: 0.6, 3/5, 65%, 0.58",
        items: [
          { id: "a", text: "0.58" },
          { id: "b", text: "3/5" },
          { id: "c", text: "0.6" },
          { id: "d", text: "65%" },
        ],
        correctOrder: ["a", "b", "c", "d"],
        explanation: "0.58 < 0.6 = 3/5 < 0.65",
        deepDive: "Convert all to decimals: 0.58, 0.6, 0.6, 0.65.",
      },
      {
        id: "p7n11",
        type: "multiple_choice",
        question: "What is 2/5 as a percentage?",
        options: [
          { id: "a", text: "20%", correct: false },
          { id: "b", text: "40%", correct: true },
          { id: "c", text: "50%", correct: false },
          { id: "d", text: "25%", correct: false },
        ],
        explanation: "2 ÷ 5 = 0.4 → 0.4 × 100 = 40%",
        deepDive: "To convert a fraction to percentage, multiply by 100.",
      },
      {
        id: "p7n12",
        type: "short_answer",
        question: "Find the product of the first three odd numbers.",
        answer: "15",
        hint: "1 × 3 × 5",
        explanation: "The first three odd numbers are 1, 3 and 5. Their product is 15.",
        deepDive: "Odd numbers are not divisible by 2.",
      },
    ],
  },

  // ========== Placeholder for future P7 sessions ==========
  {
    id: "p7-algebra-session-1",
    name: "Algebra & Equations",
    subjectId: "math",
    questions: [], // Will be populated later
  },
];

export function getTopic(topicId: string): TopicData | undefined {
  return TOPICS.find((t) => t.id === topicId);
}

export function getTopicsForClass(): TopicData[] {
  return TOPICS;
}

export function getSubjects(classLevel: ClassLevel): Subject[] {
  const topics = getTopicsForClass();
  return [
    {
      id: "math",
      name: "Mathematics",
      icon: "math",
      topics: topics
        .filter((t) => t.subjectId === "math")
        .map((t) => ({
          id: `${classLevel}-math-${t.id}`,
          name: t.name,
          subtopicCount: t.questions.length,
          completed: false,
          inProgress: t.id === "p7-numbers-session-1",
        })),
    },
    {
      id: "sst",
      name: "Social Studies",
      icon: "sst",
      topics: topics
        .filter((t) => t.subjectId === "sst")
        .map((t) => ({
          id: `${classLevel}-sst-${t.id}`,
          name: t.name,
          subtopicCount: t.questions.length,
          completed: false,
          inProgress: false,
        })),
    },
  ];
}

export const PRACTICE_QUESTIONS = TOPICS.flatMap((topic) =>
  topic.questions.map((q) => ({
    ...q,
    topicId: `${topic.subjectId}-${topic.id}`,
  }))
);

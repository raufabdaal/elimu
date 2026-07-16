import { ClassLevel, Subject } from "./types";

export const CLASS_LABELS: Record<ClassLevel, string> = {
  p4: "Primary 4",
  p5: "Primary 5",
  p6: "Primary 6",
  p7: "Primary 7",
};

export interface TopicQuestion {
  id: string;
  type: "multiple_choice" | "short_answer";
  question: string;
  options?: { id: string; text: string; correct: boolean }[];
  answer?: string;
  hint?: string;
  explanation: string;
  deepDive?: string; // optional longer explanation paragraph
}

export interface TopicData {
  id: string;
  name: string;
  subjectId: "math" | "sst";
  questions: TopicQuestion[];
}

const TOPICS: TopicData[] = [
  {
    id: "fractions",
    name: "Fractions",
    subjectId: "math",
    questions: [
      {
        id: "f1",
        type: "multiple_choice",
        question: "Which fraction means three equal parts out of four?",
        options: [
          { id: "a", text: "1/3", correct: false },
          { id: "b", text: "3/4", correct: true },
          { id: "c", text: "4/3", correct: false },
        ],
        explanation: "3/4 means three parts out of four equal parts.",
        deepDive:
          "A fraction has two numbers. The bottom number (denominator) tells how many equal parts the whole is cut into. The top number (numerator) tells how many of those parts we are talking about.",
      },
      {
        id: "f2",
        type: "short_answer",
        question: "What is 1/2 of 8?",
        answer: "4",
        hint: "Type the number only",
        explanation: "Half of 8 is 4 because 8 ÷ 2 = 4.",
        deepDive:
          "When we share a chapati equally among friends, each piece is a fraction of the whole chapati. Half means one of two equal parts.",
      },
      {
        id: "f3",
        type: "multiple_choice",
        question: "How many quarters make one whole?",
        options: [
          { id: "a", text: "2", correct: false },
          { id: "b", text: "3", correct: false },
          { id: "c", text: "4", correct: true },
        ],
        explanation: "There are 4 quarters in one whole.",
        deepDive:
          "A quarter is one of four equal parts. Four quarters fit back together to make the whole thing again.",
      },
    ],
  },
  {
    id: "decimals",
    name: "Decimals",
    subjectId: "math",
    questions: [
      {
        id: "d1",
        type: "multiple_choice",
        question: "What is 0.5 as a fraction?",
        options: [
          { id: "a", text: "1/5", correct: false },
          { id: "b", text: "1/2", correct: true },
          { id: "c", text: "5/10", correct: false },
        ],
        explanation: "0.5 is the same as one half, or 1/2.",
        deepDive:
          "Decimals are another way to write fractions. The first digit after the point shows how many tenths you have.",
      },
    ],
  },
  {
    id: "measurement",
    name: "Measurement",
    subjectId: "math",
    questions: [
      {
        id: "m1",
        type: "short_answer",
        question: "How many centimetres are in 1 metre?",
        answer: "100",
        hint: "Type the number only",
        explanation: "1 metre equals 100 centimetres.",
        deepDive:
          "We use metres and centimetres to measure length. A metre is bigger, so it takes 100 centimetres to make one metre.",
      },
    ],
  },
  {
    id: "uganda",
    name: "Our country Uganda",
    subjectId: "sst",
    questions: [
      {
        id: "u1",
        type: "multiple_choice",
        question: "How many countries border Uganda?",
        options: [
          { id: "a", text: "Three", correct: false },
          { id: "b", text: "Four", correct: false },
          { id: "c", text: "Five", correct: true },
        ],
        explanation:
          "Uganda borders Kenya, South Sudan, DRC, Rwanda, and Tanzania — five neighbours.",
        deepDive:
          "Uganda is a landlocked country in East Africa. That means it has no coastline on the ocean — its borders touch land only.",
      },
      {
        id: "u2",
        type: "short_answer",
        question: "What is the capital city of Uganda?",
        answer: "Kampala",
        hint: "Type the city name",
        explanation: "Kampala is the capital city of Uganda.",
        deepDive:
          "Kampala is the largest city in Uganda and the centre of government, business, and transport.",
      },
    ],
  },
  {
    id: "maps",
    name: "Maps and location",
    subjectId: "sst",
    questions: [
      {
        id: "mp1",
        type: "short_answer",
        question: "Which large lake sits on Uganda's southern side?",
        answer: "Lake Victoria",
        hint: "Three-word name",
        explanation: "Lake Victoria is the large lake on Uganda's southern border.",
        deepDive:
          "Lake Victoria is Africa's largest lake by area. It is shared by Uganda, Kenya, and Tanzania.",
      },
    ],
  },
  {
    id: "weather",
    name: "Weather and climate",
    subjectId: "sst",
    questions: [
      {
        id: "w1",
        type: "multiple_choice",
        question: "Which of these measures how hot or cold the air is?",
        options: [
          { id: "a", text: "Rainfall", correct: false },
          { id: "b", text: "Temperature", correct: true },
          { id: "c", text: "Wind speed", correct: false },
        ],
        explanation: "Temperature tells us how hot or cold the air is.",
        deepDive:
          "Weather describes the air outside right now. Climate is the pattern of weather over a long time.",
      },
    ],
  },
];

export function getTopic(topicId: string): TopicData | undefined {
  return TOPICS.find((t) => t.id === topicId);
}

export function getTopicsForClass(): TopicData[] {
  // Later this can filter by class. For now, all topics are available.
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
          inProgress: t.id === "fractions",
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
          completed: t.id === "uganda",
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

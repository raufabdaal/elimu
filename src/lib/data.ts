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
// P7 SOCIAL STUDIES - PILOT TOPIC
// =====================================================

const TOPICS: TopicData[] = [
  // ========== P7 SST: SESSION 1 - Our Country Uganda ==========
  {
    id: "p7-uganda-session-1",
    name: "Our Country Uganda",
    subjectId: "sst",
    questions: [
      {
        id: "p7s1",
        type: "multiple_choice",
        question: "How many countries border Uganda?",
        options: [
          { id: "a", text: "Three", correct: false },
          { id: "b", text: "Four", correct: false },
          { id: "c", text: "Five", correct: true },
          { id: "d", text: "Six", correct: false },
        ],
        explanation: "Uganda borders five countries.",
        deepDive: "Uganda is bordered by Kenya to the east, South Sudan to the north, the Democratic Republic of Congo to the west, Rwanda to the southwest, and Tanzania to the south.",
      },
      {
        id: "p7s2",
        type: "short_answer",
        question: "What is the capital city of Uganda?",
        answer: "Kampala",
        hint: "It is also the largest city",
        explanation: "Kampala is the capital and largest city of Uganda.",
        deepDive: "Kampala is located in the central region of Uganda. It is the political, economic, and cultural centre of the country.",
      },
      {
        id: "p7s3",
        type: "multiple_choice",
        question: "Which of the following is NOT a neighbour of Uganda?",
        options: [
          { id: "a", text: "Kenya", correct: false },
          { id: "b", text: "Ethiopia", correct: true },
          { id: "c", text: "Tanzania", correct: false },
          { id: "d", text: "Rwanda", correct: false },
        ],
        explanation: "Ethiopia does not share a border with Uganda.",
        deepDive: "Uganda’s five neighbours are Kenya, South Sudan, DRC, Rwanda and Tanzania.",
      },
      {
        id: "p7s4",
        type: "true_false",
        question: "Uganda is a landlocked country.",
        answer: "true",
        explanation: "Yes. Uganda has no coastline on the Indian Ocean.",
        deepDive: "A landlocked country is one that does not have direct access to the sea. Uganda relies on the ports of Mombasa (Kenya) and Dar es Salaam (Tanzania) for international trade.",
      },
      {
        id: "p7s5",
        type: "short_answer",
        question: "Name the large lake that lies on Uganda’s southern border.",
        answer: "Lake Victoria",
        hint: "It is shared with Kenya and Tanzania",
        explanation: "Lake Victoria is the largest lake in Africa by area.",
        deepDive: "Lake Victoria is also known as Nalubaale. It is the source of the White Nile.",
      },
      {
        id: "p7s6",
        type: "matching",
        question: "Match each neighbour with the direction it lies from Uganda.",
        pairs: [
          { id: "p1", left: "Kenya", right: "East" },
          { id: "p2", left: "South Sudan", right: "North" },
          { id: "p3", left: "Rwanda", right: "South-west" },
          { id: "p4", left: "Tanzania", right: "South" },
        ],
        explanation: "Kenya is to the east, South Sudan to the north, Rwanda to the south-west, and Tanzania to the south.",
        deepDive: "Knowing the direction of neighbours helps in understanding Uganda’s position in the East African region.",
      },
      {
        id: "p7s7",
        type: "multiple_choice",
        question: "Which river flows out of Lake Victoria?",
        options: [
          { id: "a", text: "River Nile", correct: true },
          { id: "b", text: "River Kagera", correct: false },
          { id: "c", text: "River Semliki", correct: false },
          { id: "d", text: "River Katonga", correct: false },
        ],
        explanation: "The White Nile flows out of Lake Victoria.",
        deepDive: "The source of the Nile is at Jinja. This makes Uganda very important in the history and geography of the Nile.",
      },
      {
        id: "p7s8",
        type: "short_answer",
        question: "What is the highest mountain in Uganda?",
        answer: "Mount Rwenzori",
        hint: "Also called the Mountains of the Moon",
        explanation: "Mount Rwenzori is the highest mountain in Uganda.",
        deepDive: "Mount Rwenzori has several peaks including Margherita Peak which is 5,109 metres above sea level.",
      },
      {
        id: "p7s9",
        type: "true_false",
        question: "Uganda lies on the equator.",
        answer: "true",
        explanation: "Yes. The equator passes through Uganda.",
        deepDive: "The equator passes through the districts of Kayabwe, Masaka, and Kasese among others.",
      },
      {
        id: "p7s10",
        type: "multiple_choice",
        question: "Which of these is the official language of Uganda?",
        options: [
          { id: "a", text: "English", correct: true },
          { id: "b", text: "Swahili only", correct: false },
          { id: "c", text: "Luganda only", correct: false },
          { id: "d", text: "French", correct: false },
        ],
        explanation: "English is the official language of Uganda.",
        deepDive: "Swahili was also adopted as a second official language in 2022.",
      },
      {
        id: "p7s11",
        type: "ordering",
        question: "Arrange these regions of Uganda from north to south.",
        items: [
          { id: "north", text: "Northern Region" },
          { id: "east", text: "Eastern Region" },
          { id: "central", text: "Central Region" },
          { id: "west", text: "Western Region" },
        ],
        correctOrder: ["north", "east", "central", "west"],
        explanation: "Northern → Eastern → Central → Western",
        deepDive: "Uganda is divided into four regions: Northern, Eastern, Central and Western.",
      },
      {
        id: "p7s12",
        type: "short_answer",
        question: "Name one national park found in Uganda.",
        answer: "Murchison Falls National Park",
        hint: "There are many correct answers",
        explanation: "Uganda has several national parks including Murchison Falls, Queen Elizabeth, and Bwindi Impenetrable.",
        deepDive: "Uganda is known for its rich wildlife and biodiversity.",
      },
    ],
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
          inProgress: t.id === "p7-uganda-session-1",
        })),
    },
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

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

  // ========== P7 SST: SESSION 2 - Our Country Uganda (Continued) ==========
  {
    id: "p7-uganda-session-2",
    name: "Our Country Uganda (Session 2)",
    subjectId: "sst",
    questions: [
      {
        id: "p7s13",
        type: "multiple_choice",
        question: "Which district in Uganda is known as the source of the Nile?",
        options: [
          { id: "a", text: "Kampala", correct: false },
          { id: "b", text: "Jinja", correct: true },
          { id: "c", text: "Entebbe", correct: false },
          { id: "d", text: "Gulu", correct: false },
        ],
        explanation: "Jinja is where the Nile starts its journey from Lake Victoria.",
        deepDive: "The source of the Nile at Jinja is a major tourist attraction. The Owen Falls Dam was also built here.",
      },
      {
        id: "p7s14",
        type: "short_answer",
        question: "What is the name of the national animal of Uganda?",
        answer: "Uganda Kob",
        hint: "It appears on the coat of arms",
        explanation: "The Uganda Kob is the national animal of Uganda.",
        deepDive: "The Uganda Kob is a type of antelope. It is also featured on Uganda's coat of arms.",
      },
      {
        id: "p7s15",
        type: "true_false",
        question: "Uganda has access to the Indian Ocean through the port of Mombasa.",
        answer: "true",
        explanation: "Uganda uses the port of Mombasa in Kenya for sea trade.",
        deepDive: "Because Uganda is landlocked, it depends on neighbouring countries for access to the sea.",
      },
      {
        id: "p7s16",
        type: "multiple_choice",
        question: "Which of these is the longest river in Uganda?",
        options: [
          { id: "a", text: "River Nile", correct: true },
          { id: "b", text: "River Kagera", correct: false },
          { id: "c", text: "River Semliki", correct: false },
          { id: "d", text: "River Katonga", correct: false },
        ],
        explanation: "The River Nile is the longest river that flows through Uganda.",
        deepDive: "The Nile is not only the longest river in Uganda but also the longest river in the world.",
      },
      {
        id: "p7s17",
        type: "short_answer",
        question: "Name the mountain range found in western Uganda that has snow.",
        answer: "Rwenzori Mountains",
        hint: "Also called the Mountains of the Moon",
        explanation: "The Rwenzori Mountains have permanent snow on their peaks.",
        deepDive: "The Rwenzori Mountains are one of the few places in Africa with glaciers.",
      },
      {
        id: "p7s18",
        type: "multiple_choice",
        question: "Which region of Uganda is the most populated?",
        options: [
          { id: "a", text: "Northern Region", correct: false },
          { id: "b", text: "Central Region", correct: true },
          { id: "c", text: "Eastern Region", correct: false },
          { id: "d", text: "Western Region", correct: false },
        ],
        explanation: "The Central Region, especially around Kampala, has the highest population density.",
        deepDive: "Kampala and its surrounding districts have the highest concentration of people.",
      },
      {
        id: "p7s19",
        type: "true_false",
        question: "Lake Albert is found in Uganda.",
        answer: "true",
        explanation: "Lake Albert lies on the border between Uganda and the Democratic Republic of Congo.",
        deepDive: "Lake Albert is one of the African Great Lakes and is shared with DRC.",
      },
      {
        id: "p7s20",
        type: "short_answer",
        question: "What does the word 'Uganda' mean?",
        answer: "Land of the Ganda",
        hint: "It comes from the Baganda people",
        explanation: "The name Uganda comes from the Swahili word for the land of the Ganda people.",
        deepDive: "The British named the country after the largest ethnic group in the central region, the Baganda.",
      },
      {
        id: "p7s21",
        type: "multiple_choice",
        question: "Which of these is a UNESCO World Heritage Site in Uganda?",
        options: [
          { id: "a", text: "Bwindi Impenetrable Forest", correct: true },
          { id: "b", text: "Lake Victoria", correct: false },
          { id: "c", text: "Kampala City", correct: false },
          { id: "d", text: "Jinja Town", correct: false },
        ],
        explanation: "Bwindi Impenetrable Forest is a UNESCO World Heritage Site.",
        deepDive: "Bwindi is famous for its mountain gorillas and rich biodiversity.",
      },
      {
        id: "p7s22",
        type: "ordering",
        question: "Arrange these lakes from largest to smallest by area.",
        items: [
          { id: "vic", text: "Lake Victoria" },
          { id: "kyo", text: "Lake Kyoga" },
          { id: "alb", text: "Lake Albert" },
          { id: "geo", text: "Lake George" },
        ],
        correctOrder: ["vic", "kyo", "alb", "geo"],
        explanation: "Victoria > Kyoga > Albert > George",
        deepDive: "Lake Victoria is by far the largest lake in Uganda.",
      },
      {
        id: "p7s23",
        type: "short_answer",
        question: "What is the main cash crop grown in Uganda?",
        answer: "Coffee",
        hint: "It is exported in large quantities",
        explanation: "Coffee is Uganda's main cash crop and major export.",
        deepDive: "Uganda is one of the top coffee producers in Africa.",
      },
      {
        id: "p7s24",
        type: "multiple_choice",
        question: "Which of these cities is found in the Eastern Region of Uganda?",
        options: [
          { id: "a", text: "Gulu", correct: false },
          { id: "b", text: "Mbale", correct: true },
          { id: "c", text: "Mbarara", correct: false },
          { id: "d", text: "Hoima", correct: false },
        ],
        explanation: "Mbale is the largest city in the Eastern Region.",
        deepDive: "Other major towns in the east include Jinja, Iganga, and Tororo.",
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
          inProgress: t.id.includes("p7-uganda-session"),
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

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
// P7 SOCIAL STUDIES - "OUR COUNTRY UGANDA"
// Structured according to official curriculum coverage
// =====================================================

const TOPICS: TopicData[] = [
  // =====================================================
  // SESSION 1: Location, Physical Features & Administration
  // =====================================================
  {
    id: "p7-uganda-session-1",
    name: "Our Country Uganda (Session 1)",
    subjectId: "sst",
    questions: [
      // --- Location & Position (6 questions) ---
      {
        id: "p7s1-1",
        type: "multiple_choice",
        question: "How many countries border Uganda?",
        options: [
          { id: "a", text: "Three", correct: false },
          { id: "b", text: "Four", correct: false },
          { id: "c", text: "Five", correct: true },
          { id: "d", text: "Six", correct: false },
        ],
        explanation: "Uganda is bordered by five countries.",
        deepDive: "Uganda shares borders with Kenya (east), South Sudan (north), Democratic Republic of Congo (west), Rwanda (southwest), and Tanzania (south).",
      },
      {
        id: "p7s1-2",
        type: "true_false",
        question: "Uganda is a landlocked country.",
        answer: "true",
        explanation: "Uganda does not have direct access to the sea.",
        deepDive: "A landlocked country has no coastline. Uganda uses the ports of Mombasa in Kenya and Dar es Salaam in Tanzania for international trade.",
      },
      {
        id: "p7s1-3",
        type: "multiple_choice",
        question: "Which country lies to the east of Uganda?",
        options: [
          { id: "a", text: "Tanzania", correct: false },
          { id: "b", text: "Kenya", correct: true },
          { id: "c", text: "South Sudan", correct: false },
          { id: "d", text: "DR Congo", correct: false },
        ],
        explanation: "Kenya lies to the east of Uganda.",
        deepDive: "The border between Uganda and Kenya runs from Lake Victoria in the south to South Sudan in the north.",
      },
      {
        id: "p7s1-4",
        type: "short_answer",
        question: "The equator passes through which region of Uganda?",
        answer: "Central Region",
        hint: "It passes near Kampala",
        explanation: "The equator passes through the Central Region of Uganda.",
        deepDive: "The equator crosses Uganda in districts such as Kayabwe, Mpigi, and parts of Kasese in the west.",
      },
      {
        id: "p7s1-5",
        type: "matching",
        question: "Match the neighbouring country with its correct direction from Uganda.",
        pairs: [
          { id: "p1", left: "Kenya", right: "East" },
          { id: "p2", left: "South Sudan", right: "North" },
          { id: "p3", left: "Rwanda", right: "Southwest" },
          { id: "p4", left: "Tanzania", right: "South" },
        ],
        explanation: "Kenya is east, South Sudan is north, Rwanda is southwest, and Tanzania is south.",
        deepDive: "Knowing directions helps in understanding Uganda’s strategic position in East Africa.",
      },
      {
        id: "p7s1-6",
        type: "true_false",
        question: "Uganda lies entirely north of the equator.",
        answer: "false",
        explanation: "The equator passes through Uganda.",
        deepDive: "Uganda is one of the few countries in the world that is crossed by the equator.",
      },

      // --- Physical Features (4 questions) ---
      {
        id: "p7s1-7",
        type: "short_answer",
        question: "What is the largest lake in Uganda by area?",
        answer: "Lake Victoria",
        hint: "It is shared with Kenya and Tanzania",
        explanation: "Lake Victoria is the largest lake in Uganda and Africa.",
        deepDive: "Lake Victoria (also called Nalubaale) is the source of the White Nile and is shared by Uganda, Kenya, and Tanzania.",
      },
      {
        id: "p7s1-8",
        type: "multiple_choice",
        question: "Which river flows out of Lake Victoria?",
        options: [
          { id: "a", text: "River Nile", correct: true },
          { id: "b", text: "River Kagera", correct: false },
          { id: "c", text: "River Semliki", correct: false },
          { id: "d", text: "River Katonga", correct: false },
        ],
        explanation: "The White Nile flows out of Lake Victoria at Jinja.",
        deepDive: "The source of the Nile at Jinja is a major tourist attraction and historical landmark.",
      },
      {
        id: "p7s1-9",
        type: "short_answer",
        question: "Name the highest mountain range in Uganda.",
        answer: "Rwenzori Mountains",
        hint: "Also known as the Mountains of the Moon",
        explanation: "The Rwenzori Mountains are the highest in Uganda.",
        deepDive: "The Rwenzori Mountains have permanent snow and glaciers. The highest peak is Margherita at 5,109 metres.",
      },
      {
        id: "p7s1-10",
        type: "multiple_choice",
        question: "Lake Albert lies on the border between Uganda and which country?",
        options: [
          { id: "a", text: "Kenya", correct: false },
          { id: "b", text: "Tanzania", correct: false },
          { id: "c", text: "Democratic Republic of Congo", correct: true },
          { id: "d", text: "Rwanda", correct: false },
        ],
        explanation: "Lake Albert is shared with the Democratic Republic of Congo.",
        deepDive: "Lake Albert is one of the African Great Lakes and is important for fishing and oil exploration.",
      },

      // --- Administrative Units (2 questions) ---
      {
        id: "p7s1-11",
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
        deepDive: "Uganda is divided into four regions for administrative purposes.",
      },
      {
        id: "p7s1-12",
        type: "short_answer",
        question: "Which city is the capital of Uganda?",
        answer: "Kampala",
        hint: "It is also the largest city",
        explanation: "Kampala is the capital city of Uganda.",
        deepDive: "Kampala is located in the Central Region and serves as the political, economic, and cultural centre of the country.",
      },
    ],
  },

  // =====================================================
  // SESSION 2: Economy, Tourism & Climate
  // =====================================================
  {
    id: "p7-uganda-session-2",
    name: "Our Country Uganda (Session 2)",
    subjectId: "sst",
    questions: [
      // --- Economy (5 questions) ---
      {
        id: "p7s2-1",
        type: "multiple_choice",
        question: "What is Uganda’s main cash crop?",
        options: [
          { id: "a", text: "Tea", correct: false },
          { id: "b", text: "Coffee", correct: true },
          { id: "c", text: "Cotton", correct: false },
          { id: "d", text: "Tobacco", correct: false },
        ],
        explanation: "Coffee is Uganda’s leading cash crop and export.",
        deepDive: "Uganda is one of the top coffee producers in Africa. Robusta coffee is mainly grown in the central and eastern regions.",
      },
      {
        id: "p7s2-2",
        type: "short_answer",
        question: "Name one mineral mined in Uganda.",
        answer: "Copper",
        hint: "It is mined in Kasese",
        explanation: "Copper is mined at Kilembe in Kasese district.",
        deepDive: "Other minerals include gold, cobalt, limestone, and recently discovered oil in the Albertine Graben.",
      },
      {
        id: "p7s2-3",
        type: "multiple_choice",
        question: "Which of these is an important export from Uganda?",
        options: [
          { id: "a", text: "Coffee", correct: true },
          { id: "b", text: "Rice", correct: false },
          { id: "c", text: "Wheat", correct: false },
          { id: "d", text: "Maize", correct: false },
        ],
        explanation: "Coffee is one of Uganda’s major exports.",
        deepDive: "Other exports include tea, fish, flowers, and gold.",
      },
      {
        id: "p7s2-4",
        type: "true_false",
        question: "Uganda exports oil to other countries.",
        answer: "false",
        explanation: "Uganda has discovered oil but is not yet exporting it in large quantities.",
        deepDive: "Oil was discovered in the Albertine Graben. Commercial production is expected to begin soon.",
      },
      {
        id: "p7s2-5",
        type: "short_answer",
        question: "What is the main food crop grown in Uganda?",
        answer: "Matooke (Bananas)",
        hint: "It is a staple food in central Uganda",
        explanation: "Matooke (cooking bananas) is the main staple food in many parts of Uganda.",
        deepDive: "Other important food crops include cassava, maize, sweet potatoes, and beans.",
      },

      // --- Tourism & Conservation (4 questions) ---
      {
        id: "p7s2-6",
        type: "multiple_choice",
        question: "Which national park in Uganda is famous for mountain gorillas?",
        options: [
          { id: "a", text: "Murchison Falls National Park", correct: false },
          { id: "b", text: "Bwindi Impenetrable National Park", correct: true },
          { id: "c", text: "Queen Elizabeth National Park", correct: false },
          { id: "d", text: "Lake Mburo National Park", correct: false },
        ],
        explanation: "Bwindi Impenetrable National Park is famous for mountain gorillas.",
        deepDive: "Bwindi is a UNESCO World Heritage Site and home to about half of the world’s mountain gorillas.",
      },
      {
        id: "p7s2-7",
        type: "short_answer",
        question: "Name one national park found in Uganda.",
        answer: "Murchison Falls National Park",
        hint: "There are many correct answers",
        explanation: "Uganda has several national parks including Murchison Falls, Queen Elizabeth, and Bwindi.",
        deepDive: "Other parks include Kibale, Semuliki, and Mgahinga Gorilla National Park.",
      },
      {
        id: "p7s2-8",
        type: "multiple_choice",
        question: "Which national park is known for its waterfalls?",
        options: [
          { id: "a", text: "Bwindi", correct: false },
          { id: "b", text: "Murchison Falls", correct: true },
          { id: "c", text: "Kibale", correct: false },
          { id: "d", text: "Lake Mburo", correct: false },
        ],
        explanation: "Murchison Falls National Park has the famous Murchison Falls.",
        deepDive: "The Nile River forces its way through a narrow gorge creating the spectacular Murchison Falls.",
      },
      {
        id: "p7s2-9",
        type: "true_false",
        question: "Uganda is known for its rich wildlife and biodiversity.",
        answer: "true",
        explanation: "Uganda has a wide variety of animals and plants.",
        deepDive: "Uganda is home to the ‘Big Five’ animals and over 1,000 species of birds.",
      },

      // --- Climate & Vegetation (3 questions) ---
      {
        id: "p7s2-10",
        type: "multiple_choice",
        question: "Which type of vegetation covers most of Uganda?",
        options: [
          { id: "a", text: "Desert", correct: false },
          { id: "b", text: "Savanna grassland", correct: true },
          { id: "c", text: "Tropical rainforest", correct: false },
          { id: "d", text: "Mediterranean", correct: false },
        ],
        explanation: "Savanna grassland is the most widespread vegetation in Uganda.",
        deepDive: "Tropical rainforests are found in some highland areas and parts of western Uganda.",
      },
      {
        id: "p7s2-11",
        type: "short_answer",
        question: "In which months does Uganda receive the highest rainfall?",
        answer: "March to May",
        hint: "This is the long rainy season",
        explanation: "Uganda has two rainy seasons: March–May and September–November.",
        deepDive: "The long rainy season is called the ‘long rains’ while the short one is called the ‘short rains’.",
      },
      {
        id: "p7s2-12",
        type: "true_false",
        question: "Uganda experiences the same climate throughout the year.",
        answer: "false",
        explanation: "Uganda has two rainy seasons and two dry seasons.",
        deepDive: "Because Uganda lies on the equator, it has a tropical climate with distinct wet and dry seasons.",
      },
    ],
  },

  // =====================================================
  // SESSION 3: People, Culture, Symbols & History
  // =====================================================
  {
    id: "p7-uganda-session-3",
    name: "Our Country Uganda (Session 3)",
    subjectId: "sst",
    questions: [
      // --- People & Culture (4 questions) ---
      {
        id: "p7s3-1",
        type: "multiple_choice",
        question: "Which is the largest ethnic group in Uganda?",
        options: [
          { id: "a", text: "Basoga", correct: false },
          { id: "b", text: "Baganda", correct: true },
          { id: "c", text: "Banyankole", correct: false },
          { id: "d", text: "Acholi", correct: false },
        ],
        explanation: "The Baganda are the largest ethnic group in Uganda.",
        deepDive: "The Baganda mainly live in the Central Region. They have a rich culture and their language is Luganda.",
      },
      {
        id: "p7s3-2",
        type: "short_answer",
        question: "What is the official language used in schools and government in Uganda?",
        answer: "English",
        hint: "It was introduced during colonial times",
        explanation: "English is the official language of instruction and government in Uganda.",
        deepDive: "In 2022, Swahili was also adopted as a second official language to promote regional integration.",
      },
      {
        id: "p7s3-3",
        type: "multiple_choice",
        question: "Which of these is a traditional food of the Baganda?",
        options: [
          { id: "a", text: "Matooke", correct: true },
          { id: "b", text: "Posho", correct: false },
          { id: "c", text: "Chapati", correct: false },
          { id: "d", text: "Rice", correct: false },
        ],
        explanation: "Matooke (cooked bananas) is a staple food among the Baganda.",
        deepDive: "Matooke is steamed and mashed. It is served with groundnut sauce, meat, or beans.",
      },
      {
        id: "p7s3-4",
        type: "true_false",
        question: "Luganda is spoken by the majority of people in central Uganda.",
        answer: "true",
        explanation: "Luganda is the main language spoken in the Central Region.",
        deepDive: "Many other languages are spoken across Uganda, including Runyankore, Lusoga, and Luo.",
      },

      // --- National Symbols (3 questions) ---
      {
        id: "p7s3-5",
        type: "multiple_choice",
        question: "What does the black colour on the Uganda flag represent?",
        options: [
          { id: "a", text: "The people of Africa", correct: true },
          { id: "b", text: "The sun", correct: false },
          { id: "c", text: "The lakes", correct: false },
          { id: "d", text: "Peace", correct: false },
        ],
        explanation: "Black represents the African people.",
        deepDive: "The Uganda flag has six colours: black, yellow, red, white, blue, and the crane in the centre.",
      },
      {
        id: "p7s3-6",
        type: "short_answer",
        question: "What is the national animal of Uganda?",
        answer: "Uganda Kob",
        hint: "It is a type of antelope",
        explanation: "The Uganda Kob is the national animal of Uganda.",
        deepDive: "The Uganda Kob appears on the coat of arms and is found in many national parks.",
      },
      {
        id: "p7s3-7",
        type: "multiple_choice",
        question: "What bird appears on the Uganda coat of arms?",
        options: [
          { id: "a", text: "Eagle", correct: false },
          { id: "b", text: "Crane", correct: true },
          { id: "c", text: "Dove", correct: false },
          { id: "d", text: "Ostrich", correct: false },
        ],
        explanation: "The Grey Crowned Crane is the national bird of Uganda.",
        deepDive: "The crane is also featured in the centre of the Uganda flag.",
      },

      // --- Important Towns & Cities (3 questions) ---
      {
        id: "p7s3-8",
        type: "short_answer",
        question: "Which town in Uganda is known as the source of the Nile?",
        answer: "Jinja",
        hint: "It is in the Eastern Region",
        explanation: "Jinja is famous as the source of the River Nile.",
        deepDive: "Jinja is also an important industrial town and a major tourist destination.",
      },
      {
        id: "p7s3-9",
        type: "multiple_choice",
        question: "Which city is the largest in the Western Region of Uganda?",
        options: [
          { id: "a", text: "Fort Portal", correct: false },
          { id: "b", text: "Mbarara", correct: true },
          { id: "c", text: "Kasese", correct: false },
          { id: "d", text: "Hoima", correct: false },
        ],
        explanation: "Mbarara is the largest city in western Uganda.",
        deepDive: "Mbarara is an important commercial and educational centre in the region.",
      },
      {
        id: "p7s3-10",
        type: "true_false",
        question: "Entebbe is the capital city of Uganda.",
        answer: "false",
        explanation: "Kampala is the capital. Entebbe hosts the international airport.",
        deepDive: "Entebbe was the capital during colonial times before it was moved to Kampala.",
      },

      // --- Historical Background (3 questions) ---
      {
        id: "p7s3-11",
        type: "short_answer",
        question: "In which year did Uganda gain independence?",
        answer: "1962",
        hint: "It was in the 1960s",
        explanation: "Uganda gained independence from Britain on 9th October 1962.",
        deepDive: "Uganda became a republic in 1963. Milton Obote was the first Prime Minister.",
      },
      {
        id: "p7s3-12",
        type: "multiple_choice",
        question: "Who was the first President of Uganda after independence?",
        options: [
          { id: "a", text: "Milton Obote", correct: false },
          { id: "b", text: "Edward Mutesa II", correct: true },
          { id: "c", text: "Idi Amin", correct: false },
          { id: "d", text: "Yoweri Museveni", correct: false },
        ],
        explanation: "Sir Edward Mutesa II was the first President of Uganda.",
        deepDive: "He was also the Kabaka (king) of Buganda. Milton Obote later became President in 1966.",
      },
      {
        id: "p7s3-13",
        type: "true_false",
        question: "Uganda was a British colony before independence.",
        answer: "true",
        explanation: "Uganda was under British colonial rule until 1962.",
        deepDive: "The British declared Uganda a protectorate in 1894.",
      },

      // --- Review Questions (2 questions) ---
      {
        id: "p7s3-14",
        type: "multiple_choice",
        question: "Which of these is a UNESCO World Heritage Site in Uganda?",
        options: [
          { id: "a", text: "Bwindi Impenetrable Forest", correct: true },
          { id: "b", text: "Lake Victoria", correct: false },
          { id: "c", text: "Kampala City", correct: false },
          { id: "d", text: "Jinja Town", correct: false },
        ],
        explanation: "Bwindi Impenetrable Forest is a UNESCO World Heritage Site.",
        deepDive: "It was listed in 1994 because of its importance for mountain gorilla conservation.",
      },
      {
        id: "p7s3-15",
        type: "short_answer",
        question: "Name the river that forms part of the border between Uganda and Tanzania.",
        answer: "River Kagera",
        hint: "It flows into Lake Victoria",
        explanation: "The River Kagera forms part of the Uganda-Tanzania border.",
        deepDive: "The Kagera River is also considered one of the sources of the Nile.",
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
      topics: [],
    },
  ];
}

export const PRACTICE_QUESTIONS = TOPICS.flatMap((topic) =>
  topic.questions.map((q) => ({
    ...q,
    topicId: `${topic.subjectId}-${topic.id}`,
  }))
);
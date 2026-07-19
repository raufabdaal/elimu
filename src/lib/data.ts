import { ClassLevel, Subject, Question, SubjectId, Topic, ModuleData } from "./types";

export const CLASS_LABELS: Record<ClassLevel, string> = {
  p4: "Primary 4",
  p5: "Primary 5",
  p6: "Primary 6",
  p7: "Primary 7",
};

export interface TopicData {
  id: string;
  name: string;
  subjectId: SubjectId | "math" | "sst" | "sci" | "eng";
  classLevel?: ClassLevel;
  modules?: ModuleData[];
  questions?: Question[];
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
    id: "p7-sst-uganda",
    name: "Our Country Uganda",
    subjectId: "sst",
    classLevel: "p7",
    modules: [
      {
        id: "p7-uganda-m1",
        name: "Location, Position & Physical Features",
        order: 1,
        completed: true,
        accuracy: 92,
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
      {
        id: "p7-uganda-m2",
        name: "Economy, Minerals & Tourism",
        order: 2,
        inProgress: true,
        accuracy: 78,
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
      {
        id: "p7-uganda-m3",
        name: "People, Culture, Towns & Early History",
        order: 3,
        completed: false,
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
    ],
  },
  
  // =====================================================
  // P5 MATHEMATICS - "FRACTIONS & DECIMALS"
  // =====================================================
  {
    id: "p5-math-fractions",
    name: "Fractions & Decimals",
    subjectId: "math",
    classLevel: "p5",
    questions: [
      {
        id: "p5mf-1",
        type: "multiple_choice",
        question: "What is 1/2 + 1/4?",
        options: [
          { id: "a", text: "2/6", correct: false },
          { id: "b", text: "3/4", correct: true },
          { id: "c", text: "1/6", correct: false },
          { id: "d", text: "2/4", correct: false },
        ],
        explanation: "To add fractions with different denominators, find a common denominator. 1/2 = 2/4. Then 2/4 + 1/4 = 3/4.",
        deepDive: "Fractions represent parts of a whole. Always make sure bottom numbers (denominators) match when adding or subtracting!",
      },
      {
        id: "p5mf-2",
        type: "true_false",
        question: "In the fraction 3/5, the top number (3) is called the numerator.",
        answer: "true",
        explanation: "The top number is always the numerator, showing how many parts we have.",
        deepDive: "The bottom number (5) is the denominator, showing into how many equal parts the whole is divided.",
      },
      {
        id: "p5mf-3",
        type: "short_answer",
        question: "What is 0.5 expressed as a common fraction in simplest form?",
        answer: "1/2",
        hint: "Think about half of 1",
        explanation: "0.5 is five-tenths (5/10), which simplifies by dividing both numerator and denominator by 5 to get 1/2.",
      },
      {
        id: "p5mf-4",
        type: "ordering",
        question: "Arrange these fractions from smallest to largest value.",
        items: [
          { id: "f1", text: "1/8" },
          { id: "f2", text: "1/4" },
          { id: "f3", text: "1/2" },
          { id: "f4", text: "3/4" },
        ],
        correctOrder: ["f1", "f2", "f3", "f4"],
        explanation: "1/8 (0.125) is smaller than 1/4 (0.25), which is smaller than 1/2 (0.5), and 3/4 (0.75) is the largest.",
      },
      {
        id: "p5mf-5",
        type: "multi_select",
        question: "Which of these fractions are equivalent to 1/2? (Select all that apply)",
        options: [
          { id: "e1", text: "2/4", correct: true },
          { id: "e2", text: "3/6", correct: true },
          { id: "e3", text: "2/5", correct: false },
          { id: "e4", text: "5/10", correct: true },
        ],
        explanation: "2/4, 3/6, and 5/10 all simplify to 1/2 when you divide the numerator and denominator by the numerator.",
      },
      {
        id: "p5mf-6",
        type: "matching",
        question: "Match each decimal value with its equivalent fraction.",
        pairs: [
          { id: "m1", left: "0.25", right: "1/4" },
          { id: "m2", left: "0.5", right: "1/2" },
          { id: "m3", left: "0.75", right: "3/4" },
          { id: "m4", left: "0.1", right: "1/10" },
        ],
        explanation: "Decimals and fractions are two ways to write the same part of a whole number.",
      },
    ],
  },

  // =====================================================
  // P5 INTEGRATED SCIENCE - "THE HUMAN BODY & HEALTH"
  // =====================================================
  {
    id: "p5-sci-humanbody",
    name: "The Human Body & Sensory Organs",
    subjectId: "sci",
    classLevel: "p5",
    questions: [
      {
        id: "p5sh-1",
        type: "multiple_choice",
        question: "Which organ is responsible for pumping blood throughout the human body?",
        options: [
          { id: "a", text: "Lungs", correct: false },
          { id: "b", text: "Heart", correct: true },
          { id: "c", text: "Brain", correct: false },
          { id: "d", text: "Kidneys", correct: false },
        ],
        explanation: "The heart pumps oxygen-rich blood through blood vessels to all parts of the body.",
      },
      {
        id: "p5sh-2",
        type: "true_false",
        question: "The human skeleton provides support and protects internal organs.",
        answer: "true",
        explanation: "Bones like the skull protect the brain, and ribs protect the heart and lungs.",
      },
      {
        id: "p5sh-3",
        type: "matching",
        question: "Match each sensory organ to its primary sense.",
        pairs: [
          { id: "so1", left: "Eyes", right: "Sight" },
          { id: "so2", left: "Ears", right: "Hearing" },
          { id: "so3", left: "Skin", right: "Touch" },
          { id: "so4", left: "Tongue", right: "Taste" },
        ],
        explanation: "Our sensory organs help us detect changes and respond to our environment.",
      },
    ],
  },

  // =====================================================
  // P5 ENGLISH LANGUAGE - "VERBS & TENSES"
  // =====================================================
  {
    id: "p5-eng-tenses",
    name: "Verbs, Tenses & Parts of Speech",
    subjectId: "eng",
    classLevel: "p5",
    questions: [
      {
        id: "p5et-1",
        type: "multiple_choice",
        question: "Choose the correct past tense of the irregular verb 'go'.",
        options: [
          { id: "a", text: "goed", correct: false },
          { id: "b", text: "went", correct: true },
          { id: "c", text: "gone", correct: false },
          { id: "d", text: "going", correct: false },
        ],
        explanation: "'Go' is an irregular verb. The simple past tense is 'went' (e.g., Yesterday I went to school).",
      },
      {
        id: "p5et-2",
        type: "short_answer",
        question: "Write the plural form of the noun 'Child'.",
        answer: "Children",
        hint: "It does not end with 's'",
        explanation: "'Child' changes to 'Children' in the plural form.",
      },
      {
        id: "p5et-3",
        type: "true_false",
        question: "An adjective is a word that describes a noun or pronoun.",
        answer: "true",
        explanation: "For example, in 'beautiful Uganda', 'beautiful' is an adjective describing the noun 'Uganda'.",
      },
    ],
  },
  // =====================================================
  // P4 CURRICULUM TOPICS (NCDC transitional & subject-based)
  // =====================================================
  {
    id: "p4-math-numbers",
    name: "Whole Numbers & Place Value",
    subjectId: "math",
    classLevel: "p4",
    questions: [
      {
        id: "p4mn-1",
        type: "multiple_choice",
        question: "What is the place value of digit 6 in the number 4,682?",
        options: [
          { id: "a", text: "Tens", correct: false },
          { id: "b", text: "Hundreds", correct: true },
          { id: "c", text: "Thousands", correct: false },
          { id: "d", text: "Ones", correct: false },
        ],
        explanation: "In 4,682, the digit 6 is in the Hundreds place (6 x 100 = 600).",
        deepDive: "Every digit in a whole number has a place value: 4 is in the thousands place, 6 is in the hundreds place, 8 is in the tens place, and 2 is in the ones place.",
      },
      {
        id: "p4mn-2",
        type: "short_answer",
        question: "Kintu bought 3 exercise books from the local market at UGX 1,200 each. How much money did he pay altogether?",
        answer: "3600",
        hint: "Multiply 1,200 by 3",
        explanation: "1,200 x 3 = UGX 3,600.",
        deepDive: "When finding the total cost of equal items, multiply the cost of one item by the total number of items bought.",
      },
      {
        id: "p4mn-3",
        type: "true_false",
        question: "A square is a flat geometric shape with four equal sides and four right angles.",
        answer: "true",
        explanation: "A square always has 4 sides of equal length and four 90-degree right angles.",
        deepDive: "The perimeter of a square is found by multiplying the length of one side by 4 (P = 4 x side).",
      },
      {
        id: "p4mn-4",
        type: "ordering",
        question: "Arrange these whole numbers from the smallest to the largest value.",
        items: [
          { id: "n1", text: "1,450" },
          { id: "n2", text: "2,300" },
          { id: "n3", text: "4,100" },
          { id: "n4", text: "980" },
        ],
        correctOrder: ["n4", "n1", "n2", "n3"],
        explanation: "980 has only 3 digits (Hundreds), while the others have 4 digits (Thousands). Among 4-digit numbers, 1,450 < 2,300 < 4,100.",
      },
      {
        id: "p4mn-5",
        type: "matching",
        question: "Match each mathematical shape or term to its correct definition.",
        pairs: [
          { id: "p1", left: "Rectangle", right: "Flat shape with two pairs of equal opposite sides" },
          { id: "p2", left: "Perimeter", right: "Total distance around the outside boundary of a shape" },
          { id: "p3", left: "Numerator", right: "Top number in a fraction showing parts selected" },
          { id: "p4", left: "Denominator", right: "Bottom number in a fraction showing total equal parts" },
        ],
        explanation: "Understanding basic geometric and fraction terms is foundational in Primary 4 Mathematics.",
      },
    ],
  },
  {
    id: "p4-sst-district",
    name: "Our District & Local Council Leaders",
    subjectId: "sst",
    classLevel: "p4",
    questions: [
      {
        id: "p4sd-1",
        type: "multiple_choice",
        question: "Who is the political head and elected chairperson of a Local Council One (LC1) in a Ugandan village?",
        options: [
          { id: "a", text: "Chief Administrative Officer (CAO)", correct: false },
          { id: "b", text: "LC1 Chairperson", correct: true },
          { id: "c", text: "Resident District Commissioner (RDC)", correct: false },
          { id: "d", text: "Parish Chief", correct: false },
        ],
        explanation: "The LC1 Chairperson is the elected political leader and head of the village Executive Committee.",
        deepDive: "The Local Council system in Uganda runs from LC1 (Village/Cell), LC2 (Parish/Ward), LC3 (Sub-county/Division), up to LC5 (District/City).",
      },
      {
        id: "p4sd-2",
        type: "short_answer",
        question: "Name the instrument that shows the four cardinal points (North, South, East, West) and helps travelers find direction.",
        answer: "Compass",
        hint: "It has a magnetic needle that always points North",
        explanation: "A compass is a navigational instrument used to find directions on land or sea.",
        deepDive: "The four cardinal points are North (N), South (S), East (E), and West (W). The four secondary or intermediate points are North-East (NE), North-West (NW), South-East (SE), and South-West (SW).",
      },
      {
        id: "p4sd-3",
        type: "true_false",
        question: "The Resident District Commissioner (RDC) is appointed directly by the President to represent the Central Government in a district.",
        answer: "true",
        explanation: "The RDC is the senior presidential representative in the district, overseeing security and monitoring central government programs.",
      },
    ],
  },
  {
    id: "p4-sci-plants",
    name: "Parts of a Flowering Plant & Germination",
    subjectId: "sci",
    classLevel: "p4",
    questions: [
      {
        id: "p4sp-1",
        type: "multiple_choice",
        question: "Which part of a flowering plant is responsible for making food through photosynthesis?",
        options: [
          { id: "a", text: "Roots", correct: false },
          { id: "b", text: "Stem", correct: false },
          { id: "c", text: "Leaves", correct: true },
          { id: "d", text: "Flower", correct: false },
        ],
        explanation: "Leaves carry out photosynthesis using sunlight, carbon dioxide, and water to produce food (sugar) for the plant.",
        deepDive: "Leaves contain a green pigment called chlorophyll that traps sunlight energy required for photosynthesis.",
      },
      {
        id: "p4sp-2",
        type: "short_answer",
        question: "What name is given to the process by which a dry seed develops into a young seedling when given moisture, warmth, and oxygen?",
        answer: "Germination",
        hint: "Starts with 'G'",
        explanation: "Germination is the sprouting of a seed into a seedling under favourable conditions.",
        deepDive: "The three essential conditions for seed germination are moisture (water), warmth (favourable temperature), and oxygen (for respiration). Seeds do NOT require sunlight to germinate!",
      },
      {
        id: "p4sp-3",
        type: "matching",
        question: "Match each plant structure with its primary function.",
        pairs: [
          { id: "pp1", left: "Roots", right: "Absorb water and mineral salts from the soil" },
          { id: "pp2", left: "Stem", right: "Transports water and supports branches and leaves" },
          { id: "pp3", left: "Flower", right: "Serves as the reproductive organ of the plant" },
          { id: "pp4", left: "Fruit", right: "Protects developing seeds and aids in seed dispersal" },
        ],
        explanation: "Every structure on a flowering plant works together to ensure survival and reproduction.",
      },
    ],
  },
  {
    id: "p4-eng-nouns",
    name: "Common & Proper Nouns & Simple Tenses",
    subjectId: "eng",
    classLevel: "p4",
    questions: [
      {
        id: "p4en-1",
        type: "multiple_choice",
        question: "Choose the correct plural form of the irregular noun 'Child'.",
        options: [
          { id: "a", text: "Childs", correct: false },
          { id: "b", text: "Children", correct: true },
          { id: "c", text: "Childrens", correct: false },
          { id: "d", text: "Childes", correct: false },
        ],
        explanation: "'Child' is an irregular noun whose plural is 'Children'.",
        deepDive: "Other common irregular plurals in P4 English include: man -> men, woman -> women, tooth -> teeth, foot -> feet, ox -> oxen, and mouse -> mice.",
      },
      {
        id: "p4en-2",
        type: "short_answer",
        question: "Complete the sentence with the correct past tense of the verb in brackets: Yesterday, Akello ______ (go) to the village borehole to fetch clean water.",
        answer: "went",
        hint: "'Go' is an irregular verb",
        explanation: "The simple past tense of 'go' is 'went'.",
      },
      {
        id: "p4en-3",
        type: "true_false",
        question: "In the sentence 'Kampala is the capital city of Uganda,' the words Kampala and Uganda are proper nouns.",
        answer: "true",
        explanation: "Kampala and Uganda name specific places, so they are proper nouns and always begin with capital letters.",
      },
    ],
  },

  // =====================================================
  // P6 CURRICULUM TOPICS (NCDC Upper Primary)
  // =====================================================
  {
    id: "p6-math-percentages",
    name: "Percentages, Ratios & Set Theory",
    subjectId: "math",
    classLevel: "p6",
    questions: [
      {
        id: "p6mp-1",
        type: "multiple_choice",
        question: "In a P6 class of 50 pupils, 20% of the pupils are absent due to heavy rain. How many pupils are present?",
        options: [
          { id: "a", text: "10 pupils", correct: false },
          { id: "b", text: "40 pupils", correct: true },
          { id: "c", text: "30 pupils", correct: false },
          { id: "d", text: "20 pupils", correct: false },
        ],
        explanation: "20% of 50 = (20/100) x 50 = 10 absent pupils. Therefore, 50 - 10 = 40 pupils present.",
      },
      {
        id: "p6mp-2",
        type: "short_answer",
        question: "If Set A = {2, 3, 5, 7} and Set B = {1, 3, 5, 9}, find the number of elements in the intersection set n(A ∩ B).",
        answer: "2",
        hint: "Look for common elements in both Set A and Set B",
        explanation: "The intersection set A ∩ B = {3, 5}. There are 2 common elements, so n(A ∩ B) = 2.",
      },
      {
        id: "p6mp-3",
        type: "true_false",
        question: "If 3x = 24, then the value of variable x is 8.",
        answer: "true",
        explanation: "Dividing both sides by 3 gives x = 24/3 = 8.",
      },
    ],
  },
  {
    id: "p6-sst-eac",
    name: "East African Community & Early Kingdoms",
    subjectId: "sst",
    classLevel: "p6",
    questions: [
      {
        id: "p6se-1",
        type: "multiple_choice",
        question: "Which of the following countries is NOT a member state of the East African Community (EAC)?",
        options: [
          { id: "a", text: "Republic of South Sudan", correct: false },
          { id: "b", text: "Democratic Republic of Congo", correct: false },
          { id: "c", text: "Federal Democratic Republic of Ethiopia", correct: true },
          { id: "d", text: "Republic of Rwanda", correct: false },
        ],
        explanation: "The 8 EAC partner states are Uganda, Kenya, Tanzania, Rwanda, Burundi, South Sudan, DR Congo, and Somalia. Ethiopia is not an EAC member.",
      },
      {
        id: "p6se-2",
        type: "short_answer",
        question: "Name the northern Tanzanian city where the headquarters of the East African Community (EAC Secretariat) are located.",
        answer: "Arusha",
        hint: "Located near Mount Meru in Tanzania",
        explanation: "Arusha serves as the diplomatic and administrative headquarters of the EAC.",
      },
      {
        id: "p6se-3",
        type: "true_false",
        question: "The Bunyoro-Kitara Empire was one of the earliest and largest pre-colonial kingdoms in East Africa, founded by the Bachwezi.",
        answer: "true",
        explanation: "Bunyoro-Kitara covered large parts of Western Uganda and was famous for cattlekeeping and iron working under the Chwezi dynasty.",
      },
    ],
  },
  {
    id: "p6-sci-electricity",
    name: "Circulatory System & Simple Circuits",
    subjectId: "sci",
    classLevel: "p6",
    questions: [
      {
        id: "p6sc-1",
        type: "multiple_choice",
        question: "Which blood vessels carry blood away from the heart to the rest of the body under high pressure?",
        options: [
          { id: "a", text: "Veins", correct: false },
          { id: "b", text: "Capillaries", correct: false },
          { id: "c", text: "Arteries", correct: true },
          { id: "d", text: "Vena Cava", correct: false },
        ],
        explanation: "Arteries carry blood away from the heart under high pressure. All arteries carry oxygenated blood except the pulmonary artery.",
      },
      {
        id: "p6sc-2",
        type: "short_answer",
        question: "Which blood cells are responsible for fighting against disease germs that enter the human body?",
        answer: "White blood cells",
        hint: "They act as internal soldiers against infections",
        explanation: "White blood cells (leucocytes) engulf and destroy pathogens or produce antibodies to defend the body.",
      },
      {
        id: "p6sc-3",
        type: "true_false",
        question: "Copper wire is a good conductor of electricity, while rubber and dry wood are electric insulators.",
        answer: "true",
        explanation: "Metals like copper conduct electricity, while non-metals like rubber and wood block electric current and prevent electrocution.",
      },
    ],
  },
  {
    id: "p6-eng-clauses",
    name: "Direct & Reported Speech & Prepositions",
    subjectId: "eng",
    classLevel: "p6",
    questions: [
      {
        id: "p6ec-1",
        type: "multiple_choice",
        question: 'Choose the correct reported speech form of: Okello said, "I am reading my English notes now."',
        options: [
          { id: "a", text: "Okello said that he is reading his English notes now.", correct: false },
          { id: "b", text: "Okello said that he was reading his English notes then.", correct: true },
          { id: "c", text: "Okello said that I was reading my notes then.", correct: false },
          { id: "d", text: "Okello says he read his English notes.", correct: false },
        ],
        explanation: "In reported speech, present continuous backshifts to past continuous ('was reading'), and 'now' changes to 'then'.",
      },
      {
        id: "p6ec-2",
        type: "short_answer",
        question: "Complete the sentence with the correct preposition: All pupils should pay attention ______ their teacher during mathematics drills.",
        answer: "to",
        hint: "A two-letter preposition following 'attention'",
        explanation: "The correct phrasal preposition is 'pay attention to'.",
      },
    ],
  },

  // =====================================================
  // P7 CURRICULUM TOPICS (UNEB PLE Mastery)
  // =====================================================
  {
    id: "p7-math-business",
    name: "Business Math: Interest, Profit & Mensuration",
    subjectId: "math",
    classLevel: "p7",
    questions: [
      {
        id: "p7mb-1",
        type: "multiple_choice",
        question: "A businessman deposited UGX 400,000 in a commercial bank that offers simple interest at a rate of 5% per annum. How much simple interest will he earn after 2 years?",
        options: [
          { id: "a", text: "UGX 20,000", correct: false },
          { id: "b", text: "UGX 40,000", correct: true },
          { id: "c", text: "UGX 80,000", correct: false },
          { id: "d", text: "UGX 440,000", correct: false },
        ],
        explanation: "I = (P x R x T) / 100 = (400,000 x 5 x 2) / 100 = 4,000,000 / 100 = UGX 40,000.",
      },
      {
        id: "p7mb-2",
        type: "short_answer",
        question: "The area of a rectangular school football pitch is 1,200 square meters. If its width is 30 meters, what is its length in meters?",
        answer: "40",
        hint: "Length = Area / Width",
        explanation: "1,200 / 30 = 40 meters.",
      },
    ],
  },
  {
    id: "p7-sci-energy",
    name: "Renewable Energy & Excretory System",
    subjectId: "sci",
    classLevel: "p7",
    questions: [
      {
        id: "p7se-1",
        type: "multiple_choice",
        question: "Which of the following is a renewable source of energy generated by rushing water at dams like Owen Falls and Karuma on River Nile?",
        options: [
          { id: "a", text: "Coal", correct: false },
          { id: "b", text: "Hydroelectric power", correct: true },
          { id: "c", text: "Petroleum", correct: false },
          { id: "d", text: "Natural gas", correct: false },
        ],
        explanation: "Hydroelectric power, solar, and biogas are renewable sources of energy naturally replenished by environmental cycles.",
      },
      {
        id: "p7se-2",
        type: "short_answer",
        question: "Which bean-shaped human organs remove urea, excess salts, and water from the blood in the form of urine?",
        answer: "Kidneys",
        hint: "Located in the lower back on either side of the spine",
        explanation: "The kidneys filter blood to produce urine, regulating body fluids and eliminating nitrogenous waste.",
      },
    ],
  },
  {
    id: "p7-eng-composition",
    name: "PLE Composition & Formal Letter Writing",
    subjectId: "eng",
    classLevel: "p7",
    questions: [
      {
        id: "p7ec-1",
        type: "multiple_choice",
        question: "Choose the correctly punctuated formal salutation when writing a job application letter to a Bank Manager whose name you do not know.",
        options: [
          { id: "a", text: "Dear Bank Manager,", correct: false },
          { id: "b", text: "Dear Sir/Madam,", correct: true },
          { id: "c", text: "My dear Sir,", correct: false },
          { id: "d", text: "Hello Manager", correct: false },
        ],
        explanation: "'Dear Sir/Madam,' is the standard official salutation for formal letters when the recipient's personal name is unknown.",
      },
      {
        id: "p7ec-2",
        type: "short_answer",
        question: "Complete the sentence with the correct adverb form of the word in brackets: The PLE candidates walked ______ (quiet) into the examination hall.",
        answer: "quietly",
        hint: "Change adjective 'quiet' into an adverb of manner ending in -ly",
        explanation: "'Quietly' describes how the candidates walked into the hall.",
      },
    ],
  }
];

export function getTopic(topicId: string): TopicData | undefined {
  if (!topicId) return undefined;
  
  // Direct ID match
  const exact = TOPICS.find((t) => t.id === topicId);
  if (exact) {
    if (!exact.modules && exact.questions) {
      exact.modules = [
        {
          id: `${exact.id}-m1`,
          name: "Module 1: Core Drill",
          order: 1,
          questions: exact.questions,
          completed: exact.id === "p5-math-fractions",
          inProgress: false,
        },
      ];
    }
    return exact;
  }

  // Handle alias or session matches
  if (topicId === "fractions") return getTopic("p5-math-fractions");
  if (topicId.includes("uganda")) return getTopic("p7-sst-uganda");

  return TOPICS.find((t) => t.id.includes(topicId) || topicId.includes(t.id));
}

export function getModule(topicId: string, moduleId?: string): { topic: TopicData; module: ModuleData } | undefined {
  const topic = getTopic(topicId);
  if (!topic || !topic.modules || topic.modules.length === 0) {
    if (topic && topic.questions) {
      const mod: ModuleData = {
        id: `${topic.id}-m1`,
        name: "Module 1: Core Drill",
        order: 1,
        questions: topic.questions,
      };
      return { topic: { ...topic, modules: [mod] }, module: mod };
    }
    return undefined;
  }

  if (moduleId) {
    const foundMod = topic.modules.find((m) => m.id === moduleId);
    if (foundMod) return { topic, module: foundMod };
  }

  // Fallback to first module
  return { topic, module: topic.modules[0] };
}

export function getTopicsForClass(classLevel?: ClassLevel): TopicData[] {
  if (!classLevel) return TOPICS;
  return TOPICS.filter((t) => !t.classLevel || t.classLevel === classLevel || t.id.startsWith(classLevel));
}

export function getSubjects(classLevel: ClassLevel = "p5"): Subject[] {
  const allTopics = TOPICS;

  const classTopics = allTopics.filter((t) => {
    if (t.classLevel === classLevel) return true;
    if (t.id.startsWith(classLevel)) return true;
    // For testing/preview
    if (classLevel === "p7" && t.id.includes("uganda")) return true;
    if (classLevel === "p5" && (t.id.includes("fractions") || t.id.includes("sci-humanbody") || t.id.includes("eng-tenses"))) return true;
    return false;
  });

  const getTopicsBySubject = (subId: SubjectId): Topic[] => {
    const matched = classTopics.filter((t) => t.subjectId === subId);
    
    if (matched.length > 0) {
      return matched.map((t) => {
        const modules: ModuleData[] = t.modules || [
          {
            id: `${t.id}-m1`,
            name: "Module 1: Core Curriculum Drill",
            order: 1,
            questions: t.questions || [],
            completed: t.id === "p5-sci-humanbody",
            inProgress: t.id === "p5-math-fractions",
          },
        ];

        const totalQuestions = modules.reduce((sum, m) => sum + (m.questions?.length || 0), 0) || (t.questions?.length || 0);

        return {
          id: t.id,
          name: t.name,
          subtopicCount: modules.length,
          totalQuestions,
          completed: modules.every((m) => m.completed) || t.id === "p5-sci-humanbody",
          inProgress: modules.some((m) => m.inProgress || m.completed) && !modules.every((m) => m.completed),
          accuracy: t.id === "p5-math-fractions" ? 82 : t.id === "p7-sst-uganda" ? 88 : 75,
          modules,
        };
      });
    }

    return getStarterTopicsForClassAndSubject(classLevel, subId);
  };

  return [
    {
      id: "math",
      name: "Mathematics",
      icon: "math",
      colorTheme: "blue",
      topics: getTopicsBySubject("math"),
    },
    {
      id: "sst",
      name: "Social Studies",
      icon: "sst",
      colorTheme: "amber",
      topics: getTopicsBySubject("sst"),
    },
    {
      id: "sci",
      name: "Integrated Science",
      icon: "sci",
      colorTheme: "emerald",
      topics: getTopicsBySubject("sci"),
    },
    {
      id: "eng",
      name: "English Language",
      icon: "eng",
      colorTheme: "rose",
      topics: getTopicsBySubject("eng"),
    },
  ];
}

function getStarterTopicsForClassAndSubject(classLevel: ClassLevel, subId: SubjectId): Topic[] {
  const map: Record<ClassLevel, Record<SubjectId, { id: string; name: string; count: number; qCount: number }[]>> = {
    p4: {
      math: [
        { id: "p4-math-numbers", name: "Whole Numbers & Place Value", count: 3, qCount: 36 },
        { id: "p4-math-addition", name: "Addition & Subtraction up to 10,000", count: 4, qCount: 48 },
        { id: "p4-math-shapes", name: "Basic Geometric Shapes & Perimeter", count: 3, qCount: 35 },
      ],
      sst: [
        { id: "p4-sst-district", name: "Our District & Local Leaders", count: 3, qCount: 36 },
        { id: "p4-sst-compass", name: "Using a Compass & Map Symbols", count: 2, qCount: 26 },
      ],
      sci: [
        { id: "p4-sci-plants", name: "Parts of a Flowering Plant", count: 3, qCount: 38 },
        { id: "p4-sci-animals", name: "Domestic & Wild Animals of Uganda", count: 3, qCount: 34 },
      ],
      eng: [
        { id: "p4-eng-nouns", name: "Common & Proper Nouns", count: 3, qCount: 36 },
        { id: "p4-eng-reading", name: "Reading & Simple Comprehension", count: 2, qCount: 24 },
      ],
    },
    p5: {
      math: [
        { id: "p5-math-fractions", name: "Fractions & Decimals", count: 3, qCount: 36 },
        { id: "p5-math-multiplication", name: "Multiplication & Long Division", count: 4, qCount: 48 },
        { id: "p5-math-time", name: "Time, Speed & Distance", count: 3, qCount: 36 },
      ],
      sst: [
        { id: "p5-sst-regions", name: "Regions of Uganda & Physical Features", count: 4, qCount: 50 },
        { id: "p5-sst-vegetation", name: "Natural Vegetation & Climate", count: 3, qCount: 36 },
      ],
      sci: [
        { id: "p5-sci-humanbody", name: "The Human Body & Sensory Organs", count: 3, qCount: 36 },
        { id: "p5-sci-water", name: "Sanitation, Hygiene & Safe Water", count: 3, qCount: 36 },
      ],
      eng: [
        { id: "p5-eng-tenses", name: "Verbs, Tenses & Parts of Speech", count: 3, qCount: 36 },
        { id: "p5-eng-vocabulary", name: "Synonyms, Antonyms & Homophones", count: 3, qCount: 36 },
      ],
    },
    p6: {
      math: [
        { id: "p6-math-percentages", name: "Percentages, Ratios & Proportions", count: 4, qCount: 50 },
        { id: "p6-math-algebra", name: "Simple Algebraic Expressions", count: 3, qCount: 36 },
        { id: "p6-math-angles", name: "Angles, Parallel Lines & Triangles", count: 3, qCount: 36 },
      ],
      sst: [
        { id: "p6-sst-eac", name: "East African Community & Neighbors", count: 5, qCount: 60 },
        { id: "p6-sst-history", name: "Early Migration & Kingdoms of East Africa", count: 4, qCount: 48 },
      ],
      sci: [
        { id: "p6-sci-electricity", name: "Simple Electric Circuits & Magnetism", count: 3, qCount: 36 },
        { id: "p6-sci-sound", name: "Sound, Light & Heat Energy", count: 3, qCount: 36 },
      ],
      eng: [
        { id: "p6-eng-comprehension", name: "Advanced Reading Comprehension", count: 3, qCount: 36 },
        { id: "p6-eng-clauses", name: "Direct & Indirect Speech", count: 3, qCount: 36 },
      ],
    },
    p7: {
      math: [
        { id: "p7-math-geometry", name: "Advanced Geometry & Volume", count: 4, qCount: 48 },
        { id: "p7-math-business", name: "Business Math: Profit, Loss & Interest", count: 4, qCount: 50 },
        { id: "p7-math-sets", name: "Set Theory & Venn Diagrams", count: 3, qCount: 36 },
      ],
      sst: [
        { id: "p7-sst-uganda", name: "Our Country Uganda", count: 6, qCount: 80 },
        { id: "p7-sst-africa", name: "Physical Features & Regions of Africa", count: 5, qCount: 65 },
        { id: "p7-sst-world", name: "International Organizations & World Trade", count: 4, qCount: 50 },
      ],
      sci: [
        { id: "p7-sci-energy", name: "Renewable & Non-Renewable Energy Resources", count: 4, qCount: 48 },
        { id: "p7-sci-ecosystem", name: "Ecosystems & Environmental Conservation", count: 4, qCount: 48 },
      ],
      eng: [
        { id: "p7-eng-composition", name: "PLE Essay Writing & Letter Formatting", count: 3, qCount: 36 },
        { id: "p7-eng-grammar", name: "Comprehensive Grammar & Vocabulary Review", count: 4, qCount: 48 },
      ],
    },
  };

  const list = map[classLevel]?.[subId] || [];
  return list.map((item, index) => {
    const modules: ModuleData[] = Array.from({ length: item.count }).map((_, i) => ({
      id: `${item.id}-m${i + 1}`,
      name: `Module ${i + 1}: Phase ${i + 1} Drill`,
      order: i + 1,
      completed: index === 0 && i === 0,
      inProgress: index === 0 && i === 1,
      questions: [],
    }));

    return {
      id: item.id,
      name: item.name,
      subtopicCount: item.count,
      totalQuestions: item.qCount,
      completed: index === 0 && classLevel === "p5",
      inProgress: index === 1,
      accuracy: index === 0 ? 85 : undefined,
      modules,
    };
  });
}

export const PRACTICE_QUESTIONS = TOPICS.flatMap((topic) =>
  (topic.modules ? topic.modules.flatMap((m) => m.questions) : topic.questions || []).map((q) => ({
    ...q,
    topicId: `${topic.subjectId}-${topic.id}`,
  }))
);

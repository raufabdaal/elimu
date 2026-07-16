import { ClassLevel, Subject } from "./types";

export const CLASS_LABELS: Record<ClassLevel, string> = {
  p4: "Primary 4",
  p5: "Primary 5",
  p6: "Primary 6",
  p7: "Primary 7",
};

export function getSubjects(classLevel: ClassLevel): Subject[] {
  return [
    {
      id: "math",
      name: "Mathematics",
      icon: "math",
      topics: [
        {
          id: `${classLevel}-math-fractions`,
          name: "Fractions",
          subtopicCount: 4,
          completed: false,
          inProgress: true,
          questions: [
            {
              id: "q1",
              type: "multiple_choice",
              question: "Which fraction means three equal parts out of four?",
              options: [
                { id: "a", text: "1/3", correct: false },
                { id: "b", text: "3/4", correct: true },
                { id: "c", text: "4/3", correct: false },
              ],
              explanation: "3/4 means three parts out of four equal parts.",
            },
            {
              id: "q2",
              type: "short_answer",
              question: "What is 1/2 of 8?",
              answer: "4",
              hint: "Type the number only",
              explanation: "Half of 8 is 4 because 8 ÷ 2 = 4.",
            },
            {
              id: "q3",
              type: "short_answer",
              question: "How many quarters make one whole?",
              answer: "4",
              hint: "Type the number only",
              explanation: "There are 4 quarters in one whole.",
            },
          ],
        },
        {
          id: `${classLevel}-math-decimals`,
          name: "Decimals",
          subtopicCount: 3,
          completed: false,
          inProgress: false,
          questions: [
            {
              id: "q1",
              type: "multiple_choice",
              question: "What is 0.5 as a fraction?",
              options: [
                { id: "a", text: "1/5", correct: false },
                { id: "b", text: "1/2", correct: true },
                { id: "c", text: "5/10", correct: false },
              ],
              explanation: "0.5 is the same as one half, or 1/2.",
            },
          ],
        },
        {
          id: `${classLevel}-math-measurement`,
          name: "Measurement",
          subtopicCount: 5,
          completed: false,
          inProgress: false,
          questions: [
            {
              id: "q1",
              type: "short_answer",
              question: "How many centimetres are in 1 metre?",
              answer: "100",
              hint: "Type the number only",
              explanation: "1 metre equals 100 centimetres.",
            },
          ],
        },
      ],
    },
    {
      id: "sst",
      name: "Social Studies",
      icon: "sst",
      topics: [
        {
          id: `${classLevel}-sst-uganda`,
          name: "Our country Uganda",
          subtopicCount: 3,
          completed: true,
          inProgress: false,
          questions: [
            {
              id: "q1",
              type: "multiple_choice",
              question: "How many countries border Uganda?",
              options: [
                { id: "a", text: "Three", correct: false },
                { id: "b", text: "Four", correct: false },
                { id: "c", text: "Five", correct: true },
              ],
              explanation:
                "Uganda borders Kenya, South Sudan, DRC, Rwanda, and Tanzania — five neighbours.",
            },
          ],
        },
        {
          id: `${classLevel}-sst-maps`,
          name: "Maps and location",
          subtopicCount: 4,
          completed: false,
          inProgress: false,
          questions: [
            {
              id: "q1",
              type: "short_answer",
              question: "What is the capital city of Uganda?",
              answer: "Kampala",
              hint: "Type the city name",
              explanation: "Kampala is the capital city of Uganda.",
            },
          ],
        },
        {
          id: `${classLevel}-sst-weather`,
          name: "Weather and climate",
          subtopicCount: 2,
          completed: false,
          inProgress: false,
          questions: [
            {
              id: "q1",
              type: "multiple_choice",
              question: "Which of these measures how hot or cold the air is?",
              options: [
                { id: "a", text: "Rainfall", correct: false },
                { id: "b", text: "Temperature", correct: true },
                { id: "c", text: "Wind speed", correct: false },
              ],
              explanation: "Temperature tells us how hot or cold the air is.",
            },
          ],
        },
      ],
    },
  ];
}

export function getLesson(subjectId: "math" | "sst") {
  const lessons = {
    math: {
      crumb: "Mathematics · Fractions",
      label: "Module 1 of 4",
      count: "1 / 4",
      html: `
        <p class="kicker">SUBTOPIC · WHAT IS A FRACTION?</p>
        <h2>A fraction shows equal parts of a whole</h2>
        <p>When we share a chapati equally among friends, each piece is a <strong>fraction</strong> of the whole chapati.</p>
        <p>A fraction has two numbers. The bottom number (denominator) tells how many equal parts the whole is cut into. The top number (numerator) tells how many of those parts we are talking about.</p>
        <div class="example">
          1/2 → one of two equal parts<br>
          3/4 → three of four equal parts
        </div>
        <div class="callout">
          Remember: the parts must be equal. Half of a mango is not “any piece” — it is exactly one of two equal pieces.
        </div>
        <p>In class, you will meet fractions when measuring flour, reading a clock, or dividing money among family members.</p>
      `,
      prompt: "Which fraction means three equal parts out of four?",
      choices: [
        { id: "a", text: "1/3", correct: false },
        { id: "b", text: "3/4", correct: true },
        { id: "c", text: "4/3", correct: false },
      ],
      explain: "3/4 means three parts out of four equal parts.",
    },
    sst: {
      crumb: "Social Studies · Our country",
      label: "Module 1 of 3",
      count: "1 / 3",
      html: `
        <p class="kicker">SUBTOPIC · UGANDA ON THE MAP</p>
        <h2>Uganda is in East Africa</h2>
        <p>Uganda is a landlocked country in East Africa. That means it has no coastline on the ocean — its borders touch land only.</p>
        <p>Uganda shares borders with five neighbours: Kenya to the east, South Sudan to the north, the Democratic Republic of Congo to the west, Rwanda to the south-west, and Tanzania to the south.</p>
        <div class="callout">
          Kampala is the capital city. Lake Victoria, Africa’s largest lake by area, sits on Uganda’s southern side.
        </div>
        <p>Knowing where Uganda sits helps you read maps, understand weather, and talk about trade with neighbouring countries.</p>
      `,
      prompt: "How many countries border Uganda?",
      choices: [
        { id: "a", text: "Three", correct: false },
        { id: "b", text: "Four", correct: false },
        { id: "c", text: "Five", correct: true },
      ],
      explain: "Uganda borders Kenya, South Sudan, DRC, Rwanda, and Tanzania — five neighbours.",
    },
  };
  return lessons[subjectId];
}

export const PRACTICE_QUESTIONS = [
  {
    id: "p1",
    type: "short_answer" as const,
    topicId: "p5-math-fractions",
    question: "What is 1/2 of 8?",
    answer: "4",
    hint: "Type the number only",
    explanation: "Half of 8 is 4 because 8 ÷ 2 = 4.",
  },
  {
    id: "p2",
    type: "short_answer" as const,
    topicId: "p5-math-fractions",
    question: "What is 1/4 of 12?",
    answer: "3",
    hint: "Type the number only",
    explanation: "One quarter of 12 is 3 because 12 ÷ 4 = 3.",
  },
  {
    id: "p3",
    type: "short_answer" as const,
    topicId: "p5-math-fractions",
    question: "Which is larger: 1/2 or 1/3? Write the larger fraction.",
    answer: "1/2",
    hint: "Example: 1/2",
    explanation: "1/2 is larger than 1/3 because the whole is split into fewer equal parts.",
  },
  {
    id: "p4",
    type: "short_answer" as const,
    topicId: "p5-math-fractions",
    question: "How many quarters make one whole?",
    answer: "4",
    hint: "Type the number only",
    explanation: "There are 4 quarters in one whole.",
  },
  {
    id: "p5",
    type: "short_answer" as const,
    topicId: "p5-math-fractions",
    question: "What is 2/4 simplified? Write the fraction.",
    answer: "1/2",
    hint: "Example: 1/2",
    explanation: "2/4 simplifies to 1/2 because both numbers divide by 2.",
  },
  {
    id: "p6",
    type: "multiple_choice" as const,
    topicId: "p5-sst-uganda",
    question: "How many countries border Uganda?",
    options: [
      { id: "a", text: "Three", correct: false },
      { id: "b", text: "Four", correct: false },
      { id: "c", text: "Five", correct: true },
    ],
    explanation: "Uganda borders Kenya, South Sudan, DRC, Rwanda, and Tanzania — five neighbours.",
  },
  {
    id: "p7",
    type: "short_answer" as const,
    topicId: "p5-sst-uganda",
    question: "What is the capital city of Uganda?",
    answer: "Kampala",
    hint: "Type the city name",
    explanation: "Kampala is the capital city of Uganda.",
  },
  {
    id: "p8",
    type: "multiple_choice" as const,
    topicId: "p5-sst-uganda",
    question: "Which lake sits on Uganda's southern side?",
    options: [
      { id: "a", text: "Lake Kyoga", correct: false },
      { id: "b", text: "Lake Victoria", correct: true },
      { id: "c", text: "Lake Albert", correct: false },
    ],
    explanation: "Lake Victoria is the large lake on Uganda's southern border.",
  },
];

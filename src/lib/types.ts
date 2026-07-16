export type Role = "learner" | "parent";

export type ClassLevel = "p4" | "p5" | "p6" | "p7";

export type QuestionType =
  | "multiple_choice"
  | "short_answer"
  | "true_false"
  | "multi_select"
  | "ordering"
  | "matching";

export interface Choice {
  id: string;
  text: string;
  correct: boolean;
}

export interface MultipleChoiceQuestion {
  type: "multiple_choice";
  options: Choice[];
}

export interface ShortAnswerQuestion {
  type: "short_answer";
  answer: string;
}

export interface TrueFalseQuestion {
  type: "true_false";
  answer: "true" | "false";
}

export interface MultiSelectQuestion {
  type: "multi_select";
  options: Choice[];
}

export interface OrderingQuestion {
  type: "ordering";
  items: { id: string; text: string }[];
  correctOrder: string[];
}

export interface MatchingQuestion {
  type: "matching";
  pairs: { id: string; left: string; right: string }[];
}

export type QuestionData =
  | MultipleChoiceQuestion
  | ShortAnswerQuestion
  | TrueFalseQuestion
  | MultiSelectQuestion
  | OrderingQuestion
  | MatchingQuestion;

export interface BaseQuestion {
  id: string;
  question: string;
  hint?: string;
  explanation: string;
  deepDive?: string;
}

export type Question = BaseQuestion & QuestionData;

export interface Topic {
  id: string;
  name: string;
  subtopicCount: number;
  completed: boolean;
  inProgress?: boolean;
}

export interface Subject {
  id: "math" | "sst";
  name: string;
  icon: "math" | "sst";
  topics: Topic[];
}

export interface ContinueState {
  subject?: string;
  topic?: string;
  subtopic?: string;
  module?: number;
  progress?: number;
}

export interface Profile {
  role: Role;
  name: string;
  classLevel: ClassLevel;
  linkedParentId?: string;
  linkedStudentId?: string;
  linkCode?: string;
}

export interface SessionStats {
  todayMinutes: number;
  weeklyMinutes: number[];
}

export interface AppState {
  profile: Profile;
  progress: {
    hearts: number;
    maxHearts: number;
    energy: number;
    streakDays: number;
    lastStudyDate: string;
    xp: number;
    modulesDone: number;
    practiceAccuracy: number;
    totalAttempts: number;
    correctAnswers: number;
  };
  continue: ContinueState;
  session: SessionStats;
  topicProgress: Record<string, { accuracy: number; attempts: number; lastAttempt: string }>;
}

export const DEFAULT_STATE: AppState = {
  profile: {
    role: "learner",
    name: "Amina",
    classLevel: "p5",
    linkCode: "739104",
  },
  progress: {
    hearts: 5,
    maxHearts: 5,
    energy: 100,
    streakDays: 3,
    lastStudyDate: new Date().toISOString().split("T")[0],
    xp: 1240,
    modulesDone: 4,
    practiceAccuracy: 82,
    totalAttempts: 17,
    correctAnswers: 14,
  },
  continue: {
    subject: "Mathematics",
    topic: "Fractions",
    subtopic: "What is a fraction?",
    module: 1,
    progress: 42,
  },
  session: {
    todayMinutes: 18,
    weeklyMinutes: [20, 35, 15, 0, 18, 0, 0],
  },
  topicProgress: {
    "p5-math-fractions": { accuracy: 0.82, attempts: 12, lastAttempt: new Date().toISOString() },
    "p5-sst-uganda": { accuracy: 0.75, attempts: 5, lastAttempt: new Date().toISOString() },
  },
};

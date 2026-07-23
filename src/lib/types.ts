export type Role = "learner" | "parent";

export type ClassLevel = "p4" | "p5" | "p6" | "p7";

export type SubjectId = "math" | "sst" | "sci" | "eng";

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
  keywords?: string[];
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
  keywords?: string[];
  topicId?: string;
}

export type Question = BaseQuestion & QuestionData;

export interface ModuleData {
  id: string;
  name: string;
  order: number;
  questions: Question[];
  completed?: boolean;
  inProgress?: boolean;
  accuracy?: number;
}

export interface TopicData {
  id: string;
  name: string;
  subjectId: SubjectId | "math" | "sst" | "sci" | "eng";
  classLevel?: ClassLevel;
  modules?: ModuleData[];
  questions?: Question[]; // Fallback or flat questions if single module
}

export interface Topic {
  id: string;
  name: string;
  subtopicCount: number; // Total modules inside this topic
  totalQuestions: number; // Sum of all questions across modules
  completed: boolean;
  inProgress?: boolean;
  accuracy?: number;
  modules: ModuleData[];
}

export interface Subject {
  id: SubjectId;
  name: string;
  icon: SubjectId;
  colorTheme: string; // e.g., 'blue', 'amber', 'emerald', 'rose'
  topics: Topic[];
}

export interface ContinueState {
  subject?: string;
  topicId?: string;
  moduleId?: string;
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
    pendingMockExam?: boolean;
    lastMockScore?: number;
    mockExamsPassed?: number;
  };
  continue: ContinueState;
  session: SessionStats;
  topicProgress: Record<string, { accuracy: number; attempts: number; lastAttempt: string; completed?: boolean }>;
}

export const DEFAULT_STATE: AppState = {
  profile: {
    role: "learner",
    name: "",
    classLevel: "p5",
    linkCode: "",
  },
  progress: {
    hearts: 5,
    maxHearts: 5,
    energy: 100,
    streakDays: 0,
    lastStudyDate: new Date().toISOString().split("T")[0],
    xp: 0,
    modulesDone: 0,
    practiceAccuracy: 0,
    totalAttempts: 0,
    correctAnswers: 0,
    pendingMockExam: false,
    lastMockScore: 0,
    mockExamsPassed: 0,
  },
  continue: {},
  session: {
    todayMinutes: 0,
    weeklyMinutes: [0, 0, 0, 0, 0, 0, 0],
  },
  topicProgress: {},
};

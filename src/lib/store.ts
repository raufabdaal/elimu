import { AppState, DEFAULT_STATE, Profile } from "./types";

const STORAGE_KEY = "elimu_state_v1";

export function loadState(): AppState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return mergeState(parsed);
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(partial: Partial<AppState>): void {
  if (typeof window === "undefined") return;
  const current = loadState();
  const next: AppState = {
    ...current,
    ...partial,
    profile: { ...current.profile, ...(partial.profile || {}) },
    progress: { ...current.progress, ...(partial.progress || {}) },
    continue: { ...current.continue, ...(partial.continue || {}) },
    session: { ...current.session, ...(partial.session || {}) },
    topicProgress: { ...current.topicProgress, ...(partial.topicProgress || {}) },
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function resetState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function updateStudyTime(minutes: number): void {
  const state = loadState();
  const today = new Date().toISOString().split("T")[0];
  const isSameDay = state.progress.lastStudyDate === today;

  const weekly = [...state.session.weeklyMinutes];
  weekly[weekly.length - 1] += minutes;

  saveState({
    progress: {
      ...state.progress,
      lastStudyDate: today,
      streakDays: isSameDay ? state.progress.streakDays : state.progress.streakDays + 1,
    },
    session: {
      ...state.session,
      todayMinutes: state.session.todayMinutes + minutes,
      weeklyMinutes: weekly,
    },
  });
}

export function recordAnswer(topicId: string, correct: boolean): void {
  const state = loadState();
  const tp = state.topicProgress[topicId] || { accuracy: 0, attempts: 0, lastAttempt: new Date().toISOString() };
  const attempts = tp.attempts + 1;
  const correctSoFar = Math.round(tp.accuracy * tp.attempts) + (correct ? 1 : 0);
  const accuracy = correctSoFar / attempts;

  saveState({
    progress: {
      ...state.progress,
      totalAttempts: state.progress.totalAttempts + 1,
      correctAnswers: state.progress.correctAnswers + (correct ? 1 : 0),
      practiceAccuracy: Math.round(
        ((state.progress.correctAnswers + (correct ? 1 : 0)) /
          (state.progress.totalAttempts + 1)) *
          100
      ),
      xp: state.progress.xp + (correct ? 10 : 2),
    },
    topicProgress: {
      ...state.topicProgress,
      [topicId]: { accuracy, attempts, lastAttempt: new Date().toISOString() },
    },
  });
}

export function loseHeart(): void {
  const state = loadState();
  saveState({
    progress: {
      ...state.progress,
      hearts: Math.max(0, state.progress.hearts - 1),
    },
  });
}

export function linkParent(code: string): boolean {
  const state = loadState();
  if (state.profile.linkCode && state.profile.linkCode === code) {
    saveState({ profile: { ...state.profile, linkedParentId: "parent_001" } });
    return true;
  }
  return false;
}

export function linkStudent(code: string): Profile | null {
  const state = loadState();
  if (state.profile.linkCode && state.profile.linkCode === code) {
    return { ...state.profile, linkedStudentId: "student_001" };
  }
  return null;
}

function mergeState(partial: Partial<AppState>): AppState {
  return {
    ...DEFAULT_STATE,
    ...partial,
    profile: { ...DEFAULT_STATE.profile, ...(partial.profile || {}) },
    progress: { ...DEFAULT_STATE.progress, ...(partial.progress || {}) },
    continue: { ...DEFAULT_STATE.continue, ...(partial.continue || {}) },
    session: { ...DEFAULT_STATE.session, ...(partial.session || {}) },
    topicProgress: { ...DEFAULT_STATE.topicProgress, ...(partial.topicProgress || {}) },
  };
}

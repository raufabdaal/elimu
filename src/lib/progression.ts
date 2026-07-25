import { AppState, ModuleData, Subject, Topic } from "@/lib/types";

export function moduleProgressKey(subjectId: string, topicId: string, moduleId?: string): string {
  return `${subjectId}-${topicId}-${moduleId || "m1"}`;
}

export function isModuleCompleted(state: AppState, subjectId: string, topicId: string, moduleId?: string): boolean {
  return !!state.topicProgress[moduleProgressKey(subjectId, topicId, moduleId)]?.completed;
}

export function isTopicCompleted(state: AppState, subjectId: string, topic: Topic): boolean {
  const modules = topic.modules || [];
  if (modules.length === 0) return false;
  return modules.every((mod) => isModuleCompleted(state, subjectId, topic.id, mod.id));
}

export function isTopicUnlocked(state: AppState, subject: Subject, topicIndex: number): boolean {
  if (topicIndex <= 0) return true;
  const previousTopic = subject.topics[topicIndex - 1];
  if (!previousTopic) return false;
  return isTopicCompleted(state, subject.id, previousTopic);
}

export function isModuleUnlocked(
  state: AppState,
  subject: Subject,
  topicIndex: number,
  moduleIndex: number
): boolean {
  if (!isTopicUnlocked(state, subject, topicIndex)) return false;
  if (moduleIndex <= 0) return true;

  const topic = subject.topics[topicIndex];
  const previousModule = topic?.modules?.[moduleIndex - 1];
  if (!topic || !previousModule) return false;
  return isModuleCompleted(state, subject.id, topic.id, previousModule.id);
}

export function getFirstUnlockedModule(state: AppState, subject: Subject, topicIndex: number): ModuleData | null {
  const topic = subject.topics[topicIndex];
  if (!topic || !isTopicUnlocked(state, subject, topicIndex)) return null;

  const firstIncompleteUnlocked = topic.modules.find((module, moduleIndex) =>
    isModuleUnlocked(state, subject, topicIndex, moduleIndex) &&
    !isModuleCompleted(state, subject.id, topic.id, module.id)
  );

  return firstIncompleteUnlocked || topic.modules[0] || null;
}

export function findSubjectAndTopic(subjects: Subject[], topicId: string) {
  for (const subject of subjects) {
    const topicIndex = subject.topics.findIndex((topic) => topic.id === topicId);
    if (topicIndex >= 0) {
      return { subject, topic: subject.topics[topicIndex], topicIndex };
    }
  }
  return null;
}

import { ensureCloudProfile } from "@/lib/cloud-profile";
import { getSupabaseClient } from "@/lib/supabase";
import { loadState } from "@/lib/store";
import { ClassLevel, SubjectId } from "@/lib/types";

const ANSWER_QUEUE_KEY = "elimu_answer_event_queue_v1";

export interface QueuedAnswerEvent {
  local_event_id: string;
  question_id: string;
  topic_id?: string;
  subject_id?: SubjectId | string;
  class_level?: ClassLevel;
  is_correct: boolean;
  partial_score: number;
  answered_at: string;
  synced_at?: string;
}

export interface QueueAnswerEventInput {
  questionId: string;
  topicId?: string;
  subjectId?: SubjectId | string;
  classLevel?: ClassLevel;
  isCorrect: boolean;
  partialScore?: number;
}

export interface SyncResult {
  uploadedEvents: number;
  snapshotSynced: boolean;
  skippedReason?: string;
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function makeLocalEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readQueue(): QueuedAnswerEvent[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(ANSWER_QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function notifyQueueChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("elimu-sync-queue-changed"));
}

function writeQueue(events: QueuedAnswerEvent[]): void {
  if (!canUseStorage()) return;
  localStorage.setItem(ANSWER_QUEUE_KEY, JSON.stringify(events));
  notifyQueueChanged();
}

export function queueAnswerEvent(input: QueueAnswerEventInput): QueuedAnswerEvent | null {
  if (!canUseStorage()) return null;

  const localState = loadState();
  const event: QueuedAnswerEvent = {
    local_event_id: makeLocalEventId(),
    question_id: input.questionId,
    topic_id: input.topicId,
    subject_id: input.subjectId,
    class_level: input.classLevel || localState.profile.classLevel,
    is_correct: input.isCorrect,
    partial_score: input.partialScore ?? (input.isCorrect ? 1 : 0),
    answered_at: new Date().toISOString(),
  };

  const queue = readQueue();
  queue.push(event);
  writeQueue(queue.slice(-500));
  return event;
}

export function getQueuedAnswerEvents(includeSynced = false): QueuedAnswerEvent[] {
  const queue = readQueue();
  return includeSynced ? queue : queue.filter((event) => !event.synced_at);
}

export function markAnswerEventsSynced(localEventIds: string[]): void {
  if (!localEventIds.length) return;
  const syncedAt = new Date().toISOString();
  const idSet = new Set(localEventIds);
  const next = readQueue().map((event) =>
    idSet.has(event.local_event_id) ? { ...event, synced_at: syncedAt } : event
  );
  writeQueue(next);
}

export function clearSyncedAnswerEvents(): void {
  writeQueue(readQueue().filter((event) => !event.synced_at));
}

export function getQueuedAnswerEventCount(): number {
  return getQueuedAnswerEvents(false).length;
}

export async function syncQueuedAnswerEvents(): Promise<number> {
  const supabase = getSupabaseClient();
  if (!supabase) return 0;
  if (typeof navigator !== "undefined" && !navigator.onLine) return 0;

  const profile = await ensureCloudProfile();
  if (!profile || profile.role !== "learner") return 0;

  const unsynced = getQueuedAnswerEvents(false);
  if (!unsynced.length) return 0;

  const rows = unsynced.map((event) => ({
    student_profile_id: profile.id,
    local_event_id: event.local_event_id,
    question_id: event.question_id,
    topic_id: event.topic_id || null,
    subject_id: event.subject_id || null,
    class_level: event.class_level || null,
    is_correct: event.is_correct,
    partial_score: event.partial_score,
    answered_at: event.answered_at,
  }));

  const { error } = await supabase
    .from("answer_events")
    .upsert(rows, { onConflict: "student_profile_id,local_event_id" });

  if (error) throw error;

  markAnswerEventsSynced(unsynced.map((event) => event.local_event_id));
  clearSyncedAnswerEvents();
  notifyQueueChanged();
  return unsynced.length;
}

export async function uploadProgressSnapshotToCloud(): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;
  if (typeof navigator !== "undefined" && !navigator.onLine) return false;

  const profile = await ensureCloudProfile();
  if (!profile || profile.role !== "learner") return false;

  const local = loadState();
  const { error } = await supabase
    .from("progress_snapshots")
    .upsert(
      {
        student_profile_id: profile.id,
        progress_json: local.progress,
        session_json: local.session,
        topic_progress_json: local.topicProgress,
        continue_json: local.continue,
        local_updated_at: new Date().toISOString(),
        synced_at: new Date().toISOString(),
      },
      { onConflict: "student_profile_id" }
    );

  if (error) throw error;
  return true;
}

export async function syncNow(): Promise<SyncResult> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return { uploadedEvents: 0, snapshotSynced: false, skippedReason: "offline" };
  }

  const uploadedEvents = await syncQueuedAnswerEvents();
  const snapshotSynced = await uploadProgressSnapshotToCloud();
  return { uploadedEvents, snapshotSynced };
}

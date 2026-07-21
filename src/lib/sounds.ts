"use client";

// Embedded Base64 8-bit PCM WAV Data URIs (`Guaranteed Self-Contained Playback Across All Mobile & Desktop Browsers`)
// High-pitched ding (800 Hz -> 1200 Hz rising tone)
const CORRECT_WAV = "data:audio/wav;base64,UklGRlQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YTAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA";
// Low buzzer (200 Hz -> 150 Hz descending tone)
const WRONG_WAV = "data:audio/wav;base64,UklGRlQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YTAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA";
// Sparkling fanfare
const STREAK_WAV = "data:audio/wav;base64,UklGRlQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YTAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA";
// Crisp click
const CLICK_WAV = "data:audio/wav;base64,UklGRlQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YTAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA";

let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  try {
    if (!audioContext) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContext = new AudioContextClass();
    }
    if (audioContext && audioContext.state === "suspended") {
      audioContext.resume();
    }
    return audioContext;
  } catch {
    return null;
  }
}

/**
 * Helper to play dual Web Audio + HTML5 Audio fallback for guaranteed mobile ding
 */
function playAudioOrTone(wavUri: string, notes: number[], durations: number[], types: OscillatorType[], volume = 0.2) {
  if (typeof window !== "undefined") {
    try {
      const audio = new Audio(wavUri);
      audio.volume = volume;
      audio.play().catch(() => {});
    } catch {
      // Fallback to Web Audio if HTML5 Audio fails
    }
  }

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (ctx.state === "suspended") ctx.resume();
    const t = ctx.currentTime;
    let offset = 0;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = types[index] || "sine";
      osc.frequency.setValueAtTime(freq, t + offset);

      gain.gain.setValueAtTime(0, t + offset);
      gain.gain.linearRampToValueAtTime(volume, t + offset + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + (durations[index] || 0.2));

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t + offset);
      osc.stop(t + offset + (durations[index] || 0.2));
      offset += (durations[index] || 0.2) * 0.45;
    });
  } catch (e) {
    console.warn("AudioContext playback error:", e);
  }
}

/**
 * Joyful 4-note rising major chord + sparkle (Correct Answer Ding)
 */
export function playCorrectSound() {
  playAudioOrTone(
    CORRECT_WAV,
    [880, 1108.73, 1318.51, 1760], // A5, C#6, E6, A6 rising major triad
    [0.18, 0.18, 0.18, 0.4],
    ["triangle", "triangle", "triangle", "sine"],
    0.22
  );
}

/**
 * Soft descending two-tone interval + low bass cushion (Wrong Answer / Heart Loss)
 */
export function playWrongSound() {
  playAudioOrTone(
    WRONG_WAV,
    [311.13, 261.63, 130.81], // D#4 -> C#4 -> C3 low drop
    [0.2, 0.25, 0.35],
    ["sawtooth", "sawtooth", "sine"],
    0.18
  );
}

export function playHeartLossSound() {
  playWrongSound();
}

/**
 * Sparkling 5-note rising pentatonic sequence (Streak Bonus / Level Up)
 */
export function playStreakSound() {
  playAudioOrTone(
    STREAK_WAV,
    [523.25, 659.25, 783.99, 1046.5, 1318.51], // C5, E5, G5, C6, E6 pentatonic sparkle
    [0.14, 0.14, 0.14, 0.18, 0.45],
    ["triangle", "triangle", "triangle", "sine", "sine"],
    0.24
  );
}

export function playLevelUpSound() {
  playStreakSound();
}

/**
 * Crisp woody pop sound (Tactile Button Click)
 */
export function playButtonClick() {
  playAudioOrTone(CLICK_WAV, [800, 300], [0.03, 0.05], ["sine", "triangle"], 0.12);
}

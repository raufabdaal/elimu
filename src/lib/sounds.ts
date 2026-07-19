"use client";

let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioContext = new AudioContextClass();
  }
  if (audioContext && audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

// ===== DUOLINGO-STYLE RICH HARMONIC SOUNDS =====

/**
 * Joyful 3-note rising major chord + sparkle (Correct Answer)
 */
export function playCorrectSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const t = ctx.currentTime;
  // Major triad notes: C6 (1046.5 Hz), E6 (1318.5 Hz), G6 (1568 Hz), C7 (2093 Hz)
  const notes = [1046.5, 1318.5, 1568, 2093];

  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = index === 3 ? "sine" : "triangle";
    osc.frequency.setValueAtTime(freq, t + index * 0.06);

    gain.gain.setValueAtTime(0, t + index * 0.06);
    gain.gain.linearRampToValueAtTime(0.18, t + index * 0.06 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + index * 0.06 + 0.38);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t + index * 0.06);
    osc.stop(t + index * 0.06 + 0.4);
  });
}

/**
 * Soft descending two-tone interval + low bass cushion (Wrong Answer / Heart Loss)
 */
export function playWrongSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const t = ctx.currentTime;
  const notes = [311.1, 261.6]; // D#4 -> C#4 soft interval

  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, t + index * 0.14);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(600, t + index * 0.14);

    gain.gain.setValueAtTime(0, t + index * 0.14);
    gain.gain.linearRampToValueAtTime(0.2, t + index * 0.14 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + index * 0.14 + 0.28);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t + index * 0.14);
    osc.stop(t + index * 0.14 + 0.3);
  });

  // Low bass cushion
  const bass = ctx.createOscillator();
  const bassGain = ctx.createGain();
  bass.type = "sine";
  bass.frequency.setValueAtTime(110, t);
  bass.frequency.linearRampToValueAtTime(80, t + 0.35);
  bassGain.gain.setValueAtTime(0.15, t);
  bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
  bass.connect(bassGain);
  bassGain.connect(ctx.destination);
  bass.start(t);
  bass.stop(t + 0.4);
}

export function playHeartLossSound() {
  playWrongSound();
}

/**
 * Sparkling 5-note rising pentatonic sequence (Streak Bonus / Level Up)
 */
export function playStreakSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const t = ctx.currentTime;
  // C5, D5, E5, G5, C6
  const notes = [523.25, 587.33, 659.25, 783.99, 1046.5];

  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, t + index * 0.05);

    gain.gain.setValueAtTime(0, t + index * 0.05);
    gain.gain.linearRampToValueAtTime(0.22, t + index * 0.05 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + index * 0.05 + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t + index * 0.05);
    osc.stop(t + index * 0.05 + 0.38);
  });
}

export function playLevelUpSound() {
  playStreakSound();
}

/**
 * Crisp woody pop sound (Tactile Button Click)
 */
export function playButtonClick() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = "sine";
  osc.frequency.setValueAtTime(900, t);
  osc.frequency.exponentialRampToValueAtTime(300, t + 0.06);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1400, t);

  gain.gain.setValueAtTime(0.18, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(t);
  osc.stop(t + 0.08);
}

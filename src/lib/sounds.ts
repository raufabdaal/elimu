"use client";

let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioContext = new AudioContextClass();
  }
  return audioContext;
}

// ===== CORE SOUNDS =====

export function playCorrectSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  oscillator.type = "sine";
  oscillator.frequency.value = 880;

  filter.type = "lowpass";
  filter.frequency.value = 1200;

  gain.gain.value = 0.3;

  const t = ctx.currentTime;

  oscillator.frequency.setValueAtTime(880, t);
  oscillator.frequency.linearRampToValueAtTime(1320, t + 0.25);

  gain.gain.setValueAtTime(0.3, t);
  gain.gain.linearRampToValueAtTime(0.0, t + 0.35);

  const compressor = ctx.createDynamicsCompressor();

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(compressor);
  compressor.connect(ctx.destination);

  oscillator.start(t);
  oscillator.stop(t + 0.4);
}

export function playWrongSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "sawtooth";
  oscillator.frequency.value = 220;

  gain.gain.value = 0.25;

  const t = ctx.currentTime;

  oscillator.frequency.setValueAtTime(220, t);
  oscillator.frequency.linearRampToValueAtTime(180, t + 0.3);

  gain.gain.setValueAtTime(0.25, t);
  gain.gain.linearRampToValueAtTime(0.0, t + 0.35);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(t);
  oscillator.stop(t + 0.4);
}

export function playClickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = 660;

  gain.gain.value = 0.15;

  const t = ctx.currentTime;
  gain.gain.setValueAtTime(0.15, t);
  gain.gain.linearRampToValueAtTime(0, t + 0.1);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(t);
  oscillator.stop(t + 0.12);
}

// ===== DUOLINGO-STYLE ENGAGEMENT SOUNDS =====

export function playHeartLossSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = "sawtooth";
  osc.frequency.value = 180;

  filter.type = "lowpass";
  filter.frequency.value = 600;

  gain.gain.value = 0.35;

  const t = ctx.currentTime;

  osc.frequency.setValueAtTime(180, t);
  osc.frequency.linearRampToValueAtTime(120, t + 0.4);

  gain.gain.setValueAtTime(0.35, t);
  gain.gain.linearRampToValueAtTime(0, t + 0.5);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(t);
  osc.stop(t + 0.55);
}

export function playStreakSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.value = 880;

  gain.gain.value = 0.4;

  const t = ctx.currentTime;

  // Rising celebratory arpeggio
  osc.frequency.setValueAtTime(880, t);
  osc.frequency.linearRampToValueAtTime(1320, t + 0.15);
  osc.frequency.linearRampToValueAtTime(1760, t + 0.3);

  gain.gain.setValueAtTime(0.4, t);
  gain.gain.linearRampToValueAtTime(0, t + 0.45);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(t);
  osc.stop(t + 0.5);
}

export function playLevelUpSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = "sine";
  osc.frequency.value = 660;

  filter.type = "lowpass";
  filter.frequency.value = 1800;

  gain.gain.value = 0.35;

  const t = ctx.currentTime;

  osc.frequency.setValueAtTime(660, t);
  osc.frequency.linearRampToValueAtTime(990, t + 0.2);
  osc.frequency.linearRampToValueAtTime(1320, t + 0.4);

  gain.gain.setValueAtTime(0.35, t);
  gain.gain.linearRampToValueAtTime(0, t + 0.55);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(t);
  osc.stop(t + 0.6);
}

export function playButtonClick() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.value = 520;

  gain.gain.value = 0.12;

  const t = ctx.currentTime;
  gain.gain.setValueAtTime(0.12, t);
  gain.gain.linearRampToValueAtTime(0, t + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(t);
  osc.stop(t + 0.1);
}

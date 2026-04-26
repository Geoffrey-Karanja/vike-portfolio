/**
 * Synthesizes a clean, Apple-boot-like chime
 * using the Web Audio API — zero cost, no files needed
 */
export function playBootChime() {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const play = (freq, start, duration, gain = 0.3) => {
      const osc  = ctx.createOscillator();
      const env  = ctx.createGain();

      osc.connect(env);
      env.connect(ctx.destination);

      osc.type      = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

      env.gain.setValueAtTime(0, ctx.currentTime + start);
      env.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.01);
      env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);

      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    // A soft, three-note ascending chime
    play(523.25, 0.0, 1.2, 0.2);   // C5
    play(659.25, 0.15, 1.0, 0.15); // E5
    play(783.99, 0.3, 1.4, 0.18);  // G5
    play(1046.5, 0.5, 1.8, 0.12);  // C6 — the sparkle
  } catch (e) {
    // Audio not available — silent fail
    console.warn('Audio not available:', e);
  }
}

/**
 * Soft click sound for navigation
 */
export function playClick() {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const env  = ctx.createGain();
    const filt = ctx.createBiquadFilter();

    filt.type            = 'lowpass';
    filt.frequency.value = 800;

    osc.connect(filt);
    filt.connect(env);
    env.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, ctx.currentTime);

    env.gain.setValueAtTime(0.15, ctx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    console.warn('Audio not available:', e);
  }
}
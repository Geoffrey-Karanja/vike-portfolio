<script>
  import { vikeState, voiceAvailable, transcript, muted } from '$lib/stores/vike.js';
  import { accentColor } from '$lib/stores/theme.js';
  import { playClick } from '$lib/utils/audio.js';
  import VoiceEngine from './VoiceEngine.svelte';
  import SynthEngine from './SynthEngine.svelte';
  import Waveform    from './Waveform.svelte';

  let voiceEngine;
  let synthEngine;
  let analyser = null;

  // Expose speak so Terminal can call it
  export function speak(text) {
    synthEngine?.speak(text);
  }

  function handleOrbClick() {
    playClick();

    if ($vikeState === 'listening') {
      voiceEngine?.stopListening();
      return;
    }

    if ($vikeState === 'speaking') {
      synthEngine?.cancel();
      return;
    }

    if ($voiceAvailable) {
      voiceEngine?.startListening();
    }
  }

  function toggleMute() {
    muted.update(m => !m);
  }

  // Orb label based on state
  $: label = {
    idle:      'Click to speak',
    listening: 'Listening...',
    speaking:  'Speaking...',
    thinking:  'Thinking...',
  }[$vikeState] ?? 'Click to speak';

  $: isActive = $vikeState !== 'idle';
</script>

<VoiceEngine bind:this={voiceEngine} bind:analyser />
<SynthEngine bind:this={synthEngine} />

<div class="orb-container">

  <!-- Transcript preview -->
  {#if $transcript}
    <div class="transcript glass">
      "{$transcript}"
    </div>
  {/if}

  <!-- Label -->
  <div class="label" class:active={isActive}>
    {label}
  </div>

  <!-- The Orb -->
  <button
    class="orb"
    class:listening={$vikeState === 'listening'}
    class:speaking={$vikeState === 'speaking'}
    class:thinking={$vikeState === 'thinking'}
    style="--accent: {$accentColor}"
    on:click={handleOrbClick}
    aria-label={label}
    title={label}
  >
    <!-- Inner core -->
    <div class="orb-core">
      {#if $vikeState === 'listening'}
        <Waveform {analyser} active={true} />
      {:else if $vikeState === 'speaking'}
        <div class="speaking-icon">◈</div>
      {:else if $vikeState === 'thinking'}
        <div class="thinking-dots">
          <span></span><span></span><span></span>
        </div>
      {:else}
        <div class="mic-icon">⬡</div>
      {/if}
    </div>
  </button>

  <!-- Mute toggle -->
  <button class="mute-btn" on:click={toggleMute} title={$muted ? 'Unmute VIKE' : 'Mute VIKE'}>
    {$muted ? '🔇' : '🔈'}
  </button>

</div>

<style>
  .orb-container {
    position: fixed;
    bottom: var(--space-8);
    right: var(--space-8);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
    z-index: var(--z-orb);
  }

  /* ── Transcript ── */
  .transcript {
    max-width: 200px;
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-md);
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--color-text-secondary);
    text-align: center;
    animation: fadeUp 0.3s var(--ease-out-expo);
  }

  /* ── Label ── */
  .label {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    color: var(--color-text-muted);
    transition: color 0.3s ease;
    user-select: none;
  }

  .label.active {
    color: var(--accent, var(--color-accent));
  }

  /* ── Orb ── */
  .orb {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    cursor: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      transform       0.4s var(--ease-spring),
      box-shadow      0.4s ease,
      border-color    0.4s ease,
      background      0.4s ease;

    /* Idle breathing */
    animation: breathe 4s ease-in-out infinite;
  }

  @keyframes breathe {
    0%, 100% {
      box-shadow:
        0 0 16px color-mix(in srgb, var(--accent) 20%, transparent),
        0 0 32px color-mix(in srgb, var(--accent) 8%, transparent);
    }
    50% {
      box-shadow:
        0 0 28px color-mix(in srgb, var(--accent) 35%, transparent),
        0 0 56px color-mix(in srgb, var(--accent) 15%, transparent);
    }
  }

  .orb:hover {
    transform: scale(1.08);
    border-color: rgba(255,255,255,0.2);
    background: rgba(255,255,255,0.07);
  }

  .orb.listening {
    width: 72px;
    height: 72px;
    animation: listeningPulse 1.5s ease-in-out infinite;
    border-color: color-mix(in srgb, var(--accent) 60%, transparent);
    background: color-mix(in srgb, var(--accent) 8%, transparent);
  }

  @keyframes listeningPulse {
    0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 40%, transparent); }
    50%       { box-shadow: 0 0 0 12px color-mix(in srgb, var(--accent) 0%, transparent); }
  }

  .orb.speaking {
    animation: speakingPulse 0.8s ease-in-out infinite;
    border-color: color-mix(in srgb, var(--accent) 50%, transparent);
  }

  @keyframes speakingPulse {
    0%, 100% { transform: scale(1);    }
    50%       { transform: scale(1.05); }
  }

  .orb.thinking {
    animation: spin 1.2s linear infinite;
    border-color: color-mix(in srgb, var(--accent) 40%, transparent);
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ── Orb Core ── */
  .orb-core {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .mic-icon,
  .speaking-icon {
    font-size: 1.1rem;
    color: var(--color-text-muted);
    transition: color 0.3s ease;
    user-select: none;
  }

  .orb:hover .mic-icon {
    color: var(--color-text-secondary);
  }

  /* ── Thinking dots ── */
  .thinking-dots {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .thinking-dots span {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--accent, var(--color-accent));
    animation: dot-bounce 1.2s ease-in-out infinite;
  }

  .thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
  .thinking-dots span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes dot-bounce {
    0%, 100% { transform: translateY(0);    opacity: 0.4; }
    50%       { transform: translateY(-4px); opacity: 1;   }
  }

  /* ── Mute button ── */
  .mute-btn {
    background: transparent;
    border: none;
    cursor: none;
    font-size: 0.75rem;
    opacity: 0.4;
    transition: opacity 0.2s ease;
    padding: var(--space-1);
  }

  .mute-btn:hover {
    opacity: 0.8;
  }
</style>
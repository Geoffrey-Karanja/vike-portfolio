<script>
  import { onMount } from 'svelte';
  import { accentColor } from '$lib/stores/theme.js';

  let mounted   = false;
  let tiltX     = 0;
  let tiltY     = 0;
  let glowX     = 50;
  let glowY     = 50;

  const fullName  = 'GEOFFREY KARANJA';
  const subtitle  = ['iOS Developer', 'Cybersecurity', 'Njoro, Kenya'];
  let visibleChars = 0;
  let subtitleVisible = false;
  let scrollIndicator = false;

  onMount(() => {
    mounted = true;

    // Assemble name character by character
    let i = 0;
    const interval = setInterval(() => {
      i++;
      visibleChars = i;
      if (i >= fullName.length) {
        clearInterval(interval);
        setTimeout(() => subtitleVisible = true, 300);
        setTimeout(() => scrollIndicator = true, 800);
      }
    }, 60);

    // Mouse tilt for photo card
    const handleMouse = (e) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      tiltY =  ((e.clientX - cx) / cx) * 8;
      tiltX = -((e.clientY - cy) / cy) * 8;
      glowX = (e.clientX / window.innerWidth)  * 100;
      glowY = (e.clientY / window.innerHeight) * 100;
    };

    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  });

  // Letter bounce on click
  let bouncedIndex = -1;
  function bounceLetter(i) {
    bouncedIndex = i;
    setTimeout(() => bouncedIndex = -1, 400);
  }

  export let onScrollDown;
</script>

<div class="hero" class:mounted>

  <!-- Left — Name + subtitle -->
  <div class="hero-left">

    <div class="label font-mono">// identity.swift</div>

    <h1 class="name">
      {#each fullName.split('') as char, i}
        <span
          class="char"
          class:visible={i < visibleChars}
          class:bounce={bouncedIndex === i}
          class:space={char === ' '}
          on:click={() => bounceLetter(i)}
          role="presentation"
        >{char === ' ' ? '\u00A0' : char}</span>
      {/each}
    </h1>

    <div class="subtitle" class:visible={subtitleVisible}>
      {#each subtitle as item, i}
        <span
          class="subtitle-item"
          style="animation-delay: {i * 0.15}s"
        >{item}</span>
        {#if i < subtitle.length - 1}
          <span class="dot">·</span>
        {/if}
      {/each}
    </div>

    <div class="tagline" class:visible={subtitleVisible}>
      <span style="animation-delay: 0.5s">
        The next billion-dollar idea is already forming.
      </span>
    </div>

   <button
      class="scroll-hint font-mono"
      class:visible={scrollIndicator}
      on:click={onScrollDown}
    >
      scroll to explore ↓
    </button>

  </div>

  <!-- Right — Photo card with tilt -->
  <div class="hero-right">
    <div
      class="photo-card"
      style="
        transform: perspective(800px) rotateX({tiltX}deg) rotateY({tiltY}deg);
        --glow-x: {glowX}%;
        --glow-y: {glowY}%;
        --accent: {$accentColor};
      "
    >
      <!-- Glass reflection that follows mouse -->
      <div class="photo-glare"></div>

      <img
        src="/karan.jpeg"
        alt="Senior Sir Geoffrey"
        class="photo"
      />

      <!-- Name badge overlay -->
      <div class="photo-badge glass">
        <span class="badge-name font-mono">Senior Sir Geoffrey</span>
        <span class="badge-role font-mono">iOS Dev · Cybersec</span>
      </div>

    </div>
  </div>

</div>

<style>
  .hero {
    min-height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: var(--space-10);
    padding: var(--space-12) var(--space-10);
    opacity: 0;
    transition: opacity 0.6s var(--ease-out-expo);
  }

  .hero.mounted { opacity: 1; }

  /* ── Left ── */
  .hero-left {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .label {
    font-size: 0.72rem;
    color: var(--color-text-muted);
  }

  /* ── Name assembly ── */
  .name {
    font-size: clamp(2rem, 5vw, 3.2rem);
    font-weight: 600;
    letter-spacing: -0.03em;
    line-height: 1.1;
    display: flex;
    flex-wrap: wrap;
    gap: 0;
  }

  .char {
    display: inline-block;
    opacity: 0;
    transform: translateY(-20px) scale(0.8);
    transition:
      opacity    0.3s var(--ease-out-expo),
      transform  0.3s var(--ease-spring);
    cursor: default;
  }

  .char.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .char.space { cursor: default; }

  .char.bounce {
    animation: letterBounce 0.4s var(--ease-spring);
  }

  @keyframes letterBounce {
    0%   { transform: translateY(0)    scale(1);   }
    30%  { transform: translateY(-12px) scale(1.3) rotate(-5deg); }
    60%  { transform: translateY(4px)  scale(0.9); }
    100% { transform: translateY(0)    scale(1);   }
  }

  /* ── Subtitle ── */
  .subtitle {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex-wrap: wrap;
    opacity: 0;
    transition: opacity 0.6s ease;
  }

  .subtitle.visible { opacity: 1; }

  .subtitle-item {
    font-family: var(--font-mono);
    font-size: 0.82rem;
    color: var(--color-text-secondary);
    opacity: 0;
    animation: none;
  }

  .subtitle.visible .subtitle-item {
    animation: fadeUp 0.5s var(--ease-out-expo) forwards;
  }

  .dot {
    color: var(--color-accent);
    font-size: 1rem;
  }

  /* ── Tagline ── */
  .tagline {
    opacity: 0;
    transition: opacity 0.8s ease 0.4s;
  }

  .tagline.visible { opacity: 1; }

  .tagline span {
    font-size: clamp(0.9rem, 1.8vw, 1.1rem);
    color: var(--color-text-muted);
    font-style: italic;
    line-height: 1.6;
    display: block;
    opacity: 0;
    animation: none;
  }

  .tagline.visible span {
    animation: fadeUp 0.7s var(--ease-out-expo) 0.5s forwards;
  }

  /* ── Scroll hint ── */
  .scroll-hint {
    font-size: 0.7rem;
    color: var(--color-text-muted);
    cursor: none;
    opacity: 0;
    transition: opacity 0.6s ease, color 0.2s ease;
    animation: bounce-hint 2s ease-in-out infinite;
  }

  .scroll-hint.visible { opacity: 1; }
  .scroll-hint:hover   { color: var(--color-accent); }

  @keyframes bounce-hint {
    0%, 100% { transform: translateY(0);  }
    50%       { transform: translateY(4px); }
  }

  /* ── Right — Photo ── */
  .hero-right {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .photo-card {
    position: relative;
    width: min(320px, 90%);
    border-radius: var(--radius-xl);
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow:
      0 32px 64px rgba(0,0,0,0.6),
      0 0 0 1px rgba(255,255,255,0.05);
    transition: transform 0.1s ease;
    cursor: default;

    /* Accent glow border */
    outline: 1px solid transparent;
    animation: cardGlow 4s ease-in-out infinite;
  }

  @keyframes cardGlow {
    0%, 100% {
      box-shadow:
        0 32px 64px rgba(0,0,0,0.6),
        0 0 32px color-mix(in srgb, var(--accent, #0A84FF) 15%, transparent);
    }
    50% {
      box-shadow:
        0 32px 64px rgba(0,0,0,0.6),
        0 0 56px color-mix(in srgb, var(--accent, #0A84FF) 30%, transparent);
    }
  }

  /* Mouse-following glare */
  .photo-glare {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at var(--glow-x) var(--glow-y),
      rgba(255,255,255,0.08) 0%,
      transparent 60%
    );
    z-index: 2;
    pointer-events: none;
    border-radius: inherit;
  }

  .photo {
    width: 100%;
    height: 420px;
    object-fit: cover;
    object-position: center top;
    display: block;
  }

  /* ── Name badge ── */
  .photo-badge {
    position: absolute;
    bottom: var(--space-4);
    left: var(--space-4);
    right: var(--space-4);
    border-radius: var(--radius-md);
    padding: var(--space-3) var(--space-4);
    display: flex;
    flex-direction: column;
    gap: 2px;
    z-index: 3;
  }

  .badge-name {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .badge-role {
    font-size: 0.7rem;
    color: var(--color-text-muted);
  }
</style>
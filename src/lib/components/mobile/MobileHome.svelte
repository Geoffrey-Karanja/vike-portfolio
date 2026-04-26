<script>
  import { onMount } from 'svelte';
  import { activeSection } from '$lib/stores/terminal.js';
  import { accentColor }   from '$lib/stores/theme.js';
  import { getGreeting }   from '$lib/utils/time.js';
  import { getLocationGreeting } from '$lib/utils/geo.js';
  import VikeOrb from '$lib/components/vike/VikeOrb.svelte';
  import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();          

  let vikeOrb;
  let mounted = false;
  let visibleChars = 0;
  const fullName = 'GEOFFREY KARANJA';

  const greeting = getLocationGreeting(getGreeting());

  onMount(() => {
    setTimeout(() => mounted = true, 100);

    let i = 0;
    const id = setInterval(() => {
      i++;
      visibleChars = i;
      if (i >= fullName.length) clearInterval(id);
    }, 70);

    setTimeout(() => {
      vikeOrb?.speak(`${greeting} I am VIKE. Built by Senior Sir Geoffrey. He is expecting your call.`);
    }, 1200);
  });

  function quickNav(id) {
    activeSection.set(id);
  }
</script>

<div class="home" class:mounted>

  <!-- Full bleed photo -->
  <div class="photo-wrap">
    <img src="/karan.jpeg" alt="Geoffrey" class="photo" />
    <div class="photo-overlay" />
  </div>

  <!-- Status badge -->
  <div class="status glass">
    <span class="status-dot" />
    <span class="font-mono">Open to opportunities</span>
  </div>

  <!-- Name over photo -->
  <div class="hero-content">
    <div class="greeting font-mono">{greeting}</div>

    <h1 class="name">
      {#each fullName.split('') as char, i}
        <span
          class="char"
          class:visible={i < visibleChars}
          class:space={char === ' '}
        >{char === ' ' ? '\u00A0' : char}</span>
      {/each}
    </h1>

    <p class="subtitle font-mono">
      iOS Dev · Cybersecurity · Njoro, KE
    </p>

    <!-- Quick action pills -->
    <div class="pills">
      <button class="pill"
        on:click={() => quickNav('about')}
        style="border-color: {$accentColor}44; color: {$accentColor}">
        About me
      </button>
      <button class="pill"
        on:click={() => quickNav('projects')}
        style="border-color: {$accentColor}44; color: {$accentColor}">
        My work
      </button>
      <button class="pill"
        on:click={() => quickNav('contact')}
        style="border-color: {$accentColor}44; color: {$accentColor}">
        Contact
      </button>
      <button class="pill"
        on:click={() => dispatch('whoami')}
        style="border-color: {$accentColor}44; color: {$accentColor}">
        whoami ◉
      </button>
    </div>

  </div>

  <!-- VIKE orb -->
  <div class="orb-wrap">
    <VikeOrb bind:this={vikeOrb} />
  </div>

</div>

<style>
  .home {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    overflow: hidden;
    opacity: 0;
    transition: opacity 0.6s var(--ease-out-expo);
  }

  .home.mounted { opacity: 1; }

  /* ── Photo ── */
  .photo-wrap {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  .photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
  }

  .photo-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.1) 0%,
      rgba(0,0,0,0.3) 40%,
      rgba(0,0,0,0.85) 75%,
      rgba(0,0,0,0.97) 100%
    );
  }

  /* ── Hero content ── */
  .hero-content {
    position: relative;
    z-index: 2;
    padding: var(--space-6);
    padding-bottom: 80px;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .greeting {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.5);
  }

  .name {
    font-size: clamp(2rem, 8vw, 3rem);
    font-weight: 600;
    letter-spacing: -0.03em;
    line-height: 1.05;
    display: flex;
    flex-wrap: wrap;
  }

  .char {
    display: inline-block;
    opacity: 0;
    transform: translateY(-12px);
    transition:
      opacity   0.25s var(--ease-out-expo),
      transform 0.25s var(--ease-spring);
  }

  .char.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .subtitle {
    font-size: 0.78rem;
    color: rgba(255,255,255,0.5);
  }

  /* ── Pills ── */
  .pills {
    display: flex;
    gap: var(--space-2);
    flex-wrap: wrap;
    margin-top: var(--space-2);
  }

  .pill {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-full);
    background: rgba(255,255,255,0.05);
    border: 1px solid transparent;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: all 0.2s ease;
  }

  .pill:active { transform: scale(0.95); }

  /* ── Status ── */
  .status {
    position: absolute;
    top: var(--space-4);
    right: var(--space-4);
    z-index: 3;
    border-radius: var(--radius-full);
    padding: var(--space-2) var(--space-3);
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-family: var(--font-mono);
    font-size: 0.62rem;
    color: var(--color-text-secondary);
  }

  .status-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #30D158;
    animation: glowPulse 2s ease-in-out infinite;
  }

  /* ── Orb ── */
  .orb-wrap {
    position: absolute;
    bottom: 80px;
    right: var(--space-5);
    z-index: 3;
  }
</style>
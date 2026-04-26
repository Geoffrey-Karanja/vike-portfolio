<script>
  import { activeSection } from '$lib/stores/terminal.js';
  import { accentColor }   from '$lib/stores/theme.js';
  import { getMood, getGreeting } from '$lib/utils/time.js';
  import { onMount } from 'svelte';
  import { playClick } from '$lib/utils/audio.js';

  let time = '';
  let mood = getMood();

  const moodIcon = { dawn: '🌅', day: '☀️', dusk: '🌆', night: '🌙' };

  const sections = [
    { id: 'about',    label: 'about'    },
    { id: 'projects', label: 'projects' },
    { id: 'tools',    label: 'tools'    },
    { id: 'contact',  label: 'contact'  },
  ];

  onMount(() => {
    const tick = () => {
      time = new Date().toLocaleTimeString('en-KE', {
        hour: '2-digit', minute: '2-digit', hour12: false,
        timeZone: 'Africa/Nairobi'
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  });

  function nav(id) {
    playClick();
    activeSection.set(id);
  }

  function goHome() {
    playClick();
    activeSection.set(null);
  }
</script>

<header class="topbar glass">

  <!-- Left — Logo -->
  <button class="logo font-mono" on:click={goHome}>
    <span class="logo-bracket">[</span>
    <span class="logo-name" style="color: {$accentColor}">SSG</span>
    <span class="logo-bracket">]</span>
  </button>

  <!-- Center — Nav -->
  <nav class="nav">
    {#each sections as s}
      <button
        class="nav-item font-mono"
        class:active={$activeSection === s.id}
        on:click={() => nav(s.id)}
        style="--accent: {$accentColor}"
      >
        {s.label}
      </button>
    {/each}
  </nav>

  <!-- Right — Status -->
  <div class="status font-mono">
    <span class="mood">{moodIcon[mood]}</span>
    <span class="time">{time}</span>
    <span class="location">Njoro, KE</span>
  </div>

</header>

<style>
  .topbar {
    position: fixed;
    top: var(--space-3);
    left: 50%;
    transform: translateX(-50%);
    width: calc(100vw - var(--space-8));
    max-width: 1100px;
    height: 44px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--space-5);
    z-index: var(--z-modal);
    gap: var(--space-4);
  }

  /* ── Logo ── */
  .logo {
    background: transparent;
    border: none;
    cursor: none;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: var(--color-text-primary);
    display: flex;
    gap: 1px;
  }

  .logo-bracket { color: var(--color-text-muted); }

  /* ── Nav ── */
  .nav {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  .nav-item {
    background: transparent;
    border: none;
    cursor: none;
    font-size: 0.72rem;
    color: var(--color-text-muted);
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-full);
    transition: color 0.2s ease, background 0.2s ease;
  }

  .nav-item:hover {
    color: var(--color-text-primary);
    background: var(--color-surface-hover);
  }

  .nav-item.active {
    color: var(--accent);
    background: var(--color-accent-dim);
  }

  /* ── Status ── */
  .status {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    font-size: 0.68rem;
    color: var(--color-text-muted);
  }

  .time   { color: var(--color-text-secondary); }
  .mood   { font-size: 0.8rem; }
</style>
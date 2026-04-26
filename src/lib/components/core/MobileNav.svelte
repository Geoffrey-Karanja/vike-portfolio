<script>
  import { activeSection } from '$lib/stores/terminal.js';
  import { accentColor }   from '$lib/stores/theme.js';
  import { playClick }     from '$lib/utils/audio.js';
  import { parseCommand } from '$lib/actions/commandParser.js';
  

  const tabs = [
    { id: null,       icon: '⌂',  label: 'Home'     },
    { id: 'about',    icon: '◉',  label: 'About'    },
    { id: 'projects', icon: '✦',  label: 'Projects' },
    { id: 'tools',    icon: '⚙',  label: 'Tools'    },
    { id: 'contact',  icon: '✉',  label: 'Contact'  },
  ];

  function nav(id) {
    playClick();
    activeSection.set(id);
  }
</script>

<nav class="mobile-nav glass">
  {#each tabs as tab}
    <button
      class="tab"
      class:active={$activeSection === tab.id}
      style="--accent: {$accentColor}"
      on:click={() => nav(tab.id)}
    >
      <span class="tab-icon">{tab.icon}</span>
      <span class="tab-label font-mono">{tab.label}</span>
    </button>
    <button
  class="tab hireme-tab"
  on:click={() => { playClick(); parseCommand('hireme'); }}
  title="hireme"
>
  <span class="tab-icon">🎊</span>
  <span class="tab-label font-mono">hire me</span>
</button>
  {/each}
</nav>

<style>
  .mobile-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    border-bottom: none;
    z-index: var(--z-modal);
    padding: 0 var(--space-2);
    padding-bottom: env(safe-area-inset-bottom);
  }

  .tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: var(--space-2) var(--space-1);
    border-radius: var(--radius-md);
    transition: all 0.2s var(--ease-out-expo);
    -webkit-tap-highlight-color: transparent;
  }

  .tab:active { transform: scale(0.9); }

  .tab-icon {
    font-size: 1.1rem;
    color: var(--color-text-muted);
    transition: color 0.2s ease, transform 0.3s var(--ease-spring);
  }

  .tab-label {
    font-size: 0.55rem;
    color: var(--color-text-muted);
    transition: color 0.2s ease;
    letter-spacing: 0.03em;
  }

  .tab.active .tab-icon {
    color: var(--accent);
    transform: translateY(-2px) scale(1.15);
  }

  .tab.active .tab-label {
    color: var(--accent);
  }
</style>
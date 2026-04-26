<script>
  import { onMount } from 'svelte';
  import { parseCommand } from '$lib/actions/commandParser.js';
  import { playClick } from '$lib/utils/audio.js';

  let open = false;

  const shortcuts = [
    { key: 'help',     desc: 'show all commands'    },
    { key: 'about',    desc: 'my story'              },
    { key: 'projects', desc: 'live work'             },
    { key: 'tools',    desc: 'tech stack'            },
    { key: 'contact',  desc: 'get in touch'          },
    { key: 'vitals',   desc: 'live dev stats'        },
    { key: 'whoami',   desc: 'quick intro'           },
    { key: 'clear',    desc: 'clear terminal'        },
    { key: 'hireme',   desc: '🎊 easter egg'         },
  ];

  function toggle() {
    playClick();
    open = !open;
  }

  function fireCommand(key) {
    playClick();
    parseCommand(key);
    open = false;
  }

  onMount(() => {
    const handler = (e) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        const tag = document.activeElement?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        toggle();
      }
      if (e.key === 'Escape') open = false;
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });
</script>

<!-- Trigger button -->
<button class="trigger glass font-mono" on:click={toggle} title="Keyboard shortcuts (?)">
  ?
</button>

<!-- Panel -->
{#if open}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
 <div class="backdrop" on:click|self={() => open = false} role="presentation">
    <div class="panel glass-heavy fade-up">

      <div class="panel-header">
        <span class="panel-title font-mono">// shortcuts.map</span>
        <button class="close-btn" on:click={toggle}>✕</button>
      </div>

      <div class="list">
        {#each shortcuts as s}
          <button class="item" on:click={() => fireCommand(s.key)}>
            <kbd class="key font-mono">{s.key}</kbd>
            <span class="arrow font-mono">→</span>
            <span class="desc">{s.desc}</span>
          </button>
        {/each}
      </div>

      <div class="panel-footer font-mono">
        press <kbd class="key-inline">?</kbd> to toggle
        · <kbd class="key-inline">esc</kbd> to close
      </div>

    </div>
  </div>
{/if}

<style>
  /* ── Trigger ── */
  .trigger {
    position: fixed;
    bottom: var(--space-8);
    left: var(--space-8);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    color: var(--color-text-muted);
    cursor: none;
    z-index: var(--z-orb);
    transition: color 0.2s ease, border-color 0.2s ease;
    border: 1px solid var(--color-border);
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
  }

  .trigger:hover {
    color: var(--color-text-primary);
    border-color: var(--color-border-bright);
  }

  /* ── Backdrop ── */
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: calc(var(--z-modal) + 10);
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.4);
    backdrop-filter: blur(4px);
  }

  /* ── Panel ── */
  .panel {
    width: min(420px, 90vw);
    border-radius: var(--radius-xl);
    padding: var(--space-6);
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .panel-title {
    font-size: 0.72rem;
    color: var(--color-text-muted);
  }

  .close-btn {
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    font-size: 0.72rem;
    padding: 2px 8px;
    cursor: none;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    border-color: var(--color-border-bright);
    color: var(--color-text-primary);
  }

  /* ── List ── */
  .list {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-md);
    background: transparent;
    border: none;
    cursor: none;
    text-align: left;
    transition: background 0.15s ease;
    width: 100%;
  }

  .item:hover {
    background: var(--color-surface-hover);
  }

  .key {
    min-width: 80px;
    font-size: 0.78rem;
    color: var(--color-accent);
    background: var(--color-accent-dim);
    border: 1px solid var(--color-accent-glow);
    border-radius: var(--radius-sm);
    padding: 2px var(--space-2);
    text-align: center;
  }

  .arrow {
    font-size: 0.7rem;
    color: var(--color-text-muted);
  }

  .desc {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
  }

  /* ── Footer ── */
  .panel-footer {
    font-size: 0.65rem;
    color: var(--color-text-muted);
    text-align: center;
    padding-top: var(--space-2);
    border-top: 1px solid var(--color-border);
  }

  .key-inline {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--color-text-secondary);
    background: var(--color-surface-hover);
    border: 1px solid var(--color-border-bright);
    border-radius: 3px;
    padding: 1px 5px;
  }
</style>
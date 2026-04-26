<script>
  import { createEventDispatcher } from 'svelte';
  import { languageColor } from '$lib/utils/github.js';
  import { timeAgo } from '$lib/utils/time.js';
  import { playClick } from '$lib/utils/audio.js';

  export let repo;
  const dispatch = createEventDispatcher();

  function close() {
    playClick();
    dispatch('close');
  }

  $: color   = languageColor(repo?.language);
  $: stars   = repo?.stargazers_count ?? 0;
  $: forks   = repo?.forks_count ?? 0;
  $: lang    = repo?.language ?? 'Unknown';
  $: desc    = repo?.description ?? 'No description provided.';
  $: updated = timeAgo(repo?.updated_at);
</script>

{#if repo}
  <!-- clicking backdrop closes sheet -->
  <div class="sheet-backdrop" on:click|self={close} role="dialog">
    <div class="sheet glass-heavy">

      <!-- Header -->
      <div class="sheet-header">
        <div class="lang-dot" style="background: {color}" />
        <h2 class="repo-name">{repo.name}</h2>
        <button class="close-btn" on:click={close}>✕</button>
      </div>

      <!-- Scrollable content -->
      <div class="sheet-scroll">

        <!-- Description -->
        <p class="desc">{desc}</p>

        <!-- Stats row -->
        <div class="stats">
          <div class="stat">
            <span class="stat-icon">★</span>
            <span class="stat-val">{stars}</span>
            <span class="stat-label">stars</span>
          </div>
          <div class="stat">
            <span class="stat-icon">⑂</span>
            <span class="stat-val">{forks}</span>
            <span class="stat-label">forks</span>
          </div>
          <div class="stat">
            <span class="stat-icon">◉</span>
            <span class="stat-val">{lang}</span>
          </div>
          <div class="stat">
            <span class="stat-icon">↻</span>
            <span class="stat-val">{updated}</span>
          </div>
        </div>

        <!-- Topics -->
        {#if repo.topics?.length}
          <div class="topics">
            {#each repo.topics.slice(0, 8) as topic}
              <span class="topic">{topic}</span>
            {/each}
          </div>
        {/if}

        <!-- Actions -->
        <div class="actions">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn--primary"
          >
            View on GitHub ↗
          </a> 
          {#if repo.homepage}
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn--secondary"
            >
              Live Demo ↗
            </a>
          {/if}
        </div>

      </div>
    </div>
  </div>
{/if}

<style>
  .sheet-backdrop {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(6px);
    z-index: var(--z-modal);
    animation: fadeUp 0.4s var(--ease-out-expo);
    padding: var(--space-6);
  }

  .sheet {
    width: min(480px, 100%);
    max-height: 80vh;
    border-radius: var(--radius-xl);
    padding: var(--space-6);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    animation: sheetIn 0.5s var(--ease-spring);
    overflow: hidden;  /* sheet itself clips, scroll is inside */
  }

  @keyframes sheetIn {
    from { transform: scale(0.92) translateY(20px); opacity: 0; }
    to   { transform: scale(1)    translateY(0);    opacity: 1; }
  }

  /* ── Scrollable inner area ── */
  .sheet-scroll {
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
    padding-right: var(--space-2); /* room for scrollbar */
  }

  /* ── Header ── */
  .sheet-header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex-shrink: 0;
  }

  .lang-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .repo-name {
    flex: 1;
    font-family: var(--font-mono);
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-text-primary);
    letter-spacing: -0.01em;
    word-break: break-all;
  }

  .close-btn {
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    font-size: 0.75rem;
    padding: 2px 8px;
    cursor: none;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .close-btn:hover {
    border-color: var(--color-border-bright);
    color: var(--color-text-primary);
  }

  /* ── Description ── */
  .desc {
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    line-height: 1.7;
    word-break: break-word;
  }

  /* ── Stats ── */
  .stats {
    display: flex;
    gap: var(--space-5);
    flex-wrap: wrap;
  }

  .stat {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    font-family: var(--font-mono);
    font-size: 0.78rem;
  }

  .stat-icon  { color: var(--color-text-muted); }
  .stat-val   { color: var(--color-text-primary); font-weight: 500; }
  .stat-label { color: var(--color-text-muted); }

  /* ── Topics ── */
  .topics {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .topic {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    color: var(--color-accent);
    background: var(--color-accent-dim);
    border: 1px solid var(--color-accent-glow);
    border-radius: var(--radius-full);
    padding: 2px var(--space-3);
  }

  /* ── Actions ── */
  .actions {
    display: flex;
    gap: var(--space-3);
    flex-wrap: wrap;
    padding-bottom: var(--space-2);
  }

  .btn {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    padding: var(--space-2) var(--space-5);
    border-radius: var(--radius-md);
    text-decoration: none;
    transition: all 0.2s var(--ease-out-expo);
    cursor: none;
  }

  .btn--primary {
    background: var(--color-accent);
    color: #000;
    border: 1px solid transparent;
    font-weight: 600;
  }

  .btn--primary:hover {
    filter: brightness(1.15);
    transform: translateY(-1px);
  }

  .btn--secondary {
    background: transparent;
    color: var(--color-text-secondary);
    border: 1px solid var(--color-border-bright);
  }

  .btn--secondary:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
    transform: translateY(-1px);
  }
</style>
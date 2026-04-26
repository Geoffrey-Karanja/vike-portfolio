<script>
  import { onMount, onDestroy } from 'svelte';
  import { fetchProfile, fetchRepos } from '$lib/utils/github.js';
  import { timeAgo } from '$lib/utils/time.js';
  import { getMood } from '$lib/utils/time.js';

  const USERNAME = import.meta.env.VITE_GITHUB_USERNAME;

  let profile     = null;
  let repos       = [];
  let currentTime = '';
  let mood        = getMood();
  let clockInterval;
  let loading     = true;

  // Live clock
  function tick() {
    currentTime = new Date().toLocaleTimeString('en-KE', {
      hour:   '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Africa/Nairobi'
    });
  }

  onMount(async () => {
    tick();
    clockInterval = setInterval(tick, 1000);

    try {
      [profile, repos] = await Promise.all([
        fetchProfile(USERNAME),
        fetchRepos(USERNAME)
      ]);
    } catch (e) {
      console.warn('GitHub fetch error:', e);
    } finally {
      loading = false;
    }
  });

  onDestroy(() => clearInterval(clockInterval));

  $: totalStars  = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  $: lastPush    = repos[0]?.pushed_at ? timeAgo(repos[0].pushed_at) : '—';
  $: topLanguage = (() => {
    const counts = {};
    repos.forEach(r => { if (r.language) counts[r.language] = (counts[r.language] ?? 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
  })();

  $: moodLabel = { dawn: 'Dawn 🌅', day: 'Day ☀️', dusk: 'Dusk 🌆', night: 'Night 🌙' }[mood];
</script>

<div class="vitals">
  <div class="vitals-header">
    <span class="label font-mono">// dev_vitals.live</span>
    <p class="subtitle">Real-time. Always building.</p>
  </div>

  {#if loading}
    <div class="loading">
      <span class="cursor-blink"></span>
      <span class="font-mono text-muted"> Pulling live stats...</span>
    </div>
  {:else}
    <div class="grid">

      <!-- Clock -->
      <div class="card glass card--wide">
        <span class="card-label font-mono">Local Time — Njoro, Kenya</span>
        <div class="clock font-mono">{currentTime}</div>
        <span class="card-sub font-mono">EAT · UTC+3 · {moodLabel}</span>
      </div>

      <!-- Public repos -->
      <div class="card glass">
        <span class="card-label font-mono">Public Repos</span>
        <div class="stat-big">{profile?.public_repos ?? '—'}</div>
      </div>

      <!-- Total stars -->
      <div class="card glass">
        <span class="card-label font-mono">Total Stars</span>
        <div class="stat-big">★ {totalStars}</div>
      </div>

      <!-- Followers -->
      <div class="card glass">
        <span class="card-label font-mono">Followers</span>
        <div class="stat-big">{profile?.followers ?? '—'}</div>
      </div>

      <!-- Last push -->
      <div class="card glass">
        <span class="card-label font-mono">Last Commit</span>
        <div class="stat-big text-terminal">{lastPush}</div>
        <span class="card-sub font-mono">{repos[0]?.name ?? ''}</span>
      </div>

      <!-- Top language -->
      <div class="card glass">
        <span class="card-label font-mono">Primary Language</span>
        <div class="stat-big text-accent">{topLanguage}</div>
      </div>

      <!-- GitHub link -->
      <div class="card glass card--wide bio">
        {#if profile?.bio}
          <p class="bio-text">"{profile.bio}"</p>
        {/if}
        <a
          href="https://github.com/{USERNAME}"
          target="_blank"
          rel="noopener noreferrer"
          class="gh-link font-mono"
        >
          github.com/{USERNAME} ↗
        </a>
      </div>

    </div>
  {/if}
</div>

<style>
  .vitals {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: var(--space-8);
    gap: var(--space-6);
    overflow-y: auto;
  }

  .vitals-header { flex-shrink: 0; }

  .label {
    font-size: 0.72rem;
    color: var(--color-text-muted);
  }

  .subtitle {
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    margin-top: var(--space-1);
  }

  .loading {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    font-size: 0.8rem;
    color: var(--color-text-muted);
    font-family: var(--font-mono);
  }

  /* ── Grid ── */
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--space-4);
  }

  .card {
    border-radius: var(--radius-lg);
    padding: var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    opacity: 0;
    animation: cardIn 0.6s var(--ease-out-expo) forwards;
  }

  .card--wide {
    grid-column: 1 / -1;
  }

  @keyframes cardIn {
    to { opacity: 1; }
  }

  .card:nth-child(1) { animation-delay: 0.05s; }
  .card:nth-child(2) { animation-delay: 0.10s; }
  .card:nth-child(3) { animation-delay: 0.15s; }
  .card:nth-child(4) { animation-delay: 0.20s; }
  .card:nth-child(5) { animation-delay: 0.25s; }
  .card:nth-child(6) { animation-delay: 0.30s; }
  .card:nth-child(7) { animation-delay: 0.35s; }

  .card-label {
    font-size: 0.68rem;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .card-sub {
    font-size: 0.68rem;
    color: var(--color-text-muted);
  }

  .stat-big {
    font-family: var(--font-mono);
    font-size: 1.8rem;
    font-weight: 300;
    color: var(--color-text-primary);
    line-height: 1;
    letter-spacing: -0.03em;
  }

  .clock {
    font-size: 2.4rem;
    font-weight: 300;
    color: var(--color-text-primary);
    letter-spacing: -0.03em;
    line-height: 1;
  }

  /* ── Bio card ── */
  .bio {
    gap: var(--space-3);
  }

  .bio-text {
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    line-height: 1.7;
    font-style: italic;
  }

  .gh-link {
    font-size: 0.75rem;
    color: var(--color-accent);
    text-decoration: none;
    transition: opacity 0.2s ease;
  }

  .gh-link:hover {
    opacity: 0.7;
  }

  .text-terminal { color: var(--color-terminal); }
  .text-accent   { color: var(--color-accent);   }
</style>
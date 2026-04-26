<script>
  import { onMount, onDestroy } from 'svelte';
  import projects from '$lib/data/projects.json';
  import { playClick } from '$lib/utils/audio.js';

  // Gyroscope tilt per card
  let tiltX = 0;
  let tiltY = 0;

  let gyroAvailable = false;

  function handleOrientation(e) {
    tiltX = Math.max(-12, Math.min(12, e.beta  - 45));
    tiltY = Math.max(-12, Math.min(12, e.gamma));
  }

  onMount(() => {
    if (window.DeviceOrientationEvent) {
      // iOS 13+ requires permission
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        // Will be triggered on user tap
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
        gyroAvailable = true;
      }
    }
  });

  async function requestGyro() {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      const perm = await DeviceOrientationEvent.requestPermission();
      if (perm === 'granted') {
        window.addEventListener('deviceorientation', handleOrientation);
        gyroAvailable = true;
      }
    }
  }

  onDestroy(() => {
    window.removeEventListener('deviceorientation', handleOrientation);
  });

  function openProject(proj) {
    playClick();
    if (proj.url) window.open(proj.url, '_blank');
  }
</script>

<div class="mobile-projects">

  <div class="header">
    <span class="label font-mono">// projects.live</span>
    <p class="subtitle">Tap a card to visit live.</p>
  </div>

  {#if !gyroAvailable && typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function'}
    <button class="gyro-btn glass font-mono" on:click={requestGyro}>
      Enable gyroscope tilt ✦
    </button>
  {/if}

  <div class="cards">
    {#each projects as proj, i}
      <div
        class="card glass"
        style="
          animation-delay: {i * 0.12}s;
          transform: perspective(600px)
            rotateX({tiltX * 0.5}deg)
            rotateY({tiltY * 0.5}deg);
          border-color: {proj.typeColor}33;
          --proj-color: {proj.typeColor};
        "
        on:click={() => openProject(proj)}
        role="button"
        tabindex="0"
      >
        <!-- Top row -->
        <div class="card-top">
          <span class="card-icon">{proj.icon}</span>
          <div class="card-titles">
            <h2 class="card-name">{proj.name}</h2>
            <span class="card-type font-mono" style="color:{proj.typeColor}">
              {proj.type}
            </span>
          </div>
          {#if proj.status === 'live'}
            <span class="live-badge font-mono">● LIVE</span>
          {:else}
            <span class="soon-badge font-mono">SOON</span>
          {/if}
        </div>

        <!-- Tagline -->
        <p class="card-tagline">{proj.tagline}</p>

        <!-- Description -->
        <p class="card-desc">{proj.description}</p>

        <!-- Stack -->
        <div class="stack-row">
          {#each proj.stack as tech}
            <span class="stack-tag font-mono">{tech}</span>
          {/each}
        </div>

        <!-- CTA -->
        {#if proj.status === 'live'}
          <div class="card-cta font-mono" style="color:{proj.typeColor}">
            View Live ↗
          </div>
        {:else}
          <div class="card-cta font-mono" style="color: var(--color-text-muted)">
            Coming Soon
          </div>
        {/if}
      </div>
    {/each}
  </div>

</div>

<style>
  .mobile-projects {
    height: 100%;
    overflow-y: auto;
    padding: var(--space-6);
    padding-bottom: 80px;
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
    -webkit-overflow-scrolling: touch;
  }

  .header { flex-shrink: 0; }

  .label {
    font-size: 0.72rem;
    color: var(--color-text-muted);
  }

  .subtitle {
    font-size: 0.82rem;
    color: var(--color-text-secondary);
    margin-top: var(--space-1);
  }

  .gyro-btn {
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-md);
    font-size: 0.75rem;
    color: var(--color-accent);
    cursor: pointer;
    border: 1px solid var(--color-accent-glow);
    background: var(--color-accent-dim);
    -webkit-tap-highlight-color: transparent;
  }

  /* ── Cards ── */
  .cards {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .card {
    border-radius: var(--radius-xl);
    padding: var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    cursor: pointer;
    opacity: 0;
    animation: cardIn 0.6s var(--ease-out-expo) forwards;
    transition:
      transform    0.15s ease,
      border-color 0.3s ease;
    -webkit-tap-highlight-color: transparent;
  }

  .card:active { transform: scale(0.98) !important; }

  @keyframes cardIn {
    to { opacity: 1; }
  }

  /* ── Card top ── */
  .card-top {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .card-icon  { font-size: 1.6rem; line-height: 1; flex-shrink: 0; }

  .card-titles {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .card-name {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text-primary);
    letter-spacing: -0.02em;
  }

  .card-type { font-size: 0.68rem; }

  .live-badge {
    font-size: 0.6rem;
    color: #30D158;
    background: rgba(48, 209, 88, 0.1);
    border: 1px solid rgba(48, 209, 88, 0.3);
    border-radius: var(--radius-full);
    padding: 2px var(--space-2);
    flex-shrink: 0;
  }

  .soon-badge {
    font-size: 0.6rem;
    color: var(--color-text-muted);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    padding: 2px var(--space-2);
    flex-shrink: 0;
  }

  /* ── Content ── */
  .card-tagline {
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--color-text-primary);
    font-style: italic;
  }

  .card-desc {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
    line-height: 1.7;
  }

  /* ── Stack ── */
  .stack-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .stack-tag {
    font-size: 0.62rem;
    color: var(--proj-color);
    background: color-mix(in srgb, var(--proj-color) 10%, transparent);
    border: 1px solid color-mix(in srgb, var(--proj-color) 25%, transparent);
    border-radius: var(--radius-full);
    padding: 2px var(--space-2);
  }

  /* ── CTA ── */
  .card-cta {
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.02em;
  }
</style>
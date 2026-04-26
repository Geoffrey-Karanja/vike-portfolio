<script>
  import { onMount } from 'svelte';
  import { playClick } from '$lib/utils/audio.js';

  const milestones = [
    {
      year: '2023',
      title: 'Linux & Nethunter',
      detail: 'While still in secondary school, installed Kali NetHunter on mobile. Security before syntax. Most developers find Linux intimidating — I found it home.',
      icon: '🐧'
    },
    {
      year: '2024',
      title: 'First Code. First Sale.',
      detail: 'Started with HTML. Built birthday sites for friends. Then Valentine\'s sites — and sold them. First code, first product, first revenue. The pattern was set.',
      icon: '💻'
    },
    {
      year: '2025',
      title: 'Cisco Cybersecurity Certified',
      detail: 'Earned Cisco Cybersecurity certification. Formal proof of what I had already been doing — understanding systems deeply enough to protect them.',
      icon: '🛡️'
    },
    {
      year: '2025',
      title: 'First Live Deployments',
      detail: 'Moved from local to live. First projects deployed on GitHub Pages — real URLs, real users. The gap between "building" and "shipping" closed permanently.',
      icon: '🚀'
    },
    {
      year: '2026',
      title: 'Still Building.',
      detail: 'The startup is forming. The skills are stacking. The vision is sharpening. This portfolio is not the destination — it is a checkpoint.',
      icon: '∞'
    }
  ];

  let expanded  = -1;
  let visible   = new Array(milestones.length).fill(false);
  let lineDrawn = false;

  function toggle(i) {
    playClick();
    expanded = expanded === i ? -1 : i;
  }

  onMount(() => {
    setTimeout(() => lineDrawn = true, 300);

    const els = document.querySelectorAll('.milestone');
    els.forEach((el, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              visible[i] = true;
              visible = [...visible];
            }, i * 120);
          }
        },
        { threshold: 0.2 }
      );
      obs.observe(el);
    });
  });
</script>

<div class="timeline-section">
  <div class="section-label font-mono">// timeline.log</div>

  <div class="timeline">
    <!-- Vertical line -->
    <div class="line" class:drawn={lineDrawn}></div>

    {#each milestones as m, i}
      <div
        class="milestone"
        class:visible={visible[i]}
        style="animation-delay: {i * 0.1}s"
      >
        <!-- Dot -->
        <div class="dot-col">
          <div class="dot" class:active={expanded === i}>
            <span class="dot-icon">{m.icon}</span>
          </div>
        </div>

        <!-- Content -->
        <div class="milestone-content">
          <button
            class="milestone-header"
            on:click={() => toggle(i)}
          >
            <span class="year font-mono">{m.year}</span>
            <span class="title">{m.title}</span>
            <span class="chevron" class:open={expanded === i}>›</span>
          </button>

          {#if expanded === i}
            <p class="detail fade-up">{m.detail}</p>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .timeline-section {
    padding: var(--space-12) var(--space-10);
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
  }

  .section-label {
    font-size: 0.72rem;
    color: var(--color-text-muted);
  }

  .timeline {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0;
    padding-left: 32px;
  }

  /* ── Vertical line ── */
  .line {
    position: absolute;
    left: 11px;
    top: 12px;
    bottom: 12px;
    width: 1px;
    background: linear-gradient(
      to bottom,
      var(--color-accent),
      var(--color-border)
    );
    transform: scaleY(0);
    transform-origin: top;
    transition: transform 1.5s var(--ease-out-expo);
  }

  .line.drawn { transform: scaleY(1); }

  /* ── Milestone ── */
  .milestone {
    display: grid;
    grid-template-columns: 0 1fr;
    gap: var(--space-5);
    padding-bottom: var(--space-8);
    opacity: 0;
    transform: translateX(-16px);
    transition:
      opacity   0.6s var(--ease-out-expo),
      transform 0.6s var(--ease-out-expo);
  }

  .milestone.visible {
    opacity: 1;
    transform: translateX(0);
  }

  /* ── Dot ── */
  .dot-col {
    position: absolute;
    left: 4px;
  }

  .dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--color-bg);
    border: 2px solid var(--color-border-bright);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.3s ease, transform 0.3s var(--ease-spring);
    margin-top: 4px;
  }

  .dot.active {
    border-color: var(--color-accent);
    transform: scale(1.3);
    box-shadow: 0 0 12px var(--color-accent-glow);
  }

  .dot-icon {
    font-size: 0.5rem;
    line-height: 1;
  }

  /* ── Content ── */
  .milestone-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .milestone-header {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    background: transparent;
    border: none;
    cursor: none;
    text-align: left;
    padding: 0;
    width: 100%;
  }

  .year {
    font-size: 0.72rem;
    color: var(--color-accent);
    min-width: 36px;
    opacity: 0.8;
  }

  .title {
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-text-primary);
    flex: 1;
  }

  .chevron {
    color: var(--color-text-muted);
    font-size: 1.2rem;
    transition: transform 0.3s var(--ease-spring);
    display: inline-block;
  }

  .chevron.open {
    transform: rotate(90deg);
    color: var(--color-accent);
  }

  .detail {
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    line-height: 1.8;
    padding-left: calc(36px + var(--space-4));
    border-left: 2px solid var(--color-accent-glow);
    margin-left: 0;
  }
</style>
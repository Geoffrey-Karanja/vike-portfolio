<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { playBootChime } from '$lib/utils/audio.js';
  import { getGreeting } from '$lib/utils/time.js';
  import { getLocationGreeting } from '$lib/utils/geo.js';

  const dispatch = createEventDispatcher();

  let lines    = [];
  let done     = false;
  let visible  = false;

  const greeting = getLocationGreeting(getGreeting());

  const sequence = [
    { text: 'VIKE v1.0.0',                             delay: 200,  type: 'system' },
    { text: 'Vocal Interface for Kinetic Exploration',  delay: 800,  type: 'muted'  },
    { text: '─────────────────────────────────────',   delay: 1400, type: 'border' },
    { text: greeting,                                   delay: 2000, type: 'output' },
    { text: 'I am VIKE. Built by Senior Sir Geoffrey.',      delay: 2800, type: 'output' },
    { text: "Hope you enjoy the experience ",                delay: 3500, type: 'output' },
    { text: '─────────────────────────────────────',   delay: 4100, type: 'border' },
    { text: "Type 'help' to begin. Or speak.",          delay: 4700, type: 'accent' },
  ];

 onMount(() => {
    setTimeout(() => visible = true, 100);

    // Play chime immediately — no gesture gate
    setTimeout(() => playBootChime(), 400);

    // Animate lines in one by one
    sequence.forEach(({ text, delay, type }) => {
      setTimeout(() => {
        lines = [...lines, { text, type, id: delay }];
      }, delay);
    });

    // Boot complete
    setTimeout(() => {
      done = true;
      dispatch('complete');
    }, 5400);
  });
</script>

<div class="boot" class:visible>
  {#each lines as line (line.id)}
    <div class="line line--{line.type}">
      {#if line.type === 'system'}
        <span class="tag">[VIKE]&nbsp;</span>
      {/if}
      {line.text}
    </div>
  {/each}

  {#if !done}
    <div class="line">
      <span class="cursor-blink"></span>
    </div>
  {/if}
</div>

<style>
  .boot {
    opacity: 0;
    transition: opacity 1s var(--ease-out-expo);
    padding: var(--space-2) 0;
  }

  .boot.visible {
    opacity: 1;
  }

  .line {
    font-family: var(--font-mono);
    font-size: 0.82rem;
    line-height: 2.1;
    white-space: pre;
    opacity: 0;
    transform: translateY(6px);
    animation: lineIn 0.5s var(--ease-out-expo) forwards;
  }

  @keyframes lineIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .line--system { color: var(--color-terminal);      }
  .line--muted  { color: var(--color-text-muted); font-size: 0.72rem; }
  .line--output { color: var(--color-text-secondary); }
  .line--border { color: var(--color-border-bright);  }
  .line--accent { color: var(--color-accent);         }

  .tag {
    color: var(--color-terminal);
    opacity: 0.6;
    font-size: 0.7rem;
  }
</style>
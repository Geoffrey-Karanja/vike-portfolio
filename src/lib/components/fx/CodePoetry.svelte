<script>
  import { onMount } from 'svelte';
  import poems from '$lib/data/poetry.json';

  let quote = '';
  let visible = false;

  onMount(() => {
    quote = poems[Math.floor(Math.random() * poems.length)];
    setTimeout(() => visible = true, 100);
  });
</script>

{#if visible}
  <div class="poetry" class:visible>
    <span class="prefix">// </span>{quote}
  </div>
{/if}

<style>
  .poetry {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-text-muted);
    opacity: 0;
    transition: opacity 1s var(--ease-out-expo);
    line-height: 1.6;
  }

  .poetry.visible {
    opacity: 1;
  }

  .prefix {
    color: var(--color-terminal-dim);
  }
</style>
<script>
  import { onMount, onDestroy } from 'svelte';
  import poems from '$lib/data/poetry.json';

  let quote   = '';
  let visible = false;
  let interval;

  function nextQuote() {
    visible = false;
    setTimeout(() => {
      quote   = poems[Math.floor(Math.random() * poems.length)];
      visible = true;
    }, 400);
  }

  onMount(() => {
    quote   = poems[Math.floor(Math.random() * poems.length)];
    setTimeout(() => visible = true, 300);
    interval = setInterval(nextQuote, 30000);
  });

  onDestroy(() => clearInterval(interval));
</script>

{#if quote}
  <div class="poetry" class:visible>
    <span class="prefix">// </span>{quote}
  </div>
{/if}

<style>
  .poetry {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--color-text-muted);
    opacity: 0;
    transition: opacity 0.8s var(--ease-out-expo);
    line-height: 1.7;
    font-style: italic;
  }

  .poetry.visible { opacity: 1; }

  .prefix {
    color: var(--color-terminal);
    opacity: 0.5;
    font-style: normal;
  }
</style>
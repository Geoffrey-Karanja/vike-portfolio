<script>
  import { onMount } from 'svelte';
  import AboutHero     from './AboutHero.svelte';
  import AboutStory    from './AboutStory.svelte';
  import AboutTimeline from './AboutTimeline.svelte';
  import AboutStats    from './AboutStats.svelte';

  let scrollEl;

  function scrollDown() {
    scrollEl?.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
  }

  // Listen for easter egg VIKE speak event
  onMount(() => {
    const handler = (e) => {
      window.dispatchEvent(new CustomEvent('vike:speak:external', {
        detail: e.detail
      }));
    };
    window.addEventListener('vike:speak', handler);
    return () => window.removeEventListener('vike:speak', handler);
  });
</script>

<div class="about-container" bind:this={scrollEl}>
  <AboutHero onScrollDown={scrollDown} />
  <AboutStory />
  <AboutTimeline />
  <AboutStats />
</div>

<style>
  .about-container {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    scroll-behavior: smooth;
  }
</style>
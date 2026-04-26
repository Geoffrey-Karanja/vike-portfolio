<script>
  import { onMount } from 'svelte';
  import { mood } from '$lib/stores/theme.js';
  import { getMood } from '$lib/utils/time.js';

  onMount(() => {
    // Set initial mood
    const current = getMood();
    mood.set(current);
    document.documentElement.setAttribute('data-mood', current);

    // Check every 60 seconds if mood should shift
    const interval = setInterval(() => {
      const next = getMood();
      if (next !== current) {
        mood.set(next);
        document.documentElement.setAttribute('data-mood', next);
      }
    }, 60000);

    return () => clearInterval(interval);
  });
</script>
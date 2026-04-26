<script>
  import { activeSection } from '$lib/stores/terminal.js';
  import { isMobile }      from '$lib/stores/device.js';
  import { onMount }       from 'svelte';

  import Terminal       from '$lib/components/core/Terminal.svelte';
  import StarField      from '$lib/components/constellation/StarField.svelte';
  import About          from '$lib/components/sections/About.svelte';
  import Tools          from '$lib/components/sections/Tools.svelte';
  import Contact        from '$lib/components/sections/Contact.svelte';
  import DevVitals      from '$lib/components/sections/DevVitals.svelte';
  import TopBar         from '$lib/components/core/TopBar.svelte';
  import ShortcutsPanel from '$lib/components/fx/ShortcutsPanel.svelte';
  import MobileApp      from '$lib/components/mobile/MobileApp.svelte';

  const sectionVoices = {
    about:    "Here's his story. The short version took three years to write.",
    projects: "Three builds. Two live. One incoming. Drag to orbit, click to explore.",
    tools:    "He builds his best work with Swift and JavaScript. A craftsman's selection.",
    contact:  "Senior Sir Geoffrey is listening. Choose your channel.",
    vitals:   "Live stats. He committed code today. As expected.",
  };

  let prev = null;

  $: if ($activeSection && $activeSection !== prev) {
    prev = $activeSection;
    const msg = sectionVoices[$activeSection];
    if (msg) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('vike:speak', { detail: msg }));
      }, 500);
    }
  }

  function closeSection() {
    activeSection.set(null);
    prev = null;
  }
</script>

{#if $isMobile}

  <!-- ══ MOBILE EXPERIENCE ══ -->
  <MobileApp />

{:else}

  <!-- ══ DESKTOP EXPERIENCE ══ -->
  <TopBar />

  <main>
    <div class="terminal-pane" class:shrunk={$activeSection !== null}>
      <Terminal />
    </div>

    {#if $activeSection}
      <div class="section-pane fade-up">
        <button class="close-section font-mono" on:click={closeSection}>
          ✕ close
        </button>

        {#if $activeSection === 'projects'}
          <StarField />
        {:else if $activeSection === 'about'}
          <About />
        {:else if $activeSection === 'tools'}
          <Tools />
        {:else if $activeSection === 'contact'}
          <Contact />
        {:else if $activeSection === 'vitals'}
          <DevVitals />
        {/if}
      </div>
    {/if}
  </main>

  <ShortcutsPanel />

{/if}

<style>
  main {
    width: 100vw;
    height: 100vh;
    display: flex;
    gap: var(--space-4);
    padding: calc(44px + var(--space-4) + var(--space-3)) var(--space-6) var(--space-6);
    background:
      radial-gradient(ellipse 80% 50% at 50% -20%, var(--color-accent-dim), transparent),
      var(--color-bg);
    overflow: hidden;
  }

  .terminal-pane {
    flex: 1;
    min-width: 0;
    transition: flex 0.6s var(--ease-out-expo);
  }

  .terminal-pane.shrunk { flex: 0 0 360px; }

  .section-pane {
    flex: 1;
    min-width: 0;
    position: relative;
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-border);
    box-shadow: var(--glass-shadow);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  .close-section {
    position: absolute;
    top: var(--space-4);
    right: var(--space-4);
    z-index: 10;
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    font-size: 0.72rem;
    padding: var(--space-1) var(--space-3);
    cursor: none;
    transition: all 0.2s ease;
  }

  .close-section:hover {
    border-color: var(--color-border-bright);
    color: var(--color-text-primary);
  }
</style>
<script>
  import { activeSection } from '$lib/stores/terminal.js';
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import { playClick } from '$lib/utils/audio.js';

  import MobileNav      from '$lib/components/core/MobileNav.svelte';
  import MobileHome     from './MobileHome.svelte';
  import MobileProjects from './MobileProjects.svelte';
  import About          from '$lib/components/sections/About.svelte';
  import Tools          from '$lib/components/sections/Tools.svelte';
  import Contact        from '$lib/components/sections/Contact.svelte';

  const sectionVoices = {
    about:    "Here's his story. The short version took three years to write.",
    projects: "Two live. One incoming. Tap a card to visit.",
    tools:    "He builds his best work with Swift and JavaScript.",
    contact:  "Senior Sir Geoffrey is listening. Choose your channel.",
  };

  let synth;
  let voice = null;

  function speak(text) {
    if (!synth) return;
    synth.cancel();
    const utter       = new SpeechSynthesisUtterance(text);
    utter.voice       = voice;
    utter.rate        = 0.88;
    utter.pitch       = 0.95;
    utter.volume      = 0.9;
    synth.speak(utter);
  }

  // Confetti
  function launchConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position:fixed;inset:0;width:100vw;height:100vh;
      pointer-events:none;z-index:9999;
    `;
    document.body.appendChild(canvas);
    const ctx     = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const pieces  = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 3,
      d: Math.random() * 8 + 2,
      color: ['#0A84FF','#30D158','#BF5AF2','#FF9F0A','#FF453A'][Math.floor(Math.random()*5)],
      tilt: 0, tiltAngle: 0, tiltSpeed: Math.random() * 0.1 + 0.05,
    }));
    let frame = 0;
    const draw = () => {
      if (frame++ > 200) { document.body.removeChild(canvas); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.tiltAngle += p.tiltSpeed;
        p.y  += p.d;
        p.tilt = Math.sin(p.tiltAngle) * 15;
        if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.r, p.r * 0.4, p.tilt, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    draw();
  }

  // whoami modal
  let whoamiVisible = false;

  function showWhoami() {
    whoamiVisible = false;
    setTimeout(() => {
      whoamiVisible = true;
      speak("Senior Sir Geoffrey. iOS Developer. Cybersecurity. Njoro Kenya. The next billion dollar idea is forming.");
      setTimeout(() => whoamiVisible = false, 8000);
    }, 50);
  }

  // Speak on section change
  let prev = null;
  $: if ($activeSection !== prev) {
    prev = $activeSection;
    const msg = sectionVoices[$activeSection];
    if (msg) setTimeout(() => speak(msg), 400);
  }

  onMount(() => {
    // Init speech synth
    if ('speechSynthesis' in window) {
      synth = window.speechSynthesis;
      const pickVoice = () => {
        const voices   = synth.getVoices();
        const preferred = ['Google UK English Male','Google US English','Alex','Daniel'];
        for (const name of preferred) {
          const found = voices.find(v => v.name === name);
          if (found) { voice = found; return; }
        }
        voice = voices.find(v => v.lang.startsWith('en')) ?? voices[0];
      };
      pickVoice();
      synth.onvoiceschanged = pickVoice;
    }

    // Listen for global events
    const speakHandler = (e) => speak(e.detail);
    const hireHandler  = () => {
      launchConfetti();
      speak("Excellent taste. Senior Sir Geoffrey is available and dangerous. Shall I open a channel?");
    };

    window.addEventListener('vike:speak',      speakHandler);
    window.addEventListener('hireme:trigger',   hireHandler);
    window.addEventListener('mobile:whoami',    showWhoami);

    return () => {
      window.removeEventListener('vike:speak',    speakHandler);
      window.removeEventListener('hireme:trigger', hireHandler);
      window.removeEventListener('mobile:whoami',  showWhoami);
    };
  });
</script>

<div class="mobile-app">

  <!-- Section content -->
  <div class="mobile-content">
    {#if !$activeSection}
      <MobileHome on:whoami={showWhoami} />
    {:else if $activeSection === 'about'}
      <div class="section-wrap">
        <About />
      </div>
    {:else if $activeSection === 'projects'}
      <MobileProjects />
    {:else if $activeSection === 'tools'}
      <div class="section-wrap">
        <Tools />
      </div>
    {:else if $activeSection === 'contact'}
      <div class="section-wrap">
        <Contact />
      </div>
    {/if}
  </div>

  <!-- Bottom nav -->
  <MobileNav />

  <!-- whoami modal -->
  {#if whoamiVisible}
    <div class="whoami-modal glass-heavy fade-up">
      <img src="{base}/karan.jpeg" alt="Geoffrey" class="whoami-photo" />
      <div class="whoami-info">
        <span class="whoami-name font-mono">Senior Sir Geoffrey</span>
        <span class="whoami-role font-mono">iOS Dev · Cybersecurity · Builder</span>
        <span class="whoami-line">"The next billion-dollar idea is forming."</span>
        <div class="whoami-actions">
          <button class="whoami-btn"
            on:click={() => { activeSection.set('about'); whoamiVisible = false; }}>
            About
          </button>
          <button class="whoami-btn whoami-btn--accent"
            on:click={() => { activeSection.set('contact'); whoamiVisible = false; }}>
            Contact
          </button>
          <a href="{base}/cv.html" target="_blank" rel="noopener noreferrer"
            class="whoami-btn">
            CV ↗
          </a>
        </div>
      </div>
      <button class="whoami-close" on:click={() => whoamiVisible = false}>✕</button>
    </div>
  {/if}

</div>

<style>
  .mobile-app {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background:
      radial-gradient(ellipse 100% 50% at 50% -10%, var(--color-accent-dim), transparent),
      var(--color-bg);
    overflow: hidden;
    position: relative;
  }

  .mobile-content {
    flex: 1;
    overflow: hidden;
    position: relative;
  }

  .section-wrap {
    height: 100%;
    overflow-y: auto;
    padding-bottom: 64px;
    -webkit-overflow-scrolling: touch;
  }

  /* ── whoami modal ── */
  .whoami-modal {
    position: fixed;
    bottom: 76px;
    left: var(--space-4);
    right: var(--space-4);
    border-radius: var(--radius-xl);
    padding: var(--space-4);
    display: flex;
    align-items: center;
    gap: var(--space-3);
    z-index: 300;
    border-color: var(--color-border-bright);
  }

  .whoami-photo {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    object-position: center top;
    border: 2px solid var(--color-border-bright);
    flex-shrink: 0;
  }

  .whoami-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .whoami-name {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .whoami-role {
    font-size: 0.62rem;
    color: var(--color-text-muted);
  }

  .whoami-line {
    font-size: 0.7rem;
    color: var(--color-text-secondary);
    font-style: italic;
    margin-top: 2px;
  }

  .whoami-actions {
    display: flex;
    gap: var(--space-2);
    margin-top: var(--space-2);
    flex-wrap: wrap;
  }

  .whoami-btn {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    padding: 3px var(--space-3);
    border-radius: var(--radius-sm);
    background: transparent;
    border: 1px solid var(--color-border-bright);
    color: var(--color-text-secondary);
    cursor: pointer;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
    transition: all 0.2s ease;
  }

  .whoami-btn--accent {
    background: var(--color-accent);
    border-color: transparent;
    color: #000;
    font-weight: 600;
  }

  .whoami-close {
    background: transparent;
    border: none;
    color: var(--color-text-muted);
    font-size: 0.75rem;
    cursor: pointer;
    padding: var(--space-1);
    flex-shrink: 0;
  }
</style>
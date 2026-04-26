<script>
  import { onMount, tick } from 'svelte';
  import { history, booted, completeBoot } from '$lib/stores/terminal.js';
  import { activeSection } from '$lib/stores/terminal.js';
  import BootSequence from './BootSequence.svelte';
  import CommandInput from './CommandInput.svelte';
  import VikeOrb     from '$lib/components/vike/VikeOrb.svelte';
  import { getGreeting } from '$lib/utils/time.js';
  import { getLocationGreeting } from '$lib/utils/geo.js';
  import { playClick } from '$lib/utils/audio.js';

  let whoamiVisible = false;
  let inputRef;
  let scrollEl;
  let vikeOrb;
  let showInput = false;

  // Track history length to detect new whoami commands
  let prevLen = 0;
  $: {
    if ($history.length > prevLen) {
      prevLen = $history.length;
      const last = $history[$history.length - 1];
      if (last?.type === 'input' && last?.content?.trim() === 'whoami') {
        whoamiVisible = false;
        setTimeout(() => {
          whoamiVisible = true;
          setTimeout(() => whoamiVisible = false, 8000);
        }, 50);
      }
    }
  }

  $: if ($history) scrollToBottom();

  async function scrollToBottom() {
    await tick();
    if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
  }

  function onBootComplete() {
    showInput = true;
    completeBoot();
    setTimeout(() => inputRef?.focus(), 100);
    setTimeout(() => {
      const greeting = getLocationGreeting(getGreeting());
      vikeOrb?.speak(
        `${greeting} I am the Vocal Interface for a Kinetic Exploration Vyke, built by Senior Sir Geoffrey. He's expecting your call. Type help to begin, or click me to speak.`
      );
    }, 600);
  }

  function handleTerminalClick() {
    inputRef?.focus();
  }

  // Confetti launcher — works globally
  function launchConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position:fixed; inset:0; width:100vw; height:100vh;
      pointer-events:none; z-index:9999;
    `;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: 140 }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height - canvas.height,
      r:     Math.random() * 6 + 3,
      d:     Math.random() * 8 + 2,
      color: ['#0A84FF','#30D158','#BF5AF2','#FF9F0A','#FF453A'][
        Math.floor(Math.random() * 5)
      ],
      tilt:      Math.random() * 10 - 10,
      tiltAngle: 0,
      tiltSpeed: Math.random() * 0.1 + 0.05,
    }));

    let frame = 0;
    const draw = () => {
      if (frame++ > 200) { document.body.removeChild(canvas); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.tiltAngle += p.tiltSpeed;
        p.y += p.d;
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

  onMount(() => {
    // VIKE speak handler
    const speakHandler = (e) => vikeOrb?.speak(e.detail);
    window.addEventListener('vike:speak', speakHandler);

    // hireme confetti handler
    const hireHandler = () => launchConfetti();
    window.addEventListener('hireme:trigger', hireHandler);

    return () => {
      window.removeEventListener('vike:speak', speakHandler);
      window.removeEventListener('hireme:trigger', hireHandler);
    };
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="terminal glass" on:click={handleTerminalClick}>

  <!-- Header -->
  <div class="terminal-header">
    <div class="dots">
      <span class="dot dot--red"></span>
      <span class="dot dot--amber"></span>
      <span class="dot dot--green"></span>
    </div>
    <span class="title">vike — zsh</span>
    <span class="spacer"></span>
  </div>

  <!-- Body -->
  <div class="terminal-body" bind:this={scrollEl}>

    <BootSequence on:complete={onBootComplete} />

    {#each $history as line (line.id)}
      <div class="history-line history-line--{line.type} fade-up">
        {#if line.type === 'input'}
          <span class="prompt">❯ </span>
        {:else if line.type === 'system'}
          <span class="tag">[VIKE] </span>
        {:else if line.type === 'error'}
          <span class="tag tag--error">[ERR] </span>
        {/if}
        {line.content}
      </div>
    {/each}

    {#if showInput}
      <CommandInput bind:this={inputRef} />
    {/if}

  </div>
  <!-- whoami modal -->
{#if whoamiVisible}
  <div class="whoami-modal glass-heavy fade-up">
    <img src="/karan.jpeg" alt="Geoffrey" class="whoami-photo" />
    <div class="whoami-info">
      <span class="whoami-name font-mono">Senior Sir Geoffrey</span>
      <span class="whoami-role font-mono">iOS Dev · Cybersecurity · Builder</span>
      <span class="whoami-line">"The next billion-dollar idea is forming."</span>
     <div class="whoami-actions">
  <button class="whoami-btn" on:click={() => { activeSection.set('about'); whoamiVisible = false; }}>
    Learn more
  </button>
  <button class="whoami-btn whoami-btn--accent" on:click={() => { activeSection.set('contact'); whoamiVisible = false; }}>
    Get in touch
  </button>
  <a href="/cv.html" target="_blank" class="whoami-btn" on:click={playClick}>
    Download CV
  </a>
</div>
    </div>
    <button class="whoami-close" on:click={() => whoamiVisible = false}>✕</button>
  </div>
{/if}
</div>

<!-- VIKE Orb — lives outside terminal, fixed position -->
<VikeOrb bind:this={vikeOrb} />

<style>
  .terminal {
    width: 100%;
    height: 100%;
    border-radius: var(--radius-lg);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .terminal-header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
  }

  .dots { display: flex; gap: var(--space-2); }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .dot--red   { background: #FF5F57; }
  .dot--amber { background: #FFBD2E; }
  .dot--green { background: #28C840; }

  .title {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-text-muted);
    flex: 1;
    text-align: center;
  }

  .spacer { width: 52px; }

  .terminal-body {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-4) var(--space-6);
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .history-line {
    font-family: var(--font-mono);
    font-size: 0.82rem;
    line-height: 1.9;
    color: var(--color-text-secondary);
    white-space: pre-wrap;
    word-break: break-word;
  }

  .history-line--input  { color: var(--color-text-primary); }
  .history-line--system { color: var(--color-terminal);     }
  .history-line--error  { color: #FF453A;                   }

  .prompt { color: var(--color-terminal); user-select: none; }

  .tag {
    color: var(--color-terminal);
    opacity: 0.6;
    font-size: 0.7rem;
  }

  .tag--error { color: #FF453A; }
  .whoami-modal {
    position: fixed;
    bottom: var(--space-8);
    left: 50%;
    transform: translateX(-50%);
    width: min(520px, 90vw);
    border-radius: var(--radius-xl);
    padding: var(--space-5);
    display: flex;
    align-items: center;
    gap: var(--space-4);
    z-index: var(--z-modal);
    border-color: var(--color-border-bright);
  }

  .whoami-photo {
    width: 52px;
    height: 52px;
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
    gap: 3px;
    min-width: 0;
  }

  .whoami-name {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .whoami-role {
    font-size: 0.68rem;
    color: var(--color-text-muted);
  }

  .whoami-line {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    font-style: italic;
    margin-top: 2px;
  }

  .whoami-actions {
    display: flex;
    gap: var(--space-2);
    margin-top: var(--space-2);
  }

  .whoami-btn {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    padding: 3px var(--space-3);
    border-radius: var(--radius-sm);
    background: transparent;
    border: 1px solid var(--color-border-bright);
    color: var(--color-text-secondary);
    cursor: none;
    transition: all 0.2s ease;
  }

  .whoami-btn:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .whoami-btn--accent {
    background: var(--color-accent);
    border-color: transparent;
    color: #000;
    font-weight: 600;
  }

  .whoami-btn--accent:hover {
    filter: brightness(1.15);
    color: #000;
  }

  .whoami-close {
    background: transparent;
    border: none;
    color: var(--color-text-muted);
    font-size: 0.75rem;
    cursor: none;
    padding: var(--space-1);
    flex-shrink: 0;
    transition: color 0.2s ease;
  }

  .whoami-close:hover { color: var(--color-text-primary); }
</style>
<script>
  import { onMount } from 'svelte';
  import { playClick } from '$lib/utils/audio.js';

  let name    = '';
  let email   = '';
  let message = '';
  let sending = false;
  let sent    = false;
  let mounted = false;

  const channels = [
    {
      id:      'whatsapp',
      icon:    '💬',
      label:   'WhatsApp',
      sub:     'Fastest response. Usually within the hour.',
      color:   '#25D366',
      action:  () => window.open('https://wa.me/254740833524?text=Hey%20Geoffrey%2C%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect.', '_blank')
    },
    {
      id:      'email',
      icon:    '📧',
      label:   'Email',
      sub:     'For formal conversations and opportunities.',
      color:   '#0A84FF',
      action:  () => window.open('mailto:gkaranja273@gmail.com?subject=Hey%20Senior%20Sir%20Geoffrey', '_blank')
    },
    {
      id:      'github',
      icon:    '🐙',
      label:   'GitHub',
      sub:     'See the work before you call.',
      color:   '#BF5AF2',
      action:  () => window.open('https://github.com/Geoffrey-Karanja', '_blank')
    }
  ];

  let hoveredChannel = null;

  function handleChannel(ch) {
    playClick();
    ch.action();
  }

  // Dissolving send
  async function handleSend() {
    if (!name || !email || !message) return;
    sending = true;

    await new Promise(r => setTimeout(r, 900));

    const subject = encodeURIComponent(`Hey Senior Sir Geoffrey — ${name} wants to connect`);
    const body    = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
    window.open(`mailto:gkaranja273@gmail.com?subject=${subject}&body=${body}`, '_blank');

    sending = false;
    sent    = true;
  }

  onMount(() => {
    setTimeout(() => mounted = true, 100);

    // VIKE greeting
    window.dispatchEvent(new CustomEvent('vike:speak', {
      detail: "Senior Sir Geoffrey is listening. Choose your channel."
    }));
  });
</script>

<div class="contact" class:mounted>

  <!-- Left — Identity -->
  <div class="identity">
    <div class="photo-wrap">
      <img src="/karan.jpeg" alt="Geoffrey" class="photo" />
      <div class="status-badge glass">
        <span class="status-dot"> </span>
        <span class="font-mono">Open to opportunities</span>
      </div>
    </div>

    <div class="id-info">
      <div class="label font-mono">// contact.sh</div>
      <h2 class="id-name">Senior Sir Geoffrey</h2>
      <p class="id-role font-mono">iOS Dev · Cybersecurity · Njoro, KE</p>

      <div class="timezone glass">
        <span class="tz-label font-mono">EAT · UTC+3</span>
        <span class="tz-note font-mono">Usually awake. Always building.</span>
      </div>
    </div>
  </div>

  <!-- Right — Channels + Form -->
  <div class="right-col">

    <!-- Channel cards -->
    <div class="channels">
      {#each channels as ch}
        <button
          class="channel glass"
          style="--ch-color: {ch.color}"
          class:hovered={hoveredChannel === ch.id}
          on:mouseenter={() => hoveredChannel = ch.id}
          on:mouseleave={() => hoveredChannel = null}
          on:click={() => handleChannel(ch)}
        >
          <span class="ch-icon">{ch.icon}</span>
          <div class="ch-info">
            <span class="ch-label font-mono">{ch.label}</span>
            <span class="ch-sub">{ch.sub}</span>
          </div>
          <span class="ch-arrow">↗</span>
        </button>
      {/each}
    </div>

    <!-- Divider -->
    <div class="divider">
      <span class="divider-line"></span>
      <span class="divider-label font-mono">or send a message</span>
      <span class="divider-line"></span> 
    </div>

    <!-- Form -->
    {#if sent}
      <div class="sent-state fade-up">
        <div class="sent-icon">✓</div>
        <p class="font-mono">Message sent.</p>
        <p class="sent-sub">Geoffrey will get back to you. Probably sooner than you expect.</p>
      </div>
    {:else}
      <form class="form" on:submit|preventDefault={handleSend}>
        <div class="form-row">
          <div class="field">
            <label class="field-label font-mono" for="name">name</label>
            <input
              id="name"
              bind:value={name}
              placeholder="Your name"
              class="input font-mono"
              required
            />
          </div>
          <div class="field">
            <label class="field-label font-mono" for="email">email</label>
            <input
              id="email"
              type="email"
              bind:value={email}
              placeholder="you@somewhere.com"
              class="input font-mono"
              required
            />
          </div>
        </div>

        <div class="field">
          <label class="field-label font-mono" for="msg">
            message
            {#if message.length > 0}
              <span class="char-count">{message.length}</span>
            {/if}
          </label>
          <textarea
            id="msg"
            bind:value={message}
            placeholder="Say something worth saying..."
            class="input textarea font-mono"
            rows="4"
            required
         ></textarea>
        </div>

        <button
          type="submit"
          class="submit"
          class:sending
          disabled={sending}
        >
          {#if sending}
            <span class="dots"><span></span><span></span><span></span></span>
          {:else}
            Send Message ↗
          {/if}
        </button>
      </form>
    {/if}

  </div>
</div>

<style>
  .contact {
    height: 100%;
    display: grid;
    grid-template-columns: 200px 1fr;
    min-width: 0;
    gap: var(--space-8);
    padding: var(--space-8);
    overflow-y: auto;
    opacity: 0;
    transition: opacity 0.6s var(--ease-out-expo);
  }

  .contact.mounted { opacity: 1; }

  /* ── Left — Identity ── */
  .identity {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    align-items: center;
  }

  .photo-wrap {
    position: relative;
    width: 100%;
  }

  .photo {
    width: 100%;
    height: 200px;
    object-fit: cover;
    object-position: center top;
    border-radius: var(--radius-xl);
    border: 1px solid var(--color-border);
    display: block;
  }

  .status-badge {
    position: absolute;
    bottom: var(--space-3);
    left: var(--space-3);
    right: var(--space-3);
    border-radius: var(--radius-md);
    padding: var(--space-2) var(--space-3);
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-family: var(--font-mono);
    font-size: 0.68rem;
    color: var(--color-text-secondary);
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #30D158;
    flex-shrink: 0;
    animation: glowPulse 2s ease-in-out infinite;
  }

  .id-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .label {
    font-size: 0.68rem;
    color: var(--color-text-muted);
  }

  .id-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text-primary);
    letter-spacing: -0.02em;
  }

  .id-role {
    font-size: 0.72rem;
    color: var(--color-text-muted);
  }

  .timezone {
    border-radius: var(--radius-md);
    padding: var(--space-3);
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: var(--space-2);
  }

  .tz-label {
    font-size: 0.72rem;
    color: var(--color-accent);
  }

  .tz-note {
    font-size: 0.65rem;
    color: var(--color-text-muted);
  }

  /* ── Right ── */
  .right-col {
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
    overflow-y: auto;
  }

  /* ── Channels ── */
  .channels {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .channel {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-4) var(--space-5);
    border-radius: var(--radius-lg);
    cursor: none;
    text-align: left;
    transition:
      transform      0.2s var(--ease-spring),
      border-color   0.2s ease,
      box-shadow     0.2s ease,
      background     0.2s ease;
  }

  .channel:hover {
    transform: translateX(6px);
    border-color: var(--ch-color);
    box-shadow: 0 0 24px color-mix(in srgb, var(--ch-color) 15%, transparent);
    background: color-mix(in srgb, var(--ch-color) 6%, transparent);
  }

  .ch-icon { font-size: 1.4rem; line-height: 1; flex-shrink: 0; }

  .ch-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .ch-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .ch-sub {
    font-size: 0.72rem;
    color: var(--color-text-muted);
  }

  .ch-arrow {
    color: var(--color-text-muted);
    font-size: 0.9rem;
    transition: color 0.2s ease, transform 0.2s ease;
  }

  .channel:hover .ch-arrow {
    color: var(--ch-color);
    transform: translate(2px, -2px);
  }

  /* ── Divider ── */
  .divider {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .divider-line {
    flex: 1;
    height: 1px;
    background: var(--color-border);
  }

  .divider-label {
    font-size: 0.65rem;
    color: var(--color-text-muted);
    white-space: nowrap;
  }

  /* ── Form ── */
  .form {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .field-label {
    font-size: 0.68rem;
    color: var(--color-text-muted);
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .char-count {
    color: var(--color-accent);
    font-size: 0.62rem;
  }

  .input {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-3) var(--space-4);
    color: var(--color-text-primary);
    font-size: 0.82rem;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    resize: none;
    width: 100%;
  }

  .input:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px var(--color-accent-dim);
  }

  .input::placeholder { color: var(--color-text-muted); }
  .textarea { line-height: 1.7; }

  /* ── Submit ── */
  .submit {
    align-self: flex-start;
    background: var(--color-accent);
    color: #000;
    border: none;
    border-radius: var(--radius-md);
    padding: var(--space-3) var(--space-8);
    font-family: var(--font-mono);
    font-size: 0.82rem;
    font-weight: 600;
    cursor: none;
    transition: filter 0.2s ease, transform 0.2s var(--ease-spring);
    min-width: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .submit:hover:not(:disabled) {
    filter: brightness(1.15);
    transform: translateY(-2px);
  }

  .submit.sending { opacity: 0.6; }

  .dots {
    display: flex;
    gap: 4px;
    align-items: center;
    justify-content: center;
  }

  .dots span {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #000;
    animation: dot-bounce 1.2s ease-in-out infinite;
  }

  .dots span:nth-child(2) { animation-delay: 0.2s; }
  .dots span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes dot-bounce {
    0%, 100% { transform: translateY(0);    opacity: 0.4; }
    50%       { transform: translateY(-4px); opacity: 1;   }
  }

  /* ── Sent state ── */
  .sent-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-4);
    padding: var(--space-10);
    text-align: center;
  }

  .sent-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--color-terminal-dim);
    border: 1px solid var(--color-terminal);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    color: var(--color-terminal);
  }

  .sent-sub {
    font-size: 0.82rem;
    color: var(--color-text-muted);
    max-width: 300px;
    line-height: 1.6;
  }
  /* ── Mobile contact fix ── */
  @media (max-width: 768px) {
    .contact {
      grid-template-columns: 1fr;
      padding: var(--space-5);
      overflow-y: auto;
      height: auto;
      min-height: 100%;
    }

    .identity {
      flex-direction: row;
      align-items: center;
      gap: var(--space-4);
    }

    .photo-wrap {
      width: 80px;
      flex-shrink: 0;
    }

    .photo {
      height: 80px;
      border-radius: var(--radius-lg);
    }

    .status-badge {
      display: none;
    }

    .id-name {
      font-size: 0.95rem;
    }

    .timezone {
      display: none;
    }

    .right-col {
      padding-bottom: var(--space-8);
    }
  }
</style>
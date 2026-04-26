<script>
  import { onMount } from 'svelte';
  import { base } from '$app/paths';

  const stats = [
    { value: 3,    suffix: '',  label: 'Years Coding',    icon: '⏱' },
    { value: 10,   suffix: '+', label: 'Projects Built',  icon: '🔨' },
    { value: 11,   suffix: '',  label: 'GitHub Repos',    icon: '📦' },
    { value: 999,  suffix: '+', label: 'Cups of Coffee',  icon: '☕' },
  ];

  let counts   = stats.map(() => 0);
  let started  = false;
  let sectionEl;

  // Easter egg
  let keyBuffer = '';
  function handleKey(e) {
    keyBuffer += e.key.toLowerCase();
    if (keyBuffer.length > 6) keyBuffer = keyBuffer.slice(-6);
    if (keyBuffer.includes('hireme')) triggerEasterEgg();
  }

  let easterEggActive = false;
  function triggerEasterEgg() {
    if (easterEggActive) return;
    easterEggActive = true;
    launchConfetti();

    // Tell VIKE to speak
    window.dispatchEvent(new CustomEvent('vike:speak', {
      detail: "Excellent taste. Senior Sir Geoffrey is available and dangerous. Shall I open a channel?"
    }));

    // Flash accent color
    document.body.style.transition = 'background 0.1s ease';
    document.body.style.background = 'var(--color-accent-dim)';
    setTimeout(() => document.body.style.background = '', 300);

    setTimeout(() => easterEggActive = false, 5000);
  }

  function launchConfetti() {
    const canvas  = document.createElement('canvas');
    canvas.style.cssText = `
      position:fixed; inset:0; width:100vw; height:100vh;
      pointer-events:none; z-index:9999;
    `;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: 120 }, () => ({
      x:   Math.random() * canvas.width,
      y:   Math.random() * canvas.height - canvas.height,
      r:   Math.random() * 6 + 3,
      d:   Math.random() * 8 + 2,
      color: ['#0A84FF','#30D158','#BF5AF2','#FF9F0A','#FF453A'][
        Math.floor(Math.random() * 5)
      ],
      tilt:      Math.random() * 10 - 10,
      tiltAngle: 0,
      tiltSpeed: Math.random() * 0.1 + 0.05,
    }));

    let frame = 0;
    const draw = () => {
      if (frame++ > 180) {
        document.body.removeChild(canvas);
        return;
      }
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

  function countUp() {
    stats.forEach((stat, i) => {
      const duration = 1600;
      const start    = Date.now();
      const tick = () => {
        const elapsed  = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease     = 1 - Math.pow(1 - progress, 3);
        counts[i] = Math.floor(ease * stat.value);
        counts    = [...counts];
        if (progress < 1) requestAnimationFrame(tick);
        else counts[i] = stat.value;
      };
      setTimeout(() => requestAnimationFrame(tick), i * 150);
    });
  }

  onMount(() => {
    window.addEventListener('keydown', handleKey);
    window.addEventListener('hireme:trigger', triggerEasterEgg);
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          countUp();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionEl) obs.observe(sectionEl);

    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('hireme:trigger', triggerEasterEgg);
      obs.disconnect();
    };
  });
</script>

<div class="stats-section" bind:this={sectionEl}>
  <div class="section-label font-mono">// stats.json</div>

  <div class="grid">
    {#each stats as stat, i}
      <div class="card glass" style="animation-delay: {i * 0.1}s">
        <div class="icon">{stat.icon}</div>
        <div class="number font-mono">
          {counts[i]}{stat.suffix}
        </div>
        <div class="label">{stat.label}</div>
      </div>
    {/each}
  </div>

  <!-- Cisco Cert -->
  <div class="cert-section">
    <div class="section-label font-mono">// certifications.json</div>
    <div class="cert-card glass">
      <img src="{base}/cisco-cert.png" alt="Cisco Cybersecurity Certificate" class="cert-img" />
      <div class="cert-info">
        <div class="cert-badge">
          <span class="cert-org font-mono">Cisco Networking Academy</span>
          <span class="cert-verified font-mono">✓ Verified</span>
        </div>
        <h3 class="cert-title">Introduction to Cybersecurity</h3>
        <p class="cert-desc">Threat identification, online safety, organizational protection strategies. Issued April 10, 2026.</p>
        <div class="cert-skills">
          {#each ['Cyber Threats', 'Online Safety', 'Network Security', 'Career Pathways'] as skill}
            <span class="cert-skill font-mono">{skill}</span>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <!-- Currently Learning -->
  <div class="learning-section">
    <div class="section-label font-mono">// currently_learning.live</div>
    <div class="learning-grid">
      {#each [
        { name: 'Swift & SwiftUI',  pct: 55, color: '#FA7343' },
        { name: 'React',            pct: 65, color: '#61DAFB' },
        { name: 'Docker',           pct: 45, color: '#2496ED' },
        { name: 'Networking',       pct: 70, color: '#30D158' },
      ] as item, i}
        <div class="learn-item" style="animation-delay: {i * 0.1}s">
          <div class="learn-header">
            <span class="learn-name font-mono">{item.name}</span>
            <span class="learn-pct font-mono" style="color:{item.color}">{item.pct}%</span>
          </div>
          <div class="learn-track">
            <div
              class="learn-fill"
              style="
                width: {item.pct}%;
                background: {item.color};
                transition-delay: {i * 0.15 + 0.3}s;
              "
           ></div> 
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class="easter-hint font-mono">
    // try typing: hireme
  </div>
</div>

<style>
  .stats-section {
    padding: var(--space-12) var(--space-10) var(--space-16);
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
  }

  .section-label {
    font-size: 0.72rem;
    color: var(--color-text-muted);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--space-4);
  }

  .card {
    border-radius: var(--radius-lg);
    padding: var(--space-6);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
    text-align: center;
    opacity: 0;
    animation: cardIn 0.6s var(--ease-out-expo) forwards;
    transition: transform 0.2s var(--ease-spring);
  }

  .card:hover {
    transform: translateY(-4px);
  }

  @keyframes cardIn {
    to { opacity: 1; }
  }

  .icon {
    font-size: 1.8rem;
    line-height: 1;
  }

  .number {
    font-size: 2.4rem;
    font-weight: 300;
    color: var(--color-text-primary);
    letter-spacing: -0.04em;
    line-height: 1;
  }

  .label {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    font-family: var(--font-mono);
  }

  .easter-hint {
    font-size: 0.65rem;
    color: var(--color-text-muted);
    opacity: 0.3;
    text-align: center;
    margin-top: var(--space-4);
  }
  /* ── Cert section ── */
  .cert-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .cert-card {
    border-radius: var(--radius-xl);
    overflow: hidden;
    display: grid;
    grid-template-columns: 280px 1fr;
  }

  .cert-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border-right: 1px solid var(--color-border);
  }

  .cert-info {
    padding: var(--space-6);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .cert-badge {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .cert-org {
    font-size: 0.68rem;
    color: var(--color-text-muted);
  }

  .cert-verified {
    font-size: 0.65rem;
    color: var(--color-terminal);
    background: var(--color-terminal-dim);
    padding: 2px var(--space-2);
    border-radius: var(--radius-full);
  }

  .cert-title {
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-text-primary);
  }

  .cert-desc {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
    line-height: 1.7;
  }

  .cert-skills {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .cert-skill {
    font-size: 0.65rem;
    color: var(--color-accent);
    background: var(--color-accent-dim);
    border: 1px solid var(--color-accent-glow);
    border-radius: var(--radius-full);
    padding: 2px var(--space-3);
  }

  /* ── Learning section ── */
  .learning-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .learning-grid {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .learn-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    opacity: 0;
    animation: cardIn 0.5s var(--ease-out-expo) forwards;
  }

  .learn-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .learn-name {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
  }

  .learn-pct {
    font-size: 0.72rem;
    font-weight: 500;
  }

  .learn-track {
    height: 3px;
    background: var(--color-border);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .learn-fill {
    height: 100%;
    border-radius: var(--radius-full);
    width: 0;
    transition: width 1.2s var(--ease-out-expo);
  }
</style>
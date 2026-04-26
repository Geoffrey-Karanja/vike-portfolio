<script>
  import { onMount } from 'svelte';

  const chapters = [
    {
      statement: "I am not just a developer.",
      body: "I am a technologist. Someone who sees systems, patterns, and possibilities where others see complexity. From Linux on mobile to Cisco-certified cybersecurity — I do not stay in one lane."
    },
    {
      statement: "I build because I have to.",
      body: "It started with birthday sites for friends. Then Valentine's sites I sold for profit. Then real projects with real users. Every line of code is a brick in something bigger."
    },
    {
      statement: "From Njoro, Kenya — to the world.",
      body: "Geography is not a limit. It is context. I write software that works everywhere, for everyone. The best ideas have never cared about zip codes."
    },
    {
      statement: "The next billion-dollar startup is forming.",
      body: "I study Elon, Bezos, Zuckerberg — not to copy them, but to understand the pattern. Relentless curiosity. Obsessive building. Uncomfortable ambition. I recognise myself in that story."
    }
  ];

  let visible = new Array(chapters.length).fill(false);
  let observers = [];

  onMount(() => {
    const els = document.querySelectorAll('.chapter');
    els.forEach((el, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            visible[i] = true;
            visible = [...visible];
          }
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  });
</script>

<div class="story">
  {#each chapters as chapter, i}
    <div class="chapter" class:visible={visible[i]}>
      <div class="chapter-number font-mono">0{i + 1}</div>
      <div class="chapter-content">
        <h2 class="statement">{chapter.statement}</h2>
        <p class="body">{chapter.body}</p>
      </div>
      {#if i < chapters.length - 1}
        <div class="rule" class:visible={visible[i]}></div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .story {
    padding: var(--space-12) var(--space-10);
    display: flex;
    flex-direction: column;
    gap: var(--space-16);
  }

  .chapter {
    display: grid;
    grid-template-columns: 48px 1fr;
    gap: var(--space-6);
    opacity: 0;
    transform: translateY(32px);
    transition:
      opacity   0.8s var(--ease-out-expo),
      transform 0.8s var(--ease-out-expo);
    position: relative;
  }

  .chapter.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .chapter-number {
    font-size: 0.7rem;
    color: var(--color-accent);
    padding-top: 6px;
    opacity: 0.6;
  }

  .chapter-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .statement {
    font-size: clamp(1.4rem, 3vw, 2rem);
    font-weight: 500;
    color: var(--color-text-primary);
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  .body {
    font-size: 0.92rem;
    color: var(--color-text-secondary);
    line-height: 1.8;
    max-width: 560px;
  }

  .rule {
    position: absolute;
    bottom: calc(-1 * var(--space-8));
    left: 48px;
    right: 0;
    height: 1px;
    background: linear-gradient(
      to right,
      var(--color-accent),
      transparent
    );
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 1s var(--ease-out-expo) 0.4s;
  }

  .rule.visible {
    transform: scaleX(1);
  }
</style>
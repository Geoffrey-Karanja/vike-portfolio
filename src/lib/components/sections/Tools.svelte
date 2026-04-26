<script>
  import tools from '$lib/data/tools.json';
  import { onMount } from 'svelte';

  let visible = false;
  onMount(() => setTimeout(() => visible = true, 100));
</script>

<div class="tools" class:visible>
  <div class="tools-header">
    <span class="label font-mono">// tools.json</span>
    <p class="subtitle">A craftsman's selection.</p>
  </div>

  <div class="grid">
    {#each tools as tool, i}
      <div
        class="card glass"
        style="animation-delay: {i * 0.07}s"
      >
        <div class="card-top">
          <span class="icon">{tool.icon}</span>
          <span class="name font-mono">{tool.name}</span>
        </div>

        <p class="desc">{tool.desc}</p>

        <div class="bar-track">
          <div
            class="bar-fill"
            style="width: {visible ? tool.level : 0}%;
                   transition-delay: {i * 0.15 + 0.3}s;"
          ></div>
        </div>

        <span class="level font-mono">{tool.level}%</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .tools {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: var(--space-8) var(--space-8);
    gap: var(--space-6);
    overflow-y: auto;
  }

  .tools-header { flex-shrink: 0; }

  .label {
    font-size: 0.72rem;
    color: var(--color-text-muted);
  }

  .subtitle {
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    margin-top: var(--space-1);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: var(--space-4);
  }

  .card {
    border-radius: var(--radius-lg);
    padding: var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    opacity: 0;
    transform: translateY(12px);
    animation: cardIn 0.6s var(--ease-out-expo) forwards;
    transition: transform 0.2s var(--ease-spring),
                border-color 0.2s ease;
  }

  .card:hover {
    transform: translateY(-3px);
    border-color: var(--color-border-bright);
  }

  @keyframes cardIn {
    to { opacity: 1; transform: translateY(0); }
  }

  .card-top {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .icon {
    font-size: 1.4rem;
    line-height: 1;
  }

  .name {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--color-text-primary);
  }

  .desc {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    line-height: 1.5;
    flex: 1;
  }

  .bar-track {
    height: 2px;
    background: var(--color-border);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    background: var(--color-accent);
    border-radius: var(--radius-full);
    transition: width 1s var(--ease-out-expo);
  }

  .level {
    font-size: 0.68rem;
    color: var(--color-text-muted);
    text-align: right;
  }
</style>
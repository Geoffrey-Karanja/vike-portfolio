<script>
  import { isTouch } from '$lib/stores/device.js';
  import { onMount } from 'svelte';
  import { accentColor } from '$lib/stores/theme.js';

  let x = -200;
  let y = -200;
  let visible  = false;
  let clicking = false;

  // Trail particles
  let trail = Array.from({ length: 8 }, (_, i) => ({
    x: -200, y: -200, size: 6 - i * 0.6, opacity: 0.5 - i * 0.055
  }));

  let positions = Array.from({ length: 8 }, () => ({ x: -200, y: -200 }));

  onMount(() => {
    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) visible = true;
    };

    const down  = () => { clicking = true;  };
    const up    = () => { clicking = false; };
    const leave = () => { visible = false;  };

    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup',   up);
    document.addEventListener('mouseleave', leave);

    // Animate trail with spring delay
    let animId;
    const animateTrail = () => {
      positions[0] = { x, y };
      for (let i = 1; i < positions.length; i++) {
        positions[i] = {
          x: positions[i].x + (positions[i-1].x - positions[i].x) * 0.35,
          y: positions[i].y + (positions[i-1].y - positions[i].y) * 0.35,
        };
      }
      trail = trail.map((t, i) => ({ ...t, x: positions[i].x, y: positions[i].y }));
      animId = requestAnimationFrame(animateTrail);
    };
    animateTrail();

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup',   up);
      document.removeEventListener('mouseleave', leave);
      cancelAnimationFrame(animId);
    };
  });
</script>

<!-- Spotlight glow -->
<div
  class="spotlight"
  style="
    left: {x}px; top: {y}px;
    opacity: {visible ? 1 : 0};
    background: radial-gradient(
      circle at center,
      {$accentColor}18 0%,
      {$accentColor}08 40%,
      transparent 70%
    );
    transform: translate(-50%, -50%) scale({clicking ? 0.85 : 1});
  "
></div>

<!-- Trail particles -->
{#each trail as particle, i}
  <div
    class="trail-dot"
    style="
      left: {particle.x}px;
      top:  {particle.y}px;
      width:  {particle.size}px;
      height: {particle.size}px;
      opacity: {visible ? particle.opacity : 0};
      background: {$accentColor};
      transform: translate(-50%, -50%) scale({clicking ? 0.6 : 1});
    "
  ></div>
{/each}

<!-- Main dot cursor -->
<div
  class="dot"
  style="
    left: {x}px; top: {y}px;
    opacity: {visible ? 1 : 0};
    background: {$accentColor};
    transform: translate(-50%, -50%) scale({clicking ? 0.6 : 1});
  "
> </div>

<style>
  .spotlight {
    position: fixed;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    pointer-events: none;
    z-index: var(--z-cursor);
    transition: opacity 300ms ease, transform 150ms var(--ease-out-expo);
    will-change: left, top;
  }

  .trail-dot {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: var(--z-cursor);
    transition: opacity 300ms ease;
    will-change: left, top;
  }

  .dot {
    position: fixed;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    pointer-events: none;
    z-index: var(--z-cursor);
    transition:
      opacity    300ms ease,
      transform  100ms var(--ease-spring),
      background 600ms ease;
    will-change: left, top;
  }
</style>
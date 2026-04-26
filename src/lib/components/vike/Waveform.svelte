<script>
  import { onMount, onDestroy } from 'svelte';
  import { accentColor } from '$lib/stores/theme.js';

  export let analyser = null;
  export let active   = false;

  let canvas;
  let ctx;
  let animId;
  let dataArray;

  $: if (active && analyser && canvas) startDraw();
  $: if (!active) stopDraw();

  function startDraw() {
    if (!canvas) return;
    ctx       = canvas.getContext('2d');
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    draw();
  }

  function stopDraw() {
    cancelAnimationFrame(animId);
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function draw() {
    animId = requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth   = 2;
    ctx.strokeStyle = $accentColor;
    ctx.shadowColor = $accentColor;
    ctx.shadowBlur  = 8;

    ctx.beginPath();

    const sliceWidth = canvas.width / dataArray.length;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;

      if (i === 0) ctx.moveTo(x, y);
      else         ctx.lineTo(x, y);

      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }

  onDestroy(() => cancelAnimationFrame(animId));
</script>

<canvas
  bind:this={canvas}
  width="120"
  height="40"
  class="waveform"
  class:active
></canvas>

<style>
  .waveform {
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .waveform.active {
    opacity: 1;
  }
</style>
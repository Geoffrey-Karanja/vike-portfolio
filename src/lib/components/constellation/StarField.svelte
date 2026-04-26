<script>
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import projects from '$lib/data/projects.json';
  import { accentColor } from '$lib/stores/theme.js';
  import { playClick } from '$lib/utils/audio.js';

  let container;
  let canvas;
  let animId;

  let scene, camera, renderer;
  let isDragging    = false;
  let previousMouse = { x: 0, y: 0 };
  let mouseDownPos  = { x: 0, y: 0 };
  let spherical     = { theta: 0.3, phi: Math.PI / 2.2 };
  let targetSpherical = { theta: 0.3, phi: Math.PI / 2.2 };
  let cameraRadius  = 22;
  let targetRadius  = 22;

  let raycaster, mouse;
  let planeMeshes   = [];

  // Selected project
  let selected = null;

  // Background star particles
  function addBackgroundStars() {
    const geo  = new THREE.BufferGeometry();
    const count = 600;
    const pos  = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 160;
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0xffffff, size: 0.07, transparent: true, opacity: 0.4
    })));
  }

  function initScene() {
    const w = container.clientWidth;
    const h = container.clientHeight;

    scene    = new THREE.Scene();
    camera   = new THREE.PerspectiveCamera(55, w / h, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    raycaster = new THREE.Raycaster();
    mouse     = new THREE.Vector2();

    addBackgroundStars();
    addProjectCards();

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 10, 5);
    scene.add(dir);

    updateCamera();
  }

  function addProjectCards() {
    planeMeshes = [];

    const colors = [0x0A84FF, 0x30D158, 0xBF5AF2];
    const positions = [
      { x: -7,  y: 1,  z: 0   },
      { x:  0,  y: -1, z: -6  },
      { x:  7,  y: 1,  z: 0   },
    ];

    projects.forEach((proj, i) => {
      const color = colors[i];

      // Glowing orb behind each card
      const orbGeo = new THREE.SphereGeometry(1.8, 32, 32);
      const orbMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.06,
      });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      orb.position.set(positions[i].x, positions[i].y, positions[i].z);
      scene.add(orb);

      // Point light per card
      const light = new THREE.PointLight(color, 1.2, 14);
      light.position.set(positions[i].x, positions[i].y, positions[i].z);
      scene.add(light);

      // Floating plane as hit target
      const planeGeo = new THREE.PlaneGeometry(5.5, 3.5);
      const planeMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.0,
        side: THREE.DoubleSide,
      });
      const plane = new THREE.Mesh(planeGeo, planeMat);
      plane.position.set(positions[i].x, positions[i].y, positions[i].z);
      plane.userData = { project: proj, index: i, baseY: positions[i].y };
      scene.add(plane);
      planeMeshes.push(plane);

      // Ring around each card
      const ringGeo = new THREE.RingGeometry(2.2, 2.4, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(positions[i].x, positions[i].y, positions[i].z);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
    });
  }

  function animate() {
    animId = requestAnimationFrame(animate);
    const t = Date.now() * 0.001;

    // Smooth camera
    spherical.theta  += (targetSpherical.theta - spherical.theta)  * 0.05;
    spherical.phi    += (targetSpherical.phi   - spherical.phi)    * 0.05;
    cameraRadius     += (targetRadius          - cameraRadius)     * 0.05;
    updateCamera();

    // Float cards
    planeMeshes.forEach((mesh, i) => {
      mesh.position.y = mesh.userData.baseY +
        Math.sin(t * 0.6 + i * 2.1) * 0.18;
      mesh.rotation.y = Math.sin(t * 0.3 + i) * 0.06;
    });

    // Auto rotate when idle
    if (!isDragging && !selected) {
      targetSpherical.theta += 0.0008;
    }

    renderer.render(scene, camera);
  }

  function updateCamera() {
    if (!camera) return;
    const { theta, phi } = spherical;
    camera.position.x = cameraRadius * Math.sin(phi) * Math.cos(theta);
    camera.position.y = cameraRadius * Math.cos(phi);
    camera.position.z = cameraRadius * Math.sin(phi) * Math.sin(theta);
    camera.lookAt(0, 0, 0);
  }

  function onResize() {
    if (!container || !renderer || !camera) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  function onMouseDown(e) {
    isDragging    = true;
    previousMouse = { x: e.clientX, y: e.clientY };
    mouseDownPos  = { x: e.clientX, y: e.clientY };
  }

  function onMouseMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - previousMouse.x;
    const dy = e.clientY - previousMouse.y;
    targetSpherical.theta -= dx * 0.004;
    targetSpherical.phi    = Math.max(0.4,
      Math.min(Math.PI - 0.4, targetSpherical.phi + dy * 0.004));
    previousMouse = { x: e.clientX, y: e.clientY };
  }

  function onMouseUp(e) {
    const dx    = Math.abs(e.clientX - mouseDownPos.x);
    const dy    = Math.abs(e.clientY - mouseDownPos.y);
    if (Math.sqrt(dx*dx + dy*dy) < 5) handleClick(e);
    isDragging = false;
  }

  function handleClick(e) {
    if (!renderer || !camera) return;
    const rect = canvas.getBoundingClientRect();
    mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
    mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(planeMeshes, false);
    if (hits.length > 0) {
      playClick();
      selected     = hits[0].object.userData.project;
      targetRadius = 14;
    } else {
      selected     = null;
      targetRadius = 22;
    }
  }

  function onWheel(e) {
    targetRadius = Math.max(10, Math.min(40, targetRadius + e.deltaY * 0.02));
  }

  function closeSelected() {
    selected     = null;
    targetRadius = 22;
  }

  onMount(() => {
    initScene();
    animate();
    window.addEventListener('resize', onResize);
  });

  onDestroy(() => {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', onResize);
    renderer?.dispose();
  });
</script>

<div class="wrap" bind:this={container}>
  <canvas
    bind:this={canvas}
    on:mousedown={onMouseDown}
    on:mousemove={onMouseMove}
    on:mouseup={onMouseUp}
    on:wheel={onWheel}
  />

  <!-- Project labels floating over canvas -->
  <div class="labels">
    {#each projects as proj, i}
      <div
        class="proj-label"
        class:selected={selected?.id === proj.id}
        style="
          left: {i === 0 ? '18%' : i === 1 ? '50%' : '82%'};
          top: 50%;
          transform: translate(-50%, -50%);
          border-color: {proj.typeColor}22;
          --proj-color: {proj.typeColor};
        "
        on:click={() => { playClick(); selected = proj; targetRadius = 14; }}
        role="button"
        tabindex="0"
      >
        <div class="proj-icon">{proj.icon}</div>
        <div class="proj-name font-mono">{proj.name}</div>
        <div class="proj-type font-mono" style="color: {proj.typeColor}">{proj.type}</div>
      </div>
    {/each}
  </div>

  <!-- Hint -->
  <div class="hint font-mono">drag to orbit · click a project</div>

  <!-- Selected project detail panel -->
  {#if selected}
    <div class="detail-backdrop" on:click|self={closeSelected}>
      <div
        class="detail glass-heavy"
        style="--proj-color: {selected.typeColor}"
      >
        <!-- Header -->
        <div class="detail-header">
          <span class="detail-icon">{selected.icon}</span>
          <div class="detail-titles">
            <h2 class="detail-name">{selected.name}</h2>
            <span
              class="detail-type font-mono"
              style="color: {selected.typeColor}"
            >{selected.type}</span>
          </div>
          <button class="close-btn" on:click={closeSelected}>✕</button>
        </div>

        <!-- Tagline -->
        <p class="detail-tagline">{selected.tagline}</p>

        <!-- Description -->
        <p class="detail-desc">{selected.description}</p>

        <!-- Stack -->
        <div class="stack-row">
          {#each selected.stack as tech}
            <span class="stack-tag font-mono">{tech}</span>
          {/each}
        </div>

        <!-- CTA -->
        <div class="detail-actions">
          {#if selected.status === 'live'}
            <a
              href={selected.url}
              target="_blank"
              rel="noopener noreferrer"
              class="btn-live"
              on:click={playClick}
            >
              View Live ↗
            </a>
          {:else}
            <div class="btn-soon">
              <span class="pulse-dot" />
              Coming Soon
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .wrap {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  canvas {
    width: 100%;
    height: 100%;
    display: block;
  }

  /* ── Floating labels ── */
  .labels {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .proj-label {
    position: absolute;
    pointer-events: all;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: none;
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-lg);
    border: 1px solid transparent;
    background: rgba(0,0,0,0.3);
    backdrop-filter: blur(8px);
    transition:
      background 0.3s ease,
      border-color 0.3s ease,
      transform 0.3s var(--ease-spring);
  }

  .proj-label:hover,
  .proj-label.selected {
    background: rgba(0,0,0,0.6);
    border-color: var(--proj-color);
    transform: translate(-50%, -50%) scale(1.05) !important;
  }

  .proj-icon { font-size: 1.4rem; line-height: 1; }

  .proj-name {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .proj-type {
    font-size: 0.65rem;
    opacity: 0.8;
  }

  /* ── Hint ── */
  .hint {
    position: absolute;
    bottom: var(--space-4);
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.68rem;
    color: var(--color-text-muted);
    pointer-events: none;
    white-space: nowrap;
  }

  /* ── Detail panel ── */
  .detail-backdrop {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(6px);
    z-index: var(--z-modal);
    padding: var(--space-6);
    animation: fadeUp 0.3s var(--ease-out-expo);
  }

  .detail {
    width: min(500px, 100%);
    border-radius: var(--radius-xl);
    padding: var(--space-8);
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
    border-color: color-mix(in srgb, var(--proj-color) 30%, transparent);
    animation: sheetIn 0.4s var(--ease-spring);
  }

  @keyframes sheetIn {
    from { transform: scale(0.93) translateY(16px); opacity: 0; }
    to   { transform: scale(1) translateY(0); opacity: 1; }
  }

  .detail-header {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .detail-icon { font-size: 1.8rem; line-height: 1; }

  .detail-titles {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .detail-name {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--color-text-primary);
    letter-spacing: -0.02em;
  }

  .detail-type { font-size: 0.72rem; }

  .close-btn {
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    font-size: 0.75rem;
    padding: 2px 8px;
    cursor: none;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    border-color: var(--color-border-bright);
    color: var(--color-text-primary);
  }

  .detail-tagline {
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-text-primary);
    font-style: italic;
  }

  .detail-desc {
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    line-height: 1.8;
  }

  /* ── Stack tags ── */
  .stack-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .stack-tag {
    font-size: 0.68rem;
    color: var(--proj-color);
    background: color-mix(in srgb, var(--proj-color) 10%, transparent);
    border: 1px solid color-mix(in srgb, var(--proj-color) 25%, transparent);
    border-radius: var(--radius-full);
    padding: 2px var(--space-3);
  }

  /* ── Actions ── */
  .detail-actions { display: flex; gap: var(--space-3); }

  .btn-live {
    font-family: var(--font-mono);
    font-size: 0.82rem;
    font-weight: 600;
    padding: var(--space-3) var(--space-6);
    border-radius: var(--radius-md);
    background: var(--proj-color);
    color: #000;
    text-decoration: none;
    border: none;
    cursor: none;
    transition: filter 0.2s ease, transform 0.2s var(--ease-spring);
  }

  .btn-live:hover {
    filter: brightness(1.2);
    transform: translateY(-2px);
  }

  .btn-soon {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-family: var(--font-mono);
    font-size: 0.82rem;
    color: var(--color-text-muted);
    padding: var(--space-3) var(--space-6);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
  }

  .pulse-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--proj-color);
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1);   }
    50%       { opacity: 0.4; transform: scale(0.8); }
  }
</style>
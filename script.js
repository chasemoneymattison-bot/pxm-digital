// ============================================================
// PXM DIGITAL — Cinematic site logic
// ============================================================
// Three.js loaded via CDN script tag

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================================
// CINEMATIC THREE.JS HERO — extruded 3D "PXM" wordmark on a stage
// ============================================================
(function initStage(){
  const canvas = document.getElementById('heroStage');
  if(!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true, powerPreference:'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  // Shadows off — nothing to receive them in the void
  renderer.shadowMap.enabled = false;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x08060a, 8, 22);

  const camera = new THREE.PerspectiveCamera(38, canvas.clientWidth/canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0.6, 8);
  camera.lookAt(0, 0.6, 0);

  // No floor, no walls — suspended in void

  // ===== Hand-built 3D PXM logo — lightweight, with hole in P
  let mesh = null;
  (function buildLogo(){
    // Brand purple material — metallic, precious
    const logoMat = new THREE.MeshStandardMaterial({
      color: 0x5E1A63,
      roughness: 0.18,
      metalness: 0.9,
      emissive: 0x3d0f42,
      emissiveIntensity: 0.35,
      flatShading: false,
    });

    const extrudeSettings = {
      depth: 0.35,
      curveSegments: 24,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.04,
      bevelOffset: 0,
      bevelSegments: 10,
    };

    const group = new THREE.Group();

    // === P (with hole) ===
    const pShape = new THREE.Shape();
    pShape.moveTo(0, 0);
    pShape.lineTo(0, 2);
    pShape.lineTo(1.1, 2);
    pShape.lineTo(1.45, 1.85);
    pShape.lineTo(1.55, 1.55);
    pShape.lineTo(1.55, 1.2);
    pShape.lineTo(1.45, 0.9);
    pShape.lineTo(1.1, 0.75);
    pShape.lineTo(0.45, 0.75);
    pShape.lineTo(0.45, 0);
    pShape.lineTo(0, 0);
    // Hole in P
    const pHole = new THREE.Path();
    pHole.moveTo(0.45, 1.0);
    pHole.lineTo(0.45, 1.7);
    pHole.lineTo(0.95, 1.7);
    pHole.lineTo(1.12, 1.6);
    pHole.lineTo(1.12, 1.1);
    pHole.lineTo(0.95, 1.0);
    pHole.lineTo(0.45, 1.0);
    pShape.holes.push(pHole);

    const pGeo = new THREE.ExtrudeGeometry(pShape, extrudeSettings);
    const pMesh = new THREE.Mesh(pGeo, logoMat);
    pMesh.castShadow = true;
    pMesh.position.x = -2.1;
    group.add(pMesh);

    // === X ===
    const xShape = new THREE.Shape();
    // Left arm top
    xShape.moveTo(0, 2);
    xShape.lineTo(0.42, 2);
    xShape.lineTo(0.72, 1.35);
    xShape.lineTo(1.02, 2);
    xShape.lineTo(1.44, 2);
    xShape.lineTo(0.92, 1.0);
    xShape.lineTo(1.44, 0);
    xShape.lineTo(1.02, 0);
    xShape.lineTo(0.72, 0.65);
    xShape.lineTo(0.42, 0);
    xShape.lineTo(0, 0);
    xShape.lineTo(0.52, 1.0);
    xShape.lineTo(0, 2);

    const xGeo = new THREE.ExtrudeGeometry(xShape, extrudeSettings);
    const xMesh = new THREE.Mesh(xGeo, logoMat);
    xMesh.castShadow = true;
    xMesh.position.x = -0.5;
    group.add(xMesh);

    // === M ===
    const mShape = new THREE.Shape();
    mShape.moveTo(0, 0);
    mShape.lineTo(0, 2);
    mShape.lineTo(0.4, 2);
    mShape.lineTo(0.85, 1.1);
    mShape.lineTo(1.3, 2);
    mShape.lineTo(1.7, 2);
    mShape.lineTo(1.7, 0);
    mShape.lineTo(1.3, 0);
    mShape.lineTo(1.3, 1.35);
    mShape.lineTo(0.85, 0.45);
    mShape.lineTo(0.4, 1.35);
    mShape.lineTo(0.4, 0);
    mShape.lineTo(0, 0);

    const mGeo = new THREE.ExtrudeGeometry(mShape, extrudeSettings);
    const mMesh = new THREE.Mesh(mGeo, logoMat);
    mMesh.castShadow = true;
    mMesh.position.x = 1.2;
    group.add(mMesh);

    // Center the whole thing
    const box = new THREE.Box3().setFromObject(group);
    const center = box.getCenter(new THREE.Vector3());
    group.position.x -= center.x;
    group.position.y -= center.y;
    group.position.z -= center.z;

    // Wrap for consistent transforms
    const wrapper = new THREE.Group();
    wrapper.add(group);
    wrapper.position.y = 0.6;

    mesh = wrapper;
    scene.add(mesh);
  })();

  // ===== Lighting — suspended in space
  // Soft ambient fill
  const ambient = new THREE.AmbientLight(0x1a0a1f, 0.6);
  scene.add(ambient);

  // Main spotlight — clean white from above-front
  const spot = new THREE.SpotLight(0xffffff, 250, 30, Math.PI * 0.14, 0.5, 1.2);
  spot.position.set(0.5, 6, 5);
  spot.target.position.set(0, 0, 0);
  scene.add(spot);
  scene.add(spot.target);

  // Purple accent from upper-right
  const spot2 = new THREE.SpotLight(0xc77dff, 100, 20, Math.PI * 0.2, 0.6, 1.5);
  spot2.position.set(4, 4, 2);
  spot2.target.position.set(0, 0, 0);
  scene.add(spot2);
  scene.add(spot2.target);

  // Cool rim from behind
  const rim = new THREE.SpotLight(0xe0aaff, 80, 20, Math.PI * 0.3, 0.7, 1.5);
  rim.position.set(-3, 2, -4);
  rim.target.position.set(0, 0, 0);
  scene.add(rim);
  scene.add(rim.target);

  // Subtle fill from below
  const fill = new THREE.PointLight(0x8a3a90, 20, 12, 2);
  fill.position.set(0, -3, 3);
  scene.add(fill);

  // ===== Mouse-driven camera parallax
  const mouse = { x:0, y:0, tx:0, ty:0 };
  window.addEventListener('mousemove', (e)=>{
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ===== Drag-to-spin with momentum
  let isDragging = false;
  let lastX = 0, lastY = 0;
  let velX = 0, velY = 0;
  let lastMoveTime = 0;
  let peakSpeed = 0;
  let exploded = false;
  const SPEED_THRESHOLD = 0.35; // radians/frame — requires a hard flick
  canvas.style.cursor = 'grab';

  function explode(){
    if(exploded) return;
    exploded = true;
    document.body.classList.add('intro--exit');
    // after the burst peaks, drop the intro layout so canvas snaps to inline
    setTimeout(()=>{
      document.body.classList.remove('intro');
      // canvas size changed; force a resize next frame
      requestAnimationFrame(resize);
    }, 380);
    setTimeout(()=>{
      document.body.classList.remove('intro--exit');
    }, 1000);
  }
  canvas.addEventListener('pointerdown', (e)=>{
    isDragging = true;
    lastX = e.clientX; lastY = e.clientY;
    velX = 0; velY = 0;
    lastMoveTime = performance.now();
    canvas.style.cursor = 'grabbing';
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e)=>{
    if(!isDragging || !mesh) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    const now = performance.now();
    const dt = Math.max(1, now - lastMoveTime);
    lastX = e.clientX; lastY = e.clientY;
    lastMoveTime = now;
    const rotY = dx * 0.006;
    const rotX = dy * 0.006;
    mesh.rotation.y += rotY;
    mesh.rotation.x += rotX;
    // velocity in radians per frame (assuming ~16ms)
    velY = (rotY / dt) * 16;
    velX = (rotX / dt) * 16;
    const speed = Math.abs(velX) + Math.abs(velY);
    if(speed > peakSpeed) peakSpeed = speed;
    if(!exploded && speed > SPEED_THRESHOLD){
      explode();
    }
  });
  const faster = document.getElementById('introFaster');
  let fasterTimer = null;
  function showFaster(){
    if(!faster || exploded) return;
    faster.classList.remove('show');
    // force reflow so animation restarts
    void faster.offsetWidth;
    faster.classList.add('show');
    clearTimeout(fasterTimer);
    fasterTimer = setTimeout(()=> faster.classList.remove('show'), 1400);
  }
  function endDrag(e){
    if(!isDragging) return;
    isDragging = false;
    canvas.style.cursor = 'grab';
    try { canvas.releasePointerCapture(e.pointerId); } catch(_){}
    if(!exploded && peakSpeed > 0 && peakSpeed < SPEED_THRESHOLD){
      showFaster();
    }
    peakSpeed = 0;
  }
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('pointerleave', endDrag);

  // ===== Resize
  function resize(){
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  // ===== Animation loop
  const clock = new THREE.Clock();
  function tick(){
    const t = clock.getElapsedTime();

    // smooth mouse interpolation
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    // drag-driven spin with momentum + gentle float
    if(mesh){
      if(!isDragging){
        // apply momentum
        mesh.rotation.y += velY;
        mesh.rotation.x += velX;
        velY *= 0.985;
        velX *= 0.985;
        // when nearly stopped, add a whisper of idle drift so it never feels dead
        const speed = Math.abs(velX) + Math.abs(velY);
        if(speed < 0.0008){
          mesh.rotation.y += 0.0015;
        }
      }
      mesh.position.y = 0.6 + Math.sin(t * 0.8) * 0.12;
    }

    // subtle camera drift for parallax
    camera.position.x = mouse.x * 0.4;
    camera.position.y = 0.6 + mouse.y * 0.2;
    camera.lookAt(0, 0.6, 0);

    // gently breathe the spotlight intensity
    spot.intensity = 280 + Math.sin(t * 0.8) * 30;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
})();


// ============================================================
// CUSTOM CURSOR
// ============================================================
(function initCursor(){
  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');
  if(!cursor || !dot) return;
  let x=0,y=0,tx=0,ty=0;
  window.addEventListener('mousemove', e=>{ tx=e.clientX; ty=e.clientY; dot.style.left=tx+'px'; dot.style.top=ty+'px'; });
  function loop(){
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    cursor.style.left = x+'px';
    cursor.style.top = y+'px';
    requestAnimationFrame(loop);
  }
  loop();
  document.querySelectorAll('a, button, .btn, .ba__handle, input, textarea, .proj, .service').forEach(el=>{
    el.addEventListener('mouseenter', ()=> cursor.classList.add('hover'));
    el.addEventListener('mouseleave', ()=> cursor.classList.remove('hover'));
  });
})();

// ============================================================
// NAV — change style after scroll
// ============================================================
const nav = document.querySelector('.nav');
window.addEventListener('scroll', ()=>{
  if(window.scrollY > 80) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

// ============================================================
// SCROLL REVEAL
// ============================================================
const revealTargets = document.querySelectorAll('.section, .service, .vision-card, .proj, .pillar');
revealTargets.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealTargets.forEach(el => io.observe(el));

// ============================================================
// BEFORE / AFTER SLIDER
// ============================================================
(function initBA(){
  const ba = document.getElementById('ba');
  if(!ba) return;
  let dragging = false;
  let current = 50;
  let target = 50;
  let raf = null;

  ba.tabIndex = 0;
  ba.setAttribute('role','slider');
  ba.setAttribute('aria-label','Before and after comparison');
  ba.setAttribute('aria-valuemin','0');
  ba.setAttribute('aria-valuemax','100');
  ba.setAttribute('aria-valuenow','50');

  function apply(){
    current += (target - current) * 0.35;
    if(Math.abs(target - current) < 0.05) current = target;
    ba.style.setProperty('--clip', current + '%');
    ba.setAttribute('aria-valuenow', Math.round(current));
    if(current !== target){
      raf = requestAnimationFrame(apply);
    } else {
      raf = null;
    }
  }
  function scheduleApply(){
    if(!raf) raf = requestAnimationFrame(apply);
  }
  function setFromX(clientX, immediate){
    const r = ba.getBoundingClientRect();
    let p = ((clientX - r.left) / r.width) * 100;
    target = Math.max(0, Math.min(100, p));
    if(immediate){ current = target; }
    scheduleApply();
  }

  ba.addEventListener('pointerdown', (e)=>{
    dragging = true;
    ba.classList.add('is-dragging');
    ba.setPointerCapture(e.pointerId);
    setFromX(e.clientX, true);
    e.preventDefault();
  });
  ba.addEventListener('pointermove', (e)=>{
    if(!dragging) return;
    setFromX(e.clientX, true);
  });
  function endDrag(e){
    if(!dragging) return;
    dragging = false;
    ba.classList.remove('is-dragging');
    try{ ba.releasePointerCapture(e.pointerId); }catch(_){}
  }
  ba.addEventListener('pointerup', endDrag);
  ba.addEventListener('pointercancel', endDrag);

  // Keyboard — arrow keys nudge, home/end snap
  ba.addEventListener('keydown', (e)=>{
    const step = e.shiftKey ? 10 : 4;
    if(e.key === 'ArrowLeft'){ target = Math.max(0, target - step); scheduleApply(); e.preventDefault(); }
    else if(e.key === 'ArrowRight'){ target = Math.min(100, target + step); scheduleApply(); e.preventDefault(); }
    else if(e.key === 'Home'){ target = 0; scheduleApply(); e.preventDefault(); }
    else if(e.key === 'End'){ target = 100; scheduleApply(); e.preventDefault(); }
  });

  // Auto-demo sweep on first scroll into view — subtle hint of interactivity
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        io.disconnect();
        let step = 0;
        const seq = [72, 28, 50];
        const run = ()=>{
          if(dragging || step >= seq.length) return;
          target = seq[step++];
          scheduleApply();
          setTimeout(run, 900);
        };
        setTimeout(run, 500);
      }
    });
  }, {threshold:0.4});
  io.observe(ba);
})();

// ============================================================
// FUNNEL TAB SWITCHER — swap between Growth Plan and Website Plan
// ============================================================
(function initFunnelTabs(){
  const tabs = document.querySelectorAll('.funnel__tab');
  const frame = document.getElementById('funnelFrame');
  if(!tabs.length || !frame) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const src = tab.dataset.funnel;
      if(!src || frame.getAttribute('src') === src) return;
      tabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected','false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected','true');
      frame.src = src;
    });
  });
})();

// Contact form replaced by funnel iframe — no JS needed here.

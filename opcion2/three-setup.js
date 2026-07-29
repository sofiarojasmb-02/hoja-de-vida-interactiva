/* ==========================================================================
   THREE-SETUP.JS - Dedicated Three.js 3D Graphics Engine Module
   Option 1 Palette & Design System + Version 2 Animation Engine
   ========================================================================== */

function initThreeJSSetup() {
  const canvas = document.getElementById('three-bg-canvas-v2');
  if (!canvas || typeof THREE === 'undefined' || typeof anime === 'undefined') {
    return;
  }

  // 1. Three.js Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 26);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 2. Lighting Setup (Option 1 Palette: Indigo #6366f1, Teal #14b8a6, Sky Blue #3b82f6)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x6366f1, 2.5, 90);
  pointLight1.position.set(20, 20, 20);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x14b8a6, 2.2, 90);
  pointLight2.position.set(-20, -20, 15);
  scene.add(pointLight2);

  const pointLight3 = new THREE.PointLight(0x38b6ff, 1.8, 70);
  pointLight3.position.set(0, 15, -10);
  scene.add(pointLight3);

  // 3. Central STEAM & FabLab 3D Nucleus Structure
  const nucleusGroup = new THREE.Group();

  // Outer Torus Rings (#6366f1 & #14b8a6)
  const torusGeom = new THREE.TorusGeometry(6.5, 0.09, 16, 100);
  const torusMat1 = new THREE.MeshStandardMaterial({
    color: 0x6366f1,
    roughness: 0.2,
    metalness: 0.8
  });
  const ring1 = new THREE.Mesh(torusGeom, torusMat1);
  ring1.rotation.x = Math.PI / 3;

  const torusMat2 = new THREE.MeshStandardMaterial({
    color: 0x14b8a6,
    roughness: 0.2,
    metalness: 0.8
  });
  const ring2 = new THREE.Mesh(torusGeom, torusMat2);
  ring2.rotation.y = Math.PI / 3;

  nucleusGroup.add(ring1, ring2);

  // Core Sphere (#38b6ff Emissive)
  const coreGeom = new THREE.SphereGeometry(1.5, 32, 32);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x38b6ff,
    emissive: 0x38b6ff,
    emissiveIntensity: 0.5,
    roughness: 0.1
  });
  const coreMesh = new THREE.Mesh(coreGeom, coreMat);
  nucleusGroup.add(coreMesh);

  nucleusGroup.position.set(4, 1, 3);
  nucleusGroup.scale.set(1.1, 1.1, 1.1);
  scene.add(nucleusGroup);

  // 4. Instanced Meshes System (Option 1 Tech Blue Spectrum Palette)
  const instanceCount = 121; // 11x11 Grid Matrix
  const geom = new THREE.OctahedronGeometry(0.5, 0);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.7
  });
  const instancedMesh = new THREE.InstancedMesh(geom, mat, instanceCount);

  const dummy = new THREE.Object3D();
  const colorHelper = new THREE.Color();
  const paletteHex = [0x6366f1, 0x14b8a6, 0x3b82f6, 0x1ca7ec, 0x00f5ff];

  const proxies = [];
  const cols = 11;
  const rows = 11;

  for (let i = 0; i < instanceCount; i++) {
    const ix = i % cols;
    const iy = Math.floor(i / cols);

    const baseX = (ix - cols / 2 + 0.5) * 4.4;
    const baseY = (iy - rows / 2 + 0.5) * 3.8;
    const baseZ = (Math.random() - 0.5) * 7;

    const baseScale = 0.5 + Math.random() * 0.45;
    const hexColor = paletteHex[i % paletteHex.length];
    const baseColor = new THREE.Color(hexColor);

    const proxy = {
      id: i,
      baseX: baseX, baseY: baseY, baseZ: baseZ,
      x: baseX, y: baseY, z: baseZ,
      rx: Math.random() * Math.PI,
      ry: Math.random() * Math.PI,
      scale: baseScale,
      r: baseColor.r,
      g: baseColor.g,
      b: baseColor.b
    };
    proxies.push(proxy);

    dummy.position.set(proxy.x, proxy.y, proxy.z);
    dummy.rotation.set(proxy.rx, proxy.ry, 0);
    dummy.scale.setScalar(proxy.scale);
    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);
    instancedMesh.setColorAt(i, baseColor);
  }
  instancedMesh.instanceMatrix.needsUpdate = true;
  if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;
  scene.add(instancedMesh);

  // Flush updates to WebGL buffer
  function commit3DChanges() {
    for (let i = 0; i < instanceCount; i++) {
      const p = proxies[i];
      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.rx, p.ry, 0);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);

      colorHelper.setRGB(p.r, p.g, p.b);
      instancedMesh.setColorAt(i, colorHelper);
    }
    instancedMesh.instanceMatrix.needsUpdate = true;
    if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;
  }

  // 5. Anime.js Stagger Animations (Option 1 Color Wave)
  anime({
    targets: proxies,
    y: function(target, index) {
      return target.baseY + Math.sin(index * 0.4) * 2.0;
    },
    z: function(target, index) {
      return target.baseZ + Math.cos(index * 0.3) * 3.0;
    },
    rx: function() { return Math.PI * 2; },
    ry: function() { return Math.PI * 2; },
    delay: anime.stagger(30, { grid: [11, 11], from: 'center' }),
    duration: 4000,
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutSine',
    update: commit3DChanges
  });

  // Color Morphing Stagger Wave
  const colIndigo = new THREE.Color(0x6366f1);
  const colTeal = new THREE.Color(0x14b8a6);
  const colSky = new THREE.Color(0x38b6ff);
  const colCyan = new THREE.Color(0x00f5ff);

  anime({
    targets: proxies,
    r: [
      { value: colIndigo.r, duration: 3000, easing: 'easeInOutQuad' },
      { value: colTeal.r, duration: 3000, easing: 'easeInOutQuad' },
      { value: colSky.r, duration: 3000, easing: 'easeInOutQuad' },
      { value: colCyan.r, duration: 3000, easing: 'easeInOutQuad' }
    ],
    g: [
      { value: colIndigo.g, duration: 3000, easing: 'easeInOutQuad' },
      { value: colTeal.g, duration: 3000, easing: 'easeInOutQuad' },
      { value: colSky.g, duration: 3000, easing: 'easeInOutQuad' },
      { value: colCyan.g, duration: 3000, easing: 'easeInOutQuad' }
    ],
    b: [
      { value: colIndigo.b, duration: 3000, easing: 'easeInOutQuad' },
      { value: colTeal.b, duration: 3000, easing: 'easeInOutQuad' },
      { value: colSky.b, duration: 3000, easing: 'easeInOutQuad' },
      { value: colCyan.b, duration: 3000, easing: 'easeInOutQuad' }
    ],
    delay: anime.stagger(35, { grid: [11, 11], from: 'first' }),
    direction: 'alternate',
    loop: true,
    update: commit3DChanges
  });

  // Mouse Parallax Effect
  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener('pointermove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Render Loop
  const clock = new THREE.Clock();
  function animateScene() {
    requestAnimationFrame(animateScene);
    const elapsedTime = clock.getElapsedTime();

    nucleusGroup.rotation.x = elapsedTime * 0.2;
    nucleusGroup.rotation.y = elapsedTime * 0.3;

    camera.position.x += (mouseX * 2.5 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 2.5 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animateScene();

  // Resize Listener
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}

document.addEventListener('DOMContentLoaded', initThreeJSSetup);

/* ==========================================================================
   THREE-SETUP.JS - Dedicated Three.js 3D Graphics Engine Module
   Designed for Option 2 Portfolio using Paleta de colores_1
   ========================================================================== */

function initThreeJSSetup() {
  const canvas = document.getElementById('three-bg-canvas-v2');
  if (!canvas || typeof THREE === 'undefined' || typeof anime === 'undefined') {
    console.warn('Three.js or Anime.js not detected on three-bg-canvas-v2');
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

  // 2. Lighting Setup with Paleta de colores_1 Tones
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambientLight);

  // Paleta 1 Lights: #d55889 (Rose Magenta), #eb6a7c (Coral Rose), #ffcd62 (Warm Gold)
  const pointLight1 = new THREE.PointLight(0xd55889, 2.5, 90);
  pointLight1.position.set(20, 20, 20);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xeb6a7c, 2.2, 90);
  pointLight2.position.set(-20, -20, 15);
  scene.add(pointLight2);

  const pointLight3 = new THREE.PointLight(0xffcd62, 1.8, 70);
  pointLight3.position.set(0, 15, -10);
  scene.add(pointLight3);

  // 3. Central STEAM & FabLab 3D Nucleus Structure
  const nucleusGroup = new THREE.Group();

  // Glowing Outer Torus Ring (#d55889)
  const torusGeom = new THREE.TorusGeometry(6.5, 0.09, 16, 100);
  const torusMat1 = new THREE.MeshStandardMaterial({
    color: 0xd55889,
    roughness: 0.2,
    metalness: 0.8
  });
  const ring1 = new THREE.Mesh(torusGeom, torusMat1);
  ring1.rotation.x = Math.PI / 3;

  const torusMat2 = new THREE.MeshStandardMaterial({
    color: 0xeb6a7c,
    roughness: 0.2,
    metalness: 0.8
  });
  const ring2 = new THREE.Mesh(torusGeom, torusMat2);
  ring2.rotation.y = Math.PI / 3;

  nucleusGroup.add(ring1, ring2);

  // Core Sphere (#ffcd62 Emissive)
  const coreGeom = new THREE.SphereGeometry(1.5, 32, 32);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xffcd62,
    emissive: 0xffcd62,
    emissiveIntensity: 0.5,
    roughness: 0.1
  });
  const coreMesh = new THREE.Mesh(coreGeom, coreMat);
  nucleusGroup.add(coreMesh);

  // Position Nucleus near Hero section
  nucleusGroup.position.set(4, 1, 3);
  nucleusGroup.scale.set(1.1, 1.1, 1.1);
  scene.add(nucleusGroup);

  // 4. Instanced Meshes System using Paleta_1 (#d55889, #eb6a7c, #ff7c6e, #ff9668, #ffcd62)
  const instanceCount = 121; // 11x11 Matrix Grid
  const geom = new THREE.OctahedronGeometry(0.5, 0);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.7
  });
  const instancedMesh = new THREE.InstancedMesh(geom, mat, instanceCount);

  const dummy = new THREE.Object3D();
  const colorHelper = new THREE.Color();
  const paletteHex = [0xd55889, 0xeb6a7c, 0xff7c6e, 0xff9668, 0xffcd62];

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

  // 5. Anime.js Stagger Animations (Paleta_1 Color Wave)
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
  const colRose = new THREE.Color(0xd55889);
  const colCoral = new THREE.Color(0xeb6a7c);
  const colPeach = new THREE.Color(0xff9668);
  const colGold = new THREE.Color(0xffcd62);

  anime({
    targets: proxies,
    r: [
      { value: colRose.r, duration: 3000, easing: 'easeInOutQuad' },
      { value: colCoral.r, duration: 3000, easing: 'easeInOutQuad' },
      { value: colPeach.r, duration: 3000, easing: 'easeInOutQuad' },
      { value: colGold.r, duration: 3000, easing: 'easeInOutQuad' }
    ],
    g: [
      { value: colRose.g, duration: 3000, easing: 'easeInOutQuad' },
      { value: colCoral.g, duration: 3000, easing: 'easeInOutQuad' },
      { value: colPeach.g, duration: 3000, easing: 'easeInOutQuad' },
      { value: colGold.g, duration: 3000, easing: 'easeInOutQuad' }
    ],
    b: [
      { value: colRose.b, duration: 3000, easing: 'easeInOutQuad' },
      { value: colCoral.b, duration: 3000, easing: 'easeInOutQuad' },
      { value: colPeach.b, duration: 3000, easing: 'easeInOutQuad' },
      { value: colGold.b, duration: 3000, easing: 'easeInOutQuad' }
    ],
    delay: anime.stagger(35, { grid: [11, 11], from: 'first' }),
    direction: 'alternate',
    loop: true,
    update: commit3DChanges
  });

  // Mouse & Touch Parallax Effect
  let mouseX = 0;
  let mouseY = 0;

  function updateInputPos(clientX, clientY) {
    mouseX = (clientX / window.innerWidth - 0.5) * 2;
    mouseY = (clientY / window.innerHeight - 0.5) * 2;
  }

  window.addEventListener('pointermove', (e) => {
    updateInputPos(e.clientX, e.clientY);
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0) {
      updateInputPos(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
      updateInputPos(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // Render Loop
  const clock = new THREE.Clock();
  function animateScene() {
    requestAnimationFrame(animateScene);
    const elapsedTime = clock.getElapsedTime();

    // Rotate Nucleus
    nucleusGroup.rotation.x = elapsedTime * 0.2;
    nucleusGroup.rotation.y = elapsedTime * 0.3;

    // Smooth Camera Parallax
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

// Auto-run when DOM ready
document.addEventListener('DOMContentLoaded', initThreeJSSetup);

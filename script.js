document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  /* ==========================================================================
     THEME TOGGLE (LIGHT / DARK)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Retrieve saved theme or use system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else {
    htmlElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  /* ==========================================================================
     NAVBAR & MOBILE MENU
     ========================================================================== */
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelectorAll('.nav-link');

  // Change navbar height and add shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Toggle mobile menu
  menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('menu-open');
  });

  // Close mobile menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('menu-open');
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navbar.classList.contains('menu-open') && !navbar.contains(e.target)) {
      navbar.classList.remove('menu-open');
    }
  });

  /* ==========================================================================
     TYPEWRITER EFFECT (HERO SUBTITLE)
     ========================================================================== */
  const words = [
    "Ingeniera Física",
    "Especialista en Gestión de la Innovación",
    "Líder de Proyectos STEAM",
    "Cofundadora de FabLab UNAL",
    "Apasionada por la Transformación Digital"
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typewriterElement = document.getElementById('typewriter');
  let typingDelay = 100;
  let erasingDelay = 50;
  let newWordDelay = 2000; // delay between words

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = erasingDelay;
    } else {
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingDelay = newWordDelay;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingDelay = 500;
    }

    setTimeout(type, typingDelay);
  }

  // Start Typewriter
  setTimeout(type, 1000);

  /* ==========================================================================
     TIMELINE FILTERING
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active state on buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      timelineItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
          // Brief timeout to let display take effect before opacity transition
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          // Wait for transition before hiding display
          setTimeout(() => {
            item.classList.add('hidden');
          }, 300);
        }
      });
    });
  });

  /* ==========================================================================
     SCROLLSPY (ACTIVE NAV LINKS)
     ========================================================================== */
  const sections = document.querySelectorAll('section');
  
  const scrollSpyOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Trigger when section is in the middle of screen
    threshold: 0
  };

  const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, scrollSpyOptions);

  sections.forEach(section => {
    scrollSpyObserver.observe(section);
  });

  /* ==========================================================================
     SCROLL REVEAL ANIMATIONS
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once revealed
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  /* ==========================================================================
     SKILLS PROGRESS ANIMATION
     ========================================================================== */
  const skillProgressBars = document.querySelectorAll('.skill-progress');
  
  const skillObserverOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.2
  };

  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const targetWidth = progressBar.getAttribute('data-progress');
        progressBar.style.width = targetWidth;
        observer.unobserve(progressBar);
      }
    });
  }, skillObserverOptions);

  skillProgressBars.forEach(bar => {
    skillObserver.observe(bar);
  });

  /* ==========================================================================
     COPY TO CLIPBOARD (REFERENCES)
     ========================================================================== */
  const copyButtons = document.querySelectorAll('.btn-copy');

  copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const textToCopy = button.getAttribute('data-copy');
      const originalContent = button.innerHTML;
      
      try {
        await navigator.clipboard.writeText(textToCopy);
        
        // Show success state
        button.classList.add('copied');
        button.innerHTML = `<i data-lucide="check" class="icon-check"></i> <span>¡Copiado!</span>`;
        lucide.createIcons(); // Re-render check icon
        
        setTimeout(() => {
          button.classList.remove('copied');
          button.innerHTML = originalContent;
          lucide.createIcons();
        }, 2000);
        
      } catch (err) {
        console.error('Error al copiar el texto: ', err);
      }
    });
  });

  /* ==========================================================================
     CONTACT FORM HANDLING & VALIDATION
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const successMessage = document.getElementById('success-message');
  const btnResetForm = document.getElementById('btn-reset-form');
  const submitBtn = document.getElementById('form-submit-btn');

  // Simple Email Validation regex
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Handle Input validation indicators
  const inputs = contactForm.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const parent = input.parentElement;
      if (input.value.trim() !== '') {
        parent.classList.remove('invalid');
      }
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isFormValid = true;

    // Check Name
    const nameInput = document.getElementById('form-name');
    if (nameInput.value.trim() === '') {
      nameInput.parentElement.classList.add('invalid');
      isFormValid = false;
    } else {
      nameInput.parentElement.classList.remove('invalid');
    }

    // Check Email
    const emailInput = document.getElementById('form-email');
    if (!isValidEmail(emailInput.value.trim())) {
      emailInput.parentElement.classList.add('invalid');
      isFormValid = false;
    } else {
      emailInput.parentElement.classList.remove('invalid');
    }

    // Check Message
    const messageInput = document.getElementById('form-message');
    if (messageInput.value.trim() === '') {
      messageInput.parentElement.classList.add('invalid');
      isFormValid = false;
    } else {
      messageInput.parentElement.classList.remove('invalid');
    }

    if (isFormValid) {
      // Show loading state
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Enviando...</span> <i data-lucide="loader-2" class="animate-spin"></i>`;
      lucide.createIcons();

      // Send the request via FormSubmit AJAX endpoint
      fetch("https://formsubmit.co/ajax/sofiarojasmb@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Nombre: nameInput.value.trim(),
          Email: emailInput.value.trim(),
          Mensaje: messageInput.value.trim(),
          _subject: "Nuevo contacto desde tu Hoja de Vida Interactiva",
          _captcha: "false"
        })
      })
      .then(response => response.json())
      .then(data => {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        lucide.createIcons();

        if (data.success === "true" || data.success === true) {
          // Show Success Message panel
          successMessage.classList.add('active');
          // Trigger Canvas Confetti celebration!
          triggerConfetti();
        } else {
          if (data.message && (data.message.toLowerCase().includes('activate') || data.message.toLowerCase().includes('confirm'))) {
            alert("¡Casi listo! FormSubmit necesita verificar tu correo. Por favor, revisa tu bandeja de entrada o carpeta de SPAM en sofiarojasmb@gmail.com y haz clic en el enlace de activación que te enviaron.");
          } else {
            alert("Hubo un error al enviar el mensaje: " + (data.message || "Por favor intenta de nuevo."));
          }
        }
      })
      .catch(error => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        lucide.createIcons();
        console.error('Error:', error);
        alert("Hubo un problema de conexión. Por favor intenta de nuevo.");
      });
    }
  });

  btnResetForm.addEventListener('click', () => {
    // Hide success panel
    successMessage.classList.remove('active');
    // Clear form
    contactForm.reset();
  });

  // Confetti function
  function triggerConfetti() {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#6366f1', '#3b82f6', '#14b8a6']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#6366f1', '#3b82f6', '#14b8a6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }

  /* ==========================================================================
     BACK TO TOP BUTTON
     ========================================================================== */
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.style.opacity = '1';
      backToTopBtn.style.pointerEvents = 'all';
    } else {
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.pointerEvents = 'none';
      /* ==========================================================================
     MOUSE TRACKING INTERACTION & CANVAS PARTICLES
     ========================================================================== */
  const canvas = document.getElementById('interaction-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const cursorGlow = document.getElementById('cursor-glow');

  let particles = [];
  const mouse = {
    x: null,
    y: null,
    active: false
  };

  // Background glow coordinates (Lerped for smooth movement)
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  
  let isGlowActive = false;
  let isMovingGlow = false;

  function updateGlowPosition() {
    if (!isMovingGlow) return;
    const ease = 0.08;
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;

    if (cursorGlow) {
      cursorGlow.style.transform = `translate(calc(${currentX}px - 50%), calc(${currentY}px - 50%))`;
    }

    const dist = Math.hypot(targetX - currentX, targetY - currentY);
    if (dist > 0.1 && isGlowActive) {
      requestAnimationFrame(updateGlowPosition);
    } else {
      isMovingGlow = false;
    }
  }

  // Handle Canvas Resizing with high DPI support
  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  }
  if (canvas) {
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
  }

  // Pure shades of Blue for mouse trail sparkles and click bursts
  const colors = [
    '#1ca7ec', // Vibrant Ocean Blue
    '#38b6ff', // Electric Sky Blue
    '#1e3096', // Royal Sapphire Blue
    '#2563eb', // Pure Cobalt Blue
    '#3b82f6', // Bright Royal Blue
    '#60a5fa'  // Light Sky Blue
  ];

  class Particle {
    constructor(x, y, vx, vy, color) {
      this.x = x;
      this.y = y;
      this.vx = vx * 0.4 + (Math.random() - 0.5) * 1.5;
      this.vy = vy * 0.4 + (Math.random() - 0.5) * 1.5;
      this.size = Math.random() * 3 + 2;
      this.originalSize = this.size;
      this.color = color;
      this.life = 1.0;
      this.decay = Math.random() * 0.015 + 0.01;
      this.angle = Math.random() * Math.PI * 2;
      this.spin = (Math.random() - 0.5) * 0.05;
    }

    update() {
      if (mouse.active) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 180) {
          const force = (180 - dist) * 0.0003;
          this.vx += dx * force;
          this.vy += dy * force;
        }
      }

      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.96;
      this.vy *= 0.96;
      this.angle += this.spin;
      this.life -= this.decay;
      this.size = this.originalSize * Math.max(0, this.life);
    }

    draw() {
      if (!ctx) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Animation Loop for 2D particles
  function animate() {
    if (canvas && ctx) {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        if (p.life <= 0) {
          particles.splice(i, 1);
        } else {
          p.draw();
        }
      }

      if (particles.length > 0) {
        ctx.save();
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            if (dist < 90) {
              const alpha = (1 - dist / 90) * 0.22 * Math.min(p1.life, p2.life);
              ctx.strokeStyle = p1.color;
              ctx.globalAlpha = alpha;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
        ctx.restore();
      }
    }

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // Trigger burst of particles (Click / Tap)
  function createBurst(x, y, count = 24) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      particles.push(new Particle(x, y, vx, vy, randomColor));
    }
  }

  // Mouse / Pointer Event Listeners
  document.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse') {
      if (cursorGlow && !isGlowActive) {
        cursorGlow.style.opacity = '1';
        isGlowActive = true;
      }

      targetX = e.clientX;
      targetY = e.clientY;

      if (!isMovingGlow) {
        currentX = targetX;
        currentY = targetY;
        isMovingGlow = true;
        updateGlowPosition();
      }

      const px = mouse.x ?? e.clientX;
      const py = mouse.y ?? e.clientY;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;

      const speedX = e.clientX - px;
      const speedY = e.clientY - py;
      const speed = Math.hypot(speedX, speedY);

      const numToSpawn = Math.min(3, Math.floor(speed / 6) + 1);
      for (let i = 0; i < numToSpawn; i++) {
        const offsetX = (Math.random() - 0.5) * 6;
        const offsetY = (Math.random() - 0.5) * 6;
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(e.clientX + offsetX, e.clientY + offsetY, speedX * 0.12, speedY * 0.12, randomColor));
      }
    } else {
      if (cursorGlow) cursorGlow.style.opacity = '0';
      isGlowActive = false;
      mouse.active = false;
    }
  });

  document.addEventListener('click', (e) => {
    createBurst(e.clientX, e.clientY, 24);
  });

  document.addEventListener('pointerleave', () => {
    if (cursorGlow) cursorGlow.style.opacity = '0';
    isGlowActive = false;
    isMovingGlow = false;
    mouse.active = false;
  });

  document.addEventListener('mouseleave', () => {
    if (cursorGlow) cursorGlow.style.opacity = '0';
    isGlowActive = false;
    isMovingGlow = false;
    mouse.active = false;
  });
    }
  });

  // Spotlight card effects
  const cards = document.querySelectorAll('.card, .contact-card');
  if (cards.length > 0) {
    cards.forEach(card => {
      card.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'mouse') {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        }
      });
    });
  }

  /* ==========================================================================
     THREE.JS + ANIME.JS 3D ADAPTER & INTERACTIVE GRAPHICS ENGINE
     ========================================================================== */
  function initThreeAnimeJS() {
    const canvas = document.getElementById('three-bg-canvas');
    if (!canvas || typeof THREE === 'undefined' || typeof anime === 'undefined') return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 28); // Positioned close to hero section

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x797ef6, 2.5, 100); // Paleta_2 Electric Indigo
    pointLight1.position.set(20, 20, 20);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x4adee0, 2.5, 100); // Paleta_2 Neon Aqua
    pointLight2.position.set(-20, -20, 15);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x1ca7ec, 2.0, 80); // Paleta_2 Ocean Blue
    pointLight3.position.set(0, 15, -10);
    scene.add(pointLight3);

    // 3. Central 3D Atomic Nucleus & Orbits (Inspired by Sofía's Favicon & Paleta_2)
    const atomicGroup = new THREE.Group();

    // Outer Hexagon
    const hexShape = new THREE.Shape();
    const hexRadius = 9;
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = hexRadius * Math.cos(angle);
      const y = hexRadius * Math.sin(angle);
      if (i === 0) hexShape.moveTo(x, y);
      else hexShape.lineTo(x, y);
    }
    hexShape.closePath();

    const hexPoints = hexShape.getPoints();
    const hexGeometry = new THREE.BufferGeometry().setFromPoints(hexPoints);
    const hexMaterial = new THREE.LineBasicMaterial({ color: 0x1ca7ec, linewidth: 2 });
    const hexLine = new THREE.LineLoop(hexGeometry, hexMaterial);
    atomicGroup.add(hexLine);

    // 3 Atomic Orbits with Paleta_2 Colors
    const orbitGeom = new THREE.TorusGeometry(6, 0.08, 16, 100);
    const orbitMat1 = new THREE.MeshStandardMaterial({ color: 0x797ef6, roughness: 0.2, metalness: 0.8 }); // Electric Indigo
    const orbitMat2 = new THREE.MeshStandardMaterial({ color: 0x1e3096, roughness: 0.2, metalness: 0.8 }); // Sapphire Blue
    const orbitMat3 = new THREE.MeshStandardMaterial({ color: 0x4adee0, roughness: 0.2, metalness: 0.8 }); // Neon Aqua

    const orbit1 = new THREE.Mesh(orbitGeom, orbitMat1);
    orbit1.rotation.x = Math.PI / 3;
    orbit1.rotation.y = Math.PI / 6;

    const orbit2 = new THREE.Mesh(orbitGeom, orbitMat2);
    orbit2.rotation.x = -Math.PI / 3;
    orbit2.rotation.y = -Math.PI / 6;

    const orbit3 = new THREE.Mesh(orbitGeom, orbitMat3);
    orbit3.rotation.y = Math.PI / 2;

    atomicGroup.add(orbit1, orbit2, orbit3);

    // Central Nucleus
    const nucleusGeom = new THREE.SphereGeometry(1.6, 32, 32);
    const nucleusMat = new THREE.MeshStandardMaterial({
      color: 0x4adee0,
      emissive: 0x4adee0,
      emissiveIntensity: 0.6,
      roughness: 0.1
    });
    const nucleus = new THREE.Mesh(nucleusGeom, nucleusMat);
    atomicGroup.add(nucleus);

    // 3 Floating Electrons
    const electronGeom = new THREE.SphereGeometry(0.45, 16, 16);
    const electronMat = new THREE.MeshStandardMaterial({ color: 0x7fd3ed, emissive: 0x7fd3ed, emissiveIntensity: 0.8 });

    const electron1 = new THREE.Mesh(electronGeom, electronMat);
    const electron2 = new THREE.Mesh(electronGeom, electronMat);
    const electron3 = new THREE.Mesh(electronGeom, electronMat);
    atomicGroup.add(electron1, electron2, electron3);

    // Prominent placement right at the top (Hero Section)
    atomicGroup.position.set(3, 0, 4);
    atomicGroup.scale.set(1.2, 1.2, 1.2);
    scene.add(atomicGroup);

    // 4. Multi-Layer Instanced & Batched Meshes (Anime.js Instanced Mesh Adapter System with Paleta_2)
    const primaryCount = 144; // 12x12 Grid Matrix
    const secondaryCount = 64; // 8x8 Background Orbit Matrix

    // Geometries & Materials
    const primaryGeom = new THREE.OctahedronGeometry(0.55, 0);
    const primaryMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.25,
      metalness: 0.8
    });
    const instancedMeshPrimary = new THREE.InstancedMesh(primaryGeom, primaryMat, primaryCount);

    const secondaryGeom = new THREE.TorusGeometry(0.4, 0.12, 12, 24);
    const secondaryMat = new THREE.MeshStandardMaterial({
      color: 0x1ca7ec,
      roughness: 0.2,
      metalness: 0.9,
      wireframe: true
    });
    const instancedMeshSecondary = new THREE.InstancedMesh(secondaryGeom, secondaryMat, secondaryCount);

    const dummy = new THREE.Object3D();
    const colorHelper = new THREE.Color();

    // Monochromatic Gama de Azules Definition: #0c1954, #1e3096, #1ca7ec, #38b6ff, #7fd3ed
    const paletteHex = [0x0c1954, 0x1e3096, 0x1ca7ec, 0x38b6ff, 0x7fd3ed];

    // Build Per-Instance Proxies Array (getInstances pattern)
    const primaryProxies = [];
    const colsP = 12;
    const rowsP = 12;

    for (let i = 0; i < primaryCount; i++) {
      const ix = i % colsP;
      const iy = Math.floor(i / colsP);

      const baseX = (ix - colsP / 2 + 0.5) * 4.2;
      const baseY = (iy - rowsP / 2 + 0.5) * 3.6;
      const baseZ = (Math.random() - 0.5) * 8 + 2; // Brought forward for hero visibility

      const baseScale = 0.6 + Math.random() * 0.5;
      const initialHex = paletteHex[i % paletteHex.length];
      const baseColor = new THREE.Color(initialHex);

      const proxy = {
        id: i,
        gridX: ix,
        gridY: iy,
        baseX: baseX, baseY: baseY, baseZ: baseZ,
        x: baseX, y: baseY, z: baseZ,
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        rz: 0,
        scale: baseScale,
        baseScale: baseScale,
        r: baseColor.r,
        g: baseColor.g,
        b: baseColor.b
      };

      primaryProxies.push(proxy);

      // Set initial state
      dummy.position.set(proxy.x, proxy.y, proxy.z);
      dummy.rotation.set(proxy.rx, proxy.ry, proxy.rz);
      dummy.scale.setScalar(proxy.scale);
      dummy.updateMatrix();
      instancedMeshPrimary.setMatrixAt(i, dummy.matrix);
      instancedMeshPrimary.setColorAt(i, baseColor);
    }
    instancedMeshPrimary.instanceMatrix.needsUpdate = true;
    if (instancedMeshPrimary.instanceColor) instancedMeshPrimary.instanceColor.needsUpdate = true;
    scene.add(instancedMeshPrimary);

    // Build Secondary Batched Background Proxies
    const secondaryProxies = [];
    const colsS = 8;
    const rowsS = 8;

    for (let j = 0; j < secondaryCount; j++) {
      const sx = (j % colsS - colsS / 2 + 0.5) * 7;
      const sy = (Math.floor(j / colsS) - rowsS / 2 + 0.5) * 6;
      const sz = (Math.random() - 0.5) * 16 - 18;
      const sScale = 0.5 + Math.random() * 0.4;

      const proxyS = {
        id: j,
        baseX: sx, baseY: sy, baseZ: sz,
        x: sx, y: sy, z: sz,
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        scale: sScale,
        baseScale: sScale
      };
      secondaryProxies.push(proxyS);

      dummy.position.set(proxyS.x, proxyS.y, proxyS.z);
      dummy.rotation.set(proxyS.rx, proxyS.ry, 0);
      dummy.scale.setScalar(proxyS.scale);
      dummy.updateMatrix();
      instancedMeshSecondary.setMatrixAt(j, dummy.matrix);
    }
    instancedMeshSecondary.instanceMatrix.needsUpdate = true;
    scene.add(instancedMeshSecondary);

    // Universal Commit / Flush function for Instanced Mesh matrices & colors
    function commitInstancedMeshChanges() {
      // Primary InstancedMesh
      for (let i = 0; i < primaryCount; i++) {
        const p = primaryProxies[i];
        dummy.position.set(p.x, p.y, p.z);
        dummy.rotation.set(p.rx, p.ry, p.rz);
        dummy.scale.setScalar(p.scale);
        dummy.updateMatrix();
        instancedMeshPrimary.setMatrixAt(i, dummy.matrix);

        colorHelper.setRGB(p.r, p.g, p.b);
        instancedMeshPrimary.setColorAt(i, colorHelper);
      }
      instancedMeshPrimary.instanceMatrix.needsUpdate = true;
      if (instancedMeshPrimary.instanceColor) instancedMeshPrimary.instanceColor.needsUpdate = true;

      // Secondary InstancedMesh
      for (let j = 0; j < secondaryCount; j++) {
        const s = secondaryProxies[j];
        dummy.position.set(s.x, s.y, s.z);
        dummy.rotation.set(s.rx, s.ry, 0);
        dummy.scale.setScalar(s.scale);
        dummy.updateMatrix();
        instancedMeshSecondary.setMatrixAt(j, dummy.matrix);
      }
      instancedMeshSecondary.instanceMatrix.needsUpdate = true;
    }

    // 5. Anime.js Instanced Adapter Stagger Animations with Gama de Azules
    // 5a. Staggered Wave Motion across 12x12 Grid Matrix
    anime({
      targets: primaryProxies,
      y: function(target, index) {
        return target.baseY + Math.sin(index * 0.35) * 2.2;
      },
      z: function(target, index) {
        return target.baseZ + Math.cos(index * 0.25) * 3.5;
      },
      rx: function() { return Math.PI * 2; },
      ry: function() { return Math.PI * 2; },
      delay: anime.stagger(25, { grid: [12, 12], from: 'center' }),
      duration: 3800,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
      update: commitInstancedMeshChanges
    });

    // 5b. Color Morphing Stagger Wave strictly within Gama de Azules (#1ca7ec, #38b6ff, #1e3096, #0c1954)
    const colorOcean = new THREE.Color(0x1ca7ec);
    const colorSky = new THREE.Color(0x38b6ff);
    const colorSapphire = new THREE.Color(0x1e3096);
    const colorNavy = new THREE.Color(0x0c1954);

    anime({
      targets: primaryProxies,
      r: [
        { value: colorOcean.r, duration: 2500, easing: 'easeInOutQuad' },
        { value: colorSky.r, duration: 2500, easing: 'easeInOutQuad' },
        { value: colorSapphire.r, duration: 2500, easing: 'easeInOutQuad' },
        { value: colorNavy.r, duration: 2500, easing: 'easeInOutQuad' }
      ],
      g: [
        { value: colorOcean.g, duration: 2500, easing: 'easeInOutQuad' },
        { value: colorSky.g, duration: 2500, easing: 'easeInOutQuad' },
        { value: colorSapphire.g, duration: 2500, easing: 'easeInOutQuad' },
        { value: colorNavy.g, duration: 2500, easing: 'easeInOutQuad' }
      ],
      b: [
        { value: colorOcean.b, duration: 2500, easing: 'easeInOutQuad' },
        { value: colorSky.b, duration: 2500, easing: 'easeInOutQuad' },
        { value: colorSapphire.b, duration: 2500, easing: 'easeInOutQuad' },
        { value: colorNavy.b, duration: 2500, easing: 'easeInOutQuad' }
      ],
      delay: anime.stagger(30, { grid: [12, 12], from: 'first' }),
      direction: 'alternate',
      loop: true,
      update: commitInstancedMeshChanges
    });

    // 5c. Secondary Background Orbit Rotation
    anime({
      targets: secondaryProxies,
      rx: function() { return Math.PI * 4; },
      ry: function() { return Math.PI * 4; },
      delay: anime.stagger(40, { from: 'center' }),
      duration: 18000,
      loop: true,
      easing: 'linear',
      update: commitInstancedMeshChanges
    });

    // Orbit Rotation Loop via Anime.js
    anime({
      targets: [orbit1.rotation, orbit2.rotation, orbit3.rotation],
      z: Math.PI * 2,
      duration: 12000,
      loop: true,
      easing: 'linear'
    });

    anime({
      targets: atomicGroup.rotation,
      y: Math.PI * 2,
      duration: 25000,
      loop: true,
      easing: 'linear'
    });

    // 6. Interactive Mouse Motion & Proximity Displace
    let targetMouseX = 0;
    let targetMouseY = 0;

    window.addEventListener('mousemove', (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;

      // Mouse Proximity calculation for Instanced Mesh Proxies
      const mouse3D = new THREE.Vector3(targetMouseX * 18, -targetMouseY * 12, 0);

      primaryProxies.forEach((p) => {
        const dx = p.x - mouse3D.x;
        const dy = p.y - mouse3D.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 6) {
          const factor = (1 - dist / 6);
          p.scale = p.baseScale + factor * 1.2;
          p.rz = factor * Math.PI;
        } else {
          p.scale = p.baseScale;
          p.rz = 0;
        }
      });
      commitInstancedMeshChanges();

      // Animate Camera & Group subtly with Anime.js
      anime({
        targets: atomicGroup.rotation,
        x: targetMouseY * 0.3,
        y: targetMouseX * 0.5,
        duration: 1200,
        easing: 'easeOutCubic'
      });

      anime({
        targets: instancedMeshPrimary.rotation,
        x: -targetMouseY * 0.15,
        y: targetMouseX * 0.15,
        duration: 1500,
        easing: 'easeOutQuad'
      });
    });

    // 7. Interactive Click Wave Shockwave (Grid Radial Stagger)
    window.addEventListener('click', () => {
      anime({
        targets: primaryProxies,
        scale: [
          { value: function(target) { return target.baseScale * 2.5; }, duration: 400, easing: 'easeOutQuad' },
          { value: function(target) { return target.baseScale; }, duration: 900, easing: 'easeOutElastic(1, .5)' }
        ],
        z: [
          { value: function(target) { return target.baseZ + 9; }, duration: 400, easing: 'easeOutQuad' },
          { value: function(target) { return target.baseZ; }, duration: 900, easing: 'easeOutCubic' }
        ],
        delay: anime.stagger(20, { grid: [12, 12], from: 'center' }),
        update: commitInstancedMeshChanges
      });

      // Pulse Nucleus
      anime({
        targets: nucleus.scale,
        x: [1, 1.8, 1],
        y: [1, 1.8, 1],
        z: [1, 1.8, 1],
        duration: 800,
        easing: 'easeOutElastic(1, .5)'
      });
    });

    // 8. Scroll-Triggered Instanced Mesh Morphing
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollPos / (docHeight || 1);

      // Rotate and adjust camera position on scroll
      camera.position.z = 35 + scrollPercent * 10;
      camera.position.y = -scrollPercent * 8;
      
      // Move atomic group & morph instanced meshes depending on scroll section
      const activeSection = Array.from(sections).find(sec => {
        const rect = sec.getBoundingClientRect();
        return rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5;
      });

      if (activeSection) {
        const secId = activeSection.getAttribute('id');
        if (secId === 'hero') {
          anime({ targets: atomicGroup.position, x: 3, y: 0, z: 4, duration: 1000, easing: 'easeOutCubic' });
          anime({ targets: atomicGroup.scale, x: 1.2, y: 1.2, z: 1.2, duration: 1000, easing: 'easeOutCubic' });
          anime({
            targets: primaryProxies,
            x: function(target) { return target.baseX; },
            y: function(target) { return target.baseY; },
            z: function(target) { return target.baseZ; },
            delay: anime.stagger(10, { grid: [12, 12], from: 'center' }),
            duration: 1000,
            easing: 'easeOutCubic',
            update: commitInstancedMeshChanges
          });
        } else if (secId === 'about') {
          anime({ targets: atomicGroup.position, x: -14, y: 0, z: -5, duration: 1000, easing: 'easeOutCubic' });
          anime({ targets: atomicGroup.scale, x: 0.8, y: 0.8, z: 0.8, duration: 1000, easing: 'easeOutCubic' });
          // Morph primary proxies into orbital ring formation
          anime({
            targets: primaryProxies,
            x: function(target, index) {
              const angle = (index / primaryCount) * Math.PI * 4;
              return Math.cos(angle) * (14 + Math.sin(index) * 2);
            },
            y: function(target, index) {
              const angle = (index / primaryCount) * Math.PI * 4;
              return Math.sin(angle) * (14 + Math.cos(index) * 2);
            },
            delay: anime.stagger(12, { from: 'center' }),
            duration: 1200,
            easing: 'easeOutCubic',
            update: commitInstancedMeshChanges
          });
        } else if (secId === 'experience') {
          anime({ targets: atomicGroup.position, x: 14, y: -2, z: -8, duration: 1000, easing: 'easeOutCubic' });
          anime({ targets: atomicGroup.scale, x: 0.7, y: 0.7, z: 0.7, duration: 1000, easing: 'easeOutCubic' });
          // Morph primary proxies into dual timeline columns
          anime({
            targets: primaryProxies,
            x: function(target, index) {
              return (index % 2 === 0 ? -16 : 16) + (Math.random() - 0.5) * 2;
            },
            y: function(target, index) {
              return (Math.floor(index / 2) - primaryCount / 4) * 0.5;
            },
            delay: anime.stagger(10, { from: 'first' }),
            duration: 1200,
            easing: 'easeOutCubic',
            update: commitInstancedMeshChanges
          });
        } else if (secId === 'skills') {
          anime({ targets: atomicGroup.position, x: 0, y: 4, z: -2, duration: 1000, easing: 'easeOutCubic' });
          anime({ targets: atomicGroup.scale, x: 0.9, y: 0.9, z: 0.9, duration: 1000, easing: 'easeOutCubic' });
          // Reset to grid formation
          anime({
            targets: primaryProxies,
            x: function(target) { return target.baseX; },
            y: function(target) { return target.baseY; },
            z: function(target) { return target.baseZ; },
            delay: anime.stagger(15, { grid: [12, 12], from: 'center' }),
            duration: 1200,
            easing: 'easeOutCubic',
            update: commitInstancedMeshChanges
          });
        } else if (secId === 'contact') {
          anime({ targets: atomicGroup.position, x: 0, y: -4, z: -5, duration: 1000, easing: 'easeOutCubic' });
          anime({ targets: atomicGroup.scale, x: 0.75, y: 0.75, z: 0.75, duration: 1000, easing: 'easeOutCubic' });
        }
      }
    });

    // 9. Anime.js 3D Spring Tilt Effects on Portfolio Cards
    const interactiveCards = document.querySelectorAll('.card, .experience-card, .skill-card, .education-card, .ref-card');
    interactiveCards.forEach(card => {
      card.style.transformStyle = 'preserve-3d';
      
      card.addEventListener('mouseenter', () => {
        anime.remove(card);
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -14;
        const rotateY = ((x / rect.width) - 0.5) * 14;

        anime({
          targets: card,
          rotateX: rotateX,
          rotateY: rotateY,
          scale: 1.025,
          duration: 200,
          easing: 'easeOutQuad'
        });
      });

      card.addEventListener('mouseleave', () => {
        anime({
          targets: card,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 800,
          easing: 'easeOutElastic(1, .5)'
        });
      });
    });

    // 10. Animation Render Loop
    let clock = new THREE.Clock();
    function animateScene() {
      requestAnimationFrame(animateScene);

      const elapsedTime = clock.getElapsedTime();

      // Electron orbits
      electron1.position.x = Math.cos(elapsedTime * 2) * 6;
      electron1.position.y = Math.sin(elapsedTime * 2) * 6;

      electron2.position.x = Math.cos(elapsedTime * 2.5 + 2) * 6;
      electron2.position.z = Math.sin(elapsedTime * 2.5 + 2) * 6;

      electron3.position.y = Math.cos(elapsedTime * 1.8 + 4) * 6;
      electron3.position.z = Math.sin(elapsedTime * 1.8 + 4) * 6;

      renderer.render(scene, camera);
    }

    animateScene();

    // Window Resize Handler
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  // Initialize Three.js + Anime.js system
  initThreeAnimeJS();
});

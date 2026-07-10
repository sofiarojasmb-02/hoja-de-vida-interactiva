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
    }
  });

  /* ==========================================================================
     MOUSE TRACKING INTERACTION & CANVAS PARTICLES (Lusion.co Style)
     ========================================================================== */
  const canvas = document.getElementById('interaction-canvas');
  const ctx = canvas.getContext('2d');
  const cursorGlow = document.getElementById('cursor-glow');
  const waterLens = document.querySelector('.cursor-water-lens');
  const displacementMap = document.querySelector('#crystal-distort feDisplacementMap');

  let particles = [];
  const mouse = {
    x: null,
    y: null,
    active: false
  };

  // Background glow and water lens coordinates (Lerped for smooth dragging/fluid inertia)
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let lensX = 0;
  let lensY = 0;
  
  // SVG Distortion scale tracking
  let currentScale = 25;
  let targetScale = 25;
  const BASELINE_SCALE = 22; // default idle ripple distortion scale
  
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
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Vibrant color palette matching both themes (neon tech colors)
  const colors = [
    '#6366f1', // Indigo
    '#3b82f6', // Royal Blue
    '#14b8a6', // Teal
    '#ff007f', // Neon Pink
    '#ffd700', // Gold
    '#00f5ff'  // Cyan
  ];

  class Particle {
    constructor(x, y, vx, vy, color) {
      this.x = x;
      this.y = y;
      // Physics: add slight random spread to the velocity
      this.vx = vx * 0.4 + (Math.random() - 0.5) * 1.5;
      this.vy = vy * 0.4 + (Math.random() - 0.5) * 1.5;
      this.size = Math.random() * 3 + 2; // radius
      this.originalSize = this.size;
      this.color = color;
      this.life = 1.0;
      this.decay = Math.random() * 0.015 + 0.01; // Fade speed
      this.angle = Math.random() * Math.PI * 2;
      this.spin = (Math.random() - 0.5) * 0.05;
    }

    update() {
      // Swirl / Attraction effect to cursor (Lusion style)
      if (mouse.active) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 180) {
          // Gentle pull toward mouse
          const force = (180 - dist) * 0.0003;
          this.vx += dx * force;
          this.vy += dy * force;
        }
      }

      this.x += this.vx;
      this.y += this.vy;

      // Friction / Drag
      this.vx *= 0.96;
      this.vy *= 0.96;

      // Floating drift (slowly upwards)
      this.vy -= 0.06;

      // Spin rotation
      this.angle += this.spin;

      // Shrink & Fade
      this.life -= this.decay;
      this.size = Math.max(0.1, this.originalSize * this.life);
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.life;
      ctx.fillStyle = this.color;
      
      // Neon Glow Effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;

      // Twinkling Star/Sparkle shape vs Circle
      if (this.originalSize > 3.5 && Math.random() > 0.4) {
        // Draw 4-pointed cross star
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(0, -this.size * 2.2);
          ctx.lineTo(this.size * 0.3, -this.size * 0.3);
          ctx.rotate(Math.PI / 2);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        // Draw standard round glowing particle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // 1. Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      if (p.life <= 0) {
        particles.splice(i, 1);
      } else {
        p.draw();
      }
    }

    // Connect close particles (Mesh constellation effect)
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

    // 2. Smoothly update Water/Crystal Lens Position (Lerp with slow dragging speed for liquid sensation)
    if (mouse.active) {
      const lensEase = 0.055; // Slower ease to create a heavy liquid/drag lag
      lensX += (targetX - lensX) * lensEase;
      lensY += (targetY - lensY) * lensEase;
      if (waterLens) {
        waterLens.style.transform = `translate(calc(${lensX}px - 50%), calc(${lensY}px - 50%))`;
      }
    }

    // 3. Smoothly lerp the displacement scale distortion based on pointer speed
    currentScale += (targetScale - currentScale) * 0.08;
    if (displacementMap) {
      displacementMap.setAttribute('scale', currentScale);
    }
    
    // Slow decay of scale distortion back to baseline when mouse slows down
    if (targetScale > BASELINE_SCALE) {
      targetScale -= 0.3;
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
      // Show spotlight glow and water lens
      if (!isGlowActive) {
        cursorGlow.style.opacity = '1';
        isGlowActive = true;
      }
      if (waterLens) {
        waterLens.classList.add('active');
      }

      targetX = e.clientX;
      targetY = e.clientY;

      if (!isMovingGlow) {
        currentX = targetX;
        currentY = targetY;
        // Initialize water lens coords to prevent sudden jump on entry
        if (!mouse.active) {
          lensX = targetX;
          lensY = targetY;
        }
        isMovingGlow = true;
        updateGlowPosition();
      }

      // Add particles for trail
      const px = mouse.x ?? e.clientX;
      const py = mouse.y ?? e.clientY;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;

      // Speed is the distance between previous and current pointer coordinate
      const speedX = e.clientX - px;
      const speedY = e.clientY - py;
      const speed = Math.hypot(speedX, speedY);

      // Dynamically increase water distortion scale based on movement speed
      // More speed = larger displacement wave!
      targetScale = BASELINE_SCALE + Math.min(45, speed * 1.1);

      // Spawn particles proportional to mouse speed
      const numToSpawn = Math.min(3, Math.floor(speed / 6) + 1);
      for (let i = 0; i < numToSpawn; i++) {
        const offsetX = (Math.random() - 0.5) * 6;
        const offsetY = (Math.random() - 0.5) * 6;
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(e.clientX + offsetX, e.clientY + offsetY, speedX * 0.12, speedY * 0.12, randomColor));
      }
    } else {
      cursorGlow.style.opacity = '0';
      isGlowActive = false;
      mouse.active = false;
      if (waterLens) waterLens.classList.remove('active');
    }
  });

  document.addEventListener('click', (e) => {
    // Generate particles
    createBurst(e.clientX, e.clientY, 24);
    
    // Create a temporary water ripple shockwave: spikes the displacement map distortion
    targetScale = 90;
  });

  document.addEventListener('pointerleave', () => {
    cursorGlow.style.opacity = '0';
    isGlowActive = false;
    isMovingGlow = false;
    mouse.active = false;
    if (waterLens) waterLens.classList.remove('active');
  });

  document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
    isGlowActive = false;
    isMovingGlow = false;
    mouse.active = false;
    if (waterLens) waterLens.classList.remove('active');
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
});

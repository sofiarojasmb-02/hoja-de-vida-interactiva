/* ==========================================================================
   SCRIPT2.JS - Interactive Logic for Portfolio Option 2
   Using Paleta de colores_1 (#d55889, #eb6a7c, #ff7c6e, #ff9668, #ffcd62)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Typewriter Effect for Hero Subtitle
  const typewriterElement = document.getElementById('typewriter');
  if (typewriterElement) {
    const phrases = [
      'Ingeniera Física & Creadora WEB',
      'Especialista en Gestión de la Innovación',
      'Desarrolladora de Apps WEB & AR 3D',
      'Líder de Proyectos FabLab UNAL'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function typeEffect() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
      } else {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 90;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 2200; // Pause at full text
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500;
      }

      setTimeout(typeEffect, typingSpeed);
    }
    typeEffect();
  }

  // 3. Theme Toggle (Dark / Light)
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem('theme-v2') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme-v2', newTheme);
    });
  }

  // 4. Mobile Navigation Menu Toggle
  const menuToggleBtn = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggleBtn && navMenu) {
    menuToggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // 5. Portfolio Filtering System
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || filterValue === category) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // 6. Interactive Lightbox Modal for Projects
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalImg = document.getElementById('modal-img');
  const modalDesc = document.getElementById('modal-desc');

  document.querySelectorAll('.btn-preview').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = btn.getAttribute('data-title');
      const img = btn.getAttribute('data-img');
      const desc = btn.getAttribute('data-desc');

      if (modalTitle) modalTitle.textContent = title;
      if (modalImg) modalImg.src = img;
      if (modalDesc) modalDesc.textContent = desc;

      if (modal) modal.classList.add('active');
    });
  });

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  // 7. Contact Form Confetti Submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (typeof confetti !== 'undefined') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d55889', '#eb6a7c', '#ff7c6e', '#ffcd62']
        });
      }
      alert('¡Gracias por tu mensaje! Sofía se pondrá en contacto contigo pronto.');
      contactForm.reset();
    });
  }

  // 8. 2D Interactive Canvas Particles (Paleta de colores_1)
  const canvas = document.getElementById('interaction-canvas-v2');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const cursorGlow = document.getElementById('cursor-glow-v2');

  let particles = [];
  const mouse = { x: null, y: null, active: false };

  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
  let isGlowActive = false, isMovingGlow = false;

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

  // Paleta_1 Sparkle Colors: #d55889, #eb6a7c, #ff7c6e, #ff9668, #ffcd62
  const sparkleColors = ['#d55889', '#eb6a7c', '#ff7c6e', '#ff9668', '#ffcd62'];

  class Particle {
    constructor(x, y, vx, vy, color) {
      this.x = x;
      this.y = y;
      this.vx = vx * 0.4 + (Math.random() - 0.5) * 1.5;
      this.vy = vy * 0.4 + (Math.random() - 0.5) * 1.5;
      this.size = Math.random() * 3 + 2;
      this.color = color;
      this.life = 1.0;
      this.decay = Math.random() * 0.015 + 0.01;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.96;
      this.vy *= 0.96;
      this.life -= this.decay;
    }

    draw() {
      if (!ctx) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.1, this.size * this.life), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function animateParticles() {
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
    }
    requestAnimationFrame(animateParticles);
  }
  requestAnimationFrame(animateParticles);

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
        const randomColor = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
        particles.push(new Particle(e.clientX, e.clientY, speedX * 0.12, speedY * 0.12, randomColor));
      }
    }
  });
});

// Helper function to switch main project image when clicking mini thumbnails
function changeProjectImg(thumbElem, imgUrl) {
  const card = thumbElem.closest('.project-card');
  if (card) {
    const mainImg = card.querySelector('.project-img');
    const previewBtn = card.querySelector('.btn-preview');
    if (mainImg) mainImg.src = imgUrl;
    if (previewBtn) previewBtn.setAttribute('data-img', imgUrl);

    card.querySelectorAll('.thumb-mini').forEach(t => t.classList.remove('active'));
    thumbElem.classList.add('active');
  }
}

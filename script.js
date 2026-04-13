// ── PRELOADER ──
  function dismissPreloader() {
    document.getElementById('preloader').classList.add('hidden');
  }
  setTimeout(dismissPreloader, 1500);

  // ── MOBILE MENU ──
  function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('open');
  }
  function closeMobileMenu() {
    document.getElementById('mobileMenu').classList.remove('open');
  }

  // ── PARTICLE CANVAS ──
  (function() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 70;
    const MAX_DIST = 120;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function random(min, max) { return Math.random() * (max - min) + min; }

    function createParticle() {
      return {
        x: random(0, canvas.width),
        y: random(0, canvas.height),
        vx: random(-0.4, 0.4),
        vy: random(-0.4, 0.4),
        r: random(1.5, 3),
        alpha: random(0.3, 0.7)
      };
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 255, ${p.alpha * 0.6})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const opacity = (1 - dist / MAX_DIST) * 0.25;
            const grad = ctx.createLinearGradient(p.x, p.y, q.x, q.y);
            grad.addColorStop(0, `rgba(0,255,255,${opacity})`);
            grad.addColorStop(1, `rgba(153,51,255,${opacity})`);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  })();

  // ── SCROLL REVEAL ──
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));

  // ── CONTACT FORM (Formspree) ──
  document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const msg = document.getElementById('formMsg');
    btn.disabled = true;
    btn.textContent = 'Sending...';
    msg.className = 'form-msg';
    msg.style.display = 'none';

    try {
      const res = await fetch(this.action, {
        method: 'POST',
        body: new FormData(this),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        msg.className = 'form-msg success';
        msg.textContent = '✅ Message sent! I\'ll get back to you soon.';
        this.reset();
      } else {
        throw new Error('Server error');
      }
    } catch {
      msg.className = 'form-msg error';
      msg.textContent = '❌ Failed to send. Please email me directly at saadkhanmrd33@gmail.com';
    }
    msg.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Send Message ✉️';
  });
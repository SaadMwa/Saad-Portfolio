// ── PRELOADER ──
function dismissPreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) preloader.classList.add('hidden');
}
setTimeout(dismissPreloader, 1200);

// ── MOBILE MENU ──
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('open');
}
function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.remove('open');
}

// ── PARTICLE CANVAS ──
(function() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 50;
  const MAX_DIST = 120;

  function resize() {
    if (!canvas) return;
    canvas.width = canvas.offsetWidth || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function random(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    return {
      x: random(0, canvas.width || 800),
      y: random(0, canvas.height || 600),
      vx: random(-0.35, 0.35),
      vy: random(-0.35, 0.35),
      r: random(1.5, 2.8),
      alpha: random(0.25, 0.6)
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
      ctx.fillStyle = `rgba(0, 242, 254, ${p.alpha * 0.5})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const opacity = (1 - dist / MAX_DIST) * 0.2;
          const grad = ctx.createLinearGradient(p.x, p.y, q.x, q.y);
          grad.addColorStop(0, `rgba(0, 242, 254, ${opacity})`);
          grad.addColorStop(1, `rgba(99, 102, 241, ${opacity})`);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── SCROLL REVEAL ──
document.addEventListener('DOMContentLoaded', () => {
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => observer.observe(el));
});

// ── CONTACT FORM HANDLER ──
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const msg = document.getElementById('formMsg');
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value || 'Portfolio Contact';
    const message = document.getElementById('message').value;

    btn.disabled = true;
    btn.innerHTML = '<span>Opening Mailer...</span>';

    // Construct Mailto URI
    const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const mailtoUrl = `mailto:saadtariq.dev@gmail.com?subject=${encodeURIComponent(subject)}&body=${mailtoBody}`;

    setTimeout(() => {
      window.location.href = mailtoUrl;
      msg.className = 'form-msg success';
      msg.innerHTML = `✅ Thank you ${name}! Opening your email client to dispatch to <strong>saadtariq.dev@gmail.com</strong>.`;
      this.reset();
      btn.disabled = false;
      btn.innerHTML = '<span>Send Message</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
    }, 600);
  });
});
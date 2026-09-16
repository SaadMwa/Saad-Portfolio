// ── PRELOADER DISMISSAL ──
function dismissPreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) preloader.classList.add('hidden');
}
// Dismiss after 1 second or on load
window.addEventListener('load', dismissPreloader);
setTimeout(dismissPreloader, 1200);

// ── MOBILE MENU ──
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.querySelector('.nav-mobile-toggle');
  if (menu) {
    const isOpen = menu.classList.toggle('open');
    if (btn) btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }
}
function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.querySelector('.nav-mobile-toggle');
  if (menu) {
    menu.classList.remove('open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
}

// ── PARTICLE CANVAS ──
(function() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 45;
  const MAX_DIST = 110;

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
      vx: random(-0.3, 0.3),
      vy: random(-0.3, 0.3),
      r: random(1.5, 2.5),
      alpha: random(0.2, 0.5)
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
          const opacity = (1 - dist / MAX_DIST) * 0.18;
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

// ── SCROLL REVEAL & ANIMATION ROBUSTNESS FALLBACK ──
document.addEventListener('DOMContentLoaded', () => {
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Immediate fallback for browsers without IntersectionObserver
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // Safety fallback: reveal all elements after 2.5s if animations didn't trigger
  setTimeout(() => {
    revealEls.forEach(el => {
      if (!el.classList.contains('visible')) {
        el.classList.add('visible');
      }
    });
  }, 2500);
});

// ── VERIFIED CONTACT FORM HANDLER ──
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const btn = document.getElementById('submitBtn');
    const msg = document.getElementById('formMsg');

    // Reset validation states
    [nameInput, emailInput, subjectInput, messageInput].forEach(inp => inp.classList.remove('input-error'));
    msg.style.display = 'none';

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim() || 'Portfolio Contact';
    const message = messageInput.value.trim();

    // Input Validations
    let errors = [];
    if (!name) {
      nameInput.classList.add('input-error');
      errors.push('Name is required.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      emailInput.classList.add('input-error');
      errors.push('Please enter a valid email address.');
    }

    if (!message) {
      messageInput.classList.add('input-error');
      errors.push('Message cannot be empty.');
    }

    if (errors.length > 0) {
      msg.className = 'form-msg error';
      msg.innerHTML = `⚠️ ${errors.join(' ')}`;
      msg.style.display = 'block';
      return;
    }

    // Disable duplicate submission while sending
    btn.disabled = true;
    btn.innerHTML = '<span>Preparing Mailer...</span>';

    // Construct Mailto URI safely
    const mailtoBody = encodeURIComponent(`Sender Name: ${name}\nSender Email: ${email}\n\nMessage:\n${message}`);
    const mailtoUrl = `mailto:saadtariq.dev@gmail.com?subject=${encodeURIComponent(subject)}&body=${mailtoBody}`;

    setTimeout(() => {
      // Trigger Mail Client
      window.location.href = mailtoUrl;

      // Display Success Message
      msg.className = 'form-msg success';
      msg.innerHTML = `✅ Thank you <strong>${name}</strong>! Your email client has been opened to send your message directly to <strong>saadtariq.dev@gmail.com</strong>.`;
      msg.style.display = 'block';

      this.reset();
      btn.disabled = false;
      btn.innerHTML = '<span>Send Message</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
    }, 600);
  });
});
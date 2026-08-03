// ============================================================
// NAV — shrink on scroll + mobile toggle
// ============================================================
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ============================================================
// SCROLL REVEAL
// ============================================================
const revealTargets = [
  '.about__grid',
  '.project-card',
  '.post-card',
  '.contact__inner',
  '.section__title',
  '.section__label',
];

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger siblings
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(revealTargets.join(',')).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ============================================================
// CONTACT FORM — basic UX (swap for Formspree / Netlify Forms)
// ============================================================
const form = document.getElementById('contactForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  // Replace this timeout with your real form submission (fetch to Formspree, etc.)
  setTimeout(() => {
    btn.textContent = 'Message sent ✓';
    form.reset();
    setTimeout(() => {
      btn.textContent = 'Send message';
      btn.disabled = false;
    }, 3000);
  }, 1200);
});

// ============================================================
// ACTIVE NAV LINK on scroll
// ============================================================
const sections = document.querySelectorAll('section[id]');
const navAnchorLinks = document.querySelectorAll('.nav__links a');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchorLinks.forEach(a => a.style.color = '');
      const active = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
      if (active) active.style.color = '#f0f0f0';
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeObserver.observe(s));

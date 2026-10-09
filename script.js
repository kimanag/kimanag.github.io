// ============================================================
// NAV — shrink on scroll + mobile toggle
// ============================================================
const nav = document.querySelector('.nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close mobile nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

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

if (form) {
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
}

// ============================================================
// CV — inline PDF viewer (side panel)
// The PDF is drawn with PDF.js at the panel's width, so it's readable in
// every browser. + / − zoom in and out (100% = fit to panel width).
// ============================================================
const cvToggle = document.getElementById('cvToggle');
const cvPdfPanel = document.getElementById('cvPdfPanel');
const cvPdfPages = document.getElementById('cvPdfPages');
const cvZoomIn = document.getElementById('cvZoomIn');
const cvZoomOut = document.getElementById('cvZoomOut');
const cvZoomLevel = document.getElementById('cvZoomLevel');

let cvPdfDoc = null;     // loaded PDF
let cvZoom = 1;          // 1 = fit to panel width
let cvRenderId = 0;      // cancels an older render if a newer one starts

async function renderCvPdf() {
  if (!cvPdfPages || !cvPdfPanel.classList.contains('is-open')) return;

  if (!window.pdfjsLib) {
    // PDF.js didn't load (offline / blocked): fall back to the browser's own viewer
    cvPdfPages.innerHTML = '<iframe class="cv-pdf-panel__frame" src="' +
      cvPdfPages.dataset.src + '#view=FitH" title="Anastasia Kim CV"></iframe>';
    cvPdfPages.style.padding = '0';
    return;
  }

  const myId = ++cvRenderId;
  try {
    if (!cvPdfDoc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      cvPdfDoc = await pdfjsLib.getDocument(cvPdfPages.dataset.src).promise;
    }

    const availWidth = cvPdfPages.clientWidth - 32; // minus padding
    const dpr = window.devicePixelRatio || 1;
    const canvases = [];

    for (let n = 1; n <= cvPdfDoc.numPages; n++) {
      const page = await cvPdfDoc.getPage(n);
      if (myId !== cvRenderId) return;
      const base = page.getViewport({ scale: 1 });
      const scale = (availWidth / base.width) * cvZoom;
      const viewport = page.getViewport({ scale: scale * dpr }); // sharp on retina

      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = Math.floor(viewport.width / dpr) + 'px';
      canvas.style.height = Math.floor(viewport.height / dpr) + 'px';
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      if (myId !== cvRenderId) return;
      canvases.push(canvas);
    }

    cvPdfPages.replaceChildren(...canvases);
  } catch (err) {
    // e.g. page opened straight from disk (file://), where browsers block
    // PDF.js from reading the file: fall back to the browser's own viewer
    console.error(err);
    cvPdfPages.innerHTML = '<iframe class="cv-pdf-panel__frame" src="' +
      cvPdfPages.dataset.src + '#view=FitH" title="Anastasia Kim CV"></iframe>';
    cvPdfPages.style.padding = '0';
  }
}

function setCvZoom(z) {
  cvZoom = Math.min(3, Math.max(0.5, Math.round(z * 100) / 100));
  if (cvZoomLevel) cvZoomLevel.textContent = Math.round(cvZoom * 100) + '%';
  renderCvPdf();
}

if (cvToggle && cvPdfPanel) {
  cvToggle.addEventListener('click', () => {
    const isOpen = cvPdfPanel.classList.toggle('is-open');

    cvToggle.setAttribute('aria-expanded', String(isOpen));
    cvPdfPanel.setAttribute('aria-hidden', String(!isOpen));

    cvToggle.textContent = isOpen
      ? '→ Hide PDF'
      : '→ View PDF';

    if (isOpen) renderCvPdf();
  });

  if (cvZoomIn) cvZoomIn.addEventListener('click', () => setCvZoom(cvZoom + 0.25));
  if (cvZoomOut) cvZoomOut.addEventListener('click', () => setCvZoom(cvZoom - 0.25));

  // redraw at the new width when the window is resized
  let cvResizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(cvResizeTimer);
    cvResizeTimer = setTimeout(renderCvPdf, 200);
  });
}

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

// ============================================================
// OTHER — moving picture strip
// Click a picture: it flips over and the strip stops.
// Click it again: it flips back and the strip starts moving again.
// ============================================================
const pictureMarquee = document.getElementById('pictureMarquee');
const pictureTrack = pictureMarquee && pictureMarquee.querySelector('.picture-track');

if (pictureTrack) {
  // Repeat the cards once so the strip loops with no jump or gap
  [...pictureTrack.children].forEach(card => {
    const copy = card.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    pictureTrack.appendChild(copy);
  });
  pictureTrack.querySelectorAll('video').forEach(v => {
    v.muted = true;
    const p = v.play();
    if (p) p.catch(() => {});
  });

  pictureTrack.addEventListener('click', (e) => {
    if (e.target.closest('a')) return; // let "click here" links open normally
    const card = e.target.closest('.flip-card');
    if (!card) return;

    const flipping = !card.classList.contains('flipped');
    // only one card open at a time
    pictureTrack.querySelectorAll('.flip-card.flipped').forEach(c => c.classList.remove('flipped'));
    card.classList.toggle('flipped', flipping);
    pictureMarquee.classList.toggle('is-paused', flipping);
  });
}

// ====================================================
// Navigation — scroll shadow + mobile menu
// ====================================================
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on nav link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ====================================================
// FAQ Accordion
// ====================================================
document.querySelectorAll('.faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq__item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq__item.open').forEach(el => {
      el.classList.remove('open');
      el.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
    });

    // Open clicked (if it was closed)
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ====================================================
// Waitlist forms (hero + bottom CTA)
// ====================================================
function setupWaitlistForm(formId, successId, mascotSrc) {
  const form = document.getElementById(formId);
  const successEl = document.getElementById(successId);
  if (!form || !successEl) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value.trim();
    if (!email) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Joining…';

    const ENDPOINT = 'https://formspree.io/f/xbdewwpw';

    if (ENDPOINT) {
      try {
        await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ email }),
        });
      } catch (_) {
        // Silently succeed — show confirmation regardless
      }
    }

    // Show success state
    form.style.display = 'none';
    successEl.classList.add('visible');
  });
}

setupWaitlistForm('heroForm', 'heroSuccess');
setupWaitlistForm('waitlistForm', 'waitlistSuccess');

// ====================================================
// Smooth scroll for anchor links
// ====================================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h')) || 68;
    const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ====================================================
// Subtle entrance animations (IntersectionObserver)
// ====================================================
const observerOpts = { threshold: 0.12 };

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, observerOpts);

document.querySelectorAll('.feature-card, .feature-section__inner, .value-card, .faq__item')
  .forEach(el => {
    el.classList.add('observe');
    observer.observe(el);
  });

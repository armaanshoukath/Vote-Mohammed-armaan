/* =========================================================
   ARMAAN FOR CULTURAL SECRETARY — CAMPAIGN SCRIPT
   Vanilla JS only. No dependencies.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Loading screen ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (loader) loader.classList.add('loaded');
    }, 400);
  });
  // Fallback in case 'load' already fired or is slow
  setTimeout(() => { if (loader) loader.classList.add('loaded'); }, 3000);

  /* ---------- Theme toggle (dark / light) ---------- */
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const storedTheme = localStorage.getItem('armaan-theme');

  if (storedTheme) {
    root.setAttribute('data-theme', storedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    root.setAttribute('data-theme', 'light');
  }

  themeToggle?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    if (next === 'dark') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('armaan-theme', next);
  });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  navToggle?.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu?.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Sticky header background on scroll ---------- */
  const header = document.getElementById('site-header');
  const backToTop = document.getElementById('back-to-top');

  const onScroll = () => {
    const scrolled = window.scrollY > 40;
    header?.classList.toggle('scrolled', scrolled);
    backToTop?.classList.toggle('visible', window.scrollY > 500);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Typing animation in hero ---------- */
  const typingEl = document.getElementById('typing-text');
  const typingPhrases = [
    'Candidate for Cultural Secretary',
    'A Stage for Every Talent',
    'One School. One Stage. Endless Talent.'
  ];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typingEl) {
    if (prefersReducedMotion) {
      typingEl.textContent = typingPhrases[0];
    } else {
      let phraseIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const type = () => {
        const currentPhrase = typingPhrases[phraseIndex];

        if (!deleting) {
          charIndex++;
          typingEl.textContent = currentPhrase.slice(0, charIndex);
          if (charIndex === currentPhrase.length) {
            deleting = true;
            setTimeout(type, 1600);
            return;
          }
        } else {
          charIndex--;
          typingEl.textContent = currentPhrase.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % typingPhrases.length;
          }
        }
        setTimeout(type, deleting ? 35 : 65);
      };
      type();
    }
  }

  /* ---------- Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach((el) => counterObserver.observe(el));
  } else {
    counters.forEach((el) => { el.textContent = el.getAttribute('data-count'); });
  }

  /* ---------- Button ripple effect ---------- */
  document.querySelectorAll('.ripple').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const size = Math.max(rect.width, rect.height);

      circle.classList.add('ripple-circle');
      circle.style.width = circle.style.height = `${size}px`;
      circle.style.left = `${e.clientX - rect.left - size / 2}px`;
      circle.style.top = `${e.clientY - rect.top - size / 2}px`;

      this.style.position = this.style.position || 'relative';
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 650);
    });
  });

  /* ---------- Parallax hero background ---------- */
  const stageGlow = document.querySelector('.stage-glow');
  const heroShapes = document.querySelectorAll('.hero .shape');

  if (!prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        if (stageGlow) stageGlow.style.transform = `translateX(-50%) translateY(${scrollY * 0.25}px)`;
        heroShapes.forEach((shape, i) => {
          shape.style.transform = `translateY(${scrollY * (0.12 + i * 0.05)}px)`;
        });
      }
    }, { passive: true });
  }

  /* ---------- Contact form handling (Formspree backend) ---------- */
  // 1. Go to https://formspree.io and sign up for a free account.
  // 2. Create a new form (any name, e.g. "Campaign Suggestions").
  // 3. Formspree gives you an endpoint like: https://formspree.io/f/xxxxaaaa
  //    Copy the part after "/f/" (e.g. "xxxxaaaa") into FORMSPREE_FORM_ID below.
  // 4. Submissions will arrive in your email, and also show up in your
  //    Formspree dashboard under that form.
  // 5. The free plan requires you to confirm your first submission by clicking
  //    a link Formspree emails you — do one test submission after setup.
  const FORMSPREE_FORM_ID = 'YOUR_FORMSPREE_FORM_ID_HERE';

  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const isFormConfigured = FORMSPREE_FORM_ID !== 'YOUR_FORMSPREE_FORM_ID_HERE';

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const studentClass = document.getElementById('class').value.trim();
    const suggestion = document.getElementById('suggestion').value.trim();

    if (!name || !studentClass || !suggestion) {
      formStatus.textContent = 'Please fill in every field before sending.';
      return;
    }

    if (!isFormConfigured) {
      // Formspree isn't connected yet — see the setup notes above this block.
      formStatus.textContent = `Thank you, ${name}! (Note: form storage isn't connected yet — see script.js.)`;
      form.reset();
      setTimeout(() => { formStatus.textContent = ''; }, 6000);
      return;
    }

    const submitUrl = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;

    fetch(submitUrl, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    })
      .then((response) => {
        if (response.ok) {
          formStatus.textContent = `Thank you, ${name}! Your suggestion has been sent.`;
          form.reset();
        } else {
          formStatus.textContent = 'Something went wrong sending that. Please try again.';
        }
      })
      .catch(() => {
        formStatus.textContent = 'Something went wrong sending that. Please check your connection and try again.';
      })
      .finally(() => {
        setTimeout(() => { formStatus.textContent = ''; }, 6000);
      });
  });

});

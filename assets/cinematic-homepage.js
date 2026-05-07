(() => {
  const SECTION_SELECTOR = '[data-cinematic-homepage]';

  const loadScript = (src, check) =>
    new Promise((resolve, reject) => {
      if (check()) {
        resolve();
        return;
      }
      const existing = document.querySelector(`script[data-lib-src="${src}"]`);
      if (existing) {
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.dataset.libSrc = src;
      script.addEventListener('load', resolve, { once: true });
      script.addEventListener('error', reject, { once: true });
      document.head.appendChild(script);
    });

  const ensureLibraries = async () => {
    await loadScript('https://unpkg.com/gsap@3.12.5/dist/gsap.min.js', () => Boolean(window.gsap));
    await loadScript('https://unpkg.com/gsap@3.12.5/dist/ScrollTrigger.min.js', () => Boolean(window.ScrollTrigger));
    await loadScript('https://unpkg.com/@studio-freight/lenis@1.0.42/bundled/lenis.min.js', () => Boolean(window.Lenis));
    window.gsap.registerPlugin(window.ScrollTrigger);
  };

  const setupLenis = () => {
    if (window.__tlmLenis) {
      return window.__tlmLenis;
    }

    const lenis = new window.Lenis({
      duration: 1.2,
      smoothTouch: false,
      lerp: 0.09,
      wheelMultiplier: 0.9
    });

    const raf = (time) => {
      lenis.raf(time);
      window.requestAnimationFrame(raf);
    };

    lenis.on('scroll', () => window.ScrollTrigger.update());
    window.requestAnimationFrame(raf);
    window.__tlmLenis = lenis;
    return lenis;
  };

  const setupPreloader = (root, reduceMotion) => {
    const loader = root.querySelector('[data-cine-loader]');
    if (!loader) {
      return;
    }

    if (reduceMotion) {
      loader.classList.add('is-hidden');
      return;
    }

    // Wait for main loader to finish before animating section loader
    const waitForMainLoader = () => {
      const body = document.body;
      if (body.classList.contains('tlm-is-loading')) {
        // Main loader still active, wait and retry
        setTimeout(waitForMainLoader, 50);
        return;
      }

      // Main loader has finished, now animate section loader
      const tl = window.gsap.timeline();
      const graphic = loader.querySelector('.cine-loader__graphic');
      const line = loader.querySelector('.cine-loader__line span');

      // Intro: subtle vignette fade and animated progress line
      tl.fromTo(
        graphic,
        { opacity: 0, scale: 0.98, filter: 'blur(6px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' }
      )
        .fromTo(
          line,
          { xPercent: -100 },
          { xPercent: 0, duration: 0.95, ease: 'power2.out' },
          '-=0.3'
        )
        .to(graphic, {
          opacity: 0,
          duration: 0.6,
          delay: 0.22,
          ease: 'power2.inOut',
          onComplete: () => {
            loader.classList.add('is-hidden');
            // Ensure pointer events are properly restored
            document.body.style.pointerEvents = '';
          }
        });
    };

    waitForMainLoader();
  };

  const setupHero = (root, reduceMotion) => {
    const hero = root.querySelector('[data-cine-hero]');
    if (!hero) {
      return;
    }

    // Helper: split each hero line into word spans for per-word motion
    const splitWords = (el) => {
      if (!el) return;
      const text = el.textContent.trim();
      const words = text.split(/\s+/).filter(Boolean);
      el.innerHTML = words.map((w) => `<span class="cine-hero__word">${w}</span>`).join(' ');
      return el.querySelectorAll('.cine-hero__word');
    };

    if (!reduceMotion) {
      // prepare words
      hero.querySelectorAll('[data-hero-word]').forEach((line) => splitWords(line));

      const intro = window.gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.1 } });

      // staged intro: brand float, title words, supporting fades
      intro
        .from(hero.querySelector('[data-hero-brand]'), {
          opacity: 0,
          scale: 0.92,
          y: 18,
          duration: 1.6,
          ease: 'power2.out'
        })
        .from(
          hero.querySelectorAll('.cine-hero__word'),
          {
            y: 84,
            opacity: 0,
            rotateX: -28,
            filter: 'blur(8px)',
            stagger: { each: 0.06, from: 'start' }
          },
          '-=1.0'
        )
        .from(
          hero.querySelectorAll('[data-hero-fade]'),
          {
            y: 28,
            opacity: 0,
            filter: 'blur(4px)',
            stagger: 0.08
          },
          '-=0.7'
        );

      const media = hero.querySelector('[data-hero-media]');
      if (media) {
        window.gsap.to(media, {
          scale: 1.22,
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });
      }

      const brand = hero.querySelector('[data-hero-brand]');
      if (brand) {
        window.gsap.to(brand, {
          yPercent: -28,
          scale: 1.06,
          opacity: 0.12,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });
      }
    }


  const setupProductHover = (root, reduceMotion) => {
    if (reduceMotion) return;
    root.querySelectorAll('.cine-collection-card').forEach((card) => {
      const img = card.querySelector('img');
      const content = card.querySelector('.cine-collection-card__content');
      if (!img) return;
      card.style.willChange = 'transform';

      card.addEventListener('pointerenter', () => {
        window.gsap.to(img, { scale: 1.08, duration: 0.7, ease: 'power3.out' });
        window.gsap.to(card, { y: -6, boxShadow: '0 28px 70px rgba(0,0,0,0.5)', duration: 0.6, ease: 'power2.out' });
        if (content) window.gsap.to(content, { y: -6, duration: 0.6, ease: 'power2.out' });
      });

      card.addEventListener('pointerleave', () => {
        window.gsap.to(img, { scale: 1, duration: 0.6, ease: 'power3.out' });
        window.gsap.to(card, { y: 0, boxShadow: 'none', duration: 0.6, ease: 'power2.out' });
        if (content) window.gsap.to(content, { y: 0, duration: 0.6, ease: 'power2.out' });
      });
    });
  };
    const glow = hero.querySelector('[data-hero-glow]');
    if (glow && !reduceMotion) {
      hero.addEventListener('pointermove', (event) => {
        const rect = hero.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        glow.style.setProperty('--glow-x', `${x}%`);
        glow.style.setProperty('--glow-y', `${y}%`);

        const brand = hero.querySelector('[data-hero-brand]');
        if (brand) {
          const offsetX = (x - 50) * 0.06;
          const offsetY = (y - 50) * 0.08;
          brand.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
        }
      });

      hero.addEventListener('pointerleave', () => {
        const brand = hero.querySelector('[data-hero-brand]');
        if (brand) {
          brand.style.transform = 'translate3d(0, 0, 0)';
        }
      });
    }
  };

  const setupSceneReveals = (root, reduceMotion) => {
    const scenes = root.querySelectorAll('[data-cine-scene]');
    if (reduceMotion) {
      scenes.forEach((scene) => scene.classList.add('is-visible'));
      return;
    }

    scenes.forEach((scene) => {
      window.gsap.fromTo(
        scene,
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: scene,
            start: 'top 82%'
          }
        }
      );
    });
  };

  const setupHorizontalStory = (root, reduceMotion) => {
    const section = root.querySelector('[data-horizontal-story]');
    const track = root.querySelector('[data-horizontal-track]');
    const viewport = root.querySelector('[data-horizontal-viewport]');
    if (!section || !track || !viewport || reduceMotion) {
      return;
    }

    const getDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

    window.gsap.to(track, {
      x: () => -getDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.max(viewport.clientWidth, getDistance() + viewport.clientWidth * 0.4)}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1
      }
    });
  };

  const setupCardInteractions = (root, reduceMotion) => {
    if (reduceMotion) {
      return;
    }

    root.querySelectorAll('[data-float-card]').forEach((card) => {
      const xTo = window.gsap.quickTo(card, 'x', { duration: 0.35, ease: 'power2.out' });
      const yTo = window.gsap.quickTo(card, 'y', { duration: 0.35, ease: 'power2.out' });
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        xTo((event.clientX - rect.left - rect.width / 2) * 0.08);
        yTo((event.clientY - rect.top - rect.height / 2) * 0.08);
      });
      card.addEventListener('pointerleave', () => {
        xTo(0);
        yTo(0);
      });
    });
  };

  const setupFooterReveal = (reduceMotion) => {
    const footer = document.querySelector('.tlm-footer');
    if (!footer || reduceMotion) {
      return;
    }

    window.gsap.fromTo(
      footer,
      { opacity: 0.35, y: 80 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footer,
          start: 'top bottom'
        }
      }
    );
  };

  const initSection = (root) => {
    if (!root || root.dataset.cineReady === 'true') {
      return;
    }

    root.dataset.cineReady = 'true';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setupPreloader(root, reduceMotion);
    setupHero(root, reduceMotion);
    setupSceneReveals(root, reduceMotion);
    setupHorizontalStory(root, reduceMotion);
    setupCardInteractions(root, reduceMotion);
    setupFooterReveal(reduceMotion);
  };

  const boot = async () => {
    const roots = [...document.querySelectorAll(SECTION_SELECTOR)];
    if (!roots.length) {
      return;
    }

    try {
      await ensureLibraries();
      setupLenis();
      roots.forEach((root) => initSection(root));
      window.ScrollTrigger.refresh();
    } catch (error) {
      roots.forEach((root) => {
        root.classList.add('cine-fallback');
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  document.addEventListener('shopify:section:load', (event) => {
    const root = event.target.matches(SECTION_SELECTOR) ? event.target : event.target.querySelector(SECTION_SELECTOR);
    if (!root) {
      return;
    }
    boot();
  });
})();

export async function initAnimations() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const gsapModule = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  const gsap = gsapModule.default || gsapModule;

  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ force3D: true });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) return;

  // Hero text entrance
  const heroTitle = document.querySelector('.hero__title');
  const heroDesc = document.querySelector('.hero__desc');

  if (heroTitle) {
    gsap.from(heroTitle.children, {
      y: 60,
      opacity: 0,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.3,
    });
  }

  if (heroDesc) {
    gsap.from(heroDesc, {
      y: 30,
      opacity: 0,
      duration: 0.7,
      delay: 0.8,
      ease: 'power3.out',
    });
  }

  // Reveal on scroll
  const revealElements = document.querySelectorAll('[data-reveal]');

  revealElements.forEach((el) => {
    const delay = parseInt(el.getAttribute('data-reveal-delay')) || 0;

    gsap.from(el, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      delay: delay / 1000,
    });
  });

  // Counter animation for stats
  const statsNumbers = document.querySelectorAll('.stats__number');

  statsNumbers.forEach((stat) => {
    const target = parseInt(stat.getAttribute('data-target'));
    if (isNaN(target)) return;

    gsap.from(stat, {
      innerText: 0,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: stat.closest('.stats__grid'),
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      onUpdate: function () {
        const current = Math.round(this.progress() * target);
        stat.innerText = current.toLocaleString();
      },
      onComplete: () => {
        stat.innerText = target.toLocaleString();
      },
    });
  });

  // Skills bar animation
  const skillsBars = document.querySelectorAll('.skills__bar span');

  skillsBars.forEach((bar) => {
    const width = bar.style.width;
    bar.style.width = '0%';

    gsap.to(bar, {
      width: width,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: bar.closest('.skills__list'),
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Portfolio items staggered reveal
  const portfolioItems = document.querySelectorAll('.portfolio__item');
  if (portfolioItems.length) {
    gsap.from(portfolioItems, {
      scale: 0.9,
      opacity: 0,
      duration: 0.6,
      stagger: 0.05,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.portfolio__grid',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }

  // Pricing plans staggered reveal
  const pricingPlans = document.querySelectorAll('.pricing__plan');
  if (pricingPlans.length) {
    gsap.from(pricingPlans, {
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.pricing__grid',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }

  // Design section
  const designSection = document.querySelector('.design');
  if (designSection) {
    gsap.from('.design__image img', {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.design',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    gsap.from('.design__text', {
      x: 60,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.design',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  }

  ScrollTrigger.refresh();
}

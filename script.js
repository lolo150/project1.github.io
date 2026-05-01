// Portfolio JS : animations, navigation active et année automatique
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  // Année automatique dans le footer
  const yearEl = $("#year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Animation d'apparition des blocs au scroll
  const revealElements = $$([
    ".hero-card",
    ".hero-side",
    ".glass",
    ".skill-card",
    ".project",
    ".timeline-item",
    ".contact-card"
  ].join(","));

  if ("IntersectionObserver" in window) {
    revealElements.forEach((el) => {
      el.classList.add("reveal");
    });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }

  // Lien de navigation actif selon la section visible
  const sections = $$('main section[id], header[id]');
  const navLinks = $$('.nav-links a[href^="#"]');

  function setActiveLink(id) {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  }

  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target?.id) {
        setActiveLink(visible.target.id);
      }
    }, {
      rootMargin: "-30% 0px -55% 0px",
      threshold: [0.1, 0.25, 0.5]
    });

    sections.forEach((section) => navObserver.observe(section));
  }
})();

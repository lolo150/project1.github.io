/* ALA EDDINE YAKOUBI — Portfolio · Vanilla JavaScript */
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Current year
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Dark / light theme with graceful handling of blocked localStorage.
  const themeToggle = $('#themeToggle');
  let savedTheme = null;
  try { savedTheme = window.localStorage.getItem('yakoubi-portfolio-theme'); } catch (_) { /* Browsers may block storage */ }
  setTheme(savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : 'dark');

  function setTheme(theme) {
    root.dataset.theme = theme;
    themeToggle?.setAttribute('aria-label', theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre');
    const metaTheme = $('meta[name="theme-color"]');
    if (metaTheme) metaTheme.content = theme === 'dark' ? '#0a0c13' : '#f7f8fc';
  }

  themeToggle?.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(theme);
    try { window.localStorage.setItem('yakoubi-portfolio-theme', theme); } catch (_) { /* Non-blocking */ }
  });

  // Accessible mobile navigation.
  const menuToggle = $('#menuToggle');
  const navLinks = $('#navLinks');
  function closeMenu() {
    navLinks?.classList.remove('is-open');
    menuToggle?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Ouvrir le menu');
  }
  menuToggle?.addEventListener('click', () => {
    const open = navLinks?.classList.toggle('is-open') ?? false;
    menuToggle.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  $$('#navLinks a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('click', event => {
    if (!menuToggle?.contains(event.target) && !navLinks?.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
  window.matchMedia('(min-width: 941px)').addEventListener?.('change', event => {
    if (event.matches) closeMenu();
  });

  // Scroll progress + nav section indicator.
  const progress = $('#scrollProgress');
  let scrollTicking = false;
  function updateProgress() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${maxScroll > 0 ? Math.min(100, Math.max(0, window.scrollY / maxScroll * 100)) : 0}%`;
    scrollTicking = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateProgress);
      scrollTicking = true;
    }
  }, { passive: true });
  updateProgress();

  const sections = $$('#about, #skills, #experience, #projects, #education');
  const navItems = $$('#navLinks a');
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navItems.forEach(link => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-22% 0px -60% 0px', threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // Search and category filters (accent-insensitive).
  const searchInput = $('#projectSearch');
  const projectCards = $$('.project-card');
  const filterButtons = $$('.filter-btn');
  const countLabel = $('#projectCount');
  const emptyLabel = $('#noProjects');
  let selectedFilter = 'all';

  function normalize(text) {
    return (text || '').toLocaleLowerCase('fr')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ').trim();
  }

  function updateProjects() {
    const query = normalize(searchInput?.value);
    let visible = 0;
    projectCards.forEach(card => {
      const categories = (card.dataset.category || '').split(/\s+/);
      const corpus = normalize(`${card.textContent} ${card.dataset.search || ''}`);
      const matches = (selectedFilter === 'all' || categories.includes(selectedFilter)) && (!query || corpus.includes(query));
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    if (countLabel) countLabel.textContent = `${visible} projet${visible > 1 ? 's' : ''} affiché${visible > 1 ? 's' : ''}`;
    if (emptyLabel) emptyLabel.hidden = visible !== 0;
  }

  filterButtons.forEach(button => button.addEventListener('click', () => {
    selectedFilter = button.dataset.filter || 'all';
    filterButtons.forEach(b => {
      const active = b === button;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    updateProjects();
  }));
  searchInput?.addEventListener('input', updateProjects);
  updateProjects();

  // Native, keyboard-accessible project dialog.
  const dialog = $('#projectDialog');
  const dialogTitle = $('#dialogTitle');
  const dialogBody = $('#dialogBody');
  const dialogClose = $('#dialogClose');
  const dialogDismiss = $('#dialogDismiss');
  let lastFocusedButton = null;

  function openProject(card, button) {
    const title = $('h3', card)?.textContent?.trim();
    const details = $('.project-details', card);
    if (!dialog || !dialogTitle || !dialogBody || !details || !title) return;
    lastFocusedButton = button;
    dialogTitle.textContent = title;
    dialogBody.innerHTML = details.innerHTML;
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
      document.body.classList.add('dialog-open');
      dialogClose?.focus();
    }
  }

  $$('.project-open').forEach(button => button.addEventListener('click', () => {
    const card = button.closest('.project-card');
    if (card) openProject(card, button);
  }));
  const closeDialog = () => dialog?.close();
  dialogClose?.addEventListener('click', closeDialog);
  dialogDismiss?.addEventListener('click', closeDialog);
  dialog?.addEventListener('click', event => {
    // Clicking the translucent backdrop closes the native dialog.
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog();
    }
  });
  dialog?.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    if (lastFocusedButton?.isConnected) lastFocusedButton.focus();
  });

  // Copy email, with clipboard fallback for file:// or insecure contexts.
  const copyEmail = $('#copyEmail');
  const copyFeedback = $('#copyFeedback');
  copyEmail?.addEventListener('click', async () => {
    const email = 'yakoubialla@gmail.com';
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(email);
      if (copyFeedback) copyFeedback.textContent = 'Adresse e-mail copiée !';
    } catch (_) {
      // Manual selection remains possible if browser permission is denied.
      if (copyFeedback) copyFeedback.textContent = `Copie non autorisée : ${email}`;
    }
  });

  // Reveal on viewport entry; nothing is hidden when reduced-motion is requested.
  const animated = $$('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    animated.forEach(el => el.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -35px 0px', threshold: .08 });
    animated.forEach(el => revealObserver.observe(el));
  }
})();

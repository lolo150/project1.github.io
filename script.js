(() => {
  const menuBtn = document.querySelector('#menuBtn');
  const navLinks = document.querySelector('#navLinks');
  const year = document.querySelector('#year');
  const searchInput = document.querySelector('#projectSearch');
  const projectCards = [...document.querySelectorAll('.project-card')];
  const detailButtons = [...document.querySelectorAll('.toggle-details')];

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  menuBtn?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuBtn?.setAttribute('aria-expanded', 'false');
    });
  });

  detailButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.project-card');
      const details = card?.querySelector('.project-details');
      if (!details) return;

      const isOpen = !details.hasAttribute('hidden');
      if (isOpen) {
        details.setAttribute('hidden', '');
        button.textContent = 'Voir plus';
        button.setAttribute('aria-expanded', 'false');
      } else {
        details.removeAttribute('hidden');
        button.textContent = 'Voir moins';
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  const normalize = (value) =>
    (value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

  searchInput?.addEventListener('input', (event) => {
    const query = normalize(event.target.value);

    projectCards.forEach((card) => {
      const content = normalize(`${card.innerText} ${card.dataset.search || ''}`);
      card.classList.toggle('hidden', query.length > 0 && !content.includes(query));
    });
  });

  const revealItems = [...document.querySelectorAll('.reveal')];

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }
})();

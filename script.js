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

  const modal = document.querySelector('#projectModal');
  const modalTitle = document.querySelector('#modalTitle');
  const modalContent = document.querySelector('#modalContent');
  const closeModalButtons = [...document.querySelectorAll('[data-close-modal]')];

  function openProjectModal(card) {
    const title = card?.querySelector('h3')?.textContent?.trim() || 'Projet';
    const details = card?.querySelector('.project-details');
    const content = details?.innerHTML?.trim();

    if (!modal || !modalTitle || !modalContent || !content) return;

    modalTitle.textContent = title;
    modalContent.innerHTML = content;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeProjectModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  detailButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.project-card');
      openProjectModal(card);
    });
  });

  closeModalButtons.forEach((button) => {
    button.addEventListener('click', closeProjectModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeProjectModal();
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

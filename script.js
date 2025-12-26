// Portfolio JS: thème clair/sombre, filtre de projets, reveal on scroll, année automatique
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  // ---- Thème (persistant) ----
  const themeBtn = $("#themeBtn");
  const savedTheme = localStorage.getItem("theme"); // "light" | "dark" | null

  if (savedTheme === "light") document.body.classList.add("light");

  themeBtn?.addEventListener("click", () => {
    document.body.classList.toggle("light");
    localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
  });

  // ---- Année auto dans le footer ----
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---- Filtre de projets (recherche) ----
  const search = $("#search");
  const cards = $$(".card");

  function normalize(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  }

  function filterProjects(query) {
    const q = normalize(query);
    cards.forEach(card => {
      const text = normalize(card.innerText);
      card.classList.toggle("hidden", q && !text.includes(q));
    });
  }

  search?.addEventListener("input", (e) => filterProjects(e.target.value));

  // ---- Reveal on scroll (IntersectionObserver) ----
  // Optionnel: ajoute une petite animation d’apparition
  cards.forEach(c => {
    c.style.opacity = "0";
    c.style.transform = "translateY(8px)";
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.style.transition = "opacity .35s ease, transform .35s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
      io.unobserve(el);
    });
  }, { threshold: 0.12 });

  cards.forEach(c => io.observe(c));
})();

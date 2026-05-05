/* ═══════════════════════════════════════════════
   AERODIGITAL CENTRO-OESTE — main.js
═══════════════════════════════════════════════ */

'use strict';

/* ── 1. NAVBAR scroll ─────────────────────────── */
(function () {
  const nav = document.getElementById('mainNav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── 2. Active nav link highlight ─────────────── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link[href^="#"]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    { threshold: 0.35 }
  );
  sections.forEach(s => observer.observe(s));
})();

/* ── 3. Scroll-reveal ──────────────────────────── */
(function () {
  const revealEls = document.querySelectorAll(
    '.context-card, .stat-card, .feature-item, .partner-card, .tl-item, .product-card, .eval-form-card, .contact-card'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach(el => observer.observe(el));
})();

/* ── 4. NPS Scale builder ──────────────────────── */
(function () {
  const container = document.getElementById('npsScale');
  if (!container) return;

  let selected = null;

  for (let i = 1; i <= 10; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nps-btn';
    btn.textContent = i;
    btn.dataset.value = i;

    btn.addEventListener('click', () => {
      document.querySelectorAll('.nps-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selected = i;
    });

    container.appendChild(btn);
  }
})();

/* ── 5. Product filter ─────────────────────────── */
(function () {
  const filterBtns  = document.querySelectorAll('.btn-filter');
  const productCols = document.querySelectorAll('#productGrid [data-cat]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      productCols.forEach(col => {
        const match = filter === 'todos' || col.dataset.cat === filter;
        col.classList.toggle('hidden', !match);

        // Re-trigger reveal animation
        if (match) {
          const card = col.querySelector('.product-card');
          if (card) {
            card.classList.remove('visible');
            setTimeout(() => card.classList.add('visible'), 50);
          }
        }
      });
    });
  });
})();

/* ── 6. Formulário de Avaliação ────────────────── */
function submitForm() {
  const nome    = document.getElementById('evalNome').value.trim();
  const cidade  = document.getElementById('evalCidade').value;
  const comment = document.getElementById('evalComment').value.trim();
  const npsBtn  = document.querySelector('.nps-btn.active');

  if (!nome) {
    showToast('Por favor, informe seu nome.', 'warning');
    return;
  }
  if (!cidade) {
    showToast('Selecione seu município.', 'warning');
    return;
  }
  if (!npsBtn) {
    showToast('Selecione uma nota de 1 a 10.', 'warning');
    return;
  }

  // Simula envio
  const formArea    = document.getElementById('formArea');
  const formSuccess = document.getElementById('formSuccess');
  formArea.classList.add('d-none');
  formSuccess.classList.remove('d-none');

  console.log('Avaliação registrada:', { nome, cidade, nota: npsBtn.dataset.value, comment });
}

function resetForm() {
  document.getElementById('evalNome').value    = '';
  document.getElementById('evalCidade').value  = '';
  document.getElementById('evalComment').value = '';
  document.querySelectorAll('.nps-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.form-check-input').forEach(c => c.checked = false);
  document.getElementById('formArea').classList.remove('d-none');
  document.getElementById('formSuccess').classList.add('d-none');
}

/* ── 7. Formulário de Contato ──────────────────── */
function submitContact() {
  const nome   = document.getElementById('cNome').value.trim();
  const wpp    = document.getElementById('cWpp').value.trim();
  const email  = document.getElementById('cEmail').value.trim();
  const cidade = document.getElementById('cCidade').value.trim();

  if (!nome || !wpp) {
    showToast('Preencha nome e WhatsApp para continuar.', 'warning');
    return;
  }

  // Validação simples de telefone (10 ou 11 dígitos)
  const digitsOnly = wpp.replace(/\D/g, '');
  if (digitsOnly.length < 10) {
    showToast('Informe um número de WhatsApp válido.', 'warning');
    return;
  }

  const contactArea    = document.getElementById('contactArea');
  const contactSuccess = document.getElementById('contactSuccess');
  contactArea.classList.add('d-none');
  contactSuccess.classList.remove('d-none');

  console.log('Contato registrado:', { nome, wpp, email, cidade });
}

/* ── 8. Toast helper ───────────────────────────── */
function showToast(message, type = 'info') {
  // Remove toast anterior se existir
  const existing = document.getElementById('aeroToast');
  if (existing) existing.remove();

  const colors = { warning: '#F5A623', info: '#1B6B3A', error: '#dc3545' };

  const toast = document.createElement('div');
  toast.id = 'aeroToast';
  toast.style.cssText = `
    position: fixed;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    background: ${colors[type] || colors.info};
    color: ${type === 'warning' ? '#1e2e25' : '#fff'};
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 600;
    font-size: 1rem;
    padding: .65rem 1.4rem;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,.25);
    z-index: 9999;
    white-space: nowrap;
    opacity: 0;
    transition: opacity .25s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  });
}

/* ── 9. Navbar collapse ao clicar em link (mobile) */
(function () {
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const collapse = document.getElementById('navbarNav');
      const bsCollapse = bootstrap.Collapse.getInstance(collapse);
      if (bsCollapse) bsCollapse.hide();
    });
  });
})();

/* ── 10. Smooth scroll offset para navbar fixa ─── */
(function () {
  const NAV_HEIGHT = 70;
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

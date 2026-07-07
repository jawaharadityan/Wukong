// Palm & Weave — shared interactions
document.addEventListener('DOMContentLoaded', () => {

  // Mobile nav toggle
  document.querySelectorAll('.nav-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const links = btn.closest('.site-nav').querySelector('.nav-links');
      links.classList.toggle('open');
      btn.setAttribute('aria-expanded', links.classList.contains('open'));
    });
  });

  // Accordions (product specs, etc.)
  document.querySelectorAll('.accordion-item').forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    trigger?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.closest('.accordion')?.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // Swatch selection groups (product customizer)
  document.querySelectorAll('.swatch-group').forEach(group => {
    group.querySelectorAll('.swatch').forEach(sw => {
      sw.addEventListener('click', () => {
        group.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
        sw.classList.add('selected');
        const labelEl = group.parentElement.querySelector('.swatch-selected-label');
        if (labelEl) labelEl.textContent = sw.dataset.label;
        const target = document.querySelector(sw.dataset.paints || '');
        if (target && sw.dataset.tint) target.style.background = sw.dataset.tint;
      });
    });
  });

  // Gallery prev/next
  document.querySelectorAll('.gallery').forEach(gal => {
    const slides = gal.querySelectorAll('.gallery-slide');
    let idx = 0;
    const show = (n) => {
      idx = (n + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    };
    gal.querySelector('.gallery-prev')?.addEventListener('click', () => show(idx - 1));
    gal.querySelector('.gallery-next')?.addEventListener('click', () => show(idx + 1));
  });

  // Quick view modal
  const modal = document.querySelector('.quickview-modal');
  if (modal) {
    document.querySelectorAll('[data-quickview]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const card = trigger.closest('.product-card');
        if (!card) return;
        modal.querySelector('.qv-title').textContent = card.dataset.name;
        modal.querySelector('.qv-price').textContent = card.dataset.price;
        modal.querySelector('.qv-desc').textContent = card.dataset.desc || '';
        modal.querySelector('.qv-photo').className = 'qv-photo ' + (card.dataset.photo || 'ph-interior');
        modal.classList.add('open');
      });
    });
    modal.querySelectorAll('[data-close-modal]').forEach(b => b.addEventListener('click', () => modal.classList.remove('open')));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') modal.classList.remove('open'); });
  }

  // Shop filters (client-side, checkbox based)
  const filterForm = document.querySelector('.filters');
  if (filterForm) {
    const cards = document.querySelectorAll('.product-card');
    const apply = () => {
      const checked = Array.from(filterForm.querySelectorAll('input:checked')).map(i => i.value);
      const materialChecks = checked.filter(v => ['palm-fiber','teak-wood'].includes(v));
      const sizeChecks = checked.filter(v => ['twin','full','queen','king'].includes(v));
      cards.forEach(card => {
        const mats = (card.dataset.materials || '').split(' ');
        const sizes = (card.dataset.sizes || '').split(' ');
        const matOk = materialChecks.length === 0 || materialChecks.some(m => mats.includes(m));
        const sizeOk = sizeChecks.length === 0 || sizeChecks.some(s => sizes.includes(s));
        card.style.display = (matOk && sizeOk) ? '' : 'none';
      });
    };
    filterForm.querySelectorAll('input').forEach(i => i.addEventListener('change', apply));
  }

  // Sustainability journey wheel — click a node to reveal its description
  document.querySelectorAll('.journey-node').forEach(node => {
    node.addEventListener('click', () => {
      document.querySelectorAll('.journey-node').forEach(n => n.classList.remove('active'));
      node.classList.add('active');
      const label = document.querySelector('.journey-detail');
      if (label) label.textContent = node.dataset.detail;
    });
  });

  // Reveal-on-scroll (progressive enhancement — elements stay visible if this never runs)
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('in-view'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.add('pre-reveal');
    io.observe(el);
  });
});

import {
  hero, metrics, avatars,
  benefits, cta, footer,
  reportTabs, authorData
} from './data/content.js';

/* ---- Report preview ---- */
const lockedKeys = ['position'];

const renderReportPreview = () => {
  document.getElementById('reportTabs').innerHTML = reportTabs.map((t, i) => {
    const locked = lockedKeys.includes(t.key);
    return `<button class="report-tab${i === 0 ? ' active' : ''}${locked ? ' report-tab--locked' : ''}" data-tab="${t.key}">${t.label}${locked ? ' 🔒' : ''}</button>`;
  }).join('');

  const first = reportTabs[0];
  document.getElementById('reportPreviewContent').innerHTML =
    `<div class="report-preview__title">${first.label}</div>
     <div class="report-preview__desc">${first.desc}</div>`;
};

/* ---- Author ---- */
const renderAuthor = () => {
  document.getElementById('authorStats').innerHTML = authorData.stats.map(s =>
    `<div class="author-stat">
      <div class="author-stat__value">${s.value}</div>
      <div class="author-stat__label">${s.label}</div>
    </div>`
  ).join('');
  document.getElementById('authorBio').textContent = authorData.bio;
};

/* ---- 1. Hero ---- */
const renderHero = () => {
  document.getElementById('heroBadge').textContent = hero.badge;
  document.getElementById('heroTitle').textContent = hero.title;
  document.getElementById('heroSubtitle').textContent = hero.subtitle;
  document.getElementById('heroDesc').textContent = hero.desc;

  document.getElementById('heroTags').innerHTML = hero.tags
    .map(t => `<span class="tag ${t.cls}">${t.text}</span>`).join('');

  const s = hero.stat;
  document.getElementById('heroStat').innerHTML =
    `<span class="hero__stat-value">${s.value}</span>` +
    `<span class="hero__stat-unit">${s.unit}</span>` +
    `<span class="hero__stat-label">${s.label}</span>`;
};

/* ---- 2. Metrics ---- */
const renderMetrics = () => {
  document.getElementById('metricsGrid').innerHTML = metrics.map(m =>
    `<div class="metric-card">
      <div class="metric-card__value ${m.cls}">${m.value}</div>
      <div class="metric-card__label">${m.label}</div>
      <div class="metric-card__detail">${m.detail}</div>
    </div>`
  ).join('');
};

/* ---- 3. Benefits ---- */
const renderBenefits = () => {
  document.getElementById('benefitsList').innerHTML = benefits.map(b =>
    `<div class="insight-box ${b.cls}">
      <div class="insight-box__title">${b.title}</div>
      <div>${b.text}</div>
    </div>`
  ).join('');
};

/* ---- 4. Avatars ---- */
const renderAvatars = () => {
  document.getElementById('avatarsGrid').innerHTML = avatars.map(a =>
    `<div class="avatar-card">
      <div class="avatar-card__head">
        <div class="avatar-card__icon">${a.icon}</div>
        <div>
          <div class="avatar-card__name">${a.name}</div>
          <div class="avatar-card__subtitle">${a.subtitle}</div>
        </div>
      </div>
      <ul class="avatar-card__details">
        ${a.details.map(d => `<li>${d}</li>`).join('')}
      </ul>
      <div class="avatar-card__quote">${a.quote}</div>
    </div>`
  ).join('');
};



/* ---- 10. CTA ---- */
const renderCTA = () => {
  document.getElementById('ctaTitle').textContent = cta.title;
  document.getElementById('ctaDesc').textContent = cta.desc;
  document.getElementById('ctaAuthor').textContent = cta.author;
  document.getElementById('ctaBtn').textContent = cta.btnText;
  document.getElementById('ctaNote').textContent = cta.note;
};

/* ---- 11. Footer ---- */
const renderFooter = () => {
  document.getElementById('footerContent').innerHTML =
    `<p>${footer.date}</p><p>${footer.sources}</p><p>${footer.disclaimer}</p>`;
};

/* ========== RENDER ALL ========== */
renderHero();
renderMetrics();
renderReportPreview();
renderAvatars();
renderBenefits();
renderAuthor();
renderCTA();
renderFooter();

/* ========== INTERACTIVITY ========== */

/* --- Report tabs --- */
document.getElementById('reportTabs').addEventListener('click', (e) => {
  const tab = e.target.closest('.report-tab');
  if (!tab) return;

  document.querySelectorAll('.report-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');

  const data = reportTabs.find(t => t.key === tab.dataset.tab);
  if (data) {
    document.getElementById('reportPreviewContent').innerHTML =
      `<div class="report-preview__title">${data.label}</div>
       <div class="report-preview__desc">${data.desc}</div>`;
  }
});



/* --- Report outer tabs: switch tabs inside iframe --- */
const reportTabsEl = document.querySelector('.report-outer-tabs');
if (reportTabsEl) {
  const iframe = document.getElementById('reportIframe');

  const lockedMessages = {
    t04: 'Раздел «Ваша позиция» доступен после индивидуальной диагностики. Персональная оценка по 4 параметрам на основе анкеты и звонка с вами.'
  };

  reportTabsEl.addEventListener('click', (e) => {
    const tab = e.target.closest('.report-outer-tab');
    if (!tab) return;

    const target = tab.dataset.target;

    // Locked tabs — show message instead of iframe content
    if (tab.classList.contains('report-outer-tab--locked')) {
      document.querySelectorAll('.report-outer-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      iframe.style.display = 'none';

      let msgEl = document.getElementById('reportLockedMsg');
      if (!msgEl) {
        msgEl = document.createElement('div');
        msgEl.id = 'reportLockedMsg';
        msgEl.style.cssText = 'padding:48px 32px;text-align:center;background:#f8fafc;min-height:300px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;';
        iframe.parentElement.appendChild(msgEl);
      }
      msgEl.style.display = 'flex';
      msgEl.innerHTML = `
        <div style="font-size:32px;opacity:0.3;">🔒</div>
        <div style="font-size:15px;font-weight:700;color:var(--text);">Доступно после диагностики</div>
        <div style="font-size:13px;color:var(--text-secondary);max-width:420px;line-height:1.6;">${lockedMessages[target]}</div>
        <a href="#cta" style="margin-top:8px;font-size:12px;font-weight:700;color:#fff;background:var(--accent);padding:10px 24px;border-radius:4px;text-decoration:none;">Получить полный отчёт</a>
      `;
      return;
    }

    // Regular tabs
    document.querySelectorAll('.report-outer-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Hide locked message, show iframe
    const msgEl = document.getElementById('reportLockedMsg');
    if (msgEl) msgEl.style.display = 'none';
    iframe.style.display = 'block';

    try {
      const iDoc = iframe.contentDocument || iframe.contentWindow.document;
      const innerBtn = iDoc.querySelector(`.tab-btn[data-tab="${target}"]`);
      if (innerBtn) innerBtn.click();
      iDoc.documentElement.scrollTop = 0;
      iDoc.body.scrollTop = 0;
    } catch (err) {
      iframe.src = `report-example.html#${target}`;
    }
  });

  // After iframe loads, hide its internal nav and header to avoid duplication
  iframe.addEventListener('load', () => {
    try {
      const iDoc = iframe.contentDocument || iframe.contentWindow.document;
      const style = iDoc.createElement('style');
      style.textContent = `
        .tab-nav { display: none !important; }
        .pdf-bar { display: none !important; }
        .cover { padding-top: 1.5rem !important; padding-bottom: 1.2rem !important; }
        .cta { display: none !important; }
        #actionsContainer { display: none !important; }
        .act-filters { display: none !important; }
        .act-card { display: none !important; }
      `;
      iDoc.head.appendChild(style);
    } catch (err) { /* cross-origin, skip */ }
  });
}

/* --- Form --- */
const form = document.getElementById('ctaForm');
const modal = document.getElementById('modalOverlay');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Simple validation
  let valid = true;
  const nameField = document.getElementById('f-name');
  const phoneField = document.getElementById('f-phone');

  nameField.closest('.cta-form__field').classList.remove('error');
  phoneField.closest('.cta-form__field').classList.remove('error');

  if (!nameField.value.trim()) {
    nameField.closest('.cta-form__field').classList.add('error');
    valid = false;
  }
  if (!phoneField.value.trim()) {
    phoneField.closest('.cta-form__field').classList.add('error');
    valid = false;
  }

  if (!valid) return;

  const data = Object.fromEntries(new FormData(form).entries());
  console.log('Заявка на рентген:', data);

  modal.classList.add('show');
  form.reset();
});

document.getElementById('modalClose').addEventListener('click', () => {
  modal.classList.remove('show');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('show');
});


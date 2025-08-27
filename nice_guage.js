// helper
const isDesktop = () => window.matchMedia('(min-width:1024px)').matches;

let sidebar;
const backdrop = document.getElementById('backdrop');
const menuBtn = document.getElementById('menuBtn');
const headerLeft = document.querySelector('#appHeader .header-container');
const anaModal = document.getElementById('anaModal');
const anaClose = document.getElementById('anaClose');
const analyticsBtn = document.getElementById('analyticsBtn');

let echGauge;

// ===== Mount sidebar =====
if (window.createSidebar) {
  sidebar = createSidebar({
    isOpen: isDesktop(),
    onClose: () => closeSidebar('user')
  });
  document.body.appendChild(sidebar);
  if (isDesktop()) sidebar.open();
} else {
  console.error('sidebar.js missing');
}

// ===== Open/Close sidebar =====
function openSidebar() {
  if (!sidebar) return;

  if (isDesktop()) {
    sidebar.open();
    backdrop?.classList.remove('show');
    document.body.style.overflow = '';
  } else {
    sidebar.open();
    backdrop?.classList.add('show');
    document.body.style.overflow = 'hidden';
    closeAnalytics(); // ensure modal is closed on mobile
  }
}

function closeSidebar(reason = 'user') {
  if (!sidebar) return;

  if (isDesktop() && reason === 'analytics') {
    openAnalyticsModal();
    return;
  }

  sidebar.close();
  backdrop?.classList.remove('show');
  document.body.style.overflow = '';
}

// ===== Analytics =====
function openAnalytics(e) {
  e?.preventDefault();

  // On mobile/tablet, close sidebar first
  if (!isDesktop()) closeSidebar();

  openAnalyticsModal();
}

function openAnalyticsModal() {
  anaModal?.classList.add('show');
  document.body.style.overflow = 'hidden';
  document.body.classList.add('analytics-open');

  // Initialize charts only once and after modal is visible
  if (!window.__anaChartsInitialized) {
    window.__anaChartsInitialized = true;
    setTimeout(() => {
      try { initAnalyticsCharts(); } catch (e) { console.warn(e); }
    }, 50);
  }

  // Resize gauge after modal shows
  setTimeout(() => { echGauge && echGauge.resize(); }, 50);
}

function closeAnalytics() {
  anaModal?.classList.remove('show');
  document.body.style.overflow = '';
  document.body.classList.remove('analytics-open');

  // Reopen sidebar if desktop
  if (isDesktop() && sidebar && !sidebar.isOpen) sidebar.open();
}

// ===== Event bindings =====
function bindOpen(el) {
  if (!el) return;
  const handler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openSidebar();
  };
  el.addEventListener('click', handler, { passive: false });
  el.addEventListener('touchend', handler, { passive: false });
}

bindOpen(menuBtn);
bindOpen(headerLeft);

backdrop?.addEventListener('click', () => closeSidebar('user'));
analyticsBtn?.addEventListener('click', openAnalytics);
anaClose?.addEventListener('click', closeAnalytics);
anaModal?.addEventListener('click', (e) => { if (e.target === anaModal) closeAnalytics(); });

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeSidebar('user');
    closeAnalytics();
  }
});

window.addEventListener('resize', () => {
  if (!sidebar) return;

  if (isDesktop()) {
    sidebar.open();
    backdrop?.classList.remove('show');
    document.body.style.overflow = '';
  } else {
    sidebar.close();
  }

  echGauge && echGauge.resize();
});

// ===== Charts Initialization =====
function initAnalyticsCharts() {
  // Line Chart 1
  const ctx1 = document.getElementById('anaLine1');
  if (ctx1) new Chart(ctx1, { type: 'line', data: { labels:[1,2,3], datasets:[{label:'Power', data:[100,200,150]}] } });

  // Line Chart 2
  const ctx2 = document.getElementById('anaLine2');
  if (ctx2) new Chart(ctx2, { type: 'line', data: { labels:[1,2,3], datasets:[{label:'Energy', data:[300,150,400]}] } });

  // Line Chart 3
  const ctx3 = document.getElementById('anaLine3');
  if (ctx3) new Chart(ctx3, { type: 'line', data: { labels:[1,2,3], datasets:[{label:'Water', data:[50,75,60]}] } });

  // Gauge (ECharts)
  const gaugeEl = document.getElementById('anaGauge');
  if (gaugeEl) {
    echGauge = echarts.init(gaugeEl);
    const option = {
      series: [{
        type: 'gauge',
        min: 0,
        max: 5000,
        detail: { formatter: '{value}' },
        data: [{ value: 3671, name: 'Total Power' }]
      }]
    };
    echGauge.setOption(option);
  }
}

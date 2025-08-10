// helper
const isDesktop = () => window.matchMedia('(min-width:1024px)').matches;

let sidebar;

// ===== Mount sidebar =====
if (window.createSidebar) {
  // نمرر onClose -> ترجع لـ closeSidebar (والتي ستمنع الإغلاق على الديسكتوب)
  sidebar = createSidebar({ isOpen: isDesktop(), onClose: () => closeSidebar('user') });
  document.body.appendChild(sidebar);
  if (isDesktop()) sidebar.open();
} else {
  console.error('sidebar.js missing');
}

// ===== Open/Close with desktop guard =====
function openSidebar() {
  if (!sidebar) return;
  if (isDesktop()) {
    // على الديسكتوب نضمن أنه مفتوح وبدون backdrop
    sidebar.open();
    backdrop?.classList.remove('show');
    document.body.style.overflow = '';
    return;
  }
  // موبايل/تابلت
  sidebar.open();
  backdrop?.classList.add('show');
  document.body.style.overflow = 'hidden';
}

// السبب مهم: نسمح بالإغلاق على الديسكتوب فقط إذا السبب "analytics"
function closeSidebar(reason = 'user') {
  if (!sidebar) return;
  if (isDesktop() && reason !== 'analytics') {
    // ممنوع الإغلاق على الديسكتوب إلا بسبب الأناليتيكس
    sidebar.open();
    backdrop?.classList.remove('show');
    document.body.style.overflow = '';
    return;
  }
  // مسموح الإغلاق هنا (موبايل/تابلت أو سبب analytics)
  sidebar.close();
  backdrop?.classList.remove('show');
  document.body.style.overflow = '';
}

// لو تغيّر المقاس أثناء العمل
window.addEventListener('resize', () => {
  if (!sidebar) return;
  if (isDesktop()) {
    sidebar.open();
    backdrop?.classList.remove('show');
    document.body.style.overflow = '';
  } else {
    // على الشاشات الأصغر نرجّع الوضع العادي (مغلق افتراضيًا)
    sidebar.close();
  }
});

// ==== Bind triggers (يبقى كما هو عندك) ====
function bindOpen(el){
  if (!el) return;
  const handler = (e)=>{
    e.preventDefault(); e.stopPropagation();
    openSidebar();
  };
  el.addEventListener('click', handler, {passive:false});
  el.addEventListener('touchend', handler, {passive:false});
}
bindOpen(menuBtn);
bindOpen(headerLeft);

// Backdrop + ESC (عطّل الإغلاق على الديسكتوب تلقائيًا عبر closeSidebar)
backdrop?.addEventListener('click', () => closeSidebar('user'));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSidebar('user'); });

/* ===================== Analytics ===================== */
const anaModal     = document.getElementById('anaModal');
const anaClose     = document.getElementById('anaClose');
const analyticsBtn = document.getElementById('analyticsBtn');

let echGauge;
function closeSidebar(reason = 'user') {
  if (!sidebar) return;
  if (isDesktop() && reason !== 'analytics') {
    sidebar.open(); // يضل مفتوح
    backdrop?.classList.remove('show');
    document.body.style.overflow = '';
    return;
  }
  if (isDesktop() && reason === 'analytics') {
    document.body.classList.add('analytics-open');
    return;
  }
  // موبايل/تابلت أو سبب عادي
  sidebar.close();
  backdrop?.classList.remove('show');
  document.body.style.overflow = '';
}

function closeAnalytics(){
  anaModal?.classList.remove('show');
  document.body.style.overflow = '';
  document.body.classList.remove('analytics-open'); // يرجع السايدبار
  if (isDesktop()) sidebar?.open();
}


analyticsBtn?.addEventListener('click', openAnalytics);
anaClose?.addEventListener('click', closeAnalytics);
anaModal?.addEventListener('click', (e)=>{ if (e.target === anaModal) closeAnalytics(); });
document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') closeAnalytics(); });
window.addEventListener('resize', ()=> { echGauge && echGauge.resize(); });

/* ===== بقية كود الرسوم (Chart.js/ECharts) يبقى كما هو عندك ===== */

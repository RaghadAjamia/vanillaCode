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
isOpen: isDesktop() ? true : false
,    onClose: () => closeSidebar('user')
  });
  document.body.appendChild(sidebar);
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
  if (!window.Chart) return;

  new Chart(document.getElementById('anaLine1'), {
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul'],
      datasets: [{ label: 'Series A', data: [8,6,10,22,28,24,26], borderColor: '#ff8a00', backgroundColor: 'transparent', tension: 0.35, fill: false }]
    },
    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } }, responsive: true }
  });

  new Chart(document.getElementById('anaLine2'), {
    type:'line',
    data:{
      labels:['Jan','Feb','Mar','Apr','May','Jun','Jul'],
      datasets:[{label:'Energy', data:[9,7,13,20,18,14,19], borderColor:'#ff8a00', backgroundColor:'rgba(255,138,0,.18)', tension:.35, fill:false}]
    },
    options:{ plugins:{ legend:{display:false} }, scales:{ y:{ beginAtZero:true } }, responsive:true }
  });

  new Chart(document.getElementById('anaLine3'), {
    type:'line',
    data:{
      labels:['Jan','Feb','Mar','Apr','May','Jun','Jul'],
      datasets:[{label:'Water', data:[5,6,9,16,14,12,18], borderColor:'#ff8a00', backgroundColor:'rgba(255,138,0,.18)', tension:.35, fill:false}]
    },
    options:{ plugins:{ legend:{display:false} }, scales:{ y:{ beginAtZero:true } }, responsive:true }
  });

  // Gauge
  echGauge = initEchartsGauge({ value: 65, unit: 'kWh/month', color: '#ff8a00' });
}

function initEchartsGauge({value=65, unit='kWh/month', color='#ff8a00'} = {}) {
  if (!window.echarts) return null;
  const el = document.getElementById('anaGauge');
  if (!el) return null;

  const chart = echarts.init(el, null, { renderer: 'canvas' });
  const option = {
    series: [{
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      center: ['50%', '60%'],
      radius: '100%',
      min: 0,
      max: 100,
      splitNumber: 4,
      axisLine: { lineStyle: { width: 16, color: [[0.3, '#FED7AA'], [0.7, '#FB923C'], [1.0, '#ff7043']] } },
      pointer: { icon: 'path://M2,0 L150,0 L150,4 L2,4 Z', width: 4, length: '70%', offsetCenter: [0,0], itemStyle: { color: '#333' } },
      axisTick: { show:false }, splitLine:{ show:false }, axisLabel:{ show:false }, title:{ show:false },
      detail: [
        { valueAnimation: true, offsetCenter: [0,'10%'], formatter: val => Math.round(val*36.71).toLocaleString(), color:'#111', fontSize:20, fontWeight:600 },
        { valueAnimation:false, offsetCenter:[0,'26%'], formatter:()=>unit, color:'rgba(0,0,0,.55)', fontSize:12 }
      ],
      data:[{ value }]
    }]
  };
  chart.setOption(option);
  return chart;
}

// ===== DEBUG LOGS =====
console.log('[home.js] loaded');

// ===== DOM elements =====
const menuBtn    = document.getElementById('menuBtn');
const headerLeft = document.querySelector('#appHeader .header-container');
const backdrop   = document.getElementById('backdrop');
const anaModal   = document.getElementById('anaModal');
const anaClose   = document.getElementById('anaClose');
const analyticsBtn = document.getElementById('analyticsBtn');

console.log('[home.js] menuBtn:', !!menuBtn, 'headerLeft:', !!headerLeft, 'backdrop:', !!backdrop, 'anaModal:', !!anaModal);

const isDesktop = () => window.matchMedia('(min-width:1024px)').matches;

// ===== Sidebar =====
let sidebar;

function openSidebar() {
  if (!sidebar) return console.warn('[home.js] openSidebar called but no sidebar');
  console.log('[home.js] opening sidebar…');

  sidebar.open();
  if (!isDesktop()) {
    backdrop?.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  // If Analytics modal is open, close it first
  if (anaModal?.classList.contains('show')) {
    closeAnalytics();
  }
}

function closeSidebar() {
  if (!sidebar) return console.warn('[home.js] closeSidebar called but no sidebar');
  console.log('[home.js] closing sidebar…');

  sidebar.close();
  backdrop?.classList.remove('show');
  document.body.style.overflow = '';
}

// ===== Mount sidebar =====
if (window.createSidebar) {
  sidebar = createSidebar({ isOpen: false, onClose: closeSidebar });
  document.body.appendChild(sidebar);
  console.log('[home.js] sidebar mounted:', !!sidebar);
} else {
  console.error('[home.js] sidebar.js missing');
}

// ===== Analytics modal =====
let echGauge;

function openAnalytics(e) {
  e?.preventDefault();
  // Close sidebar on mobile/tablet
  if (!isDesktop()) closeSidebar();

  anaModal?.classList.add('show');
  document.body.style.overflow = 'hidden';
  document.body.classList.add('analytics-open');

  if (!window.__anaChartsInitialized) {
    window.__anaChartsInitialized = true;
    try { initAnalyticsCharts(); } catch(e){ console.warn(e); }
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

// ===== Click / Touch bindings =====
function bindOpen(el) {
  if (!el) return;
  const handler = (e) => { e.preventDefault(); e.stopPropagation(); openSidebar(); };
  el.addEventListener('click', handler, { passive: false });
  el.addEventListener('touchend', handler, { passive: false });
}

bindOpen(menuBtn);
bindOpen(headerLeft);

backdrop?.addEventListener('click', closeSidebar);
analyticsBtn?.addEventListener('click', openAnalytics);
anaClose?.addEventListener('click', closeAnalytics);
anaModal?.addEventListener('click', e => { if (e.target === anaModal) closeAnalytics(); });

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeSidebar();
    closeAnalytics();
  }
});

// ===== Window resize =====
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

// ===== Charts (copy from first.js) =====
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

// ===== Expose globally =====
window.openSidebar    = openSidebar;
window.closeSidebar   = closeSidebar;
window.openAnalytics  = openAnalytics;
window.closeAnalytics = closeAnalytics;

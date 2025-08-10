// ===== DEBUG LOGS =====
console.log('[first.js] loaded');
const menuBtn    = document.getElementById('menuBtn');
const headerLeft = document.querySelector('#appHeader .header-container'); // left side
const backdrop   = document.getElementById('backdrop');
console.log('[first.js] menuBtn:', !!menuBtn, 'headerLeft:', !!headerLeft, 'backdrop:', !!backdrop);

const isDesktop = () => window.matchMedia('(min-width:1024px)').matches;

// ===== Sidebar (JS-generated) =====
let sidebar;

// Close/Open helpers
function openSidebar(){
  if (!sidebar) return console.warn('[first.js] openSidebar called but no sidebar');
  console.log('[first.js] opening sidebar…');
  sidebar.open();
  if (!isDesktop()) {
    backdrop?.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
    // NEW: if Analytics is open, close it first
  if (anaModal?.classList.contains('show')) {
    closeAnalytics();
  }
}
function closeSidebar(){
  if (!sidebar) return;
  console.log('[first.js] closing sidebar…');
  sidebar.close();
  backdrop?.classList.remove('show');
  document.body.style.overflow = '';
}
window.addEventListener('resize', () => {
  if (isDesktop()) backdrop?.classList.remove('show');
});

// Mount from sidebar.js if available
if (window.createSidebar) {
  console.log('[first.js] createSidebar found, mounting…');
  sidebar = createSidebar({ isOpen:false, onClose: closeSidebar });
  document.body.appendChild(sidebar);
  console.log('[first.js] sidebar mounted:', !!document.getElementById('sidebarElement'));
} else {
  console.error('[first.js] sidebar.js did NOT load (window.createSidebar missing)');
}

// ---- CLICK WIRING (bind to multiple targets + touch) ----
function bindOpen(el){
  if (!el) return;
  const handler = (e)=>{
    e.preventDefault(); e.stopPropagation();
    console.log('[first.js] menu clicked/touched');
    openSidebar();
  };
  el.addEventListener('click', handler, {passive:false});
  el.addEventListener('touchend', handler, {passive:false});
}
bindOpen(menuBtn);
bindOpen(headerLeft);

// Backdrop + ESC
backdrop?.addEventListener('click', closeSidebar);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSidebar(); });

// ===== Analytics Modal wiring =====
const anaModal     = document.getElementById('anaModal');
const anaClose     = document.getElementById('anaClose');
const analyticsBtn = document.getElementById('analyticsBtn');

let echGauge; // ECharts instance

function openAnalytics(){
  window.dispatchEvent(new CustomEvent('analytics:open'));
  anaModal?.classList.add('show');
  document.body.style.overflow = 'hidden';

  if (!window.__anaChartsInitialized) {
    window.__anaChartsInitialized = true;
    try { initAnalyticsCharts(); } catch(e){ console.warn(e); }
  }

  // ensure gauge resizes after visible
  setTimeout(()=> { echGauge && echGauge.resize(); }, 50);
}
function closeAnalytics(){
  anaModal?.classList.remove('show');
  document.body.style.overflow = '';
}

analyticsBtn?.addEventListener('click', openAnalytics);
anaClose?.addEventListener('click', closeAnalytics);
anaModal?.addEventListener('click', (e)=>{ if (e.target === anaModal) closeAnalytics(); });
document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') closeAnalytics(); });
window.addEventListener('resize', ()=> { echGauge && echGauge.resize(); });

// ===== Line charts (Chart.js) + Gauge (ECharts) =====
function initAnalyticsCharts(){
  if (!window.Chart) return; // Chart.js not loaded

  // Line 1
new Chart(document.getElementById('anaLine1'), {
  type: 'line',
  data: {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul'],
    datasets: [
      {
        label: 'Series A',
        data: [8,6,10,22,28,24,26],
        borderColor: '#ff8a00',
        backgroundColor: 'transparent', // no fill
        tension: 0.35,
        fill: false
      }
    ]
  },
  options: {
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
    responsive: true
  }
});


  // Line 2
  new Chart(document.getElementById('anaLine2'), {
    type:'line',
    data:{
      labels:['Jan','Feb','Mar','Apr','May','Jun','Jul'],
      datasets:[{label:'Energy', data:[9,7,13,20,18,14,19], borderColor:'#ff8a00', backgroundColor:'rgba(255,138,0,.18)', tension:.35, fill:false}]
    },
    options:{ plugins:{ legend:{display:false} }, scales:{ y:{ beginAtZero:true } }, responsive:true }
  });

  // Line 3
  new Chart(document.getElementById('anaLine3'), {
    type:'line',
    data:{
      labels:['Jan','Feb','Mar','Apr','May','Jun','Jul'],
      datasets:[{label:'Water', data:[5,6,9,16,14,12,18], borderColor:'#ff8a00', backgroundColor:'rgba(255,138,0,.18)', tension:.35, fill:false}]
    },
    options:{ plugins:{ legend:{display:false} }, scales:{ y:{ beginAtZero:true } }, responsive:true }
  });

  // Gauge (ECharts)
  echGauge = initEchartsGauge({
    value: 65,            // 0..100
    unit: 'kWh/month',    // النص اللي تحت القيمة
    color: '#ff8a00'      // لون العلامة/الأسلوب
  });
}

// ===== ECharts gauge =====
function initEchartsGauge({value=65, unit='kWh/month', color='#ff8a00'} = {}){
  if (!window.echarts) return null;
  const el = document.getElementById('anaGauge');
  if (!el) return null;

  const chart = echarts.init(el, null, { renderer:'canvas' });

  const option = {
    series: [{
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      center: ['50%','60%'],
      radius: '100%',
      min: 0,
      max: 100,
      splitNumber: 4,
      axisLine: {
        lineStyle: {
          width: 16,
          color: [
            [0.3, '#FED7AA'],
            [0.7, '#FB923C'],
            [1.0, '#ff7043']
          ]
        }
      },
      pointer: {
        icon: 'path://M2,0 L150,0 L150,4 L2,4 Z',
        width: 4,
        length: '70%',
        offsetCenter: [0, 0],
        itemStyle: { color: '#333' }
      },
      axisTick: { show:false },
      splitLine: { show:false },
      axisLabel: { show:false },
      title: { show:false },
      detail: [
        {
          valueAnimation: true,
          offsetCenter: [0, '10%'],
          formatter: (val) => Math.round(val * 36.71).toLocaleString(), // مثالي فقط؛ غيّر المعادلة لو بدك
          color: '#111',
          fontSize: 20,
          fontWeight: 600
        },
        {
          valueAnimation: false,
          offsetCenter: [0, '26%'],
          formatter: () => unit,
          color: 'rgba(0,0,0,.55)',
          fontSize: 12
        }
      ],
      data: [{ value }]
    }]
  };

  chart.setOption(option);
  return chart;
}

// ===== Demo blinks =====
const blink = el => { el?.classList.remove('blink'); void el?.offsetWidth; el?.classList.add('blink'); };
['btnAlarm','btnHVAC','btnLight','btnAnalytics','pillLight','pillCO2','pillFire'].forEach(id=>{
  const el = document.getElementById(id);
  el && el.addEventListener('click', ()=> blink(el));
});

// ===== Fake temp drift =====
const miniWrap = document.getElementById('miniTemp');
if (miniWrap) {
  const mini = miniWrap.querySelector('span');
  let t = 36.2;
  setInterval(()=>{
    t += (Math.random() - 0.5) * 0.1;
    if (mini) mini.textContent = t.toFixed(1) + '°';
  }, 2500);
}

// expose
window.openSidebar    = openSidebar;
window.closeSidebar   = closeSidebar;
window.openAnalytics  = openAnalytics;
window.closeAnalytics = closeAnalytics;

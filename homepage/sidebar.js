// sidebar.js (full updated)
(function (global) {
  const ICONS = {
    close:
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    arrow:
      '<svg class="chev" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>',
    projects:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7h18"/><path d="M7 3v4"/></svg>',

    // Simple category icons (inline SVGs)
    hvac:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>',
    lifesafety:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-check-icon lucide-shield-check"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
    lighting:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-7 7c0 2.8 2 5.2 4 6.3V17h6v-1.7c2-1.1 4-3.5 4-6.3a7 7 0 0 0-7-7Z"/></svg>',
    electrical:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    water:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2s6 6.34 6 10a6 6 0 1 1-12 0c0-3.66 6-10 6-10Z"/></svg>',
    alarms:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="13" r="8"/><path d="M12 9v4M10 17h4M3 5l3 3M18 8l3-3"/></svg>',
    floors:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="6"/><rect x="3" y="9" width="18" height="6"/><rect x="3" y="15" width="18" height="6"/></svg>'
  };
  // Small helper to create a dropdown block
function dropdownBlock(title, iconKey, id, items) {
  return `
    <li>
      <button class="dropdownToggle" data-target="${id}" aria-expanded="false" aria-controls="${id}">
        ${ICONS.arrow}
        <span class="label">
          ${ICONS[iconKey] || ''}
          <span class="title">${title}</span>
        </span>
      </button>
      <ul class="dropdown" id="${id}">
        ${items
          .map((it) => `<li><a href="${it.href}">${it.label}</a></li>`)
          .join('')}
      </ul>
    </li>
  `;
}



  function createSidebar(opts) {
    const isOpen = !!(opts && opts.isOpen);
    const onClose = (opts && opts.onClose) || function () {};

    const nav = document.createElement('nav');
    nav.id = 'sidebarElement';
    nav.className = 'sidebar' + (isOpen ? ' openSideBar' : '');

    // ===== Equipments lists (edit hrefs to match your routes) =====
    const hvacItems = [
      { label: 'FAHUs', href: '/equip/hvac/fahus' },
      { label: 'EXHUAST FANS', href: '/equip/hvac/exhaust-fans' }, // kept your spelling
      { label: 'VRF', href: '/equip/hvac/vrf' },
      { label: 'VAVs', href: '/equip/hvac/vavs' },
      { label: 'MFSDs', href: '/equip/hvac/mfsds' },
      { label: 'CO2', href: '/equip/hvac/co2-per-floor' },
      { label: 'Air Curtins', href: '/equip/hvac/air-curtins' },
      { label: 'CRAC units', href: '/equip/hvac/crac' }
    ];

    const lifeSafetyItems = [
      { label: 'Fire alarm', href: '/equip/life-safety/fire-alarm' },
      { label: 'access control', href: '/equip/life-safety/access-control' },
      { label: 'leak detection', href: '/equip/life-safety/leak-detection' },
      { label: 'CACP', href: '/equip/life-safety/cacp' }
    ];

    const lightingItems = [
      { label: 'Lighting panels (LCP)', href: '/equip/lighting/lcp' },
      { label: 'Lighing floors', href: '/equip/lighting/floors' } // kept your spelling
    ];
/*
    const electricalItems = [
      { label: 'SMBDs', href: '/equip/electrical/smbds' },
      { label: 'UPDs', href: '/equip/electrical/upds' },
      { label: 'LPDBs', href: '/equip/electrical/lpdbs' },
      { label: 'PDBs', href: '/equip/electrical/pdbs' },
      { label: 'PDUs', href: '/equip/electrical/pdus' },
      { label: 'UPSs', href: '/equip/electrical/upss' },
      { label: 'EV chargers >> Chargers', href: '/equip/electrical/ev/chargers' },
      { label: 'EV chargers >> SMDB-EVs', href: '/equip/electrical/ev/smdb-evs' }
    ];
            /*  ${dropdownBlock('Electical Systems', 'electrical', 'dropdownElectrical', electricalItems)}

*/
    const waterItems = [
      { label: 'Water meters', href: '/equip/water/meters' }
    ];

    // ===== Build HTML =====
    nav.innerHTML = `
      <div class="closeSideBar" id="closeSidebarBtn" title="Close">${ICONS.close}</div>

      <div class="sectionContainer">
        <h1><a href="">Equipments</a></h1>
        <ul>
          ${dropdownBlock('HVAC', 'hvac', 'dropdownHVAC', hvacItems)}
          ${dropdownBlock('Life Safty', 'lifesafety', 'dropdownLife', lifeSafetyItems)}
          ${dropdownBlock('Lighting', 'lighting', 'dropdownLighting', lightingItems)}
          ${dropdownBlock('Water meters', 'water', 'dropdownWater', waterItems)}
        </ul>
      </div>

      <div class="sectionContainer">
        <h1><a a href="">Alarms</a></h1>
         <h1><a a href="">Floors</a></h1>

      </div>
    `;

    // ===== Events =====
    nav.querySelector('#closeSidebarBtn')?.addEventListener('click', onClose);

    // Toggle dropdown (only one open at a time)
    nav.querySelectorAll('.dropdownToggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-target');
        const dd = id && nav.querySelector('#' + id);
        if (!dd) return;

        const isOpening = !dd.classList.contains('show');
        nav.querySelectorAll('.dropdown.show').forEach((el) => el.classList.remove('show'));
        nav
          .querySelectorAll('.dropdownToggle[aria-expanded="true"]')
          .forEach((b) => b.setAttribute('aria-expanded', 'false'));

        if (isOpening) {
          dd.classList.add('show');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // Click-away
    function away(e) {
      if (nav.classList.contains('openSideBar') && !nav.contains(e.target)) onClose();
    }
    document.addEventListener('click', away);

    // API
    nav.open = () => nav.classList.add('openSideBar');
    nav.close = () => {
      nav.classList.remove('openSideBar');
      nav.querySelectorAll('.dropdown.show').forEach((el) => el.classList.remove('show'));
      nav
        .querySelectorAll('.dropdownToggle[aria-expanded="true"]')
        .forEach((b) => b.setAttribute('aria-expanded', 'false'));
    };
    nav.destroy = () => {
      document.removeEventListener('click', away);
      nav.remove();
    };

    return nav;
  }

  global.createSidebar = createSidebar;
})(window);

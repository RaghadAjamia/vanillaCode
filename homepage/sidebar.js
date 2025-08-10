(function (global) {
  const ICONS = {
    close:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    arrow:'<svg class="chev" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>',
    projects:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7h18"/><path d="M7 3v4"/></svg>',
    user:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    account:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16"/></svg>',
    corporate:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21V7l9-4 9 4v14H3z"/></svg>'
  };

  function dropdownItem(label, key){
    const id = 'dropdown' + label.replace(/\s+/g,'');
    return `
      <li>
        <button class="dropdownToggle" data-target="${id}" aria-expanded="false" aria-controls="${id}">
          ${ICONS.arrow}${ICONS[key] || ''}
          <p style="margin:0">${label}</p>
        </button>
        <ul class="dropdown" id="${id}">
          <li><a href="/profile/settings">Settings</a></li>
          <li><a href="/profile/security">Security</a></li>
        </ul>
      </li>`;
  }

  function createSidebar(opts){
    const isOpen  = !!(opts && opts.isOpen);
    const onClose = (opts && opts.onClose) || function(){};

    const nav = document.createElement('nav');
    nav.id = 'sidebarElement';
    nav.className = 'sidebar' + (isOpen ? ' openSideBar' : '');

    nav.innerHTML = `
      <div class="closeSideBar" id="closeSidebarBtn" title="Close">${ICONS.close}</div>

      <div class="sectionContainer">
        <h1>Dashboards</h1>
        <ul>
          <li>
            <button class="dropdownToggle" data-target="dropdownProjects" aria-expanded="false" aria-controls="dropdownProjects">
              ${ICONS.arrow}${ICONS.projects}<p style="margin:0">Projects</p>
            </button>
            <ul class="dropdown" id="dropdownProjects">
              <li><a href="/profile/settings">Settings</a></li>
              <li><a href="/profile/security">Security</a></li>
            </ul>
          </li>
        </ul>
      </div>

      <div class="sectionContainer">
        <h1>Pages</h1>
        <ul>
          ${dropdownItem('User Profile','user')}
          ${dropdownItem('Accounts','account')}
          ${dropdownItem('Corporate','corporate')}
        </ul>
      </div>
    `;

    // Close button
    nav.querySelector('#closeSidebarBtn')?.addEventListener('click', onClose);

    // Dropdown toggle with "only one open" rule
    nav.querySelectorAll('.dropdownToggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-target');
        const dd = id && nav.querySelector('#'+id);
        if (!dd) return;

        const isOpening = !dd.classList.contains('show');

        // Close all dropdowns
        nav.querySelectorAll('.dropdown.show').forEach(el => el.classList.remove('show'));
        nav.querySelectorAll('.dropdownToggle[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded','false'));

        // If the clicked one was closed, open it
        if (isOpening) {
          dd.classList.add('show');
          btn.setAttribute('aria-expanded','true');
        }
      });
    });

    // Click-away
    function away(e){
      if (nav.classList.contains('openSideBar') && !nav.contains(e.target)) onClose();
    }
    document.addEventListener('click', away);

    // API
    nav.open  = ()=> nav.classList.add('openSideBar');
    nav.close = ()=>{
      nav.classList.remove('openSideBar');
      nav.querySelectorAll('.dropdown.show').forEach(el=>el.classList.remove('show'));
      nav.querySelectorAll('.dropdownToggle[aria-expanded="true"]').forEach(b=>b.setAttribute('aria-expanded','false'));
    };
    nav.destroy = ()=>{
      document.removeEventListener('click', away);
      nav.remove();
    };

    return nav;
  }

  global.createSidebar = createSidebar;
})(window);

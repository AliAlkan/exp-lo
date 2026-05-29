const closeRoleMenus = (exceptMenu) => {
  document.querySelectorAll('[data-role-menu].is-open').forEach((menu) => {
    if (menu === exceptMenu) return;
    menu.classList.remove('is-open');
    menu.querySelector('[data-role-menu-trigger]')?.setAttribute('aria-expanded', 'false');
    const popover = menu.querySelector('.role-menu-popover');
    if (popover) {
      popover.hidden = true;
    }
  });
};

const openRoleMenu = (menu) => {
  closeRoleMenus(menu);
  menu.classList.add('is-open');
  menu.querySelector('[data-role-menu-trigger]')?.setAttribute('aria-expanded', 'true');
  const popover = menu.querySelector('.role-menu-popover');
  if (popover) {
    popover.hidden = false;
  }
};

const updateRoleMenu = (menu, value) => {
  menu.dataset.roleValue = value;
  menu.querySelector('[data-role-menu-label]').textContent = value;
  const input = menu.querySelector('[data-role-menu-input]');
  if (input) {
    input.value = value;
  }
  menu.querySelectorAll('[data-role-option]').forEach((option) => {
    const isSelected = option.dataset.roleOption === value;
    option.classList.toggle('selected', isSelected);
    option.setAttribute('aria-selected', String(isSelected));
  });
};

document.addEventListener('click', (event) => {
  document.querySelectorAll('.create-menu[open], .doc-more-menu[open], .row-more-menu[open], .workspace-more-menu[open], .comment-more-menu[open], .filter-menu[open], .selection-style-menu[open]').forEach((menu) => {
    if (!menu.contains(event.target)) {
      menu.removeAttribute('open');
    }
  });

  const target = event.target?.nodeType === 1 ? event.target : event.target?.parentElement;
  if (!target?.closest('[data-role-menu]')) {
    closeRoleMenus();
  }
});

document.addEventListener('click', (event) => {
  const target = event.target?.nodeType === 1 ? event.target : event.target?.parentElement;
  const trigger = target?.closest('[data-role-menu-trigger]');
  if (trigger) {
    const menu = trigger.closest('[data-role-menu]');
    if (!menu) return;
    event.preventDefault();
    if (menu.classList.contains('is-open')) {
      closeRoleMenus();
    } else {
      openRoleMenu(menu);
    }
    return;
  }

  const option = target?.closest('[data-role-option]');
  if (!option) return;
  const menu = option.closest('[data-role-menu]');
  if (!menu) return;
  updateRoleMenu(menu, option.dataset.roleOption || option.textContent.trim());
  closeRoleMenus();
  menu.querySelector('[data-role-menu-trigger]')?.focus();
});

document.addEventListener('keydown', (event) => {
  const target = event.target?.nodeType === 1 ? event.target : event.target?.parentElement;
  const trigger = target?.closest('[data-role-menu-trigger]');
  const option = target?.closest('[data-role-option]');
  const menu = target?.closest('[data-role-menu]');

  if (event.key === 'Escape') {
    closeRoleMenus();
    menu?.querySelector('[data-role-menu-trigger]')?.focus();
    return;
  }

  if (trigger && ['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
    event.preventDefault();
    const currentMenu = trigger.closest('[data-role-menu]');
    if (!currentMenu) return;
    openRoleMenu(currentMenu);
    const options = [...currentMenu.querySelectorAll('[data-role-option]')];
    const selectedIndex = options.findIndex((item) => item.classList.contains('selected'));
    const nextIndex = event.key === 'ArrowUp' ? options.length - 1 : Math.max(selectedIndex, 0);
    options[nextIndex]?.focus();
    return;
  }

  if (!option || !menu || !['Enter', ' ', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const options = [...menu.querySelectorAll('[data-role-option]')];
  const currentIndex = options.indexOf(option);
  if (event.key === 'Enter' || event.key === ' ') {
    updateRoleMenu(menu, option.dataset.roleOption || option.textContent.trim());
    closeRoleMenus();
    menu.querySelector('[data-role-menu-trigger]')?.focus();
    return;
  }
  const nextIndex = {
    ArrowDown: Math.min(currentIndex + 1, options.length - 1),
    ArrowUp: Math.max(currentIndex - 1, 0),
    Home: 0,
    End: options.length - 1,
  }[event.key];
  options[nextIndex]?.focus();
});

document.addEventListener('click', (event) => {
  const target = event.target?.nodeType === 1 ? event.target : event.target?.parentElement;
  const button = target?.closest('[data-attention-filter]');
  if (!button) return;
  const filters = button.closest('.attention-filters');
  const section = filters?.closest('.section');
  const rows = [...(section?.querySelectorAll('.task-list .task-row:not(.task-header)') || [])];
  if (!filters || !rows.length) return;

  const getAttentionStatus = (row) => {
    const status = row.querySelector('.status')?.textContent.trim().toLowerCase() || '';
    if (status.includes('draft')) return 'draft';
    if (status === 'in review') return 'in-review';
    if (status.includes('needs review') || status.includes('approval')) return 'approval-pending';
    return 'other';
  };

  const activeFilter = button.dataset.attentionFilter || 'all';
  filters.querySelectorAll('[data-attention-filter]').forEach((candidate) => {
    const isActive = candidate === button;
    candidate.classList.toggle('active', isActive);
    candidate.setAttribute('aria-pressed', String(isActive));
  });
  rows.forEach((row) => {
    row.hidden = activeFilter !== 'all' && getAttentionStatus(row) !== activeFilter;
  });
}, true);

document.addEventListener('click', (event) => {
  const target = event.target?.nodeType === 1 ? event.target : event.target?.parentElement;
  const button = target?.closest('[data-review-status-filter]');
  if (!button) return;
  const filters = button.closest('.review-status-filters');
  const section = filters?.closest('.section');
  const rows = [...(section?.querySelectorAll('.task-list .task-row:not(.task-header)') || [])];
  if (!filters || !rows.length) return;

  const getReviewStatus = (row) => {
    const status = row.querySelector('.status')?.textContent.trim().toLowerCase() || '';
    if (status === 'approved') return 'approved';
    if (status === 'change requested' || status === 'changes requested') return 'changes-requested';
    if (status === 'in review' || status === 'requires approval' || status === 'needs review') return 'needs-review';
    if (status === 'rejected' || status === 'closed' || status === 'rejected / closed') return 'closed';
    return 'other';
  };

  const activeFilter = button.dataset.reviewStatusFilter || 'all';
  filters.querySelectorAll('[data-review-status-filter]').forEach((candidate) => {
    const isActive = candidate === button;
    candidate.classList.toggle('active', isActive);
    candidate.setAttribute('aria-pressed', String(isActive));
  });
  rows.forEach((row) => {
    row.hidden = activeFilter !== 'all' && getReviewStatus(row) !== activeFilter;
  });
}, true);

document.addEventListener('click', (event) => {
  const target = event.target?.nodeType === 1 ? event.target : event.target?.parentElement;
  const button = target?.closest('[data-recents-tab]');
  if (!button) return;
  const tablist = button.closest('.recents-tabs, .home-mode-tabs');
  if (!tablist) return;

  tablist.querySelectorAll('[data-recents-tab]').forEach((candidate) => {
    const isActive = candidate === button;
    candidate.classList.toggle('active', isActive);
    candidate.setAttribute('aria-selected', String(isActive));
  });

  if (tablist.classList.contains('home-mode-tabs')) {
    const mode = button.dataset.recentsTab || 'recents';
    const homeSection = tablist.closest('.home-recents');
    homeSection?.querySelectorAll('[data-home-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.homePanel !== mode;
    });
    const scopeTabs = homeSection?.querySelector('.home-scope-tabs');
    const attentionTools = homeSection?.querySelector('[data-attention-tools]');
    if (scopeTabs) {
      scopeTabs.hidden = mode !== 'recents';
    }
    if (attentionTools) {
      attentionTools.hidden = mode !== 'attention';
    }
  }

  if (tablist.classList.contains('home-scope-tabs')) {
    const scope = button.dataset.recentsTab || 'everyone';
    const rows = [...(tablist.closest('.home-recents')?.querySelectorAll('[data-home-panel="recents"] .task-row:not(.task-header)') || [])];
    rows.forEach((row) => {
      row.hidden = scope === 'me' && row.dataset.recentsOwner !== 'me';
    });
  }
}, true);

const applyAttentionFilters = (homeSection) => {
  if (!homeSection) return;
  const query = homeSection.querySelector('[data-attention-search]')?.value.trim().toLowerCase() || '';
  const action = homeSection.querySelector('[data-attention-action-menu]')?.dataset.attentionAction || 'all';
  const rows = [...homeSection.querySelectorAll('[data-home-panel="attention"] .task-row:not(.task-header)')];

  rows.forEach((row) => {
    const matchesSearch = !query || row.textContent.toLowerCase().includes(query);
    const matchesAction = action === 'all' || row.dataset.attentionAction === action;
    row.hidden = !matchesSearch || !matchesAction;
  });
};

document.addEventListener('input', (event) => {
  const target = event.target?.nodeType === 1 ? event.target : event.target?.parentElement;
  const input = target?.closest('[data-attention-search]');
  if (!input) return;

  applyAttentionFilters(input.closest('.home-recents'));
}, true);

document.addEventListener('click', (event) => {
  const target = event.target?.nodeType === 1 ? event.target : event.target?.parentElement;
  const option = target?.closest('[data-attention-action-filter]');
  if (!option) return;

  const menu = option.closest('[data-attention-action-menu]');
  if (!menu) return;

  menu.dataset.attentionAction = option.dataset.attentionActionFilter || 'all';
  menu.querySelector('[data-attention-action-label]').textContent = option.textContent.trim();
  menu.querySelectorAll('[data-attention-action-filter]').forEach((candidate) => {
    const isSelected = candidate === option;
    candidate.classList.toggle('selected', isSelected);
    candidate.setAttribute('aria-current', String(isSelected));
  });
  menu.removeAttribute('open');
  applyAttentionFilters(menu.closest('.home-recents'));
}, true);

document.addEventListener('click', (event) => {
  const target = event.target?.nodeType === 1 ? event.target : event.target?.parentElement;
  const previous = target?.closest('[data-workspace-carousel-prev]');
  const next = target?.closest('[data-workspace-carousel-next]');
  if (!previous && !next) return;

  const section = target.closest('.home-workspaces');
  const carousel = section?.querySelector('[data-workspace-carousel]');
  const card = carousel?.querySelector('.home-workspace-card');
  if (!carousel || !card) return;

  const cardWidth = card.getBoundingClientRect().width;
  const styles = getComputedStyle(carousel);
  const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0;
  const direction = next ? 1 : -1;
  carousel.scrollBy({ left: direction * (cardWidth + gap), behavior: 'smooth' });
}, true);

const getAiDrawerApp = (element) => element?.closest('.home-app, .workspace-ai-app') || document.querySelector('.home-app, .workspace-ai-app');

const setAiDrawer = (app, isOpen) => {
  const drawer = app?.querySelector('[data-ai-drawer]');
  const toggles = app?.querySelectorAll('[data-ai-drawer-toggle]') || [];
  if (!app || !drawer) return;

  app.classList.toggle('ai-drawer-closed', !isOpen);
  drawer.hidden = !isOpen;
  drawer.setAttribute('aria-hidden', String(!isOpen));
  toggles.forEach((toggle) => {
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
};

document.addEventListener('click', (event) => {
  const target = event.target?.nodeType === 1 ? event.target : event.target?.parentElement;
  const toggle = target?.closest('[data-ai-drawer-toggle]');
  if (toggle) {
    const app = getAiDrawerApp(toggle);
    setAiDrawer(app, app?.classList.contains('ai-drawer-closed') ?? false);
    return;
  }

  if (target?.closest('[data-ai-drawer-close]')) {
    setAiDrawer(getAiDrawerApp(target), false);
  }
}, true);

document.querySelectorAll('.command').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
  });
});

document.querySelectorAll('[data-prompt-sample]').forEach((sample) => {
  sample.addEventListener('click', () => {
    const module = sample.closest('.workspace-command-module');
    const drawer = sample.closest('[data-ai-drawer]');
    const input = module?.querySelector('[data-command-input]') || drawer?.querySelector('[data-command-input]') || document.querySelector('#hub-search');
    if (!input) return;
    input.value = sample.dataset.promptSample || '';
    input.focus();
  });
});

const searchModalResults = [
  { type: 'folder', people: 'Ali P.', workspace: 'Learning Content', status: 'Folder', statusClass: 'neutral', title: 'Campaign assets', date: 'May 23, 2026', owner: 'Ali P.', initials: 'AP', swatch: 'learning', icon: 'task-folder-icon', search: 'campaign assets folder ali p. learning content may 23 2026' },
  { type: 'folder', people: 'Maya Stone', workspace: 'Student Affairs', status: 'Folder', statusClass: 'neutral', title: 'Orientation handoff', date: 'May 24, 2026', owner: 'Maya S.', initials: 'MS', avatarClass: 'violet', swatch: 'student', icon: 'task-folder-icon', search: 'orientation handoff folder maya stone student affairs may 24 2026' },
  { type: 'document', people: 'Maya Stone', workspace: 'Knowledge Base', status: 'Approved', title: 'Lab Access Policy v2', date: 'May 11, 2026', owner: 'Maya S.', initials: 'MS', avatarClass: 'violet', swatch: 'knowledge', icon: 'doc-icon', search: 'lab access policy v2 document maya stone knowledge base approved may 11 2026' },
  { type: 'document', people: 'Ali P.', workspace: 'Learning Content', status: 'Drafting', statusClass: 'blue', title: 'Summer Launch Kit', date: 'May 15, 2026', owner: 'Ali P.', initials: 'AP', swatch: 'learning', icon: 'doc-icon', search: 'summer launch kit document ali p. learning content drafting may 15 2026' },
  { type: 'spreadsheet', people: 'Ali P.', workspace: 'Manufacturer Contract Workspace', status: 'Needs review', statusClass: 'amber', title: 'Supplier Scorecard.xlsx', date: 'May 22, 2026', owner: 'Ali P.', initials: 'AP', swatch: 'research', icon: 'doc-icon', search: 'supplier scorecard xlsx spreadsheet ali p. manufacturer contract workspace needs review may 22 2026' },
  { type: 'document', people: 'Arman Kaya', workspace: 'Learning Content', status: 'Needs review', statusClass: 'amber', title: 'Course Module: Botanical Extraction', date: 'May 16, 2026', owner: 'Arman K.', initials: 'AK', avatarClass: 'green', swatch: 'learning', icon: 'doc-icon', search: 'course module botanical extraction document arman kaya learning content needs review may 16 2026' },
  { type: 'website', people: 'Ali P.', workspace: 'Student Affairs', status: 'Drafting', statusClass: 'blue', title: 'Student Portal Welcome Page', date: 'May 18, 2026', owner: 'Ali P.', initials: 'AP', swatch: 'student', icon: 'doc-icon', search: 'student portal welcome page website ali p. student affairs drafting may 18 2026' },
  { type: 'file', people: 'Maya Stone', workspace: 'Compliance Library', status: 'In review', statusClass: 'amber', title: 'Disclosure Language Matrix', date: 'May 18, 2026', owner: 'Maya S.', initials: 'MS', avatarClass: 'violet', swatch: 'compliance', icon: 'doc-icon', search: 'disclosure language matrix file maya stone compliance library in review may 18 2026' },
  { type: 'image', people: 'Ali P.', workspace: 'Knowledge Base', status: 'Approved', title: 'Campus Wayfinding Map', date: 'May 17, 2026', owner: 'Ali P.', initials: 'AP', swatch: 'knowledge', icon: 'doc-icon', search: 'campus wayfinding map image ali p. knowledge base approved may 17 2026' },
  { type: 'document', people: 'Arman Kaya', workspace: 'Faculty Newsroom', status: 'In review', statusClass: 'amber', title: 'Sample Handling SOP', date: 'May 13, 2026', owner: 'Arman K.', initials: 'AK', avatarClass: 'green', swatch: 'faculty', icon: 'doc-icon', search: 'sample handling sop document arman kaya faculty newsroom in review may 13 2026' },
];

const searchModalRecents = [
  { query: 'lab access policy', meta: 'Policy references' },
  { query: 'supplier scorecard', meta: 'Contract workspace' },
  { query: 'botanical extraction', meta: 'Learning modules' },
  { query: 'student portal', meta: 'Draft pages' },
];

const createSearchModal = () => {
  if (document.querySelector('[data-search-modal]')) return;

  const resultItems = searchModalResults.map((item) => `
    <li class="task-row" data-search-result data-type="${item.type}" data-people="${item.people}" data-workspace="${item.workspace}" data-status="${item.status}" data-search="${item.search}">
      <span class="checkbox" aria-hidden="true"></span>
      <span class="task-name"><span class="${item.icon}"></span> ${item.title}</span>
      <span class="muted">${item.date}</span>
      <span class="owner"><span class="owner-avatar${item.avatarClass ? ` ${item.avatarClass}` : ''}">${item.initials}</span> ${item.owner}</span>
      <span class="workspace-label"><span class="workspace-swatch ${item.swatch}" aria-hidden="true"></span> ${item.workspace}</span>
      <span class="status${item.statusClass ? ` ${item.statusClass}` : ''}">${item.status}</span>
    </li>
  `).join('');

  const recentItems = searchModalRecents.map((item) => `
    <button class="recent-search-item" type="button" data-recent-search="${item.query}">
      <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 7v5l3 2M5 5v5h5M5.7 14A7 7 0 1 0 7 7.1L5 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>
        <strong>${item.query}</strong>
        <small>${item.meta}</small>
      </span>
    </button>
  `).join('');

  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-backdrop search-modal-backdrop" data-search-modal hidden>
      <section class="search-modal" role="dialog" aria-modal="true" aria-labelledby="search-modal-title">
        <div class="search-modal-head">
          <h2 id="search-modal-title">Search Content Hub</h2>
          <button class="icon-btn" type="button" aria-label="Close search" data-search-modal-close>
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="search-shell search-modal-shell" data-search-page>
          <form class="search-command" data-search-form>
            <label class="sr-only" for="modal-content-search">Search Content Hub</label>
            <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="1.8"/>
              <path d="m16.5 16.5 4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            <input id="modal-content-search" type="search" placeholder="Search content" autocomplete="off" data-global-search>
            <button class="search-clear" type="button" aria-label="Clear search" data-search-clear hidden>
              <svg width="25" height="25" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </form>

          <section class="search-recents" data-search-recents aria-label="Recent searches">
            <h3>Recent searches</h3>
            <div class="search-recent-list">
              ${recentItems}
            </div>
          </section>

          <div class="content-filter-head search-filter-head">
            <div class="content-filter-bar" aria-label="Search filters">
              <details class="filter-menu" data-search-filter-menu="type">
                <summary class="filter-pill" aria-label="Filter by type">
                  <span data-filter-label>Type</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5" fill="currentColor"/></svg>
                </summary>
                <div class="filter-popover" role="menu" aria-label="Type options">
                  <button class="filter-option with-icon" type="button" role="menuitem" data-search-filter="type" data-filter-value="document"><span class="doc-icon"></span><span>Document</span></button>
                  <button class="filter-option with-icon" type="button" role="menuitem" data-search-filter="type" data-filter-value="spreadsheet"><span class="doc-icon"></span><span>Spreadsheet</span></button>
                  <button class="filter-option with-icon" type="button" role="menuitem" data-search-filter="type" data-filter-value="folder"><span class="task-folder-icon"></span><span>Folder</span></button>
                  <button class="filter-option with-icon" type="button" role="menuitem" data-search-filter="type" data-filter-value="file"><span class="doc-icon"></span><span>File</span></button>
                  <button class="filter-option with-icon" type="button" role="menuitem" data-search-filter="type" data-filter-value="website"><span class="doc-icon"></span><span>Website</span></button>
                  <button class="filter-option with-icon" type="button" role="menuitem" data-search-filter="type" data-filter-value="image"><span class="doc-icon"></span><span>Image</span></button>
                </div>
              </details>

              <details class="filter-menu" data-search-filter-menu="people">
                <summary class="filter-pill" aria-label="Filter by people">
                  <span data-filter-label>People</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5" fill="currentColor"/></svg>
                </summary>
                <div class="filter-popover" role="menu" aria-label="People options">
                  <label class="filter-search">
                    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><path d="m21 21-4.4-4.4M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
                    <input type="search" aria-label="Search people" placeholder="Search">
                  </label>
                  <button class="filter-option with-avatar" type="button" role="menuitem" data-search-filter="people" data-filter-value="Ali P."><span class="filter-avatar">AP</span><span>Ali P.</span></button>
                  <button class="filter-option with-avatar" type="button" role="menuitem" data-search-filter="people" data-filter-value="Maya Stone"><span class="filter-avatar violet">MS</span><span>Maya Stone</span></button>
                  <button class="filter-option with-avatar" type="button" role="menuitem" data-search-filter="people" data-filter-value="Arman Kaya"><span class="filter-avatar green">AK</span><span>Arman Kaya</span></button>
                </div>
              </details>

              <details class="filter-menu" data-search-filter-menu="workspace">
                <summary class="filter-pill" aria-label="Filter by workspace">
                  <span data-filter-label>Workspace</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5" fill="currentColor"/></svg>
                </summary>
                <div class="filter-popover wide" role="menu" aria-label="Workspace options">
                  <button class="filter-option with-dot" type="button" role="menuitem" data-search-filter="workspace" data-filter-value="Knowledge Base"><span class="workspace-swatch knowledge" aria-hidden="true"></span><span>Knowledge Base</span></button>
                  <button class="filter-option with-dot" type="button" role="menuitem" data-search-filter="workspace" data-filter-value="Learning Content"><span class="workspace-swatch learning" aria-hidden="true"></span><span>Learning Content</span></button>
                  <button class="filter-option with-dot" type="button" role="menuitem" data-search-filter="workspace" data-filter-value="Manufacturer Contract Workspace"><span class="workspace-swatch research" aria-hidden="true"></span><span>Manufacturer Contract Workspace</span></button>
                  <button class="filter-option with-dot" type="button" role="menuitem" data-search-filter="workspace" data-filter-value="Compliance Library"><span class="workspace-swatch compliance" aria-hidden="true"></span><span>Compliance Library</span></button>
                </div>
              </details>

              <details class="filter-menu" data-search-filter-menu="status">
                <summary class="filter-pill" aria-label="Filter by status">
                  <span data-filter-label>Status</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5" fill="currentColor"/></svg>
                </summary>
                <div class="filter-popover" role="menu" aria-label="Status options">
                  <button class="filter-option" type="button" role="menuitem" data-search-filter="status" data-filter-value="Approved">Approved</button>
                  <button class="filter-option" type="button" role="menuitem" data-search-filter="status" data-filter-value="Drafting">Drafting</button>
                  <button class="filter-option" type="button" role="menuitem" data-search-filter="status" data-filter-value="Needs review">Needs review</button>
                  <button class="filter-option" type="button" role="menuitem" data-search-filter="status" data-filter-value="In review">In review</button>
                </div>
              </details>
            </div>
          </div>

          <div class="panel search-results-panel" data-search-results-panel hidden>
            <ul class="task-list search-results-list" aria-label="Search results">
              ${resultItems}
            </ul>
            <div class="search-empty" data-search-empty hidden>No results</div>
          </div>
        </div>
      </section>
    </div>
  `);
};

createSearchModal();

const createFolderModal = () => {
  const folderTriggers = [...document.querySelectorAll('.create-option')].filter((option) => {
    return option.textContent.trim() === 'New folder';
  });
  if (!folderTriggers.length || document.querySelector('[data-folder-modal]')) return;

  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-backdrop" data-folder-modal hidden>
      <section class="workspace-modal folder-modal" role="dialog" aria-modal="true" aria-labelledby="folder-modal-title">
        <div class="workspace-modal-head">
          <h2 id="folder-modal-title">New folder</h2>
          <button class="icon-btn" type="button" aria-label="Close new folder" data-folder-modal-close>
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <form class="workspace-modal-form" data-folder-modal-form>
          <label for="folder-name">Folder name</label>
          <input id="folder-name" type="text" name="folder-name" placeholder="Name this folder" autocomplete="off" required data-folder-name-input>
          <div class="workspace-modal-actions">
            <button class="secondary-btn" type="button" data-folder-modal-close>Cancel</button>
            <button class="primary-btn" type="submit">Create</button>
          </div>
        </form>
      </section>
    </div>
  `);
};

createFolderModal();

document.querySelectorAll('[data-folder-modal]').forEach((modal) => {
  const input = modal.querySelector('[data-folder-name-input]');
  const form = modal.querySelector('[data-folder-modal-form]');
  const closeButtons = [...modal.querySelectorAll('[data-folder-modal-close]')];

  const closeModal = () => {
    modal.hidden = true;
    form?.reset();
  };

  [...document.querySelectorAll('.create-option')].filter((option) => {
    return option.textContent.trim() === 'New folder';
  }).forEach((trigger) => {
    trigger.addEventListener('click', () => {
      trigger.closest('.create-menu')?.removeAttribute('open');
      modal.hidden = false;
      input?.focus();
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    closeModal();
  });
});

const createUploadPanel = () => {
  const uploadTriggers = [...document.querySelectorAll('.create-option')].filter((option) => {
    return ['Upload file', 'Upload files', 'Upload folder'].includes(option.textContent.trim());
  });
  if (!uploadTriggers.length || document.querySelector('[data-upload-panel]')) return;

  document.body.insertAdjacentHTML('beforeend', `
    <aside class="upload-panel" data-upload-panel hidden aria-label="Upload status">
      <header class="upload-panel-head">
        <h2>Uploading 2 items</h2>
        <div class="upload-panel-actions">
          <button class="upload-cancel-all" type="button">Cancel all</button>
          <button class="upload-icon-button" type="button" data-upload-collapse aria-label="Collapse uploads">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m7 10 5 5 5-5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="upload-icon-button" type="button" data-upload-close aria-label="Close uploads">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </header>
      <div class="upload-panel-body">
        <p class="upload-destination">Uploading to <a href="my-content.html">My content</a></p>
        <div class="upload-list">
          <article class="upload-item uploading">
            <span class="upload-item-icon loader" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M21 12a9 9 0 1 1-6.2-8.6" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>
              </svg>
            </span>
            <div class="upload-item-main">
              <strong>Supplier references packet</strong>
              <span><b>PDF</b> Uploading - 4.3mb / 8.4mb - 3 seconds left...</span>
              <div class="upload-progress" aria-label="Upload progress"><span style="width: 52%"></span></div>
            </div>
            <button class="upload-row-action" type="button">Cancel</button>
          </article>
          <article class="upload-item complete">
            <span class="upload-item-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="m5 12 4 4L19 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <div class="upload-item-main">
              <strong>Policy archive index</strong>
              <span><b>HTML</b> Uploaded to <a href="my-content.html">My content</a></span>
            </div>
          </article>
        </div>
      </div>
    </aside>
  `);
};

createUploadPanel();

document.querySelectorAll('[data-upload-panel]').forEach((panel) => {
  const close = panel.querySelector('[data-upload-close]');
  const collapse = panel.querySelector('[data-upload-collapse]');

  [...document.querySelectorAll('.create-option')].filter((option) => {
    return ['Upload file', 'Upload files', 'Upload folder'].includes(option.textContent.trim());
  }).forEach((trigger) => {
    trigger.addEventListener('click', () => {
      trigger.closest('.create-menu')?.removeAttribute('open');
      panel.hidden = false;
      panel.classList.remove('is-collapsed');
    });
  });

  close?.addEventListener('click', () => {
    panel.hidden = true;
  });

  collapse?.addEventListener('click', () => {
    const isCollapsed = panel.classList.toggle('is-collapsed');
    collapse.setAttribute('aria-label', isCollapsed ? 'Expand uploads' : 'Collapse uploads');
  });
});

document.querySelectorAll('.row-more-menu').forEach((menu) => {
  menu.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  menu.addEventListener('keydown', (event) => {
    event.stopPropagation();
  });

  menu.addEventListener('toggle', () => {
    if (!menu.open) return;
    document.querySelectorAll('.row-more-menu[open]').forEach((otherMenu) => {
      if (otherMenu !== menu) {
        otherMenu.removeAttribute('open');
      }
    });
  });
});

document.querySelectorAll('.task-row:not(.task-header) .checkbox').forEach((checkbox) => {
  const row = checkbox.closest('.task-row');
  const title = row?.querySelector('.task-name')?.textContent?.trim();

  checkbox.setAttribute('role', 'checkbox');
  checkbox.setAttribute('tabindex', '0');
  checkbox.setAttribute('aria-checked', 'false');
  checkbox.setAttribute('aria-label', title ? `Select ${title}` : 'Select item');

  const toggleSelected = () => {
    const isSelected = checkbox.getAttribute('aria-checked') === 'true';
    checkbox.setAttribute('aria-checked', String(!isSelected));
    checkbox.classList.toggle('is-selected', !isSelected);
    row?.classList.toggle('is-selected', !isSelected);
  };

  checkbox.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleSelected();
  });

  checkbox.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    event.stopPropagation();
    toggleSelected();
  });
});

document.querySelectorAll('.row-more-option').forEach((option) => {
  option.addEventListener('click', () => {
    option.closest('.row-more-menu')?.removeAttribute('open');
  });
});

document.querySelectorAll('.comment-more-menu').forEach((menu) => {
  menu.addEventListener('toggle', () => {
    if (!menu.open) return;
    document.querySelectorAll('.comment-more-menu[open]').forEach((otherMenu) => {
      if (otherMenu !== menu) {
        otherMenu.removeAttribute('open');
      }
    });
  });
});

document.querySelectorAll('.comment-more-option').forEach((option) => {
  option.addEventListener('click', () => {
    option.closest('.comment-more-menu')?.removeAttribute('open');
  });
});

const getFilterLabel = (menu) => menu?.querySelector('[data-filter-label]') || menu?.querySelector('.filter-pill > span');

const toDefaultFilterLabel = (menu) => {
  const key = menu?.dataset.searchFilterMenu;
  const label = getFilterLabel(menu);
  const fallback = label?.textContent?.trim() || '';
  const defaultLabel = menu?.dataset.filterDefaultLabel || (key ? key.charAt(0).toUpperCase() + key.slice(1) : fallback);
  if (menu && !menu.dataset.filterDefaultLabel) {
    menu.dataset.filterDefaultLabel = defaultLabel;
  }
  return defaultLabel;
};

const getOptionLabel = (option) => {
  const textTarget = option?.querySelector?.('span:not(.filter-avatar):not(.workspace-swatch)') || option;
  return option?.dataset.filterValue || textTarget?.textContent?.trim() || '';
};

const ensureFilterReset = (menu) => {
  if (!menu || menu.classList.contains('sort-menu')) return;
  const pill = menu.querySelector('.filter-pill');
  if (!pill || pill.querySelector('[data-filter-reset]')) return;

  const reset = document.createElement('button');
  reset.className = 'filter-reset';
  reset.type = 'button';
  reset.hidden = true;
  reset.setAttribute('data-filter-reset', '');
  reset.setAttribute('aria-label', `Reset ${toDefaultFilterLabel(menu)} filter`);
  reset.innerHTML = '<svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
  pill.append(reset);
};

const setFilterMenuState = (menu, option = null) => {
  if (!menu || menu.classList.contains('sort-menu')) return;

  ensureFilterReset(menu);
  const label = getFilterLabel(menu);
  const reset = menu.querySelector('[data-filter-reset]');
  const isActive = Boolean(option);

  menu.classList.toggle('is-active', isActive);
  menu.dataset.filterActive = isActive ? 'true' : 'false';
  menu.querySelector('.filter-pill')?.classList.toggle('is-active', isActive);
  menu.querySelectorAll('.filter-option').forEach((candidate) => {
    candidate.classList.toggle('selected', isActive && candidate === option);
  });

  if (label) {
    label.textContent = isActive ? getOptionLabel(option) : toDefaultFilterLabel(menu);
  }

  if (reset) {
    reset.hidden = !isActive;
  }
};

document.querySelectorAll('.content-filter-head:not(.search-filter-head)').forEach((head) => {
  const filterBar = head.querySelector('.content-filter-bar');
  if (!filterBar || filterBar.querySelector('[data-date-filter-menu="modified"]')) return;

  const filterScope = head.closest('.section, .workspace-all-files') || head;
  if (!filterScope.textContent.includes('Date modified')) return;

  const modifiedFilter = document.createElement('details');
  modifiedFilter.className = 'filter-menu';
  modifiedFilter.dataset.dateFilterMenu = 'modified';
  modifiedFilter.innerHTML = `
    <summary class="filter-pill" aria-label="Filter by modified date">
      <span data-filter-label>Modified</span>
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path d="m7 10 5 5 5-5" fill="currentColor"/>
      </svg>
    </summary>
    <div class="filter-popover date-filter-popover" role="group" aria-label="Modified date range">
      <label class="date-filter-field">
        <span class="sr-only">Modified after</span>
        <input type="text" inputmode="numeric" placeholder="After" aria-label="Modified after">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 3v4M17 3v4M4 9h16M6 5h12a2 2 0 0 1 2 2v12H4V7a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
        </svg>
      </label>
      <label class="date-filter-field">
        <span class="sr-only">Modified before</span>
        <input type="text" inputmode="numeric" placeholder="Before" aria-label="Modified before">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 3v4M17 3v4M4 9h16M6 5h12a2 2 0 0 1 2 2v12H4V7a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
        </svg>
      </label>
    </div>
  `;

  const statusFilter = [...filterBar.querySelectorAll('.filter-menu')].find((menu) => {
    const label = getFilterLabel(menu)?.textContent?.trim();
    return label === 'Status';
  });

  if (statusFilter) {
    statusFilter.before(modifiedFilter);
  } else {
    filterBar.append(modifiedFilter);
  }
});

document.querySelectorAll('.filter-menu').forEach((menu) => {
  ensureFilterReset(menu);
  if (!menu.classList.contains('sort-menu')) {
    const initialSelected = menu.querySelector('.filter-option.selected');
    if (initialSelected) {
      setFilterMenuState(menu, initialSelected);
    }
  }

  menu.addEventListener('toggle', () => {
    if (!menu.open) return;
    document.querySelectorAll('.filter-menu[open]').forEach((otherMenu) => {
      if (otherMenu !== menu) {
        otherMenu.removeAttribute('open');
      }
    });
  });

  menu.querySelector('[data-filter-reset]')?.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    event.stopPropagation();
  });

  menu.querySelector('[data-filter-reset]')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    menu.removeAttribute('open');
    const resetEvent = new CustomEvent('filter-reset', { bubbles: true, cancelable: true });
    menu.dispatchEvent(resetEvent);
    if (!resetEvent.defaultPrevented) {
      setFilterMenuState(menu);
    }
  });
});

document.querySelectorAll('[data-date-filter-menu]').forEach((menu) => {
  const inputs = [...menu.querySelectorAll('.date-filter-field input')];

  const syncDateFilterState = () => {
    const hasValue = inputs.some((input) => input.value.trim());
    setFilterMenuState(menu, hasValue ? { dataset: { filterValue: 'Modified' } } : null);
  };

  inputs.forEach((input) => {
    input.addEventListener('input', syncDateFilterState);
  });

  menu.addEventListener('filter-reset', (event) => {
    event.preventDefault();
    inputs.forEach((input) => {
      input.value = '';
    });
    setFilterMenuState(menu);
  });
});

document.querySelectorAll('.filter-option').forEach((option) => {
  option.addEventListener('click', () => {
    const menu = option.closest('.filter-menu');
    if (menu && !menu.classList.contains('sort-menu')) {
      const wasSelected = option.classList.contains('selected');
      setFilterMenuState(menu, wasSelected ? null : option);
    }
    menu?.removeAttribute('open');
  });
});

document.querySelectorAll('.content-filter-head:not(.search-filter-head)').forEach((head) => {
  const filterBar = head.querySelector('.content-filter-bar');
  const section = head.closest('.section');
  const workspaceFiles = head.closest('.workspace-all-files');
  const rows = [
    ...(section?.querySelectorAll('.task-list .task-row:not(.task-header)') || []),
    ...(workspaceFiles?.querySelectorAll('[data-workspace-item]') || []),
  ];
  if (!filterBar || !rows.length || filterBar.querySelector('[data-contextual-search]')) return;

  const isWorkspaceDocuments = Boolean(workspaceFiles);
  let activeWorkspaceContentFilter = 'all';

  const search = document.createElement('label');
  search.className = 'contextual-search';
  search.innerHTML = `
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m21 21-4.4-4.4M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>
    <input type="search" aria-label="Search this list" placeholder="Search" data-contextual-search>
  `;

  filterBar.prepend(search);

  const inferWorkspaceContentType = (row) => {
    if (row.dataset.contentType) return row.dataset.contentType;
    if (row.dataset.status === 'folder') return 'files';

    const searchable = `${row.dataset.search || ''} ${row.textContent}`.toLowerCase();
    if (/\b(site|website)\b/.test(searchable)) return 'sites';
    if (/\b(page|portal)\b/.test(searchable)) return 'pages';
    return 'files';
  };

  if (isWorkspaceDocuments) {
    head.classList.add('workspace-content-filter-head');

    const quickFilters = document.createElement('div');
    quickFilters.className = 'workspace-content-filters';
    quickFilters.setAttribute('aria-label', 'Filter documents by content type');
    quickFilters.innerHTML = `
      <button class="workspace-content-filter active" type="button" data-workspace-content-filter="all" aria-pressed="true">All content</button>
      <button class="workspace-content-filter" type="button" data-workspace-content-filter="recents" aria-pressed="false">Recents</button>
      <button class="workspace-content-filter" type="button" data-workspace-content-filter="pages" aria-pressed="false">Pages</button>
      <button class="workspace-content-filter" type="button" data-workspace-content-filter="files" aria-pressed="false">Files</button>
      <button class="workspace-content-filter" type="button" data-workspace-content-filter="sites" aria-pressed="false">Sites</button>
      <button class="workspace-content-filter" type="button" data-workspace-content-filter="published" aria-pressed="false">Published</button>
    `;
    head.append(quickFilters);

    quickFilters.querySelectorAll('[data-workspace-content-filter]').forEach((button) => {
      button.addEventListener('click', () => {
        activeWorkspaceContentFilter = button.dataset.workspaceContentFilter || 'all';
        quickFilters.querySelectorAll('[data-workspace-content-filter]').forEach((candidate) => {
          const isActive = candidate === button;
          candidate.classList.toggle('active', isActive);
          candidate.setAttribute('aria-pressed', String(isActive));
        });
        applyContextualFilters();
      });
    });
  }

  const matchesWorkspaceContentFilter = (row) => {
    if (!isWorkspaceDocuments || activeWorkspaceContentFilter === 'all') return true;
    if (activeWorkspaceContentFilter === 'recents') return rows.indexOf(row) < 5;
    if (activeWorkspaceContentFilter === 'published') return row.dataset.status === 'published';
    return inferWorkspaceContentType(row) === activeWorkspaceContentFilter;
  };

  const applyContextualFilters = () => {
    const query = input?.value.trim().toLowerCase() || '';
    let visibleCount = 0;

    rows.forEach((row) => {
      const searchable = `${row.dataset.search || ''} ${row.textContent}`.toLowerCase();
      const matchesSearch = !query || searchable.includes(query);
      const isVisible = matchesSearch && matchesWorkspaceContentFilter(row);
      row.hidden = !isVisible;
      if (isVisible) {
        visibleCount += 1;
      }
    });

    const empty = workspaceFiles?.querySelector('[data-workspace-empty]');
    if (empty) {
      empty.hidden = visibleCount > 0;
    }
  };

  const input = search.querySelector('[data-contextual-search]');
  input?.addEventListener('input', applyContextualFilters);
});

document.querySelectorAll('.selection-style-option').forEach((option) => {
  option.addEventListener('click', () => {
    option.closest('.selection-style-menu')?.removeAttribute('open');
  });
});

document.querySelectorAll('[data-search-page]').forEach((page) => {
  const input = page.querySelector('[data-global-search]');
  const clear = page.querySelector('[data-search-clear]');
  const panel = page.querySelector('[data-search-results-panel]');
  const empty = page.querySelector('[data-search-empty]');
  const recents = page.querySelector('[data-search-recents]');
  const results = [...page.querySelectorAll('[data-search-result]')];
  const activeFilters = {
    type: '',
    people: '',
    workspace: '',
    status: ''
  };

  const normalize = (value) => (value || '').trim().toLowerCase();

  const applySearch = () => {
    const query = normalize(input?.value);
    const hasActiveFilter = Object.values(activeFilters).some(Boolean);
    const shouldShowResults = Boolean(query) || hasActiveFilter;
    let visibleCount = 0;

    results.forEach((result) => {
      const matchesQuery = !query || normalize(result.dataset.search).includes(query);
      const matchesFilters = Object.entries(activeFilters).every(([key, value]) => {
        return !value || normalize(result.dataset[key]) === normalize(value);
      });
      const isVisible = shouldShowResults && matchesQuery && matchesFilters;
      result.hidden = !isVisible;
      if (isVisible) {
        visibleCount += 1;
      }
    });

    if (panel) {
      panel.hidden = !shouldShowResults;
    }

    if (recents) {
      recents.hidden = shouldShowResults;
    }

    if (empty) {
      empty.hidden = panel?.hidden || visibleCount > 0;
    }

    if (clear) {
      clear.hidden = !query;
    }
  };

  page.querySelectorAll('[data-search-filter]').forEach((option) => {
    option.addEventListener('click', () => {
      const key = option.dataset.searchFilter;
      const value = option.dataset.filterValue || '';
      const menu = option.closest('[data-search-filter-menu]');
      const isActive = activeFilters[key] === value;

      activeFilters[key] = isActive ? '' : value;
      setFilterMenuState(menu, isActive ? null : option);

      applySearch();
    });
  });

  page.querySelectorAll('[data-search-filter-menu]').forEach((menu) => {
    menu.addEventListener('filter-reset', (event) => {
      event.preventDefault();
      const key = menu.dataset.searchFilterMenu;
      if (key) {
        activeFilters[key] = '';
      }
      setFilterMenuState(menu);
      applySearch();
    });
  });

  input?.addEventListener('input', applySearch);
  clear?.addEventListener('click', () => {
    if (!input) return;
    input.value = '';
    input.focus();
    applySearch();
  });

  page.querySelectorAll('[data-recent-search]').forEach((recent) => {
    recent.addEventListener('click', () => {
      if (!input) return;
      input.value = recent.dataset.recentSearch || '';
      input.focus();
      applySearch();
    });
  });

  page.querySelector('[data-search-form]')?.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  applySearch();
});

document.querySelectorAll('[data-people-directory]').forEach((directory) => {
  const search = directory.querySelector('[data-people-search]');
  const rows = [...directory.querySelectorAll('[data-people-row]')];
  const empty = directory.querySelector('[data-people-empty]');
  const activeFilters = {
    role: '',
    status: ''
  };
  const normalize = (value) => (value || '').trim().toLowerCase();

  const applyPeopleFilters = () => {
    const query = normalize(search?.value);
    let visibleCount = 0;

    rows.forEach((row) => {
      const matchesQuery = !query || normalize(`${row.dataset.search || ''} ${row.textContent}`).includes(query);
      const matchesFilters = Object.entries(activeFilters).every(([key, value]) => {
        return !value || normalize(row.dataset[`people${key.charAt(0).toUpperCase()}${key.slice(1)}`]) === normalize(value);
      });
      const isVisible = matchesQuery && matchesFilters;
      row.hidden = !isVisible;
      if (isVisible) {
        visibleCount += 1;
      }
    });

    if (empty) {
      empty.hidden = visibleCount > 0;
    }
  };

  search?.addEventListener('input', applyPeopleFilters);

  directory.querySelectorAll('[data-people-filter]').forEach((option) => {
    option.addEventListener('click', () => {
      const key = option.dataset.peopleFilter;
      if (!key) return;
      const value = option.dataset.filterValue || '';
      activeFilters[key] = activeFilters[key] === value ? '' : value;
      applyPeopleFilters();
    });
  });

  directory.querySelectorAll('[data-people-filter-menu]').forEach((menu) => {
    menu.addEventListener('filter-reset', (event) => {
      event.preventDefault();
      const key = menu.dataset.peopleFilterMenu;
      if (key) {
        activeFilters[key] = '';
      }
      setFilterMenuState(menu);
      applyPeopleFilters();
    });
  });

  applyPeopleFilters();
});

document.querySelectorAll('[data-search-modal]').forEach((modal) => {
  const input = modal.querySelector('[data-global-search]');
  const closeButtons = [...modal.querySelectorAll('[data-search-modal-close]')];

  const closeModal = () => {
    modal.hidden = true;
  };

  document.querySelectorAll('[data-open-search-modal]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      modal.hidden = false;
      input?.focus();
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
});

document.querySelectorAll('.workspace-more-option').forEach((option) => {
  option.addEventListener('click', () => {
    option.closest('.workspace-more-menu')?.removeAttribute('open');
  });
});

document.querySelectorAll('[data-document-card]').forEach((card) => {
  card.addEventListener('click', () => {
    window.location.href = card.dataset.documentCard;
  });
});

const workspaceSetupNote = 'You can change this later from workspace settings.';

const workspaceSetupFields = () => `
        <fieldset class="workspace-template-group">
          <legend>Workspace setup</legend>
          <label class="workspace-template-option">
            <input type="radio" name="workspace-template" value="workflow" checked>
            <span class="workspace-template-copy">
              <strong>Workflow workspace</strong>
              <span>Track items through Draft, In review, In approval, and Published.</span>
            </span>
          </label>
          <label class="workspace-template-option">
            <input type="radio" name="workspace-template" value="library">
            <span class="workspace-template-copy">
              <strong>Library workspace</strong>
              <span>Keep content organized without item statuses or task stages.</span>
            </span>
          </label>
          <p class="workspace-template-note">${workspaceSetupNote}</p>
        </fieldset>
`;

const workspaceModalTemplate = () => `
  <div class="modal-backdrop" data-workspace-modal hidden>
    <section class="workspace-modal workspace-create-modal" role="dialog" aria-modal="true" aria-labelledby="workspace-modal-title">
      <div class="workspace-modal-head">
        <h2 id="workspace-modal-title">Create workspace</h2>
        <button class="icon-btn" type="button" aria-label="Close create workspace" data-workspace-modal-close>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <form class="workspace-modal-form" data-workspace-modal-form>
        <label for="workspace-name">Workspace name</label>
        <input id="workspace-name" type="text" name="workspace-name" placeholder="Name this workspace" autocomplete="off" required data-workspace-name-input>
${workspaceSetupFields()}        <div class="workspace-modal-actions">
          <button class="secondary-btn" type="button" data-workspace-modal-close>Cancel</button>
          <button class="primary-btn" type="submit">Create</button>
        </div>
      </form>
    </section>
  </div>
`;

const ensureWorkspaceModal = () => {
  if (!document.querySelector('[data-workspace-create]') || document.querySelector('[data-workspace-modal]')) return;
  document.body.insertAdjacentHTML('beforeend', workspaceModalTemplate());
};

const enhanceWorkspaceModal = (modal) => {
  modal.querySelector('.workspace-modal')?.classList.add('workspace-create-modal');
  const form = modal.querySelector('[data-workspace-modal-form]');
  const nameInput = form?.querySelector('[data-workspace-name-input]');
  let setupGroup = form?.querySelector('.workspace-template-group');

  if (!setupGroup) {
    nameInput?.insertAdjacentHTML('afterend', workspaceSetupFields());
    setupGroup = form?.querySelector('.workspace-template-group');
  }

  const setupNote = setupGroup?.querySelector('.workspace-template-note');
  if (setupNote) {
    setupNote.textContent = workspaceSetupNote;
  } else {
    setupGroup?.insertAdjacentHTML('beforeend', `<p class="workspace-template-note">${workspaceSetupNote}</p>`);
  }
};

ensureWorkspaceModal();

document.querySelectorAll('[data-workspace-modal]').forEach((modal) => {
  enhanceWorkspaceModal(modal);
  const input = modal.querySelector('[data-workspace-name-input]');
  const form = modal.querySelector('[data-workspace-modal-form]');
  const closeButtons = [...modal.querySelectorAll('[data-workspace-modal-close]')];

  const closeModal = () => {
    modal.hidden = true;
  };

  closeButtons.forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    closeModal();
  });
});

document.addEventListener('click', (event) => {
  const target = event.target?.nodeType === 1 ? event.target : event.target?.parentElement;
  const trigger = target?.closest('[data-workspace-create]');
  if (!trigger) return;

  const modal = document.querySelector('[data-workspace-modal]');
  const input = modal?.querySelector('[data-workspace-name-input]');
  if (!modal) return;

  event.preventDefault();
  trigger.closest('.create-menu')?.removeAttribute('open');
  modal.hidden = false;
  input?.focus();
}, true);

document.querySelectorAll('[data-workspace-settings-modal]').forEach((modal) => {
  const input = modal.querySelector('[data-workspace-settings-name]');
  const form = modal.querySelector('[data-workspace-settings-form]');
  const closeButtons = [...modal.querySelectorAll('[data-workspace-settings-close]')];

  const closeModal = () => {
    modal.hidden = true;
  };

  document.querySelectorAll('[data-open-workspace-settings]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      modal.hidden = false;
      input?.focus();
      input?.select();
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const nextName = input?.value.trim();
    if (nextName) {
      document.querySelector('.workspace-page h1').textContent = nextName;
    }
    closeModal();
  });
});

const createRoleMenuMarkup = ({ label, selected = 'Viewer', includeRemove = false, inputName = '' }) => {
  const options = ['Viewer', 'Commenter', 'Editor', 'Admin', ...(includeRemove ? ['Remove'] : [])];
  const input = inputName ? `<input type="hidden" name="${inputName}" value="${selected}" data-role-menu-input>` : '';

  return `
    <div class="${includeRemove ? 'share-access-role' : 'share-role-select'} role-menu" data-role-menu data-role-value="${selected}">
      <button class="role-menu-trigger" type="button" aria-haspopup="listbox" aria-expanded="false" aria-label="${label}" data-role-menu-trigger>
        <span data-role-menu-label>${selected}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m7 10 5 5 5-5" fill="currentColor"/>
        </svg>
      </button>
      ${input}
      <div class="role-menu-popover" role="listbox" aria-label="${label} options" hidden>
        ${options.map((option) => `
          <button class="role-menu-option${option === selected ? ' selected' : ''}${option === 'Remove' ? ' danger' : ''}" type="button" role="option" aria-selected="${option === selected}" data-role-option="${option}">
            <span>${option}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m5 12 4 4L19 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        `).join('')}
      </div>
    </div>
  `;
};

const upgradeNativeRoleMenus = () => {
  document.querySelectorAll('.share-role-select select, .share-access-role select').forEach((select) => {
    const wrapper = select.closest('.share-role-select, .share-access-role');
    if (!wrapper || wrapper.matches('[data-role-menu]')) return;

    const isAccessRole = wrapper.classList.contains('share-access-role');
    const selectedOption = select.options[select.selectedIndex] || select.options[0];
    const label = select.getAttribute('aria-label') || 'Permission role';
    wrapper.outerHTML = createRoleMenuMarkup({
      label,
      selected: selectedOption?.textContent.trim() || 'Viewer',
      includeRemove: isAccessRole,
      inputName: isAccessRole ? '' : 'permission-role',
    });
  });
};

const createShareModal = () => {
  if (!document.querySelector('[data-open-share-modal]') || document.querySelector('[data-share-modal]')) return;

  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-backdrop" data-share-modal hidden>
      <section class="share-modal" role="dialog" aria-modal="true" aria-labelledby="share-modal-title">
        <div class="share-modal-head">
          <h2 id="share-modal-title">Invite to collaborate</h2>
          <button class="icon-btn" type="button" aria-label="Close share" data-share-modal-close>
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="share-modal-body">
          <section class="share-modal-section">
            <h3>Share by workgroup</h3>
            <form class="share-workgroup-form" data-share-form>
              <div class="share-search-wrap">
                <label class="share-search">
                  <span class="sr-only">Search for users or groups</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="1.8"/>
                    <path d="m16.5 16.5 4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                  </svg>
                  <input type="search" placeholder="Search for users or groups" data-share-search aria-controls="share-suggestions-document" autocomplete="off">
                </label>
                <div class="share-suggestions" id="share-suggestions-document" data-share-suggestions hidden></div>
              </div>
              ${createRoleMenuMarkup({ label: 'Permission role', inputName: 'permission-role' })}
              <button class="secondary-btn share-submit" type="submit">Share</button>
            </form>
          </section>
          <section class="share-modal-section">
            <h3>Who can access</h3>
            <div class="share-access-list">
              <div class="share-access-row">
                <span class="share-access-avatar">MS</span>
                <span class="share-access-person">
                  <strong>Maya Stone</strong>
                  <span>maya.stone@example.com</span>
                </span>
                <span class="share-role-pill">Owner</span>
              </div>
              <div class="share-access-row">
                <span class="share-access-avatar violet">JB</span>
                <span class="share-access-person">
                  <strong>Jonah Blake</strong>
                  <span>jonah.blake@example.com</span>
                </span>
                ${createRoleMenuMarkup({ label: 'Jonah Blake permission role', includeRemove: true })}
              </div>
              <div class="share-access-row">
                <span class="share-access-avatar group">PR</span>
                <span class="share-access-person">
                  <strong>Procurement Review</strong>
                  <span>Group · 6 members</span>
                </span>
                ${createRoleMenuMarkup({ label: 'Procurement Review permission role', selected: 'Editor', includeRemove: true })}
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  `);
};

createShareModal();
upgradeNativeRoleMenus();

const openShareModal = () => {
  const modal = document.querySelector('[data-share-modal]');
  if (!modal) return;
  modal.hidden = false;
  modal.querySelector('[data-share-search]')?.focus();
};

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-open-share-modal]');
  if (!trigger) return;
  event.preventDefault();
  openShareModal();
});

document.querySelectorAll('[data-share-modal]').forEach((modal) => {
  const input = modal.querySelector('[data-share-search]');
  const form = modal.querySelector('[data-share-form]');
  const suggestions = modal.querySelector('[data-share-suggestions]');
  const closeButtons = [...modal.querySelectorAll('[data-share-modal-close]')];
  const suggestionItems = [
    { name: 'Maya Stone', meta: 'maya.stone@example.com', type: 'User', initials: 'MS' },
    { name: 'Jonah Blake', meta: 'jonah.blake@example.com', type: 'User', initials: 'JB' },
    { name: 'Omar Silva', meta: 'omar.silva@example.com', type: 'User', initials: 'OS' },
    { name: 'Procurement Review', meta: 'Group · 6 members', type: 'Group', initials: 'PR' },
    { name: 'Policy Editors', meta: 'Group · 4 members', type: 'Group', initials: 'PE' },
  ];

  const closeModal = () => {
    modal.hidden = true;
    if (suggestions) {
      suggestions.hidden = true;
    }
  };
  const hideSuggestions = () => {
    if (suggestions) {
      suggestions.hidden = true;
    }
  };
  const renderSuggestions = () => {
    if (!input || !suggestions) return;
    const query = input.value.trim().toLowerCase();
    const matches = suggestionItems
      .filter((item) => !query || `${item.name} ${item.meta} ${item.type}`.toLowerCase().includes(query))
      .slice(0, 4);

    suggestions.innerHTML = matches.map((item) => `
      <button class="share-suggestion" type="button" data-share-suggestion="${item.name}">
        <span class="share-suggestion-avatar${item.type === 'Group' ? ' group' : ''}">${item.initials}</span>
        <span class="share-suggestion-main">
          <strong>${item.name}</strong>
          <span>${item.meta}</span>
        </span>
      </button>
    `).join('');
    suggestions.hidden = matches.length === 0;
  };

  closeButtons.forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
      return;
    }

    if (!event.target.closest('.share-search-wrap')) {
      hideSuggestions();
    }
  });

  input?.addEventListener('input', renderSuggestions);
  input?.addEventListener('focus', renderSuggestions);
  input?.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      hideSuggestions();
    }
  });

  suggestions?.addEventListener('mousedown', (event) => {
    const option = event.target.closest('[data-share-suggestion]');
    if (!option || !input) return;
    event.preventDefault();
    input.value = option.dataset.shareSuggestion || '';
    hideSuggestions();
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    hideSuggestions();
  });
});

document.querySelectorAll('[data-change-request-modal]').forEach((modal) => {
  const form = modal.querySelector('[data-change-request-form]');
  const assignee = modal.querySelector('[data-change-request-assignee]');
  const requestText = modal.querySelector('[data-change-request-text]');
  const closeButtons = [...modal.querySelectorAll('[data-close-change-request]')];

  const closeModal = () => {
    modal.hidden = true;
  };

  document.querySelectorAll('[data-open-change-request]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      modal.hidden = false;
      assignee?.focus();
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    form.reset();
    requestText?.blur();
    closeModal();
  });
});

document.querySelectorAll('[data-site-package-modal]').forEach((modal) => {
  const search = modal.querySelector('[data-site-package-search]');
  const rows = [...modal.querySelectorAll('[data-package-file]')];
  const empty = modal.querySelector('[data-package-empty]');
  const closeButtons = [...modal.querySelectorAll('[data-close-site-package]')];
  let activeFilter = 'all';

  const closeModal = () => {
    modal.hidden = true;
  };

  const applyPackageFilters = () => {
    const query = search?.value.trim().toLowerCase() || '';
    let visibleCount = 0;

    rows.forEach((row) => {
      const matchesType = activeFilter === 'all' || row.dataset.packageType === activeFilter;
      const searchable = `${row.dataset.packageSearch || ''} ${row.textContent}`.toLowerCase();
      const matchesSearch = !query || searchable.includes(query);
      const isVisible = matchesType && matchesSearch;
      row.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    if (empty) {
      empty.hidden = visibleCount > 0;
    }
  };

  document.querySelectorAll('[data-open-site-package]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      trigger.closest('.doc-more-menu')?.removeAttribute('open');
      modal.hidden = false;
      search?.focus();
      applyPackageFilters();
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  search?.addEventListener('input', applyPackageFilters);

  modal.querySelectorAll('[data-package-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.packageFilter || 'all';
      modal.querySelectorAll('[data-package-filter]').forEach((candidate) => {
        const isActive = candidate === button;
        candidate.classList.toggle('active', isActive);
        candidate.setAttribute('aria-pressed', String(isActive));
      });
      applyPackageFilters();
    });
  });
});

document.querySelectorAll('.workspace-tabs').forEach((tablist) => {
  const viewTabs = [...tablist.querySelectorAll('[data-workspace-view]')];
  if (!viewTabs.length) return;
  const workspace = tablist.closest('[data-workspace-browser]');
  const panels = [...(workspace?.querySelectorAll('[data-workspace-panel]') || [])];

  const activateView = (view) => {
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.workspacePanel !== view;
    });
  };

  viewTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const view = tab.dataset.workspaceView || 'overview';
      viewTabs.forEach((candidate) => {
        const isActive = candidate === tab;
        candidate.classList.toggle('active', isActive);
        candidate.setAttribute('aria-selected', String(isActive));
      });
      activateView(view);
    });
  });

  const activeTab = viewTabs.find((tab) => tab.classList.contains('active')) || viewTabs[0];
  activateView(activeTab?.dataset.workspaceView || 'overview');
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  document.querySelectorAll('[data-workspace-modal]:not([hidden])').forEach((modal) => {
    modal.hidden = true;
  });
  document.querySelectorAll('[data-share-modal]:not([hidden])').forEach((modal) => {
    modal.hidden = true;
  });
  document.querySelectorAll('[data-change-request-modal]:not([hidden])').forEach((modal) => {
    modal.hidden = true;
  });
  document.querySelectorAll('[data-search-modal]:not([hidden])').forEach((modal) => {
    modal.hidden = true;
  });
  document.querySelectorAll('[data-folder-modal]:not([hidden])').forEach((modal) => {
    modal.hidden = true;
    modal.querySelector('[data-folder-modal-form]')?.reset();
  });
  document.querySelectorAll('[data-workspace-settings-modal]:not([hidden])').forEach((modal) => {
    modal.hidden = true;
  });
  document.querySelectorAll('[data-site-package-modal]:not([hidden])').forEach((modal) => {
    modal.hidden = true;
  });
  document.querySelectorAll('[data-upload-panel]:not([hidden])').forEach((panel) => {
    panel.hidden = true;
  });
});

document.querySelectorAll('[data-workspace-browser]').forEach((workspaceBrowser) => {
  const search = workspaceBrowser.querySelector('[data-workspace-search]');
  const items = [...workspaceBrowser.querySelectorAll('[data-workspace-item]')];
  const empty = workspaceBrowser.querySelector('[data-workspace-empty]');
  const tabs = [...workspaceBrowser.querySelectorAll('[data-workspace-tab]')];
  let activeStatus = 'all';

  const applyFilters = () => {
    const query = (search?.value || '').trim().toLowerCase();
    let visibleCount = 0;

    items.forEach((item) => {
      const matchesSearch = !query || (item.dataset.search || '').includes(query);
      const matchesStatus = activeStatus === 'all' || item.dataset.status === activeStatus;
      const isVisible = matchesSearch && matchesStatus;
      item.hidden = !isVisible;
      if (isVisible) {
        visibleCount += 1;
      }
    });

    if (empty) {
      empty.hidden = visibleCount > 0;
    }
  };

  search?.addEventListener('input', applyFilters);

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activeStatus = tab.dataset.workspaceTab || 'all';
      tabs.forEach((candidate) => {
        const isActive = candidate === tab;
        candidate.classList.toggle('active', isActive);
        candidate.setAttribute('aria-selected', String(isActive));
      });
      applyFilters();
    });
  });
});

const documents = {
  'lab-access-policy-v2': {
    title: 'Lab Access Policy v2',
    subtitle: 'Controlled entry, visitor approval, and after-hours access standards for teaching and research labs.',
    owner: 'Maya Stone',
    workspace: 'Knowledge Base',
    status: 'Approved',
    updated: 'May 11, 2026',
    summary: 'This article defines the access model for lab rooms, equipment zones, and shared preparation spaces. It is intended for faculty coordinators, lab assistants, and program administrators.',
    steps: [
      ['Confirm eligibility', 'Verify that the requester is assigned to an approved course, research group, or operational role before adding them to the access list.'],
      ['Assign the access window', 'Choose a standard daytime window unless the request includes supervisor approval for after-hours use.'],
      ['Record the approval trail', 'Add the approver, expiration date, and related workspace reference before publishing the policy change.']
    ]
  },
  'sample-handling-sop': {
    title: 'Sample Handling SOP',
    subtitle: 'Standard operating procedure for receiving, labeling, storing, and transferring instructional samples.',
    owner: 'Arman Kaya',
    workspace: 'Faculty Newsroom',
    status: 'In review',
    updated: 'May 13, 2026',
    summary: 'Use this SOP when new sample batches arrive from suppliers, research partners, or internal preparation teams. The procedure keeps custody, temperature, and disposal notes consistent.',
    steps: [
      ['Log receipt', 'Create an intake record with supplier, batch identifier, arrival condition, and receiving staff initials.'],
      ['Apply labels', 'Attach the workspace label and internal tracking code before moving the material to storage.'],
      ['Confirm storage', 'Select the correct storage zone and document any variance from the expected handling conditions.']
    ]
  },
  'summer-launch-kit': {
    title: 'Summer Launch Kit.pdf',
    subtitle: 'PDF file for campaign-ready messaging, review notes, and the publishing checklist.',
    owner: 'Lara Novak',
    workspace: 'Manufacturer Contract Workspace',
    status: 'Drafting',
    updated: 'May 15, 2026',
    summary: 'PDF preview is not available in Content Hub.',
    previewUnavailable: true,
    downloadUrl: 'assets/files/summer-launch-kit.pdf',
    downloadLabel: 'Download PDF',
    steps: [
      ['Validate the message set', 'Confirm that the primary launch themes match the latest academic calendar and partner commitments.'],
      ['Package assets', 'Group copy, thumbnail art, supporting references, and review notes by publishing destination.'],
      ['Route for review', 'Send the launch kit to the assigned reviewers and track required changes before publishing.']
    ]
  },
  'course-module-botanical-extraction': {
    title: 'Course Module: Botanical Extraction',
    subtitle: 'Draft module outline for the extraction workflow, safety checkpoints, and student assessment prompts.',
    owner: 'Theo Demir',
    workspace: 'Manufacturer Contract Workspace',
    status: 'Needs review',
    updated: 'May 16, 2026',
    summary: 'The module introduces extraction concepts through a practical sequence that balances demonstration, supervised activity, and documentation.',
    steps: [
      ['Prepare the workspace', 'Review materials, protective equipment, and station readiness before learners enter the lab.'],
      ['Run the demonstration', 'Walk through each extraction stage while calling out observation points and stop conditions.'],
      ['Capture outcomes', 'Ask students to submit their observation notes, variance explanations, and final reflection.']
    ]
  },
  'student-portal-welcome-page': {
    title: 'Student Portal Welcome Page',
    subtitle: 'Landing copy and onboarding blocks for the refreshed student portal entry experience.',
    owner: 'Priya Rao',
    workspace: 'Compliance Library',
    status: 'Drafting',
    updated: 'May 17, 2026',
    summary: 'This page gives students a clear first stop for account setup, course access, support requests, and policy reminders.',
    steps: [
      ['Open with orientation', 'Lead with the student outcome and the most common first action.'],
      ['Group core links', 'Organize portal, calendar, support, and policy links into short task-based sections.'],
      ['Review compliance notes', 'Confirm that privacy, accessibility, and support language matches the current approved copy.']
    ]
  },
  'q3-editorial-narrative': {
    title: 'Q3 Editorial Narrative',
    subtitle: 'Editorial direction, priority themes, and publishing cadence for the next quarterly content cycle.',
    owner: 'Jonah Blake',
    workspace: 'Knowledge Base',
    status: 'In review',
    updated: 'May 18, 2026',
    summary: 'The narrative aligns content production around program launches, faculty updates, student support, and partner education.',
    steps: [
      ['Set the themes', 'Confirm the three editorial pillars and the audiences attached to each pillar.'],
      ['Sequence the calendar', 'Place high-dependency pieces first so review cycles do not crowd the publishing window.'],
      ['Close the loop', 'Capture comments from reviewers and tag each decision to the final source section.']
    ]
  },
  'research-paper-chlorogenic-acid-retention': {
    title: 'Research Paper: Chlorogenic Acid Retention',
    subtitle: 'Structured summary of retention findings, study constraints, and reusable teaching references.',
    owner: 'Nadia Cole',
    workspace: 'Student Affairs',
    status: 'Approved',
    updated: 'May 19, 2026',
    summary: 'This paper summary turns research findings into a reference that can be cited in learning modules and briefing notes.',
    steps: [
      ['State the finding', 'Summarize the retention result in plain language before adding supporting detail.'],
      ['Capture constraints', 'List sample size, preparation method, and any limits noted by the study authors.'],
      ['Tag reusable excerpts', 'Mark the sections that can be reused in student-facing modules.']
    ]
  },
  'paper-summary-roasting-study-findings': {
    title: 'Paper Summary: Roasting Study Findings',
    subtitle: 'Teaching-oriented summary of roasting variables, sensory notes, and research interpretation.',
    owner: 'Elias Sato',
    workspace: 'Faculty Newsroom',
    status: 'Drafting',
    updated: 'May 20, 2026',
    summary: 'The summary helps faculty quickly compare study findings and decide where they fit in course material.',
    steps: [
      ['Extract key variables', 'Identify time, temperature, preparation method, and measurement approach.'],
      ['Translate implications', 'Explain what the result changes for teaching, assessment, or lab demonstration.'],
      ['Add review notes', 'Flag claims that need faculty confirmation before publishing.']
    ]
  },
  'supplier-profile-greenbean-labs': {
    title: 'Supplier Profile: GreenBean Labs',
    subtitle: 'Supplier background, service scope, documentation status, and relationship notes.',
    owner: 'Mina Ross',
    workspace: 'Manufacturer Contract Workspace',
    status: 'Needs review',
    updated: 'May 21, 2026',
    summary: 'This supplier profile consolidates operational details so program teams can evaluate fit, risk, and next steps.',
    steps: [
      ['Confirm supplier scope', 'Document supplied materials, service areas, and current contract coverage.'],
      ['Review documentation', 'Check certificates, renewal dates, and any pending compliance follow-up.'],
      ['Add relationship notes', 'Summarize communication history and open questions for the next review.']
    ]
  },
  'supplier-scorecard-xlsx': {
    title: 'Supplier Scorecard.xlsx',
    subtitle: 'Review worksheet for supplier performance, compliance evidence, and renewal readiness.',
    owner: 'Omar Silva',
    workspace: 'Knowledge Base',
    status: 'Drafting',
    updated: 'May 22, 2026',
    summary: 'The scorecard collects ratings and supporting notes for quality, responsiveness, documentation, and cost stability.',
    steps: [
      ['Update ratings', 'Enter the latest scores for each review category using the approved scoring scale.'],
      ['Attach evidence', 'Link performance notes, delivery records, and compliance artifacts to each score.'],
      ['Prepare decision notes', 'Summarize whether the supplier should be renewed, watched, or escalated.']
    ]
  },
  'knowledge-base-microsite': {
    title: 'Knowledge Base Microsite',
    contentType: 'site',
    subtitle: 'Site preview for the public-facing Knowledge Base entry point and reusable policy pathways.',
    owner: 'Maya Stone',
    workspace: 'Knowledge Base',
    status: 'Drafting',
    updated: 'May 23, 2026',
    summary: 'Mini website preview is not available in Content Hub yet.',
    previewUnavailable: true,
    hidePreviewHeader: true,
    previewUnavailableLabel: 'Preview is not available',
    previewUnavailableNote: 'Preview will be available after safety check',
    steps: [
      ['Map the entry points', 'Group the policy, research, and supplier pathways into a site navigation model.'],
      ['Draft landing sections', 'Shape the home page, featured links, and reuse guidance for viewers.'],
      ['Prepare site preview', 'Publish the mini website preview once the site renderer is available.']
    ]
  }
};

const documentBodies = {
  'lab-access-policy-v2': [
    {
      heading: 'Purpose and scope',
      paragraphs: [
        'This policy defines how teaching, research, and shared preparation laboratories are assigned, reviewed, and revoked within the Content Hub operating model. It applies to staff, faculty, visiting contributors, student assistants, and approved external partners who require access to controlled lab spaces.',
        'Access must be granted only for an active academic, research, compliance, or operational purpose. General convenience access, expired project access, and informal shared credentials are not permitted under this policy.'
      ]
    },
    {
      heading: 'Access categories',
      bullets: [
        'Standard access covers weekday entry during staffed operating hours and requires a named supervisor.',
        'Extended access covers evenings, weekends, or low-staff periods and requires written approval from the lab owner.',
        'Visitor access must be time-boxed, escorted, and recorded against the workspace or project that created the visit.'
      ]
    },
    {
      heading: 'Approval and review cadence',
      paragraphs: [
        'All access requests must include the requester name, role, workspace, requested rooms, access window, approving manager, and expiration date. The approval record should remain attached to the source content item so future reviewers can understand why access was granted.',
        'Workspace owners are responsible for reviewing active access lists every thirty days. Access should be removed immediately when a course ends, a role changes, a supplier engagement closes, or a safety incident requires temporary restriction.'
      ]
    },
    {
      heading: 'Exception handling',
      note: 'Emergency access may be granted verbally only when safety, equipment protection, or time-sensitive research continuity requires it. The exception must be documented within one business day.'
    }
  ],
  'sample-handling-sop': [
    {
      heading: 'Objective',
      paragraphs: [
        'This standard operating procedure describes how instructional and research samples are received, identified, stored, transferred, and retired. The procedure is designed to preserve traceability across faculty teams while keeping sample records readable for future review.',
        'The SOP should be followed whenever a new sample batch enters a faculty-controlled workspace, including supplier material, internally prepared material, research residue, and classroom demonstration samples.'
      ]
    },
    {
      heading: 'Required intake record',
      bullets: [
        'Supplier or originating team name, including contact person where available.',
        'Batch identifier, arrival date, receiving staff member, and physical condition on arrival.',
        'Storage requirement, hazard note, disposal window, and any variance from expected handling conditions.'
      ]
    },
    {
      heading: 'Handling procedure',
      paragraphs: [
        'Upon receipt, the sample must be placed in the intake zone before any classroom or lab use. The receiver should inspect the container, compare the label with the shipping or handoff note, and create the intake record before the sample is moved to long-term storage.',
        'If the sample arrives without sufficient documentation, it should be marked as restricted and kept out of instructional circulation until the faculty owner resolves the missing details.'
      ]
    },
    {
      heading: 'Transfer and disposal',
      paragraphs: [
        'Transfers between rooms require a dated handoff note. Disposal must be recorded with the disposal method, staff initials, and reference to the source intake record.'
      ]
    }
  ],
  'summer-launch-kit': [
    {
      heading: 'Launch overview',
      paragraphs: [
        'The summer launch package supports a coordinated release across learning content, faculty updates, and partner-facing communications. The intent is to give each team a shared narrative while allowing local messaging to remain specific to its audience.',
        'This kit should be treated as the source of truth for campaign language, review assignments, and publishing readiness until the launch retrospective is complete.'
      ]
    },
    {
      heading: 'Primary message pillars',
      bullets: [
        'Program readiness: make the transition into summer modules feel structured and predictable.',
        'Applied learning: emphasize hands-on work, practical evidence, and instructor-supported experimentation.',
        'Partner confidence: show that operational content, compliance notes, and learning assets are aligned.'
      ]
    },
    {
      heading: 'Asset inventory',
      table: {
        headers: ['Asset', 'Owner', 'Status'],
        rows: [
          ['Launch overview copy', 'Learning Content', 'Ready for review'],
          ['Faculty announcement', 'Faculty Newsroom', 'Drafting'],
          ['Partner briefing note', 'Manufacturer Contract Workspace', 'Needs legal check'],
          ['Student portal banner', 'Student Affairs', 'Approved']
        ]
      }
    },
    {
      heading: 'Publishing notes',
      paragraphs: [
        'All final assets should reference the same campaign window and use the approved naming convention. Any change to the launch date must be reflected in the banner copy, faculty announcement, and partner briefing note before publication.'
      ]
    }
  ],
  'course-module-botanical-extraction': [
    {
      heading: 'Module description',
      paragraphs: [
        'This module introduces botanical extraction as an applied workflow rather than a single isolated technique. Students compare preparation decisions, document observations, and evaluate how controlled variables influence final output.',
        'The module is intended for supervised lab delivery and assumes that learners have already completed the basic safety orientation and workspace access requirements.'
      ]
    },
    {
      heading: 'Learning outcomes',
      bullets: [
        'Explain the relationship between preparation method, contact time, and extraction result.',
        'Identify safe handling checkpoints before, during, and after the demonstration.',
        'Produce a concise observation record that distinguishes evidence from interpretation.'
      ]
    },
    {
      heading: 'Session structure',
      table: {
        headers: ['Segment', 'Duration', 'Activity'],
        rows: [
          ['Briefing', '15 min', 'Safety review and variable selection'],
          ['Demonstration', '30 min', 'Instructor-led extraction sequence'],
          ['Student work', '35 min', 'Observation record and comparison notes'],
          ['Debrief', '20 min', 'Group discussion and reflection prompt']
        ]
      }
    },
    {
      heading: 'Assessment evidence',
      paragraphs: [
        'Students should submit their observation sheet, variance explanation, and final reflection. The instructor should assess whether the learner can connect procedural choices to observed outcomes without overstating the evidence.'
      ]
    }
  ],
  'student-portal-welcome-page': [
    {
      heading: 'Page objective',
      paragraphs: [
        'The student portal welcome page should help students understand where to start, what requires immediate action, and how to recover when they cannot access a course, calendar, or support channel.',
        'The page must be task-oriented. It should not read like a marketing introduction; the first screen should prioritize account setup, active courses, deadlines, and help requests.'
      ]
    },
    {
      heading: 'Recommended content blocks',
      bullets: [
        'Start here: account setup, profile confirmation, and password recovery.',
        'Today: current course modules, upcoming sessions, and unread announcements.',
        'Support: technical help, academic support, and escalation contacts.',
        'Policies: privacy, accessibility, lab access, and acceptable use reminders.'
      ]
    },
    {
      heading: 'Tone and accessibility',
      paragraphs: [
        'Use plain action labels and avoid internal department names where a student-facing phrase is clearer. Button text should describe the task rather than the destination system.',
        'All page sections must support keyboard navigation and remain readable at mobile widths. Policy references should link to current approved source documents.'
      ]
    }
  ],
  'q3-editorial-narrative': [
    {
      heading: 'Editorial direction',
      paragraphs: [
        'The Q3 editorial narrative centers on continuity between research, instruction, and operational readiness. Each published item should help audiences understand not only what changed, but why the change matters to their work.',
        'The quarter should avoid isolated announcements where possible. Priority content should connect new modules, faculty updates, compliance notes, and partner activity into visible storylines.'
      ]
    },
    {
      heading: 'Audience priorities',
      table: {
        headers: ['Audience', 'Need', 'Content response'],
        rows: [
          ['Students', 'Clarity on tasks and deadlines', 'Short portal updates and module summaries'],
          ['Faculty', 'Reusable teaching references', 'Briefings, SOPs, and annotated research notes'],
          ['Partners', 'Operational confidence', 'Launch kits and supplier-facing summaries']
        ]
      }
    },
    {
      heading: 'Publishing rhythm',
      bullets: [
        'Monday: publish operational updates and weekly learning notices.',
        'Wednesday: publish research summaries or faculty notes.',
        'Friday: publish partner-facing recaps, retrospectives, and upcoming decisions.'
      ]
    }
  ],
  'research-paper-chlorogenic-acid-retention': [
    {
      heading: 'Abstract',
      paragraphs: [
        'This paper summary reviews observed chlorogenic acid retention across preparation conditions and translates the findings into a teaching reference. The source material suggests that retention varies meaningfully with processing intensity, contact time, and storage conditions, although the exact magnitude should be interpreted within the study design.',
        'The summary is intended for faculty and student-facing learning material. It does not replace the original paper; instead, it identifies the claims that can be responsibly reused in coursework and briefing notes.'
      ]
    },
    {
      heading: 'Key findings',
      bullets: [
        'Retention was strongest in lower-intensity preparation conditions where exposure time and heat load were controlled.',
        'Measured differences were directionally consistent, but the study design limits broad claims across all product formats.',
        'Storage and handling conditions should be documented alongside preparation method when findings are used in teaching material.'
      ]
    },
    {
      heading: 'Teaching interpretation',
      paragraphs: [
        'The most useful classroom application is comparative rather than absolute. Students can evaluate how preparation variables influence retention and then discuss why a controlled method matters when interpreting chemical or sensory outcomes.',
        'Faculty should avoid presenting a single retention percentage as universal. A stronger learning activity is to ask students to identify which variables are controlled, which are assumed, and which would require additional evidence.'
      ]
    },
    {
      heading: 'Reusable citation notes',
      table: {
        headers: ['Use case', 'Approved language', 'Caution'],
        rows: [
          ['Lecture slide', 'Retention varies with preparation intensity and handling conditions.', 'Do not generalize beyond the tested conditions.'],
          ['Student prompt', 'Compare how process choices could affect measured retention.', 'Ask for reasoning, not a fixed answer.'],
          ['Faculty note', 'Document storage and method alongside any retention claim.', 'Avoid unsupported product claims.']
        ]
      }
    }
  ],
  'paper-summary-roasting-study-findings': [
    {
      heading: 'Summary',
      paragraphs: [
        'This document summarizes a roasting study for instructional reuse. The study compares how process variables influence sensory notes, extractable compounds, and interpretation of quality indicators.',
        'The content is written for faculty who need a concise teaching reference rather than a full literature review.'
      ]
    },
    {
      heading: 'Variables observed',
      bullets: [
        'Roast duration and temperature curve.',
        'Sample preparation and rest time before evaluation.',
        'Measurement approach, including sensory and analytical observations.'
      ]
    },
    {
      heading: 'Instructional use',
      paragraphs: [
        'The study can support a classroom discussion about correlation, causation, and the limits of sensory interpretation. Students should be encouraged to separate observed results from assumptions about process quality.',
        'A useful exercise is to have students rewrite the findings as a cautious briefing note, preserving uncertainty while still communicating practical meaning.'
      ]
    }
  ],
  'supplier-profile-greenbean-labs': [
    {
      heading: 'Supplier overview',
      paragraphs: [
        'GreenBean Labs is listed as a potential supplier for instructional materials and small-batch support services. This profile consolidates the relationship context, known service scope, documentation status, and open review questions.',
        'The profile should be reviewed before new purchasing, curriculum use, or partner-facing references are approved.'
      ]
    },
    {
      heading: 'Service scope',
      bullets: [
        'Small-batch sample preparation for controlled learning demonstrations.',
        'Documentation packages for source materials and handling conditions.',
        'Ad hoc technical consultation for faculty-led module development.'
      ]
    },
    {
      heading: 'Review status',
      table: {
        headers: ['Area', 'Status', 'Notes'],
        rows: [
          ['Compliance documents', 'Needs review', 'Certificate renewal dates require confirmation.'],
          ['Delivery performance', 'Acceptable', 'Recent deliveries arrived within expected window.'],
          ['Support responsiveness', 'Strong', 'Technical questions answered within one business day.']
        ]
      }
    },
    {
      heading: 'Open questions',
      paragraphs: [
        'Confirm whether GreenBean Labs can support the summer module schedule without introducing rush handling fees. The next review should also verify documentation format compatibility with the Compliance Library.'
      ]
    }
  ],
  'supplier-scorecard-xlsx': [
    {
      heading: 'Workbook purpose',
      paragraphs: [
        'This scorecard is a working review sheet for comparing suppliers across quality, documentation, responsiveness, cost stability, and renewal readiness. It is structured for repeat use during quarterly supplier reviews.'
      ]
    },
    {
      heading: 'Current scoring snapshot',
      table: {
        headers: ['Category', 'Score', 'Evidence note'],
        rows: [
          ['Quality consistency', '4 / 5', 'No major variance reported in the last review period.'],
          ['Documentation readiness', '3 / 5', 'Renewal certificates and source notes need cleanup.'],
          ['Responsiveness', '5 / 5', 'Average response time remains under one business day.'],
          ['Cost stability', '3 / 5', 'Two line items require confirmation before renewal.']
        ]
      }
    },
    {
      heading: 'Reviewer guidance',
      paragraphs: [
        'Scores should be supported by evidence links, not memory or informal impressions. If the reviewer cannot attach evidence, the category should be marked incomplete and revisited before a renewal decision is made.'
      ]
    }
  ]
};

const slugify = (value) => value
  .trim()
  .toLowerCase()
  .replace(/&/g, 'and')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const detailIdFor = (value) => {
  let hash = 0;
  [...value].forEach((char) => {
    hash = ((hash << 5) - hash + char.charCodeAt(0)) >>> 0;
  });

  return `${hash.toString(16).padStart(8, '0')}-38e6-4036-b2dd-${(hash * 2654435761 >>> 0).toString(16).padStart(8, '0')}b136`;
};

const documentPreviewPath = 'document-preview.html';
const rowNavigationIgnoreSelector = 'a, button, input, select, textarea, summary, details, .checkbox, [role="checkbox"], .row-more-menu';

document.querySelectorAll('.pickup-card, .task-row').forEach((item) => {
  const titleElement = item.querySelector('.pickup-title, .task-name');
  const title = titleElement?.textContent?.trim();

  if (!title) {
    return;
  }

  const documentId = item.dataset.documentId || slugify(title);
  item.dataset.documentId = documentId;
  item.dataset.documentTitle = title;
  item.tabIndex = 0;
  item.setAttribute('role', 'link');
  item.setAttribute('aria-label', `Open ${title}`);

  const openDocument = () => {
    const target = `${documentPreviewPath}?rev=pdf-preview&doc=${encodeURIComponent(documentId)}`;
    window.location.href = target;
  };

  item.addEventListener('click', (event) => {
    const target = event.target?.nodeType === 1 ? event.target : event.target?.parentElement;
    if (target?.closest(rowNavigationIgnoreSelector)) {
      return;
    }

    openDocument();
  });

  item.addEventListener('keydown', (event) => {
    const target = event.target?.nodeType === 1 ? event.target : event.target?.parentElement;
    if (target?.closest(rowNavigationIgnoreSelector)) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDocument();
    }
  });
});

const previewRoot = document.querySelector('[data-document-preview]');

if (previewRoot) {
  const params = new URLSearchParams(window.location.search);
  const documentId = params.get('doc') || 'lab-access-policy-v2';
  const documentData = documents[documentId] || documents['lab-access-policy-v2'];
  const setText = (selector, value) => {
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = value;
    });
  };

  document.title = `${documentData.title} - Content Hub`;
  setText('[data-doc-title]', documentData.title);
  setText('[data-doc-subtitle]', documentData.subtitle);
  setText('[data-doc-workspace]', documentData.workspace);
  setText('[data-doc-status]', 'Draft');
  setText('[data-doc-updated]', documentData.updated);
  setText('[data-doc-summary]', documentData.summary);
  setText('[data-details-owner]', documentData.owner);
  setText('[data-details-uploaded]', documentData.updated);
  setText('[data-details-item-id]', detailIdFor(documentId));

  if (documentData.previewUnavailable || documentData.hidePreviewHeader) {
    document.querySelectorAll('.article-title-row, .article-subtitle, .article-divider').forEach((element) => {
      element.hidden = true;
    });
  }

  if (documentData.previewUnavailable) {
    document.querySelectorAll('[data-doc-summary]').forEach((element) => {
      element.hidden = true;
    });
  }

  document.querySelectorAll('[data-site-package-option]').forEach((element) => {
    element.hidden = documentData.contentType !== 'site';
  });

  const editorAvatars = document.querySelectorAll('[data-doc-editor-avatar]');
  const initials = documentData.owner
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const label = `Last edited by ${documentData.owner}`;

  editorAvatars.forEach((editorAvatar) => {
    editorAvatar.textContent = initials;
    editorAvatar.setAttribute('aria-label', label);
    editorAvatar.setAttribute('title', label);
  });

  const body = document.querySelector('[data-doc-body]');
  const sections = documentBodies[documentId] || documentBodies['lab-access-policy-v2'];
  const renderTable = (table) => `
    <div class="article-table-wrap">
      <table class="article-table">
        <thead>
          <tr>${table.headers.map((header) => `<th>${header}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${table.rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
  const renderSection = (section) => `
    <section class="article-section">
      <h2>${section.heading}</h2>
      ${(section.paragraphs || []).map((paragraph) => `<p>${paragraph}</p>`).join('')}
      ${section.bullets ? `<ul>${section.bullets.map((item) => `<li>${item}</li>`).join('')}</ul>` : ''}
      ${section.table ? renderTable(section.table) : ''}
      ${section.note ? `<aside class="article-note">${section.note}</aside>` : ''}
    </section>
  `;

  if (body) {
    if (documentData.previewUnavailable) {
      const downloadAction = documentData.downloadUrl ? `
        <a class="preview-download-button" href="${documentData.downloadUrl}" download>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 4v10m0 0 4-4m-4 4-4-4M5 20h14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>${documentData.downloadLabel || 'Download'}</span>
        </a>
      ` : '';

      body.innerHTML = `
        <section class="preview-unavailable" aria-label="File preview">
          <h2>${documentData.previewUnavailableLabel || 'Preview is not available'}</h2>
          ${documentData.previewUnavailableNote ? `<p>${documentData.previewUnavailableNote}</p>` : ''}
          ${downloadAction}
        </section>
      `;
    } else {
      body.innerHTML = sections.map(renderSection).join('');
    }
  }

  const editableRegions = [
    ...document.querySelectorAll('.article-editor [data-doc-title], .article-editor [data-doc-subtitle], .article-editor [data-doc-summary], [data-doc-body]')
  ];
  const saveButtons = document.querySelectorAll('[data-save-document]');
  const draftStorageKey = `content-hub-document-draft:${documentId}`;
  const readFallbackDrafts = () => {
    try {
      const store = JSON.parse(window.name || '{}');
      return store && typeof store === 'object' ? store : {};
    } catch {
      return {};
    }
  };
  const writeFallbackDraft = (draft) => {
    const drafts = readFallbackDrafts();
    drafts[draftStorageKey] = draft;
    window.name = JSON.stringify(drafts);
  };
  const readSavedDraft = () => {
    try {
      return JSON.parse(window.localStorage.getItem(draftStorageKey) || 'null');
    } catch {
      return readFallbackDrafts()[draftStorageKey] || null;
    }
  };
  const applySavedDraft = (draft) => {
    if (!draft) return;
    if (draft.title) {
      setText('[data-doc-title]', draft.title);
    }
    if (draft.subtitle) {
      setText('[data-doc-subtitle]', draft.subtitle);
    }
    if (draft.summary) {
      setText('[data-doc-summary]', draft.summary);
    }
    if (draft.body && body) {
      body.innerHTML = draft.body;
    }
  };
  const currentDraft = () => ({
    title: document.querySelector('.article-editor [data-doc-title]')?.textContent.trim() || documentData.title,
    subtitle: document.querySelector('.article-editor [data-doc-subtitle]')?.textContent.trim() || documentData.subtitle,
    summary: document.querySelector('.article-editor [data-doc-summary]')?.textContent.trim() || documentData.summary,
    body: body?.innerHTML || ''
  });
  const saveDraft = () => {
    const draft = currentDraft();
    try {
      window.localStorage.setItem(draftStorageKey, JSON.stringify(draft));
    } catch {
      writeFallbackDraft(draft);
    }
    setText('[data-doc-title]', draft.title);
    setText('[data-doc-subtitle]', draft.subtitle);
    setText('[data-doc-summary]', draft.summary);
  };
  const insertPlainText = (text) => {
    if (document.queryCommandSupported?.('insertText')) {
      document.execCommand('insertText', false, text);
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(text));
    range.collapse(false);
  };

  if (!documentData.previewUnavailable) {
    applySavedDraft(readSavedDraft());
  } else {
    saveButtons.forEach((button) => {
      button.hidden = true;
    });
  }

  editableRegions.forEach((region) => {
    if (documentData.previewUnavailable) {
      return;
    }
    region.setAttribute('contenteditable', 'true');
    region.setAttribute('spellcheck', 'true');
    region.setAttribute('aria-label', region.dataset.docBody !== undefined ? 'Document body' : `Edit ${region.textContent.trim().slice(0, 40) || 'text'}`);
    region.addEventListener('paste', (event) => {
      const text = event.clipboardData?.getData('text/plain');
      if (!text) return;
      event.preventDefault();
      insertPlainText(text);
    });
  });
  saveButtons.forEach((button) => {
    button.addEventListener('click', saveDraft);
  });

  const backButton = document.querySelector('[data-preview-back]');
  backButton?.addEventListener('click', () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.href = 'index.html';
  });

  const drawer = document.querySelector('[data-version-drawer]');
  const commentsDrawer = document.querySelector('[data-comments-drawer]');
  const detailsDrawer = document.querySelector('[data-details-drawer]');
  const connectedDrawer = document.querySelector('[data-connected-drawer]');
  const drawerScrim = document.querySelector('[data-history-scrim]');
  const selectionToolbar = document.querySelector('[data-selection-toolbar]');
  const selectionCommentButton = document.querySelector('[data-selection-comment]');
  const selectionConnectButton = document.querySelector('[data-selection-connect]');
  const selectionAskAiButton = document.querySelector('[data-selection-ask-ai]');
  const connectModal = document.querySelector('[data-connect-modal]');
  const connectSearch = document.querySelector('[data-connect-search]');
  const connectList = document.querySelector('[data-connect-list]');
  const connectEmpty = document.querySelector('[data-connect-empty]');
  const closeConnectButtons = document.querySelectorAll('[data-close-connect]');
  const connectedSourcesList = document.querySelector('[data-connected-sources-list]');
  const connectedSourcesEmpty = document.querySelector('[data-connected-sources-empty]');
  const openHistoryButtons = document.querySelectorAll('[data-open-version-history]');
  const openCommentsButtons = document.querySelectorAll('[data-open-comments]');
  const openDetailsButtons = document.querySelectorAll('[data-open-details]');
  const openConnectedButtons = document.querySelectorAll('[data-open-connected-sources]');
  const closeHistoryButton = document.querySelector('[data-close-version-history]');
  const closeCommentsButton = document.querySelector('[data-close-comments]');
  const closeDetailsButton = document.querySelector('[data-close-details]');
  const closeConnectedButton = document.querySelector('[data-close-connected-sources]');

  const closeOptionMenus = () => {
    document.querySelectorAll('.doc-more-menu[open], .comment-more-menu[open]').forEach((menu) => {
      menu.removeAttribute('open');
    });
  };
  const defaultConnectedSources = {
    'sample-handling-sop': ['lab-access-policy-v2', 'course-module-botanical-extraction', 'paper-summary-roasting-study-findings'],
    'lab-access-policy-v2': ['sample-handling-sop', 'student-portal-welcome-page', 'q3-editorial-narrative'],
    'course-module-botanical-extraction': ['sample-handling-sop', 'summer-launch-kit', 'research-paper-chlorogenic-acid-retention'],
    'supplier-scorecard-xlsx': ['supplier-profile-greenbean-labs', 'lab-access-policy-v2', 'q3-editorial-narrative']
  };

  const renderConnectedSources = () => {
    if (!connectedSourcesList) {
      return;
    }

    const linkedSources = [...document.querySelectorAll('[data-connected-document]')].map((link) => link.dataset.connectedDocument);
    const sourceIds = [...new Set([...linkedSources, ...(defaultConnectedSources[documentId] || [])])]
      .filter((sourceId) => sourceId && documents[sourceId]);

    connectedSourcesList.innerHTML = sourceIds.map((sourceId) => {
      const source = documents[sourceId];
      return `
        <a class="connected-source-row" href="document-preview.html?doc=${encodeURIComponent(sourceId)}">
          <span class="connected-source-main">
            <strong>${source.title}</strong>
            <span>${source.workspace} · ${source.updated}</span>
          </span>
          <span class="connected-source-status">${source.status}</span>
        </a>
      `;
    }).join('');

    if (connectedSourcesEmpty) {
      connectedSourcesEmpty.hidden = sourceIds.length > 0;
    }
  };

  let pendingConnectRange = null;
  let pendingConnectText = '';

  const closeConnectModal = () => {
    if (!connectModal) {
      return;
    }

    connectModal.hidden = true;
    if (connectSearch) {
      connectSearch.value = '';
    }
  };

  const renderConnectDocuments = () => {
    if (!connectList) {
      return;
    }

    const query = (connectSearch?.value || '').trim().toLowerCase();
    const items = Object.entries(documents).filter(([, doc]) => {
      const haystack = `${doc.title} ${doc.workspace} ${doc.status} ${doc.subtitle}`.toLowerCase();
      return !query || haystack.includes(query);
    });

    connectList.innerHTML = items.map(([id, doc]) => `
      <button class="connect-option" type="button" data-connect-document="${id}">
        <span class="connect-option-main">
          <strong>${doc.title}</strong>
          <span>${doc.workspace} · ${doc.updated}</span>
        </span>
        <span class="connect-option-status">${doc.status}</span>
      </button>
    `).join('');

    if (connectEmpty) {
      connectEmpty.hidden = items.length > 0;
    }
  };

  const connectSelectionToDocument = (targetId) => {
    const targetDocument = documents[targetId];
    if (!pendingConnectRange || !pendingConnectText || !targetDocument) {
      closeConnectModal();
      return;
    }

    const link = document.createElement('a');
    link.href = `document-preview.html?doc=${encodeURIComponent(targetId)}`;
    link.textContent = pendingConnectText;
    link.className = 'article-link';
    link.dataset.connectedDocument = targetId;
    link.setAttribute('title', `Connected to ${targetDocument.title}`);

    try {
      pendingConnectRange.deleteContents();
      pendingConnectRange.insertNode(link);
    } catch {
      link.textContent = pendingConnectText;
      pendingConnectRange.insertNode(link);
    }

    window.getSelection()?.removeAllRanges();
    pendingConnectRange = null;
    pendingConnectText = '';
    closeConnectModal();
    hideSelectionToolbar();
  };

  const openConnectModal = () => {
    const range = getSelectionRange();
    if (!range || !connectModal) {
      hideSelectionToolbar();
      return;
    }

    pendingConnectRange = range.cloneRange();
    pendingConnectText = window.getSelection()?.toString().trim() || '';
    renderConnectDocuments();
    connectModal.hidden = false;
    hideSelectionToolbar();
    connectSearch?.focus();
  };

  const hideSelectionToolbar = () => {
    if (!selectionToolbar) {
      return;
    }

    selectionToolbar.hidden = true;
    selectionToolbar.classList.remove('is-visible');
  };
  const getSelectionRange = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
      return null;
    }

    const selectedText = selection.toString().trim();
    if (!selectedText) {
      return null;
    }

    const range = selection.getRangeAt(0);
    const articleEditor = document.querySelector('.article-editor');
    if (!articleEditor || !articleEditor.contains(range.commonAncestorContainer)) {
      return null;
    }

    return range;
  };
  const getRangeBounds = (range) => {
    const rects = Array.from(range.getClientRects()).filter((rect) => rect.width > 0 && rect.height > 0);
    if (rects.length === 0) {
      const fallbackRect = range.getBoundingClientRect();
      return fallbackRect.width > 0 || fallbackRect.height > 0 ? fallbackRect : null;
    }

    return rects.reduce((bounds, rect) => ({
      top: Math.min(bounds.top, rect.top),
      right: Math.max(bounds.right, rect.right),
      bottom: Math.max(bounds.bottom, rect.bottom),
      left: Math.min(bounds.left, rect.left)
    }), rects[0]);
  };
  const updateSelectionToolbar = () => {
    if (!selectionToolbar) {
      return;
    }

    const range = getSelectionRange();
    if (!range) {
      hideSelectionToolbar();
      return;
    }

    const bounds = getRangeBounds(range);
    if (!bounds) {
      hideSelectionToolbar();
      return;
    }

    selectionToolbar.hidden = false;

    const toolbarRect = selectionToolbar.getBoundingClientRect();
    const viewportMargin = 12;
    const preferredTop = bounds.top - toolbarRect.height - 10;
    const fallbackTop = bounds.bottom + 10;
    const top = preferredTop >= viewportMargin ? preferredTop : Math.min(fallbackTop, window.innerHeight - toolbarRect.height - viewportMargin);
    const centeredLeft = bounds.left + (bounds.right - bounds.left) / 2 - toolbarRect.width / 2;
    const maxLeft = Math.max(viewportMargin, window.innerWidth - toolbarRect.width - viewportMargin);
    const left = Math.min(
      Math.max(centeredLeft, viewportMargin),
      maxLeft
    );

    selectionToolbar.style.left = `${Math.round(left)}px`;
    selectionToolbar.style.top = `${Math.round(top)}px`;
    selectionToolbar.classList.add('is-visible');
  };
  const setSideDrawer = (activeDrawer) => {
    [drawer, commentsDrawer, connectedDrawer, detailsDrawer].forEach((currentDrawer) => {
      if (!currentDrawer) {
        return;
      }

      const isOpen = currentDrawer === activeDrawer;
      currentDrawer.classList.toggle('open', isOpen);
      currentDrawer.setAttribute('aria-hidden', String(!isOpen));
    });

    const hasOpenDrawer = Boolean(activeDrawer);
    if (drawerScrim) {
      drawerScrim.hidden = !hasOpenDrawer;
    }
    document.body.classList.toggle('drawer-open', hasOpenDrawer);
  };

  openHistoryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      closeOptionMenus();
      setSideDrawer(drawer);
    });
  });

  openCommentsButtons.forEach((button) => {
    button.addEventListener('click', () => {
      closeOptionMenus();
      setSideDrawer(commentsDrawer);
    });
  });

  openDetailsButtons.forEach((button) => {
    button.addEventListener('click', () => {
      closeOptionMenus();
      setSideDrawer(detailsDrawer);
    });
  });

  openConnectedButtons.forEach((button) => {
    button.addEventListener('click', () => {
      closeOptionMenus();
      renderConnectedSources();
      setSideDrawer(connectedDrawer);
    });
  });

  closeHistoryButton?.addEventListener('click', () => setSideDrawer(null));
  closeCommentsButton?.addEventListener('click', () => setSideDrawer(null));
  closeDetailsButton?.addEventListener('click', () => setSideDrawer(null));
  closeConnectedButton?.addEventListener('click', () => setSideDrawer(null));
  drawerScrim?.addEventListener('click', () => setSideDrawer(null));

  selectionToolbar?.addEventListener('mousedown', (event) => {
    event.preventDefault();
  });

  selectionCommentButton?.addEventListener('click', () => {
    closeOptionMenus();
    setSideDrawer(commentsDrawer);
    hideSelectionToolbar();
  });

  selectionConnectButton?.addEventListener('click', () => {
    closeOptionMenus();
    openConnectModal();
  });

  selectionAskAiButton?.addEventListener('click', () => {
    hideSelectionToolbar();
  });

  connectSearch?.addEventListener('input', renderConnectDocuments);
  connectList?.addEventListener('click', (event) => {
    const option = event.target.closest('[data-connect-document]');
    if (!option) {
      return;
    }

    connectSelectionToDocument(option.dataset.connectDocument || '');
  });
  closeConnectButtons.forEach((button) => {
    button.addEventListener('click', closeConnectModal);
  });
  connectModal?.addEventListener('click', (event) => {
    if (event.target === connectModal) {
      closeConnectModal();
    }
  });

  document.addEventListener('selectionchange', updateSelectionToolbar);
  document.addEventListener('mouseup', updateSelectionToolbar);
  document.addEventListener('keyup', updateSelectionToolbar);
  window.addEventListener('scroll', updateSelectionToolbar, { passive: true });
  window.addEventListener('resize', updateSelectionToolbar);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setSideDrawer(null);
      closeConnectModal();
      hideSelectionToolbar();
    }
  });
}

/**
 * ============================================================
 * SPACESUIT — Shared topbar + sidebar shell
 *
 * Usage: define window.SPACESUIT before this script loads.
 *
 * window.SPACESUIT = {
 *   company: { badge: 'N', name: 'Nordberg Holding AS' },
 *   active: 'hjem',   // id of the active nav item (or child id)
 *   nav: [
 *     { id: 'hjem', label: 'Hjem', href: 'hjem.html', icon: 'home' },
 *     { id: 'innboks', label: 'Innboks', href: 'innboks.html', icon: 'mail' },
 *     // collapsible group:
 *     { id: 'settings', label: 'Innstillinger', icon: 'settings', children: [
 *         { id: 'tilganger', label: 'Tilganger', href: 'tilganger.html' }
 *     ]}
 *   ]
 * };
 *
 * icon values: named string (see ICONS map below) OR a raw '<svg>…</svg>' string.
 * ============================================================
 */

(function () {
  /* ── Named icon map ─────────────────────────────────────── */
  var ICONS = {
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V9L12 3L20 9V21H14V13H10V21H4Z" fill="currentColor"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H20C20.55 4 21.0208 4.19583 21.4125 4.5875C21.8042 4.97917 22 5.45 22 6V18C22 18.55 21.8042 19.0208 21.4125 19.4125C21.0208 19.8042 20.55 20 20 20H4ZM12 13L4 8V18H20V8L12 13ZM12 11L20 6H4L12 11ZM4 8V6V18V8Z" fill="currentColor"/></svg>',
    person: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.85 17.1C6.7 16.45 7.65 15.9375 8.7 15.5625C9.75 15.1875 10.85 15 12 15C13.15 15 14.25 15.1875 15.3 15.5625C16.35 15.9375 17.3 16.45 18.15 17.1C18.7333 16.4167 19.1875 15.6417 19.5125 14.775C19.8375 13.9083 20 12.9833 20 12C20 9.78333 19.2208 7.89583 17.6625 6.3375C16.1042 4.77917 14.2167 4 12 4C9.78333 4 7.89583 4.77917 6.3375 6.3375C4.77917 7.89583 4 9.78333 4 12C4 12.9833 4.1625 13.9083 4.4875 14.775C4.8125 15.6417 5.26667 16.4167 5.85 17.1ZM12 13C11.0167 13 10.1875 12.6625 9.5125 11.9875C8.8375 11.3125 8.5 10.4833 8.5 9.5C8.5 8.51667 8.8375 7.6875 9.5125 7.0125C10.1875 6.3375 11.0167 6 12 6C12.9833 6 13.8125 6.3375 14.4875 7.0125C15.1625 7.6875 15.5 8.51667 15.5 9.5C15.5 10.4833 15.1625 11.3125 14.4875 11.9875C13.8125 12.6625 12.9833 13 12 13ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C12.8833 20 13.7167 19.8708 14.5 19.6125C15.2833 19.3542 16 18.9833 16.65 18.5C16 18.0167 15.2833 17.6458 14.5 17.3875C13.7167 17.1292 12.8833 17 12 17C11.1167 17 10.2833 17.1292 9.5 17.3875C8.71667 17.6458 8 18.0167 7.35 18.5C8 18.9833 8.71667 19.3542 9.5 19.6125C10.2833 19.8708 11.1167 20 12 20ZM12 11C12.4333 11 12.7917 10.8583 13.075 10.575C13.3583 10.2917 13.5 9.93333 13.5 9.5C13.5 9.06667 13.3583 8.70833 13.075 8.425C12.7917 8.14167 12.4333 8 12 8C11.5667 8 11.2083 8.14167 10.925 8.425C10.6417 8.70833 10.5 9.06667 10.5 9.5C10.5 9.93333 10.6417 10.2917 10.925 10.575C11.2083 10.8583 11.5667 11 12 11Z" fill="currentColor"/></svg>',
    flag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V4H14L14.4 6H20V16H13L12.6 14H7V21H5ZM14.65 14H18V8H12.75L12.35 6H7V12H14.25L14.65 14Z" fill="currentColor"/></svg>',
    'check-circle': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.6 16.6L17.65 9.55L16.25 8.15L10.6 13.8L7.75 10.95L6.35 12.35L10.6 16.6ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z" fill="currentColor"/></svg>',
    settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.64 12.98c.042-.32.073-.64.073-.98 0-.34-.031-.66-.072-.98l2.169-1.65a.495.495 0 0 0 .123-.64l-2.056-3.46a.517.517 0 0 0-.452-.25.492.492 0 0 0-.175.03l-2.56 1c-.534-.4-1.11-.73-1.737-.98l-.39-2.65a.497.497 0 0 0-.505-.42H9.946a.497.497 0 0 0-.504.42l-.39 2.65a7.97 7.97 0 0 0-1.738.98l-2.56-1a.597.597 0 0 0-.185-.03c-.174 0-.35.09-.442.25L2.071 8.73a.484.484 0 0 0 .124.64l2.169 1.65a7.74 7.74 0 0 0-.072.98c0 .33.03.66.072.98l-2.17 1.65a.495.495 0 0 0-.123.64l2.056 3.46c.093.16.268.25.453.25.061 0 .123-.01.175-.03l2.56-1c.534.4 1.11.73 1.737.98l.39 2.65c.031.24.247.42.504.42h4.112c.257 0 .473-.18.504-.42l.39-2.65a7.955 7.955 0 0 0 1.738-.98l2.56 1c.062.02.123.03.185.03a.51.51 0 0 0 .442-.25l2.056-3.46a.495.495 0 0 0-.123-.64l-2.17-1.65Zm-2.035-1.71c.041.31.052.52.052.73 0 .21-.021.43-.052.73l-.144 1.13.915.7 1.11.84-.72 1.21-1.305-.51-1.069-.42-.925.68c-.442.32-.864.56-1.285.73l-1.09.43-.165 1.13-.205 1.35h-1.44l-.195-1.35-.164-1.13-1.09-.43a5.876 5.876 0 0 1-1.264-.71l-.936-.7-1.09.43-1.305.51-.72-1.21 1.11-.84.915-.7-.144-1.13a8.1 8.1 0 0 1-.051-.74c0-.2.02-.43.051-.73l.144-1.13-.915-.7-1.11-.84.72-1.21 1.305.51 1.07.42.925-.68a6.05 6.05 0 0 1 1.285-.73l1.09-.43.164-1.13.206-1.35h1.429l.195 1.35.164 1.13 1.09.43c.442.18.854.41 1.265.71l.935.7 1.09-.43 1.306-.51.72 1.21-1.1.85-.916.7.144 1.13ZM12.002 8C9.73 8 7.89 9.79 7.89 12s1.84 4 4.112 4c2.272 0 4.112-1.79 4.112-4s-1.84-4-4.112-4Zm0 6c-1.13 0-2.056-.9-2.056-2s.925-2 2.056-2 2.056.9 2.056 2-.925 2-2.056 2Z" fill="currentColor"/></svg>',
    hamburger: '<svg viewBox="0 0 16 16" fill="none"><rect y="2.5" width="16" height="1.5" rx="0.75" fill="currentColor"/><rect y="7" width="16" height="1.5" rx="0.75" fill="currentColor"/><rect y="11.5" width="16" height="1.5" rx="0.75" fill="currentColor"/></svg>',
    'chevron-left': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 18L8 12L14 6L15.4 7.4L10.8 12L15.4 16.6L14 18Z" fill="currentColor"/></svg>',
    user: '<svg viewBox="0 0 14 14" fill="none"><circle cx="7" cy="4.5" r="2.5" stroke="currentColor" stroke-width="1.2"/><path d="M2 13c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>'
  };

  function resolveIcon(icon) {
    if (!icon) return '';
    if (icon.trim().startsWith('<')) return icon; // raw SVG
    return ICONS[icon] || '';
  }

  /* ── Build HTML ──────────────────────────────────────────── */

  var cfg = window.SPACESUIT || {};
  var company = cfg.company || { badge: '?', name: '' };
  var activeId = cfg.active || '';
  var navItems = cfg.nav || [];

  // Determine which group (if any) should be open because a child is active
  function isChildActive(item) {
    return (item.children || []).some(function (c) { return c.id === activeId; });
  }

  function buildNavItem(item) {
    var isActive = item.id === activeId;
    var hasChildren = item.children && item.children.length > 0;
    var childActive = isChildActive(item);
    var groupOpen = childActive; // auto-open if child is active

    if (hasChildren) {
      var groupClass = 'nav-item nav-konsern' + (childActive ? ' nav-item--active' : '') + (groupOpen ? ' nav-konsern--open' : '');
      var childrenHtml = item.children.map(function (child) {
        var childIsActive = child.id === activeId;
        return '<a class="nav-sub-item' + (childIsActive ? ' nav-sub-item--active' : '') + '" href="' + (child.href || '#') + '">'
          + '<span class="nav-dot"></span>'
          + '<span class="nav-sub-label">' + child.label + '</span>'
          + '</a>';
      }).join('');
      return '<div class="' + groupClass + '">'
        + '<div class="nav-konsern-hdr">'
        + '<span class="nav-icon-badge">' + resolveIcon(item.icon) + '</span>'
        + '<span class="nav-label">' + item.label + '</span>'
        + '</div>'
        + '<div class="nav-sub">' + childrenHtml + '</div>'
        + '</div>';
    }

    var tag = isActive ? 'div' : 'a';
    var hrefAttr = isActive ? '' : ' href="' + (item.href || '#') + '"';
    var cls = 'nav-item' + (isActive ? ' nav-item--active' : '');
    return '<' + tag + ' class="' + cls + '"' + hrefAttr + '>'
      + '<span class="nav-icon-badge">' + resolveIcon(item.icon) + '</span>'
      + '<span class="nav-label">' + item.label + '</span>'
      + '</' + tag + '>';
  }

  var navHtml = navItems.map(buildNavItem).join('');

  var topbarHtml = '<header class="app-topbar">'
    + '<div class="topbar-left">'
    + '<button class="topbar-icon-btn" id="hamburgerToggle" title="Meny">' + ICONS.hamburger + '</button>'
    + '<span class="topbar-logo">tripletex</span>'
    + '<span class="topbar-sep"></span>'
    + '<div class="topbar-company">'
    + '<span class="topbar-company-badge">' + company.badge + '</span>'
    + '<span class="topbar-company-name">' + company.name + '</span>'
    + '</div>'
    + '</div>'
    + '<div class="topbar-right">'
    + '<button class="topbar-user-btn" title="Bruker">' + ICONS.user + '</button>'
    + '</div>'
    + '</header>';

  var backArrowSvg = '<svg viewBox="0 0 24 24" fill="currentColor" style="width:16px;height:16px;flex-shrink:0;"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>';

  var sidebarHtml = '<nav class="sidebar" id="sidebar">'
    + '<div class="sidebar-nav">' + navHtml + '</div>'
    + '<div class="sidebar-footer">'
    + '<hr class="nav-divider">'
    + '<a class="sidebar-back-link" id="sidebarBackLink" href="#">' + backArrowSvg + '<span>Alle prototyper</span></a>'
    + '</div>'
    + '</nav>';

  /* ── Inject into DOM ─────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    var body = document.body;

    // Find the existing .main-content element (pages keep it as a direct body child)
    var mainContent = body.querySelector(':scope > .main-content')
      || body.querySelector('.main-content')
      || (function () { var m = document.createElement('main'); m.className = 'main-content'; body.appendChild(m); return m; })();

    // Wrap main-content in app-body, then in app-shell
    var appBody = document.createElement('div');
    appBody.className = 'app-body';
    mainContent.parentNode.insertBefore(appBody, mainContent);
    appBody.appendChild(mainContent);

    var appShell = document.createElement('div');
    appShell.className = 'app-shell';
    appBody.parentNode.insertBefore(appShell, appBody);
    appShell.appendChild(appBody);

    // Inject topbar at top of app-shell, sidebar at top of app-body
    appShell.insertAdjacentHTML('afterbegin', topbarHtml);
    appBody.insertAdjacentHTML('afterbegin', sidebarHtml);

    /* ── Wire interactions ───────────────────────────────────── */

    // Sidebar collapse toggle
    var sidebar = document.getElementById('sidebar');
    var hamburger = document.getElementById('hamburgerToggle');

    function toggleSidebar() {
      if (sidebar) sidebar.classList.toggle('sidebar--collapsed');
    }

    if (hamburger) hamburger.addEventListener('click', toggleSidebar);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'm' && !e.metaKey && !e.ctrlKey && !e.altKey
          && document.activeElement.tagName !== 'INPUT'
          && document.activeElement.tagName !== 'TEXTAREA') {
        toggleSidebar();
      }
    });

    // Back link: compute index.html relative to current page
    var backLink = document.getElementById('sidebarBackLink');
    if (backLink) {
      var indexUrl = location.href.replace(/\/prototyper\/.*$/, '/index.html');
      backLink.href = indexUrl;
    }

    // Konserninnstillinger (and any collapsible group) expand/collapse
    var groups = document.querySelectorAll('.nav-konsern');
    groups.forEach(function (group) {
      var hdr = group.querySelector('.nav-konsern-hdr');
      if (hdr) {
        hdr.addEventListener('click', function () {
          group.classList.toggle('nav-konsern--open');
        });
      }
    });
  });
})();

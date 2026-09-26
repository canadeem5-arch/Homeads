/**
 * HomeAds (homeads.ae)
 * Unified Controller: Site-Wide Luxury Preloader, Mobile Navbar & Global Cursor Glow
 */

var lastNavToggle = 0;
function toggleMobileNav(e) {
  var now = Date.now();
  if (now - lastNavToggle < 250) {
    if (e && e.preventDefault) e.preventDefault();
    return;
  }
  lastNavToggle = now;
  if (e) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
  }
  var ham = document.getElementById('ham');
  var navLinks = document.getElementById('nav-links');
  if (!ham || !navLinks) return;
  var isOpen = navLinks.classList.toggle('open');
  ham.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  if (isOpen) {
    ham.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  } else {
    ham.classList.remove('is-active');
    document.body.style.overflow = '';
  }
}
window.toggleMobileNav = toggleMobileNav;

var lastDropdownToggle = 0;
function toggleServicesDropdown(e, el) {
  var now = Date.now();
  if (now - lastDropdownToggle < 250) {
    if (e && e.preventDefault) e.preventDefault();
    return;
  }
  lastDropdownToggle = now;
  if (e) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
  }
  var target = el || (e ? (e.currentTarget || e.target) : null);
  var item = target ? (target.closest ? target.closest('.has-dropdown') : target.parentElement) : document.querySelector('.nav-item.has-dropdown');
  if (item) {
    var isOpen = item.classList.toggle('mobile-open');
    if (target && target.setAttribute) {
      target.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
  }
}
window.toggleServicesDropdown = toggleServicesDropdown;

(function () {
  'use strict';

  // 1. Ultra-Luxury Site-Wide Preloader
  function initSitePreloader() {
    if (document.getElementById('site-preloader')) return;

    var preloader = document.createElement('div');
    preloader.id = 'site-preloader';
    preloader.className = 'site-preloader';
    preloader.setAttribute('aria-hidden', 'false');
    preloader.innerHTML = [
      '<div class="preloader-backdrop"></div>',
      '<div class="preloader-content">',
      '  <div class="preloader-brand-wrapper">',
      '    <div class="preloader-ring-outer"></div>',
      '    <div class="preloader-ring-inner"></div>',
      '    <div class="preloader-logo-icon">',
      '      <svg viewBox="0 0 40 40" width="36" height="36" fill="none">',
      '        <path d="M20 4L4 16v18a2 2 0 002 2h28a2 2 0 002-2V16L20 4z" stroke="#00ff10" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>',
      '        <path d="M14 36V22h12v14" stroke="#00ff10" stroke-width="2" stroke-linecap="round"/>',
      '        <circle cx="20" cy="14" r="2.5" fill="#00ff10"/>',
      '      </svg>',
      '    </div>',
      '  </div>',
      '  <div class="preloader-brand-title">HOMEADS<span>.AE</span></div>',
      '  <div class="preloader-counter" id="preloader-counter">0%</div>',
      '  <div class="preloader-bar-track">',
      '    <div class="preloader-bar-fill" id="preloader-bar-fill"></div>',
      '  </div>',
      '  <div class="preloader-status" id="preloader-status">INITIALIZING DIGITAL ARCHITECTURE...</div>',
      '</div>'
    ].join('');

    var parent = document.body || document.documentElement;
    if (parent.firstChild) {
      parent.insertBefore(preloader, parent.firstChild);
    } else {
      parent.appendChild(preloader);
    }
    if (document.body) {
      document.body.classList.add('preloader-active');
    }

    var counterEl = document.getElementById('preloader-counter');
    var barFillEl = document.getElementById('preloader-bar-fill');
    var statusEl = document.getElementById('preloader-status');

    var currentPct = 0;
    var frame = 0;
    var isLoaded = (document.readyState === 'complete');
    var dismissed = false;

    window.addEventListener('load', function () {
      isLoaded = true;
    });

    function updatePreloader() {
      if (dismissed) return;
      frame++;

      if (frame < 48 && !isLoaded) {
        currentPct += (88 - currentPct) * 0.11 + 0.6;
      } else {
        currentPct += (100 - currentPct) * 0.22 + 1.2;
      }

      var rounded = Math.min(100, Math.floor(currentPct));

      if (counterEl) counterEl.textContent = rounded + '%';
      if (barFillEl) barFillEl.style.width = rounded + '%';

      if (statusEl) {
        if (rounded < 35) {
          statusEl.textContent = 'INITIALIZING DIGITAL ARCHITECTURE...';
        } else if (rounded < 70) {
          statusEl.textContent = 'OPTIMIZING DIGITAL ASSETS & INTERFACES...';
        } else if (rounded < 98) {
          statusEl.textContent = 'FINALIZING DIGITAL EXPERIENCE...';
        } else {
          statusEl.textContent = 'WELCOME TO HOMEADS';
        }
      }

      if (currentPct >= 99.2) {
        currentPct = 100;
        if (counterEl) counterEl.textContent = '100%';
        if (barFillEl) barFillEl.style.width = '100%';
        if (statusEl) statusEl.textContent = 'WELCOME TO HOMEADS';
        dismissed = true;

        setTimeout(function () {
          preloader.classList.add('preloader-hidden');
          if (document.body) {
            document.body.classList.remove('preloader-active');
          }
          setTimeout(function () {
            if (preloader.parentNode) {
              preloader.parentNode.removeChild(preloader);
            }
          }, 700);
        }, 150);
        return;
      }

      requestAnimationFrame(updatePreloader);
    }

    requestAnimationFrame(updatePreloader);
  }

  // 2. Navbar Setup
  function initNavbar() {
    var nav = document.getElementById('nav');
    var ham = document.getElementById('ham');
    var navLinks = document.getElementById('nav-links');

    if (nav) {
      var onScroll = function () {
        nav.classList.toggle('scrolled', window.scrollY > 20);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    if (ham && navLinks) {
      if (!ham.dataset.bound) {
        ham.dataset.bound = 'true';
        ham.addEventListener('click', function (e) {
          toggleMobileNav(e);
        });
        ham.addEventListener('touchend', function (e) {
          toggleMobileNav(e);
        }, { passive: false });
      }

      navLinks.querySelectorAll('a.dropdown-toggle').forEach(function (link) {
        if (link.dataset.boundDropdown) return;
        link.dataset.boundDropdown = 'true';

        link.addEventListener('click', function (e) {
          if (window.innerWidth <= 900) {
            toggleServicesDropdown(e, link);
          }
        });
        link.addEventListener('touchend', function (e) {
          if (window.innerWidth <= 900) {
            toggleServicesDropdown(e, link);
          }
        }, { passive: false });
      });

      navLinks.querySelectorAll('a:not(.dropdown-toggle)').forEach(function (link) {
        if (link.dataset.boundLink) return;
        link.dataset.boundLink = 'true';
        link.addEventListener('click', function () {
          navLinks.classList.remove('open');
          if (ham) {
            ham.setAttribute('aria-expanded', 'false');
            ham.classList.remove('is-active');
          }
          document.body.style.overflow = '';
        });
      });

      document.addEventListener('click', function (e) {
        if (navLinks.classList.contains('open') && nav && !nav.contains(e.target)) {
          navLinks.classList.remove('open');
          if (ham) {
            ham.setAttribute('aria-expanded', 'false');
            ham.classList.remove('is-active');
          }
          document.body.style.overflow = '';
        }
      });
    }

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) {
        if (navLinks && navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          if (ham) {
            ham.setAttribute('aria-expanded', 'false');
            ham.classList.remove('is-active');
          }
          document.body.style.overflow = '';
        }
      }
    });
  }

  // 3. Global Mouse Cursor Glow
  function initGlobalCursorGlow() {
    var glow = document.getElementById('site-cursor-glow');
    if (!glow) {
      glow = document.createElement('div');
      glow.id = 'site-cursor-glow';
      glow.className = 'site-cursor-glow';
      glow.setAttribute('aria-hidden', 'true');
      document.body.appendChild(glow);
    }

    var mouseX = -500, mouseY = -500;
    var currentX = -500, currentY = -500;
    var isInside = false;

    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isInside) {
        isInside = true;
        glow.style.opacity = '1';
      }
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      isInside = false;
      glow.style.opacity = '0';
    });

    function animateCursor() {
      currentX += (mouseX - currentX) * 0.2;
      currentY += (mouseY - currentY) * 0.2;
      glow.style.left = currentX + 'px';
      glow.style.top = currentY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  // Launch preloader as early as possible
  initSitePreloader();

  function startAll() {
    initSitePreloader();
    initNavbar();
    initGlobalCursorGlow();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAll);
  } else {
    startAll();
  }
})();

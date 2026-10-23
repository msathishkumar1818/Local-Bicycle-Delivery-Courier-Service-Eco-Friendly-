/**
 * EcoCycle Express - Global Client-Side Logic
 * Local Bicycle Delivery Courier Service (Eco-Friendly)
 * Pure Vanilla JavaScript (No heavy frameworks or libraries)
 */

(function () {
  'use strict';

  // 1. PRELOADER CONTROLLER
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const hideLoader = () => {
      preloader.classList.add('loaded');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 450);
    };

    if (document.readyState === 'complete') {
      setTimeout(hideLoader, 300);
    } else {
      window.addEventListener('load', () => setTimeout(hideLoader, 250));
      // Fallback safeguard in case assets take too long
      setTimeout(hideLoader, 1800);
    }
  }

  // 2. THEME MANAGER (DARK MODE: STRICT #000000)
  function initTheme() {
    const themeToggles = document.querySelectorAll('.theme-toggle-btn');
    const savedTheme = localStorage.getItem('ecocycle_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);

    themeToggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        localStorage.setItem('ecocycle_theme', nextTheme);
      });
    });

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      themeToggles.forEach(btn => {
        btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        const textLabel = btn.querySelector('.theme-text-label');
        if (textLabel) {
          textLabel.textContent = theme === 'dark' ? 'LIGHT' : 'DARK';
        }
      });
    }
  }

  // 3. DIRECTION MANAGER (RTL / LTR)
  function initDirection() {
    const rtlToggles = document.querySelectorAll('.rtl-toggle-btn');
    const savedDir = localStorage.getItem('ecocycle_dir') || 'ltr';

    applyDirection(savedDir);

    rtlToggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
        const nextDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
        applyDirection(nextDir);
        localStorage.setItem('ecocycle_dir', nextDir);
      });
    });

    function applyDirection(dir) {
      document.documentElement.setAttribute('dir', dir);
      document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
      rtlToggles.forEach(btn => {
        btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
        btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to Left-to-Right layout' : 'Switch to Right-to-Left layout');
      });
    }
  }

  // 4. DESKTOP HOME DROPDOWN (CLICK ONLY, NEVER HOVER)
  function initHomeDropdown() {
    const dropdownWrappers = document.querySelectorAll('.nav-dropdown-wrapper');

    dropdownWrappers.forEach(wrapper => {
      const trigger = wrapper.querySelector('.dropdown-trigger');
      const menu = wrapper.querySelector('.dropdown-menu');

      if (!trigger || !menu) return;

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menu.classList.contains('show');
        closeAllDropdowns();
        if (!isOpen) {
          menu.classList.add('show');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });

    function closeAllDropdowns() {
      dropdownWrappers.forEach(wrapper => {
        const trigger = wrapper.querySelector('.dropdown-trigger');
        const menu = wrapper.querySelector('.dropdown-menu');
        if (menu) menu.classList.remove('show');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-dropdown-wrapper')) {
        closeAllDropdowns();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllDropdowns();
      }
    });
  }

  // 4B. DASHBOARD PROFILE DROPDOWN (CLICK TOGGLE, OUTSIDE CLICK, ESCAPE DISMISS)
  function initDashboardProfileDropdown() {
    const profileWrapper = document.querySelector('.dash-profile-dropdown-wrapper');
    if (!profileWrapper) return;

    const triggerBtn = profileWrapper.querySelector('.dash-profile-btn');
    const menu = profileWrapper.querySelector('.dash-profile-menu');
    if (!triggerBtn || !menu) return;

    triggerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.contains('show');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    function openMenu() {
      menu.classList.add('show');
      triggerBtn.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      menu.classList.remove('show');
      triggerBtn.setAttribute('aria-expanded', 'false');
    }

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dash-profile-dropdown-wrapper')) {
        closeMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('show')) {
        closeMenu();
        triggerBtn.focus();
      }
    });

    // Close menu when any link inside is clicked
    const menuLinks = menu.querySelectorAll('.dash-profile-menu-link, .dash-profile-logout-btn');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
  }

  // 5. MOBILE MENU & ACCORDION (CLICK ONLY & AUTO-CLOSE ON NAV)
  function initMobileMenu() {
    const openBtn = document.querySelector('.mobile-toggle-btn');
    const closeBtn = document.querySelector('.mobile-close-btn');
    const backdrop = document.querySelector('.mobile-menu-backdrop');
    const drawer = document.querySelector('.mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-drawer a');
    const accordionTrigger = document.querySelector('.mobile-accordion-trigger');
    const accordionContent = document.querySelector('.mobile-accordion-content');

    function closeAccordion() {
      if (accordionContent && accordionTrigger) {
        accordionContent.classList.remove('open');
        accordionTrigger.setAttribute('aria-expanded', 'false');
        const chevron = accordionTrigger.querySelector('.mobile-chevron');
        if (chevron) {
          chevron.style.transform = 'rotate(0deg)';
        }
      }
    }

    function openMobileMenu() {
      if (!backdrop) return;
      closeAccordion(); // Ensure dropdown starts closed unless clicked
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    }

    function closeMobileMenu() {
      if (!backdrop) return;
      closeAccordion(); // Automatically close dropdown on menu close
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
      if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    }

    if (openBtn) openBtn.addEventListener('click', openMobileMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);

    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        // If clicking on the backdrop itself (not the drawer inside it)
        if (e.target === backdrop) {
          closeMobileMenu();
        }
      });
    }

    // Home Accordion inside Mobile Menu (Click-only)
    if (accordionTrigger && accordionContent) {
      accordionTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = accordionContent.classList.contains('open');
        accordionContent.classList.toggle('open', !isOpen);
        accordionTrigger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
        const chevron = accordionTrigger.querySelector('.mobile-chevron');
        if (chevron) {
          chevron.style.transform = !isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      });
    }

    // Automatically close Home accordion when clicking outside of it inside drawer
    if (drawer) {
      drawer.addEventListener('click', (e) => {
        if (!e.target.closest('.mobile-accordion-wrap')) {
          closeAccordion();
        }
      });
    }

    // Auto-close menu on clicking any navigation link
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop && backdrop.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    // Auto-close mobile drawer when viewport expands to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1032 && backdrop && backdrop.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // 6. HEADER SCROLL & SCROLL TO TOP
  function initScrollBehaviors() {
    const header = document.querySelector('.site-header');
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;

      if (header) {
        if (scrollY > 25) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      if (scrollTopBtn) {
        if (scrollY > 280) {
          scrollTopBtn.classList.add('visible');
        } else {
          scrollTopBtn.classList.remove('visible');
        }
      }
    }, { passive: true });

    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  // 7. ACTIVE NAVIGATION HIGHLIGHTER
  function initActiveNavigation() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const allLinks = document.querySelectorAll('.desktop-nav .nav-link, .dropdown-item, .mobile-nav-link, .mobile-sub-link');

    allLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkPath = href.split('/').pop();

      if (linkPath === currentPath) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');

        // If it's a dropdown child (e.g. index.html or home-2.html), also highlight the parent Home trigger
        const parentDropdown = link.closest('.nav-dropdown-wrapper');
        if (parentDropdown) {
          const parentTrigger = parentDropdown.querySelector('.dropdown-trigger');
          if (parentTrigger) parentTrigger.classList.add('active');
        }
      }
    });
  }

  // 8. INTERACTIVE PRICING ESTIMATOR
  function initPricingCalculator() {
    const slider = document.getElementById('pricingDistanceSlider');
    const distanceDisplay = document.getElementById('pricingDistanceVal');
    const priceDisplay = document.getElementById('pricingResultPrice');
    const tierPills = document.querySelectorAll('.pricing-tier-pill');

    if (!slider || !distanceDisplay || !priceDisplay) return;

    let selectedTier = 'rush'; // default

    const tierRates = {
      standard: { base: 8.50, perMile: 1.20 },
      rush: { base: 12.50, perMile: 1.60 },
      cargo: { base: 18.00, perMile: 2.20 }
    };

    function updatePrice() {
      const miles = parseFloat(slider.value) || 5;
      distanceDisplay.textContent = miles + ' Miles (' + Math.round(miles * 1.6) + ' km)';
      
      const rates = tierRates[selectedTier] || tierRates.rush;
      const total = rates.base + (miles * rates.perMile);
      priceDisplay.textContent = '$' + total.toFixed(2);
    }

    slider.addEventListener('input', updatePrice);

    tierPills.forEach(pill => {
      pill.addEventListener('click', () => {
        tierPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        selectedTier = pill.getAttribute('data-tier') || 'rush';
        updatePrice();
      });
    });

    // Initial calculation
    updatePrice();
  }

  // 9. AUTH PORTAL TAB & PASSWORD CONTROLLER
  function initAuthPage() {
    const tabSignin = document.getElementById('tab-btn-signin');
    const tabRegister = document.getElementById('tab-btn-register');
    const panelSignin = document.getElementById('panel-signin');
    const panelRegister = document.getElementById('panel-register');
    const cardTitle = document.querySelector('.auth-card-title');
    const cardSubtitle = document.querySelector('.auth-card-subtitle');
    const switchLinks = document.querySelectorAll('[data-switch-tab]');

    if (!tabSignin || !tabRegister || !panelSignin || !panelRegister) return;

    function switchToTab(tabName) {
      if (tabName === 'panel-register') {
        tabSignin.classList.remove('active');
        tabSignin.setAttribute('aria-selected', 'false');
        tabRegister.classList.add('active');
        tabRegister.setAttribute('aria-selected', 'true');

        panelSignin.classList.remove('active');
        panelSignin.hidden = true;
        panelRegister.classList.add('active');
        panelRegister.hidden = false;

        if (cardTitle) cardTitle.textContent = 'Create an account';
        if (cardSubtitle) cardSubtitle.textContent = 'Sign up for enterprise dispatch and live courier tracking';
      } else {
        tabRegister.classList.remove('active');
        tabRegister.setAttribute('aria-selected', 'false');
        tabSignin.classList.add('active');
        tabSignin.setAttribute('aria-selected', 'true');

        panelRegister.classList.remove('active');
        panelRegister.hidden = true;
        panelSignin.classList.add('active');
        panelSignin.hidden = false;

        if (cardTitle) cardTitle.textContent = 'Welcome back';
        if (cardSubtitle) cardSubtitle.textContent = 'Enter your credentials to access your account dashboard';
      }
    }

    tabSignin.addEventListener('click', () => switchToTab('panel-signin'));
    tabRegister.addEventListener('click', () => switchToTab('panel-register'));

    switchLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-switch-tab');
        switchToTab(target);
      });
    });

    // Password visibility toggles
    const passwordToggles = document.querySelectorAll('.auth-password-toggle');
    passwordToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const inputWrap = toggle.closest('.auth-field-input-wrap');
        if (!inputWrap) return;
        const input = inputWrap.querySelector('input');
        const eyeShow = toggle.querySelector('.eye-show');
        const eyeHide = toggle.querySelector('.eye-hide');

        if (!input) return;

        if (input.type === 'password') {
          input.type = 'text';
          if (eyeShow) eyeShow.classList.add('is-hidden');
          if (eyeHide) eyeHide.classList.remove('is-hidden');
        } else {
          input.type = 'password';
          if (eyeShow) eyeShow.classList.remove('is-hidden');
          if (eyeHide) eyeHide.classList.add('is-hidden');
        }
      });
    });
  }

  // INITIALIZE ON DOM READY
  document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initTheme();
    initDirection();
    initHomeDropdown();
    initMobileMenu();
    initScrollBehaviors();
    initActiveNavigation();
    initPricingCalculator();
    initAuthPage();
    initDashboardProfileDropdown();
  });
})();

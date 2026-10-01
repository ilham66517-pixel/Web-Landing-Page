/* ============================================
   RAKA ILHAM PORTFOLIO - MAIN JAVASCRIPT
   ============================================ */

/* ===== 1. THEME TOGGLE SYSTEM ===== */
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById('themeToggle');
    this.html = document.documentElement;
    this.STORAGE_KEY = 'theme-preference';
    this.init();
  }

  init() {
    // Set initial theme
    const savedTheme = this.getSavedTheme();
    this.setTheme(savedTheme);

    // Listen to toggle button
    this.themeToggle.addEventListener('click', () => this.toggleTheme());

    // Listen to system preference changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  getSavedTheme() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) return saved;

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  setTheme(theme) {
    this.html.dataset.theme = theme;
    this.updateThemeIcon(theme);
    try {
      localStorage.setItem(this.STORAGE_KEY, theme);
    } catch (e) {
      console.warn('Cannot save theme preference:', e);
    }
  }

  updateThemeIcon(theme) {
    const icon = this.themeToggle.querySelector('.theme-icon');
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    this.themeToggle.setAttribute('aria-label', 
      theme === 'dark' ? 'Beralih ke mode terang' : 'Beralih ke mode gelap');
  }

  toggleTheme() {
    const current = this.html.dataset.theme || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }
}

/* ===== 2. MOBILE MENU SYSTEM ===== */
class MobileMenu {
  constructor() {
    this.menuBtn = document.getElementById('menuBtn');
    this.navMenu = document.getElementById('navMenu');
    this.navLinks = this.navMenu.querySelectorAll('a');
    this.isOpen = false;
    this.init();
  }

  init() {
    // Menu button click
    this.menuBtn.addEventListener('click', () => this.toggleMenu());

    // Close menu when clicking a link
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });

    // Close menu when pressing Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && 
          !this.navMenu.contains(e.target) && 
          !this.menuBtn.contains(e.target)) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    this.isOpen ? this.closeMenu() : this.openMenu();
  }

  openMenu() {
    this.isOpen = true;
    this.navMenu.classList.add('open');
    this.menuBtn.classList.add('active');
    this.menuBtn.setAttribute('aria-expanded', 'true');
  }

  closeMenu() {
    this.isOpen = false;
    this.navMenu.classList.remove('open');
    this.menuBtn.classList.remove('active');
    this.menuBtn.setAttribute('aria-expanded', 'false');
  }
}

/* ===== 3. NAVBAR SCROLL BEHAVIOR ===== */
class NavbarScroll {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.scrollThreshold = 20;
    this.lastScrollY = 0;
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
  }

  handleScroll() {
    const scrollY = window.scrollY;

    // Add scrolled class after threshold
    if (scrollY > this.scrollThreshold) {
      if (!this.navbar.classList.contains('scrolled')) {
        this.navbar.classList.add('scrolled');
      }
    } else {
      this.navbar.classList.remove('scrolled');
    }

    this.lastScrollY = scrollY;
  }
}

/* ===== 4. ACTIVE NAVIGATION LINK ===== */
class ActiveNavigation {
  constructor() {
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('section[id]');
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.updateActiveLink(), { passive: true });
    this.updateActiveLink(); // Call on load
  }

  updateActiveLink() {
    let current = '';
    const scrollPosition = window.scrollY + 100;

    for (const section of this.sections) {
      if (section.offsetTop <= scrollPosition) {
        current = section.getAttribute('id');
      }
    }

    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  }
}

/* ===== 5. SCROLL ANIMATIONS ===== */
class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    this.init();
  }

  init() {
    // Animate sections on scroll
    this.animateSections();
  }

  animateSections() {
    const sections = document.querySelectorAll('.section');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.addAnimation(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  addAnimation(element) {
    // Add staggered animation to child elements
    const cards = element.querySelectorAll('.daily-card, .skill-card, .vcard, .contact-card, .inspiration-card, .building-card');
    
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.animation = 'fadeInUp 0.6s ease-out forwards';
      }, index * 100);
    });
  }
}

/* ===== 6. SMOOTH SCROLL LINK HANDLER ===== */
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      this.scrollToElement(target);
    });
  }

  scrollToElement(element) {
    const offsetTop = element.offsetTop - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
}

/* ===== 7. PARALLAX EFFECT (Optional) ===== */
class ParallaxEffect {
  constructor() {
    this.heroVisual = document.querySelector('.hero-visual');
    this.init();
  }

  init() {
    if (!this.heroVisual) return;
    
    window.addEventListener('scroll', () => this.update(), { passive: true });
  }

  update() {
    const scrollY = window.scrollY;
    const parallaxValue = scrollY * 0.5;
    
    if (this.heroVisual) {
      this.heroVisual.style.transform = `translateY(${parallaxValue}px)`;
    }
  }
}

/* ===== 8. INTERSECTION OBSERVER FOR LAZY FEATURES ===== */
class LazyLoad {
  constructor() {
    this.init();
  }

  init() {
    const images = document.querySelectorAll('img');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            // Can add loading animation here
            observer.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }
}

/* ===== 9. FORM ENHANCEMENT (for future contact form) ===== */
class FormEnhancer {
  constructor() {
    this.init();
  }

  init() {
    const form = document.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  handleSubmit(e) {
    // This can be expanded for actual form handling
    console.log('Form submitted');
  }
}

/* ===== 10. ACCESSIBILITY IMPROVEMENTS ===== */
class Accessibility {
  constructor() {
    this.init();
  }

  init() {
    this.improveSkipLink();
    this.enhanceKeyboardNavigation();
  }

  improveSkipLink() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const main = document.getElementById('main');
        main.focus();
      });
    }
  }

  enhanceKeyboardNavigation() {
    // Ensure all interactive elements are keyboard accessible
    const buttons = document.querySelectorAll('button, a');
    buttons.forEach(button => {
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (button.tagName === 'BUTTON') {
            e.preventDefault();
            button.click();
          }
        }
      });
    });
  }
}

/* ===== 11. PERFORMANCE MONITORING ===== */
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    // Monitor page load performance
    if (window.performance && window.performance.timing) {
      window.addEventListener('load', () => {
        this.logPerformance();
      });
    }
  }

  logPerformance() {
    const perf = window.performance.timing;
    const pageLoadTime = perf.loadEventEnd - perf.navigationStart;
    console.log(`Page load time: ${pageLoadTime}ms`);
  }
}

/* ===== 12. INITIALIZE ALL SYSTEMS ===== */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all features
  new ThemeManager();
  new MobileMenu();
  new NavbarScroll();
  new ActiveNavigation();
  new ScrollAnimations();
  new SmoothScroll();
  new ParallaxEffect();
  new LazyLoad();
  new Accessibility();
  new PerformanceMonitor();

  console.log('✨ Raka Ilham Portfolio loaded successfully!');
});

/* ===== 13. HELPER UTILITIES ===== */
const Utils = {
  // Debounce function for scroll events
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Detect mobile device
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  // Get element viewport position
  getElementViewportPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right,
      isVisible: rect.top < window.innerHeight && rect.bottom > 0
    };
  }
};

/* ===== 14. ADD CSS ANIMATION KEYFRAMES DYNAMICALLY ===== */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

// Export Utils for external use if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
}

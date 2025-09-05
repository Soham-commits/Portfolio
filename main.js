// ===== PORTFOLIO WEBSITE JAVASCRIPT =====
// Modern ES6+ functionality with performance optimizations

// ===== UTILITY FUNCTIONS =====
const utils = {
  // Throttle function for performance optimization
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Debounce function for search and resize events
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

  // Check if element is in viewport
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // Get element's position relative to viewport
  getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.pageYOffset,
      bottom: rect.bottom + window.pageYOffset
    };
  },

  // Check if user prefers reduced motion
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Generate random delay for staggered animations
  randomDelay(min = 0, max = 200) {
    return Math.random() * (max - min) + min;
  }
};

// ===== NAVIGATION FUNCTIONALITY =====
class Navigation {
  constructor() {
    this.header = document.querySelector('.header');
    this.navToggle = document.querySelector('.nav-toggle');
    this.navMenu = document.querySelector('.nav-menu');
  this.mobileDropdown = document.getElementById('mobile-dropdown');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('section[id]');
    this.scrollToTopBtn = this.createScrollToTopButton();
    
    this.isMenuOpen = false;
    this.lastScrollY = window.pageYOffset;
    this.scrollDirection = 'up';
    this.scrollThreshold = 50;
    this.isHeaderVisible = true;
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.setupScrollToTop();
  }

  bindEvents() {
    // Mobile menu toggle
    this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
    // Keyboard activation for accessibility (Enter / Space)
    this.navToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleMobileMenu();
      }
    });
    
    // Smooth scrolling for nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleNavClick(e));
    });

    // Header scroll effects with direction detection
    const scrollHandler = utils.throttle(() => this.handleScroll(), 16);
    window.addEventListener('scroll', scrollHandler);
    
    // Close mobile menu on outside click
    document.addEventListener('click', (e) => this.handleOutsideClick(e));
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.navToggle.classList.toggle('active', this.isMenuOpen);
    if (this.mobileDropdown) {
      this.mobileDropdown.classList.toggle('open', this.isMenuOpen);
    } else {
      this.navMenu.classList.toggle('active', this.isMenuOpen);
    }
  // Update ARIA for assistive tech
  try { this.navToggle.setAttribute('aria-expanded', String(this.isMenuOpen)); } catch (e) {}
  try { this.navMenu.setAttribute('aria-hidden', String(!this.isMenuOpen)); } catch (e) {}
    
    // Focus management for accessibility
    if (this.isMenuOpen) {
      // focus the first nav item inside the dropdown for accessibility
      const first = (this.mobileDropdown || this.navMenu).querySelector('.nav-link');
      first?.focus();
    }
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  handleNavClick(e) {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    
    // Handle external links (like internship.html)
    if (href.includes('.html')) {
      window.location.href = href;
      return;
    }
    
    const targetId = href.substring(1);
    const targetSection = document.getElementById(targetId);
    
    if (targetSection) {
      this.smoothScrollTo(targetSection);
      this.closeMobileMenu();
    }
  }

  handleScroll() {
    const currentScrollY = window.pageYOffset;
    
    // Determine scroll direction
    if (currentScrollY > this.lastScrollY) {
      this.scrollDirection = 'down';
    } else {
      this.scrollDirection = 'up';
    }
    
    // Show/hide header based on scroll direction and position
    this.handleHeaderVisibility(currentScrollY);
    
    // Header background effect
    this.handleHeaderBackground(currentScrollY);
    
    // Active section highlighting
    this.updateActiveSection();
    
    // Scroll to top button visibility
    this.toggleScrollToTopButton(currentScrollY);
    
    this.lastScrollY = currentScrollY;
  }

  handleHeaderVisibility(currentScrollY) {
    // Keep navbar always visible - disable hide/show functionality
    this.header.classList.remove('header-hidden');
    this.isHeaderVisible = true;
  }

  handleHeaderBackground(currentScrollY) {
    // Keep header transparent and only style the nav-container
    // No styling applied to header - let CSS handle it
  }

  updateActiveSection() {
    const scrollPosition = window.pageYOffset + 90; // Account for fixed navbar height
    
    this.sections.forEach(section => {
      const sectionTop = utils.getElementPosition(section).top;
      const sectionBottom = utils.getElementPosition(section).bottom;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        navLink?.classList.add('active');
      } else {
        navLink?.classList.remove('active');
      }
    });
  }

  smoothScrollTo(targetElement) {
    const targetPosition = utils.getElementPosition(targetElement).top - 90; // Account for fixed navbar height
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  closeMobileMenu() {
    if (this.isMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  handleOutsideClick(e) {
    if (this.isMenuOpen && !this.navToggle.contains(e.target) && !this.navMenu.contains(e.target)) {
      this.closeMobileMenu();
    }
  }

  handleKeydown(e) {
    if (e.key === 'Escape' && this.isMenuOpen) {
      this.closeMobileMenu();
    }
  }

  createScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-to-top';
    button.setAttribute('aria-label', 'Scroll to top');
    button.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      background: var(--color-primary);
      color: var(--color-background);
      border: none;
      border-radius: 50%;
      font-size: 20px;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px);
      transition: all 0.3s ease;
      z-index: 9998;
      box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
    `;
    
    button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    document.body.appendChild(button);
    return button;
  }

  toggleScrollToTopButton(scrollY) {
    if (scrollY > 500) {
      this.scrollToTopBtn.style.opacity = '1';
      this.scrollToTopBtn.style.visibility = 'visible';
      this.scrollToTopBtn.style.transform = 'translateY(0)';
    } else {
      this.scrollToTopBtn.style.opacity = '0';
      this.scrollToTopBtn.style.visibility = 'hidden';
      this.scrollToTopBtn.style.transform = 'translateY(20px)';
    }
  }

  setupScrollToTop() {
    // Add hover effect
    this.scrollToTopBtn.addEventListener('mouseenter', () => {
      this.scrollToTopBtn.style.transform = 'translateY(-3px) scale(1.1)';
      this.scrollToTopBtn.style.boxShadow = '0 6px 20px rgba(255, 255, 255, 0.4)';
    });
    
    this.scrollToTopBtn.addEventListener('mouseleave', () => {
      this.scrollToTopBtn.style.transform = 'translateY(0) scale(1)';
      this.scrollToTopBtn.style.boxShadow = '0 4px 12px rgba(255, 255, 255, 0.3)';
    });
  }
}

// ===== ANIMATIONS & VISUAL EFFECTS =====
class Animations {
  constructor() {
    this.animatedElements = document.querySelectorAll('.fade-in, .project-card, .planet, .timeline-item, .stat');
    this.heroSubtitle = document.querySelector('.hero-subtitle');
    this.stats = document.querySelectorAll('.stat-number');
    
    this.init();
  }

  init() {
    if (!utils.prefersReducedMotion()) {
      this.setupIntersectionObserver();
      this.initTypewriterEffect();
      this.setupCounterAnimations();
      this.setupStaggeredAnimations();
    }
  }

  setupIntersectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Add staggered delay for grid items
          if (entry.target.classList.contains('project-card') || 
              entry.target.classList.contains('planet')) {
            const delay = utils.randomDelay(0, 300);
            entry.target.style.transitionDelay = `${delay}ms`;
          }
          
          // Special handling for timeline items
          if (entry.target.classList.contains('timeline-item')) {
            const delay = utils.randomDelay(0, 400);
            entry.target.style.transitionDelay = `${delay}ms`;
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, options);

    this.animatedElements.forEach(el => {
      el.classList.add('fade-in');
      observer.observe(el);
    });
  }

  initTypewriterEffect() {
    if (!this.heroSubtitle) return;
    
    const text = this.heroSubtitle.textContent;
    this.heroSubtitle.textContent = '';
    this.heroSubtitle.style.borderRight = '2px solid var(--color-primary)';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        this.heroSubtitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        // Remove cursor after typing is complete
        setTimeout(() => {
          this.heroSubtitle.style.borderRight = 'none';
        }, 1000);
      }
    };
    
    // Start typing after a delay
    setTimeout(typeWriter, 1000);
  }

  setupCounterAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    this.stats.forEach(stat => observer.observe(stat));
  }

  animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const suffix = element.textContent.replace(/\d/g, '');
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + suffix;
    }, 30);
  }

  setupStaggeredAnimations() {
    // Add hover effects for interactive elements
    this.addHoverEffects();
  }

  addHoverEffects() {
    // Project card hover effects
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });

    // Tech badge hover effects
    document.querySelectorAll('.tech-badge').forEach(badge => {
      badge.addEventListener('mouseenter', () => {
        badge.style.transform = 'translateY(-3px)';
        badge.style.boxShadow = '0 6px 12px rgba(255, 255, 255, 0.15)';
      });
      
      badge.addEventListener('mouseleave', () => {
        badge.style.transform = '';
        badge.style.boxShadow = '';
      });
    });
  }
}

// ===== FORM HANDLING =====
class ContactForm {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.submitButton = this.form?.querySelector('button[type="submit"]');
    this.formData = {};
    
    this.init();
  }

  init() {
    if (!this.form) return;
    
    this.bindEvents();
    this.setupRealTimeValidation();
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Real-time validation
    this.form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('input', () => this.clearFieldError(field));
    });
  }

  setupRealTimeValidation() {
    const emailField = this.form.querySelector('#email');
    if (emailField) {
      emailField.addEventListener('input', utils.debounce(() => {
        this.validateEmail(emailField);
      }, 300));
    }
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Clear previous errors
    this.clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
      this.showFieldError(field, `${this.getFieldLabel(field)} is required`);
      return false;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
      if (!this.isValidEmail(value)) {
        this.showFieldError(field, 'Please enter a valid email address');
        return false;
      }
    }
    
    // Message length validation
    if (fieldName === 'message' && value.length < 10) {
      this.showFieldError(field, 'Message must be at least 10 characters long');
      return false;
    }
    
    return true;
  }

  validateEmail(field) {
    const value = field.value.trim();
    if (value && !this.isValidEmail(value)) {
      this.showFieldError(field, 'Please enter a valid email address');
      return false;
    }
    return true;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showFieldError(field, message) {
    // Remove existing error
    this.clearFieldError(field);
    
    // Add error styling
    field.style.borderColor = '#ff6b6b';
    field.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.1)';
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
      color: #ff6b6b;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      animation: fadeIn 0.3s ease;
    `;
    
    field.parentNode.appendChild(errorDiv);
  }

  clearFieldError(field) {
    field.style.borderColor = '';
    field.style.boxShadow = '';
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  getFieldLabel(field) {
    const label = field.parentNode.querySelector('.form-label');
    return label ? label.textContent : field.name;
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    const fields = this.form.querySelectorAll('input, textarea');
    let isValid = true;
    
    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      this.showFormError('Please fix the errors above');
      return;
    }
    
    // Collect form data
    this.collectFormData();
    
    // Show loading state
    this.setLoadingState(true);
    
    try {
      // Simulate form submission (replace with actual endpoint)
      await this.submitForm();
      this.showFormSuccess();
      this.form.reset();
    } catch (error) {
      this.showFormError('Something went wrong. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      this.setLoadingState(false);
    }
  }

  collectFormData() {
    const formData = new FormData(this.form);
    this.formData = Object.fromEntries(formData);
  }

  async submitForm() {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Network error'));
        }
      }, 2000);
    });
  }

  setLoadingState(loading) {
    if (this.submitButton) {
      this.submitButton.disabled = loading;
      this.submitButton.textContent = loading ? 'Sending...' : 'Send Message';
      
      if (loading) {
        this.submitButton.style.opacity = '0.7';
        this.submitButton.style.cursor = 'not-allowed';
      } else {
        this.submitButton.style.opacity = '1';
        this.submitButton.style.cursor = 'pointer';
      }
    }
  }

  showFormSuccess() {
    this.showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
  }

  showFormError(message) {
    this.showFormMessage(message, 'error');
  }

  showFormMessage(message, type) {
    // Remove existing messages
    const existingMessage = this.form.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message--${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      font-weight: 500;
      animation: fadeIn 0.3s ease;
      ${type === 'success' 
        ? 'background: rgba(76, 175, 80, 0.1); color: #4caf50; border: 1px solid #4caf50;'
        : 'background: rgba(244, 67, 54, 0.1); color: #f44336; border: 1px solid #f44336;'
      }
    `;
    
    this.form.insertBefore(messageDiv, this.form.firstChild);
    
    // Auto-remove success messages
    if (type === 'success') {
      setTimeout(() => {
        messageDiv.remove();
      }, 5000);
    }
  }
}

// ===== INTERACTIVE ELEMENTS =====
class InteractiveElements {
  constructor() {
    this.init();
  }

  init() {
    this.setupTechStackInteractions();
    this.setupProjectCardInteractions();
    this.setupButtonEffects();
    this.setupProjectVideoInteractions();
    this.setupCollapsibleSections();
  }

  setupTechStackInteractions() {
    const planets = document.querySelectorAll('.planet');
    const aiCenter = document.querySelector('.ai-center');
    const orbits = document.querySelectorAll('.orbit');

    // Ensure animations start properly
    planets.forEach(planet => {
      planet.style.animationPlayState = 'running';
    });

    orbits.forEach(orbit => {
      orbit.style.animationPlayState = 'running';
    });

    // Planet hover interactions - works for both inner and outer orbits
    planets.forEach(planet => {
      planet.addEventListener('mouseenter', () => {
        // Pause the parent orbit animation (works for both inner and outer)
        const parentOrbit = planet.closest('.orbit');
        if (parentOrbit) {
          parentOrbit.style.animationPlayState = 'paused';
        }
      });

      planet.addEventListener('mouseleave', () => {
        // Resume the parent orbit animation (works for both inner and outer)
        const parentOrbit = planet.closest('.orbit');
        if (parentOrbit) {
          parentOrbit.style.animationPlayState = 'running';
        }
      });

      // Click to show tech details
      planet.addEventListener('click', () => {
        this.showTechDetails(planet);
      });
    });

    // AI center hover interactions
    if (aiCenter) {
      aiCenter.addEventListener('mouseenter', () => {
        // Pause all orbit animations and highlight all planets
        orbits.forEach(orbit => {
          orbit.style.animationPlayState = 'paused';
        });
        
        planets.forEach(planet => {
          planet.style.transform += ' scale(1.1)';
        });
      });

      aiCenter.addEventListener('mouseleave', () => {
        // Resume all orbit animations and reset planet scales
        orbits.forEach(orbit => {
          orbit.style.animationPlayState = 'running';
        });
        
        planets.forEach(planet => {
          planet.style.transform = planet.style.transform.replace(' scale(1.1)', '');
        });
      });
    }

    // Keep planet text upright during rotation
    this.setupTextRotation();
  }

  setupTextRotation() {
    const planets = document.querySelectorAll('.planet');
    
    // Function to update text rotation based on planet position
    const updateTextRotation = () => {
      planets.forEach(planet => {
        const planetName = planet.querySelector('.planet-name');
        if (planetName) {
          // Get the current transform of the planet
          const transform = getComputedStyle(planet).transform;
          const matrix = new DOMMatrix(transform);
          
          // Calculate the angle from the transform matrix
          const angle = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
          
          // Keep text upright by counter-rotating
          planetName.style.transform = `translateX(-50%) rotate(${-angle}deg)`;
        }
      });
    };

    // Update text rotation periodically during animation
    setInterval(updateTextRotation, 100);
  }

  showTechDetails(planet) {
    const techName = planet.getAttribute('data-tech') || planet.querySelector('.planet-name').textContent;
    
    // Create tooltip or modal (simple tooltip for now)
    const tooltip = document.createElement('div');
    tooltip.className = 'tech-tooltip';
    tooltip.textContent = `Click to learn more about ${techName}`;
    tooltip.style.cssText = `
      position: absolute;
      background: var(--color-surface);
      color: var(--color-text);
      padding: 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      pointer-events: none;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    // Position tooltip
    const rect = planet.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
    
    // Show tooltip
    setTimeout(() => {
      tooltip.style.opacity = '1';
      tooltip.style.transform = 'translateY(0)';
    }, 10);
    
    // Hide tooltip after delay
    setTimeout(() => {
      tooltip.style.opacity = '0';
      tooltip.style.transform = 'translateY(10px)';
      setTimeout(() => tooltip.remove(), 300);
    }, 2000);
  }

  setupProjectCardInteractions() {
    document.querySelectorAll('.project-card').forEach(card => {
      const image = card.querySelector('.project-image');
      
      if (image) {
        card.addEventListener('mouseenter', () => {
          image.style.transform = 'scale(1.05)';
          image.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', () => {
          image.style.transform = 'scale(1)';
        });
      }
    });
  }

  setupButtonEffects() {
    // General button effects
    document.querySelectorAll('.btn').forEach(button => {
      button.addEventListener('mousedown', () => {
        button.style.transform = 'scale(0.95)';
      });
      
      button.addEventListener('mouseup', () => {
        button.style.transform = '';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = '';
      });
    });

    // Enhanced hover effects for project buttons (modern premium style)
    document.querySelectorAll('.project-button').forEach(button => {
      // Add subtle right arrow animation on hover
      const buttonText = button.querySelector('span') || button;
      const originalText = buttonText.textContent;
      
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-3px) scale(1.05)';
        // Add right arrow animation
        if (!buttonText.textContent.includes('→')) {
          buttonText.textContent = originalText + ' →';
        }
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0) scale(1)';
        // Remove right arrow
        buttonText.textContent = originalText;
      });
      
      button.addEventListener('mousedown', () => {
        button.style.transform = 'translateY(-1px) scale(1.02)';
      });
      
      button.addEventListener('mouseup', () => {
        button.style.transform = 'translateY(-3px) scale(1.05)';
      });
    });
  }

  setupProjectVideoInteractions() {
    // Handle both main page and internship page video containers
    const videoContainers = document.querySelectorAll('.video-container, .internship-card__video-container');
    
    videoContainers.forEach(container => {
      const video = container.querySelector('.demo-video, .internship-card__demo-video');
      const playButton = container.querySelector('.play-button, .internship-card__play-button');
      
      if (!video || !playButton) return;
      
      // Debug: Check if video source exists
      console.log('Video source:', video.querySelector('source')?.src);
      
      // Play button click handler
      playButton.addEventListener('click', () => {
        console.log('Play button clicked, video paused:', video.paused);
        if (video.paused) {
          video.play().then(() => {
            console.log('Video started playing');
            playButton.classList.add('playing');
            playButton.setAttribute('aria-label', playButton.getAttribute('aria-label').replace('Play', 'Pause'));
          }).catch(error => {
            console.error('Error playing video:', error);
          });
        } else {
          video.pause();
          console.log('Video paused');
          playButton.classList.remove('playing');
          playButton.setAttribute('aria-label', playButton.getAttribute('aria-label').replace('Pause', 'Play'));
        }
      });
      
      // Video event handlers
      video.addEventListener('play', () => {
        playButton.classList.add('playing');
        playButton.setAttribute('aria-label', playButton.getAttribute('aria-label').replace('Play', 'Pause'));
      });
      
      video.addEventListener('pause', () => {
        playButton.classList.remove('playing');
        playButton.setAttribute('aria-label', playButton.getAttribute('aria-label').replace('Pause', 'Play'));
      });
      
      video.addEventListener('ended', () => {
        playButton.classList.remove('playing');
        playButton.setAttribute('aria-label', playButton.getAttribute('aria-label').replace('Pause', 'Play'));
      });
      
      // Pause video when it goes out of viewport
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting && !video.paused) {
            video.pause();
            playButton.classList.remove('playing');
            playButton.setAttribute('aria-label', playButton.getAttribute('aria-label').replace('Pause', 'Play'));
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(container);
      
      // Pause video when user scrolls away
      let scrollTimeout;
      const handleScroll = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          if (!video.paused) {
            video.pause();
            playButton.classList.remove('playing');
            playButton.setAttribute('aria-label', playButton.getAttribute('aria-label').replace('Pause', 'Play'));
          }
        }, 100);
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      // Add error handling for video loading
      video.addEventListener('error', (e) => {
        console.error('Video loading error:', e);
        console.error('Video error details:', video.error);
      });
      
      video.addEventListener('loadedmetadata', () => {
        console.log('Video metadata loaded successfully');
      });
    });
  }

  setupCollapsibleSections() {
    // Handle both old collapse buttons and new integrated view projects buttons
    const collapseBtns = document.querySelectorAll('.collapse-btn, .internship-card__projects-btn');
    
    collapseBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const isActive = btn.classList.contains('active');
        
        // Toggle active state
        btn.classList.toggle('active');
        
        // Find the collapse content - could be next sibling or within the same card
        let collapseContent;
        if (btn.classList.contains('internship-card__projects-btn')) {
          // For integrated button, look for projects section within the same card
          collapseContent = btn.closest('.internship-card').querySelector('.internship-card__projects-section');
        } else {
          // For old collapse buttons, look for next sibling
          collapseContent = btn.nextElementSibling;
        }
        
        if (collapseContent && (collapseContent.classList.contains('collapse') || collapseContent.classList.contains('internship-card__projects-section'))) {
          if (isActive) {
            // Hide content
            collapseContent.style.display = 'none';
            setTimeout(() => {
              collapseContent.classList.remove('active');
            }, 10);
          } else {
            // Show content
            collapseContent.style.display = 'block';
            setTimeout(() => {
              collapseContent.classList.add('active');
            }, 10);
          }
        }
      });
    });
  }
}

// ===== PERFORMANCE & ACCESSIBILITY =====
class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.setupLazyLoading();
    this.optimizeScrollEvents();
    this.setupKeyboardNavigation();
  }

  setupLazyLoading() {
    // Lazy load images (if any are added later)
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    }
  }

  optimizeScrollEvents() {
    // Use passive listeners for better performance
    const scrollOptions = { passive: true };
    
    window.addEventListener('scroll', () => {}, scrollOptions);
    window.addEventListener('resize', utils.debounce(() => {
      // Handle resize events
    }, 250));
  }

  setupKeyboardNavigation() {
    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
      // Tab navigation improvements
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }
}

// ===== MOBILE OPTIMIZATIONS =====
class MobileOptimizer {
  constructor() {
    this.isMobile = window.innerWidth <= 768;
    this.touchStartY = 0;
    this.touchEndY = 0;
    
    this.init();
  }

  init() {
    this.setupTouchGestures();
    this.optimizeMobileAnimations();
    this.setupMobileBreakpointDetection();
  }

  setupTouchGestures() {
    // Swipe gestures for mobile
    document.addEventListener('touchstart', (e) => {
      this.touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
      this.touchEndY = e.changedTouches[0].clientY;
      this.handleSwipe();
    }, { passive: true });
  }

  handleSwipe() {
    const swipeDistance = this.touchStartY - this.touchEndY;
    const minSwipeDistance = 50;
    
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swipe up - could trigger scroll to next section
        console.log('Swipe up detected');
      } else {
        // Swipe down - could trigger scroll to previous section
        console.log('Swipe down detected');
      }
    }
  }

  optimizeMobileAnimations() {
    if (this.isMobile) {
      // Reduce animation complexity on mobile
      document.documentElement.style.setProperty('--transition-normal', '0.2s ease');
      document.documentElement.style.setProperty('--transition-slow', '0.3s ease');
    }
  }

  setupMobileBreakpointDetection() {
    window.addEventListener('resize', utils.debounce(() => {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth <= 768;
      
      if (wasMobile !== this.isMobile) {
        this.optimizeMobileAnimations();
      }
    }, 250));
  }
}

/* ===== TIMELINE INTERACTION (lightweight & accessible) ===== */
function timelineInit() {
  const items = document.querySelectorAll('.timeline-item');
  if (!items || !items.length) return;

  const prefersReduced = utils.prefersReducedMotion();

  items.forEach(item => {
    const node = item.querySelector('.timeline-node');
    const details = item.querySelector('.timeline-details');
    if (!node || !details) return;

    // Ensure details start hidden for accessibility
    if (!details.hasAttribute('hidden')) details.setAttribute('hidden', '');

    node.setAttribute('role', 'button');
    node.setAttribute('tabindex', '0');
    node.setAttribute('aria-expanded', 'false');

    function open() {
      details.classList.add('show');
      details.removeAttribute('hidden');
      node.setAttribute('aria-expanded', 'true');
    }

    function close() {
      details.classList.remove('show');
      if (!prefersReduced) {
        setTimeout(() => details.setAttribute('hidden', ''), 320);
      } else {
        details.setAttribute('hidden', '');
      }
      node.setAttribute('aria-expanded', 'false');
    }

    node.addEventListener('click', () => {
      const expanded = node.getAttribute('aria-expanded') === 'true';
      if (expanded) close(); else open();
    });

    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        node.click();
      }
      if (e.key === 'Escape') {
        close();
        node.focus();
      }
    });
  });
}

/* ===== HORIZONTAL TIMELINE NAVIGATION ===== */
function horizontalTimelineInit(){
  const track = document.querySelector('.htl-track');
  const btnLeft = document.querySelector('.htl-nav-left');
  const btnRight = document.querySelector('.htl-nav-right');
  if(!track) return;

  const scrollAmount = 300; // px per nav click
  btnLeft?.addEventListener('click', ()=> track.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
  btnRight?.addEventListener('click', ()=> track.scrollBy({ left: scrollAmount, behavior: 'smooth' }));

  // Keyboard: left/right arrows when track focused
  track.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: scrollAmount, behavior: 'smooth' }); }
    if(e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: -scrollAmount, behavior: 'smooth' }); }
  });

  // Simple touch swipe handling
  let startX = 0;
  track.addEventListener('touchstart', (e)=> { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e)=>{
    const endX = e.changedTouches[0].clientX;
    const dx = startX - endX;
    if(Math.abs(dx) > 40) {
      track.scrollBy({ left: dx > 0 ? scrollAmount : -scrollAmount, behavior: 'smooth' });
    }
  });
}

// ===== MAIN APPLICATION CLASS =====
// ===== TERMINAL ANIMATION CLASS =====
class TerminalAnimation {
  constructor() {
    this.bioText = `> Initializing AI Engineer Profile...
> Loading personality modules...
> Scanning achievements...

🚀 Passionate AI Engineer with a relentless drive for innovation
📚 Currently mastering Computer Science at VIT, Vellore
💡 Built cutting-edge ML models and neural networks from scratch
🌟 Expertise spans from GPT architectures to computer vision
⚡ Love turning complex problems into elegant solutions
🎯 Always pushing the boundaries of what's possible with AI

> Profile loaded successfully!
> Ready to innovate and create the future 🌟`;

    this.init();
  }

  init() {
    this.setupRunButton();
    this.setupIntersectionObserver();
  }

  typeText(element, text, speed = 30) {
    let i = 0;
    element.innerHTML = '';
    
    const type = () => {
      if (i < text.length) {
        if (text.charAt(i) === '\n') {
          element.innerHTML += '<br>';
        } else {
          element.innerHTML += text.charAt(i);
        }
        i++;
        setTimeout(type, speed);
      } else {
        // Animation complete
        const cursor = document.getElementById('cursor');
        if (cursor) {
          cursor.style.animation = 'blink 1s infinite';
        }
      }
    };
    
    type();
  }

  initTerminalAnimation() {
    const typingElement = document.getElementById('typing-text');
    const cursor = document.getElementById('cursor');
    
    if (typingElement && cursor) {
      // Stop cursor blinking during typing
      cursor.style.animation = 'none';
      cursor.style.opacity = '1';
      
      // Start typing animation
      this.typeText(typingElement, this.bioText, 40);
    }
  }

  setupRunButton() {
    const runBtn = document.getElementById('runAnimation');
    if (runBtn) {
      runBtn.addEventListener('click', () => {
        this.initTerminalAnimation();
      });
    }
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    };

    const terminalObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add a small delay for dramatic effect
          setTimeout(() => {
            this.initTerminalAnimation();
          }, 500);
          terminalObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const terminal = document.querySelector('.ai-log-container');
    if (terminal) {
      terminalObserver.observe(terminal);
    }
  }
}

// ===== PORTFOLIO APP CLASS =====
class PortfolioApp {
  constructor() {
    this.navigation = null;
    this.animations = null;
    this.contactForm = null;
    this.interactiveElements = null;
    this.performanceOptimizer = null;
    this.mobileOptimizer = null;
    this.terminalAnimation = null;
    
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupApp());
    } else {
      this.setupApp();
    }
  }

  setupApp() {
    try {
      // Initialize all modules
      this.navigation = new Navigation();
      this.animations = new Animations();
      this.contactForm = new ContactForm();
      this.interactiveElements = new InteractiveElements();
      this.performanceOptimizer = new PerformanceOptimizer();
      this.mobileOptimizer = new MobileOptimizer();
  // Initialize timeline interactions
  timelineInit();
  // Initialize horizontal timeline navigation (if present)
  try { horizontalTimelineInit(); } catch (e) { /* optional */ }
      
      // Initialize hero keyword cycling
      this.initHeroKeywordCycling();
      
      // Add CSS for keyboard navigation
      this.addKeyboardNavigationStyles();
      
      console.log('Portfolio website initialized successfully!');
    } catch (error) {
      console.error('Error initializing portfolio app:', error);
    }
  }

  initHeroKeywordCycling() {
    // Simple fade-in animation for centered hero
    const heroElements = document.querySelectorAll('.hero-name-centered, .hero-title-centered, .hero-accent-line, .hero-cta-buttons');
    
    heroElements.forEach((element, index) => {
      if (element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
          element.style.transition = 'all 1s ease-out';
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }, 300 + (index * 200));
      }
    });
    
    // Add subtle hover effects to buttons
    this.initializeButtonEffects();
  }

  initializeButtonEffects() {
    const ghostButtons = document.querySelectorAll('.btn-outline-ghost');
    
    ghostButtons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-3px) scale(1.05)';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0) scale(1)';
      });
      
      button.addEventListener('mousedown', () => {
        button.style.transform = 'translateY(-1px) scale(1.02)';
      });
      
      button.addEventListener('mouseup', () => {
        button.style.transform = 'translateY(-3px) scale(1.05)';
      });
    });
  }

  addKeyboardNavigationStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .keyboard-navigation *:focus {
        outline: 2px solid var(--color-primary) !important;
        outline-offset: 2px !important;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }
}

// ===== INITIALIZE APPLICATION =====
// Start the application when the script loads
const app = new PortfolioApp();

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PortfolioApp, utils };
}

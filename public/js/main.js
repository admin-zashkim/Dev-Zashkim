// Security Hardening (Optional - can be bypassed)
(function() {
    // Disable right click (optional - not foolproof)
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });

    // Disable keyboard shortcuts for dev tools (optional)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.key === 'U') ||
            (e.ctrlKey && e.key === 'S')) {
            e.preventDefault();
            return false;
        }
    });

    // Prevent dragging of images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });
})();

// Main Application
class PortfolioApp {
    constructor() {
        this.config = null;
        this.sections = document.querySelectorAll('section');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.navbar = document.getElementById('navbar');
        this.init();
    }

    async init() {
        await this.loadConfig();
        this.initNavigation();
        this.initScrollSpy();
        this.initAnimations();
        this.initMobileMenu();
        this.initContactForm();
        this.setupEventListeners();
    }

    async loadConfig() {
        try {
            const response = await fetch('/api/config');
            if (!response.ok) throw new Error('Failed to load config');
            this.config = await response.json();
            this.renderSocialLinks();
            this.renderContactInfo();
        } catch (error) {
            console.error('Error loading config:', error);
            this.renderFallbackSocialLinks();
        }
    }

    renderSocialLinks() {
        const socialLinksContainer = document.getElementById('socialLinks');
        if (!socialLinksContainer) return;

        // Clear container first
        socialLinksContainer.innerHTML = '';

        const links = [
            { url: this.config?.github, label: 'GitHub', icon: 'fab fa-github' },
            { url: this.config?.linkedin, label: 'LinkedIn', icon: 'fab fa-linkedin' },
            { url: this.config?.whatsapp, label: 'WhatsApp', icon: 'fab fa-whatsapp' },
            { url: this.config?.instagram, label: 'Instagram', icon: 'fab fa-instagram' },
            { url: this.config?.email ? `mailto:${this.config.email}` : null, label: 'Email', icon: 'far fa-envelope' }
        ].filter(link => link.url);

        links.forEach(link => {
            const anchor = document.createElement('a');
            anchor.href = link.url;
            anchor.className = 'social-link';
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
            anchor.innerHTML = `<i class="${link.icon}"></i><span>${link.label}</span>`;
            socialLinksContainer.appendChild(anchor);
        });
    }

    renderContactInfo() {
        // Update email display
        const emailDisplay = document.getElementById('emailDisplay');
        if (emailDisplay && this.config?.email) {
            emailDisplay.textContent = this.config.email;
        }

        // Update phone display
        const phoneDisplay = document.querySelector('.contact-phone span');
        if (phoneDisplay && this.config?.phone) {
            phoneDisplay.textContent = this.config.phone;
        }
    }

    renderFallbackSocialLinks() {
        const socialLinksContainer = document.getElementById('socialLinks');
        if (socialLinksContainer) {
            socialLinksContainer.innerHTML = '';
            
            const fallbackLinks = [
                { icon: 'fab fa-github', label: 'GitHub', url: '#' },
                { icon: 'fab fa-linkedin', label: 'LinkedIn', url: '#' },
                { icon: 'fab fa-whatsapp', label: 'WhatsApp', url: '#' },
                { icon: 'fab fa-instagram', label: 'Instagram', url: '#' },
                { icon: 'far fa-envelope', label: 'Email', url: '#' }
            ];
            
            fallbackLinks.forEach(link => {
                const anchor = document.createElement('a');
                anchor.href = link.url;
                anchor.className = 'social-link';
                anchor.innerHTML = `<i class="${link.icon}"></i><span>${link.label}</span>`;
                socialLinksContainer.appendChild(anchor);
            });
        }
    }

    initNavigation() {
        // Smooth scroll for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                if (targetId === '#home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }

                // Close mobile menu after click
                const navMenu = document.querySelector('.nav-menu');
                const navToggle = document.querySelector('.nav-toggle');
                navMenu?.classList.remove('active');
                navToggle?.classList.remove('active');
            });
        });

        // Navbar background change on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });
    }

    initScrollSpy() {
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPosition = window.scrollY + 100;

            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    current = section.getAttribute('id');
                }
            });

            this.navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href').substring(1);
                if (href === current || (current === '' && href === 'home')) {
                    link.classList.add('active');
                }
            });
        });
    }

    initAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Animate project cards with delay
                    if (entry.target.classList.contains('project-card')) {
                        const index = entry.target.dataset.project;
                        entry.target.style.transitionDelay = `${index * 0.1}s`;
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe sections and elements
        document.querySelectorAll('section, .project-card, .skill-category, .timeline-item').forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    initMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
        }
    }

    initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validate form
            if (!this.validateForm(form)) {
                return;
            }

            // Get form values
            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const message = form.message.value.trim();

            // Get email from config or use fallback
            const recipientEmail = this.config?.email || 'zacharia.kimani@example.com';
            
            // Create email content
            const subject = `Portfolio Inquiry from ${name}`;
            const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;

            // Create mailto URL
            const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${body}`;

            // Open default email client
            window.location.href = mailtoLink;

            // Show notification
            this.showNotification('Opening your email application...', 'success');
            
            // Reset form
            form.reset();
        });

        // Real-time validation
        form.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });
    }

    validateForm(form) {
        let isValid = true;
        const fields = form.querySelectorAll('input, textarea');

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        if (!value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        } else if (field.id === 'name' && value.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters';
        } else if (field.id === 'message' && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters';
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.add('error');

        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="${type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'success' ? 'var(--success-color)' : 'var(--error-color)'};
            color: white;
            border-radius: 5px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    setupEventListeners() {
        // Lazy loading for images
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                img.loading = 'lazy';
            });
        } else {
            // Fallback for browsers that don't support lazy loading
            this.fallbackLazyLoad();
        }

        // Performance optimization
        window.addEventListener('load', () => {
            // Remove preloader if exists
            const preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.style.display = 'none';
            }
        });

        // Handle resize events
        let resizeTimer;
        window.addEventListener('resize', () => {
            document.body.classList.add('resize-animation-stopper');
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                document.body.classList.remove('resize-animation-stopper');
            }, 400);
        });
    }

    fallbackLazyLoad() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .resize-animation-stopper * {
        animation: none !important;
        transition: none !important;
    }

    body.menu-open {
        overflow: hidden;
    }

    .notification i {
        font-size: 1.2rem;
    }

    .notification-success i {
        color: #fff;
    }

    .notification-error i {
        color: #fff;
    }
`;
document.head.appendChild(style);
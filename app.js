// Smooth scrolling navigation and interactive behaviors
document.addEventListener('DOMContentLoaded', function() {
    // Get navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate offset to account for any fixed headers
                const offsetTop = targetSection.offsetTop - 20;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active state
                updateActiveNavLink(this);
            }
        });
    });
    
    // Update active navigation link based on scroll position
    function updateActiveNavLink(activeLink = null) {
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        if (activeLink) {
            activeLink.classList.add('active');
        } else {
            // Determine active section based on scroll position
            let currentSection = '';
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });
            
            // Update active nav link
            navLinks.forEach(link => {
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        }
    }
    
    // Add scroll listener for active section detection
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        // Debounce scroll events for performance
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            updateActiveNavLink();
        }, 10);
    });
    
    // Add subtle animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe content blocks for subtle entrance animations
    const contentBlocks = document.querySelectorAll('.content-block, .contact-block');
    contentBlocks.forEach(block => {
        // Set initial state
        block.style.opacity = '0';
        block.style.transform = 'translateY(20px)';
        block.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        
        observer.observe(block);
    });
    
    // Enhanced contact link interactions
    const contactLinks = document.querySelectorAll('.contact-link');
    contactLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(4px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // Add a subtle parallax effect to the hero section
    const heroSection = document.querySelector('.section--hero');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            
            if (scrolled < heroSection.offsetHeight) {
                heroSection.style.transform = `translateY(${rate}px)`;
            }
        });
    }
    
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Enable keyboard navigation with arrow keys
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            const activeNav = document.querySelector('.nav-link.active');
            if (activeNav) {
                const nextNav = activeNav.parentElement.nextElementSibling?.querySelector('.nav-link');
                if (nextNav) {
                    nextNav.click();
                }
            }
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            const activeNav = document.querySelector('.nav-link.active');
            if (activeNav) {
                const prevNav = activeNav.parentElement.previousElementSibling?.querySelector('.nav-link');
                if (prevNav) {
                    prevNav.click();
                }
            }
        }
    });
    
    // Initialize with the first section as active if at top of page
    if (window.scrollY < 100) {
        const firstNavLink = navLinks[0];
        if (firstNavLink) {
            updateActiveNavLink(firstNavLink);
        }
    }
    
    // Add focus indicators for better accessibility
    navLinks.forEach(link => {
        link.addEventListener('focus', function() {
            this.setAttribute('aria-current', 'page');
        });
        
        link.addEventListener('blur', function() {
            this.removeAttribute('aria-current');
        });
    });
    
    // Handle reduced motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Disable animations for users who prefer reduced motion
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        `;
        document.head.appendChild(style);
    }
});
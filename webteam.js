// ===== Mobile Navigation Toggle =====
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = menuToggle?.contains(event.target) || navLinks?.contains(event.target);
        
        if (!isClickInsideNav && navLinks?.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });

    // Mobile Dropdown functionality
    const dropdownLinks = document.querySelectorAll('.dropdown-link');
    
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default and toggle on mobile
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const dropdown = this.parentElement;
                dropdown.classList.toggle('open');
            }
        });
    });
});

// ===== Scroll Reveal Animation =====
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));


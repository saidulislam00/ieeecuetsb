/* ===================== WIE PAGE INITIALIZATION ===================== */
document.addEventListener("DOMContentLoaded", function () {

    /* =============== SCROLL REVEAL ANIMATION =============== */
    const revealEls = document.querySelectorAll(
        '#competitions, #wie-about-wrapper, #mv-section, #wie-events, #wie-committee, .competition-card, .event-card, .committee-card, .mv-row'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    revealEls.forEach(el => observer.observe(el));

    /* =============== HAMBURGER MENU =============== */
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-links");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });
    }

    /* =============== MOBILE DROPDOWN =============== */
    document.querySelectorAll(".dropdown-link").forEach(link => {
        link.addEventListener("click", function (e) {
            if (window.innerWidth <= 900) {
                e.preventDefault();
                this.parentElement.classList.toggle("open");
            }
        });
    });

    /* =============== INFINITE CAROUSEL AUTO-SCROLL =============== */
    setTimeout(function() {
        const eventsGrid = document.getElementById("eventsGrid");
        const scrollLeftBtn = document.getElementById("scrollLeft");
        const scrollRightBtn = document.getElementById("scrollRight");
        const eventsContainer = document.querySelector(".events-carousel-container");

        if (!eventsGrid || !scrollLeftBtn || !scrollRightBtn || !eventsContainer) {
            console.error("Carousel elements not found");
            return;
        }

        console.log("Carousel initialized");

        // Get original cards before cloning
        const eventCards = Array.from(eventsGrid.querySelectorAll(".event-card"));
        const totalOriginalCards = eventCards.length;
        console.log("Found event cards:", totalOriginalCards);
        
        // Clone cards and append to create infinite loop
        eventCards.forEach(card => {
            const clone = card.cloneNode(true);
            eventsGrid.appendChild(clone);
        });

        // Enable smooth scrolling behavior for manual clicks
        eventsGrid.style.scrollBehavior = "smooth";

        // Determine scroll distance based on viewport
        const getScrollDistance = () => {
            const isMobile = window.innerWidth <= 600;
            if (isMobile) {
                // On mobile, scroll by the full width of the grid container
                return eventsContainer.offsetWidth - 40; // Account for padding
            } else {
                // On desktop, scroll by card width + gap
                return 288; // 260px card + 28px gap
            }
        };

        // Manual button clicks
        scrollLeftBtn.addEventListener("click", () => {
            const distance = getScrollDistance();
            console.log("Left button clicked, scroll distance:", distance);
            eventsGrid.scrollBy({
                left: -distance,
                behavior: "smooth"
            });
        });

        scrollRightBtn.addEventListener("click", () => {
            const distance = getScrollDistance();
            console.log("Right button clicked, scroll distance:", distance);
            eventsGrid.scrollBy({
                left: distance,
                behavior: "smooth"
            });
        });

        console.log("Carousel ready with manual controls");
    }, 100);

});

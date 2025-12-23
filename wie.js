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

        // Manual button clicks
        scrollLeftBtn.addEventListener("click", () => {
            console.log("Left button clicked, current scroll:", eventsGrid.scrollLeft);
            eventsGrid.scrollBy({
                left: -280,
                behavior: "smooth"
            });
        });

        scrollRightBtn.addEventListener("click", () => {
            console.log("Right button clicked, current scroll:", eventsGrid.scrollLeft);
            eventsGrid.scrollBy({
                left: 280,
                behavior: "smooth"
            });
        });

        console.log("Carousel ready with manual controls");
    }, 100);

});

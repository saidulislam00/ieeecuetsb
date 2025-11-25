document.addEventListener("DOMContentLoaded", () => {

    /* HAMBURGER MENU */
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-links");

    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });

    /* MOBILE DROPDOWN */
    document.querySelectorAll(".dropdown-link").forEach(link => {
        link.addEventListener("click", function (e) {
            if (window.innerWidth <= 900) {
                e.preventDefault();
                this.parentElement.classList.toggle("open");
            }
        });
    });
});

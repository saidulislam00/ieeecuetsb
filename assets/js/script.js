/* ============================
      HERO SLIDER SYSTEM
============================ */

document.addEventListener("DOMContentLoaded", () => {

    const hero = document.getElementById("hero");
    const dots = document.querySelectorAll(".dot");

    // Slide data (add as many as you want)
    const slides = [
        {
            title: `Powering <span>Innovation</span> at CUET`,
            subtitle: `Advancing Technology for Humanity through research, innovation, and community-driven engineering excellence.`,
            buttonText: "Explore Societies",
            buttonLink: "#societies",
            bg: "assets/images/hero1.jpg"
        },
        {
            title: `Engineering <span>Excellence</span> for Tomorrow`,
            subtitle: `A strong IEEE community empowering researchers, innovators, and student leaders.`,
            buttonText: "Join IEEE",
            buttonLink: "https://www.ieee.org",
            bg: "assets/images/hero2.jpg"
        },
        {
            title: `Where Ideas Become <span>Impact</span>`,
            subtitle: `From robotics to power systems — explore the technical societies shaping the future.`,
            buttonText: "See Events",
            buttonLink: "#events",
            bg: "assets/images/hero3.jpg"
        }
    ];

    let index = 0;

    // DOM elements to update
    const titleEl = document.getElementById("hero-title");
    const subtitleEl = document.getElementById("hero-subtitle");
    const btnEl = document.getElementById("hero-btn");

    function updateSlide(i) {
        const s = slides[i];

        // Fade animation
        hero.classList.add("fade");
        setTimeout(() => hero.classList.remove("fade"), 1200);

        // Update background
        hero.style.backgroundImage = `url('${s.bg}')`;

        // Update text
        titleEl.innerHTML = s.title;
        subtitleEl.innerHTML = s.subtitle;

        // Update button
        btnEl.innerText = s.buttonText;
        btnEl.href = s.buttonLink;

        // Update dots
        dots.forEach(dot => dot.classList.remove("active"));
        dots[i].classList.add("active");

        index = i;
    }

    // Auto-slide every 5 seconds
    setInterval(() => {
        index = (index + 1) % slides.length;
        updateSlide(index);
    }, 5000);

    // Manual dot click
    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => updateSlide(i));
    });

    // Initial load
    updateSlide(0);
});
// ===================== STATS COUNT-UP =====================
const counters = document.querySelectorAll(".stat-number");
let statsAnimated = false;

function animateStats() {
    counters.forEach(counter => {
        const target = +counter.getAttribute("data-target");
        const speed = 50;

        const updateCount = () => {
            const current = +counter.innerText;
            const increment = Math.ceil(target / speed);

            if (current < target) {
                counter.innerText = current + increment;
                setTimeout(updateCount, 30);
            } else {
                counter.innerText = target;
            }
        };

        updateCount();
    });
}

const statsSection = document.querySelector("#stats");

window.addEventListener("scroll", () => {
    const sectionTop = statsSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight && !statsAnimated) {
        animateStats();
        statsAnimated = true;
    }
});
// ========== PARTICLE BACKGROUND FOR STATS ==========
(function () {
    const canvas = document.getElementById("stats-particles");
    const ctx = canvas.getContext("2d");
    let particles = [];
    const COUNT = 50;
    const MAX_DIST = 120;

    function resize() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    }

    function initParticles() {
        const rect = canvas.getBoundingClientRect();
        particles = [];

        for (let i = 0; i < COUNT; i++) {
            particles.push({
                x: Math.random() * rect.width,
                y: Math.random() * rect.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                r: Math.random() * 2 + 1
            });
        }
    }

    function update() {
        const rect = canvas.getBoundingClientRect();
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > rect.width) p.vx *= -1;
            if (p.y < 0 || p.y > rect.height) p.vy *= -1;
        });
    }

    function draw() {
        const rect = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);

        // Lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const d = Math.sqrt(dx*dx + dy*dy);

                if (d < MAX_DIST) {
                    const alpha = 1 - (d / MAX_DIST);
                    ctx.strokeStyle = `rgba(0, 180, 255, ${0.12 * alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }

        // Dots
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(180, 230, 255, 0.9)";
            ctx.fill();
        });
    }

    function loop() {
        update();
        draw();
        requestAnimationFrame(loop);
    }

    function init() {
        resize();
        initParticles();
        loop();
    }

    window.addEventListener("resize", () => {
        resize();
        initParticles();
    });

    init();
})();
/* ===================== ADVANCED SMOOTH AUTO-SCROLL CAROUSEL ===================== */

const events = [
    { title:"IEEE SciBlitz 1.0", date:"January 2025", desc:"A national innovation competition featuring robotics, AI, and problem-solving challenges.", img:"assets/events/sciblitz.jpg", link:"#"},
    { title:"TRISCEND 2025", date:"February 2025", desc:"A grand technology festival featuring robotics, coding, circuits, and creative challenges.", img:"assets/events/triscend.jpg", link:"#"},
    { title:"Photonics Workshop", date:"March 2025", desc:"Hands-on learning with lasers, optical fiber, & photonic integrated systems.", img:"assets/events/photonics.jpg", link:"#"},
    { title:"Machine Learning Bootcamp", date:"April 2025", desc:"A practical bootcamp covering ML algorithms, Python, and model deployment.", img:"assets/events/ml.jpg", link:"#"},
    { title:"Robotics Hackathon", date:"May 2025", desc:"24-hour robotics challenge for building autonomous bots.", img:"assets/events/robotics.jpg", link:"#"},
    { title:"AI in Healthcare", date:"June 2025", desc:"Explore real AI use-cases in diagnostics and prediction.", img:"assets/events/aihealth.jpg", link:"#"},
    { title:"Cybersecurity Summit", date:"July 2025", desc:"Network security, penetration testing, and ethical hacking.", img:"assets/events/cyber.jpg", link:"#"}
];

const track = document.getElementById("carousel-track");
const dots = document.getElementById("carousel-dots");

let slideWidth = 0;
let autoScrollSpeed = 0.5; // px per frame
let pos = 0;

/* ---------- Render Slides ---------- */
function renderSlides() {
    track.innerHTML = "";

    events.forEach(ev => {
        track.innerHTML += `
            <div class="carousel-slide">
                <div class="event-card">
                    <img src="${ev.img}" class="event-img">
                    <h3 class="event-title">${ev.title}</h3>
                    <div class="event-date">${ev.date}</div>
                    <p class="event-desc">${ev.desc}</p>
                    <a href="${ev.link}" class="event-btn">Learn More</a>
                </div>
            </div>
        `;
    });

    // Duplicate slides → perfect infinite loop illusion
    events.forEach(ev => {
        track.innerHTML += `
            <div class="carousel-slide">
                <div class="event-card">
                    <img src="${ev.img}" class="event-img">
                    <h3 class="event-title">${ev.title}</h3>
                    <div class="event-date">${ev.date}</div>
                    <p class="event-desc">${ev.desc}</p>
                    <a href="${ev.link}" class="event-btn">Learn More</a>
                </div>
            </div>
        `;
    });

    slideWidth = document.querySelector(".carousel-slide").offsetWidth;
}

/* ---------- Auto-scroll (Right → Left) ---------- */
function autoScroll() {
    pos -= autoScrollSpeed;
    track.style.transform = `translateX(${pos}px)`;

    // Reset when shifted a full set of slides
    const totalWidth = slideWidth * events.length;
    if (Math.abs(pos) >= totalWidth) pos = 0;

    requestAnimationFrame(autoScroll);
}

/* ---------- Hover Pause ---------- */
track.addEventListener("mouseenter", () => autoScrollSpeed = 0);
track.addEventListener("mouseleave", () => autoScrollSpeed = 0.5);

/* ---------- Drag to Scroll ---------- */
let dragStart = 0;
let dragging = false;
let lastPos = 0;

track.addEventListener("mousedown", e => {
    dragging = true;
    dragStart = e.clientX;
    lastPos = pos;
});

window.addEventListener("mouseup", () => dragging = false);

window.addEventListener("mousemove", e => {
    if (!dragging) return;
    const diff = e.clientX - dragStart;
    pos = lastPos + diff;
});

/* ---------- Touch Drag (Mobile) ---------- */
track.addEventListener("touchstart", e => {
    dragging = true;
    dragStart = e.touches[0].clientX;
    lastPos = pos;
});

track.addEventListener("touchend", () => dragging = false);

track.addEventListener("touchmove", e => {
    if (!dragging) return;
    const diff = e.touches[0].clientX - dragStart;
    pos = lastPos + diff;
});

/* ---------- Dots (optional: stays for future upgrades) ---------- */
function renderDots() {
    dots.innerHTML = "";
    const groups = Math.ceil(events.length / 3);

    for (let i = 0; i < groups; i++) {
        dots.innerHTML += `<div class="dot"></div>`;
    }
}

/* ---------- INIT ---------- */
function initCarousel() {
    renderSlides();
    renderDots();
    requestAnimationFrame(autoScroll);
}

initCarousel();

/* ---------- Recalculate on Resize ---------- */
window.addEventListener("resize", () => {
    renderSlides();
});
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
        }
    });
});
observer.observe(document.querySelector("#promo-video"));

document.addEventListener('DOMContentLoaded', function() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-links');

        menuToggle.addEventListener('click', function() {
            // Toggles the 'active' class on the nav-links/nav-menu
            navMenu.classList.toggle('active');
        });

        // Optional: Close the menu when a link is clicked (useful for single-page sites)
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    });
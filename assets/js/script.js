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
            bg: "/assets/images/hero1.jpg"
        },
        {
            title: `Engineering <span>Excellence</span> for Tomorrow`,
            subtitle: `A strong IEEE community empowering researchers, innovators, and student leaders.`,
            buttonText: "Join IEEE",
            buttonLink: "https://www.ieee.org",
            bg: "/assets/images/hero2.jpg"
        },
        {
            title: `Where Ideas Become <span>Impact</span>`,
            subtitle: `From robotics to power systems — explore the technical societies shaping the future.`,
            buttonText: "See Events",
            buttonLink: "#events",
            bg: "/assets/images/hero3.jpg"
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
// ===================== STATS COUNT-UP at About IEEE Page =====================
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
    { title:"Fireside Chat Inspiring Role Model Talks For The Future Leaders in STEM", date:"December 2025", desc:"A full-day learning experience designed to inspire, empower, and prepare aspiring female engineers for both professional and technical excellence.", img:"/assets/images/FiresideChat.jpg", link:"https://www.facebook.com/share/1BuCd4p2tB/"},
    { title:"LightMesh 1.0", date:"November 2025", desc:"a five-episode talk series by the IEEE Photonics Society CUET Chapter, crafted to take you on an immersive journey through the evolving world of light-based technologies.", img:"/assets/images/Lightmesh.jpg", link:"https://www.facebook.com/events/1860927531486038/"},
    { title:"Unlocking Opportunities: IEEE Membership Awareness & Growth", date:"November 2025", desc:"Guidance to the participants with valuable perspectives on unlocking growth through IEEE membership.", img:"/assets/images/event3.jpg", link:"https://www.facebook.com/share/p/1DsQHi8yKq/"},
    { title:"Digital Logic Design Contest", date:"October 2025", desc:"Strengthening your foundation in DLD enhances your technical insight and prepares you for advanced domains of engineering innovation.", img:"/assets/images/dld.jpg", link:"https://www.facebook.com/share/p/1BwNdsCPmv/"},
    { title:"Celebrating IEEE Day", date:"October 2025", desc:"Explore endless opportunities for innovation, learning, and global connection with IEEE", img:"/assets/images/event5.jpg", link:"https://www.facebook.com/share/p/1ALGgD4pKi/"},
    { title:"TechTalk 1.0", date:"September 2025", desc:"A impromptu Speech competition.", img:"/assets/images/techtalk.jpg", link:"https://www.facebook.com/events/1495432661582696/"},
    { title:"Fresher's Frequency: Beyond Resonance", date:"October 2025", desc:"Reception of 23 Series", img:"/assets/images/reception23.jpg", link:"https://www.facebook.com/events/1752805038760999"}
];

const track = document.getElementById("carousel-track");
const dots = document.getElementById("carousel-dots");

let slideWidth = 0;
let autoScrollSpeed = 0.8; // px per frame
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

/* ===================== CHAPTER SPOTLIGHT ===================== */
const societiesSection = document.querySelector("#societies");

if (societiesSection) {
    const chapterData = {
        wie: {
            acronym: "WIE",
            fullName: "Women in Engineering Affinity Group",
            kind: "Affinity Group",
            description: "Empowering women in engineering through mentorship, leadership, and a stronger technical community.",
            image: "/assets/images/Logos/WIE%20landscape.PNG",
            imageAlt: "IEEE CUET Women in Engineering Affinity Group logo",
            imagePosition: "center",
            href: "/wie/",
            icon: "fa-venus"
        },
        ras: {
            acronym: "RAS",
            fullName: "Robotics & Automation Society",
            kind: "Student Branch Chapter",
            description: "Turning intelligent systems into working solutions through robotics, automation, hands-on projects, and competition.",
            image: "https://lh3.googleusercontent.com/d/1xj_erDGbSabPqPJOhsrvOnAXvkRVEUJU=s2048",
            imageAlt: "IEEE Robotics and Automation Society CUET community",
            imagePosition: "center",
            href: "/ras/",
            icon: "fa-robot"
        },
        pes: {
            acronym: "PES",
            fullName: "Power & Energy Society",
            kind: "Student Branch Chapter",
            description: "Exploring resilient grids, renewable energy, and the technologies powering a cleaner, more reliable future.",
            image: "https://lh3.googleusercontent.com/d/1XeFRzOMxXLpfaBnX9LvrnE0zDUTZ65qf=s2048",
            imageAlt: "IEEE Power and Energy Society CUET community",
            imagePosition: "center",
            href: "/pes/",
            icon: "fa-bolt"
        },
        photonics: {
            acronym: "Photonics",
            fullName: "Photonics Society",
            kind: "Student Branch Chapter",
            description: "Connecting light, optics, and emerging photonic technologies through learning, research, and technical exchange.",
            image: "https://lh3.googleusercontent.com/d/1wt4N7SN1ho6V9cu-yf6SiKZozuVoGwq4=s2048",
            imageAlt: "IEEE Photonics Society CUET community",
            imagePosition: "center",
            href: "/photonics/",
            icon: "fa-lightbulb"
        },
        sps: {
            acronym: "SPS",
            fullName: "Signal Processing Society",
            kind: "Student Branch Chapter",
            description: "Discovering how signals become insight across communications, audio, imaging, AI, and data-driven engineering.",
            image: "https://lh3.googleusercontent.com/d/196laknzmTE-LNCg38SPj5oWbetJepJ8P=s2048",
            imageAlt: "IEEE Signal Processing Society CUET community",
            imagePosition: "center",
            href: "/sps/",
            icon: "fa-wave-square"
        },
        embs: {
            acronym: "EMBS",
            fullName: "Engineering in Medicine & Biology Society",
            kind: "Student Branch Chapter",
            description: "Bringing engineering and healthcare together to advance biomedical innovation, skills, and interdisciplinary research.",
            image: "https://lh3.googleusercontent.com/d/1Tt8lGzKeYLxwQvKT4WnHN5FhNrAryYT1=s2048",
            imageAlt: "IEEE Engineering in Medicine and Biology Society CUET community",
            imagePosition: "center",
            href: "/embs/",
            icon: "fa-heart-pulse"
        },
        aps: {
            acronym: "APS",
            fullName: "Antennas & Propagation Society",
            kind: "Student Branch Chapter",
            description: "Advancing knowledge in antennas, electromagnetics, propagation, and the wireless systems connecting our world.",
            image: "https://lh3.googleusercontent.com/d/1OnTZYdAQv7J7r2zeHUpTlaTlqDo25H5w=s2048",
            imageAlt: "IEEE Antennas and Propagation Society CUET community",
            imagePosition: "center",
            href: "/aps/",
            icon: "fa-satellite-dish"
        }
    };

    const selector = societiesSection.querySelector(".chapter-selector");
    const tabs = Array.from(societiesSection.querySelectorAll(".chapter-tab"));
    const stage = societiesSection.querySelector(".chapter-stage");
    const image = document.getElementById("chapter-image");
    const watermark = document.getElementById("chapter-watermark");
    const kind = document.getElementById("chapter-kind");
    const acronym = document.getElementById("chapter-acronym");
    const fullName = document.getElementById("chapter-full-name");
    const description = document.getElementById("chapter-description");
    const link = document.getElementById("chapter-link");
    const linkText = link ? link.querySelector("span") : null;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ROTATION_DELAY = 4800;
    let activeIndex = 0;
    let pendingIndex = null;
    let changeTimer;
    let finishTimer;
    let rotationTimer;
    let preloadImage;
    let sectionVisible = false;
    let rotationEnabled = !motionQuery.matches;

    function setActiveTab(index) {
        const tab = tabs[index];
        tabs.forEach((currentTab, currentIndex) => {
            const isActive = currentIndex === index;
            currentTab.classList.toggle("is-active", isActive);
            currentTab.setAttribute("aria-selected", String(isActive));
            currentTab.tabIndex = isActive ? 0 : -1;
        });
        stage.setAttribute("aria-labelledby", tab.id);
        activeIndex = index;
    }

    function writeChapter(index) {
        const tab = tabs[index];
        const data = chapterData[tab.dataset.chapter];
        if (!data) return;

        const tabAccent = window.getComputedStyle(tab).getPropertyValue("--tab-accent").trim();
        societiesSection.style.setProperty("--chapter-accent", tabAccent || "#5b9cc3");
        image.src = data.image;
        image.alt = data.imageAlt;
        image.style.setProperty("--image-position", data.imagePosition);
        watermark.className = `fas ${data.icon}`;
        kind.textContent = data.kind;
        acronym.textContent = data.acronym;
        fullName.textContent = data.fullName;
        description.textContent = data.description;
        link.href = data.href;
        link.setAttribute("aria-label", `Explore ${data.fullName}`);
        linkText.textContent = `Explore ${data.acronym}`;
        setActiveTab(index);

        const nextTab = tabs[(index + 1) % tabs.length];
        const nextData = chapterData[nextTab.dataset.chapter];
        if (nextData) {
            preloadImage = new Image();
            preloadImage.decoding = "async";
            preloadImage.src = nextData.image;
        }
    }

    function selectChapter(index, options = {}) {
        if ((index === activeIndex && pendingIndex === null && !options.force) || index === pendingIndex) {
            if (options.focus) tabs[index].focus();
            return;
        }
        window.clearTimeout(changeTimer);
        window.clearTimeout(finishTimer);
        pendingIndex = index;

        if (motionQuery.matches) {
            writeChapter(index);
            pendingIndex = null;
            stage.classList.remove("is-changing");
            stage.removeAttribute("aria-busy");
        } else {
            stage.setAttribute("aria-busy", "true");
            stage.classList.add("is-changing");
            changeTimer = window.setTimeout(() => {
                writeChapter(index);
                pendingIndex = null;
                requestAnimationFrame(() => {
                    finishTimer = window.setTimeout(() => {
                        stage.classList.remove("is-changing");
                        stage.removeAttribute("aria-busy");
                    }, 35);
                });
            }, 150);
        }

        if (options.focus) tabs[index].focus();
        if (options.scroll) {
            const targetLeft = tabs[index].offsetLeft - ((selector.clientWidth - tabs[index].offsetWidth) / 2);
            const maxLeft = Math.max(0, selector.scrollWidth - selector.clientWidth);
            selector.scrollTo({
                left: Math.min(maxLeft, Math.max(0, targetLeft)),
                behavior: motionQuery.matches ? "auto" : "smooth"
            });
        }
    }

    function clearRotationTimer() {
        window.clearTimeout(rotationTimer);
        rotationTimer = null;
    }

    function hasContentFocus() {
        return societiesSection.contains(document.activeElement);
    }

    function canRotate() {
        return rotationEnabled &&
            sectionVisible &&
            !hasContentFocus() &&
            document.visibilityState === "visible";
    }

    function updateRotationState() {
        societiesSection.dataset.rotationState = canRotate() ? "running" : "paused";
    }

    function scheduleRotation() {
        clearRotationTimer();
        updateRotationState();
        if (!canRotate()) return;

        rotationTimer = window.setTimeout(() => {
            if (!canRotate()) {
                scheduleRotation();
                return;
            }

            selectChapter((activeIndex + 1) % tabs.length, { scroll: true, source: "auto" });
            scheduleRotation();
        }, ROTATION_DELAY);
    }

    const hasCompleteChapterData = tabs.length > 0 && tabs.every(tab => chapterData[tab.dataset.chapter]);

    if (selector && stage && image && watermark && kind && acronym && fullName && description && link && linkText && hasCompleteChapterData) {
        selector.setAttribute("role", "tablist");
        selector.setAttribute("aria-orientation", "horizontal");
        stage.setAttribute("role", "tabpanel");
        stage.tabIndex = 0;
        tabs.forEach((tab, index) => {
            tab.setAttribute("role", "tab");
            tab.setAttribute("aria-controls", "chapter-panel");

            tab.addEventListener("focus", () => {
                selectChapter(index);
            });

            tab.addEventListener("click", event => {
                if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
                event.preventDefault();
                selectChapter(index, { focus: true });
            });

            tab.addEventListener("keydown", event => {
                let nextIndex = null;

                if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
                if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
                if (event.key === "Home") nextIndex = 0;
                if (event.key === "End") nextIndex = tabs.length - 1;
                if (event.key === "Enter" || event.key === " ") nextIndex = index;

                if (nextIndex !== null) {
                    event.preventDefault();
                    selectChapter(nextIndex, { focus: true, scroll: true, force: true });
                }
            });
        });

        image.addEventListener("error", () => {
            image.hidden = true;
        });
        image.addEventListener("load", () => {
            image.hidden = false;
        });

        societiesSection.addEventListener("focusin", scheduleRotation);
        societiesSection.addEventListener("focusout", () => {
            window.setTimeout(scheduleRotation, 0);
        });

        if ("IntersectionObserver" in window) {
            const rotationObserver = new IntersectionObserver(([entry]) => {
                sectionVisible = entry.isIntersecting && entry.intersectionRatio >= 0.2;
                scheduleRotation();
            }, { threshold: [0, 0.2, 0.5] });
            rotationObserver.observe(societiesSection);
        } else {
            sectionVisible = true;
        }

        document.addEventListener("visibilitychange", scheduleRotation);
        window.addEventListener("pagehide", clearRotationTimer);

        const handleMotionPreference = event => {
            window.clearTimeout(changeTimer);
            window.clearTimeout(finishTimer);
            if (pendingIndex !== null) writeChapter(pendingIndex);
            pendingIndex = null;
            stage.classList.remove("is-changing");
            stage.removeAttribute("aria-busy");
            rotationEnabled = !event.matches;
            scheduleRotation();
        };
        if (motionQuery.addEventListener) {
            motionQuery.addEventListener("change", handleMotionPreference);
        } else {
            motionQuery.addListener(handleMotionPreference);
        }

        writeChapter(0);
        updateRotationState();
    }

    if ("IntersectionObserver" in window && !motionQuery.matches) {
        societiesSection.classList.add("motion-ready");
        const societyObserver = new IntersectionObserver(([entry], currentObserver) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                currentObserver.unobserve(entry.target);
            }
        }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
        societyObserver.observe(societiesSection);
    }
}

document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-links");

    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });

});
document.addEventListener("DOMContentLoaded", function () {

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

            // Only trigger on mobile
            if (window.innerWidth <= 900) {
                e.preventDefault();
                this.parentElement.classList.toggle("open");
            }
        });
    });

});

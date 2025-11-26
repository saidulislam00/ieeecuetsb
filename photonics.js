// ===== Scroll Reveal Animation =====
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));


/* ===================== SINE WAVE ANIMATION LOGIC ===================== */

const canvas = document.getElementById("phoParticles"); 
const ctx = canvas.getContext("2d");

let width, height;
let waves = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = document.getElementById("pho-hero").offsetHeight;
}

class Wave {
    constructor(index) {
        this.index = index;
        this.phase = Math.random() * Math.PI * 2;
        
        // Settings for smooth, slow oscillation
        this.speed = 0.002 + Math.random() * 0.004; 
        this.frequency = 0.003 + Math.random() * 0.002; 
        this.amplitude = 50 + Math.random() * 40; 
        
        // PHO Violet Color
        this.color = `rgba(212, 96, 255, ${0.15 + Math.random() * 0.25})`; 
    }

    draw(time) {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.5;

        for (let x = 0; x < width; x++) {
            // y = Center + (Height * sin(x * width + animation_time + offset))
            const y = height / 2 + 
                      Math.sin(x * this.frequency + time * this.speed + this.phase) * this.amplitude;
            
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
}

function init() {
    resize();
    waves = [];
    for(let i = 0; i < 6; i++) {
        waves.push(new Wave(i));
    }
}

let time = 0;
function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Slow time increment for smooth motion
    time += 1; 

    waves.forEach(wave => {
        wave.draw(time);
    });

    requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
init();
animate();
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
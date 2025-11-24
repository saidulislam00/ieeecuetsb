/* PES PAGE JS */

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

/* ===================== SMART GRID PARTICLE BACKGROUND ===================== */

const canvas = document.getElementById("pesParticles");
const ctx = canvas.getContext("2d");

let particles = [];
const totalParticles = 100;      // Denser grid
const maxDistance = 130;         // Connection distance

function resizeCanvas() {
    // Ensure it grabs the parent section height
    canvas.width = window.innerWidth;
    canvas.height = document.getElementById("pes-hero").offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        // Slightly slower movement for a stable "grid" feel
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1;
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // 🟢 PES Green Color for nodes
        ctx.fillStyle = "rgba(0, 230, 118, 0.9)"; 
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < totalParticles; i++) {
        particles.push(new Particle());
    }
}

function drawLines() {
    for (let i = 0; i < totalParticles; i++) {
        for (let j = i + 1; j < totalParticles; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDistance) {
                ctx.strokeStyle = `rgba(0, 230, 118, ${1 - dist / maxDistance})`; 
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.move();
        p.draw();
    });

    drawLines();
    requestAnimationFrame(animateNetwork);
}

// Start
initParticles();
animateNetwork();
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


/* ===================== PULSE WAVE ANIMATION LOGIC ===================== */

const canvas = document.getElementById("embsParticles"); // ID changed
const ctx = canvas.getContext("2d");

let width, height;
let waves = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = document.getElementById("embs-hero").offsetHeight; // ID changed
}

class PulseWave {
    constructor(index) {
        this.index = index;
        this.phase = Math.random() * Math.PI * 2;
        
        // Settings for a distinct wave shape
        this.speed = 0.0025 + Math.random() * 0.003; 
        this.frequency = 0.003; // Stable frequency
        this.amplitude = 50 + Math.random() * 40; 
        
        // EMBS Red/Coral Color
        this.color = `rgba(255, 112, 67, ${0.15 + Math.random() * 0.3})`; 
    }

    draw(time) {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.5;

        for (let x = 0; x < width; x++) {
            // Base Sine Wave
            let y = height / 2 + 
                      Math.sin(x * this.frequency + time * this.speed + this.phase) * this.amplitude;
            
            // Add a small, sharp peak (QRS Complex) every cycle for the 'heartbeat' effect
            const cycle_pos = (x * this.frequency + time * this.speed + this.phase) % (Math.PI * 2);
            if (cycle_pos < 0) continue; // Ensure positive value
            
            // A Gaussian function to create a small peak near the center of the cycle (at pi)
            // This creates the 'pulse' visual
            const peak_intensity = 30; 
            const peak_center = Math.PI;
            const peak_width = 0.5;
            const pulse_effect = peak_intensity * Math.exp(-Math.pow(cycle_pos - peak_center, 2) / (2 * peak_width));

            y -= pulse_effect;

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
}

function init() {
    resize();
    waves = [];
    // Create fewer, stronger waves for better pulse visibility
    for(let i = 0; i < 4; i++) {
        waves.push(new PulseWave(i));
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
/* ================== SCROLL REVEAL ================== */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

revealEls.forEach(el => revealObserver.observe(el));



/* ===================== APS WAVE BACKGROUND ===================== */

const canvas = document.getElementById("apsWave");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = document.getElementById("aps-hero").offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Wave properties
let t = 0;
const colors = ["#6f4aff", "#9d7bff", "#c7b3ff"];

function drawWave() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  colors.forEach((color, i) => {
    ctx.beginPath();
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = color;

    for (let x = 0; x < canvas.width; x++) {
      const y = canvas.height/2 
                + Math.sin((x * 0.01) + t + i) * 60
                + Math.sin((x * 0.02) + t * 0.5 + i) * 30;

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.stroke();
  });

  t += 0.02;
  requestAnimationFrame(drawWave);
}

drawWave();



/* ===================== MOBILE MENU ===================== */
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-links");

  if(menuToggle && navMenu){
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }

  document.querySelectorAll(".dropdown-link").forEach(link => {
    link.addEventListener("click", function(e){
      if(window.innerWidth <= 900){
        e.preventDefault();
        this.parentElement.classList.toggle("open");
      }
    });
  });
});

// ─── NAVBAR & MOBILE MENU ────────────────────────────────────
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navItems = document.querySelectorAll('.nav-link');

// Scroll effect for navbar
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile menu toggle
if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
}

// Close mobile menu on click
navItems.forEach(item => {
  item.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// Active link highlighting based on scroll
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${current}`) {
      item.classList.add('active');
    }
  });
});

// ─── ANIMATED STATS COUNTER ──────────────────────────────────
const stats = document.querySelectorAll('.stat-num');
let animated = false;

const animateStats = () => {
  stats.forEach(stat => {
    const target = +stat.getAttribute('data-target');
    const duration = 2000; // ms
    const increment = target / (duration / 16); // 60fps
    
    let current = 0;
    const updateCount = () => {
      current += increment;
      if (current < target) {
        stat.innerText = Math.ceil(current);
        requestAnimationFrame(updateCount);
      } else {
        stat.innerText = target + (target > 5 ? '+' : '');
      }
    };
    updateCount();
  });
};

// Intersection Observer for stats
const aboutSection = document.querySelector('.about-section');
if (aboutSection) {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animateStats();
      animated = true;
    }
  }, { threshold: 0.5 });
  
  observer.observe(aboutSection);
}

// ─── PARTICLES BACKGROUND (HERO) ─────────────────────────────
const canvas = document.getElementById('particle-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = Math.random() * 1 - 0.5;
      this.speedY = Math.random() * 1 - 0.5;
      // Use portfolio colors (blue/purple)
      const colors = ['#6366f1', '#a78bfa', '#38bdf8', '#ffffff'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > width) this.x = 0;
      else if (this.x < 0) this.x = width;
      
      if (this.y > height) this.y = 0;
      else if (this.y < 0) this.y = height;
    }

    draw() {
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const initParticles = () => {
    particles = [];
    const count = Math.min(window.innerWidth / 10, 100);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  };

  const drawLines = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          ctx.beginPath();
          ctx.strokeStyle = particles[i].color;
          // Opacity based on distance
          ctx.globalAlpha = (1 - distance / 120) * 0.15;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  };

  const animateParticles = () => {
    ctx.clearRect(0, 0, width, height);
    
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    
    drawLines();
    requestAnimationFrame(animateParticles);
  };

  initParticles();
  animateParticles();
}

// ─── CONTACT FORM HANDLING ───────────────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('form-submit-btn');
  const successMsg = document.getElementById('form-success');
  const originalText = btn.innerHTML;
  
  // Fake loading state
  btn.innerHTML = 'Sending...';
  btn.style.opacity = '0.7';
  btn.disabled = true;
  
  setTimeout(() => {
    e.target.reset();
    btn.innerHTML = originalText;
    btn.style.opacity = '1';
    btn.disabled = false;
    
    successMsg.style.display = 'block';
    
    setTimeout(() => {
      successMsg.style.display = 'none';
    }, 5000);
  }, 1500);
}

// navigation bar
function openNav() {
    document.getElementById("mobileMenu").style.width = "250px";
    document.getElementById("logo_img").style.marginLeft = "170px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav() {
    document.getElementById("mobileMenu").style.width = "0";
    document.getElementById("logo_img").style.marginLeft = "0";
    document.body.style.backgroundColor = "#0D0D0D";
}
// home section
const canvas = document.getElementById('bgCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particles = [];
        const particleCount = window.innerWidth < 768 ? 50 : 100;
        const mouse = { x: null, y: null, radius: 150 };

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.baseSize = this.size;
                this.density = (Math.random() * 30) + 1;
                this.color = `hsl(${Math.random() * 60 + 330}, 100%, 50%)`;
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                // Mouse interaction
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    this.size = this.baseSize * 2;
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let force = (mouse.radius - distance) / mouse.radius;
                    let directionX = forceDirectionX * force * this.density;
                    let directionY = forceDirectionY * force * this.density;
                    
                    this.x -= directionX;
                    this.y -= directionY;
                } else {
                    if (this.size > this.baseSize) {
                        this.size -= 0.1;
                    }
                }

                // Movement
                if (this.x < 0 || this.x > canvas.width) {
                    this.speedX = -this.speedX;
                }
                if (this.y < 0 || this.y > canvas.height) {
                    this.speedY = -this.speedY;
                }

                this.x += this.speedX;
                this.y += this.speedY;

                this.draw();
            }
        }

        function init() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            
            connect();
            requestAnimationFrame(animate);
        }

        function connect() {
            let opacity = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = Math.sqrt(
                        Math.pow(particles[a].x - particles[b].x, 2) + 
                        Math.pow(particles[a].y - particles[b].y, 2)
                    );
                    
                    if (distance < 100) {
                        opacity = 1 - (distance / 100);
                        ctx.strokeStyle = `rgba(255, 7, 58, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        window.addEventListener('mousemove', function(e) {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        window.addEventListener('resize', function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        });

        window.addEventListener('mouseout', function() {
            mouse.x = undefined;
            mouse.y = undefined;
        });

// Typing Effect
const textElement = document.getElementById("typing-text");
const textArray = ["Sudheera Perera", "A Developer", "A Programmer", "A Tech Enthusiast"];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    let currentText = textArray[textIndex];
    if (isDeleting) {
        textElement.textContent = currentText.substring(0, charIndex--);
    } else {
        textElement.textContent = currentText.substring(0, charIndex++);
    }

    if (!isDeleting && charIndex === currentText.length + 1) {
        isDeleting = true;
        setTimeout(typeEffect, 1500);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % textArray.length;
        setTimeout(typeEffect, 500);
    } else {
        setTimeout(typeEffect, isDeleting ? 50 : 100);
    }
}

// Modern Vapor Effect
function createVapor() {
    const container = document.querySelector('.glow-container');
    const colors = [
        'rgba(255, 7, 58, 0.7)',
        'rgba(226, 43, 177, 0.6)',
        'rgba(255, 255, 255, 0.5)',
        'rgba(200, 220, 255, 0.4)'
    ];

    const vapor = document.createElement('div');
    vapor.className = 'vapor';
            
    // Random properties
    const size = Math.random() * 30 + 10;
    const duration = Math.random() * 6 + 3;
    const delay = Math.random() * 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const tx = (Math.random() - 0.5) * 100;
    const ty = -(Math.random() * 100 + 50);
    const scale = Math.random() * 3 + 1;
            
    vapor.style.width = `${size}px`;
    vapor.style.height = `${size}px`;
    vapor.style.background = color;
    vapor.style.left = `50%`;
    vapor.style.bottom = `0`;
    vapor.style.setProperty('--tx', `${tx}px`);
    vapor.style.setProperty('--ty', `${ty}px`);
    vapor.style.setProperty('--scale', scale);
    vapor.style.animation = `vapor-float ${duration}s ease-out ${delay}s forwards`;
            
    container.appendChild(vapor);
            
    // Remove element after animation completes
    setTimeout(() => {
        vapor.remove();
    }, (duration + delay) * 1000);
}

// Start vapor effect
setInterval(createVapor, 300);

// Initialize everything
init();
animate();
typeEffect();
// About me



// Portfolio

// Optional: Add any JavaScript interactions here if needed
 document.querySelectorAll('.project_card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.querySelector('.project_title_overlay').style.opacity = '1';
      card.querySelector('.project_title_overlay').style.transform = 'translateY(0)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.querySelector('.project_title_overlay').style.opacity = '0';
      card.querySelector('.project_title_overlay').style.transform = 'translateY(100%)';
    });
  });

// Contact me
const form = document.getElementById('contact-form');
const responseMessage = document.getElementById('responseMessage');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value
  };

  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbztx9oIIMO7g7u26EVbabhkO8nP7TPCOmud5NSgpEsEN55jJ8gvtdA9iCT2jZBbq3A/exec', {
      method: 'POST',
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      responseMessage.textContent = 'Thank you! Your message has been sent.';
      form.reset();
    } else {
      responseMessage.textContent = 'Error submitting the form. Please try again.';
    }
  } catch (error) {
    responseMessage.textContent = 'An error occurred. Please try again.';
  }
});
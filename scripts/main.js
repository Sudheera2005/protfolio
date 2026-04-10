/**
 * main.js — Portfolio Interactive Logic
 * ======================================
 * Sections:
 *   1. Navigation (mobile sidebar, scroll header, active nav)
 *   2. Particle canvas background (mouse interaction, connection lines)
 *   3. Typing effect (hero section typewriter)
 *   4. Vapor / smoke effect (profile photo glow ring)
 *   5. Project card overlay hover interactions
 *   6. Contact form submission (Google Apps Script endpoint)
 *   7. Scroll reveal (IntersectionObserver for .reveal elements)
 *   8. Boot (initialise everything on page load)
 */

/* ============================================================
   1. NAVIGATION
   ============================================================ */

/**
 * openNav — slides the mobile sidebar menu in from the left.
 * Called by the ☰ hamburger button via onclick="openNav()"
 */
function openNav() {
    document.getElementById('mobileMenu').style.width = '270px';
}

/**
 * closeNav — collapses the mobile sidebar back to zero width.
 * Called by the × close button and each nav link via onclick="closeNav()"
 */
function closeNav() {
    document.getElementById('mobileMenu').style.width = '0';
}

// Close mobile nav when user clicks anywhere outside the sidebar or hamburger
document.addEventListener('click', (e) => {
    const nav = document.getElementById('mobileMenu');
    // Only close if the sidebar is currently open
    if (nav.style.width === '270px' &&
        !nav.contains(e.target) &&               // click was not inside the nav
        !e.target.closest('.hamburger')) {        // click was not on the hamburger
        closeNav();
    }
});

// ── Header scroll effect ─────────────────────────────────────
// Adds the .scrolled class after the user scrolls 40px,
// which triggers a stronger background blur + shadow in CSS.
const header = document.getElementById('mainHeader');
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ── Active nav link highlight ─────────────────────────────────
// Compares current scroll position to each section's offset and
// highlights the matching nav link by setting its colour.
const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('section[id]');

function setActiveNav() {
    let current = '';

    // Walk every section; the last one whose top is above the viewport counts as "active"
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100; // 100px offset for fixed header
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    // Reset all links then highlight the active one
    navLinks.forEach(link => {
        link.style.color = '';                              // reset to CSS default
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = 'var(--text)';              // bright white when active
        }
    });
}

window.addEventListener('scroll', setActiveNav);


/* ============================================================
   2. HOME — PARTICLE CANVAS BACKGROUND
   ============================================================
   A <canvas> element fills the entire viewport (position: fixed,
   z-index: -1) and renders an interactive particle network.
   - Particles drift around and bounce off canvas edges.
   - Lines are drawn between any two particles closer than 110px.
   - The mouse repels nearby particles within a 140px radius.
   ============================================================ */

const canvas = document.getElementById('bgCanvas');        // the hidden <canvas>
const ctx    = canvas.getContext('2d');                    // 2D drawing context
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

// Fewer particles on small screens to maintain performance
const particleCount = window.innerWidth < 768 ? 50 : 90;

// Mouse position tracker — null when the cursor is off-screen
const mouse = { x: null, y: null, radius: 140 };

/**
 * Particle class
 * Each particle has a position, speed, size, colour, and density.
 * Density controls how strongly the mouse pushes it away.
 */
class Particle {
    constructor() {
        this.reset();
    }

    /** Place the particle at a random position with random velocity */
    reset() {
        this.x        = Math.random() * canvas.width;
        this.y        = Math.random() * canvas.height;
        this.size     = Math.random() * 2.5 + 0.5;    // radius between 0.5 and 3px
        this.baseSize = this.size;                     // remember original size
        this.density  = Math.random() * 25 + 1;       // repulsion strength

        // Colour: alternates between reddish-pink (340–370°) and purple (260–300°)
        const hue = Math.random() < 0.5
            ? Math.random() * 30 + 340               // pinks/reds
            : Math.random() * 40 + 260;              // purples
        this.color  = `hsla(${hue}, 80%, 65%, 0.75)`;

        this.speedX = (Math.random() - 0.5) * 1.2;   // horizontal drift speed
        this.speedY = (Math.random() - 0.5) * 1.2;   // vertical drift speed
    }

    /** Draw this particle as a filled circle */
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    /**
     * update — called every animation frame.
     * 1. If mouse is nearby, swell the particle and push it away.
     * 2. Bounce off canvas walls.
     * 3. Move by speed vector.
     * 4. Redraw.
     */
    update() {
        // ── Mouse repulsion ──────────────────────────────────
        if (mouse.x !== null) {
            const dx       = mouse.x - this.x;
            const dy       = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                // Grow the particle as the mouse gets closer
                this.size = this.baseSize * 2.2;

                // Push away: force is proportional to how near the mouse is
                const force = (mouse.radius - distance) / mouse.radius;
                this.x -= (dx / distance) * force * this.density;
                this.y -= (dy / distance) * force * this.density;
            } else {
                // Shrink back to original size when mouse leaves
                if (this.size > this.baseSize) this.size -= 0.08;
            }
        }

        // ── Wall bouncing ────────────────────────────────────
        if (this.x < 0 || this.x > canvas.width)  this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height)  this.speedY *= -1;

        // Move the particle
        this.x += this.speedX;
        this.y += this.speedY;

        this.draw(); // render the new position
    }
}

/** Create all particles and store them in the global array */
function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

/**
 * connectParticles — draws semi-transparent red lines between
 * particles that are within 110px of each other.
 * Line opacity fades as distance increases (closer = more opaque).
 */
function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
            const dx   = particles[a].x - particles[b].x;
            const dy   = particles[a].y - particles[b].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 110) {
                // Opacity: 0 at 110px distance, up to 0.5 at 0px distance
                const opacity = (1 - dist / 110) * 0.5;
                ctx.strokeStyle = `rgba(255, 7, 58, ${opacity})`;
                ctx.lineWidth   = 0.8;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

/**
 * animate — the main render loop.
 * Clears the canvas, updates all particles, draws connection lines,
 * then schedules the next frame via requestAnimationFrame.
 */
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // wipe previous frame
    particles.forEach(p => p.update());               // move & draw each particle
    connectParticles();                                // draw inter-particle lines
    requestAnimationFrame(animate);                    // loop ~60fps
}

// Track mouse position for repulsion effect
window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
// Clear mouse position when cursor leaves the window
window.addEventListener('mouseout',  ()  => { mouse.x = null; mouse.y = null; });

// Re-initialise canvas & particles on window resize (handles orientation change too)
window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});


/* ============================================================
   3. HOME — TYPING EFFECT
   ============================================================
   Cycles through textArray, typing and deleting each string
   character by character. Uses setTimeout for variable speed:
   - Typing: 95ms per character
   - Deleting: 45ms per character (faster)
   - Pause after fully typed: 1800ms
   - Pause before next word: 400ms
   ============================================================ */

const textElement = document.getElementById('typing-text');

// Words that will cycle in the hero heading
const textArray = [
    'Sudheera Perera',
    'A Developer',
    'A Tech Enthusiast',
    'A Cybersecurity Enthusiast'
];

let textIndex  = 0;     // which word we are currently displaying
let charIndex  = 0;     // how many characters of that word are shown
let isDeleting = false; // whether we are currently erasing

function typeEffect() {
    if (!textElement) return; // guard: element might not exist on other pages

    const current = textArray[textIndex];

    // Add or remove one character depending on direction
    textElement.textContent = isDeleting
        ? current.substring(0, --charIndex)   // deleting: shrink by one char
        : current.substring(0, ++charIndex);   // typing: grow by one char

    // Finished typing — pause then start deleting
    if (!isDeleting && charIndex === current.length) {
        isDeleting = true;
        return setTimeout(typeEffect, 1800);   // pause 1.8s before erasing
    }

    // Finished deleting — move to next word and pause briefly
    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex  = (textIndex + 1) % textArray.length; // wrap around
        return setTimeout(typeEffect, 400);
    }

    // Continue at normal speed (slower when typing, faster when deleting)
    setTimeout(typeEffect, isDeleting ? 45 : 95);
}


/* ============================================================
   4. HOME — VAPOR / SMOKE EFFECT
   ============================================================
   Creates small blurred div elements that float upward from the
   bottom of the glow-container (profile photo ring).
   Each element is animated by the CSS @keyframes vapor-float rule
   defined in main.css, then removed from the DOM after it finishes.
   setInterval(createVapor, 350) triggers a new wisp every 350ms.
   ============================================================ */

function createVapor() {
    const container = document.querySelector('.glow-container');
    if (!container) return; // safety check: section might not be in view

    // Colour pool: reds, pinks, whites, and soft purples
    const colors = [
        'rgba(255, 7, 58, 0.6)',
        'rgba(226, 43, 177, 0.5)',
        'rgba(255, 255, 255, 0.4)',
        'rgba(200, 180, 255, 0.35)'
    ];

    const vapor    = document.createElement('div');
    vapor.className = 'vapor';

    // Randomise each wisp so they look organic
    const size     = Math.random() * 28 + 8;           // pixel diameter
    const duration = Math.random() * 5 + 3;            // seconds to float up
    const delay    = Math.random() * 1.5;              // stagger start
    const color    = colors[Math.floor(Math.random() * colors.length)];
    const tx       = (Math.random() - 0.5) * 90;      // horizontal drift (px)
    const ty       = -(Math.random() * 90 + 40);      // upward travel (negative = up)
    const scale    = Math.random() * 2.5 + 1;         // how big it grows

    // Apply all values as inline CSS (animation picks up the CSS custom props)
    vapor.style.cssText = `
        width: ${size}px; height: ${size}px;
        background: ${color}; left: 50%; bottom: 0;
        --tx: ${tx}px; --ty: ${ty}px; --scale: ${scale};
        animation: vapor-float ${duration}s ease-out ${delay}s forwards;
    `;

    container.appendChild(vapor);

    // Clean up the DOM once the animation finishes to avoid memory accumulation
    setTimeout(() => vapor.remove(), (duration + delay) * 1000);
}


/* ============================================================
   5. PROJECT CARDS — OVERLAY HOVER INTERACTION
   ============================================================
   The .project_title_overlay is positioned absolutely at the
   bottom of each card image and is normally hidden (translateY(100%)).
   On mouse enter, we reveal it; on mouse leave, we hide it.
   CSS handles the smooth transition.
   ============================================================ */
document.querySelectorAll('.project_card').forEach(card => {
    const overlay = card.querySelector('.project_title_overlay');
    if (!overlay) return; // some cards may not have an overlay

    card.addEventListener('mouseenter', () => {
        overlay.style.opacity   = '1';
        overlay.style.transform = 'translateY(0)';      // slide up into view
    });
    card.addEventListener('mouseleave', () => {
        overlay.style.opacity   = '0';
        overlay.style.transform = 'translateY(100%)';   // slide back down
    });
});


/* ============================================================
   6. CONTACT FORM — SUBMISSION
   ============================================================
   Submits form data to a Google Apps Script web app, which
   writes the message to a Google Sheet and can optionally
   send a notification email.

   Flow:
   1. Prevent page reload (event.preventDefault)
   2. Show loading state on the submit button
   3. Bundle name, email, message into a JSON object
   4. POST to the Apps Script URL
   5. Show success or error message
   6. Restore the button
   ============================================================ */

const form            = document.getElementById('contact-form');
const responseMessage = document.getElementById('responseMessage');

if (form) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // stop the browser from reloading the page

        // ── Loading state ────────────────────────────────────
        const submitBtn = form.querySelector('input[type="submit"]');
        const origValue = submitBtn.value;
        submitBtn.value    = 'Sending…';
        submitBtn.disabled = true; // prevent double-submissions

        // ── Collect form values ──────────────────────────────
        const formData = {
            name:    document.getElementById('name').value,
            email:   document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        try {
            // ── Send to Google Apps Script ───────────────────
            // The Apps Script is deployed as a web app and accepts POST requests.
            // Update the URL below if the script is redeployed.
            const response = await fetch(
                'https://script.google.com/macros/s/AKfycbztx9oIIMO7g7u26EVbabhkO8nP7TPCOmud5NSgpEsEN55jJ8gvtdA9iCT2jZBbq3A/exec',
                { method: 'POST', body: JSON.stringify(formData) }
            );

            if (response.ok) {
                // ── Success path ─────────────────────────────
                responseMessage.textContent = '✓ Message sent! I\'ll be in touch soon.';
                responseMessage.className   = 'success'; // CSS turns this green
                form.reset();                            // clear all fields
            } else {
                throw new Error('Server returned non-OK status');
            }
        } catch {
            // ── Error path (network fail or server error) ────
            responseMessage.textContent = '✗ Something went wrong. Please try again or email me directly.';
            responseMessage.className   = 'error'; // CSS turns this red
        } finally {
            // Always restore the button regardless of success/failure
            submitBtn.value    = origValue;
            submitBtn.disabled = false;
        }
    });
}


/* ============================================================
   7. SCROLL REVEAL — IntersectionObserver
   ============================================================
   Any element with class="reveal" starts invisible (opacity:0,
   translateY(40px) defined in CSS). When it scrolls into the
   viewport the observer adds "visible", triggering the CSS
   transition to fade and slide it in. The element is then
   un-observed so it stays visible on re-scroll.
   ============================================================ */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');     // trigger CSS transition
            revealObserver.unobserve(entry.target);    // fire only once
        }
    });
}, { threshold: 0.1 }); // trigger when 10% of the element is in view

revealEls.forEach(el => revealObserver.observe(el));


/* ============================================================
   8. BOOT — Initialise everything on page load
   ============================================================ */
initParticles();             // create particle objects
animate();                   // start the canvas animation loop
typeEffect();                // start the hero typewriter
setInterval(createVapor, 350); // emit a new vapor wisp every 350ms
/* ============================================================
   CERTIFICATES — MODAL & INTERACTIONS
   ============================================================ */
const modal            = document.getElementById('modal');
const modalImg         = document.getElementById('modalImg');
const modalCaption     = document.getElementById('modalCaption');
const closeBtn         = document.getElementById('modalClose');
const prevBtn          = document.getElementById('prevBtn');
const nextBtn          = document.getElementById('nextBtn');
const certificateItems = document.querySelectorAll('.certificate-item');

let currentIndex = 0;

// Build certificate data from DOM
const certificates = Array.from(certificateItems).map(item => ({
    src:   item.querySelector('img').getAttribute('src'),
    alt:   item.querySelector('img').getAttribute('alt'),
    title: item.querySelector('.certificate-title').textContent.trim()
}));

/* ---------- Modal helpers ---------- */
function updateModal() {
    const cert = certificates[currentIndex];
    modalImg.src         = cert.src;
    modalImg.alt         = cert.alt;
    if (modalCaption) modalCaption.textContent = `${cert.title}  (${currentIndex + 1} / ${certificates.length})`;
}

function openModal(index) {
    currentIndex = index;
    updateModal();
    modal.style.display = 'flex';
    // Allow display to paint, then add class for CSS animation
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('show')));
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

function showPrev() {
    currentIndex = (currentIndex - 1 + certificates.length) % certificates.length;
    updateModal();
}

function showNext() {
    currentIndex = (currentIndex + 1) % certificates.length;
    updateModal();
}

/* ---------- Event listeners ---------- */
certificateItems.forEach((item, index) => {
    // Click & keyboard (Enter/Space) to open
    item.addEventListener('click', () => openModal(index));
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(index);
        }
    });
});

closeBtn.addEventListener('click', closeModal);

// Click backdrop to close
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

// Touch swipe support
let touchStartX = 0;
modal.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; });
modal.addEventListener('touchend',   (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) diff > 0 ? showNext() : showPrev();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (modal.style.display !== 'flex') return;
    if (e.key === 'Escape')      closeModal();
    if (e.key === 'ArrowLeft')   showPrev();
    if (e.key === 'ArrowRight')  showNext();
});

/* ---------- Scroll-reveal animation ---------- */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

certificateItems.forEach((item, index) => {
    item.style.opacity    = '0';
    item.style.transform  = 'translateY(30px) scale(0.97)';
    item.style.transition = `opacity 0.55s ease ${index * 0.07}s, transform 0.55s cubic-bezier(0.4,0,0.2,1) ${index * 0.07}s, border-color 0.4s ease, box-shadow 0.4s ease`;
    revealObserver.observe(item);
});
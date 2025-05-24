const modal = document.getElementById("modal");
        const modalImg = document.getElementById("modalImg");
        const closeBtn = document.querySelector(".close");
        const prevBtn = document.querySelector(".prev-btn");
        const nextBtn = document.querySelector(".next-btn");
        const certificateItems = document.querySelectorAll(".certificate-item");
        
        let currentIndex = 0;
        const certificates = Array.from(certificateItems).map(item => ({
            src: item.querySelector('img').src,
            alt: item.querySelector('img').alt,
            title: item.querySelector('.certificate-title').textContent
        }));

        // Open modal with clicked image
        certificateItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentIndex = index;
                updateModal();
                modal.classList.add('show');
                modal.style.display = "flex";
                document.body.style.overflow = "hidden"; // Prevent scrolling
            });
        });

        // Close modal
        function closeModal() {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = "none";
                document.body.style.overflow = "auto"; // Re-enable scrolling
            }, 300);
        }

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Navigation functions
        function updateModal() {
            modalImg.src = certificates[currentIndex].src;
            modalImg.alt = certificates[currentIndex].alt;
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + certificates.length) % certificates.length;
            updateModal();
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % certificates.length;
            updateModal();
        }

        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrev();
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showNext();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (modal.style.display === "flex") {
                if (e.key === 'Escape') closeModal();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });

        // Animation for certificate items
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        certificateItems.forEach((item, index) => {
            item.style.opacity = 0;
            item.style.transform = 'translateY(20px)';
            item.style.transition = `all 0.5s ease ${index * 0.1}s`;
            observer.observe(item);
        });
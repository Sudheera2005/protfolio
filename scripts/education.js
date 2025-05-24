// Animation for timeline entries
document.addEventListener('DOMContentLoaded', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    function checkVisibility() {
        timelineItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (itemTop < windowHeight - 100) {
                item.classList.add('visible');
            }
        });
    }
    
    // Initial check
    checkVisibility();
    
    // Check on scroll
    window.addEventListener('scroll', checkVisibility);
    
    // Add hover effect to timeline items
    timelineItems.forEach(item => {
        const content = item.querySelector('.timeline-content');
        
        item.addEventListener('mouseenter', () => {
            content.style.transform = 'translateY(-5px)';
            content.style.boxShadow = '0 10px 30px rgba(255, 7, 58, 0.3)';
        });
        
        item.addEventListener('mouseleave', () => {
            content.style.transform = 'translateY(0)';
            content.style.boxShadow = '0 5px 25px rgba(0, 0, 0, 0.3)';
        });
    });
});

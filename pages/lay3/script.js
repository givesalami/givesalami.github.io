// Touch swipe detection
let startX, moveX;
const slider = document.querySelector('.greeting-container');
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

// Initialize
showSlide(currentSlide);

// Touch events
slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
}, {passive: true});

slider.addEventListener('touchmove', (e) => {
    if (!startX) return;
    moveX = e.touches[0].clientX;
}, {passive: true});

slider.addEventListener('touchend', () => {
    if (!startX || !moveX) return;
    
    const diffX = startX - moveX;
    
    if (diffX > 50) {
        // Swipe left - next slide
        navigate(1);
    } else if (diffX < -50) {
        // Swipe right - previous slide
        navigate(-1);
    }
    
    startX = null;
    moveX = null;
});

// Mouse drag for desktop
slider.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    slider.style.cursor = 'grabbing';
});

slider.addEventListener('mousemove', (e) => {
    if (!startX) return;
    moveX = e.clientX;
});

slider.addEventListener('mouseup', () => {
    if (!startX || !moveX) return;
    
    const diffX = startX - moveX;
    
    if (diffX > 50) {
        navigate(1);
    } else if (diffX < -50) {
        navigate(-1);
    }
    
    startX = null;
    moveX = null;
    slider.style.cursor = '';
});

slider.addEventListener('mouseleave', () => {
    startX = null;
    moveX = null;
    slider.style.cursor = '';
});

function navigate(direction) {
    const newIndex = (currentSlide + direction + slides.length) % slides.length;
    showSlide(newIndex);
}

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active', 'prev', 'next');
        
        if (i === index) {
            slide.classList.add('active');
        } else if (i < index) {
            slide.classList.add('prev');
        } else {
            slide.classList.add('next');
        }
    });
    
    currentSlide = index;
}

// bKash copy function
function copyBkash() {
    const bkashNumber = document.querySelector('.bkash-value').textContent;
    const notification = document.querySelector('.copy-notification');
    
    navigator.clipboard.writeText(bkashNumber).then(() => {
        // Show copied notification
        notification.style.opacity = '1';
        setTimeout(() => {
            notification.style.opacity = '0';
        }, 2000);
        
        // Celebration effect
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#C4A000', '#FFFFFF'],
            shapes: ['circle', 'star']
        });
    });
}
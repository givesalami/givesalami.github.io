document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('slider');
    const slides = document.querySelectorAll('.slide');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    let currentSlide = 0;
    const totalSlides = slides.length;
    let isAnimating = false;
    let touchStartX = 0;
    let touchStartY = 0;

    // Initialize slider
    function initSlider() {
        slides.forEach((slide, index) => {
            if (index === 0) {
                slide.classList.add('active');
            } else {
                slide.classList.add('next');
            }
        });
        createFallingStars();
    }

    // Create falling stars
    function createFallingStars() {
        const container = document.querySelector('.falling-stars');
        for (let i = 0; i < 8; i++) {
            const star = document.createElement('div');
            star.className = 'falling-star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 5}s`;
            star.style.animationDuration = `${3 + Math.random() * 4}s`;
            container.appendChild(star);
        }
    }

    // Go to specific slide
    function goToSlide(index) {
        if (isAnimating || index === currentSlide) return;
        
        isAnimating = true;
        const direction = index > currentSlide ? 'next' : 'prev';
        
        slides[currentSlide].classList.remove('active');
        slides[currentSlide].classList.add(direction === 'next' ? 'prev' : 'next');
        
        slides[index].classList.remove('prev', 'next');
        slides[index].classList.add('active');
        
        currentSlide = index;
        
        if (scrollIndicator.style.opacity !== '0') {
            scrollIndicator.style.opacity = '0';
            setTimeout(() => {
                scrollIndicator.style.display = 'none';
            }, 500);
        }
        
        setTimeout(() => {
            isAnimating = false;
        }, 700);
    }

    // Next slide
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % totalSlides;
        goToSlide(nextIndex);
    }

    // Previous slide
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(prevIndex);
    }

    // Touch events
    slider.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    slider.addEventListener('touchmove', function(e) {
        if (!touchStartX) return;
        const xDiff = touchStartX - e.touches[0].clientX;
        if (Math.abs(xDiff) > 5) e.preventDefault();
    }, { passive: false });

    slider.addEventListener('touchend', function(e) {
        if (!touchStartX) return;
        
        const xDiff = touchStartX - e.changedTouches[0].clientX;
        const yDiff = touchStartY - e.changedTouches[0].clientY;
        
        if (Math.abs(xDiff) > 50 && Math.abs(xDiff) > Math.abs(yDiff)) {
            xDiff > 0 ? nextSlide() : prevSlide();
        }
        
        touchStartX = 0;
    }, { passive: true });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });

    // Initialize the slider
    initSlider();
});

// Copy bKash number function
function copyNumber() {
    const text = '01234567890';
    navigator.clipboard.writeText(text).then(() => {
        const notification = document.querySelector('.copy-notification');
        notification.style.opacity = '1';
        notification.style.transform = 'translate(-50%, 0)';
        
        if (window.navigator.vibrate) navigator.vibrate(50);
        
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 30,
                spread: 60,
                origin: { y: 0.6 },
                colors: ['#ffd700', '#ffffff', '#e2136e']
            });
        }
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translate(-50%, 10px)';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    });
}

// Special Eid Celebration Function
function sendVirtualHug() {
    const hug = `
       (ˆ•̮ ̮•ˆ)
      /|🌙|\\ 
     / |  | \\ 
    /  🕌  \\ 
    Eid Mubarak! 💝
    `;
    console.log(hug);
    
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#E2136E', '#2E8B57']
        });
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('slider');
    const slides = document.querySelectorAll('.slide');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let isAnimating = false;
    let touchStartX = 0;
    let touchEndX = 0;
    let hasInteracted = false;

    // Initialize slider
    function initSlider() {
        slides.forEach((slide, index) => {
            if (index === 0) {
                slide.classList.add('active');
            } else {
                slide.classList.add('next');
            }
        });
        
        // Create additional falling stars
        createFallingStars();
    }

    // Create falling stars
    function createFallingStars() {
        const container = document.querySelector('.falling-stars');
        for (let i = 0; i < 5; i++) {
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
        
        // Update classes for animation
        slides[currentSlide].classList.remove('active');
        slides[currentSlide].classList.add(direction === 'next' ? 'prev' : 'next');
        
        slides[index].classList.remove('prev', 'next');
        slides[index].classList.add('active');
        
        currentSlide = index;
        
        // Hide indicator after first interaction
        if (!hasInteracted) {
            hasInteracted = true;
            scrollIndicator.style.opacity = '0';
            setTimeout(() => {
                scrollIndicator.style.display = 'none';
            }, 500);
        }
        
        // Reset animation flag after transition
        setTimeout(() => {
            isAnimating = false;
        }, 600);
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

    // Touch events for swipe
    slider.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        if (isAnimating) return;
        
        if (touchEndX < touchStartX - 50) {
            // Swipe left - next slide
            nextSlide();
        } else if (touchEndX > touchStartX + 50) {
            // Swipe right - previous slide
            prevSlide();
        }
    }

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

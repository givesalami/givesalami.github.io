document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // INITIAL SETUP
    // ======================
    const currentYear = new Date().getFullYear();
    document.getElementById('current-year').textContent = currentYear;
    
    // ======================
    // BACKGROUND ANIMATIONS
    // ======================
    function createStars() {
        const container = document.querySelector('.stars-container');
        const starCount = 100;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.opacity = Math.random();
            star.style.width = `${Math.random() * 3}px`;
            star.style.height = star.style.width;
            star.style.animationDuration = `${5 + Math.random() * 10}s`;
            star.style.animationDelay = `${Math.random() * 5}s`;
            container.appendChild(star);
        }
    }
    
    const starStyle = document.createElement('style');
    starStyle.textContent = `
        @keyframes fall {
            from { transform: translateY(-100vh); }
            to { transform: translateY(100vh); }
        }
    `;
    document.head.appendChild(starStyle);
    
    // ======================
    // SWIPER INITIALIZATION
    // ======================
    const swiper = new Swiper('.eid-swiper', {
        direction: 'horizontal',
        loop: false,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 800,
        allowTouchMove: true,
        grabCursor: true,
        on: {
            init: function() {
                document.querySelector('.eid-card').classList.add('loaded');
            }
        }
    });
    
    // ======================
    // URL PARAMETERS HANDLING
    // ======================
    const params = new URLSearchParams(window.location.search);
    
    // Set recipient and sender from URL
    const recipient = params.get('receiver') || params.get('recipient') || "Beloved";
    const sender = params.get('sender') || "Your Host";
    
    document.getElementById('recipient').textContent = recipient;
    document.getElementById('sender').textContent = sender;
    
    // Set message from URL or use default
    const defaultMessage = `
        <p>As we celebrate this blessed occasion of Eid UL Adha, may Allah accept your sacrifices, prayers, and good deeds.</p>
        <p>Wishing you and your family a joyous Eid filled with peace, prosperity, and divine blessings.</p>
        <p>Eid Mubarak!</p>
    `;
    
    const customMessage = params.get('message') || params.get('msg');
    document.getElementById('letter-content').innerHTML = customMessage ? customMessage.replace(/\n/g, '<br>') : defaultMessage;
        
    // ======================
    // PAYMENT METHODS (BKash & Nagad)
    // ======================
    const paymentContainer = document.getElementById('payment-methods');
    const bkashNumber = params.get('bkash');
    const nagadNumber = params.get('nagad');
    
    // BKash Payment Method
    if (bkashNumber) {
        const bkashElement = document.createElement('div');
        bkashElement.className = 'payment-method';
        bkashElement.innerHTML = `
            <img src="https://logos-download.com/wp-content/uploads/2022/01/BKash_Logo_icon.svg" alt="BKash" loading="lazy">
            <div class="payment-number">${bkashNumber}</div>
        `;
        
        const numberElement = bkashElement.querySelector('.payment-number');
        
        bkashElement.addEventListener('click', function() {
            navigator.clipboard.writeText(bkashNumber).then(() => {
                // Store original text
                const originalText = numberElement.textContent;
                // Change to "Copied!"
                numberElement.textContent = 'Copied!';
                // Add visual feedback
                this.classList.add('copied');
                
                // Revert after 2 seconds
                setTimeout(() => {
                    numberElement.textContent = originalText;
                    this.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                numberElement.textContent = 'Copy Failed!';
                setTimeout(() => {
                    numberElement.textContent = bkashNumber;
                }, 2000);
            });
        });
        
        paymentContainer.appendChild(bkashElement);
    }
    
    // Nagad Payment Method
    if (nagadNumber) {
        const nagadElement = document.createElement('div');
        nagadElement.className = 'payment-method';
        nagadElement.innerHTML = `
            <img src="https://logos-download.com/wp-content/uploads/2022/01/Nagad_Logo_full.svg" alt="Nagad" loading="lazy">
            <div class="payment-number">${nagadNumber}</div>
        `;
        
        const numberElement = nagadElement.querySelector('.payment-number');
        
        nagadElement.addEventListener('click', function() {
            navigator.clipboard.writeText(nagadNumber).then(() => {
                // Store original text
                const originalText = numberElement.textContent;
                // Change to "Copied!"
                numberElement.textContent = 'Copied!';
                // Add visual feedback
                this.classList.add('copied');
                
                // Revert after 2 seconds
                setTimeout(() => {
                    numberElement.textContent = originalText;
                    this.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                numberElement.textContent = 'Copy Failed!';
                setTimeout(() => {
                    numberElement.textContent = nagadNumber;
                }, 2000);
            });
        });
        
        paymentContainer.appendChild(nagadElement);
    }
        
    // ======================
    // CONFETTI EFFECT
    // ======================
    function createConfetti() {
        const canvas = document.getElementById('eid-confetti');
        if (!canvas) return;
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const ctx = canvas.getContext('2d');
        const particles = [];
        const colors = ['#70B859', '#826656', '#967866', '#E8BFA5', '#D9E8CF', '#FEFEFE'];
        
        for (let i = 0; i < 150; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 8 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: Math.random() * 3 + 2,
                angle: Math.random() * Math.PI * 2,
                rotationSpeed: Math.random() * 0.2 - 0.1
            });
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                ctx.save();
                ctx.fillStyle = particle.color;
                ctx.translate(particle.x + particle.size / 2, particle.y + particle.size / 2);
                ctx.rotate(particle.angle);
                ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
                ctx.restore();
                
                particle.y += particle.speed;
                particle.angle += particle.rotationSpeed;
                
                if (particle.y > canvas.height) {
                    particle.y = -particle.size;
                    particle.x = Math.random() * canvas.width;
                }
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
        
        setTimeout(() => {
            canvas.style.opacity = '0';
            setTimeout(() => {
                canvas.remove();
            }, 1000);
        }, 5000);
    }
    
    // ======================
    // INITIALIZE EVERYTHING
    // ======================
    createStars();
    
    // Show confetti when reaching the last slide
    swiper.on('slideChange', function() {
        if (swiper.activeIndex === swiper.slides.length - 1) {
            createConfetti();
        }
    });
    
    // Initial confetti on load
    setTimeout(createConfetti, 1000);
});

// Disable right-click menu
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Disable keyboard shortcuts (Ctrl+C, Ctrl+A, etc.)
document.addEventListener('keydown', function(e) {
    // Disable Ctrl+C, Ctrl+A, Ctrl+X, etc.
    if (e.ctrlKey && (e.keyCode === 67 || e.keyCode === 65 || e.keyCode === 88 || e.keyCode === 85)) {
        e.preventDefault();
    }
    // Disable F12 (Developer Tools)
    if (e.keyCode === 123) {
        e.preventDefault();
    }
});

// Prevent image dragging via JavaScript
document.querySelectorAll('img').forEach(img => {
    img.setAttribute('draggable', 'false');
});

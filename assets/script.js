// assets/script.js
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const colorOptions = document.querySelectorAll('.color-option');
    const greetingForm = document.getElementById('greetingForm');
    const linkSection = document.getElementById('linkSection');
    const shortLink = document.getElementById('shortLink');
    const copyBtn = document.getElementById('copyBtn');
    const shareBtn = document.getElementById('shareBtn');
    const copiedAlert = document.getElementById('copiedAlert');
    const previewPopup = document.getElementById('previewPopup');
    const closePopup = document.getElementById('closePopup');
    const colorPreviewImage = document.getElementById('colorPreviewImage');
    const canvas = document.getElementById('fireworksCanvas');
    
    // Updated preview image paths
    const colorPreviews = {
        1: "assets/1.png",
        2: "assets/2.png",
        3: "assets/3.png", 
        4: "assets/4.png"
    };
    
    let selectedColor = '1';
    let fullLink = '';
    let pressTimer;
    
    // Initialize fireworks canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    
    // Color selection with long-press preview
    colorOptions.forEach(option => {
        // Immediate selection on click/tap
        option.addEventListener('pointerdown', function(e) {
            startPressTimer(e);
            selectColor(this);
        });
        
        option.addEventListener('pointerup', cancelPressTimer);
        option.addEventListener('pointerleave', cancelPressTimer);
    });
    
    function selectColor(element) {
        colorOptions.forEach(opt => opt.classList.remove('selected'));
        element.classList.add('selected');
        selectedColor = element.getAttribute('data-color');
    }
    
    function startPressTimer(e) {
        e.preventDefault();
        const colorOption = e.target.closest('.color-option');
        const color = colorOption.getAttribute('data-color');
        
        pressTimer = setTimeout(() => {
            showColorPreview(color);
        }, 800); // 0.8 second press (faster response)
    }
    
    function cancelPressTimer() {
        clearTimeout(pressTimer);
    }
    
    function showColorPreview(color) {
        colorPreviewImage.src = colorPreviews[color];
        previewPopup.classList.add('active');
    }
    
    closePopup.addEventListener('click', function() {
        previewPopup.classList.remove('active');
    });
    
    // Form submission
    greetingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate inputs
        const receiver = document.getElementById('receiver').value.trim();
        const sender = document.getElementById('sender').value.trim();
        const number = document.getElementById('number').value.trim();
        
        if (!receiver || !sender || !number) {
            alert('Please fill all fields');
            return;
        }
        
        // Generate link
        fullLink = `https://raffu1.github.io/pages/lay${selectedColor}/?sender=${encodeURIComponent(sender)}&receiver=${encodeURIComponent(receiver)}&number=${encodeURIComponent(number)}`;
        
        // Update UI
        shortLink.textContent = 'http://raffu1.github.io/...';
        linkSection.style.display = 'block';
        
        // Show fireworks
        startFireworks();
        
        // Scroll to link section
        linkSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Fast fireworks animation (3 quick bursts)
    function startFireworks() {
        const bursts = 3;
        let count = 0;
        
        function launchFirework() {
            if (count >= bursts) return;
            
            createFirework(
                Math.random() * canvas.width,
                canvas.height,
                `hsl(${Math.random() * 60 + 20}, 100%, 50%)`
            );
            
            count++;
            if (count < bursts) {
                setTimeout(launchFirework, 300); // 0.3s between fireworks
            }
        }
        
        launchFirework();
    }
    
    function createFirework(x, y, color) {
        const particles = [];
        const particleCount = 50;
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: x,
                y: y,
                color: color,
                angle: Math.random() * Math.PI * 2,
                speed: Math.random() * 5 + 2,
                friction: 0.95,
                gravity: 0.2,
                life: 100,
                decay: Math.random() * 0.03 + 0.02,
                size: Math.random() * 2 + 1
            });
        }
        
        // Animate
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;
            
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                
                if (p.life <= 0) continue;
                
                p.speed *= p.friction;
                p.x += Math.cos(p.angle) * p.speed;
                p.y += Math.sin(p.angle) * p.speed + p.gravity;
                p.life -= p.decay;
                
                ctx.globalAlpha = p.life / 100;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                
                if (p.life > 0) alive = true;
            }
            
            if (alive) {
                requestAnimationFrame(animate);
            }
        }
        
        animate();
    }
    
    // Copy link
    copyBtn.addEventListener('click', function() {
        if (!fullLink) return;
        
        navigator.clipboard.writeText(fullLink).then(() => {
            copiedAlert.classList.add('show');
            setTimeout(() => copiedAlert.classList.remove('show'), 2000);
        });
    });
    
    // Share link
    shareBtn.addEventListener('click', function() {
        if (!fullLink) return;
        
        if (navigator.share) {
            navigator.share({
                title: 'Eid Mubarak Greeting',
                text: 'Check out this Eid greeting!',
                url: fullLink
            }).catch(() => fallbackShare());
        } else {
            fallbackShare();
        }
    });
    
    function fallbackShare() {
        const input = document.createElement('input');
        input.value = fullLink;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        alert('Link copied to clipboard!');
    }
    
    // Social sharing
    const setupSocialShare = (id, url) => {
        document.getElementById(id).addEventListener('click', (e) => {
            e.preventDefault();
            if (!fullLink) return;
            window.open(url.replace('{url}', encodeURIComponent(fullLink)), '_blank');
        });
    };
    
    setupSocialShare('whatsappShare', 'https://wa.me/?text=Eid%20Greeting:%20{url}');
    setupSocialShare('telegramShare', 'https://t.me/share/url?url={url}&text=Eid%20Greeting');
    setupSocialShare('messengerShare', 'fb-messenger://share/?link={url}');
    setupSocialShare('instagramShare', 'instagram://share?url={url}');
    
    // Prevent copying
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('copy', (e) => {
        if (!e.target.matches('input, textarea')) e.preventDefault();
    });
    document.addEventListener('dragstart', (e) => e.preventDefault());
    
    // Responsive handling
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});

/* Custom Eid Greeting Generator by Raffsun Zany */
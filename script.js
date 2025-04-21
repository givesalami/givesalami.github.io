document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const form = document.getElementById('eidForm');
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.step');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const resultContainer = document.getElementById('resultContainer');
    const shortLinkInput = document.getElementById('shortLink');
    const copyBtn = document.getElementById('copyBtn');
    const previewLink = document.getElementById('previewLink');
    const messageInput = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    const createAnotherBtn = document.getElementById('createAnother');
    const eidAudio = document.getElementById('eidAudio');
    
    // Current step
    let currentStep = 0;
    let generatedUrl = '';
    
    // Initialize
    showStep(currentStep);
    
    // Character counter
    messageInput.addEventListener('input', function() {
        charCount.textContent = `${this.value.length}/500`;
    });
    
    // Next button
    nextBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!validateStep(currentStep)) return;
            
            currentStep++;
            showStep(currentStep);
            updateProgress();
        });
    });
    
    // Previous button
    prevBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentStep--;
            showStep(currentStep);
            updateProgress();
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateStep(currentStep)) return;
        
        // Get form values
        const formData = {
            sender: document.getElementById('sender').value.trim(),
            receiver: document.getElementById('receiver').value.trim(),
            message: document.getElementById('message').value.trim(),
            bkash: document.getElementById('bkash').value.trim(),
            nagad: document.getElementById('nagad').value.trim(),
            layout: document.querySelector('input[name="layout"]:checked').value
        };
        
        // Validate at least one payment number if any provided
        if ((formData.bkash || formData.nagad) && !formData.bkash && !formData.nagad) {
            alert('Please provide at least one payment number');
            return;
        }
        
        // Generate URL
        const params = new URLSearchParams();
        params.append('sender', formData.sender);
        params.append('receiver', formData.receiver);
        params.append('msg', formData.message);
        params.append('layout', formData.layout);
        
        if (formData.bkash) params.append('bkash', formData.bkash);
        if (formData.nagad) params.append('nagad', formData.nagad);
        
        generatedUrl = `${window.location.origin}/eid-card.html?${params.toString()}`;
        const displayUrl = `raffu.github.io/...${generatedUrl.slice(-8)}`;
        
        // Display result
        displayResult(displayUrl, generatedUrl);
        
        // Play success sound
        eidAudio.play();
        
        // Show confetti
        showConfetti();
    });
    
    // Copy button
    copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(generatedUrl).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            
            // Tooltip animation
            gsap.fromTo(copyBtn, 
                { y: 0 },
                { y: -5, duration: 0.2, yoyo: true, repeat: 1 }
            );
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        });
    });
    
    // Create another card
    createAnotherBtn.addEventListener('click', function() {
        resultContainer.classList.add('hidden');
        form.classList.remove('hidden');
        currentStep = 0;
        showStep(currentStep);
        updateProgress();
        form.reset();
        charCount.textContent = '0/500';
    });
    
    // Share buttons
    document.querySelector('.whatsapp').addEventListener('click', () => {
        shareOnWhatsApp(generatedUrl);
    });
    
    document.querySelector('.telegram').addEventListener('click', () => {
        shareOnTelegram(generatedUrl);
    });
    
    document.querySelector('.native-share').addEventListener('click', () => {
        nativeShare(generatedUrl);
    });
    
    // Helper functions
    function showStep(stepIndex) {
        formSteps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
    }
    
    function updateProgress() {
        progressSteps.forEach((step, index) => {
            step.classList.toggle('active', index <= currentStep);
        });
    }
    
    function validateStep(stepIndex) {
        let isValid = true;
        
        if (stepIndex === 0) {
            const sender = document.getElementById('sender').value.trim();
            const receiver = document.getElementById('receiver').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (!sender) {
                showError('sender', 'Please enter your name');
                isValid = false;
            }
            
            if (!receiver) {
                showError('receiver', 'Please enter recipient name');
                isValid = false;
            }
            
            if (!message) {
                showError('message', 'Please write your message');
                isValid = false;
            } else if (message.length < 10) {
                showError('message', 'Message should be at least 10 characters');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        
        // Remove existing error
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        // Add error message
        const errorElement = document.createElement('p');
        errorElement.className = 'error-message';
        errorElement.style.color = 'var(--accent)';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '0.5rem';
        errorElement.textContent = message;
        
        formGroup.appendChild(errorElement);
        
        // Highlight field
        field.style.borderColor = 'var(--accent)';
        
        // Shake animation
        gsap.fromTo(formGroup, 
            { x: 0 },
            { x: -5, duration: 0.1, repeat: 5, yoyo: true }
        );
        
        // Focus on field
        field.focus();
    }
    
    function displayResult(displayUrl, fullUrl) {
        form.classList.add('hidden');
        resultContainer.classList.remove('hidden');
        shortLinkInput.value = displayUrl;
        previewLink.href = fullUrl;
        
        // Animate success
        gsap.from('.success-animation', {
            scale: 0.5,
            opacity: 0,
            duration: 0.5,
            ease: 'back.out(1.7)'
        });
        
        gsap.from('.result-container h2', {
            y: 20,
            opacity: 0,
            delay: 0.3,
            duration: 0.5
        });
        
        gsap.from('.link-container', {
            y: 20,
            opacity: 0,
            delay: 0.5,
            duration: 0.5
        });
        
        gsap.from('.action-buttons', {
            y: 20,
            opacity: 0,
            delay: 0.7,
            duration: 0.5
        });
    }
    
    function showConfetti() {
        // Simple confetti effect using GSAP
        const colors = ['#2E7D32', '#FDD835', '#D32F2F', '#4CAF50', '#FFEB3B', '#F44336'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.zIndex = '1000';
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.top = '-10px';
            document.body.appendChild(confetti);
            
            gsap.to(confetti, {
                y: window.innerHeight + 10,
                x: `+=${(Math.random() - 0.5) * 100}`,
                rotation: Math.random() * 360,
                duration: 2 + Math.random() * 3,
                ease: 'power1.out',
                onComplete: () => confetti.remove()
            });
        }
    }
    
    function shareOnWhatsApp(url) {
        window.open(`https://wa.me/?text=${encodeURIComponent(`Eid Mubarak! 🎉 Check out this beautiful Eid card I made for you: ${url}`)}`, '_blank');
    }
    
    function shareOnTelegram(url) {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent('Eid Mubarak! Check out this Eid card')}`, '_blank');
    }
    
    function nativeShare(url) {
        if (navigator.share) {
            navigator.share({
                title: 'Eid Mubarak Card',
                text: 'I created a beautiful Eid card for you!',
                url: url
            }).catch(err => {
                console.log('Error sharing:', err);
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            prompt('Copy this link to share:', url);
        }
    }
});
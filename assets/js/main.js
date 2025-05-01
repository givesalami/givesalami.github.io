document.addEventListener('DOMContentLoaded', function() {
  // ======================
  // 1. MAGICAL LOADING ANIMATION
  // ======================
  setTimeout(() => {
    document.getElementById('loading').classList.add('hidden');
    document.querySelector('.main-content').classList.add('loaded');
  }, 2000);

  // ======================
  // 2. ELEGANT ELEMENTS SELECTION
  // ======================
  const elements = {
    // Forms
    detailsForm: document.getElementById('detailsForm'),
    designForm: document.querySelector('#section2 .design-container'),
    
    // Buttons
    nextBtn: document.getElementById('nextToDesign'),
    prevBtn: document.getElementById('backToDetails'),
    generateBtn: document.getElementById('generateCard'),
    createNewBtn: document.getElementById('createAnotherBtn'),
    copyBtn: document.getElementById('copyLinkBtn'),
    
    // Inputs
    senderInput: document.getElementById('senderName'),
    recipientInput: document.getElementById('recipientName'),
    messageInput: document.getElementById('message'),
    bkashInput: document.getElementById('bkashNumber'),
    nagadInput: document.getElementById('nagadNumber'),
    
    // Displays
    charCount: document.getElementById('charCount'),
    generatedLink: document.getElementById('generatedLink'),
    copyFeedback: document.querySelector('.copy-feedback'),
    cardPreview: document.getElementById('cardPreview'),
    
    // Special Effects
    confettiCanvas: document.getElementById('confetti-canvas'),
    emojiBackground: document.querySelector('.emoji-background')
  };

  // ======================
  // 3. CARD DATA STORE
  // ======================
  const cardData = {
    sender: '',
    recipient: '',
    message: '',
    style: 'random',
    bkash: '',
    nagad: '',
    
    // Save data from form
    saveFormData() {
      this.sender = elements.senderInput.value.trim();
      this.recipient = elements.recipientInput.value.trim();
      this.message = elements.messageInput.value;
    },
    
    // Save payment info
    savePaymentInfo() {
      this.bkash = elements.bkashInput.value.trim();
      this.nagad = elements.nagadInput.value.trim();
    },
    
    // Reset all data
    reset() {
      this.sender = '';
      this.recipient = '';
      this.message = '';
      this.style = 'random';
      this.bkash = '';
      this.nagad = '';
    }
  };

  // ======================
  // 4. INITIALIZATION
  // ======================
  function init() {
    setupEventListeners();
    createFloatingEmojis();
  }

  // ======================
  // 5. EVENT HANDLERS
  // ======================
  function setupEventListeners() {
    // Real-time character counter
    elements.messageInput.addEventListener('input', function() {
      elements.charCount.textContent = this.value.length;
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });

    // Navigation flow
    elements.nextBtn.addEventListener('click', navigateToDesign);
    elements.prevBtn.addEventListener('click', navigateBackToDetails);
    elements.generateBtn.addEventListener('click', generateEidCard);
    elements.createNewBtn.addEventListener('click', resetApplication);

    // Style selection with cool flip animation
    document.querySelectorAll('.style-option').forEach(option => {
      option.addEventListener('click', function() {
        document.querySelectorAll('.style-option').forEach(opt => {
          opt.classList.remove('selected', 'card-flip');
        });
        this.classList.add('selected', 'card-flip');
        cardData.style = this.dataset.style;
        
        // Remove flip class after animation
        setTimeout(() => this.classList.remove('card-flip'), 1000);
      });
    });

    // Share functionality
    elements.copyBtn.addEventListener('click', copyGeneratedLink);
    document.querySelectorAll('.share-btn[data-platform]').forEach(btn => {
      btn.addEventListener('click', shareOnSocialPlatform);
    });

    // Native share API with fallback
    if (navigator.share) {
      document.getElementById('nativeShareBtn').addEventListener('click', nativeShare);
    } else {
      document.getElementById('nativeShareBtn').style.display = 'none';
    }
  }

  // ======================
  // 6. CORE FUNCTIONALITY
  // ======================
  function navigateToDesign() {
    if (validateDetailsForm()) {
      cardData.saveFormData();
      transitionToSection('section2');
      updateProgress(66, 'Step 2 of 3');
    }
  }

  function generateEidCard() {
    if (validateDesignForm()) {
      cardData.savePaymentInfo();
      transitionToSection('section3');
      updateProgress(100, 'Step 3 of 3');
      
      renderCardPreview();
      generateShareableLink();
      launchCelebration();
    }
  }

  // ======================
  // 7. CARD GENERATION & PREVIEW
  // ======================
  function renderCardPreview() {
    // Clear and prepare the preview container
    elements.cardPreview.className = 'card-preview';
    elements.cardPreview.innerHTML = '';
    
    // Determine the card style (random if not selected)
    const style = cardData.style === 'random' 
      ? ['classic', 'modern', 'islamic', 'fun', 'elegant'][Math.floor(Math.random() * 5)]
      : cardData.style;
    
    // Apply the selected style
    elements.cardPreview.classList.add(style);
    
    // Create the card content
    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';
    
    // Build the card structure
    cardContent.innerHTML = `
      <div class="card-header">
        <h3>Eid Mubarak!</h3>
      </div>
      <div class="card-recipient">
        <p>Dear <strong>${escapeHtml(cardData.recipient)}</strong>,</p>
      </div>
      <div class="card-message">
        <p>${formatMessageContent(cardData.message)}</p>
      </div>
      <div class="card-sender">
        <p>From <strong>${escapeHtml(cardData.sender)}</strong></p>
      </div>
      ${cardData.bkash || cardData.nagad ? `
      <div class="card-payment">
        <h4>Eidi Gift:</h4>
        ${cardData.bkash ? `<p>bKash: ${formatPhoneNumber(cardData.bkash)}</p>` : ''}
        ${cardData.nagad ? `<p>Nagad: ${formatPhoneNumber(cardData.nagad)}</p>` : ''}
      </div>
      ` : ''}
      <div class="card-decorations">
        <div class="moon">🌙</div>
        <div class="lantern">🪔</div>
        <div class="stars">${'⭐'.repeat(5)}</div>
      </div>
    `;
    
    elements.cardPreview.appendChild(cardContent);
  }

  // ======================
  // 8. URL GENERATION
  // ======================
  function generateShareableLink() {
    const baseUrl = `${window.location.origin}/${cardData.style || 'modern'}`;
    const params = new URLSearchParams();
    
    // Double encode the message to preserve all formatting
    const doubleEncodedMessage = encodeURIComponent(encodeURIComponent(cardData.message));
    
    params.append('sender', encodeURIComponent(cardData.sender));
    params.append('recipient', encodeURIComponent(cardData.recipient));
    params.append('message', doubleEncodedMessage);
    
    if (cardData.bkash) params.append('bkash', cardData.bkash);
    if (cardData.nagad) params.append('nagad', cardData.nagad);
    
    const shareUrl = `${baseUrl}/?${params.toString()}`;
    elements.generatedLink.value = shareUrl;
    
    // Enable all share buttons
    document.querySelectorAll('.share-btn').forEach(btn => btn.disabled = false);
  }

  // ======================
  // 9. SPECIAL EFFECTS
  // ======================
  function launchCelebration() {
    // Confetti explosion
    renderConfetti();
    
    // Success animation
    document.querySelector('.success-animation').classList.add('animate');
    
    // Optional: Play celebration sound
    // new Audio('assets/audio/success.mp3').play().catch(e => console.log(e));
  }

  function renderConfetti() {
    const canvas = elements.confettiCanvas;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create colorful confetti particles
    const particles = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 10 + 5,
      color: ['#F6C90E', '#FAD2E1', '#D8F3DC', '#A3D8F4', '#FFFFFF'][Math.floor(Math.random() * 5)],
      speed: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 5
    }));
    
    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation * Math.PI / 180);
        
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        
        // Draw random shapes
        Math.random() > 0.5 
          ? ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2)
          : drawStar(ctx, 0, 0, 5, particle.size / 2, particle.size / 4);
        
        ctx.fill();
        ctx.restore();
        
        // Update particle position
        particle.y += particle.speed;
        particle.rotation += particle.rotationSpeed;
        
        // Recycle particles that fall off screen
        if (particle.y > canvas.height) {
          particle.y = -particle.size;
          particle.x = Math.random() * canvas.width;
        }
      });
      
      requestAnimationFrame(animate);
    }
    
    // Start the show!
    animate();
    
    // Clean up after 5 seconds
    setTimeout(() => {
      canvas.style.opacity = '0';
      setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 1000);
    }, 5000);
  }

  // ======================
  // 10. HELPER FUNCTIONS
  // ======================
  function formatMessageContent(text) {
    return escapeHtml(text)
      .replace(/\r?\n/g, '<br>')
      .replace(/ {2}/g, ' &nbsp;');
  }

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, 
      match => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[match]));
  }

  function formatPhoneNumber(number) {
    return number.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3');
  }

  function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
      const x = cx + Math.cos(rot) * outerRadius;
      const y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += Math.PI / spikes;

      ctx.lineTo(
        cx + Math.cos(rot) * innerRadius,
        cy + Math.sin(rot) * innerRadius
      );
      rot += Math.PI / spikes;
    }
    
    ctx.closePath();
  }

  function createFloatingEmojis() {
    const emojis = ['🌙', '🕌', '🌟', '🪔', '🌠'];
    elements.emojiBackground.innerHTML = emojis
      .map(emoji => `<span style="
        left: ${Math.random() * 90 + 5}%;
        top: ${Math.random() * 90 + 5}%;
        font-size: ${Math.random() * 2 + 1.5}rem;
        animation-delay: ${Math.random() * 5}s;
        animation-duration: ${Math.random() * 10 + 15}s;
      ">${emoji}</span>`)
      .join('');
  }

  // ======================
  // 11. UI UTILITIES
  // ======================
  function transitionToSection(sectionId) {
    document.querySelectorAll('.card-section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
  }

  function updateProgress(percent, label) {
    document.querySelector('.progress-bar').style.width = `${percent}%`;
    document.querySelector('.progress-label').textContent = label;
  }

  function copyGeneratedLink() {
    elements.generatedLink.select();
    document.execCommand('copy');
    
    elements.copyFeedback.classList.add('show');
    setTimeout(() => elements.copyFeedback.classList.remove('show'), 2000);
  }

  function shareOnSocialPlatform() {
    const platform = this.dataset.platform;
    const url = encodeURIComponent(elements.generatedLink.value);
    const text = encodeURIComponent(`Eid Mubarak! ${cardData.sender} sent you a beautiful Eid card.`);
    
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${text} ${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  }

  function nativeShare() {
    navigator.share({
      title: 'Eid Mubarak Card',
      text: `${cardData.sender} sent you a beautiful Eid card!`,
      url: elements.generatedLink.value
    }).catch(console.error);
  }

  function resetApplication() {
    // Reset form fields
    elements.senderInput.value = '';
    elements.recipientInput.value = '';
    elements.messageInput.value = '';
    elements.bkashInput.value = '';
    elements.nagadInput.value = '';
    
    // Reset card data
    cardData.reset();
    
    // Reset UI
    document.querySelectorAll('.style-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelector('.style-option[data-style="random"]').classList.add('selected');
    elements.charCount.textContent = '0';
    elements.generatedLink.value = '';
    elements.confettiCanvas.style.opacity = '1';
    
    // Return to first section
    transitionToSection('section1');
    updateProgress(33, 'Step 1 of 3');
  }

  // ======================
  // 12. VALIDATION
  // ======================
  function validateDetailsForm() {
    let isValid = true;
    const requiredFields = [
      elements.senderInput, 
      elements.recipientInput, 
      elements.messageInput
    ];
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.parentElement.classList.add('error');
        isValid = false;
      } else {
        field.parentElement.classList.remove('error');
      }
    });
    
    if (!isValid) {
      elements.detailsForm.classList.add('shake');
      setTimeout(() => elements.detailsForm.classList.remove('shake'), 500);
    }
    
    return isValid;
  }

  function validateDesignForm() {
    let isValid = true;
    
    // Validate bKash if provided
    if (elements.bkashInput.value && !/^\d{11}$/.test(elements.bkashInput.value)) {
      showValidationError(elements.bkashInput, 'Please enter a valid 11-digit bKash number');
      isValid = false;
    }
    
    // Validate Nagad if provided
    if (elements.nagadInput.value && !/^\d{11}$/.test(elements.nagadInput.value)) {
      showValidationError(elements.nagadInput, 'Please enter a valid 11-digit Nagad number');
      isValid = false;
    }
    
    return isValid;
  }

  function showValidationError(input, message) {
    const formGroup = input.parentElement;
    formGroup.classList.add('error');
    
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // ======================
  // 13. START THE MAGIC!
  // ======================
  init();
});

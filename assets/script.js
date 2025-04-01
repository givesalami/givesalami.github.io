document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const colorOptions = document.querySelectorAll('.color-option');
    const greetingForm = document.getElementById('greetingForm');
    const linkSection = document.getElementById('linkSection');
    const shortLink = document.getElementById('shortLink');
    const copyBtn = document.getElementById('copyBtn');
    const shareBtn = document.getElementById('shareBtn');
    const copiedAlert = document.getElementById('copiedAlert');
    
    let selectedColor = '1'; // Default to first color
    let fullLink = '';
    
    // Color selection
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            selectedColor = this.getAttribute('data-color');
        });
    });
    
    // Form submission
    greetingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const receiver = document.getElementById('receiver').value.trim();
        const sender = document.getElementById('sender').value.trim();
        const number = document.getElementById('number').value.trim();
        
        // Generate link
        fullLink = `https://raffu1.github.io/pages/lay${selectedColor}/?sender=${encodeURIComponent(sender)}&receiver=${encodeURIComponent(receiver)}&number=${encodeURIComponent(number)}`;
        
        // Update UI
        shortLink.textContent = 'http://raffu1.github.io/...';
        linkSection.style.display = 'block';
        
        // Scroll to link section
        linkSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Copy link
    copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(fullLink).then(() => {
            // Show copied alert
            copiedAlert.classList.add('show');
            
            // Hide after 2 seconds
            setTimeout(() => {
                copiedAlert.classList.remove('show');
            }, 2000);
        });
    });
    
    // Share link
    shareBtn.addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: 'Eid Mubarak Greeting',
                text: 'Check out this Eid Mubarak greeting!',
                url: fullLink
            }).catch(err => {
                console.log('Error sharing:', err);
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            const tempInput = document.createElement('input');
            document.body.appendChild(tempInput);
            tempInput.value = fullLink;
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            alert('Link copied to clipboard. You can now share it manually.');
        }
    });
});

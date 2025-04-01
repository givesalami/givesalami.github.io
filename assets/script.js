// Store the generated link globally
let generatedLink = "";

function generateLink() {
    // Get input values
    const name = document.getElementById('name').value.trim();
    const bkash = document.getElementById('bkash').value.trim();
    const receiver = document.getElementById('receiver').value.trim();
    
    // Validate inputs
    if (name && bkash && receiver) {
        // Generate the full URL
        generatedLink = `https://raffu1.github.io/eid/?name=${encodeURIComponent(name)}&sender=${encodeURIComponent(receiver)}&phone=${encodeURIComponent(bkash)}`;
        
        // Create the display HTML
        document.getElementById('generatedLink').innerHTML = `
            <div class="link-box">
                <a href="${generatedLink}" target="_blank" class="link-text" title="Click to open">http://raffu1.github.io/...</a>
                <div class="actions">
                    <button class="copy-btn tooltip" onclick="copyLink(event)">
                        <i class="fas fa-copy"></i>
                        <span class="tooltiptext">Copy Link</span>
                    </button>
                    <button class="share-btn tooltip" onclick="shareLink(event)">
                        <i class="fa-solid fa-share-nodes"></i>
                        <span class="tooltiptext">Share</span>
                    </button>
                </div>
            </div>
        `;
    } else {
        alert("Please fill all fields");
    }
}

function copyLink(event) {
    event.preventDefault(); // Prevent any default behavior
    
    if (!generatedLink) return;
    
    navigator.clipboard.writeText(generatedLink)
        .then(() => {
            // Visual feedback
            const copyBtn = event.currentTarget;
            const originalHTML = copyBtn.innerHTML;
            const originalBg = copyBtn.style.backgroundColor;
            
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.style.backgroundColor = '#34a853';
            
            // Reset after 2 seconds
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.style.backgroundColor = originalBg;
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy:', err);
            alert("Link Copied ☺️.");
        });
}

function shareLink(event) {
    event.preventDefault();
    
    if (!generatedLink) return;
    
    if (navigator.share) {
        // Modern browsers with Share API
        navigator.share({
            title: 'Eid Mubarak Card',
            text: 'You\'ve received a special Eid greeting card!',
            url: generatedLink
        }).catch(err => {
            console.log('Sharing failed:', err);
        });
    } else {
        // Fallback for browsers without Share API
        const shareText = `You've received an Eid greeting card: ${generatedLink}`;
        
        // Try to use email as fallback
        const mailtoLink = `mailto:?subject=Eid Mubarak Greetings&body=${encodeURIComponent(shareText)}`;
        window.open(mailtoLink, '_blank');
    }
}

// Optional: Add event listener for form submission
document.getElementById('eidForm').addEventListener('submit', function(e) {
    e.preventDefault();
    generateLink();
});

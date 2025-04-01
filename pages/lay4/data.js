// data.js
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get values from URL (with fallbacks)
    const sender = urlParams.get('sender') || 'Your Sender';
    const receiver = urlParams.get('receiver') || 'Receiver';
    const bkashNumber = urlParams.get('number') || '01234567890';

    // Update DOM
    document.querySelector('.sender-name').textContent = sender;
    document.querySelector('.receiver-name').textContent = receiver;
    document.querySelector('.bkash-value').textContent = formatBkashNumber(bkashNumber);

    // Update copy function to use dynamic number
    window.copyNumber = function() {
        navigator.clipboard.writeText(bkashNumber).then(() => {
            const notification = document.querySelector('.copy-notification');
            notification.style.opacity = '1';
            setTimeout(() => notification.style.opacity = '0', 2000);
        });
    };
});

// Format bKash number for display (e.g., "01712 345678")
function formatBkashNumber(num) {
    return num.replace(/(\d{5})(\d+)/, '$1 $2');
}
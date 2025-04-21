// Get data from URL parameters
function getUrlData() {
  const params = new URLSearchParams(window.location.search);
  return {
    receiver: params.get('receiver') || 'Dear One',
    sender: params.get('sender') || 'Someone Special',
    message: params.get('message') || 'Wishing you a blessed Eid filled with joy, peace, and prosperity. May Allah accept our fasting and prayers.',
    bkash: params.get('bkash'),
    nagad: params.get('nagad')
  };
}

// Set data to DOM elements
function setDataToDOM(data) {
  // Set text content
  document.getElementById('receiver-name').textContent = data.receiver;
  document.getElementById('letter-receiver').textContent = data.receiver;
  document.getElementById('letter-sender').textContent = data.sender;
  document.getElementById('letter-message').textContent = data.message;
  document.getElementById('current-year').textContent = new Date().getFullYear();

  // Set payment methods
  const paymentContainer = document.querySelector('.payment-cards');
  
  if (data.bkash) {
    const bkashCard = document.createElement('div');
    bkashCard.className = 'payment-card';
    bkashCard.innerHTML = `
      <div class="payment-logo" style="background-image: url('https://logos-download.com/wp-content/uploads/2022/01/BKash_Logo_icon.svg')"></div>
      <div>Send via bKash</div>
      <div class="payment-number">${data.bkash}</div>
    `;
    paymentContainer.appendChild(bkashCard);
  }

  if (data.nagad) {
    const nagadCard = document.createElement('div');
    nagadCard.className = 'payment-card';
    nagadCard.innerHTML = `
      <div class="payment-logo" style="background-image: url('https://logos-download.com/wp-content/uploads/2022/01/Nagad_Logo_full.svg')"></div>
      <div>Send via Nagad</div>
      <div class="payment-number">${data.nagad}</div>
    `;
    paymentContainer.appendChild(nagadCard);
  }

  if (!data.bkash && !data.nagad) {
    paymentContainer.innerHTML = `
      <div style="text-align: center; padding: 20px; color: var(--text-dark);">
        Your warm wishes are the best gift!
      </div>
    `;
  }
}

// Initialize data
const eidData = getUrlData();
setDataToDOM(eidData);
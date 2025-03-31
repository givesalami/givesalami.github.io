/* script.js */
function generateLink() {
    let name = document.getElementById('name').value;
    let bkash = document.getElementById('bkash').value;
    let receiver = document.getElementById('receiver').value;
    
    if (name && bkash && receiver) {
        let link = `https://raffu1.github.io/eid/?name=${encodeURIComponent(name)}&sender=${encodeURIComponent(receiver)}&phone=${encodeURIComponent(bkash)}`;
        document.getElementById('generatedLink').innerHTML = `
            <div class="link-box">
                <a href="${link}" target="_blank">${link}</a>
                <button class="copy-btn" onclick="copyLink()">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="share-btn" onclick="shareLink()">Share</button>
            </div>
        `;
    } else {
        alert("Please fill all fields");
    }
}

function copyLink() {
    let linkElement = document.querySelector('#generatedLink a');
    if (linkElement) {
        navigator.clipboard.writeText(linkElement.href).then(() => {
            alert("Link copied to clipboard!");
        }).catch(err => {
            alert("Failed to copy link.");
        });
    }
}

function shareLink() {
    let linkElement = document.querySelector('#generatedLink a');
    if (navigator.share && linkElement) {
        navigator.share({
            title: "Eid Mubarak Link",
            text: "Check out this special Eid link!",
            url: linkElement.href
        }).catch(err => {
            alert("Sharing failed.");
        });
    } else {
        alert("Sharing not supported on this device.");
    }
}
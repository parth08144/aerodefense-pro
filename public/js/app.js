// Global App JS — Toast, Logout, Cart Badge

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast' + (type === 'success' ? ' toast-success' : type === 'error' ? ' toast-error' : '');
    toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-triangle-exclamation' : 'fa-info-circle'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; toast.style.transition = '0.3s'; setTimeout(() => toast.remove(), 300); }, 3000);
}

function updateCartBadge(count) {
    let badge = document.getElementById('cartBadge');
    if (count > 0) {
        if (!badge) {
            const cartLink = document.querySelector('.nav-cart');
            if (cartLink) { badge = document.createElement('span'); badge.className = 'cart-count'; badge.id = 'cartBadge'; cartLink.appendChild(badge); }
        }
        if (badge) { badge.textContent = count; badge.style.animation = 'none'; badge.offsetHeight; badge.style.animation = 'countUp 0.3s ease-out'; }
    } else if (badge) { badge.remove(); }
}

async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location = '/';
}

// Highlight active nav link
document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === window.location.pathname) link.classList.add('active');
});

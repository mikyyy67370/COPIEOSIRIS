// Fonctions du panier
let cart = [];

// Amélioration des performances du panier
const cartCache = {
    items: null,
    total: 0,
    lastUpdate: 0
};

function getCartItems() {
    const now = Date.now();
    // Utiliser le cache si moins de 2 secondes se sont écoulées
    if (cartCache.items && now - cartCache.lastUpdate < 2000) {
        return cartCache.items;
    }
    
    const items = JSON.parse(localStorage.getItem('cart')) || [];
    cartCache.items = items;
    cartCache.lastUpdate = now;
    return items;
}

function updateCartTotal() {
    const items = getCartItems();
    cartCache.total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return cartCache.total;
}

// Debounce pour les mises à jour fréquentes
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedUpdateCart = debounce(updateCartDisplay, 150);

// Charger le panier au démarrage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            cart = [];
            localStorage.removeItem('cart');
        }
    }
    updateCartDisplay();
}

// Sauvegarder le panier
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// Ajouter au panier
function addToCart(name, price, image) {
    if (!name || !price || !image) {
        showNotification('Erreur: données du produit invalides', 'error');
        return;
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
        showNotification('Erreur: prix invalide', 'error');
        return;
    }

    cart.push({
        name: name,
        price: numericPrice,
        image: image
    });

    saveCart();
    showNotification('Produit ajouté au panier', 'success');
    
    // Redirection vers le panier
    setTimeout(() => {
        window.location.href = 'panier.html';
    }, 1000);
}

// Supprimer du panier
function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        saveCart();
        showNotification('Produit retiré du panier', 'info');
    }
}

// Vider le panier
function clearCart() {
    cart = [];
    saveCart();
    showNotification('Panier vidé', 'info');
}

// Mettre à jour l'affichage
function updateCartDisplay() {
    // Mettre à jour le compteur
    const count = cart.length;
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'block' : 'none';
    });

    // Si on est sur la page panier, afficher les produits
    const cartContainer = document.getElementById('cartItems');
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Votre panier est vide</h2>
                <a href="index.html" class="btn">Continuer mes achats</a>
            </div>
        `;
        return;
    }

    // Calculer le total
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    let html = '<div class="cart-items">';
    cart.forEach((item, index) => {
        html += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='images/default-product.jpg'">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="price">${item.price.toFixed(2)} €</p>
                    <button onclick="removeFromCart(${index})" class="remove-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
    });

    html += `
        </div>
        <div class="cart-summary">
            <div class="cart-total">
                <h3>Total: ${total.toFixed(2)} €</h3>
            </div>
            <div class="cart-actions">
                <button onclick="clearCart()" class="btn clear">Vider le panier</button>
                <button onclick="checkout()" class="btn checkout">Commander</button>
            </div>
        </div>
    `;

    cartContainer.innerHTML = html;
}

// Afficher une notification
function showNotification(message, type = 'success') {
    // Supprimer les notifications existantes
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Passer à la commande
function checkout() {
    alert('Redirection vers le paiement...');
}

// Initialisation
document.addEventListener('DOMContentLoaded', loadCart);

class Cart {
    constructor() {
        const cartItems = localStorage.getItem('cart') || localStorage.getItem('osirisCart');
        this.items = cartItems ? JSON.parse(cartItems) : [];
        
        if (localStorage.getItem('osirisCart')) {
            localStorage.removeItem('osirisCart');
            localStorage.setItem('cart', JSON.stringify(this.items));
        }

        this.init();
        this.updateCartCount();
    }

    init() {
        if (window.location.pathname.includes('panier.html')) {
            this.container = document.getElementById('cartItems');
            this.template = document.getElementById('cartItemTemplate');
            this.emptyTemplate = document.getElementById('emptyCartTemplate');
            this.clearCartBtn = document.getElementById('clearCart');
            
            this.updateDisplay();

            // Gestionnaire pour le bouton "Vider le panier"
            if (this.clearCartBtn) {
                this.clearCartBtn.addEventListener('click', () => this.clearCart());
                // Cacher le bouton si le panier est vide
                this.clearCartBtn.style.display = this.items.length > 0 ? 'block' : 'none';
            }

            // Gestionnaire pour les boutons du panier
            if (this.container) {
                this.container.addEventListener('click', (e) => {
                    const item = e.target.closest('.cart-item');
                    if (!item) return;

                    const productId = item.dataset.productId;
                    const size = item.dataset.size;
                    const quantityElement = item.querySelector('.quantity');
                    const currentQuantity = parseInt(quantityElement.textContent);

                    if (e.target.closest('.decrease')) {
                        if (currentQuantity > 1) {
                            this.updateQuantity(productId, size, currentQuantity - 1);
                        } else {
                            this.removeItem(productId, size);
                        }
                    } else if (e.target.closest('.increase')) {
                        this.updateQuantity(productId, size, currentQuantity + 1);
                    } else if (e.target.closest('.remove-item')) {
                        this.removeItem(productId, size);
                    }
                });
            }
        }

        // Gestionnaire pour les boutons d'ajout au panier
        document.addEventListener('DOMContentLoaded', () => {
            const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
            addToCartButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const container = e.target.closest('.product-container');
                    if (!container) return;

                    const productId = container.dataset.productId;
                    const productName = container.querySelector('.product-title').textContent;
                    const price = parseFloat(container.querySelector('.product-price').textContent.replace('€', '').trim());
                    const size = container.querySelector('.size-selector')?.value || '100ml';
                    const image = container.querySelector('.main-image')?.src || `images/${productId.toLowerCase()}.jpg`;

                    this.addItem({
                        id: productId,
                        name: productName,
                        price: price,
                        size: size,
                        image: image
                    });

                    this.showNotification('Produit ajouté au panier', 'success');
                    this.updateCartIcon();
                });
            });
        });
    }

    clearCart() {
        if (confirm('Voulez-vous vraiment vider votre panier ?')) {
            this.items = [];
            this.saveCart();
            this.updateDisplay();
            this.showNotification('Le panier a été vidé', 'success');
        }
    }

    addItem(product) {
        if (!this.validateProduct(product)) {
            this.showNotification('Erreur : Produit invalide', 'error');
            return false;
        }

        const existingItem = this.items.find(item => 
            item.id === product.id && item.size === product.size
        );

        if (existingItem) {
            existingItem.quantity = existingItem.quantity + 1;
        } else {
            product.quantity = 1;
            this.items.push(product);
        }

        this.saveCart();
        this.updateDisplay();
        return true;
    }

    removeItem(productId, size) {
        const index = this.items.findIndex(item => 
            item.id === productId && item.size === size
        );

        if (index !== -1) {
            this.items.splice(index, 1);
            this.saveCart();
            this.updateDisplay();
            this.showNotification('Produit retiré du panier', 'success');
        }
    }

    updateQuantity(productId, size, newQuantity) {
        const item = this.items.find(item => 
            item.id === productId && item.size === size
        );
        
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(productId, size);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateDisplay();
            }
        }
    }

    calculateTotal() {
        return this.items.reduce((total, item) => 
            total + (item.price * item.quantity), 0
        );
    }

    validateProduct(product) {
        return product && 
               typeof product.id === 'string' && 
               typeof product.name === 'string' && 
               typeof product.price === 'number' && 
               typeof product.image === 'string';
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'times-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    updateCartIcon() {
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.classList.add('bounce');
            setTimeout(() => {
                cartIcon.classList.remove('bounce');
            }, 1000);
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
        this.updateTotals();

        // Mettre à jour la visibilité du bouton "Vider le panier"
        if (this.clearCartBtn) {
            this.clearCartBtn.style.display = this.items.length > 0 ? 'block' : 'none';
        }
    }

    updateCartCount() {
        const count = this.items.reduce((total, item) => total + item.quantity, 0);
        const countElements = document.querySelectorAll('.cart-count');
        countElements.forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? 'block' : 'none';
        });
    }

    updateDisplay() {
        if (!this.container) return;

        this.container.innerHTML = '';

        if (this.items.length === 0) {
            const emptyCart = this.emptyTemplate.content.cloneNode(true);
            this.container.appendChild(emptyCart);
            return;
        }

        const fragment = document.createDocumentFragment();

        this.items.forEach(item => {
            const cartItem = this.template.content.cloneNode(true);
            const container = cartItem.querySelector('.cart-item');
            
            container.dataset.productId = item.id;
            container.dataset.size = item.size;
            
            const img = cartItem.querySelector('img');
            img.src = item.image;
            img.alt = item.name;
            
            cartItem.querySelector('h3').textContent = item.name;
            cartItem.querySelector('.item-size').textContent = `Taille: ${item.size}`;
            cartItem.querySelector('.item-price').textContent = `${item.price.toFixed(2)} €`;
            cartItem.querySelector('.quantity').textContent = item.quantity;
            
            fragment.appendChild(cartItem);
        });

        this.container.appendChild(fragment);
        this.updateTotals();
    }

    updateTotals() {
        const subtotal = this.calculateTotal();
        const total = subtotal;

        const subtotalElement = document.getElementById('subtotal');
        const totalElement = document.getElementById('total');

        if (subtotalElement) subtotalElement.textContent = `${subtotal.toFixed(2)} €`;
        if (totalElement) totalElement.textContent = `${total.toFixed(2)} €`;
    }
}

// Initialiser le panier
const cart = new Cart();

// Gestion des produits et du panier
class ProductPage {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.loadProductData();
        this.priceModifiers = {
            '50ml': 0.7,
            '100ml': 1.0,
            '150ml': 1.4
        };
        this.cart = new Cart();
        this.cart.init();
        this.initializeProduct();
        this.attachEventListeners();
    }

    initializeElements() {
        // Boutons et éléments du produit
        this.addToCartBtn = document.querySelector('.add-to-cart');
        this.quantityInput = document.querySelector('#quantity');
        this.volumeButtons = document.querySelectorAll('.option-buttons .option-btn');
        this.priceElement = document.querySelector('.price');
        this.ratingContainer = document.querySelector('.stars');
        this.reviewsContainer = document.querySelector('.reviews-container');
        
        // Initialiser la quantité à 1
        if (this.quantityInput) {
            this.quantityInput.value = 1;
            this.quantityInput.addEventListener('change', () => {
                const value = parseInt(this.quantityInput.value);
                if (isNaN(value) || value < 1) {
                    this.quantityInput.value = 1;
                } else if (value > 10) {
                    this.quantityInput.value = 10;
                }
                this.updatePrice();
            });
        }
    }

    setupEventListeners() {
        // Gestion du panier
        if (this.addToCartBtn) {
            this.addToCartBtn.addEventListener('click', () => this.addToCart());
        }

        // Gestion de la quantité
        const minusBtn = document.querySelector('.qty-btn.minus');
        const plusBtn = document.querySelector('.qty-btn.plus');

        if (minusBtn) {
            minusBtn.addEventListener('click', () => this.updateQuantity('minus'));
        }

        if (plusBtn) {
            plusBtn.addEventListener('click', () => this.updateQuantity('plus'));
        }

        // Gestion du volume avec délégation d'événements
        const volumeContainer = document.querySelector('.option-buttons');
        if (volumeContainer) {
            volumeContainer.addEventListener('click', (e) => {
                const button = e.target.closest('.option-btn');
                if (button) {
                    this.handleVolumeSelection(button);
                }
            });
        }

        // Gestion des miniatures de la galerie avec délégation d'événements
        const galleryContainer = document.querySelector('.gallery-thumbnails');
        const mainImage = document.querySelector('.main-image');

        if (galleryContainer && mainImage) {
            galleryContainer.addEventListener('click', (e) => {
                const thumbnail = e.target.closest('img');
                if (thumbnail) {
                    this.handleThumbnailClick(thumbnail, mainImage);
                }
            });
        }
    }

    handleThumbnailClick(thumbnail, mainImage) {
        const thumbnails = document.querySelectorAll('.gallery-thumbnails img');
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnail.classList.add('active');

        // Transition douce
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.src = thumbnail.src;
            mainImage.alt = thumbnail.alt;
            mainImage.style.opacity = '1';
        }, 300);
    }

    updateQuantity(action) {
        if (!this.quantityInput) return;
        
        let currentValue = parseInt(this.quantityInput.value);
        const minValue = 1;
        const maxValue = 10;
        
        if (action === 'minus' && currentValue > minValue) {
            currentValue--;
        } else if (action === 'plus' && currentValue < maxValue) {
            currentValue++;
        }
        
        this.quantityInput.value = currentValue;
        this.updatePrice();
        
        // Mettre à jour l'état des boutons
        const minusBtn = document.querySelector('.qty-btn.minus');
        const plusBtn = document.querySelector('.qty-btn.plus');
        
        if (minusBtn) minusBtn.disabled = currentValue <= minValue;
        if (plusBtn) plusBtn.disabled = currentValue >= maxValue;
    }

    handleVolumeSelection(button) {
        if (!button || button.classList.contains('active')) return;

        this.volumeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Mettre à jour le prix et le data-volume du bouton d'ajout au panier
        this.updatePrice();
        if (this.addToCartBtn) {
            this.addToCartBtn.dataset.volume = button.textContent;
        }

        // Animation de sélection
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }

    updatePrice() {
        if (!this.priceElement || !this.addToCartBtn) return;

        const basePrice = parseFloat(this.addToCartBtn.dataset.productPrice);
        const activeVolume = document.querySelector('.option-buttons .option-btn.active');
        const quantity = parseInt(this.quantityInput.value) || 1;

        if (!activeVolume || isNaN(basePrice)) return;

        const volumeSize = activeVolume.textContent;
        const modifier = this.priceModifiers[volumeSize] || 1;
        const finalPrice = (basePrice * modifier * quantity).toFixed(2);

        // Animation du changement de prix
        this.priceElement.style.transform = 'scale(0.95)';
        this.priceElement.textContent = `${finalPrice}€`;
        
        setTimeout(() => {
            this.priceElement.style.transform = 'scale(1)';
        }, 150);

        // Mettre à jour le prix dans le dataset pour le panier
        this.addToCartBtn.dataset.currentPrice = finalPrice;
    }

    addToCart() {
        const productName = this.addToCartBtn.dataset.productName;
        const basePrice = parseFloat(this.addToCartBtn.dataset.productPrice);
        const image = this.addToCartBtn.dataset.productImage;
        const volume = document.querySelector('.option-buttons .option-btn.active').textContent;
        const quantity = parseInt(this.quantityInput.value);

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const existingItemIndex = cart.findIndex(item => 
            item.name === productName && 
            item.volume === volume
        );

        if (existingItemIndex !== -1) {
            const newQuantity = cart[existingItemIndex].quantity + quantity;
            if (newQuantity <= 10) {
                cart[existingItemIndex].quantity = newQuantity;
            }
        } else {
            cart.push({
                name: productName,
                price: basePrice,
                image: image,
                volume: volume,
                quantity: quantity
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartCount();
        this.showNotification('Produit ajouté au panier', 'success');
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        const cartCounts = document.querySelectorAll('.cart-count');
        cartCounts.forEach(count => {
            count.textContent = totalItems;
            count.style.display = totalItems > 0 ? 'flex' : 'none';
        });
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `product-notification ${type}`;
        
        const icon = document.createElement('i');
        icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        
        const text = document.createElement('span');
        text.textContent = message;
        
        notification.appendChild(icon);
        notification.appendChild(text);
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    loadProductData() {
        this.updateCartCount();
        this.updatePrice();
    }

    initializeProduct() {
        const productContainer = document.querySelector('.product-container');
        if (!productContainer) return;

        this.product = {
            id: productContainer.dataset.productId || this.generateProductId(),
            name: document.querySelector('.product-title')?.textContent,
            price: this.extractPrice(),
            image: document.querySelector('.product-image img')?.src
        };
    }

    generateProductId() {
        // Générer un ID basé sur le nom du fichier HTML
        const path = window.location.pathname;
        const filename = path.substring(path.lastIndexOf('/') + 1);
        return filename.replace('.html', '');
    }

    extractPrice() {
        const priceElement = document.querySelector('.product-price');
        if (!priceElement) return 0;
        
        // Extraire le prix du texte (ex: "250,00 €" -> 250.00)
        const priceText = priceElement.textContent;
        return parseFloat(priceText.replace('€', '').replace(',', '.').trim());
    }

    attachEventListeners() {
        // Gérer le clic sur le bouton "Ajouter au panier"
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addToCart();
            });
        }

        // Gérer la sélection de la taille si elle existe
        const sizeSelector = document.querySelector('.size-selector');
        if (sizeSelector) {
            sizeSelector.addEventListener('change', (e) => {
                this.product.selectedSize = e.target.value;
            });
        }

        // Gérer la sélection de la quantité si elle existe
        const quantitySelector = document.querySelector('.quantity-selector');
        if (quantitySelector) {
            quantitySelector.addEventListener('change', (e) => {
                this.product.selectedQuantity = parseInt(e.target.value);
            });
        }
    }

    addToCart() {
        if (!this.validateProduct()) {
            this.showNotification('Erreur: Produit invalide', 'error');
            return;
        }

        // Ajouter au panier
        const success = this.cart.addItem(this.product);
        
        if (success) {
            this.showNotification('Produit ajouté au panier', 'success');
            
            // Animation du bouton
            const button = document.querySelector('.add-to-cart-btn');
            if (button) {
                button.classList.add('added');
                setTimeout(() => button.classList.remove('added'), 1500);
            }

            // Animation de l'icône du panier
            const cartIcon = document.querySelector('.cart-icon');
            if (cartIcon) {
                cartIcon.classList.add('bounce');
                setTimeout(() => cartIcon.classList.remove('bounce'), 1000);
            }
        } else {
            this.showNotification('Erreur lors de l\'ajout au panier', 'error');
        }
    }

    validateProduct() {
        return (
            this.product &&
            this.product.id &&
            this.product.name &&
            typeof this.product.price === 'number' &&
            this.product.price > 0 &&
            this.product.image
        );
    }

    showNotification(message, type = 'success') {
        // Créer la notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Ajouter au DOM
        document.body.appendChild(notification);

        // Animation d'entrée
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Supprimer après délai
        setTimeout(() => {
            notification.classList.remove('show');
            notification.addEventListener('transitionend', () => {
                notification.remove();
            });
        }, 3000);
    }
}

// Initialiser la page produit
document.addEventListener('DOMContentLoaded', () => {
    new ProductPage();
});

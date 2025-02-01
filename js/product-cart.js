document.addEventListener('DOMContentLoaded', () => {
    const addToCartButton = document.querySelector('.add-to-cart');
    
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Récupérer les informations du produit
            const productContainer = document.querySelector('.product-container');
            const productName = document.querySelector('.product-title').textContent;
            const productPrice = parseFloat(document.querySelector('.product-price').textContent);
            const productImage = document.querySelector('.gallery-main img').src;
            const productVolume = document.querySelector('.volume-option.active')?.textContent || '100ml';

            // Créer l'objet produit
            const product = {
                name: productName,
                price: productPrice,
                image: productImage,
                volume: productVolume,
                quantity: 1
            };

            // Ajouter au panier
            addToCart(product);

            // Afficher la notification
            showNotification('Produit ajouté au panier');

            // Mettre à jour le compteur du panier
            updateCartCount();
        });
    }

    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Vérifier si le produit existe déjà
        const existingProductIndex = cart.findIndex(item => 
            item.name === product.name && item.volume === product.volume
        );

        if (existingProductIndex > -1) {
            // Incrémenter la quantité si le produit existe déjà
            if (cart[existingProductIndex].quantity < 10) {
                cart[existingProductIndex].quantity++;
            }
        } else {
            // Ajouter le nouveau produit
            cart.push(product);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        const cartCounter = document.querySelector('.cart-count');
        if (cartCounter) {
            cartCounter.textContent = totalItems;
            cartCounter.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    // Initialiser le compteur du panier au chargement
    updateCartCount();
}); 
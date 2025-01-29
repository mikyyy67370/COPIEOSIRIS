// Gestion des onglets
document.addEventListener('DOMContentLoaded', function() {
    // Gestion des onglets
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Retirer la classe active de tous les boutons et panneaux
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Ajouter la classe active au bouton cliqué
            button.classList.add('active');

            // Activer le panneau correspondant
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Gestion de la galerie d'images
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnails img');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    let currentIndex = 0;

    // Changer l'image principale au clic sur une miniature
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            mainImage.src = thumb.src;
            updateActiveThumbnail(index);
            currentIndex = index;
        });
    });

    // Navigation avec les boutons
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
        updateMainImage();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % thumbnails.length;
        updateMainImage();
    });

    function updateMainImage() {
        mainImage.src = thumbnails[currentIndex].src;
        updateActiveThumbnail(currentIndex);
    }

    function updateActiveThumbnail(index) {
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnails[index].classList.add('active');
    }

    // Gestion de la quantité
    const quantityInput = document.querySelector('.quantity-input');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');

    minusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
            updatePrice();
        }
    });

    plusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
        updatePrice();
    });

    quantityInput.addEventListener('change', () => {
        if (quantityInput.value < 1) {
            quantityInput.value = 1;
        }
        updatePrice();
    });

    // Gestion du prix
    const basePrice = 198;
    const priceElement = document.querySelector('.price');

    function updatePrice() {
        const quantity = parseInt(quantityInput.value);
        const totalPrice = basePrice * quantity;
        priceElement.textContent = totalPrice;
    }

    // Gestion de la wishlist
    const wishlistBtn = document.querySelector('.wishlist-btn');
    wishlistBtn.addEventListener('click', () => {
        const icon = wishlistBtn.querySelector('i');
        icon.classList.toggle('far');
        icon.classList.toggle('fas');
        icon.classList.toggle('active');
    });

    // Animation au défilement
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.note-section, .product-features .feature, .review-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('animate');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Première exécution

    const hamburger = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // Change l'icône
        const icon = this.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            body.style.overflow = 'hidden'; // Empêche le défilement
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            body.style.overflow = ''; // Réactive le défilement
        }
    });

    // Ferme le menu si on clique sur un lien
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            body.style.overflow = '';
        });
    });

    // Gestion des boutons quantité dans les pages produits
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');
    const quantityInput = document.getElementById('quantity');

    if (minusBtn && plusBtn && quantityInput) {
        minusBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });

        plusBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue < 10) {
                quantityInput.value = currentValue + 1;
            }
        });
    }

    // Initialiser le compteur du panier
    updateCartCount();

    // Ajouter la transition de page
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', goToCart);
    }
});

// Gestion de la transition de page
document.addEventListener('DOMContentLoaded', () => {
    // Création de l'élément de transition
    const transitionElement = document.createElement('div');
    transitionElement.className = 'page-transition';
    document.body.appendChild(transitionElement);

    // Gestion des liens avec transition
    document.querySelectorAll('[data-transition]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.href;

            // Activation de la transition
            transitionElement.classList.add('active');

            // Redirection après la transition
            setTimeout(() => {
                window.location.href = target;
            }, 800);
        });
    });
});

// Gestion de l'arrivée sur la nouvelle page
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // Si la page vient du cache (retour arrière)
        document.querySelector('.page-transition').classList.remove('active');
    }
});

// Fonction de redirection vers le panier
function goToCart(event) {
    event.preventDefault();
    
    const transitionElement = document.createElement('div');
    transitionElement.className = 'page-transition';
    document.body.appendChild(transitionElement);

    requestAnimationFrame(() => {
        transitionElement.classList.add('active');
        
        setTimeout(() => {
            window.location.href = 'panier.html';
        }, 800);
    });
}

// Fonction d'ajout au panier
function addToCart(productName, price, imageUrl) {
    // Récupérer la quantité
    const quantityInput = document.getElementById('quantity');
    if (!quantityInput) {
        console.error('Élément quantity non trouvé');
        return;
    }
    
    const quantity = parseInt(quantityInput.value) || 1;
    
    // Récupérer le panier existant ou créer un nouveau
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Vérifier si le produit existe déjà
    const existingProduct = cart.find(item => item.name === productName);
    
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: quantity,
            image: imageUrl
        });
    }
    
    // Sauvegarder le panier
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Mettre à jour le compteur
    updateCartCount();
    
    // Afficher la notification
    showAddToCartConfirmation();

    // Rediriger vers la page panier après un court délai
    setTimeout(() => {
        window.location.href = 'panier.html';
    }, 1000); // Délai de 1 seconde pour voir la notification
}

// Fonction pour afficher le panier
function displayCart() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Votre panier est vide</p>';
        return;
    }

    cart.forEach(item => {
        total += item.price * item.quantity;
        cartItems.innerHTML += `
            <div class="cart-item">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-subtitle">Eau de Parfum 100ml</p>
                    <div class="quantity-selector">
                        <button class="quantity-btn minus" onclick="updateCartQuantity('${item.name}', -1)">-</button>
                        <input type="number" value="${item.quantity}" min="1" max="10" readonly>
                        <button class="quantity-btn plus" onclick="updateCartQuantity('${item.name}', 1)">+</button>
                    </div>
                </div>
                <div class="item-price">
                    <p>${(item.price * item.quantity).toFixed(2)} €</p>
                    <button class="remove-item" onclick="removeFromCart('${item.name}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
    });

    // Mettre à jour le total
    const subtotal = document.getElementById('subtotal');
    if (subtotal) {
        subtotal.innerHTML = `
            <span>Sous-total</span>
            <span>${total.toFixed(2)} €</span>
        `;
    }
}

// Fonction pour mettre à jour la quantité dans le panier
function updateCartQuantity(productName, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cart.find(item => item.name === productName);
    
    if (product) {
        product.quantity = Math.max(1, Math.min(10, product.quantity + change));
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartCount();
    }
}

// Fonction pour supprimer un produit du panier
function removeFromCart(productName) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.name !== productName);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

// Mettre à jour le compteur du panier
function updateCartCount() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        const cartCounts = document.querySelectorAll('.cart-count');
        if (cartCounts.length === 0) {
            console.warn('Aucun élément .cart-count trouvé');
        }
        
        cartCounts.forEach(count => {
            count.textContent = totalItems;
        });
        
        console.log('Compteur mis à jour:', totalItems); // Pour le débogage
    } catch (error) {
        console.error('Erreur lors de la mise à jour du compteur:', error);
    }
}

// Afficher la notification
function showAddToCartConfirmation() {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check"></i>
        Produit ajouté au panier
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialiser la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page chargée, initialisation...'); // Debug
    
    // Mettre à jour le compteur initial
    updateCartCount();
    
    // Si nous sommes sur la page panier, afficher le contenu
    if (window.location.pathname.includes('panier.html')) {
        displayCart();
    }
    
    // Gérer les boutons de quantité
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');
    const quantityInput = document.getElementById('quantity');
    
    if (minusBtn && plusBtn && quantityInput) {
        console.log('Boutons de quantité trouvés'); // Debug
        
        minusBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
        
        plusBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue < 10) {
                quantityInput.value = currentValue + 1;
            }
        });
    } else {
        console.warn('Éléments de quantité non trouvés');
    }
}); 
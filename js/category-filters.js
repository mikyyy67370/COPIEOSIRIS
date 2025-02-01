// Base de données des produits (réutiliser celle de search.js)
const products = [
    // ... les mêmes produits que dans search.js ...
];

// Configuration
const ITEMS_PER_PAGE = 6;

// Ajouter après la configuration existante
const VIEW_MODES = {
    GRID: 'grid',
    LIST: 'list'
};

let currentViewMode = VIEW_MODES.GRID;

// Fonction de filtrage des produits
function filterProducts(category, filters = []) {
    return products.filter(product => {
        // Filtre par catégorie principale (Masculin/Féminin)
        if (!product.category.includes(category)) return false;
        
        // Si aucun filtre actif, retourner tous les produits de la catégorie
        if (filters.length === 0) return true;
        
        // Vérifier si le produit correspond à au moins un des filtres actifs
        return filters.some(filter => 
            product.tags.includes(filter.toLowerCase()) ||
            product.description.toLowerCase().includes(filter.toLowerCase())
        );
    });
}

// Fonction d'affichage des produits filtrés
function displayFilteredProducts(products, sortBy = 'default') {
    const productsContainer = document.querySelector('.products-grid');
    const resultsCount = document.querySelector('.results-count');
    if (!productsContainer) return;

    // Mettre à jour le compteur
    if (resultsCount) {
        resultsCount.textContent = `${products.length} parfum${products.length > 1 ? 's' : ''} trouvé${products.length > 1 ? 's' : ''}`;
    }

    // Trier les produits
    const sortedProducts = sortProducts(products, sortBy);

    if (products.length === 0) {
        productsContainer.innerHTML = `
            <div class="no-results">
                <p>Aucun produit ne correspond à vos critères.</p>
                <button class="reset-filters-btn">Réinitialiser les filtres</button>
            </div>
        `;
        return;
    }

    // Ajouter les contrôles de vue et tri
    const controlsHTML = `
        <div class="products-controls">
            <div class="view-controls">
                <button class="view-btn ${currentViewMode === VIEW_MODES.GRID ? 'active' : ''}" data-view="grid">
                    <i class="fas fa-th-large"></i>
                </button>
                <button class="view-btn ${currentViewMode === VIEW_MODES.LIST ? 'active' : ''}" data-view="list">
                    <i class="fas fa-list"></i>
                </button>
            </div>
            <div class="sort-controls">
                <select class="sort-select">
                    <option value="default">Trier par</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="name-asc">Nom A-Z</option>
                    <option value="name-desc">Nom Z-A</option>
                </select>
            </div>
        </div>
        <p class="results-count">${products.length} parfum${products.length > 1 ? 's' : ''} trouvé${products.length > 1 ? 's' : ''}</p>
    `;

    // Générer le HTML des produits
    const productsHTML = sortedProducts.map(product => `
        <div class="product-card ${currentViewMode === VIEW_MODES.LIST ? 'list-view' : ''}" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">${product.price}€</p>
                <a href="${product.id.toLowerCase()}.html" class="view-product-btn">
                    Découvrir
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `).join('');

    productsContainer.innerHTML = controlsHTML + productsHTML;

    // Initialiser les événements des contrôles
    initializeControls(products);
}

// Fonction de tri des produits
function sortProducts(products, sortBy) {
    const sortedProducts = [...products];
    switch (sortBy) {
        case 'price-asc':
            return sortedProducts.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return sortedProducts.sort((a, b) => b.price - a.price);
        case 'name-asc':
            return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        default:
            return sortedProducts;
    }
}

// Initialisation des contrôles
function initializeControls(products) {
    // Gestion du changement de vue
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const newView = btn.dataset.view;
            if (newView === currentViewMode) return;

            currentViewMode = newView;
            const productCards = document.querySelectorAll('.product-card');
            
            viewButtons.forEach(b => b.classList.toggle('active'));
            productCards.forEach(card => {
                card.classList.toggle('list-view', newView === VIEW_MODES.LIST);
            });
        });
    });

    // Gestion du tri
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            displayFilteredProducts(products, e.target.value);
        });
    }
}

// Initialisation des filtres
function initializeCategoryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const category = document.body.dataset.category; // 'Masculin' ou 'Féminin'
    let activeFilters = [];

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            if (filter === 'all') {
                // Réinitialiser tous les filtres
                activeFilters = [];
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            } else {
                // Retirer le filtre "Tous"
                document.querySelector('[data-filter="all"]')?.classList.remove('active');
                
                // Toggle du filtre actuel
                btn.classList.toggle('active');
                
                if (btn.classList.contains('active')) {
                    activeFilters.push(filter);
                } else {
                    activeFilters = activeFilters.filter(f => f !== filter);
                }
                
                // Si aucun filtre actif, réactiver "Tous"
                if (activeFilters.length === 0) {
                    document.querySelector('[data-filter="all"]')?.classList.add('active');
                }
            }

            // Filtrer et afficher les produits
            const filteredProducts = filterProducts(category, activeFilters);
            displayFilteredProducts(filteredProducts);
        });
    });

    // Initialiser avec tous les produits de la catégorie
    const initialProducts = filterProducts(category);
    displayFilteredProducts(initialProducts);
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.products-grid')) {
        initializeCategoryFilters();
    }
}); 
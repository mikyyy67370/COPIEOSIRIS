// Base de données des produits
const products = [
    {
        id: 'ANUBIS',
        name: 'ANUBIS',
        description: 'Un parfum mystérieux aux notes boisées et épicées',
        price: 180,
        category: 'Masculin',
        image: 'images/collection4.jpg',
        tags: ['boisé', 'épicé', 'mystérieux', 'masculin']
    },
    {
        id: 'ISIS',
        name: 'ISIS',
        description: 'Une fragrance florale et ambrée évoquant la déesse égyptienne',
        price: 180,
        category: 'Féminin',
        image: 'images/collection3.jpg',
        tags: ['floral', 'ambré', 'féminin']
    },
    {
        id: 'HATHOR',
        name: 'HATHOR',
        description: 'Un parfum sensuel aux notes de vanille et de fleurs exotiques',
        price: 180,
        category: 'Féminin',
        image: 'images/collection1.jpg',
        tags: ['vanille', 'floral', 'exotique', 'féminin']
    },
    {
        id: 'OSIRISROYAL',
        name: 'OSIRIS ROYAL',
        description: 'Une fragrance noble mêlant encens et bois précieux',
        price: 250,
        category: 'Masculin',
        image: 'images/parfum1.jpg',
        tags: ['encens', 'boisé', 'royal', 'masculin']
    },
    {
        id: 'NEFERTITI',
        name: 'NEFERTITI',
        description: 'Un parfum raffiné aux notes d\'iris et de fleur de lotus',
        price: 180,
        category: 'Féminin',
        image: 'images/parfum2.jpg',
        tags: ['iris', 'lotus', 'raffiné', 'féminin']
    },
    {
        id: 'THOT',
        name: 'THOT',
        description: 'Une fragrance intellectuelle aux notes de papyrus et d\'encre',
        price: 180,
        category: 'Masculin',
        image: 'images/collection2.jpg',
        tags: ['papyrus', 'encre', 'intellectuel', 'masculin']
    },
    {
        id: 'SEKHMET',
        name: 'SEKHMET',
        description: 'Un parfum puissant aux notes épicées et sauvages',
        price: 180,
        category: 'Féminin',
        image: 'images/collection5.jpg',
        tags: ['épicé', 'sauvage', 'puissant', 'féminin']
    },
    {
        id: 'BASTET',
        name: 'BASTET',
        description: 'Une fragrance féline aux notes de musc et de fleurs blanches',
        price: 180,
        category: 'Féminin',
        image: 'images/collection6.jpg',
        tags: ['musc', 'floral', 'félin', 'féminin']
    }
];

// Configuration de la pagination
const ITEMS_PER_PAGE = 6;
const ITEMS_PER_PAGE_OPTIONS = [6, 12, 24];
let currentItemsPerPage = ITEMS_PER_PAGE;

// Fonction de recherche
function searchProducts(query) {
    query = query.toLowerCase().trim();
    return products.filter(product => {
        const searchableText = `
            ${product.name} 
            ${product.description} 
            ${product.category} 
            ${product.tags.join(' ')}
        `.toLowerCase();
        
        return searchableText.includes(query);
    });
}

// Fonction de recherche en temps réel
function searchProductsRealTime(query) {
    query = query.toLowerCase().trim();
    
    // Recherche dans les produits et les sections
    const results = {
        products: [],
        sections: [
            { id: 'notrehistoire', name: 'Notre Histoire', url: 'notrehistoire.html', type: 'section' },
            { id: 'collections', name: 'Collections Signatures', url: 'collections-signatures.html', type: 'section' },
            { id: 'feminins', name: 'Les Féminins', url: 'lesfeminins.html', type: 'section' },
            { id: 'masculins', name: 'Les Masculins', url: 'lesmasculins.html', type: 'section' },
            { id: 'guide', name: 'Guide des Parfums', url: 'choisirsonparfum.html', type: 'section' }
        ]
    };

    // Recherche dans les produits
    results.products = products.filter(product => {
        const searchableText = `
            ${product.name} 
            ${product.description} 
            ${product.category} 
            ${product.tags.join(' ')}
        `.toLowerCase();
        return searchableText.includes(query);
    });

    // Recherche dans les sections
    results.sections = results.sections.filter(section => 
        section.name.toLowerCase().includes(query)
    );

    return results;
}

// Fonction de tri des résultats
function sortResults(results, sortBy = 'default') {
    switch (sortBy) {
        case 'price-asc':
            return [...results].sort((a, b) => a.price - b.price);
        case 'price-desc':
            return [...results].sort((a, b) => b.price - a.price);
        case 'name-asc':
            return [...results].sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return [...results].sort((a, b) => b.name.localeCompare(a.name));
        default:
            return results;
    }
}

// Fonction de pagination
function paginateResults(results, page = 1) {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return results.slice(startIndex, startIndex + ITEMS_PER_PAGE);
}

// Mise à jour de la fonction displaySearchResults
function displaySearchResults(results, page = 1, sortBy = 'default') {
    const resultsContainer = document.querySelector('.search-results');
    const searchQuery = new URLSearchParams(window.location.search).get('q');
    const searchCount = document.querySelector('.search-count');
    
    if (!resultsContainer) return;
    
    // Tri des résultats
    const sortedResults = sortResults(results, sortBy);
    
    // Pagination des résultats
    const paginatedResults = paginateResults(sortedResults, page);
    
    // Mise à jour du nombre de résultats
    searchCount.textContent = `${results.length} résultat${results.length > 1 ? 's' : ''} pour "${searchQuery}"`;
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <p>Aucun résultat trouvé pour "${searchQuery}"</p>
                <p>Suggestions :</p>
                <ul>
                    <li>Vérifiez l'orthographe des mots-clés</li>
                    <li>Essayez des mots-clés plus généraux</li>
                    <li>Explorez nos collections par catégorie</li>
                </ul>
            </div>
        `;
        return;
    }
    
    // Ajouter les options de tri et le sélecteur de nombre de résultats
    const controlsHTML = `
        <div class="results-controls">
            <div class="items-per-page">
                <label for="items-per-page">Afficher par page :</label>
                <select id="items-per-page" class="items-per-page-select">
                    ${ITEMS_PER_PAGE_OPTIONS.map(num => `
                        <option value="${num}" ${num === currentItemsPerPage ? 'selected' : ''}>
                            ${num}
                        </option>
                    `).join('')}
                </select>
            </div>
            <div class="sorting-options">
                <select class="sort-select" aria-label="Trier les résultats">
                    <option value="default">Trier par</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="name-asc">Nom A-Z</option>
                    <option value="name-desc">Nom Z-A</option>
                </select>
            </div>
        </div>
    `;
    
    // Affichage des résultats
    resultsContainer.innerHTML = `
        ${controlsHTML}
        <div class="results-grid">
            ${paginatedResults.map(product => `
                <div class="search-result-item" data-product-id="${product.id}">
                    <div class="result-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="result-info">
                <h3>${product.name}</h3>
                        <p class="result-category">${product.category}</p>
                        <p class="result-description">${product.description}</p>
                        <p class="result-price">${product.price}€</p>
                        <a href="${product.id.toLowerCase()}.html" class="view-product-btn">
                            Découvrir
                            <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Modifier la pagination pour inclure les flèches
    if (results.length > currentItemsPerPage) {
        const totalPages = Math.ceil(results.length / currentItemsPerPage);
        const paginationHTML = `
            <div class="pagination">
                <button class="page-btn nav-btn prev ${page === 1 ? 'disabled' : ''}" 
                        ${page === 1 ? 'disabled' : ''} data-page="${page - 1}">
                    <i class="fas fa-chevron-left"></i>
                </button>
                
                ${generatePaginationButtons(page, totalPages)}
                
                <button class="page-btn nav-btn next ${page === totalPages ? 'disabled' : ''}" 
                        ${page === totalPages ? 'disabled' : ''} data-page="${page + 1}">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;
        resultsContainer.insertAdjacentHTML('beforeend', paginationHTML);
    }
    
    // Ajouter l'indicateur de chargement (initialement caché)
    resultsContainer.insertAdjacentHTML('beforeend', `
        <div class="loading-indicator" style="display: none;">
            <div class="spinner"></div>
            <span>Chargement...</span>
        </div>
    `);
    
    // Gestion des événements de tri et pagination
    initializeSortingAndPagination(results);
}

// Fonction helper pour générer les boutons de pagination
function generatePaginationButtons(currentPage, totalPages) {
    const buttons = [];
    const maxVisibleButtons = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
    
    if (endPage - startPage + 1 < maxVisibleButtons) {
        startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }
    
    if (startPage > 1) {
        buttons.push(`<button class="page-btn" data-page="1">1</button>`);
        if (startPage > 2) buttons.push('<span class="pagination-ellipsis">...</span>');
    }
    
    for (let i = startPage; i <= endPage; i++) {
        buttons.push(`
            <button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">
                ${i}
            </button>
        `);
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) buttons.push('<span class="pagination-ellipsis">...</span>');
        buttons.push(`<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`);
    }
    
    return buttons.join('');
}

// Initialisation des événements de tri et pagination
function initializeSortingAndPagination(results) {
    const sortSelect = document.querySelector('.sort-select');
    const pageButtons = document.querySelectorAll('.page-btn');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            const currentPage = parseInt(document.querySelector('.page-btn.active')?.dataset.page || 1);
            displaySearchResults(results, currentPage, e.target.value);
        });
    }
    
    pageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = parseInt(btn.dataset.page);
            const sortBy = document.querySelector('.sort-select')?.value || 'default';
            displaySearchResults(results, page, sortBy);
        });
    });

    // Ajouter la gestion du nombre d'éléments par page
    const itemsPerPageSelect = document.querySelector('.items-per-page-select');
    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', (e) => {
            currentItemsPerPage = parseInt(e.target.value);
            showLoadingIndicator();
            setTimeout(() => {
                displaySearchResults(results, 1, document.querySelector('.sort-select')?.value || 'default');
                hideLoadingIndicator();
            }, 300);
        });
    }
}

// Gestion des filtres de catégorie
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    let currentResults = [];
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Mise à jour visuelle des boutons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Récupération de la catégorie sélectionnée
            const selectedCategory = btn.dataset.category;
            
            // Récupération de la recherche actuelle
            const urlParams = new URLSearchParams(window.location.search);
            const query = urlParams.get('q');
            
            if (query) {
                // Filtrer les résultats
                let results = searchProducts(query);
                
                if (selectedCategory && selectedCategory !== 'all') {
                    results = results.filter(product => product.category === selectedCategory);
                }
                
                // Sauvegarder les résultats actuels
                currentResults = results;
                
                // Afficher les résultats filtrés
                displaySearchResults(results);
            }
        });
    });
}

// Modifier la fonction loadSearchResults pour initialiser les filtres
function loadSearchResults() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    if (query) {
        const results = searchProducts(query);
        displaySearchResults(results);
        
        // Initialiser les filtres après l'affichage des résultats
        initializeFilters();
    }
}

// Ajouter la gestion de la recherche dans la barre de navigation
document.addEventListener('DOMContentLoaded', () => {
    // Gestion du formulaire de recherche principal
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchForm.querySelector('input[type="search"]').value;
            window.location.href = `recherche.html?q=${encodeURIComponent(query)}`;
        });
    }
    
    // Gestion de la barre de recherche dans la navigation
    const navSearchBar = document.querySelector('.search-bar');
    if (navSearchBar) {
        const searchInput = navSearchBar.querySelector('input');
        const searchButton = navSearchBar.querySelector('.search-icon');
        
        const performSearch = () => {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `recherche.html?q=${encodeURIComponent(query)}`;
            }
        };
        
        searchButton.addEventListener('click', performSearch);
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Initialiser la recherche si on est sur la page de recherche
    if (document.querySelector('.search-results-container')) {
        loadSearchResults();
    }

    // Gestion de la recherche mobile dans le menu hamburger
    const mobileSearchInput = document.querySelector('.mobile-search input');
    const mobileSearchButton = document.querySelector('.mobile-search .search-icon');
    const mobileSearchResults = document.createElement('div');
    mobileSearchResults.className = 'mobile-search-results';

    if (mobileSearchInput && mobileSearchButton) {
        // Ajouter le conteneur de résultats après l'input
        mobileSearchInput.parentNode.appendChild(mobileSearchResults);

        // Recherche en temps réel
        mobileSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            if (query.length >= 1) { // Réduit à 1 caractère pour une recherche plus réactive
                const results = searchProductsRealTime(query);
                displayMobileSearchResults(results, mobileSearchResults);
            } else {
                mobileSearchResults.innerHTML = '';
                mobileSearchResults.style.display = 'none';
            }
        });

        // Fonction pour afficher les résultats
        function displayMobileSearchResults(results, container) {
            if (results.products.length === 0 && results.sections.length === 0) {
                container.style.display = 'none';
                return;
            }

            container.innerHTML = `
                <div class="mobile-results-list">
                    ${results.sections.length > 0 ? `
                        <div class="mobile-results-category">
                            <h3>Sections</h3>
                            ${results.sections.map(section => `
                                <a href="${section.url}" class="mobile-result-item section-result">
                                    <div class="section-icon">
                                        <i class="fas fa-${getSectionIcon(section.id)}"></i>
                                    </div>
                                    <div class="mobile-result-info">
                                        <h4>${section.name}</h4>
                                    </div>
                                </a>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    ${results.products.length > 0 ? `
                        <div class="mobile-results-category">
                            <h3>Parfums</h3>
                            ${results.products.map(product => `
                                <a href="${product.id.toLowerCase()}.html" class="mobile-result-item">
                                    <img src="${product.image}" alt="${product.name}">
                                    <div class="mobile-result-info">
                                        <h4>${product.name}</h4>
                                        <p>${product.price}€</p>
                                        <span class="product-category">${product.category}</span>
                                    </div>
                                </a>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
            container.style.display = 'block';
        }

        // Gérer la fermeture des résultats
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.mobile-search')) {
                mobileSearchResults.style.display = 'none';
            }
        });

        // Fonction de recherche mobile modifiée
        const performMobileSearch = () => {
            const query = mobileSearchInput.value.trim();
            if (query) {
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                }
                window.location.href = `recherche.html?q=${encodeURIComponent(query)}`;
            }
        };

        // Gestionnaire d'événement pour le bouton de recherche
        mobileSearchButton.addEventListener('click', (e) => {
            e.preventDefault();
            performMobileSearch();
        });

        // Gestionnaire d'événement pour la touche Entrée
        mobileSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performMobileSearch();
            }
        });

        // Nettoyer l'input quand le menu est fermé
        document.querySelector('.close-menu')?.addEventListener('click', () => {
            mobileSearchInput.value = '';
        });

        // Focus automatique sur l'input quand le menu est ouvert
        document.querySelector('.hamburger-menu')?.addEventListener('click', () => {
            setTimeout(() => {
                mobileSearchInput.focus();
            }, 300);
        });
    }
});

// Fonctions pour l'indicateur de chargement
function showLoadingIndicator() {
    const indicator = document.querySelector('.loading-indicator');
    if (indicator) {
        indicator.style.display = 'flex';
    }
}

function hideLoadingIndicator() {
    const indicator = document.querySelector('.loading-indicator');
    if (indicator) {
        indicator.style.display = 'none';
    }
}

// Fonction utilitaire pour obtenir l'icône appropriée pour chaque section
function getSectionIcon(sectionId) {
    const icons = {
        notrehistoire: 'book',
        collections: 'crown',
        feminins: 'female',
        masculins: 'male',
        guide: 'compass',
        default: 'chevron-right'
    };
    return icons[sectionId] || icons.default;
}

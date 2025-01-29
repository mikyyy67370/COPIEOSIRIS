// Données des produits (à remplacer par une vraie base de données)
const products = [
    {
        id: 1,
        name: "DIVINE OSIRIS",
        category: "Collections Signatures",
        description: "Une fragrance mystérieuse aux accents d'Orient",
        price: 299,
        image: "images/signature1.jpg",
        tags: ["oriental", "mystérieux", "signature", "luxe"],
        notes: {
            top: ["Bergamote", "Cardamome", "Safran"],
            heart: ["Rose", "Oud", "Encens"],
            base: ["Ambre", "Musc", "Bois de Santal"]
        }
    },
    {
        id: 2,
        name: "ROYALE OSIRIS",
        category: "Collections Signatures",
        description: "L'essence même du luxe et du raffinement",
        price: 329,
        image: "images/signature2.jpg",
        tags: ["royal", "raffiné", "signature", "prestige"],
        notes: {
            top: ["Rose de Damas", "Jasmin", "Néroli"],
            heart: ["Iris", "Ylang-ylang", "Violette"],
            base: ["Ambre", "Patchouli", "Vanille"]
        }
    },
    // Ajoutez d'autres produits ici
];

// Fonction de recherche
function searchProducts(query) {
    query = query.toLowerCase().trim();
    
    return products.filter(product => {
        // Recherche dans le nom
        if (product.name.toLowerCase().includes(query)) return true;
        
        // Recherche dans la description
        if (product.description.toLowerCase().includes(query)) return true;
        
        // Recherche dans les tags
        if (product.tags.some(tag => tag.toLowerCase().includes(query))) return true;
        
        // Recherche dans les notes
        const allNotes = [
            ...product.notes.top,
            ...product.notes.heart,
            ...product.notes.base
        ];
        if (allNotes.some(note => note.toLowerCase().includes(query))) return true;
        
        return false;
    });
}

// Fonction pour afficher les résultats
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h2>Aucun résultat trouvé</h2>
                <p>Essayez avec d'autres mots-clés ou parcourez nos collections.</p>
            </div>
        `;
        return;
    }
    
    const resultsHTML = results.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-description">${product.description}</p>
                <div class="product-notes">
                    <p><strong>Notes de tête:</strong> ${product.notes.top.join(', ')}</p>
                </div>
                <div class="product-price">${product.price}€</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Ajouter au panier
                </button>
            </div>
        </div>
    `).join('');
    
    resultsContainer.innerHTML = resultsHTML;
}

// Gestionnaire de l'événement de recherche
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('.search-bar');
    const searchInput = searchForm.querySelector('input');
    
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value;
        if (query.length < 2) return; // Minimum 2 caractères
        
        window.location.href = `recherche.html?q=${encodeURIComponent(query)}`;
    });
});

// Fonction pour charger les résultats sur la page de recherche
function loadSearchResults() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    if (query) {
        document.getElementById('search-query').textContent = query;
        const results = searchProducts(query);
        displaySearchResults(results);
    }
}

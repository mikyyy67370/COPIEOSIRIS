class ProductNavigation {
    constructor() {
        this.currentProduct = this.getCurrentProduct();
        this.productConfig = OSIRIS_PRODUCTS[this.currentProduct];
        this.init();
    }

    getCurrentProduct() {
        const productHeader = document.querySelector('.product-header h1');
        return productHeader ? productHeader.textContent.trim() : '';
    }

    init() {
        this.insertNavigation();
        this.insertRelatedProducts();
        this.updateMetadata();
        this.setupStockStatus();
    }

    insertNavigation() {
        const navigationHTML = `
            <div class="product-navigation">
                <div class="navigation-container">
                    ${this.createPreviousLink()}
                    ${this.createNextLink()}
                </div>
            </div>
        `;

        const mainElement = document.querySelector('main');
        mainElement.insertAdjacentHTML('beforeend', navigationHTML);
    }

    createPreviousLink() {
        const prevProduct = this.productConfig.previousProduct;
        if (!prevProduct) return '';

        return `
            <a href="${prevProduct.toLowerCase()}.html" class="nav-link prev-product">
                <i class="fas fa-chevron-left"></i>
                <div class="nav-text">
                    <span class="nav-label">Précédent</span>
                    <span class="nav-product">${prevProduct}</span>
                </div>
            </a>
        `;
    }

    createNextLink() {
        const nextProduct = this.productConfig.nextProduct;
        if (!nextProduct) return '';

        return `
            <a href="${nextProduct.toLowerCase()}.html" class="nav-link next-product">
                <div class="nav-text">
                    <span class="nav-label">Suivant</span>
                    <span class="nav-product">${nextProduct}</span>
                </div>
                <i class="fas fa-chevron-right"></i>
            </a>
        `;
    }

    insertRelatedProducts() {
        const relatedProducts = this.productConfig.relatedProducts;
        if (!relatedProducts || relatedProducts.length === 0) return;

        const relatedHTML = `
            <section class="related-products">
                <div class="related-header">
                    <h3>DÉCOUVREZ AUSSI</h3>
                    <div class="related-subtitle">Dans la même collection</div>
                </div>
                <div class="related-grid">
                    ${this.createRelatedProductsHTML(relatedProducts)}
                </div>
            </section>
        `;

        const mainElement = document.querySelector('main');
        mainElement.insertAdjacentHTML('beforeend', relatedHTML);
    }

    createRelatedProductsHTML(products) {
        return products.map(productName => {
            const product = OSIRIS_PRODUCTS[productName];
            return `
                <a href="${productName.toLowerCase()}.html" class="related-item">
                    <div class="related-image">
                        <img src="images/${productName.toLowerCase()}/main.jpg" 
                             alt="${product.name} - ${product.subtitle}"
                             loading="lazy">
                    </div>
                    <h4 class="related-name">${product.name}</h4>
                    <div class="related-category">${product.category}</div>
                </a>
            `;
        }).join('');
    }

    updateMetadata() {
        const { metadata } = this.productConfig;
        
        // Mise à jour du titre
        document.title = metadata.title;
        
        // Mise à jour des meta tags
        this.updateMetaTag('description', metadata.description);
        this.updateMetaTag('keywords', metadata.keywords);
    }

    updateMetaTag(name, content) {
        let metaTag = document.querySelector(`meta[name="${name}"]`);
        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.name = name;
            document.head.appendChild(metaTag);
        }
        metaTag.content = content;
    }

    setupStockStatus() {
        const { stockStatus } = this.productConfig;
        const volumeButtons = document.querySelectorAll('.option-btn');
        
        volumeButtons.forEach(button => {
            const volume = button.textContent.trim();
            if (!stockStatus[volume]) {
                button.classList.add('out-of-stock');
                button.disabled = true;
                button.setAttribute('aria-label', `${volume} - Rupture de stock`);
            }
        });
    }
}

// Initialiser la navigation
document.addEventListener('DOMContentLoaded', () => {
    new ProductNavigation();
});

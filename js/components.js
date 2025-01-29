// Système de composants réutilisables pour OSIRIS
class OSIRISComponents {
    constructor() {
        this.components = new Map();
        this.init();
    }

    init() {
        this.registerComponents();
        this.renderComponents();
    }

    registerComponents() {
        // En-tête
        this.registerComponent('header', () => `
            <div class="announcement-bar">
                <a href="collections-signatures.html" style="text-decoration: none; color: inherit;">
                    DÉCOUVREZ LA COLLECTION EXCLUSIVE "HÉRITAGE DES PHARAONS"
                </a>
            </div>

            <header>
                <div class="hamburger-menu">
                    <i class="fas fa-bars"></i>
                </div>
                
                <nav>
                    <div class="nav-left">
                        <div class="location-selector">
                            <span class="country">FRANCE</span>
                            <span class="divider">|</span>
                            <span class="language">FR</span>
                        </div>
                        <a href="contact.html" class="contact-link">
                            <i class="fas fa-envelope"></i>
                            NOUS CONTACTER
                        </a>
                    </div>
                    
                    <div class="logo">
                        <a href="index.html" style="text-decoration: none; color: inherit;">
                            <div class="logo-symbol">◈</div>
                            <h1>OSIRIS</h1>
                            <div class="logo-tagline">UNE GOUTTE D'HISTOIRE</div>
                            <div class="logo-location">STRASBOURG</div>
                        </a>
                    </div>

                    <div class="nav-right">
                        <div class="search-bar">
                            <input type="text" placeholder="Rechercher..." aria-label="Rechercher">
                            <button class="search-icon" aria-label="Lancer la recherche">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                        <a href="compte.html" class="icon" aria-label="Mon compte">
                            <i class="fas fa-user"></i>
                        </a>
                        <a href="panier.html" class="icon cart-icon" aria-label="Mon panier">
                            <i class="fas fa-shopping-bag"></i>
                            <span class="cart-count">0</span>
                        </a>
                    </div>
                </nav>

                <div class="main-menu">
                    <a href="lesmasculins.html" class="menu-item">
                        <span class="menu-text">LES MASCULINS</span>
                    </a>
                    <a href="lesfeminins.html" class="menu-item">
                        <span class="menu-text">LES FÉMININS</span>
                    </a>
                    <a href="collections-signatures.html" class="menu-item">
                        <span class="menu-text">COLLECTIONS SIGNATURES</span>
                    </a>
                    <a href="notrehistoire.html" class="menu-item">
                        <span class="menu-text">NOTRE HISTOIRE</span>
                    </a>
                    <a href="choisirsonparfum.html" class="menu-item">
                        <span class="menu-text">COMMENT CHOISIR SON PARFUM</span>
                    </a>
                </div>
            </header>
        `);

        // Pied de page
        this.registerComponent('footer', () => `
            <footer>
                <div class="footer-content">
                    <div class="footer-section">
                        <h3>SERVICE CLIENT</h3>
                        <ul>
                            <li><a href="contact.html">Nous contacter</a></li>
                            <li><a href="livraison.html">Livraison</a></li>
                            <li><a href="retours.html">Retours & Échanges</a></li>
                            <li><a href="faq.html">FAQ</a></li>
                        </ul>
                    </div>

                    <div class="footer-section">
                        <h3>À PROPOS</h3>
                        <ul>
                            <li><a href="notrehistoire.html">Notre Histoire</a></li>
                            <li><a href="engagements.html">Nos Engagements</a></li>
                            <li><a href="mentions-legales.html">Mentions Légales</a></li>
                            <li><a href="confidentialite.html">Politique de Confidentialité</a></li>
                        </ul>
                    </div>

                    <div class="footer-section newsletter">
                        <h3>RESTEZ INFORMÉ</h3>
                        <p>Inscrivez-vous à notre newsletter pour recevoir nos actualités et offres exclusives.</p>
                        <form class="newsletter-form">
                            <input type="email" placeholder="Votre adresse e-mail" aria-label="Votre adresse e-mail">
                            <button type="submit">S'INSCRIRE</button>
                        </form>
                    </div>
                </div>

                <div class="footer-bottom">
                    <div class="social-links">
                        <a href="#" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
                        <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="#" aria-label="Pinterest"><i class="fab fa-pinterest"></i></a>
                    </div>
                    <div class="copyright">
                        © ${new Date().getFullYear()} OSIRIS. Tous droits réservés.
                    </div>
                </div>
            </footer>
        `);

        // Notification
        this.registerComponent('notification', (message, type = 'success') => `
            <div class="osiris-notification ${type}" role="alert">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `);

        // Bouton d'ajout au panier
        this.registerComponent('addToCartButton', (product) => `
            <button class="add-to-cart" 
                    data-product-name="${this.escapeHTML(product.name)}"
                    data-product-price="${product.price}"
                    data-product-image="${this.escapeHTML(product.image)}"
                    aria-label="Ajouter ${this.escapeHTML(product.name)} au panier">
                <span>AJOUTER AU PANIER</span>
            </button>
        `);
    }

    registerComponent(name, renderer) {
        this.components.set(name, renderer);
    }

    getComponent(name, data = {}) {
        const renderer = this.components.get(name);
        return renderer ? renderer(data) : '';
    }

    renderComponents() {
        document.querySelectorAll('[data-component]').forEach(element => {
            const componentName = element.dataset.component;
            const componentData = element.dataset.componentData 
                ? JSON.parse(element.dataset.componentData) 
                : {};
            
            element.innerHTML = this.getComponent(componentName, componentData);
        });
    }

    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}

// Initialiser les composants
document.addEventListener('DOMContentLoaded', () => {
    window.osirisComponents = new OSIRISComponents();
});

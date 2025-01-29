// Système de sécurité et de validation pour OSIRIS
class SecuritySystem {
    constructor() {
        this.csrfToken = this.generateCSRFToken();
        this.setupSecurityHeaders();
    }

    // Génération d'un token CSRF
    generateCSRFToken() {
        const token = new Uint8Array(32);
        crypto.getRandomValues(token);
        return Array.from(token, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Validation des données produit
    validateProductData(productData) {
        const required = ['name', 'price', 'volume'];
        const missing = required.filter(field => !productData[field]);
        
        if (missing.length > 0) {
            throw new Error(`Données produit invalides: ${missing.join(', ')} manquant(s)`);
        }

        // Validation du prix
        if (typeof productData.price !== 'number' || productData.price <= 0) {
            throw new Error('Prix invalide');
        }

        // Assainissement des données
        return {
            name: this.sanitizeString(productData.name),
            price: parseFloat(productData.price).toFixed(2),
            volume: this.sanitizeString(productData.volume),
            quantity: Math.min(Math.max(1, parseInt(productData.quantity) || 1), 10)
        };
    }

    // Assainissement des chaînes de caractères
    sanitizeString(str) {
        if (typeof str !== 'string') return '';
        return str
            .trim()
            .replace(/[<>]/g, '') // Supprime les balises HTML
            .slice(0, 100); // Limite la longueur
    }

    // Protection contre les attaques XSS
    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Validation des prix
    validatePrice(price, basePrice) {
        const minPrice = basePrice * 0.5;
        const maxPrice = basePrice * 2;
        const numPrice = parseFloat(price);

        if (isNaN(numPrice) || numPrice < minPrice || numPrice > maxPrice) {
            throw new Error('Prix invalide détecté');
        }

        return numPrice;
    }

    // Vérification de l'intégrité des données du panier
    validateCartItem(item) {
        if (!item || typeof item !== 'object') return false;

        const requiredFields = ['name', 'price', 'volume', 'quantity'];
        const hasAllFields = requiredFields.every(field => item.hasOwnProperty(field));

        if (!hasAllFields) return false;

        try {
            const quantity = parseInt(item.quantity);
            if (isNaN(quantity) || quantity < 1 || quantity > 10) return false;

            const price = parseFloat(item.price);
            if (isNaN(price) || price <= 0) return false;

            return true;
        } catch {
            return false;
        }
    }

    // Protection contre la manipulation du localStorage
    setupStorageProtection() {
        const originalSetItem = localStorage.setItem;
        const originalGetItem = localStorage.getItem;
        const self = this;

        localStorage.setItem = function(key, value) {
            if (key === 'cart') {
                try {
                    const cart = JSON.parse(value);
                    if (!Array.isArray(cart)) throw new Error('Format de panier invalide');
                    
                    const validCart = cart.filter(item => self.validateCartItem(item));
                    originalSetItem.call(localStorage, key, JSON.stringify(validCart));
                } catch (e) {
                    console.error('Erreur de validation du panier:', e);
                    return;
                }
            } else {
                originalSetItem.call(localStorage, key, value);
            }
        };

        localStorage.getItem = function(key) {
            const value = originalGetItem.call(localStorage, key);
            if (key === 'cart') {
                try {
                    const cart = JSON.parse(value);
                    return JSON.stringify(cart.filter(item => self.validateCartItem(item)));
                } catch {
                    return '[]';
                }
            }
            return value;
        };
    }

    // Configuration des en-têtes de sécurité
    setupSecurityHeaders() {
        // Ces en-têtes seraient normalement définis côté serveur
        const securityHeaders = {
            'Content-Security-Policy': "default-src 'self'; style-src 'self' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com;",
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'Referrer-Policy': 'strict-origin-when-cross-origin'
        };

        // Pour démonstration uniquement - dans un environnement réel, ces en-têtes seraient définis côté serveur
        console.log('En-têtes de sécurité recommandés:', securityHeaders);
    }
}

// Initialiser le système de sécurité
const security = new SecuritySystem();
security.setupStorageProtection();

// Exporter pour utilisation dans d'autres modules
window.OSIRISSecurity = security;

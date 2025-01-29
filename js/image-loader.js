class ImageLoader {
    constructor() {
        this.init();
    }

    init() {
        // Observer pour le lazy loading
        this.setupLazyLoading();
        
        // Précharger les images critiques
        this.preloadCriticalImages();
        
        // Remplacer les images par WebP si supporté
        this.setupWebPSupport();
    }

    setupLazyLoading() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        }, options);

        // Observer toutes les images avec data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            observer.observe(img);
        });
    }

    preloadCriticalImages() {
        // Précharger les images critiques (hero, logo, etc.)
        const criticalImages = [
            '/images/hero.jpg',
            '/images/logo.png'
        ];

        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    setupWebPSupport() {
        // Vérifier le support WebP
        const canvas = document.createElement('canvas');
        if (canvas.getContext && canvas.getContext('2d')) {
            canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        }

        // Si WebP est supporté, remplacer les images jpg/png par leur version WebP
        document.querySelectorAll('img[src$=".jpg"], img[src$=".png"]').forEach(img => {
            const webpSrc = img.src.replace(/\.(jpg|png)$/, '.webp');
            img.srcset = `${webpSrc} 1x`;
            // Garder l'original comme fallback
            img.src = img.src;
        });
    }

    static loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
            img.src = url;
        });
    }
}

// Initialiser le chargeur d'images
const imageLoader = new ImageLoader();

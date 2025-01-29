// Système de performance et de cache pour OSIRIS
class PerformanceOptimizer {
    constructor() {
        this.imageCache = new Map();
        this.init();
    }

    init() {
        this.setupImageLazyLoading();
        this.setupImagePreloading();
        this.setupPerformanceMonitoring();
        this.optimizeAnimations();
    }

    // Configuration du lazy loading des images
    setupImageLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Chargement optimisé des images
    async loadImage(img) {
        const src = img.dataset.src || img.src;
        
        try {
            // Vérifier le cache
            if (this.imageCache.has(src)) {
                img.src = this.imageCache.get(src);
                return;
            }

            // Charger et optimiser l'image
            const response = await fetch(src);
            const blob = await response.blob();
            const objectURL = URL.createObjectURL(blob);
            
            // Mettre en cache
            this.imageCache.set(src, objectURL);
            
            // Appliquer l'image avec transition
            img.style.opacity = '0';
            img.src = objectURL;
            img.onload = () => {
                img.style.transition = 'opacity 0.3s ease';
                img.style.opacity = '1';
            };
        } catch (error) {
            console.error('Erreur de chargement d\'image:', error);
            // Charger une image de remplacement élégante
            img.src = 'images/placeholder.jpg';
        }
    }

    // Préchargement intelligent des images
    setupImagePreloading() {
        const productLinks = document.querySelectorAll('a[href*=".html"]');
        
        productLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                const href = link.getAttribute('href');
                const productName = href.replace('.html', '').toUpperCase();
                
                if (OSIRIS_PRODUCTS[productName]) {
                    const images = OSIRIS_PRODUCTS[productName].images || [];
                    images.forEach(image => {
                        const img = new Image();
                        img.src = image;
                    });
                }
            });
        });
    }

    // Optimisation des animations
    optimizeAnimations() {
        const animatedElements = document.querySelectorAll('.animated');
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(() => {
                        entry.target.classList.add('animate');
                    });
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => animationObserver.observe(el));
    }

    // Surveillance des performances
    setupPerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            const paintObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name === 'first-contentful-paint') {
                        console.log('FCP:', entry.startTime);
                        paintObserver.disconnect();
                    }
                }
            });

            paintObserver.observe({ entryTypes: ['paint'] });

            // Surveillance des performances de chargement des ressources
            const resourceObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.initiatorType === 'img' && entry.duration > 1000) {
                        console.warn('Image lente détectée:', entry.name);
                    }
                }
            });

            resourceObserver.observe({ entryTypes: ['resource'] });
        }
    }

    // Nettoyage du cache
    clearCache() {
        this.imageCache.forEach(url => URL.revokeObjectURL(url));
        this.imageCache.clear();
    }
}

// Initialiser l'optimiseur de performance
const performanceOptimizer = new PerformanceOptimizer();

// Nettoyage lors de la fermeture de la page
window.addEventListener('unload', () => {
    performanceOptimizer.clearCache();
});

// Gestion optimisée du chargement des vidéos
document.addEventListener('DOMContentLoaded', function() {
    const videos = document.querySelectorAll('.hero-video');
    
    videos.forEach(video => {
        // Chargement différé des vidéos
        if (window.innerWidth > 768) {
            video.addEventListener('loadeddata', function() {
                video.classList.add('loaded');
            });
            
            // Pause de la vidéo lorsqu'elle n'est pas visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        video.play();
                    } else {
                        video.pause();
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(video);
        }
    });
    
    // Gestion du lazy loading des images
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback pour les navigateurs qui ne supportent pas le lazy loading natif
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
});

// Optimisation des animations au scroll
const scrollElements = document.querySelectorAll('.collection-grid, .showcase-grid');
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            scrollElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    element.style.transform = 'translateZ(0)';
                }
            });
            ticking = false;
        });
        ticking = true;
    }
});

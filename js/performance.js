// Système de performance et de cache pour OSIRIS
class PerformanceOptimizer {
    constructor() {
        this.imageCache = new Map();
        // Attendre que le DOM soit complètement chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        try {
            this.setupImageLazyLoading();
            this.setupImagePreloading();
            this.setupPerformanceMonitoring();
            this.optimizeAnimations();
        } catch (error) {
            console.warn('Initialisation de l\'optimiseur de performance:', error);
        }
    }

    // Configuration du lazy loading des images
    setupImageLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if (images.length === 0) return;

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        this.loadImage(img).catch(console.error);
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        images.forEach(img => {
            if (img.dataset.src) {
                imageObserver.observe(img);
            }
        });
    }

    // Chargement optimisé des images
    async loadImage(img) {
        if (!img.dataset.src) return;
        
        const src = img.dataset.src;
        
        try {
            // Vérifier le cache
            if (this.imageCache.has(src)) {
                img.src = this.imageCache.get(src);
                return;
            }

            // Précharger l'image
            await new Promise((resolve, reject) => {
                const tempImage = new Image();
                tempImage.onload = resolve;
                tempImage.onerror = reject;
                tempImage.src = src;
            });

            // Appliquer l'image avec transition
            img.style.opacity = '0';
            img.src = src;
            img.removeAttribute('data-src');
            
            // Animation fluide
            requestAnimationFrame(() => {
                img.style.transition = 'opacity 0.3s ease';
                img.style.opacity = '1';
            });
            
            // Ajouter au cache
            this.imageCache.set(src, src);
        } catch (error) {
            console.warn('Erreur de chargement d\'image:', error);
        }
    }

    // Préchargement intelligent des images
    setupImagePreloading() {
        const productLinks = document.querySelectorAll('a[href*=".html"]');
        
        if (productLinks.length === 0) return;

        const preloadImage = (src) => {
            if (this.imageCache.has(src)) return;
            
            const img = new Image();
            img.onload = () => this.imageCache.set(src, src);
            img.src = src;
        };

        productLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                const nextImages = link.querySelectorAll('img[data-src]');
                nextImages.forEach(img => {
                    if (img.dataset.src) {
                        preloadImage(img.dataset.src);
                    }
                });
            });
        });
    }

    // Optimisation des animations
    optimizeAnimations() {
        const animatedElements = document.querySelectorAll('.animated');
        
        if (animatedElements.length === 0) return;

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(() => {
                        entry.target.classList.add('animate');
                    });
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(element => animationObserver.observe(element));

        // Optimisation du scroll
        this.setupSmoothScroll();
    }

    // Optimisation du défilement fluide
    setupSmoothScroll() {
        const sections = document.querySelectorAll('section');
        if (sections.length === 0) return;

        // Optimiser le scroll des sections
        sections.forEach(section => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                        }
                    });
                },
                { threshold: 0.1 }
            );
            observer.observe(section);
        });

        // Optimiser les transitions de page
        document.querySelectorAll('[data-transition="fade"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                
                requestAnimationFrame(() => {
                    document.body.classList.add('fade-out');
                    setTimeout(() => {
                        window.location.href = href;
                    }, 500);
                });
            });
        });
    }

    // Optimisation de la gestion des événements
    setupPerformanceMonitoring() {
        // Optimiser le redimensionnement
        const handleResize = () => {
            requestAnimationFrame(() => {
                document.documentElement.style.setProperty(
                    '--vh',
                    `${window.innerHeight * 0.01}px`
                );
            });
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call
    }
}

// Initialiser l'optimiseur de performance
const performanceOptimizer = new PerformanceOptimizer();

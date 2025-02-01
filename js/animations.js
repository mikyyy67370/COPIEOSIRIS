const AnimationManager = {
    init() {
        // Observer les éléments à animer
        this.setupIntersectionObserver();
        
        // Optimiser les animations avec requestAnimationFrame
        this.setupSmoothAnimations();
        this.initHeroAnimation();
    },

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Observer une seule fois
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observer tous les éléments avec la classe .animate-on-scroll
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    },

    setupSmoothAnimations() {
        // Optimiser les transitions CSS avec will-change
        document.querySelectorAll('.transition-element').forEach(el => {
            el.style.willChange = 'transform, opacity';
        });

        // Nettoyer will-change après l'animation
        document.addEventListener('transitionend', (e) => {
            if (e.target.classList.contains('transition-element')) {
                e.target.style.willChange = 'auto';
            }
        });
    },

    initHeroAnimation() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        // Sélectionner les éléments à animer
        const elements = {
            title: heroSection.querySelector('.hero-title'),
            subtitle: heroSection.querySelector('.hero-subtitle'),
            description: heroSection.querySelector('.hero-description'),
            cta: heroSection.querySelector('.cta-button')
        };

        // Ajouter les classes d'animation
        Object.values(elements).forEach(el => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            }
        });

        // Déclencher les animations avec un délai élégant
        requestAnimationFrame(() => {
            setTimeout(() => {
                if (elements.title) {
                    elements.title.style.opacity = '1';
                    elements.title.style.transform = 'translateY(0)';
                }
            }, 300);

            setTimeout(() => {
                if (elements.subtitle) {
                    elements.subtitle.style.opacity = '1';
                    elements.subtitle.style.transform = 'translateY(0)';
                }
            }, 600);

            setTimeout(() => {
                if (elements.description) {
                    elements.description.style.opacity = '1';
                    elements.description.style.transform = 'translateY(0)';
                }
            }, 900);

            setTimeout(() => {
                if (elements.cta) {
                    elements.cta.style.opacity = '1';
                    elements.cta.style.transform = 'translateY(0)';
                }
            }, 1200);
        });
    }
};

// Gestion du chargement fluide des images
const ImageLoader = {
    init() {
        // Précharger les images importantes
        this.preloadHeroImages();
        // Gérer le chargement progressif des images
        this.setupLazyLoading();
    },

    preloadHeroImages() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        // Créer un loader pour l'image de fond
        const loader = document.createElement('div');
        loader.className = 'hero-loader';
        heroSection.appendChild(loader);

        // Précharger l'image de fond du hero
        const bgImage = new Image();
        bgImage.onload = () => {
            heroSection.style.backgroundImage = `url(${bgImage.src})`;
            heroSection.classList.add('image-loaded');
            setTimeout(() => loader.remove(), 500);
        };
        bgImage.src = heroSection.dataset.background || 'images/hero-bg.jpg';

        // Précharger les autres images importantes
        const preloadImages = [
            'images/collection1.jpg',
            'images/collection2.jpg',
            'images/collection3.jpg'
        ];

        preloadImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    },

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
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
    },

    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        // Créer une version floue/basse résolution
        img.style.filter = 'blur(5px)';
        img.style.transform = 'scale(1.02)';

        const tempImage = new Image();
        tempImage.onload = () => {
            img.src = src;
            img.style.transition = 'filter 0.5s ease, transform 0.5s ease';
            
            requestAnimationFrame(() => {
                img.style.filter = 'blur(0)';
                img.style.transform = 'scale(1)';
            });
        };
        tempImage.src = src;
    }
};

// Animation du hero au scroll
const HeroScrollAnimation = {
    init() {
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        const heroOverlay = document.querySelector('.hero-overlay');
        
        if (!hero || !heroContent) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateAnimation = () => {
            const scrollY = window.scrollY;
            const heroHeight = hero.offsetHeight;
            const scrollPercent = Math.min(scrollY / heroHeight, 1);

            // Animation du contenu
            if (scrollY <= heroHeight) {
                // Effet de parallaxe et fade out
                const translateY = scrollY * 0.3;
                const opacity = 1 - (scrollPercent * 1.2);
                
                heroContent.style.transform = `translate3d(0, ${translateY}px, 0)`;
                heroContent.style.opacity = Math.max(opacity, 0);

                // Assombrissement progressif de l'overlay
                if (heroOverlay) {
                    const alpha = 0.4 + (scrollPercent * 0.3);
                    heroOverlay.style.backgroundColor = `rgba(0, 0, 0, ${alpha})`;
                }
            }

            ticking = false;
        };

        const onScroll = () => {
            lastScrollY = window.scrollY;
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateAnimation();
                    ticking = false;
                });
                ticking = true;
            }
        };

        // Écouter l'événement de scroll
        window.addEventListener('scroll', onScroll, { passive: true });

        // Animation initiale
        updateAnimation();
    }
};

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    AnimationManager.init();
    ImageLoader.init();
    HeroScrollAnimation.init();
}); 
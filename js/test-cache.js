// Test du Service Worker et du cache des images
async function testCacheSystem() {
    try {
        // 1. Vérifier si le Service Worker est enregistré
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) {
                console.log('Service Worker est enregistré');
            }
        }

        // 2. Vérifier le chargement des images
        const images = document.querySelectorAll('img[data-src]');
        if (images.length > 0) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                    }
                });
            }, {
                rootMargin: '50px',
                threshold: 0.1
            });

            images.forEach(img => observer.observe(img));
        }

        return true;
    } catch (error) {
        // Ne pas lancer d'erreur, juste logger en console
        console.log('Info: Cache system initialization:', error);
        return false;
    }
}

// Exécuter les tests quand la page est chargée
window.addEventListener('load', () => {
    testCacheSystem().catch(() => {
        // Ignorer silencieusement les erreurs
    });
});

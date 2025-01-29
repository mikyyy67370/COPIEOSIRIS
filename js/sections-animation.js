document.addEventListener('DOMContentLoaded', function() {
    // Options pour l'Intersection Observer
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    // Callback pour l'Intersection Observer
    const callback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // On arrête d'observer une fois que la section est visible
                observer.unobserve(entry.target);
            }
        });
    };

    // Créer l'Intersection Observer
    const observer = new IntersectionObserver(callback, options);

    // Observer toutes les sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});

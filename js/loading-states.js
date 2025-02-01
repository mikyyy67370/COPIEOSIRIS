const loadingStates = {
    show(element) {
        // Créer l'indicateur de chargement
        const loader = document.createElement('div');
        loader.className = 'loading-indicator';
        loader.innerHTML = `
            <div class="loading-spinner"></div>
            <span class="loading-text">Chargement...</span>
        `;

        // Ajouter l'indicateur
        element.appendChild(loader);
        element.classList.add('is-loading');
    },

    hide(element) {
        const loader = element.querySelector('.loading-indicator');
        if (loader) {
            loader.remove();
            element.classList.remove('is-loading');
        }
    }
};

// Ajouter aux éléments qui nécessitent un état de chargement
document.querySelectorAll('[data-loading]').forEach(element => {
    element.addEventListener('click', e => {
        if (element.classList.contains('is-loading')) return;
        loadingStates.show(element);
    });
});

const LoadingManager = {
    init() {
        // Créer l'élément de loading global
        const loader = document.createElement('div');
        loader.className = 'global-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <span class="loader-text">Chargement...</span>
            </div>
        `;
        document.body.appendChild(loader);

        // Intercepter les clics sur les liens
        document.addEventListener('click', e => {
            const link = e.target.closest('a');
            if (link && !link.hasAttribute('data-no-loader') && 
                link.href && link.href.startsWith(window.location.origin)) {
                this.show();
            }
        });

        // Intercepter les soumissions de formulaire
        document.addEventListener('submit', e => {
            const form = e.target;
            if (!form.hasAttribute('data-no-loader')) {
                this.show();
            }
        });

        // Masquer le loader quand la page est chargée
        window.addEventListener('load', () => this.hide());
    },

    show() {
        document.querySelector('.global-loader')?.classList.add('active');
    },

    hide() {
        document.querySelector('.global-loader')?.classList.remove('active');
    }
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => LoadingManager.init()); 
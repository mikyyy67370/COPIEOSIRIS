const errorHandler = {
    init() {
        // Ne pas initialiser le gestionnaire d'erreurs si nous sommes en mode développement
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return;
        }
        
        window.addEventListener('error', this.handleError.bind(this));
        window.addEventListener('unhandledrejection', this.handlePromiseError.bind(this));
    },

    handleError(error) {
        console.error('Erreur détectée:', error);
        this.showErrorMessage(error.message);
    },

    handlePromiseError(event) {
        console.error('Promesse rejetée:', event.reason);
        this.showErrorMessage('Une erreur est survenue');
    },

    showErrorMessage(message) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-notification';
        errorContainer.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button class="error-close">&times;</button>
            </div>
        `;

        document.body.appendChild(errorContainer);
        
        errorContainer.querySelector('.error-close').addEventListener('click', () => {
            errorContainer.remove();
        });

        setTimeout(() => errorContainer.remove(), 5000);
    }
};

// Initialisation
errorHandler.init();

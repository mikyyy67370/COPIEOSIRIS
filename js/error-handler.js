class ErrorHandler {
    constructor() {
        this.init();
        window.onerror = (msg, url, lineNo, columnNo, error) => {
            this.handleError(error);
            return false;
        };
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason);
        });
    }

    init() {
        // Intercepter les erreurs Ajax
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            try {
                const response = await originalFetch(...args);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response;
            } catch (error) {
                this.handleError(error);
                throw error;
            }
        };
    }

    handleError(error) {
        console.error('Error:', error);

        // Catégoriser l'erreur
        let errorType = this.categorizeError(error);
        
        // Notifier l'utilisateur de manière appropriée
        this.notifyUser(errorType, error.message);

        // Enregistrer l'erreur (pourrait être envoyé à un service de logging)
        this.logError(error, errorType);
    }

    categorizeError(error) {
        if (error instanceof TypeError) {
            return 'TYPE_ERROR';
        } else if (error.name === 'NetworkError' || error.message.includes('network')) {
            return 'NETWORK_ERROR';
        } else if (error.message.includes('localStorage')) {
            return 'STORAGE_ERROR';
        } else {
            return 'UNKNOWN_ERROR';
        }
    }

    notifyUser(errorType, message) {
        const errorMessages = {
            'TYPE_ERROR': 'Une erreur technique s\'est produite. Veuillez réessayer.',
            'NETWORK_ERROR': 'Problème de connexion. Vérifiez votre connexion internet.',
            'STORAGE_ERROR': 'Problème de stockage local. Vérifiez les paramètres de votre navigateur.',
            'UNKNOWN_ERROR': 'Une erreur inattendue s\'est produite. Veuillez réessayer.'
        };

        const notification = document.createElement('div');
        notification.className = 'notification error';
        notification.textContent = errorMessages[errorType] || message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 5000);
        }, 100);
    }

    logError(error, errorType) {
        const errorLog = {
            type: errorType,
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        // Stocker dans localStorage pour debug
        const errors = JSON.parse(localStorage.getItem('errorLogs') || '[]');
        errors.push(errorLog);
        localStorage.setItem('errorLogs', JSON.stringify(errors.slice(-10))); // Garder les 10 dernières erreurs
    }
}

// Initialiser le gestionnaire d'erreurs
const errorHandler = new ErrorHandler();

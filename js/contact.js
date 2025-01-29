class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.fields = {
            name: document.getElementById('name'),
            email: document.getElementById('email'),
            subject: document.getElementById('subject'),
            message: document.getElementById('message'),
            consent: document.getElementById('consent')
        };
        
        this.init();
    }

    init() {
        // Ajouter les écouteurs d'événements pour la validation en temps réel
        Object.keys(this.fields).forEach(field => {
            if (this.fields[field]) {
                this.fields[field].addEventListener('input', () => {
                    this.validateField(field);
                });
                this.fields[field].addEventListener('blur', () => {
                    this.validateField(field);
                });
            }
        });

        // Gérer la soumission du formulaire
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.submitForm();
            }
        });
    }

    validateField(fieldName) {
        const field = this.fields[fieldName];
        const errorElement = field.nextElementSibling;
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (!field.value.trim()) {
                    isValid = false;
                    errorMessage = 'Le nom est requis';
                } else if (field.value.length < 2) {
                    isValid = false;
                    errorMessage = 'Le nom doit contenir au moins 2 caractères';
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!field.value.trim()) {
                    isValid = false;
                    errorMessage = "L'email est requis";
                } else if (!emailRegex.test(field.value)) {
                    isValid = false;
                    errorMessage = "Veuillez entrer une adresse email valide";
                }
                break;

            case 'subject':
                if (!field.value) {
                    isValid = false;
                    errorMessage = 'Veuillez sélectionner un sujet';
                }
                break;

            case 'message':
                if (!field.value.trim()) {
                    isValid = false;
                    errorMessage = 'Le message est requis';
                } else if (field.value.length < 10) {
                    isValid = false;
                    errorMessage = 'Le message doit contenir au moins 10 caractères';
                }
                break;

            case 'consent':
                if (!field.checked) {
                    isValid = false;
                    errorMessage = 'Vous devez accepter le traitement de vos données';
                }
                break;
        }

        this.updateFieldStatus(field, isValid, errorMessage);
        return isValid;
    }

    updateFieldStatus(field, isValid, errorMessage) {
        const errorElement = field.nextElementSibling;
        
        if (isValid) {
            field.classList.remove('invalid');
            field.classList.add('valid');
            errorElement.textContent = '';
        } else {
            field.classList.remove('valid');
            field.classList.add('invalid');
            errorElement.textContent = errorMessage;
        }
    }

    validateForm() {
        let isValid = true;
        Object.keys(this.fields).forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        return isValid;
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `contact-notification ${type}`;
        
        const icon = document.createElement('i');
        icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        
        const text = document.createElement('span');
        text.textContent = message;
        
        notification.appendChild(icon);
        notification.appendChild(text);
        document.body.appendChild(notification);
        
        // Afficher la notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Masquer et supprimer la notification après 5 secondes
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    async submitForm() {
        const submitButton = this.form.querySelector('.submit-button');
        const buttonText = submitButton.querySelector('.button-text');
        const originalText = buttonText.textContent;
        
        // Désactiver le bouton et afficher l'état de chargement
        submitButton.disabled = true;
        buttonText.textContent = 'Envoi en cours...';
        
        try {
            // Simuler l'envoi du formulaire (à remplacer par votre logique d'envoi réelle)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Réinitialiser le formulaire
            this.form.reset();
            Object.keys(this.fields).forEach(field => {
                if (this.fields[field]) {
                    this.fields[field].classList.remove('valid', 'invalid');
                }
            });
            
            // Afficher le message de succès
            this.showNotification('Votre message a été envoyé avec succès !', 'success');
            
        } catch (error) {
            // Gérer les erreurs
            this.showNotification("Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer.", 'error');
            
        } finally {
            // Réactiver le bouton et restaurer le texte original
            submitButton.disabled = false;
            buttonText.textContent = originalText;
        }
    }
}

// Initialiser le formulaire de contact
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});

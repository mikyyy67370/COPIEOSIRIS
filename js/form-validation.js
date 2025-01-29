// Fonctions de validation communes
const validators = {
    required: (value) => value.trim() !== '',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    phone: (value) => /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(value),
    password: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value),
    postalCode: (value) => /^\d{5}$/.test(value)
};

// Messages d'erreur personnalisés
const errorMessages = {
    required: 'Ce champ est requis',
    email: 'Veuillez entrer une adresse email valide',
    phone: 'Veuillez entrer un numéro de téléphone français valide',
    password: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
    postalCode: 'Veuillez entrer un code postal valide (5 chiffres)',
    passwordMatch: 'Les mots de passe ne correspondent pas'
};

// Classe pour gérer les messages d'erreur
class FormError {
    constructor(inputElement) {
        this.input = inputElement;
        this.errorDiv = null;
    }

    show(message) {
        if (!this.errorDiv) {
            this.errorDiv = document.createElement('div');
            this.errorDiv.className = 'form-error';
            this.input.parentNode.insertBefore(this.errorDiv, this.input.nextSibling);
        }
        this.errorDiv.textContent = message;
        this.input.classList.add('error');
        
        // Ajout d'aria-invalid pour l'accessibilité
        this.input.setAttribute('aria-invalid', 'true');
        this.errorDiv.setAttribute('role', 'alert');
    }

    clear() {
        if (this.errorDiv) {
            this.errorDiv.remove();
            this.errorDiv = null;
        }
        this.input.classList.remove('error');
        this.input.setAttribute('aria-invalid', 'false');
    }
}

// Fonction de validation générique
function validateField(input, rules) {
    const error = new FormError(input);
    let isValid = true;

    for (const rule of rules) {
        if (validators[rule]) {
            if (!validators[rule](input.value)) {
                error.show(errorMessages[rule]);
                isValid = false;
                break;
            }
        }
    }

    if (isValid) {
        error.clear();
    }

    return isValid;
}

// Validation du formulaire de newsletter
function initNewsletterValidation() {
    const forms = document.querySelectorAll('.newsletter-form');
    forms.forEach(form => {
        const emailInput = form.querySelector('input[type="email"]');
        
        if (emailInput) {
            emailInput.addEventListener('input', () => {
                validateField(emailInput, ['required', 'email']);
            });

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (validateField(emailInput, ['required', 'email'])) {
                    // Animation de succès
                    form.classList.add('success');
                    
                    // Message de succès
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.setAttribute('role', 'status');
                    successMessage.textContent = 'Inscription réussie à la newsletter';
                    form.appendChild(successMessage);
                    
                    // Réinitialisation après 3 secondes
                    setTimeout(() => {
                        form.reset();
                        form.classList.remove('success');
                        successMessage.remove();
                    }, 3000);
                }
            });
        }
    });
}

// Validation du formulaire de contact
function initContactValidation() {
    const form = document.getElementById('contact-form');
    if (form) {
        const inputs = {
            name: form.querySelector('input[name="name"]'),
            email: form.querySelector('input[name="email"]'),
            phone: form.querySelector('input[name="phone"]'),
            message: form.querySelector('textarea[name="message"]')
        };

        // Validation en temps réel
        Object.entries(inputs).forEach(([field, input]) => {
            if (input) {
                input.addEventListener('input', () => {
                    const rules = ['required'];
                    if (field === 'email') rules.push('email');
                    if (field === 'phone') rules.push('phone');
                    validateField(input, rules);
                });
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            // Validation de tous les champs
            Object.entries(inputs).forEach(([field, input]) => {
                if (input) {
                    const rules = ['required'];
                    if (field === 'email') rules.push('email');
                    if (field === 'phone') rules.push('phone');
                    if (!validateField(input, rules)) {
                        isValid = false;
                    }
                }
            });

            if (isValid) {
                // Animation de succès
                form.classList.add('success');
                
                // Message de succès
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.setAttribute('role', 'status');
                successMessage.textContent = 'Message envoyé avec succès';
                form.appendChild(successMessage);
                
                // Réinitialisation après 3 secondes
                setTimeout(() => {
                    form.reset();
                    form.classList.remove('success');
                    successMessage.remove();
                }, 3000);
            }
        });
    }
}

// Validation des formulaires de compte
function initAccountValidation() {
    // Formulaire de connexion
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const inputs = {
            email: loginForm.querySelector('input[type="email"]'),
            password: loginForm.querySelector('input[type="password"]')
        };

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            if (!validateField(inputs.email, ['required', 'email'])) isValid = false;
            if (!validateField(inputs.password, ['required'])) isValid = false;

            if (isValid) {
                // Simulation de connexion réussie
                loginForm.classList.add('success');
            }
        });
    }

    // Formulaire d'inscription
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        const inputs = {
            email: registerForm.querySelector('input[type="email"]'),
            password: registerForm.querySelector('input[name="password"]'),
            confirmPassword: registerForm.querySelector('input[name="confirm-password"]')
        };

        // Validation en temps réel
        if (inputs.email) {
            inputs.email.addEventListener('input', () => {
                validateField(inputs.email, ['required', 'email']);
            });
        }

        if (inputs.password) {
            inputs.password.addEventListener('input', () => {
                validateField(inputs.password, ['required', 'password']);
                if (inputs.confirmPassword && inputs.confirmPassword.value) {
                    validatePasswordMatch(inputs.password, inputs.confirmPassword);
                }
            });
        }

        if (inputs.confirmPassword) {
            inputs.confirmPassword.addEventListener('input', () => {
                validatePasswordMatch(inputs.password, inputs.confirmPassword);
            });
        }

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            if (!validateField(inputs.email, ['required', 'email'])) isValid = false;
            if (!validateField(inputs.password, ['required', 'password'])) isValid = false;
            if (!validatePasswordMatch(inputs.password, inputs.confirmPassword)) isValid = false;

            if (isValid) {
                // Animation de succès
                registerForm.classList.add('success');
                
                // Message de succès
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.setAttribute('role', 'status');
                successMessage.textContent = 'Inscription réussie';
                registerForm.appendChild(successMessage);
                
                // Réinitialisation après 3 secondes
                setTimeout(() => {
                    registerForm.reset();
                    registerForm.classList.remove('success');
                    successMessage.remove();
                }, 3000);
            }
        });
    }
}

// Validation de la correspondance des mots de passe
function validatePasswordMatch(password1, password2) {
    if (!password1 || !password2) return false;
    
    const error = new FormError(password2);
    const isValid = password1.value === password2.value;

    if (!isValid) {
        error.show(errorMessages.passwordMatch);
    } else {
        error.clear();
    }

    return isValid;
}

// Initialisation de toutes les validations au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initNewsletterValidation();
    initContactValidation();
    initAccountValidation();
});

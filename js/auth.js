class Auth {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.isLoggedIn = !!this.currentUser;
        this.init();
    }

    init() {
        this.updateUI();
        this.setupEventListeners();
    }

    // Mettre à jour l'interface utilisateur en fonction de l'état de connexion
    updateUI() {
        const authSection = document.querySelector('.auth-section');
        const userSection = document.querySelector('.user-section');
        const userEmail = document.querySelector('.user-email');

        if (authSection && userSection) {
            if (this.isLoggedIn) {
                authSection.style.display = 'none';
                userSection.style.display = 'block';
                if (userEmail) {
                    userEmail.textContent = this.currentUser.email;
                }
            } else {
                authSection.style.display = 'block';
                userSection.style.display = 'none';
            }
        }
    }

    // Configuration des écouteurs d'événements
    setupEventListeners() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const logoutBtn = document.querySelector('.logout-btn');
        const forgotPasswordBtn = document.querySelector('.forgot-password-btn');
        const switchToRegisterBtn = document.querySelector('.switch-to-register');
        const switchToLoginBtn = document.querySelector('.switch-to-login');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        if (forgotPasswordBtn) {
            forgotPasswordBtn.addEventListener('click', (e) => this.handleForgotPassword(e));
        }

        if (switchToRegisterBtn) {
            switchToRegisterBtn.addEventListener('click', () => this.switchForm('register'));
        }

        if (switchToLoginBtn) {
            switchToLoginBtn.addEventListener('click', () => this.switchForm('login'));
        }
    }

    // Gérer la connexion
    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            // Simuler une requête API
            await this.simulateApiCall();

            // Vérifier les identifiants (à remplacer par une vraie API)
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === this.hashPassword(password));

            if (user) {
                this.currentUser = {
                    email: user.email,
                    name: user.name,
                    createdAt: user.createdAt
                };
                this.isLoggedIn = true;
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                this.showNotification('Connexion réussie', 'success');

                // Redirection si nécessaire
                const returnUrl = localStorage.getItem('returnUrl');
                if (returnUrl) {
                    localStorage.removeItem('returnUrl');
                    window.location.href = returnUrl;
                } else {
                    this.updateUI();
                }
            } else {
                throw new Error('Identifiants invalides');
            }
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    // Gérer l'inscription
    async handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        try {
            // Validation
            if (password !== confirmPassword) {
                throw new Error('Les mots de passe ne correspondent pas');
            }

            if (password.length < 8) {
                throw new Error('Le mot de passe doit contenir au moins 8 caractères');
            }

            // Simuler une requête API
            await this.simulateApiCall();

            // Vérifier si l'utilisateur existe déjà
            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(u => u.email === email)) {
                throw new Error('Cet email est déjà utilisé');
            }

            // Créer le nouvel utilisateur
            const newUser = {
                name,
                email,
                password: this.hashPassword(password),
                createdAt: new Date().toISOString()
            };

            // Sauvegarder l'utilisateur
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Connecter automatiquement
            this.currentUser = {
                email: newUser.email,
                name: newUser.name,
                createdAt: newUser.createdAt
            };
            this.isLoggedIn = true;
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

            this.showNotification('Inscription réussie', 'success');
            this.updateUI();
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    // Gérer la déconnexion
    handleLogout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        localStorage.removeItem('currentUser');
        this.showNotification('Vous êtes déconnecté', 'success');
        this.updateUI();
    }

    // Gérer le mot de passe oublié
    async handleForgotPassword(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;

        if (!email) {
            this.showNotification('Veuillez entrer votre email', 'error');
            return;
        }

        try {
            await this.simulateApiCall();
            this.showNotification('Instructions envoyées par email', 'success');
        } catch (error) {
            this.showNotification('Erreur lors de l\'envoi de l\'email', 'error');
        }
    }

    // Basculer entre les formulaires
    switchForm(form) {
        const loginForm = document.querySelector('.login-form');
        const registerForm = document.querySelector('.register-form');

        if (form === 'register') {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        } else {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        }
    }

    // Afficher une notification
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `auth-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Simuler un appel API
    simulateApiCall() {
        return new Promise((resolve) => {
            setTimeout(resolve, 500);
        });
    }

    // Hash simple du mot de passe (à remplacer par une vraie fonction de hachage)
    hashPassword(password) {
        return btoa(password);
    }
}

// Initialiser l'authentification
document.addEventListener('DOMContentLoaded', () => {
    window.auth = new Auth();
});

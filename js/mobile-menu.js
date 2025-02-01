// Amélioration de la navigation mobile
const mobileMenu = {
    isOpen: false,
    lastScrollPosition: 0,

    init() {
        const menu = document.querySelector('.mobile-menu');
        const hamburger = document.querySelector('.hamburger-menu');
        const closeBtn = document.querySelector('.close-menu');
        
        // Gestionnaire pour le bouton hamburger
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.isOpen ? this.close() : this.open();
        });

        // Gestionnaire pour le bouton de fermeture
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.close();
        });

        // Gestion du touch
        let touchStartY = 0;
        menu.addEventListener('touchstart', e => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        menu.addEventListener('touchmove', e => {
            const touchY = e.touches[0].clientY;
            const diff = touchStartY - touchY;

            if (diff < -50) {
                this.close();
            }
        }, { passive: true });

        // Fermer le menu sur clic en dehors
        document.addEventListener('click', e => {
            if (this.isOpen && !menu.contains(e.target) && !hamburger.contains(e.target)) {
                this.close();
            }
        });

        // Fermer le menu avec la touche Escape
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Gestion des sous-menus
        const menuItems = document.querySelectorAll('.menu-item.has-submenu');
        menuItems.forEach(item => {
            const menuHeader = item.querySelector('.menu-header');
            menuHeader?.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                item.classList.toggle('active');
            });
        });
    },

    open() {
        if (this.isOpen) return;
        
        const menu = document.querySelector('.mobile-menu');
        this.isOpen = true;
        this.lastScrollPosition = window.scrollY;
        
        // Empêcher le défilement du body
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = `-${this.lastScrollPosition}px`;
        
        // Afficher le menu
        menu.style.display = 'block';
        requestAnimationFrame(() => {
            menu.classList.add('active');
        });
    },

    close() {
        if (!this.isOpen) return;
        
        const menu = document.querySelector('.mobile-menu');
        this.isOpen = false;
        
        // Restaurer le défilement
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, this.lastScrollPosition);
        
        // Masquer le menu avec animation
        menu.classList.remove('active');
        setTimeout(() => {
            if (!this.isOpen) { // Vérifier si toujours fermé
                menu.style.display = 'none';
            }
        }, 300); // Correspond à la durée de l'animation CSS
    }
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => mobileMenu.init());

document.addEventListener('DOMContentLoaded', () => {
    // Gestion des sous-menus
    const subMenuItems = document.querySelectorAll('.menu-item.has-submenu');
    
    subMenuItems.forEach(item => {
        const menuHeader = item.querySelector('.menu-header');
        const submenu = item.querySelector('.submenu');
        const menuIcon = item.querySelector('.menu-icon');
        
        menuHeader.addEventListener('click', () => {
            const isExpanded = submenu.getAttribute('aria-expanded') === 'true';
            
            // Toggle du sous-menu
            submenu.setAttribute('aria-expanded', !isExpanded);
            submenu.style.display = isExpanded ? 'none' : 'block';
            
            // Change l'icône + en -
            menuIcon.textContent = isExpanded ? '+' : '-';
        });
    });
});

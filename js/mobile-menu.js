document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenu = document.querySelector('.close-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const body = document.body;
    const menuItems = document.querySelectorAll('.mobile-nav .menu-item.has-submenu');

    // Fonction pour ouvrir le menu
    const openMenu = () => {
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
        body.style.overflow = 'hidden';
        mobileMenu.setAttribute('aria-expanded', 'true');
        closeMenu.focus();
    };

    // Fonction pour fermer le menu
    const closeMenuMobile = () => {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = '';
        mobileMenu.setAttribute('aria-expanded', 'false');
        hamburgerMenu.focus();
    };

    // Gestionnaires d'événements pour l'ouverture/fermeture
    hamburgerMenu.addEventListener('click', openMenu);
    closeMenu.addEventListener('click', closeMenuMobile);
    overlay.addEventListener('click', closeMenuMobile);

    // Fermer avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenuMobile();
        }
    });

    // Gestion des sous-menus
    menuItems.forEach(item => {
        const link = item.querySelector('a');
        const submenu = item.querySelector('.submenu');
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            item.classList.toggle('active');
            
            const isExpanded = item.classList.contains('active');
            submenu.setAttribute('aria-expanded', isExpanded);
            
            if (isExpanded) {
                submenu.style.display = 'block';
            } else {
                submenu.style.display = 'none';
            }
        });
    });

    // Gestion du swipe sur mobile
    let touchStartX = 0;
    let touchEndX = 0;

    mobileMenu.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    mobileMenu.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    const handleSwipe = () => {
        const swipeThreshold = 100;
        if (touchStartX - touchEndX > swipeThreshold) {
            closeMenuMobile();
        }
    };

    // Fermer le menu lors du redimensionnement
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024 && mobileMenu.classList.contains('active')) {
            closeMenuMobile();
        }
    });
});

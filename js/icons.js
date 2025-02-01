// Vérification et chargement de Font Awesome
(function() {
    // Créer un lien pour Font Awesome
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    link.integrity = 'sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==';
    link.crossOrigin = 'anonymous';
    link.referrerPolicy = 'no-referrer';
    
    // Ajouter le lien au head
    document.head.appendChild(link);
    
    // Vérifier si Font Awesome est chargé
    link.onload = function() {
        console.log('Font Awesome chargé avec succès');
    };
    
    link.onerror = function() {
        console.error('Erreur de chargement de Font Awesome');
        // Essayer le CDN de secours
        var backupLink = document.createElement('link');
        backupLink.rel = 'stylesheet';
        backupLink.href = 'https://use.fontawesome.com/releases/v6.5.1/css/all.css';
        document.head.appendChild(backupLink);
    };
})();

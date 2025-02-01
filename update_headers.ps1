# PowerShell script pour mettre à jour les headers
$headerContent = @'
    <header>
        <div class="hamburger-menu" aria-label="Menu principal" role="button" aria-expanded="false">
            <i class="fas fa-bars"></i>
        </div>
        
        <!-- Menu Mobile -->
        <div class="mobile-menu" aria-hidden="true">
            <div class="mobile-menu-header">
                <div class="mobile-logo">
                    <div class="logo-symbol">◈</div>
                    <h1>OSIRIS</h1>
                    <div class="logo-tagline">UNE GOUTTE D'HISTOIRE</div>
                </div>
                <div class="close-menu" aria-label="Fermer le menu">
                    <span class="close-icon"></span>
                </div>
            </div>
            
            <!-- Section recherche -->
            <div class="mobile-search-section">
                <div class="search-title">Rechercher</div>
                <div class="search-wrapper">
                    <input type="text" placeholder="Rechercher une fragrance...">
                    <button type="button" class="search-button">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>
            
            <nav class="mobile-nav">
                <div class="menu-item has-submenu">
                    <div class="menu-header">
                        <span class="menu-text">Collections</span>
                        <span class="menu-icon">+</span>
                    </div>
                    <div class="submenu" aria-expanded="false">
                        <a href="collections-signatures.html">Collections Signatures</a>
                        <a href="collections-privees.html">Collections Privées</a>
                        <a href="collection-royale.html">Collection Royale</a>
                    </div>
                </div>
                
                <div class="menu-item has-submenu">
                    <div class="menu-header">
                        <span class="menu-text">Parfums</span>
                        <span class="menu-icon">+</span>
                    </div>
                    <div class="submenu" aria-expanded="false">
                        <a href="lesfeminins.html">Les Féminins</a>
                        <a href="lesmasculins.html">Les Masculins</a>
                        <a href="choisirsonparfum.html">Choisir son Parfum</a>
                    </div>
                </div>
                
                <div class="menu-item">
                    <a href="notrehistoire.html">
                        <span class="menu-text">Notre Histoire</span>
                    </a>
                </div>
                
                <div class="menu-item">
                    <a href="contact.html">
                        <span class="menu-text">Contact</span>
                    </a>
                </div>
            </nav>
            
            <div class="mobile-menu-footer">
                <div class="social-links">
                    <a href="#" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
                    <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                    <a href="#" aria-label="Pinterest"><i class="fab fa-pinterest"></i></a>
                </div>
            </div>
        </div>
        
        <div class="mobile-menu-overlay"></div>

        <nav>
            <div class="nav-left">
                <div class="location-selector">
                    <span class="country">FRANCE</span>
                    <span class="divider">|</span>
                    <span class="language">FR</span>
                </div>
                <a href="contact.html" class="contact-link">
                    <i class="fas fa-envelope"></i>
                    NOUS CONTACTER
                </a>
            </div>
            
            <div class="logo">
                <div class="logo-symbol">◈</div>
                <h1>OSIRIS</h1>
                <div class="logo-tagline">UNE GOUTTE D'HISTOIRE</div>
                <div class="logo-location">STRASBOURG</div>
            </div>

            <div class="nav-right">
                <div class="search-bar">
                    <input type="text" placeholder="Rechercher...">
                    <button class="search-icon">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <a href="compte.html" class="icon">
                    <i class="fas fa-user"></i>
                </a>
                <a href="panier.html" class="icon cart-icon">
                    <i class="fas fa-shopping-bag"></i>
                    <span class="cart-count">0</span>
                </a>
            </div>
        </nav>

        <!-- Menu principal (desktop) -->
        <div class="main-menu">
            <a href="lesmasculins.html" class="menu-item">
                <span class="menu-text">LES MASCULINS</span>
            </a>
            <a href="lesfeminins.html" class="menu-item">
                <span class="menu-text">LES FÉMININS</span>
            </a>
            <a href="notrehistoire.html" class="menu-item">
                <span class="menu-text">NOTRE HISTOIRE</span>
            </a>
            <a href="contact.html" class="menu-item">
                <span class="menu-text">CONTACTEZ-NOUS</span>
            </a>
            <a href="choisirsonparfum.html" class="menu-item">
                <span class="menu-text">COMMENT CHOISIR SON PARFUM</span>
            </a>
        </div>
    </header>
'@

# Récupérer tous les fichiers HTML
$htmlFiles = Get-ChildItem -Path . -Filter "*.html" -Recurse | Where-Object { $_.Name -ne "header.html" }

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Vérifier si le fichier contient déjà le header
    if (-not $content.Contains('class="hamburger-menu"')) {
        # Remplacer l'ancien header par le nouveau
        $content = $content -replace '(?s)<header>.*?</header>', $headerContent
        
        # Vérifier si les liens CSS nécessaires sont présents
        if (-not $content.Contains('mobile.css')) {
            $content = $content -replace '</head>', '    <link rel="stylesheet" href="css/mobile.css">`n</head>'
        }
        if (-not $content.Contains('mobile-menu.css')) {
            $content = $content -replace '</head>', '    <link rel="stylesheet" href="css/mobile-menu.css">`n</head>'
        }
        if (-not $content.Contains('font-awesome')) {
            $content = $content -replace '</head>', '    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">`n</head>'
        }
        
        # Sauvegarder les modifications
        $content | Set-Content $file.FullName -Force
    }
}

Write-Host "Tous les fichiers HTML ont été mis à jour avec le nouveau header!"

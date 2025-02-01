# PowerShell script pour mettre à jour tous les fichiers HTML
$htmlFiles = Get-ChildItem -Path . -Filter "*.html" -Recurse | Where-Object { $_.Name -ne "header.html" }

$cssLinks = @"
    <link rel="stylesheet" href="css/mobile-menu.css">
    <link rel="stylesheet" href="css/mobile.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
"@

$jsScript = @"
    <script src="js/mobile-menu.js"></script>
"@

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Vérifier si les liens CSS sont déjà présents
    if (-not $content.Contains("mobile-menu.css")) {
        $content = $content -replace "</head>", "$cssLinks`n</head>"
    }
    
    # Vérifier si le script JS est déjà présent
    if (-not $content.Contains("mobile-menu.js")) {
        $content = $content -replace "</body>", "$jsScript`n</body>"
    }
    
    # Vérifier si le menu hamburger est déjà présent
    if (-not $content.Contains("hamburger-menu")) {
        $headerContent = Get-Content "includes/header.html" -Raw
        $content = $content -replace "<header>", "<header>`n$headerContent"
    }
    
    # Sauvegarder les modifications
    $content | Set-Content $file.FullName -Force
}

Write-Host "Tous les fichiers HTML ont été mis à jour avec succès!"

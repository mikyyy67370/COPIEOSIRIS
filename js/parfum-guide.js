// Base de données des notes olfactives
const olfactiveNotes = {
    florales: {
        icon: '𓆸',
        description: 'Des notes élégantes et romantiques',
        notes: ['Jasmin', 'Rose', 'Iris', 'Lotus']
    },
    boisees: {
        icon: '𓋎',
        description: 'Des notes profondes et chaleureuses',
        notes: ['Santal', 'Cèdre', 'Patchouli']
    },
    orientales: {
        icon: '𓇯',
        description: 'Des notes envoûtantes et mystérieuses',
        notes: ['Vanille', 'Ambre', 'Musc']
    },
    epicees: {
        icon: '𓃭',
        description: 'Des notes intenses et caractérielles',
        notes: ['Cardamome', 'Poivre', 'Safran']
    }
};

// Base de données des parfums et leurs caractéristiques
const parfums = {
    isis: {
        nom: 'ISIS',
        notes: ['floral', 'ambré'],
        similaires: ['nefertiti', 'hathor'],
        categorie: 'Féminin'
    },
    nefertiti: {
        nom: 'NEFERTITI',
        notes: ['iris', 'lotus', 'floral'],
        similaires: ['isis', 'bastet'],
        categorie: 'Féminin'
    },
    // ... autres parfums ...
};

// Base de données des parfums avec leurs caractéristiques détaillées
const parfumsDetails = {
    ISIS: {
        name: "Isis",
        description: "Une fragrance mystérieuse et envoûtante",
        traits: ["Mystérieux", "Intense"],
        notes: ["Ambre", "Vanille", "Bois précieux"],
        occasions: "Soirée",
        url: "isis.html"
    },
    NEFERTITI: {
        name: "Néfertiti",
        description: "Un parfum floral et élégant",
        traits: ["Élégant", "Moderne"],
        notes: ["Rose", "Jasmin", "Musc"],
        occasions: "Journée, Soirée",
        url: "nefertiti.html"
    },
    // Nouveaux parfums féminins
    HATHOR: {
        name: "HATHOR",
        description: "Une composition florale-orientale sensuelle et envoûtante",
        traits: ["Floral-Oriental", "Sensuel", "Romantique"],
        personality: "Une femme passionnée et romantique",
        occasions: "Les rendez-vous romantiques et moments d'exception",
        notes: ["Vanille", "Fleur d'oranger", "Jasmin"],
        url: "hathor.html",
        productUrl: "hathor.html",
        anchorId: null
    },
    SEKHMET: {
        name: "Sekhmet",
        description: "Une fragrance puissante et charismatique",
        traits: ["Puissant", "Intense"],
        notes: ["Épices", "Rose", "Oud"],
        occasions: "Soirée, Occasions spéciales",
        url: "sekhmet.html"
    },
    BASTET: {
        name: "Bastet",
        description: "Un parfum frais et délicat",
        traits: ["Frais", "Léger"],
        notes: ["Fleur de Lotus", "Bergamote", "Musc blanc"],
        occasions: "Journée",
        url: "bastet.html"
    },
    // Parfums masculins existants
    ANUBIS: {
        name: "Anubis",
        description: "Un parfum mystérieux et profond",
        traits: ["Mystérieux", "Intense"],
        notes: ["Bois de Oud", "Encens", "Cuir"],
        occasions: "Soirée",
        url: "anubis.html"
    },
    // Nouveaux parfums masculins
    OSIRIS_ROYAL: {
        name: "Osiris Royal",
        description: "Une fragrance noble et raffinée",
        traits: ["Noble", "Classique"],
        notes: ["Bois de Santal", "Ambre", "Vétiver"],
        occasions: "Occasions spéciales",
        url: "osirisroyal.html"
    },
    THOT: {
        name: "Thot",
        description: "Un parfum frais et intellectuel",
        traits: ["Frais", "Moderne"],
        notes: ["Bergamote", "Cardamome", "Bois de Cèdre"],
        occasions: "Journée",
        url: "thot.html"
    },
    HORUS: {
        name: "Horus",
        description: "Une fragrance dynamique et solaire",
        traits: ["Dynamique", "Moderne"],
        notes: ["Agrumes", "Épices", "Bois blond"],
        occasions: "Journée",
        url: "horus.html"
    }
};

// Ajouter après la définition des parfumsDetails
const parfumFamilies = {
    ISIS: "oriental",
    NEFERTITI: "floral",
    HATHOR: "floral-oriental",
    SEKHMET: "épicé",
    BASTET: "floral-musqué",
    ANUBIS: "boisé-épicé",
    OSIRIS_ROYAL: "oriental-boisé",
    THOT: "frais-aromatique",
    HORUS: "oriental-ambré"
};

const perfumeCombinations = {
    'frais_soir': {
        feminin: {
            parfums: ['NEFERTITI', 'SEKHMET'],
            description: "Une fraîcheur qui garde de la présence en soirée"
        },
        masculin: {
            parfums: ['THOT', 'ANUBIS'],
            description: "La fraîcheur associée à une belle intensité"
        }
    },
    'oriental_jour': {
        feminin: {
            parfums: ['ISIS', 'BASTET'],
            description: "Une touche orientale subtile pour la journée"
        },
        masculin: {
            parfums: ['OSIRIS_ROYAL', 'HORUS'],
            description: "Un oriental élégant adapté au quotidien"
        }
    }
};

// Fonction d'initialisation des notes olfactives
function initializeOlfactiveFilters() {
    console.log('Initialisation des notes olfactives...');
    const container = document.querySelector('.olfactive-filters');
    
    if (!container) {
        console.error('Conteneur des notes olfactives non trouvé');
        return;
    }

    // Vider le conteneur avant d'ajouter les éléments
    container.innerHTML = '';

    // Créer les sections de notes
    Object.entries(olfactiveNotes).forEach(([famille, data]) => {
        const familySection = document.createElement('div');
        familySection.className = 'olfactive-family';
        familySection.innerHTML = `
            <div class="family-header">
                <span class="family-icon">${data.icon}</span>
                <h4>${famille.toUpperCase()}</h4>
                <p class="family-description">${data.description}</p>
            </div>
            <div class="note-badges">
                ${data.notes.map(note => `
                    <button class="note-badge" data-note="${note}">
                        ${note}
                    </button>
                `).join('')}
            </div>
        `;
        container.appendChild(familySection);
    });

    // Ajouter les écouteurs d'événements
    container.querySelectorAll('.note-badge').forEach(badge => {
        badge.addEventListener('click', () => {
            badge.classList.toggle('active');
            filterParfums();
        });
    });
}

// Filtrage des parfums selon les notes sélectionnées
function filterParfumsByNotes() {
    const activeNotes = Array.from(document.querySelectorAll('.note-badge.active'))
        .map(badge => badge.dataset.note);
    
    Object.entries(parfums).forEach(([id, parfum]) => {
        const element = document.querySelector(`[data-parfum-id="${id}"]`);
        if (!element) return;

        const hasMatchingNotes = activeNotes.length === 0 || 
            activeNotes.some(note => parfum.notes.includes(note));
        
        element.style.display = hasMatchingNotes ? 'block' : 'none';
    });
}

// Ajouter après les constantes existantes
const questionWeights = {
    ambiance: 2.0,    // Question la plus importante
    moment: 1.5,      // Importance moyenne
    saison: 1.0       // Moins important
};

const contextProfiles = {
    age: {
        "18-25": {
            traits: ["frais", "moderne", "dynamique"],
            parfums: {
                feminin: ["HATHOR", "SEKHMET"],
                masculin: ["THOT", "HORUS"]
            }
        },
        "26-35": {
            traits: ["sophistiqué", "élégant", "tendance"],
            parfums: {
                feminin: ["ISIS", "NEFERTITI"],
                masculin: ["ANUBIS", "OSIRIS_ROYAL"]
            }
        },
        "36+": {
            traits: ["raffiné", "classique", "luxueux"],
            parfums: {
                feminin: ["NEFERTITI", "BASTET"],
                masculin: ["OSIRIS_ROYAL", "HORUS"]
            }
        }
    },
    style: {
        "classique": {
            bonus: ["NEFERTITI", "OSIRIS_ROYAL"],
            description: "Une élégance intemporelle"
        },
        "moderne": {
            bonus: ["SEKHMET", "ANUBIS"],
            description: "Un style contemporain affirmé"
        },
        "créatif": {
            bonus: ["ISIS", "THOT"],
            description: "Une signature unique et artistique"
        }
    }
};

// Définir les questions du quiz au début du fichier
const quizQuestions = [
    {
        question: "Quelle ambiance de parfum préférez-vous ?",
        options: [
            {
                text: "Fraîche et Légère",
                parfums: {
                    feminin: ["NEFERTITI", "BASTET"],
                    masculin: ["THOT", "HORUS"]
                }
            },
            {
                text: "Intense et Mystérieuse",
                parfums: {
                    feminin: ["ISIS", "SEKHMET"],
                    masculin: ["ANUBIS", "OSIRIS_ROYAL"]
                }
            }
        ]
    },
    {
        question: "Quel moment de la journée correspond le mieux à votre recherche ?",
        options: [
            {
                text: "Pour la journée",
                parfums: {
                    feminin: ["NEFERTITI", "HATHOR"],
                    masculin: ["THOT", "HORUS"]
                }
            },
            {
                text: "Pour la soirée",
                parfums: {
                    feminin: ["ISIS", "SEKHMET"],
                    masculin: ["ANUBIS", "OSIRIS_ROYAL"]
                }
            }
        ]
    }
];

// Variables globales pour le suivi de l'état du quiz
let currentQuestion = 0;
let userAnswers = [];
let userContext = {
    age: null,
    style: null,
    occasion: null,
    gender: null
};

// Améliorer la fonction getRecommendations
function getRecommendations() {
    console.log('Calcul des recommandations...');
    console.log('Contexte utilisateur:', userContext);
    console.log('Réponses utilisateur:', userAnswers);
    
    // Initialiser les scores pour les parfums du genre sélectionné uniquement
    const scores = {};
    Object.entries(parfumsDetails).forEach(([parfumId, parfum]) => {
        // Filtrer par genre
        const isCorrectGender = userContext.gender === 'feminin' ? 
            ['ISIS', 'NEFERTITI', 'HATHOR', 'SEKHMET', 'BASTET'].includes(parfumId) :
            ['ANUBIS', 'OSIRIS_ROYAL', 'THOT', 'HORUS'].includes(parfumId);
        
        if (isCorrectGender) {
            scores[parfumId] = {
                score: 0,
                bonusPoints: 0,
                total: 0
            };
        }
    });

    // Calculer les scores de base selon les réponses au quiz
    userAnswers.forEach((answer, index) => {
        const question = quizQuestions[index];
        const selectedOption = question.options[answer];
        const parfumsRecommandes = selectedOption.parfums[userContext.gender];
        
        parfumsRecommandes.forEach(parfumId => {
            if (scores[parfumId]) {
                scores[parfumId].score += 1;
            }
        });
    });

    // Ajouter des bonus basés sur le contexte
    Object.entries(scores).forEach(([parfumId, scoreData]) => {
        const parfum = parfumsDetails[parfumId];
        
        // Bonus pour le style vestimentaire
        if (userContext.style === "classique" && parfum.traits.includes("Classique")) {
            scoreData.bonusPoints += 0.5;
        } else if (userContext.style === "moderne" && parfum.traits.includes("Moderne")) {
            scoreData.bonusPoints += 0.5;
        }
        
        // Bonus pour l'occasion
        if (userContext.occasion === "soiree" && parfum.occasions.toLowerCase().includes("soirée")) {
            scoreData.bonusPoints += 0.5;
        } else if (userContext.occasion === "quotidien" && parfum.occasions.toLowerCase().includes("journée")) {
            scoreData.bonusPoints += 0.5;
        }
        
        // Bonus pour l'âge
        if (userContext.age === "18-25" && parfum.traits.includes("Moderne")) {
            scoreData.bonusPoints += 0.3;
        } else if (userContext.age === "36+" && parfum.traits.includes("Classique")) {
            scoreData.bonusPoints += 0.3;
        }

        // Calculer le score total
        scoreData.total = scoreData.score + scoreData.bonusPoints;
    });

    // Calculer les pourcentages de compatibilité
    const maxPossibleScore = quizQuestions.length + 1.3; // Score max possible avec bonus
    Object.values(scores).forEach(scoreData => {
        scoreData.percentage = Math.round((scoreData.total / maxPossibleScore) * 100);
    });

    // Trier et sélectionner les 3 meilleurs parfums
    const recommendations = Object.entries(scores)
        .sort(([,a], [,b]) => b.total - a.total)
        .slice(0, 3)
        .map(([parfumId, scoreData]) => ({
            ...parfumsDetails[parfumId],
            matchScore: scoreData.percentage
        }));

    console.log('Scores calculés:', scores);
    console.log('Recommandations finales:', recommendations);
    return recommendations;
}

// Ajouter une fonction de test pour vérifier l'intégration
function testQuizIntegration() {
    console.log('=== Test d\'intégration du quiz ===');
    console.log('1. Vérification des questions:', quizQuestions ? '✓' : '✗');
    console.log('2. Vérification des fonctions:');
    console.log('   - startQuiz:', typeof startQuiz === 'function' ? '✓' : '✗');
    console.log('   - showQuestion:', typeof showQuestion === 'function' ? '✓' : '✗');
    console.log('   - handleAnswer:', typeof handleAnswer === 'function' ? '✓' : '✗');
    console.log('   - showResults:', typeof showResults === 'function' ? '✓' : '✗');
    console.log('   - getRecommendations:', typeof getRecommendations === 'function' ? '✓' : '✗');
}

// Exécuter le test au chargement en développement
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', testQuizIntegration);
}

// Fonction d'initialisation du quiz
function initializeQuiz() {
    console.log('Initialisation du quiz...');
    const container = document.querySelector('.quiz-container');
    
    if (!container) {
        console.error('Conteneur du quiz non trouvé');
        return;
    }

    // Vider le conteneur avant d'ajouter les éléments
    container.innerHTML = '';

    // Ajouter le nouveau contenu
    container.innerHTML = `
        <div class="quiz-start">
            <div class="quiz-intro">
                <h3>Trouvez votre parfum idéal</h3>
                <p>Pour des recommandations personnalisées, répondez à ces quelques questions :</p>
            </div>
            
            <div class="context-questions">
                <!-- Question 1: Âge -->
                <div class="context-group">
                    <label>Votre tranche d'âge</label>
                    <div class="context-options">
                        <button class="context-btn" data-age="18-25">
                            18-25 ans
                            <span class="badge-icon">𓂋</span>
                        </button>
                        <button class="context-btn" data-age="26-35">
                            26-35 ans
                            <span class="badge-icon">𓂋</span>
                        </button>
                        <button class="context-btn" data-age="36+">
                            36 ans et +
                            <span class="badge-icon">𓂋</span>
                        </button>
                    </div>
                </div>

                <!-- Question 2: Style -->
                <div class="context-group">
                    <label>Votre style vestimentaire</label>
                    <div class="context-options">
                        <button class="context-btn" data-style="classique">
                            Classique & Élégant
                            <span class="badge-icon">𓃭</span>
                        </button>
                        <button class="context-btn" data-style="moderne">
                            Moderne & Tendance
                            <span class="badge-icon">𓃭</span>
                        </button>
                        <button class="context-btn" data-style="creatif">
                            Créatif & Original
                            <span class="badge-icon">𓃭</span>
                        </button>
                    </div>
                </div>

                <!-- Question 3: Occasion -->
                <div class="context-group">
                    <label>L'occasion principale</label>
                    <div class="context-options">
                        <button class="context-btn" data-occasion="quotidien">
                            Quotidien
                            <span class="badge-icon">𓅓</span>
                        </button>
                        <button class="context-btn" data-occasion="soiree">
                            Soirées
                            <span class="badge-icon">𓅓</span>
                        </button>
                        <button class="context-btn" data-occasion="special">
                            Occasions spéciales
                            <span class="badge-icon">𓅓</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Sélection du genre après les questions contextuelles -->
            <div class="gender-selection">
                <p class="gender-intro">Pour finaliser, sélectionnez votre genre :</p>
                <button class="gender-btn" data-gender="feminin" disabled>
                    Pour Femme
                    <span class="icon">𓁐</span>
                </button>
                <button class="gender-btn" data-gender="masculin" disabled>
                    Pour Homme
                    <span class="icon">𓁺</span>
                </button>
            </div>
        </div>
    `;

    // Ajouter les écouteurs d'événements
    addQuizEventListeners(container);
}

// Ajouter cette nouvelle fonction pour gérer les événements
function addQuizEventListeners(container) {
    // Gestion des clics sur les boutons contextuels
    container.querySelectorAll('.context-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Désélectionner les autres boutons du même groupe
            const group = e.target.closest('.context-group');
            group.querySelectorAll('.context-btn').forEach(b => b.classList.remove('selected'));
            
            // Sélectionner le bouton cliqué
            e.target.classList.add('selected');
            
            // Vérifier si toutes les questions ont une réponse
            checkContextCompletion();
        });
    });

    // Gestion des clics sur les boutons de genre
    container.querySelectorAll('.gender-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!validateContextAnswers()) {
                showError("Veuillez répondre à toutes les questions précédentes");
                return;
            }
            
            const gender = e.target.dataset.gender;
            startQuiz(gender);
        });
    });
}

// Ajouter ces nouvelles fonctions de validation
function checkContextCompletion() {
    const age = document.querySelector('.context-btn[data-age].selected');
    const style = document.querySelector('.context-btn[data-style].selected');
    const occasion = document.querySelector('.context-btn[data-occasion].selected');
    
    const genderButtons = document.querySelectorAll('.gender-btn');
    const allAnswered = age && style && occasion;
    
    genderButtons.forEach(btn => {
        if (allAnswered) {
            btn.removeAttribute('disabled');
            btn.classList.add('enabled');
        } else {
            btn.setAttribute('disabled', 'true');
            btn.classList.remove('enabled');
        }
    });
}

function validateContextAnswers() {
    const age = document.querySelector('.context-btn[data-age].selected');
    const style = document.querySelector('.context-btn[data-style].selected');
    const occasion = document.querySelector('.context-btn[data-occasion].selected');
    
    return age && style && occasion;
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'quiz-error';
    errorDiv.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            ${message}
        </div>
    `;
    
    const container = document.querySelector('.quiz-container');
    const existingError = container.querySelector('.quiz-error');
    
    if (existingError) {
        existingError.remove();
    }
    
    container.insertBefore(errorDiv, container.firstChild);
    setTimeout(() => errorDiv.remove(), 3000);
}

// Fonction pour démarrer le quiz
function startQuiz(gender) {
    console.log('Démarrage du quiz pour:', gender);
    
    // Sauvegarder les réponses contextuelles
    userContext = {
        age: document.querySelector('.context-btn[data-age].selected').dataset.age,
        style: document.querySelector('.context-btn[data-style].selected').dataset.style,
        occasion: document.querySelector('.context-btn[data-occasion].selected').dataset.occasion,
        gender: gender
    };
    
    console.log('Contexte utilisateur:', userContext);
    
    // Réinitialiser les variables du quiz
    currentQuestion = 0;
    userAnswers = [];
    
    // Afficher la première question
    showQuestion();
}

// Fonction pour afficher une question
function showQuestion() {
    const container = document.querySelector('.quiz-container');
    const question = quizQuestions[currentQuestion];

    container.innerHTML = `
        <div class="quiz-progress">
            <div class="progress-bar" style="width: ${((currentQuestion + 1) / quizQuestions.length) * 100}%"></div>
        </div>
        <div class="quiz-question">
            <h3>Question ${currentQuestion + 1}/${quizQuestions.length}</h3>
            <p>${question.question}</p>
            <div class="quiz-options">
                ${question.options.map((option, index) => `
                    <button class="quiz-option" data-index="${index}">
                        ${option.text}
                        <span class="option-icon">𓂋</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    // Ajouter les écouteurs d'événements
    container.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', handleAnswer);
    });
}

// Fonction pour gérer les réponses
function handleAnswer(e) {
    const selectedIndex = parseInt(e.target.closest('.quiz-option').dataset.index);
    userAnswers.push(selectedIndex);

    // Ajouter un effet visuel
    e.target.closest('.quiz-option').classList.add('selected');
    
    // Attendre l'animation
    setTimeout(() => {
        if (currentQuestion < quizQuestions.length - 1) {
            currentQuestion++;
            showQuestion();
        } else {
            showResults();
        }
    }, 500);
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM chargé, initialisation...');
    initializeOlfactiveFilters();
    initializeQuiz();
});

// Exécution immédiate pour vérifier que le script est chargé
console.log('Script parfum-guide.js chargé');

// Modifier la fonction showResults pour utiliser le vrai score
function showResults() {
    console.log('Affichage des résultats...');
    const recommendations = getRecommendations();
    const container = document.querySelector('.quiz-container');

    container.innerHTML = `
        <div class="quiz-results">
            <h3>Vos parfums recommandés</h3>
            <p class="results-intro">Basé sur vos réponses, voici notre sélection personnalisée :</p>
            
            <div class="recommendations-grid">
                ${recommendations.map((parfum, index) => `
                    <div class="perfume-recommendation" style="animation-delay: ${index * 0.2}s">
                        <div class="perfume-header">
                            <h4>${parfum.name}</h4>
                            <span class="match-score">
                                <span class="score-number">${parfum.matchScore}%</span>
                                <span class="score-label">de compatibilité</span>
                            </span>
                        </div>
                        
                        <p class="perfume-description">${parfum.description}</p>
                        
                        <div class="perfume-notes">
                            <h5>Notes principales</h5>
                            <div class="notes-list">
                                ${parfum.notes.map(note => `
                                    <span class="note-badge">${note}</span>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="perfume-personality">
                            <h5>Idéal pour</h5>
                            <p>${parfum.occasions}</p>
                        </div>
                        
                        <a href="${parfum.url}" class="discover-btn">
                            Découvrir ${parfum.name}
                            <span class="icon">𓃭</span>
                        </a>
                    </div>
                `).join('')}
            </div>
            
            <button class="restart-quiz" onclick="initializeQuiz()">
                Recommencer le quiz
                <span class="icon">𓅓</span>
            </button>
        </div>
    `;
}
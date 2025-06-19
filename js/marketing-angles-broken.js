/**
 * Marketing Angles Generator - Génère et affiche les angles marketing
 */

console.log('[Marketing Angles] Script marketing-angles.js chargé!');

// Vérifier que callOpenAI est disponible
if (typeof window.callOpenAI === 'function') {
    console.log('[Marketing Angles] ✅ callOpenAI est disponible');
} else {
    console.error('[Marketing Angles] ❌ callOpenAI non disponible');
    console.log('[Marketing Angles] Tentative de réimportation...');
    
    // Fallback: attendre que la fonction soit disponible
    const checkCallOpenAI = setInterval(() => {
        if (typeof window.callOpenAI === 'function') {
            console.log('[Marketing Angles] ✅ callOpenAI maintenant disponible');
            clearInterval(checkCallOpenAI);
        }
    }, 100);
    
    // Arrêter après 5 secondes
    setTimeout(() => {
        clearInterval(checkCallOpenAI);
        if (typeof window.callOpenAI !== 'function') {
            console.error('[Marketing Angles] ❌ callOpenAI toujours non disponible après 5s');
        }
    }, 5000);
}

// Test de disponibilité des fonctions
console.log('[Marketing Angles] Test de chargement des fonctions...');
console.log('[Marketing Angles] window.generateMarketingAngles disponible:', typeof window.generateMarketingAngles);
console.log('[Marketing Angles] window.displayMarketingAngles disponible:', typeof window.displayMarketingAngles);

// Variable globale pour stocker l'angle sélectionné
window.selectedMarketingAngle = null;

// Fonction pour générer les angles marketing
window.generateMarketingAngles = async function(deepResearch, aiModel = null) {
    console.log('[Marketing Angles] === DÉBUT GÉNÉRATION ANGLES MARKETING ===');
    console.log('[Marketing Angles] Deep Research:', deepResearch?.substring(0, 200) + '...');
    
    try {
        // Vérifier que la deep research n'est pas vide
        if (!deepResearch || deepResearch.trim().length < 50) {
            throw new Error('Deep research trop courte pour générer des angles marketing valides');
        }
        
        // Prompt pour générer les angles marketing
        const marketingAnglesPrompt = `Analysez la recherche approfondie suivante et extrayez les angles marketing ayant le plus gros TAM (Total Addressable Market) :

RECHERCHE À ANALYSER :
${deepResearch}

INSTRUCTIONS CRITIQUES :
- Générez un contenu DÉTAILLÉ et COMPLET pour chaque section
- Chaque section DOIT contenir minimum 100-150 mots avec des exemples spécifiques
- Basez-vous uniquement sur les données de recherche fournies
- Fournissez des insights actionnables et des détails concrets
- Soyez spécifique et évitez les généralités
- NE JAMAIS utiliser des placeholders comme "à analyser", "à définir", "en cours d'analyse"
- GÉNÉREZ immédiatement le contenu complet pour toutes les sections
- REMPLACEZ tous les exemples par du vrai contenu basé sur la recherche

Générez une structure pour chaque angle marketing comme suit :

Angle x - Le nom de l'angle marketing pour l'identifier facilement
- Taille du marché : Explication détaillée avec pourcentages, données de marché, tendances, projections de croissance, chiffres spécifiques tirés de la recherche - minimum 100 mots
- Problème à résoudre : Description complète des problèmes urgents et coûteux, défis spécifiques, solutions actuelles défaillantes, points de douleur, impact sur la vie quotidienne - minimum 100 mots
- Peurs et frustrations : Analyse approfondie des peurs spécifiques, frustrations, anxiétés, barrières psychologiques, facteurs de résistance, déclencheurs émotionnels - minimum 100 mots
- Application tactique : Stratégie marketing détaillée avec canaux spécifiques, messages, positionnement, idées de campagnes, stratégies de contenu, étapes de mise en œuvre - minimum 100 mots
- Preuves à l'appui : Citations spécifiques, points de données, statistiques, exemples, témoignages, résultats de recherche extraits directement de la recherche fournie - minimum 80 mots

Répondez UNIQUEMENT dans ce format JSON :
{
  "angles": [
    {
      "id": 1,
      "name": "Nom de l'Angle Marketing (2-3 mots)",
      "marketPercentage": 65,
      "marketSize": "Explication détaillée de la taille du marché avec chiffres et données concrètes de la recherche",
      "problemToSolve": "Description spécifique des problèmes urgents et coûteux que cet angle adresse",
      "fears": "Peurs clés, frustrations, anxiétés que cet angle cible avec détails psychologiques",
      "tacticalApplication": "Application marketing immédiate pour cet angle avec stratégies détaillées",
      "supportingEvidence": "Citations et données spécifiques tirées directement de la recherche"
    }
  ]
}

Générez 3-6 angles marketing basés sur la qualité et la diversité de la recherche. Chaque angle doit avoir un pourcentage de marché réaliste qui contextualise son impact potentiel.`;
        
        // Vérifier que callOpenAI est disponible
        if (typeof callOpenAI !== 'function') {
            throw new Error('callOpenAI function not available');
        }
        
        // Utiliser le modèle AI passé en paramètre, sinon fallback
        const aiToggle = document.getElementById('aiModelToggle');
        let modelToUse = aiModel;
        
        console.log(`[Marketing Angles] Debug modèle - aiModel reçu:`, aiModel, `(type: ${typeof aiModel})`);
        
        if (!modelToUse) {
            // Détecter le modèle depuis le toggle switch
            if (aiToggle && aiToggle.checked) {
                modelToUse = 'claude';
            } else {
                modelToUse = 'chatgpt';
            }
        }
        
        console.log(`[Marketing Angles] Debug modèle - modelToUse final:`, modelToUse, `(type: ${typeof modelToUse})`);
        
        // Forcer des paramètres entiers valides selon le modèle
        let maxTokens = 4000;
        let temperature = 0.7;
        
        // Vérifier que modelToUse est une chaîne avant d'utiliser includes
        const modelString = String(modelToUse || 'chatgpt');
        
        console.log(`[Marketing Angles] Debug modèle - modelString:`, modelString);
        
        if (modelString === 'claude' || modelString.includes('claude')) {
            maxTokens = 4000;
            temperature = 0.7;
        } else {
            maxTokens = 4000;
            temperature = 0.7;
        }
        
        // S'assurer que maxTokens est un entier
        maxTokens = parseInt(maxTokens, 10);
        
        console.log(`[Marketing Angles] Génération avec modèle: "${modelString}", tokens: ${maxTokens} (type: ${typeof maxTokens})`);
        
        // Appel API avec vérification des paramètres
        const response = await callOpenAI(marketingAnglesPrompt, temperature, maxTokens, modelString);
        
        if (!response || typeof response !== 'string') {
            throw new Error('Réponse API invalide');
        }
        
        // Nettoyage et parsing de la réponse
        let cleanedResponse = response.trim();
        
        // Supprimer les markdown code blocks si présents
        cleanedResponse = cleanedResponse.replace(/```json\s*|\s*```/g, '');
        cleanedResponse = cleanedResponse.replace(/```\s*|\s*```/g, '');
        
        try {
            const parsedResponse = JSON.parse(cleanedResponse);
            
            if (!parsedResponse.angles || !Array.isArray(parsedResponse.angles)) {
                throw new Error('Structure JSON invalide');
            }
            
            // Validation et nettoyage des angles
            const validAngles = parsedResponse.angles.filter(angle => 
                angle.name && 
                angle.marketPercentage && 
                angle.problemToSolve
            ).map((angle, index) => ({
                id: index + 1,
                name: angle.name,
                marketPercentage: Math.min(100, Math.max(0, parseInt(angle.marketPercentage) || 0)),
                marketSize: angle.marketSize || 'Taille de marché non spécifiée',
                problemToSolve: angle.problemToSolve || 'Problème non spécifié',
                fears: angle.fears || 'Peurs non spécifiées',
                tacticalApplication: angle.tacticalApplication || 'Application tactique non spécifiée',
                supportingEvidence: angle.supportingEvidence || 'Preuves non spécifiées'
            }));
            
            if (validAngles.length === 0) {
                throw new Error('Aucun angle valide trouvé');
            }
            
            console.log(`[Marketing Angles] ${validAngles.length} angles générés avec succès`);
            return { angles: validAngles };
            
        } catch (parseError) {
            console.error('[Marketing Angles] Erreur parsing JSON:', parseError.message);
            console.error('[Marketing Angles] Réponse brute:', cleanedResponse);
            throw new Error(`Erreur parsing JSON: ${parseError.message}`);
        }
        
    } catch (error) {
        console.error('[Marketing Angles] Erreur lors de la génération:', error.message);
        console.error('[Marketing Angles] Stack trace:', error.stack);
        throw error;
    }
};

// Fonction pour afficher les angles marketing avec le nouveau design interactif
window.displayMarketingAngles = function(anglesData) {
    console.log('[Marketing Angles] === DÉBUT AFFICHAGE ANGLES ===');
    console.log('[Marketing Angles] Affichage des angles:', anglesData);
    
    if (!anglesData || !anglesData.angles || !Array.isArray(anglesData.angles)) {
        console.error('[Marketing Angles] Données d\'angles invalides');
        return;
    }
    
    const angles = anglesData.angles;
    
    // Chercher ou créer le container marketing-angles
    let container = document.getElementById('marketing-angles');
    if (!container) {
        console.log('[Marketing Angles] Création du container marketing-angles');
        container = document.createElement('div');
        container.id = 'marketing-angles';
        container.className = 'marketing-angles-container';
        
        // Chercher un placement approprié SANS perturber l'input existant
        const mainContainer = document.querySelector('.container');
        const appGrid = document.querySelector('.app-grid');
        const inputSection = document.querySelector('.input-section');
        
        // Placement intelligent qui préserve la structure existante
        if (appGrid && inputSection) {
            // Insérer comme nouvel élément après input dans app-grid
            const gridChildren = Array.from(appGrid.children);
            const inputIndex = gridChildren.indexOf(inputSection);
            
            if (inputIndex !== -1 && inputIndex < gridChildren.length - 1) {
                // Insérer après l'input mais avant les autres éléments
                appGrid.insertBefore(container, gridChildren[inputIndex + 1]);
            } else {
                // Ajouter à la fin de app-grid
                appGrid.appendChild(container);
            }
            console.log('[Marketing Angles] Container placé dans app-grid après input');
        } else if (mainContainer) {
            // Fallback: ajouter au container principal
            mainContainer.appendChild(container);
            console.log('[Marketing Angles] Container placé dans container principal');
        } else {
            // Last resort: dans le body
            document.body.appendChild(container);
            console.log('[Marketing Angles] Container placé en fallback dans body');
        }
    } else {
        // Le container existe déjà, on le vide juste
        console.log('[Marketing Angles] Container existant trouvé, réutilisation');
    }
    
    container.innerHTML = '';
    
    // Créer le container principal avec effet de particules
    const mainContainer = document.createElement('div');
    mainContainer.className = 'interactive-angles-container';
    
    // Ajouter le canvas pour les particules en arrière-plan
    const particleCanvas = document.createElement('canvas');
    particleCanvas.className = 'particle-canvas';
    particleCanvas.width = mainContainer.offsetWidth || 800;
    particleCanvas.height = mainContainer.offsetHeight || 600;
    mainContainer.appendChild(particleCanvas);
    
    // Initialiser l'animation des particules
    initParticleAnimation(particleCanvas);
    
    // Header avec animation et icônes
    const header = document.createElement('div');
    header.className = 'angle-selection-header';
    header.innerHTML = `
        <h3>Sélectionnez votre Angle Marketing Stratégique</h3>
        <p>Choisissez l'angle qui correspond le mieux à votre stratégie marketing. Chaque angle a été analysé en fonction de son potentiel de marché et de son impact.</p>
    `;
    mainContainer.appendChild(header);
    
    // Grid des angles avec animations séquentielles
    const anglesGrid = document.createElement('div');
    anglesGrid.className = 'marketing-angles-grid';
    
    angles.forEach((angle, index) => {
        const angleCard = document.createElement('div');
        angleCard.className = 'marketing-angle-card';
        angleCard.style.setProperty('--card-index', index);
        angleCard.dataset.angleIndex = index;
        angleCard.dataset.angleId = angle.id;
        
        angleCard.innerHTML = `
            <div class="selection-indicator">✓</div>
            <div class="angle-header">
                <h3 class="angle-title">${angle.name}</h3>
                <div class="angle-percentage">${angle.marketPercentage}%</div>
            </div>
            
            <div class="angle-description">
                ${angle.problemToSolve}
            </div>
            
            <div class="angle-characteristics">
                <span class="angle-tag">Market Size: ${angle.marketSize || angle.marketPercentage + '% potential'}</span>
                <span class="angle-tag">Focus: Problem-Solving</span>
                <span class="angle-tag">Evidence-Based</span>
            </div>
            
            <div class="angle-impact">
                <div class="angle-impact-icon">✓</div>
                <div class="angle-impact-text">
                    Strategic Impact: ${angle.tacticalApplication}
                </div>
            </div>
        `;
        
        anglesGrid.appendChild(angleCard);
        
        // Animation d'entrée séquentielle
        setTimeout(() => {
            angleCard.classList.add('card-ready');
        }, index * 100);
    });
    
    console.log('[Marketing Angles] Ajout du bouton + pour angle personnalisé');
    const addAngleCard = document.createElement('div');
    addAngleCard.className = 'marketing-angle-card add-angle-card';
    addAngleCard.style.setProperty('--card-index', angles.length);
    
    addAngleCard.innerHTML = `
        <div class="add-angle-content">
            <div class="add-angle-icon">+</div>
            <h3 class="add-angle-title">Ajouter un Angle</h3>
            <p class="add-angle-description">Créez votre propre angle marketing personnalisé</p>
        </div>
    `;
    
    anglesGrid.appendChild(addAngleCard);
    console.log('[Marketing Angles] Bouton + ajouté à la grille');
    
    // Animation d'entrée pour le bouton d'ajout
    setTimeout(() => {
        addAngleCard.classList.add('card-ready');
        console.log('[Marketing Angles] Animation du bouton + activée');
    }, angles.length * 100);
    
    mainContainer.appendChild(anglesGrid);
    
    // Ajouter le bouton de validation avec le nouveau style futuriste
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'angle-selection-actions';
    actionsContainer.innerHTML = `
        <button class="angle-continue-button" id="validateSelectionBtn" disabled>
            <i class="fas fa-rocket"></i> Valider la Sélection Stratégique
        </button>
    `;
    mainContainer.appendChild(actionsContainer);
    
    // Initialiser les événements de sélection
    setupAngleSelection(anglesData);
    
    // Ajouter le container principal au container marketing-angles
    container.appendChild(mainContainer);
    container.style.display = 'block';
    
    // Ajouter les styles si pas encore présents
    addMarketingAnglesStyles();
    
    // Ajouter les event listeners pour les interactions
    setupInteractiveEventListeners();
    
    // Faire défiler vers la section
    container.scrollIntoView({ behavior: 'smooth' });
};

// Fonction pour sélectionner un angle marketing et cacher la section
window.selectMarketingAngle = function(index, angleId) {
    console.log('[Marketing Angles] Sélection de l\'angle:', index, angleId);
    
    // Stocker la sélection
    window.selectedMarketingAngle = {
        index: index,
        id: angleId
    };
    
    // Cacher immédiatement la section marketing-angles
    const container = document.getElementById('marketing-angles');
    if (container) {
        container.style.display = 'none';
        console.log('[Marketing Angles] Section cachée après sélection');
    }
    
    // Optionnel: faire défiler vers l'Output Generator
    const outputSection = document.querySelector('.output-section');
    if (outputSection) {
        outputSection.scrollIntoView({ behavior: 'smooth' });
    }
};

// Fonction d'animation des particules
function initParticleAnimation(canvas) {
    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 50;
    
    // Créer les particules
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.2,
            life: Math.random() * 100
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            // Mettre à jour la position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life++;
            
            // Rebondir sur les bords
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
            
            // Oscillation de l'opacité
            particle.opacity = 0.2 + Math.sin(particle.life * 0.02) * 0.3;
            
            // Dessiner la particule
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(126, 87, 194, ${particle.opacity})`;
            ctx.fill();
            
            // Dessiner les connexions entre particules proches
            particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(126, 87, 194, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Fonction pour gérer les interactions
function setupInteractiveEventListeners() {
    const angleCards = document.querySelectorAll('.marketing-angle-card');
    const selectButtons = document.querySelectorAll('.select-angle-btn');
    
    // Gestion des cartes
    angleCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('hovered');
            // Effet de particules au hover
            createHoverParticles(card);
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hovered');
        });
        
        card.addEventListener('click', () => {
            const angleIndex = card.dataset.angleIndex;
            selectMarketingAngle(parseInt(angleIndex));
        });
    });
    
    // Gestion des boutons de sélection
    selectButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const angleIndex = button.dataset.angleIndex;
            selectMarketingAngle(parseInt(angleIndex));
        });
    });
}

// Fonction pour créer des particules au hover
function createHoverParticles(card) {
    const rect = card.getBoundingClientRect();
    const particleContainer = document.createElement('div');
    particleContainer.className = 'hover-particles';
    card.appendChild(particleContainer);
    
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'hover-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 0.5 + 's';
        particleContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
    
    setTimeout(() => {
        particleContainer.remove();
    }, 1000);
}

// Fonction pour configurer la sélection d'angles
function setupAngleSelection(anglesData) {
    let selectedAngleIndex = null;
    let selectedAngleData = null;
    
    const angleCards = document.querySelectorAll('.marketing-angle-card:not(.add-angle-card)');
    const addAngleCard = document.querySelector('.add-angle-card');
    const validateBtn = document.getElementById('validateSelectionBtn');
    
    // Gestion du bouton d'ajout d'angle personnalisé
    if (addAngleCard) {
        addAngleCard.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('[Marketing Angles] Ouverture du formulaire d\'ajout d\'angle personnalisé');
            showCustomAngleModal(anglesData);
        });
    }
    
    // Gestion de la sélection d'angles via clic sur les cartes
    angleCards.forEach((card, index) => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const angleIndex = parseInt(this.dataset.angleIndex);
            const angleId = this.dataset.angleId;
            
            console.log('[Marketing Angles] Sélection angle:', angleIndex, angleId);
            
            // Désélectionner tous les autres
            angleCards.forEach(c => c.classList.remove('selected'));
            
            // Sélectionner l'angle actuel
            this.classList.add('selected');
            
            // Stocker la sélection
            selectedAngleIndex = angleIndex;
            selectedAngleData = anglesData.angles[angleIndex];
            window.selectedMarketingAngle = selectedAngleData;
            window.selectedMarketingAngleIndex = angleIndex;
            
            // Activer le bouton de validation
            if (validateBtn) {
                validateBtn.disabled = false;
                validateBtn.innerHTML = '<i class="fas fa-rocket"></i> Continuer avec cet Angle';
            }
            
            console.log('[Marketing Angles] Angle sélectionné:', selectedAngleData.name);
        });
    });
    
    // Gestion du bouton de validation
    if (validateBtn) {
        validateBtn.addEventListener('click', function() {
            if (selectedAngleIndex !== null) {
                console.log('[Marketing Angles] Validation de la sélection:', selectedAngleData.name);
                
                // Effet visuel de validation
                this.innerHTML = '<i class="fas fa-check"></i> Sélection Validée !';
                this.disabled = true;
                
                // Cacher la section après un court délai
                setTimeout(() => {
                    const container = document.getElementById('marketing-angles');
                    if (container) {
                        container.style.display = 'none';
                        console.log('[Marketing Angles] Section cachée après validation');
                    }
                    
                    // Déclencher la génération du reste du contenu
                    if (typeof continueGenerationProcess === 'function') {
                        // Récupérer les données du produit
                        const productData = window.currentProductData || {};
                        productData.selectedMarketingAngle = selectedAngleData;
                        
                        // Injecter l'angle sélectionné dans le profil de l'acheteur cible
                        updateBuyerProfileWithSelectedAngle(selectedAngleData);
                        
                        console.log('[Marketing Angles] Déclenchement de la génération du reste du contenu...');
                        continueGenerationProcess(productData);
                    } else {
                        console.warn('[Marketing Angles] Fonction continueGenerationProcess non trouvée');
                        
                        // Toujours injecter l'angle sélectionné même si pas de continuation
                        updateBuyerProfileWithSelectedAngle(selectedAngleData);
                        
                        // Faire défiler vers l'Output Generator
                        const outputSection = document.querySelector('.output-section, .results-section');
                        if (outputSection) {
                            outputSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                }, 1000);
            }
        });
    }
}

// Fonction pour afficher la modal d'ajout d'angle personnalisé
function showCustomAngleModal(anglesData) {
    // Créer la modal
    const modal = document.createElement('div');
    modal.className = 'custom-angle-modal';
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Créer un Angle Marketing Personnalisé</h3>
                <button class="modal-close" type="button">&times;</button>
            </div>
            <div class="modal-body">
                <form id="customAngleForm">
                    <div class="form-group">
                        <label for="angleName">Nom de l'angle marketing *</label>
                        <input type="text" id="angleName" name="angleName" required 
                               placeholder="Ex: Productivité pour Entrepreneurs">
                    </div>
                    
                    <div class="form-group">
                        <label for="angleDescription">Description du problème à résoudre *</label>
                        <textarea id="angleDescription" name="angleDescription" required rows="3"
                                  placeholder="Décrivez le problème principal que cet angle marketing adresse..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="anglePercentage">Pourcentage de marché estimé *</label>
                        <input type="number" id="anglePercentage" name="anglePercentage" required 
                               min="1" max="100" placeholder="Ex: 25">
                    </div>
                    
                    <div class="form-group">
                        <label for="angleTactical">Application tactique</label>
                        <textarea id="angleTactical" name="angleTactical" rows="2"
                                  placeholder="Comment cet angle peut être appliqué stratégiquement..."></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-secondary" id="cancelCustomAngle">Annuler</button>
                <button type="button" class="btn-primary" id="saveCustomAngle">Ajouter l'Angle</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Gestion des événements de la modal
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('#cancelCustomAngle');
    const saveBtn = modal.querySelector('#saveCustomAngle');
    const backdrop = modal.querySelector('.modal-backdrop');
    const form = modal.querySelector('#customAngleForm');
    
    // Fermer la modal
    function closeModal() {
        modal.remove();
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    
    // Sauvegarder l'angle personnalisé
    saveBtn.addEventListener('click', function() {
        const formData = new FormData(form);
        const customAngle = {
            id: 'custom_' + Date.now(),
            name: formData.get('angleName').trim(),
            problemToSolve: formData.get('angleDescription').trim(),
            marketPercentage: parseInt(formData.get('anglePercentage')),
            tacticalApplication: formData.get('angleTactical').trim() || 'Application tactique personnalisée',
            marketSize: formData.get('anglePercentage') + '% potential (estimation personnalisée)',
            isCustom: true
        };
        
        // Validation
        if (!customAngle.name || !customAngle.problemToSolve || !customAngle.marketPercentage) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }
        
        if (customAngle.marketPercentage < 1 || customAngle.marketPercentage > 100) {
            alert('Le pourcentage de marché doit être entre 1 et 100.');
            return;
        }
        
        console.log('[Marketing Angles] Ajout d\'angle personnalisé:', customAngle);
        
        // Ajouter l'angle aux données
        anglesData.angles.push(customAngle);
        
        // Fermer la modal
        closeModal();
        
        // Réafficher les angles avec le nouvel angle
        displayMarketingAngles(anglesData);
    });
    
    // Focus sur le premier champ
    setTimeout(() => {
        modal.querySelector('#angleName').focus();
    }, 100);
}

// Fonction pour mettre à jour le profil de l'acheteur avec l'angle sélectionné
function updateBuyerProfileWithSelectedAngle(angleData) {
    if (!angleData) return;
    
    console.log('[Marketing Angles] Mise à jour du profil avec l\'angle sélectionné:', angleData.name);
    
    // Chercher le conteneur des angles marketing dans le profil
    const marketingAnglesContainer = document.getElementById('marketingAngles');
    
    if (marketingAnglesContainer) {
        const angleHTML = `
            <div class="selected-marketing-angle">
                <div class="angle-badge">
                    <i class="fas fa-star"></i>
                    <span class="badge-text">Angle Sélectionné</span>
                </div>
                <div class="angle-details">
                    <h5 class="angle-name">${angleData.name}</h5>
                    <div class="angle-metrics">
                        <div class="metric">
                            <i class="fas fa-chart-pie"></i>
                            <span>${angleData.marketPercentage}% du marché</span>
                        </div>
                    </div>
                    <div class="angle-description">
                        <div class="desc-section">
                            <strong>Problème ciblé:</strong> ${angleData.problemToSolve}
                        </div>
                        <div class="desc-section">
                            <strong>Application tactique:</strong> ${angleData.tacticalApplication}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        marketingAnglesContainer.innerHTML = angleHTML;
        
        // Ajouter les styles pour l'angle sélectionné
        if (!document.getElementById('selected-angle-styles')) {
            const styles = document.createElement('style');
            styles.id = 'selected-angle-styles';
            styles.textContent = `
                .selected-marketing-angle {
                    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
                    border: 1px solid rgba(102, 126, 234, 0.3);
                    border-radius: 12px;
                    padding: 20px;
                    margin: 10px 0;
                    z-index: 1;
                    box-sizing: border-box;
                }

                .angle-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: linear-gradient(135deg, #667eea 0%, #5e35b1 100%);
                    color: white;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    margin-bottom: 15px;
                }

                .angle-name {
                    color: #667eea;
                    font-size: 1.2rem;
                    font-weight: 700;
                    margin-bottom: 10px;
                }

                .angle-metrics {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 15px;
                }

                .metric {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: #667eea;
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .angle-description .desc-section {
                    margin-bottom: 10px;
                    padding: 10px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 8px;
                    border-left: 3px solid #667eea;
                }

                .desc-section strong {
                    color: #667eea;
                    display: block;
                    margin-bottom: 5px;
                }
            `;
            document.head.appendChild(styles);
        }
        
        console.log('[Marketing Angles] Profil mis à jour avec succès');
    } else {
        console.warn('[Marketing Angles] Container marketingAngles non trouvé dans le profil');
    }
}

// Fonction pour ajouter les styles adaptés au thème
function addMarketingAnglesStyles() {
    // Éviter de dupliquer les styles
    if (document.getElementById('marketing-angles-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'marketing-angles-styles';
    styles.innerHTML = `
        /* Container principal non invasif */
        .interactive-angles-container {
            position: relative;
            width: 100%;
            max-width: 100%;
            min-height: auto;
            background: rgba(20, 20, 40, 0.3);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            overflow: visible;
            padding: 30px 20px;
            margin: 20px 0;
            z-index: 1;
            box-sizing: border-box;
        }

        /* Particle canvas non invasif */
        .particle-canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            border-radius: 20px;
            z-index: -1;
        }

        /* Header plus compact */
        .angles-header {
            text-align: center;
            margin-bottom: 30px;
            position: relative;
            z-index: 5;
        }

        /* Grille plus compacte */
        .marketing-angles-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 25px;
            padding: 0 20px;
            margin: 0 auto;
            max-width: 1000px;
        }

        /* Cartes plus compactes */
        .marketing-angle-card {
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 16px;
            padding: 25px;
            position: relative;
            overflow: hidden;
            cursor: pointer;
            opacity: 0;
            transform: translateY(30px) scale(0.95);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            min-height: auto;
            height: auto;
        }

        .marketing-angle-card.card-ready {
            opacity: 1;
            transform: translateY(0) scale(1);
            transition-delay: calc(var(--card-index) * 0.1s);
        }

        .marketing-angle-card:hover {
            transform: translateY(-5px) scale(1.02);
            border-color: rgba(255, 107, 53, 0.6);
            box-shadow: 0 15px 30px rgba(255, 107, 53, 0.2);
        }

        /* Titre avec pourcentage */
        .angle-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: #ffffff;
            margin: 0 0 15px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        }

        .market-percentage {
            background: linear-gradient(135deg, var(--primary-color, #ff6b35), #ff8c42);
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            white-space: nowrap;
            box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
        }

        /* Insights plus compacts */
        .insights-container {
            display: grid;
            grid-template-columns: 1fr;
            gap: 15px;
            margin-bottom: 20px;
        }

        .insight-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 12px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .insight-content {
            flex: 1;
            min-width: 0;
        }

        .insight-label {
            display: block;
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
        }

        .insight-value {
            font-size: 0.9rem;
            color: #ffffff;
            margin: 0;
            line-height: 1.4;
            overflow: visible;
            text-overflow: visible;
            display: block;
        }

        /* Header de carte compact */
        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .angle-number {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #7e57c2 0%, #5e35b1 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.1rem;
            font-weight: 700;
        }

        .card-status {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            background: #26a69a;
            border-radius: 50%;
            animation: status-blink 2s ease-in-out infinite;
        }

        @keyframes status-blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.3; }
        }

        .status-text {
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.8rem;
        }

        /* Bouton de sélection compact */
        .card-footer {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .select-angle-btn {
            width: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
            padding: 14px 20px;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
            position: relative;
            overflow: hidden;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .select-angle-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.6s ease;
        }

        .select-angle-btn:hover {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 8px 30px rgba(102, 126, 234, 0.5);
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }

        .select-angle-btn:hover::before {
            left: 100%;
        }

        .select-angle-btn i {
            font-size: 1.1rem;
            transition: transform 0.3s ease;
        }

        .select-angle-btn:hover i {
            transform: scale(1.1) rotate(10deg);
        }

        /* Responsive compact */
        @media (max-width: 768px) {
            .interactive-angles-container {
                padding: 20px 15px;
                margin-bottom: 15px;
            }

            .marketing-angles-grid {
                grid-template-columns: 1fr;
                gap: 20px;
                padding: 0 10px;
                max-width: 100%;
            }

            .marketing-angle-card {
                padding: 20px;
                min-height: auto;
                height: auto;
            }

            .insights-container {
                grid-template-columns: 1fr;
                gap: 12px;
            }

            .insight-value {
                overflow: visible;
                text-overflow: visible;
                display: block;
            }

            .angle-description {
                font-size: 0.85rem;
                line-height: 1.4;
            }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
            .marketing-angles-grid {
                max-width: 900px;
                gap: 20px;
            }
            
            .marketing-angle-card {
                min-height: auto;
                height: auto;
            }

            .insight-value {
                overflow: visible;
                text-overflow: visible;
                display: block;
            }
        }
        
        /* Assurer la compatibilité avec la structure existante */
        .marketing-angles-container {
            display: block;
            position: relative;
        }
        
        /* Actions Container */
        .angle-selection-actions {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
        }

        /* Bouton Continuer amélioré */
        .angle-continue-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
            padding: 16px 32px;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
            position: relative;
            overflow: hidden;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .angle-continue-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.6s ease;
        }

        .angle-continue-button:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 8px 30px rgba(102, 126, 234, 0.5);
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }

        .angle-continue-button:hover::before {
            left: 100%;
        }

        .angle-continue-button:disabled {
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.4);
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .angle-continue-button:disabled:hover {
            transform: none;
            box-shadow: none;
        }

        .angle-continue-button i {
            font-size: 1.2rem;
            transition: transform 0.3s ease;
        }

        .angle-continue-button:hover i {
            transform: scale(1.2) rotate(15deg);
        }

        .angle-continue-button:disabled i {
            transform: none;
        }
        
        /* Styles pour le bouton d'ajout d'angle */
        .add-angle-card {
            background: rgba(102, 126, 234, 0.1) !important;
            border: 2px dashed rgba(102, 126, 234, 0.4) !important;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 200px;
        }
        
        .add-angle-card:hover {
            background: rgba(102, 126, 234, 0.15) !important;
            border-color: rgba(102, 126, 234, 0.6) !important;
            transform: translateY(-5px) scale(1.02);
        }
        
        .add-angle-content {
            text-align: center;
            color: #667eea;
        }
        
        .add-angle-icon {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 15px;
            opacity: 0.8;
            transition: all 0.3s ease;
        }
        
        .add-angle-card:hover .add-angle-icon {
            opacity: 1;
            transform: scale(1.1);
        }
        
        .add-angle-title {
            font-size: 1.2rem;
            margin: 10px 0 5px 0;
            color: #667eea;
        }
        
        .add-angle-description {
            font-size: 0.9rem;
            opacity: 0.8;
            margin: 0;
        }
        
        /* Styles pour la modal */

```

Follow these instructions to make the following change to my code document.

Instruction: Supprimer les styles dupliqués du bouton add-angle et terminer correctement le fichier

Code Edit:
```
        .angle-continue-button:disabled i {
            transform: none;
        }
    `;
    
    document.head.appendChild(styles);
}

// Logs de confirmation du chargement
console.log('[Marketing Angles] === FONCTIONS CHARGÉES ===');
console.log('[Marketing Angles] window.generateMarketingAngles:', typeof window.generateMarketingAngles);
console.log('[Marketing Angles] window.displayMarketingAngles:', typeof window.displayMarketingAngles);
console.log('[Marketing Angles] === FIN CHARGEMENT ===');

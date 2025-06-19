/**
 * Module de génération et gestion des angles marketing
 */

// Variables globales pour les angles marketing
window.generatedMarketingAngles = [];
window.selectedMarketingAngle = null;

// Fonction principale pour générer les angles marketing
window.generateMarketingAngles = async function(productData) {
    console.log('[Marketing Angles] === DÉBUT GÉNÉRATION ANGLES ===');
    console.log('[Marketing Angles] Données produit reçues:', productData);
    console.log('[Marketing Angles] Type de productData:', typeof productData);
    console.log('[Marketing Angles] productData est null?', productData === null);
    console.log('[Marketing Angles] productData est undefined?', productData === undefined);
    
    if (productData) {
        console.log('[Marketing Angles] productData.productName:', productData.productName);
        console.log('[Marketing Angles] Type de productName:', typeof productData.productName);
        console.log('[Marketing Angles] productName est vide?', productData.productName === '');
        console.log('[Marketing Angles] productName est null?', productData.productName === null);
        console.log('[Marketing Angles] productName est undefined?', productData.productName === undefined);
    }
    
    if (!productData || !productData.productName) {
        console.error('[Marketing Angles] Données produit manquantes');
        console.error('[Marketing Angles] Condition échouée: !productData =', !productData);
        console.error('[Marketing Angles] Condition échouée: !productData.productName =', !productData.productName);
        
        // Solution de contournement : utiliser un nom par défaut si productName est vide
        if (productData && (!productData.productName || productData.productName.trim() === '')) {
            console.warn('[Marketing Angles] ProductName vide ou contient seulement des espaces, utilisation d\'un nom par défaut');
            productData.productName = 'Produit à analyser';
            console.log('[Marketing Angles] ProductName défini à:', productData.productName);
        } else {
            console.error('[Marketing Angles] ProductData complètement manquant, arrêt de la génération');
            return [];
        }
    }
    
    try {
        const prompt = `
Analysez ce produit et générez 5 angles marketing distincts et percutants :

**PRODUIT :**
- Titre : ${productData.productName}
- Description : ${productData.productDescription || 'Non spécifiée'}
- Prix : ${productData.price || 'Non spécifié'}
- Catégorie : ${productData.category || 'Non spécifiée'}

**INSTRUCTIONS :**
1. Créez 5 angles marketing uniques et différenciés
2. Chaque angle doit cibler un segment de marché ou un besoin spécifique
3. Variez les approches : émotionnel, rationnel, social, économique, etc.
4. Assurez-vous que chaque angle soit authentique et pertinent

**FORMAT DE RÉPONSE (JSON uniquement) :**
{
  "angles": [
    {
      "name": "Nom court de l'angle (max 30 caractères)",
      "target": "Segment cible principal",
      "approach": "Type d'approche (émotionnel/rationnel/social/etc.)",
      "description": "Description détaillée de l'angle marketing (2-3 phrases)",
      "keyMessage": "Message clé principal",
      "marketShare": nombre entre 15 et 35
    }
  ]
}
`;

        console.log('[Marketing Angles] Envoi de la requête à l\'API...');
        const response = await window.callOpenAI(prompt, 0.7, 1000, productData.aiModel || 'chatgpt');
        console.log('[Marketing Angles] Réponse brute de l\'API:', response);

        if (!response) {
            throw new Error('Aucune réponse de l\'API');
        }

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(response);
        } catch (parseError) {
            console.error('[Marketing Angles] Erreur de parsing JSON:', parseError);
            console.log('[Marketing Angles] Tentative d\'extraction JSON...');
            
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                parsedResponse = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('Impossible d\'extraire le JSON de la réponse');
            }
        }

        if (!parsedResponse.angles || !Array.isArray(parsedResponse.angles)) {
            throw new Error('Format de réponse invalide');
        }

        // Traitement et validation des angles
        const processedAngles = parsedResponse.angles.map((angle, index) => ({
            id: `angle_${Date.now()}_${index}`,
            name: angle.name || `Angle ${index + 1}`,
            target: angle.target || 'Segment général',
            approach: angle.approach || 'Mixte',
            description: angle.description || 'Description non disponible',
            keyMessage: angle.keyMessage || 'Message non spécifié',
            marketShare: angle.marketShare || Math.floor(Math.random() * 20) + 15,
            isCustom: false
        }));

        window.generatedMarketingAngles = processedAngles;
        console.log('[Marketing Angles] Angles générés avec succès:', processedAngles);
        
        // Mettre à jour le badge avec le nombre d'angles générés
        window.updateMarketingAngleBadge();
        
        return processedAngles;

    } catch (error) {
        console.error('[Marketing Angles] Erreur lors de la génération:', error);
        throw error; // Propager l'erreur au lieu d'utiliser un fallback
    }
};

// Fonction pour afficher les angles marketing
window.displayMarketingAngles = function(angles) {
    console.log('[Marketing Angles] === DÉBUT AFFICHAGE ANGLES ===');
    console.log('[Marketing Angles] Angles à afficher:', angles);
    
    const anglesContainer = document.querySelector('#marketingAngleContent');
    if (!anglesContainer) {
        console.error('[Marketing Angles] Conteneur #marketingAngleContent non trouvé');
        return;
    }

    // Vider le conteneur
    anglesContainer.innerHTML = '';
    
    if (!angles || angles.length === 0) {
        anglesContainer.innerHTML = '<p class="no-angles">Aucun angle marketing disponible</p>';
        return;
    }

    // Créer les cartes d'angles
    angles.forEach((angle, index) => {
        const angleCard = document.createElement('div');
        angleCard.className = 'marketing-angle-card';
        angleCard.dataset.angleId = angle.id;
        angleCard.style.setProperty('--card-index', index);
        
        angleCard.innerHTML = `
            <div class="angle-header">
                <h4 class="angle-title">${angle.name}</h4>
                <div class="angle-impact">
                    <span class="impact-percentage">${angle.marketShare}%</span>
                    <span class="impact-label">du marché</span>
                </div>
            </div>
            
            <div class="angle-content">
                <div class="angle-target">
                    <strong>Cible :</strong> ${angle.target}
                </div>
                <div class="angle-approach">
                    <strong>Approche :</strong> ${angle.approach}
                </div>
                <div class="angle-description">
                    ${angle.description}
                </div>
                <div class="angle-key-message">
                    <strong>Message clé :</strong> ${angle.keyMessage}
                </div>
            </div>
            
            <div class="selection-indicator">
                <i class="fas fa-check-circle"></i>
                <span>Sélectionné</span>
            </div>
        `;
        
        // Ajouter l'événement de clic
        angleCard.addEventListener('click', () => {
            window.selectMarketingAngle(angle.id);
        });
        
        anglesContainer.appendChild(angleCard);
        console.log('[Marketing Angles] Carte ajoutée pour:', angle.name);
    });

    // Déclencher les animations d'entrée
    setTimeout(() => {
        const cards = document.querySelectorAll('.marketing-angle-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('card-ready');
            }, index * 100);
        });
    }, 100);

    console.log('[Marketing Angles] === FIN AFFICHAGE ANGLES ===');
};

// Fonction pour sélectionner un angle marketing
window.selectMarketingAngle = function(index, angleId) {
    // Si un seul paramètre est fourni, c'est l'angleId
    if (arguments.length === 1) {
        angleId = index;
    }
    
    console.log('[Marketing Angles] === SÉLECTION ANGLE ===');
    console.log('[Marketing Angles] ID angle:', angleId);
    
    const selectedAngle = window.generatedMarketingAngles.find(angle => angle.id === angleId);
    
    if (!selectedAngle) {
        console.error('[Marketing Angles] Angle non trouvé:', angleId);
        return;
    }
    
    // Désélectionner tous les autres angles
    document.querySelectorAll('.marketing-angle-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Sélectionner le nouvel angle
    const selectedCard = document.querySelector(`[data-angle-id="${angleId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        console.log('[Marketing Angles] Carte sélectionnée visuellement');
    }
    
    // Stocker la sélection
    window.selectedMarketingAngle = selectedAngle;
    console.log('[Marketing Angles] Angle stocké:', selectedAngle);
    
    // Activer le bouton de continuation
    const continueButton = document.querySelector('.angle-continue-button');
    if (continueButton) {
        continueButton.disabled = false;
        continueButton.innerHTML = '<i class="fas fa-rocket"></i> Continuer avec cet angle';
        console.log('[Marketing Angles] Bouton continuer activé');
    }
    
    console.log('[Marketing Angles] === FIN SÉLECTION ANGLE ===');
};

// Fonction pour afficher la modal d'angle personnalisé
window.showCustomAngleModal = function() {
    console.log('[Marketing Angles] Ouverture de la modal d\'angle personnalisé');
    
    // Créer la modal
    const modal = document.createElement('div');
    modal.className = 'custom-angle-modal';
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Créer un Angle Marketing Personnalisé</h3>
                <button class="modal-close" onclick="window.closeCustomAngleModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="customAngleName">Nom de l'angle</label>
                    <input type="text" id="customAngleName" placeholder="Ex: Écologique et Responsable" maxlength="30">
                </div>
                <div class="form-group">
                    <label for="customAngleTarget">Cible principale</label>
                    <input type="text" id="customAngleTarget" placeholder="Ex: Consommateurs éco-responsables">
                </div>
                <div class="form-group">
                    <label for="customAngleApproach">Type d'approche</label>
                    <input type="text" id="customAngleApproach" placeholder="Ex: Émotionnel, Rationnel, Social">
                </div>
                <div class="form-group">
                    <label for="customAngleDescription">Description de l'angle</label>
                    <textarea id="customAngleDescription" rows="3" placeholder="Décrivez comment cet angle positionne votre produit..."></textarea>
                </div>
                <div class="form-group">
                    <label for="customAngleMessage">Message clé</label>
                    <input type="text" id="customAngleMessage" placeholder="Ex: Choisissez l'avenir durable">
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="window.closeCustomAngleModal()">Annuler</button>
                <button class="btn-primary" onclick="window.createCustomAngle()">Créer l'Angle</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fermer avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            window.closeCustomAngleModal();
        }
    });
    
    // Fermer en cliquant sur le backdrop
    modal.querySelector('.modal-backdrop').addEventListener('click', window.closeCustomAngleModal);
};

// Fonction pour fermer la modal
window.closeCustomAngleModal = function() {
    const modal = document.querySelector('.custom-angle-modal');
    if (modal) {
        modal.remove();
    }
};

// Fonction pour créer un angle personnalisé
window.createCustomAngle = function() {
    console.log('[Marketing Angles] Création d\'un angle personnalisé');
    
    const name = document.getElementById('customAngleName').value.trim();
    const target = document.getElementById('customAngleTarget').value.trim();
    const approach = document.getElementById('customAngleApproach').value.trim();
    const description = document.getElementById('customAngleDescription').value.trim();
    const message = document.getElementById('customAngleMessage').value.trim();
    
    if (!name || !target || !description) {
        alert('Veuillez remplir au minimum le nom, la cible et la description.');
        return;
    }
    
    const customAngle = {
        id: `custom_${Date.now()}`,
        name: name,
        target: target,
        approach: approach || 'Personnalisé',
        description: description,
        keyMessage: message || 'Message personnalisé',
        marketShare: Math.floor(Math.random() * 15) + 20, // Entre 20 et 35%
        isCustom: true
    };
    
    // Ajouter l'angle à la liste
    window.generatedMarketingAngles.push(customAngle);
    
    // Mettre à jour le badge avec le nouveau nombre d'angles
    window.updateMarketingAngleBadge();
    
    // Marquer cet angle comme nouvellement créé pour le sélectionner automatiquement
    window.newlyCreatedAngleId = customAngle.id;
    
    // Fermer la modal
    window.closeCustomAngleModal();
    
    // Rafraîchir l'affichage
    if (typeof window.refreshMarketingAngleSection === 'function') {
        window.refreshMarketingAngleSection();
    } else {
        window.displayMarketingAngles(window.generatedMarketingAngles);
    }
    
    console.log('[Marketing Angles] Angle personnalisé créé:', customAngle);
};

// Logs de confirmation du chargement
console.log('[Marketing Angles] === FONCTIONS CHARGÉES ===');
console.log('[Marketing Angles] window.generateMarketingAngles:', typeof window.generateMarketingAngles);
console.log('[Marketing Angles] window.displayMarketingAngles:', typeof window.displayMarketingAngles);
console.log('[Marketing Angles] === FIN CHARGEMENT ===');

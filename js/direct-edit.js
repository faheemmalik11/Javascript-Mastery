/**
 * Module de gestion des fonctionnalités d'édition directe sur tous les éléments
 */

// Attendre que le document soit chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initialisation du module d\'édition directe');
    
    // Observer les changements dans le DOM pour ajouter les boutons automatiquement
    setupContentObserver();
    
    // Initialiser les événements de validation
    setupValidationEvents();
});

/**
 * Configure l'observateur de mutations pour observer les changements dans le DOM
 */
function setupContentObserver() {
    let isProcessing = false;
    
    // Configuration de l'observateur
    const observer = new MutationObserver((mutations) => {
        // Éviter les boucles infinies
        if (isProcessing) return;
        
        let needsUpdate = false;
        
        mutations.forEach((mutation) => {
            // Ignorer les changements sur les boutons d'édition
            if (mutation.target && (
                mutation.target.classList?.contains('edit-btn') ||
                mutation.target.classList?.contains('edit-overlay') ||
                mutation.target.closest?.('.edit-btn') ||
                mutation.target.closest?.('.edit-overlay')
            )) {
                return;
            }
            
            if (mutation.type === 'childList') {
                // Vérifier si de nouveaux éléments de contenu ont été ajoutés
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && 
                        (node.classList?.contains('content-section') || 
                         node.querySelector?.('.content-section'))) {
                        needsUpdate = true;
                    }
                });
            }
        });
        
        if (needsUpdate) {
            isProcessing = true;
            setTimeout(() => {
                addEditorsToDynamicContent();
                isProcessing = false;
            }, 100);
        }
    });
    
    // Options de l'observateur (observer seulement les changements de structure)
    const config = { 
        childList: true, 
        subtree: true
    };
    
    // Démarrer l'observation sur les sections qui contiennent du contenu éditable
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
        observer.observe(resultsSection, config);
        console.log('Observateur configuré pour la section des résultats');
    }
}

/**
 * Ajoute des éditeurs à tous les éléments éditables du contenu dynamique
 */
function addEditorsToDynamicContent() {
    // Vérifier si du contenu est présent avant de traiter
    const resultsSection = document.getElementById('resultsSection');
    if (!resultsSection || !resultsSection.querySelector('.content-section')) {
        return;
    }
    
    console.log('Recherche de contenu éditable...');
    
    // Obtenir tous les types de contenus sauf l'analyse psychographique et la synthèse stratégique
    const contentTabs = [
        { id: 'tab3', section: 'productTitle' },
        { id: 'tab4', section: 'productBenefits' },
        { id: 'tab5', section: 'howItWorks' },
        { id: 'tab6', section: 'emotionalBenefits' },
        { id: 'tab7', section: 'useCases' },
        { id: 'tab8', section: 'characteristics' },
        { id: 'tab9', section: 'competitiveAdvantages' },
        { id: 'tab10', section: 'customerReviews' },
        { id: 'tab11', section: 'faq' }
    ];
    
    // Parcourir tous les contenus
    contentTabs.forEach(tab => {
        const section = document.getElementById(tab.section);
        if (!section) return;
        
        // Traiter chaque type de contenu différemment
        switch (tab.section) {
            case 'productTitle':
                addEditorsToTitles(section);
                break;
            case 'productBenefits':
                addEditorsToBenefits(section);
                break;
            case 'howItWorks':
                addEditorsToHowItWorks(section);
                break;
            case 'emotionalBenefits':
                addEditorsToEmotionalBenefits(section);
                break;
            case 'useCases':
                addEditorsToUseCases(section);
                break;
            case 'characteristics':
                addEditorsToCharacteristics(section);
                break;
            case 'competitiveAdvantages':
                addEditorsToCompetitiveAdvantages(section);
                break;
            case 'customerReviews':
                addEditorsToCustomerReviews(section);
                break;
            case 'faq':
                addEditorsToFAQ(section);
                break;
        }
    });
}

/**
 * Ajoute un bouton d'édition à un élément
 * @param {HTMLElement} element - L'élément à rendre éditable
 * @param {string} label - Le label pour l'élément
 */
function addEditButton(element, label) {
    if (!element || element.querySelector('.direct-edit-btn')) return;
    
    // Assurer que l'élément est positionné relativement
    element.style.position = 'relative';
    element.style.paddingRight = '70px';
    
    // Créer le bouton d'édition
    const editBtn = document.createElement('button');
    editBtn.className = 'direct-edit-btn';
    editBtn.innerHTML = '<i class="fas fa-pen"></i> Éditer';
    editBtn.title = `Éditer: ${label}`;
    
    // Positionner le bouton
    editBtn.style.position = 'absolute';
    editBtn.style.top = '2px';
    
    // Vérifier s'il y a un sélecteur de version pour ajuster la position
    const hasVersionSelector = element.querySelector('.version-selector');
    if (hasVersionSelector) {
        editBtn.style.right = '120px'; // Décaler vers la gauche pour éviter la superposition
    } else {
        editBtn.style.right = '2px'; // Position normale
    }
    
    editBtn.style.padding = '2px 8px';
    editBtn.style.background = '#4ba3e3';
    editBtn.style.color = 'white';
    editBtn.style.border = 'none';
    editBtn.style.borderRadius = '4px';
    editBtn.style.cursor = 'pointer';
    editBtn.style.fontSize = '12px';
    editBtn.style.zIndex = '1000';
    
    // Ajouter le gestionnaire d'événements
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Empêcher la propagation (important pour les éléments cliquables)
        openEditDialog(element, label);
    });
    
    // Ajouter le bouton à l'élément
    element.appendChild(editBtn);
}

/**
 * Ouvre une boîte de dialogue pour éditer le contenu
 * @param {HTMLElement} element - L'élément à éditer
 * @param {string} label - Le label pour l'élément
 */
function openEditDialog(element, label) {
    // Récupérer le contenu actuel
    let content = '';
    let title = '';
    let description = '';
    
    if (element.querySelector('.benefit-title, .emotional-benefit-title, .use-case-title, .characteristic-title, .review-title, .faq-question')) {
        // Élément avec titre et description
        title = element.querySelector('.benefit-title, .emotional-benefit-title, .use-case-title, .characteristic-title, .review-title, .faq-question').textContent.trim();
        description = element.querySelector('.benefit-text, .emotional-benefit-text, .use-case-explanation, .characteristic-explanation, .review-description, .faq-answer').textContent.trim();
        content = `${title}\n\n${description}`;
    } else {
        // Élément texte simple
        content = element.textContent.trim();
    }
    
    // Nettoyer les préfixes comme "Question 1:", "Titre:", etc.
    content = content.replace(/^(Question|Réponse|Titre|Auteur)\s*\d*\s*:\s*/gi, '');
    
    // Créer la boîte de dialogue
    const dialog = document.createElement('div');
    dialog.className = 'edit-dialog';
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.padding = '20px';
    dialog.style.background = 'white';
    dialog.style.boxShadow = '0 0 20px rgba(0,0,0,0.3)';
    dialog.style.borderRadius = '8px';
    dialog.style.zIndex = '2000';
    dialog.style.width = '80%';
    dialog.style.maxWidth = '600px';
    
    // Ajouter le contenu
    dialog.innerHTML = `
        <h3 style="margin-top: 0; margin-bottom: 15px;">Éditer: ${label}</h3>
        <textarea style="width: 100%; min-height: 150px; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 4px;">${content}</textarea>
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button class="cancel-btn" style="padding: 8px 15px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Annuler</button>
            <button class="save-btn" style="padding: 8px 15px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Sauvegarder</button>
        </div>
    `;
    
    // Créer un overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0,0,0,0.5)';
    overlay.style.zIndex = '1999';
    
    // Ajouter au document
    document.body.appendChild(overlay);
    document.body.appendChild(dialog);
    
    // Focus sur la zone de texte
    dialog.querySelector('textarea').focus();
    
    // Gestionnaire pour l'annulation
    dialog.querySelector('.cancel-btn').addEventListener('click', () => {
        overlay.remove();
        dialog.remove();
    });
    
    // Gestionnaire pour la sauvegarde
    dialog.querySelector('.save-btn').addEventListener('click', () => {
        const newContent = dialog.querySelector('textarea').value;
        updateElementContent(element, newContent);
        overlay.remove();
        dialog.remove();
    });
}

/**
 * Met à jour le contenu d'un élément
 * @param {HTMLElement} element - L'élément à mettre à jour
 * @param {string} content - Le nouveau contenu
 */
function updateElementContent(element, content) {
    // Diviser le contenu en titre et description si nécessaire
    const parts = content.split('\n\n');
    
    if (element.querySelector('.benefit-title, .emotional-benefit-title, .use-case-title, .characteristic-title, .review-title, .faq-question')) {
        // Élément avec titre et description
        const titleEl = element.querySelector('.benefit-title, .emotional-benefit-title, .use-case-title, .characteristic-title, .review-title, .faq-question');
        const descEl = element.querySelector('.benefit-text, .emotional-benefit-text, .use-case-explanation, .characteristic-explanation, .review-description, .faq-answer');
        
        if (parts.length >= 2) {
            // Mettre à jour titre et description séparément
            if (titleEl) titleEl.textContent = parts[0];
            if (descEl) descEl.textContent = parts[1];
        } else {
            // Tout mettre dans le titre si pas de séparation
            if (titleEl) titleEl.textContent = content;
        }
    } else {
        // Élément texte simple
        element.textContent = content;
        
        // Réajouter le bouton d'édition qui a été supprimé
        addEditButton(element, 'Contenu');
    }
}

// Fonctions spécifiques pour ajouter des éditeurs à chaque type de contenu
function addEditorsToTitles(section) {
    const items = section.querySelectorAll('.title-tag, .product-title-item');
    items.forEach((item, index) => {
        addEditButton(item, `Titre ${index + 1}`);
    });
}

function addEditorsToBenefits(section) {
    const items = section.querySelectorAll('.benefit-item, li');
    items.forEach((item, index) => {
        addEditButton(item, `Avantage ${index + 1}`);
    });
}

function addEditorsToHowItWorks(section) {
    const items = section.querySelectorAll('.version-content, .content-text');
    items.forEach((item, index) => {
        if (!item.closest('.version-selector')) {
            addEditButton(item, `Comment ça marche`);
        }
    });
}

function addEditorsToEmotionalBenefits(section) {
    const items = section.querySelectorAll('.emotional-benefit-item');
    items.forEach((item, index) => {
        addEditButton(item, `Bénéfice émotionnel ${index + 1}`);
    });
}

function addEditorsToUseCases(section) {
    const items = section.querySelectorAll('.use-case-item');
    items.forEach((item, index) => {
        addEditButton(item, `Cas d'utilisation ${index + 1}`);
    });
}

function addEditorsToCharacteristics(section) {
    const items = section.querySelectorAll('.characteristic-item');
    items.forEach((item, index) => {
        addEditButton(item, `Caractéristique ${index + 1}`);
    });
}

function addEditorsToCompetitiveAdvantages(section) {
    const items = section.querySelectorAll('.competitive-advantage-item, li');
    items.forEach((item, index) => {
        addEditButton(item, `Avantage concurrentiel ${index + 1}`);
    });
}

function addEditorsToCustomerReviews(section) {
    const items = section.querySelectorAll('.customer-review-item, .review-item');
    items.forEach((item, index) => {
        addEditButton(item, `Avis client ${index + 1}`);
    });
}

function addEditorsToFAQ(section) {
    const items = section.querySelectorAll('.faq-item, .selected-faq-item');
    items.forEach((item, index) => {
        addEditButton(item, `Question FAQ ${index + 1}`);
    });
}

/**
 * Configure les événements pour activer les boutons d'édition après validation
 */
function setupValidationEvents() {
    // Attacher des gestionnaires aux boutons de validation
    const validationButtons = [
        'validateProductTitleBtn',
        'validateBenefitsBtn',
        'validateEmotionalBenefitsBtn',
        'validateUseCasesBtn',
        'validateCharacteristicsBtn',
        'validateCompetitiveAdvantagesBtn',
        'validateCustomerReviewsBtn',
        'validateFAQBtn'
    ];
    
    validationButtons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', () => {
                // Attendre que le DOM soit mis à jour
                setTimeout(() => {
                    addEditorsToDynamicContent();
                }, 300);
            });
        }
    });
}

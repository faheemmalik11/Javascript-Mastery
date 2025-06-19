/**
 * Fonctions de gestion des sélections pour l'interface utilisateur
 */

// Variables globales pour stocker les sélections
window.selectedProductTitle = '';
window.selectedBenefits = [];
window.selectedEmotionalBenefits = [];
window.selectedUseCases = [];
window.selectedCharacteristics = [];
window.selectedCompetitiveAdvantages = [];
window.selectedCustomerReviews = [];
window.selectedFAQs = [];

// Configuration des gestionnaires d'événements pour les boutons de validation
function setupValidationButtonHandlers() {
    // Gestionnaire pour le bouton de validation des avantages
    document.addEventListener('click', function(event) {
        if (event.target.id === 'validateBenefitsBtn' || event.target.classList.contains('validate-benefits-btn')) {
            event.preventDefault();
            if (window.selectedBenefits.length === 4) {
                console.log('[Validation] Avantages validés:', window.selectedBenefits);
                event.target.textContent = `✓ Validé (${window.selectedBenefits.length})`;
                event.target.style.backgroundColor = '#28a745';
                event.target.style.color = 'white';
                // Ici vous pouvez ajouter la logique pour passer à l'étape suivante
            } else {
                updateButtonText(event.target, window.selectedBenefits.length, 4, 'avantages');
            }
        }
        
        // Gestionnaire pour les avantages émotionnels
        if (event.target.classList.contains('validate-emotional-benefits-btn')) {
            event.preventDefault();
            if (window.selectedEmotionalBenefits.length === 2) {
                console.log('[Validation] Avantages émotionnels validés:', window.selectedEmotionalBenefits);
                event.target.textContent = `✓ Validé (${window.selectedEmotionalBenefits.length})`;
                event.target.style.backgroundColor = '#28a745';
                event.target.style.color = 'white';
            } else {
                updateButtonText(event.target, window.selectedEmotionalBenefits.length, 2, 'avantages émotionnels');
            }
        }
        
        // Gestionnaire pour les cas d'usage
        if (event.target.classList.contains('validate-use-cases-btn')) {
            event.preventDefault();
            if (window.selectedUseCases.length >= 3) {
                console.log('[Validation] Cas d\'usage validés:', window.selectedUseCases);
                event.target.textContent = `✓ Validé (${window.selectedUseCases.length})`;
                event.target.style.backgroundColor = '#28a745';
                event.target.style.color = 'white';
            } else {
                updateButtonText(event.target, window.selectedUseCases.length, 3, 'cas d\'usage', true);
            }
        }
        
        // Gestionnaire pour les caractéristiques
        if (event.target.classList.contains('validate-characteristics-btn')) {
            event.preventDefault();
            if (window.selectedCharacteristics.length === 4) {
                console.log('[Validation] Caractéristiques validées:', window.selectedCharacteristics);
                event.target.textContent = `✓ Validé (${window.selectedCharacteristics.length})`;
                event.target.style.backgroundColor = '#28a745';
                event.target.style.color = 'white';
            } else {
                updateButtonText(event.target, window.selectedCharacteristics.length, 4, 'caractéristiques');
            }
        }
        
        // Gestionnaire pour les avantages concurrentiels
        if (event.target.classList.contains('validate-competitive-advantages-btn')) {
            event.preventDefault();
            if (window.selectedCompetitiveAdvantages.length === 4) {
                console.log('[Validation] Avantages concurrentiels validés:', window.selectedCompetitiveAdvantages);
                event.target.textContent = `✓ Validé (${window.selectedCompetitiveAdvantages.length})`;
                event.target.style.backgroundColor = '#28a745';
                event.target.style.color = 'white';
            } else {
                updateButtonText(event.target, window.selectedCompetitiveAdvantages.length, 4, 'avantages concurrentiels');
            }
        }
        
        // Gestionnaire pour les avis clients
        if (event.target.classList.contains('validate-reviews-btn') || event.target.id === 'validate-reviews-btn') {
            event.preventDefault();
            if (window.selectedCustomerReviews && window.selectedCustomerReviews.length === 6) {
                console.log('[Validation] Avis clients validés:', window.selectedCustomerReviews);
                event.target.textContent = `✓ Validé (${window.selectedCustomerReviews.length})`;
                event.target.style.backgroundColor = '#28a745';
                event.target.style.color = 'white';
            } else {
                updateButtonText(event.target, window.selectedCustomerReviews ? window.selectedCustomerReviews.length : 0, 6, 'avis clients');
            }
        }
        
        // Gestionnaire pour les FAQ
        if (event.target.classList.contains('validate-faq-btn')) {
            event.preventDefault();
            if (window.selectedFAQs && window.selectedFAQs.length === 4) {
                console.log('[Validation] FAQ validées:', window.selectedFAQs);
                event.target.textContent = `✓ Validé (${window.selectedFAQs.length})`;
                event.target.style.backgroundColor = '#28a745';
                event.target.style.color = 'white';
            } else {
                updateButtonText(event.target, window.selectedFAQs ? window.selectedFAQs.length : 0, 4, 'FAQ');
            }
        }
    });
}

// Fonction pour mettre à jour le texte du bouton avec le nombre de sélections
function updateButtonText(button, currentCount, requiredCount, itemType, isMinimum = false) {
    if (isMinimum) {
        button.textContent = `Valider ${currentCount}/${requiredCount}+ ${itemType}`;
    } else {
        button.textContent = `Valider ${currentCount}/${requiredCount} ${itemType}`;
    }
    
    // Changer la couleur selon le statut
    if ((isMinimum && currentCount >= requiredCount) || (!isMinimum && currentCount === requiredCount)) {
        button.style.backgroundColor = '#28a745'; // Vert si complet
        button.style.color = 'white';
    } else {
        button.style.backgroundColor = '#dc3545'; // Rouge si incomplet
        button.style.color = 'white';
    }
}

// Fonction pour mettre à jour le bouton de validation
function updateValidationButton(buttonId, currentCount, requiredCount, itemType) {
    const button = document.getElementById(buttonId);
    if (button) {
        if (currentCount === requiredCount) {
            button.textContent = `Valider ${currentCount}/${requiredCount} ${itemType}`;
            button.style.backgroundColor = '#28a745';
            button.style.color = 'white';
            button.disabled = false;
            button.style.cursor = 'pointer';
            button.style.opacity = '1';
        } else {
            button.textContent = `Sélectionnez ${requiredCount - currentCount} ${itemType} de plus`;
            button.style.backgroundColor = '#6c757d';
            button.style.color = 'white';
            button.disabled = true;
            button.style.cursor = 'not-allowed';
            button.style.opacity = '0.6';
        }
    }
}

// Fonction pour mettre à jour le bouton de validation (minimum)
function updateValidationButtonMinimum(buttonId, currentCount, requiredCount, itemType) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.textContent = `Valider ${currentCount}/${requiredCount}+ ${itemType}`;
        if (currentCount >= requiredCount) {
            button.style.backgroundColor = '#28a745';
            button.style.color = 'white';
            button.disabled = false;
            button.style.cursor = 'pointer';
            button.style.opacity = '1';
        } else {
            button.style.backgroundColor = '#6c757d';
            button.style.color = 'white';
            button.disabled = true;
            button.style.cursor = 'not-allowed';
            button.style.opacity = '0.6';
        }
    }
}

// Initialiser les gestionnaires d'événements au chargement du DOM
document.addEventListener('DOMContentLoaded', setupValidationButtonHandlers);

// Fonctions pour configurer les sélecteurs après création dynamique du contenu
function setupBenefitsSelectors() {
    console.log('[Selection] Configuration des sélecteurs d\'avantages...');
    // Les gestionnaires sont déjà attachés via la délégation d'événements
    
    // Initialiser le bouton de validation
    if (!window.selectedBenefits) window.selectedBenefits = [];
    updateValidationButton('validate-benefits-btn', window.selectedBenefits.length, 4, 'avantages');
}

// Export to global scope
window.setupBenefitsSelectors = setupBenefitsSelectors;

function setupEmotionalBenefitsSelectors() {
    console.log('[Selection] Configuration des sélecteurs d\'avantages émotionnels...');
    // Les gestionnaires sont déjà attachés via la délégation d'événements
    
    // Initialiser le bouton de validation
    if (!window.selectedEmotionalBenefits) window.selectedEmotionalBenefits = [];
    updateValidationButton('validate-emotional-benefits-btn', window.selectedEmotionalBenefits.length, 2, 'avantages émotionnels');
}

function setupUseCasesSelectors() {
    console.log('[Selection] Configuration des sélecteurs de cas d\'usage...');
    // Les gestionnaires sont déjà attachés via la délégation d'événements
    
    // Initialiser le bouton de validation
    if (!window.selectedUseCases) window.selectedUseCases = [];
    updateValidationButtonMinimum('validate-use-cases-btn', window.selectedUseCases.length, 3, 'cas d\'usage');
}

function setupCharacteristicsSelectors() {
    console.log('[Selection] Configuration des sélecteurs de caractéristiques...');
    // Les gestionnaires sont déjà attachés via la délégation d'événements
    
    // Initialiser le bouton de validation
    if (!window.selectedCharacteristics) window.selectedCharacteristics = [];
    updateValidationButton('validate-characteristics-btn', window.selectedCharacteristics.length, 4, 'caractéristiques');
}

function setupCompetitiveAdvantagesSelectors() {
    console.log('[Selection] Configuration des sélecteurs d\'avantages concurrentiels...');
    // Les gestionnaires sont déjà attachés via la délégation d'événements
    
    // Initialiser le bouton de validation
    if (!window.selectedCompetitiveAdvantages) window.selectedCompetitiveAdvantages = [];
    updateValidationButton('validate-competitive-advantages-btn', window.selectedCompetitiveAdvantages.length, 4, 'avantages concurrentiels');
}

// Fonction pour mettre à jour le bouton de validation (minimum)
function updateValidationButtonMinimum(buttonId, currentCount, requiredCount, itemType) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.textContent = `Valider ${currentCount}/${requiredCount}+ ${itemType}`;
        if (currentCount >= requiredCount) {
            button.style.backgroundColor = '#28a745';
            button.style.color = 'white';
            button.disabled = false;
            button.style.cursor = 'pointer';
            button.style.opacity = '1';
        } else {
            button.style.backgroundColor = '#6c757d';
            button.style.color = 'white';
            button.disabled = true;
            button.style.cursor = 'not-allowed';
            button.style.opacity = '0.6';
        }
    }
}

// Fonction pour mettre à jour l'interface utilisateur
function updateBenefitsUI() {
    // Mettre à jour le compteur
    const counterNumber = document.querySelector('.counter-number');
    if (counterNumber) {
        counterNumber.textContent = `${window.selectedBenefits.length}/4`;
        if (window.selectedBenefits.length === 4) {
            counterNumber.classList.add('counter-complete');
        } else {
            counterNumber.classList.remove('counter-complete');
        }
    }
    
    // Mettre à jour le bouton de validation
    const validateBtn = document.getElementById('validateBenefitsBtn');
    if (validateBtn) {
        validateBtn.disabled = window.selectedBenefits.length !== 4;
        validateBtn.textContent = window.selectedBenefits.length === 4 
            ? 'Valider la sélection' 
            : `Sélectionnez ${4 - window.selectedBenefits.length} avantage(s) de plus`;
    }
    
    // Mettre à jour l'aperçu des sélections
    updateBenefitsPreview();
}

// Fonction pour mettre à jour l'aperçu des avantages sélectionnés
function updateBenefitsPreview() {
    const preview = document.querySelector('.selected-benefits-preview');
    const previewList = document.querySelector('.selected-benefits-list');
    
    if (!preview || !previewList) return;
    
    console.log('[Preview] window.selectedBenefits:', window.selectedBenefits);
    
    if (window.selectedBenefits.length > 0) {
        preview.style.display = 'block';
        previewList.innerHTML = window.selectedBenefits
            .map((benefit, index) => {
                console.log(`[Preview] Bénéfice ${index + 1}:`, benefit);
                const title = benefit.headline || benefit.title || 'Bénéfice';
                console.log(`[Preview] Titre utilisé pour ${index + 1}:`, title);
                return `
                    <div class="selected-benefit-item">
                        <span class="benefit-number">${index + 1}</span>
                        <span class="benefit-title">${title}</span>
                    </div>
                `;
            }).join('');
    } else {
        preview.style.display = 'none';
    }
}

// Fonction pour gérer la sélection des avantages produit
window.toggleBenefitSelection = function(index) {
    let benefit;
    let isManualBenefit = false;
    
    // Vérifier si c'est un avantage manuel (ID commence par "manual-")
    if (typeof index === 'string' && index.startsWith('manual-')) {
        isManualBenefit = true;
        const benefitTag = document.querySelector(`[data-benefit-index="${index}"]`);
        if (benefitTag) {
            // Créer un objet benefit à partir des données de l'élément DOM
            benefit = {
                title: benefitTag.getAttribute('data-benefit-title') || benefitTag.getAttribute('data-benefit-description'),
                description: benefitTag.getAttribute('data-benefit-description') || benefitTag.getAttribute('data-benefit-title'),
                isManual: true,
                manualId: index
            };
        } else {
            console.warn('[Selection] Élément manuel non trouvé:', index);
            return;
        }
    } else {
        // Avantage généré par l'IA
        console.log('[Selection] Recherche avantage généré à l\'index:', index);
        console.log('[Selection] Taille de window.allProductBenefits:', window.allProductBenefits ? window.allProductBenefits.length : 'undefined');
        console.log('[Selection] window.allProductBenefits:', window.allProductBenefits);
        
        benefit = window.allProductBenefits[index];
        if (!benefit) {
            console.warn('[Selection] Avantage généré non trouvé:', index);
            console.warn('[Selection] Indices disponibles:', window.allProductBenefits ? Object.keys(window.allProductBenefits) : 'aucun');
            return;
        }
        console.log('[Selection] Avantage trouvé:', benefit);
    }
    
    const isCurrentlySelected = window.selectedBenefits.some(b => {
        if (isManualBenefit) {
            return b && b.manualId === index;
        } else {
            return b && b.index === index;
        }
    });
    
    const benefitTag = document.querySelector(`[data-benefit-index="${index}"]`);
    
    if (!isCurrentlySelected) {
        // Vérifier si on peut encore sélectionner (limite de 4)
        if (window.selectedBenefits.length >= 4) {
            // Animation de secousse pour indiquer la limite atteinte
            const counter = document.querySelector('.selection-counter');
            if (counter) {
                counter.classList.add('shake-animation');
                setTimeout(() => counter.classList.remove('shake-animation'), 400);
            }
            return;
        }
        
        // Ajouter à la sélection
        const benefitToAdd = isManualBenefit ? {
            manualId: index,
            isManual: true,
            ...benefit
        } : {
            index: index,
            ...benefit
        };
        
        window.selectedBenefits.push(benefitToAdd);
        
        // Marquer visuellement comme sélectionné
        if (benefitTag) {
            benefitTag.classList.add('selected');
        }
        
        updateBenefitSelectionBadges();
    } else {
        // Retirer de la sélection
        window.selectedBenefits = window.selectedBenefits.filter(b => {
            if (isManualBenefit) {
                return !(b && b.manualId === index);
            } else {
                return !(b && b.index === index);
            }
        });
        
        // Retirer la marque visuelle
        if (benefitTag) {
            benefitTag.classList.remove('selected');
        }
        
        updateBenefitSelectionBadges();
    }
    
    // Mettre à jour l'interface
    updateBenefitsUI();
    
    // Mettre à jour le bouton de validation
    updateValidationButton('validate-benefits-btn', window.selectedBenefits.length, 4, 'avantages');
    
    // Valider si exactement 4 avantages sélectionnés
    window.benefitsValidated = window.selectedBenefits.length === 4;
    
    console.log('[Selection] Avantages sélectionnés:', window.selectedBenefits.length);
}

// Fonction pour mettre à jour les badges de numérotation
function updateBenefitSelectionBadges() {
    // D'abord, nettoyer tous les badges existants
    const allBenefitTags = document.querySelectorAll('[data-benefit-index]');
    allBenefitTags.forEach(tag => {
        const badge = tag.querySelector('.selection-badge');
        if (badge) badge.textContent = '';
    });
    
    // Ensuite, mettre à jour les badges des éléments sélectionnés
    if (window.selectedBenefits && window.selectedBenefits.length > 0) {
        window.selectedBenefits.forEach((selectedBenefit, index) => {
            const benefitIndex = selectedBenefit.index !== undefined ? selectedBenefit.index : selectedBenefit.manualId;
            const tag = document.querySelector(`[data-benefit-index="${benefitIndex}"]`);
            if (tag) {
                const badge = tag.querySelector('.selection-badge');
                if (badge) {
                    badge.textContent = index + 1;
                }
            }
        });
    }
}

// Fonction pour gérer la sélection des bénéfices émotionnels
window.toggleEmotionalBenefitSelection = function(index) {
    let benefit;
    let isManualBenefit = false;
    
    // Vérifier si c'est un avantage émotionnel manuel (ID commence par "manual-")
    if (typeof index === 'string' && index.startsWith('manual-')) {
        isManualBenefit = true;
        const benefitTag = document.querySelector(`[data-emotional-benefit-index="${index}"]`);
        if (benefitTag) {
            // Créer un objet benefit à partir des données de l'élément DOM
            benefit = {
                title: benefitTag.getAttribute('data-emotional-benefit-title'),
                description: benefitTag.getAttribute('data-emotional-benefit-title'),
                isManual: true,
                manualId: index
            };
        } else {
            console.warn('[Selection] Élément émotionnel manuel non trouvé:', index);
            return;
        }
    } else {
        // Avantage émotionnel généré par l'IA
        console.log('[Selection] Taille de window.allEmotionalBenefits:', window.allEmotionalBenefits ? window.allEmotionalBenefits.length : 'undefined');
        console.log('[Selection] window.allEmotionalBenefits:', window.allEmotionalBenefits);
        
        benefit = window.allEmotionalBenefits[index];
        if (!benefit) {
            console.warn('[Selection] Avantage émotionnel généré non trouvé à l\'index:', index);
            console.warn('[Selection] Indices disponibles:', window.allEmotionalBenefits ? Object.keys(window.allEmotionalBenefits) : 'aucun');
            return;
        }
    }
    
    const isCurrentlySelected = window.selectedEmotionalBenefits.some(b => {
        if (isManualBenefit) {
            return b && b.manualId === index;
        } else {
            return b && b.index === index;
        }
    });
    
    const benefitTag = document.querySelector(`[data-emotional-benefit-index="${index}"]`);
    
    if (!isCurrentlySelected) {
        // Vérifier la limite de 2 sélections
        if (window.selectedEmotionalBenefits.length >= 2) {
            // Animation de secousse pour indiquer la limite atteinte
            if (benefitTag) {
                benefitTag.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    benefitTag.style.animation = '';
                }, 500);
            }
            
            // Mettre à jour le compteur avec une couleur d'alerte
            const counter = document.querySelector('.emotional-benefits-selector .selection-counter .counter-number');
            if (counter) {
                counter.style.backgroundColor = '#dc3545';
                counter.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    counter.style.backgroundColor = '';
                    counter.style.transform = '';
                }, 600);
            }
            return;
        }
        
        // Ajouter à la sélection
        const benefitToAdd = isManualBenefit ? {
            manualId: index,
            isManual: true,
            ...benefit
        } : {
            index: index,
            ...benefit
        };
        
        window.selectedEmotionalBenefits.push(benefitToAdd);
        
        // Marquer visuellement comme sélectionné
        if (benefitTag) {
            benefitTag.classList.add('selected');
        }
        
        // Mettre à jour tous les badges dans l'ordre
        updateEmotionalBenefitBadges();
    } else {
        // Retirer de la sélection
        window.selectedEmotionalBenefits = window.selectedEmotionalBenefits.filter(b => {
            if (isManualBenefit) {
                return !(b && b.manualId === index);
            } else {
                return !(b && b.index === index);
            }
        });
        
        // Retirer la marque visuelle
        if (benefitTag) {
            benefitTag.classList.remove('selected');
        }
        
        // Mettre à jour les numéros des badges restants
        updateEmotionalBenefitBadges();
    }
    
    // Mettre à jour l'interface
    updateEmotionalBenefitsUI();
    
    // Mettre à jour le bouton de validation
    updateValidationButton('validate-emotional-benefits-btn', window.selectedEmotionalBenefits.length, 2, 'avantages émotionnels');
    
    console.log('[Selection] Bénéfices émotionnels sélectionnés:', window.selectedEmotionalBenefits.length);
}

// Fonction pour mettre à jour l'interface des bénéfices émotionnels
function updateEmotionalBenefitsUI() {
    // Mettre à jour le compteur
    const counterNumber = document.querySelector('.emotional-benefits-selector .selection-counter .counter-number');
    if (counterNumber) {
        counterNumber.textContent = `${window.selectedEmotionalBenefits.length}/2`;
        if (window.selectedEmotionalBenefits.length === 2) {
            counterNumber.classList.add('counter-complete');
        } else {
            counterNumber.classList.remove('counter-complete');
        }
    }
    
    // Mettre à jour le bouton de validation
    const validateBtn = document.querySelector('.emotional-benefits-selector .validate-emotional-benefits-btn');
    if (validateBtn) {
        validateBtn.disabled = window.selectedEmotionalBenefits.length !== 2;
        validateBtn.textContent = window.selectedEmotionalBenefits.length === 2 
            ? 'Valider la sélection' 
            : `Sélectionnez ${2 - window.selectedEmotionalBenefits.length} bénéfice(s) de plus`;
    }
}

// Fonction pour mettre à jour les badges des bénéfices émotionnels
function updateEmotionalBenefitBadges() {
    // D'abord, nettoyer tous les badges existants
    const allEmotionalBenefitTags = document.querySelectorAll('[data-emotional-benefit-index]');
    allEmotionalBenefitTags.forEach(tag => {
        const badge = tag.querySelector('.selection-badge');
        if (badge) badge.textContent = '';
    });
    
    // Ensuite, mettre à jour les badges des éléments sélectionnés
    if (window.selectedEmotionalBenefits && window.selectedEmotionalBenefits.length > 0) {
        window.selectedEmotionalBenefits.forEach((benefit, index) => {
            const benefitIndex = benefit.index !== undefined ? benefit.index : benefit.manualId;
            const benefitTag = document.querySelector(`[data-emotional-benefit-index="${benefitIndex}"]`);
            if (benefitTag) {
                const badge = benefitTag.querySelector('.selection-badge');
                if (badge) {
                    badge.textContent = index + 1;
                }
            }
        });
    }
}

// Fonction pour gérer la sélection des cas d'utilisation
window.toggleUseCaseSelection = function(index) {
    let useCase;
    let isManualUseCase = false;
    
    // Vérifier si c'est un cas d'usage manuel (ID commence par "manual-")
    if (typeof index === 'string' && index.startsWith('manual-')) {
        isManualUseCase = true;
        const useCaseTag = document.querySelector(`[data-use-case-index="${index}"]`);
        if (useCaseTag) {
            // Créer un objet useCase à partir des données de l'élément DOM
            useCase = {
                title: useCaseTag.getAttribute('data-use-case-title'),
                description: useCaseTag.getAttribute('data-use-case-title'),
                isManual: true,
                manualId: index
            };
        } else {
            console.warn('[Selection] Élément cas d\'usage manuel non trouvé:', index);
            return;
        }
    } else {
        // Cas d'usage généré par l'IA
        const useCases = window.generatedContent?.useCases?.version1 || [];
        useCase = useCases[index];
        if (!useCase) {
            console.warn('[Selection] Cas d\'usage généré non trouvé:', index);
            return;
        }
    }
    
    const isCurrentlySelected = window.selectedUseCases.some(u => {
        if (isManualUseCase) {
            return u && u.manualId === index;
        } else {
            return u && u.index === index;
        }
    });
    
    const useCaseTag = document.querySelector(`[data-use-case-index="${index}"]`);
    
    if (!isCurrentlySelected) {
        // Vérifier la limite de 3 sélections
        if (window.selectedUseCases.length >= 3) {
            console.log('[Selection] Limite de 3 cas d\'utilisation atteinte');
            return;
        }
        
        // Ajouter à la sélection
        const useCaseToAdd = isManualUseCase ? {
            manualId: index,
            isManual: true,
            ...useCase
        } : {
            index: index,
            ...useCase
        };
        
        window.selectedUseCases.push(useCaseToAdd);
        
        if (useCaseTag) {
            useCaseTag.classList.add('selected');
        }
        
        updateUseCaseBadges();
    } else {
        // Retirer de la sélection
        window.selectedUseCases = window.selectedUseCases.filter(u => {
            if (isManualUseCase) {
                return !(u && u.manualId === index);
            } else {
                return !(u && u.index === index);
            }
        });
        
        if (useCaseTag) {
            useCaseTag.classList.remove('selected');
        }
        
        updateUseCaseBadges();
    }
    
    // Valider si au moins 3 cas d'utilisation sélectionnés
    window.useCasesValidated = window.selectedUseCases.length >= 3;
    
    // Mettre à jour l'interface
    updateUseCasesUI();
    
    // Mettre à jour le bouton de validation (minimum 3)
    updateValidationButtonMinimum('validate-use-cases-btn', window.selectedUseCases.length, 3, 'cas d\'usage');
    
    console.log('[Selection] Cas d\'utilisation sélectionnés:', window.selectedUseCases.length);
}

// Fonction pour mettre à jour l'interface des cas d'utilisation
function updateUseCasesUI() {
    // Mettre à jour le compteur
    const counterNumber = document.querySelector('.use-cases-selector .selection-counter .counter-number');
    if (counterNumber) {
        counterNumber.textContent = `${window.selectedUseCases.length}/3`;
        if (window.selectedUseCases.length >= 3) {
            counterNumber.classList.add('counter-complete');
        } else {
            counterNumber.classList.remove('counter-complete');
        }
    }
    
    // Mettre à jour le bouton de validation
    const validateBtn = document.querySelector('.use-cases-selector .validate-use-cases-btn');
    if (validateBtn) {
        validateBtn.disabled = window.selectedUseCases.length < 3;
        validateBtn.textContent = window.selectedUseCases.length >= 3 
            ? 'Valider la sélection' 
            : `Sélectionnez ${Math.max(0, 3 - window.selectedUseCases.length)} cas d'utilisation de plus`;
    }
}

// Fonction pour mettre à jour les badges des cas d'utilisation
function updateUseCaseBadges() {
    // D'abord, nettoyer tous les badges existants
    const allUseCaseTags = document.querySelectorAll('[data-use-case-index]');
    allUseCaseTags.forEach(tag => {
        const badge = tag.querySelector('.selection-badge');
        if (badge) badge.textContent = '';
    });
    
    // Ensuite, mettre à jour les badges des éléments sélectionnés
    if (window.selectedUseCases && window.selectedUseCases.length > 0) {
        window.selectedUseCases.forEach((selectedUseCase, index) => {
            const useCaseIndex = selectedUseCase.index !== undefined ? selectedUseCase.index : selectedUseCase.manualId;
            const useCaseTag = document.querySelector(`[data-use-case-index="${useCaseIndex}"]`);
            if (useCaseTag) {
                const badge = useCaseTag.querySelector('.selection-badge');
                if (badge) badge.textContent = index + 1;
            }
        });
    }
}

// Fonction pour gérer la sélection des caractéristiques
window.toggleCharacteristicSelection = function(index) {
    let characteristic;
    let isManualCharacteristic = false;
    
    // Vérifier si c'est une caractéristique manuelle (ID commence par "manual-")
    if (typeof index === 'string' && index.startsWith('manual-')) {
        isManualCharacteristic = true;
        const characteristicTag = document.querySelector(`[data-characteristic-index="${index}"]`);
        if (characteristicTag) {
            // Créer un objet characteristic à partir des données de l'élément DOM
            characteristic = {
                title: characteristicTag.getAttribute('data-characteristic-title'),
                description: characteristicTag.getAttribute('data-characteristic-title'),
                isManual: true,
                manualId: index
            };
        } else {
            console.warn('[Selection] Élément caractéristique manuel non trouvé:', index);
            return;
        }
    } else {
        // Caractéristique générée par l'IA
        const characteristics = window.generatedContent?.characteristics?.version1 || [];
        characteristic = characteristics[index];
        if (!characteristic) {
            console.warn('[Selection] Caractéristique générée non trouvée:', index);
            return;
        }
    }
    
    const isCurrentlySelected = window.selectedCharacteristics.some(c => {
        if (isManualCharacteristic) {
            return c && c.manualId === index;
        } else {
            return c && c.index === index;
        }
    });
    
    const characteristicTag = document.querySelector(`[data-characteristic-index="${index}"]`);
    
    if (!isCurrentlySelected) {
        // Vérifier la limite de 4 sélections
        if (window.selectedCharacteristics.length >= 4) {
            // Animation de secousse pour indiquer la limite atteinte
            if (characteristicTag) {
                characteristicTag.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    characteristicTag.style.animation = '';
                }, 500);
            }
            
            // Mettre à jour le compteur avec une couleur d'alerte
            const counter = document.querySelector('.characteristics-selector .selection-counter .counter-number');
            if (counter) {
                counter.style.backgroundColor = '#dc3545';
                counter.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    counter.style.backgroundColor = '';
                    counter.style.transform = '';
                }, 600);
            }
            return;
        }
        
        // Ajouter à la sélection
        const characteristicToAdd = isManualCharacteristic ? {
            manualId: index,
            isManual: true,
            ...characteristic
        } : {
            index: index,
            ...characteristic
        };
        
        window.selectedCharacteristics.push(characteristicToAdd);
        
        // Marquer visuellement comme sélectionné
        if (characteristicTag) {
            characteristicTag.classList.add('selected');
        }
        
        // Mettre à jour tous les badges dans l'ordre
        updateCharacteristicBadges();
    } else {
        // Retirer de la sélection
        window.selectedCharacteristics = window.selectedCharacteristics.filter(c => {
            if (isManualCharacteristic) {
                return !(c && c.manualId === index);
            } else {
                return !(c && c.index === index);
            }
        });
        
        // Retirer la marque visuelle
        if (characteristicTag) {
            characteristicTag.classList.remove('selected');
        }
        
        // Mettre à jour les numéros des badges restants
        updateCharacteristicBadges();
    }
    
    // Mettre à jour l'interface
    updateCharacteristicsUI();
    
    // Mettre à jour le bouton de validation
    updateValidationButton('validate-characteristics-btn', window.selectedCharacteristics.length, 4, 'caractéristiques');
    
    console.log('[Selection] Caractéristiques sélectionnées:', window.selectedCharacteristics.length);
}

// Fonction pour mettre à jour l'interface des caractéristiques
function updateCharacteristicsUI() {
    // Mettre à jour le compteur
    const counterNumber = document.querySelector('.characteristics-selector .selection-counter .counter-number');
    if (counterNumber) {
        counterNumber.textContent = `${window.selectedCharacteristics.length}/4`;
        if (window.selectedCharacteristics.length === 4) {
            counterNumber.classList.add('counter-complete');
        } else {
            counterNumber.classList.remove('counter-complete');
        }
    }
    
    // Mettre à jour le bouton de validation
    const validateBtn = document.querySelector('.characteristics-selector .validate-characteristics-btn');
    if (validateBtn) {
        validateBtn.disabled = window.selectedCharacteristics.length !== 4;
        validateBtn.textContent = window.selectedCharacteristics.length === 4 
            ? 'Valider la sélection' 
            : `Sélectionnez ${4 - window.selectedCharacteristics.length} caractéristique(s) de plus`;
    }
}

// Fonction pour mettre à jour les badges des caractéristiques
function updateCharacteristicBadges() {
    // D'abord, nettoyer tous les badges existants
    const allCharacteristicTags = document.querySelectorAll('[data-characteristic-index]');
    allCharacteristicTags.forEach(tag => {
        const badge = tag.querySelector('.selection-badge');
        if (badge) badge.textContent = '';
    });
    
    // Ensuite, mettre à jour les badges des éléments sélectionnés
    if (window.selectedCharacteristics && window.selectedCharacteristics.length > 0) {
        window.selectedCharacteristics.forEach((characteristic, index) => {
            const characteristicIndex = characteristic.index !== undefined ? characteristic.index : characteristic.manualId;
            const characteristicTag = document.querySelector(`[data-characteristic-index="${characteristicIndex}"]`);
            if (characteristicTag) {
                const badge = characteristicTag.querySelector('.selection-badge');
                if (badge) {
                    badge.textContent = index + 1;
                }
            }
        });
    }
}

// Fonction pour gérer la sélection des avantages concurrentiels
window.toggleCompetitiveAdvantageSelection = function(index) {
    let advantage;
    let isManualAdvantage = false;
    
    // Vérifier si c'est un avantage concurrentiel manuel (ID commence par "manual-")
    if (typeof index === 'string' && index.startsWith('manual-')) {
        isManualAdvantage = true;
        const advantageTag = document.querySelector(`[data-advantage-index="${index}"]`);
        if (advantageTag) {
            // Créer un objet advantage à partir des données de l'élément DOM
            advantage = {
                title: advantageTag.getAttribute('data-advantage-title'),
                description: advantageTag.getAttribute('data-advantage-title'),
                isManual: true,
                manualId: index
            };
        } else {
            console.warn('[Selection] Élément avantage concurrentiel manuel non trouvé:', index);
            return;
        }
    } else {
        // Avantage concurrentiel généré par l'IA
        const advantages = window.generatedContent?.competitiveAdvantages?.version1 || [];
        advantage = advantages[index];
        if (!advantage) {
            console.warn('[Selection] Avantage concurrentiel généré non trouvé:', index);
            return;
        }
    }
    
    const isCurrentlySelected = window.selectedCompetitiveAdvantages.some(a => {
        if (isManualAdvantage) {
            return a && a.manualId === index;
        } else {
            return a && a.index === index;
        }
    });
    
    const advantageTag = document.querySelector(`[data-advantage-index="${index}"]`);
    
    if (!isCurrentlySelected) {
        // Vérifier la limite de 4 sélections
        if (window.selectedCompetitiveAdvantages.length >= 4) {
            // Animation de secousse pour indiquer la limite atteinte
            if (advantageTag) {
                advantageTag.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    advantageTag.style.animation = '';
                }, 500);
            }
            
            // Mettre à jour le compteur avec une couleur d'alerte
            const counter = document.querySelector('.competitive-advantages-selector .selection-counter .counter-number');
            if (counter) {
                counter.style.backgroundColor = '#dc3545';
                counter.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    counter.style.backgroundColor = '';
                    counter.style.transform = '';
                }, 600);
            }
            return;
        }
        
        // Ajouter à la sélection
        const advantageToAdd = isManualAdvantage ? {
            manualId: index,
            isManual: true,
            ...advantage
        } : {
            index: index,
            ...advantage
        };
        
        window.selectedCompetitiveAdvantages.push(advantageToAdd);
        
        // Marquer visuellement comme sélectionné
        if (advantageTag) {
            advantageTag.classList.add('selected');
        }
        
        // Mettre à jour tous les badges dans l'ordre
        updateCompetitiveAdvantageBadges();
    } else {
        // Retirer de la sélection
        window.selectedCompetitiveAdvantages = window.selectedCompetitiveAdvantages.filter(a => {
            if (isManualAdvantage) {
                return !(a && a.manualId === index);
            } else {
                return !(a && a.index === index);
            }
        });
        
        // Retirer la marque visuelle
        if (advantageTag) {
            advantageTag.classList.remove('selected');
        }
        
        // Mettre à jour les numéros des badges restants
        updateCompetitiveAdvantageBadges();
    }
    
    // Mettre à jour l'interface
    updateCompetitiveAdvantagesUI();
    
    // Mettre à jour le bouton de validation
    updateValidationButton('validate-competitive-advantages-btn', window.selectedCompetitiveAdvantages.length, 4, 'avantages concurrentiels');
    
    // Mettre à jour l'état du bouton de génération de template
    if (typeof window.updateTemplateButtonState === 'function') {
        window.updateTemplateButtonState();
    }
    if (typeof window.updatePrelanderButtonState === 'function') {
        window.updatePrelanderButtonState();
    }
    
    console.log('[Selection] Avantages concurrentiels sélectionnés:', window.selectedCompetitiveAdvantages.length);
}

// Fonction pour mettre à jour l'interface des avantages concurrentiels
function updateCompetitiveAdvantagesUI() {
    // Mettre à jour le compteur
    const counterNumber = document.querySelector('.competitive-advantages-selector .selection-counter .counter-number');
    if (counterNumber) {
        counterNumber.textContent = `${window.selectedCompetitiveAdvantages.length}/4`;
        if (window.selectedCompetitiveAdvantages.length === 4) {
            counterNumber.classList.add('counter-complete');
        } else {
            counterNumber.classList.remove('counter-complete');
        }
    }
    
    // Mettre à jour le bouton de validation
    const validateBtn = document.querySelector('.competitive-advantages-selector .validate-competitive-advantages-btn');
    if (validateBtn) {
        validateBtn.disabled = window.selectedCompetitiveAdvantages.length !== 4;
        validateBtn.textContent = window.selectedCompetitiveAdvantages.length === 4 
            ? 'Valider la sélection' 
            : `Sélectionnez ${4 - window.selectedCompetitiveAdvantages.length} avantage(s) de plus`;
    }
}

// Fonction pour mettre à jour les badges des avantages concurrentiels
function updateCompetitiveAdvantageBadges() {
    // D'abord, nettoyer tous les badges existants
    const allAdvantagesTags = document.querySelectorAll('[data-advantage-index]');
    allAdvantagesTags.forEach(tag => {
        const badge = tag.querySelector('.selection-badge');
        if (badge) badge.textContent = '';
    });
    
    // Ensuite, mettre à jour les badges des éléments sélectionnés
    if (window.selectedCompetitiveAdvantages && window.selectedCompetitiveAdvantages.length > 0) {
        window.selectedCompetitiveAdvantages.forEach((advantage, index) => {
            const advantageIndex = advantage.index !== undefined ? advantage.index : advantage.manualId;
            const advantageTag = document.querySelector(`[data-advantage-index="${advantageIndex}"]`);
            if (advantageTag) {
                const badge = advantageTag.querySelector('.selection-badge');
                if (badge) {
                    badge.textContent = index + 1;
                }
            }
        });
    }
}

// Fonction pour gérer la sélection des avis clients
window.toggleCustomerReviewSelection = function(reviewId, isManual = false) {
    if (!window.selectedCustomerReviews) {
        window.selectedCustomerReviews = [];
    }
    
    // Obtenir l'avis selon son type (généré ou manuel)
    let review;
    if (isManual) {
        review = window.manualCustomerReviews?.find(r => r.manualId === reviewId);
    } else {
        const reviews = window.generatedContent?.customerReviews?.version1 || [];
        review = reviews[reviewId];
    }
    
    if (!review) {
        console.error('[Selection] Avis non trouvé:', reviewId);
        return;
    }
    
    // Vérifier si l'avis est déjà sélectionné
    const isCurrentlySelected = window.selectedCustomerReviews.some(r => 
        r && (r.index === reviewId || r.manualId === reviewId)
    );
    
    // Trouver l'élément DOM de l'avis
    const reviewElement = document.querySelector(`[data-review-index="${reviewId}"]`);
    
    if (isCurrentlySelected) {
        // Désélectionner l'avis
        window.selectedCustomerReviews = window.selectedCustomerReviews.filter(r => 
            r && (r.index !== reviewId && r.manualId !== reviewId)
        );
        
        // Mettre à jour l'interface
        if (reviewElement) {
            reviewElement.classList.remove('selected');
            const badge = reviewElement.querySelector('.selection-badge');
            if (badge) badge.style.display = 'none';
        }
    } else {
        // Vérifier la limite de 6 avis clients
        if (window.selectedCustomerReviews.length >= 6) {
            console.warn('[Selection] Limite de 6 avis clients atteinte');
            alert('Vous ne pouvez sélectionner que 6 avis clients maximum.');
            return;
        }
        
        // Sélectionner l'avis
        const selectedReview = isManual ? 
            { manualId: reviewId, ...review } : 
            { index: reviewId, ...review };
            
        window.selectedCustomerReviews.push(selectedReview);
        
        // Mettre à jour l'interface
        if (reviewElement) {
            reviewElement.classList.add('selected');
            const badge = reviewElement.querySelector('.selection-badge');
            if (badge) badge.style.display = 'inline-flex';
        }
    }
    
    // Mettre à jour les badges et l'interface
    updateCustomerReviewBadges();
    updateCustomerReviewsUI();
    
    // Mettre à jour l'état du bouton de génération de template
    if (typeof window.updateTemplateButtonState === 'function') {
        window.updateTemplateButtonState();
    }
    if (typeof window.updatePrelanderButtonState === 'function') {
        window.updatePrelanderButtonState();
    }
    
    console.log('[Selection] Avis clients sélectionnés:', window.selectedCustomerReviews.length);
}

// Fonction pour mettre à jour les badges des avis clients
function updateCustomerReviewBadges() {
    // D'abord, cacher tous les badges et nettoyer le contenu
    const allReviewTags = document.querySelectorAll('[data-review-index]');
    allReviewTags.forEach(tag => {
        const badge = tag.querySelector('.selection-badge');
        if (badge) badge.style.display = 'none';
    });
    
    // Ensuite, afficher et numéroter les badges des éléments sélectionnés
    if (window.selectedCustomerReviews && window.selectedCustomerReviews.length > 0) {
        window.selectedCustomerReviews.forEach((review, index) => {
            const reviewId = review.manualId || review.index;
            const reviewTag = document.querySelector(`[data-review-index="${reviewId}"]`);
            if (reviewTag) {
                const badge = reviewTag.querySelector('.selection-badge');
                if (badge) {
                    badge.style.display = 'inline-flex';
                    badge.textContent = index + 1;
                }
            }
        });
    }
}

// Fonction pour mettre à jour l'interface des avis clients
function updateCustomerReviewsUI() {
    // Mettre à jour le compteur
    const counterNumber = document.querySelector('.customer-reviews-selector .selection-counter .counter-number');
    if (counterNumber) {
        counterNumber.textContent = `${window.selectedCustomerReviews.length}/6`;
        if (window.selectedCustomerReviews.length === 6) {
            counterNumber.classList.add('counter-complete');
        } else {
            counterNumber.classList.remove('counter-complete');
        }
    }
    
    // Mettre à jour le bouton de validation
    updateValidationButton('validate-reviews-btn', window.selectedCustomerReviews.length, 6, 'avis clients');
}

// Fonction pour configurer les sélecteurs de titre de produit
function setupProductTitleSelectors() {
    // Cette fonction peut être étendue pour ajouter des événements spécifiques
    console.log('[Selection] Sélecteurs de titre configurés');
}

window.setupProductTitleSelectors = setupProductTitleSelectors;

// Fonction pour configurer les sélecteurs de bénéfices émotionnels
function setupEmotionalBenefitsSelectors() {
    console.log('[Selection] Configuration des sélecteurs d\'avantages émotionnels...');
    // Les gestionnaires sont déjà attachés via la délégation d'événements
    
    // Initialiser le bouton de validation
    if (!window.selectedEmotionalBenefits) window.selectedEmotionalBenefits = [];
    updateValidationButton('validate-emotional-benefits-btn', window.selectedEmotionalBenefits.length, 2, 'avantages émotionnels');
}

// Fonction pour configurer les sélecteurs de cas d'utilisation
function setupUseCasesSelectors() {
    console.log('[Selection] Configuration des sélecteurs de cas d\'usage...');
    // Les gestionnaires sont déjà attachés via la délégation d'événements
    
    // Initialiser le bouton de validation
    if (!window.selectedUseCases) window.selectedUseCases = [];
    updateValidationButtonMinimum('validate-use-cases-btn', window.selectedUseCases.length, 3, 'cas d\'usage');
}

// Fonction pour configurer les sélecteurs de caractéristiques
function setupCharacteristicsSelectors() {
    console.log('[Selection] Configuration des sélecteurs de caractéristiques...');
    // Les gestionnaires sont déjà attachés via la délégation d'événements
    
    // Initialiser le bouton de validation
    if (!window.selectedCharacteristics) window.selectedCharacteristics = [];
    updateValidationButton('validate-characteristics-btn', window.selectedCharacteristics.length, 4, 'caractéristiques');
}

// Fonction pour configurer les sélecteurs d'avantages concurrentiels
function setupCompetitiveAdvantagesSelectors() {
    console.log('[Selection] Configuration des sélecteurs d\'avantages concurrentiels...');
    // Les gestionnaires sont déjà attachés via la délégation d'événements
    
    // Initialiser le bouton de validation
    if (!window.selectedCompetitiveAdvantages) window.selectedCompetitiveAdvantages = [];
    updateValidationButton('validate-competitive-advantages-btn', window.selectedCompetitiveAdvantages.length, 4, 'avantages concurrentiels');
}

// Fonction pour configurer les sélecteurs d'avis clients
function setupCustomerReviewsSelectors() {
    console.log('[Selection] Configuration des sélecteurs d\'avis clients...');
    // Les gestionnaires sont déjà attachés via la délégation d'événements
    
    // Initialiser le bouton de validation
    if (!window.selectedCustomerReviews) window.selectedCustomerReviews = [];
    updateValidationButton('validate-reviews-btn', window.selectedCustomerReviews.length, 6, 'avis clients');
    
    // Initialiser l'interface
    updateCustomerReviewsUI();
    
    console.log('[Selection] Sélecteurs d\'avis clients configurés');
}

// Export to global scope
window.setupCustomerReviewsSelectors = setupCustomerReviewsSelectors;

// Fonction pour configurer les sélecteurs de FAQ
function setupFAQSelectors() {
    console.log('[Selection] Configuration des sélecteurs de FAQ...');
    
    // Initialiser le tableau de sélection des FAQ si nécessaire
    if (!window.selectedFAQs) {
        window.selectedFAQs = [];
    }
    
    // Initialiser le bouton de validation
    updateValidationButtonMinimum('validate-faq-btn', window.selectedFAQs.length, 4, 'FAQ');
    
    // Configurer tous les sélecteurs de FAQ
    const faqSelectors = document.querySelectorAll('.faq-selector');
    faqSelectors.forEach(selector => {
        setupSingleFAQSelector(selector);
    });
    
    // Gérer les checkboxes de sélection FAQ
    const faqCheckboxes = document.querySelectorAll('.faq-checkbox');
    faqCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const faqData = JSON.parse(this.getAttribute('data-faq') || '{}');
            const isChecked = this.checked;
            
            if (isChecked) {
                if (window.selectedFAQs.length < 4) {
                    window.selectedFAQs.push(faqData);
                    console.log('[FAQ] FAQ ajoutée à la sélection:', faqData.question);
                } else {
                    this.checked = false;
                    alert('Vous ne pouvez sélectionner que 4 questions FAQ maximum.');
                }
            } else {
                const index = window.selectedFAQs.findIndex(faq => faq.question === faqData.question);
                if (index > -1) {
                    window.selectedFAQs.splice(index, 1);
                    console.log('[FAQ] FAQ retirée de la sélection:', faqData.question);
                }
            }
            
            console.log('[FAQ] Nombre de FAQs sélectionnées:', window.selectedFAQs.length);
            updateFAQCounter();
        });
    });
    
    // Configurer les boutons radio pour les versions de FAQ
    const faqVersionButtons = document.querySelectorAll('input[type="radio"][name^="faq-version"]');
    faqVersionButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                const sectionId = this.name.replace('faq-version-', '');
                const version = this.value;
                console.log('[FAQ] Version sélectionnée pour la section', sectionId, ':', version);
                
                // Mettre à jour l'affichage de la section FAQ
                updateFAQDisplay(sectionId, version);
            }
        });
    });
    
    console.log('[Selection] Sélecteurs de FAQ configurés avec succès');
}

// Fonction pour configurer un sélecteur FAQ individuel
function setupSingleFAQSelector(selector) {
    const versionButtons = selector.querySelectorAll('.version-btn');
    
    versionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons de cette section
            versionButtons.forEach(btn => btn.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            // Récupérer la version sélectionnée
            const version = this.getAttribute('data-version');
            const sectionId = selector.getAttribute('data-section');
            
            console.log('[FAQ] Version sélectionnée:', version, 'pour la section:', sectionId);
            
            // Mettre à jour l'affichage du contenu
            updateFAQVersionContent(selector, version);
        });
    });
}

// Fonction pour mettre à jour l'affichage du contenu FAQ selon la version
function updateFAQVersionContent(selector, version) {
    const contentContainers = selector.querySelectorAll('.version-content');
    
    contentContainers.forEach(container => {
        if (container.getAttribute('data-version') === version) {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    });
}

// Fonction pour mettre à jour le compteur de FAQ sélectionnées
function updateFAQCounter() {
    const counter = document.getElementById('faq-counter');
    if (counter && window.selectedFAQs) {
        counter.textContent = `${window.selectedFAQs.length}/4 FAQs sélectionnées`;
        
        // Changer la couleur selon le nombre sélectionné
        if (window.selectedFAQs.length === 4) {
            counter.style.color = '#10b981'; // Vert quand complet
        } else if (window.selectedFAQs.length > 0) {
            counter.style.color = '#f59e0b'; // Orange en cours
        } else {
            counter.style.color = '#6b7280'; // Gris si vide
        }
    }
}

// Fonction pour mettre à jour l'affichage d'une section FAQ
function updateFAQDisplay(sectionId, version) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const versionContents = section.querySelectorAll('.version-content');
    versionContents.forEach(content => {
        if (content.getAttribute('data-version') === version) {
            content.style.display = 'block';
        } else {
            content.style.display = 'none';
        }
    });
}

// Fonction pour configurer les gestionnaires de sélection des avantages
function setupBenefitsSelectionHandlers() {
    // Gestionnaire pour les checkboxes des avantages
    const benefitCheckboxes = document.querySelectorAll('.benefit-checkbox');
    benefitCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const benefitId = this.getAttribute('data-benefit-id');
            const isChecked = this.checked;
            
            if (isChecked) {
                if (!window.selectedBenefits.includes(benefitId)) {
                    window.selectedBenefits.push(benefitId);
                }
            } else {
                const index = window.selectedBenefits.indexOf(benefitId);
                if (index > -1) {
                    window.selectedBenefits.splice(index, 1);
                }
            }
            
            console.log('[Selection] Avantages sélectionnés:', window.selectedBenefits);
        });
    });
    
    console.log('[Selection] Gestionnaires de sélection des avantages configurés');
}

// Fonction pour réinitialiser toutes les sélections
function resetAllSelections() {
    window.selectedProductTitle = '';
    window.selectedBenefits = [];
    window.selectedEmotionalBenefits = [];
    window.selectedUseCases = [];
    window.selectedCharacteristics = [];
    window.selectedCompetitiveAdvantages = [];
    window.selectedCustomerReviews = [];
    window.selectedFAQs = [];
    
    window.productTitleValidated = false;
    window.benefitsValidated = false;
    window.useCasesValidated = false;
    
    console.log('[Selection] Toutes les sélections réinitialisées');
}

console.log('[Selection Handlers] Gestionnaires de sélection chargés');

// Exposer TOUTES les fonctions toggle globalement pour qu'elles soient accessibles depuis le HTML
window.toggleBenefitSelection = toggleBenefitSelection;
window.toggleEmotionalBenefitSelection = toggleEmotionalBenefitSelection;
window.toggleUseCaseSelection = toggleUseCaseSelection;
window.toggleCharacteristicSelection = toggleCharacteristicSelection;
window.toggleCompetitiveAdvantageSelection = toggleCompetitiveAdvantageSelection;

// Fonction pour gérer la sélection des FAQ
window.toggleFAQSelection = function(faqId, isManual = false) {
    // Récupérer les données FAQ depuis l'élément DOM
    const faqTag = document.querySelector(`[data-faq-index="${faqId}"]`);
    if (!faqTag) return;
    
    const question = faqTag.getAttribute('data-faq-question');
    const answer = faqTag.getAttribute('data-faq-answer');
    
    if (!question || !answer) return;
    
    // Initialiser le tableau si nécessaire
    if (!window.selectedFAQs) {
        window.selectedFAQs = [];
    }
    
    // Vérifier si la FAQ est déjà sélectionnée
    const isCurrentlySelected = window.selectedFAQs.some(f => 
        f && (f.index === faqId || f.manualId === faqId)
    );
    
    if (!isCurrentlySelected) {
        // Vérifier la limite de 4 sélections
        if (window.selectedFAQs.length >= 4) {
            // Animation de secousse pour indiquer la limite atteinte
            faqTag.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                faqTag.style.animation = '';
            }, 500);
            
            // Mettre à jour le compteur avec une couleur d'alerte
            const counter = document.querySelector('.faq-selector .selection-counter .counter-number');
            if (counter) {
                counter.style.backgroundColor = '#dc3545';
                counter.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    counter.style.backgroundColor = '';
                    counter.style.transform = '';
                }, 600);
            }
            
            alert('Vous ne pouvez sélectionner que 4 FAQ maximum.');
            return;
        }
        
        // Ajouter à la sélection
        const selectedFAQ = isManual ? 
            { manualId: faqId, question: question, answer: answer, isManual: true } : 
            { index: faqId, question: question, answer: answer };
            
        window.selectedFAQs.push(selectedFAQ);
        
        // Marquer visuellement comme sélectionné
        faqTag.classList.add('selected');
        
        console.log('[FAQ] FAQ ajoutée à la sélection:', question);
    } else {
        // Retirer de la sélection
        window.selectedFAQs = window.selectedFAQs.filter(f => 
            f && (f.index !== faqId && f.manualId !== faqId)
        );
        
        // Retirer la marque visuelle
        faqTag.classList.remove('selected');
        
        console.log('[FAQ] FAQ retirée de la sélection:', question);
    }
    
    // Mettre à jour tous les badges dans l'ordre
    updateFAQBadges();
    
    // Mettre à jour l'interface
    updateFAQUI();
    
    // Mettre à jour l'état du bouton de génération de template
    if (typeof window.updateTemplateButtonState === 'function') {
        window.updateTemplateButtonState();
    }
    if (typeof window.updatePrelanderButtonState === 'function') {
        window.updatePrelanderButtonState();
    }
    
    console.log('[Selection] FAQ sélectionnées:', window.selectedFAQs.length);
}

// Fonction pour mettre à jour l'interface des FAQ
function updateFAQUI() {
    // Mettre à jour le compteur
    const counterNumber = document.querySelector('.faq-selector .selection-counter .counter-number');
    if (counterNumber) {
        counterNumber.textContent = `${window.selectedFAQs.length}/4`;
        if (window.selectedFAQs.length >= 4) {
            counterNumber.classList.add('counter-complete');
        } else {
            counterNumber.classList.remove('counter-complete');
        }
    }
    
    // Mettre à jour le bouton de validation
    updateValidationButtonMinimum('validate-faq-btn', window.selectedFAQs.length, 4, 'FAQ');
}

// Fonction pour mettre à jour les badges des FAQ
function updateFAQBadges() {
    // D'abord, nettoyer tous les badges existants
    const allFAQTags = document.querySelectorAll('.faq-selector [data-faq-index]');
    allFAQTags.forEach(tag => {
        const badge = tag.querySelector('.selection-badge');
        if (badge) badge.textContent = '';
    });
    
    // Ensuite, mettre à jour les badges des éléments sélectionnés
    if (window.selectedFAQs && window.selectedFAQs.length > 0) {
        window.selectedFAQs.forEach((faq, index) => {
            const faqTag = document.querySelector(`.faq-selector [data-faq-index="${faq.index || faq.manualId}"]`);
            if (faqTag) {
                const badge = faqTag.querySelector('.selection-badge');
                if (badge) {
                    badge.textContent = index + 1;
                }
            }
        });
    }
}

// Fonction pour gérer l'expansion/contraction des FAQ
function toggleFAQExpansion(faqElement) {
    const isExpanded = faqElement.classList.contains('expanded');
    
    console.log('[FAQ Expansion] État actuel:', isExpanded ? 'ouvert' : 'fermé');
    
    if (isExpanded) {
        // Fermer la FAQ
        faqElement.classList.remove('expanded');
        console.log('[FAQ Expansion] FAQ fermée');
    } else {
        // Ouvrir la FAQ
        faqElement.classList.add('expanded');
        console.log('[FAQ Expansion] FAQ ouverte');
    }
}

// Fonction pour configurer les gestionnaires d'expansion des FAQ
function setupFAQExpansionHandlers() {
    // Attendre que le DOM soit prêt
    document.addEventListener('DOMContentLoaded', function() {
        setupFAQExpansionListeners();
    });
    
    // Si le DOM est déjà prêt, configurer immédiatement
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupFAQExpansionListeners);
    } else {
        setupFAQExpansionListeners();
    }
}

function setupFAQExpansionListeners() {
    // Utiliser la délégation d'événements pour gérer les clics sur les questions FAQ
    document.addEventListener('click', function(event) {
        const questionElement = event.target.closest('.faq-question-preview');
        if (questionElement) {
            console.log('[FAQ Expansion] Clic détecté sur question FAQ');
            event.preventDefault();
            event.stopPropagation();
            
            const faqTag = questionElement.closest('.faq-tag');
            if (faqTag) {
                console.log('[FAQ Expansion] Basculement de l\'expansion');
                toggleFAQExpansion(faqTag);
            }
        }
    });
    
    console.log('[FAQ Expansion] Gestionnaires d\'expansion configurés');
}

// Initialiser les gestionnaires d'expansion
setupFAQExpansionHandlers();

// Exposer la fonction globalement
window.toggleFAQExpansion = toggleFAQExpansion;

// Fonction pour gérer la sélection de version
window.selectVersion = function(contentType, version) {
    const content = window.generatedContent[contentType];
    const contentElement = document.getElementById(contentType);
    
    if (!content || !contentElement) {
        console.error(`Contenu ou élément non trouvé pour ${contentType}`);
        return;
    }
    
    // Enregistrer la version sélectionnée
    window.selectedVersion = window.selectedVersion || {};
    window.selectedVersion[contentType] = version;
    console.log(`Version ${version} sélectionnée pour ${contentType}`);
    
    // Mettre à jour l'affichage selon le type de contenu
    if (contentType === 'productTitle') {
        // Pour les titres, utiliser formatTitleWithVersionSelector si elle existe
        contentElement.innerHTML = formatTextWithVersionSelector(contentType, content);
    } else if (contentType === 'productBenefits') {
        // Pour les bénéfices produit, utiliser formatBenefitsWithSelectors
        contentElement.innerHTML = window.formatBenefitsWithSelectors ? window.formatBenefitsWithSelectors(contentType, content) : formatTextWithVersionSelector(contentType, content);
    } else if (contentType === 'competitiveAdvantages') {
        // Pour les avantages concurrentiels, utiliser formatCompetitiveAdvantagesWithSelectors
        contentElement.innerHTML = window.formatCompetitiveAdvantagesWithSelectors ? window.formatCompetitiveAdvantagesWithSelectors(contentType, content) : formatTextWithVersionSelector(contentType, content);
    } else if (contentType === 'useCases') {
        // Pour les cas d'usage, utiliser formatUseCasesWithVersionSelector si elle existe
        contentElement.innerHTML = formatTextWithVersionSelector(contentType, content);
    } else if (contentType === 'characteristics') {
        // Pour les caractéristiques, utiliser formatCharacteristicsWithVersionSelector si elle existe
        contentElement.innerHTML = formatTextWithVersionSelector(contentType, content);
    } else if (contentType === 'customerReviews') {
        // Pour les avis clients, utiliser formatReviewsWithVersionSelector si elle existe
        contentElement.innerHTML = formatTextWithVersionSelector(contentType, content);
    } else if (contentType === 'faq') {
        // Pour les FAQ, utiliser formatFAQWithVersionSelector si elle existe
        contentElement.innerHTML = formatFAQWithVersionSelector(contentType, content);
    } else if (contentType === 'howItWorks') {
        // Pour "Comment ça marche", utiliser formatHowItWorksWithSelectors
        contentElement.innerHTML = formatHowItWorksWithSelectors(contentType, content);
    } else {
        // Pour les autres types, utiliser formatTextWithVersionSelector
        contentElement.innerHTML = formatTextWithVersionSelector(contentType, content);
    }
    
    // Réappliquer les boutons d'édition après le changement de version
    if (typeof addEditButtons === 'function') {
        addEditButtons();
    }
};

// Fonction pour sélectionner le titre du produit
function selectProductTitle(title) {
    window.selectedProductTitle = title;
    window.productTitleValidated = true;
    
    // Réinitialiser tous les boutons de titre (générés ET manuels)
    const allTitleButtons = document.querySelectorAll('.title-option .select-btn, .manual-title .select-btn');
    allTitleButtons.forEach(btn => {
        btn.innerHTML = '<i class="fas fa-check"></i> Utiliser ce titre';
        btn.classList.remove('btn-success', 'selected');
        btn.classList.add('btn-primary');
        btn.disabled = false;
    });
    
    // Réinitialiser tous les conteneurs de titre (générés ET manuels)
    const allTitleContainers = document.querySelectorAll('.title-option, .manual-title');
    allTitleContainers.forEach(container => {
        container.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        container.style.background = 'rgba(255, 255, 255, 0.05)';
        container.classList.remove('selected');
    });
    
    // Mettre à jour le bouton cliqué
    const button = event.target;
    button.innerHTML = '<i class="fas fa-check-circle"></i> Titre Sélectionné';
    button.classList.remove('btn-primary');
    button.classList.add('btn-success', 'selected');
    button.disabled = true;
    
    // Ajouter un effet visuel au conteneur sélectionné (généré OU manuel)
    const titleContainer = button.closest('.title-option, .manual-title');
    if (titleContainer) {
        // Mettre en évidence le conteneur sélectionné
        titleContainer.style.borderColor = '#10b981';
        titleContainer.style.background = 'rgba(16, 185, 129, 0.1)';
        titleContainer.classList.add('selected');
        
        // Ajouter un indicateur visuel spécial pour les titres manuels
        if (titleContainer.classList.contains('manual-title')) {
            titleContainer.style.borderColor = '#f59e0b';
            titleContainer.style.background = 'rgba(245, 158, 11, 0.1)';
        }
    }
    
    console.log('[Selection] Titre sélectionné:', title);
    
    // Mettre à jour l'état du bouton de génération de template
    if (typeof window.updateTemplateButtonState === 'function') {
        window.updateTemplateButtonState();
    }
    if (typeof window.updatePrelanderButtonState === 'function') {
        window.updatePrelanderButtonState();
    }
}

// Rendre la fonction accessible globalement
window.selectProductTitle = selectProductTitle;
console.log('[DEBUG] Badge functions loaded');

// Force la mise à jour des badges après le chargement
setTimeout(() => {
    console.log('[DEBUG] Force update badges après chargement');
    if (typeof updateEmotionalBenefitBadges === 'function') {
        updateEmotionalBenefitBadges();
        console.log('[DEBUG] updateEmotionalBenefitBadges appelée');
        
        // Force l'affichage des badges avec du contenu
        document.querySelectorAll('.emotional-benefits-selector .selection-badge').forEach(badge => {
            if (badge.textContent && badge.textContent.trim() !== '') {
                badge.style.opacity = '1';
                badge.style.transform = 'scale(1)';
                console.log('[DEBUG] Badge forcé visible:', badge.textContent);
            }
        });
    }
    if (typeof updateBenefitSelectionBadges === 'function') {
        updateBenefitSelectionBadges();
        console.log('[DEBUG] updateBenefitSelectionBadges appelée');
    }
    if (typeof updateCustomerReviewBadges === 'function') {
        updateCustomerReviewBadges();
        console.log('[DEBUG] updateCustomerReviewBadges appelée');
    }
    
    // Force la mise à jour du bouton de validation des avis
    if (window.selectedCustomerReviews && window.selectedCustomerReviews.length > 0) {
        updateValidationButton('validate-reviews-btn', window.selectedCustomerReviews.length, 6, 'avis clients');
        console.log('[DEBUG] Bouton de validation des avis mis à jour:', window.selectedCustomerReviews.length);
    }
}, 2000);

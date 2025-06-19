/**
 * Fonctions de formatage pour l'affichage du contenu avec sélecteurs
 */

// Fonction pour formater le titre du produit avec sélecteurs
function formatProductTitleWithSelectors(sectionId, title) {
    console.log('[DEBUG formatProductTitleWithSelectors] sectionId:', sectionId);
    console.log('[DEBUG formatProductTitleWithSelectors] title reçu:', title);
    console.log('[DEBUG formatProductTitleWithSelectors] type de title:', typeof title);
    console.log('[DEBUG formatProductTitleWithSelectors] title est Array?', Array.isArray(title));
    
    if (!title) return '<p>Titre non disponible</p>';
    
    // Normaliser les données - gérer les objets avec versions et les arrays/strings directs
    let titleData = title;
    
    // Si c'est un objet avec des versions, extraire version1
    if (typeof title === 'object' && !Array.isArray(title) && title.version1) {
        console.log('[DEBUG formatProductTitleWithSelectors] title est un objet avec versions');
        console.log('[DEBUG formatProductTitleWithSelectors] title.version1:', title.version1);
        titleData = title.version1;
    }
    
    console.log('[DEBUG formatProductTitleWithSelectors] titleData après normalisation:', titleData);
    
    // Si c'est un array de titres
    if (Array.isArray(titleData)) {
        console.log('[DEBUG formatProductTitleWithSelectors] titleData est un array, longueur:', titleData.length);
        let html = '<div class="title-options">';
        titleData.forEach((singleTitle, index) => {
            // Vérifier si singleTitle est un objet ou une chaîne
            let titleText;
            if (typeof singleTitle === 'string') {
                // Si c'est déjà une string, l'utiliser directement
                titleText = singleTitle;
            } else if (typeof singleTitle === 'object' && singleTitle !== null) {
                // Si c'est un objet avec des propriétés nommées
                titleText = singleTitle.headline || singleTitle.title || singleTitle.name || JSON.stringify(singleTitle);
            } else {
                titleText = String(singleTitle);
            }
            
            // S'assurer que titleText est bien une chaîne
            titleText = String(titleText);
            console.log('[DEBUG formatProductTitleWithSelectors] titleText pour index', index, ':', titleText);
            
            html += `
                <div class="content-item title-option" data-section="${sectionId}" data-title-index="${index}">
                    <div class="version-content">
                        <h3 class="section-subtitle">${titleText}</h3>
                        <div class="selection-controls">
                            <button class="btn btn-sm btn-primary select-btn" onclick="selectProductTitle('${titleText.replace(/'/g, "\\'")}')">
                                <i class="fas fa-check"></i> Utiliser ce titre
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        console.log('[DEBUG formatProductTitleWithSelectors] HTML généré pour array');
        return html;
    }
    
    // Si c'est une string qui contient plusieurs titres séparés par des virgules
    if (typeof titleData === 'string' && titleData.includes(',')) {
        const titles = titleData.split(',').map(t => t.trim()).filter(t => t.length > 0);
        if (titles.length > 1) {
            let html = '<div class="title-options">';
            titles.forEach((singleTitle, index) => {
                // Vérifier si singleTitle est un objet ou une chaîne
                let titleText;
                if (typeof singleTitle === 'string') {
                    // Si c'est déjà une string, l'utiliser directement
                    titleText = singleTitle;
                } else if (typeof singleTitle === 'object' && singleTitle !== null) {
                    // Si c'est un objet avec des propriétés nommées
                    titleText = singleTitle.headline || singleTitle.title || singleTitle.name || JSON.stringify(singleTitle);
                } else {
                    titleText = String(singleTitle);
                }
                
                // S'assurer que titleText est bien une chaîne
                titleText = String(titleText);
                
                html += `
                    <div class="content-item title-option" data-section="${sectionId}" data-title-index="${index}">
                        <div class="version-content">
                            <h3 class="section-subtitle">${titleText}</h3>
                            <div class="selection-controls">
                                <button class="btn btn-sm btn-primary select-btn" onclick="selectProductTitle('${titleText.replace(/'/g, "\\'")}')">
                                    <i class="fas fa-check"></i> Utiliser ce titre
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            return html;
        }
    }
    
    // Si c'est un seul titre (string)
    const titleText = String(titleData);
    return `
        <div class="content-item" data-section="${sectionId}">
            <div class="version-content">
                <h3 class="section-subtitle">${titleText}</h3>
                <div class="selection-controls">
                    <button class="btn btn-sm btn-primary select-btn" onclick="selectProductTitle('${titleText.replace(/'/g, "\\'")}')">
                        <i class="fas fa-check"></i> Utiliser ce titre
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Fonction pour formater les avantages produit avec sélecteurs
function formatBenefitsWithSelectors(sectionId, benefits) {
    console.log('[DEBUG formatBenefitsWithSelectors] sectionId:', sectionId);
    console.log('[DEBUG formatBenefitsWithSelectors] benefits reçu:', benefits);
    console.log('[DEBUG formatBenefitsWithSelectors] type de benefits:', typeof benefits);
    console.log('[DEBUG formatBenefitsWithSelectors] benefits est Array?', Array.isArray(benefits));
    
    // Normaliser les données - gérer les objets avec versions et les arrays directs
    let benefitsArray = [];
    
    if (!benefits) {
        console.log('[DEBUG formatBenefitsWithSelectors] benefits est null/undefined');
        return '<p>Bénéfices non disponibles</p>';
    }
    
    if (Array.isArray(benefits)) {
        benefitsArray = benefits;
        console.log('[DEBUG formatBenefitsWithSelectors] benefits est un array direct, longueur:', benefitsArray.length);
    } else if (typeof benefits === 'object') {
        console.log('[DEBUG formatBenefitsWithSelectors] benefits est un objet');
        console.log('[DEBUG formatBenefitsWithSelectors] benefits.version1:', benefits.version1);
        // Si c'est un objet avec des versions, prendre version1 en priorité
        if (benefits.version1 && Array.isArray(benefits.version1)) {
            benefitsArray = benefits.version1;
            console.log('[DEBUG formatBenefitsWithSelectors] utilisation de version1, longueur:', benefitsArray.length);
        } else if (benefits.version1) {
            benefitsArray = [benefits.version1];
            console.log('[DEBUG formatBenefitsWithSelectors] version1 n\'est pas un array, conversion');
        } else {
            // Sinon, prendre toutes les valeurs de l'objet
            benefitsArray = Object.values(benefits).filter(v => v !== null && v !== undefined);
            console.log('[DEBUG formatBenefitsWithSelectors] utilisation des valeurs de l\'objet, longueur:', benefitsArray.length);
        }
    } else {
        benefitsArray = [benefits];
        console.log('[DEBUG formatBenefitsWithSelectors] benefits n\'est ni array ni objet, conversion en array');
    }
    
    console.log('[DEBUG formatBenefitsWithSelectors] benefitsArray final:', benefitsArray);
    console.log('[DEBUG formatBenefitsWithSelectors] benefitsArray.length:', benefitsArray.length);
    
    if (benefitsArray.length === 0) {
        console.log('[DEBUG formatBenefitsWithSelectors] benefitsArray est vide');
        return '<p>Bénéfices non disponibles</p>';
    }
    
    let html = '<div class="benefits-selector">';
    
    // Titre et instructions
    html += `
        <div class="benefits-selection-container">
            <h4 class="benefits-title">Sélectionnez 4 avantages clés</h4>
            <p class="benefits-instruction">Cliquez sur les avantages qui représentent le mieux votre produit</p>
            
            <!-- Compteur de sélection -->
            <div class="selection-counter">
                <span class="counter-text">Bénéfices sélectionnés</span>
                <span class="counter-number">0/4</span>
            </div>
            
            <!-- Tags des avantages -->
            <div class="benefits-tags-container">
    `;
    
    benefitsArray.forEach((benefit, index) => {
        let benefitTitle = benefit.headline || benefit.title || `Bénéfice ${index + 1}`;
        
        // Nettoyer les tirets, puces et numéros au début
        benefitTitle = benefitTitle.replace(/^[-*•]\s*/, '').trim();
        benefitTitle = benefitTitle.replace(/^\d+\.\s*/, '').trim();
        
        const benefitDesc = benefit.description || '';
        const isSelected = window.selectedBenefits && window.selectedBenefits.some(b => b && b.index === index);
        const selectionIndex = window.selectedBenefits && window.selectedBenefits.findIndex(b => b && b.index === index) + 1;
        
        html += `
            <div class="benefit-tag ${isSelected ? 'selected' : ''}" 
                 data-benefit-index="${index}"
                 data-benefit-title="${benefitTitle}"
                 data-benefit-description="${benefitDesc}"
                 onclick="window.toggleBenefitSelection(${index})"
                 title="${benefitDesc}">
                <span class="benefit-title">${benefitTitle}</span>
                <span class="selection-badge">${isSelected ? selectionIndex : ''}</span>
            </div>
        `;
    });
    
    html += `
            </div>
            
            <!-- Aperçu des avantages sélectionnés -->
            <div class="selected-benefits-preview" style="display: none;">
                <h5>Bénéfices sélectionnés :</h5>
                <div class="selected-benefits-list"></div>
            </div>
            
            <!-- Actions -->
            <div class="benefits-actions">
                <button type="button" id="validateBenefitsBtn" class="validate-benefits-btn" disabled>
                    Sélectionnez 4 bénéfices
                </button>
            </div>
        </div>
    `;
    
    html += '</div>';
    return html;
}

// Fonction pour formater les bénéfices émotionnels avec sélecteurs
function formatEmotionalBenefitsWithSelectors(sectionId, benefits) {
    // Normaliser les données - gérer les objets avec versions et les arrays directs
    let benefitsArray = [];
    
    if (!benefits) {
        return '<p>Bénéfices émotionnels non disponibles</p>';
    }
    
    if (Array.isArray(benefits)) {
        benefitsArray = benefits;
    } else if (typeof benefits === 'object') {
        // Si c'est un objet avec des versions, prendre version1 en priorité
        if (benefits.version1 && Array.isArray(benefits.version1)) {
            benefitsArray = benefits.version1;
        } else if (benefits.version1) {
            benefitsArray = [benefits.version1];
        } else {
            // Sinon, prendre toutes les valeurs de l'objet
            benefitsArray = Object.values(benefits).filter(v => v !== null && v !== undefined);
        }
    } else {
        benefitsArray = [benefits];
    }
    
    if (benefitsArray.length === 0) {
        return '<p>Bénéfices émotionnels non disponibles</p>';
    }
    
    // Initialiser le tableau de sélection si nécessaire
    if (!window.selectedEmotionalBenefits) {
        window.selectedEmotionalBenefits = [];
    }
    
    let html = '<div class="benefits-selector emotional-benefits-selector">';
    
    // Compteur de sélection
    const isComplete = window.selectedEmotionalBenefits.length === 2;
    html += `
        <div class="selection-counter">
            <span class="counter-text">Sélectionnez 2 bénéfices émotionnels pour votre produit</span>
            <span class="counter-number ${isComplete ? 'counter-complete' : ''}">
                ${window.selectedEmotionalBenefits.length}/2
            </span>
        </div>
    `;
    
    html += `
        <div class="benefits-selection-container">
            <h4 class="benefits-title">Sélectionnez les bénéfices émotionnels</h4>
            <p class="benefits-instruction">Choisissez les bénéfices émotionnels qui résonnent le mieux avec votre audience</p>
            
            <div class="benefits-tags-container">
    `;
    
    benefitsArray.forEach((benefit, index) => {
        let benefitTitle = benefit.headline || benefit.title || `Bénéfice émotionnel ${index + 1}`;
        
        // Nettoyer les tirets, puces et numéros au début
        benefitTitle = benefitTitle.replace(/^[-*•]\s*/, '').trim();
        benefitTitle = benefitTitle.replace(/^\d+\.\s*/, '').trim();
        
        const benefitDesc = benefit.description || benefit.text || '';
        const isSelected = window.selectedEmotionalBenefits.some(b => b && b.index === index);
        const selectionIndex = window.selectedEmotionalBenefits.findIndex(b => b && b.index === index) + 1;
        
        html += `
            <div class="benefit-tag ${isSelected ? 'selected' : ''}" 
                 data-emotional-benefit-index="${index}"
                 data-emotional-benefit-title="${benefitTitle}"
                 data-emotional-benefit-description="${benefitDesc}"
                 onclick="window.toggleEmotionalBenefitSelection(${index})"
                 title="${benefitDesc}">
                <span class="benefit-title">${benefitTitle}</span>
                <span class="selection-badge">${isSelected ? selectionIndex : ''}</span>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    // Bouton de validation
    html += `
        <div class="benefits-actions">
            <button class="validate-emotional-benefits-btn" ${isComplete ? '' : 'disabled'}>
                ${isComplete ? 'Valider la sélection' : `Sélectionnez ${2 - window.selectedEmotionalBenefits.length} bénéfice(s) de plus`}
            </button>
        </div>
    `;
    
    html += '</div>';
    return html;
}

// Fonction pour formater les cas d'utilisation avec sélecteurs
function formatUseCasesWithSelectors(sectionId, useCases) {
    // Normaliser les données - gérer les objets avec versions et les arrays directs
    let useCasesArray = [];
    
    if (!useCases) {
        return '<p>Cas d\'utilisation non disponibles</p>';
    }
    
    if (Array.isArray(useCases)) {
        useCasesArray = useCases;
    } else if (typeof useCases === 'object') {
        // Si c'est un objet avec des versions, prendre version1 en priorité
        if (useCases.version1 && Array.isArray(useCases.version1)) {
            useCasesArray = useCases.version1;
        } else if (useCases.version1) {
            useCasesArray = [useCases.version1];
        } else {
            // Sinon, prendre toutes les valeurs de l'objet
            useCasesArray = Object.values(useCases).filter(v => v !== null && v !== undefined);
        }
    } else {
        useCasesArray = [useCases];
    }
    
    // Filtrer les phrases d'introduction parasites
    useCasesArray = useCasesArray.filter(useCase => {
        if (typeof useCase === 'string') {
            // Filtrer les phrases d'introduction
            const introPatterns = [
                /^(bien sûr,?\s*)?voici\s+\d*\s*cas\s+d['']utilisation/i,
                /^(bien sûr,?\s*)?voici\s+\d*\s*.*?pour.*?:/i,
                /^(voici|voilà)\s+.*?:/i
            ];
            
            return !introPatterns.some(pattern => pattern.test(useCase.trim()));
        } else if (typeof useCase === 'object' && useCase !== null) {
            // Pour les objets, vérifier le titre
            const title = useCase.title || useCase.headline || '';
            if (typeof title === 'string') {
                const introPatterns = [
                    /^(bien sûr,?\s*)?voici\s+\d*\s*cas\s+d['']utilisation/i,
                    /^(bien sûr,?\s*)?voici\s+\d*\s*.*?pour.*?:/i,
                    /^(voici|voilà)\s+.*?:/i
                ];
                
                return !introPatterns.some(pattern => pattern.test(title.trim()));
            }
        }
        return true; // Garder les autres éléments
    });
    
    console.log('[DEBUG formatUseCasesWithSelectors] useCasesArray après filtrage:', useCasesArray.length, 'éléments');
    
    if (useCasesArray.length === 0) {
        return '<p>Cas d\'utilisation non disponibles</p>';
    }
    
    // Initialiser le tableau de sélection si nécessaire
    if (!window.selectedUseCases) {
        window.selectedUseCases = [];
    }
    
    let html = '<div class="benefits-selector use-cases-selector">';
    
    // Compteur de sélection
    const isComplete = window.selectedUseCases.length >= 3;
    html += `
        <div class="selection-counter">
            <div class="counter-text">Sélectionnez exactement 3 cas d'utilisation pour votre produit</div>
            <div class="counter-number ${isComplete ? 'counter-complete' : ''}">
                ${window.selectedUseCases.length}/3
            </div>
        </div>
    `;
    
    html += `
        <div class="benefits-selection-container">
            <h4 class="benefits-title">Sélectionnez les cas d'utilisation</h4>
            <p class="benefits-instruction">Choisissez les cas d'utilisation les plus pertinents pour votre produit</p>
            
            <div class="benefits-tags-container">
    `;
    
    useCasesArray.forEach((useCase, index) => {
        let useCaseTitle = useCase.title || useCase.headline || `Cas d'utilisation ${index + 1}`;
        
        // Nettoyer les chiffres et points au début (ex: "1. ", "2. ", "3. ")
        useCaseTitle = useCaseTitle.replace(/^\d+\.\s*/, '').trim();
        
        const useCaseDesc = useCase.description || useCase.explanation || '';
        const isSelected = window.selectedUseCases.some(b => b && b.index === index);
        const selectionIndex = window.selectedUseCases.findIndex(b => b && b.index === index) + 1;
        
        html += `
            <div class="benefit-tag ${isSelected ? 'selected' : ''}" 
                 data-use-case-index="${index}"
                 data-use-case-title="${useCaseTitle}"
                 data-use-case-description="${useCaseDesc}"
                 onclick="window.toggleUseCaseSelection(${index})"
                 title="${useCaseDesc}">
                <span class="benefit-title">${useCaseTitle}</span>
                <span class="selection-badge">${isSelected ? selectionIndex : ''}</span>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    // Bouton de validation
    html += `
        <div class="benefits-actions">
            <button class="validate-use-cases-btn" ${isComplete ? '' : 'disabled'}>
                ${isComplete ? 'Valider la sélection' : `Sélectionnez ${3 - window.selectedUseCases.length} cas d'utilisation de plus`}
            </button>
        </div>
    `;
    
    html += '</div>';
    return html;
}

// Fonction pour formater les caractéristiques avec sélecteurs
function formatCharacteristicsWithSelectors(sectionId, characteristics) {
    // Normaliser les données - gérer les objets avec versions et les arrays directs
    let characteristicsArray = [];
    
    if (!characteristics) {
        return '<p>Caractéristiques non disponibles</p>';
    }
    
    if (Array.isArray(characteristics)) {
        characteristicsArray = characteristics;
    } else if (typeof characteristics === 'object') {
        // Si c'est un objet avec des versions, prendre version1 en priorité
        if (characteristics.version1 && Array.isArray(characteristics.version1)) {
            characteristicsArray = characteristics.version1;
        } else if (characteristics.version1) {
            characteristicsArray = [characteristics.version1];
        } else {
            // Sinon, prendre toutes les valeurs de l'objet
            characteristicsArray = Object.values(characteristics).filter(v => v !== null && v !== undefined);
        }
    } else {
        characteristicsArray = [characteristics];
    }
    
    if (characteristicsArray.length === 0) {
        return '<p>Caractéristiques non disponibles</p>';
    }
    
    // Initialiser le tableau de sélection si nécessaire
    if (!window.selectedCharacteristics) {
        window.selectedCharacteristics = [];
    }
    
    let html = '<div class="benefits-selector characteristics-selector">';
    
    // Compteur de sélection
    const isComplete = window.selectedCharacteristics.length === 4;
    html += `
        <div class="selection-counter">
            <div class="counter-text">Sélectionnez 4 caractéristiques principales de votre produit</div>
            <div class="counter-number ${isComplete ? 'counter-complete' : ''}">
                ${window.selectedCharacteristics.length}/4
            </div>
        </div>
    `;
    
    html += `
        <div class="benefits-selection-container">
            <h4 class="benefits-title">Sélectionnez les caractéristiques</h4>
            <p class="benefits-instruction">Choisissez les caractéristiques les plus importantes de votre produit</p>
            
            <div class="benefits-tags-container">
    `;
    
    characteristicsArray.forEach((characteristic, index) => {
        let characteristicTitle = characteristic.title || characteristic.headline || characteristic.name || `Caractéristique ${index + 1}`;
        
        // Nettoyer les tirets, puces et numéros au début
        characteristicTitle = characteristicTitle.replace(/^[-*•]\s*/, '').trim();
        characteristicTitle = characteristicTitle.replace(/^\d+\.\s*/, '').trim();
        
        const characteristicDesc = characteristic.description || characteristic.text || '';
        const isSelected = window.selectedCharacteristics.some(b => b && b.index === index);
        const selectionIndex = window.selectedCharacteristics.findIndex(b => b && b.index === index) + 1;
        
        html += `
            <div class="benefit-tag ${isSelected ? 'selected' : ''}" 
                 data-characteristic-index="${index}"
                 data-characteristic-title="${characteristicTitle}"
                 data-characteristic-description="${characteristicDesc}"
                 onclick="window.toggleCharacteristicSelection(${index})"
                 title="${characteristicDesc}">
                <span class="benefit-title">${characteristicTitle}</span>
                <span class="selection-badge">${isSelected ? selectionIndex : ''}</span>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    // Bouton de validation
    html += `
        <div class="benefits-actions">
            <button class="validate-characteristics-btn" ${isComplete ? '' : 'disabled'}>
                ${isComplete ? 'Valider la sélection' : `Sélectionnez ${4 - window.selectedCharacteristics.length} caractéristique(s) de plus`}
            </button>
        </div>
    `;
    
    html += '</div>';
    return html;
}

// Fonction pour formater les avantages concurrentiels avec sélecteurs
function formatCompetitiveAdvantagesWithSelectors(sectionId, advantages) {
    // Normaliser les données - gérer les objets avec versions et les arrays directs
    let advantagesArray = [];
    
    if (!advantages) {
        return '<p>Avantages concurrentiels non disponibles</p>';
    }
    
    if (Array.isArray(advantages)) {
        advantagesArray = advantages;
    } else if (typeof advantages === 'object') {
        // Si c'est un objet avec des versions, prendre version1 en priorité
        if (advantages.version1 && Array.isArray(advantages.version1)) {
            advantagesArray = advantages.version1;
        } else if (advantages.version1) {
            advantagesArray = [advantages.version1];
        } else {
            // Sinon, prendre toutes les valeurs de l'objet
            advantagesArray = Object.values(advantages).filter(v => v !== null && v !== undefined);
        }
    } else {
        advantagesArray = [advantages];
    }
    
    if (advantagesArray.length === 0) {
        return '<p>Avantages concurrentiels non disponibles</p>';
    }
    
    return formatSingleCompetitiveAdvantages(sectionId, advantagesArray);
}

// Fonction helper pour formater une seule version des avantages concurrentiels
function formatSingleCompetitiveAdvantages(sectionId, advantagesArray) {
    // Initialiser le tableau de sélection si nécessaire
    if (!window.selectedCompetitiveAdvantages) {
        window.selectedCompetitiveAdvantages = [];
    }
    
    let html = '<div class="benefits-selector competitive-advantages-selector">';
    
    // Compteur de sélection
    const isComplete = window.selectedCompetitiveAdvantages.length === 4;
    html += `
        <div class="selection-counter">
            <div class="counter-text">Sélectionnez 4 avantages concurrentiels de votre produit</div>
            <div class="counter-number ${isComplete ? 'counter-complete' : ''}">
                ${window.selectedCompetitiveAdvantages.length}/4
            </div>
        </div>
    `;
    
    html += `
        <div class="benefits-selection-container">
            <h4 class="benefits-title">Sélectionnez les avantages concurrentiels</h4>
            <p class="benefits-instruction">Choisissez ce qui différencie votre produit de la concurrence</p>
            
            <div class="benefits-tags-container">
    `;
    
    advantagesArray.forEach((advantage, index) => {
        let advantageTitle = advantage.title || advantage.headline || `Avantage concurrentiel ${index + 1}`;
        
        // Nettoyer les tirets, puces et numéros au début
        advantageTitle = advantageTitle.replace(/^[-*•]\s*/, '').trim();
        advantageTitle = advantageTitle.replace(/^\d+\.\s*/, '').trim();
        
        const advantageDesc = advantage.description || advantage.explanation || '';
        const isSelected = window.selectedCompetitiveAdvantages.some(b => b && b.index === index);
        const selectionIndex = window.selectedCompetitiveAdvantages.findIndex(b => b && b.index === index) + 1;
        
        html += `
            <div class="benefit-tag ${isSelected ? 'selected' : ''}" 
                 data-advantage-index="${index}"
                 data-advantage-title="${advantageTitle}"
                 data-advantage-description="${advantageDesc}"
                 onclick="window.toggleCompetitiveAdvantageSelection(${index})"
                 title="${advantageDesc}">
                <span class="benefit-title">${advantageTitle}</span>
                <span class="selection-badge">${isSelected ? selectionIndex : ''}</span>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    // Bouton de validation
    html += `
        <div class="benefits-actions">
            <button class="validate-competitive-advantages-btn" ${isComplete ? '' : 'disabled'}>
                ${isComplete ? 'Valider la sélection' : `Sélectionnez ${4 - window.selectedCompetitiveAdvantages.length} avantage(s) de plus`}
            </button>
        </div>
    `;
    
    html += '</div>';
    return html;
}

// Fonction pour formater les avis clients avec sélecteurs
window.formatCustomerReviewsWithSelectors = function(sectionId, reviews) {
    if (!reviews) return '<p>Avis clients non disponibles</p>';
    
    // Normaliser les données - gérer les objets avec versions et les arrays directs
    let reviewsArray = [];
    
    if (Array.isArray(reviews)) {
        reviewsArray = reviews;
    } else if (typeof reviews === 'object') {
        // Si c'est un objet avec des versions, prendre version1 en priorité
        if (reviews.version1 && Array.isArray(reviews.version1)) {
            reviewsArray = reviews.version1;
        } else if (reviews.version1) {
            reviewsArray = [reviews.version1];
        } else {
            // Sinon, prendre toutes les valeurs de l'objet
            reviewsArray = Object.values(reviews).filter(v => v !== null && v !== undefined);
        }
    } else {
        reviewsArray = [reviews];
    }
    
    if (reviewsArray.length === 0) {
        return '<p>Avis clients non disponibles</p>';
    }
    
    // Initialiser le tableau de sélection si nécessaire
    if (!window.selectedCustomerReviews) {
        window.selectedCustomerReviews = [];
    }

    // Fonction helper pour générer des initiales d'avatar
    function getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    
    // Fonction helper pour générer une couleur d'avatar basée sur le nom
    function getAvatarColor(name) {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    }
    
    // Fonction helper pour générer une date réaliste
    function getRandomDate() {
        const dates = [
            'Il y a 2 jours', 'Il y a 1 semaine', 'Il y a 2 semaines', 
            'Il y a 3 semaines', 'Il y a 1 mois', 'Il y a 2 mois'
        ];
        return dates[Math.floor(Math.random() * dates.length)];
    }
    
    let html = '<div class="customer-reviews-selector">';
    
    // Compteur de sélection
    const isComplete = window.selectedCustomerReviews.length === 6;
    html += `
        <div class="selection-counter">
            <div class="counter-text">Sélectionnez 6 avis clients pour votre produit</div>
            <div class="counter-number ${isComplete ? 'counter-complete' : ''}">
                ${window.selectedCustomerReviews.length}/6
            </div>
        </div>
    `;
    
    html += `
        <div class="reviews-selection-container">
            <h4 class="reviews-title">Sélectionnez les avis clients</h4>
            <p class="reviews-instruction">Choisissez les témoignages les plus convaincants</p>
            
            <div class="customer-reviews-container">
    `;
    
    reviewsArray.forEach((review, index) => {
        const customerName = review.name || `Client ${index + 1}`;
        const rating = review.rating || 5;
        const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
        const initials = getInitials(customerName);
        const avatarColor = getAvatarColor(customerName);
        const reviewDate = getRandomDate();
        const isVerified = Math.random() > 0.3; // 70% de chance d'être vérifié
        const isSelected = window.selectedCustomerReviews.some(r => r && r.index === index);
        
        html += `
            <div class="customer-review-card ${isSelected ? 'selected' : ''}" 
                 data-review-index="${index}"
                 onclick="window.toggleCustomerReviewSelection(${index})"
                 style="cursor: pointer;">
                <div class="review-header">
                    <div class="customer-avatar" style="background-color: ${avatarColor}">
                        ${initials}
                    </div>
                    <div class="customer-info">
                        <div class="customer-name-row">
                            <span class="customer-name">${customerName}</span>
                            ${isVerified ? '<span class="verified-badge" title="Achat vérifié">✓</span>' : ''}
                        </div>
                        <div class="review-meta">
                            <div class="review-rating">${stars}</div>
                            <span class="review-date">${reviewDate}</span>
                        </div>
                    </div>
                    ${isSelected ? '<div class="selection-badge" style="display: inline-flex;">✓</div>' : '<div class="selection-badge" style="display: none;">✓</div>'}
                </div>
                
                <div class="review-content">
                    <p class="review-text">${review.review || review.text || review.comment}</p>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    // Bouton de validation
    html += `
        <div class="reviews-actions">
            <button id="validate-reviews-btn" class="validate-reviews-btn" ${isComplete ? '' : 'disabled'}>
                ${isComplete ? 'Valider la sélection' : `Sélectionnez ${6 - window.selectedCustomerReviews.length} avis de plus`}
            </button>
        </div>
    `;
    
    html += '</div>';
    
    // Ajouter les styles CSS pour les avis clients
    html += `
        <style>
        .customer-reviews-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
            padding: 10px 0;
        }
        
        .customer-review-card {
            background: #2a2d3a;
            border: 1px solid #3a3f4f;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            position: relative;
        }
        
        .customer-review-card:hover {
            box-shadow: 0 4px 16px rgba(0,0,0,0.4);
            transform: translateY(-2px);
            border-color: #4a5568;
        }
        
        .review-header {
            display: flex;
            align-items: flex-start;
            margin-bottom: 15px;
        }
        
        .customer-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 16px;
            margin-right: 12px;
            flex-shrink: 0;
        }
        
        .customer-info {
            flex: 1;
        }
        
        .customer-name-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;
        }
        
        .customer-name {
            font-weight: 600;
            font-size: 16px;
            color: #e2e8f0;
        }
        
        .verified-badge {
            background: #00d4ff;
            color: white;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
        }
        
        .review-meta {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .review-rating {
            color: #ffa500;
            font-size: 16px;
            letter-spacing: 1px;
        }
        
        .review-date {
            color: #a0aec0;
            font-size: 14px;
        }
        
        .review-content {
            margin-bottom: 16px;
        }
        
        .review-text {
            color: #e2e8f0;
            line-height: 1.6;
            font-size: 15px;
            margin: 0;
        }
        
        .review-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 12px;
            border-top: 1px solid #4a5568;
        }
        
        .selection-controls {
            display: flex;
            align-items: center;
        }
        
        .checkbox-container {
            display: flex;
            align-items: center;
            cursor: pointer;
            font-size: 14px;
            color: #a0aec0;
        }
        
        .checkbox-container input[type="checkbox"] {
            margin-right: 8px;
            transform: scale(1.1);
            accent-color: #00d4ff;
        }
        
        .checkbox-label {
            user-select: none;
        }
        
        .checkbox-container:hover .checkbox-label {
            color: #e2e8f0;
        }
        
        @media (max-width: 768px) {
            .customer-reviews-container {
                grid-template-columns: 1fr;
            }
            
            .review-footer {
                flex-direction: column;
                gap: 12px;
                align-items: flex-start;
            }
        }
        </style>
    `;
    
    return html;
};

// Fonction pour formater les FAQ avec sélecteurs
function formatFAQWithSelectors(sectionId, content) {
    if (!content) return '<p>FAQ non disponible</p>';
    
    let faqs = [];
    
    // La FAQ est maintenant directement un tableau, plus besoin de version1/version2
    if (Array.isArray(content)) {
        faqs = content;
    } else if (typeof content === 'object' && content.version1) {
        // Garde la compatibilité avec l'ancien format au cas où
        faqs = content.version1;
    }
    
    // Ajouter les FAQ manuelles
    if (window.manualFAQs && Array.isArray(window.manualFAQs)) {
        faqs = [...faqs, ...window.manualFAQs];
    }
    
    if (faqs.length === 0) return '<p>Aucune FAQ disponible</p>';
    
    // Initialiser le tableau de sélection si nécessaire
    if (!window.selectedFAQs) {
        window.selectedFAQs = [];
    }
    
    let html = '<div class="faq-selector">';
    
    // Compteur de sélection
    const isComplete = window.selectedFAQs.length === 4;
    html += `
        <div class="selection-counter">
            <div class="counter-text">Sélectionnez les questions fréquentes importantes</div>
            <div class="counter-number ${isComplete ? 'counter-complete' : ''}">
                ${window.selectedFAQs.length}/4
            </div>
        </div>
    `;
    
    html += `
        <div class="faq-selection-container">
            <h4 class="faq-title">Sélectionnez les FAQ les plus pertinentes</h4>
            <p class="faq-instruction">Choisissez les questions que vos clients posent le plus souvent</p>
            
            <div class="faq-tags-container">
    `;
    
    faqs.forEach((faq, index) => {
        let question = faq.question || '';
        let answer = faq.answer || faq.response || '';
        
        // Nettoyer les préfixes si présents
        question = question.replace(/^(FAQ\s*\d+\s*:|Question\s*\d+\s*:|\d+\.\s*|Q\s*:)/i, '').trim();
        answer = answer.replace(/^(Réponse\s*:|R\s*:)/i, '').trim();
        
        // Si la réponse contient la question au début, la supprimer
        if (answer.toLowerCase().startsWith(question.toLowerCase()) && question.length > 10) {
            answer = answer.substring(question.length).trim();
            // Supprimer les caractères de ponctuation au début
            answer = answer.replace(/^[:\-\s]+/, '').trim();
        }
        
        // Si pas de question valide, utiliser le début de la réponse
        if (!question) {
            const answerWords = answer.split(' ');
            question = answerWords.length > 10 ? answerWords.slice(0, 10).join(' ') + '...' : answer || `Question ${index + 1}`;
        }
        
        // S'assurer que la réponse n'est pas vide
        if (!answer) {
            answer = '';
        }

        // Déterminer l'identifiant unique pour la FAQ
        const faqId = faq.manualId || index;
        const isManual = faq.isManual || false;
        
        const isSelected = window.selectedFAQs.some(f => f && (f.index === index || f.manualId === faq.manualId));
        const selectionIndex = window.selectedFAQs.findIndex(f => f && (f.index === index || f.manualId === faq.manualId)) + 1;
        
        html += `
            <div class="faq-tag ${isSelected ? 'selected' : ''} ${isManual ? 'manual-item' : ''}" 
                 data-faq-index="${faqId}"
                 data-faq-question="${question}"
                 data-faq-answer="${answer}"
                 onclick="window.toggleFAQSelection('${faqId}', ${isManual})"
                 title="${answer}"
                 style="${isManual ? 'border-left: 4px solid #00d4ff;' : ''}">
                ${isManual ? '<div class="manual-label" style="font-size: 12px; color: #00d4ff; font-weight: bold; margin-bottom: 5px;">✏️ Ajouté manuellement</div>' : ''}
                <div class="faq-question-preview">${question}</div>
                <div class="faq-answer-preview">${answer}</div>
                <span class="selection-badge">${isSelected ? selectionIndex : ''}</span>
            </div>
        `;
    });
    
    html += `
            </div>
            
            <!-- Bouton d'ajout manuel -->
            <div class="manual-input-section">
                <button class="add-manual-faq-btn" onclick="window.showAddFAQModal()">
                    ✏️ Ajouter manuellement
                </button>
            </div>
            
            <!-- Bouton de validation -->
            <div class="faq-actions">
                <button id="validate-faq-btn" class="validate-faq-btn" ${isComplete ? '' : 'disabled'}>
                    ${isComplete ? 'Valider la sélection' : `Sélectionnez ${4 - window.selectedFAQs.length} FAQ de plus`}
                </button>
            </div>
        </div>
    `;
    
    html += '</div>';
    return html;
}

// Fonction pour formater du texte avec sélecteur de version (pour les éléments simples)
function formatTextWithVersionSelector(sectionId, content) {
    if (!content) return '<p>Contenu non disponible</p>';
    
    // Si c'est un objet avec des versions
    if (typeof content === 'object' && content.version1) {
        // Récupérer la version sélectionnée pour cette section
        const selectedVersion = window.selectedVersion && window.selectedVersion[sectionId] ? window.selectedVersion[sectionId] : 1;
        
        // Générer les boutons de version dynamiquement
        let versionButtons = '';
        const availableVersions = Object.keys(content).filter(key => key.startsWith('version')).sort();
        
        availableVersions.forEach(versionKey => {
            const versionNumber = parseInt(versionKey.replace('version', ''));
            const isActive = selectedVersion === versionNumber;
            versionButtons += `<button class="version-btn ${isActive ? 'active' : ''}" onclick="selectVersion('${sectionId}', ${versionNumber})">Version ${versionNumber}</button>`;
        });
        
        return `
            <div class="content-item" data-section="${sectionId}">
                <div class="version-selector">
                    ${versionButtons}
                </div>
                <div class="version-content">
                    <p>${content[`version${selectedVersion}`] || content.version1}</p>
                </div>
            </div>
        `;
    }
    
    // Si c'est juste du texte
    if (typeof content === 'string') {
        return `
            <div class="content-item" data-section="${sectionId}">
                <div class="version-content">
                    <p>${content}</p>
                </div>
            </div>
        `;
    }
    
    return '<p>Format de contenu non reconnu</p>';
}

// Fonction pour formater les FAQ avec sélecteur de version
function formatFAQWithVersionSelector(sectionId, content) {
    if (!content) return '<p>FAQ non disponible</p>';
    
    // Si c'est un objet avec des versions
    if (typeof content === 'object' && content.version1) {
        // Si version1 est un tableau de FAQs
        if (Array.isArray(content.version1)) {
            let html = '<div class="faq-content">';
            content.version1.forEach((faq, index) => {
                html += `
                    <div class="faq-item">
                        <h4 class="faq-question">${faq.question || `Question ${index + 1}`}</h4>
                        <p class="faq-answer">${faq.answer || faq.response || ''}</p>
                    </div>
                `;
            });
            html += '</div>';
            return html;
        }
        
        // Si version1 est juste du texte
        return `
            <div class="content-item" data-section="${sectionId}">
                <div class="version-content">
                    <div class="faq-content">${content.version1}</div>
                </div>
            </div>
        `;
    }
    
    // Si c'est juste du texte
    if (typeof content === 'string') {
        return `
            <div class="content-item" data-section="${sectionId}">
                <div class="version-content">
                    <div class="faq-content">${content}</div>
                </div>
            </div>
        `;
    }
    
    return '<p>Format de FAQ non reconnu</p>';
}

// Fonction pour formater les angles marketing en cartes sélectionnables
function formatMarketingAngleSelection(angles) {
    if (!angles || angles.length === 0) {
        return '<p>Aucun angle marketing disponible</p>';
    }
    
    let html = `
        <div class="marketing-angle-section">
            <h2 class="section-title">Angles Marketing</h2>
            <div class="marketing-angle-selection">
                <div class="angle-selection-header">
                    <h3>Sélectionnez votre angle marketing principal</h3>
                    <p>Choisissez l'angle qui correspond le mieux à votre stratégie commerciale</p>
                </div>
                <div class="marketing-angles-table-container">
                    <table class="marketing-angles-table">
                        <thead>
                            <tr>
                                <th>Sélection</th>
                                <th>Nom de l'angle</th>
                                <th>Impact marché</th>
                                <th>Taille du marché</th>
                                <th>Problème à résoudre</th>
                                <th>Émotions à évoquer</th>
                                <th>Peurs & Frustrations</th>
                                <th>Application tactique</th>
                                <th>Preuves & Données</th>
                            </tr>
                        </thead>
                        <tbody>
    `;
    
    angles.forEach((angle, index) => {
        // Vérifier que l'angle et ses propriétés existent
        if (!angle) {
            console.warn('[Content Formatters] Angle undefined à l\'index:', index);
            return;
        }
        
        // Extraire le pourcentage depuis marketImpact avec protection
        let impactPercentage = '50'; // valeur par défaut
        if (angle.marketImpact && typeof angle.marketImpact === 'string') {
            const impactMatch = angle.marketImpact.match(/(\d+)%/);
            impactPercentage = impactMatch ? impactMatch[1] : '50';
        }
        
        // Vérifier les propriétés essentielles avec des fallbacks
        const angleName = angle.name || `Angle ${index + 1}`;
        const angleId = angle.id || index;
        
        html += `
            <tr class="marketing-angle-row" data-angle-id="${angleId}" onclick="window.selectMarketingAngle(${angleId})">
                <td class="selection-cell">
                    <input type="radio" name="marketing-angle" value="${angleId}" id="angle-${angleId}">
                    <label for="angle-${angleId}" class="radio-label"></label>
                </td>
                <td class="angle-name-cell">
                    <strong>${angleName}</strong>
                </td>
                <td class="impact-cell">
                    <span class="impact-percentage">${impactPercentage}%</span>
                </td>
                <td class="market-size-cell">
                    <div class="cell-content">${angle.marketSize || ''}</div>
                </td>
                <td class="problem-cell">
                    <div class="cell-content">${angle.problemToSolve || ''}</div>
                </td>
                <td class="emotions-cell">
                    <div class="cell-content">${angle.emotionsToEvoke || ''}</div>
                </td>
                <td class="fears-cell">
                    <div class="cell-content">${angle.fearsFrustrations || angle.fears || ''}</div>
                </td>
                <td class="tactical-cell">
                    <div class="cell-content">${angle.tacticalApplication || ''}</div>
                </td>
                <td class="evidence-cell">
                    <div class="cell-content">${angle.supportingEvidence || ''}</div>
                </td>
            </tr>
        `;
    });
    
    html += `
                        </tbody>
                    </table>
                </div>
                <div class="angle-selection-footer">
                    <button type="button" class="btn-primary" id="continue-after-angle-selection" onclick="window.continueAfterAngleSelection()">
                        Continuer avec l'angle sélectionné
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return html;
}

// Fonction pour rafraîchir la section des angles marketing
function refreshMarketingAngleSection() {
    const marketingAngleSection = document.querySelector('.marketing-angle-section');
    if (marketingAngleSection && window.generatedMarketingAngles) {
        // Sauvegarder l'angle actuellement sélectionné
        const currentSelectedAngle = window.selectedMarketingAngle;
        
        // Générer le nouveau HTML pour le contenu de la section
        const newHtml = formatMarketingAngleSelection(window.generatedMarketingAngles);
        
        // Extraire seulement le contenu intérieur de la section
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newHtml;
        const sectionContent = tempDiv.querySelector('.marketing-angle-section').innerHTML;
        
        // Remplacer seulement le contenu intérieur
        marketingAngleSection.innerHTML = sectionContent;
        
        // Mettre à jour le badge avec le nombre d'angles
        if (typeof window.updateMarketingAngleBadge === 'function') {
            window.updateMarketingAngleBadge();
        }
        
        // Réattacher tous les événements
        setTimeout(() => {
            attachMarketingAngleEvents();
            
            // Déclencher l'animation d'apparition des cartes
            const cards = document.querySelectorAll('.marketing-angle-card');
            cards.forEach(card => {
                card.classList.add('card-ready');
            });
            
            // Sélectionner automatiquement le nouvel angle personnalisé en priorité
            if (window.newlyCreatedAngleId) {
                window.selectMarketingAngle(window.newlyCreatedAngleId);
                console.log('[Content Formatters] Nouvel angle personnalisé sélectionné automatiquement');
                delete window.newlyCreatedAngleId;
            }
            // Sinon, restaurer la sélection si elle existait
            else if (currentSelectedAngle && window.selectMarketingAngle) {
                window.selectMarketingAngle(currentSelectedAngle.id);
                console.log('[Content Formatters] Sélection restaurée après rafraîchissement');
            }
            
            console.log('[Content Formatters] Événements réattachés après rafraîchissement');
        }, 100);
        
        console.log('[Content Formatters] Section des angles marketing rafraîchie');
    }
}

// Fonction pour attacher tous les événements des angles marketing
window.attachMarketingAngleEvents = function() {
    console.log('[Content Formatters] === DÉBUT ATTACHEMENT ÉVÉNEMENTS ===');
    
    // Attacher les événements de clic sur les cartes d'angles
    const angleCards = document.querySelectorAll('.marketing-angle-card:not(.add-angle-card)');
    console.log('[Content Formatters] Nombre de cartes d\'angles trouvées:', angleCards.length);
    
    angleCards.forEach(card => {
        const angleId = parseInt(card.dataset.angleId);
        console.log('[Content Formatters] Attachement événement pour angle ID:', angleId);
        
        // Créer une fonction nommée pour pouvoir la supprimer
        const clickHandler = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('[Content Formatters] Clic sur angle ID:', angleId);
            window.selectMarketingAngle(angleId);
        };
        
        // Supprimer les anciens événements et ajouter le nouveau
        card.removeEventListener('click', card._clickHandler);
        card._clickHandler = clickHandler;
        card.addEventListener('click', clickHandler);
    });
    
    // Attacher l'événement sur le bouton d'ajout d'angle
    const addAngleCard = document.querySelector('.add-angle-card');
    if (addAngleCard) {
        console.log('[Content Formatters] Attachement événement bouton ajout d\'angle');
        
        const addClickHandler = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('[Content Formatters] Clic sur bouton ajout d\'angle');
            window.showCustomAngleModal();
        };
        
        addAngleCard.removeEventListener('click', addAngleCard._clickHandler);
        addAngleCard._clickHandler = addClickHandler;
        addAngleCard.addEventListener('click', addClickHandler);
    }
    
    // Attacher l'événement sur le bouton "Continuer"
    const continueButton = document.getElementById('continue-after-angle-selection');
    console.log('[Content Formatters] Bouton continuer trouvé:', !!continueButton);
    console.log('[Content Formatters] Fonction continueAfterAngleSelection disponible:', !!window.continueAfterAngleSelection);
    
    if (continueButton) {
        const continueClickHandler = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('[Content Formatters] === CLIC SUR BOUTON CONTINUER ===');
            console.log('[Content Formatters] Angle sélectionné:', window.selectedMarketingAngle);
            
            if (window.continueAfterAngleSelection) {
                window.continueAfterAngleSelection();
            } else {
                console.error('[Content Formatters] Fonction continueAfterAngleSelection non disponible au moment du clic');
            }
        };
        
        // Supprimer l'ancien événement et ajouter le nouveau
        continueButton.removeEventListener('click', continueButton._clickHandler);
        continueButton._clickHandler = continueClickHandler;
        continueButton.addEventListener('click', continueClickHandler);
        
        console.log('[Content Formatters] Événement attaché au bouton continuer');
    } else {
        console.warn('[Content Formatters] Bouton continuer non trouvé, tentative de retry dans 200ms...');
        // Retry après un délai
        setTimeout(() => {
            const retryButton = document.getElementById('continue-after-angle-selection');
            if (retryButton) {
                console.log('[Content Formatters] Bouton continuer trouvé au retry');
                const continueClickHandler = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('[Content Formatters] === CLIC SUR BOUTON CONTINUER (RETRY) ===');
                    console.log('[Content Formatters] Angle sélectionné:', window.selectedMarketingAngle);
                    
                    if (window.continueAfterAngleSelection) {
                        window.continueAfterAngleSelection();
                    } else {
                        console.error('[Content Formatters] Fonction continueAfterAngleSelection non disponible au moment du clic');
                    }
                };
                
                retryButton.removeEventListener('click', retryButton._clickHandler);
                retryButton._clickHandler = continueClickHandler;
                retryButton.addEventListener('click', continueClickHandler);
                
                console.log('[Content Formatters] Événement attaché au bouton continuer (retry)');
            } else {
                console.error('[Content Formatters] Bouton continuer toujours non trouvé après retry');
            }
        }, 200);
    }
    
    console.log('[Content Formatters] === FIN ATTACHEMENT ÉVÉNEMENTS ===');

}

// Fonction pour afficher la modal d'ajout d'angle personnalisé
window.showCustomAngleModal = function() {
    console.log('[Content Formatters] Ouverture de la modal d\'angle personnalisé');
    
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
                        <label for="angleMarketImpact">Impact sur le marché (%) *</label>
                        <input type="number" id="angleMarketImpact" name="angleMarketImpact" required 
                               min="1" max="100" placeholder="Ex: 25">
                    </div>
                    
                    <div class="form-group">
                        <label for="angleMarketSize">Taille du marché *</label>
                        <textarea id="angleMarketSize" name="angleMarketSize" required rows="2"
                                  placeholder="Décrivez la taille et le potentiel du marché..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="angleProblem">Problème à résoudre *</label>
                        <textarea id="angleProblem" name="angleProblem" required rows="3"
                                  placeholder="Décrivez le problème principal que cet angle marketing adresse..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="angleEmotions">Émotions à évoquer</label>
                        <textarea id="angleEmotions" name="angleEmotions" rows="2"
                                  placeholder="Quelles émotions cet angle doit-il déclencher chez le prospect..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="angleFears">Peurs & Frustrations</label>
                        <textarea id="angleFears" name="angleFears" rows="2"
                                  placeholder="Quelles sont les peurs et frustrations de votre audience..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="angleTactical">Application tactique</label>
                        <textarea id="angleTactical" name="angleTactical" rows="2"
                                  placeholder="Comment cet angle peut être appliqué stratégiquement..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="angleEvidence">Preuves & Données</label>
                        <textarea id="angleEvidence" name="angleEvidence" rows="2"
                                  placeholder="Quelles preuves supportent cet angle marketing..."></textarea>
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
    
    // Ajouter les styles de la modal si pas encore présents
    addCustomAngleModalStyles();
    
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
            id: Date.now(), // ID unique basé sur le timestamp
            name: formData.get('angleName').trim(),
            marketImpact: formData.get('angleMarketImpact').trim() + '% des propriétaires sont concernés',
            marketSize: formData.get('angleMarketSize').trim(),
            problemToSolve: formData.get('angleProblem').trim(),
            emotionsToEvoke: formData.get('angleEmotions').trim() || 'Émotions à évoquer',
            fearsFrustrations: formData.get('angleFears').trim() || 'Frustrations liées au problème identifié',
            tacticalApplication: formData.get('angleTactical').trim() || 'Application tactique personnalisée',
            supportingEvidence: formData.get('angleEvidence').trim() || 'Données et preuves à collecter',
            isCustom: true
        };
        
        // Validation
        if (!customAngle.name || !customAngle.marketSize || !customAngle.problemToSolve) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }
        
        const marketImpact = parseInt(formData.get('angleMarketImpact'));
        if (!marketImpact || marketImpact < 1 || marketImpact > 100) {
            alert('L\'impact sur le marché doit être un nombre entre 1 et 100.');
            return;
        }
        
        console.log('[Content Formatters] Ajout d\'angle personnalisé:', customAngle);
        
        // Ajouter l'angle aux données globales
        if (!window.generatedMarketingAngles) {
            window.generatedMarketingAngles = [];
        }
        window.generatedMarketingAngles.push(customAngle);
        
        // Mettre à jour le badge avec le nouveau nombre d'angles
        if (typeof window.updateMarketingAngleBadge === 'function') {
            window.updateMarketingAngleBadge();
        }
        
        // Fermer la modal
        closeModal();
        
        // Marquer qu'on vient de créer un nouvel angle pour le sélectionner automatiquement
        window.newlyCreatedAngleId = customAngle.id;
        
        // Réafficher la section des angles marketing
        refreshMarketingAngleSection();
    });
    
    // Focus sur le premier champ
    setTimeout(() => {
        modal.querySelector('#angleName').focus();
    }, 100);
};

// Fonction pour formater "Comment ça marche" avec sélecteurs
function formatHowItWorksWithSelectors(sectionId, content) {
    if (!content) return '<p>Contenu non disponible</p>';
    
    // Si c'est un objet avec des versions
    if (typeof content === 'object' && content.version1) {
        // Récupérer la version sélectionnée pour cette section
        const selectedVersion = window.selectedVersion && window.selectedVersion[sectionId] ? window.selectedVersion[sectionId] : 1;
        
        // Récupérer le contenu de la version sélectionnée
        let currentSteps;
        const versionKey = `version${selectedVersion}`;
        if (content[versionKey]) {
            currentSteps = content[versionKey];
        } else {
            currentSteps = content.version1; // Fallback vers version1
        }
        
        // Gérer le cas où currentSteps est un array d'arrays (double wrapping)
        let actualSteps = currentSteps;
        if (Array.isArray(currentSteps) && currentSteps.length === 1 && Array.isArray(currentSteps[0])) {
            actualSteps = currentSteps[0];
        }
        
        // Vérification supplémentaire : si actualSteps[0] a les propriétés step/title/description, c'est bon
        if (Array.isArray(actualSteps) && actualSteps.length > 0 && 
            typeof actualSteps[0] === 'object' && 
            (actualSteps[0].step || actualSteps[0].title || actualSteps[0].description)) {
        } else {
        }
        
        let stepsHtml = '';
        if (Array.isArray(actualSteps)) {
            stepsHtml = actualSteps.map((step, index) => {
                const stepNumber = step.step || (index + 1);
                const stepTitle = step.title || `Étape ${stepNumber}`;
                const stepDescription = step.description || '';
                
                return `
                    <div class="step-item">
                        <div class="step-number">${stepNumber}</div>
                        <div class="step-content">
                            <h4 class="step-title">${stepTitle}</h4>
                            <p class="step-description">${stepDescription}</p>
                        </div>
                    </div>
                `;
            }).join('');
        } else if (typeof currentSteps === 'string') {
            stepsHtml = `<p>${currentSteps}</p>`;
        }
        
        // Générer les boutons de version dynamiquement
        let versionButtons = '';
        const availableVersions = Object.keys(content).filter(key => key.startsWith('version')).sort();
        
        availableVersions.forEach(versionKey => {
            const versionNumber = parseInt(versionKey.replace('version', ''));
            const isActive = selectedVersion === versionNumber;
            versionButtons += `<button class="version-btn ${isActive ? 'active' : ''}" onclick="selectVersion('${sectionId}', ${versionNumber})">Version ${versionNumber}</button>`;
        });
        
        const result = `
            <div class="content-item" data-section="${sectionId}">
                <div class="version-selector">
                    ${versionButtons}
                </div>
                <div class="version-content">
                    <div class="steps-container">
                        ${stepsHtml}
                    </div>
                </div>
            </div>
        `;
        return result;
    }
    
    // Si c'est directement un array d'étapes
    if (Array.isArray(content)) {
        const stepsHtml = content.map((step, index) => {
            const stepNumber = step.step || (index + 1);
            const stepTitle = step.title || `Étape ${stepNumber}`;
            const stepDescription = step.description || '';
            
            return `
                <div class="step-item">
                    <div class="step-number">${stepNumber}</div>
                    <div class="step-content">
                        <h4 class="step-title">${stepTitle}</h4>
                        <p class="step-description">${stepDescription}</p>
                    </div>
                </div>
            `;
        }).join('');
        
        return `
            <div class="content-item" data-section="${sectionId}">
                <div class="version-content">
                    <div class="steps-container">
                        ${stepsHtml}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Si c'est juste du texte
    if (typeof content === 'string') {
        return `
            <div class="content-item" data-section="${sectionId}">
                <div class="version-content">
                    <p>${content}</p>
                </div>
            </div>
        `;
    }
    
    return '<p>Format de contenu non reconnu</p>';
}

// Fonction pour formater les avis clients avec sélecteurs
function formatCustomerReviewsWithSelectors(sectionId, reviews) {
    if (!reviews || !Array.isArray(reviews)) return '<p>Avis clients non disponibles</p>';
    
    // Initialiser le tableau de sélection si nécessaire
    if (!window.selectedCustomerReviews) {
        window.selectedCustomerReviews = [];
    }

    let html = '<div class="customer-reviews-selector">';
    
    // Compteur de sélection
    const isComplete = window.selectedCustomerReviews.length === 6;
    html += `
        <div class="selection-counter">
            <div class="counter-text">Sélectionnez 6 avis clients pour votre produit</div>
            <div class="counter-number ${isComplete ? 'counter-complete' : ''}">
                ${window.selectedCustomerReviews.length}/6
            </div>
        </div>
    `;
    
    html += `
        <div class="reviews-selection-container">
            <h4 class="reviews-title">Sélectionnez les avis clients</h4>
            <p class="reviews-instruction">Choisissez les témoignages les plus convaincants</p>
            
            <div class="customer-reviews-container">
    `;
    
    reviews.forEach((review, index) => {
        const customerName = review.name || `Client ${index + 1}`;
        const rating = review.rating || 5;
        const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
        const initials = getInitials(customerName);
        const avatarColor = getAvatarColor(customerName);
        const reviewDate = getRandomDate();
        const isVerified = Math.random() > 0.3; // 70% de chance d'être vérifié
        const isSelected = window.selectedCustomerReviews.some(r => r && r.index === index);
        
        html += `
            <div class="customer-review-card ${isSelected ? 'selected' : ''}" 
                 data-review-index="${index}"
                 onclick="window.toggleCustomerReviewSelection(${index})"
                 style="cursor: pointer;">
                <div class="review-header">
                    <div class="customer-avatar" style="background-color: ${avatarColor}">
                        ${initials}
                    </div>
                    <div class="customer-info">
                        <div class="customer-name-row">
                            <span class="customer-name">${customerName}</span>
                            ${isVerified ? '<span class="verified-badge" title="Achat vérifié">✓</span>' : ''}
                        </div>
                        <div class="review-meta">
                            <div class="review-rating">${stars}</div>
                            <span class="review-date">${reviewDate}</span>
                        </div>
                    </div>
                    ${isSelected ? '<div class="selection-badge" style="display: inline-flex;">✓</div>' : '<div class="selection-badge" style="display: none;">✓</div>'}
                </div>
                
                <div class="review-content">
                    <p class="review-text">${review.review || review.text || review.comment}</p>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    // Bouton de validation
    html += `
        <div class="reviews-actions">
            <button id="validate-reviews-btn" class="validate-reviews-btn" ${isComplete ? '' : 'disabled'}>
                ${isComplete ? 'Valider la sélection' : `Sélectionnez ${6 - window.selectedCustomerReviews.length} avis de plus`}
            </button>
        </div>
    `;
    
    html += '</div>';
    
    // Ajouter les styles CSS pour les avis clients
    html += `
        <style>
        .customer-reviews-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
            padding: 10px 0;
        }
        
        .customer-review-card {
            background: #2a2d3a;
            border: 1px solid #3a3f4f;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            position: relative;
        }
        
        .customer-review-card:hover {
            box-shadow: 0 4px 16px rgba(0,0,0,0.4);
            transform: translateY(-2px);
            border-color: #4a5568;
        }
        
        .review-header {
            display: flex;
            align-items: flex-start;
            margin-bottom: 15px;
        }
        
        .customer-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 16px;
            margin-right: 12px;
            flex-shrink: 0;
        }
        
        .customer-info {
            flex: 1;
        }
        
        .customer-name-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;
        }
        
        .customer-name {
            font-weight: 600;
            font-size: 16px;
            color: #e2e8f0;
        }
        
        .verified-badge {
            background: #00d4ff;
            color: white;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
        }
        
        .review-meta {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .review-rating {
            color: #ffa500;
            font-size: 16px;
            letter-spacing: 1px;
        }
        
        .review-date {
            color: #a0aec0;
            font-size: 14px;
        }
        
        .review-content {
            margin-bottom: 16px;
        }
        
        .review-text {
            color: #e2e8f0;
            line-height: 1.6;
            font-size: 15px;
            margin: 0;
        }
        
        .review-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 12px;
            border-top: 1px solid #4a5568;
        }
        
        .selection-controls {
            display: flex;
            align-items: center;
        }
        
        .checkbox-container {
            display: flex;
            align-items: center;
            cursor: pointer;
            font-size: 14px;
            color: #a0aec0;
        }
        
        .checkbox-container input[type="checkbox"] {
            margin-right: 8px;
            transform: scale(1.1);
            accent-color: #00d4ff;
        }
        
        .checkbox-label {
            user-select: none;
        }
        
        .checkbox-container:hover .checkbox-label {
            color: #e2e8f0;
        }
        
        @media (max-width: 768px) {
            .customer-reviews-container {
                grid-template-columns: 1fr;
            }
            
            .review-footer {
                flex-direction: column;
                gap: 12px;
                align-items: flex-start;
            }
        }
        </style>
    `;
    
    return html;
};

// Fonction helper pour générer des initiales d'avatar
function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

// Fonction helper pour générer une couleur d'avatar basée sur le nom
function getAvatarColor(name) {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    let hash = 0;
    for (let i = 0; i <name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

// Fonction helper pour générer une date réaliste
function getRandomDate() {
    const dates = [
        'Il y a 2 jours', 'Il y a 1 semaine', 'Il y a 2 semaines', 
        'Il y a 3 semaines', 'Il y a 1 mois', 'Il y a 2 mois'
    ];
    return dates[Math.floor(Math.random() * dates.length)];
}

// Export des fonctions vers window
window.formatProductTitleWithSelectors = formatProductTitleWithSelectors;
window.formatProductBenefitsWithSelectors = formatBenefitsWithSelectors;
window.formatEmotionalBenefitsWithSelectors = formatEmotionalBenefitsWithSelectors;
window.formatUseCasesWithSelectors = function(sectionId, useCases) {
    // Normaliser les données - gérer les objets avec versions et les arrays directs
    let useCasesArray = [];
    
    if (!useCases) {
        return '<p>Cas d\'utilisation non disponibles</p>';
    }
    
    if (Array.isArray(useCases)) {
        useCasesArray = useCases;
    } else if (typeof useCases === 'object') {
        // Si c'est un objet avec des versions, prendre version1 en priorité
        if (useCases.version1 && Array.isArray(useCases.version1)) {
            useCasesArray = useCases.version1;
        } else if (useCases.version1) {
            useCasesArray = [useCases.version1];
        } else {
            // Sinon, prendre toutes les valeurs de l'objet
            useCasesArray = Object.values(useCases).filter(v => v !== null && v !== undefined);
        }
    } else {
        useCasesArray = [useCases];
    }
    
    // Filtrer les phrases d'introduction parasites
    useCasesArray = useCasesArray.filter(useCase => {
        if (typeof useCase === 'string') {
            // Filtrer les phrases d'introduction
            const introPatterns = [
                /^(bien sûr,?\s*)?voici\s+\d*\s*cas\s+d['']utilisation/i,
                /^(bien sûr,?\s*)?voici\s+\d*\s*.*?pour.*?:/i,
                /^(voici|voilà)\s+.*?:/i
            ];
            
            return !introPatterns.some(pattern => pattern.test(useCase.trim()));
        } else if (typeof useCase === 'object' && useCase !== null) {
            // Pour les objets, vérifier le titre
            const title = useCase.title || useCase.headline || '';
            if (typeof title === 'string') {
                const introPatterns = [
                    /^(bien sûr,?\s*)?voici\s+\d*\s*cas\s+d['']utilisation/i,
                    /^(bien sûr,?\s*)?voici\s+\d*\s*.*?pour.*?:/i,
                    /^(voici|voilà)\s+.*?:/i
                ];
                
                return !introPatterns.some(pattern => pattern.test(title.trim()));
            }
        }
        return true; // Garder les autres éléments
    });
    
    console.log('[DEBUG formatUseCasesWithSelectors] useCasesArray après filtrage:', useCasesArray.length, 'éléments');
    
    if (useCasesArray.length === 0) {
        return '<p>Cas d\'utilisation non disponibles</p>';
    }
    
    // Initialiser le tableau de sélection si nécessaire
    if (!window.selectedUseCases) {
        window.selectedUseCases = [];
    }
    
    let html = '<div class="benefits-selector use-cases-selector">';
    
    // Compteur de sélection
    const isComplete = window.selectedUseCases.length >= 3;
    html += `
        <div class="selection-counter">
            <div class="counter-text">Sélectionnez exactement 3 cas d'utilisation pour votre produit</div>
            <div class="counter-number ${isComplete ? 'counter-complete' : ''}">
                ${window.selectedUseCases.length}/3
            </div>
        </div>
    `;
    
    html += `
        <div class="benefits-selection-container">
            <h4 class="benefits-title">Sélectionnez les cas d'utilisation</h4>
            <p class="benefits-instruction">Choisissez les cas d'utilisation les plus pertinents pour votre produit</p>
            
            <div class="benefits-tags-container">
    `;
    
    useCasesArray.forEach((useCase, index) => {
        let useCaseTitle = useCase.title || useCase.headline || `Cas d'utilisation ${index + 1}`;
        
        // Nettoyer les chiffres et points au début (ex: "1. ", "2. ", "3. ")
        useCaseTitle = useCaseTitle.replace(/^\d+\.\s*/, '').trim();
        
        const useCaseDesc = useCase.description || useCase.explanation || '';
        const isSelected = window.selectedUseCases.some(b => b && b.index === index);
        const selectionIndex = window.selectedUseCases.findIndex(b => b && b.index === index) + 1;
        
        html += `
            <div class="benefit-tag ${isSelected ? 'selected' : ''}" 
                 data-use-case-index="${index}"
                 data-use-case-title="${useCaseTitle}"
                 data-use-case-description="${useCaseDesc}"
                 onclick="window.toggleUseCaseSelection(${index})"
                 title="${useCaseDesc}">
                <span class="benefit-title">${useCaseTitle}</span>
                <span class="selection-badge">${isSelected ? selectionIndex : ''}</span>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    // Bouton de validation
    html += `
        <div class="benefits-actions">
            <button class="validate-use-cases-btn" ${isComplete ? '' : 'disabled'}>
                ${isComplete ? 'Valider la sélection' : `Sélectionnez ${3 - window.selectedUseCases.length} cas d'utilisation de plus`}
            </button>
        </div>
    `;
    
    html += '</div>';
    return html;
}

window.formatCharacteristicsWithSelectors = formatCharacteristicsWithSelectors;
window.formatCompetitiveAdvantagesWithSelectors = function(sectionId, advantages) {
    // Normaliser les données - gérer les objets avec versions et les arrays directs
    let advantagesArray = [];
    
    if (!advantages) {
        return '<p>Avantages concurrentiels non disponibles</p>';
    }
    
    if (Array.isArray(advantages)) {
        advantagesArray = advantages;
    } else if (typeof advantages === 'object') {
        // Si c'est un objet avec des versions, prendre version1 en priorité
        if (advantages.version1 && Array.isArray(advantages.version1)) {
            advantagesArray = advantages.version1;
        } else if (advantages.version1) {
            advantagesArray = [advantages.version1];
        } else {
            // Sinon, prendre toutes les valeurs de l'objet
            advantagesArray = Object.values(advantages).filter(v => v !== null && v !== undefined);
        }
    } else {
        advantagesArray = [advantages];
    }
    
    if (advantagesArray.length === 0) {
        return '<p>Avantages concurrentiels non disponibles</p>';
    }
    
    return formatSingleCompetitiveAdvantages(sectionId, advantagesArray);
}

// Fonction helper pour formater une seule version des avantages concurrentiels
function formatSingleCompetitiveAdvantages(sectionId, advantagesArray) {
    // Initialiser le tableau de sélection si nécessaire
    if (!window.selectedCompetitiveAdvantages) {
        window.selectedCompetitiveAdvantages = [];
    }
    
    let html = '<div class="benefits-selector competitive-advantages-selector">';
    
    // Compteur de sélection
    const isComplete = window.selectedCompetitiveAdvantages.length === 4;
    html += `
        <div class="selection-counter">
            <div class="counter-text">Sélectionnez 4 avantages concurrentiels de votre produit</div>
            <div class="counter-number ${isComplete ? 'counter-complete' : ''}">
                ${window.selectedCompetitiveAdvantages.length}/4
            </div>
        </div>
    `;
    
    html += `
        <div class="benefits-selection-container">
            <h4 class="benefits-title">Sélectionnez les avantages concurrentiels</h4>
            <p class="benefits-instruction">Choisissez ce qui différencie votre produit de la concurrence</p>
            
            <div class="benefits-tags-container">
    `;
    
    advantagesArray.forEach((advantage, index) => {
        const advantageTitle = advantage.title || advantage.headline || `Avantage concurrentiel ${index + 1}`;
        const advantageDesc = advantage.description || advantage.explanation || '';
        const isSelected = window.selectedCompetitiveAdvantages.some(b => b && b.index === index);
        const selectionIndex = window.selectedCompetitiveAdvantages.findIndex(b => b && b.index === index) + 1;
        
        html += `
            <div class="benefit-tag ${isSelected ? 'selected' : ''}" 
                 data-advantage-index="${index}"
                 data-advantage-title="${advantageTitle}"
                 data-advantage-description="${advantageDesc}"
                 onclick="window.toggleCompetitiveAdvantageSelection(${index})"
                 title="${advantageDesc}">
                <span class="benefit-title">${advantageTitle}</span>
                <span class="selection-badge">${isSelected ? selectionIndex : ''}</span>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    // Bouton de validation
    html += `
        <div class="benefits-actions">
            <button class="validate-competitive-advantages-btn" ${isComplete ? '' : 'disabled'}>
                ${isComplete ? 'Valider la sélection' : `Sélectionnez ${4 - window.selectedCompetitiveAdvantages.length} avantage(s) de plus`}
            </button>
        </div>
    `;
    
    html += '</div>';
    return html;
}

window.formatCustomerReviewsWithSelectors = formatCustomerReviewsWithSelectors;
window.formatFAQWithSelectors = formatFAQWithSelectors;

/**
 * Nettoie les données stockées pour éliminer les phrases d'introduction parasites
 */
function cleanStoredUseCasesData() {
    console.log('[CLEAN-USECASES] Début du nettoyage des cas d\'utilisation stockés');
    
    // Nettoyer les données en mémoire
    if (window.generatedContent && window.generatedContent.useCases) {
        const useCasesData = window.generatedContent.useCases;
        
        if (useCasesData.version1 && Array.isArray(useCasesData.version1)) {
            const originalLength = useCasesData.version1.length;
            useCasesData.version1 = useCasesData.version1.filter(useCase => {
                if (typeof useCase === 'string') {
                    const introPatterns = [
                        /^(bien sûr,?\s*)?voici\s+\d*\s*cas\s+d['']utilisation/i,
                        /^(bien sûr,?\s*)?voici\s+\d*\s*.*?pour.*?:/i,
                        /^(voici|voilà)\s+.*?:/i
                    ];
                    return !introPatterns.some(pattern => pattern.test(useCase.trim()));
                } else if (typeof useCase === 'object' && useCase !== null) {
                    const title = useCase.title || useCase.headline || '';
                    if (typeof title === 'string') {
                        const introPatterns = [
                            /^(bien sûr,?\s*)?voici\s+\d*\s*cas\s+d['']utilisation/i,
                            /^(bien sûr,?\s*)?voici\s+\d*\s*.*?pour.*?:/i,
                            /^(voici|voilà)\s+.*?:/i
                        ];
                        return !introPatterns.some(pattern => pattern.test(title.trim()));
                    }
                }
                return true;
            });
            
            console.log(`[CLEAN-USECASES] Mémoire: ${originalLength} -> ${useCasesData.version1.length} éléments`);
        }
    }
    
    // Nettoyer les données dans localStorage
    const storedContent = JSON.parse(localStorage.getItem('generatedContent') || '{}');
    if (storedContent.useCases && storedContent.useCases.version1 && Array.isArray(storedContent.useCases.version1)) {
        const originalLength = storedContent.useCases.version1.length;
        storedContent.useCases.version1 = storedContent.useCases.version1.filter(useCase => {
            if (typeof useCase === 'string') {
                const introPatterns = [
                    /^(bien sûr,?\s*)?voici\s+\d*\s*cas\s+d['']utilisation/i,
                    /^(bien sûr,?\s*)?voici\s+\d*\s*.*?pour.*?:/i,
                    /^(voici|voilà)\s+.*?:/i
                ];
                return !introPatterns.some(pattern => pattern.test(useCase.trim()));
            } else if (typeof useCase === 'object' && useCase !== null) {
                const title = useCase.title || useCase.headline || '';
                if (typeof title === 'string') {
                    const introPatterns = [
                        /^(bien sûr,?\s*)?voici\s+\d*\s*cas\s+d['']utilisation/i,
                        /^(bien sûr,?\s*)?voici\s+\d*\s*.*?pour.*?:/i,
                        /^(voici|voilà)\s+.*?:/i
                    ];
                    return !introPatterns.some(pattern => pattern.test(title.trim()));
                }
            }
            return true;
        });
        
        if (originalLength !== storedContent.useCases.version1.length) {
            localStorage.setItem('generatedContent', JSON.stringify(storedContent));
            console.log(`[CLEAN-USECASES] localStorage: ${originalLength} -> ${storedContent.useCases.version1.length} éléments`);
        }
    }
    
    console.log('[CLEAN-USECASES] Nettoyage terminé');
}

// Appeler le nettoyage au chargement de la page
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(cleanStoredUseCasesData, 500);
    });
}

// Exposer la fonction globalement
window.cleanStoredUseCasesData = cleanStoredUseCasesData;

/**
 * Nettoie tous les tirets et puces au début des titres dans les données stockées
 */
function cleanStoredTitlesData() {
    console.log('[CLEAN-TITLES] Début du nettoyage des tirets dans les titres stockés');
    
    const sectionsToClean = ['productBenefits', 'emotionalBenefits', 'characteristics', 'competitiveAdvantages', 'useCases'];
    
    // Fonction pour nettoyer un titre
    const cleanTitle = (item) => {
        if (typeof item === 'string') {
            return item.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '').trim();
        } else if (typeof item === 'object' && item !== null) {
            const newItem = { ...item };
            if (newItem.title) {
                newItem.title = newItem.title.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '').trim();
            }
            if (newItem.headline) {
                newItem.headline = newItem.headline.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '').trim();
            }
            if (newItem.name) {
                newItem.name = newItem.name.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '').trim();
            }
            return newItem;
        }
        return item;
    };
    
    // Nettoyer les données en mémoire
    if (window.generatedContent) {
        sectionsToClean.forEach(sectionKey => {
            if (window.generatedContent[sectionKey] && window.generatedContent[sectionKey].version1) {
                const sectionData = window.generatedContent[sectionKey];
                if (Array.isArray(sectionData.version1)) {
                    sectionData.version1 = sectionData.version1.map(cleanTitle);
                    console.log(`[CLEAN-TITLES] Mémoire ${sectionKey}: titres nettoyés`);
                }
            }
        });
    }
    
    // Nettoyer les données dans localStorage
    const storedContent = JSON.parse(localStorage.getItem('generatedContent') || '{}');
    let hasChanges = false;
    
    sectionsToClean.forEach(sectionKey => {
        if (storedContent[sectionKey] && storedContent[sectionKey].version1) {
            const sectionData = storedContent[sectionKey];
            if (Array.isArray(sectionData.version1)) {
                const originalData = JSON.stringify(sectionData.version1);
                sectionData.version1 = sectionData.version1.map(cleanTitle);
                if (JSON.stringify(sectionData.version1) !== originalData) {
                    hasChanges = true;
                    console.log(`[CLEAN-TITLES] localStorage ${sectionKey}: titres nettoyés`);
                }
            }
        }
    });
    
    if (hasChanges) {
        localStorage.setItem('generatedContent', JSON.stringify(storedContent));
        console.log('[CLEAN-TITLES] Données nettoyées sauvegardées dans localStorage');
    }
    
    console.log('[CLEAN-TITLES] Nettoyage des titres terminé');
}

// Appeler le nettoyage au chargement de la page
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            cleanStoredUseCasesData();
            cleanStoredTitlesData();
        }, 500);
    });
}

// Exposer la fonction globalement
window.cleanStoredTitlesData = cleanStoredTitlesData;

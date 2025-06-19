/**
 * Gestionnaire pour les fonctionnalités d'ajout manuel dans l'Output Generator
 */

class ManualInputManager {
    constructor() {
        this.initializeEventListeners();
        this.loadManualContents();
    }

    /**
     * Initialise les écouteurs d'événements pour tous les boutons d'ajout manuel
     */
    initializeEventListeners() {
        // Attendre que le DOM soit chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupManualInputHandlers();
                this.loadManualContents();
            });
        } else {
            this.setupManualInputHandlers();
        }
    }

    /**
     * Configure les gestionnaires pour tous les onglets
     */
    setupManualInputHandlers() {
        // Mapping entre les IDs des onglets (tab-pane) et les IDs des content-box
        const tabToContentMapping = {
            'tab3': 'productTitle',
            'tab4': 'productBenefits',
            'tab5': 'howItWorks',
            'tab6': 'emotionalBenefits',
            'tab7': 'useCases',
            'tab8': 'characteristics',
            'tab9': 'competitiveAdvantages',
            'tab10': 'customerReviews',
            'tab11': 'faq'
        };

        Object.keys(tabToContentMapping).forEach(tabId => {
            this.setupTabManualInput(tabId, tabToContentMapping[tabId]);
        });
    }

    /**
     * Configure les fonctionnalités d'ajout manuel pour un onglet spécifique
     * @param {string} tabId - L'ID de l'onglet (tab-pane)
     * @param {string} contentId - L'ID de la content-box
     */
    setupTabManualInput(tabId, contentId) {
        const toggleBtn = document.querySelector(`#${tabId} .btn-manual-toggle`);
        const addBtn = document.querySelector(`#${tabId} .btn-add-manual`);
        const cancelBtn = document.querySelector(`#${tabId} .btn-cancel-manual`);
        const manualSection = document.querySelector(`#${tabId} .manual-input-section`);
        
        // Ancienne méthode pour les sections avec un seul textarea
        const textarea = document.querySelector(`#${tabId} .manual-input`);
        
        // Nouvelles méthodes pour les sections avec titre + description
        const titleInput = document.querySelector(`#${tabId} .manual-input-title`);
        const descriptionInput = document.querySelector(`#${tabId} .manual-input-description`);
        
        // Méthodes spécifiques pour les reviews
        const nameInput = document.querySelector(`#${tabId} .manual-input-name`);
        const ratingSelect = document.querySelector(`#${tabId} .manual-input-rating`);
        const commentInput = document.querySelector(`#${tabId} .manual-input-comment`);
        
        // Méthodes spécifiques pour FAQ
        const questionInput = document.querySelector(`#${tabId} .manual-input-question`);
        const answerInput = document.querySelector(`#${tabId} .manual-input-answer`);

        if (!toggleBtn || !addBtn || !cancelBtn || !manualSection) {
            console.warn(`Éléments manquants pour l'onglet ${tabId}`);
            return;
        }

        // Déterminer le type d'input selon les éléments présents
        let inputType = 'single'; // Par défaut
        let primaryInput = textarea;
        
        if (titleInput && descriptionInput) {
            inputType = 'title-description';
            primaryInput = titleInput;
        } else if (nameInput && ratingSelect && commentInput) {
            inputType = 'review';
            primaryInput = nameInput;
        } else if (questionInput && answerInput) {
            inputType = 'faq';
            primaryInput = questionInput;
        }

        if (!primaryInput) {
            console.warn(`Aucun élément d'input trouvé pour l'onglet ${tabId}`);
            return;
        }

        console.log(`Configuration de l'onglet ${tabId} avec le type d'input: ${inputType}`);

        // Améliorer le placeholder selon l'onglet
        if (inputType === 'single') {
            this.setDynamicPlaceholder(textarea, contentId);
        }

        // Gestionnaire pour afficher/masquer la section d'ajout manuel
        toggleBtn.addEventListener('click', () => {
            this.toggleManualSection(manualSection, toggleBtn, primaryInput);
        });

        // Gestionnaire pour ajouter le contenu manuel
        addBtn.addEventListener('click', () => {
            this.addManualContentByType(contentId, inputType, {
                textarea,
                titleInput,
                descriptionInput,
                nameInput,
                ratingSelect,
                commentInput,
                questionInput,
                answerInput
            });
        });

        // Gestionnaire pour annuler l'ajout manuel
        cancelBtn.addEventListener('click', () => {
            this.cancelManualInput(manualSection, toggleBtn, inputType, {
                textarea,
                titleInput,
                descriptionInput,
                nameInput,
                ratingSelect,
                commentInput,
                questionInput,
                answerInput
            });
        });

        // Gestionnaire pour la touche Entrée avec Ctrl/Cmd sur l'input principal
        primaryInput.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.addManualContentByType(contentId, inputType, {
                    textarea,
                    titleInput,
                    descriptionInput,
                    nameInput,
                    ratingSelect,
                    commentInput,
                    questionInput,
                    answerInput
                });
            }
            // Échapper pour annuler
            if (e.key === 'Escape') {
                this.cancelManualInput(manualSection, toggleBtn, inputType, {
                    textarea,
                    titleInput,
                    descriptionInput,
                    nameInput,
                    ratingSelect,
                    commentInput,
                    questionInput,
                    answerInput
                });
            }
        });

        // Ajouter un compteur de caractères pour le textarea principal
        if (inputType === 'single') {
            this.addCharacterCounter(textarea, manualSection);
        }
    }

    /**
     * Définit un placeholder dynamique selon le type de contenu
     * @param {HTMLElement} textarea - L'élément textarea
     * @param {string} contentId - L'ID de la content-box
     */
    setDynamicPlaceholder(textarea, contentId) {
        const placeholders = {
            'productTitle': 'Saisissez un titre accrocheur pour votre produit...\n\nExemple :\n• "Révolutionnez votre routine avec..."',
            'productBenefits': 'Listez les bénéfices clés de votre produit...\n\nExemple :\n• Gain de temps considérable\n• Résultats visibles en 24h\n• Facile à utiliser',
            'howItWorks': 'Expliquez le fonctionnement de votre produit...\n\nExemple :\n1. Appliquez le produit\n2. Attendez 5 minutes\n3. Profitez des résultats',
            'emotionalBenefits': 'Décrivez les bénéfices émotionnels...\n\nExemple :\n• Retrouvez confiance en vous\n• Sentez-vous plus séduisant(e)\n• Éliminez le stress',
            'useCases': 'Listez les cas d\'utilisation...\n\nExemple :\n• Parfait pour les voyages\n• Idéal au bureau\n• Pratique à la maison',
            'characteristics': 'Détaillez les caractéristiques techniques...\n\nExemple :\n• Dimensions : 15x10x5 cm\n• Poids : 200g\n• Matériau : Acier inoxydable',
            'competitiveAdvantages': 'Mettez en avant vos avantages concurrentiels...\n\nExemple :\n• 3x plus efficace que la concurrence\n• Garantie 2 ans\n• Prix imbattable',
            'customerReviews': 'Ajoutez des avis clients authentiques...\n\nExemple :\n"Produit fantastique ! Je le recommande vivement." - Marie, 34 ans',
            'faq': 'Ajoutez des questions fréquentes...\n\nExemple :\nQ: Est-ce compatible avec tous les types de peau ?\nR: Oui, notre formule convient à tous les types de peau.'
        };

        textarea.placeholder = placeholders[contentId] || 'Saisissez votre contenu personnalisé...';
    }

    /**
     * Ajoute un compteur de caractères au textarea
     * @param {HTMLElement} textarea - L'élément textarea
     * @param {HTMLElement} manualSection - La section manuelle
     */
    addCharacterCounter(textarea, manualSection) {
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            text-align: right;
            color: rgba(255, 255, 255, 0.6);
            font-size: 12px;
            margin-top: 5px;
            font-family: 'JetBrains Mono', monospace;
        `;
        
        const updateCounter = () => {
            const length = textarea.value.length;
            counter.textContent = `${length} caractères`;
            
            if (length > 1000) {
                counter.style.color = '#ff6b6b';
            } else if (length > 500) {
                counter.style.color = '#ffa726';
            } else {
                counter.style.color = 'rgba(255, 255, 255, 0.6)';
            }
        };

        textarea.addEventListener('input', updateCounter);
        manualSection.insertBefore(counter, manualSection.querySelector('.manual-input-buttons'));
        updateCounter();
    }

    /**
     * Affiche ou masque la section d'ajout manuel
     * @param {HTMLElement} manualSection - L'élément de la section manuelle
     * @param {HTMLElement} toggleBtn - Le bouton de basculement
     * @param {HTMLElement} primaryInput - L'input principal
     */
    toggleManualSection(manualSection, toggleBtn, primaryInput) {
        const isVisible = manualSection.style.display !== 'none';
        
        if (isVisible) {
            // Masquer la section
            manualSection.classList.add('hide');
            setTimeout(() => {
                manualSection.style.display = 'none';
                manualSection.classList.remove('hide');
            }, 300);
            toggleBtn.innerHTML = '<i class="fas fa-plus"></i> Ajouter manuellement';
        } else {
            // Afficher la section
            manualSection.style.display = 'block';
            manualSection.classList.add('show');
            setTimeout(() => {
                manualSection.classList.remove('show');
            }, 300);
            toggleBtn.innerHTML = '<i class="fas fa-minus"></i> Masquer l\'ajout manuel';
            
            // Focus sur l'input principal
            primaryInput.focus();
        }
    }

    /**
     * Ajoute le contenu manuel à l'onglet
     * @param {string} contentId - L'ID de la content-box
     * @param {string} inputType - Le type d'input (single, title-description, review, faq)
     * @param {Object} inputs - Les éléments d'input
     */
    addManualContentByType(contentId, inputType, inputs) {
        let content = '';
        
        switch (inputType) {
            case 'single':
                content = inputs.textarea.value.trim();
                break;
            case 'title-description':
                content = `${inputs.titleInput.value.trim()}\n\n${inputs.descriptionInput.value.trim()}`;
                break;
            case 'review':
                content = `${inputs.nameInput.value.trim()}\n\n${inputs.commentInput.value.trim()}\n\nNote : ${inputs.ratingSelect.value}`;
                break;
            case 'faq':
                content = `Q: ${inputs.questionInput.value.trim()}\nR: ${inputs.answerInput.value.trim()}`;
                break;
            default:
                console.error(`Type d'input inconnu : ${inputType}`);
                return;
        }

        if (!content) {
            this.showMessage('Veuillez saisir du contenu avant d\'ajouter.', 'warning');
            inputs.textarea.focus();
            return;
        }

        const contentBox = document.querySelector(`#${contentId}`);
        if (!contentBox) {
            console.error(`Content box non trouvé pour l'ID ${contentId}`);
            return;
        }

        // Créer l'élément de contenu manuel
        const formattedContent = this.formatManualContent(content);
        const manualContentHtml = this.makeContentSelectable(formattedContent, contentId);
        const manualContentDiv = document.createElement('div');
        manualContentDiv.innerHTML = manualContentHtml;
        
        // Ajouter les gestionnaires d'événements pour les actions
        this.setupManualContentActions(manualContentDiv);

        // Ajouter le contenu à la fin de la content-box
        contentBox.appendChild(manualContentDiv);

        // Vider les inputs et masquer la section
        if (inputType === 'single') {
            inputs.textarea.value = '';
        } else if (inputType === 'title-description') {
            inputs.titleInput.value = '';
            inputs.descriptionInput.value = '';
        } else if (inputType === 'review') {
            inputs.nameInput.value = '';
            inputs.commentInput.value = '';
            inputs.ratingSelect.value = '5';
        } else if (inputType === 'faq') {
            inputs.questionInput.value = '';
            inputs.answerInput.value = '';
        }
        
        const manualSection = inputs.textarea.closest('.manual-input-section');
        const tabPane = manualSection.closest('.tab-pane');
        const toggleBtn = tabPane ? tabPane.querySelector('.btn-manual-toggle') : null;
        
        if (toggleBtn) {
            this.cancelManualInput(manualSection, toggleBtn, inputType, inputs);
        }

        // Afficher un message de succès
        this.showMessage('Contenu ajouté avec succès !', 'success');

        // Scroll vers le nouveau contenu
        manualContentDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Sauvegarder le contenu manuel dans le localStorage
        this.saveManualContent(contentId, manualContentDiv);
    }

    /**
     * Configure les gestionnaires d'événements pour les actions de contenu manuel
     * @param {HTMLElement} manualContentDiv - L'élément de contenu manuel
     */
    setupManualContentActions(manualContentDiv) {
        const moveUpBtn = manualContentDiv.querySelector('.btn-move-up');
        const moveDownBtn = manualContentDiv.querySelector('.btn-move-down');
        const deleteBtn = manualContentDiv.querySelector('.btn-delete-manual');

        if (moveUpBtn) {
            moveUpBtn.addEventListener('click', () => {
                this.moveManualContentUp(manualContentDiv);
            });
        }

        if (moveDownBtn) {
            moveDownBtn.addEventListener('click', () => {
                this.moveManualContentDown(manualContentDiv);
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.deleteManualContent(manualContentDiv);
            });
        }
    }

    /**
     * Déplace le contenu manuel vers le haut
     * @param {HTMLElement} manualContentDiv - L'élément de contenu manuel
     */
    moveManualContentUp(manualContentDiv) {
        const contentBox = manualContentDiv.parentNode;
        const prevSibling = manualContentDiv.previousElementSibling;

        if (prevSibling) {
            contentBox.insertBefore(manualContentDiv, prevSibling);
            this.updateStorageForContentBox(contentBox);
        }
    }

    /**
     * Déplace le contenu manuel vers le bas
     * @param {HTMLElement} manualContentDiv - L'élément de contenu manuel
     */
    moveManualContentDown(manualContentDiv) {
        const contentBox = manualContentDiv.parentNode;
        const nextSibling = manualContentDiv.nextElementSibling;

        if (nextSibling) {
            contentBox.insertBefore(nextSibling, manualContentDiv);
            this.updateStorageForContentBox(contentBox);
        }
    }

    /**
     * Supprime le contenu manuel
     * @param {HTMLElement} manualContentDiv - L'élément de contenu manuel
     */
    deleteManualContent(manualContentDiv) {
        const contentBox = manualContentDiv.parentNode;
        manualContentDiv.remove();
        this.updateStorageForContentBox(contentBox);
        this.showMessage('Contenu manuel supprimé.', 'info');
    }

    /**
     * Met à jour le localStorage pour une content-box donnée
     * @param {HTMLElement} contentBox - L'élément content-box
     */
    updateStorageForContentBox(contentBox) {
        const contentId = contentBox.id;
        const manualContents = contentBox.querySelectorAll('.manual-content');
        const contents = Array.from(manualContents).map(content => content.outerHTML);
        localStorage.setItem(`manual-content-${contentId}`, JSON.stringify(contents));
    }

    /**
     * Supprime tout le contenu ajouté manuellement d'un onglet
     * @param {string} contentId - L'ID de la content-box
     */
    clearManualContent(contentId) {
        const manualContents = document.querySelectorAll(`#${contentId} .manual-content`);
        manualContents.forEach(content => content.remove());
        localStorage.removeItem(`manual-content-${contentId}`);
        this.showMessage('Contenu manuel supprimé.', 'info');
    }

    /**
     * Efface tous les contenus manuels de tous les onglets
     */
    clearAllManualContents() {
        const tabToContentMapping = {
            'tab3': 'productTitle',
            'tab4': 'productBenefits',
            'tab5': 'howItWorks',
            'tab6': 'emotionalBenefits',
            'tab7': 'useCases',
            'tab8': 'characteristics',
            'tab9': 'competitiveAdvantages',
            'tab10': 'customerReviews',
            'tab11': 'faq'
        };

        Object.keys(tabToContentMapping).forEach(tabId => {
            this.clearManualContent(tabToContentMapping[tabId]);
        });
        
        this.showMessage('Tous les contenus manuels ont été supprimés.', 'info');
    }

    /**
     * Charge le contenu manuel depuis le localStorage
     * @param {string} contentId - L'ID de la content-box
     */
    loadManualContent(contentId) {
        const contentBox = document.querySelector(`#${contentId}`);
        if (!contentBox) return;

        const storedContents = localStorage.getItem(`manual-content-${contentId}`);
        if (!storedContents) return;

        const contents = JSON.parse(storedContents);
        contents.forEach(content => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;
            const manualContentDiv = tempDiv.firstElementChild;
            
            // Ajouter les gestionnaires d'événements
            this.setupManualContentActions(manualContentDiv);
            
            contentBox.appendChild(manualContentDiv);
        });
    }

    /**
     * Charge tous les contenus manuels depuis le localStorage
     */
    loadManualContents() {
        const tabToContentMapping = {
            'tab3': 'productTitle',
            'tab4': 'productBenefits',
            'tab5': 'howItWorks',
            'tab6': 'emotionalBenefits',
            'tab7': 'useCases',
            'tab8': 'characteristics',
            'tab9': 'competitiveAdvantages',
            'tab10': 'customerReviews',
            'tab11': 'faq'
        };

        Object.keys(tabToContentMapping).forEach(tabId => {
            this.loadManualContent(tabToContentMapping[tabId]);
        });
    }

    /**
     * Rend le contenu sélectionnable selon le type de contenu
     * @param {string} formattedContent - Le contenu formaté
     * @param {string} contentId - L'ID de la content-box
     * @returns {string} - Le contenu avec les éléments sélectionnables
     */
    makeContentSelectable(formattedContent, contentId) {
        const uniqueId = Math.random().toString(36).substr(2, 9);
        
        switch(contentId) {
            case 'productTitle':
                return this.createSelectableTitle(formattedContent, uniqueId);
            case 'productBenefits':
                return this.createSelectableBenefitTags(formattedContent, uniqueId);
            case 'emotionalBenefits':
                return this.createSelectableEmotionalBenefitTags(formattedContent, uniqueId);
            case 'useCases':
                return this.createSelectableUseCaseTags(formattedContent, uniqueId);
            case 'characteristics':
                return this.createSelectableCharacteristicTags(formattedContent, uniqueId);
            case 'competitiveAdvantages':
                return this.createSelectableAdvantageTags(formattedContent, uniqueId);
            case 'customerReviews':
                return this.createSelectableReviewTags(formattedContent, uniqueId);
            case 'faq':
                return this.createSelectableFAQTags(formattedContent, uniqueId);
            case 'howItWorks':
                return this.createSelectableHowItWorksTags(formattedContent, uniqueId);
            default:
                return formattedContent;
        }
    }

    /**
     * Prépare le contenu avant de le rendre sélectionnable
     * @param {string} content - Le contenu à préparer
     * @returns {string} - Le contenu préparé
     */
    formatManualContent(content) {
        // Ajouter des sauts de ligne pour améliorer la lisibilité
        content = content.replace(/<br>/g, '\n');
        
        // Supprimer les balises HTML inutiles
        content = content.replace(/<\/?p>/g, '');
        
        return content;
    }

    /**
     * Extrait le titre et la description d'un contenu formaté "Titre\n\nDescription"
     * @param {string} content - Le contenu formaté
     * @returns {Object} - {title: string, description: string}
     */
    extractTitleAndDescription(content) {
        const cleanContent = content.replace(/<[^>]*>/g, '').trim();
        const parts = cleanContent.split('\n\n');
        
        if (parts.length >= 2) {
            return {
                title: parts[0].trim(),
                description: parts.slice(1).join('\n\n').trim()
            };
        } else {
            // Si pas de séparation, utiliser tout comme titre
            return {
                title: cleanContent,
                description: cleanContent
            };
        }
    }

    /**
     * Crée un titre sélectionnable avec le même format que les titres générés par l'IA
     */
    createSelectableTitle(content, uniqueId) {
        const cleanContent = content.replace(/<br>/g, ' ').replace(/<[^>]*>/g, '').trim();
        return `
            <div class="content-item manual-title" data-section="productTitle" data-manual-id="${uniqueId}">
                <div class="version-content">
                    <h3 class="section-subtitle">${cleanContent}</h3>
                    <div class="selection-controls">
                        <button class="btn btn-sm btn-primary select-btn" onclick="selectProductTitle('${cleanContent.replace(/'/g, "\\'")}')">
                            <i class="fas fa-check"></i> Utiliser ce titre
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Crée des tags d'avantages sélectionnables qui s'intègrent dans le système existant
     */
    createSelectableBenefitTags(content, uniqueId) {
        const benefits = this.extractListItems(content);
        if (benefits.length === 0) {
            // Si pas de liste, traiter comme un seul avantage
            benefits.push(content.replace(/<[^>]*>/g, '').trim());
        }

        let html = '';
        benefits.forEach((benefit, index) => {
            const benefitId = `manual-benefit-${uniqueId}-${index}`;
            const { title, description } = this.extractTitleAndDescription(benefit);
            const fullTooltip = description !== title ? `${title}\n\n${description}` : title;
            
            html += `
                <div class="benefit-tag manual-benefit" 
                     data-benefit-index="${benefitId}"
                     data-benefit-title="${title}"
                     data-benefit-description="${description}"
                     data-manual-id="${uniqueId}"
                     onclick="window.toggleBenefitSelection('${benefitId}')"
                     title="${fullTooltip}">
                    <span class="benefit-title">${title}</span>
                    <span class="selection-badge"></span>
                    <span class="manual-label">✏️</span>
                </div>
            `;
        });

        return html;
    }

    /**
     * Crée des tags d'avantages émotionnels sélectionnables
     */
    createSelectableEmotionalBenefitTags(content, uniqueId) {
        const benefits = this.extractListItems(content);
        if (benefits.length === 0) {
            benefits.push(content.replace(/<[^>]*>/g, '').trim());
        }

        let html = '';
        benefits.forEach((benefit, index) => {
            const benefitId = `manual-emotional-${uniqueId}-${index}`;
            const { title, description } = this.extractTitleAndDescription(benefit);
            const fullTooltip = description !== title ? `${title}\n\n${description}` : title;
            
            html += `
                <div class="emotional-benefit-tag manual-emotional" 
                     data-emotional-index="${benefitId}"
                     data-emotional-title="${title}"
                     data-emotional-description="${description}"
                     data-manual-id="${uniqueId}"
                     onclick="window.toggleEmotionalBenefitSelection('${benefitId}')"
                     title="${fullTooltip}">
                    <span class="emotional-title">${title}</span>
                    <span class="selection-badge"></span>
                    <span class="manual-label">✏️</span>
                </div>
            `;
        });

        return html;
    }

    /**
     * Crée des tags de cas d'usage sélectionnables
     */
    createSelectableUseCaseTags(content, uniqueId) {
        const useCases = this.extractListItems(content);
        if (useCases.length === 0) {
            useCases.push(content.replace(/<[^>]*>/g, '').trim());
        }

        let html = '';
        useCases.forEach((useCase, index) => {
            const useCaseId = `manual-usecase-${uniqueId}-${index}`;
            const { title, description } = this.extractTitleAndDescription(useCase);
            const fullTooltip = description !== title ? `${title}\n\n${description}` : title;
            
            html += `
                <div class="use-case-tag manual-use-case" 
                     data-use-case-index="${useCaseId}"
                     data-use-case-title="${title}"
                     data-use-case-description="${description}"
                     data-manual-id="${uniqueId}"
                     onclick="window.toggleUseCaseSelection('${useCaseId}')"
                     title="${fullTooltip}">
                    <span class="use-case-title">${title}</span>
                    <span class="selection-badge"></span>
                    <span class="manual-label">✏️</span>
                </div>
            `;
        });

        return html;
    }

    /**
     * Crée des tags de caractéristiques sélectionnables
     */
    createSelectableCharacteristicTags(content, uniqueId) {
        const characteristics = this.extractListItems(content);
        if (characteristics.length === 0) {
            characteristics.push(content.replace(/<[^>]*>/g, '').trim());
        }

        let html = '';
        characteristics.forEach((characteristic, index) => {
            const charId = `manual-char-${uniqueId}-${index}`;
            const { title, description } = this.extractTitleAndDescription(characteristic);
            const fullTooltip = description !== title ? `${title}\n\n${description}` : title;
            
            html += `
                <div class="characteristic-tag manual-characteristic" 
                     data-characteristic-index="${charId}"
                     data-characteristic-title="${title}"
                     data-characteristic-description="${description}"
                     data-manual-id="${uniqueId}"
                     onclick="window.toggleCharacteristicSelection('${charId}')"
                     title="${fullTooltip}">
                    <span class="characteristic-title">${title}</span>
                    <span class="selection-badge"></span>
                    <span class="manual-label">✏️</span>
                </div>
            `;
        });

        return html;
    }

    /**
     * Crée des tags d'avantages concurrentiels sélectionnables
     */
    createSelectableAdvantageTags(content, uniqueId) {
        const advantages = this.extractListItems(content);
        if (advantages.length === 0) {
            advantages.push(content.replace(/<[^>]*>/g, '').trim());
        }

        let html = '';
        advantages.forEach((advantage, index) => {
            const advId = `manual-adv-${uniqueId}-${index}`;
            const { title, description } = this.extractTitleAndDescription(advantage);
            const fullTooltip = description !== title ? `${title}\n\n${description}` : title;
            
            html += `
                <div class="advantage-tag manual-advantage" 
                     data-advantage-index="${advId}"
                     data-advantage-title="${title}"
                     data-advantage-description="${description}"
                     data-manual-id="${uniqueId}"
                     onclick="window.toggleCompetitiveAdvantageSelection('${advId}')"
                     title="${fullTooltip}">
                    <span class="advantage-title">${title}</span>
                    <span class="selection-badge"></span>
                    <span class="manual-label">✏️</span>
                </div>
            `;
        });

        return html;
    }

    /**
     * Crée des tags d'avis clients sélectionnables
     */
    createSelectableReviewTags(content, uniqueId) {
        const reviewId = `manual-review-${uniqueId}`;
        const cleanContent = content.replace(/<[^>]*>/g, '').trim();
        
        // Extraire les parties de l'avis (nom, commentaire, note)
        const parts = cleanContent.split('\n\n');
        let name = '', comment = '', rating = '';
        
        if (parts.length >= 3) {
            name = parts[0].trim();
            comment = parts[1].trim();
            const ratingPart = parts[2].trim();
            rating = ratingPart.replace('Note : ', '');
        } else {
            // Format de fallback
            name = 'Client anonyme';
            comment = cleanContent;
            rating = '5';
        }
        
        const displayTitle = name;
        const fullTooltip = `${name}\n\n${comment}\n\nNote: ${rating}/5 étoiles`;
        
        return `
            <div class="review-tag manual-review" 
                 data-review-index="${reviewId}"
                 data-review-content="${cleanContent}"
                 data-review-name="${name}"
                 data-review-comment="${comment}"
                 data-review-rating="${rating}"
                 data-manual-id="${uniqueId}"
                 onclick="window.toggleCustomerReviewSelection('${reviewId}')"
                 title="${fullTooltip}">
                <div class="review-content">${displayTitle}</div>
                <span class="selection-badge"></span>
                <span class="manual-label">✏️</span>
            </div>
        `;
    }

    /**
     * Crée des tags de FAQs sélectionnables
     */
    createSelectableFAQTags(content, uniqueId) {
        const faqId = `manual-faq-${uniqueId}`;
        const cleanContent = content.replace(/<[^>]*>/g, '').trim();
        
        // Extraire la question et la réponse (format: Q: question\nR: réponse)
        let question = '', answer = '';
        
        if (cleanContent.includes('Q:') && cleanContent.includes('R:')) {
            const parts = cleanContent.split('\nR:');
            question = parts[0].replace('Q:', '').trim();
            answer = parts[1] ? parts[1].trim() : '';
        } else {
            // Format de fallback
            const parts = cleanContent.split('\n');
            question = parts[0] || cleanContent;
            answer = parts.slice(1).join('\n') || '';
        }
        
        const displayTitle = question;
        const fullTooltip = answer ? `Q: ${question}\n\nR: ${answer}` : question;
        
        return `
            <div class="faq-tag manual-faq" 
                 data-faq-index="${faqId}"
                 data-faq-content="${cleanContent}"
                 data-faq-question="${question}"
                 data-faq-answer="${answer}"
                 data-manual-id="${uniqueId}"
                 onclick="window.toggleFAQSelection('${faqId}')"
                 title="${fullTooltip}">
                <div class="faq-content">${displayTitle}</div>
                <span class="selection-badge"></span>
                <span class="manual-label">✏️</span>
            </div>
        `;
    }

    /**
     * Crée des tags de fonctionnement sélectionnables
     */
    createSelectableHowItWorksTags(content, uniqueId) {
        const steps = this.extractListItems(content);
        if (steps.length === 0) {
            steps.push(content.replace(/<[^>]*>/g, '').trim());
        }

        let html = '';
        steps.forEach((step, index) => {
            const stepId = `manual-step-${uniqueId}-${index}`;
            const { title, description } = this.extractTitleAndDescription(step);
            const fullTooltip = description !== title ? `${title}\n\n${description}` : title;
            
            html += `
                <div class="step-tag manual-step" 
                     data-step-index="${stepId}"
                     data-step-title="${title}"
                     data-step-description="${description}"
                     data-manual-id="${uniqueId}"
                     onclick="window.toggleHowItWorksSelection('${stepId}')"
                     title="${fullTooltip}">
                    <span class="step-title">${title}</span>
                    <span class="selection-badge"></span>
                    <span class="manual-label">✏️</span>
                </div>
            `;
        });

        return html;
    }

    /**
     * Extrait les éléments de liste du contenu HTML
     * @param {string} content - Le contenu HTML
     * @returns {Array} - Tableau des éléments de liste
     */
    extractListItems(content) {
        const listItems = content.match(/<li>(.*?)<\/li>/g);
        if (listItems) {
            return listItems.map(item => item.replace(/<\/?li>/g, '').trim());
        }
        return [];
    }

    /**
     * Sauvegarde le contenu manuel dans le localStorage
     * @param {string} contentId - L'ID de la content-box
     * @param {HTMLElement} manualContentDiv - L'élément de contenu manuel
     */
    saveManualContent(contentId, manualContentDiv) {
        const contentBox = document.querySelector(`#${contentId}`);
        const manualContents = contentBox.querySelectorAll('.manual-content');
        const contents = Array.from(manualContents).map(content => content.outerHTML);
        localStorage.setItem(`manual-content-${contentId}`, JSON.stringify(contents));
    }

    /**
     * Annule l'ajout manuel et masque la section
     * @param {HTMLElement} manualSection - L'élément de la section manuelle
     * @param {HTMLElement} toggleBtn - Le bouton de basculement
     * @param {string} inputType - Le type d'input (single, title-description, review, faq)
     * @param {Object} inputs - Les éléments d'input
     */
    cancelManualInput(manualSection, toggleBtn, inputType, inputs) {
        // Vider les inputs
        if (inputType === 'single') {
            inputs.textarea.value = '';
        } else if (inputType === 'title-description') {
            inputs.titleInput.value = '';
            inputs.descriptionInput.value = '';
        } else if (inputType === 'review') {
            inputs.nameInput.value = '';
            inputs.commentInput.value = '';
            inputs.ratingSelect.value = '5';
        } else if (inputType === 'faq') {
            inputs.questionInput.value = '';
            inputs.answerInput.value = '';
        }
        
        // Masquer la section
        manualSection.classList.add('hide');
        setTimeout(() => {
            manualSection.style.display = 'none';
            manualSection.classList.remove('hide');
        }, 300);
        
        // Restaurer le texte du bouton
        toggleBtn.innerHTML = '<i class="fas fa-plus"></i> Ajouter manuellement';
    }

    /**
     * Exporte tout le contenu d'un onglet (généré + manuel) en texte
     * @param {string} contentId - L'ID de la content-box
     * @returns {string} - Le contenu complet de l'onglet
     */
    exportTabContent(contentId) {
        const contentBox = document.querySelector(`#${contentId}`);
        if (!contentBox) return '';

        let content = '';
        const children = contentBox.children;
        
        for (let child of children) {
            if (child.classList.contains('manual-content')) {
                content += '\n[CONTENU MANUEL]\n';
                content += child.querySelector('.manual-content-body').textContent.replace('✏️ Ajouté manuellement', '').trim();
                content += '\n[/CONTENU MANUEL]\n\n';
            } else {
                content += child.textContent.trim() + '\n\n';
            }
        }
        
        return content.trim();
    }

    /**
     * Affiche un message temporaire à l'utilisateur
     * @param {string} message - Le message à afficher
     * @param {string} type - Le type de message ('success', 'warning', 'error')
     */
    showMessage(message, type = 'info') {
        // Supprimer les anciens messages
        const existingMessages = document.querySelectorAll('.manual-input-message');
        existingMessages.forEach(msg => msg.remove());

        // Créer le nouveau message
        const messageDiv = document.createElement('div');
        messageDiv.className = `manual-input-message ${type}`;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getMessageColor(type)};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 500;
            animation: slideInRight 0.3s ease-out;
        `;
        messageDiv.textContent = message;

        // Ajouter au DOM
        document.body.appendChild(messageDiv);

        // Supprimer après 3 secondes
        setTimeout(() => {
            messageDiv.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 300);
        }, 3000);
    }

    /**
     * Retourne la couleur appropriée pour le type de message
     * @param {string} type - Le type de message
     * @returns {string} - La couleur CSS
     */
    getMessageColor(type) {
        const colors = {
            success: 'linear-gradient(135deg, #4CAF50, #45a049)',
            warning: 'linear-gradient(135deg, #FF9800, #f57c00)',
            error: 'linear-gradient(135deg, #f44336, #d32f2f)',
            info: 'linear-gradient(135deg, #00d4ff, #0099cc)'
        };
        return colors[type] || colors.info;
    }
}

// Ajouter les styles d'animation pour les messages
const messageStyles = document.createElement('style');
messageStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(messageStyles);

// Initialiser le gestionnaire d'ajout manuel
const manualInputManager = new ManualInputManager();

// Exposer globalement pour utilisation externe si nécessaire
window.ManualInputManager = manualInputManager;

// ===== FONCTIONS POUR L'AJOUT MANUEL D'AVIS CLIENTS =====

/**
 * Affiche le modal d'ajout d'avis client
 */
window.showAddReviewModal = function() {
    // Créer le modal s'il n'existe pas
    let modal = document.getElementById('addReviewModal');
    if (!modal) {
        modal = createAddReviewModal();
        document.body.appendChild(modal);
    }
    
    // Réinitialiser le formulaire
    document.getElementById('reviewName').value = '';
    document.getElementById('reviewComment').value = '';
    document.getElementById('reviewRating').value = '5';
    
    // Afficher le modal
    modal.style.display = 'flex';
};

/**
 * Ferme le modal d'ajout d'avis client
 */
window.closeAddReviewModal = function() {
    const modal = document.getElementById('addReviewModal');
    if (modal) {
        modal.style.display = 'none';
    }
};

/**
 * Crée le modal HTML pour l'ajout d'avis
 */
function createAddReviewModal() {
    const modal = document.createElement('div');
    modal.id = 'addReviewModal';
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background: white;
            padding: 30px;
            border-radius: 12px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        ">
            <div class="modal-header" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                border-bottom: 1px solid #eee;
                padding-bottom: 15px;
            ">
                <h3 style="margin: 0; color: #333;">✏️ Ajouter un avis client</h3>
                <button onclick="window.closeAddReviewModal()" style="
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #999;
                ">×</button>
            </div>
            
            <form id="addReviewForm" style="display: flex; flex-direction: column; gap: 15px;">
                <div class="form-group">
                    <label for="reviewName" style="
                        display: block;
                        margin-bottom: 5px;
                        font-weight: bold;
                        color: #333;
                    ">Prénom du client :</label>
                    <input type="text" id="reviewName" required style="
                        width: 100%;
                        padding: 10px;
                        border: 2px solid #ddd;
                        border-radius: 6px;
                        font-size: 16px;
                        box-sizing: border-box;
                    " placeholder="Ex: Marie, Pierre, Sophie...">
                </div>
                
                <div class="form-group">
                    <label for="reviewComment" style="
                        display: block;
                        margin-bottom: 5px;
                        font-weight: bold;
                        color: #333;
                    ">Commentaire :</label>
                    <textarea id="reviewComment" required rows="4" style="
                        width: 100%;
                        padding: 10px;
                        border: 2px solid #ddd;
                        border-radius: 6px;
                        font-size: 16px;
                        resize: vertical;
                        box-sizing: border-box;
                    " placeholder="Écrivez l'avis du client..."></textarea>
                </div>
                
                <div class="form-group">
                    <label for="reviewRating" style="
                        display: block;
                        margin-bottom: 5px;
                        font-weight: bold;
                        color: #333;
                    ">Note :</label>
                    <select id="reviewRating" style="
                        width: 100%;
                        padding: 10px;
                        border: 2px solid #ddd;
                        border-radius: 6px;
                        font-size: 16px;
                        box-sizing: border-box;
                    ">
                        <option value="5">⭐⭐⭐⭐⭐ (5 étoiles)</option>
                        <option value="4">⭐⭐⭐⭐ (4 étoiles)</option>
                        <option value="3">⭐⭐⭐ (3 étoiles)</option>
                        <option value="2">⭐⭐ (2 étoiles)</option>
                        <option value="1">⭐ (1 étoile)</option>
                    </select>
                </div>
                
                <div class="form-actions" style="
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                ">
                    <button type="button" onclick="window.closeAddReviewModal()" style="
                        flex: 1;
                        padding: 12px;
                        border: 2px solid #ddd;
                        background: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 16px;
                    ">Annuler</button>
                    <button type="submit" style="
                        flex: 1;
                        padding: 12px;
                        border: none;
                        background: linear-gradient(135deg, #00d4ff, #0099cc);
                        color: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: bold;
                    ">Ajouter</button>
                </div>
            </form>
        </div>
    `;
    
    // Ajouter l'écouteur d'événement pour le formulaire
    modal.addEventListener('submit', handleAddReview);
    
    // Fermer le modal en cliquant sur l'overlay
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            window.closeAddReviewModal();
        }
    });
    
    return modal;
}

/**
 * Gère l'ajout d'un nouvel avis client
 */
function handleAddReview(e) {
    e.preventDefault();
    
    const name = document.getElementById('reviewName').value.trim();
    const comment = document.getElementById('reviewComment').value.trim();
    const rating = parseInt(document.getElementById('reviewRating').value);
    
    if (!name || !comment) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }
    
    // Créer l'objet avis
    const newReview = {
        name: name,
        review: comment,
        rating: rating,
        isManual: true,
        manualId: `manual-review-${Date.now()}`
    };
    
    // Ajouter l'avis à la liste globale
    addManualReview(newReview);
    
    // Fermer le modal
    window.closeAddReviewModal();
    
    // Afficher un message de succès
    manualInputManager.showMessage('Avis ajouté avec succès !', 'success');
}

/**
 * Ajoute un avis manuel à la liste et met à jour l'affichage
 */
function addManualReview(review) {
    // Initialiser les tableaux si nécessaire
    if (!window.allCustomerReviews) {
        window.allCustomerReviews = [];
    }
    if (!window.manualCustomerReviews) {
        window.manualCustomerReviews = [];
    }
    
    // Ajouter l'avis à la liste des avis manuels
    window.manualCustomerReviews.push(review);
    
    // Ajouter l'avis à la liste globale
    window.allCustomerReviews.push(review);
    
    // Mettre à jour l'affichage
    updateCustomerReviewsDisplay();
    
    console.log('[Manual Review] Avis ajouté:', review);
}

/**
 * Met à jour l'affichage des avis clients
 */
function updateCustomerReviewsDisplay() {
    const customerReviewsContainer = document.getElementById('customerReviews');
    if (!customerReviewsContainer) return;
    
    // Combiner les avis générés et manuels
    const allReviews = [...(window.generatedContent?.customerReviews?.version1 || []), ...(window.manualCustomerReviews || [])];
    
    // Reformater l'affichage
    customerReviewsContainer.innerHTML = window.formatCustomerReviewsWithSelectors('customerReviews', allReviews);
    
    // Réattacher les gestionnaires d'événements si nécessaire
    if (typeof window.setupCustomerReviewsSelectors === 'function') {
        window.setupCustomerReviewsSelectors();
    }
    
    // Mettre à jour les badges
    if (typeof updateCustomerReviewBadges === 'function') {
        setTimeout(() => updateCustomerReviewBadges(), 100);
    }
}

// Exposer les fonctions globalement
window.addManualReview = addManualReview;
window.updateCustomerReviewsDisplay = updateCustomerReviewsDisplay;

// ===== FONCTIONS POUR L'AJOUT MANUEL DE FAQ =====

/**
 * Affiche le modal d'ajout de FAQ
 */
window.showAddFAQModal = function() {
    // Créer le modal s'il n'existe pas
    let modal = document.getElementById('addFAQModal');
    if (!modal) {
        modal = createAddFAQModal();
        document.body.appendChild(modal);
    }
    
    // Réinitialiser le formulaire
    document.getElementById('faqQuestion').value = '';
    document.getElementById('faqAnswer').value = '';
    
    // Afficher le modal
    modal.style.display = 'flex';
};

/**
 * Ferme le modal d'ajout de FAQ
 */
window.closeAddFAQModal = function() {
    const modal = document.getElementById('addFAQModal');
    if (modal) {
        modal.style.display = 'none';
    }
};

/**
 * Crée le modal HTML pour l'ajout de FAQ
 */
function createAddFAQModal() {
    const modal = document.createElement('div');
    modal.id = 'addFAQModal';
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background: white;
            padding: 30px;
            border-radius: 12px;
            width: 90%;
            max-width: 600px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        ">
            <div class="modal-header" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                border-bottom: 1px solid #eee;
                padding-bottom: 15px;
            ">
                <h3 style="margin: 0; color: #333;">✏️ Ajouter une FAQ</h3>
                <button onclick="window.closeAddFAQModal()" style="
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #999;
                ">×</button>
            </div>
            
            <form id="addFAQForm" style="display: flex; flex-direction: column; gap: 15px;">
                <div class="form-group">
                    <label for="faqQuestion" style="
                        display: block;
                        margin-bottom: 5px;
                        font-weight: bold;
                        color: #333;
                    ">Question :</label>
                    <input type="text" id="faqQuestion" required style="
                        width: 100%;
                        padding: 10px;
                        border: 2px solid #ddd;
                        border-radius: 6px;
                        font-size: 16px;
                        box-sizing: border-box;
                    " placeholder="Ex: Comment utiliser ce produit ?">
                </div>
                
                <div class="form-group">
                    <label for="faqAnswer" style="
                        display: block;
                        margin-bottom: 5px;
                        font-weight: bold;
                        color: #333;
                    ">Réponse :</label>
                    <textarea id="faqAnswer" required rows="4" style="
                        width: 100%;
                        padding: 10px;
                        border: 2px solid #ddd;
                        border-radius: 6px;
                        font-size: 16px;
                        resize: vertical;
                        box-sizing: border-box;
                    " placeholder="Écrivez la réponse détaillée..."></textarea>
                </div>
                
                <div class="form-actions" style="
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                ">
                    <button type="button" onclick="window.closeAddFAQModal()" style="
                        flex: 1;
                        padding: 12px;
                        border: 2px solid #ddd;
                        background: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 16px;
                    ">Annuler</button>
                    <button type="submit" style="
                        flex: 1;
                        padding: 12px;
                        border: none;
                        background: linear-gradient(135deg, #00d4ff, #0099cc);
                        color: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: bold;
                    ">Ajouter</button>
                </div>
            </form>
        </div>
    `;
    
    // Ajouter l'écouteur d'événement pour le formulaire
    modal.addEventListener('submit', handleAddFAQ);
    
    // Fermer le modal en cliquant sur l'overlay
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            window.closeAddFAQModal();
        }
    });
    
    return modal;
}

/**
 * Gère l'ajout d'une nouvelle FAQ
 */
function handleAddFAQ(e) {
    e.preventDefault();
    
    const question = document.getElementById('faqQuestion').value.trim();
    const answer = document.getElementById('faqAnswer').value.trim();
    
    if (!question || !answer) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }
    
    // Créer l'objet FAQ
    const newFAQ = {
        question: question,
        answer: answer,
        isManual: true,
        manualId: `manual-faq-${Date.now()}`
    };
    
    // Ajouter la FAQ à la liste globale
    addManualFAQ(newFAQ);
    
    // Fermer le modal
    window.closeAddFAQModal();
    
    // Afficher un message de succès
    manualInputManager.showMessage('FAQ ajoutée avec succès !', 'success');
}

/**
 * Ajoute une FAQ manuelle à la liste et met à jour l'affichage
 */
function addManualFAQ(faq) {
    // Initialiser les tableaux si nécessaire
    if (!window.allFAQs) {
        window.allFAQs = [];
    }
    if (!window.manualFAQs) {
        window.manualFAQs = [];
    }
    
    // Ajouter la FAQ à la liste des FAQ manuelles
    window.manualFAQs.push(faq);
    
    // Ajouter la FAQ à la liste globale
    window.allFAQs.push(faq);
    
    // Mettre à jour l'affichage
    updateFAQDisplay();
    
    console.log('[Manual FAQ] FAQ ajoutée:', faq);
}

/**
 * Met à jour l'affichage des FAQ
 */
function updateFAQDisplay() {
    const faqContainer = document.getElementById('faq');
    if (!faqContainer) return;
    
    // Combiner les FAQ générées et manuelles
    const allFAQs = window.generatedContent?.faq || [];
    
    // Reformater l'affichage
    faqContainer.innerHTML = formatFAQWithSelectors('faq', allFAQs);
    
    // Réattacher les gestionnaires d'événements si nécessaire
    if (typeof window.setupFAQSelectors === 'function') {
        window.setupFAQSelectors();
    }
    
    // Mettre à jour les badges
    if (typeof updateFAQBadges === 'function') {
        setTimeout(() => updateFAQBadges(), 100);
    }
}

// Exposer les fonctions globalement
window.addManualFAQ = addManualFAQ;
window.updateFAQDisplay = updateFAQDisplay;

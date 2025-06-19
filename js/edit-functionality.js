/**
 * Fonctionnalités d'édition pour les éléments générés
 */

// Initialiser les variables globales pour stocker les contenus édités
window.editedContents = {};

/**
 * Ajouter un bouton d'édition à un élément sélectionnable
 * @param {string} contentId - L'ID de l'élément à éditer
 * @param {string} type - Le type d'élément (title, benefit, useCase, etc.)
 * @param {object} data - Les données associées à l'élément
 */
function addEditButton(contentId, type, content) {
    // Trouver l'élément parent
    const container = document.getElementById(contentId);
    if (!container) return;
    
    // Créer le bouton d'édition
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerHTML = '<i class="fas fa-pen"></i> Éditer';
    editBtn.setAttribute('data-content', contentId);
    
    // Supprimer un bouton existant s'il y en a un
    const existingBtn = container.parentNode.querySelector('.edit-btn');
    if (existingBtn) {
        existingBtn.remove();
    }
    
    // Ajouter le gestionnaire d'événements pour l'édition
    editBtn.addEventListener('click', function() {
        // Récupérer le contenu actuel
        let currentContent = '';
        if (container.querySelector('.content-text')) {
            currentContent = container.querySelector('.content-text').innerHTML;
        } else {
            currentContent = container.innerHTML;
        }
        
        // Nettoyer le HTML pour l'édition
        currentContent = currentContent.replace(/<div.*?>/g, '').replace(/<\/div>/g, '\n')
                                       .replace(/<br\s*\/?>/g, '\n')
                                       .replace(/<\/?strong>/g, '')
                                       .replace(/<\/?em>/g, '')
                                       .replace(/&nbsp;/g, ' ')
                                       .replace(/&lt;/g, '<')
                                       .replace(/&gt;/g, '>')
                                       .replace(/&amp;/g, '&');
        
        // Créer la zone d'édition
        const editArea = document.createElement('div');
        editArea.className = 'edit-mode';
        editArea.innerHTML = `
            <textarea id="edit-${contentId}">${currentContent}</textarea>
            <div class="edit-actions">
                <button class="save-edit-btn" data-content="${contentId}">Sauvegarder</button>
                <button class="cancel-edit-btn" data-content="${contentId}">Annuler</button>
            </div>
        `;
        
        // Cacher le contenu actuel et ajouter la zone d'édition
        container.style.display = 'none';
        container.parentNode.insertBefore(editArea, container.nextSibling);
        
        // Sauvegarder le contenu en mémoire
        window.editedContents[contentId] = {
            original: currentContent,
            edited: currentContent,
            type: type
        };
        
        // Mettre le focus sur la zone de texte
        document.getElementById(`edit-${contentId}`).focus();
        
        // Cacher le bouton d'édition
        editBtn.style.display = 'none';
        
        // Gérer la sauvegarde
        document.querySelector(`.save-edit-btn[data-content="${contentId}"]`).addEventListener('click', function() {
            const editedContent = document.getElementById(`edit-${contentId}`).value;
            window.editedContents[contentId].edited = editedContent;
            
            // Mettre à jour le contenu avec le contenu édité
            const formattedContent = formatEditedContent(editedContent, type);
            
            // Déterminer où placer le contenu édité
            if (container.querySelector('.content-text')) {
                container.querySelector('.content-text').innerHTML = formattedContent;
            } else if (container.querySelector('.version-content')) {
                container.querySelector('.version-content').innerHTML = formattedContent;
            } else {
                container.innerHTML = formattedContent;
            }
            
            // Supprimer la zone d'édition
            editArea.remove();
            
            // Réafficher le contenu et le bouton d'édition
            container.style.display = 'block';
            editBtn.style.display = 'inline-flex';
            
            // Enregistrer les modifications dans le stockage local
            saveEditedContent(contentId, editedContent);
        });
        
        // Gérer l'annulation
        document.querySelector(`.cancel-edit-btn[data-content="${contentId}"]`).addEventListener('click', function() {
            // Supprimer la zone d'édition
            editArea.remove();
            
            // Réafficher le contenu et le bouton d'édition
            container.style.display = 'block';
            editBtn.style.display = 'inline-flex';
        });
    });
    
    // Ajouter le bouton après l'élément
    const copyBtn = container.parentNode.querySelector('.btn-copy');
    if (copyBtn) {
        container.parentNode.insertBefore(editBtn, copyBtn);
    } else {
        container.parentNode.appendChild(editBtn);
    }
}

/**
 * Ajouter un bouton d'édition à un élément individuel
 * @param {HTMLElement} element - L'élément auquel ajouter le bouton d'édition
 * @param {string} type - Le type d'élément
 * @param {number} index - L'index de l'élément dans la liste
 */
function addEditButtonToElement(element, type, index) {
    // Appliquer la position relative si elle n'est pas déjà définie
    if (window.getComputedStyle(element).position === 'static') {
        element.style.position = 'relative';
    }
    if (!element) {
        console.warn(`Élément de type ${type} avec index ${index} non trouvé`);
        return;
    }
    
    // Vérifier si un bouton d'édition existe déjà
    const existingButton = element.querySelector('.edit-item-btn');
    if (existingButton) {
        existingButton.remove(); // Supprimer le bouton existant s'il y en a un
    }
    
    // Créer le bouton d'édition
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-item-btn';
    editBtn.innerHTML = '<i class="fas fa-pen"></i>';
    editBtn.setAttribute('data-type', type);
    editBtn.setAttribute('data-index', index);
    editBtn.setAttribute('title', 'Modifier');
    
    // Ajouter le gestionnaire d'événements pour l'édition
    editBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Empêcher le déclenchement d'autres événements (comme la sélection)
        
        console.log(`Édition de l'élément ${type} #${index}`);
        
        // Extraire le contenu à éditer selon le type d'élément
        let content = '';
        let title = '';
        let description = '';
        
        switch(type) {
            case 'benefit':
                content = element.textContent.trim();
                break;
            case 'howItWorks':
                content = element.innerHTML.replace(/<br\s*\/?>/g, '\n');
                break;
            case 'emotionalBenefit':
                title = element.querySelector('.emotional-benefit-title')?.textContent.trim() || '';
                description = element.querySelector('.emotional-benefit-text')?.textContent.trim() || '';
                content = `${title}\n\n${description}`;
                break;
            case 'useCase':
                title = element.querySelector('.use-case-title')?.textContent.trim() || '';
                description = element.querySelector('.use-case-explanation')?.textContent.trim() || '';
                content = `${title}\n\n${description}`;
                break;
            case 'characteristic':
                title = element.querySelector('.characteristic-title')?.textContent.trim() || '';
                description = element.querySelector('.characteristic-explanation')?.textContent.trim() || '';
                content = `${title}\n\n${description}`;
                break;
            case 'competitiveAdvantage':
                content = element.textContent.trim();
                break;
            case 'customerReview':
                title = element.querySelector('.review-title')?.textContent.trim() || '';
                description = element.querySelector('.review-description')?.textContent.trim() || '';
                const author = element.querySelector('.review-author')?.textContent.trim() || '';
                content = `${title}\n\n${description}\n\n${author}`;
                break;
            case 'faq':
                const question = element.querySelector('.faq-question, .selected-faq-question')?.textContent.trim() || '';
                const answer = element.querySelector('.faq-answer, .selected-faq-answer')?.textContent.trim() || '';
                content = `${question}\n\n${answer}`;
                break;
            case 'productTitle':
                content = element.textContent.trim();
                break;
            default:
                content = element.textContent.trim();
        }
        
        // Nettoyer le contenu pour l'édition
        content = content.replace(/^(Question|Réponse)\s\d+:\s/g, '')
                         .replace(/^(Titre|Auteur):\s/g, '')
                         .replace(/\*\*/g, '');
        
        // Créer la zone d'édition
        const editContainer = document.createElement('div');
        editContainer.className = 'edit-item-container';
        editContainer.innerHTML = `
            <textarea class="edit-item-textarea" data-type="${type}" data-index="${index}">${content}</textarea>
            <div class="edit-item-actions">
                <button class="save-item-btn">Sauvegarder</button>
                <button class="cancel-item-btn">Annuler</button>
            </div>
        `;
        
        // Cacher l'élément original et ajouter la zone d'édition
        const originalContent = element.innerHTML;
        element.style.display = 'none';
        element.parentNode.insertBefore(editContainer, element.nextSibling);
        
        // Gestionnaire pour la sauvegarde
        editContainer.querySelector('.save-item-btn').addEventListener('click', function() {
            const editedContent = editContainer.querySelector('.edit-item-textarea').value;
            
            // Mise à jour du contenu selon le type
            if (type === 'howItWorks') {
                element.innerHTML = editedContent.replace(/\n/g, '<br>');
            } else if (type === 'emotionalBenefit' || type === 'useCase' || type === 'characteristic' || type === 'customerReview' || type === 'faq') {
                // Pour les éléments avec titre et description
                const parts = editedContent.split('\n\n');
                
                if (parts.length >= 2) {
                    // Mettre à jour le titre et la description
                    const newTitle = parts[0];
                    const newDescription = parts[1];
                    
                    if (type === 'emotionalBenefit') {
                        element.querySelector('.emotional-benefit-title').textContent = newTitle;
                        element.querySelector('.emotional-benefit-text').textContent = newDescription;
                    } else if (type === 'useCase') {
                        element.querySelector('.use-case-title').textContent = newTitle;
                        element.querySelector('.use-case-explanation').textContent = newDescription;
                    } else if (type === 'characteristic') {
                        element.querySelector('.characteristic-title').textContent = newTitle;
                        element.querySelector('.characteristic-explanation').textContent = newDescription;
                    } else if (type === 'customerReview') {
                        element.querySelector('.review-title').textContent = newTitle;
                        if (parts.length >= 3) {
                            element.querySelector('.review-description').textContent = newDescription;
                            element.querySelector('.review-author').textContent = parts[2];
                        } else {
                            element.querySelector('.review-description').textContent = newDescription;
                        }
                    } else if (type === 'faq') {
                        const questionEl = element.querySelector('.faq-question, .selected-faq-question');
                        const answerEl = element.querySelector('.faq-answer, .selected-faq-answer');
                        
                        if (questionEl && answerEl) {
                            // Préserver le format "Question X: " ou "Réponse X: " s'il existe
                            const questionPrefix = questionEl.textContent.match(/^(Question\s\d+:\s)/);
                            const answerPrefix = answerEl.textContent.match(/^(Réponse\s\d+:\s)/);
                            
                            questionEl.textContent = questionPrefix ? questionPrefix[0] + newTitle : newTitle;
                            answerEl.textContent = answerPrefix ? answerPrefix[0] + newDescription : newDescription;
                        }
                    }
                } else {
                    // Si pas de paragraphes séparés, mettre tout dans le premier élément
                    if (type === 'faq') {
                        element.querySelector('.faq-question, .selected-faq-question').textContent = editedContent;
                    } else {
                        // Mise à jour du premier élément trouvé
                        const firstElement = element.querySelector('*:first-child');
                        if (firstElement) {
                            firstElement.textContent = editedContent;
                        }
                    }
                }
            } else {
                // Pour les éléments simples (texte uniquement)
                element.textContent = editedContent;
            }
            
            // Suppression de la zone d'édition et réaffichage de l'élément
            editContainer.remove();
            element.style.display = '';
            
            // Ré-ajouter le bouton d'édition (il a disparu avec le innerHTML)
            addEditButtonToElement(element, type, index);
            
            console.log(`Élément ${type} #${index} modifié avec succès`);
        });
        
        // Gestionnaire pour l'annulation
        editContainer.querySelector('.cancel-item-btn').addEventListener('click', function() {
            // Restaurer le contenu original
            editContainer.remove();
            element.style.display = '';
            
            console.log(`Édition de l'élément ${type} #${index} annulée`);
        });
        
        // Mettre le focus sur la zone de texte
        editContainer.querySelector('.edit-item-textarea').focus();
    });
    
    // Ajouter le bouton à l'élément
    element.appendChild(editBtn);
    
    console.log(`Bouton d'édition ajouté à l'élément ${type} #${index}`);
}

/**
 * Formater le contenu édité en HTML
 * @param {string} content - Le contenu édité
 * @param {string} type - Le type de contenu
 * @returns {string} - Le contenu formaté en HTML
 */
function formatEditedContent(content, type) {
    // Formater différemment selon le type de contenu
    switch(type) {
        case 'text':
            return content.replace(/\n/g, '<br>');
        case 'list':
            const lines = content.split('\n');
            return lines.map(line => line.trim()).filter(line => line).join('<br>');
        default:
            return content.replace(/\n/g, '<br>');
    }
}

/**
 * Enregistrer le contenu édité dans le stockage local
 * @param {string} contentId - L'ID du contenu
 * @param {string} content - Le contenu édité
 */
function saveEditedContent(contentId, content) {
    const editedContents = JSON.parse(localStorage.getItem('editedContents') || '{}');
    editedContents[contentId] = content;
    localStorage.setItem('editedContents', JSON.stringify(editedContents));
}

/**
 * Charger le contenu édité depuis le stockage local
 * @param {string} contentId - L'ID du contenu
 * @returns {string|null} - Le contenu édité ou null s'il n'existe pas
 */
function loadEditedContent(contentId) {
    const editedContents = JSON.parse(localStorage.getItem('editedContents') || '{}');
    return editedContents[contentId] || null;
}

/**
 * Initialiser les boutons d'édition pour tous les éléments individuels
 */
function initializeEditButtons() {
    // Ajouter des boutons d'édition à chaque élément individuel
    // sauf pour l'analyse psychographique et la synthèse stratégique
    
    console.log('Initialisation des boutons d\'\u00e9dition pour chaque \u00e9l\u00e9ment...');
    
    // Sélecteurs plus généraux pour couvrir différentes structures HTML
    
    // 1. Avantages produits (différentes structures possibles)
    let elements = document.querySelectorAll('#productBenefits .benefit-item, #productBenefits li, #productBenefits .version-item');
    console.log(`Trouvé ${elements.length} avantages produits`);
    elements.forEach((item, index) => {
        addEditButtonToElement(item, 'benefit', index);
    });
    
    // 2. Comment ça marche
    elements = document.querySelectorAll('#howItWorks .version-content, #howItWorks .content-text, #howItWorks p');
    console.log(`Trouvé ${elements.length} éléments "Comment ça marche"`);
    elements.forEach((item, index) => {
        if (item.closest('.version-selector')) return; // Ignorer les éléments dans le sélecteur de version
        addEditButtonToElement(item, 'howItWorks', index);
    });
    
    // 3. Bénéfices émotionnels
    elements = document.querySelectorAll('#emotionalBenefits .emotional-benefit-item, #emotionalBenefits .benefit-item, #emotionalBenefits .version-item');
    console.log(`Trouvé ${elements.length} bénéfices émotionnels`);
    elements.forEach((item, index) => {
        addEditButtonToElement(item, 'emotionalBenefit', index);
    });
    
    // 4. Cas d'utilisation
    elements = document.querySelectorAll('#useCases .use-case-item, #useCases .version-item, #useCases .selected-use-case-item');
    console.log(`Trouvé ${elements.length} cas d'utilisation`);
    elements.forEach((item, index) => {
        addEditButtonToElement(item, 'useCase', index);
    });
    
    // 5. Caractéristiques
    elements = document.querySelectorAll('#characteristics .characteristic-item, #characteristics .version-item, #characteristics .selected-characteristic-item');
    console.log(`Trouvé ${elements.length} caractéristiques`);
    elements.forEach((item, index) => {
        addEditButtonToElement(item, 'characteristic', index);
    });
    
    // 6. Avantages concurrentiels
    elements = document.querySelectorAll('#competitiveAdvantages .competitive-advantage-item, #competitiveAdvantages li, #competitiveAdvantages .version-item');
    console.log(`Trouvé ${elements.length} avantages concurrentiels`);
    elements.forEach((item, index) => {
        addEditButtonToElement(item, 'competitiveAdvantage', index);
    });
    
    // 7. Avis clients
    elements = document.querySelectorAll('#customerReviews .customer-review-item, #customerReviews .review-item, #customerReviews .selected-review-item');
    console.log(`Trouvé ${elements.length} avis clients`);
    elements.forEach((item, index) => {
        addEditButtonToElement(item, 'customerReview', index);
    });
    
    // 8. FAQ
    elements = document.querySelectorAll('#faq .faq-item, #faq .selected-faq-item');
    console.log(`Trouvé ${elements.length} questions FAQ`);
    elements.forEach((item, index) => {
        addEditButtonToElement(item, 'faq', index);
    });
    
    // 9. Titre du produit
    elements = document.querySelectorAll('#productTitle .product-title-item, #productTitle .version-item, #productTitle .title-tag');
    console.log(`Trouvé ${elements.length} titres de produit`);
    elements.forEach((item, index) => {
        addEditButtonToElement(item, 'productTitle', index);
    });
    
    console.log('Initialisation des boutons d\'\u00e9dition terminée.');
}

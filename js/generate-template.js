// Fonction pour charger le fichier template-ro.json à travers une boîte de dialogue de sélection de fichier
window.loadFullTemplate = async function() {
    return new Promise((resolve, reject) => {
        // Créer un élément input de type file
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        
        // Gérer l'événement de sélection de fichier
        fileInput.onchange = (event) => {
            const file = event.target.files[0];
            if (!file) {
                document.body.removeChild(fileInput);
                reject(new Error('Aucun fichier sélectionné'));
                return;
            }
            
            // Vérifier si le fichier est un JSON
            if (!file.name.endsWith('.json')) {
                document.body.removeChild(fileInput);
                reject(new Error('Le fichier sélectionné n\'est pas un fichier JSON'));
                return;
            }
            
            // Lire le fichier
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const jsonContent = JSON.parse(e.target.result);
                    // Générer le JSON du template final
                    const updatedTemplate = JSON.parse(JSON.stringify(jsonContent));
                    
                    // Définir le titre du produit dans les métadonnées du template
                    if (window.selectedProductTitle && window.productTitleValidated && updatedTemplate.product_title_behavior === "replace") {
                        updatedTemplate.product_title = window.selectedProductTitle.replace(/\*\*/g, '');
                        console.log('Titre du produit défini dans le template:', updatedTemplate.product_title);
                    }
                    
                    document.body.removeChild(fileInput);
                    resolve(updatedTemplate);
                } catch (error) {
                    document.body.removeChild(fileInput);
                    reject(new Error('Le fichier sélectionné ne contient pas de JSON valide: ' + error.message));
                }
            };
            reader.onerror = () => {
                document.body.removeChild(fileInput);
                reject(new Error('Erreur lors de la lecture du fichier'));
            };
            reader.readAsText(file);
        };
        
        // Déclencher le clic sur l'input
        fileInput.click();
    });
}

/**
 * Nettoie une question FAQ en retirant les numéros et préfixes
 * @param {string} question - La question à nettoyer
 * @returns {string} - La question nettoyée
 */
function cleanFAQQuestion(question) {
    if (!question) return '';
    
    // Retire les caractères gras (**)
    let cleaned = question.replace(/\*\*/g, '');
    
    // Retire différents formats possibles de numérotation
    // Format Q1:, Q.1:, Q.1., Q1., Q1), 1., 1:, 1), etc.
    cleaned = cleaned.replace(/^\s*(?:Q[\s.:]*)?(\d+)[\s.:)]*\s*/i, '');
    
    // Mettre la première lettre en majuscule si nécessaire
    if (cleaned.length > 0) {
        cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }
    
    return cleaned;
}

// Fonction de génération de template JSON pour Shopify
window.generateShopifyTemplate = async function(generatedContent, productName) {
    try {
        console.log('Début de la génération du template Shopify');
        
        // Charger le template complet via la boîte de dialogue
        const template = await window.loadFullTemplate();
        console.log('Template chargé avec succès');
        
        // Vérifier que le template a bien été chargé et qu'il a la bonne structure
        if (!template || !template.sections || !template.order || Object.keys(template.sections).length < 1) {
            throw new Error('Le template chargé n\'a pas la structure attendue');
        }
        
        console.log('Structure du template validée, contient ' + Object.keys(template.sections).length + ' sections');
        console.log('Order contient ' + template.order.length + ' éléments');
        
        // Récupérer le nom du produit pour le nom de fichier
        const safeProductName = productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        // Extraire les 4 avantages produits de productBenefits.version1 uniquement
        let benefits = [];
        
        // Utiliser uniquement productBenefits.version1 comme spécifié dans les requirements
        if (generatedContent && generatedContent.productBenefits && generatedContent.productBenefits.version1 && generatedContent.productBenefits.version1.length > 0) {
            console.log('[Template] Raw productBenefits.version1:', generatedContent.productBenefits.version1);
            console.log('[Template] Type of productBenefits.version1:', typeof generatedContent.productBenefits.version1);
            console.log('[Template] Is array:', Array.isArray(generatedContent.productBenefits.version1));
            
            // Si c'est une chaîne, la diviser en lignes
            if (typeof generatedContent.productBenefits.version1 === 'string') {
                const lines = generatedContent.productBenefits.version1.split('\n').filter(line => line.trim());
                benefits = lines.slice(0, 4).map(line => {
                    // Nettoyer les numéros et puces
                    return line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim();
                });
            } else if (Array.isArray(generatedContent.productBenefits.version1)) {
                benefits = generatedContent.productBenefits.version1.slice(0, 4);
            } else {
                console.error('[Template] Format inattendu pour productBenefits.version1');
                benefits = ["Bénéfice non spécifié 1", "Bénéfice non spécifié 2", "Bénéfice non spécifié 3", "Bénéfice non spécifié 4"];
            }
            
            console.log('[Template] Benefits après extraction:', benefits);
        } else {
            console.error('[Template] Aucun avantage trouvé dans generatedContent.productBenefits.version1');
            // Utiliser des valeurs par défaut si aucun avantage n'est trouvé
            benefits = ["Bénéfice non spécifié 1", "Bénéfice non spécifié 2", "Bénéfice non spécifié 3", "Bénéfice non spécifié 4"];
        }
        
        // S'assurer qu'on a exactement 4 bénéfices
        while (benefits.length < 4) {
            benefits.push(`Bénéfice non spécifié ${benefits.length + 1}`);
        }
        
        // Ne garder que les 4 premiers bénéfices
        benefits = benefits.slice(0, 4);
        console.log('[Template] Bénéfices finaux extraits:', benefits);
        
        // Assigner les benefits extraits à selectedCompetitiveAdvantages pour la logique de remplacement
        let selectedCompetitiveAdvantages = benefits.map((benefit, index) => {
            try {
                // Vérifier que benefit existe et n'est pas null/undefined
                if (!benefit) {
                    console.warn(`[Template] Bénéfice ${index + 1} est null/undefined`);
                    return `Bénéfice non spécifié ${index + 1}`;
                }
                
                // Si c'est un objet avec une propriété text, l'extraire
                if (typeof benefit === 'object' && benefit.text) {
                    return benefit.text;
                }
                
                // Si c'est un objet avec une propriété title, l'extraire
                if (typeof benefit === 'object' && benefit.title) {
                    return benefit.title;
                }
                
                // Si c'est un objet avec une propriété description, l'extraire
                if (typeof benefit === 'object' && benefit.description) {
                    return benefit.description;
                }
                
                // Si c'est déjà une chaîne, la retourner
                if (typeof benefit === 'string') {
                    return benefit;
                }
                
                // Sinon, essayer de convertir en chaîne
                return String(benefit);
            } catch (error) {
                console.error(`[Template] Erreur lors de l'extraction du bénéfice ${index + 1}:`, error);
                return `Bénéfice non spécifié ${index + 1}`;
            }
        });
        
        // S'assurer qu'on a exactement 4 bénéfices pour le template
        while (selectedCompetitiveAdvantages.length < 4) {
            selectedCompetitiveAdvantages.push(`Bénéfice non spécifié ${selectedCompetitiveAdvantages.length + 1}`);
        }
        selectedCompetitiveAdvantages = selectedCompetitiveAdvantages.slice(0, 4);
        
        console.log('[Template] selectedCompetitiveAdvantages finaux pour remplacement:', selectedCompetitiveAdvantages);
        
        // Récupérer le texte de "Comment ça marche"
        let howItWorksText = "";
        if (generatedContent && generatedContent.howItWorks) {
            // Récupérer la version sélectionnée (version1 ou version2)
            const selectedVersion = window.selectedVersion && window.selectedVersion.howItWorks ? window.selectedVersion.howItWorks : 1;
            // Utiliser la version sélectionnée (1 ou 2)
            howItWorksText = selectedVersion === 2 ? generatedContent.howItWorks.version2 : generatedContent.howItWorks.version1;
            console.log(`Texte "Comment ça marche" version ${selectedVersion} extrait:`, howItWorksText);
        }
        
        // Récupérer les bénéfices émotionnels sélectionnés
        let selectedEmotionalBenefits = [];
        if (window.selectedEmotionalBenefits && window.selectedEmotionalBenefits.length === 2) {
            // Utiliser les bénéfices émotionnels sélectionnés et nettoyer les titres et textes
            selectedEmotionalBenefits = window.selectedEmotionalBenefits.map(benefit => ({
                headline: benefit.headline.replace(/\*\*/g, ''),
                text: benefit.text.replace(/\*\*/g, '')
            }));
            console.log('Bénéfices émotionnels sélectionnés et nettoyés:', selectedEmotionalBenefits);
        } else if (generatedContent && generatedContent.emotionalBenefits && generatedContent.emotionalBenefits.version1) {
            // Si aucun bénéfice émotionnel n'a été sélectionné, utiliser les 2 premiers de la version 1
            selectedEmotionalBenefits = generatedContent.emotionalBenefits.version1.slice(0, 2).map(benefit => ({
                headline: benefit.headline.replace(/\*\*/g, ''),
                text: benefit.text.replace(/\*\*/g, '')
            }));
            console.log('Utilisation des 2 premiers bénéfices émotionnels par défaut (nettoyés):', selectedEmotionalBenefits);
        }
        
        // Récupérer les cas d'utilisation sélectionnés
        let selectedUseCases = [];
        if (window.selectedUseCases && window.selectedUseCases.length === 3) {
            // Utiliser les cas d'utilisation sélectionnés et nettoyer les titres et explications
            selectedUseCases = window.selectedUseCases.map(useCase => ({
                title: useCase.title.replace(/\*\*/g, ''),
                explanation: useCase.explanation.replace(/\*\*/g, '')
            }));
            console.log('Cas d\'utilisation sélectionnés et nettoyés:', selectedUseCases);
        } else if (generatedContent && generatedContent.useCases && generatedContent.useCases.version1) {
            // Si aucun cas d'utilisation n'a été sélectionné, utiliser les 3 premiers de la version 1
            selectedUseCases = generatedContent.useCases.version1.slice(0, 3).map(useCase => ({
                title: useCase.title.replace(/\*\*/g, ''),
                explanation: useCase.explanation.replace(/\*\*/g, '')
            }));
            console.log('Utilisation des 3 premiers cas d\'utilisation par défaut (nettoyés):', selectedUseCases);
        }
        
        // Récupérer les caractéristiques sélectionnées
        let selectedCharacteristics = [];
        if (window.selectedCharacteristics && window.selectedCharacteristics.length === 4) {
            // Utiliser les caractéristiques sélectionnées et nettoyer les titres et explications
            selectedCharacteristics = window.selectedCharacteristics.map(characteristic => ({
                title: characteristic.title.replace(/\*\*/g, ''),
                explanation: characteristic.explanation.replace(/\*\*/g, '')
            }));
            console.log('Caractéristiques sélectionnées et nettoyées:', selectedCharacteristics);
        } else if (generatedContent && generatedContent.characteristics && generatedContent.characteristics.version1) {
            // Si aucune caractéristique n'a été sélectionnée, utiliser les 4 premières de la version 1
            selectedCharacteristics = generatedContent.characteristics.version1.slice(0, 4).map(characteristic => ({
                title: characteristic.title.replace(/\*\*/g, ''),
                explanation: characteristic.explanation.replace(/\*\*/g, '')
            }));
            console.log('Utilisation des 4 premières caractéristiques par défaut (nettoyées):', selectedCharacteristics);
        }
        
        // Récupérer les avantages concurrentiels sélectionnés
        console.log('[Template] Utilisation des avantages concurrentiels:', selectedCompetitiveAdvantages);
        
        // Récupérer le titre de produit sélectionné
        let selectedProductTitle = '';
        if (window.selectedProductTitle && window.productTitleValidated) {
            // Utiliser le titre sélectionné par l'utilisateur
            selectedProductTitle = window.selectedProductTitle.replace(/\*\*/g, '');
            console.log('Titre de produit sélectionné:', selectedProductTitle);
        } else if (generatedContent && generatedContent.productTitle && generatedContent.productTitle.version1) {
            // Si aucun titre n'a été sélectionné, utiliser le premier titre généré
            if (Array.isArray(generatedContent.productTitle.version1)) {
                console.log('[TEMPLATE-DEBUG] productTitle.version1 est un array');
                console.log('[TEMPLATE-DEBUG] Premier élément:', generatedContent.productTitle.version1[0]);
                console.log('[TEMPLATE-DEBUG] Type du premier élément:', typeof generatedContent.productTitle.version1[0]);
                
                // Vérifier si le premier élément est une string
                if (typeof generatedContent.productTitle.version1[0] === 'string') {
                    selectedProductTitle = generatedContent.productTitle.version1[0].replace(/\*\*/g, '');
                } else {
                    console.error('[TEMPLATE-ERROR] Le premier élément n\'est pas une string:', generatedContent.productTitle.version1[0]);
                    // Essayer de convertir en string
                    selectedProductTitle = String(generatedContent.productTitle.version1[0]).replace(/\*\*/g, '');
                }
            } else {
                console.log('[TEMPLATE-DEBUG] productTitle.version1 n\'est pas un array');
                console.log('[TEMPLATE-DEBUG] Type:', typeof generatedContent.productTitle.version1);
                console.log('[TEMPLATE-DEBUG] Valeur:', generatedContent.productTitle.version1);
                
                if (typeof generatedContent.productTitle.version1 === 'string') {
                    selectedProductTitle = generatedContent.productTitle.version1.replace(/\*\*/g, '');
                } else {
                    selectedProductTitle = String(generatedContent.productTitle.version1).replace(/\*\*/g, '');
                }
            }
            console.log('Utilisation du premier titre de produit par défaut:', selectedProductTitle);
        }
        
        // Récupérer les avis clients sélectionnés
        let selectedCustomerReviews = [];
        try {
            if (window.selectedCustomerReviews && window.selectedCustomerReviews.length === 6) {
                // Utiliser les avis clients sélectionnés
                selectedCustomerReviews = window.selectedCustomerReviews.map((review, index) => {
                    try {
                        // Vérifier que review existe et n'est pas null/undefined
                        if (!review) {
                            console.warn(`[Generate Template] Avis client ${index + 1} est null/undefined`);
                            return {
                                title: `Avis client ${index + 1}`,
                                description: 'Description non disponible',
                                author: 'Client anonyme'
                            };
                        }
                        
                        // Extraire et valider chaque propriété
                        const title = (review.title && typeof review.title === 'string') ? review.title.replace(/\*\*/g, '') : `Avis client ${index + 1}`;
                        const description = (review.description && typeof review.description === 'string') ? review.description.replace(/\*\*/g, '') : 'Description non disponible';
                        const author = (review.author && typeof review.author === 'string') ? review.author.replace(/\*\*/g, '') : 'Client anonyme';
                        
                        return { title, description, author };
                    } catch (err) {
                        console.warn(`[Generate Template] Erreur lors de l'extraction de l'avis client ${index + 1}:`, err);
                        return {
                            title: `Avis client ${index + 1}`,
                            description: 'Description non disponible',
                            author: 'Client anonyme'
                        };
                    }
                });
                console.log('[Generate Template] Avis clients sélectionnés:', selectedCustomerReviews);
            } else if (generatedContent && generatedContent.customerReviews && generatedContent.customerReviews.version1) {
                // Si aucun avis client n'a été sélectionné, utiliser les 6 premiers de la version 1
                selectedCustomerReviews = generatedContent.customerReviews.version1.slice(0, 6).map((review, index) => {
                    try {
                        // Vérifier que review existe et n'est pas null/undefined
                        if (!review) {
                            console.warn(`[Generate Template] Avis client par défaut ${index + 1} est null/undefined`);
                            return {
                                title: `Avis client ${index + 1}`,
                                description: 'Description non disponible',
                                author: 'Client anonyme'
                            };
                        }
                        
                        // Extraire et valider chaque propriété
                        const title = (review.title && typeof review.title === 'string') ? review.title.replace(/\*\*/g, '') : `Avis client ${index + 1}`;
                        const description = (review.description && typeof review.description === 'string') ? review.description.replace(/\*\*/g, '') : 'Description non disponible';
                        const author = (review.author && typeof review.author === 'string') ? review.author.replace(/\*\*/g, '') : 'Client anonyme';
                        
                        return { title, description, author };
                    } catch (err) {
                        console.warn(`[Generate Template] Erreur lors de l'extraction de l'avis client par défaut ${index + 1}:`, err);
                        return {
                            title: `Avis client ${index + 1}`,
                            description: 'Description non disponible',
                            author: 'Client anonyme'
                        };
                    }
                });
                console.log('[Generate Template] Utilisation des 6 premiers avis clients par défaut:', selectedCustomerReviews);
            }
        } catch (error) {
            console.error('[Generate Template] Erreur lors de la récupération des avis clients:', error);
            selectedCustomerReviews = [
                { title: 'Avis client 1', description: 'Description non disponible', author: 'Client anonyme' },
                { title: 'Avis client 2', description: 'Description non disponible', author: 'Client anonyme' },
                { title: 'Avis client 3', description: 'Description non disponible', author: 'Client anonyme' },
                { title: 'Avis client 4', description: 'Description non disponible', author: 'Client anonyme' },
                { title: 'Avis client 5', description: 'Description non disponible', author: 'Client anonyme' },
                { title: 'Avis client 6', description: 'Description non disponible', author: 'Client anonyme' }
            ];
        }
        
        // Récupérer les questions/réponses de la FAQ sélectionnées
        let selectedFAQs = [];
        try {
            if (window.selectedFAQs && window.selectedFAQs.length >= 1) { 
                // Utiliser les questions/réponses sélectionnées
                selectedFAQs = window.selectedFAQs.map((faq, index) => {
                    try {
                        // Vérifier que faq existe et n'est pas null/undefined
                        if (!faq) {
                            console.warn(`[Generate Template] FAQ ${index + 1} est null/undefined`);
                            return {
                                question: `Question ${index + 1}`,
                                answer: 'Réponse non disponible'
                            };
                        }
                        
                        // Extraire et valider chaque propriété
                        const question = (faq.question && typeof faq.question === 'string') ? faq.question.replace(/\*\*/g, '') : `Question ${index + 1}`;
                        const answer = (faq.answer && typeof faq.answer === 'string') ? faq.answer.replace(/\*\*/g, '') : 'Réponse non disponible';
                        
                        return { question, answer };
                    } catch (err) {
                        console.warn(`[Generate Template] Erreur lors de l'extraction de la FAQ ${index + 1}:`, err);
                        return {
                            question: `Question ${index + 1}`,
                            answer: 'Réponse non disponible'
                        };
                    }
                });
                console.log('[Generate Template] Questions/réponses FAQ sélectionnées:', selectedFAQs);
            } else if (generatedContent && generatedContent.faq && generatedContent.faq.version1) {
                // Si aucune question/réponse n'a été sélectionnée, utiliser les 4 premières de la version 1
                selectedFAQs = generatedContent.faq.version1.slice(0, 4).map((faq, index) => {
                    try {
                        // Vérifier que faq existe et n'est pas null/undefined
                        if (!faq) {
                            console.warn(`[Generate Template] FAQ par défaut ${index + 1} est null/undefined`);
                            return {
                                question: `Question ${index + 1}`,
                                answer: 'Réponse non disponible'
                            };
                        }
                        
                        // Extraire et valider chaque propriété
                        const question = (faq.question && typeof faq.question === 'string') ? faq.question.replace(/\*\*/g, '') : `Question ${index + 1}`;
                        const answer = (faq.answer && typeof faq.answer === 'string') ? faq.answer.replace(/\*\*/g, '') : 'Réponse non disponible';
                        
                        return { question, answer };
                    } catch (err) {
                        console.warn(`[Generate Template] Erreur lors de l'extraction de la FAQ par défaut ${index + 1}:`, err);
                        return {
                            question: `Question ${index + 1}`,
                            answer: 'Réponse non disponible'
                        };
                    }
                });
                console.log('[Generate Template] Utilisation des 4 premières questions/réponses FAQ par défaut:', selectedFAQs);
            } else {
                console.warn('[Generate Template] Aucune FAQ disponible, utilisation de valeurs par défaut');
                selectedFAQs = [
                    { question: 'Question 1', answer: 'Réponse non disponible' },
                    { question: 'Question 2', answer: 'Réponse non disponible' },
                    { question: 'Question 3', answer: 'Réponse non disponible' },
                    { question: 'Question 4', answer: 'Réponse non disponible' }
                ];
            }
        } catch (error) {
            console.error('[Generate Template] Erreur lors de la récupération des FAQ:', error);
            selectedFAQs = [
                { question: 'Question 1', answer: 'Réponse non disponible' },
                { question: 'Question 2', answer: 'Réponse non disponible' },
                { question: 'Question 3', answer: 'Réponse non disponible' },
                { question: 'Question 4', answer: 'Réponse non disponible' }
            ];
        }
        
        // Vérifier que le template a la structure attendue
        if (!template.sections || 
            !template.sections.main || 
            !template.sections.main.blocks) {
            throw new Error('Le template ne contient pas la structure attendue (sections.main.blocks)');
        }
        
        // Remplacer les avis clients (reviews) dans le template
        console.log('Avis clients sélectionnés pour remplacement dans le template:', selectedCustomerReviews);
        
        // Vérifier qu'on a bien les avis clients
        if (selectedCustomerReviews && selectedCustomerReviews.length > 0) {
            let replacedReviews = [];
            
            // Parcourir toutes les sections
            Object.keys(template.sections).forEach(sectionKey => {
                const section = template.sections[sectionKey];
                
                // Si la section a des blocks, parcourir les blocks
                if (section.blocks) {
                    Object.keys(section.blocks).forEach(blockKey => {
                        const block = section.blocks[blockKey];
                        
                        // Vérifier dans les settings du bloc
                        if (block.settings) {
                            Object.keys(block.settings).forEach(settingKey => {
                                const setting = block.settings[settingKey];
                                if (typeof setting === 'string') {
                                    // Remplacer les titres des avis
                                    if (setting.includes('Title review 1') && selectedCustomerReviews[0]) {
                                        block.settings[settingKey] = setting.replace('Title review 1', selectedCustomerReviews[0].title);
                                        replacedReviews.push('Title review 1');
                                    }
                                    if (setting.includes('Title review 2') && selectedCustomerReviews[1]) {
                                        block.settings[settingKey] = setting.replace('Title review 2', selectedCustomerReviews[1].title);
                                        replacedReviews.push('Title review 2');
                                    }
                                    if (setting.includes('Title review 3') && selectedCustomerReviews[2]) {
                                        block.settings[settingKey] = setting.replace('Title review 3', selectedCustomerReviews[2].title);
                                        replacedReviews.push('Title review 3');
                                    }
                                    if (setting.includes('Title review 4') && selectedCustomerReviews[3]) {
                                        block.settings[settingKey] = setting.replace('Title review 4', selectedCustomerReviews[3].title);
                                        replacedReviews.push('Title review 4');
                                    }
                                    if (setting.includes('Title review 5') && selectedCustomerReviews[4]) {
                                        block.settings[settingKey] = setting.replace('Title review 5', selectedCustomerReviews[4].title);
                                        replacedReviews.push('Title review 5');
                                    }
                                    if (setting.includes('Title review 6') && selectedCustomerReviews[5]) {
                                        block.settings[settingKey] = setting.replace('Title review 6', selectedCustomerReviews[5].title);
                                        replacedReviews.push('Title review 6');
                                    }
                                    
                                    // Remplacer les descriptions des avis
                                    if (setting.includes('Review 1') && selectedCustomerReviews[0]) {
                                        block.settings[settingKey] = setting.replace('Review 1', selectedCustomerReviews[0].description);
                                        replacedReviews.push('Review 1');
                                    }
                                    if (setting.includes('Review 2') && selectedCustomerReviews[1]) {
                                        block.settings[settingKey] = setting.replace('Review 2', selectedCustomerReviews[1].description);
                                        replacedReviews.push('Review 2');
                                    }
                                    if (setting.includes('Review 3') && selectedCustomerReviews[2]) {
                                        block.settings[settingKey] = setting.replace('Review 3', selectedCustomerReviews[2].description);
                                        replacedReviews.push('Review 3');
                                    }
                                    if (setting.includes('Review 4') && selectedCustomerReviews[3]) {
                                        block.settings[settingKey] = setting.replace('Review 4', selectedCustomerReviews[3].description);
                                        replacedReviews.push('Review 4');
                                    }
                                    if (setting.includes('Review 5') && selectedCustomerReviews[4]) {
                                        block.settings[settingKey] = setting.replace('Review 5', selectedCustomerReviews[4].description);
                                        replacedReviews.push('Review 5');
                                    }
                                    if (setting.includes('Review 6') && selectedCustomerReviews[5]) {
                                        block.settings[settingKey] = setting.replace('Review 6', selectedCustomerReviews[5].description);
                                        replacedReviews.push('Review 6');
                                    }
                                    
                                    // Remplacer les noms des auteurs
                                    if (setting.includes('Laurent P.') && selectedCustomerReviews[0]) {
                                        block.settings[settingKey] = setting.replace('Laurent P.', selectedCustomerReviews[0].author);
                                        replacedReviews.push('Laurent P.');
                                    }
                                    if (setting.includes('Nathalie M.') && selectedCustomerReviews[1]) {
                                        block.settings[settingKey] = setting.replace('Nathalie M.', selectedCustomerReviews[1].author);
                                        replacedReviews.push('Nathalie M.');
                                    }
                                    if (setting.includes('Marc F.') && selectedCustomerReviews[2]) {
                                        block.settings[settingKey] = setting.replace('Marc F.', selectedCustomerReviews[2].author);
                                        replacedReviews.push('Marc F.');
                                    }
                                    if (setting.includes('Emerik') && selectedCustomerReviews[3]) {
                                        block.settings[settingKey] = setting.replace('Emerik', selectedCustomerReviews[3].author);
                                        replacedReviews.push('Emerik');
                                    }
                                    if (setting.includes('Mathias') && selectedCustomerReviews[4]) {
                                        block.settings[settingKey] = setting.replace('Mathias', selectedCustomerReviews[4].author);
                                        replacedReviews.push('Mathias');
                                    }
                                    if (setting.includes('Emmanuelle') && selectedCustomerReviews[5]) {
                                        block.settings[settingKey] = setting.replace('Emmanuelle', selectedCustomerReviews[5].author);
                                        replacedReviews.push('Emmanuelle');
                                    }
                                }
                            });
                        }
                    });
                }
            });
            
            // Afficher le résultat des remplacements
            if (replacedReviews.length > 0) {
                console.log('Avis clients remplacés avec succès:', replacedReviews.join(', '));
            } else {
                console.warn('Aucun marqueur d\'avis client n\'a été trouvé dans le template');
            }
        } else {
            console.warn('Aucun avis client sélectionné pour le remplacement');
        }
        
        // Remplacer les questions FAQ dans le template
        console.log('Questions FAQ sélectionnées pour remplacement dans le template:', selectedFAQs);
        
        // Vérifier qu'on a bien les questions FAQ
        if (selectedFAQs && selectedFAQs.length > 0) {
            let replacedFAQs = [];
            
            // Parcourir toutes les sections
            Object.keys(template.sections).forEach(sectionKey => {
                const section = template.sections[sectionKey];
                
                // Si la section a des blocks, parcourir les blocks
                if (section.blocks) {
                    Object.keys(section.blocks).forEach(blockKey => {
                        const block = section.blocks[blockKey];
                        
                        // Vérifier dans les settings du bloc
                        if (block.settings) {
                            Object.keys(block.settings).forEach(settingKey => {
                                const setting = block.settings[settingKey];
                                if (typeof setting === 'string') {
                                    // Remplacer les questions FAQ (en retirant les numéros de questions)
                                    if (setting.includes('Product question 1') && selectedFAQs[0]) {
                                        // Pattern amélioré pour retirer différents formats de numérotation
                                        let cleanQuestion = cleanFAQQuestion(selectedFAQs[0].question);
                                        console.log('Question 1 avant nettoyage:', selectedFAQs[0].question);
                                        console.log('Question 1 après nettoyage:', cleanQuestion);
                                        block.settings[settingKey] = setting.replace('Product question 1', cleanQuestion);
                                        replacedFAQs.push('Product question 1');
                                    }
                                    if (setting.includes('Product question 2') && selectedFAQs[1]) {
                                        let cleanQuestion = cleanFAQQuestion(selectedFAQs[1].question);
                                        console.log('Question 2 avant nettoyage:', selectedFAQs[1].question);
                                        console.log('Question 2 après nettoyage:', cleanQuestion);
                                        block.settings[settingKey] = setting.replace('Product question 2', cleanQuestion);
                                        replacedFAQs.push('Product question 2');
                                    }
                                    if (setting.includes('Product question 3') && selectedFAQs[2]) {
                                        let cleanQuestion = cleanFAQQuestion(selectedFAQs[2].question);
                                        console.log('Question 3 avant nettoyage:', selectedFAQs[2].question);
                                        console.log('Question 3 après nettoyage:', cleanQuestion);
                                        block.settings[settingKey] = setting.replace('Product question 3', cleanQuestion);
                                        replacedFAQs.push('Product question 3');
                                    }
                                    if (setting.includes('Product question 4') && selectedFAQs[3]) {
                                        let cleanQuestion = cleanFAQQuestion(selectedFAQs[3].question);
                                        console.log('Question 4 avant nettoyage:', selectedFAQs[3].question);
                                        console.log('Question 4 après nettoyage:', cleanQuestion);
                                        block.settings[settingKey] = setting.replace('Product question 4', cleanQuestion);
                                        replacedFAQs.push('Product question 4');
                                    }
                                    
                                    // Remplacer les réponses FAQ
                                    if (setting.includes('answer 1') && selectedFAQs[0]) {
                                        block.settings[settingKey] = setting.replace('answer 1', selectedFAQs[0].answer);
                                        replacedFAQs.push('answer 1');
                                    }
                                    if (setting.includes('answer 2') && selectedFAQs[1]) {
                                        block.settings[settingKey] = setting.replace('answer 2', selectedFAQs[1].answer);
                                        replacedFAQs.push('answer 2');
                                    }
                                    if (setting.includes('answer 3') && selectedFAQs[2]) {
                                        block.settings[settingKey] = setting.replace('answer 3', selectedFAQs[2].answer);
                                        replacedFAQs.push('answer 3');
                                    }
                                    if (setting.includes('answer 4') && selectedFAQs[3]) {
                                        block.settings[settingKey] = setting.replace('answer 4', selectedFAQs[3].answer);
                                        replacedFAQs.push('answer 4');
                                    }
                                }
                            });
                        }
                    });
                }
            });
            
            // Afficher le résultat des remplacements
            if (replacedFAQs.length > 0) {
                console.log('Questions FAQ remplacées avec succès:', replacedFAQs.join(', '));
            } else {
                console.warn('Aucun marqueur de question FAQ n\'a été trouvé dans le template');
            }
        } else {
            console.warn('Aucune question FAQ sélectionnée pour le remplacement');
        }
        
        // Remplacer les caractéristiques dans le fichier template
        console.log('Caractéristiques sélectionnées pour remplacement dans le template:', selectedCharacteristics);
        
        // Chercher et remplacer les caractéristiques dans l'ensemble du template
        let replacedCharacteristics = [false, false, false, false];
        let replacedExplanations = [false, false, false, false];
        
        // Parcourir toutes les sections
        Object.keys(template.sections).forEach(sectionKey => {
            const section = template.sections[sectionKey];
            
            // Si la section a des blocs, parcourir les blocs
            if (section.blocks) {
                Object.keys(section.blocks).forEach(blockKey => {
                    const block = section.blocks[blockKey];
                    
                    // Vérifier dans les settings du bloc
                    if (block.settings) {
                        Object.keys(block.settings).forEach(settingKey => {
                            const setting = block.settings[settingKey];
                            if (typeof setting === 'string') {
                                // Remplacer les caractéristiques
                                if (setting.includes('Caracteristic 1')) {
                                    block.settings[settingKey] = setting.replace('Caracteristic 1', selectedCharacteristics[0].title);
                                    replacedCharacteristics[0] = true;
                                }
                                if (setting.includes('Caracteristic 2')) {
                                    block.settings[settingKey] = setting.replace('Caracteristic 2', selectedCharacteristics[1].title);
                                    replacedCharacteristics[1] = true;
                                }
                                if (setting.includes('Caracteristic 3')) {
                                    block.settings[settingKey] = setting.replace('Caracteristic 3', selectedCharacteristics[2].title);
                                    replacedCharacteristics[2] = true;
                                }
                                if (setting.includes('Caracteristic 4')) {
                                    block.settings[settingKey] = setting.replace('Caracteristic 4', selectedCharacteristics[3].title);
                                    replacedCharacteristics[3] = true;
                                }
                                
                                // Remplacer les explications
                                if (setting.includes('1/2 lines explaining.1')) {
                                    block.settings[settingKey] = setting.replace('1/2 lines explaining.1', selectedCharacteristics[0].explanation);
                                    replacedExplanations[0] = true;
                                }
                                if (setting.includes('1/2 lines explaining.2')) {
                                    block.settings[settingKey] = setting.replace('1/2 lines explaining.2', selectedCharacteristics[1].explanation);
                                    replacedExplanations[1] = true;
                                }
                                if (setting.includes('1/2 lines explaining.3')) {
                                    block.settings[settingKey] = setting.replace('1/2 lines explaining.3', selectedCharacteristics[2].explanation);
                                    replacedExplanations[2] = true;
                                }
                                if (setting.includes('1/2 lines explaining.4')) {
                                    block.settings[settingKey] = setting.replace('1/2 lines explaining.4', selectedCharacteristics[3].explanation);
                                    replacedExplanations[3] = true;
                                }
                            }
                        });
                    }
                });
            }
        });
        
        // Afficher le résultat des remplacements
        for (let i = 0; i < 4; i++) {
            if (replacedCharacteristics[i]) {
                console.log(`Titre de la caractéristique ${i+1} inséré avec succès`);
            } else {
                console.warn(`Le marqueur 'Caracteristic ${i+1}' n'a pas été trouvé dans le template`);
            }
            
            if (replacedExplanations[i]) {
                console.log(`Explication de la caractéristique ${i+1} insérée avec succès`);
            } else {
                console.warn(`Le marqueur '1/2 lines explaining.${i+1}' n'a pas été trouvé dans le template`);
            }
        }
        
        // Remplacer les 4 bénéfices dans le template
        // 1. Vérifier et remplacer les premier et deuxième bénéfices
        if (!template.sections.main.blocks.text_QVXkUD || 
            !template.sections.main.blocks.text_QVXkUD.settings) {
            console.warn('[Generate Template] Le bloc text_QVXkUD est manquant dans le template');
        } else {
            // Retirer les points à la fin de chaque avantage avec protection de type
            const benefit1 = (typeof selectedCompetitiveAdvantages[0] === 'string') ? selectedCompetitiveAdvantages[0] : String(selectedCompetitiveAdvantages[0] || 'Bénéfice 1');
            const benefit2 = (typeof selectedCompetitiveAdvantages[1] === 'string') ? selectedCompetitiveAdvantages[1] : String(selectedCompetitiveAdvantages[1] || 'Bénéfice 2');
            
            template.sections.main.blocks.text_QVXkUD.settings.text_1 = benefit1.endsWith('.') ? benefit1.slice(0, -1) : benefit1;
            template.sections.main.blocks.text_QVXkUD.settings.text_2 = benefit2.endsWith('.') ? benefit2.slice(0, -1) : benefit2;
            console.log('[Generate Template] Bénéfices 1 et 2 mis à jour avec succès');
        }
        
        // 2. Vérifier et remplacer les troisième et quatrième bénéfices
        if (!template.sections.main.blocks.text_YnDFC7 || 
            !template.sections.main.blocks.text_YnDFC7.settings) {
            console.warn('[Generate Template] Le bloc text_YnDFC7 est manquant dans le template');
        } else {
            // Log spécial pour le bloc text_YnDFC7
            console.log(`[DEBUG] Bloc text_YnDFC7 trouvé! Settings:`, template.sections.main.blocks.text_YnDFC7.settings);
            if (template.sections.main.blocks.text_YnDFC7.settings && template.sections.main.blocks.text_YnDFC7.settings.text_2) {
                console.log(`[DEBUG] text_2 dans text_YnDFC7:`, template.sections.main.blocks.text_YnDFC7.settings.text_2);
            }
            
            // Logs détaillés pour le debugging
            console.log('[DEBUG] selectedCompetitiveAdvantages avant assignation:', selectedCompetitiveAdvantages);
            console.log('[DEBUG] Type de selectedCompetitiveAdvantages[2]:', typeof selectedCompetitiveAdvantages[2]);
            console.log('[DEBUG] Type de selectedCompetitiveAdvantages[3]:', typeof selectedCompetitiveAdvantages[3]);
            console.log('[DEBUG] Valeur de selectedCompetitiveAdvantages[2]:', selectedCompetitiveAdvantages[2]);
            console.log('[DEBUG] Valeur de selectedCompetitiveAdvantages[3]:', selectedCompetitiveAdvantages[3]);
            
            // Retirer les points à la fin de chaque avantage avec protection de type
            const benefit3 = (typeof selectedCompetitiveAdvantages[2] === 'string') ? selectedCompetitiveAdvantages[2] : String(selectedCompetitiveAdvantages[2] || 'Bénéfice 3');
            const benefit4 = (typeof selectedCompetitiveAdvantages[3] === 'string') ? selectedCompetitiveAdvantages[3] : String(selectedCompetitiveAdvantages[3] || 'Bénéfice 4');
            
            console.log('[DEBUG] benefit3 après traitement:', benefit3);
            console.log('[DEBUG] benefit4 après traitement:', benefit4);
            
            template.sections.main.blocks.text_YnDFC7.settings.text_1 = benefit3.endsWith('.') ? benefit3.slice(0, -1) : benefit3;
            template.sections.main.blocks.text_YnDFC7.settings.text_2 = benefit4.endsWith('.') ? benefit4.slice(0, -1) : benefit4;
            
            console.log('[DEBUG] text_1 après assignation:', template.sections.main.blocks.text_YnDFC7.settings.text_1);
            console.log('[DEBUG] text_2 après assignation:', template.sections.main.blocks.text_YnDFC7.settings.text_2);
            
            console.log('[Generate Template] Bénéfices 3 et 4 mis à jour avec succès');
        }
        
        // Trouver et remplacer "Content product 1" par le texte "Comment ça marche"
        // Chercher dans toutes les sections et blocs du template
        if (howItWorksText) {
            let replaced = false;
            
            // Parcourir toutes les sections
            Object.keys(template.sections).forEach(sectionKey => {
                const section = template.sections[sectionKey];
                
                // Si la section a des blocs, parcourir les blocs
                if (section.blocks) {
                    Object.keys(section.blocks).forEach(blockKey => {
                        const block = section.blocks[blockKey];
                        
                        // Vérifier si le bloc a une propriété "content" contenant "Content product 1"
                        if (block.content && typeof block.content === 'string' && 
                            block.content.includes('Content product 1')) {
                            // Remplacer "Content product 1" par le texte de "Comment ça marche"
                            block.content = `<p>${howItWorksText}</p>`;
                            replaced = true;
                            console.log('Texte "Comment ça marche" inséré dans le template avec succès');
                        }
                        
                        // Vérifier également dans les settings du bloc
                        if (block.settings) {
                            Object.keys(block.settings).forEach(settingKey => {
                                const setting = block.settings[settingKey];
                                if (typeof setting === 'string') {
                                    // Remplacer les marqueurs des titres
                                    if (setting.includes('Content product 1')) {
                                        block.settings[settingKey] = setting.replace('Content product 1', `<p>${howItWorksText}</p>`);
                                        replaced = true;
                                        console.log('Texte "Comment ça marche" inséré dans les settings du bloc avec succès');
                                    }
                                }
                            });
                        }
                    });
                }
            });
            
            if (!replaced) {
                console.warn('Aucune section contenant "Content product 1" n\'a été trouvée dans le template');
            }
        }
        
        // Remplacer les marqueurs des bénéfices émotionnels dans le template
        if (selectedEmotionalBenefits && selectedEmotionalBenefits.length === 2) {
            let replacedHeadline1 = false;
            let replacedHeadline2 = false;
            let replacedDescription1 = false;
            let replacedDescription2 = false;
            
            // Extraire les titres et descriptions des bénéfices émotionnels sélectionnés
            const emotionalHeadline1 = selectedEmotionalBenefits[0].headline;
            const emotionalDescription1 = selectedEmotionalBenefits[0].text;
            const emotionalHeadline2 = selectedEmotionalBenefits[1].headline;
            const emotionalDescription2 = selectedEmotionalBenefits[1].text;
            
            console.log('Bénéfices émotionnels à insérer dans le template:');
            console.log(`1. Titre: ${emotionalHeadline1}`);
            console.log(`   Description: ${emotionalDescription1}`);
            console.log(`2. Titre: ${emotionalHeadline2}`);
            console.log(`   Description: ${emotionalDescription2}`);
            
            // Parcourir toutes les sections
            Object.keys(template.sections).forEach(sectionKey => {
                const section = template.sections[sectionKey];
                
                // Si la section a des blocs, parcourir les blocs
                if (section.blocks) {
                    Object.keys(section.blocks).forEach(blockKey => {
                        const block = section.blocks[blockKey];
                        
                        // Remplacer dans le contenu du bloc
                        if (block.content && typeof block.content === 'string') {
                            // Remplacer les marqueurs des titres
                            if (block.content.includes('[EMOTIONAL_HEADLINE1]')) {
                                console.log('Remplacement de [EMOTIONAL_HEADLINE1] par:', emotionalHeadline1);
                                block.content = block.content.replace('[EMOTIONAL_HEADLINE1]', emotionalHeadline1);
                                replacedHeadline1 = true;
                            }
                            if (block.content.includes('[EMOTIONAL_HEADLINE2]')) {
                                console.log('Remplacement de [EMOTIONAL_HEADLINE2] par:', emotionalHeadline2);
                                block.content = block.content.replace('[EMOTIONAL_HEADLINE2]', emotionalHeadline2);
                                replacedHeadline2 = true;
                            }
                            
                            // Remplacer les marqueurs des descriptions
                            if (block.content.includes('[EMOTIONAL_DESCRIPTION1]')) {
                                console.log('Remplacement de [EMOTIONAL_DESCRIPTION1] par:', emotionalDescription1);
                                block.content = block.content.replace('[EMOTIONAL_DESCRIPTION1]', emotionalDescription1);
                                replacedDescription1 = true;
                            }
                            if (block.content.includes('[EMOTIONAL_DESCRIPTION2]')) {
                                console.log('Remplacement de [EMOTIONAL_DESCRIPTION2] par:', emotionalDescription2);
                                block.content = block.content.replace('[EMOTIONAL_DESCRIPTION2]', emotionalDescription2);
                                replacedDescription2 = true;
                            }
                        }
                        
                        // Vérifier également dans les settings du bloc
                        if (block.settings) {
                            Object.keys(block.settings).forEach(settingKey => {
                                const setting = block.settings[settingKey];
                                if (typeof setting === 'string') {
                                    // Remplacer les marqueurs des titres
                                    if (setting.includes('[EMOTIONAL_HEADLINE1]')) {
                                        console.log('Remplacement de [EMOTIONAL_HEADLINE1] par:', emotionalHeadline1);
                                        block.settings[settingKey] = setting.replace('[EMOTIONAL_HEADLINE1]', emotionalHeadline1);
                                        replacedHeadline1 = true;
                                    }
                                    if (setting.includes('[EMOTIONAL_HEADLINE2]')) {
                                        console.log('Remplacement de [EMOTIONAL_HEADLINE2] par:', emotionalHeadline2);
                                        block.settings[settingKey] = setting.replace('[EMOTIONAL_HEADLINE2]', emotionalHeadline2);
                                        replacedHeadline2 = true;
                                    }
                                    
                                    // Remplacer les marqueurs des descriptions
                                    if (setting.includes('[EMOTIONAL_DESCRIPTION1]')) {
                                        console.log('Remplacement de [EMOTIONAL_DESCRIPTION1] par:', emotionalDescription1);
                                        block.settings[settingKey] = setting.replace('[EMOTIONAL_DESCRIPTION1]', emotionalDescription1);
                                        replacedDescription1 = true;
                                    }
                                    if (setting.includes('[EMOTIONAL_DESCRIPTION2]')) {
                                        console.log('Remplacement de [EMOTIONAL_DESCRIPTION2] par:', emotionalDescription2);
                                        block.settings[settingKey] = setting.replace('[EMOTIONAL_DESCRIPTION2]', emotionalDescription2);
                                        replacedDescription2 = true;
                                    }
                                }
                            });
                        }
                    });
                }
            });
            
            // Afficher le résultat des remplacements
            if (replacedHeadline1) {
                console.log('Titre du premier bénéfice émotionnel inséré avec succès');
            } else {
                console.warn('Le marqueur [EMOTIONAL_HEADLINE1] n\'a pas été trouvé dans le template');
            }
            
            if (replacedHeadline2) {
                console.log('Titre du second bénéfice émotionnel inséré avec succès');
            } else {
                console.warn('Le marqueur [EMOTIONAL_HEADLINE2] n\'a pas été trouvé dans le template');
            }
            
            if (replacedDescription1) {
                console.log('Description du premier bénéfice émotionnel insérée avec succès');
            } else {
                console.warn('Le marqueur [EMOTIONAL_DESCRIPTION1] n\'a pas été trouvé dans le template');
            }
            
            if (replacedDescription2) {
                console.log('Description du second bénéfice émotionnel insérée avec succès');
            } else {
                console.warn('Le marqueur [EMOTIONAL_DESCRIPTION2] n\'a pas été trouvé dans le template');
            }
        }
        
        // Remplacer les marqueurs des cas d'utilisation dans le template
        if (selectedUseCases && selectedUseCases.length === 3) {
            let replacedUseCaseTitle1 = false;
            let replacedUseCaseTitle2 = false;
            let replacedUseCaseTitle3 = false;
            let replacedUseCaseDesc1 = false;
            let replacedUseCaseDesc2 = false;
            let replacedUseCaseDesc3 = false;
            
            // Extraire les titres et descriptions des cas d'utilisation sélectionnés
            const useCaseTitle1 = selectedUseCases[0].title;
            const useCaseDesc1 = selectedUseCases[0].explanation;
            const useCaseTitle2 = selectedUseCases[1].title;
            const useCaseDesc2 = selectedUseCases[1].explanation;
            const useCaseTitle3 = selectedUseCases[2].title;
            const useCaseDesc3 = selectedUseCases[2].explanation;
            
            console.log('Cas d\'utilisation à insérer dans le template:');
            console.log(`1. Titre: ${useCaseTitle1}`);
            console.log(`   Description: ${useCaseDesc1}`);
            console.log(`2. Titre: ${useCaseTitle2}`);
            console.log(`   Description: ${useCaseDesc2}`);
            console.log(`3. Titre: ${useCaseTitle3}`);
            console.log(`   Description: ${useCaseDesc3}`);
            
            // Parcourir toutes les sections du template
            Object.keys(template.sections).forEach(sectionKey => {
                console.log(`[Template] Parcours de la section: ${sectionKey}`);
                const section = template.sections[sectionKey];
                
                // Si la section a des blocs, parcourir les blocs
                if (section.blocks) {
                    Object.keys(section.blocks).forEach(blockKey => {
                        console.log(`[Template] Parcours du bloc: ${blockKey}`);
                        const block = section.blocks[blockKey];
                        
                        // Remplacer dans le contenu du bloc
                        if (block.content && typeof block.content === 'string') {
                            // Remplacer les marqueurs des titres
                            if (block.content.includes('Problem Solving 1')) {
                                console.log('Remplacement de Problem Solving 1 par:', useCaseTitle1);
                                block.content = block.content.replace('Problem Solving 1', useCaseTitle1);
                                replacedUseCaseTitle1 = true;
                            }
                            if (block.content.includes('Problem Solving 2')) {
                                console.log('Remplacement de Problem Solving 2 par:', useCaseTitle2);
                                block.content = block.content.replace('Problem Solving 2', useCaseTitle2);
                                replacedUseCaseTitle2 = true;
                            }
                            if (block.content.includes('Problem Solving 3')) {
                                console.log('Remplacement de Problem Solving 3 par:', useCaseTitle3);
                                block.content = block.content.replace('Problem Solving 3', useCaseTitle3);
                                replacedUseCaseTitle3 = true;
                            }
                            
                            // Remplacer les marqueurs des descriptions
                            if (block.content.includes('Pair text with an image/video 1')) {
                                console.log('Remplacement de Pair text with an image/video 1 par:', useCaseDesc1);
                                block.content = block.content.replace('Pair text with an image/video 1', useCaseDesc1);
                                replacedUseCaseDesc1 = true;
                            }
                            if (block.content.includes('Pair text with an image/video 2')) {
                                console.log('Remplacement de Pair text with an image/video 2 par:', useCaseDesc2);
                                block.content = block.content.replace('Pair text with an image/video 2', useCaseDesc2);
                                replacedUseCaseDesc2 = true;
                            }
                            if (block.content.includes('Pair text with an image/video 3')) {
                                console.log('Remplacement de Pair text with an image/video 3 par:', useCaseDesc3);
                                block.content = block.content.replace('Pair text with an image/video 3', useCaseDesc3);
                                replacedUseCaseDesc3 = true;
                            }
                        }
                        
                        // Vérifier également dans les settings du bloc
                        if (block.settings) {
                            Object.keys(block.settings).forEach(settingKey => {
                                const setting = block.settings[settingKey];
                                if (typeof setting === 'string') {
                                    // Remplacer les marqueurs des titres
                                    if (setting.includes('Problem Solving 1')) {
                                        console.log('Remplacement de Problem Solving 1 par:', useCaseTitle1);
                                        block.settings[settingKey] = setting.replace('Problem Solving 1', useCaseTitle1);
                                        replacedUseCaseTitle1 = true;
                                    }
                                    if (setting.includes('Problem Solving 2')) {
                                        console.log('Remplacement de Problem Solving 2 par:', useCaseTitle2);
                                        block.settings[settingKey] = setting.replace('Problem Solving 2', useCaseTitle2);
                                        replacedUseCaseTitle2 = true;
                                    }
                                    if (setting.includes('Problem Solving 3')) {
                                        console.log('Remplacement de Problem Solving 3 par:', useCaseTitle3);
                                        block.settings[settingKey] = setting.replace('Problem Solving 3', useCaseTitle3);
                                        replacedUseCaseTitle3 = true;
                                    }
                                    
                                    // Remplacer les marqueurs des descriptions
                                    if (setting.includes('Pair text with an image/video 1')) {
                                        console.log('Remplacement de Pair text with an image/video 1 par:', useCaseDesc1);
                                        block.settings[settingKey] = setting.replace('Pair text with an image/video 1', useCaseDesc1);
                                        replacedUseCaseDesc1 = true;
                                    }
                                    if (setting.includes('Pair text with an image/video 2')) {
                                        console.log('Remplacement de Pair text with an image/video 2 par:', useCaseDesc2);
                                        block.settings[settingKey] = setting.replace('Pair text with an image/video 2', useCaseDesc2);
                                        replacedUseCaseDesc2 = true;
                                    }
                                    if (setting.includes('Pair text with an image/video 3')) {
                                        console.log('Remplacement de Pair text with an image/video 3 par:', useCaseDesc3);
                                        block.settings[settingKey] = setting.replace('Pair text with an image/video 3', useCaseDesc3);
                                        replacedUseCaseDesc3 = true;
                                    }
                                }
                            });
                        }
                    });
                }
            });
            
            // Afficher le résultat des remplacements
            if (replacedUseCaseTitle1) {
                console.log('Titre du premier cas d\'utilisation inséré avec succès');
            } else {
                console.warn('Le marqueur "Problem Solving 1" n\'a pas été trouvé dans le template');
            }
            
            if (replacedUseCaseTitle2) {
                console.log('Titre du deuxième cas d\'utilisation inséré avec succès');
            } else {
                console.warn('Le marqueur "Problem Solving 2" n\'a pas été trouvé dans le template');
            }
            
            if (replacedUseCaseTitle3) {
                console.log('Titre du troisième cas d\'utilisation inséré avec succès');
            } else {
                console.warn('Le marqueur "Problem Solving 3" n\'a pas été trouvé dans le template');
            }
            
            if (replacedUseCaseDesc1) {
                console.log('Description du premier cas d\'utilisation insérée avec succès');
            } else {
                console.warn('Le marqueur "Pair text with an image/video 1" n\'a pas été trouvé dans le template');
            }
            
            if (replacedUseCaseDesc2) {
                console.log('Description du deuxième cas d\'utilisation insérée avec succès');
            } else {
                console.warn('Le marqueur "Pair text with an image/video 2" n\'a pas été trouvé dans le template');
            }
            
            if (replacedUseCaseDesc3) {
                console.log('Description du troisième cas d\'utilisation insérée avec succès');
            } else {
                console.warn('Le marqueur "Pair text with an image/video 3" n\'a pas été trouvé dans le template');
            }
        }
        
        // Remplacer les caractéristiques sélectionnées dans le template
        if (selectedCharacteristics && selectedCharacteristics.length === 4) {
            // Variables pour suivre si chaque caractéristique a été remplacée
            let replacedCharTitle1 = false;
            let replacedCharDesc1 = false;
            let replacedCharTitle2 = false;
            let replacedCharDesc2 = false;
            let replacedCharTitle3 = false;
            let replacedCharDesc3 = false;
            let replacedCharTitle4 = false;
            let replacedCharDesc4 = false;
            
            // Extraire les titres et descriptions des caractéristiques sélectionnées
            const charTitle1 = selectedCharacteristics[0].title;
            const charDesc1 = selectedCharacteristics[0].explanation;
            const charTitle2 = selectedCharacteristics[1].title;
            const charDesc2 = selectedCharacteristics[1].explanation;
            const charTitle3 = selectedCharacteristics[2].title;
            const charDesc3 = selectedCharacteristics[2].explanation;
            const charTitle4 = selectedCharacteristics[3].title;
            const charDesc4 = selectedCharacteristics[3].explanation;
            
            console.log('Caractéristiques à insérer dans le template:');
            console.log(`1. Titre: ${charTitle1}`);
            console.log(`   Description: ${charDesc1}`);
            console.log(`2. Titre: ${charTitle2}`);
            console.log(`   Description: ${charDesc2}`);
            console.log(`3. Titre: ${charTitle3}`);
            console.log(`   Description: ${charDesc3}`);
            console.log(`4. Titre: ${charTitle4}`);
            console.log(`   Description: ${charDesc4}`);
            
            // Parcourir toutes les sections
            Object.keys(template.sections).forEach(sectionKey => {
                console.log(`[Template] Parcours de la section: ${sectionKey}`);
                const section = template.sections[sectionKey];
                
                // Si la section a des blocs, parcourir les blocs
                if (section.blocks) {
                    Object.keys(section.blocks).forEach(blockKey => {
                        console.log(`[Template] Parcours du bloc: ${blockKey}`);
                        const block = section.blocks[blockKey];
                        
                        // Remplacer dans le contenu du bloc
                        if (block.content && typeof block.content === 'string') {
                            // Remplacer les marqueurs des titres des caractéristiques
                            if (block.content.includes('Feature Title 1')) {
                                console.log('Remplacement de Feature Title 1 par:', charTitle1);
                                block.content = block.content.replace('Feature Title 1', charTitle1);
                                replacedCharTitle1 = true;
                            }
                            if (block.content.includes('Feature Title 2')) {
                                console.log('Remplacement de Feature Title 2 par:', charTitle2);
                                block.content = block.content.replace('Feature Title 2', charTitle2);
                                replacedCharTitle2 = true;
                            }
                            if (block.content.includes('Feature Title 3')) {
                                console.log('Remplacement de Feature Title 3 par:', charTitle3);
                                block.content = block.content.replace('Feature Title 3', charTitle3);
                                replacedCharTitle3 = true;
                            }
                            if (block.content.includes('Feature Title 4')) {
                                console.log('Remplacement de Feature Title 4 par:', charTitle4);
                                block.content = block.content.replace('Feature Title 4', charTitle4);
                                replacedCharTitle4 = true;
                            }
                            
                            // Remplacer les marqueurs des descriptions des caractéristiques
                            if (block.content.includes('Feature Description 1')) {
                                console.log('Remplacement de Feature Description 1 par:', charDesc1);
                                block.content = block.content.replace('Feature Description 1', charDesc1);
                                replacedCharDesc1 = true;
                            }
                            if (block.content.includes('Feature Description 2')) {
                                console.log('Remplacement de Feature Description 2 par:', charDesc2);
                                block.content = block.content.replace('Feature Description 2', charDesc2);
                                replacedCharDesc2 = true;
                            }
                            if (block.content.includes('Feature Description 3')) {
                                console.log('Remplacement de Feature Description 3 par:', charDesc3);
                                block.content = block.content.replace('Feature Description 3', charDesc3);
                                replacedCharDesc3 = true;
                            }
                            if (block.content.includes('Feature Description 4')) {
                                console.log('Remplacement de Feature Description 4 par:', charDesc4);
                                block.content = block.content.replace('Feature Description 4', charDesc4);
                                replacedCharDesc4 = true;
                            }
                        }
                        
                        // Remplacer dans les settings si présents
                        if (block.settings) {
                            Object.keys(block.settings).forEach(settingKey => {
                                const setting = block.settings[settingKey];
                                if (typeof setting === 'string') {
                                    // Vérifier et remplacer les titres des caractéristiques
                                    if (setting.includes('Feature Title 1')) {
                                        console.log('Remplacement de Feature Title 1 par:', charTitle1);
                                        block.settings[settingKey] = setting.replace('Feature Title 1', charTitle1);
                                        replacedCharTitle1 = true;
                                    }
                                    if (setting.includes('Feature Title 2')) {
                                        console.log('Remplacement de Feature Title 2 par:', charTitle2);
                                        block.settings[settingKey] = setting.replace('Feature Title 2', charTitle2);
                                        replacedCharTitle2 = true;
                                    }
                                    if (setting.includes('Feature Title 3')) {
                                        console.log('Remplacement de Feature Title 3 par:', charTitle3);
                                        block.settings[settingKey] = setting.replace('Feature Title 3', charTitle3);
                                        replacedCharTitle3 = true;
                                    }
                                    if (setting.includes('Feature Title 4')) {
                                        console.log('Remplacement de Feature Title 4 par:', charTitle4);
                                        block.settings[settingKey] = setting.replace('Feature Title 4', charTitle4);
                                        replacedCharTitle4 = true;
                                    }
                                    
                                    // Vérifier et remplacer les descriptions des caractéristiques
                                    if (setting.includes('Feature Description 1')) {
                                        console.log('Remplacement de Feature Description 1 par:', charDesc1);
                                        block.settings[settingKey] = setting.replace('Feature Description 1', charDesc1);
                                        replacedCharDesc1 = true;
                                    }
                                    if (setting.includes('Feature Description 2')) {
                                        console.log('Remplacement de Feature Description 2 par:', charDesc2);
                                        block.settings[settingKey] = setting.replace('Feature Description 2', charDesc2);
                                        replacedCharDesc2 = true;
                                    }
                                    if (setting.includes('Feature Description 3')) {
                                        console.log('Remplacement de Feature Description 3 par:', charDesc3);
                                        block.settings[settingKey] = setting.replace('Feature Description 3', charDesc3);
                                        replacedCharDesc3 = true;
                                    }
                                    if (setting.includes('Feature Description 4')) {
                                        console.log('Remplacement de Feature Description 4 par:', charDesc4);
                                        block.settings[settingKey] = setting.replace('Feature Description 4', charDesc4);
                                        replacedCharDesc4 = true;
                                    }
                                }
                            });
                        }
                    });
                }
            });
            
            // Vérifier si tous les marqueurs ont été remplacés
            if (!replacedCharTitle1 || !replacedCharDesc1) {
                console.warn("Marqueur 'Feature Title 1' ou 'Feature Description 1' non trouvé dans le template");
            }
            if (!replacedCharTitle2 || !replacedCharDesc2) {
                console.warn("Marqueur 'Feature Title 2' ou 'Feature Description 2' non trouvé dans le template");
            }
            if (!replacedCharTitle3 || !replacedCharDesc3) {
                console.warn("Marqueur 'Feature Title 3' ou 'Feature Description 3' non trouvé dans le template");
            }
            if (!replacedCharTitle4 || !replacedCharDesc4) {
                console.warn("Marqueur 'Feature Title 4' ou 'Feature Description 4' non trouvé dans le template");
            }
            
            // Intégrer le titre du produit sélectionné dans le template
            if (selectedProductTitle) {
                if (template.product_title_behavior === "replace") {
                    template.product_title = selectedProductTitle;
                    console.log('Titre du produit intégré dans le template final:', selectedProductTitle);
                }
                
                // Remplacer [Product Name] par le nom du produit dans tout le template
                console.log('Recherche et remplacement de [Product Name] par:', selectedProductTitle);
                
                // Fonction récursive pour parcourir le template et remplacer [Product Name]
                const replaceProductName = (obj) => {
                    if (!obj || typeof obj !== 'object') return;
                    
                    Object.keys(obj).forEach(key => {
                        if (typeof obj[key] === 'string') {
                            if (obj[key].includes('[Product Name]')) {
                                obj[key] = obj[key].replace(/\[Product Name\]/g, selectedProductTitle);
                                console.log(`Remplacement de [Product Name] effectué dans ${key}`);
                            }
                        } else if (typeof obj[key] === 'object') {
                            replaceProductName(obj[key]);
                        }
                    });
                };
                
                // Parcourir le template pour remplacer [Product Name]
                replaceProductName(template);
            }
            
            // Intégrer les avis clients dans le template
            if (selectedCustomerReviews && selectedCustomerReviews.length === 6) {
                console.log('Intégration des avis clients dans le template:');
                let replacedReview1 = false;
                let replacedReview2 = false;
                let replacedReview3 = false;
                let replacedReview4 = false;
                let replacedReview5 = false;
                let replacedReview6 = false;
                
                // Parcourir toutes les sections
                Object.keys(template.sections).forEach(sectionKey => {
                    console.log(`[Template] Parcours de la section: ${sectionKey}`);
                    const section = template.sections[sectionKey];
                    
                    // Si la section a des blocs, parcourir les blocs
                    if (section.blocks) {
                        Object.keys(section.blocks).forEach(blockKey => {
                            console.log(`[Template] Parcours du bloc: ${blockKey}`);
                            const block = section.blocks[blockKey];
                            
                            // Vérifier si le bloc est un bloc de témoignage
                            if (block.settings) {
                                // Vérifier si le bloc contient des marqueurs d'avis clients avant de remplacer
                                const hasCustomerReviewMarkers = Object.values(block.settings).some(setting => 
                                    typeof setting === 'string' && (
                                        setting.includes('Title review 1') || 
                                        setting.includes('Title review 2') || 
                                        setting.includes('Title review 3') || 
                                        setting.includes('Title review 4') || 
                                        setting.includes('Title review 5') || 
                                        setting.includes('Title review 6') || 
                                        setting.includes('Review ') || 
                                        setting.includes('Customer') ||
                                        setting.includes('Testimonial') ||
                                        setting.includes('Review 1') ||
                                        setting.includes('Review 2') ||
                                        setting.includes('Review 3') ||
                                        setting.includes('Review 4') ||
                                        setting.includes('Review 5') ||
                                        setting.includes('Review 6') ||
                                        setting.includes('Avis client 1') ||
                                        setting.includes('Avis client 2') ||
                                        setting.includes('Avis client 3') ||
                                        setting.includes('Avis client 4') ||
                                        setting.includes('Avis client 5') ||
                                        setting.includes('Avis client 6') ||
                                        setting.includes('Description non disponible') ||
                                        setting.includes('Client anonyme')
                                    )
                                );
                                
                                if (hasCustomerReviewMarkers) {
                                    if (!replacedReview1 && block.settings) {
                                        const review = selectedCustomerReviews[0];
                                        if (block.settings.title !== undefined && typeof block.settings.title === 'string' && 
                                            (block.settings.title.includes('Title review 1') || block.settings.title.includes('Customer') || block.settings.title.includes('Avis client 1'))) {
                                            block.settings.title = review.title;
                                        }
                                        if (block.settings.testimonial !== undefined) block.settings.testimonial = review.description;
                                        if (block.settings.author !== undefined) block.settings.author = review.author;
                                        if (block.settings.text !== undefined && typeof block.settings.text === 'string' && 
                                            (block.settings.text.includes('Review 1') || block.settings.text.includes('Description non disponible'))) {
                                            block.settings.text = `<p>${review.description}</p>`;
                                        }
                                        if (block.settings.author !== undefined && typeof block.settings.author === 'string' && 
                                            block.settings.author.includes('Client anonyme')) {
                                            block.settings.author = `<em><strong>${review.author}</strong></em>`;
                                        }
                                        replacedReview1 = true;
                                        console.log('Avis client 1 remplacé avec succès');
                                        return; // Passer au bloc suivant
                                    }
                                    if (!replacedReview2 && block.settings) {
                                        const review = selectedCustomerReviews[1];
                                        if (block.settings.title !== undefined && typeof block.settings.title === 'string' && 
                                            (block.settings.title.includes('Title review 2') || block.settings.title.includes('Customer') || block.settings.title.includes('Avis client 2'))) {
                                            block.settings.title = review.title;
                                        }
                                        if (block.settings.testimonial !== undefined) block.settings.testimonial = review.description;
                                        if (block.settings.author !== undefined) block.settings.author = review.author;
                                        if (block.settings.text !== undefined && typeof block.settings.text === 'string' && 
                                            (block.settings.text.includes('Review 2') || block.settings.text.includes('Description non disponible'))) {
                                            block.settings.text = `<p>${review.description}</p>`;
                                        }
                                        if (block.settings.author !== undefined && typeof block.settings.author === 'string' && 
                                            block.settings.author.includes('Client anonyme')) {
                                            block.settings.author = `<em><strong>${review.author}</strong></em>`;
                                        }
                                        replacedReview2 = true;
                                        console.log('Avis client 2 remplacé avec succès');
                                        return; // Passer au bloc suivant
                                    }
                                    if (!replacedReview3 && block.settings) {
                                        const review = selectedCustomerReviews[2];
                                        if (block.settings.title !== undefined && typeof block.settings.title === 'string' && 
                                            (block.settings.title.includes('Title review 3') || block.settings.title.includes('Customer') || block.settings.title.includes('Avis client 3'))) {
                                            block.settings.title = review.title;
                                        }
                                        if (block.settings.testimonial !== undefined) block.settings.testimonial = review.description;
                                        if (block.settings.author !== undefined) block.settings.author = review.author;
                                        if (block.settings.text !== undefined && typeof block.settings.text === 'string' && 
                                            (block.settings.text.includes('Review 3') || block.settings.text.includes('Description non disponible'))) {
                                            block.settings.text = `<p>${review.description}</p>`;
                                        }
                                        if (block.settings.author !== undefined && typeof block.settings.author === 'string' && 
                                            block.settings.author.includes('Client anonyme')) {
                                            block.settings.author = `<em><strong>${review.author}</strong></em>`;
                                        }
                                        replacedReview3 = true;
                                        console.log('Avis client 3 remplacé avec succès');
                                        return; // Passer au bloc suivant
                                    }
                                    if (!replacedReview4 && block.settings) {
                                        const review = selectedCustomerReviews[3];
                                        if (block.settings.title !== undefined && typeof block.settings.title === 'string' && 
                                            (block.settings.title.includes('Title review 4') || block.settings.title.includes('Customer') || block.settings.title.includes('Avis client 4'))) {
                                            block.settings.title = review.title;
                                        }
                                        if (block.settings.testimonial !== undefined) block.settings.testimonial = review.description;
                                        if (block.settings.author !== undefined) block.settings.author = review.author;
                                        if (block.settings.text !== undefined && typeof block.settings.text === 'string' && 
                                            (block.settings.text.includes('Review 4') || block.settings.text.includes('Description non disponible'))) {
                                            block.settings.text = `<p>${review.description}</p>`;
                                        }
                                        if (block.settings.author !== undefined && typeof block.settings.author === 'string' && 
                                            block.settings.author.includes('Client anonyme')) {
                                            block.settings.author = `<em><strong>${review.author}</strong></em>`;
                                        }
                                        replacedReview4 = true;
                                        console.log('Avis client 4 remplacé avec succès');
                                        return; // Passer au bloc suivant
                                    }
                                    if (!replacedReview5 && block.settings) {
                                        const review = selectedCustomerReviews[4];
                                        if (block.settings.title !== undefined && typeof block.settings.title === 'string' && 
                                            (block.settings.title.includes('Title review 5') || block.settings.title.includes('Customer') || block.settings.title.includes('Avis client 5'))) {
                                            block.settings.title = review.title;
                                        }
                                        if (block.settings.testimonial !== undefined) block.settings.testimonial = review.description;
                                        if (block.settings.author !== undefined) block.settings.author = review.author;
                                        if (block.settings.text !== undefined && typeof block.settings.text === 'string' && 
                                            (block.settings.text.includes('Review 5') || block.settings.text.includes('Description non disponible'))) {
                                            block.settings.text = `<p>${review.description}</p>`;
                                        }
                                        if (block.settings.author !== undefined && typeof block.settings.author === 'string' && 
                                            block.settings.author.includes('Client anonyme')) {
                                            block.settings.author = `<em><strong>${review.author}</strong></em>`;
                                        }
                                        replacedReview5 = true;
                                        console.log('Avis client 5 remplacé avec succès');
                                        return; // Passer au bloc suivant
                                    }
                                    if (!replacedReview6 && block.settings) {
                                        const review = selectedCustomerReviews[5];
                                        if (block.settings.title !== undefined && typeof block.settings.title === 'string' && 
                                            (block.settings.title.includes('Title review 6') || block.settings.title.includes('Customer') || block.settings.title.includes('Avis client 6'))) {
                                            block.settings.title = review.title;
                                        }
                                        if (block.settings.testimonial !== undefined) block.settings.testimonial = review.description;
                                        if (block.settings.author !== undefined) block.settings.author = review.author;
                                        if (block.settings.text !== undefined && typeof block.settings.text === 'string' && 
                                            (block.settings.text.includes('Review 6') || block.settings.text.includes('Description non disponible'))) {
                                            block.settings.text = `<p>${review.description}</p>`;
                                        }
                                        if (block.settings.author !== undefined && typeof block.settings.author === 'string' && 
                                            block.settings.author.includes('Client anonyme')) {
                                            block.settings.author = `<em><strong>${review.author}</strong></em>`;
                                        }
                                        replacedReview6 = true;
                                        console.log('Avis client 6 remplacé avec succès');
                                        return; // Passer au bloc suivant
                                    }
                                }
                            }
                        });
                    }
                });
                
                // Vérifier si tous les marqueurs ont été remplacés
                if (!replacedReview1) {
                    console.warn("Avis client 1 non intégré dans le template");
                }
                if (!replacedReview2) {
                    console.warn("Avis client 2 non intégré dans le template");
                }
                if (!replacedReview3) {
                    console.warn("Avis client 3 non intégré dans le template");
                }
                if (!replacedReview4) {
                    console.warn("Avis client 4 non intégré dans le template");
                }
                if (!replacedReview5) {
                    console.warn("Avis client 5 non intégré dans le template");
                }
                if (!replacedReview6) {
                    console.warn("Avis client 6 non intégré dans le template");
                }
            }
            
            // Intégrer les avantages concurrentiels dans le template
            if (selectedCompetitiveAdvantages && selectedCompetitiveAdvantages.length >= 4) {
                console.log('Intégration des avantages concurrentiels dans le template:');
                console.log('Avantages sélectionnés:', selectedCompetitiveAdvantages);
                console.log('Avantage 4 spécifiquement:', selectedCompetitiveAdvantages[3]);
                let replacedAdvantage1 = false;
                let replacedAdvantage2 = false;
                let replacedAdvantage3 = false;
                let replacedAdvantage4 = false;
                
                console.log('[Template] Début du parcours des sections du template...');
                
                Object.keys(template.sections).forEach(sectionKey => {
                    console.log(`[Template] Parcours de la section: ${sectionKey}`);
                    const section = template.sections[sectionKey];
                    
                    if (section.blocks) {
                        Object.keys(section.blocks).forEach(blockKey => {
                            console.log(`[Template] Parcours du bloc: ${blockKey}`);
                            const block = section.blocks[blockKey];
                            
                            // Log spécial pour le bloc text_YnDFC7
                            if (blockKey === 'text_YnDFC7') {
                                console.log(`[DEBUG] Bloc text_YnDFC7 trouvé dans section ${sectionKey}! Settings:`, block.settings);
                                if (block.settings && block.settings.text_2) {
                                    console.log(`[DEBUG] text_2 dans text_YnDFC7:`, block.settings.text_2);
                                }
                            }
                            
                            // Vérifier dans les settings du bloc
                            if (block.settings) {
                                Object.keys(block.settings).forEach(settingKey => {
                                    const setting = block.settings[settingKey];
                                    if (typeof setting === 'string') {
                                        // Remplacer les marqueurs d'avantages concurrentiels
                                        if (setting.includes('Benefit 1 (emotional or problem solving)') && selectedCompetitiveAdvantages[0]) {
                                            console.log('Trouvé Benefit 1 dans setting:', settingKey, 'valeur:', setting);
                                            console.log('Remplacement par:', selectedCompetitiveAdvantages[0]);
                                            block.settings[settingKey] = setting.replace(/Benefit 1 \(emotional or problem solving\)/g, selectedCompetitiveAdvantages[0]);
                                            replacedAdvantage1 = true;
                                        }
                                        
                                        if (setting.includes('Benefit 2 (emotional or problem solving)') && selectedCompetitiveAdvantages[1]) {
                                            console.log('Trouvé Benefit 2 dans setting:', settingKey, 'valeur:', setting);
                                            console.log('Remplacement par:', selectedCompetitiveAdvantages[1]);
                                            block.settings[settingKey] = setting.replace(/Benefit 2 \(emotional or problem solving\)/g, selectedCompetitiveAdvantages[1]);
                                            replacedAdvantage2 = true;
                                        }
                                        
                                        if (setting.includes('Benefit 3 (emotional or problem solving)') && selectedCompetitiveAdvantages[2]) {
                                            console.log('Trouvé Benefit 3 dans setting:', settingKey, 'valeur:', setting);
                                            console.log('Remplacement par:', selectedCompetitiveAdvantages[2]);
                                            block.settings[settingKey] = setting.replace(/Benefit 3 \(emotional or problem solving\)/g, selectedCompetitiveAdvantages[2]);
                                            replacedAdvantage3 = true;
                                        }
                                        
                                        if (setting.includes('Benefit 4 (emotional or problem solving)') && selectedCompetitiveAdvantages[3]) {
                                            console.log('Trouvé Benefit 4 dans setting:', settingKey, 'valeur:', setting);
                                            console.log('Remplacement par:', selectedCompetitiveAdvantages[3]);
                                            block.settings[settingKey] = setting.replace(/Benefit 4 \(emotional or problem solving\)/g, selectedCompetitiveAdvantages[3]);
                                            replacedAdvantage4 = true;
                                        }
                                        
                                        // Remplacer les marqueurs <strong>Benefit X</strong>
                                        if (setting.includes('<strong>Benefit 1</strong>') && selectedCompetitiveAdvantages[0]) {
                                            console.log('Trouvé Benefit 1 (strong) dans setting:', settingKey, 'valeur:', setting);
                                            console.log('Remplacement par:', selectedCompetitiveAdvantages[0]);
                                            block.settings[settingKey] = setting.replace(/<strong>Benefit 1<\/strong>/g, `<strong>${selectedCompetitiveAdvantages[0]}</strong>`);
                                            replacedAdvantage1 = true;
                                        }
                                        
                                        if (setting.includes('<strong>Benefit 2</strong>') && selectedCompetitiveAdvantages[1]) {
                                            console.log('Trouvé Benefit 2 (strong) dans setting:', settingKey, 'valeur:', setting);
                                            console.log('Remplacement par:', selectedCompetitiveAdvantages[1]);
                                            block.settings[settingKey] = setting.replace(/<strong>Benefit 2<\/strong>/g, `<strong>${selectedCompetitiveAdvantages[1]}</strong>`);
                                            replacedAdvantage2 = true;
                                        }
                                        
                                        if (setting.includes('<strong>Benefit 3</strong>') && selectedCompetitiveAdvantages[2]) {
                                            console.log('Trouvé Benefit 3 (strong) dans setting:', settingKey, 'valeur:', setting);
                                            console.log('Remplacement par:', selectedCompetitiveAdvantages[2]);
                                            block.settings[settingKey] = setting.replace(/<strong>Benefit 3<\/strong>/g, `<strong>${selectedCompetitiveAdvantages[2]}</strong>`);
                                            replacedAdvantage3 = true;
                                        }
                                        
                                        if (setting.includes('<strong>Benefit 4</strong>') && selectedCompetitiveAdvantages[3]) {
                                            console.log('Trouvé Benefit 4 (strong) dans setting:', settingKey, 'valeur:', setting);
                                            console.log('Remplacement par:', selectedCompetitiveAdvantages[3]);
                                            block.settings[settingKey] = setting.replace(/<strong>Benefit 4<\/strong>/g, `<strong>${selectedCompetitiveAdvantages[3]}</strong>`);
                                            replacedAdvantage4 = true;
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
                
                // Vérifier si tous les marqueurs ont été remplacés
                if (!replacedAdvantage1) {
                    console.warn("Marqueur 'Benefit 1 (emotional or problem solving)' non trouvé dans le template");
                }
                if (!replacedAdvantage2) {
                    console.warn("Marqueur 'Benefit 2 (emotional or problem solving)' non trouvé dans le template");
                }
                if (!replacedAdvantage3) {
                    console.warn("Marqueur 'Benefit 3 (emotional or problem solving)' non trouvé dans le template");
                }
                if (!replacedAdvantage4) {
                    console.warn("Marqueur 'Benefit 4 (emotional or problem solving)' non trouvé dans le template");
                }
            } else {
                throw new Error("Vous devez sélectionner exactement 4 avantages concurrentiels");
            }
        }
        
        // Générer le nom de fichier
        const filename = `${safeProductName}-template.json`;
        console.log('Nom du fichier généré:', filename);
        
        // Télécharger le template
        downloadTemplate(template, filename);
        
        // Retourner le template modifié et le nom de fichier
        return {
            template: template,
            filename: filename
        };
    } catch (error) {
        console.error('[Generate Template] Erreur lors de la génération du template:', error);
        console.error('[Generate Template] Stack trace:', error.stack);
        console.error('[Generate Template] Type d\'erreur:', typeof error);
        console.error('[Generate Template] Message d\'erreur:', error.message);
        
        // Créer une erreur avec un message détaillé
        const detailedError = new Error(`Échec de la génération du template: ${error.message || 'Erreur inconnue'}`);
        detailedError.originalError = error;
        throw detailedError;
    }
}

/**
 * Fonction pour télécharger le template JSON
 * @param {Object} template - Le template à télécharger
 * @param {string} filename - Le nom du fichier
 */
function downloadTemplate(template, filename) {
    try {
        // Convertir le template en JSON avec une indentation lisible
        const jsonString = JSON.stringify(template, null, 2);
        
        // Créer un blob avec le contenu JSON
        const blob = new Blob([jsonString], { type: 'application/json' });
        
        // Créer un lien de téléchargement
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        
        // Ajouter le lien au DOM, cliquer dessus, puis le supprimer
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Libérer l'URL
        URL.revokeObjectURL(url);
        
        console.log(`[Download] Template téléchargé avec succès: ${filename}`);
    } catch (error) {
        console.error('[Download] Erreur lors du téléchargement:', error);
        throw new Error(`Impossible de télécharger le template: ${error.message}`);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des éléments du formulaire
    const productForm = document.getElementById('productForm');
    const resultsSection = document.getElementById('resultsSection');
    
    // Notre backend gère la clé API, pas besoin de l'interface de saisie
    console.log('Application initialisée avec le backend sécurisé');
    
    // Initialisation du toggle switch de modèle IA
    const aiModelToggle = document.getElementById('aiModelToggle');
    const aiModelInput = document.getElementById('aiModel');
    const toggleLabelLeft = document.querySelector('.toggle-label-left');
    const toggleLabelRight = document.querySelector('.toggle-label-right');
    
    // Gestion du toggle switch de modèle IA
    if (aiModelToggle) {
        aiModelToggle.addEventListener('change', function() {
            const isChecked = this.checked;
            
            if (isChecked) {
                // Claude sélectionné
                aiModelInput.value = 'claude';
                toggleLabelLeft.classList.remove('active');
                toggleLabelRight.classList.add('active');
                console.log('Modèle IA sélectionné: Claude 4');
            } else {
                // ChatGPT sélectionné  
                aiModelInput.value = 'chatgpt';
                toggleLabelLeft.classList.add('active');
                toggleLabelRight.classList.remove('active');
                console.log('Modèle IA sélectionné: ChatGPT 4');
            }
        });
    }
    
    // Tab navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-pane');
    
    // Copy buttons
    const copyButtons = document.querySelectorAll('.btn-copy');
    const downloadBtn = document.getElementById('generateTemplateBtn');
    
    // Loading bar functionality
    const loadingContainer = document.getElementById('loadingContainer');
    const progressFill = document.getElementById('progressFill');
    const loadingPercentage = document.getElementById('loadingPercentage');
    const steps = [
        document.getElementById('step1'),
        document.getElementById('step2'),
        document.getElementById('step3'),
        document.getElementById('step4')
    ];
    
    // Function to update loading progress
    function updateLoadingProgress(percent, currentStep) {
        progressFill.style.width = percent + '%';
        loadingPercentage.textContent = percent + '%';
        
        // Update steps
        steps.forEach((step, index) => {
            if (index < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }

    // Fonction pour afficher les erreurs
    function showError(message) {
        // Masquer le chargement
        loadingContainer.style.display = 'none';
        
        // Réactiver le bouton de soumission
        const submitBtn = productForm.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        
        // Afficher l'erreur
        const errorContainer = document.getElementById('errorContainer') || createErrorContainer();
        errorContainer.innerHTML = `<div class="error-message">${message}</div>`;
        errorContainer.style.display = 'block';
        
        // Faire défiler vers l'erreur
        errorContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Fonction pour créer un conteneur d'erreur s'il n'existe pas
    function createErrorContainer() {
        const errorContainer = document.createElement('div');
        errorContainer.id = 'errorContainer';
        errorContainer.className = 'error-container';
        productForm.insertAdjacentElement('afterend', errorContainer);
        return errorContainer;
    }
    
    // Handle form submission
    productForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Initialiser les variables globales pour éviter les erreurs
        window.emotionalBenefitsValidated = false;
        window.selectedEmotionalBenefits = [];
        window.useCasesValidated = false;
        window.selectedUseCases = [];
        window.competitiveAdvantagesValidated = false;
        window.selectedCompetitiveAdvantages = [];
        window.customerReviewsValidated = false;
        window.selectedCustomerReviews = [];
        window.faqValidated = false;
        window.selectedFAQ = [];
        
        // Masquer les erreurs précédentes
        const existingErrorContainer = document.getElementById('errorContainer');
        if (existingErrorContainer) {
            existingErrorContainer.style.display = 'none';
        }
        
        // Show loading state
        const submitBtn = productForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        loadingContainer.style.display = 'block';
        
        // Get form data
        const formData = new FormData(productForm);
        console.log('[DEBUG] FormData entries:');
        for (let [key, value] of formData.entries()) {
            console.log(`[DEBUG] ${key}: "${value}"`);
        }
        
        const productData = {
            productName: formData.get('productName'),
            deepResearch: formData.get('deepResearch'),
            competitorUrl: formData.get('competitorUrl'),
            aiModel: formData.get('aiModel') || 'chatgpt', // Modèle IA sélectionné
            // Ces champs seront extraits automatiquement de la deep research
            productDescription: formData.get('productDescription') || '',
            targetAudience: formData.get('targetAudience') || '',
            productFeatures: formData.get('productFeatures') || '',
            problemsSolved: formData.get('problemsSolved') || ''
        };
        
        console.log('[DEBUG] ProductData créé:', productData);
        console.log('[DEBUG] ProductData.productName value:', `"${productData.productName}"`);
        console.log('[DEBUG] ProductData.productName type:', typeof productData.productName);
        
        try {
            // Step 1: Initializing and data extraction (0-20%)
            updateLoadingProgress(5, 0);
            
            // Simulate step progress
            const animateProgress = (start, end, duration, step) => {
                const startTime = Date.now();
                const animate = () => {
                    const now = Date.now();
                    const timeElapsed = now - startTime;
                    const progress = Math.min(timeElapsed / duration, 1);
                    const currentProgress = start + (end - start) * progress;
                    
                    updateLoadingProgress(Math.floor(currentProgress), step);
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                };
                
                animate();
                return new Promise(resolve => setTimeout(resolve, duration));
            };
            
            // Step 1: Analyzing data and generating marketing angles
            await animateProgress(5, 25, 2000, 0);
            
            // NOUVEAU: Générer les angles marketing pour sélection
            console.log('[Main] === ÉTAPE 1: GÉNÉRATION DES ANGLES MARKETING POUR SÉLECTION ===');
            try {
                if (typeof window.generateMarketingAngleSelection === 'function') {
                    console.log('[Main] Génération des angles marketing pour sélection...');
                    const marketingAngles = await window.generateMarketingAngleSelection(productData.deepResearch, productData.aiModel);
                    console.log('[Main] Angles marketing générés pour sélection:', marketingAngles);
                    
                    // Afficher la section de sélection des angles marketing
                    await window.showMarketingAngleSelection(marketingAngles);
                    
                    // ARRÊTER le processus ici - l'utilisateur doit sélectionner un angle
                    loadingContainer.style.display = 'none';
                    submitBtn.disabled = false;
                    return; // Sortir de la fonction, attendre la sélection
                    
                } else {
                    console.error('[Main] Fonction generateMarketingAngleSelection non disponible');
                    throw new Error('Module de sélection d\'angles marketing non disponible');
                }
            } catch (error) {
                console.error('[Main] Erreur lors de la génération des angles marketing:', error);
                console.error('[Main] Stack trace:', error.stack);
                console.error('[Main] Message d\'erreur:', error.message);
                console.error('[Main] Type d\'erreur:', typeof error);
                console.error('[Main] Continuation sans angles marketing...');
                
                // Utiliser les angles de fallback directement
                throw error; // Propager l'erreur au lieu d'utiliser un fallback
            }
            
            // Continuer directement avec le reste du processus de génération
            await continueGenerationProcess(productData);
        } catch (error) {
            console.error('Error generating content:', error);
            console.error('Error stack:', error.stack);
            // Sécuriser JSON.stringify pour éviter les références circulaires
            try {
                const errorDetails = {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                };
                console.error('Error details:', JSON.stringify(errorDetails));
            } catch (jsonError) {
                console.error('Error details: [Cannot serialize error object]');
            }
            alert(`Une erreur est survenue lors de la génération du contenu: ${error.message || error}. Vérifiez la console pour plus de détails.`);
        } finally {
            // Hide loading container
            loadingContainer.style.display = 'none';
            
            // Reset button state
            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn) {
                submitBtn.disabled = false;
            }
        }
    });
    
    // Fonction pour continuer le processus de génération après sélection d'angle
    async function continueGenerationProcess(productData) {
        // Vérifier si un processus de génération est déjà en cours
        if (window.generationInProgress) {
            console.log('[Main] ⚠️ Processus de génération déjà en cours, abandon de cet appel');
            return;
        }
        
        // Marquer le processus comme en cours
        window.generationInProgress = true;
        console.log('[Main] 🚀 DÉBUT continueGenerationProcess');
        
        const loadingContainer = document.getElementById('loadingContainer');
        
        const animateProgress = async (start, end, duration, step) => {
            const startTime = Date.now();
            
            const animate = () => {
                const now = Date.now();
                const timeElapsed = now - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                const currentProgress = start + (end - start) * progress;
                
                updateLoadingProgress(Math.floor(currentProgress), step);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            animate();
            return new Promise(resolve => setTimeout(resolve, duration));
        };
        
        try {
            // Step 2: Creating psychographic profile (25-50%)
            await animateProgress(25, 50, 3000, 1);
            
            // Generate content with two versions for each element
            updateLoadingProgress(50, 2); // Move to step 3
            
            let content;
            try {
                content = await generateAllContent(productData);
                
                // Step 3: Generating marketing content (50-80%)
                await animateProgress(50, 80, 3000, 2);
                
                // Step 4: Finalizing results (80-100%)
                await animateProgress(80, 100, 1000, 3);
                
                // Store the content in global variable for version selection
                window.generatedContent = content;
                
                // Debug: Vérifier que le contenu a été généré
                console.log('[Main] === DEBUG CONTENU GÉNÉRÉ ===');
                console.log('[Main] Content disponible:', !!content);
                console.log('[Main] Content keys:', content ? Object.keys(content) : 'N/A');
                console.log('[Main] === FIN DEBUG CONTENU ===');
                
            } catch (error) {
                console.error('[ERROR] Erreur lors de la génération du contenu:', error.message || error);
                console.error('[ERROR] Stack trace:', error.stack);
                console.error('[ERROR] Objet erreur complet:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
                
                // Arrêter le loader et afficher l'erreur à l'utilisateur
                loadingContainer.style.display = 'none';
                
                // Afficher l'erreur dans l'interface
                const errorMessage = `
                    <div style="
                        background: #fee2e2; 
                        border: 1px solid #fca5a5; 
                        color: #dc2626; 
                        padding: 20px; 
                        border-radius: 8px; 
                        margin: 20px 0;
                        text-align: center;
                    ">
                        <h3>❌ Erreur lors de la génération du contenu</h3>
                        <p><strong>Erreur:</strong> ${error.message}</p>
                        <p>Veuillez vérifier votre deep research et réessayer.</p>
                        <button onclick="location.reload()" style="
                            background: #dc2626; 
                            color: white; 
                            border: none; 
                            padding: 10px 20px; 
                            border-radius: 4px; 
                            cursor: pointer;
                            margin-top: 10px;
                        ">Recharger la page</button>
                    </div>
                `;
                
                // Insérer l'erreur après le formulaire
                const productForm = document.getElementById('productForm');
                if (productForm) {
                    productForm.insertAdjacentHTML('afterend', errorMessage);
                }
                
                // Réactiver le bouton submit
                const submitButton = document.getElementById('submitBtn') || document.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<i class="fas fa-bolt"></i> Générer le Contenu';
                }
                
                // Arrêter complètement le processus
                return;
            }
            
            // Vérifier que le contenu existe avant de continuer
            if (!content) {
                console.error('[Main] Aucun contenu généré - arrêt du processus');
                loadingContainer.style.display = 'none';
                alert('Erreur: Aucun contenu n\'a été généré. Veuillez réessayer.');
                return;
            }
            
            // Short delay to show 100% completion
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Générer et afficher le profil avatar basé sur la deep research
            try {
                console.log('[Main] Début de la génération du profil avatar');
                console.log('[Main] Deep research length:', productData.deepResearch.length);
                console.log('[Main] === DEBUG AVATAR PROFILE ===');
                console.log('[Main] window.AvatarDisplay disponible:', typeof window.AvatarDisplay);
                console.log('[Main] window.generateAvatarProfile disponible:', typeof window.generateAvatarProfile);
                console.log('[Main] === FIN DEBUG AVATAR PROFILE ===');
                
                // Créer la section avatar
                if (window.AvatarDisplay && typeof window.AvatarDisplay.createAvatarSection === 'function') {
                    console.log('[Main] Création de la section avatar...');
                    window.AvatarDisplay.createAvatarSection();
                } else {
                    console.error('[Main] Module avatarDisplay non disponible');
                }
                
                try {
                    // Vérifier si la fonction generateAvatarProfile est disponible
                    if (typeof window.generateAvatarProfile === 'function') {
                        console.log('[Main] Utilisation de la fonction generateAvatarProfile pour extraire le profil avatar');
                        
                        // Appeler la fonction generateAvatarProfile pour extraire le profil avatar
                        const avatarProfile = await window.generateAvatarProfile(productData.deepResearch, productData.productName, productData.aiModel);
                        console.log('[Main] Profil avatar généré avec succès:', avatarProfile);
                        
                        // Ajouter l'analyse psychologique au profil
                        avatarProfile.psychologicalAnalysis = content.psychographicProfile.version1;
                        
                        // Ajouter les angles marketing au profil si disponibles
                        if (content.marketingAngles) {
                            console.log('[Main] Ajout des angles marketing au profil');
                            avatarProfile.marketingAngles = content.marketingAngles;
                        }
                        
                        // Mettre à jour l'affichage du profil
                        console.log('[Main] Mise à jour via avatarProfile avec strategySections:', avatarProfile);
                        if (window.AvatarDisplay && typeof window.AvatarDisplay.updateAvatarProfile === 'function') {
                            window.AvatarDisplay.updateAvatarProfile(avatarProfile);
                        } else {
                            console.error('[Main] Fonction updateAvatarProfile non disponible');
                        }
                    } else {
                        console.error('[Main] Fonction generateAvatarProfile non disponible - Vérifiez que avatar-profile.js est bien chargé');
                        
                        // Créer un profil par défaut avec des "X" uniquement
                        const profile = {
                            age: "X",
                            gender: "X",
                            familyStatus: "X",
                            fears: ["X", "X", "X", "X", "X"],
                            expectations: ["X", "X", "X", "X", "X"],
                            psychologicalAnalysis: content.psychographicProfile.version1
                        };
                        
                        console.log('[Main] Profil par défaut utilisé (ÉCRASE les bonnes données):', profile);
                        console.warn('[Main] ⚠️  Cet appel écrase probablement les données strategySections!');
                        
                        // Mettre à jour l'affichage du profil
                        console.log('[Main] Appel updateAvatarProfile avec profil par défaut - VA ÉCRASER strategySections');
                        if (window.AvatarDisplay && typeof window.AvatarDisplay.updateAvatarProfile === 'function') {
                            window.AvatarDisplay.updateAvatarProfile(profile);
                        } else {
                            console.error('[Main] Fonction updateAvatarProfile non disponible');
                        }
                    }
                } catch (error) {
                    console.error('[Main] Erreur lors de la génération du profil avatar:', error);
                    // Continuer même en cas d'erreur avec le profil avatar
                }
                
                console.log('[Main] Génération du profil avatar terminée');
                console.log('[Main] === POINT DE CONTRÔLE: AVANT AFFICHAGE SECTION AVATAR ===');
                
                // Afficher la section avatar après la génération du contenu
                const avatarSection = document.getElementById('avatarSection');
                if (avatarSection) {
                    console.log('[Main] Section avatar trouvée dans le DOM, affichage...');
                    avatarSection.style.display = 'block';
                } else {
                    console.error('[Main] Section avatar introuvable dans le DOM');
                }
                
                console.log('[Main] === POINT DE CONTRÔLE: AVANT AFFICHAGE CONTENU PRINCIPAL ===');
            } catch (error) {
                console.error('[Main] Erreur lors de la génération du profil avatar:', error);
                // Continuer même en cas d'erreur avec le profil avatar
            }
            
            console.log('[Main] === POINT DE CONTRÔLE: AVANT AFFICHAGE CONTENU PRINCIPAL ===');
            console.log('[Main] === DEBUG CONTENU GÉNÉRÉ AVANT AFFICHAGE ===');
            console.log('[Main] content.productTitle:', content.productTitle);
            console.log('[Main] content.productTitle.version1:', content.productTitle ? content.productTitle.version1 : 'undefined');
            console.log('[Main] Type de productTitle.version1:', typeof (content.productTitle && content.productTitle.version1));
            console.log('[Main] Début de l\'affichage du contenu...');
            console.log('[Main] === FIN DEBUG CONTENU ===');

            // Vérifier que le contenu existe avant de l'afficher
            if (content.productTitle && content.productTitle.version1) {
                console.log('[Main] 🎯 AFFICHAGE TITRE - Début injection dans DOM');
                
                // Récupérer le contenu existant
                const existingElement = document.getElementById('productTitle');
                const existingContent = existingElement.innerHTML;
                
                // Si il y a déjà du contenu, on l'ajoute au nouveau
                if (existingContent && existingContent.trim() !== '' && !existingContent.includes('Erreur:')) {
                    console.log('[Main] 🔄 AJOUT DE CONTENU - Contenu existant détecté, ajout du nouveau contenu');
                    
                    // Extraire les titres existants du DOM
                    const existingTitles = [];
                    const existingButtons = existingElement.querySelectorAll('.select-btn');
                    existingButtons.forEach(btn => {
                        const titleText = btn.getAttribute('onclick');
                        if (titleText) {
                            const match = titleText.match(/selectProductTitle\('([^']+)'\)/);
                            if (match) {
                                existingTitles.push(match[1]);
                            }
                        }
                    });
                    
                    // Combiner les anciens et nouveaux titres
                    const combinedTitles = [...existingTitles, ...content.productTitle.version1];
                    console.log('[Main] 🔄 TITRES COMBINÉS:', combinedTitles);
                    
                    // Afficher le contenu combiné
                    existingElement.innerHTML = window.formatProductTitleWithSelectors('productTitle', combinedTitles);
                } else {
                    console.log('[Main] 🆕 NOUVEAU CONTENU - Aucun contenu existant, affichage du nouveau contenu');
                    existingElement.innerHTML = window.formatProductTitleWithSelectors('productTitle', content.productTitle.version1);
                }
                
                console.log('[Main] 🎯 AFFICHAGE TITRE - Injection terminée');
                console.log('[Main] 🔍 DEBUG DOM - productTitle element:', document.getElementById('productTitle'));
                console.log('[Main] 🔍 DEBUG DOM - productTitle innerHTML length:', document.getElementById('productTitle').innerHTML.length);
                console.log('[Main] 🎯 TITRE AFFICHÉ AVEC SUCCÈS');
            } else {
                console.error('[Main] Contenu productTitle manquant:', content.productTitle);
                document.getElementById('productTitle').innerHTML = '<p>Erreur: Contenu du titre non généré</p>';
            }

            // Initialiser la sélection du titre de produit
            window.productTitleValidated = false;
            window.selectedProductTitle = '';

            // Stocker tous les avantages générés pour future référence
            window.allProductBenefits = content.productBenefits.version1;
            window.benefitsValidated = false;
            window.selectedBenefits = []; // Initialiser le tableau des avantages sélectionnés
            
            // Initialiser la sélection des bénéfices émotionnels
            window.allEmotionalBenefits = content.emotionalBenefits.version1;
            window.emotionalBenefitsValidated = false;
            window.selectedEmotionalBenefits = [];
            
            // Initialiser la sélection des cas d'utilisation
            window.useCasesValidated = false;
            window.selectedUseCases = [];
            
            // Afficher l'interface de sélection des avantages
            if (content.productBenefits && content.productBenefits.version1) {
                console.log('[Main] 🎯 AFFICHAGE AVANTAGES - Début injection dans DOM');
                
                // Récupérer le contenu existant
                const existingElement = document.getElementById('productBenefits');
                const existingContent = existingElement.innerHTML;
                
                // Si il y a déjà du contenu, on l'ajoute au nouveau
                if (existingContent && existingContent.trim() !== '' && !existingContent.includes('Erreur:')) {
                    console.log('[Main] 🔄 AJOUT AVANTAGES - Contenu existant détecté, ajout du nouveau contenu');
                    
                    // Extraire les avantages existants du DOM
                    const existingBenefits = [];
                    const existingItems = existingElement.querySelectorAll('.benefit-tag');
                    existingItems.forEach(item => {
                        const title = item.getAttribute('data-benefit-title');
                        const description = item.getAttribute('data-benefit-description');
                        if (title && description) {
                            existingBenefits.push({
                                headline: title,
                                description: description
                            });
                        }
                    });
                    
                    console.log('[Main] 🔄 AVANTAGES EXISTANTS EXTRAITS:', existingBenefits);
                    
                    // Combiner les anciens et nouveaux avantages
                    const combinedBenefits = [...existingBenefits, ...content.productBenefits.version1];
                    console.log('[Main] 🔄 AVANTAGES COMBINÉS:', combinedBenefits);
                    
                    // Mettre à jour le stockage global
                    window.allProductBenefits = combinedBenefits;
                    
                    // Afficher le contenu combiné
                    existingElement.innerHTML = window.formatBenefitsWithSelectors('productBenefits', combinedBenefits);
                } else {
                    console.log('[Main] 🆕 NOUVEAUX AVANTAGES - Aucun contenu existant, affichage du nouveau contenu');
                    existingElement.innerHTML = window.formatBenefitsWithSelectors('productBenefits', content.productBenefits.version1);
                }
                
                console.log('[Main] Avantages produit affichés');
            } else {
                console.error('[Main] Contenu productBenefits manquant:', content.productBenefits);
                document.getElementById('productBenefits').innerHTML = '<p>Erreur: Avantages non générés</p>';
            }
            
            // Afficher les bénéfices émotionnels
            if (content.emotionalBenefits && content.emotionalBenefits.version1) {
                console.log('[Main] 🎯 AFFICHAGE BÉNÉFICES ÉMOTIONNELS - Début injection dans DOM');
                
                // Récupérer le contenu existant
                const existingElement = document.getElementById('emotionalBenefits');
                const existingContent = existingElement.innerHTML;
                
                // Si il y a déjà du contenu, on l'ajoute au nouveau
                if (existingContent && existingContent.trim() !== '' && !existingContent.includes('Erreur:')) {
                    console.log('[Main] 🔄 AJOUT BÉNÉFICES ÉMOTIONNELS - Contenu existant détecté, ajout du nouveau contenu');
                    
                    // Extraire les bénéfices émotionnels existants du DOM
                    const existingBenefits = [];
                    const existingItems = existingElement.querySelectorAll('.emotional-benefit-item .benefit-text');
                    existingItems.forEach(item => {
                        if (item.textContent && item.textContent.trim()) {
                            existingBenefits.push(item.textContent.trim());
                        }
                    });
                    
                    // Combiner les anciens et nouveaux bénéfices émotionnels
                    const combinedBenefits = [...existingBenefits, ...content.emotionalBenefits.version1];
                    console.log('[Main] 🔄 BÉNÉFICES ÉMOTIONNELS COMBINÉS:', combinedBenefits);
                    
                    // Afficher le contenu combiné
                    existingElement.innerHTML = window.formatEmotionalBenefitsWithSelectors('emotionalBenefits', combinedBenefits);
                } else {
                    console.log('[Main] 🆕 NOUVEAUX BÉNÉFICES ÉMOTIONNELS - Aucun contenu existant, affichage du nouveau contenu');
                    existingElement.innerHTML = window.formatEmotionalBenefitsWithSelectors('emotionalBenefits', content.emotionalBenefits.version1);
                }
                
                console.log('[Main] Bénéfices émotionnels affichés');
            } else {
                console.error('[Main] Contenu emotionalBenefits manquant:', content.emotionalBenefits);
                document.getElementById('emotionalBenefits').innerHTML = '<p>Erreur: Bénéfices émotionnels non générés</p>';
            }
            
            // Afficher le contenu "Comment ça marche"
            console.log('[Main] 🔍 DEBUG howItWorks - content.howItWorks:', content.howItWorks);
            console.log('[Main] 🔍 DEBUG howItWorks - existe?', !!content.howItWorks);
            console.log('[Main] 🔍 DEBUG howItWorks - version1?', content.howItWorks?.version1);
            
            if (content.howItWorks && content.howItWorks.version1) {
                try {
                    if (typeof window.formatHowItWorksWithSelectors === 'function') {
                        document.getElementById('howItWorks').innerHTML = window.formatHowItWorksWithSelectors('howItWorks', content.howItWorks.version1);
                        console.log('[Main] Comment ça marche affiché');
                    } else {
                        console.warn('[Main] formatHowItWorksWithSelectors non disponible, utilisation de fallback');
                        document.getElementById('howItWorks').innerHTML = `<div class="content-item"><p>${content.howItWorks.version1}</p></div>`;
                    }
                } catch (error) {
                    console.error('[Main] Erreur lors du formatage howItWorks:', error);
                    document.getElementById('howItWorks').innerHTML = `<div class="content-item"><p>${content.howItWorks.version1}</p></div>`;
                }
            } else {
                console.error('[Main] Contenu howItWorks manquant:', content.howItWorks);
                document.getElementById('howItWorks').innerHTML = '<p>Erreur: Comment ça marche non généré</p>';
            }
            
            // Afficher les cas d'utilisation
            if (content.useCases && content.useCases.version1) {
                console.log('[Main] 🎯 AFFICHAGE CAS D\'UTILISATION - Début injection dans DOM');
                
                // Récupérer le contenu existant
                const existingElement = document.getElementById('useCases');
                const existingContent = existingElement.innerHTML;
                
                // Si il y a déjà du contenu, on l'ajoute au nouveau
                if (existingContent && existingContent.trim() !== '' && !existingContent.includes('Erreur:')) {
                    console.log('[Main] 🔄 AJOUT CAS D\'UTILISATION - Contenu existant détecté, ajout du nouveau contenu');
                    
                    // Extraire les cas d'utilisation existants du DOM
                    const existingUseCases = [];
                    const existingItems = existingElement.querySelectorAll('.use-case-item .use-case-text');
                    existingItems.forEach(item => {
                        if (item.textContent && item.textContent.trim()) {
                            existingUseCases.push(item.textContent.trim());
                        }
                    });
                    
                    // Combiner les anciens et nouveaux cas d'utilisation
                    const combinedUseCases = [...existingUseCases, ...content.useCases.version1];
                    console.log('[Main] 🔄 CAS D\'UTILISATION COMBINÉS:', combinedUseCases);
                    
                    // Afficher le contenu combiné
                    existingElement.innerHTML = window.formatUseCasesWithSelectors('useCases', combinedUseCases);
                } else {
                    console.log('[Main] 🆕 NOUVEAUX CAS D\'UTILISATION - Aucun contenu existant, affichage du nouveau contenu');
                    existingElement.innerHTML = window.formatUseCasesWithSelectors('useCases', content.useCases.version1);
                }
                
                console.log('[Main] Cas d\'utilisation affichés');
            } else {
                console.error('[Main] Contenu useCases manquant:', content.useCases);
                document.getElementById('useCases').innerHTML = '<p>Erreur: Cas d\'utilisation non générés</p>';
            }
            
            // Afficher les caractéristiques
            if (content.characteristics && content.characteristics.version1) {
                console.log('[Main] 🎯 AFFICHAGE CARACTÉRISTIQUES - Début injection dans DOM');
                
                // Récupérer le contenu existant
                const existingElement = document.getElementById('characteristics');
                const existingContent = existingElement.innerHTML;
                
                // Si il y a déjà du contenu, on l'ajoute au nouveau
                if (existingContent && existingContent.trim() !== '' && !existingContent.includes('Erreur:')) {
                    console.log('[Main] 🔄 AJOUT CARACTÉRISTIQUES - Contenu existant détecté, ajout du nouveau contenu');
                    
                    // Extraire les caractéristiques existantes du DOM
                    const existingCharacteristics = [];
                    const existingItems = existingElement.querySelectorAll('.characteristic-item');
                    existingItems.forEach(item => {
                        const titleElement = item.querySelector('.characteristic-title');
                        const descElement = item.querySelector('.characteristic-description');
                        if (titleElement && descElement) {
                            existingCharacteristics.push({
                                title: titleElement.textContent.trim(),
                                description: descElement.textContent.trim()
                            });
                        }
                    });
                    
                    // Combiner les anciennes et nouvelles caractéristiques
                    const combinedCharacteristics = [...existingCharacteristics, ...content.characteristics.version1];
                    console.log('[Main] 🔄 CARACTÉRISTIQUES COMBINÉES:', combinedCharacteristics);
                    
                    // Afficher le contenu combiné
                    existingElement.innerHTML = window.formatCharacteristicsWithSelectors('characteristics', combinedCharacteristics);
                } else {
                    console.log('[Main] 🆕 NOUVELLES CARACTÉRISTIQUES - Aucun contenu existant, affichage du nouveau contenu');
                    existingElement.innerHTML = window.formatCharacteristicsWithSelectors('characteristics', content.characteristics.version1);
                }
                
                console.log('[Main] Caractéristiques affichées');
            } else {
                console.error('[Main] Contenu characteristics manquant:', content.characteristics);
                document.getElementById('characteristics').innerHTML = '<p>Erreur: Caractéristiques non générées</p>';
            }
            
            // Afficher les avantages concurrentiels
            if (content.competitiveAdvantages && content.competitiveAdvantages.version1) {
                console.log('[Main] 🎯 AFFICHAGE AVANTAGES CONCURRENTIELS - Début injection dans DOM');
                
                // Récupérer le contenu existant
                const existingElement = document.getElementById('competitiveAdvantages');
                const existingContent = existingElement.innerHTML;
                
                // Si il y a déjà du contenu, on l'ajoute au nouveau
                if (existingContent && existingContent.trim() !== '' && !existingContent.includes('Erreur:')) {
                    console.log('[Main] 🔄 AJOUT AVANTAGES CONCURRENTIELS - Contenu existant détecté, ajout du nouveau contenu');
                    
                    // Extraire les avantages concurrentiels existants du DOM
                    const existingAdvantages = [];
                    const existingItems = existingElement.querySelectorAll('.competitive-advantage-item .advantage-text');
                    existingItems.forEach(item => {
                        if (item.textContent && item.textContent.trim()) {
                            existingAdvantages.push(item.textContent.trim());
                        }
                    });
                    
                    // Combiner les anciens et nouveaux avantages concurrentiels
                    const combinedAdvantages = [...existingAdvantages, ...content.competitiveAdvantages.version1];
                    console.log('[Main] 🔄 AVANTAGES CONCURRENTIELS COMBINÉS:', combinedAdvantages);
                    
                    // Afficher le contenu combiné
                    existingElement.innerHTML = window.formatCompetitiveAdvantagesWithSelectors('competitiveAdvantages', combinedAdvantages);
                } else {
                    console.log('[Main] 🆕 NOUVEAUX AVANTAGES CONCURRENTIELS - Aucun contenu existant, affichage du nouveau contenu');
                    existingElement.innerHTML = window.formatCompetitiveAdvantagesWithSelectors('competitiveAdvantages', content.competitiveAdvantages.version1);
                }
                
                console.log('[Main] Avantages concurrentiels affichés');
            } else {
                console.error('[Main] Contenu competitiveAdvantages manquant:', content.competitiveAdvantages);
                document.getElementById('competitiveAdvantages').innerHTML = '<p>Erreur: Avantages concurrentiels non générés</p>';
            }
            
            // Afficher les avis clients
            console.log('[Main] 🔍 DEBUG customerReviews - content.customerReviews:', content.customerReviews);
            console.log('[Main] 🔍 DEBUG customerReviews - existe?', !!content.customerReviews);
            console.log('[Main] 🔍 DEBUG customerReviews - version1?', content.customerReviews?.version1);
            console.log('[Main] 🔍 DEBUG customerReviews - est un tableau?', Array.isArray(content.customerReviews?.version1));
            
            // Gérer la structure {version1, version2} ou array direct
            let customerReviewsData = null;
            if (content.customerReviews?.version1) {
                customerReviewsData = content.customerReviews.version1;
            } else if (Array.isArray(content.customerReviews)) {
                customerReviewsData = content.customerReviews;
            }
            
            if (customerReviewsData && Array.isArray(customerReviewsData)) {
                try {
                    if (typeof window.formatCustomerReviewsWithSelectors === 'function') {
                        document.getElementById('customerReviews').innerHTML = window.formatCustomerReviewsWithSelectors('customerReviews', customerReviewsData);
                        console.log('[Main] Avis clients affichés');
                    } else {
                        console.warn('[Main] formatCustomerReviewsWithSelectors non disponible, utilisation de fallback');
                        let fallbackHTML = '<div class="customer-reviews-grid">';
                        customerReviewsData.forEach((review, index) => {
                            fallbackHTML += `<div class="customer-review-item">
                                <strong>${review.name || `Client ${index + 1}`}</strong>: ${review.review || review.text || review.comment}
                            </div>`;
                        });
                        fallbackHTML += '</div>';
                        document.getElementById('customerReviews').innerHTML = fallbackHTML;
                    }
                } catch (error) {
                    console.error('[Main] Erreur lors du formatage customerReviews:', error);
                    let fallbackHTML = '<div class="customer-reviews-grid">';
                    customerReviewsData.forEach((review, index) => {
                        fallbackHTML += `<div class="customer-review-item">
                            <strong>${review.name || `Client ${index + 1}`}</strong>: ${review.review || review.text || review.comment}
                        </div>`;
                    });
                    fallbackHTML += '</div>';
                    document.getElementById('customerReviews').innerHTML = fallbackHTML;
                }
            } else {
                console.error('[Main] Contenu customerReviews manquant:', content.customerReviews);
                document.getElementById('customerReviews').innerHTML = '<p>Erreur: Avis clients non générés</p>';
            }
            
            // Afficher la FAQ
            if (content.faq && Array.isArray(content.faq)) {
                document.getElementById('faq').innerHTML = window.formatFAQWithSelectors('faq', content.faq);
                console.log('[Main] FAQ affichée');
            } else {
                console.error('[Main] Contenu FAQ manquant:', content.faq);
                document.getElementById('faq').innerHTML = '<p>Erreur: FAQ non générée</p>';
            }
            
            // Réattacher les gestionnaires d'événements pour les FAQ
            if (typeof setupFAQSelectors === 'function') {
                setupFAQSelectors();
            }
            
            // Configurer tous les sélecteurs après l'affichage du contenu
            console.log('[Main] Configuration des sélecteurs...');
            
            // Configurer les sélecteurs pour chaque section
            if (typeof setupProductTitleSelectors === 'function') {
                setupProductTitleSelectors();
            }
            
            if (typeof setupBenefitsSelectors === 'function') {
                setupBenefitsSelectors();
            }
            
            if (typeof setupEmotionalBenefitsSelectors === 'function') {
                setupEmotionalBenefitsSelectors();
            }
            
            if (typeof setupUseCasesSelectors === 'function') {
                setupUseCasesSelectors();
            }
            
            if (typeof setupCharacteristicsSelectors === 'function') {
                setupCharacteristicsSelectors();
            }
            
            if (typeof setupCompetitiveAdvantagesSelectors === 'function') {
                setupCompetitiveAdvantagesSelectors();
            }
            
            if (typeof setupCustomerReviewsSelectors === 'function') {
                setupCustomerReviewsSelectors();
            }
            
            if (typeof setupFAQSelectors === 'function') {
                setupFAQSelectors();
            }
            
            console.log('[Main] Tous les sélecteurs configurés');
            
            // Masquer le loader maintenant que la génération est terminée
            loadingContainer.style.display = 'none';
            
            // Afficher la section des résultats
            const resultsSection = document.getElementById('resultsSection');
            if (resultsSection) {
                resultsSection.style.display = 'block';
                console.log('[Main] Section des résultats affichée');
                console.log('[Main] 🔍 DEBUG DOM - resultsSection trouvée:', resultsSection);
                console.log('[Main] 🔍 DEBUG DOM - style.display:', resultsSection.style.display);
                console.log('[Main] 🔍 DEBUG DOM - offsetHeight:', resultsSection.offsetHeight);
                console.log('[Main] 🔍 DEBUG DOM - offsetWidth:', resultsSection.offsetWidth);
            } else {
                console.error('[Main] Section des résultats introuvable');
            }
            
            // Forcer l'affichage de la section Output Generator
            console.log('[Main] 🔍 Forçage de l\'affichage de la section Output Generator...');
            const outputSection = document.getElementById('resultsSection');
            if (outputSection) {
                outputSection.style.display = 'block';
                console.log('[Main] ✅ Section Output Generator affichée:', outputSection.style.display);
            } else {
                console.error('[Main] ❌ Section Output Generator introuvable');
            }
            
            // Cacher les autres sections
            const prelanderSection = document.getElementById('prelanderSection');
            if (prelanderSection) {
                prelanderSection.style.display = 'none';
                console.log('[Main] 🔒 Section Pre-lander cachée');
            }
            
            const prelanderTemplatesSection = document.getElementById('prelanderTemplatesSection');
            if (prelanderTemplatesSection) {
                prelanderTemplatesSection.style.display = 'none';
                console.log('[Main] 🔒 Section Pre-lander Templates cachée');
            }
            
            // Scroll to results - SUPPRIMÉ pour éviter le scroll automatique au rechargement
            // document.querySelector('.results-section').scrollIntoView({ behavior: 'smooth' });
            
            // Re-enable submit button
            submitBtn.disabled = false;
            
            // Ajouter les gestionnaires d'événements pour la sélection des avantages
            setupBenefitsSelectionHandlers();
            
            // Initialiser les boutons d'édition pour tous les éléments générés sauf l'analyse psychographique et la synthèse stratégique
            initializeEditButtons();
            
            // Réinitialiser le flag de génération
            window.generationInProgress = false;
            
        } catch (error) {
            console.error('[ERROR] Erreur lors de la génération du contenu:', error.message || error);
            console.error('[ERROR] Stack trace:', error.stack);
            console.error('[ERROR] Objet erreur complet:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
            
            // Arrêter le loader et afficher l'erreur à l'utilisateur
            loadingContainer.style.display = 'none';
            
            // Afficher l'erreur dans l'interface
            const errorMessage = `
                <div style="
                    background: #fee2e2; 
                    border: 1px solid #fca5a5; 
                    color: #dc2626; 
                    padding: 20px; 
                    border-radius: 8px; 
                    margin: 20px 0;
                    text-align: center;
                ">
                    <h3>❌ Erreur lors de la génération du contenu</h3>
                    <p><strong>Erreur:</strong> ${error.message}</p>
                    <p>Veuillez vérifier votre deep research et réessayer.</p>
                    <button onclick="location.reload()" style="
                        background: #dc2626; 
                        color: white; 
                        border: none; 
                        padding: 10px 20px; 
                        border-radius: 4px; 
                        cursor: pointer;
                        margin-top: 10px;
                    ">Recharger la page</button>
                </div>
            `;
            
            // Insérer l'erreur après le formulaire
            const productForm = document.getElementById('productForm');
            if (productForm) {
                productForm.insertAdjacentHTML('afterend', errorMessage);
            }
            
            // Réactiver le bouton submit
            const submitButton = document.getElementById('submitBtn') || document.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-bolt"></i> Générer le Contenu';
            }
            
            // Arrêter complètement le processus
            return;
        } finally {
            // Réinitialiser le flag de génération
            window.generationInProgress = false;
        }
    }
    
    // Fonction pour afficher la section de sélection des angles marketing
    async function showMarketingAngleSelection(angles) {
        console.log('[Main] Affichage de la sélection d\'angles marketing');
        
        // Masquer le loader et l'avatar
        document.getElementById('loadingContainer').style.display = 'none';
        document.getElementById('avatarSection').style.display = 'none';
        
        // Afficher la section d'angles marketing
        const marketingAngleSection = document.getElementById('marketingAngleSection');
        const marketingAngleContent = document.getElementById('marketingAngleContent');
        
        if (marketingAngleSection && marketingAngleContent) {
            // Formater et afficher les angles
            if (typeof window.formatMarketingAngleSelection === 'function') {
                try {
                    marketingAngleContent.innerHTML = window.formatMarketingAngleSelection(angles);
                } catch (error) {
                    console.error('[Main] Erreur lors du formatage des angles marketing:', error);
                    marketingAngleContent.innerHTML = '<p>Erreur lors du formatage des angles marketing</p>';
                }
            } else {
                console.warn('[Main] formatMarketingAngleSelection non disponible, tentative de rechargement...');
                // Attendre un peu et réessayer
                setTimeout(() => {
                    if (typeof window.formatMarketingAngleSelection === 'function') {
                        marketingAngleContent.innerHTML = window.formatMarketingAngleSelection(angles);
                    } else {
                        console.error('[Main] formatMarketingAngleSelection toujours non disponible');
                        marketingAngleContent.innerHTML = '<p>Erreur: Fonction de formatage non disponible</p>';
                    }
                }, 100);
            }
            
            marketingAngleSection.style.display = 'block';
            
            // Attacher les événements après un court délai pour s'assurer que le DOM est mis à jour
            setTimeout(() => {
                if (window.attachMarketingAngleEvents) {
                    window.attachMarketingAngleEvents();
                }
                
                // Déclencher l'animation d'apparition des cartes
                const cards = document.querySelectorAll('.marketing-angle-card');
                cards.forEach(card => {
                    card.classList.add('card-ready');
                });
            }, 300); // Augmenté de 100ms à 300ms
            
            console.log('[Main] Section d\'angles marketing affichée');
        } else {
            console.error('[Main] Sections d\'angles marketing non trouvées dans le DOM');
        }
    }

    // Exposer la fonction au window pour qu'elle soit accessible
    window.showMarketingAngleSelection = showMarketingAngleSelection;

    // Fonction appelée quand l'utilisateur clique sur "Continuer" après avoir sélectionné un angle
    window.continueAfterAngleSelection = async function() {
        console.log('[Main] === CONTINUATION APRÈS SÉLECTION D\'ANGLE MARKETING ===');
        
        // Vérifier qu'un angle a été sélectionné
        if (!window.selectedMarketingAngle) {
            alert('Veuillez sélectionner un angle marketing avant de continuer.');
            return;
        }
        
        console.log('[Main] Angle marketing sélectionné:', window.selectedMarketingAngle);
        
        // Masquer la section d'angles marketing
        document.getElementById('marketingAngleSection').style.display = 'none';
        
        // Réactiver le loader pour la suite du processus
        const loadingContainer = document.getElementById('loadingContainer');
        loadingContainer.style.display = 'block';
        
        // Récupérer les données du formulaire stockées globalement
        const formData = new FormData(document.getElementById('productForm'));
        const productData = {
            productName: formData.get('productName'),
            deepResearch: formData.get('deepResearch'),
            competitorUrl: formData.get('competitorUrl'),
            aiModel: formData.get('aiModel') || 'chatgpt',
            productDescription: formData.get('productDescription') || '',
            targetAudience: formData.get('targetAudience') || '',
            productFeatures: formData.get('productFeatures') || '',
            problemsSolved: formData.get('problemsSolved') || '',
            selectedMarketingAngle: window.selectedMarketingAngle // Ajouter l'angle sélectionné
        };
        
        // Continuer avec le processus de génération normal
        try {
            await continueGenerationProcess(productData);
        } catch (error) {
            console.error('[Main] Erreur lors de la continuation du processus:', error);
            loadingContainer.style.display = 'none';
            alert('Erreur lors de la génération du contenu. Veuillez réessayer.');
        }
    };

    // Stocker les données du formulaire globalement pour la continuation
    window.storedProductData = null;
    
    // Vérification que les fonctions globales sont bien définies
    console.log('[Main] === VÉRIFICATION DES FONCTIONS GLOBALES ===');
    console.log('[Main] window.continueAfterAngleSelection définie:', !!window.continueAfterAngleSelection);
    console.log('[Main] window.attachMarketingAngleEvents définie:', !!window.attachMarketingAngleEvents);
    console.log('[Main] window.showCustomAngleModal définie:', !!window.showCustomAngleModal);
    console.log('[Main] window.selectMarketingAngle définie:', !!window.selectMarketingAngle);
    
    // Fonction de validation pour vérifier que toutes les sélections sont complètes
    function validateSelectionsForTemplate() {
        const errors = [];
        
        // 1. Vérifier la sélection du titre de produit
        if (!window.selectedProductTitle || window.selectedProductTitle.trim() === '') {
            errors.push('Aucun titre de produit sélectionné');
        }
        
        // 2. Vérifier les avantages concurrentiels (minimum 4)
        if (!window.selectedCompetitiveAdvantages || window.selectedCompetitiveAdvantages.length < 4) {
            errors.push(`Avantages concurrentiels insuffisants (${window.selectedCompetitiveAdvantages?.length || 0}/4 requis)`);
        }
        
        // 3. Vérifier les avis clients (exactement 6)
        if (!window.selectedCustomerReviews || window.selectedCustomerReviews.length !== 6) {
            errors.push(`Avis clients insuffisants (${window.selectedCustomerReviews?.length || 0}/6 requis)`);
        }
        
        // 4. Vérifier les FAQ (minimum 4)
        if (!window.selectedFAQs || window.selectedFAQs.length < 4) {
            errors.push(`FAQ insuffisantes (${window.selectedFAQs?.length || 0}/4 requis)`);
        }
        
        // 5. Vérifier les angles marketing (minimum 1)
        if (!window.selectedMarketingAngle) {
            errors.push('Aucun angle marketing sélectionné');
        }
        
        // 6. Vérifier le contenu généré
        if (!window.generatedContent) {
            errors.push('Aucun contenu généré disponible');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Fonction pour mettre à jour l'état du bouton de génération de template
    function updateTemplateButtonState() {
        const generateTemplateBtn = document.getElementById('generateTemplateBtn');
        if (!generateTemplateBtn) return;
        
        const validation = validateSelectionsForTemplate();
        
        if (validation.isValid) {
            generateTemplateBtn.disabled = false;
            generateTemplateBtn.style.opacity = '1';
            generateTemplateBtn.style.cursor = 'pointer';
            generateTemplateBtn.style.pointerEvents = 'auto';
            generateTemplateBtn.title = 'Générer le template Shopify';
        } else {
            generateTemplateBtn.disabled = true;
            generateTemplateBtn.style.opacity = '0.5';
            generateTemplateBtn.style.cursor = 'not-allowed';
            generateTemplateBtn.style.pointerEvents = 'none';
            generateTemplateBtn.title = 'Sélections incomplètes:\n' + validation.errors.join('\n');
        }
    }

    // Fonction pour mettre à jour l'état du bouton de génération Pre-lander
    function updatePrelanderButtonState() {
        const generatePrelanderBtn = document.getElementById('generatePrelanderBtn');
        if (!generatePrelanderBtn) {
            console.log('[Pre-lander] Bouton generatePrelanderBtn non trouvé');
            return;
        }
        
        const validation = validateSelectionsForTemplate();
        console.log('[Pre-lander] Mise à jour état bouton, validation:', validation);
        
        if (validation.isValid) {
            generatePrelanderBtn.disabled = false;
            generatePrelanderBtn.style.opacity = '1';
            generatePrelanderBtn.style.cursor = 'pointer';
            generatePrelanderBtn.style.pointerEvents = 'auto';
            generatePrelanderBtn.title = 'Générer le Pre-lander';
            console.log('[Pre-lander] Bouton activé');
        } else {
            generatePrelanderBtn.disabled = true;
            generatePrelanderBtn.style.opacity = '0.5';
            generatePrelanderBtn.style.cursor = 'not-allowed';
            generatePrelanderBtn.style.pointerEvents = 'none';
            generatePrelanderBtn.title = 'Sélections incomplètes:\n' + validation.errors.join('\n');
            console.log('[Pre-lander] Bouton désactivé:', validation.errors);
        }
    }

    // Exposer la fonction globalement pour qu'elle soit appelée lors des sélections
    window.updateTemplateButtonState = updateTemplateButtonState;
    window.updatePrelanderButtonState = updatePrelanderButtonState;

    // Initialiser l'état du bouton au chargement de la page
    updateTemplateButtonState();
    updatePrelanderButtonState();
    
    // Forcer la mise à jour après un délai pour s'assurer que tout est chargé
    setTimeout(() => {
        updatePrelanderButtonState();
        console.log('[Pre-lander] Mise à jour forcée après délai');
    }, 1000);

    // Déclaration de generateTemplateBtn avant utilisation
    const generateTemplateBtn = document.getElementById('generateTemplateBtn');

    // Gestionnaire d'événements pour le bouton "Générer le template Shopify"
    if (generateTemplateBtn) {
        generateTemplateBtn.addEventListener('click', async function() {
            console.log('[Template] Génération du template Shopify...');
            
            try {
                console.log('[Template] Début de la génération du template...');
                
                // Vérifier que la fonction generateShopifyTemplate est disponible
                if (typeof window.generateShopifyTemplate !== 'function') {
                    throw new Error('La fonction generateShopifyTemplate n\'est pas disponible');
                }
                
                // Vérifier que nous avons du contenu généré
                if (!window.generatedContent) {
                    throw new Error('Aucun contenu généré disponible pour créer le template');
                }
                
                // Vérifier que toutes les sélections sont complètes
                const validationResults = validateSelectionsForTemplate();
                if (!validationResults.isValid) {
                    console.error('[Template] Sélections incomplètes:', validationResults.errors);
                    alert('Veuillez compléter toutes les sélections avant de générer le template.');
                    return;
                }
                
                const productName = document.getElementById('productName').value || 'Produit';
                console.log('[Template] Nom du produit:', productName);
                console.log('[Template] Contenu généré disponible:', !!window.generatedContent);
                
                // Utiliser la vraie fonction generateShopifyTemplate qui ouvre un fichier JSON
                const result = await window.generateShopifyTemplate(window.generatedContent, productName);
                
                console.log('[Template] Template généré avec succès:', result);
                
                // Afficher un message de succès
                alert('Template Shopify généré et téléchargé avec succès !');
                
            } catch (error) {
                console.error('[Template] Erreur lors de la génération:', error);
                console.error('[Template] Stack trace:', error.stack);
                console.error('[Template] Message d\'erreur:', error.message);
                alert('Erreur lors de la génération du template: ' + error.message);
            }
        });
    }
    
    // Fonction pour revenir aux templates
    window.showPrelanderTemplates = function() {
        // Cacher la section du générateur
        const prelanderSection = document.getElementById('prelanderSection');
        if (prelanderSection) {
            prelanderSection.style.display = 'none';
        }
        
        // Afficher la section Output Generator
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection) {
            resultsSection.style.display = 'block';
        }
        
        // Afficher la section des templates
        const templatesSection = document.getElementById('prelanderTemplatesSection');
        if (templatesSection) {
            templatesSection.style.display = 'block';
        }
    }
    
    // Fonction pour générer le contenu du pre-lander
    async function generatePrelanderContent() {
        console.log('🚀 Génération du contenu Pre-lander...');
        
        const productName = document.getElementById('productName').value || 'Produit';
        const productResearch = window.generatedContent ? JSON.stringify(window.generatedContent, null, 2) : 'Aucune recherche disponible';
        
        // Le prompt exact demandé
        const prompt = `You are an expert copywriter specializing in pre-lander creation with deep understanding of consumer psychology and conversion optimization. Create a compelling pre-lander for the following product:

PRODUCT NAME: ${productName}
DEEP RESEARCH: ${productResearch}

Generate each component of the pre-lander following these psychological principles:
- Use loss aversion and FOMO (fear of missing out)
- Appeal to both emotional and logical decision-making
- Create urgency without being pushy
- Build trust through specificity and social proof
- Address objections preemptively
- Use the PAS formula (Problem-Agitate-Solution) where appropriate

For each section, provide:

[TITLE]: Create a compelling headline that highlights 3-7 key benefits or reasons why this product is superior to alternatives. Use numbers for credibility.

[SUBTITLE]: Write a supporting statement that addresses the main pain points in a concise, powerful way using "NO/WITHOUT" statements.

[BENEFIT_1_HEADING]: Focus on immediate gratification - the fastest result they can expect.

[BENEFIT_1_TEXT]: Explain how quickly and easily they can see results. Use sensory language.

[CTA_1]: Create an action-oriented button text using the product name.

[BENEFIT_2_HEADING]: Highlight the quality/safety/natural aspect of the product.

[BENEFIT_2_TEXT]: Describe what makes the product safe/premium/natural.

[INGREDIENTS_LIST]: List 3-5 key ingredients/components with benefit-focused descriptions. Format as:
- [Component Name]: [Benefit-focused description]

[BENEFIT_3_HEADING]: Focus on longevity/value/effectiveness.

[BENEFIT_3_TEXT]: Explain duration of results and any variety offered.

[PRODUCT_VARIANTS]: List available options if applicable.

[CTA_2]: Create urgency-driven button text.

[BENEFIT_4_HEADING]: Emphasize value/cost-effectiveness.

[BENEFIT_4_TEXT]: Explain how long the product lasts and why it's economical.

[BENEFIT_5_HEADING]: Address ease of use/convenience.

[BENEFIT_5_TEXT]: Describe how simple the product is to use.

[CTA_3]: Reinforce the main action.

[SOCIAL_PROOF_HEADING]: Create a powerful social proof headline.

[SOCIAL_PROOF_STATS]: Include specific numbers (sales, customers, time period).

[SCARCITY_WARNING]: Warn about counterfeits or limited availability to create urgency and position as premium.

[AUTHENTICITY_MESSAGE]: Specify the only legitimate source to buy.

[GUARANTEE_TEXT]: Include risk reversal with specific guarantee terms.

[TESTIMONIAL_HEADING]: Create engaging header for customer reviews.

[TESTIMONIAL_INTRO]: Write brief intro to testimonials.

[TESTIMONIAL_IMAGES_PLACEHOLDER]: Indicate where before/after images or customer photos would go.

[CTA_4]: Final compelling call-to-action.

[GUARANTEE_SECTION]: Detailed guarantee explanation with psychological reassurance.

[FAQ_SECTION]: Create 5-7 FAQs that address common objections and concerns. Each should:
- Start with a natural customer question
- Provide a benefit-focused answer
- Build additional trust and desire

Make sure all copy:
- Uses "you" language to speak directly to the reader
- Includes specific numbers and timeframes
- Balances features with emotional benefits
- Creates a logical flow from problem to solution
- Builds urgency without desperation
- Sounds natural and conversational while being persuasive`;
        
        try {
            // Afficher un indicateur de chargement
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'loading-indicator';
            loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Génération du contenu Pre-lander en cours...';
            document.body.appendChild(loadingIndicator);
            
            // Envoyer la requête au serveur
            const response = await fetch('http://localhost:3000/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 2000
                })
            });
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const result = await response.json();
            
            // Supprimer l'indicateur de chargement
            document.body.removeChild(loadingIndicator);
            
            if (result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content) {
                // Parser et distribuer le contenu dans les onglets
                parseAndDistributePrelanderContent(result.choices[0].message.content);
                console.log('✅ Contenu Pre-lander généré avec succès');
            } else {
                throw new Error('Format de réponse inattendu');
            }
            
        } catch (error) {
            console.error('❌ Erreur lors de la génération:', error);
            // Supprimer l'indicateur de chargement s'il existe encore
            const loadingIndicator = document.querySelector('.loading-indicator');
            if (loadingIndicator) {
                document.body.removeChild(loadingIndicator);
            }
            alert('Erreur lors de la génération du contenu: ' + error.message);
        }
    }
    
    // Fonction pour parser et distribuer le contenu dans les onglets
    function parseAndDistributePrelanderContent(content) {
        console.log('📝 Distribution du contenu dans les onglets...');
        
        // Définir les sections à extraire
        const sections = [
            'TITLE', 'SUBTITLE', 'BENEFIT_1_HEADING', 'BENEFIT_1_TEXT', 
            'BENEFIT_2_HEADING', 'BENEFIT_2_TEXT', 'BENEFIT_2_TEXT_NEXT', 'INGREDIENTS_LIST', 
            'BENEFIT_3_HEADING', 'PRODUCT_VARIANTS', 'BENEFIT_3_TEXT', 'BENEFIT_4_HEADING',
            'BENEFIT_4_TEXT', 'BENEFIT_5_HEADING', 'BENEFIT_5_TEXT', 'SOCIAL_PROOF_HEADING',
            'FAQ_Q1', 'FAQ_A1', 'FAQ_Q2', 'FAQ_A2', 'FAQ_Q3', 'FAQ_A3', 
            'FAQ_Q4', 'FAQ_A4', 'FAQ_Q5', 'FAQ_A5'
        ];
        
        sections.forEach(section => {
            // Chercher le contenu entre [SECTION]: et la prochaine section ou fin
            const regex = new RegExp(`\\[${section}\\]:\\s*([\\s\\S]*?)(?=\\[\\w+\\]:|$)`, 'i');
            const match = content.match(regex);
            
            if (match && match[1]) {
                const sectionContent = match[1].trim();
                const elementId = `prelander-${section.toLowerCase().replace(/_/g, '-')}-content`;
                const element = document.getElementById(elementId);
                
                if (element) {
                    // Remplacer le placeholder par le contenu généré
                    element.innerHTML = `<div class="generated-content">${sectionContent.replace(/\n/g, '<br>')}</div>`;
                    console.log(`✅ Contenu ajouté pour ${section}`);
                } else {
                    console.warn(`⚠️ Élément non trouvé pour ${section}: ${elementId}`);
                }
            } else {
                console.warn(`⚠️ Contenu non trouvé pour la section ${section}`);
            }
        });
        
        console.log('✅ Distribution du contenu terminée');
    }
    
    // Fonction pour initialiser les onglets du Pre-Lander Generator
    window.initializePrelanderTabs = function() {
        const tabButtons = document.querySelectorAll('#prelanderSection .tab-btn');
        const tabPanes = document.querySelectorAll('#prelanderSection .tab-pane');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                // Retirer la classe active de tous les boutons et panneaux
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Ajouter la classe active au bouton cliqué et au panneau correspondant
                this.classList.add('active');
                const targetPane = document.getElementById(targetTab);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
        
        console.log('📋 Onglets Pre-lander initialisés');
    };
    
    // Fonction pour initialiser les boutons d'édition
    function initializeEditButtons() {
        // Initialiser les boutons d'édition pour tous les éléments générés sauf l'analyse psychographique et la synthèse stratégique
        const editButtons = document.querySelectorAll('.edit-button');
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const textToEdit = targetElement.textContent || targetElement.innerText;
                    const editInput = document.createElement('textarea');
                    editInput.value = textToEdit;
                    editInput.className = 'edit-input';
                    editInput.style.width = '100%';
                    editInput.style.height = '100%';
                    editInput.style.padding = '10px';
                    editInput.style.border = '1px solid #ccc';
                    editInput.style.borderRadius = '4px';
                    editInput.style.resize = 'vertical';
                    
                    targetElement.innerHTML = '';
                    targetElement.appendChild(editInput);
                    
                    editInput.focus();
                    
                    // Ajouter un gestionnaire d'événements pour sauvegarder les modifications
                    editInput.addEventListener('blur', function() {
                        const newText = this.value.trim();
                        targetElement.innerHTML = newText;
                        console.log(`✅ Modifications sauvegardées pour ${targetId}`);
                    });
                }
            });
        });
    }
    
    // DOM Content Loaded Event
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🚀 DOM chargé, initialisation de l\'application...');
        
        // Forcer le scroll vers le haut de la page
        window.scrollTo(0, 0);
        
        // Force l'affichage de la section Output Generator si du contenu existe
        const resultsSection = document.getElementById('resultsSection');
        
        // Vérifier plusieurs éléments pour détecter du contenu généré
        const hasGeneratedContent = 
            document.querySelector('#content-benefits .generated-content')?.innerHTML.trim() !== '' ||
            document.querySelector('#content-title .generated-content')?.innerHTML.trim() !== '' ||
            document.querySelector('#content-how-it-works .generated-content')?.innerHTML.trim() !== '' ||
            document.querySelector('.generated-content')?.innerHTML.trim() !== '' ||
            document.querySelector('#avatarSection')?.style.display === 'block';
        
        if (resultsSection && hasGeneratedContent) {
            console.log('📋 Contenu détecté, affichage de la section Output Generator...');
            resultsSection.style.display = 'block';
        } else {
            console.log('❌ Aucun contenu détecté, section Output Generator reste cachée');
        }
        
        // Initialiser les boutons d'édition
        initializeEditButtons();
        
        // Initialiser les gestionnaires d'événements pour la sélection des avantages
        setupBenefitsSelectionHandlers();
        
        // Initialiser les gestionnaires d'événements pour les FAQ
        setupFAQSelectors();
        
        // Initialiser les onglets Pre-lander
        window.initializePrelanderTabs();
        
        // Initialiser les event listeners pour les boutons Generate des templates
        const generateBtn = document.getElementById('generatePrelanderContentBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', generatePrelanderContent);
        }
        
        console.log('✅ Application initialisée avec succès');
        
        // Note: Event listeners pour les boutons Generate des templates sont gérés par onclick dans le HTML
        // Plus besoin d'ajouter des event listeners automatiques
        // if (typeof addGenerateButtonListeners === 'function') {
            // addGenerateButtonListeners();
        // }
        
        // Ajouter event listener pour le bouton Pre-lander principal avec validation
        const generatePrelanderBtn = document.getElementById('generatePrelanderBtn');
        if (generatePrelanderBtn) {
            generatePrelanderBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                console.log('[Pre-lander] Validation des sélections...');
                const validation = validateSelectionsForTemplate();
                console.log('[Pre-lander] Résultat validation:', validation);
                
                if (!validation.isValid) {
                    console.log('[Pre-lander] Validation échouée:', validation.errors);
                    alert('Sélections incomplètes:\n' + validation.errors.join('\n'));
                    return;
                }
                
                console.log('[Pre-lander] Validation réussie, génération du contenu...');
                // Si la validation passe, appeler la fonction de génération
                generatePrelanderContent();
            });
        }
        
        console.log('✅ Application initialisée avec succès');
    });
    
    // Fonction simple pour afficher le générateur Pre-lander (utilise le HTML statique)
    window.showPrelanderGenerator = function(templateName) {
        console.log(`🔄 Affichage du Pre-Lander Generator pour ${templateName}...`);
        
        // Cacher la section des templates
        const templatesSection = document.getElementById('prelanderTemplatesSection');
        if (templatesSection) {
            templatesSection.style.display = 'none';
        }
        
        // Cacher la section Output Generator
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection) {
            resultsSection.style.display = 'none';
        }
        
        // Afficher la section du générateur (HTML statique)
        const prelanderSection = document.getElementById('prelanderSection');
        if (prelanderSection) {
            prelanderSection.style.display = 'block';
            
            // Mettre à jour le nom du template dans le générateur
            const subtitle = prelanderSection.querySelector('.section-subtitle');
            if (subtitle) {
                subtitle.innerHTML = `Generating content for: <strong>${templateName}</strong>`;
            }
        }
        
        // Initialiser les onglets si nécessaire
        window.initializePrelanderTabs();
        
        console.log('✅ Pre-Lander Generator affiché');
    }
});

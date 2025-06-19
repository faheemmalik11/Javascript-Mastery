/**
 * Module de gestion de l'affichage de l'avatar
 * Ce module s'occupe de créer et mettre à jour la section avatar
 */

const AvatarDisplay = (function() {
    'use strict';
    
    // Variable pour sauvegarder les strategySections
    let savedStrategySections = null;

    /**
     * Crée dynamiquement la section avatar si elle n'existe pas
     */
    function createAvatarSection() {
        console.log('[Avatar Display] Début de createAvatarSection');
        
        // Trouver le conteneur avatar-section
        const avatarContainer = document.getElementById('avatarSection');
        if (!avatarContainer) {
            console.error('[Avatar Display] Conteneur avatar (avatarSection) introuvable');
            return;
        }
        
        console.log('[Avatar Display] Conteneur avatar trouvé:', avatarContainer);
        console.log('[Avatar Display] Style display du conteneur:', avatarContainer.style.display);
        
        // S'assurer que le conteneur est visible
        avatarContainer.style.display = 'block';
        console.log('[Avatar Display] Conteneur avatar rendu visible');
        
        // FORCER la suppression COMPLÈTE du contenu
        console.log('[Avatar Display] Suppression forcée de tout le contenu');
        avatarContainer.innerHTML = '';
        
        // Créer la nouvelle section avatar avec TOUS les onglets
        const avatarHTML = `
            <div class="avatar-profile-section">
                <div class="avatar-profile-card">
                    <div class="avatar-profile-header">
                        <h2><i class="fas fa-user-circle"></i> Profil de l'Acheteur Cible</h2>
                    </div>
                    
                    <!-- Onglets Avatar -->
                    <div class="avatar-tabs">
                        <button class="avatar-tab-btn active" data-tab="avatar-profile-tab">
                            <i class="fas fa-user"></i> Profil
                        </button>
                        <button class="avatar-tab-btn" data-tab="avatar-strategy-tab">
                            <i class="fas fa-chess"></i> Stratégie
                        </button>
                        <button class="avatar-tab-btn" data-tab="avatar-marketing-tab">
                            <i class="fas fa-bullhorn"></i> Angles Marketing
                        </button>
                    </div>
                    
                    <!-- Contenu des onglets -->
                    <div class="avatar-tab-content">
                        <!-- Onglet Profil -->
                        <div id="avatar-profile-tab" class="avatar-tab-pane active">
                            <div class="avatar-profile-content">
                                <div class="avatar-profile-grid">
                                    <!-- Âge -->
                                    <div class="avatar-profile-item">
                                        <div class="avatar-profile-icon age-icon">
                                            <i class="fas fa-birthday-cake"></i>
                                        </div>
                                        <div class="avatar-profile-data">
                                            <div class="avatar-profile-label">Âge</div>
                                            <div class="avatar-profile-value" id="avatarAge"></div>
                                        </div>
                                    </div>
                                    
                                    <!-- Sexe -->
                                    <div class="avatar-profile-item">
                                        <div class="avatar-profile-icon gender-icon">
                                            <i class="fas fa-venus-mars"></i>
                                        </div>
                                        <div class="avatar-profile-data">
                                            <div class="avatar-profile-label">Sexe</div>
                                            <div class="avatar-profile-value" id="avatarGender"></div>
                                        </div>
                                    </div>
                                    
                                    <!-- Situation familiale -->
                                    <div class="avatar-profile-item">
                                        <div class="avatar-profile-icon family-icon">
                                            <i class="fas fa-home"></i>
                                        </div>
                                        <div class="avatar-profile-data">
                                            <div class="avatar-profile-label">Famille</div>
                                            <div class="avatar-profile-value" id="avatarFamily"></div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="avatar-profile-bottom">
                                    <div class="avatar-fears-container">
                                        <h3><i class="fas fa-exclamation-triangle"></i> Peurs avant l'achat</h3>
                                        <div class="avatar-fears-list" id="avatarFears">
                                        </div>
                                    </div>
                                    
                                    <div class="avatar-expectations-container">
                                        <h3><i class="fas fa-star"></i> Attentes du produit</h3>
                                        <div class="avatar-expectations-list" id="avatarExpectations">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Onglet Stratégie -->
                        <div id="avatar-strategy-tab" class="avatar-tab-pane">
                            <div class="strategy-content">
                                <!-- Section principale de la stratégie -->
                                <div class="strategy-section-main">
                                    <h3><i class="fas fa-chess"></i> Stratégie Marketing</h3>
                                    <div class="strategy-main-content" id="strategyMainContent">
                                        <!-- Le contenu principal de la stratégie sera inséré ici -->
                                    </div>
                                </div>
                                
                                <!-- Grille des sections stratégiques -->
                                <div class="strategy-sections-grid">
                                    <!-- Émotions Clés à Susciter -->
                                    <div class="strategy-section-card">
                                        <div class="strategy-section-header">
                                            <i class="fas fa-heart"></i>
                                            <h4>Émotions Clés à Susciter</h4>
                                        </div>
                                        <div class="strategy-section-content" id="keyEmotions">
                                            <!-- Contenu des émotions clés -->
                                        </div>
                                    </div>
                                    
                                    <!-- Motivations d'Achat Principales -->
                                    <div class="strategy-section-card">
                                        <div class="strategy-section-header">
                                            <i class="fas fa-shopping-cart"></i>
                                            <h4>Motivations d'Achat Principales</h4>
                                        </div>
                                        <div class="strategy-section-content" id="purchaseMotivations">
                                            <!-- Contenu des motivations d'achat -->
                                        </div>
                                    </div>
                                    
                                    <!-- Drivers Biologiques Majeurs -->
                                    <div class="strategy-section-card">
                                        <div class="strategy-section-header">
                                            <i class="fas fa-dna"></i>
                                            <h4>Drivers Biologiques Majeurs</h4>
                                        </div>
                                        <div class="strategy-section-content" id="biologicalDrivers">
                                            <!-- Contenu des drivers biologiques -->
                                        </div>
                                    </div>
                                    
                                    <!-- Angles Marketing Clés -->
                                    <div class="strategy-section-card">
                                        <div class="strategy-section-header">
                                            <i class="fas fa-angle-double-right"></i>
                                            <h4>Angles Marketing Clés</h4>
                                        </div>
                                        <div class="strategy-section-content" id="marketingAngles">
                                            <!-- Contenu des angles marketing -->
                                        </div>
                                    </div>
                                    
                                    <!-- Messages Marketing à Valeur Ajoutée -->
                                    <div class="strategy-section-card">
                                        <div class="strategy-section-header">
                                            <i class="fas fa-plus-circle"></i>
                                            <h4>Messages Marketing à Valeur Ajoutée</h4>
                                        </div>
                                        <div class="strategy-section-content" id="valueAddedMessages">
                                            <!-- Contenu des messages à valeur ajoutée -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Onglet Angles Marketing -->
                        <div id="avatar-marketing-tab" class="avatar-tab-pane">
                            <div class="marketing-content">
                                <!-- Section principale des angles marketing -->
                                <div class="marketing-section-main">
                                    <h3><i class="fas fa-bullhorn"></i> Angles Marketing Prioritaires</h3>
                                    <div id="marketingMainContent" class="marketing-content-area">
                                        <!-- Le contenu sera injecté dynamiquement ici -->
                                        <div class="loading-message">
                                            <i class="fas fa-spinner fa-spin"></i>
                                            <p>Génération des angles marketing en cours...</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Injecter le HTML
        avatarContainer.innerHTML = avatarHTML;
        console.log('[Avatar Display] HTML injecté dans le conteneur');
        
        // Attendre que le DOM soit mis à jour et initialiser les onglets
        setTimeout(() => {
            console.log('[Avatar Display] Initialisation différée des onglets');
            const tabs = document.querySelectorAll('.avatar-tab-btn');
            console.log('[Avatar Display] Onglets détectés après injection:', tabs.length);
            initializeAvatarTabs();
        }, 200);
        
        console.log('[Avatar Display] Section avatar créée et insérée dans avatarSection');
    }
    
    /**
     * Met à jour le profil avatar avec les données fournies
     * @param {Object} profile - Données du profil avatar
     */
    function updateAvatarProfile(profile) {
        console.log('[Avatar Display] updateAvatarProfile appelée avec profile:', profile);
        console.log('[Avatar Display] profile.strategySections présent:', !!profile.strategySections);
        if (profile.strategySections) {
            console.log('[Avatar Display] ✅ strategySections détectées:', Object.keys(profile.strategySections));
        } else {
            console.log('[Avatar Display] ❌ strategySections ABSENTES');
        }
        
        if (!profile || typeof profile !== 'object') {
            console.error('[Avatar Display] Profil invalide fourni pour la mise à jour');
            return;
        }
        
        console.log('[Avatar Display] Mise à jour du profil avatar avec les données:', profile);
        
        // Debug: Vérifier que les éléments existent dans le DOM
        console.log('[Avatar Display] Vérification des éléments DOM:');
        console.log('- avatarAge existe:', !!document.getElementById('avatarAge'));
        console.log('- avatarGender existe:', !!document.getElementById('avatarGender'));
        console.log('- avatarFamily existe:', !!document.getElementById('avatarFamily'));
        
        // Mettre à jour l'âge
        if (profile.age) {
            console.log('[Avatar Display] Traitement de l\'âge:', profile.age);
            const avatarAge = document.getElementById('avatarAge');
            if (avatarAge) {
                console.log('[Avatar Display] Élément avatarAge trouvé, mise à jour...');
                if (profile.age === "X") {
                    avatarAge.innerHTML = `<span class="age-emoji">❓</span> <span class="age-text">X</span>`;
                    console.log('[Avatar Display] Âge mis à jour avec X');
                } else {
                    const ageEmoji = getAgeEmoji(profile.age);
                    console.log('[Avatar Display] Emoji d\'âge calculé:', ageEmoji);
                    avatarAge.innerHTML = `<span class="age-emoji">${ageEmoji}</span> <span class="age-text">${profile.age}</span>`;
                    console.log('[Avatar Display] Âge mis à jour avec:', profile.age);
                }
            } else {
                console.error('[Avatar Display] Élément avatarAge non trouvé dans le DOM');
            }
        } else {
            console.warn('[Avatar Display] Aucun âge fourni dans le profil');
        }
        
        // Mettre à jour le sexe
        if (profile.gender) {
            console.log('[Avatar Display] Traitement du genre:', profile.gender);
            const avatarGender = document.getElementById('avatarGender');
            if (avatarGender) {
                console.log('[Avatar Display] Élément avatarGender trouvé, mise à jour...');
                if (profile.gender === "X") {
                    avatarGender.innerHTML = `<span class="gender-symbol">❓</span> <span class="gender-text">X</span>`;
                    console.log('[Avatar Display] Genre mis à jour avec X');
                } else {
                    const genderSymbol = profile.gender === "Homme" ? "♂️" : profile.gender === "Femme" ? "♀️" : "❓";
                    console.log('[Avatar Display] Symbole de genre calculé:', genderSymbol);
                    avatarGender.innerHTML = `<span class="gender-symbol">${genderSymbol}</span> <span class="gender-text">${profile.gender}</span>`;
                    console.log('[Avatar Display] Genre mis à jour avec:', profile.gender);
                }
            } else {
                console.error('[Avatar Display] Élément avatarGender non trouvé dans le DOM');
            }
        } else {
            console.warn('[Avatar Display] Aucun genre fourni dans le profil');
        }
        
        // Mettre à jour la situation familiale
        if (profile.familyStatus) {
            const avatarFamily = document.getElementById('avatarFamily');
            if (avatarFamily) {
                if (profile.familyStatus === "X") {
                    avatarFamily.innerHTML = `<span class="family-emoji">❓</span> <span class="family-text">X</span>`;
                } else {
                    const familyEmoji = getFamilyEmoji(profile.familyStatus);
                    avatarFamily.innerHTML = `<span class="family-emoji">${familyEmoji}</span> <span class="family-text">${profile.familyStatus}</span>`;
                }
            }
        }
        
        // Mettre à jour les peurs
        if (profile.fears && Array.isArray(profile.fears)) {
            const avatarFears = document.getElementById('avatarFears');
            if (avatarFears) {
                avatarFears.innerHTML = '';
                profile.fears.forEach(fear => {
                    const fearItem = document.createElement('div');
                    fearItem.className = 'fear-item';
                    
                    if (fear === "X") {
                        fearItem.innerHTML = `
                            <div class="fear-icon"><i class="fas fa-question-circle"></i></div>
                            <div class="fear-text">X</div>
                        `;
                    } else {
                        const fearIcon = getFearIcon(fear);
                        fearItem.innerHTML = `
                            <div class="fear-icon"><i class="fas ${fearIcon}"></i></div>
                            <div class="fear-text">${fear}</div>
                        `;
                    }
                    
                    avatarFears.appendChild(fearItem);
                });
            }
        }
        
        // Mettre à jour les attentes
        if (profile.expectations && Array.isArray(profile.expectations)) {
            const avatarExpectations = document.getElementById('avatarExpectations');
            if (avatarExpectations) {
                avatarExpectations.innerHTML = '';
                profile.expectations.forEach(expectation => {
                    const expectationItem = document.createElement('div');
                    expectationItem.className = 'expectation-item';
                    
                    if (expectation === "X") {
                        expectationItem.innerHTML = `
                            <div class="expectation-icon"><i class="fas fa-question-circle"></i></div>
                            <div class="expectation-text">X</div>
                        `;
                    } else {
                        const expectationIcon = getExpectationIcon(expectation);
                        expectationItem.innerHTML = `
                            <div class="expectation-icon"><i class="fas ${expectationIcon}"></i></div>
                            <div class="expectation-text">${expectation}</div>
                        `;
                    }
                    
                    avatarExpectations.appendChild(expectationItem);
                });
            }
        }
        
        // Traitement de l'analyse psychologique
        if (profile.psychologicalAnalysis) {
            console.log('[Avatar Display] Traitement de l\'analyse psychologique');
            
            console.log('[Avatar Display] Analyse psychologique reçue avant parsing:', profile.psychologicalAnalysis);
            console.log('[Avatar Display] Type de l\'analyse psychologique:', typeof profile.psychologicalAnalysis);
            const parsedAnalysis = parsePsychologicalAnalysis(profile.psychologicalAnalysis);
            
            // Mettre à jour le profil principal
            const psychographicMainProfile = document.getElementById('psychographicMainProfile');
            if (psychographicMainProfile) {
                // S'assurer que le contenu est bien formaté, même en fallback
                const mainContent = parsedAnalysis.mainProfile || formatMarkdownToHtml(profile.psychologicalAnalysis) || 'Informations en cours d\'analyse...';
                psychographicMainProfile.innerHTML = mainContent;
            }
        }
        
        // Mettre à jour la stratégie
        if (profile.strategy) {
            const strategyMainContent = document.getElementById('strategyMainContent');
            if (strategyMainContent) {
                strategyMainContent.innerHTML = profile.strategy;
            }
        }
        
        // Mettre à jour les sections spécifiques de la stratégie
        if (profile.strategySections) {
            console.log('[Avatar Display] Mise à jour des sections de stratégie:', profile.strategySections);
            saveAndApplyStrategySections(profile.strategySections);
        } else {
            console.warn('[Avatar Display] Aucune donnée strategySections trouvée dans le profil');
        }
        
        // Sauvegarder les strategySections pour une utilisation ultérieure
        if (profile.strategySections) {
            console.log('[Avatar Display] ✅ Sauvegarde des strategySections');
            savedStrategySections = profile.strategySections;
        }
        
        // Traitement des angles marketing
        if (profile.marketingAngles) {
            console.log('[Avatar Display] Traitement des angles marketing');
            updateMarketingAnglesTab(profile.marketingAngles);
        }
        
        console.log('[Avatar Display] Profil avatar mis à jour avec succès');
    }
    
    /**
     * Fonction pour sauvegarder et appliquer les strategySections
     */
    function saveAndApplyStrategySections(strategySections) {
        savedStrategySections = strategySections;
        console.log('[Avatar Display] strategySections sauvegardées:', strategySections);
        applyStrategySections(strategySections);
    }

    /**
     * Fonction pour appliquer les strategySections aux éléments DOM
     */
    function applyStrategySections(strategySections) {
        if (!strategySections) {
            console.log('[Avatar Display] Aucunes strategySections à appliquer');
            return;
        }

        console.log('[Avatar Display] Application des strategySections:', Object.keys(strategySections));

        // Application directe sur l'onglet Stratégie (les IDs correspondent aux clés des données)
        const sections = ['keyEmotions', 'purchaseMotivations', 'biologicalDrivers', 'marketingAngles', 'valueAddedMessages'];
        
        sections.forEach(sectionName => {
            if (strategySections[sectionName]) {
                const element = document.getElementById(sectionName);
                if (element) {
                    element.innerHTML = strategySections[sectionName];
                    console.log(`[Avatar Display] ✅ ${sectionName} mis à jour avec contenu`);
                } else {
                    console.warn(`[Avatar Display] ❌ Élément ${sectionName} non trouvé dans le DOM`);
                }
            }
        });
    }
    
    /**
     * Met à jour le contenu de la stratégie marketing avec les données fournies
     * @param {Object|string} strategyData - Données de la stratégie marketing ou contenu texte brut
     */
    function updateStrategyContent(strategyData) {
        console.log('[Avatar Display] === DÉBUT updateStrategyContent ===');
        console.log('[Avatar Display] Type de données reçues:', typeof strategyData);
        console.log('[Avatar Display] Longueur des données:', strategyData ? strategyData.length : 'null/undefined');
        console.log('[Avatar Display] Aperçu des données:', strategyData ? strategyData.substring(0, 300) + '...' : 'VIDE');
        console.log('[Avatar Display] Mise à jour du contenu de la stratégie marketing');
        
        // Cacher le contenu principal car il est déjà affiché dans les sections individuelles
        const strategyMainContent = document.getElementById('strategyMainContent');
        if (strategyMainContent) {
            strategyMainContent.style.display = 'none';
        }
        
        // Si strategyData est une chaîne, traiter comme du contenu brut
        if (typeof strategyData === 'string') {
            console.log('[Avatar Display] Contenu brut détecté, parsing nécessaire');
            
            // Parser le contenu pour extraire les sections spécifiques
            parseAndUpdateStrategySections(strategyData);
            return;
        }
        
        // Si strategyData est un objet, vérifier qu'il est valide
        if (!strategyData || typeof strategyData !== 'object') {
            console.error('[Avatar Display] Données de stratégie invalides fournie pour la mise à jour');
            return;
        }
        
        console.log('[Avatar Display] Mise à jour du contenu de la stratégie avec les données:', strategyData);
        
        // Mettre à jour les émotions clés à susciter
        const keyEmotions = document.getElementById('keyEmotions');
        if (keyEmotions && strategyData.keyEmotions) {
            if (Array.isArray(strategyData.keyEmotions)) {
                keyEmotions.innerHTML = '<ul>' + 
                    strategyData.keyEmotions.map(emotion => `<li>${emotion}</li>`).join('') + 
                    '</ul>';
            } else {
                keyEmotions.innerHTML = strategyData.keyEmotions;
            }
        }
        
        // Mettre à jour les motivations d'achat principales
        const purchaseMotivations = document.getElementById('purchaseMotivations');
        if (purchaseMotivations && strategyData.purchaseMotivations) {
            if (Array.isArray(strategyData.purchaseMotivations)) {
                purchaseMotivations.innerHTML = '<ul>' + 
                    strategyData.purchaseMotivations.map(motivation => `<li>${motivation}</li>`).join('') + 
                    '</ul>';
            } else {
                purchaseMotivations.innerHTML = strategyData.purchaseMotivations;
            }
        }
        
        // Mettre à jour les drivers biologiques
        const biologicalDrivers = document.getElementById('biologicalDrivers');
        if (biologicalDrivers && strategyData.biologicalDrivers) {
            if (Array.isArray(strategyData.biologicalDrivers)) {
                biologicalDrivers.innerHTML = '<ul>' + 
                    strategyData.biologicalDrivers.map(driver => `<li>${driver}</li>`).join('') + 
                    '</ul>';
            } else {
                biologicalDrivers.innerHTML = strategyData.biologicalDrivers;
            }
        }

        // Mettre à jour les angles marketing clés
        const marketingAngles = document.getElementById('marketingAngles');
        if (marketingAngles && strategyData.marketingAngles) {
            if (Array.isArray(strategyData.marketingAngles)) {
                marketingAngles.innerHTML = '<ul>' + 
                    strategyData.marketingAngles.map(angle => `<li>${angle}</li>`).join('') + 
                    '</ul>';
            } else {
                marketingAngles.innerHTML = strategyData.marketingAngles;
            }
        }

        // Mettre à jour les messages marketing à valeur ajoutée
        const valueAddedMessages = document.getElementById('valueAddedMessages');
        if (valueAddedMessages && strategyData.valueAddedMessages) {
            if (Array.isArray(strategyData.valueAddedMessages)) {
                valueAddedMessages.innerHTML = '<ul>' + 
                    strategyData.valueAddedMessages.map(message => `<li>${message}</li>`).join('') + 
                    '</ul>';
            } else {
                valueAddedMessages.innerHTML = strategyData.valueAddedMessages;
            }
        }

        console.log('[Avatar Display] Contenu stratégie mis à jour avec succès');
    }

    /**
     * Parse le contenu de la stratégie marketing et met à jour les sections spécifiques
     * @param {string} content - Contenu texte de la stratégie marketing
     */
    function parseAndUpdateStrategySections(content) {
        if (!content) {
            console.error('[Avatar Display] Aucun contenu fourni pour le parsing de la stratégie');
            return;
        }
        
        console.log('[Avatar Display] Parsing du contenu de la stratégie');
        
        // Sections à rechercher et leurs identifiants DOM
        const sections = [
            { title: 'Émotions clés à susciter', id: 'keyEmotions' },
            { title: 'Motivations d\'achat principales', id: 'purchaseMotivations' },
            { title: 'Drivers biologiques', id: 'biologicalDrivers' },
            { title: 'Angles marketing clés', id: 'marketingAngles' },
            { title: 'Messages marketing à valeur ajoutée', id: 'valueAddedMessages' }
        ];
        
        // Rechercher chaque section dans le contenu
        sections.forEach(section => {
            try {
                // Créer un pattern pour trouver la section et son contenu
                const pattern = new RegExp(`${section.title}[\\s\\n]*:([\\s\\S]*?)(?=(${sections.map(s => s.title).join('|')})[\\s\\n]*:|$)`, 'i');
                
                const match = content.match(pattern);
                
                if (match && match[1]) {
                    // Extraire le contenu de la section
                    let sectionContent = match[1].trim();
                    
                    // Vérifier si le contenu semble être une liste
                    if (sectionContent.includes('•') || sectionContent.includes('-') || sectionContent.includes('*') || /\\d+\\./.test(sectionContent)) {
                        // Extraire les éléments de la liste
                        const listItems = extractListItems(sectionContent);
                        
                        if (listItems.length > 0) {
                            // Mettre à jour la section avec les éléments de liste formatés
                            updateSectionContent(section.id, listItems);
                        } else {
                            // Si l'extraction de liste a échoué, utiliser le contenu brut
                            updateSectionContent(section.id, sectionContent);
                        }
                    } else {
                        // Utiliser le contenu brut
                        updateSectionContent(section.id, sectionContent);
                    }
                    
                    console.log(`[Avatar Display] Section '${section.title}' mise à jour`);
                } else {
                    console.log(`[Avatar Display] Section '${section.title}' non trouvée dans le contenu`);
                }
            } catch (error) {
                console.error(`[Avatar Display] Erreur lors du parsing de la section '${section.title}':`, error);
            }
        });
    }

    /**
     * Synchronise le contenu de la Synthèse Stratégique avec l'onglet Stratégie
     */
    function syncStrategicSynthesis() {
        const strategicSynthesisElement = document.getElementById('strategicSynthesis');
        if (strategicSynthesisElement) {
            const content = strategicSynthesisElement.innerHTML;
            if (content && content.trim() !== '') {
                console.log('[Avatar Display] Synchronisation de la Synthèse Stratégique avec l\'onglet Stratégie');
                updateStrategyContent(content);
            }
        } else {
            console.log('[Avatar Display] Élément strategicSynthesis non trouvé - fonctionnalité désactivée');
        }
    }
    
    /**
     * Initialise l'observateur pour la Synthèse Stratégique
     */
    function initStrategicSynthesisObserver() {
        const strategicSynthesisElement = document.getElementById('strategicSynthesis');
        if (!strategicSynthesisElement) {
            console.log('[Avatar Display] Élément strategicSynthesis non trouvé - observateur désactivé');
            return;
        }
        
        console.log('[Avatar Display] Initialisation de l\'observateur pour la Synthèse Stratégique');
        
        // Créer un observateur de mutations pour détecter les changements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    console.log('[Avatar Display] Changement détecté dans la Synthèse Stratégique');
                    setTimeout(() => {
                        syncStrategicSynthesis();
                    }, 100);
                }
            });
        });
        
        // Configurer l'observateur
        observer.observe(strategicSynthesisElement, {
            childList: true,
            subtree: true,
            characterData: true
        });
        
        console.log('[Avatar Display] Observateur de la Synthèse Stratégique initialisé');
    }
    
    /**
     * Extrait les éléments d'une liste depuis un texte
     * @param {string} text - Texte contenant potentiellement une liste
     * @returns {Array} - Tableau des éléments de la liste
     */
    function extractListItems(text) {
        if (!text) return [];
        
        // Nettoyer le texte
        let cleanText = text.replace(/<[^>]*>/g, '').trim();
        let items = [];
        
        // Rechercher les éléments avec des tirets
        items = cleanText.match(/-\s*([^-]+?)(?=\s*-|$)/g);
        if (items && items.length > 1) {
            return items.map(item => item.replace(/^-\s*/, '').trim()).filter(item => item.length > 0);
        }
        
        // Rechercher les éléments numérotés (1., 2., etc.)
        items = cleanText.match(/\d+\.\s*([^0-9]+?)(?=\s*\d+\.|$)/g);
        if (items && items.length > 1) {
            return items.map(item => item.replace(/^\d+\.\s*/, '').trim()).filter(item => item.length > 0);
        }
        
        // Rechercher les éléments avec des puces
        items = cleanText.match(/•\s*([^•]+?)(?=\s*•|$)/g);
        if (items && items.length > 1) {
            return items.map(item => item.replace(/^•\s*/, '').trim()).filter(item => item.length > 0);
        }
        
        // Rechercher les phrases séparées par des points-virgules
        if (cleanText.includes(';')) {
            items = cleanText.split(';').map(item => item.trim()).filter(item => item.length > 0);
            if (items.length > 1) {
                return items;
            }
        }
        
        // Rechercher les phrases séparées par des virgules (si plus de 2 éléments)
        if (cleanText.includes(',')) {
            items = cleanText.split(',').map(item => item.trim()).filter(item => item.length > 0);
            if (items.length > 2) {
                return items;
            }
        }
        
        // Rechercher les phrases séparées par des points (si plus de 2 éléments)
        if (cleanText.includes('.')) {
            items = cleanText.split('.').map(item => item.trim()).filter(item => item.length > 0);
            if (items.length > 2) {
                return items;
            }
        }
        
        // Si pas de liste détectée, retourner le texte tel quel
        return [cleanText];
    }
    
    /**
     * Met à jour le contenu d'une section spécifique
     * @param {string} sectionId - ID de la section à mettre à jour
     * @param {string|Array} content - Contenu à afficher
     */
    function updateSectionContent(sectionId, content) {
        const element = document.getElementById(sectionId);
        if (!element) return;
        
        if (Array.isArray(content)) {
            element.innerHTML = '<ul>' + 
                content.map(item => `<li>${item}</li>`).join('') + 
                '</ul>';
        } else {
            // Traiter le contenu texte et le convertir en liste si possible
            const processedContent = extractListItems(content);
            
            if (processedContent.length > 1) {
                // Mettre à jour la section avec les éléments de liste formatés
                element.innerHTML = '<ul>' + 
                    processedContent.map(item => `<li>${item}</li>`).join('') + 
                    '</ul>';
            } else {
                // Si l'extraction de liste a échoué, utiliser le contenu brut
                element.innerHTML = content;
            }
        }
        
        console.log(`[Avatar Display] Section ${sectionId} mise à jour`);
    }
    

    
    // Fonction pour parser l'analyse psychologique et l'organiser dans les sections appropriées
    function parsePsychologicalAnalysis(analysis) {
        console.log('[Avatar Display] Parsing de l\'analyse psychologique:', analysis);
        
        // Utiliser la nouvelle fonction de nettoyage JSON
        let jsonAnalysis = cleanAndParseJson(analysis);
        
        // Si pas réussi à parser en JSON, vérifier si c'est un objet déjà parsé
        if (!jsonAnalysis && typeof analysis === 'object' && analysis !== null) {
            console.log('[Avatar Display] Données déjà parsées comme objet JavaScript');
            jsonAnalysis = analysis;
        }
        
        // Si nous n'avons pas réussi à parser en JSON, traiter comme texte
        if (!jsonAnalysis) {
            console.log('[Avatar Display] Traitement comme texte...');
            
            // Utiliser l'analysis comme string ou convertir l'objet en string
            let textAnalysis = typeof analysis === 'string' ? analysis : JSON.stringify(analysis);
            
            // Nettoyer le texte avec le formateur markdown
            let cleanedAnalysis = formatMarkdownToHtml(textAnalysis)
                // Supprimer les phrases d'introduction génériques
                .replace(/Bien sûr,?\\s*voici l'analyse demandée pour le produit.*?:/gi, '')
                .replace(/Voici l'analyse psychologique.*?:/gi, '')
                .replace(/Analyse psychologique.*?:/gi, '')
                // Supprimer les titres avec ###
                .replace(/###\\s*\\d+\\.\\s*.*?:\\s*/gi, '')
                // Supprimer les numérotations au début
                .replace(/^\\s*\\d+\\.\\s*/gm, '')
                .trim();
            
            // Diviser par phrases et distribuer
            const sentences = cleanedAnalysis.split(/\\.\\s+/).filter(s => s.trim().length > 20);
            
            if (sentences.length >= 6) {
                return {
                    mainProfile: formatMarkdownToHtml(sentences.slice(0, 2).join('. ') + '.'),
                    emotionsToEvoke: formatMarkdownToHtml(sentences[2] + '.'),
                    lifestyleChoices: formatMarkdownToHtml(sentences[3] + '.'),
                    decisionLogic: formatMarkdownToHtml(sentences[4] + '.'),
                    mainDesire: formatMarkdownToHtml(sentences[5] + '.'),
                    problemsToSolve: formatMarkdownToHtml(sentences[6] ? sentences[6] + '.' : 'Informations en cours d\'analyse...'),
                    biologicalReasons: formatMarkdownToHtml(sentences[7] ? sentences[7] + '.' : 'Informations en cours d\'analyse...')
                };
            } else {
                // Fallback complet
                return {
                    mainProfile: formatMarkdownToHtml(cleanedAnalysis),
                    emotionsToEvoke: 'Informations en cours d\'analyse...',
                    lifestyleChoices: 'Informations en cours d\'analyse...',
                    decisionLogic: 'Informations en cours d\'analyse...',
                    mainDesire: 'Informations en cours d\'analyse...',
                    problemsToSolve: 'Informations en cours d\'analyse...',
                    biologicalReasons: 'Informations en cours d\'analyse...'
                };
            }
        }
        
        // Traiter les données JSON structurées
        console.log('[Avatar Display] Traitement des données JSON structurées:', jsonAnalysis);
        const result = {};
        
        // Traiter le profil principal avec formatage markdown
        if (jsonAnalysis.mainProfile) {
            if (typeof jsonAnalysis.mainProfile === 'object') {
                result.mainProfile = formatMarkdownToHtml(JSON.stringify(jsonAnalysis.mainProfile));
            } else {
                result.mainProfile = formatMarkdownToHtml(jsonAnalysis.mainProfile);
            }
        }
        
        // Traiter toutes les autres propriétés avec formatage markdown
        const properties = ['emotionsToEvoke', 'lifestyleChoices', 'decisionLogic', 'mainDesire', 'problemsToSolve', 'biologicalReasons', 'targetedFears', 'expectations'];
        
        properties.forEach(prop => {
            if (jsonAnalysis[prop]) {
                if (typeof jsonAnalysis[prop] === 'object') {
                    // Si c'est un objet/array, le convertir en HTML formaté
                    if (Array.isArray(jsonAnalysis[prop])) {
                        result[prop] = '<ul>' + jsonAnalysis[prop].map(item => `<li>${formatMarkdownToHtml(item)}</li>`).join('') + '</ul>';
                    } else {
                        result[prop] = formatMarkdownToHtml(JSON.stringify(jsonAnalysis[prop]));
                    }
                } else {
                    result[prop] = formatMarkdownToHtml(jsonAnalysis[prop]);
                }
            }
        });
        
        console.log('[Avatar Display] Résultat final du parsing:', result);
        return result;
    }
    
    // Fonction pour mettre à jour une section psychologique spécifique
    function updatePsychologicalSection(sectionId, sectionContent) {
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement && sectionContent) {
            let htmlContent = '';
            
            if (typeof sectionContent === 'object') {
                // Si c'est un objet, formater chaque propriété
                htmlContent = '<ul>';
                for (const [key, value] of Object.entries(sectionContent)) {
                    if (Array.isArray(value)) {
                        // Si c'est un tableau, afficher chaque élément avec formatage
                        htmlContent += `<li><strong>${formatMarkdownToHtml(key)}:</strong></li><ul>`;
                        value.forEach(item => htmlContent += `<li>${formatMarkdownToHtml(item)}</li>`);
                        htmlContent += '</ul>';
                    } else {
                        // Si c'est une valeur simple, appliquer le formatage markdown
                        htmlContent += `<li><strong>${formatMarkdownToHtml(key)}:</strong> ${formatMarkdownToHtml(value)}</li>`;
                    }
                }
                htmlContent += '</ul>';
            } else {
                // Si c'est déjà du texte, appliquer le formatage markdown
                htmlContent = formatMarkdownToHtml(sectionContent);
                // S'assurer qu'il y a au moins un paragraphe
                if (!htmlContent.includes('<p>') && !htmlContent.includes('<ul>') && !htmlContent.includes('<li>')) {
                    htmlContent = `<p>${htmlContent}</p>`;
                }
            }
            
            sectionElement.innerHTML = htmlContent;
        }
    }
    
    // Fonction pour obtenir l'emoji approprié pour l'âge
    function getAgeEmoji(age) {
        if (!age || typeof age !== 'string') {
            return "👤"; // Icône par défaut (personne)
        }
        
        // Gérer le cas "X"
        if (age === 'X' || age.toLowerCase().includes('information manquante')) {
            return "❓";
        }
        
        // Extraire le nombre de l'âge (ex: "25 ans" -> 25)
        const ageMatch = age.match(/(\d+)/);
        if (ageMatch) {
            const ageNumber = parseInt(ageMatch[1]);
            if (ageNumber >= 18 && ageNumber <= 25) return '👦';
            if (ageNumber >= 26 && ageNumber <= 35) return '👨';
            if (ageNumber >= 36 && ageNumber <= 45) return '👨‍💼';
            if (ageNumber >= 46 && ageNumber <= 55) return '🧔';
            if (ageNumber >= 56) return '👴';
        }
        
        // Fallback pour les anciens formats de tranches d'âge
        if (age.includes('18-25')) return '👦';
        if (age.includes('26-35')) return '👨';
        if (age.includes('36-45') || age.includes('35-45')) return '👨‍💼';
        if (age.includes('46-55')) return '🧔';
        if (age.includes('56+') || age.includes('55+')) return '👴';
        
        return '👤';
    }
    
    // Fonction pour obtenir l'emoji approprié pour la situation familiale
    function getFamilyEmoji(familyStatus) {
        if (!familyStatus || typeof familyStatus !== 'string') {
            return "👥"; // Icône par défaut (personnes)
        }
        
        if (familyStatus.toLowerCase().includes('célibataire')) return "👤";
        if (familyStatus.toLowerCase().includes('couple') && familyStatus.toLowerCase().includes('enfant')) return "👨‍👩‍👧‍👦";
        if (familyStatus.toLowerCase().includes('couple')) return "👫";
        if (familyStatus.toLowerCase().includes('marié') && familyStatus.toLowerCase().includes('enfant')) return "👨‍👩‍👧‍👦";
        if (familyStatus.toLowerCase().includes('marié')) return "💑";
        return "👥";
    }
    
    // Fonction pour obtenir l'icône appropriée pour une peur
    function getFearIcon(fear) {
        if (!fear || typeof fear !== 'string') {
            return "fa-exclamation-triangle"; // Icône par défaut
        }
        
        if (fear.includes("coût") || fear.includes("prix") || fear.includes("investissement")) {
            return "fa-coins";
        } else if (fear.includes("difficulté") || fear.includes("complexe")) {
            return "fa-question-circle";
        } else if (fear.includes("résultat") || fear.includes("efficacité")) {
            return "fa-chart-line";
        } else if (fear.includes("fiabilité") || fear.includes("durabilité")) {
            return "fa-exclamation-circle";
        } else if (fear.includes("service") || fear.includes("support")) {
            return "fa-headset";
        } else {
            return "fa-exclamation-triangle";
        }
    }
    
    // Fonction pour obtenir l'icône appropriée pour une attente
    function getExpectationIcon(expectation) {
        if (!expectation || typeof expectation !== 'string') {
            return "fa-star"; // Icône par défaut
        }
        
        if (expectation.includes("temps") || expectation.includes("rapide")) {
            return "fa-tachometer-alt";
        } else if (expectation.includes("résultat") || expectation.includes("professionnel")) {
            return "fa-trophy";
        } else if (expectation.includes("facile") || expectation.includes("simple")) {
            return "fa-tools";
        } else if (expectation.includes("investissement") || expectation.includes("économie")) {
            return "fa-hand-holding-usd";
        } else if (expectation.includes("durable") || expectation.includes("fiable")) {
            return "fa-shield-alt";
        } else {
            return "fa-star";
        }
    }
    
    // Fonction pour initialiser les onglets avatar
    function initializeAvatarTabs() {
        console.log('[Avatar Display] Initialisation des onglets avatar');
        
        const avatarTabs = document.querySelectorAll('.avatar-tab-btn');
        console.log('[Avatar Display] Onglets trouvés:', avatarTabs.length);
        
        if (avatarTabs.length === 0) {
            console.error('[Avatar Display] Aucun onglet avatar trouvé');
            return;
        }
        
        avatarTabs.forEach((tab, index) => {
            console.log(`[Avatar Display] Configuration onglet ${index}:`, tab.getAttribute('data-tab'));
            
            tab.addEventListener('click', () => {
                console.log('[Avatar Display] Clic sur onglet:', tab.getAttribute('data-tab'));
                
                const tabId = tab.getAttribute('data-tab');
                
                // Retirer la classe active de tous les onglets
                const allTabs = document.querySelectorAll('.avatar-tab-btn');
                allTabs.forEach(t => t.classList.remove('active'));
                
                // Ajouter la classe active à l'onglet cliqué
                tab.classList.add('active');
                
                // Retirer la classe active de tous les contenus d'onglets
                const allTabPanes = document.querySelectorAll('.avatar-tab-pane');
                allTabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Afficher le contenu de l'onglet sélectionné
                const tabContent = document.querySelector(`#${tabId}`);
                if (tabContent) {
                    tabContent.classList.add('active');
                    console.log('[Avatar Display] Onglet activé:', tabId);
                    
                    // Appliquer les strategySections si l'onglet Stratégie est activé
                    if (tabId === 'avatar-strategy-tab' && savedStrategySections) {
                        applyStrategySections(savedStrategySections);
                    }
                } else {
                    console.error('[Avatar Display] Contenu d\'onglet non trouvé:', tabId);
                }
            });
        });
        
        console.log('[Avatar Display] Onglets avatar initialisés avec succès');
    }
    
    // Fonction de test pour vérifier l'affichage des strategySections
    function testStrategyDisplay() {
        console.log('[TEST] Test de l\'affichage des sections de stratégie');
        
        const testProfile = {
            age: "25-35 ans",
            gender: "Femme",
            familyStatus: "En couple",
            fears: ["Test peur 1", "Test peur 2"],
            expectations: ["Test attente 1", "Test attente 2"],
            strategySections: {
                keyEmotions: "<ul><li>Test émotion 1</li><li>Test émotion 2</li></ul>",
                purchaseMotivations: "<ul><li>Test motivation 1</li><li>Test motivation 2</li></ul>",
                biologicalDrivers: "<ul><li>Test driver 1</li><li>Test driver 2</li></ul>",
                marketingAngles: "<ul><li>Test angle 1</li><li>Test angle 2</li></ul>",
                valueAddedMessages: "<ul><li>Test message 1</li><li>Test message 2</li></ul>"
            }
        };
        
        console.log('[TEST] Profil de test:', testProfile);
        updateAvatarProfile(testProfile);
        console.log('[TEST] Test terminé - vérifiez l\'onglet Stratégie');
    }

    // API publique
    return {
        createAvatarSection: createAvatarSection,
        updateAvatarProfile: updateAvatarProfile,
        updateStrategyContent: updateStrategyContent,
        syncStrategicSynthesis: syncStrategicSynthesis,
        initStrategicSynthesisObserver: initStrategicSynthesisObserver,
        testStrategyDisplay: testStrategyDisplay,
        updateMarketingAnglesTab: updateMarketingAnglesTab
    };
})();

// Exposer le module globalement
window.AvatarDisplay = AvatarDisplay;

// Note: L'observateur pour strategicSynthesis est désactivé car l'élément a été supprimé du DOM
// AvatarDisplay.initStrategicSynthesisObserver();

/**
 * Met à jour l'onglet des angles marketing avec les données générées
 * @param {string} marketingAnglesContent - Contenu des angles marketing généré par l'IA
 */
function updateMarketingAnglesTab(marketingAnglesContent) {
    console.log('[Avatar Display] Mise à jour de l\'onglet angles marketing');
    console.log('[Avatar Display] Contenu des angles marketing:', marketingAnglesContent);
    
    // Mettre à jour le contenu principal des angles marketing
    const marketingMainContent = document.getElementById('marketingMainContent');
    if (marketingMainContent) {
        // Parser le contenu pour extraire les angles individuels
        const angles = parseMarketingAnglesContent(marketingAnglesContent);
        
        // Créer l'HTML des cartes d'angles
        const anglesHTML = createMarketingAnglesCards(angles);
        
        // Afficher les cartes
        marketingMainContent.innerHTML = anglesHTML;
        
    } else {
        console.error('[Avatar Display] Élément marketingMainContent non trouvé');
    }
    
    console.log('[Avatar Display] Onglet angles marketing mis à jour avec succès');
}

/**
 * Parse le contenu des angles marketing pour extraire les angles individuels
 * @param {string} content - Contenu brut des angles marketing
 * @returns {Array} - Tableau des angles parsés
 */
function parseMarketingAnglesContent(content) {
    console.log('[Avatar Display] Parsing du contenu des angles marketing');
    
    try {
        const angles = [];
        
        // Pattern pour matcher les angles avec le nouveau format
        const anglePattern = /\*\*(ANGLE (?:PRINCIPAL|SECONDAIRE \d+))\*\*\s*\n?Titre\s*:\s*([^\n]+)\s*\n?Explication\s*:\s*([\s\S]*?)(?=\*\*ANGLE|$)/gi;
        
        let match;
        while ((match = anglePattern.exec(content)) !== null) {
            const [, typeAngle, titre, explication] = match;
            
            // Déterminer si c'est l'angle principal
            const isPrincipal = typeAngle.includes('PRINCIPAL');
            
            angles.push({
                type: typeAngle.trim(),
                titre: titre.trim(),
                explication: explication.trim(),
                isPrincipal: isPrincipal
            });
        }
        
        console.log('[Avatar Display] Angles parsés:', angles);
        return angles;
        
    } catch (error) {
        console.error('[Avatar Display] Erreur lors du parsing des angles marketing:', error);
        return [];
    }
}

/**
 * Crée l'HTML des cartes d'angles marketing
 * @param {Array} angles - Tableau des angles parsés
 * @returns {string} - HTML des cartes
 */
function createMarketingAnglesCards(angles) {
    if (!angles || angles.length === 0) {
        return `
            <div class="no-data-message">
                <i class="fas fa-info-circle"></i>
                <p>Aucun angle marketing identifié pour le moment.</p>
            </div>
        `;
    }
    
    let cardsHTML = '<div class="marketing-angles-grid">';
    
    angles.forEach((angle, index) => {
        const cardClass = angle.isPrincipal ? 'marketing-angle-card principal' : 'marketing-angle-card secondary';
        const iconClass = angle.isPrincipal ? 'fas fa-star' : 'fas fa-bullhorn';
        const badgeClass = angle.isPrincipal ? 'badge-principal' : 'badge-secondary';
        const badgeText = angle.isPrincipal ? 'Principal' : `Secondaire ${index}`;
        
        cardsHTML += `
            <div class="${cardClass}">
                <div class="angle-header">
                    <div class="angle-badge ${badgeClass}">
                        <i class="${iconClass}"></i>
                        ${badgeText}
                    </div>
                </div>
                <div class="angle-content">
                    <h4 class="angle-title">
                        <i class="fas fa-target"></i>
                        ${angle.titre}
                    </h4>
                    <div class="angle-explanation">
                        ${formatMarkdownToHtml(angle.explication)}
                    </div>
                </div>
            </div>
        `;
    });
    
    cardsHTML += '</div>';
    
    // Ajouter les styles CSS si pas déjà présents
    if (!document.querySelector('#marketing-angles-styles')) {
        cardsHTML += `
            <style id="marketing-angles-styles">
                .marketing-angles-grid {
                    display: grid;
                    gap: 20px;
                    margin-top: 20px;
                }
                
                .marketing-angle-card {
                    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
                    border-radius: 12px;
                    padding: 24px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    border: 1px solid #e9ecef;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                
                .marketing-angle-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                }
                
                .marketing-angle-card.principal {
                    border-left: 4px solid #007bff;
                    background: linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%);
                }
                
                .marketing-angle-card.secondary {
                    border-left: 4px solid #6c757d;
                }
                
                .angle-header {
                    margin-bottom: 16px;
                }
                
                .angle-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .badge-principal {
                    background: linear-gradient(135deg, #007bff, #0056b3);
                    color: white;
                }
                
                .badge-secondary {
                    background: linear-gradient(135deg, #6c757d, #495057);
                    color: white;
                }
                
                .angle-title {
                    margin: 0 0 16px 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: #212529;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .angle-title i {
                    color: #007bff;
                    font-size: 16px;
                }
                
                .angle-explanation {
                    font-size: 14px;
                    line-height: 1.6;
                    color: #495057;
                    text-align: justify;
                }
                
                .no-data-message {
                    text-align: center;
                    padding: 40px 20px;
                    color: #6c757d;
                }
                
                .no-data-message i {
                    font-size: 48px;
                    margin-bottom: 16px;
                    opacity: 0.5;
                }
                
                .loading-message {
                    text-align: center;
                    padding: 40px 20px;
                    color: #6c757d;
                }
                
                .loading-message i {
                    font-size: 32px;
                    margin-bottom: 12px;
                    color: #007bff;
                }
                
                .loading-message p {
                    font-size: 16px;
                    margin: 0;
                }
                
                @media (max-width: 768px) {
                    .marketing-angle-card {
                        padding: 16px;
                    }
                    
                    .angle-title {
                        font-size: 16px;
                    }
                    
                    .angle-explanation {
                        font-size: 13px;
                    }
                }
            </style>
        `;
    }
    
    return cardsHTML;
}

// Fonction pour convertir le markdown de base vers HTML
function formatMarkdownToHtml(text) {
    if (!text || typeof text !== 'string') {
        return text;
    }
    
    return text
        // Nettoyer les préfixes JSON parasites
        .replace(/^"?json\s*\{?\s*/i, '')
        .replace(/^\s*\{?\s*"[^"]*":\s*"/i, '')
        .replace(/"\s*\}?\s*$/i, '')
        
        // Convertir le gras (**text** → <strong>text</strong>)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        
        // Convertir l'italique (*text* → <em>text</em>)
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        
        // Convertir les listes à puces (- item → <li>item</li>)
        .replace(/^\s*-\s+(.+)$/gm, '<li>$1</li>')
        
        // Envelopper les groupes de <li> dans <ul>
        .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
        
        // Convertir les sauts de ligne doubles en paragraphes
        .replace(/\n\s*\n/g, '</p><p>')
        
        // Nettoyer les caractères d'échappement
        .replace(/\\n/g, '<br>')
        .replace(/\\"(.*?)\\"/g, '"$1"')
        
        // Nettoyer les espaces multiples
        .replace(/\s+/g, ' ')
        .trim();
}

// Fonction pour nettoyer et parser les données JSON corrompues
function cleanAndParseJson(data) {
    if (typeof data === 'object' && data !== null) {
        return data;
    }
    
    if (typeof data !== 'string') {
        return null;
    }
    
    // Nettoyer les préfixes/suffixes JSON parasites
    let cleaned = data
        .replace(/^"?json\s*/i, '')
        .replace(/^"?\s*/, '')
        .replace(/\s*"?$/, '')
        .trim();
    
    // Essayer de parser comme JSON
    if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
        try {
            return JSON.parse(cleaned);
        } catch (e) {
            console.warn('[Avatar Display] Échec du parsing JSON, traitement comme texte:', e);
        }
    }
    
    return null;
}

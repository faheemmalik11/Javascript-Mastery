/**
 * Avatar Profile Generator
 * Analyse la deep research pour extraire les informations du profil avatar
 */

// Fonction principale pour extraire et afficher le profil avatar
// Exposée globalement pour être accessible depuis main.js
window.generateAvatarProfile = async function(deepResearch, productName, aiModel = 'chatgpt') {
    console.log('[Avatar] === DÉBUT GÉNÉRATION PROFIL AVATAR ===');
    console.log('[Avatar] Deep Research reçu:', deepResearch ? deepResearch.substring(0, 200) + '...' : 'VIDE');
    console.log('[Avatar] Nom du produit:', productName);
    console.log('[Avatar] Modèle AI utilisé:', aiModel);
    console.log('[Avatar] Timestamp:', new Date().toISOString());
    
    // Récupérer l'angle marketing sélectionné
    const selectedMarketingAngle = window.selectedMarketingAngle;
    console.log('[Avatar] Angle marketing sélectionné:', selectedMarketingAngle);
    
    try {
        // Vérifier que nous avons au minimum quelque chose
        if (!deepResearch || deepResearch.trim() === '') {
            console.warn('[Avatar] Deep research complètement vide, utilisation du profil par défaut');
            return getDefaultProfile();
        }
        
        // Utiliser la nouvelle implémentation pour afficher la section avatar
        if (window.AvatarDisplay && typeof window.AvatarDisplay.createAvatarSection === 'function') {
            console.log('[Avatar] Utilisation de la nouvelle implémentation AvatarDisplay');
            window.AvatarDisplay.createAvatarSection();
        } else {
            console.error('[Avatar] Module AvatarDisplay non disponible');
            // Fallback à l'ancienne méthode
            const avatarSection = document.getElementById('avatarProfileSection');
            if (avatarSection) {
                avatarSection.style.display = 'block';
                console.log('[Avatar] Section avatar affichée (méthode fallback)');
            } else {
                console.error('[Avatar] Section avatar introuvable');
            }
        }
        
        // Extraire le profil en utilisant l'API ChatGPT (qui retournera "X" si données insuffisantes)
        console.log('[Avatar] Appel de simulateAvatarProfileExtraction...');
        try {
            const profile = await simulateAvatarProfileExtraction(deepResearch, productName, aiModel, selectedMarketingAngle);
            console.log('[Avatar] Profil avatar extrait avec succès:', profile);
            console.log('[Avatar] === FIN GÉNÉRATION PROFIL AVATAR ===');
            return profile;
        } catch (extractionError) {
            console.error('[Avatar] Erreur dans simulateAvatarProfileExtraction:', extractionError);
            console.error('[Avatar] Stack trace:', extractionError.stack);
            throw extractionError;
        }
        
    } catch (error) {
        console.error('[Avatar] Erreur lors de la génération du profil avatar:', error);
        console.error('[Avatar] Type d\'erreur:', typeof error);
        console.error('[Avatar] Stack trace:', error.stack);
        // Retourner un profil par défaut avec "X" pour indiquer que les données n'ont pas pu être extraites
        return getDefaultProfile();
    }
};

// Fonction pour extraire le profil avatar en utilisant l'API ChatGPT
async function simulateAvatarProfileExtraction(deepResearch, productName, aiModel, selectedMarketingAngle) {
    console.log('[Avatar] === DÉBUT simulateAvatarProfileExtraction ===');
    console.log('[Avatar] Paramètres reçus - deepResearch length:', deepResearch ? deepResearch.length : 'null');
    console.log('[Avatar] Paramètres reçus - productName:', productName);
    console.log('[Avatar] Paramètres reçus - aiModel:', aiModel);
    console.log('[Avatar] Paramètres reçus - selectedMarketingAngle:', selectedMarketingAngle);
    console.log('[Avatar] Début de l\'extraction du profil avatar');
    
    try {
        // Essayer d'extraire l'analyse psychologique du deepResearch s'il est en format JSON
        let psychologicalAnalysisData = null;
        
        if (deepResearch && deepResearch.trim().startsWith('{')) {
            try {
                const parsedResearch = JSON.parse(deepResearch);
                console.log('[Avatar] Deep research parsé comme JSON:', parsedResearch);
                
                // Extraire l'analyse psychologique si elle existe
                if (parsedResearch.psychologicalAnalysis || 
                    (parsedResearch.mainProfile && parsedResearch.emotionsToEvoke)) {
                    
                    psychologicalAnalysisData = parsedResearch.psychologicalAnalysis || {
                        mainProfile: parsedResearch.mainProfile,
                        emotionsToEvoke: parsedResearch.emotionsToEvoke,
                        targetedFears: parsedResearch.targetedFears || [],
                        expectations: parsedResearch.expectations || []
                    };
                    
                    console.log('[Avatar] Analyse psychologique extraite:', psychologicalAnalysisData);
                    
                    // Transformer en profil avatar directement
                    const transformedProfile = transformPsychologicalToAvatar(psychologicalAnalysisData);
                    console.log('[Avatar] Profil transformé depuis JSON:', transformedProfile);
                    return transformedProfile;
                }
            } catch (jsonError) {
                console.log('[Avatar] Deep research n\'est pas du JSON valide, traitement comme texte normal');
            }
        }
        
        // Fonction centralisée pour générer le prompt
        function generatePromptInstructions() {
            const marketingAngleContext = selectedMarketingAngle ? 
                `\n\nANGLE MARKETING SÉLECTIONNÉ : ${selectedMarketingAngle.name} - ${selectedMarketingAngle.description}\nCet angle marketing doit influencer ton analyse du profil acheteur. Adapte tes déductions en fonction de cet angle spécifique.` : 
                '';
                
            return `En tant qu'expert en analyse comportementale et marketing, analyse cette description détaillée d'un produit et de son marché cible pour identifier le profil type de l'acheteur.${marketingAngleContext}

INSTRUCTIONS POUR L'EXTRACTION :
1. EXTRAIS toutes les informations démographiques explicites ou clairement déductibles du contenu
2. Utilise les mentions de groupes d'âge (milléniaux, jeunes professionnels, retraités, etc.) pour estimer l'âge
3. Utilise les tendances de genre mentionnées (ex: "les femmes sont plus susceptibles de...")
4. Base-toi sur le contexte produit et les comportements décrits pour identifier les motivations
5. ADAPTE ton analyse en fonction de l'angle marketing sélectionné si fourni
6. Seulement répondre "X" si l'information est vraiment absente ou impossible à déduire

RÈGLES POUR CHAQUE CHAMP :
- ÂGE :  Estime l'âge médian de l'acheteur en te basant sur toutes les informations disponibles dans la recherche, même si aucune tranche d'âge n'est explicitement mentionnée. Utilise le format 'XX ans'. Si vraiment aucune estimation cohérente n'est possible, réponds 'X'.
- GENRE : Estime si le produit ou son contexte s'adresse majoritairement à un public masculin ou féminin en te basant sur l'ensemble des comportements, émotions ou références culturelles évoquées dans le texte. Réponds par "Homme" ou "Femme". Si aucune tendance claire ne se dégage, réponds "X".
- STATUT FAMILIAL : Déduis le statut familial dominant (par exemple : "Célibataire sans enfant", "Couple sans enfant", "Parent avec jeunes enfants", "Retraité" etc.) à partir des styles de vie, responsabilités évoquées ou motivations décrites dans le texte. Si aucune information cohérente ne permet une estimation, réponds "X".
- PEURS : Tu DOIS identifier et lister EXACTEMENT 5 PEURS DISTINCTES ET LIÉES AU PRODUIT. Voici le format OBLIGATOIRE avec 5 éléments :
  1. [Première peur spécifique]
  2. [Deuxième peur spécifique] 
  3. [Troisième peur spécifique]
  4. [Quatrième peur spécifique]
  5. [Cinquième peur spécifique]
  IMPORTANT: Si tu n'identifies que 3 peurs dans le texte, tu DOIS en créer 2 supplémentaires liées au type de produit. Ces peurs doivent être réalistes et cohérentes avec le produit.
- ATTENTES : Tu DOIS dresser une liste de EXACTEMENT 5 ATTENTES DISTINCTES ET LIÉES AU PRODUIT. Voici le format OBLIGATOIRE avec 5 éléments :
  1. [Première attente spécifique]
  2. [Deuxième attente spécifique]
  3. [Troisième attente spécifique] 
  4. [Quatrième attente spécifique]
  5. [Cinquième attente spécifique]
  IMPORTANT: Si tu n'identifies que 3 attentes dans le texte, tu DOIS en créer 2 supplémentaires liées au type de produit. Ces attentes doivent être réalistes et cohérentes avec le produit.
`;
        }

        // Construire le prompt complet
        const promptInstructions = generatePromptInstructions();
        const fullPrompt = `${promptInstructions}

Voici la description détaillée à analyser: ${deepResearch}

Réponds UNIQUEMENT dans ce format JSON sans aucune explication supplémentaire, commentaire ou texte avant ou après le JSON.
OBLIGATOIRE: Les tableaux "fears" et "expectations" doivent contenir EXACTEMENT 5 éléments chacun (pas 3, pas 4, mais 5):
{
  "age": "âge spécifique avec 'ans'",
  "gender": "Homme ou Femme",
  "familyStatus": "Situation familiale identifiée",
  "fears": [
    "Première peur spécifique liée au produit",
    "Deuxième peur spécifique liée au produit", 
    "Troisième peur spécifique liée au produit",
    "Quatrième peur spécifique liée au produit",
    "Cinquième peur spécifique liée au produit"
  ],
  "expectations": [
    "Premier bénéfice spécifique du produit",
    "Deuxième bénéfice spécifique du produit",
    "Troisième bénéfice spécifique du produit", 
    "Quatrième bénéfice spécifique du produit",
    "Cinquième bénéfice spécifique du produit"
  ]
}

RAPPEL CRITIQUE: Tu DOIS absolument retourner EXACTEMENT 5 peurs et 5 attentes dans le JSON. Si tu n'en trouves que 3 dans le texte, invente-en 2 autres cohérentes avec le produit.`;
        
        console.log('[Avatar] Prompt envoyé à ChatGPT (extrait):', fullPrompt.substring(0, 500) + '...');
        console.log('[Avatar] Longueur du prompt:', fullPrompt.length);
        console.log('[Avatar] Deep research utilisé (extrait):', deepResearch.substring(0, 300) + '...');
        
        // Si le prompt est trop long, le tronquer intelligemment
        let finalPrompt = fullPrompt;
        if (fullPrompt.length > 12000) { // Réduire la limite pour forcer une troncature plus agressive
            console.warn('[Avatar] Prompt trop long, troncature intelligente...');
            
            // Vérifier que deepResearch existe et est valide
            if (!deepResearch || typeof deepResearch !== 'string') {
                console.error('[Avatar] deepResearch invalide pour la troncature, utilisation du prompt complet tronqué');
                finalPrompt = fullPrompt.substring(0, 12000);
            } else {
                // Utiliser la même fonction centralisée pour la troncature
                const beforeResearch = `${promptInstructions}

Voici la description détaillée à analyser: `;
                
                const afterResearch = `

Réponds UNIQUEMENT dans ce format JSON sans aucune explication supplémentaire, commentaire ou texte avant ou après le JSON.
OBLIGATOIRE: Les tableaux "fears" et "expectations" doivent contenir EXACTEMENT 5 éléments chacun (pas 3, pas 4, mais 5):
{
  "age": "âge spécifique avec 'ans'",
  "gender": "Homme ou Femme",
  "familyStatus": "Situation familiale identifiée",
  "fears": [
    "Première peur spécifique liée au produit",
    "Deuxième peur spécifique liée au produit", 
    "Troisième peur spécifique liée au produit",
    "Quatrième peur spécifique liée au produit",
    "Cinquième peur spécifique liée au produit"
  ],
  "expectations": [
    "Premier bénéfice spécifique du produit",
    "Deuxième bénéfice spécifique du produit",
    "Troisième bénéfice spécifique du produit", 
    "Quatrième bénéfice spécifique du produit",
    "Cinquième bénéfice spécifique du produit"
  ]
}

RAPPEL CRITIQUE: Tu DOIS absolument retourner EXACTEMENT 5 peurs et 5 attentes dans le JSON. Si tu n'en trouves que 3 dans le texte, invente-en 2 autres cohérentes avec le produit.`;
                
                // Calculer l'espace disponible pour deepResearch
                const availableSpace = 12000 - beforeResearch.length - afterResearch.length - 500; // Plus de marge
                
                // Vérifier que nous avons assez d'espace
                if (availableSpace > 1000 && deepResearch.length > availableSpace) {
                    // Tronquer deepResearch en gardant seulement le début (plus important)
                    const truncatedResearch = deepResearch.substring(0, availableSpace) + 
                                            '\n\n[...TEXTE TRONQUÉ - ANALYSE BASÉE SUR LE DÉBUT DU TEXTE...]';
                    
                    finalPrompt = beforeResearch + truncatedResearch + afterResearch;
                } else {
                    finalPrompt = fullPrompt;
                }
            }
            
            console.log('[Avatar] Prompt tronqué, nouvelle longueur:', finalPrompt.length, 'caractères');
        }
        
        // Utiliser la fonction callOpenAI existante
        console.log('[Avatar] Appel de la fonction callOpenAI...');
        console.log('[Avatar] Vérification de la disponibilité de callOpenAI:', typeof callOpenAI);
        
        if (typeof callOpenAI !== 'function') {
            throw new Error('La fonction callOpenAI n\'est pas disponible');
        }
        
        console.log('[Avatar] Prompt final envoyé (premiers 1000 chars):', finalPrompt.substring(0, 1000));
        
        let response;
        try {
            // Récupérer le modèle AI sélectionné depuis l'interface
            const aiModelUsed = aiModel;
            response = await callOpenAI(finalPrompt, 0.7, 1500, aiModelUsed);
        } catch (apiError) {
            console.error('[Avatar] Erreur lors de l\'appel à callOpenAI:', apiError);
            throw new Error(`Erreur API: ${apiError.message}`);
        }
        
        console.log('[Avatar] Réponse reçue du serveur backend (complète):', response);
        
        // Vérifier si la réponse est directement l'objet JSON ou si elle est dans response.content
        let chatGptResponse;
        if (response && response.content) {
            console.log('[Avatar] Contenu brut de la réponse:', response.content);
            console.log('[Avatar] Type du contenu:', typeof response.content);
            console.log('[Avatar] Longueur du contenu:', response.content.length);
            
            // Debug: Afficher la réponse brute avant parsing
            console.log('[Avatar] === DEBUG RÉPONSE BRUTE ===');
            console.log('[Avatar] Réponse complète:', response.content);
            console.log('[Avatar] === FIN DEBUG RÉPONSE BRUTE ===');
            
            // Debug: Afficher la réponse brute avant parsing
            console.log('[Avatar] === DEBUG RÉPONSE BRUTE STRING ===');
            console.log('[Avatar] Réponse complète (string):', response.content);
            console.log('[Avatar] === FIN DEBUG RÉPONSE BRUTE STRING ===');
            
            chatGptResponse = JSON.parse(response.content);
        } else {
            // La réponse est directement l'objet JSON
            console.log('[Avatar] Réponse directe (objet JSON):', response);
            chatGptResponse = response;
        }
        
        console.log('[Avatar] Profil parsé avec succès:', chatGptResponse);
        
        // Ajouter l'analyse psychologique extraite au profil si elle existe
        if (psychologicalAnalysisData) {
            // S'assurer que l'analyse psychologique est un objet et non un string JSON
            if (typeof psychologicalAnalysisData === 'string') {
                try {
                    psychologicalAnalysisData = JSON.parse(psychologicalAnalysisData);
                    console.log('[Avatar] Analyse psychologique parsée depuis string JSON:', psychologicalAnalysisData);
                } catch (parseError) {
                    console.error('[Avatar] Erreur lors du parsing de l\'analyse psychologique:', parseError);
                    console.error('[Avatar] Contenu de l\'analyse psychologique:', psychologicalAnalysisData);
                    // Garder comme string si le parsing échoue
                }
            }
            
            chatGptResponse.psychologicalAnalysis = psychologicalAnalysisData;
            console.log('[Avatar] Analyse psychologique ajoutée au profil:', chatGptResponse.psychologicalAnalysis);
        }
        
        // Traitement de la réponse de ChatGPT
        const finalProfile = await processChatGptResponse(chatGptResponse, deepResearch, productName, aiModel);
        console.log('[Avatar] Profil final après traitement:', finalProfile);
        
        // Mettre à jour l'interface utilisateur avec le profil
        if (window.AvatarDisplay && typeof window.AvatarDisplay.updateAvatarProfile === 'function') {
            window.AvatarDisplay.updateAvatarProfile(finalProfile);
        }
        
        return finalProfile;
        
    } catch (error) {
        console.error('[Avatar] Erreur lors du traitement du profil:');
        console.error('[Avatar] Message d\'erreur:', error.message);
        console.error('[Avatar] Stack trace:', error.stack);
        console.error('[Avatar] Erreur complète:', error);
        
        // Enregistrer l'erreur dans les logs de debug
        if (window.debugLogger) {
            window.debugLogger.error('Erreur traitement réponse ChatGPT', {
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
        }
        
        // En cas d'erreur, utiliser un profil par défaut
        return getDefaultProfile();
    }
}

// Fonction pour traiter la réponse de ChatGPT et la normaliser
async function processChatGptResponse(chatGptResponse, deepResearch, productName, aiModel) {
    console.log('[Avatar] Début du traitement de la réponse de ChatGPT:', chatGptResponse);
    
    // Valeurs par défaut en cas de problème
    const defaultValues = {
        age: 'X',
        gender: 'X',
        familyStatus: 'X',
        fears: [],
        expectations: []
    };
    
    try {
        // Extraire les valeurs brutes
        // D'abord, vérifier si c'est une chaîne JSON et la parser si nécessaire
        let parsedResponse = chatGptResponse;
        if (typeof chatGptResponse === 'string') {
            try {
                parsedResponse = JSON.parse(chatGptResponse);
                console.log('[Avatar] JSON parsé avec succès pour les valeurs de base:', parsedResponse);
            } catch (e) {
                console.error('[Avatar] Erreur lors du parsing JSON pour les valeurs de base:', e);
                parsedResponse = chatGptResponse;
            }
        }
        
        const rawAge = parsedResponse?.age || defaultValues.age;
        const rawGender = parsedResponse?.gender || defaultValues.gender;
        const rawFamilyStatus = parsedResponse?.familyStatus || defaultValues.familyStatus;
        
        // DEBUG DÉTAILLÉ POUR LES PEURS ET ATTENTES
        console.log('[Avatar] === DEBUG EXTRACTION PEURS ET ATTENTES ===');
        console.log('[Avatar] Type de chatGptResponse:', typeof chatGptResponse);
        console.log('[Avatar] chatGptResponse brut:', chatGptResponse);
        
        // Vérifier si c'est une chaîne JSON et la parser si nécessaire
        if (typeof chatGptResponse === 'string') {
            try {
                parsedResponse = JSON.parse(chatGptResponse);
                console.log('[Avatar] JSON parsé avec succès:', parsedResponse);
            } catch (e) {
                console.error('[Avatar] Erreur lors du parsing JSON:', e);
                parsedResponse = chatGptResponse;
            }
        }
        
        console.log('[Avatar] parsedResponse.fears existe?', parsedResponse && typeof parsedResponse === 'object' && 'fears' in parsedResponse);
        console.log('[Avatar] parsedResponse.fears type:', typeof parsedResponse?.fears);
        console.log('[Avatar] parsedResponse.fears valeur:', parsedResponse?.fears);
        console.log('[Avatar] parsedResponse.expectations existe?', parsedResponse && typeof parsedResponse === 'object' && 'expectations' in parsedResponse);
        console.log('[Avatar] parsedResponse.expectations type:', typeof parsedResponse?.expectations);
        console.log('[Avatar] parsedResponse.expectations valeur:', parsedResponse?.expectations);
        console.log('[Avatar] === FIN DEBUG EXTRACTION ===');
        
        let rawFears = parsedResponse?.fears || defaultValues.fears;
        let rawExpectations = parsedResponse?.expectations || defaultValues.expectations;
        
        // Validation des peurs et attentes sans complétion automatique
        if (!Array.isArray(rawFears)) {
            rawFears = [];
        }
        if (!Array.isArray(rawExpectations)) {
            rawExpectations = [];
        }
        
        console.log('[Avatar] === DEBUG PEURS ET ATTENTES REÇUES ===');
        console.log('[Avatar] Nombre de peurs reçues de ChatGPT:', rawFears.length);
        console.log('[Avatar] Peurs brutes:', rawFears);
        console.log('[Avatar] Nombre d\'attentes reçues de ChatGPT:', rawExpectations.length);
        console.log('[Avatar] Attentes brutes:', rawExpectations);
        console.log('[Avatar] === FIN DEBUG PEURS ET ATTENTES ===');
        
        // VÉRIFICATION CRITIQUE : Détecter si nous avons moins de 5 éléments
        if (rawFears.length < 5) {
            console.error('[Avatar] ⚠️  PROBLÈME DÉTECTÉ : Seulement', rawFears.length, 'peurs reçues au lieu de 5 !');
            console.error('[Avatar] ⚠️  Le modèle IA n\'a pas respecté les instructions du prompt');
            console.error('[Avatar] ⚠️  Peurs reçues:', rawFears);
        }
        
        if (rawExpectations.length < 5) {
            console.error('[Avatar] ⚠️  PROBLÈME DÉTECTÉ : Seulement', rawExpectations.length, 'attentes reçues au lieu de 5 !');
            console.error('[Avatar] ⚠️  Le modèle IA n\'a pas respecté les instructions du prompt');
            console.error('[Avatar] ⚠️  Attentes reçues:', rawExpectations);
        }
        
        if (rawFears.length === 5 && rawExpectations.length === 5) {
            console.log('[Avatar] ✅ SUCCÈS : 5 peurs et 5 attentes reçues comme demandé !');
        }
        
        // Traitement de l'âge
        let processedAge = rawAge;
        if (typeof rawAge === 'string') {
            const ageStr = rawAge.toLowerCase().trim();
            console.log('[Avatar] Âge nettoyé pour conversion:', ageStr);
            
            // Essayer d'extraire un nombre de la chaîne
            const ageMatch = ageStr.match(/(\d+)/);
            if (ageMatch) {
                const ageNumber = parseInt(ageMatch[1]);
                if (!isNaN(ageNumber) && ageNumber >= 10 && ageNumber <= 100) {
                    processedAge = ageNumber + ' ans';
                    console.log('[Avatar] Âge converti avec succès:', processedAge);
                } else {
                    console.warn('[Avatar] Âge hors limites:', ageNumber);
                    processedAge = defaultValues.age;
                }
            } else if (ageStr.includes('information manquante') || ageStr.includes('non spécifié') || ageStr === 'x') {
                console.warn('[Avatar] Âge non spécifié dans la réponse');
                processedAge = defaultValues.age;
            } else {
                console.warn('[Avatar] Impossible de convertir l\'âge en nombre:', ageStr);
                processedAge = defaultValues.age;
            }
        }
        
        // Traitement du genre
        let processedGender = rawGender;
        if (typeof rawGender === 'string') {
            const genderStr = rawGender.toLowerCase().trim();
            console.log('[Avatar] Genre à convertir:', genderStr);
            
            if (genderStr.includes('homme') || genderStr.includes('masculin') || genderStr === 'h') {
                processedGender = 'Homme';
            } else if (genderStr.includes('femme') || genderStr.includes('féminin') || genderStr === 'f') {
                processedGender = 'Femme';
            } else if (genderStr.includes('information manquante') || genderStr.includes('non spécifié') || genderStr === 'x') {
                console.warn('[Avatar] Genre non spécifié dans la réponse');
                processedGender = defaultValues.gender;
            } else {
                console.warn('[Avatar] Genre non reconnu:', rawGender);
                processedGender = defaultValues.gender;
            }
        }
        
        // Traitement des peurs
        let processedFears = rawFears;
        if (Array.isArray(rawFears)) {
            console.log('[Avatar] Peurs brutes:', rawFears);
            processedFears = rawFears.filter(fear => 
                fear && 
                typeof fear === 'string' && 
                fear.trim() !== '' && 
                !fear.toLowerCase().includes('information manquante') &&
                !fear.toLowerCase().includes('non spécifié')
            );
        } else {
            console.warn('[Avatar] Peurs non valides, utilisation des valeurs par défaut');
            processedFears = defaultValues.fears;
        }
        
        // Traitement des attentes
        let processedExpectations = rawExpectations;
        if (Array.isArray(rawExpectations)) {
            console.log('[Avatar] Attentes brutes:', rawExpectations);
            processedExpectations = rawExpectations.filter(expectation => 
                expectation && 
                typeof expectation === 'string' && 
                expectation.trim() !== '' && 
                !expectation.toLowerCase().includes('information manquante') &&
                !expectation.toLowerCase().includes('non spécifié')
            );
        } else {
            console.warn('[Avatar] Attentes non valides, utilisation des valeurs par défaut');
            processedExpectations = defaultValues.expectations;
        }
        
        // Construire le profil final
        const finalProfile = {
            age: processedAge,
            gender: processedGender,
            familyStatus: rawFamilyStatus,
            fears: processedFears,
            expectations: processedExpectations
        };
        
        // Ajouter les données de stratégie si la fonction est disponible
        if (window.generateStrategySections && typeof window.generateStrategySections === 'function') {
            console.log('[Avatar] Génération des données de stratégie...');
            try {
                const strategySections = await window.generateStrategySections(deepResearch, productName, aiModel);
                finalProfile.strategySections = strategySections;
                console.log('[Avatar] Données de stratégie ajoutées au profil:', strategySections);
            } catch (error) {
                console.error('[Avatar] Erreur lors de la génération des données de stratégie:', error);
                finalProfile.strategySections = window.getDefaultStrategySections ? window.getDefaultStrategySections() : {};
            }
        } else {
            console.warn('[Avatar] Fonction generateStrategySections non disponible');
            finalProfile.strategySections = window.getDefaultStrategySections ? window.getDefaultStrategySections() : {};
        }
        
        console.log('[Avatar] Profil final après traitement:', finalProfile);
        
        // Log des transformations pour debug
        console.log('[Avatar] Réponse traitée pour affichage:');
        console.log('- Âge:', `"${rawAge}" => "${processedAge}"`);
        console.log('- Sexe:', `"${rawGender}" => "${processedGender}"`);
        console.log('- Situation familiale:', `"${rawFamilyStatus}" => "${rawFamilyStatus}"`);
        console.log('- Peurs: ', rawFears, ' => ', processedFears);
        console.log('- Attentes: ', rawExpectations, ' => ', processedExpectations);
        
        return finalProfile;
        
    } catch (error) {
        console.error('[Avatar] Erreur lors du traitement de la réponse:');
        console.error('[Avatar] Message d\'erreur:', error.message);
        console.error('[Avatar] Stack trace:', error.stack);
        console.error('[Avatar] Erreur complète:', error);
        
        // Enregistrer l'erreur dans les logs de debug
        if (window.debugLogger) {
            window.debugLogger.error('Erreur traitement réponse ChatGPT', {
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
        }
        
        return defaultValues;
    }
}

// Fonction pour afficher les informations du profil avatar
function displayAvatarProfile(profile) {
    console.log('[Avatar] Affichage du profil avatar:', profile);
    
    // Vérifier si la section avatar existe
    const avatarSection = document.getElementById('avatarProfileSection');
    if (!avatarSection) {
        console.error('[Avatar] Section avatar introuvable dans le DOM');
        return;
    }
    
    // Afficher la section
    avatarSection.style.display = 'block';
    
    // Mettre à jour les éléments du profil
    updateProfileElement('avatarAge', profile.age, getAgeEmoji(profile.age));
    updateProfileElement('avatarGender', profile.gender, profile.gender === 'Homme' ? '👨' : profile.gender === 'Femme' ? '👩' : '❓');
    updateProfileElement('avatarFamily', profile.familyStatus, getFamilyEmoji(profile.familyStatus));
    
    // Mettre à jour les peurs
    updateProfileList('avatarFears', profile.fears, getFearIcon);
    
    // Mettre à jour les attentes
    updateProfileList('avatarExpectations', profile.expectations, getExpectationIcon);
    
    console.log('[Avatar] Profil avatar affiché avec succès');
}

// Fonction utilitaire pour mettre à jour un élément du profil
function updateProfileElement(elementId, value, emoji = '') {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `${emoji} ${value}`;
        console.log(`[Avatar] Élément ${elementId} mis à jour:`, value);
    } else {
        console.warn(`[Avatar] Élément ${elementId} introuvable`);
    }
}

// Fonction utilitaire pour mettre à jour une liste du profil
function updateProfileList(elementId, items, iconFunction) {
    const element = document.getElementById(elementId);
    if (element) {
        const listHTML = items.map(item => `<li>${iconFunction(item)} ${item}</li>`).join('');
        element.innerHTML = `<ul>${listHTML}</ul>`;
        console.log(`[Avatar] Liste ${elementId} mise à jour:`, items);
    } else {
        console.warn(`[Avatar] Liste ${elementId} introuvable`);
    }
}

// Fonction pour obtenir l'emoji approprié en fonction de l'âge
function getAgeEmoji(age) {
    if (typeof age === 'string') {
        const ageStr = age.toLowerCase();
        if (ageStr.includes('x') || ageStr.includes('non spécifié')) {
            return '❓';
        }
        
        const ageNumber = parseInt(age);
        if (!isNaN(ageNumber)) {
            if (ageNumber < 25) return '👶';
            if (ageNumber < 35) return '👨‍💼';
            if (ageNumber < 50) return '👨‍🦳';
            if (ageNumber < 65) return '👨‍🦲';
            return '👴';
        }
    }
    return '❓';
}

// Fonction pour obtenir l'emoji approprié pour la situation familiale
function getFamilyEmoji(familyStatus) {
    if (typeof familyStatus === 'string') {
        const status = familyStatus.toLowerCase();
        if (status.includes('célibataire')) return '🙋';
        if (status.includes('couple') || status.includes('marié')) {
            if (status.includes('enfant')) return '👨‍👩‍👧‍👦';
            return '💑';
        }
        if (status.includes('enfant')) return '👨‍👩‍👧‍👦';
    }
    return '👤';
}

// Fonction pour obtenir l'icône appropriée pour une peur
function getFearIcon(fear) {
    if (typeof fear === 'string') {
        const fearStr = fear.toLowerCase();
        if (fearStr.includes('prix') || fearStr.includes('coût') || fearStr.includes('cher')) return '💰';
        if (fearStr.includes('difficulté') || fearStr.includes('complexe')) return '🤔';
        if (fearStr.includes('temps') || fearStr.includes('durée')) return '⏰';
        if (fearStr.includes('résultat') || fearStr.includes('efficacité')) return '📊';
        if (fearStr.includes('sécurité') || fearStr.includes('risque')) return '🔒';
        if (fearStr.includes('qualité')) return '⭐';
    }
    return '⚠️';
}

// Fonction pour obtenir l'icône appropriée pour une attente
function getExpectationIcon(expectation) {
    if (typeof expectation === 'string') {
        const expectationStr = expectation.toLowerCase();
        if (expectationStr.includes('temps') || expectationStr.includes('rapidité')) return '⚡';
        if (expectationStr.includes('qualité') || expectationStr.includes('professionnel')) return '⭐';
        if (expectationStr.includes('facilité') || expectationStr.includes('simple')) return '✨';
        if (expectationStr.includes('résultat') || expectationStr.includes('efficacité')) return '🎯';
        if (expectationStr.includes('économie') || expectationStr.includes('gain')) return '💰';
        if (expectationStr.includes('satisfaction')) return '😊';
    }
    return '🎯';
}

// Fonction pour vider le cache et forcer une nouvelle génération
function clearAvatarCache() {
    console.log('[Avatar] Vidage du cache avatar');
    // Vider localStorage si utilisé
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.includes('avatar') || key.includes('profile')) {
            localStorage.removeItem(key);
            console.log('[Avatar] Cache supprimé:', key);
        }
    });
}

// Exposer la fonction globalement
window.clearAvatarCache = clearAvatarCache;

// Fonction pour retourner un profil par défaut
function getDefaultProfile() {
    return {
        age: 'X',
        gender: 'X',
        familyStatus: 'X',
        fears: [],
        expectations: []
    };
}

// Exposer la fonction globalement
window.getDefaultProfile = getDefaultProfile;

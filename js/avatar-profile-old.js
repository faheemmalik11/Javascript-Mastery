/**
 * Avatar Profile Generator
 * Analyse la deep research pour extraire les informations du profil avatar
 */

// Fonction principale pour extraire et afficher le profil avatar
// Exposée globalement pour être accessible depuis main.js
window.generateAvatarProfile = async function(deepResearch, productName) {
    console.log('[Avatar] Début de l\'analyse du profil avatar');
    
    try {
        // Utiliser la nouvelle implémentation pour afficher la section avatar
        if (window.avatarDisplay && typeof window.avatarDisplay.createAvatarSection === 'function') {
            console.log('[Avatar] Utilisation de la nouvelle implémentation avatarDisplay');
            window.avatarDisplay.createAvatarSection();
        } else {
            console.error('[Avatar] Module avatarDisplay non disponible');
            // Fallback à l'ancienne méthode
            const avatarSection = document.getElementById('avatarProfileSection');
            if (avatarSection) {
                avatarSection.style.display = 'block';
                console.log('[Avatar] Section avatar affichée (méthode fallback)');
            } else {
                console.error('[Avatar] Section avatar introuvable');
            }
        }
        
        // Simuler l'extraction du profil (à remplacer par un appel API réel)
        const profile = await simulateAvatarProfileExtraction(deepResearch, productName);
        console.log('[Avatar] Profil avatar extrait avec succès:', profile);
        return profile;
        
    } catch (error) {
        console.error('[Avatar] Erreur lors de la génération du profil avatar:', error);
        // Retourner un profil par défaut avec "X" pour indiquer que les données n'ont pas pu être extraites
        const defaultProfile = {
            age: "X",
            gender: "X",
            familyStatus: "X",
            fears: [
                "X",
                "X",
                "X",
                "X",
                "X"
            ],
            expectations: [
                "X",
                "X",
                "X",
                "X",
                "X"
            ]
        };
        
        displayAvatarProfile(defaultProfile);
        return defaultProfile;
    }
}

// Fonction pour simuler l'extraction du profil avatar (à remplacer par un appel API réel)
async function simulateAvatarProfileExtraction(deepResearch, productName) {
    try {
        // Vérifier si deepResearch est défini
        if (!deepResearch || typeof deepResearch !== 'string' || deepResearch.trim() === '') {
            console.error('[Avatar] Erreur: deepResearch est undefined, vide ou n\'est pas une chaîne de caractères');
            throw new Error('Deep research invalide ou manquante');
        }
        
        console.log('[Avatar] Début de l\'analyse du texte:', deepResearch.substring(0, 100) + '...');
        
        // Simuler un délai de traitement
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Analyser le texte pour déterminer le type de produit et le profil correspondant
        const text = deepResearch.toLowerCase();
        console.log('[Avatar] Analyse du texte pour extraire le profil:', text);
        
        // Créer un profil par défaut avec des valeurs "X"
        const profile = {
            age: "X",
            gender: "X",
            familyStatus: "X",
            fears: ["X", "X", "X", "X", "X"],
            expectations: ["X", "X", "X", "X", "X"]
        };
        
        // Si le texte est trop court, retourner le profil par défaut
        if (text.length < 10) {
            console.warn('[Avatar] Texte trop court pour extraire un profil fiable');
            return profile;
        }
        
        // Extraire l'âge - recherche plus flexible
        console.log('[Avatar] Recherche d\'informations sur l\'\u00e2ge dans:', text);
        
        // Utiliser des expressions régulières pour trouver les mentions d'âge
        const ageRegex = /age\s+is\s+(\d+)|age\s*:\s*(\d+)|(\d+)\s*ans|(\d+)\s*years\s*old/i;
        const ageMatch = text.match(ageRegex);
        
        if (ageMatch) {
            // Trouver le premier groupe non-null dans le match (qui contient l'âge)
            const age = ageMatch[1] || ageMatch[2] || ageMatch[3] || ageMatch[4];
            console.log('[Avatar] Âge trouvé dans le texte:', age);
            
            // Convertir l'âge en tranche d'âge
            const ageNum = parseInt(age, 10);
            if (ageNum <= 25) {
                profile.age = "18-25 ans";
                console.log('[Avatar] Âge détecté: 18-25 ans');
            } else if (ageNum <= 45) {
                profile.age = "30-45 ans";
                console.log('[Avatar] Âge détecté: 30-45 ans');
            } else {
                profile.age = "50-65 ans";
                console.log('[Avatar] Âge détecté: 50-65 ans');
            }
        } else if (text.includes("jeune") || text.includes("étudiant")) {
            profile.age = "18-25 ans";
            console.log('[Avatar] Âge détecté par mots-clés: 18-25 ans');
        } else if (text.includes("adulte") || text.includes("professionnel")) {
            profile.age = "30-45 ans";
            console.log('[Avatar] Âge détecté par mots-clés: 30-45 ans');
        } else if (text.includes("senior") || text.includes("retraité")) {
            profile.age = "50-65 ans";
            console.log('[Avatar] Âge détecté par mots-clés: 50-65 ans');
        } else {
            console.log('[Avatar] Aucun âge spécifique détecté, utilisation de "X"');
        }
        
        // Extraire le genre - recherche exacte
        if (text.includes("femme") || text.includes("féminin")) {
            profile.gender = "Féminin";
            console.log('[Avatar] Genre détecté: Féminin');
        } else if (text.includes("homme") || text.includes("masculin")) {
            profile.gender = "Masculin";
            console.log('[Avatar] Genre détecté: Masculin');
        } else {
            console.log('[Avatar] Aucun genre spécifique détecté, utilisation de "X"');
        }
        
        // Extraire la situation familiale - recherche exacte
        if (text.includes("famille") || text.includes("enfant")) {
            profile.familyStatus = "En couple avec enfants";
            console.log('[Avatar] Situation familiale détectée: En couple avec enfants');
        } else if (text.includes("couple") || text.includes("marié")) {
            profile.familyStatus = "En couple sans enfant";
            console.log('[Avatar] Situation familiale détectée: En couple sans enfant');
        } else if (text.includes("célibataire") || text.includes("seul")) {
            profile.familyStatus = "Célibataire";
            console.log('[Avatar] Situation familiale détectée: Célibataire');
        } else {
            console.log('[Avatar] Aucune situation familiale spécifique détectée, utilisation de "X"');
        }
        
        // Extraire les peurs - recherche par mots-clés
        let profileFears = [];
        
        // Peur 1: Coût
        if (text.includes("coût") || text.includes("cher") || text.includes("prix") || text.includes("investissement")) {
            profileFears.push("Investissement trop coûteux");
            console.log('[Avatar] Peur détectée: Investissement trop coûteux');
        } else {
            profileFears.push("X");
        }
        
        // Peur 2: Difficulté d'utilisation
        if (text.includes("difficile") || text.includes("complexe") || text.includes("utilisation") || text.includes("apprentissage")) {
            profileFears.push("Difficulté d'utilisation");
            console.log('[Avatar] Peur détectée: Difficulté d\'utilisation');
        } else {
            profileFears.push("X");
        }
        
        // Peur 3: Résultats
        if (text.includes("résultat") || text.includes("efficacité") || text.includes("performance")) {
            profileFears.push("Pas de résultats visibles");
            console.log('[Avatar] Peur détectée: Pas de résultats visibles');
        } else {
            profileFears.push("X");
        }
        
        // Peur 4: Qualité
        if (text.includes("qualité") || text.includes("excellence") || text.includes("premium")) {
            profileFears.push("Qualité insuffisante");
            console.log('[Avatar] Peur détectée: Qualité insuffisante');
        } else {
            profileFears.push("X");
        }
        
        // Peur 5: Support
        if (text.includes("support") || text.includes("assistance") || text.includes("service client")) {
            profileFears.push("Manque de support");
            console.log('[Avatar] Peur détectée: Manque de support');
        } else {
            profileFears.push("X");
        }
        
        // Mettre à jour le profil avec les peurs détectées
        profile.fears = profileFears;
        
        // Extraire les attentes - recherche par mots-clés
        let profileExpectations = [];
        
        // Attente 1: Gain de temps
        if (text.includes("temps") || text.includes("rapide") || text.includes("efficace")) {
            profileExpectations.push("Gain de temps significatif");
            console.log('[Avatar] Attente détectée: Gain de temps significatif');
        } else {
            profileExpectations.push("X");
        }
        
        // Attente 2: Résultats professionnels
        if (text.includes("qualité") || text.includes("professionnel") || text.includes("résultat")) {
            profileExpectations.push("Résultats professionnels");
            console.log('[Avatar] Attente détectée: Résultats professionnels');
        } else {
            profileExpectations.push("X");
        }
        
        // Attente 3: Facilité d'utilisation
        if (text.includes("simple") || text.includes("facile") || text.includes("intuitif")) {
            profileExpectations.push("Facilité d'utilisation");
            console.log('[Avatar] Attente détectée: Facilité d\'utilisation');
        } else {
            profileExpectations.push("X");
        }
        
        // Attente 4: Durabilité
        if (text.includes("durable") || text.includes("fiable") || text.includes("solide")) {
            profileExpectations.push("Durabilité et fiabilité");
            console.log('[Avatar] Attente détectée: Durabilité et fiabilité');
        } else {
            profileExpectations.push("X");
        }
        
        // Attente 5: Support
        if (text.includes("support") || text.includes("assistance") || text.includes("service client")) {
            profileExpectations.push("Support et assistance efficaces");
            console.log('[Avatar] Attente détectée: Support et assistance efficaces');
        } else {
            profileExpectations.push("X");
        }
        
        // Mettre à jour le profil avec les attentes détectées
        profile.expectations = profileExpectations;
        
        // Afficher le profil généré
        console.log('[Avatar] Profil généré:', profile);
        
        // Démonstration de comment le prompt serait envoyé à ChatGPT
        // et comment les réponses seraient interprétées
        
        // Créer un prompt explicite pour ChatGPT
        const prompt = `En tant qu'expert en analyse comportementale et marketing, analyse cette description détaillée d'un produit et de son marché cible pour identifier le profil type de l'acheteur.

IMPORTANT: Même si les informations sont limitées, tu dois faire des suppositions basées sur ton expertise. Ne laisse AUCUN champ vide et ne réponds jamais "je ne sais pas" ou "information manquante". Fais toujours une supposition éclairée.

Extrait les informations suivantes de manière précise et concise:

1. Âge: Age le plus susceptible d'acheter (ex: 18 ans, 45 ans, 68 ans)
2. Sexe: Homme ou Femme (choisis l'un des deux, jamais les deux)
3. Situation familiale: Célibataire, en couple, marié(e), avec/sans enfants, etc.
4. Peurs avant d'acheter le produit: Liste de 5 peurs/inquiétudes spécifiques que cette personne pourrait avoir avant l'achat
5. Attentes du produit: Liste de 5 attentes/espoirs spécifiques que cette personne a vis-à-vis du produit

Voici la description détaillée à analyser: ${deepResearch}

Réponds UNIQUEMENT dans ce format JSON sans aucune explication supplémentaire, commentaire ou texte avant ou après le JSON:
{
  "age": "âge identifié",
  "gender": "Homme ou Femme",
  "familyStatus": "Situation familiale identifiée",
  "fears": ["Peur 1", "Peur 2", "Peur 3", "Peur 4", "Peur 5"],
  "expectations": ["Attente 1", "Attente 2", "Attente 3", "Attente 4", "Attente 5"]
}`;
        
        console.log('[Avatar] Prompt qui serait envoyé à ChatGPT:', prompt.substring(0, 100) + '...');
        
        // Simulation de la réponse brute de l'API ChatGPT
        const rawApiResponse = {
            "id": "chatcmpl-123456789",
            "object": "chat.completion",
            "created": Date.now(),
            "model": "gpt-4",
            "choices": [{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": JSON.stringify({
                        "age": text.includes("19") ? "18-25 ans" : "Information manquante",
                        "gender": text.includes("homme") ? "Masculin" : "Information manquante",
                        "familyStatus": text.includes("famille") ? "En couple avec enfants" : "Information manquante",
                        "fears": [
                            "Investissement trop coûteux",
                            "Difficulté d'utilisation",
                            "Pas de résultats visibles",
                            "Qualité insuffisante",
                            "Manque de support"
                        ],
                        "expectations": [
                            "Gain de temps significatif",
                            "Résultats professionnels",
                            "Facilité d'utilisation",
                            "Durabilité et fiabilité",
                            "Support et assistance efficaces"
                        ]
                    }, null, 2)
                },
                "finish_reason": "stop"
            }],
            "usage": {
                "prompt_tokens": 350,
                "completion_tokens": 150,
                "total_tokens": 500
            }
        };
        
        console.log('[Avatar] Réponse brute de l\'API ChatGPT:', JSON.stringify(rawApiResponse, null, 2));
        
        // Extraction de la réponse JSON du contenu de la réponse de l'API
        const chatGptResponseContent = rawApiResponse.choices[0].message.content;
        console.log('[Avatar] Contenu de la réponse de ChatGPT:', chatGptResponseContent);
        
        // Parsing du JSON
        let exampleResponse;
        try {
            // Extraire le JSON de la réponse (peut être entouré de texte)
            const jsonMatch = content.match(/\{[\s\S]*\}/); // Recherche du premier objet JSON
            
            if (!jsonMatch) {
                console.error('[Avatar] Aucun objet JSON trouvé dans la réponse:', content);
                throw new Error('Format de réponse invalide - Aucun JSON trouvé');
            }
            
            const jsonContent = jsonMatch[0];
            console.log('[Avatar] JSON extrait de la réponse:', jsonContent);
            
            const parsedProfile = JSON.parse(jsonContent);
            console.log('[Avatar] Profil parsé avec succès:', parsedProfile);
            
            // Vérifier que tous les champs attendus sont présents
            const expectedFields = ['age', 'gender', 'familyStatus', 'fears', 'expectations'];
            const missingFields = expectedFields.filter(field => !parsedProfile.hasOwnProperty(field));
            
            if (missingFields.length > 0) {
                console.warn('[Avatar] Champs manquants dans la réponse:', missingFields);
            }
            
            return parsedProfile;
        } catch (parseError) {
            console.error('[Avatar] Erreur lors du parsing du JSON:', parseError);
            console.error('[Avatar] Contenu qui a causé l\'erreur:', content);
            throw new Error('Format de réponse invalide');
        }
        
        // Interprétation de la réponse
        console.log('[Avatar] Interprétation de la réponse:');
        
        // Fonction pour traiter la réponse de ChatGPT et la convertir en format utilisable
        function processChatGptResponse(response) {
            console.log('[Avatar] Début du traitement de la réponse de ChatGPT:', response);
            
            // Vérifier si la réponse est valide
            if (!response || typeof response !== 'object') {
                console.error('[Avatar] Réponse invalide reçue de ChatGPT:', response);
                return {
                    age: "X",
                    gender: "X",
                    familyStatus: "X",
                    fears: ["X", "X", "X", "X", "X"],
                    expectations: ["X", "X", "X", "X", "X"]
                };
            }
            
            const processedProfile = {
                age: response.age || "X",
                gender: response.gender || "X",
                familyStatus: response.familyStatus || "X",
                fears: [],
                expectations: []
            };
            
            console.log('[Avatar] Valeurs brutes extraites:', {
                age: processedProfile.age,
                gender: processedProfile.gender,
                familyStatus: processedProfile.familyStatus
            });
            
            // Convertir l'âge en tranche d'âge si nécessaire
            if (processedProfile.age !== "X") {
                // Nettoyer la valeur de l'âge (supprimer "ans", etc.)
                const ageString = processedProfile.age.toString().toLowerCase().replace(/ans|years|old|age|:\s*/g, '').trim();
                console.log('[Avatar] Âge nettoyé pour conversion:', ageString);
                
                // Essayer de convertir en nombre
                const ageNum = parseInt(ageString, 10);
                if (!isNaN(ageNum)) {
                    console.log('[Avatar] Âge converti en nombre:', ageNum);
                    if (ageNum <= 25) {
                        processedProfile.age = "18-25 ans";
                    } else if (ageNum <= 45) {
                        processedProfile.age = "30-45 ans";
                    } else {
                        processedProfile.age = "50-65 ans";
                    }
                    console.log('[Avatar] Âge converti en tranche:', processedProfile.age);
                } else {
                    // Vérifier si l'âge contient déjà une tranche d'âge
                    if (ageString.includes('-') || ageString.includes('\u2013')) { // tiret normal ou tiret cadratin
                        processedProfile.age = ageString + (ageString.includes('ans') ? '' : ' ans');
                        console.log('[Avatar] Tranche d\'\u00e2ge déjà présente:', processedProfile.age);
                    } else {
                        console.warn('[Avatar] Impossible de convertir l\'\u00e2ge en nombre:', ageString);
                    }
                }
            }
            
            // Convertir le genre en format attendu
            if (processedProfile.gender !== "X" && typeof processedProfile.gender === 'string') {
                const genderLower = processedProfile.gender.toLowerCase();
                console.log('[Avatar] Genre à convertir:', genderLower);
                
                if (genderLower.includes("homme") || genderLower.includes("masculin") || genderLower === "h" || genderLower === "m") {
                    processedProfile.gender = "Masculin";
                    console.log('[Avatar] Genre converti en Masculin');
                } else if (genderLower.includes("femme") || genderLower.includes("féminin") || genderLower === "f") {
                    processedProfile.gender = "Féminin";
                    console.log('[Avatar] Genre converti en Féminin');
                } else {
                    console.warn('[Avatar] Genre non reconnu:', processedProfile.gender);
                    processedProfile.gender = "X";
                }
            }
            
            // Traiter les peurs
            console.log('[Avatar] Peurs brutes:', response.fears);
            if (Array.isArray(response.fears)) {
                for (let i = 0; i < 5; i++) {
                    if (i < response.fears.length && response.fears[i] && response.fears[i] !== "X") {
                        processedProfile.fears.push(response.fears[i]);
                    } else {
                        processedProfile.fears.push("X");
                    }
                }
            } else if (typeof response.fears === 'string') {
                // Si les peurs sont fournies sous forme de chaîne, essayer de les séparer
                const fearsArray = response.fears.split(/[,;]/).map(fear => fear.trim()).filter(fear => fear);
                console.log('[Avatar] Peurs extraites de la chaîne:', fearsArray);
                
                for (let i = 0; i < 5; i++) {
                    if (i < fearsArray.length && fearsArray[i]) {
                        processedProfile.fears.push(fearsArray[i]);
                    } else {
                        processedProfile.fears.push("X");
                    }
                }
            } else {
                processedProfile.fears = ["X", "X", "X", "X", "X"];
            }
            
            // Traiter les attentes
            console.log('[Avatar] Attentes brutes:', response.expectations);
            if (Array.isArray(response.expectations)) {
                for (let i = 0; i < 5; i++) {
                    if (i < response.expectations.length && response.expectations[i] && response.expectations[i] !== "X") {
                        processedProfile.expectations.push(response.expectations[i]);
                    } else {
                        processedProfile.expectations.push("X");
                    }
                }
            } else if (typeof response.expectations === 'string') {
                // Si les attentes sont fournies sous forme de chaîne, essayer de les séparer
                const expectationsArray = response.expectations.split(/[,;]/).map(exp => exp.trim()).filter(exp => exp);
                console.log('[Avatar] Attentes extraites de la chaîne:', expectationsArray);
                
                for (let i = 0; i < 5; i++) {
                    if (i < expectationsArray.length && expectationsArray[i]) {
                        processedProfile.expectations.push(expectationsArray[i]);
                    } else {
                        processedProfile.expectations.push("X");
                    }
                }
            } else {
                processedProfile.expectations = ["X", "X", "X", "X", "X"];
            }
            
            console.log('[Avatar] Profil final après traitement:', processedProfile);
            return processedProfile;
        }
        
        // Traiter la réponse de ChatGPT
        const processedResponse = processChatGptResponse(exampleResponse);
        console.log('[Avatar] Réponse traitée pour affichage:', processedResponse);
        
        // Afficher comment chaque champ est interprété
        console.log('- Âge: "' + exampleResponse.age + '" => "' + processedResponse.age + '"');
        console.log('- Sexe: "' + exampleResponse.gender + '" => "' + processedResponse.gender + '"');
        console.log('- Situation familiale: "' + exampleResponse.familyStatus + '" => "' + processedResponse.familyStatus + '"');
        console.log('- Peurs: ', exampleResponse.fears, ' => ', processedResponse.fears);
        console.log('- Attentes: ', exampleResponse.expectations, ' => ', processedResponse.expectations);
        
        // Fonction pour appeler l'API ChatGPT via le serveur backend existant
        async function callChatGptApi(promptTemplate, deepResearch) {
            // Extraire la partie du prompt avant et après deepResearch
            const promptParts = promptTemplate.split('${deepResearch}');
            const promptPrefix = promptParts[0];
            const promptSuffix = promptParts[1];
            
            console.log('[Avatar] Longueur du texte deepResearch:', deepResearch.length, 'caractères');
            
            // Limite de taille pour chaque partie (pour éviter la troncation)
            const MAX_CHUNK_SIZE = 3000; // Taille maximale pour chaque partie
            
            try {
                // Utiliser la même configuration que celle utilisée dans openai-api.js
                const serverUrl = 'http://localhost:3000/api/generate';
                console.log('[Avatar] URL du serveur backend:', serverUrl);
                
                let messages = [];
                
                // Message système
                messages.push({ 
                    role: 'system', 
                    content: 'Vous êtes un expert en analyse comportementale et marketing. Répondez exclusivement en français et suivez EXACTEMENT le format demandé.'
                });
                
                // Si le texte est trop long, le diviser en plusieurs parties
                if (deepResearch.length > MAX_CHUNK_SIZE) {
                    console.log('[Avatar] Le texte deepResearch est trop long, division en plusieurs parties');
                    
                    // Première partie: instructions et début du texte
                    const firstPrompt = `${promptPrefix}${deepResearch.substring(0, MAX_CHUNK_SIZE)}\n\n[SUITE DANS LE PROCHAIN MESSAGE]`;
                    messages.push({ role: 'user', content: firstPrompt });
                    
                    // Parties intermédiaires
                    let remainingText = deepResearch.substring(MAX_CHUNK_SIZE);
                    let partNumber = 2;
                    
                    while (remainingText.length > MAX_CHUNK_SIZE) {
                        const chunk = remainingText.substring(0, MAX_CHUNK_SIZE);
                        messages.push({ 
                            role: 'user', 
                            content: `[PARTIE ${partNumber}] ${chunk}\n\n[SUITE DANS LE PROCHAIN MESSAGE]` 
                        });
                        remainingText = remainingText.substring(MAX_CHUNK_SIZE);
                        partNumber++;
                    }
                    
                    // Dernière partie: fin du texte et format de réponse attendu
                    if (remainingText.length > 0) {
                        const lastPrompt = `[PARTIE ${partNumber} - FINALE] ${remainingText}${promptSuffix}`;
                        messages.push({ role: 'user', content: lastPrompt });
                    } else {
                        // Si par hasard la division tombe juste
                        messages.push({ role: 'user', content: `[PARTIE FINALE]${promptSuffix}` });
                    }
                } else {
                    // Si le texte n'est pas trop long, l'envoyer en une seule fois
                    const fullPrompt = `${promptPrefix}${deepResearch}${promptSuffix}`;
                    messages.push({ role: 'user', content: fullPrompt });
                }
                
                console.log('[Avatar] Nombre de messages envoyés:', messages.length);
                
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                        // Pas besoin d'Authorization header car la clé est gérée par le serveur
                    },
                    body: JSON.stringify({
                        model: 'gpt-4', // On utilise GPT-4 pour une meilleure analyse
                        messages: messages,
                        temperature: 0.7
                    })
                };
                
                // Envoi de la requête au serveur backend
                console.log('[Avatar] Envoi de la requête au serveur backend...');
                const response = await fetch(serverUrl, requestOptions);
                
                // Vérification de la réponse
                console.log('[Avatar] Statut de la réponse:', response.status, response.statusText);
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('[Avatar] Erreur détaillée de l\'API:', errorText);
                    throw new Error(`Erreur API: ${response.status} ${response.statusText} - ${errorText}`);
                }
                
                // Traitement de la réponse
                const data = await response.json();
                console.log('[Avatar] Réponse reçue du serveur backend (complète):', JSON.stringify(data, null, 2));
                
                // Vérifier si la réponse contient les données attendues
                if (!data.choices || data.choices.length === 0 || !data.choices[0].message || !data.choices[0].message.content) {
                    console.error('[Avatar] Structure de réponse invalide:', data);
                    throw new Error('Structure de réponse invalide');
                }
                
                // Extraction du contenu de la réponse
                const content = data.choices[0].message.content;
                console.log('[Avatar] Contenu brut de la réponse:', content);
                
                // Parsing du JSON
                try {
                    // Extraire le JSON de la réponse (peut être entouré de texte)
                    const jsonMatch = content.match(/\{[\s\S]*\}/); // Recherche du premier objet JSON
                    
                    if (!jsonMatch) {
                        console.error('[Avatar] Aucun objet JSON trouvé dans la réponse:', content);
                        throw new Error('Format de réponse invalide - Aucun JSON trouvé');
                    }
                    
                    const jsonContent = jsonMatch[0];
                    console.log('[Avatar] JSON extrait de la réponse:', jsonContent);
                    
                    const parsedProfile = JSON.parse(jsonContent);
                    console.log('[Avatar] Profil parsé avec succès:', parsedProfile);
                    
                    // Vérifier que tous les champs attendus sont présents
                    const expectedFields = ['age', 'gender', 'familyStatus', 'fears', 'expectations'];
                    const missingFields = expectedFields.filter(field => !parsedProfile.hasOwnProperty(field));
                    
                    if (missingFields.length > 0) {
                        console.warn('[Avatar] Champs manquants dans la réponse:', missingFields);
                    }
                    
                    return parsedProfile;
                } catch (parseError) {
                    console.error('[Avatar] Erreur lors du parsing du JSON:', parseError);
                    console.error('[Avatar] Contenu qui a causé l\'erreur:', content);
                    throw new Error('Format de réponse invalide');
                }
            } catch (error) {
                console.error('[Avatar] Erreur lors de l\'appel au serveur backend:', error);
                throw error;
            }
        }
        
        // Utilisation de la fonction pour appeler l'API ChatGPT
        console.log('[Avatar] Appel de l\'API ChatGPT pour générer le profil acheteur...');
        
        // Extraire le template de prompt (sans le deepResearch)
        const promptTemplate = `En tant qu'expert en analyse comportementale et marketing, analyse cette description détaillée d'un produit et de son marché cible pour identifier le profil type de l'acheteur.

IMPORTANT: Même si les informations sont limitées, tu dois faire des suppositions basées sur ton expertise. Ne laisse AUCUN champ vide et ne réponds jamais "je ne sais pas" ou "information manquante". Fais toujours une supposition éclairée.

Extrait les informations suivantes de manière précise et concise:

1. Âge: Age le plus susceptible d'acheter (ex: 18 ans, 45 ans, 68 ans)
2. Sexe: Homme ou Femme (choisis l'un des deux, jamais les deux)
3. Situation familiale: Célibataire, en couple, marié(e), avec/sans enfants, etc.
4. Peurs avant d'acheter le produit: Liste de 5 peurs/inquiétudes spécifiques que cette personne pourrait avoir avant l'achat
5. Attentes du produit: Liste de 5 attentes/espoirs spécifiques que cette personne a vis-à-vis du produit

Voici la description détaillée à analyser: ${deepResearch}

Réponds UNIQUEMENT dans ce format JSON sans aucune explication supplémentaire, commentaire ou texte avant ou après le JSON:
{
  "age": "âge identifié",
  "gender": "Homme ou Femme",
  "familyStatus": "Situation familiale identifiée",
  "fears": ["Peur 1", "Peur 2", "Peur 3", "Peur 4", "Peur 5"],
  "expectations": ["Attente 1", "Attente 2", "Attente 3", "Attente 4", "Attente 5"]
}`;
        
        // Nous retournons une promesse qui sera résolue avec le profil généré
        return new Promise((resolve, reject) => {
            callChatGptApi(promptTemplate, deepResearch)
                .then(chatGptProfile => {
                    // Traiter la réponse de ChatGPT
                    const finalProfile = processChatGptResponse(chatGptProfile);
                    console.log('[Avatar] Profil final après traitement:', finalProfile);
                    
                    // Mettre à jour l'interface utilisateur avec le profil
                    if (window.avatarDisplay && typeof window.avatarDisplay.updateAvatarProfile === 'function') {
                        window.avatarDisplay.updateAvatarProfile(finalProfile);
                    }
                    
                    resolve(finalProfile);
                })
                .catch(error => {
                    console.error('[Avatar] Erreur lors du traitement du profil:', error);
                    console.log('[Avatar] Utilisation du profil généré localement en cas d\'erreur:', profile);
                    resolve(profile); // Utiliser le profil généré localement en cas d'erreur
                });
        });
        // Note: Cette partie est commentée car nous n'utilisons pas encore l'API ChatGPT
        // Nous utilisons plutôt l'analyse directe du texte implémentée ci-dessus
        //         messages: [{ role: 'user', content: prompt }],
        //         temperature: 0.7
        //     })
        // });
        // const data = await response.json();
        // const profileData = JSON.parse(data.choices[0].message.content);
        // return profileData;
        
        // Pour cette simulation, nous utilisons notre logique existante
        console.log('[Avatar] Prompt qui serait envoyé à ChatGPT:', prompt.substring(0, 100) + '...');
        
        // Déterminer l'âge en fonction des mots-clés
        let age = "X";
        const agePatterns = [
            { keywords: ["18-25", "jeune", "étudiant", "débutant", "adolescent", "lycée", "université"], value: "18-25 ans" },
            { keywords: ["25-35", "jeune professionnel", "début de carrière"], value: "25-35 ans" },
            { keywords: ["30-45", "professionnel", "carrière", "expérience", "cadre", "manager"], value: "30-45 ans" },
            { keywords: ["40-55", "senior", "expérimenté", "cadre supérieur", "directeur"], value: "40-55 ans" },
            { keywords: ["50-65", "pré-retraite", "retraite", "expérimenté", "senior"], value: "50-65 ans" },
            { keywords: ["65+", "retraité", "aîné"], value: "65+ ans" }
        ];
        
        for (const pattern of agePatterns) {
            if (pattern.keywords.some(keyword => text.includes(keyword))) {
                age = pattern.value;
                console.log('[Avatar] Âge détecté:', age);
                break;
            }
        }
        
        // Déterminer le sexe en fonction des mots-clés
        let gender = "X";
        const genderPatterns = [
            { keywords: ["femme", "elle", "mère", "féminin", "madame", "mademoiselle"], value: "Féminin" },
            { keywords: ["homme", "il", "père", "masculin", "monsieur"], value: "Masculin" }
        ];
        
        for (const pattern of genderPatterns) {
            if (pattern.keywords.some(keyword => text.includes(keyword))) {
                gender = pattern.value;
                console.log('[Avatar] Genre détecté:', gender);
                break;
            }
        }
        
        // Analyse secondaire basée sur le type de produit si le genre n'est pas détecté
        if (gender === "X") {
            const femininProducts = ["beauté", "maquillage", "soins", "cosmétique", "bijou"];
            const masculinProducts = ["rasage", "barbe", "sport", "bricolage", "automobile"];
            
            if (femininProducts.some(keyword => text.includes(keyword))) {
                gender = "Féminin";
                console.log('[Avatar] Genre détecté via produit:', gender);
            } else if (masculinProducts.some(keyword => text.includes(keyword))) {
                gender = "Masculin";
                console.log('[Avatar] Genre détecté via produit:', gender);
            }
        }
        
        // Déterminer la situation familiale
        let familyStatus;
        let familyFound = false;
        if (text.includes("famille") || text.includes("enfant") || text.includes("parent")) {
            familyStatus = "En couple avec enfants";
            familyFound = true;
        } else if (text.includes("couple") || text.includes("marié") || text.includes("conjoint")) {
            familyStatus = "En couple sans enfant";
            familyFound = true;
        } else if (text.includes("célibataire") || text.includes("seul") || text.includes("indépendant")) {
            familyStatus = "Célibataire";
            familyFound = true;
        } else {
            familyStatus = "X"; // Valeur par défaut si aucune correspondance
        }
        
        // Déterminer les peurs
        let fears = [];
        let fearsFound = false;
        if (text.includes("temps") || text.includes("rapide") || text.includes("efficace")) {
            fears.push("Investissement trop coûteux");
            fearsFound = true;
        }
        if (text.includes("performance") || text.includes("résultat") || text.includes("efficacité")) {
            fears.push("Difficulté d'utilisation");
            fearsFound = true;
        }
        if (text.includes("simple") || text.includes("facile") || text.includes("pratique")) {
            fears.push("Pas de résultats visibles");
            fearsFound = true;
        }
        if (text.includes("économie") || text.includes("rentable") || text.includes("investissement")) {
            fears.push("Manque de retour sur investissement");
            fearsFound = true;
        }
        if (text.includes("qualité") || text.includes("excellence") || text.includes("premium")) {
            fears.push("Qualité insuffisante");
            fearsFound = true;
        }
        
        // Si aucune peur n'a été identifiée, utiliser "X"
        if (!fearsFound) {
            fears = ["X", "X", "X", "X", "X"];
        } else {
            // Limiter à 5 peurs
            fears = fears.slice(0, 5);
            
            // Si moins de 5 peurs identifiées, compléter avec "X"
            while (fears.length < 5) {
                fears.push("X");
            }
        }
        
        // Déterminer les attentes
        let expectations = [];
        let expectationsFound = false;
        if (text.includes("temps") || text.includes("rapide") || text.includes("efficace")) {
            expectations.push("Gain de temps significatif");
            expectationsFound = true;
        }
        if (text.includes("qualité") || text.includes("professionnel") || text.includes("résultat")) {
            expectations.push("Résultats professionnels");
            expectationsFound = true;
        }
        if (text.includes("simple") || text.includes("facile") || text.includes("intuitif")) {
            expectations.push("Facilité d'utilisation");
            expectationsFound = true;
        }
        if (text.includes("économie") || text.includes("rentable") || text.includes("investissement")) {
            expectations.push("Retour sur investissement rapide");
            expectationsFound = true;
        }
        if (text.includes("durable") || text.includes("fiable") || text.includes("solide")) {
            expectations.push("Durabilité et fiabilité");
            expectationsFound = true;
        }
        
        // Si aucune attente n'a été identifiée, utiliser "X"
        if (!expectationsFound) {
            expectations = ["X", "X", "X", "X", "X"];
        } else {
            // Limiter à 5 attentes
            expectations = expectations.slice(0, 5);
            
            // Si moins de 5 attentes identifiées, compléter avec "X"
            while (expectations.length < 5) {
                expectations.push("X");
            }
        }
        
        return {
            age,
            gender,
            familyStatus,
            fears,
            expectations
        };
    } catch (error) {
        console.error('[Avatar] Erreur lors de l\'extraction du profil avatar:', error);
        throw error; // Propager l'erreur pour qu'elle soit gérée par la fonction appelante
    }
}

// Fonction pour afficher les informations du profil avatar
function displayAvatarProfile(profile) {
    console.log('[Avatar] Début de l\'affichage du profil avatar:', profile);
    
    // Vérifier si le profil est défini
    if (!profile || typeof profile !== 'object') {
        console.error('[Avatar] Erreur: le profil est undefined ou n\'est pas un objet');
        return;
    }
    
    // Utiliser la nouvelle implémentation pour mettre à jour le profil avatar
    if (window.avatarDisplay && typeof window.avatarDisplay.updateAvatarProfile === 'function') {
        console.log('[Avatar] Utilisation de la nouvelle implémentation avatarDisplay.updateAvatarProfile');
        window.avatarDisplay.updateAvatarProfile(profile);
        return;
    }
    
    // Fallback à l'ancienne méthode si la nouvelle implémentation n'est pas disponible
    console.log('[Avatar] Utilisation de la méthode fallback pour l\'affichage');
    
    // Vérifier que la section avatar est visible
    const avatarSection = document.getElementById('avatarProfileSection');
    if (avatarSection) {
        avatarSection.style.display = 'block';
        console.log('[Avatar] Section avatar rendue visible');
    } else {
        console.error('[Avatar] Section avatar introuvable lors de l\'affichage');
        return; // Sortir de la fonction si la section n'existe pas
    }
    
    // Afficher l'âge avec l'emoji approprié
    const ageElement = document.getElementById('avatarAge');
    if (ageElement) {
        if (profile.age === "X") {
            ageElement.innerHTML = `<span class="age-emoji">❓</span> <span class="age-text">X</span>`;
        } else {
            const ageEmoji = getAgeEmoji(profile.age);
            ageElement.innerHTML = `<span class="age-emoji">${ageEmoji}</span> <span class="age-text">${profile.age}</span>`;
        }
        console.log('[Avatar] Âge affiché:', profile.age);
    } else {
        console.error('[Avatar] Élément avatarAge introuvable');
    }
    
    // Afficher le sexe avec le symbole approprié
    const genderElement = document.getElementById('avatarGender');
    if (genderElement) {
        if (profile.gender === "X") {
            genderElement.innerHTML = `<span class="gender-symbol">❓</span> <span class="gender-text">X</span>`;
        } else {
            const genderSymbol = profile.gender === "Masculin" ? "♂️" : "♀️";
            genderElement.innerHTML = `<span class="gender-symbol">${genderSymbol}</span> <span class="gender-text">${profile.gender}</span>`;
        }
        console.log('[Avatar] Genre affiché:', profile.gender);
    } else {
        console.error('[Avatar] Élément avatarGender introuvable');
    }
    
    // Afficher la situation familiale
    const familyElement = document.getElementById('avatarFamily');
    if (familyElement) {
        if (profile.familyStatus === "X") {
            familyElement.innerHTML = `<span class="family-emoji">❓</span> <span class="family-text">X</span>`;
        } else {
            const familyEmoji = getFamilyEmoji(profile.familyStatus);
            familyElement.innerHTML = `<span class="family-emoji">${familyEmoji}</span> <span class="family-text">${profile.familyStatus}</span>`;
        }
        console.log('[Avatar] Situation familiale affichée:', profile.familyStatus);
    } else {
        console.error('[Avatar] Élément avatarFamily introuvable');
    }
    
    // Afficher les peurs
    const fearsContainer = document.getElementById('avatarFears');
    if (fearsContainer) {
        fearsContainer.innerHTML = '';
        if (profile.fears && Array.isArray(profile.fears)) {
            profile.fears.forEach(fear => {
                if (fear === "X") {
                    fearsContainer.innerHTML += `
                        <div class="fear-item">
                            <div class="fear-icon"><i class="fas fa-question-circle"></i></div>
                            <div class="fear-text">X</div>
                        </div>
                    `;
                } else {
                    const fearIcon = getFearIcon(fear);
                    fearsContainer.innerHTML += `
                        <div class="fear-item">
                            <div class="fear-icon"><i class="fas ${fearIcon}"></i></div>
                            <div class="fear-text">${fear}</div>
                        </div>
                    `;
                }
            });
            console.log('[Avatar] Peurs affichées:', profile.fears);
        } else {
            console.error('[Avatar] Les peurs ne sont pas un tableau valide');
        }
    } else {
        console.error('[Avatar] Élément avatarFears introuvable');
    }
    
    // Afficher les attentes
    const expectationsContainer = document.getElementById('avatarExpectations');
    if (expectationsContainer) {
        expectationsContainer.innerHTML = '';
        if (profile.expectations && Array.isArray(profile.expectations)) {
            profile.expectations.forEach(expectation => {
                if (expectation === "X") {
                    expectationsContainer.innerHTML += `
                        <div class="expectation-item">
                            <div class="expectation-icon"><i class="fas fa-question-circle"></i></div>
                            <div class="expectation-text">X</div>
                        </div>
                    `;
                } else {
                    const expectationIcon = getExpectationIcon(expectation);
                    expectationsContainer.innerHTML += `
                        <div class="expectation-item">
                            <div class="expectation-icon"><i class="fas ${expectationIcon}"></i></div>
                            <div class="expectation-text">${expectation}</div>
                        </div>
                    `;
                }
            });
            console.log('[Avatar] Attentes affichées:', profile.expectations);
        } else {
            console.error('[Avatar] Les attentes ne sont pas un tableau valide');
        }
    } else {
        console.error('[Avatar] Élément avatarExpectations introuvable');
    }
    
    console.log('[Avatar] Affichage du profil avatar terminé');
}

// Fonction pour obtenir l'emoji approprié en fonction de l'âge
function getAgeEmoji(age) {
    // Vérifier si age est défini et est une chaîne de caractères
    if (!age || typeof age !== 'string') {
        console.error('[Avatar] Erreur: age est undefined ou n\'est pas une chaîne de caractères:', age);
        return '👨‍💼'; // Emoji par défaut pour un professionnel
    }
    
    // Vérifier si la chaîne contient un tiret pour le split
    let ageNum;
    if (age.includes('-')) {
        ageNum = parseInt(age.split('-')[0]);
    } else {
        // Essayer de parser directement si pas de tiret
        ageNum = parseInt(age);
    }
    
    // Vérifier si le parsing a réussi
    if (isNaN(ageNum)) {
        console.error('[Avatar] Erreur: impossible de parser l\'âge:', age);
        return '👨‍💼'; // Emoji par défaut pour un professionnel
    }
    
    if (ageNum < 25) {
        return '👨‍🎓'; // Jeune/Étudiant
    } else if (ageNum >= 25 && ageNum < 35) {
        return '👨‍💻'; // Jeune professionnel
    } else if (ageNum >= 35 && ageNum < 50) {
        return '👨‍💼'; // Professionnel établi
    } else if (ageNum >= 50 && ageNum < 65) {
        return '👨‍🦱'; // Senior
    } else {
        return '👴'; // Retraité
    }
}

// Fonction pour obtenir l'emoji approprié pour la situation familiale
function getFamilyEmoji(familyStatus) {
    // Vérifier si familyStatus est défini et est une chaîne de caractères
    if (!familyStatus || typeof familyStatus !== 'string') {
        console.error('[Avatar] Erreur: familyStatus est undefined ou n\'est pas une chaîne de caractères:', familyStatus);
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
    // Vérifier si fear est défini et est une chaîne de caractères
    if (!fear || typeof fear !== 'string') {
        console.error('[Avatar] Erreur: fear est undefined ou n\'est pas une chaîne de caractères:', fear);
        return "fa-exclamation-triangle"; // Icône par défaut
    }
    
    if (fear.includes("temps") || fear.includes("rapide") || fear.includes("efficace")) {
        return "fa-tachometer-alt";
    } else if (fear.includes("performance") || fear.includes("résultat") || fear.includes("efficacité")) {
        return "fa-trophy";
    } else if (fear.includes("simple") || fear.includes("facile") || fear.includes("pratique")) {
        return "fa-tools";
    } else if (fear.includes("économie") || fear.includes("rentable") || fear.includes("investissement")) {
        return "fa-hand-holding-usd";
    } else if (fear.includes("qualité") || fear.includes("excellence") || fear.includes("premium")) {
        return "fa-shield-alt";
    } else {
        return "fa-exclamation-triangle";
    }
}

// Fonction pour obtenir l'icône appropriée pour une attente
function getExpectationIcon(expectation) {
    // Vérifier si expectation est défini et est une chaîne de caractères
    if (!expectation || typeof expectation !== 'string') {
        console.error('[Avatar] Erreur: expectation est undefined ou n\'est pas une chaîne de caractères:', expectation);
        return "fa-star"; // Icône par défaut
    }
    
    if (expectation.includes("temps") || expectation.includes("rapide") || expectation.includes("efficace")) {
        return "fa-tachometer-alt";
    } else if (expectation.includes("résultat") || expectation.includes("professionnel") || expectation.includes("efficacité")) {
        return "fa-trophy";
    } else if (expectation.includes("simple") || expectation.includes("facile") || expectation.includes("intuitif")) {
        return "fa-tools";
    } else if (expectation.includes("investissement") || expectation.includes("économie") || expectation.includes("rentable")) {
        return "fa-hand-holding-usd";
    } else if (expectation.includes("durable") || expectation.includes("fiable") || expectation.includes("solide")) {
        return "fa-shield-alt";
    } else {
        return "fa-star";
    }
}

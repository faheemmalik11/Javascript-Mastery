// OpenAI API integration for the product content generator

// Configuration for the backend API
const API_CONFIG = {
    serverUrl: 'http://localhost:3000/api/generate', // URL de notre serveur backend local
    model: 'claude', // Modèle par défaut changé vers Claude
    temperature: 0.7,
    maxTokens: 4000 // Augmenté de 2500 à 4000 pour des réponses plus complètes
};

// Mapping des modèles IA
const AI_MODELS = {
    'chatgpt': 'gpt-3.5-turbo',
    'gpt-3.5-turbo': 'gpt-3.5-turbo',
    'claude': 'claude-sonnet-4-20250514', // Claude 4 Sonnet original
    'claude-4': 'claude-sonnet-4-20250514' // Claude 4 Sonnet original
};

// Fonction pour obtenir le nom technique du modèle
function getModelName(aiModel) {
    return AI_MODELS[aiModel] || AI_MODELS['chatgpt'];
}

// Fonction non utilisée mais conservée pour compatibilité
function initializeAPI(apiKey) {
    // Nous pourrions stocker d'autres configurations ici si nécessaire
    sessionStorage.setItem('backend_initialized', 'true');
    return true;
}

// Check si le backend est correctement configuré
function checkAPIKeyExists() {
    // Par défaut, nous considérons que le backend est configuré
    // Cette fonction est conservée pour maintenir la compatibilité avec l'interface existante
    return true;
}

// Function to extract product details from deep research
async function extractProductDetails(deepResearch, productName, aiModel) {
    
    const prompt = `
Analyse la description détaillée suivante d'un produit nommé "${productName}" et extrais-en les informations structurées suivantes :

1. Description succincte du produit (2-3 phrases)
2. Public cible (1 phrase claire sur qui sont les utilisateurs idéaux)
3. Caractéristiques principales (liste de 4-5 points clés)
4. Problèmes résolus par le produit (liste de 3-4 problèmes spécifiques)

Voici la description détaillée à analyser :
${deepResearch}

Réponds exactement dans ce format JSON sans aucune explication supplémentaire :
{
  "description": "Description succincte extraite...",
  "targetAudience": "Public cible identifié...",
  "features": ["Caractéristique 1", "Caractéristique 2", ...],
  "problemsSolved": ["Problème résolu 1", "Problème résolu 2", ...]
}
`;

    try {
        const result = await callOpenAI(prompt, 0.7, 800, aiModel);
        
        // Nettoyer le résultat s'il est enveloppé dans des balises de code markdown
        let cleanedResult = result;
        
        // Vérifier si la réponse commence par des backticks (code markdown)
        if (result.trim().startsWith('```')) {
            // Retirer le début et la fin des balises de code markdown
            cleanedResult = result.replace(/^```(?:json)?\n/, '').replace(/\n```$/, '');
        }
        
        // Analyser le JSON (maintenant propre)
        return JSON.parse(cleanedResult);
    } catch (error) {
        // Return default values in case of error
        return {
            description: deepResearch.substring(0, 200) + "...",
            targetAudience: "Utilisateurs intéressés par ce type de produit",
            features: ["Fonctionnalité non spécifiée"],
            problemsSolved: ["Problème non spécifié"]
        };
    }
}

// Main function to generate all content
async function generateAllContent(productData) {
    console.log('[DEBUG] Début de generateAllContent avec modèle:', productData.aiModel || 'chatgpt');
    
    // Récupérer l'angle marketing sélectionné
    const selectedMarketingAngle = window.selectedMarketingAngle;
    console.log('[DEBUG] Angle marketing sélectionné:', selectedMarketingAngle);
    
    // Récupérer le profil avatar sélectionné
    const selectedAvatarElement = document.querySelector('.avatar-card.selected');
    let selectedAvatar = null;
    if (selectedAvatarElement) {
        const avatarName = selectedAvatarElement.querySelector('.avatar-name')?.textContent;
        const avatarDescription = selectedAvatarElement.querySelector('.avatar-description')?.textContent;
        selectedAvatar = {
            name: avatarName,
            description: avatarDescription
        };
    }
    console.log('[DEBUG] Profil avatar sélectionné:', selectedAvatar);
    
    // Créer un contexte enrichi avec l'angle marketing et le profil avatar
    const enrichedProductData = {
        ...productData,
        marketingAngle: selectedMarketingAngle,
        selectedAvatar: selectedAvatar
    };
    
    try {
        
        // Avec notre backend, pas besoin de vérifier la clé API
        // La vérification est maintenue pour compatibilité mais avec API_CONFIG
        if (false) { // Désactivé car nous utilisons le backend
            console.error('[ERROR] API key non définie');
            throw new Error('API key not set. Please enter your OpenAI API key.');
        }
        
        console.log('[DEBUG] Début extraction des détails du produit');
        // If deep research is provided, extract missing information
        if (productData.deepResearch && (!productData.productDescription || !productData.targetAudience || !productData.productFeatures || !productData.problemsSolved)) {
            console.log('[DEBUG] Appel extractProductDetails...');
            try {
                const extractedData = await extractProductDetails(productData.deepResearch, productData.productName, productData.aiModel);
                console.log('[DEBUG] Données extraites avec succès:', extractedData);
                
                // Fill in missing data
                productData.productDescription = productData.productDescription || extractedData.description;
                productData.targetAudience = productData.targetAudience || extractedData.targetAudience;
                productData.productFeatures = productData.productFeatures || extractedData.features;
                productData.problemsSolved = productData.problemsSolved || extractedData.problemsSolved;
                
                console.log('[DEBUG] Données du produit complétées:', productData);
            } catch (error) {
                console.error('[ERROR] Erreur lors de l\'extraction des détails du produit:', error);
                // Continuer malgré l'erreur avec des valeurs par défaut
                if (!productData.productDescription) productData.productDescription = "Description non spécifiée";
                if (!productData.targetAudience) productData.targetAudience = "Utilisateurs intéressés par ce type de produit";
                if (!productData.productFeatures) productData.productFeatures = ["Fonctionnalité non spécifiée"];
                if (!productData.problemsSolved) productData.problemsSolved = ["Problème non spécifié"];
            }
        }
        
        // Generate two versions for each content type
        const generateTwoVersions = async (generatorFunction, data, prompt = null) => {
            console.log(`[DEBUG] Génération de deux versions pour: ${generatorFunction.name} avec modèle ${data.aiModel || 'chatgpt'}`);
            try {
                const [version1, version2] = await Promise.all([
                    generatorFunction(data, prompt).catch(error => {
                        console.error(`[ERROR] Erreur lors de la génération de la version 1 de ${generatorFunction.name}:`, error);
                        throw new Error(`Erreur lors de la génération de la version 1 de ${generatorFunction.name}: ${error.message}`);
                    }),
                    generatorFunction(data, prompt, 0.8).catch(error => {
                        console.error(`[ERROR] Erreur lors de la génération de la version 2 de ${generatorFunction.name}:`, error);
                        throw new Error(`Erreur lors de la génération de la version 2 de ${generatorFunction.name}: ${error.message}`);
                    }) // Slightly higher temperature for more variation
                ]);
                console.log(`[DEBUG] Génération réussie pour ${generatorFunction.name}`);
                console.log(`[DEBUG] Type de version1:`, typeof version1, 'Array?', Array.isArray(version1));
                console.log(`[DEBUG] Type de version2:`, typeof version2, 'Array?', Array.isArray(version2));
                if (Array.isArray(version1) && version1.length > 0) {
                    console.log(`[DEBUG] Type du premier élément de version1:`, typeof version1[0]);
                    console.log(`[DEBUG] Premier élément de version1:`, version1[0]);
                }
                if (Array.isArray(version2) && version2.length > 0) {
                    console.log(`[DEBUG] Type du premier élément de version2:`, typeof version2[0]);
                    console.log(`[DEBUG] Premier élément de version2:`, version2[0]);
                }
                return { version1, version2 };
            } catch (error) {
                console.error(`[ERROR] Échec de la génération pour ${generatorFunction.name}:`, error);
                throw error;
            }
        };

        // Nouvelle fonction pour générer une seule version (génération initiale)
        const generateSingleVersion = async (generatorFunction, data, prompt = null) => {
            console.log(`[DEBUG] Génération d'une seule version pour: ${generatorFunction.name} avec modèle ${data.aiModel || 'chatgpt'}`);
            try {
                const version1 = await generatorFunction(data, prompt).catch(error => {
                    console.error(`[ERROR] Erreur lors de la génération de ${generatorFunction.name}:`, error);
                    throw new Error(`Erreur lors de la génération de ${generatorFunction.name}: ${error.message}`);
                });
                console.log(`[DEBUG] Génération réussie pour ${generatorFunction.name}`);
                console.log(`[DEBUG] Type de version1:`, typeof version1, 'Array?', Array.isArray(version1));
                if (Array.isArray(version1) && version1.length > 0) {
                    console.log(`[DEBUG] Type du premier élément de version1:`, typeof version1[0]);
                    console.log(`[DEBUG] Premier élément de version1:`, version1[0]);
                }
                return { version1 };
            } catch (error) {
                console.error(`[ERROR] Échec de la génération pour ${generatorFunction.name}:`, error);
                throw error;
            }
        };

        // Générer le contenu en séquence pour réduire la charge sur le serveur
        console.log('[DEBUG] Début de la génération du contenu en séquence');
        
        // Générer d'abord les éléments essentiels
        console.log('[DEBUG] Génération du profil psychographique');
        const psychographicProfile = await generateSingleVersion(generatePsychographicProfile, enrichedProductData).catch(error => {
            console.error('[ERROR] Erreur lors de la génération du profil psychographique:', error);
            return { version1: "Profil psychographique non disponible en raison d'une erreur." };
        });
        
        console.log('[DEBUG] Génération de la synthèse stratégique');
        const strategicSynthesis = await generateSingleVersion(
            generateStrategicSynthesis, 
            enrichedProductData, 
            psychographicProfile.version1,
            enrichedProductData.aiModel
        ).catch(error => {
            console.error('[ERROR] Erreur lors de la génération de la synthèse stratégique:', error);
            throw new Error(`Erreur lors de la génération de la synthèse stratégique: ${error.message}`);
        });
        
        console.log('[DEBUG] Génération du titre du produit');
        const productTitle = await generateSingleVersion(generateProductTitle, enrichedProductData).catch(error => {
            console.error('[ERROR] Erreur lors de la génération du titre du produit:', error);
            // Propager l'erreur au lieu de fournir des valeurs par défaut
            throw new Error(`Erreur lors de la génération du titre du produit: ${error.message}`);
        });
        
        console.log('[DEBUG] Génération des avantages du produit');
        const productBenefits = await generateSingleVersion(generateProductBenefits, enrichedProductData).catch(error => {
            console.error('[ERROR] Erreur lors de la génération des avantages du produit:', error);
            // Propager l'erreur au lieu de fournir des valeurs par défaut
            throw new Error(`Erreur lors de la génération des avantages du produit: ${error.message}`);
        });
        
        // Générer les éléments secondaires
        console.log('[DEBUG] Génération du fonctionnement');
        const howItWorks = await generateSingleVersion(generateHowItWorks, enrichedProductData).catch(error => {
            console.error('[ERROR] Erreur lors de la génération du fonctionnement:', error);
            // Propager l'erreur au lieu de fournir des valeurs par défaut
            throw new Error(`Erreur lors de la génération du fonctionnement: ${error.message}`);
        });
        
        console.log('[DEBUG] Génération des bénéfices émotionnels');
        const emotionalBenefits = await generateSingleVersion(generateEmotionalBenefits, enrichedProductData).catch(error => {
            console.error('[ERROR] Erreur lors de la génération des bénéfices émotionnels:', error);
            // Propager l'erreur au lieu de fournir des valeurs par défaut
            throw new Error(`Erreur lors de la génération des bénéfices émotionnels: ${error.message}`);
        });
        
        console.log('[DEBUG] Génération des cas d\'utilisation');
        const useCases = await generateSingleVersion(generateUseCases, enrichedProductData).catch(error => {
            console.error('[ERROR] Erreur lors de la génération des cas d\'utilisation:', error);
            // Propager l'erreur au lieu de fournir des valeurs par défaut
            throw new Error(`Erreur lors de la génération des cas d'utilisation: ${error.message}`);
        });
        
        // Générer une seule version des caractéristiques
        console.log('[DEBUG] Génération des caractéristiques');
        const characteristicsResult = await generateCharacteristics(enrichedProductData).catch(error => {
            console.error('[ERROR] Erreur lors de la génération des caractéristiques:', error);
            // Propager l'erreur au lieu de fournir des valeurs par défaut
            throw new Error(`Erreur lors de la génération des caractéristiques: ${error.message}`);
        });
        
        console.log('[DEBUG] Génération des avantages concurrentiels');
        const competitiveAdvantages = await generateSingleVersion(generateCompetitiveAdvantages, enrichedProductData).catch(error => {
            console.error('[ERROR] Erreur lors de la génération des avantages concurrentiels:', error);
            // Propager l'erreur au lieu de fournir des valeurs par défaut
            throw new Error(`Erreur lors de la génération des avantages concurrentiels: ${error.message}`);
        });
        
        console.log('[DEBUG] Génération des avis clients');
        const customerReviewsResult = await generateCustomerReviews(enrichedProductData).catch(error => {
            console.error('[ERROR] Erreur lors de la génération des avis clients:', error);
            // Propager l'erreur au lieu de fournir des valeurs par défaut
            throw new Error(`Erreur lors de la génération des avis clients: ${error.message}`);
        });
        console.log('[DEBUG] Avis clients générés:', customerReviewsResult);
        console.log('[DEBUG] Type de customerReviewsResult:', typeof customerReviewsResult);
        console.log('[DEBUG] Est un tableau?', Array.isArray(customerReviewsResult));
        console.log('[DEBUG] Nombre d\'avis:', customerReviewsResult?.length || 0);
        
        console.log('[DEBUG] Génération de la FAQ');
        const faq = await generateFAQ(enrichedProductData).catch(error => {
            console.error('[ERROR] Erreur lors de la génération de la FAQ:', error);
            // Propager l'erreur au lieu de fournir des valeurs par défaut
            throw new Error(`Erreur lors de la génération de la FAQ: ${error.message}`);
        });
        
        console.log('[DEBUG] Génération des angles marketing avec TAM');
        const marketingAngles = await generateMarketingAnglesTAM(productData.deepResearch, enrichedProductData).catch(error => {
            console.error('[ERROR] Erreur lors de la génération des angles marketing:', error);
            // Propager l'erreur au lieu de fournir des valeurs par défaut
            throw new Error(`Erreur lors de la génération des angles marketing: ${error.message}`);
        });
        
        // Créer un objet pour les caractéristiques avec seulement version1
        const characteristics = { 
            version1: characteristicsResult,
            version2: null // Nous n'avons qu'une version
        };
        
        const customerReviews = {
            version1: customerReviewsResult,
            version2: null // Nous n'avons qu'une version
        };
        
        // LOGS DE DEBUG AVANT RETURN
        console.log('[DEBUG] VÉRIFICATION FINALE DES DONNÉES AVANT RETURN:');
        console.log('[DEBUG] useCases.version1:', useCases?.version1?.length || 0, 'éléments');
        console.log('[DEBUG] characteristics.version1:', characteristics?.version1?.length || 0, 'éléments');  
        console.log('[DEBUG] competitiveAdvantages.version1:', competitiveAdvantages?.version1?.length || 0, 'éléments');
        console.log('[DEBUG] Structure useCases.version1:', useCases?.version1?.slice(0, 2));
        console.log('[DEBUG] Structure characteristics.version1:', characteristics?.version1?.slice(0, 2));
        console.log('[DEBUG] Structure competitiveAdvantages.version1:', competitiveAdvantages?.version1?.slice(0, 2));
        
        return {
            psychographicProfile,
            strategicSynthesis,
            productTitle,
            productBenefits,
            howItWorks,
            emotionalBenefits,
            useCases,
            characteristics,
            competitiveAdvantages,
            customerReviews,
            faq,
            marketingAngles
        };
    } catch (error) {
        throw error;
    }
}

// Fonction pour vérifier et appliquer les options de contexte dans les prompts
function applyContextOptions(prompt, data, sectionKey) {
    console.log(`[CONTEXT-OPTIONS] 🔍 Application des options de contexte pour: ${sectionKey}`);
    
    // Récupérer l'état des checkboxes (si elles existent)
    const includeProductName = document.getElementById('includeProductName')?.checked ?? true;
    const includeDeepResearch = document.getElementById('includeDeepResearch')?.checked ?? true;
    const includeMarketingAngle = document.getElementById('includeMarketingAngle')?.checked ?? false;
    const includeCustomerAvatar = document.getElementById('includeCustomerAvatar')?.checked ?? false;
    
    console.log(`[CONTEXT-OPTIONS] États des checkboxes:`, {
        includeProductName,
        includeDeepResearch,
        includeMarketingAngle,
        includeCustomerAvatar
    });
    
    // Construire le contexte selon les options avec des variables
    let contextLines = [];
    
    if (includeProductName && data.productName) {
        contextLines.push(`Product name: {productName}`);
        console.log(`[CONTEXT-OPTIONS] ✅ Variable nom du produit incluse`);
    }
    
    if (includeDeepResearch && data.deepResearch) {
        contextLines.push(`Deep research: {deepResearch}`);
        console.log(`[CONTEXT-OPTIONS] ✅ Variable deep research incluse`);
    }
    
    if (includeMarketingAngle && data.marketingAngle) {
        contextLines.push(`Marketing angle: {marketingAngle}`);
        console.log(`[CONTEXT-OPTIONS] ✅ Variable angle marketing incluse`);
    }
    
    if (includeCustomerAvatar && data.selectedAvatar) {
        contextLines.push(`Avatar profile: {customerAvatar}`);
        console.log(`[CONTEXT-OPTIONS] ✅ Variable profil avatar incluse`);
    }
    
    // Appliquer le contexte au prompt
    let updatedPrompt = prompt;
    
    if (contextLines.length > 0) {
        const contextSection = `\n\n🧯 Context:\n${contextLines.join('\n')}\n`;
        
        // Chercher une section Context existante et la remplacer
        const contextRegex = /\n\n🧯 Context:\s*[\s\S]*?(?=\n\n✅|$)/;
        if (contextRegex.test(updatedPrompt)) {
            updatedPrompt = updatedPrompt.replace(contextRegex, contextSection);
            console.log(`[CONTEXT-OPTIONS] 🔄 Section Context remplacée`);
        } else {
            // Ajouter avant la section Output si elle existe
            const outputPosition = updatedPrompt.indexOf('\n\n✅ Output');
            if (outputPosition !== -1) {
                updatedPrompt = updatedPrompt.slice(0, outputPosition) + contextSection + updatedPrompt.slice(outputPosition);
            } else {
                updatedPrompt += contextSection;
            }
            console.log(`[CONTEXT-OPTIONS] ➕ Section Context ajoutée`);
        }
    } else {
        // Supprimer la section Context si aucune option n'est sélectionnée
        const contextRegex = /\n\n🧯 Context:\s*[\s\S]*?(?=\n\n✅|$)/;
        updatedPrompt = updatedPrompt.replace(contextRegex, '');
        console.log(`[CONTEXT-OPTIONS] ➖ Section Context supprimée (aucune option sélectionnée)`);
    }
    
    // Maintenant remplacer les variables par les vraies valeurs
    if (includeProductName && data.productName) {
        updatedPrompt = updatedPrompt.replace(/{productName}/g, data.productName);
        console.log(`[CONTEXT-OPTIONS] 🔄 Variable {productName} remplacée par: ${data.productName}`);
    }
    
    if (includeDeepResearch && data.deepResearch) {
        updatedPrompt = updatedPrompt.replace(/{deepResearch}/g, data.deepResearch);
        console.log(`[CONTEXT-OPTIONS] 🔄 Variable {deepResearch} remplacée`);
    }
    
    if (includeMarketingAngle && data.marketingAngle) {
        const angleText = `${data.marketingAngle.name} - ${data.marketingAngle.description}`;
        updatedPrompt = updatedPrompt.replace(/{marketingAngle}/g, angleText);
        console.log(`[CONTEXT-OPTIONS] 🔄 Variable {marketingAngle} remplacée par: ${data.marketingAngle.name}`);
    }
    
    if (includeCustomerAvatar && data.selectedAvatar) {
        const avatarText = `${data.selectedAvatar.name} - ${data.selectedAvatar.description}`;
        updatedPrompt = updatedPrompt.replace(/{customerAvatar}/g, avatarText);
        console.log(`[CONTEXT-OPTIONS] 🔄 Variable {customerAvatar} remplacée par: ${data.selectedAvatar.name}`);
    }
    
    console.log(`[CONTEXT-OPTIONS] ✅ Prompt final préparé pour: ${sectionKey}`);
    return updatedPrompt;
}

// Helper function to make API calls via notre serveur backend
async function callOpenAI(prompt, temperature = API_CONFIG.temperature, maxTokens = API_CONFIG.maxTokens, aiModel = API_CONFIG.model) {
    
    // DÉTECTION DE PROBLÈME : Vérifier si le modèle AI a été explicitement fourni
    if (arguments.length < 4) {
        console.error('PROBLÈME DÉTECTÉ: callOpenAI appelé sans modèle AI explicite!');
        console.error('Stack trace pour localiser l\'appel:', new Error().stack);
        console.warn('Utilisation du fallback:', API_CONFIG.model);
    }
    
    // DÉTECTION DE PROBLÈME : Vérifier si le modèle AI est valide
    if (aiModel === undefined || aiModel === null || aiModel === '') {
        console.error('PROBLÈME DÉTECTÉ: aiModel reçu comme undefined/null/vide!');
        console.error('Stack trace pour localiser l\'appel:', new Error().stack);
        console.warn('Utilisation du fallback:', API_CONFIG.model);
        aiModel = API_CONFIG.model;
    }
    
    try {
        console.log('[DEBUG] Appel au backend:', API_CONFIG.serverUrl);
        console.log('[DEBUG] Paramètres envoyés:', {
            model: getModelName(aiModel),
            temperature: temperature,
            max_tokens: maxTokens,
            // Ne pas loguer le prompt complet pour éviter de surcharger la console
            prompt_length: prompt.length
        });
        
        const response = await fetch(API_CONFIG.serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // Pas besoin d'Authorization header car la clé est gérée par le serveur
            },
            body: JSON.stringify({
                model: getModelName(aiModel),
                messages: [
                    { role: 'system', content: 'Vous êtes un expert en marketing et en développement de produits. Répondez exclusivement en français.' },
                    { role: 'user', content: prompt }
                ],
                temperature: temperature,
                max_tokens: maxTokens
            })
        });
        
        console.log('[DEBUG] Réponse reçue - Status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error || `Erreur HTTP: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message || data.error || 'Erreur lors de l\'appel au serveur backend');
        }

        // Le format de la réponse est le même que celui de l'API OpenAI directe
        return data.choices[0].message.content.trim();
    } catch (error) {
        // Renvoyer un message d'erreur plus convivial
        throw new Error(`Erreur de communication avec notre serveur: ${error.message}`);
    }
}

// Exposer la fonction callOpenAI globalement
window.callOpenAI = callOpenAI;

// Fonction pour générer les angles marketing avec le plus gros TAM
async function generateMarketingAnglesTAM(deepResearch, data) {
    console.log('[DEBUG] Génération des angles marketing avec TAM...');
    
    const prompt = `Avec l'analyse de mon produit suivante, identifie les angles marketing qui ont le plus gros TAM (Total Addressable Market) et classe-les par ordre de potentiel.

Analyse du produit :
${deepResearch}

Tu dois proposer entre 1 et 3 angles marketing maximum, classés par potentiel TAM décroissant.
Pour chaque angle, utilise ce format exact :

**ANGLE PRINCIPAL**
Titre : [Nom de l'angle marketing principal]
Explication : [Explique en détail pourquoi cet angle a le plus gros TAM, données de marché, tendances, taille du segment cible, potentiel de croissance, etc.]

**ANGLE SECONDAIRE 2** (si applicable)
Titre : [Nom du deuxième angle marketing]
Explication : [Explique pourquoi cet angle a un gros TAM et pourquoi il est le deuxième plus gros potentiel du marché, données de marché, tendances, taille du segment cible, etc.]

**ANGLE SECONDAIRE 3** (si applicable)
Titre : [Nom du troisième angle marketing]
Explication : [Explique pourquoi cet angle a un gros TAM et son potentiel de marché, données de marché, tendances, taille du segment cible, etc.]

INSTRUCTIONS IMPORTANTES :
- Commence directement par "**ANGLE PRINCIPAL**"
- Utilise les termes exacts "**ANGLE PRINCIPAL**", "**ANGLE SECONDAIRE 2**", "**ANGLE SECONDAIRE 3**"
- Chaque explication doit être détaillée et justifiée avec des données de marché
- Focus sur le potentiel TAM et la taille du marché addressable
- Ne propose que les angles avec un réel potentiel commercial significatif`

    try {
        const result = await callOpenAI(prompt, 0.7, 1200, data.aiModel);
        console.log('[DEBUG] Angles marketing générés avec succès');
        return result;
    } catch (error) {
        console.error('[ERROR] Erreur lors de la génération des angles marketing:', error);
        throw new Error(`Erreur lors de la génération des angles marketing: ${error.message}`);
    }
}

// Content generation functions
async function generatePsychographicProfile(data, prompt = null, temperature = 0.7) {
    let fullPrompt = prompt || `
You are a senior marketing strategist specialized in human psychology, neuromarketing, and buyer behavior. We are about to analyze the emotional and biological triggers behind why people would purchase a ${data.productName}.

I need you to analyze and output a structured JSON response with the following sections:

1. **Psychographic Profile** - What type of person is likely to buy this product? Beliefs, values, interests, personality traits

2. **Emotions to Evoke** - Based on this deep research, provide me with a comprehensive analysis in French of the key emotions that need to be evoked to trigger a purchase in this market. Structure your response with:
1. Main Emotions to Evoke - List and explain the primary emotional drivers that lead to purchases, with specific percentages and data points where available
2. Secondary Emotional Triggers - Include guilt, pride, anxiety, empathy, and other supporting emotions that influence buying decisions
3. Underlying Psychological/Biological Drivers - Explain any deeper psychological mechanisms, evolutionary factors, or neurochemical responses that drive consumer behavior
4. Emotional Combinations - Describe how these emotions work together to create purchase motivation
Format each emotion with:
- Clear explanation of the emotion
- Supporting data/statistics from the research
- Specific examples of how this manifests in purchase behavior
- Any relevant quotes or insights from the source material
Present this as actionable insights for marketing and sales strategy, focusing on the emotional landscape that drives consumer decisions in this market.

3. **Lifestyle Choices** - What are the typical lifestyle choices, habits, or routines of these people?
4. **Purchase Decision Logic** - What internal logic do they use to justify the purchase? Practical? Emotional? Long-term?
5. **Main Desire** - What is the true internal "why" behind the need for this product?
6. **Problems to Solve** - What pain points or frustrations are they hoping this product will remove?
7. **Biological Reasons** - Are there deeper biological instincts or survival patterns this product taps into?

Base your analysis on the following detailed research about the product:
${data.deepResearch || 'No detailed research provided.'}

Additional context about the product:
Product name: ${data.productName}
Product description: ${data.productDescription || 'Not specified'}
Target audience: ${data.targetAudience || 'Not specified'}
Product features: ${data.productFeatures || 'Not specified'}
Problems solved: ${data.problemsSolved || 'Not specified'}
Marketing angle: ${data.marketingAngle || 'Not specified'}

IMPORTANT: Return ONLY a JSON object in this exact format, with no additional text, explanations, or formatting:

{
  "mainProfile": "Detailed psychographic profile content here",
  "emotionsToEvoke": "Comprehensive analysis in French with structured sections: 1. Main Emotions to Evoke, 2. Secondary Emotional Triggers, 3. Underlying Psychological/Biological Drivers, 4. Emotional Combinations - with detailed explanations, data points, and actionable insights", 
  "lifestyleChoices": "Lifestyle patterns and habits content here",
  "decisionLogic": "Purchase decision logic content here",
  "mainDesire": "Primary desire and motivation content here",
  "problemsToSolve": "Core problems and pain points content here",
  "biologicalReasons": "Biological and evolutionary drivers content here"
}
`;

    return await callOpenAI(fullPrompt, temperature, 2000, data.aiModel);
}

async function generateStrategicSynthesis(data, psychographicProfile, temperature = 0.7) {
    let prompt = `
You are a senior expert in marketing strategy, behavioral psychology, and neurobiology. Today, we're preparing to sell a product and need to identify the key marketing drivers that will influence purchase decisions.

The product is: ${data.productName}  
Target market: France

`;

    if (psychographicProfile) {
        prompt += `
Below, I've included a comprehensive research summary about the market for this product. This includes psychographic profiles, emotional needs, biological drivers, and lifestyle patterns.  
Please read and extract key insights that can be used to **build a high-converting marketing message**.

🔽 TASKS:

1. **Émotions clés à susciter** : Identifiez les 3 à 5 émotions principales à activer.
2. **Motivations d'achat principales** : Résumez les principales motivations d'achat.
3. **Problèmes à Résoudre** : Listez les problèmes les plus pressants à résoudre.
4. **Drivers Biologiques Majeurs** : Listez les principaux drivers biologiques derrière l'achat.
5. **Angles marketing clés** : Définissez les angles marketing utilisables.
6. **Messages marketing à valeur ajoutée** : Proposez 3 messages marketing combinant bénéfices fonctionnels et émotionnels.

Utilisez EXACTEMENT ces titres avec les numéros. Soyez concis mais stratégique.
---

🧠 Market Research Input: 
${psychographicProfile}

Additional context about the product:
Product name: ${data.productName}
Product description: ${data.productDescription}
Target audience: ${data.targetAudience}
Product features: ${data.productFeatures}
Problems solved: ${data.problemsSolved}
Marketing angle: ${data.marketingAngle}

`;
    } else {
        // If no psychographic profile is available, generate a simpler strategic synthesis
        prompt += `
Please identify the key marketing drivers that will influence purchase decisions for this product based on the following information:

Product description: ${data.productDescription}
Target audience: ${data.targetAudience}
Product features: ${data.productFeatures}
Problems solved: ${data.problemsSolved}
Marketing angle: ${data.marketingAngle}

Please provide:

1. **Émotions clés à susciter** : Identifiez les 3 à 5 émotions principales à activer.
2. **Motivations d'achat principales** : Résumez les principales motivations d'achat.
3. **Problèmes à Résoudre** : Listez les problèmes les plus pressants à résoudre.
4. **Drivers Biologiques Majeurs** : Listez les principaux drivers biologiques derrière l'achat.
5. **Angles marketing clés** : Définissez les angles marketing utilisables.
6. **Messages marketing à valeur ajoutée** : Proposez 3 messages marketing combinant bénéfices fonctionnels et émotionnels.

Utilisez EXACTEMENT ces titres avec les numéros. Soyez concis mais stratégique.
`;
    }

    return await callOpenAI(prompt, temperature, 1000, data.aiModel);
}

async function generateProductTitle(data, prompt = null, temperature = 0.7) {
    console.log('[GENERATE-TITLE] 🎯 Données reçues pour génération:');
    console.log('[GENERATE-TITLE] - Nom du produit:', data.productName);
    console.log('[GENERATE-TITLE] - Description produit:', data.productDescription);
    console.log('[GENERATE-TITLE] - Public cible:', data.targetAudience);
    console.log('[GENERATE-TITLE] - Fonctionnalités:', data.productFeatures);
    console.log('[GENERATE-TITLE] - Problèmes résolus:', data.problemsSolved);
    console.log('[GENERATE-TITLE] - Angle marketing:', data.marketingAngle);
    console.log('[GENERATE-TITLE] - Profil avatar sélectionné:', data.selectedAvatar);
    
    let basePrompt = prompt || `
You are naming a product for an ecommerce Shopify store (French market).
✅ Your task:
Create 5 product names in French that are:
- Clear and descriptive (customers understand what it is)
- Appealing and memorable
- SEO-friendly (include relevant keywords)
- Max 40 characters each
- Avoid generic words like "Premium", "Ultimate", "Pro"

✅ Output: Return exactly 5 product names, one per line, numbered 1-5. Each name should be in plain text, max 40 characters, no explanation, no intro.
`;

    // Appliquer les options de contexte
    const fullPrompt = applyContextOptions(basePrompt, data, 'productTitle');

    console.log('[GENERATE-TITLE] 📝 PROMPT FINAL ENVOYÉ:');
    console.log('[GENERATE-TITLE] Prompt complet:', fullPrompt.substring(0, 500) + '...');
    console.log('[GENERATE-TITLE] 🔍 Vérification inclusion nom produit dans prompt:', fullPrompt.includes(data.productName));
    console.log('[GENERATE-TITLE] 🔍 Vérification inclusion description dans prompt:', fullPrompt.includes(data.productDescription));
    console.log('[GENERATE-TITLE] 🔍 Vérification inclusion angle marketing dans prompt:', data.marketingAngle ? fullPrompt.includes(data.marketingAngle.name) : false);
    console.log('[GENERATE-TITLE] 🔍 Vérification inclusion profil avatar dans prompt:', data.selectedAvatar ? fullPrompt.includes(data.selectedAvatar.name) : false);

    const result = await callOpenAI(fullPrompt, temperature, 250, data.aiModel);
    
    // Traiter la réponse pour extraire les 5 titres
    const lines = result.split('\n').filter(line => line.trim() !== '');
    
    // Extraire les titres (en supprimant les numéros au début si présents)
    const titles = lines.map(line => {
        // Supprimer le numéro et tout espace/tiret/point qui pourrait suivre
        return line.replace(/^\d+[.\s\-:)]?\s*/, '');
    }).filter(title => title.trim() !== '');
    
    // S'assurer d'avoir 5 titres ou moins
    const finalTitles = titles.slice(0, 5);
    
    console.log('[GENERATE-TITLE] 🔍 DEBUG RÉSULTAT:');
    console.log('[GENERATE-TITLE] - Résultat brut de l\'API:', result);
    console.log('[GENERATE-TITLE] - Lines extraites:', lines);
    console.log('[GENERATE-TITLE] - Titres après traitement:', titles);
    console.log('[GENERATE-TITLE] - Titres finaux (slice 0-5):', finalTitles);
    console.log('[GENERATE-TITLE] - Type du résultat final:', typeof finalTitles);
    console.log('[GENERATE-TITLE] - Est-ce un array?', Array.isArray(finalTitles));
    if (finalTitles.length > 0) {
        console.log('[GENERATE-TITLE] - Type du premier élément:', typeof finalTitles[0]);
        console.log('[GENERATE-TITLE] - Premier élément:', finalTitles[0]);
    }
    
    return finalTitles;
}

async function generateProductBenefits(data, prompt = null, temperature = 0.7) {
    console.log('[GENERATE-BENEFITS] 🎯 Données reçues pour génération:');
    console.log('[GENERATE-BENEFITS] - Nom du produit:', data.productName);
    console.log('[GENERATE-BENEFITS] - Description produit:', data.productDescription);
    console.log('[GENERATE-BENEFITS] - Public cible:', data.targetAudience);
    console.log('[GENERATE-BENEFITS] - Fonctionnalités:', data.productFeatures);
    console.log('[GENERATE-BENEFITS] - Problèmes résolus:', data.problemsSolved);
    console.log('[GENERATE-BENEFITS] - Angle marketing:', data.marketingAngle);
    console.log('[GENERATE-BENEFITS] - Profil avatar sélectionné:', data.selectedAvatar);
    
    let basePrompt = prompt || `
You are writing 20 product benefit bullets for a Shopify product page (French market).
Each benefit will be displayed visually as:
👉 A short title (max 4 words) → goes above
👉 A 1-sentence explanation (max 12 words) → goes below

📝 Each pair (title + explanation) must:
Be written in French
Title: max 4 words - clearly communicate a benefit
Plain text only, NO markdown formatting (no asterisks, no bold, no emphasis)
Explanation: max 1 short sentence (12 words max)
Plain text only, NO markdown formatting (no asterisks, no bold, no emphasis)
Focus on what makes the product better, faster, easier, simpler, stronger…
Designed to be displayed next to an icon or image

📝 These will appear in a "Why choose this product" or "Key benefits" section.
❌ Do not mention competitors directly.
❌ Do not use marketing fluff.
❌ Do NOT include numbers, bullets, or any prefixes (no 1., 2., 3., •, -, etc.)

🧯 Context:
Product name: ${data.productName}
Product description: ${data.productDescription}
Target audience: ${data.targetAudience}
Product features: ${data.productFeatures}
Problems solved: ${data.problemsSolved}
Marketing angle: ${data.marketingAngle}

✅ Output format: Return exactly 20 benefits. Each benefit must be 2 lines:
Line 1: Title (max 4 words) - NO numbers or prefixes
Line 2: Explanation (max 12 words) - NO numbers or prefixes
One pair per line, no extra intro or explanation, no numbering.

Example format:
Performance optimale
Résultats visibles dès la première utilisation
Facile à utiliser
Interface intuitive pour tous les niveaux
`;

    // Appliquer les options de contexte
    const fullPrompt = applyContextOptions(basePrompt, data, 'productBenefits');

    console.log('[GENERATE-BENEFITS] 📝 PROMPT FINAL ENVOYÉ:');
    console.log('[GENERATE-BENEFITS] Prompt complet:', fullPrompt.substring(0, 500) + '...');
    console.log('[GENERATE-BENEFITS] 🔍 Vérification inclusion nom produit dans prompt:', fullPrompt.includes(data.productName));
    console.log('[GENERATE-BENEFITS] 🔍 Vérification inclusion description dans prompt:', fullPrompt.includes(data.productDescription));
    console.log('[GENERATE-BENEFITS] 🔍 Vérification inclusion angle marketing dans prompt:', data.marketingAngle ? fullPrompt.includes(data.marketingAngle.name) : false);
    console.log('[GENERATE-BENEFITS] 🔍 Vérification inclusion profil avatar dans prompt:', data.selectedAvatar ? fullPrompt.includes(data.selectedAvatar.name) : false);

    const result = await callOpenAI(fullPrompt, temperature, 200, data.aiModel);
    
    // Fonction pour nettoyer les numéros et préfixes
    const cleanText = (text) => {
        return text
            .replace(/^\d+\.\s*/, '') // Supprime "1. ", "2. ", etc.
            .replace(/^•\s*/, '')     // Supprime "• "
            .replace(/^-\s*/, '')     // Supprime "- "
            .replace(/^\*\s*/, '')    // Supprime "* "
            .replace(/^\d+\)\s*/, '') // Supprime "1) ", "2) ", etc.
            .trim();
    };
    
    // Parse the result into an array of benefits with title and explanation
    const benefits = [];
    const lines = result.split('\n').filter(line => line.trim() !== '');
    
    for (let i = 0; i < lines.length; i += 2) {
        if (i + 1 < lines.length) {
            benefits.push({
                title: cleanText(lines[i]),
                description: cleanText(lines[i + 1])
            });
        }
    }
    
    console.log('[GENERATE-BENEFITS] 🔍 DEBUG RÉSULTAT:');
    console.log('[GENERATE-BENEFITS] - Résultat brut de l\'API:', result);
    console.log('[GENERATE-BENEFITS] - Lines extraites:', lines);
    console.log('[GENERATE-BENEFITS] - Nombre de bénéfices créés:', benefits.length);
    console.log('[GENERATE-BENEFITS] - Type du résultat final:', typeof benefits);
    console.log('[GENERATE-BENEFITS] - Est-ce un array?', Array.isArray(benefits));
    if (benefits.length > 0) {
        console.log('[GENERATE-BENEFITS] - Structure du premier élément:', Object.keys(benefits[0]));
        console.log('[GENERATE-BENEFITS] - Premier élément:', benefits[0]);
        console.log('[GENERATE-BENEFITS] - Type du titre:', typeof benefits[0].title);
        console.log('[GENERATE-BENEFITS] - Type de la description:', typeof benefits[0].description);
    }
    
    return benefits;
}

async function generateHowItWorks(data, prompt = null, temperature = 0.7) {
    let basePrompt = prompt || `
You are writing the "Comment ça marche ?" section of a Shopify product page (French market).
✅ Your task:
Write 1 clear, reassuring paragraph (3 to 4 sentences max)
In French
Use short sentences (max 20 words per sentence)
Use simple, everyday vocabulary
Focus on the process: how the customer uses the product step by step
Make it sound easy and straightforward

❌ Avoid:
Overly superlative language (avoid "parfait", "incroyable", "révolutionnaire")
Technical jargon or specs

✅ Output: Return only the paragraph in plain text, no intro, no explanation.
`;

    // Appliquer les options de contexte
    const fullPrompt = applyContextOptions(basePrompt, data, 'howItWorks');

    console.log('[GENERATE-HOW-IT-WORKS] 📝 PROMPT FINAL ENVOYÉ:');
    console.log('[GENERATE-HOW-IT-WORKS] Prompt complet:', fullPrompt.substring(0, 500) + '...');

    const result = await callOpenAI(fullPrompt, temperature, 150, data.aiModel);
    
    console.log('[GENERATE-HOW-IT-WORKS] 🔍 DEBUG RÉSULTAT:');
    console.log('[GENERATE-HOW-IT-WORKS] - Résultat brut de l\'API:', result);
    console.log('[GENERATE-HOW-IT-WORKS] - Type du résultat:', typeof result);
    console.log('[GENERATE-HOW-IT-WORKS] - Longueur:', result?.length || 0);
    
    return result.trim();
}

async function generateEmotionalBenefits(data, prompt = null, temperature = 0.7) {
    const fullPrompt = prompt || `
You are writing 10 emotional headline + text blocks for a Shopify product page (French market).

✅ Each block must include:
Headline (1 line):
In French
Max 40 characters
Plain text only, NO markdown formatting (no asterisks, no bold, no emphasis)
Emotion-driven
Must convey "SOULAGEMENT" (relief) as the main emotion
Optionally include a secondary emotion (comfort, control…)

Text body (2-3 sentences):
In French
Each sentence max 15 words
Address one specific pain point
Describe the emotional relief the product provides
Use "vous" for addressing the customer

📝 Format example:
Plus de stress, enfin !
Vous vous sentez enfin libre de vos préoccupations. Ce produit résout instantanément votre problème. Votre tranquillité d'esprit retrouvée !

✅ Context:
Product name: ${data.productName}
Product description: ${data.productDescription}
Target audience: ${data.targetAudience}
Product features: ${data.productFeatures}
Problems solved: ${data.problemsSolved}
Marketing angle: ${data.marketingAngle}

✅ Output format: Return 10 blocks with headline + text body. Each block separated by an empty line. Plain text only, no markdown formatting.
`;

    try {
        console.log('[DEBUG] Envoi de la requête à OpenAI pour les bénéfices émotionnels');
        const result = await callOpenAI(fullPrompt, temperature, 500, data.aiModel);
        console.log('[DEBUG] Réponse d\'OpenAI reçue pour les bénéfices émotionnels:', result ? result.substring(0, 100) + '...' : 'null ou vide');
        
        if (!result) {
            console.error('[ERROR] La réponse d\'OpenAI est vide ou null pour les bénéfices émotionnels');
            throw new Error('La réponse d\'OpenAI est vide ou null pour les bénéfices émotionnels');
        }
        
        // Parse the result into an array of headline and text pairs
        const blocks = result.split('\n\n').filter(block => block.trim() !== '');
        
        // Vérifier si nous avons au moins un bloc
        if (!blocks || blocks.length === 0) {
            console.error('[ERROR] Aucun bloc de bénéfice émotionnel n\'a été généré');
            // Retourner un tableau par défaut avec deux bénéfices émotionnels
            return [
                { headline: "Enfin soulagé", text: "Plus de stress ni d'inquiétude. Notre produit vous apporte la tranquillité d'esprit que vous recherchez depuis longtemps." },
                { headline: "Confort retrouvé", text: "Dites adieu aux inconforts quotidiens. Profitez d'une expérience plus agréable et d'une qualité de vie améliorée." }
            ];
        }
        
        return blocks.map((block, index) => {
            try {
                const lines = block.split('\n');
                
                // Vérifier si nous avons au moins une ligne pour le titre
                if (!lines || lines.length === 0 || !lines[0] || lines[0].trim() === '') {
                    return {
                        headline: `Bénéfice émotionnel ${index + 1}`,
                        text: "Description du bénéfice émotionnel non disponible."
                    };
                }
                
                return {
                    headline: lines[0].replace(/!+$/, '').trim(), // Supprimer les "!" à la fin
                    text: lines.slice(1).join(' ').replace(/!+$/, '').trim() || "Description du bénéfice émotionnel non disponible."
                };
            } catch (error) {
                return {
                    headline: `Bénéfice émotionnel ${index + 1}`,
                    text: "Description du bénéfice émotionnel non disponible."
                };
            }
        });
    } catch (error) {
        // Retourner un tableau par défaut avec deux bénéfices émotionnels
        return [
            { headline: "Enfin soulagé", text: "Plus de stress ni d'inquiétude. Notre produit vous apporte la tranquillité d'esprit que vous recherchez depuis longtemps." },
            { headline: "Confort retrouvé", text: "Dites adieu aux inconforts quotidiens. Profitez d'une expérience plus agréable et d'une qualité de vie améliorée." }
        ];
    }
}

async function generateUseCases(data, prompt = null, temperature = 0.7) {
    const fullPrompt = prompt || `
You are writing 10 product use cases for a Shopify product page (French market).
Each use case will be displayed visually as:
👉 A short title (max 4 words) → goes above
👉 A 1-sentence explanation (max 12 words) → goes below

📝 Each pair (title + explanation) must:
Be written in French
Title: max 4 words
Plain text only, NO markdown formatting (no asterisks, no bold, no emphasis)
Explanation: max 1 short sentence (12 words max)
Plain text only, NO markdown formatting (no asterisks, no bold, no emphasis)
Describe a specific situation where the product solves a problem or makes life easier
Focus on real-life, relatable, concrete contexts
Highlight the practical or emotional benefit for the user

✅ Context:
Product name: ${data.productName}
Product description: ${data.productDescription}
Target audience: ${data.targetAudience}
Product features: ${data.productFeatures}
Problems solved: ${data.problemsSolved}
Marketing angle: ${data.marketingAngle}

✅ Output format: Return exactly 10 use cases. Each use case must be 2 lines:
Line 1: Title (max 4 words)
Line 2: Explanation (max 12 words)
One pair per line, no extra intro or explanation.
`;

    const result = await callOpenAI(fullPrompt, temperature, 300, data.aiModel);
    
    // Parse the result into an array of use cases
    const useCases = [];
    const lines = result.split('\n').filter(line => line.trim() !== '');
    
    for (let i = 0; i < lines.length; i += 2) {
        if (i + 1 < lines.length) {
            useCases.push({
                title: lines[i].trim(),
                explanation: lines[i + 1].trim()
            });
        }
    }
    
    return useCases;
}

async function generateCharacteristics(data, prompt = null, temperature = 0.7) {
    const fullPrompt = prompt || `
You are writing 15 product characteristics for a Shopify product page (French market).
Each characteristic will be displayed visually as:
👉 A short title (max 4 words) → goes above
👉 A 1-sentence explanation (max 12 words) → goes below

📝 Each pair (title + explanation) must:
Be written in French
Focus on a technical characteristic or specification of the product
Title: max 4 words
Plain text only, NO markdown formatting (no asterisks, no bold, no emphasis)
Explanation: max 1 short sentence (12 words max)
Plain text only, NO markdown formatting (no asterisks, no bold, no emphasis)
No emotional or marketing claims
No price, sales, or discount language
Clear, simple, factual

✅ Context:
Product name: ${data.productName}
Product description: ${data.productDescription}
Target audience: ${data.targetAudience}
Product features: ${data.productFeatures}
Problems solved: ${data.problemsSolved}
Marketing angle: ${data.marketingAngle}

✅ Output format: Return exactly 15 characteristics. Each characteristic must be 2 lines:
Line 1: Title (max 4 words)
Line 2: Explanation (max 12 words)
One pair per line, no extra intro or explanation.
`;

    try {
        console.log('[DEBUG] Envoi de la requête à OpenAI pour les caractéristiques');
        const result = await callOpenAI(fullPrompt, temperature, 1000, data.aiModel);
        console.log('[DEBUG] Réponse d\'OpenAI reçue pour les caractéristiques:', result ? result.substring(0, 100) + '...' : 'null ou vide');
        
        if (!result) {
            console.error('[ERROR] La réponse d\'OpenAI est vide ou null pour les caractéristiques');
            throw new Error('La réponse d\'OpenAI est vide ou null pour les caractéristiques');
        }
        
        // Parse the result into an array of title and explanation pairs
        const characteristics = [];
        const lines = result.split('\n').filter(line => line.trim() !== '');
        
        for (let i = 0; i < lines.length; i += 2) {
            if (i + 1 < lines.length) {
                characteristics.push({
                    title: lines[i].replace(/^\[|\]$/g, ''),
                    explanation: lines[i + 1].replace(/^\[|\]$/g, '')
                });
            }
        }
        
        console.log(`[DEBUG] Nombre de caractéristiques extraites: ${characteristics.length}`, characteristics.slice(0, 2));
        return characteristics;
    } catch (error) {
        console.error('[ERROR] Erreur lors de la génération des caractéristiques:', error);
        console.error('[ERROR] Stack trace:', error.stack);
        throw error;
    }
}

async function generateCompetitiveAdvantages(data, prompt = null, temperature = 0.7) {
    const fullPrompt = prompt || `
You are writing 10 competitive advantages for a Shopify product page (French market).
Each advantage will be displayed visually as:
👉 A short title (max 4 words) → goes above
👉 A 1-sentence explanation (max 12 words) → goes below

📝 Each pair (title + explanation) must:
Be written in French
Title: max 4 words - clearly communicate a competitive advantage
Plain text only, NO markdown formatting (no asterisks, no bold, no emphasis)
Explanation: max 1 short sentence (12 words max)
Plain text only, NO markdown formatting (no asterisks, no bold, no emphasis)
Focus on what makes the product better, faster, easier, simpler, stronger…
Designed to be displayed next to an icon or image

📝 These will appear in a "Why choose this product" or "Key advantages" section.
❌ Do not mention competitors directly.
❌ Do not use marketing fluff.

🧯 Context:
Product name: ${data.productName}
Product description: ${data.productDescription}
Target audience: ${data.targetAudience}
Product features: ${data.productFeatures}
Problems solved: ${data.problemsSolved}
Marketing angle: ${data.marketingAngle}

✅ Output format: Return exactly 10 advantages. Each advantage must be 2 lines:
Line 1: Title (max 4 words)
Line 2: Explanation (max 12 words)
One pair per line, no extra intro or explanation.
`;

    const result = await callOpenAI(fullPrompt, temperature, 200, data.aiModel);
    
    // Parse the result into an array of advantages with title and explanation
    const advantages = [];
    const lines = result.split('\n').filter(line => line.trim() !== '');
    
    for (let i = 0; i < lines.length; i += 2) {
        if (i + 1 < lines.length) {
            advantages.push({
                title: lines[i].trim(),
                explanation: lines[i + 1].trim()
            });
        }
    }
    
    return advantages;
}

async function generateCustomerReviews(data, prompt = null, temperature = 0.7) {
    const fullPrompt = prompt || `
You are writing 10 customer reviews for a Shopify product page (French market).
✅ Each review must:
Be in French
Genuine and realistic (not overly promotional)
Include a realistic customer name (French first name only)
Be written as if from a real user experience
Mix of emotional and practical feedback
Variation in length (some short, some detailed)
Include specific mentions of problems solved or benefits experienced
NO MARKDOWN FORMATTING (no asterisks, no bold, no emphasis)

❌ Do not include:
Company names, competitor references, pricing, discounts, warranty details
Overly superlative language (avoid "parfait", "incroyable", "révolutionnaire")
Technical jargon or specs

📝 Context:
Product name: ${data.productName}
Product description: ${data.productDescription}
Target audience: ${data.targetAudience}
Product features: ${data.productFeatures}
Problems solved: ${data.problemsSolved}
Marketing angle: ${data.marketingAngle}

✅ Output format: Return exactly 10 reviews, each formatted on ONE line as "Name: Review text", no numbering, no intro, no explanation.
Example:
Sophie: Ce lit a vraiment changé la vie de mon chien, il dort bien mieux maintenant.
Alexandre: Mon chien semble plus à l'aise depuis qu'il a ce nouveau lit.
`;

    const result = await callOpenAI(fullPrompt, temperature, 1800, data.aiModel);
    
    // Parse the result into an array of customer reviews
    const reviews = [];
    const lines = result.split('\n').filter(line => line.trim() !== '');
    
    console.log('[DEBUG] Parsing des avis clients - nombre de lignes:', lines.length);
    console.log('[DEBUG] Première ligne:', lines[0]);
    
    lines.forEach((line, index) => {
        let fullLine = line.trim();
        
        // Retirer la numérotation si présente
        fullLine = fullLine.replace(/^\d+\.\s*/, ''); // Supprimer "1. ", "2. ", etc.
        
        // Chercher le séparateur ":" pour diviser nom et avis
        const colonIndex = fullLine.indexOf(':');
        
        if (colonIndex !== -1) {
            let name = fullLine.substring(0, colonIndex).trim();
            let review = fullLine.substring(colonIndex + 1).trim();
            
            // Nettoyer le nom: retirer les préfixes éventuels
            name = name.replace(/^Nom\s*$/i, ''); // Supprimer "Nom"
            name = name.replace(/^Client\s*$/i, ''); // Supprimer "Client"
            
            // Nettoyer l'avis: retirer les préfixes éventuels
            review = review.replace(/^Avis\s*:\s*/i, ''); // Supprimer "Avis: "
            review = review.replace(/^Texte\s*:\s*/i, ''); // Supprimer "Texte: "
            
            if (name && review) {
                console.log(`[DEBUG] Avis ${index + 1} parsé:`, { name, review });
                
                reviews.push({
                    name: name,
                    rating: 5, // Note par défaut
                    review: review
                });
            } else {
                console.warn(`[DEBUG] Ligne ${index + 1} ignorée - nom ou avis manquant:`, { name, review });
            }
        } else {
            console.warn(`[DEBUG] Ligne ${index + 1} ignorée - pas de séparateur ':':`, fullLine);
        }
    });

    console.log('[DEBUG] Nombre total d\'avis parsés:', reviews.length);
    console.log('[DEBUG] Avis clients générés:', reviews);
    
    return reviews;
}

async function generateFAQ(data, prompt = null, temperature = 0.7) {
    console.log('[DEBUG] generateFAQ - Début génération FAQ');
    console.log('[DEBUG] generateFAQ - data reçue:', data);
    
    const fullPrompt = prompt || `
You are writing 5 product FAQ entries for a Shopify product page (French market).
✅ Each FAQ must:
Be in French
Address real customer concerns or questions about the product
Include both a question and a detailed answer
Questions should be natural and conversational (how customers actually ask)
Answers should be helpful, reassuring, and informative
NO MARKDOWN FORMATTING (no asterisks, no bold, no emphasis)

❌ Do not include:
Company names, competitor references, pricing, discounts, warranty details
Overly superlative language (avoid "parfait", "incroyable", "révolutionnaire")
Technical jargon or specs

📝 Context:
Product name: ${data.productName}
Product description: ${data.productDescription}
Target audience: ${data.targetAudience}
Product features: ${data.productFeatures}
Problems solved: ${data.problemsSolved}
Marketing angle: ${data.marketingAngle}

✅ Output Format: Return exactly 5 FAQs. Each FAQ must be formatted as:
Question on first line (complete question ending with ?)
Answer on second line (only the answer, no repetition of the question)
Empty line between each FAQ

Example:
Est-ce que ce produit convient aux débutants ?
Oui, ce produit a été conçu pour être facile à utiliser même pour les débutants.

Comment entretenir ce produit ?
Un simple nettoyage à l'eau tiède suffit pour maintenir le produit en bon état.
`;

    console.log('[DEBUG] generateFAQ - Appel OpenAI avec prompt');
    const result = await callOpenAI(fullPrompt, temperature, 800, data.aiModel);
    console.log('[DEBUG] generateFAQ - Résultat brut de OpenAI:', result);
    
    // Parse the result into an array of FAQs
    const faqs = [];
    const blocks = result.split('\n\n').filter(block => block.trim() !== '');
    console.log('[DEBUG] generateFAQ - Blocs trouvés:', blocks);
    
    blocks.forEach(block => {
        let question = '';
        let answer = '';
        
        // Essayer de séparer par lignes d'abord
        const lines = block.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length >= 2) {
            // Format multi-lignes
            question = lines[0].trim();
            answer = lines.slice(1).join(' ').trim();
        } else if (lines.length === 1) {
            // Format une seule ligne - essayer de séparer par des patterns
            const line = lines[0].trim();
            
            // Chercher des patterns comme "Question: ... Réponse: ..." ou "Q: ... R: ..."
            const patterns = [
                /^(.+?)\s*[Rr]éponse\s*:\s*(.+)$/,
                /^(.+?)\s*[Rr]\s*:\s*(.+)$/,
                /^(.+?)\s*-\s*(.+)$/,
                /^(.+?)\?\s*(.+)$/  // Question se terminant par ? suivie de la réponse
            ];
            
            let matched = false;
            for (const pattern of patterns) {
                const match = line.match(pattern);
                if (match) {
                    question = match[1].trim();
                    answer = match[2].trim();
                    matched = true;
                    break;
                }
            }
            
            // Si aucun pattern ne marche, couper à la moitié
            if (!matched) {
                const midPoint = Math.floor(line.length / 2);
                const questionEndIndex = line.lastIndexOf('?', midPoint);
                if (questionEndIndex > 0) {
                    question = line.substring(0, questionEndIndex + 1).trim();
                    answer = line.substring(questionEndIndex + 1).trim();
                } else {
                    question = line.substring(0, midPoint).trim();
                    answer = line.substring(midPoint).trim();
                }
            }
        }
        
        // Nettoyer les préfixes de la question
        question = question.replace(/^(FAQ\s*\d+\s*:|Question\s*\d+\s*:|\d+\.\s*|Q\s*:)/i, '').trim();
        
        // Nettoyer les préfixes de la réponse
        answer = answer.replace(/^(Réponse\s*:|R\s*:)/i, '').trim();
        
        if (question && answer) {
            faqs.push({
                question: question,
                answer: answer
            });
        }
    });
    
    console.log('[DEBUG] generateFAQ - FAQs parsées:', faqs);
    console.log('[DEBUG] generateFAQ - Nombre de FAQs:', faqs.length);
    
    return faqs;
}

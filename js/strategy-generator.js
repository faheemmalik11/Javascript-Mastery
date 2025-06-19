/**
 * Strategy Generator - Génère les données de stratégie pour l'avatar
 */

// Fonction pour générer les données de stratégie
window.generateStrategySections = async function(deepResearch, productName, aiModel = null) {
    console.log('[Strategy] === DÉBUT GÉNÉRATION DONNÉES STRATÉGIE ===');
    console.log('[Strategy] deepResearch:', deepResearch);
    console.log('[Strategy] productName:', productName);
    console.log('[Strategy] aiModel:', aiModel);
    
    try {
        // Vérifier que deepResearch est fourni
        if (!deepResearch || deepResearch.trim() === '') {
            console.warn('[Strategy] deepResearch vide ou non fourni, utilisation des données par défaut');
            return getDefaultStrategySections();
        }

        // Prompt de base
        let strategyPrompt = `En tant qu'expert en marketing et psychologie du consommateur, analyse cette description de produit et génère une stratégie marketing détaillée.

DESCRIPTION: ${deepResearch}

Génère une analyse stratégique basée UNIQUEMENT sur le contenu fourni.

Réponds UNIQUEMENT dans ce format JSON valide (sans HTML, uniquement du texte simple):
{
  "keyEmotions": "Analyse complète en français des émotions clés à évoquer pour déclencher un achat dans ce marché. Inclure: émotions principales, déclencheurs secondaires, drivers psychologiques sous-jacents, et combinaisons émotionnelles - avec explications détaillées et insights actionnables",
  "purchaseMotivations": ["Motivation d'achat 1", "Motivation d'achat 2", "Motivation d'achat 3", "Motivation d'achat 4"],
  "biologicalDrivers": ["Driver biologique 1", "Driver biologique 2", "Driver biologique 3", "Driver biologique 4"],
  "marketingAngles": ["Angle marketing 1", "Angle marketing 2", "Angle marketing 3", "Angle marketing 4"],
  "valueAddedMessages": ["Message à valeur ajoutée 1", "Message à valeur ajoutée 2", "Message à valeur ajoutée 3", "Message à valeur ajoutée 4"]
}`;

        // Vérifier que callOpenAI est disponible
        if (typeof callOpenAI !== 'function') {
            console.warn('[Strategy] callOpenAI non disponible, utilisation des données par défaut');
            return getDefaultStrategySections();
        }
        
        // Utiliser le modèle AI passé en paramètre, sinon fallback vers l'interface, puis chatgpt
        const modelToUse = aiModel || document.querySelector('input[name="ai-model"]:checked')?.value || 'chatgpt';
        console.log('[Strategy] Modèle utilisé:', modelToUse);
        
        // Ajuster les paramètres selon le modèle
        let maxTokens = 2500;
        let temperature = 0.7;
        
        if (modelToUse && modelToUse.includes('gpt')) {
            maxTokens = 3000; // Plus de tokens pour GPT qui a tendance à couper
            temperature = 0.8; // Plus créatif pour compenser la granularité
        } else {
        }
        
        console.log('[Strategy] Appel API avec maxTokens:', maxTokens, 'temperature:', temperature);
        
        // Appel à l'API OpenAI pour générer les données de stratégie
        const response = await callOpenAI(strategyPrompt, temperature, maxTokens, modelToUse);
        console.log('[Strategy] Réponse API reçue, longueur:', response?.length || 0);
        
        // Parser la réponse JSON
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.warn('[Strategy] Pas de JSON trouvé dans la réponse stratégie, utilisation des données par défaut');
            console.log('[Strategy] Réponse complète qui n\'a pas de JSON:', response);
            return getDefaultStrategySections();
        }
        
        console.log('[Strategy] JSON extrait:', jsonMatch[0]);
        
        let strategyData;
        try {
            strategyData = JSON.parse(jsonMatch[0]);
            console.log('[Strategy] Données de stratégie générées:', strategyData);
        } catch (parseError) {
            console.error('[Strategy] Erreur de parsing JSON:', parseError);
            console.error('[Strategy] JSON malformé:', jsonMatch[0]);
            console.warn('[Strategy] Utilisation des données par défaut à cause du JSON malformé');
            return getDefaultStrategySections();
        }
        
        // Vérifier que keyEmotions est bien rempli
        if (!strategyData.keyEmotions || strategyData.keyEmotions.includes('Émotion 1')) {
            console.warn('[Strategy] keyEmotions vide ou contient des données template, utilisation des données par défaut');
            return getDefaultStrategySections();
        }
        
        return strategyData;
        
    } catch (error) {
        console.error('[Strategy] Erreur lors de la génération des données de stratégie:', error);
        console.error('[Strategy] Stack trace:', error.stack);
        console.error('[Strategy] Type d\'erreur:', typeof error);
        console.error('[Strategy] Message d\'erreur:', error.message);
        return getDefaultStrategySections();
    }
};

// Fonction pour retourner des données de stratégie par défaut
function getDefaultStrategySections() {
    return {
        keyEmotions: "Analyse des émotions clés : Confiance en l'efficacité du produit, enthousiasme pour l'amélioration, sérénité face aux défis quotidiens. Ces émotions sont essentielles pour déclencher l'achat car elles répondent aux besoins psychologiques fondamentaux des consommateurs.",
        purchaseMotivations: [
            "Recherche de solutions pratiques",
            "Désir d'optimisation du temps",
            "Volonté d'améliorer sa qualité de vie",
            "Besoin de résultats concrets"
        ],
        biologicalDrivers: [
            "Besoin de sécurité et de contrôle",
            "Désir d'accomplissement personnel",
            "Recherche de reconnaissance sociale",
            "Instinct de survie et d'adaptation"
        ],
        marketingAngles: [
            "Mise en avant de l'efficacité prouvée",
            "Témoignages d'utilisateurs satisfaits",
            "Comparaison avec les méthodes traditionnelles",
            "Garantie de résultats mesurables"
        ],
        valueAddedMessages: [
            "Solution innovante éprouvée",
            "Retour sur investissement garanti",
            "Support client expert inclus",
            "Résultats visibles rapidement"
        ]
    };
}

// Exposer la fonction globalement
window.getDefaultStrategySections = getDefaultStrategySections;

/**
 * Content Generator - Gère la génération de contenu via l'API OpenAI
 */

// Fonction principale pour générer tout le contenu
async function generateAllContent(productData) {
    console.log('[DEBUG] Début de generateAllContent');
    console.log('[DEBUG] Données du produit reçues:', productData);
    
    try {
        console.log('[DEBUG] Vérification des configurations');
        
        // Extraire les détails du produit si nécessaire
        if (productData.deepResearch && (!productData.productDescription || !productData.targetAudience || !productData.productFeatures || !productData.problemsSolved)) {
            console.log('[DEBUG] Appel extractProductDetails...');
            try {
                const extractedData = await extractProductDetails(productData.deepResearch, productData.productName);
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
        
        // Pour cette version simplifiée, nous allons simuler la génération de contenu
        // Dans une implémentation réelle, ces appels seraient faits à l'API OpenAI
        
        // Simuler un délai pour la génération
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Générer le contenu simulé
        const psychographicProfile = {
            version1: `<strong>Profil psychographique pour ${productData.productName}</strong>
            
<u>Motivations principales:</u>
- Recherche d'efficacité et de gain de temps
- Désir de simplifier les tâches quotidiennes
- Aspiration à une meilleure qualité de vie

<u>Points de douleur:</u>
- Frustration face aux méthodes traditionnelles
- Sentiment d'être dépassé par la technologie
- Inquiétude concernant le rapport qualité-prix`,
            version2: `<strong>Analyse psychographique des utilisateurs de ${productData.productName}</strong>
            
<u>Facteurs de motivation:</u>
- Optimisation du temps et des ressources
- Recherche de solutions innovantes
- Volonté d'améliorer son quotidien

<u>Freins à l'achat:</u>
- Scepticisme face aux nouvelles technologies
- Préoccupation concernant la courbe d'apprentissage
- Sensibilité au prix et retour sur investissement`
        };
        
        const strategicSynthesis = {
            version1: `<strong>Synthèse stratégique pour ${productData.productName}</strong>
            
Pour maximiser l'impact marketing de ${productData.productName}, nous recommandons:

1. Mettre l'accent sur la simplicité d'utilisation et les gains de temps
2. Démontrer clairement le retour sur investissement
3. Utiliser des témoignages d'utilisateurs pour renforcer la crédibilité
4. Proposer une période d'essai pour réduire la perception du risque`,
            version2: `<strong>Recommandations stratégiques pour ${productData.productName}</strong>
            
Notre analyse suggère les approches suivantes:

1. Créer du contenu éducatif montrant les avantages concrets du produit
2. Développer une communication axée sur la résolution de problèmes
3. Mettre en avant la fiabilité et la qualité du support client
4. Utiliser des comparaisons avec les méthodes traditionnelles pour illustrer la valeur ajoutée`
        };
        
        const productTitle = {
            version1: `${productData.productName} - La solution innovante qui révolutionne votre quotidien`,
            version2: `Découvrez ${productData.productName} - L'outil indispensable pour des résultats exceptionnels`
        };
        
        const productBenefits = {
            version1: `<strong>Les principaux avantages de ${productData.productName}</strong>
            
1. <strong>Gain de temps significatif</strong> - Réduisez de 50% le temps consacré à cette tâche
2. <strong>Facilité d'utilisation</strong> - Interface intuitive, prise en main en moins de 5 minutes
3. <strong>Résultats professionnels</strong> - Qualité supérieure garantie à chaque utilisation
4. <strong>Économies substantielles</strong> - Rentabilisez votre investissement en quelques semaines`,
            version2: `<strong>Pourquoi choisir ${productData.productName}?</strong>
            
1. <strong>Performance inégalée</strong> - Des résultats supérieurs à la concurrence
2. <strong>Design ergonomique</strong> - Conçu pour maximiser votre confort d'utilisation
3. <strong>Polyvalence remarquable</strong> - S'adapte à tous vos besoins et situations
4. <strong>Durabilité exceptionnelle</strong> - Un investissement fiable pour les années à venir`
        };
        
        const howItWorks = {
            version1: `<strong>Comment fonctionne ${productData.productName}</strong>
            
1. <u>Étape 1:</u> Sélectionnez votre mode de fonctionnement préféré
2. <u>Étape 2:</u> Configurez les paramètres selon vos besoins spécifiques
3. <u>Étape 3:</u> Lancez l'opération et laissez ${productData.productName} faire le travail
4. <u>Étape 4:</u> Profitez des résultats optimaux en un temps record`,
            version2: `<strong>Le fonctionnement de ${productData.productName} en 4 étapes simples</strong>
            
1. <u>Préparation:</u> Mettez en place votre équipement en quelques secondes
2. <u>Personnalisation:</u> Ajustez les options selon vos préférences
3. <u>Exécution:</u> Activez ${productData.productName} d'un simple geste
4. <u>Finalisation:</u> Admirez les résultats parfaits, prêts à l'emploi`
        };
        
        const emotionalBenefits = {
            version1: `<strong>Les bénéfices émotionnels de ${productData.productName}</strong>
            
• <em>Tranquillité d'esprit</em> - Fini le stress lié aux méthodes traditionnelles
• <em>Fierté</em> - Impressionnez votre entourage avec des résultats professionnels
• <em>Satisfaction</em> - Ressentez le plaisir du travail bien fait, sans effort
• <em>Confiance</em> - Abordez chaque tâche avec l'assurance de réussir`,
            version2: `<strong>Ce que ${productData.productName} vous fait ressentir</strong>
            
• <em>Libération</em> - Gagnez du temps pour ce qui compte vraiment dans votre vie
• <em>Accomplissement</em> - Atteignez facilement des objectifs auparavant difficiles
• <em>Sérénité</em> - Éliminez les frustrations quotidiennes liées à cette tâche
• <em>Enthousiasme</em> - Redécouvrez le plaisir d'obtenir des résultats parfaits`
        };
        
        const useCases = {
            version1: `<strong>Cas d'utilisation de ${productData.productName}</strong>
            
• <u>Pour les particuliers:</u> Simplifiez vos tâches quotidiennes
• <u>Pour les professionnels:</u> Optimisez votre productivité et vos résultats
• <u>Pour les débutants:</u> Obtenez des résultats professionnels sans expertise
• <u>Pour les experts:</u> Atteignez un nouveau niveau de performance`,
            version2: `<strong>Comment utiliser ${productData.productName}</strong>
            
• <u>À la maison:</u> Transformez vos projets personnels en réussites
• <u>Au bureau:</u> Impressionnez vos collègues et clients avec des résultats impeccables
• <u>En déplacement:</u> Profitez de la portabilité pour des résultats partout
• <u>Pour les événements spéciaux:</u> Créez des moments mémorables sans stress`
        };
        
        const characteristics = {
            version1: `<strong>Caractéristiques techniques de ${productData.productName}</strong>
            
• <strong>Dimensions:</strong> Compact et ergonomique (25 x 15 x 10 cm)
• <strong>Poids:</strong> Léger et facile à manipuler (seulement 1,2 kg)
• <strong>Matériaux:</strong> Construction robuste en alliage premium
• <strong>Alimentation:</strong> Batterie longue durée (jusqu'à 8 heures d'utilisation)
• <strong>Connectivité:</strong> Bluetooth 5.0 et WiFi intégrés
• <strong>Compatibilité:</strong> Fonctionne avec tous les systèmes modernes`
        };
        
        const competitiveAdvantages = {
            version1: `<strong>Nos avantages face à la concurrence</strong>
            
• <u>Innovation supérieure</u> - Technologie brevetée exclusive à ${productData.productName}
• <u>Rapport qualité-prix imbattable</u> - Plus de fonctionnalités pour un prix compétitif
• <u>Service client exceptionnel</u> - Support dédié 7j/7 et garantie étendue
• <u>Évolutivité garantie</u> - Mises à jour régulières et accessoires compatibles`,
            version2: `<strong>Ce qui distingue ${productData.productName} de la concurrence</strong>
            
• <u>Performance supérieure</u> - 35% plus efficace que les produits similaires
• <u>Conception écologique</u> - Matériaux durables et consommation réduite
• <u>Personnalisation avancée</u> - Adaptez parfaitement le produit à vos besoins
• <u>Communauté active</u> - Rejoignez des milliers d'utilisateurs satisfaits`
        };
        
        const customerReviews = {
            version1: `<strong>Ce que disent nos clients</strong>
            
★★★★★ <em>"${productData.productName} a complètement transformé ma façon de travailler. Je ne peux plus m'en passer!"</em> - Marie L.

★★★★★ <em>"Incroyablement simple à utiliser et les résultats sont impressionnants. Un investissement que je ne regrette pas."</em> - Thomas D.

★★★★★ <em>"Le service client est aussi exceptionnel que le produit lui-même. Toujours disponibles pour répondre à mes questions."</em> - Sophie M.`
        };
        
        const faq = {
            version1: `<strong>Questions fréquemment posées</strong>
            
<strong>Q: Combien de temps faut-il pour maîtriser ${productData.productName}?</strong>
R: La plupart des utilisateurs sont opérationnels en moins de 5 minutes grâce à notre interface intuitive.

<strong>Q: ${productData.productName} est-il compatible avec tous les équipements?</strong>
R: Oui, notre produit est conçu pour fonctionner avec la majorité des équipements standards du marché.

<strong>Q: Quelle est la durée de la garantie?</strong>
R: Nous offrons une garantie complète de 2 ans, extensible à 5 ans avec notre programme premium.`,
            version2: `<strong>Tout ce que vous devez savoir</strong>
            
<strong>Q: Puis-je essayer ${productData.productName} avant d'acheter?</strong>
R: Absolument! Nous proposons une période d'essai de 30 jours avec garantie satisfait ou remboursé.

<strong>Q: Comment se déroule le service après-vente?</strong>
R: Notre équipe de support est disponible 7j/7 par téléphone, email et chat en direct pour vous assister.

<strong>Q: Proposez-vous des formations pour optimiser l'utilisation?</strong>
R: Oui, nous offrons des webinaires gratuits et des tutoriels vidéo accessibles à tous nos clients.`
        };
        
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
            faq
        };
        
    } catch (error) {
        console.error('Error generating content:', error);
        throw error;
    }
}

// Fonction pour extraire les détails du produit à partir de la recherche approfondie
async function extractProductDetails(deepResearch, productName) {
    console.log('[DEBUG] Simulant l\'extraction des détails du produit');
    
    // Dans une implémentation réelle, cela ferait un appel à l'API OpenAI
    // Pour cette version simplifiée, nous retournons des données simulées
    
    return {
        description: `${productName} est une solution innovante conçue pour simplifier votre quotidien et améliorer votre productivité.`,
        targetAudience: "Professionnels et particuliers à la recherche d'efficacité et de simplicité.",
        features: [
            "Interface intuitive et facile à prendre en main",
            "Performances supérieures à la concurrence",
            "Design ergonomique et moderne",
            "Fonctionnalités avancées personnalisables"
        ],
        problemsSolved: [
            "Perte de temps avec les méthodes traditionnelles",
            "Résultats inconsistants et peu fiables",
            "Difficulté d'utilisation des solutions existantes"
        ]
    };
}

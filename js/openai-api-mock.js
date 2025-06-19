// This file mocks the OpenAI API calls for generating content
// In a real implementation, this would call an actual API

async function generateAllContent(productData) {
    // Create context for content generation based on product data
    const contextString = `
        Nom du produit: ${productData.productName}
        Description: ${productData.productDescription}
        Public cible: ${productData.targetAudience}
        URL concurrent: ${productData.competitorUrl || 'Non fourni'}
        Caractéristiques: ${productData.productFeatures}
        Problèmes résolus: ${productData.problemsSolved}
    `;
    
    // Simulate API processing time
    await simulateProcessing();
    
    // Return mocked responses for each content section
    return {
        psychographicProfile: generatePsychographicProfile(productData),
        strategicSynthesis: generateStrategicSynthesis(productData),
        productTitle: generateProductTitle(productData),
        productBenefits: generateProductBenefits(productData),
        howItWorks: generateHowItWorks(productData),
        emotionalBenefits: generateEmotionalBenefits(productData),
        useCases: generateUseCases(productData),
        characteristics: generateCharacteristics(productData),
        competitiveAdvantages: generateCompetitiveAdvantages(productData),
        customerReviews: generateCustomerReviews(productData),
        faq: generateFAQ(productData)
    };
}

// Simulate API processing time
function simulateProcessing() {
    return new Promise(resolve => setTimeout(resolve, 1500));
}

// Mock generators for each content type
function generatePsychographicProfile(data) {
    const template = `
# 1. Profil Psychographique
Les personnes susceptibles d'acheter ${data.productName} sont généralement des individus pragmatiques et orientés vers les solutions. Ils valorisent l'efficacité, la simplicité et les produits qui leur font gagner du temps. Ils s'intéressent aux innovations technologiques qui simplifient leur quotidien et sont souvent des early adopters ou des influenceurs dans leur cercle social.

# 2. Émotions Principales à Évoquer
- Soulagement (d'avoir enfin trouvé une solution)
- Confiance (dans la fiabilité du produit)
- Satisfaction (de l'efficacité et des résultats)
- Fierté (de posséder un produit innovant ou premium)

# 3. Habitudes de Vie
Ces acheteurs potentiels mènent souvent une vie bien remplie, jonglant entre responsabilités professionnelles et personnelles. Ils recherchent activement des moyens d'optimiser leur temps et sont prêts à investir dans des produits qui leur permettent de résoudre des problèmes récurrents.

# 4. Logique de Décision d'Achat
Leur processus de décision combine rationalité et émotion. Ils justifient l'achat par des arguments pratiques (gain de temps, efficacité, durabilité) mais sont également influencés par des facteurs émotionnels comme le désir d'améliorer leur qualité de vie ou de réduire leurs frustrations quotidiennes.

# 5. Désir Principal Derrière l'Achat
Le désir fondamental est d'éliminer une source de frustration récurrente dans leur vie. Ils cherchent à résoudre définitivement un problème qui les agace depuis longtemps, leur procurant ainsi une sensation de contrôle et d'accomplissement.

# 6. Problèmes Essentiels à Résoudre
- ${data.problemsSolved.split('\n')[0] || "Manque d'efficacité dans les tâches quotidiennes"}
- Perte de temps sur des activités répétitives
- Stress lié à des obstacles récurrents
- Sentiment d'inefficacité ou d'impuissance

# 7. Facteurs Biologiques ou Évolutifs
D'un point de vue biologique, le produit répond au besoin humain fondamental de réduire le stress et d'optimiser l'utilisation des ressources (temps, énergie). Il active les centres de récompense du cerveau en offrant une solution à un problème persistant, créant ainsi une association positive.
`;
    return template.trim();
}

function generateStrategicSynthesis(data) {
    const template = `
# Émotions Clés à Activer
1. **Soulagement** - La fin d'une frustration, la solution tant attendue
2. **Confiance** - Sentiment de sécurité et de fiabilité
3. **Fierté** - Satisfaction d'avoir fait un choix intelligent et efficace
4. **Sérénité** - Tranquillité d'esprit après résolution d'un problème

# Principales Motivations d'Achat
- Éliminer définitivement une source de frustration quotidienne
- Optimiser son temps et son efficacité
- Améliorer sa qualité de vie
- Accéder à une solution fiable et durable

# Problèmes à Résoudre
- ${data.problemsSolved.split('\n')[0] || "Inefficacité des solutions actuelles"}
- Perte de temps sur des tâches répétitives
- Complexité des alternatives existantes
- Stress lié à l'absence de solution satisfaisante

# Facteurs Biologiques
- Réduction du stress et de l'anxiété
- Optimisation des ressources (temps, énergie)
- Satisfaction du besoin de contrôle
- Activation des circuits de récompense par la résolution de problème

# Angles Marketing Clés
- Simplicité et facilité d'utilisation
- Efficacité prouvée et résultats visibles
- Solution définitive à un problème persistant
- Innovation et supériorité technologique

# Messages Marketing
1. "Retrouvez votre sérénité : ${data.productName} élimine définitivement ${data.problemsSolved.split('\n')[0] || "ce problème"} pour vous offrir tranquillité et efficacité."

2. "Transformez votre quotidien : plus de temps, moins de stress, et des résultats exceptionnels grâce à ${data.productName}."

3. "La solution intelligente qui comprend vos besoins : ${data.productName} combine technologie avancée et simplicité d'utilisation pour des résultats parfaits à chaque fois."
`;
    return template.trim();
}

function generateProductTitle(data) {
    // Create a professional-sounding product title based on the product name and features
    return data.productName.length > 40 ? 
        data.productName.substring(0, 40) : 
        data.productName;
}

function generateProductBenefits(data) {
    // Extract potential benefits from the product data
    const problems = data.problemsSolved.split('\n');
    const features = data.productFeatures.split('\n');
    
    // Create short, punchy benefits in French
    const benefits = [
        "Solution instantanée",
        "Économie de temps",
        "Résultats garantis",
        "Utilisation simplifiée"
    ];
    
    return benefits;
}

function generateHowItWorks(data) {
    return `${data.productName} fonctionne grâce à une technologie innovante qui automatise entièrement le processus.

Il suffit de quelques secondes pour le mettre en place, et les résultats sont immédiats.

Son système intuitif s'adapte parfaitement à vos besoins spécifiques pour une expérience optimale.`;
}

function generateEmotionalBenefits(data) {
    return [
        {
            headline: "ENFIN LIBÉRÉ",
            text: "Plus de stress ni de frustration face à ce problème récurrent. Retrouvez votre sérénité et profitez pleinement de chaque moment sans cette préoccupation constante."
        },
        {
            headline: "UN QUOTIDIEN TRANSFORMÉ",
            text: "Imaginez votre vie sans cette contrainte qui vous pèse. Plus de temps pour vous, plus d'énergie et une satisfaction profonde d'avoir enfin trouvé LA solution qui fonctionne vraiment."
        }
    ];
}

function generateUseCases(data) {
    return [
        {
            title: "En déplacement",
            explanation: "Utilisez-le partout, même en voyage ou au travail."
        },
        {
            title: "Usage quotidien",
            explanation: "Intégrez-le facilement dans votre routine journalière."
        },
        {
            title: "Toute situation",
            explanation: "Adapté à tous les environnements et conditions d'utilisation."
        }
    ];
}

function generateCharacteristics(data) {
    // Extract features from the product data
    const featuresList = data.productFeatures.split('\n');
    
    return [
        {
            title: "Design compact",
            explanation: "Format idéal pour un rangement facile et un transport pratique."
        },
        {
            title: "Matériaux premium",
            explanation: "Construction robuste et durable pour une longue durée de vie."
        },
        {
            title: "Technologie avancée",
            explanation: "Système intelligent qui s'adapte automatiquement à vos besoins."
        },
        {
            title: "Facilité d'usage",
            explanation: "Prise en main intuitive, sans manuel complexe."
        }
    ];
}

function generateCompetitiveAdvantages(data) {
    return [
        "Plus rapide",
        "Plus efficace",
        "Plus durable",
        "Plus intuitif",
        "Plus économique"
    ];
}

function generateCustomerReviews(data) {
    return [
        {
            title: "Exactement ce qu'il me fallait !",
            description: "Je cherchais depuis longtemps une solution à ce problème. Ce produit a dépassé toutes mes attentes. Efficace dès la première utilisation et tellement simple à mettre en place.",
            author: "Marie"
        },
        {
            title: "Un achat que je ne regrette pas",
            description: "Sceptique au début, j'ai été bluffé par l'efficacité de ce produit. Il a vraiment changé mon quotidien et me fait gagner un temps précieux chaque jour. Je le recommande sans hésiter.",
            author: "Thomas"
        },
        {
            title: "La solution miracle",
            description: "Après avoir essayé de nombreuses alternatives sans succès, j'ai enfin trouvé LE produit qui fonctionne. La qualité est au rendez-vous et les résultats sont impressionnants. Un investissement qui en vaut la peine !",
            author: "Sophie"
        },
        {
            title: "Surpris par la simplicité",
            description: "Produit très bien conçu et facile à utiliser. J'appréhendais un peu au début mais tout est intuitif et les résultats sont immédiats. Une vraie révélation pour résoudre ce problème quotidien.",
            author: "Pierre"
        },
        {
            title: "Adieu les problèmes !",
            description: "Ce produit a littéralement transformé mon quotidien. Plus besoin de m'inquiéter ou de perdre du temps avec ce souci récurrent. L'investissement est largement rentabilisé par le confort qu'il apporte.",
            author: "Julie"
        },
        {
            title: "Qualité exceptionnelle",
            description: "Non seulement ce produit fait exactement ce qu'il promet, mais en plus la qualité de fabrication est impressionnante. On sent qu'il va durer dans le temps, contrairement à d'autres solutions que j'ai pu essayer auparavant.",
            author: "Alexandre"
        }
    ];
}

function generateFAQ(data) {
    return [
        {
            question: "Est-ce que ce produit convient à tous les utilisateurs ?",
            answer: "Oui, notre produit a été conçu pour être utilisable par tous, quel que soit votre niveau d'expertise. Son interface intuitive et sa prise en main simple le rendent accessible à tous."
        },
        {
            question: "Comment entretenir ce produit pour garantir sa durabilité ?",
            answer: "L'entretien est minimal. Un simple nettoyage régulier avec un chiffon doux suffit pour maintenir votre produit en parfait état de fonctionnement pendant des années."
        },
        {
            question: "Est-ce que je peux l'utiliser dans différents environnements ?",
            answer: "Absolument. Notre produit a été testé dans diverses conditions et s'adapte parfaitement à tous les environnements, que ce soit à la maison, au bureau ou en déplacement."
        },
        {
            question: "Combien de temps faut-il pour voir des résultats ?",
            answer: "Les résultats sont généralement immédiats dès la première utilisation. Vous remarquerez une amélioration significative de votre situation dès le premier jour."
        },
        {
            question: "Est-ce que ce produit remplace complètement les solutions traditionnelles ?",
            answer: "Oui, notre produit a été conçu comme une solution complète et autonome. Il remplace avantageusement les méthodes traditionnelles avec une efficacité supérieure et une facilité d'utilisation inégalée."
        }
    ];
}

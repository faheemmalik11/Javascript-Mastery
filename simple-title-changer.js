console.log("Changeur de contenu vers variables chargé!");

document.addEventListener("DOMContentLoaded", function() {
    // DEBUG: Check what's in localStorage
    console.log('=== DEBUGGING LOCALSTORAGE CONTENT ===');
    const storedContent = localStorage.getItem('aiGeneratedContent');
    console.log('Raw localStorage content:', storedContent);
    
    if (storedContent) {
        try {
            const parsedContent = JSON.parse(storedContent);
            console.log('Parsed AI content:', parsedContent);
            console.log('Available keys:', Object.keys(parsedContent));
            
            // Check specifically for benefit content
            console.log('BENEFIT_1_HEADING:', parsedContent['BENEFIT_1_HEADING']);
            console.log('BENEFIT_1_TEXT:', parsedContent['BENEFIT_1_TEXT']);
            console.log('BENEFIT_2_HEADING:', parsedContent['BENEFIT_2_HEADING']);
            console.log('BENEFIT_2_TEXT:', parsedContent['BENEFIT_2_TEXT']);
            
            // Show ALL content for debugging
            console.log('=== ALL AI CONTENT ===');
            for (const [key, value] of Object.entries(parsedContent)) {
                console.log(`${key}: "${value}"`);
            }
            console.log('=== END ALL AI CONTENT ===');
        } catch (e) {
            console.error('Error parsing localStorage content:', e);
        }
    } else {
        console.log('No AI content found in localStorage');
    }
    console.log('=== END DEBUGGING ===');
    
    // Mapping des contenus vers leurs variables
    let contentMapping = {
        // Titres principaux
        "5 Reasons Why NovaHair Shampoo Is Better Than Traditional Hair Dye": "[TITLE]",
        "NO mess, NO toxic chemicals, and without the price tag": "[SUBTITLE]",
        
        // Bénéfices
        "See Results Instantly": "[BENEFIT_1_HEADING]",
        "All Natural Ingredients = Healthy Hair": "[BENEFIT_2_HEADING]", 
        "Color That Lasts With Perfect Coverage": "[BENEFIT_3_HEADING]",
        "One Bottle Lasts Over 6 Months": "[BENEFIT_4_HEADING]",
        "Easy To Apply With No Mess": "[BENEFIT_5_HEADING]",
        
        // Social proof
        "The Most Viral Hair Dye On The Market": "[SOCIAL_PROOF_HEADING]",
        "Thousands Of Customers Have Made The Switch": "[TESTIMONIAL_HEADING]",
        "Customers can't stop raving about NovaHair.": "[TESTIMONIAL_INTRO]",
        "Real Customers Real Results": "[TESTIMONIAL_IMAGES_PLACEHOLDER]",
        
        // Textes longs
        "Use the flexible grid system to create any layout. Each block can be placed in any of No wait required, NovaHair Shampoo works straight out of the box. Apply evenly onto dry hair, wait 10 minutes and wash it off. It's that easy.": "[BENEFIT_1_TEXT]",
        "NovaHair Shampoo is ammonia & peroxide free.Utilizing a gentle all natural formula that nourishes your hair, making it shiny, soft, and vibrant.": "[BENEFIT_2_TEXT]",
        "Additional benefits include enhanced shine and protection against environmental damage, making your hair look healthier and more vibrant than ever before.": "[BENEFIT_2_TEXT_NEXT]",
        "That offer perfect coverage even against the toughest of grey hairs.Coverage lasts up to 6-8 weeksdepending on how frequently you wash your hair.": "[BENEFIT_3_TEXT]",
        "NovaHair comes in a normal shampoo bottle, allowing you to control the exact amount everytime. No more wasteful packets. One bottle usually lastsover 6 months, making it a bang for your buck.": "[BENEFIT_4_TEXT]",
        "NovaHair doesn't stain, requiresno equipment, andno setup time. It's so easy you can fit it into a normal shower routine.": "[BENEFIT_5_TEXT]",
        
        // Ingrédients
        "Fo-ti Extract: Known for its anti-aging properties, Fo-ti helps maintain natural hair color and promotes hair growth.Ganoderma Lucidum Extract: This powerful mushroom extract strengthens hair follicles and adds shine to your locks.Black Sesame Extract: Rich in antioxidants, black sesame nourishes the scalp and helps in preventing premature graying.Saponin Extract: Derived from soapberries, saponin provides a natural cleansing action, leaving your hair clean and vibrant.Ginseng Extract: A well-known tonic for hair health, ginseng stimulates the scalp and improves hair strength.": "[INGREDIENTS_LIST]",
        
        // Variantes produit
        "We offer five different colors:Black,Dark Brown,Light Brown,Red,Purple": "[PRODUCT_VARIANTS]",
        "We offer five different colors: Black, Dark Brown, Light Brown, Red, Purple": "[PRODUCT_VARIANTS]",
        
        // Stats et preuves sociales
        "With over 100,000 bottles sold in the past 3 months, we can proudly claim we have the most innovative hair dye on the market.": "[SOCIAL_PROOF_STATS]",
        
        // Messages de rareté et authenticité
        "However, this does not come without downsides. Amazon, Walmart, Temu, Ebay,and a hundreds of other businesses are copying and listing counterfeit products on their website.": "[SCARCITY_WARNING]",
        "We sell exclusively on ShopNovaHair.com ONLY! And if you read the reviews you can quickly see just how terrible these untested scam products are. So if you want to try our shampoo please, don't end up making the mistake of purchasing a product with untested chemicals which can permanently damage your hair and scalp.": "[AUTHENTICITY_MESSAGE]",
        
        // Garantie
        "We're really confident in our product, which is why we always offer a 30 day money back guarantee. If it doesn't work for you,we'll give you a refund.You don't even need to return the product.": "[GUARANTEE_TEXT]",
        "30 Day Guarantee We're so confident you'll love our product, we offer an iron clad 30 day money back guarantee. If you don't like it, return the product for a full refund no questions asked.": "[GUARANTEE_SECTION]",
        
        // FAQ Questions
        "How long does the hair color last?": "[FAQ_Q1]",
        "How long does a bottle last?": "[FAQ_Q2]",
        "Is it safe on my hair?": "[FAQ_Q3]",
        "Will it cover my gray hair completely?": "[FAQ_Q4]",
        "Can it be used on dyed or chemically treated hair?": "[FAQ_Q5]",
        "Does this shampoo leave stains on skin or fabric?": "[FAQ_Q6]",
        "Can I use this shampoo on my beard?": "[FAQ_Q7]",
        
        // FAQ Réponses
        "The longevity of the color varies depending on hair type, condition, and the frequency of washing. Generally, our innovative formula ensures your vibrant black hair lasts 6-8 weeks, allowing for a seamless, natural-looking fade over time.": "[FAQ_A1]",
        "One bottle is designed to last for approximately 10 to 15 applications, depending on hair length and thickness.": "[FAQ_A2]",
        "Absolutely! Our shampoo is formulated with natural ingredients and without harsh chemicals, making it safe for all hair types. It's gentle on your hair and scalp, ensuring not just color but also care.": "[FAQ_A3]",
        "Yes, our shampoo is specifically designed to cover gray hair thoroughly, offering a uniform, natural black shade. Continuous use will enhance the color depth and coverage.": "[FAQ_A4]",
        "Yes, our shampoo is safe for use on dyed or chemically treated hair. However, we recommend doing a patch test or consulting with a professional if you have concerns about your specific hair condition.": "[FAQ_A5]",
        "Absolutely not! Our shampoo is designed for worry-free use, with a formula that rinses clean away without leaving any residue or stains on your skin, shower, or fabrics. You won't need any protective equipment or special precautions—just apply, lather, and rinse as you would with any regular shampoo for a clean, effortless experience.": "[FAQ_A6]",
        "Yes, you can! Our shampoo is perfectly safe and effective for use on your beard, offering the same natural-looking, vibrant black color and nourishing benefits as it does for your hair.": "[FAQ_A7]",
        
        // Missing placeholders that AI generates but weren't mapped
        "30 Day Money Back Guarantee": "[GUARANTEE_HEADING]",
        "We're really confident in our product, which is why we always offer a 30 day money back guarantee. If it doesn't work for you,we'll give you a refund.You don't even need to return the product.": "[GUARANTEE_DESCRIPTION]",
        "": "[CTA_PRIMARY]",
        "": "[CTA_SECONDARY]", 
        "": "[SOCIAL_PROOF_TEXT]",
        "": "[TESTIMONIAL_1_TEXT]",
        "": "[TESTIMONIAL_2_TEXT]",
        "": "[TESTIMONIAL_3_TEXT]",
        "": "[URGENCY_TEXT]"
    };

    // Vérifier s'il y a du contenu IA généré dans le localStorage
    const aiGeneratedContent = localStorage.getItem('aiGeneratedContent');
    let hasAIContent = false;
    
    if (aiGeneratedContent) {
        try {
            const aiContent = JSON.parse(aiGeneratedContent);
            console.log('Contenu généré par l\'IA trouvé:', aiContent);
            hasAIContent = true;
            
            // Remplacer directement les placeholders par le contenu IA
            function replaceAIContent() {
                document.querySelectorAll('*').forEach(element => {
                    // Vérifier les nœuds de texte de l'élément
                    const walker = document.createTreeWalker(
                        element,
                        NodeFilter.SHOW_TEXT,
                        null,
                        false
                    );
                    
                    const textNodes = [];
                    let node;
                    while (node = walker.nextNode()) {
                        textNodes.push(node);
                    }
                    
                    textNodes.forEach(textNode => {
                        let text = textNode.textContent;
                        let hasReplacement = false;
                        
                        // Remplacer tous les placeholders trouvés
                        Object.keys(aiContent).forEach(key => {
                            const placeholder = `[${key}]`;
                            if (text.includes(placeholder)) {
                                text = text.replace(new RegExp(`\\[${key}\\]`, 'g'), aiContent[key]);
                                hasReplacement = true;
                            }
                        });
                        
                        if (hasReplacement) {
                            textNode.textContent = text;
                            console.log('Placeholder remplacé:', textNode.textContent);
                        }
                    });
                });
            }
            
            // Exécuter le remplacement
            replaceAIContent();
            console.log('Contenu généré par l\'IA intégré avec succès!');
            
            // Garder le localStorage pour les interactions de clic
            // localStorage.removeItem('aiGeneratedContent'); // Garder pour les interactions de clic
        } catch (error) {
            console.error('Erreur lors du parsing du contenu IA:', error);
        }
    }

    // Fonction pour nettoyer le texte (supprimer espaces, retours à la ligne, balises, etc.)
    function cleanText(text) {
        return text
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/\n/g, ' ') // Replace newlines with spaces
            .trim(); // Remove leading/trailing whitespace
    }
    
    // Fonction pour extraire le texte pur d'un élément (y compris les éléments en gras)
    function getFullText(element) {
        return cleanText(element.textContent || element.innerText || '');
    }
    
    // Fonction pour trouver la correspondance la plus proche
    function findBestMatch(text) {
        const cleanedText = cleanText(text);
        
        // Debug spécifique pour le contenu Fo-ti Extract
        if (text.includes("Fo-ti Extract")) {
            console.log("🧪 DEBUG FO-TI EXTRACT:");
            console.log("Original text:", text);
            console.log("Cleaned text:", cleanedText);
            console.log("Cleaned text length:", cleanedText.length);
            
            // Vérifier chaque entrée du mapping
            for (const [content, variable] of Object.entries(contentMapping)) {
                if (content.includes("Fo-ti Extract")) {
                    console.log("Found mapping entry:", variable);
                    console.log("Mapping content:", content);
                    console.log("Mapping cleaned:", cleanText(content));
                    console.log("Exact match?", cleanText(content) === cleanedText);
                    console.log("Partial match?", cleanedText.includes(cleanText(content)) || cleanText(content).includes(cleanedText));
                }
            }
        }
        
        // Vérifier si le texte est déjà un placeholder (comme [TITLE], [SUBTITLE], [BENEFIT_1_HEADING])
        const placeholderMatch = text.match(/^\[([A-Z0-9_]+)\]$/);
        if (placeholderMatch) {
            return text; // Retourner le placeholder tel quel
        }
        
        // Recherche exacte d'abord
        for (const [content, variable] of Object.entries(contentMapping)) {
            if (cleanText(content) === cleanedText) {
                return variable;
            }
        }
        
        // Recherche partielle si pas de correspondance exacte
        for (const [content, variable] of Object.entries(contentMapping)) {
            const cleanContent = cleanText(content);
            if (cleanedText.includes(cleanContent) || cleanContent.includes(cleanedText)) {
                return variable;
            }
        }
        
        // Si aucune correspondance, ne pas générer de placeholder générique
        return null;
    }
    
    // Fonction pour vérifier si un élément doit être exclu
    function shouldExcludeElement(element) {
        // Exclure les boutons et CTAs
        if (element.tagName === 'BUTTON' || element.tagName === 'A') {
            return true;
        }
        
        // Exclure les éléments avec des classes de bouton
        const classList = element.className.toLowerCase();
        if (classList.includes('btn') || classList.includes('button') || classList.includes('cta')) {
            return true;
        }
        
        // Exclure les éléments vides
        const text = getFullText(element);
        if (!text || text.length < 3) {
            return true;
        }
        
        // Exclure les éléments qui contiennent d'autres éléments de texte
        const textChildren = element.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span');
        if (textChildren.length > 0) {
            return true;
        }
        
        return false;
    }
    
    // Trouver tous les éléments de texte cliquables
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div');
    
    console.log(`🔍 Trouvé ${textElements.length} éléments à analyser`);
    
    textElements.forEach((element, index) => {
        if (shouldExcludeElement(element)) {
            console.log(`❌ Élément ${index} exclu:`, element.tagName, element.textContent?.substring(0, 50));
            return;
        }
        
        const originalText = getFullText(element);
        console.log(`🔍 Analyse élément ${index}:`, element.tagName, `"${originalText}"`);
        
        let variableName = findBestMatch(originalText);
        console.log(`🎯 Match trouvé pour "${originalText}":`, variableName);
        
        // État pour suivre le mode d'affichage
        let displayMode = 0; // 0 = original, 1 = AI content, 2 = placeholder
        
        // Vérifier si le contenu actuel correspond à du contenu IA
        const aiGeneratedContent = localStorage.getItem('aiGeneratedContent');
        if (aiGeneratedContent && hasAIContent) {
            try {
                const aiContent = JSON.parse(aiGeneratedContent);
                const currentText = element.textContent.trim();
                
                // Vérifier si le texte actuel correspond à du contenu IA
                Object.values(aiContent).forEach(aiValue => {
                    if (currentText === aiValue || currentText.includes(aiValue)) {
                        variableName = `[${Object.keys(aiContent).find(key => aiContent[key] === aiValue)}]`;
                        console.log(`🎯 Contenu IA détecté: "${currentText}" correspond à ${variableName}`);
                        displayMode = 1; // Set display mode to 1 when AI content is detected
                    }
                });
            } catch (error) {
                console.error('Erreur lors de la vérification du contenu IA:', error);
            }
        }
        
        // Si pas encore de match trouvé, vérifier si l'élément contient du contenu IA
        if (!variableName && aiGeneratedContent) {
            try {
                const aiContent = JSON.parse(aiGeneratedContent);
                const currentText = element.textContent.trim();
                
                // Chercher quel placeholder correspond à ce contenu IA
                Object.entries(aiContent).forEach(([placeholder, aiValue]) => {
                    if (currentText === aiValue || currentText.includes(aiValue)) {
                        variableName = placeholder;
                        hasAIContent = true;
                        console.log(`🎯 Contenu IA détecté: "${currentText}" correspond à ${placeholder}`);
                        displayMode = 1; // Set display mode to 1 when AI content is detected
                    }
                });
            } catch (error) {
                console.error('Erreur lors de la détection du contenu IA:', error);
            }
        }
        
        // Skip elements that don't have a match
        if (!variableName) {
            console.log(`❌ Pas de match pour:`, originalText);
            return;
        }
        
        console.log(`✅ Élément rendu cliquable:`, element.tagName, variableName);
        
        // Ajouter les styles pour indiquer que c'est cliquable
        element.style.cursor = 'pointer';
        element.style.transition = 'all 0.3s ease';
        element.style.padding = '4px 8px';
        element.style.borderRadius = '4px';
        
        let originalHTML = element.innerHTML; // Sauvegarder le HTML original pour préserver le formatage
        
        // Fonction pour obtenir le contenu IA pour ce placeholder
        function getAIContent() {
            const aiGeneratedContent = localStorage.getItem('aiGeneratedContent');
            if (aiGeneratedContent) {
                try {
                    const aiContent = JSON.parse(aiGeneratedContent);
                    // Extraire le nom de la variable sans les crochets
                    const placeholderKey = variableName.replace(/[\[\]]/g, '');
                    return aiContent[placeholderKey] || null;
                } catch (error) {
                    console.error('Erreur lors du parsing du contenu IA:', error);
                    return null;
                }
            }
            return null;
        }
        
        // Hover effect
        element.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
            this.style.transform = 'scale(1.02)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
            this.style.transform = 'scale(1)';
        });
        
        // Click handler
        element.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Animation de changement
            this.style.opacity = '0.5';
            this.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                const aiContent = getAIContent();
                
                if (displayMode === 0) {
                    // Mode 0 → Mode 1: Afficher le contenu IA (si disponible) ou passer au placeholder
                    if (aiContent) {
                        this.textContent = aiContent;
                        displayMode = 1;
                        console.log(`Affiché contenu IA: "${aiContent}"`);
                    } else {
                        // Pas de contenu IA, passer directement au placeholder
                        this.textContent = variableName;
                        displayMode = 2;
                        console.log(`Affiché placeholder: "${variableName}"`);
                    }
                } else if (displayMode === 1) {
                    // Mode 1 → Mode 2: Afficher le placeholder
                    this.textContent = variableName;
                    displayMode = 2;
                    console.log(`Affiché placeholder: "${variableName}"`);
                } else {
                    // Mode 2 → Mode 0: Revenir au contenu original
                    this.innerHTML = originalHTML;
                    displayMode = 0;
                    console.log(`Restauré contenu original: "${originalText}"`);
                }
                
                this.style.opacity = '1';
                this.style.transform = 'scale(1.05)';
                
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
            }, 150);
        });
    });
    
    console.log("✅ Changeur de contenu installé - cliquez sur n'importe quel texte pour voir sa variable!");
});

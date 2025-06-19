// Marketing Angle Selection System
// Cette fonctionnalité permet de sélectionner un angle marketing parmi plusieurs options générées

// Variable globale pour stocker l'angle marketing sélectionné
window.selectedMarketingAngle = null;
window.generatedMarketingAngles = [];

// Fonction pour mettre à jour le badge avec le nombre d'angles générés
window.updateMarketingAngleBadge = function() {
    const badge = document.getElementById('marketing-angle-badge');
    if (badge && window.generatedMarketingAngles) {
        const count = window.generatedMarketingAngles.length;
        badge.textContent = count.toString();
        console.log(`[Marketing Angle Selection] Badge mis à jour: ${count} angles`);
    }
}

// Initialiser le badge au chargement
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser le badge à 0 au démarrage
    const badge = document.getElementById('marketing-angle-badge');
    if (badge) {
        badge.textContent = '0';
    }
});

// Fonction pour générer les angles marketing pour sélection
window.generateMarketingAngleSelection = async function(deepResearch, aiModel = 'chatgpt') {
    console.log('[Marketing Angle Selection] === DÉBUT GÉNÉRATION ===');
    console.log('[Marketing Angle Selection] Paramètres reçus:');
    console.log('- deepResearch:', deepResearch ? 'Disponible' : 'Non disponible');
    console.log('- aiModel:', aiModel);
    
    // Vérifications préalables
    if (!deepResearch) {
        throw new Error('Aucune recherche approfondie fournie pour générer les angles marketing');
    }
    
    if (typeof window.callOpenAI !== 'function') {
        throw new Error('La fonction callOpenAI n\'est pas disponible');
    }
    
    console.log('[Marketing Angle Selection] Toutes les vérifications passées, génération en cours...');
    
    console.log('[Marketing Angle Selection] === DÉBUT GÉNÉRATION ANGLES POUR SÉLECTION ===');
    console.log('[Marketing Angle Selection] Deep Research:', deepResearch?.substring(0, 200) + '...');
    
    // Vérifier que la deep research n'est pas vide
    if (!deepResearch || deepResearch.trim().length < 50) {
        console.log('[Marketing Angle Selection] Deep research trop courte');
    }
    
    // Prompt spécifique pour la sélection d'angles marketing
    const angleSelectionPrompt = `En tant qu'expert en marketing, analysez cette recherche produit et proposez des angles marketing pertinents basés sur les informations fournies.

CONTEXTE : Vous aidez à identifier les meilleurs angles marketing pour ce produit en vous basant sur les données de recherche disponibles.

INSTRUCTIONS CRITIQUES :
- RESPECTEZ EXACTEMENT le format A., B., C., D., E. avec **[Nom]**
- Chaque champ doit être sur une ligne séparée avec le nom du champ suivi de ":"
- Ne mélangez JAMAIS les champs entre eux
- Market Size doit contenir une estimation du marché basée sur la recherche
- Fears doit contenir les craintes/frustrations des consommateurs (OBLIGATOIRE)
- Générez 3 à 5 angles marketing pertinents selon les données disponibles
- INTERDICTION de texte libre ou de conclusions à la fin
- Chaque angle doit être complet avec TOUS les champs listés
- UTILISEZ EXACTEMENT les noms de champs anglais : Market Impact, Market Size, Problem to Solve, Emotions to Evoke, Fears, Supporting Evidence, Tactical Application

Pour chaque angle marketing identifié, utilisez cette structure EXACTE :

A. **[Nom de l'angle en 2-3 mots]**
Market Impact: [Impact potentiel basé sur les données de la recherche]
Market Size: [Taille et potentiel du segment cible selon la recherche]
Problem to Solve: [Problème principal que cet angle adresse]
Emotions to Evoke: [Émotions principales à susciter]
Fears: [Préoccupations ou frustrations mentionnées dans la recherche]
Supporting Evidence: [Éléments de la recherche qui supportent cet angle]
Tactical Application: [Comment appliquer cet angle en marketing]

B. **[Nom de l'angle en 2-3 mots]**
Market Impact: [Impact potentiel basé sur les données de la recherche]
Market Size: [Taille et potentiel du segment cible selon la recherche]
Problem to Solve: [Problème principal que cet angle adresse]
Emotions to Evoke: [Émotions principales à susciter]
Fears: [Préoccupations ou frustrations mentionnées dans la recherche]
Supporting Evidence: [Éléments de la recherche qui supportent cet angle]
Tactical Application: [Comment appliquer cet angle en marketing]

C. **[Nom de l'angle en 2-3 mots]**
Market Impact: [Impact potentiel basé sur les données de la recherche]
Market Size: [Taille et potentiel du segment cible selon la recherche]
Problem to Solve: [Problème principal que cet angle adresse]
Emotions to Evoke: [Émotions principales à susciter]
Fears: [Préoccupations ou frustrations mentionnées dans la recherche]
Supporting Evidence: [Éléments de la recherche qui supportent cet angle]
Tactical Application: [Comment appliquer cet angle en marketing]

D. **[Nom de l'angle en 2-3 mots]**
Market Impact: [Impact potentiel basé sur les données de la recherche]
Market Size: [Taille et potentiel du segment cible selon la recherche]
Problem to Solve: [Problème principal que cet angle adresse]
Emotions to Evoke: [Émotions principales à susciter]
Fears: [Préoccupations ou frustrations mentionnées dans la recherche]
Supporting Evidence: [Éléments de la recherche qui supportent cet angle]
Tactical Application: [Comment appliquer cet angle en marketing]

E. **[Nom de l'angle en 2-3 mots]**
Market Impact: [Impact potentiel basé sur les données de la recherche]
Market Size: [Taille et potentiel du segment cible selon la recherche]
Problem to Solve: [Problème principal que cet angle adresse]
Emotions to Evoke: [Émotions principales à susciter]
Fears: [Préoccupations ou frustrations mentionnées dans la recherche]
Supporting Evidence: [Éléments de la recherche qui supportent cet angle]
Tactical Application: [Comment appliquer cet angle en marketing]

RECHERCHE À ANALYSER :
${deepResearch}

RAPPEL : Respectez EXACTEMENT le format A., B., C., D., E. avec tous les champs listés pour chaque angle.`;
    
    // Vérifier que callOpenAI est disponible
    if (typeof window.callOpenAI !== 'function') {
        console.error('[Marketing Angle Selection] callOpenAI function not available on window');
        throw new Error('callOpenAI function not available');
    }
    
    // Utiliser le modèle AI passé en paramètre
    const aiToggle = document.getElementById('aiModelToggle');
    let modelToUse = aiModel;
    
    if (!modelToUse) {
        // Détecter le modèle depuis le toggle switch
        if (aiToggle && aiToggle.checked) {
            modelToUse = 'claude';
        } else {
            modelToUse = 'chatgpt';
        }
    }
    
    console.log(`[Marketing Angle Selection] Modèle utilisé:`, modelToUse);
    console.log('[Marketing Angle Selection] Appel à callOpenAI avec prompt:', angleSelectionPrompt.substring(0, 100) + '...');
    
    try {
        // Appel à l'API avec tous les paramètres requis
        const response = await window.callOpenAI(angleSelectionPrompt, 0.7, 2500, modelToUse);
        
        console.log('[Marketing Angle Selection] Réponse reçue:', response?.substring(0, 200) + '...');
        console.log('[Marketing Angle Selection] Réponse COMPLÈTE:', response);
        
        // Parser la réponse
        const angles = parseMarketingAngles(response);
        
        if (!angles || angles.length === 0) {
            throw new Error('Aucun angle marketing valide n\'a pu être extrait de la réponse IA');
        }
        
        console.log('[Marketing Angle Selection] Angles parsés avec succès:', angles.length);
        
        // Stocker les angles
        window.generatedMarketingAngles = angles;
        
        // Mettre à jour le badge
        window.updateMarketingAngleBadge();
        
        console.log('[Marketing Angle Selection] === FIN GÉNÉRATION ===');
        return angles;
        
    } catch (error) {
        console.error('[Marketing Angle Selection] Erreur lors de la génération:', error);
        throw error; // Propager l'erreur au lieu d'utiliser un fallback
    }
};

// Fonction pour parser les angles marketing depuis la réponse AI
function parseMarketingAngles(response) {
    const angles = [];
    
    try {
        console.log('[Marketing Angle Selection] Réponse brute:', response.substring(0, 500) + '...');
        console.log('[Marketing Angle Selection] Réponse COMPLÈTE:', response);
        
        // Patterns pour détecter les angles - plus flexibles
        const anglePatterns = [
            // Pattern pour A., B., C., D., E. avec **Nom**
            /([A-Z])\.\s*\*\*([^*]+)\*\*([\s\S]*?)(?=[A-Z]\.\s*\*\*|$)/gi,
            // Pattern pour A., B., C. sans astérisques (format simple)
            /([A-Z])\.\s*([^\n]+)\n([\s\S]*?)(?=\n[A-Z]\.\s*[^\n]+\n|$)/gi,
            // Pattern pour **ANGLE 1: Nom**
            /\*\*ANGLE\s+(\d+):\s*([^*\n]+?)\*\*([\s\S]*?)(?=\*\*ANGLE\s+\d+:|$)/gi,
            /ANGLE\s+(\d+):\s*([^\n]+)([\s\S]*?)(?=ANGLE\s+\d+:|$)/gi,
            // Pattern générique **Nom**
            /\*\*([^*]+)\*\*([\s\S]*?)(?=\*\*[^*]+\*\*|$)/gi
        ];
        
        let detectedAngles = null;
        let usedPattern = -1;
        
        // Essayer chaque pattern
        for (let i = 0; i < anglePatterns.length; i++) {
            const matches = [...response.matchAll(anglePatterns[i])];
            if (matches && matches.length >= 1) {
                detectedAngles = matches;
                usedPattern = i;
                console.log(`[Marketing Angle Selection] Pattern ${i} détecté ${matches.length} angles`);
                break;
            }
        }
        
        if (!detectedAngles || detectedAngles.length === 0) {
            console.warn('[Marketing Angle Selection] Format de réponse non reconnu, tentative de parsing alternatif');
            return parseAlternativeFormat(response);
        }
        
        console.log(`[Marketing Angle Selection] ${detectedAngles.length} angles détectés avec le pattern ${usedPattern}`);
        
        detectedAngles.forEach((match, index) => {
            try {
                let angleName, content;
                
                if (usedPattern === 0) {
                    // Pattern A., B., C., D., E. avec **Nom**
                    angleName = match[2].trim();
                    content = match[3];
                } else if (usedPattern === 1) {
                    // Pattern A., B., C. sans astérisques
                    angleName = match[2].trim();
                    content = match[3];
                } else if (usedPattern === 2) {
                    // Pattern **ANGLE 1: Nom**
                    angleName = match[2].trim();
                    content = match[3];
                } else if (usedPattern === 3) {
                    // Pattern ANGLE 1: Nom
                    angleName = match[2].trim();
                    content = match[3];
                } else {
                    // Pattern générique **Nom**
                    angleName = match[1].trim();
                    content = match[2];
                }
                
                // Nettoyer le nom de l'angle
                angleName = angleName.replace(/^ANGLE\s+\d+:\s*/i, '').trim();
                
                console.log(`[DEBUG] === ANGLE ${index + 1}: ${angleName} ===`);
                console.log(`[DEBUG] Contenu complet:`, content);
                
                // Extraire les champs
                const marketImpact = extractField(content, 'Market Impact') || 
                                   extractField(content, 'Impact sur le Marché') || 
                                   extractField(content, 'Impact sur le marché') ||
                                   extractField(content, 'Impact du marché');
                
                const marketSize = extractField(content, 'Market Size') || 
                                  extractField(content, 'Taille du Marché') || 
                                  extractField(content, 'Taille du marché') ||
                                  extractField(content, 'Taille de marché') ||
                                  extractField(content, 'Marché cible') ||
                                  extractField(content, 'Segment de marché') ||
                                  extractField(content, 'Potentiel du marché');
                
                const problemToSolve = extractField(content, 'Problem to Solve') || 
                                     extractField(content, 'Problème à Résoudre') || 
                                     extractField(content, 'Problème à résoudre') ||
                                     extractField(content, 'Problème résolu');
                
                const emotionsToEvoke = extractField(content, 'Émotions à évoquer') ||
                                       extractField(content, 'Emotions to Evoke') || 
                                       extractField(content, 'Émotions à Évoquer') || 
                                       extractField(content, 'ÉMOTIONS CLÉS IDENTIFIÉES') ||
                                       extractField(content, 'Émotions à susciter') ||
                                       extractField(content, 'Émotions à déclencher') ||
                                       extractEmotionsFromText(content);
                
                console.log(`[DEBUG] Emotions extraites pour angle ${index + 1}:`, emotionsToEvoke);
                
                let fears = extractField(content, 'Frustrations') ||
                           extractField(content, 'Fears') || 
                           extractField(content, 'Peurs & Frustrations') || 
                           extractField(content, 'Peurs') || 
                           extractField(content, 'Craintes') ||
                           extractField(content, 'Préoccupations');
                
                console.log(`[DEBUG] Fears extraites pour angle ${index + 1}:`, fears);
                
                // Si pas de fears trouvées, chercher dans le contenu des émotions
                let finalFears = fears;
                if (!finalFears && emotionsToEvoke) {
                    const frustrationsMatch = emotionsToEvoke.match(/(?:Frustrations?|Craintes?|Peurs?)\s*:\s*([^\.]+(?:\.[^A-Z])*)/i);
                    if (frustrationsMatch) {
                        finalFears = frustrationsMatch[1].trim();
                    }
                }
                
                const supportingEvidence = extractField(content, 'Supporting Evidence') || extractField(content, 'Preuves à l\'appui') || extractField(content, 'Preuves');
                
                const tacticalApplication = extractField(content, 'Tactical Application') || extractField(content, 'Application Marketing') || extractField(content, 'Application tactique');
                
                angles.push({
                    id: index + 1,
                    name: angleName,
                    marketImpact: marketImpact || null,
                    marketSize: marketSize || null,
                    problemToSolve: problemToSolve || null,
                    emotionsToEvoke: emotionsToEvoke || null,
                    fearsFrustrations: finalFears || null,
                    supportingEvidence: supportingEvidence || null,
                    tacticalApplication: tacticalApplication || null
                });
                
            } catch (parseError) {
                console.warn(`[Marketing Angle Selection] Erreur parsing angle ${index + 1}:`, parseError);
            }
        });
        
    } catch (error) {
        console.error('[Marketing Angle Selection] Erreur lors du parsing:', error);
    }
    
    return angles;
}

// Fonction pour extraire un champ spécifique
function extractField(content, fieldName) {
    if (!content || !fieldName) return null;
    
    // Nettoyer le contenu d'abord
    let cleanContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Patterns spécifiques pour chaque type de champ
    const patterns = [];
    
    if (fieldName === 'Emotions to Evoke' || fieldName === 'Émotions à Évoquer' || fieldName === 'ÉMOTIONS CLÉS IDENTIFIÉES' || fieldName === 'Émotions à évoquer') {
        patterns.push(
            // Pattern pour "Émotions à évoquer :" (format exact de l'IA)
            new RegExp(`Émotions\\s+à\\s+évoquer\\s*:\\s*([\\s\\S]+?)(?=\\n(?:Craintes|Fears|Peurs|Preuves|Supporting|Application|Market|Taille|Impact|Tactical|\\*\\*)|$)`, 'i'),
            // Pattern pour "Émotions clés à évoquer :" suivi d'une liste numérotée
            new RegExp(`Émotions\\s+clés\\s+à\\s+évoquer\\s*:\\s*([\\s\\S]+?)(?=\\nFears|\\nPeurs|\\nSupporting|\\nEmotions\\s+to\\s+evoke|$)`, 'i'),
            // Pattern pour "ÉMOTIONS CLÉS IDENTIFIÉES :" suivi d'une liste numérotée
            new RegExp(`ÉMOTIONS\\s+CLÉS\\s+IDENTIFIÉES\\s*:\\s*([\\s\\S]+?)(?=\\nFears|\\nPeurs|\\nSupporting|$)`, 'i'),
            // Pattern pour détecter les émotions avec des pourcentages dans le Problem to Solve
            new RegExp(`(?:émotions?|sentiments?)\\s+(?:clés|fortes?|intenses?)\\s*à\\s*(?:évoquer|susciter)\\s*:\\s*([\\s\\S]+?)(?=\\nFears|\\nPeurs|\\nSupporting|$)`, 'i'),
            // Pattern pour détecter les émotions avec des pourcentages
            new RegExp(`(?:émotions?|sentiments?)\\s+(?:fortes?|intenses?)\\s*:\\s*([\\s\\S]+?)(?=\\n\\w+\\s*:|$)`, 'i'),
            // Pattern pour détecter les émotions sans pourcentages
            new RegExp(`(?:émotions?|sentiments?)\\s+(?:fortes?|intenses?)\\s*([\\s\\S]+?)(?=\\n\\w+\\s*:|$)`, 'i')
        );
    } else if (fieldName === 'Problem to Solve' || fieldName === 'Problème à Résoudre') {
        patterns.push(
            // Pattern qui s'arrête avant "ÉMOTIONS CLÉS IDENTIFIÉES" et autres variantes
            new RegExp(`(?:Problem\\s+to\\s+Solve|Problème\\s+à\\s+Résoudre)\\s*:\\s*([\\s\\S]+?)(?=\\s*ÉMOTIONS\\s+CLÉS\\s+IDENTIFIÉES|\\s+Émotions?\\s+à\\s+(?:susciter|évoquer)|\\n(?:Emotions?\\s+to\\s+evoke|Peurs|Fears|Leaders?|Application|Market|Taille|Impact|Supporting|Tactical|\\*\\*)|$)`, 'i'),
            new RegExp(`(?:Problem\\s+to\\s+Solve|Problème)\\s*:\\s*(.+?)(?=\\n\\w+\\s*:|$)`, 'i')
        );
    } else if (fieldName === 'Fears' || fieldName === 'Peurs & Frustrations' || fieldName === 'Peurs' || fieldName === 'Frustrations') {
        patterns.push(
            // Pattern pour "Frustrations:" en premier
            new RegExp(`Frustrations?\\s*:\\s*([\\s\\S]+?)(?=\\n(?:Preuves|Application|Market|Taille|Impact|Supporting|Tactical|\\*\\*)|$)`, 'i'),
            // Pattern pour "Fears:" ou "Peurs:"
            new RegExp(`(?:Peurs\\s*&?\\s*Frustrations?|Fears?|Peurs)\\s*:\\s*([\\s\\S]+?)(?=\\n(?:Leaders?|Application|Market|Taille|Impact|Supporting|Tactical|\\*\\*)|$)`, 'i'),
            // Pattern plus simple pour "Fears:"
            new RegExp(`Fears?\\s*:\\s*(.+?)(?=\\n\\w+\\s*:|$)`, 'i'),
            // Pattern pour "Peurs:"
            new RegExp(`Peurs\\s*:\\s*(.+?)(?=\\n\\w+\\s*:|$)`, 'i')
        );
    } else {
        // Patterns génériques pour les autres champs
        patterns.push(
            new RegExp(`${fieldName}\\s*:\\s*([\\s\\S]+?)(?=\\n(?:[A-Z][^:]*:|\\*\\*)|$)`, 'i'),
            new RegExp(`${fieldName}\\s*:\\s*(.+?)(?=\\n\\w+\\s*:|$)`, 'i'),
            new RegExp(`${fieldName}\\s*:\\s*(.+?)(?=\\n|$)`, 'i')
        );
    }
    
    // Patterns spéciaux pour les champs français
    if (fieldName === 'Leaders du Marché') {
        patterns.push(
            new RegExp(`Leaders?\\s+du\\s+Marché\\s*:\\s*([\\s\\S]+?)(?=\\n(?:Application|Market|Taille|Impact|Supporting|Tactical|\\*\\*)|$)`, 'i')
        );
    }
    
    if (fieldName === 'Application Tactique' || fieldName === 'Tactical Application') {
        patterns.push(
            new RegExp(`(?:Application\\s+Tactique|Tactical\\s+Application)\\s*:\\s*([\\s\\S]+?)(?=\\n(?:\\*\\*ANGLE|$))`, 'i')
        );
    }
    
    for (const pattern of patterns) {
        const match = cleanContent.match(pattern);
        if (match && match[1] && match[1].trim().length > 0) {
            let result = match[1].trim();
            
            // Nettoyer le résultat
            result = result.replace(/^\[|\]$/g, '').trim();
            
            // Préserver la structure des retours à la ligne pour les listes
            if (result.includes('\n') && (result.includes('1.') || result.includes('2.') || result.includes('-'))) {
                result = result.replace(/\n+/g, '\n').trim();
            } else {
                result = result.replace(/\n+/g, ' ').trim();
            }
            
            return result;
        }
    }
    
    return null;
}

// Fonction pour extraire les émotions du texte
function extractEmotionsFromText(content) {
    // Patterns pour détecter les émotions dans le texte
    const emotionPatterns = [
        // Pattern pour "Émotions clés à évoquer :" suivi d'une liste numérotée
        new RegExp(`Émotions\\s+clés\\s+à\\s+évoquer\\s*:\\s*([\\s\\S]+?)(?=\\nFears|\\nPeurs|\\nSupporting|\\nEmotions\\s+to\\s+evoke|$)`, 'i'),
        // Pattern pour détecter les émotions avec des pourcentages dans le Problem to Solve
        new RegExp(`(?:émotions?|sentiments?)\\s+(?:clés|fortes?|intenses?)\\s*à\\s*(?:évoquer|susciter)\\s*:\\s*([\\s\\S]+?)(?=\\nFears|\\nPeurs|\\nSupporting|$)`, 'i'),
        // Pattern pour détecter les émotions avec des pourcentages
        new RegExp(`(?:émotions?|sentiments?)\\s+(?:fortes?|intenses?)\\s*:\\s*([\\s\\S]+?)(?=\\n\\w+\\s*:|$)`, 'i'),
        // Pattern pour détecter les émotions sans pourcentages
        new RegExp(`(?:émotions?|sentiments?)\\s+(?:fortes?|intenses?)\\s*([\\s\\S]+?)(?=\\n\\w+\\s*:|$)`, 'i')
    ];
    
    for (const pattern of emotionPatterns) {
        const match = content.match(pattern);
        if (match && match[1] && match[1].trim().length > 0) {
            let result = match[1].trim();
            
            // Nettoyer le résultat
            result = result.replace(/^\[|\]$/g, '').trim();
            
            // Préserver la structure des retours à la ligne pour les listes
            if (result.includes('\n') && (result.includes('1.') || result.includes('2.') || result.includes('-'))) {
                result = result.replace(/\n+/g, '\n').trim();
            } else {
                result = result.replace(/\n+/g, ' ').trim();
            }
            
            return result;
        }
    }
    
    return null;
}

// Fonction pour extraire le nom de l'angle
function extractAngleName(content) {
    const angleNamePattern = /(?:What's the name in 2\/3 words we can define the marketing angle?:\s*(.+?))|(\*\*ANGLE \d+:\s*(.+?)\*\*)/is;
    const match = content.match(angleNamePattern);
    if (match && match[1] && match[1].trim().length > 0) {
        return match[1].trim();
    } else if (match && match[3] && match[3].trim().length > 0) {
        return match[3].trim();
    }
    return null;
}

// Fonction de parsing alternatif si le format principal échoue
function parseAlternativeFormat(response) {
    // Tentative de parser un format plus libre
    const angles = [];
    
    // Chercher des patterns comme "Angle", "Market", etc.
    const sections = response.split(/(?=\*\*|Angle|ANGLE)/i);
    
    sections.forEach((section, index) => {
        if (section.trim().length > 50) { // Ignorer les sections trop courtes
            angles.push({
                id: index + 1,
                name: `Angle ${index + 1}`,
                marketImpact: null,
                marketSize: section.substring(0, 200) + '...',
                problemToSolve: null,
                emotionsToEvoke: null,
                fears: null,
                supportingEvidence: null,
                tacticalApplication: null
            });
        }
    });
    
    return angles.slice(0, 5); // Limiter à 5 angles maximum
}

// Fonction pour sélectionner un angle marketing
window.selectMarketingAngle = function(angleId) {
    const selectedAngle = window.generatedMarketingAngles.find(angle => angle.id === angleId);
    
    if (!selectedAngle) {
        console.error('[Marketing Angle Selection] Angle non trouvé:', angleId);
        return;
    }
    
    // Désélectionner tous les autres angles
    document.querySelectorAll('.marketing-angle-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Sélectionner le nouvel angle
    const selectedCard = document.querySelector(`[data-angle-id="${angleId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Stocker la sélection
    window.selectedMarketingAngle = selectedAngle;
    
    console.log('[Marketing Angle Selection] Angle sélectionné:', selectedAngle);
    
    // Activer le bouton de continuation
    const continueButton = document.getElementById('continue-after-angle-selection');
    if (continueButton) {
        continueButton.disabled = false;
        continueButton.innerHTML = '<i class="fas fa-rocket"></i> Continuer avec cet angle';
    }
    
    // Mettre à jour l'état du bouton de génération de template
    if (typeof window.updateTemplateButtonState === 'function') {
        window.updateTemplateButtonState();
    }
    if (typeof window.updatePrelanderButtonState === 'function') {
        window.updatePrelanderButtonState();
    }
};

console.log('[Marketing Angle Selection] Module de sélection d\'angles marketing chargé');

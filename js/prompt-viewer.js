/**
 * Gestionnaire pour l'affichage des prompts utilisés dans la génération de contenu
 */

// Mapping des prompts pour chaque section
const PROMPTS = {
    productTitle: {
        name: "Titre du Produit",
        prompt: `Génère 3 titres de produit accrocheurs et optimisés pour la conversion pour ce produit :

Produit : {productName}
Description : {productDescription}
Angle marketing : {marketingAngle}
Avatar client : {customerAvatar}

Instructions :
- Chaque titre doit être percutant et créer de l'urgence
- Utilise des mots-clés émotionnels forts
- Reste dans la limite de 60 caractères pour l'optimisation SEO
- Adapte le ton à l'avatar client
- Mets en avant l'angle marketing choisi

Format de réponse :
Retourne uniquement un array JSON avec 3 titres :
["Titre 1", "Titre 2", "Titre 3"]`
    },
    
    productBenefits: {
        name: "Bénéfices Produit",
        prompt: `Génère une liste complète de bénéfices produit pour ce produit :

Produit : {productName}
Description : {productDescription}
Angle marketing : {marketingAngle}
Avatar client : {customerAvatar}

Instructions :
- Génère 8-12 bénéfices concrets et mesurables
- Chaque bénéfice doit résoudre un problème spécifique du client
- Utilise un langage orienté résultats
- Adapte les bénéfices à l'angle marketing
- Évite le jargon technique, privilégie les bénéfices émotionnels

Format de réponse :
[
  {
    "headline": "Titre du bénéfice",
    "description": "Description détaillée du bénéfice"
  }
]`
    },
    
    howItWorks: {
        name: "Comment ça marche",
        prompt: `Génère une explication claire du fonctionnement de ce produit :

Produit : {productName}
Description : {productDescription}
Angle marketing : {marketingAngle}

Instructions :
- Explique le processus en 3-5 étapes simples
- Utilise un langage accessible et non technique
- Mets l'accent sur la simplicité d'utilisation
- Chaque étape doit être actionnable
- Rassure sur la facilité d'utilisation

Format de réponse :
[
  {
    "step": 1,
    "title": "Titre de l'étape",
    "description": "Description détaillée de l'étape"
  }
]`
    },
    
    emotionalBenefits: {
        name: "Bénéfices Émotionnels",
        prompt: `Génère des bénéfices émotionnels puissants pour ce produit :

Produit : {productName}
Description : {productDescription}
Angle marketing : {marketingAngle}
Avatar client : {customerAvatar}

Instructions :
- Génère 8-10 bénéfices émotionnels profonds
- Connecte-toi aux désirs et peurs de l'avatar
- Utilise des déclencheurs émotionnels forts
- Chaque bénéfice doit créer une vision aspirationnelle
- Adapte le ton émotionnel à l'avatar client

Format de réponse :
[
  {
    "headline": "Bénéfice émotionnel",
    "description": "Description émotionnelle détaillée"
  }
]`
    },
    
    useCases: {
        name: "Cas d'Utilisation",
        prompt: `Génère des cas d'utilisation concrets et spécifiques pour ce produit :

Produit : {productName}
Description : {productDescription}
Angle marketing : {marketingAngle}
Avatar client : {customerAvatar}

Instructions :
- Génère 6-8 cas d'utilisation TRÈS spécifiques au produit
- Chaque description doit être détaillée et concrète (minimum 15-20 mots)
- Évite les formulations génériques comme "Utiliser le produit pour..."
- Crée des scénarios réalistes avec des détails précis
- Adapte chaque cas à l'avatar client et ses besoins spécifiques
- Montre des situations d'usage variées et créatives
- Utilise un langage émotionnel et engageant
- Chaque cas doit être unique et différent des autres

Exemples de bonnes descriptions :
- "Après une longue journée de travail, se blottir dans ce cocon douillet pendant que les enfants regardent la télé"
- "Créer un espace de méditation personnel dans le salon pour retrouver la sérénité le matin"
- "Transformer l'heure de la sieste en moment de pure détente avec ce compagnon ultra-confortable"

IMPORTANT : Réponds UNIQUEMENT avec le JSON, sans texte d'introduction ni explication.

Format de réponse :
[
  {
    "title": "Titre du cas d'usage",
    "description": "Description détaillée et spécifique du scénario d'utilisation avec des détails concrets"
  }
]`
    },
    
    characteristics: {
        name: "Caractéristiques",
        prompt: `Génère les caractéristiques techniques et spécifications de ce produit :

Produit : {productName}
Description : {productDescription}
Angle marketing : {marketingAngle}

Instructions :
- Génère 8-12 caractéristiques techniques importantes
- Traduis les specs techniques en bénéfices clients
- Mets en avant les différenciateurs techniques
- Utilise des termes compréhensibles
- Priorise les caractéristiques qui supportent l'angle marketing

IMPORTANT : Réponds UNIQUEMENT avec le JSON, sans texte d'introduction ni explication.

Format de réponse :
[
  {
    "title": "Nom de la caractéristique",
    "description": "Description de la caractéristique et son bénéfice"
  }
]`
    },
    
    competitiveAdvantages: {
        name: "Avantages Concurrentiels",
        prompt: `Génère les avantages concurrentiels de ce produit :

Produit : {productName}
Description : {productDescription}
Angle marketing : {marketingAngle}
Avatar client : {customerAvatar}

Instructions :
- Génère 6-8 avantages concurrentiels uniques
- Compare implicitement avec les alternatives
- Mets en avant les différenciateurs clés
- Utilise des preuves et des faits
- Crée un sentiment de supériorité du produit

Format de réponse :
[
  {
    "title": "Avantage concurrentiel",
    "description": "Explication de l'avantage et pourquoi c'est mieux"
  }
]`
    },
    
    customerReviews: {
        name: "Avis Clients",
        prompt: `Génère des avis clients authentiques et crédibles pour ce produit :

Produit : {productName}
Description : {productDescription}
Angle marketing : {marketingAngle}
Avatar client : {customerAvatar}

Instructions :
- Génère 8-12 avis clients variés et authentiques
- Utilise des prénoms français réalistes
- Varie les styles d'écriture et longueurs
- Inclus des détails spécifiques et crédibles
- Mets en avant différents bénéfices du produit
- Adapte les avis à l'avatar client

IMPORTANT : Réponds UNIQUEMENT avec le JSON, sans texte d'introduction ni explication.

Format de réponse :
[
  {
    "name": "Prénom du client",
    "review": "Texte de l'avis client",
    "rating": 5
  }
]`
    },
    
    faq: {
        name: "FAQ",
        prompt: `Génère une FAQ complète pour ce produit :

Produit : {productName}
Description : {productDescription}
Angle marketing : {marketingAngle}
Avatar client : {customerAvatar}

Instructions :
- Génère 8-12 questions fréquentes pertinentes
- Anticipe les objections et préoccupations clients
- Réponds de manière rassurante et convaincante
- Inclus des questions sur l'utilisation, la livraison, la garantie
- Adapte les questions aux préoccupations de l'avatar
- Utilise les réponses pour renforcer la vente

IMPORTANT : Réponds UNIQUEMENT avec le JSON, sans texte d'introduction ni explication.

Format de réponse :
[
  {
    "question": "Question du client",
    "answer": "Réponse détaillée et rassurante"
  }
]`
    }
};

// Garder une copie des prompts par défaut pour la réinitialisation
const DEFAULT_PROMPTS = JSON.parse(JSON.stringify(PROMPTS));

/**
 * Récupère les prompts par défaut
 */
function getDefaultPrompts() {
    return DEFAULT_PROMPTS;
}

/**
 * Réinitialise le prompt à sa valeur par défaut (temporaire)
 */
window.resetPrompt = function(sectionKey) {
    if (!confirm('Êtes-vous sûr de vouloir réinitialiser ce prompt à sa valeur par défaut ?')) {
        return;
    }
    
    // Récupérer le prompt par défaut
    const defaultPrompts = getDefaultPrompts();
    if (defaultPrompts[sectionKey]) {
        const textarea = document.getElementById('promptEditor');
        if (textarea) {
            textarea.value = defaultPrompts[sectionKey].prompt;
        }
        
        // Remettre le prompt par défaut (temporaire)
        PROMPTS[sectionKey].prompt = defaultPrompts[sectionKey].prompt;
        
        console.log('[PROMPT-EDITOR] Prompt réinitialisé pour:', sectionKey);
    }
};

/**
 * Affiche le modal avec le prompt pour une section donnée
 */
window.showPromptModal = function(sectionKey, event) {
    // Empêcher la propagation pour éviter de changer d'onglet
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    
    const promptData = PROMPTS[sectionKey];
    if (!promptData) {
        console.error('Prompt non trouvé pour la section:', sectionKey);
        return;
    }
    
    // Créer le modal s'il n'existe pas
    let modal = document.getElementById('promptModal');
    if (!modal) {
        modal = createPromptModal();
        document.body.appendChild(modal);
    }
    
    // Stocker la section actuelle pour l'édition
    modal.dataset.currentSection = sectionKey;
    
    // Mettre à jour le contenu du modal
    document.getElementById('promptModalTitle').textContent = `Prompt - ${promptData.name}`;
    
    // Créer le contenu éditable
    const promptContent = document.getElementById('promptModalContent');
    promptContent.innerHTML = '';
    
    // Ajouter les options de génération
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'generation-options';
    optionsDiv.style.cssText = `
        background: var(--dark-bg, #1a1a1a);
        border: 1px solid var(--border-color, #333);
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
    `;
    
    optionsDiv.innerHTML = `
        <h4 style="margin: 0 0 15px 0; color: var(--primary-color, #00d4ff);">
            <i class="fas fa-sliders-h"></i> Options de génération
        </h4>
        <div class="options-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div class="options-column">
                <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 12px;">
                    <input type="checkbox" id="includeProductName" checked style="margin-right: 10px; transform: scale(1.2);">
                    <span>Inclure le nom du produit</span>
                </label>
                <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 12px;">
                    <input type="checkbox" id="includeDeepResearch" checked style="margin-right: 10px; transform: scale(1.2);">
                    <span>Inclure la description/recherche produit</span>
                </label>
            </div>
            <div class="options-column">
                <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 12px;">
                    <input type="checkbox" id="includeMarketingAngle" style="margin-right: 10px; transform: scale(1.2);">
                    <span>Inclure l'angle marketing sélectionné</span>
                </label>
                <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 12px;">
                    <input type="checkbox" id="includeCustomerAvatar" style="margin-right: 10px; transform: scale(1.2);">
                    <span>Inclure le profil avatar sélectionné</span>
                </label>
            </div>
        </div>
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border-color, #333);">
            <button onclick="savePromptChanges('${sectionKey}')" class="save-prompt-btn" style="
                background: linear-gradient(135deg, #28a745, #20c997);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.3s ease;
                margin-right: 10px;
            ">
                <i class="fas fa-save"></i> Sauvegarder le prompt
            </button>
            <small style="color: var(--text-secondary, #888); font-size: 12px;">
                Sauvegarde le prompt modifié pour cette section
            </small>
        </div>
    `;
    
    promptContent.appendChild(optionsDiv);
    
    // Ajouter des event listeners pour les checkboxes
    const checkboxes = ['includeProductName', 'includeDeepResearch', 'includeMarketingAngle', 'includeCustomerAvatar'];
    checkboxes.forEach(checkboxId => {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                console.log(`[PROMPT-UPDATE] Checkbox ${checkboxId} changée:`, this.checked);
                updatePromptWithOptions(sectionKey);
            });
        }
    });
    
    // Ajouter le textarea pour l'édition
    const textarea = document.createElement('textarea');
    textarea.id = 'promptEditor';
    textarea.value = promptData.prompt;
    textarea.style.cssText = `
        width: 100%;
        height: 400px;
        background: var(--dark-bg, #1a1a1a);
        border: 1px solid var(--border-color, #333);
        border-radius: 8px;
        padding: 15px;
        color: var(--text-color, #e0e0e0);
        font-family: 'Courier New', monospace;
        font-size: 14px;
        line-height: 1.5;
        resize: vertical;
        outline: none;
    `;
    
    promptContent.appendChild(textarea);
    
    // Mettre à jour les boutons d'action
    updateModalActions(sectionKey);
    
    // Afficher le modal
    modal.style.display = 'flex';
    
    // Initialiser le prompt avec les options actuelles
    setTimeout(() => {
        updatePromptWithOptions(sectionKey);
    }, 100);
    
    // Focus sur le textarea
    setTimeout(() => textarea.focus(), 100);
};

/**
 * Met à jour les boutons d'action du modal
 */
function updateModalActions(sectionKey) {
    const actionsContainer = document.querySelector('.modal-actions');
    if (!actionsContainer) return;
    
    actionsContainer.innerHTML = `
        <button class="regenerate-with-prompt-btn" onclick="regenerateWithCurrentPrompt('${sectionKey}')" style="
            padding: 12px 20px;
            border: none;
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s ease;
            margin-right: 10px;
        ">
            <i class="fas fa-magic"></i> Generate
        </button>
        <button class="copy-prompt-btn" onclick="copyCurrentPrompt()" style="
            padding: 12px 20px;
            border: none;
            background: linear-gradient(135deg, var(--primary-color, #00d4ff), var(--primary-hover, #0099cc));
            color: white;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s ease;
            margin-right: 10px;
        ">
            <i class="fas fa-copy"></i> Copier le prompt
        </button>
        <button class="reset-prompt-btn" onclick="resetPrompt('${sectionKey}')" style="
            padding: 12px 20px;
            border: 2px solid #dc3545;
            background: transparent;
            color: #dc3545;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            margin-right: 10px;
        ">
            <i class="fas fa-undo"></i> Réinitialiser
        </button>
        <button onclick="window.closePromptModal()" style="
            padding: 12px 20px;
            border: 2px solid var(--border-color, #444);
            background: transparent;
            color: var(--text-color, #e0e0e0);
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
        ">Fermer</button>
    `;
}

/**
 * Ferme le modal des prompts
 */
window.closePromptModal = function() {
    const modal = document.getElementById('promptModal');
    if (modal) {
        modal.style.display = 'none';
    }
};

/**
 * Crée le modal HTML pour l'affichage des prompts
 */
function createPromptModal() {
    const modal = document.createElement('div');
    modal.id = 'promptModal';
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background: var(--card-bg, #2a2a2a);
            color: var(--text-color, #e0e0e0);
            padding: 30px;
            border-radius: 12px;
            width: 95%;
            max-width: 1000px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            border: 1px solid var(--border-color, #444);
        ">
            <div class="modal-header" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                border-bottom: 1px solid var(--border-color, #444);
                padding-bottom: 15px;
            ">
                <h3 id="promptModalTitle" style="margin: 0; color: var(--primary-color, #00d4ff);">
                    <i class="fas fa-cog"></i> Prompt
                </h3>
                <button onclick="window.closePromptModal()" style="
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: var(--secondary-text-color, #999);
                    padding: 5px;
                ">×</button>
            </div>
            
            <div class="prompt-info" style="
                background: var(--dark-bg, #1a1a1a);
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                border: 1px solid var(--border-color, #333);
            ">
                <h4 style="margin: 0 0 10px 0; color: var(--primary-color, #00d4ff);">
                    <i class="fas fa-info-circle"></i> Instructions d'édition
                </h4>
                <p style="margin: 0; font-size: 14px; line-height: 1.5;">
                    • Modifiez le prompt ci-dessous selon vos besoins<br>
                    • Les variables <code>{productName}</code>, <code>{productDescription}</code>, <code>{marketingAngle}</code>, <code>{customerAvatar}</code> seront automatiquement remplacées<br>
                    • Cliquez sur "Generate" pour générer du nouveau contenu immédiatement<br>
                    • Vos modifications sont sauvegardées automatiquement
                </p>
            </div>
            
            <div class="prompt-content" style="margin-bottom: 20px;">
                <div id="promptModalContent"></div>
            </div>
            
            <div class="modal-actions" style="
                display: flex;
                gap: 10px;
                justify-content: flex-start;
                flex-wrap: wrap;
            ">
                <!-- Les boutons seront ajoutés dynamiquement -->
            </div>
        </div>
    `;
    
    // Fermer le modal en cliquant sur l'overlay
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            window.closePromptModal();
        }
    });
    
    // Ajouter les styles CSS pour les icônes de paramètres
    const promptStyles = document.createElement('style');
    promptStyles.textContent = `
        .prompt-settings-icon {
            opacity: 0.6;
            transition: all 0.3s ease;
            margin-left: 8px;
            font-size: 12px;
        }
        
        .prompt-settings-icon:hover {
            opacity: 1;
            color: var(--primary-color, #00d4ff);
            transform: rotate(90deg);
        }
        
        .tab-btn {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .copy-prompt-btn:hover,
        .regenerate-with-prompt-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        
        .reset-prompt-btn:hover {
            background: #dc3545 !important;
            color: white !important;
            transform: translateY(-1px);
        }
        
        #promptEditor {
            transition: border-color 0.3s ease;
        }
        
        #promptEditor:focus {
            border-color: var(--primary-color, #00d4ff) !important;
            box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
        }
        
        .prompt-info code {
            background: rgba(0, 212, 255, 0.1);
            padding: 2px 6px;
            border-radius: 4px;
            color: var(--primary-color, #00d4ff);
            font-family: 'Courier New', monospace;
            font-size: 12px;
        }
        
        .modal-actions button {
            transition: all 0.3s ease;
        }
        
        .modal-actions button:hover {
            transform: translateY(-1px);
        }
        
        /* Styles pour les options de génération */
        .generation-options label {
            color: var(--text-color, #e0e0e0);
            font-size: 14px;
            transition: color 0.3s ease;
        }
        
        .generation-options label:hover {
            color: var(--primary-color, #00d4ff);
        }
        
        .generation-options input[type="checkbox"] {
            accent-color: var(--primary-color, #00d4ff);
            cursor: pointer;
        }
        
        .generation-options h4 {
            border-bottom: 1px solid var(--border-color, #333);
            padding-bottom: 8px;
        }
        
        .options-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        
        .options-column label {
            display: flex;
            align-items: center;
            cursor: pointer;
            margin-bottom: 12px;
            padding: 8px;
            border-radius: 6px;
            transition: background-color 0.3s ease;
        }
        
        .options-column label:hover {
            background-color: rgba(0, 212, 255, 0.1);
        }
        
        .save-prompt-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        }
        
        .save-prompt-btn:active {
            transform: translateY(0);
        }
    `;
    document.head.appendChild(promptStyles);
    
    return modal;
}

// Test de fonctionnement au chargement
document.addEventListener('DOMContentLoaded', () => {
    console.log('[PROMPT-VIEWER] Module chargé avec succès');
    
    // Charger les prompts sauvegardés depuis localStorage
    loadSavedPrompts();
    
    // Fonction de test pour l'édition de prompts
    window.testPromptEdit = (sectionKey) => {
        console.log('[PROMPT-EDITOR] Test d\'édition pour:', sectionKey);
        showPromptModal(sectionKey);
    };
    
    // Fonction pour tester les options de génération
    window.testGenerationOptions = (sectionKey, options = {}) => {
        console.log('[PROMPT-EDITOR] Test avec options pour:', sectionKey, options);
        regenerateContentWithOptions(sectionKey, {
            includeProductName: options.includeProductName !== false,
            includeDeepResearch: options.includeDeepResearch !== false,
            includeMarketingAngle: options.includeMarketingAngle || false,
            includeCustomerAvatar: options.includeCustomerAvatar || false
        });
    };
    
    // Fonction pour tester la génération avec prompt personnalisé
    window.testCustomPrompt = (sectionKey, customPrompt, options = {}) => {
        console.log('[PROMPT-EDITOR] Test avec prompt personnalisé pour:', sectionKey);
        regenerateContentWithCustomPrompt(sectionKey, customPrompt || 'Test prompt', {
            includeProductName: options.includeProductName !== false,
            includeDeepResearch: options.includeDeepResearch !== false,
            includeMarketingAngle: options.includeMarketingAngle || false,
            includeCustomerAvatar: options.includeCustomerAvatar || false
        });
    };
    
    // Fonction pour vérifier l'état des prompts
    window.checkPromptState = (sectionKey) => {
        console.log('[PROMPT-STATE] État du prompt pour:', sectionKey);
        console.log('- Prompt actuel:', PROMPTS[sectionKey]?.prompt?.substring(0, 100) + '...');
        console.log('- Prompt par défaut:', DEFAULT_PROMPTS[sectionKey]?.prompt?.substring(0, 100) + '...');
        console.log('- Identiques:', PROMPTS[sectionKey]?.prompt === DEFAULT_PROMPTS[sectionKey]?.prompt);
        
        // Vérifier localStorage
        const savedPrompts = JSON.parse(localStorage.getItem('prompts') || '{}');
        console.log('- Sauvegardé:', !!savedPrompts[sectionKey]);
        if (savedPrompts[sectionKey]) {
            console.log('- Prompt sauvegardé:', savedPrompts[sectionKey].prompt?.substring(0, 100) + '...');
        }
    };
    
    // Fonction pour tester la sauvegarde
    window.testSavePrompt = (sectionKey, testPrompt) => {
        console.log('[PROMPT-SAVE] Test de sauvegarde pour:', sectionKey);
        if (testPrompt) {
            // Simuler l'édition du prompt dans le textarea
            const textarea = document.getElementById('promptEditor');
            if (textarea) {
                textarea.value = testPrompt;
            } else {
                // Si pas de modal ouvert, modifier directement PROMPTS
                PROMPTS[sectionKey].prompt = testPrompt;
            }
        }
        savePromptChanges(sectionKey);
    };
    
    // Fonction pour vérifier les prompts sauvegardés
    window.checkSavedPrompts = () => {
        const savedPrompts = JSON.parse(localStorage.getItem('prompts') || '{}');
        console.log('[PROMPT-SAVE] Prompts sauvegardés:', Object.keys(savedPrompts));
        Object.keys(savedPrompts).forEach(key => {
            console.log(`[PROMPT-SAVE] ${key}:`, savedPrompts[key].prompt?.substring(0, 100) + '...');
        });
        return savedPrompts;
    };
    
    // Vérifier que les boutons de regénération sont bien présents
    setTimeout(() => {
        const regenerateButtons = document.querySelectorAll('.btn-regenerate');
        console.log('[PROMPT-VIEWER] Boutons de regénération trouvés:', regenerateButtons.length);
        regenerateButtons.forEach((btn, index) => {
            console.log(`[PROMPT-VIEWER] Bouton ${index + 1}:`, btn.getAttribute('onclick'));
        });
        
        // Vérifier le contenu existant
        if (window.generatedContent) {
            console.log('[PROMPT-VIEWER] Contenu généré disponible:', Object.keys(window.generatedContent));
        } else {
            console.log('[PROMPT-VIEWER] Aucun contenu généré trouvé');
        }
    }, 1000);
});

/**
 * Regénère le contenu pour une section donnée en utilisant l'IA
 */
window.regenerateContent = async function(sectionKey) {
    console.log('[REGENERATE-1] Début de la régénération pour:', sectionKey);
    
    // Protection contre les appels multiples
    if (window.regenerationInProgress && window.regenerationInProgress[sectionKey]) {
        console.log('[REGENERATE-1] ⚠️ Régénération déjà en cours pour:', sectionKey);
        return;
    }
    
    // Marquer la régénération comme en cours
    if (!window.regenerationInProgress) {
        window.regenerationInProgress = {};
    }
    window.regenerationInProgress[sectionKey] = true;
    
    const promptData = PROMPTS[sectionKey];
    if (!promptData) {
        console.error('[REGENERATE-1] Prompt non trouvé pour la section:', sectionKey);
        alert('Erreur: Prompt non trouvé pour cette section');
        window.regenerationInProgress[sectionKey] = false;
        return;
    }
    
    // Récupérer les données du formulaire
    const productName = document.getElementById('productName')?.value?.trim();
    const productDescription = document.getElementById('deepResearch')?.value?.trim();
    
    // Récupérer l'angle marketing sélectionné
    let marketingAngle = 'Non défini';
    const selectedAngleElement = document.querySelector('.marketing-angle.selected');
    if (selectedAngleElement) {
        const angleTitle = selectedAngleElement.querySelector('.angle-title')?.textContent;
        const angleDescription = selectedAngleElement.querySelector('.angle-description')?.textContent;
        marketingAngle = `${angleTitle}: ${angleDescription}`;
    }
    
    // Récupérer l'avatar client sélectionné
    let customerAvatar = 'Non défini';
    const selectedAvatarElement = document.querySelector('.avatar-card.selected');
    if (selectedAvatarElement) {
        const avatarName = selectedAvatarElement.querySelector('.avatar-name')?.textContent;
        const avatarDescription = selectedAvatarElement.querySelector('.avatar-description')?.textContent;
        customerAvatar = `${avatarName}: ${avatarDescription}`;
    }
    
    // Validation des données requises
    if (!productName) {
        alert('Veuillez d\'abord renseigner le nom du produit dans le formulaire');
        window.regenerationInProgress[sectionKey] = false;
        return;
    }
    
    if (!productDescription) {
        alert('Veuillez d\'abord renseigner la description du produit dans le formulaire');
        window.regenerationInProgress[sectionKey] = false;
        return;
    }
    
    // Trouver le bouton de regénération pour afficher l'état de chargement
    let regenerateBtn = null;
    try {
        regenerateBtn = document.querySelector(`[onclick*="regenerateContent('${sectionKey}')"]`);
    } catch (e) {
        console.log('[REGENERATE-1] Erreur de sélecteur, recherche alternative...');
        // Fallback : chercher tous les boutons de regénération et trouver le bon
        const allButtons = document.querySelectorAll('[onclick*="regenerateContent"]');
        regenerateBtn = Array.from(allButtons).find(btn => btn.onclick && btn.onclick.toString().includes(sectionKey));
    }
    const originalBtnHTML = regenerateBtn ? regenerateBtn.innerHTML : '';
    
    try {
        // Afficher l'état de chargement
        if (regenerateBtn) {
            regenerateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Génération...';
            regenerateBtn.disabled = true;
        }
        
        // Construire le prompt personnalisé
        let customPrompt = promptData.prompt
            .replace(/{productName}/g, productName)
            .replace(/{productDescription}/g, productDescription)
            .replace(/{marketingAngle}/g, marketingAngle)
            .replace(/{customerAvatar}/g, customerAvatar);
        
        console.log('[REGENERATE-1] Prompt personnalisé créé, longueur:', customPrompt.length);
        
        // Appeler l'API IA avec le bon format
        console.log('[REGENERATE-1] Appel API avec prompt:', customPrompt.substring(0, 100) + '...');
        
        const response = await fetch('http://localhost:3000/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                temperature: 0.7,
                max_tokens: 2000,
                messages: [
                    {
                        role: 'user',
                        content: customPrompt
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const generatedContent = data.choices?.[0]?.message?.content || data.content || data.response || data;
        console.log('[REGENERATE-1] Réponse IA reçue, longueur:', generatedContent.length);
        
        // Parser le contenu généré selon le type de section
        const parsedContent = parseContentBySection(generatedContent, sectionKey);
        console.log('[REGENERATE-1] Contenu parsé:', parsedContent);
        
        // Pour les bénéfices produit, les bénéfices émotionnels, les titres, les cas d'utilisation, les caractéristiques, les avantages concurrentiels, les FAQ et les avis clients, ajouter au lieu de remplacer
        if (sectionKey === 'productBenefits' || sectionKey === 'productTitle' || sectionKey === 'emotionalBenefits' || sectionKey === 'useCases' || sectionKey === 'characteristics' || sectionKey === 'competitiveAdvantages' || sectionKey === 'faq' || sectionKey === 'customerReviews') {
            await appendContentToSection(sectionKey, parsedContent);
        } else {
            // Pour les autres sections, créer une nouvelle version (version2, version3, etc.)
            await addNewVersionToSection(sectionKey, parsedContent);
        }
        
        console.log('[REGENERATE-1] Régénération terminée avec succès pour:', sectionKey);
        
    } catch (error) {
        console.error('[REGENERATE-1] Erreur lors de la régénération:', error);
        alert(`Erreur lors de la régénération: ${error.message}`);
    } finally {
        // Restaurer l'état du bouton
        if (regenerateBtn) {
            regenerateBtn.innerHTML = originalBtnHTML;
            regenerateBtn.disabled = false;
        }
        window.regenerationInProgress[sectionKey] = false;
    }
};

/**
 * Regénère le contenu pour une section donnée en utilisant l'IA et les options sélectionnées
 */
window.regenerateContentWithOptions = async function(sectionKey, options) {
    console.log('[REGENERATE-2] Début de la régénération pour:', sectionKey);
    
    const promptData = PROMPTS[sectionKey];
    if (!promptData) {
        console.error('[REGENERATE-2] Prompt non trouvé pour la section:', sectionKey);
        alert('Erreur: Prompt non trouvé pour cette section');
        return;
    }
    
    // Récupérer les données du formulaire
    const productName = document.getElementById('productName')?.value?.trim();
    const productDescription = document.getElementById('deepResearch')?.value?.trim();
    
    // Récupérer l'angle marketing sélectionné
    let marketingAngle = 'Non défini';
    const selectedAngleElement = document.querySelector('.marketing-angle.selected');
    if (selectedAngleElement) {
        const angleTitle = selectedAngleElement.querySelector('.angle-title')?.textContent;
        const angleDescription = selectedAngleElement.querySelector('.angle-description')?.textContent;
        marketingAngle = `${angleTitle}: ${angleDescription}`;
    }
    
    // Récupérer l'avatar client sélectionné
    let customerAvatar = 'Non défini';
    const selectedAvatarElement = document.querySelector('.avatar-card.selected');
    if (selectedAvatarElement) {
        const avatarName = selectedAvatarElement.querySelector('.avatar-name')?.textContent;
        const avatarDescription = selectedAvatarElement.querySelector('.avatar-description')?.textContent;
        customerAvatar = `${avatarName}: ${avatarDescription}`;
    }
    
    // Validation des données requises
    if (!productName) {
        alert('Veuillez d\'abord renseigner le nom du produit dans le formulaire');
        return;
    }
    
    if (!productDescription) {
        alert('Veuillez d\'abord renseigner la description du produit dans le formulaire');
        return;
    }
    
    // Trouver le bouton de regénération pour afficher l'état de chargement
    let regenerateBtn = null;
    try {
        regenerateBtn = document.querySelector(`[onclick*="regenerateContentWithOptions('${sectionKey}', {includeProductName: ${options.includeProductName}, includeDeepResearch: ${options.includeDeepResearch}, includeSelectedContent: ${options.includeSelectedContent}})"]`) ||
                         document.querySelector(`[onclick*="regenerateContentWithCustomPrompt('${sectionKey}'"]`);
    } catch (e) {
        console.log('[REGENERATE-2] Erreur de sélecteur, recherche alternative...');
        // Fallback : chercher tous les boutons de regénération et trouver le bon
        const allButtons = document.querySelectorAll('[onclick*="regenerateContentWithOptions"]');
        regenerateBtn = Array.from(allButtons).find(btn => btn.onclick && btn.onclick.toString().includes(sectionKey));
    }
    const originalBtnHTML = regenerateBtn ? regenerateBtn.innerHTML : '';
    
    try {
        // Afficher l'état de chargement
        if (regenerateBtn) {
            regenerateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Génération...';
            regenerateBtn.disabled = true;
        }
        
        // Construire le prompt personnalisé
        let customPrompt = promptData.prompt
            .replace(/{productName}/g, options.includeProductName ? productName : '')
            .replace(/{productDescription}/g, options.includeDeepResearch ? productDescription : '')
            .replace(/{marketingAngle}/g, options.includeMarketingAngle ? marketingAngle : '')
            .replace(/{customerAvatar}/g, options.includeCustomerAvatar ? customerAvatar : '');
        
        console.log('[REGENERATE-2] Prompt personnalisé créé, longueur:', customPrompt.length);
        
        // Appeler l'API IA avec le bon format
        console.log('[REGENERATE-2] Appel API avec prompt:', customPrompt.substring(0, 100) + '...');
        
        const response = await fetch('http://localhost:3000/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                temperature: 0.7,
                max_tokens: 2000,
                messages: [
                    {
                        role: 'user',
                        content: customPrompt
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const generatedContent = data.choices?.[0]?.message?.content || data.content || data.response || data;
        console.log('[REGENERATE-2] Réponse IA reçue, longueur:', generatedContent.length);
        
        // Parser le contenu généré selon le type de section
        const parsedContent = parseContentBySection(generatedContent, sectionKey);
        console.log('[REGENERATE-2] Contenu parsé:', parsedContent);
        
        // Pour les bénéfices produit, les bénéfices émotionnels, les titres, les cas d'utilisation, les caractéristiques, les avantages concurrentiels, les FAQ et les avis clients, ajouter au lieu de remplacer
        if (sectionKey === 'productBenefits' || sectionKey === 'productTitle' || sectionKey === 'emotionalBenefits' || sectionKey === 'useCases' || sectionKey === 'characteristics' || sectionKey === 'competitiveAdvantages' || sectionKey === 'faq' || sectionKey === 'customerReviews') {
            await appendContentToSection(sectionKey, parsedContent);
        } else {
            // Pour les autres sections, créer une nouvelle version (version2, version3, etc.)
            await addNewVersionToSection(sectionKey, parsedContent);
        }
        
        console.log('[REGENERATE-2] Régénération terminée avec succès pour:', sectionKey);
        
    } catch (error) {
        console.error('[REGENERATE-2] Erreur lors de la régénération:', error);
        alert(`Erreur lors de la régénération: ${error.message}`);
    } finally {
        // Restaurer l'état du bouton
        if (regenerateBtn) {
            regenerateBtn.innerHTML = originalBtnHTML;
            regenerateBtn.disabled = false;
        }
    }
};

/**
 * Regénère le contenu pour une section donnée en utilisant l'IA et un prompt personnalisé
 */
window.regenerateContentWithCustomPrompt = async function(sectionKey, customPrompt, options) {
    console.log('[REGENERATE-3] Début de la régénération pour:', sectionKey);
    
    // Récupérer les données du formulaire
    const productName = document.getElementById('productName')?.value?.trim();
    const productDescription = document.getElementById('deepResearch')?.value?.trim();
    
    // Récupérer l'angle marketing sélectionné
    let marketingAngle = 'Non défini';
    const selectedAngleElement = document.querySelector('.marketing-angle.selected');
    if (selectedAngleElement) {
        const angleTitle = selectedAngleElement.querySelector('.angle-title')?.textContent;
        const angleDescription = selectedAngleElement.querySelector('.angle-description')?.textContent;
        marketingAngle = `${angleTitle}: ${angleDescription}`;
    }
    
    // Récupérer l'avatar client sélectionné
    let customerAvatar = 'Non défini';
    const selectedAvatarElement = document.querySelector('.avatar-card.selected');
    if (selectedAvatarElement) {
        const avatarName = selectedAvatarElement.querySelector('.avatar-name')?.textContent;
        const avatarDescription = selectedAvatarElement.querySelector('.avatar-description')?.textContent;
        customerAvatar = `${avatarName}: ${avatarDescription}`;
    }
    
    // Validation des données requises
    if (!productName) {
        alert('Veuillez d\'abord renseigner le nom du produit dans le formulaire');
        return;
    }
    
    if (!productDescription) {
        alert('Veuillez d\'abord renseigner la description du produit dans le formulaire');
        return;
    }
    
    // Trouver le bouton de regénération pour afficher l'état de chargement
    let regenerateBtn = null;
    try {
        regenerateBtn = document.querySelector(`[onclick*="regenerateContentWithOptions('${sectionKey}', {includeProductName: ${options.includeProductName}, includeDeepResearch: ${options.includeDeepResearch}, includeSelectedContent: ${options.includeSelectedContent}})"]`) ||
                         document.querySelector(`[onclick*="regenerateContentWithCustomPrompt('${sectionKey}'"]`);
    } catch (e) {
        console.log('[REGENERATE-3] Erreur de sélecteur, recherche alternative...');
        // Fallback : chercher tous les boutons de regénération et trouver le bon
        const allButtons = document.querySelectorAll('[onclick*="regenerateContentWithOptions"]');
        regenerateBtn = Array.from(allButtons).find(btn => btn.onclick && btn.onclick.toString().includes(sectionKey));
    }
    const originalBtnHTML = regenerateBtn ? regenerateBtn.innerHTML : '';
    
    try {
        // Afficher l'état de chargement
        if (regenerateBtn) {
            regenerateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Génération...';
            regenerateBtn.disabled = true;
        }
        
        // Construire le prompt personnalisé
        let finalPrompt = customPrompt
            .replace(/{productName}/g, options.includeProductName ? productName : '')
            .replace(/{productDescription}/g, options.includeDeepResearch ? productDescription : '')
            .replace(/{marketingAngle}/g, options.includeMarketingAngle ? marketingAngle : '')
            .replace(/{customerAvatar}/g, options.includeCustomerAvatar ? customerAvatar : '');
        
        console.log('[REGENERATE-3] Prompt personnalisé créé, longueur:', finalPrompt.length);
        
        // Appeler l'API IA avec le bon format
        console.log('[REGENERATE-3] Appel API avec prompt:', finalPrompt.substring(0, 100) + '...');
        
        const response = await fetch('http://localhost:3000/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                temperature: 0.7,
                max_tokens: 2000,
                messages: [
                    {
                        role: 'user',
                        content: finalPrompt
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const generatedContent = data.choices?.[0]?.message?.content || data.content || data.response || data;
        console.log('[REGENERATE-3] Réponse IA reçue, longueur:', generatedContent.length);
        
        // Parser le contenu généré selon le type de section
        const parsedContent = parseContentBySection(generatedContent, sectionKey);
        console.log('[REGENERATE-3] Contenu parsé:', parsedContent);
        
        // Pour les bénéfices produit, les bénéfices émotionnels, les titres, les cas d'utilisation, les caractéristiques, les avantages concurrentiels, les FAQ et les avis clients, ajouter au lieu de remplacer
        if (sectionKey === 'productBenefits' || sectionKey === 'productTitle' || sectionKey === 'emotionalBenefits' || sectionKey === 'useCases' || sectionKey === 'characteristics' || sectionKey === 'competitiveAdvantages' || sectionKey === 'faq' || sectionKey === 'customerReviews') {
            await appendContentToSection(sectionKey, parsedContent);
        } else {
            // Pour les autres sections, créer une nouvelle version (version2, version3, etc.)
            await addNewVersionToSection(sectionKey, parsedContent);
        }
        
        console.log('[REGENERATE-3] Régénération terminée avec succès pour:', sectionKey);
        
    } catch (error) {
        console.error('[REGENERATE-3] Erreur lors de la régénération:', error);
        alert(`Erreur lors de la régénération: ${error.message}`);
    } finally {
        // Restaurer l'état du bouton
        if (regenerateBtn) {
            regenerateBtn.innerHTML = originalBtnHTML;
            regenerateBtn.disabled = false;
        }
    }
};

/**
 * Regénère le contenu avec le prompt actuellement affiché et les options sélectionnées
 */
window.regenerateWithCurrentPrompt = function(sectionKey) {
    const textarea = document.getElementById('promptEditor');
    if (!textarea) return;
    
    const includeProductName = document.getElementById('includeProductName')?.checked || false;
    const includeDeepResearch = document.getElementById('includeDeepResearch')?.checked || false;
    const includeMarketingAngle = document.getElementById('includeMarketingAngle')?.checked || false;
    const includeCustomerAvatar = document.getElementById('includeCustomerAvatar')?.checked || false;
    
    console.log('[REGENERATE-5] Options sélectionnées:', {
        includeProductName,
        includeDeepResearch,
        includeMarketingAngle,
        includeCustomerAvatar
    });
    
    // Récupérer le prompt personnalisé (sans modifier PROMPTS globalement)
    const customPrompt = textarea.value.trim();
    console.log('[REGENERATE-5] Prompt récupéré:', customPrompt.substring(0, 100) + '...');
    console.log('[REGENERATE-5] Longueur du prompt:', customPrompt.length);
    
    if (!customPrompt || customPrompt.length < 10) {
        alert('Le prompt est trop court. Veuillez saisir un prompt d\'au moins 10 caractères.');
        return;
    }
    
    // Fermer le modal
    closePromptModal();
    
    // Regénérer avec les options personnalisées et le prompt personnalisé
    setTimeout(() => {
        regenerateContentWithCustomPrompt(sectionKey, customPrompt, {
            includeProductName,
            includeDeepResearch,
            includeMarketingAngle,
            includeCustomerAvatar
        });
    }, 300);
};

/**
 * Ferme le modal des prompts
 */
window.closePromptModal = function() {
    const modal = document.getElementById('promptModal');
    if (modal) {
        modal.style.display = 'none';
    }
};

/**
 * Parse le contenu généré selon le type de section
 */
function parseContentBySection(content, sectionKey) {
    console.log('[PARSE] parseContentBySection appelé pour:', sectionKey);
    console.log('[PARSE] Contenu brut reçu (longueur:', content.length, '):', content.substring(0, 500) + (content.length > 500 ? '...' : ''));
    
    try {
        // Nettoyer le contenu (enlever les markdown, etc.)
        let cleanContent = content.trim();
        console.log('[PARSE] Contenu nettoyé:', cleanContent.substring(0, 300) + (cleanContent.length > 300 ? '...' : ''));
        
        // Enlever les blocs de code markdown si présents
        cleanContent = cleanContent.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
        
        // Enlever les textes d'introduction parasites de manière plus robuste
        // Patterns courants : "Bien sûr, voici...", "Voici...", "Voilà...", etc.
        const introPatterns = [
            /^.*?(?:bien sûr,?\s*)?(?:voici|voilà)\s+(?:les?\s+)?\d*\s*.*?(?:pour|de|du)\s+.*?:\s*/i,
            /^.*?(?:voici|voilà)\s+.*?:\s*/i,
            /^.*?(?=\[|\{)/s
        ];
        
        let originalContent = cleanContent;
        for (const pattern of introPatterns) {
            const beforeClean = cleanContent;
            cleanContent = cleanContent.replace(pattern, '').trim();
            if (cleanContent !== beforeClean) {
                console.log('[PARSE] Phrase d\'introduction supprimée avec pattern:', pattern);
                console.log('[PARSE] Avant:', beforeClean.substring(0, 100));
                console.log('[PARSE] Après:', cleanContent.substring(0, 100));
                break; // Arrêter après la première correspondance
            }
        }
        
        // Si aucun pattern n'a fonctionné et qu'on a toujours du texte avant [ ou {
        if (cleanContent === originalContent && !cleanContent.startsWith('[') && !cleanContent.startsWith('{')) {
            // Chercher le premier [ ou { et tout prendre à partir de là
            const jsonStart = Math.min(
                cleanContent.indexOf('[') !== -1 ? cleanContent.indexOf('[') : Infinity,
                cleanContent.indexOf('{') !== -1 ? cleanContent.indexOf('{') : Infinity
            );
            if (jsonStart !== Infinity && jsonStart > 0) {
                console.log('[PARSE] Suppression forcée du texte avant JSON, position:', jsonStart);
                console.log('[PARSE] Texte supprimé:', cleanContent.substring(0, jsonStart));
                cleanContent = cleanContent.substring(jsonStart).trim();
            }
        }
        
        // Enlever les éventuels caractères d'échappement ou espaces supplémentaires
        cleanContent = cleanContent.trim();
        
        console.log('[PARSE] Contenu nettoyé:', cleanContent.substring(0, 300) + (cleanContent.length > 300 ? '...' : ''));
        
        // Essayer de parser comme JSON d'abord
        if (cleanContent.startsWith('[') || cleanContent.startsWith('{')) {
            console.log('[PARSE] Contenu détecté comme JSON potentiel');
            console.log('[PARSE] Premiers 500 caractères:', cleanContent.substring(0, 500));
            try {
                const parsed = JSON.parse(cleanContent);
                console.log('[PARSE] JSON parsé avec succès:', parsed);
                
                // Si c'est déjà un array d'objets avec headline/description, le retourner directement
                if (Array.isArray(parsed) && parsed.length > 0 && (parsed[0].headline || parsed[0].title)) {
                    console.log('[PARSE] Array d\'objets avec headline/title détecté, retour direct');
                    console.log('[PARSE] Premier objet:', parsed[0]);
                    return parsed;
                }
                
                // Si c'est un array de strings (comme pour les titres), le retourner directement
                if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
                    console.log('[PARSE] Array de strings détecté, retour direct');
                    console.log('[PARSE] Premier élément:', parsed[0]);
                    return parsed;
                }
                
                // Log pour diagnostiquer
                if (Array.isArray(parsed) && parsed.length > 0) {
                    console.log('[PARSE] Array détecté mais pas de headline/title');
                    console.log('[PARSE] Premier objet:', parsed[0]);
                    console.log('[PARSE] Clés du premier objet:', Object.keys(parsed[0]));
                }
                
                return parsed;
            } catch (e) {
                console.log('[PARSE] Pas du JSON valide, essai de parsing manuel');
                console.log('[PARSE] Erreur JSON:', e.message);
                console.log('[PARSE] Contenu qui a échoué:', cleanContent.substring(0, 200));
            }
        } else {
            console.log('[PARSE] Contenu ne commence pas par [ ou {');
            console.log('[PARSE] Premier caractère:', cleanContent.charAt(0));
            console.log('[PARSE] Premiers 200 caractères:', cleanContent.substring(0, 200));
            
            // Vérifier si c'est une réponse non-structurée avec phrase d'introduction
            if (cleanContent.includes('voici') || cleanContent.includes('Voici') || 
                cleanContent.includes('Bien sûr') || cleanContent.includes('bien sûr')) {
                console.log('[PARSE] Réponse non-structurée détectée avec phrase d\'introduction');
                
                // Essayer de convertir en format structuré selon le type de section
                if (sectionKey === 'useCases') {
                    console.log('[PARSE] Tentative de conversion en cas d\'utilisation structurés');
                    const convertedContent = convertUnstructuredToUseCases(cleanContent);
                    if (convertedContent && convertedContent.length > 0) {
                        console.log('[PARSE] Conversion réussie:', convertedContent);
                        return convertedContent;
                    }
                }
            }
            
            // Essayer de trouver du JSON dans le contenu
            const jsonMatch = cleanContent.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                console.log('[PARSE] JSON trouvé dans le contenu:', jsonMatch[0].substring(0, 200));
                try {
                    const parsed = JSON.parse(jsonMatch[0]);
                    console.log('[PARSE] JSON extrait et parsé avec succès:', parsed);
                    
                    // Si c'est un array d'objets avec headline/description, le retourner directement
                    if (Array.isArray(parsed) && parsed.length > 0 && (parsed[0].headline || parsed[0].title)) {
                        console.log('[PARSE] Array d\'objets avec headline/title détecté dans le JSON extrait');
                        console.log('[PARSE] Premier objet:', parsed[0]);
                        return parsed;
                    }
                    
                    // Si c'est un array de strings (comme pour les titres), le retourner directement
                    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
                        console.log('[PARSE] Array de strings détecté dans le JSON extrait');
                        console.log('[PARSE] Premier élément:', parsed[0]);
                        return parsed;
                    }
                    
                    return parsed;
                } catch (e) {
                    console.log('[PARSE] Erreur lors du parsing du JSON extrait:', e.message);
                }
            }
        }
        
        // Parsing manuel selon le type de section
        let result;
        switch (sectionKey) {
            case 'productTitle':
                result = parseProductTitles(cleanContent);
                break;
            case 'productBenefits':
            case 'emotionalBenefits':
            case 'characteristics':
            case 'competitiveAdvantages':
            case 'useCases':
                result = parseListItems(cleanContent);
                break;
            case 'howItWorks':
                result = parseHowItWorks(cleanContent);
                break;
            case 'customerReviews':
                result = parseCustomerReviews(cleanContent);
                break;
            case 'faq':
                result = parseFAQ(cleanContent);
                break;
            default:
                // Affichage générique avec sélecteurs
                if (window.formatTextWithVersionSelector) {
                    result = parseGenericContent(cleanContent);
                } else {
                    result = cleanContent;
                }
        }
        
        console.log('[PARSE] Résultat du parsing pour', sectionKey, ':', result);
        return result;
        
    } catch (error) {
        console.error('[PARSE] Erreur de parsing:', error);
        return parseGenericContent(content);
    }
}

/**
 * Parse les titres de produit
 */
function parseProductTitles(content) {
    const lines = content.split('\n').filter(line => line.trim());
    const titles = [];
    
    for (const line of lines) {
        const cleanLine = line.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '').trim();
        if (cleanLine && cleanLine.length >= 4) {
            titles.push(cleanLine);
        }
    }
    
    return titles.slice(0, 5); // Limiter à 5 titres
}

/**
 * Parse les éléments de liste (bénéfices, caractéristiques, etc.)
 */
function parseListItems(content) {
    console.log('[PARSE-LIST] parseListItems appelé avec:', content.substring(0, 200) + (content.length > 200 ? '...' : ''));
    
    const lines = content.split('\n').filter(line => line.trim());
    console.log('[PARSE-LIST] Lignes après split et filter:', lines);
    
    const items = [];
    
    let currentItem = null;
    
    for (const line of lines) {
        const cleanLine = line.trim();
        console.log('[PARSE-LIST] Traitement de la ligne:', cleanLine);
        
        if (!cleanLine) continue;
        
        // Détecter un nouveau titre/headline
        const isBulletPoint = cleanLine.match(/^[-*•]\s*/);
        const isNumbered = cleanLine.match(/^\d+\.\s*/);
        console.log('[PARSE-LIST] isBulletPoint:', isBulletPoint, 'isNumbered:', isNumbered);
        
        if (isBulletPoint || isNumbered) {
            if (currentItem) {
                console.log('[PARSE-LIST] Ajout de l\'item précédent:', currentItem);
                items.push(currentItem);
            }
            currentItem = {
                headline: cleanLine.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '').trim(),
                description: ''
            };
            console.log('[PARSE-LIST] Nouvel item créé:', currentItem);
        } else if (currentItem) {
            // Ajouter à la description
            currentItem.description += (currentItem.description ? ' ' : '') + cleanLine;
            console.log('[PARSE-LIST] Description mise à jour:', currentItem.description);
        } else {
            console.log('[PARSE-LIST] Ligne ignorée (pas de currentItem):', cleanLine);
        }
    }
    
    if (currentItem) {
        console.log('[PARSE-LIST] Ajout du dernier item:', currentItem);
        items.push(currentItem);
    }
    
    console.log('[PARSE-LIST] Items finaux:', items);
    return items;
}

/**
 * Parse le contenu "Comment ça marche"
 */
function parseHowItWorks(content) {
    console.log('[PARSE] parseHowItWorks - content reçu:', content);
    console.log('[PARSE] parseHowItWorks - type:', typeof content);
    
    // Si c'est déjà un array d'objets, le retourner tel quel
    if (Array.isArray(content)) {
        console.log('[PARSE] parseHowItWorks - format array détecté');
        return content;
    }
    
    // Essayer de parser comme JSON d'abord
    if (typeof content === 'string') {
        try {
            // Chercher du JSON dans le contenu
            const jsonMatch = content.match(/\[[\s\S]*\]/) || content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                console.log('[PARSE] parseHowItWorks - JSON détecté, tentative de parsing...');
                const parsed = JSON.parse(jsonMatch[0]);
                console.log('[PARSE] parseHowItWorks - JSON parsé avec succès:', parsed);
                
                if (Array.isArray(parsed)) {
                    // Vérifier si c'est un array d'étapes valides
                    const isValidSteps = parsed.every(item => 
                        item && typeof item === 'object' && 
                        (item.step || item.title || item.description)
                    );
                    
                    if (isValidSteps) {
                        console.log('[PARSE] parseHowItWorks - étapes JSON valides détectées');
                        return parsed;
                    }
                }
            }
        } catch (e) {
            console.log('[PARSE] parseHowItWorks - échec parsing JSON:', e.message);
        }
        
        // Si c'est juste du texte (paragraphe), on le retourne tel quel
        if (!content.includes('\n-') && !content.includes('\n•') && !content.includes('\n1.')) {
            console.log('[PARSE] parseHowItWorks - format paragraphe détecté');
            return content.trim();
        }
    }
    
    // Sinon, on parse comme une liste d'étapes
    console.log('[PARSE] parseHowItWorks - format liste détecté');
    const items = parseListItems(content);
    return items.map((item, index) => ({
        step: index + 1,
        title: item.headline,
        description: item.description
    }));
}

/**
 * Parse les avis clients
 */
function parseCustomerReviews(content) {
    const lines = content.split('\n').filter(line => line.trim());
    const reviews = [];
    
    let currentReview = null;
    
    for (const line of lines) {
        const cleanLine = line.trim();
        if (!cleanLine) continue;
        
        // Détecter un nom (commence par une majuscule, court)
        if (cleanLine.match(/^([A-Z][a-z]+(\s[A-Z]\.?)?:?)/)) {
            if (currentReview) {
                reviews.push(currentReview);
            }
            currentReview = {
                name: cleanLine.replace(':', ''),
                review: '',
                rating: 5
            };
        } else if (currentReview) {
            // Ajouter à la description
            currentReview.review += (currentReview.review ? ' ' : '') + cleanLine;
        }
    }
    
    if (currentReview) {
        reviews.push(currentReview);
    }
    
    return reviews;
}

/**
 * Parse la FAQ
 */
function parseFAQ(content) {
    const lines = content.split('\n').filter(line => line.trim());
    const faqItems = [];
    
    let currentFAQ = null;
    let isAnswer = false;
    
    for (const line of lines) {
        const cleanLine = line.trim();
        if (!cleanLine) continue;
        
        // Détecter une question (contient un ?)
        if (cleanLine.includes('?')) {
            if (currentFAQ) {
                faqItems.push(currentFAQ);
            }
            currentFAQ = {
                question: cleanLine.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '').trim(),
                answer: ''
            };
            isAnswer = false;
        } else if (currentFAQ && !isAnswer) {
            // Première ligne après la question = début de la réponse
            currentFAQ.answer = cleanLine;
            isAnswer = true;
        } else if (currentFAQ && isAnswer) {
            // Continuer la réponse
            currentFAQ.answer += ' ' + cleanLine;
        }
    }
    
    if (currentFAQ) {
        faqItems.push(currentFAQ);
    }
    
    return faqItems;
}

/**
 * Parse générique pour les contenus non structurés
 */
function parseGenericContent(content) {
    return content.split('\n').filter(line => line.trim()).map(line => line.trim());
}

/**
 * Nettoie le contenu généré pour enlever les textes d'introduction parasites
 */
function cleanContent(content) {
    if (typeof content !== 'string') {
        return content;
    }
    
    let cleaned = content.trim();
    
    // Supprimer les textes d'introduction parasites spécifiques
    const parasitePatterns = [
        /^.*?(?=\[|\{)/s, // Tout avant un [ ou {
        /^(Bien sûr,?\s*)?voici\s+\d+\s+cas\s+d'utilisation.*?:/i,
        /^(Bien sûr,?\s*)?voici\s+\d+\s+bénéfices.*?:/i,
        /^(Bien sûr,?\s*)?voici\s+\d+\s+caractéristiques.*?:/i,
        /^(Bien sûr,?\s*)?voici\s+\d+\s+avantages.*?:/i,
        /^(Bien sûr,?\s*)?voici\s+\d+\s+titres.*?:/i,
        /^(Bien sûr,?\s*)?voici\s+\d+.*?pour.*?:/i,
        /^.*?pour\s+(la\s+page\s+produit|votre\s+produit).*?:/i
    ];
    
    for (const pattern of parasitePatterns) {
        cleaned = cleaned.replace(pattern, '').trim();
    }
    
    return cleaned;
}

/**
 * Nettoie un tableau de contenu généré pour enlever les textes d'introduction parasites
 */
function cleanContentArray(content, sectionKey) {
    if (Array.isArray(content)) {
        return content.map((item, index) => {
            if (typeof item === 'object' && item !== null) {
                // Nettoyer les objets avec headline (bénéfices émotionnels, etc.)
                if (item.headline) {
                    item.headline = cleanContent(item.headline);
                }
                if (item.description) {
                    item.description = cleanContent(item.description);
                }
                
                // Nettoyer les objets avec title (cas d'utilisation, etc.)
                if (item.title) {
                    const originalTitle = item.title;
                    item.title = cleanContent(item.title);
                    
                    // Si le titre nettoyé est vide ou très court, c'était probablement du texte parasite
                    if (!item.title || item.title.length < 10) {
                        console.log(`[CLEAN] Élément ${index} supprimé - titre parasite détecté:`, originalTitle);
                        return null; // Marquer pour suppression
                    }
                }
                
                // Nettoyer d'autres propriétés communes
                if (item.explanation) {
                    item.explanation = cleanContent(item.explanation);
                }
                if (item.benefit) {
                    item.benefit = cleanContent(item.benefit);
                }
            } else if (typeof item === 'string') {
                const cleaned = cleanContent(item);
                // Si le contenu nettoyé est vide ou très court, c'était probablement du texte parasite
                if (!cleaned || cleaned.length < 10) {
                    console.log(`[CLEAN] Élément ${index} supprimé - contenu parasite détecté:`, item);
                    return null; // Marquer pour suppression
                }
                return cleaned;
            }
            return item;
        }).filter(item => item !== null); // Supprimer les éléments marqués comme null
    } else if (typeof content === 'object' && content !== null) {
        // Nettoyer un objet unique
        if (content.headline) {
            content.headline = cleanContent(content.headline);
        }
        if (content.description) {
            content.description = cleanContent(content.description);
        }
        if (content.title) {
            content.title = cleanContent(content.title);
        }
        if (content.explanation) {
            content.explanation = cleanContent(content.explanation);
        }
        return content;
    } else {
        return cleanContent(content);
    }
}

/**
 * Ajoute le nouveau contenu à la section existante
 */
async function appendContentToSection(sectionKey, newContent) {
    console.log('[APPEND] Ajout de contenu à la section:', sectionKey);
    
    // Nettoyer le nouveau contenu avant de l'ajouter
    const cleanedNewContent = cleanContentArray(newContent, sectionKey);
    console.log('[APPEND] Contenu nettoyé:', cleanedNewContent);
    
    // Récupérer le contenu existant depuis le système de génération principal
    let existingContent = [];
    
    // Le système principal utilise une structure avec version1, version2, etc.
    if (window.generatedContent && window.generatedContent[sectionKey]) {
        const sectionData = window.generatedContent[sectionKey];
        
        // Si c'est déjà un array, l'utiliser directement
        if (Array.isArray(sectionData)) {
            existingContent = cleanContentArray(sectionData, sectionKey);
        } 
        // Si c'est un objet avec des versions, récupérer version1
        else if (sectionData.version1) {
            const rawContent = Array.isArray(sectionData.version1) ? sectionData.version1 : [sectionData.version1];
            existingContent = cleanContentArray(rawContent, sectionKey);
        }
        // Si c'est un objet, convertir en array
        else if (typeof sectionData === 'object') {
            existingContent = cleanContentArray(Object.values(sectionData), sectionKey);
        }
        // Si c'est une string, la mettre dans un array
        else if (typeof sectionData === 'string') {
            existingContent = cleanContentArray([sectionData], sectionKey);
        }
    } else {
        // Fallback : essayer depuis localStorage
        const storedContent = JSON.parse(localStorage.getItem('generatedContent') || '{}');
        if (storedContent[sectionKey]) {
            if (Array.isArray(storedContent[sectionKey])) {
                existingContent = cleanContentArray(storedContent[sectionKey], sectionKey);
            } else if (storedContent[sectionKey].version1) {
                const rawContent = Array.isArray(storedContent[sectionKey].version1) 
                    ? storedContent[sectionKey].version1 
                    : [storedContent[sectionKey].version1];
                existingContent = cleanContentArray(rawContent, sectionKey);
            }
        }
    }
    
    console.log('[APPEND] Contenu existant trouvé:', existingContent);
    
    // Combiner l'ancien et le nouveau contenu
    let combinedContent;
    if (Array.isArray(cleanedNewContent)) {
        combinedContent = existingContent.concat(cleanedNewContent);
    } else {
        combinedContent = existingContent.concat([cleanedNewContent]);
    }
    
    console.log('[APPEND] Contenu combiné:', combinedContent);
    
    // Mettre à jour les variables globales avec la structure appropriée
    if (!window.generatedContent) {
        window.generatedContent = {};
    }
    
    // Déterminer comment stocker selon la section
    if (sectionKey === 'productTitle') {
        // Les titres sont stockés comme un array simple
        window.generatedContent[sectionKey] = combinedContent;
    } else {
        // Les autres sections utilisent la structure existante
        if (!window.generatedContent[sectionKey]) {
            window.generatedContent[sectionKey] = {};
        }
        window.generatedContent[sectionKey].version1 = combinedContent;
    }
    
    console.log('[APPEND] Contenu stocké dans:', sectionKey);
    console.log('[APPEND] Contenu:', window.generatedContent[sectionKey]);
    console.log('[APPEND] État final de la section:', window.generatedContent[sectionKey]);
    console.log('[APPEND] Toutes les versions maintenant:', Object.keys(window.generatedContent[sectionKey]));
    
    // Mettre à jour les variables globales spécifiques
    if (sectionKey === 'productBenefits') {
        window.allProductBenefits = combinedContent;
        console.log('[APPEND] window.allProductBenefits mis à jour:', window.allProductBenefits.length, 'éléments');
    } else if (sectionKey === 'emotionalBenefits') {
        window.allEmotionalBenefits = combinedContent;
        console.log('[APPEND] window.allEmotionalBenefits mis à jour:', window.allEmotionalBenefits.length, 'éléments');
    }
    
    // Sauvegarder dans localStorage
    const allContent = JSON.parse(localStorage.getItem('generatedContent') || '{}');
    allContent[sectionKey] = window.generatedContent[sectionKey];
    localStorage.setItem('generatedContent', JSON.stringify(allContent));
    console.log('[APPEND] Sauvegardé dans localStorage');
    
    // Mettre à jour l'affichage avec le contenu combiné
    let displayContent;
    
    if (sectionKey === 'productTitle') {
        // Pour les titres, le contenu est stocké directement comme un array
        displayContent = {
            version1: combinedContent
        };
    } else {
        // Pour les autres sections, utiliser la structure existante
        displayContent = {
            version1: window.generatedContent[sectionKey].version1 || combinedContent,
            version2: window.generatedContent[sectionKey].version2 || null,
            version3: window.generatedContent[sectionKey].version3 || null,
            version4: window.generatedContent[sectionKey].version4 || null,
            version5: window.generatedContent[sectionKey].version5 || null
        };
    }
    
    // Nettoyer les versions null
    Object.keys(displayContent).forEach(key => {
        if (displayContent[key] === null) {
            delete displayContent[key];
        }
    });
    
    console.log('[APPEND] displayContent préparé:', displayContent);
    console.log('[APPEND] Versions à afficher:', Object.keys(displayContent));
    
    await updateSectionDisplay(sectionKey, displayContent);
    
    console.log('[APPEND] Contenu ajouté et affiché avec succès');
}

/**
 * Met à jour l'affichage d'une section
 */
async function updateSectionDisplay(sectionKey, content) {
    console.log('[DISPLAY] Mise à jour de l\'affichage pour:', sectionKey);
    
    // Utiliser les formatters existants pour afficher le contenu
    const targetElement = document.getElementById(sectionKey);
    if (!targetElement) {
        console.error('[DISPLAY] Élément cible non trouvé:', sectionKey);
        return;
    }
    
    // Appeler le formatter approprié avec sélecteurs selon la section
    switch (sectionKey) {
        case 'productTitle':
            if (window.formatProductTitleWithSelectors) {
                targetElement.innerHTML = window.formatProductTitleWithSelectors(sectionKey, content);
            }
            break;
        case 'productBenefits':
            if (window.formatBenefitsWithSelectors) {
                targetElement.innerHTML = window.formatBenefitsWithSelectors(sectionKey, content);
            }
            break;
        case 'howItWorks':
            if (window.formatTextWithVersionSelector) {
                targetElement.innerHTML = window.formatTextWithVersionSelector(sectionKey, content);
            }
            break;
        case 'emotionalBenefits':
            if (window.formatEmotionalBenefitsWithSelectors) {
                targetElement.innerHTML = window.formatEmotionalBenefitsWithSelectors(sectionKey, content);
            }
            break;
        case 'useCases':
            if (window.formatUseCasesWithSelectors) {
                targetElement.innerHTML = window.formatUseCasesWithSelectors(sectionKey, content);
            }
            break;
        case 'characteristics':
            if (window.formatCharacteristicsWithSelectors) {
                targetElement.innerHTML = window.formatCharacteristicsWithSelectors(sectionKey, content);
            }
            break;
        case 'competitiveAdvantages':
            if (window.formatCompetitiveAdvantagesWithSelectors) {
                targetElement.innerHTML = window.formatCompetitiveAdvantagesWithSelectors(sectionKey, content);
            }
            break;
        case 'customerReviews':
            if (window.formatCustomerReviewsWithSelectors) {
                targetElement.innerHTML = window.formatCustomerReviewsWithSelectors(sectionKey, content);
            }
            break;
        case 'faq':
            if (window.formatFAQWithSelectors) {
                targetElement.innerHTML = window.formatFAQWithSelectors(sectionKey, content);
            }
            break;
        default:
            // Affichage générique avec sélecteurs
            if (window.formatTextWithVersionSelector) {
                targetElement.innerHTML = window.formatTextWithVersionSelector(sectionKey, content);
            } else {
                targetElement.innerHTML = Array.isArray(content) 
                    ? content.map(item => `<div class="content-item">${typeof item === 'string' ? item : JSON.stringify(item)}</div>`).join('')
                    : `<div class="content-item">${content}</div>`;
            }
    }
    
    // Réattacher les événements de sélection après la mise à jour du DOM
    setTimeout(() => {
        if (window.setupSelectors) {
            window.setupSelectors();
        }
        
        // Mettre à jour les badges si nécessaire
        switch (sectionKey) {
            case 'productBenefits':
                if (window.updateBenefitSelectionBadges) {
                    window.updateBenefitSelectionBadges();
                }
                break;
            case 'emotionalBenefits':
                if (window.updateEmotionalBenefitBadges) {
                    window.updateEmotionalBenefitBadges();
                }
                break;
            case 'customerReviews':
                if (window.updateCustomerReviewBadges) {
                    window.updateCustomerReviewBadges();
                }
                break;
            case 'faq':
                if (window.updateFAQBadges) {
                    window.updateFAQBadges();
                }
                break;
        }
    }, 100);
}

/**
 * Copie le prompt actuellement affiché
 */
window.copyCurrentPrompt = function() {
    const textarea = document.getElementById('promptEditor');
    if (!textarea) return;
    
    navigator.clipboard.writeText(textarea.value).then(() => {
        // Feedback visuel
        const copyBtn = document.querySelector('.copy-prompt-btn');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copié !';
        copyBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Erreur lors de la copie:', err);
        alert('Erreur lors de la copie du prompt');
    });
};

/**
 * Sauvegarde les modifications apportées au prompt
 */
window.savePromptChanges = function(sectionKey) {
    const textarea = document.getElementById('promptEditor');
    if (!textarea) return;
    
    // Récupérer le prompt modifié
    const modifiedPrompt = textarea.value.trim();
    
    // Mettre à jour le prompt dans PROMPTS
    PROMPTS[sectionKey].prompt = modifiedPrompt;
    
    // Sauvegarder dans le localStorage pour la persistance
    const allPrompts = JSON.parse(localStorage.getItem('prompts') || '{}');
    allPrompts[sectionKey] = PROMPTS[sectionKey];
    localStorage.setItem('prompts', JSON.stringify(allPrompts));
    
    // Feedback visuel
    const saveBtn = document.querySelector('.save-prompt-btn');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fas fa-check"></i> Sauvegardé !';
    saveBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
    
    setTimeout(() => {
        saveBtn.innerHTML = originalText;
        saveBtn.style.background = '';
    }, 2000);
};

/**
 * Ajoute une nouvelle version à la section (version2, version3, etc.)
 */
async function addNewVersionToSection(sectionKey, newContent) {
    const callId = Math.random().toString(36).substr(2, 9);
    console.log(`[NEW-VERSION-${callId}] Ajout d'une nouvelle version pour la section:`, sectionKey);
    console.log(`[NEW-VERSION-${callId}] Nouveau contenu:`, newContent);
    console.log(`[NEW-VERSION-${callId}] Stack trace:`, new Error().stack);
    
    // Initialiser window.generatedContent si nécessaire
    if (!window.generatedContent) {
        window.generatedContent = {};
    }
    
    // Initialiser la section si nécessaire
    if (!window.generatedContent[sectionKey]) {
        window.generatedContent[sectionKey] = {};
    }
    
    // Debug: afficher l'état actuel de la section
    console.log(`[NEW-VERSION-${callId}] État actuel de la section:`, window.generatedContent[sectionKey]);
    console.log(`[NEW-VERSION-${callId}] Versions existantes:`, Object.keys(window.generatedContent[sectionKey]));
    
    // Trouver le prochain numéro de version disponible
    let nextVersionNumber = 2; // Commencer à version2 (version1 est la version initiale)
    while (window.generatedContent[sectionKey][`version${nextVersionNumber}`]) {
        console.log(`[NEW-VERSION-${callId}] version${nextVersionNumber} existe déjà, passage à la suivante`);
        nextVersionNumber++;
    }
    
    const versionKey = `version${nextVersionNumber}`;
    console.log(`[NEW-VERSION-${callId}] Création de:`, versionKey);
    
    // Stocker le nouveau contenu dans la nouvelle version
    if (sectionKey === 'productTitle') {
        // Les titres sont stockés comme un array simple
        window.generatedContent[sectionKey][versionKey] = Array.isArray(newContent) ? newContent : [newContent];
    } else {
        // Les autres sections utilisent la même structure
        if (sectionKey === 'howItWorks' && Array.isArray(newContent)) {
            window.generatedContent[sectionKey][versionKey] = newContent;
        } else {
            window.generatedContent[sectionKey][versionKey] = Array.isArray(newContent) ? newContent : [newContent];
        }
        
        // Mettre à jour window.allProductBenefits si c'est la section productBenefits
        if (sectionKey === 'productBenefits') {
            window.allProductBenefits = Array.isArray(newContent) ? newContent : [newContent];
            console.log(`[NEW-VERSION-${callId}] window.allProductBenefits mis à jour:`, window.allProductBenefits.length, 'éléments');
        } else if (sectionKey === 'emotionalBenefits') {
            window.allEmotionalBenefits = Array.isArray(newContent) ? newContent : [newContent];
            console.log(`[NEW-VERSION-${callId}] window.allEmotionalBenefits mis à jour:`, window.allEmotionalBenefits.length, 'éléments');
        }
    }
    
    console.log(`[NEW-VERSION-${callId}] Contenu stocké dans:`, versionKey);
    console.log(`[NEW-VERSION-${callId}] Contenu:`, window.generatedContent[sectionKey][versionKey]);
    console.log(`[NEW-VERSION-${callId}] État final de la section:`, window.generatedContent[sectionKey]);
    console.log(`[NEW-VERSION-${callId}] Toutes les versions maintenant:`, Object.keys(window.generatedContent[sectionKey]));
    
    // Sauvegarder dans le localStorage pour la persistance
    const allContent = JSON.parse(localStorage.getItem('generatedContent') || '{}');
    allContent[sectionKey] = window.generatedContent[sectionKey];
    localStorage.setItem('generatedContent', JSON.stringify(allContent));
    console.log(`[NEW-VERSION-${callId}] Sauvegardé dans localStorage`);
    
    // Mettre à jour l'affichage avec la nouvelle version
    let displayContent = {
        version1: window.generatedContent[sectionKey].version1,
        version2: window.generatedContent[sectionKey].version2 || null,
        version3: window.generatedContent[sectionKey].version3 || null,
        version4: window.generatedContent[sectionKey].version4 || null,
        version5: window.generatedContent[sectionKey].version5 || null
    };
    
    // Nettoyer les versions null
    Object.keys(displayContent).forEach(key => {
        if (displayContent[key] === null) {
            delete displayContent[key];
        }
    });
    
    console.log(`[NEW-VERSION-${callId}] displayContent préparé:`, displayContent);
    console.log(`[NEW-VERSION-${callId}] Versions à afficher:`, Object.keys(displayContent));
    
    await updateSectionDisplay(sectionKey, displayContent);
    
    console.log(`[NEW-VERSION-${callId}] Nouvelle version ajoutée et affichée avec succès`);
    return versionKey; // Retourner le nom de la version créée
}

/**
 * Nettoyage d'urgence pour supprimer complètement les données corrompues des cas d'utilisation
 */
function emergencyCleanUseCases() {
    console.log('[EMERGENCY-CLEAN] Début du nettoyage d\'urgence des cas d\'utilisation');
    
    // Supprimer complètement les données des cas d'utilisation de la mémoire
    if (window.generatedContent && window.generatedContent.useCases) {
        console.log('[EMERGENCY-CLEAN] Suppression des useCases de window.generatedContent');
        delete window.generatedContent.useCases;
    }
    
    // Supprimer du localStorage
    const storedContent = JSON.parse(localStorage.getItem('generatedContent') || '{}');
    if (storedContent.useCases) {
        console.log('[EMERGENCY-CLEAN] Suppression des useCases du localStorage');
        delete storedContent.useCases;
        localStorage.setItem('generatedContent', JSON.stringify(storedContent));
    }
    
    // Forcer le rechargement de l'affichage des cas d'utilisation
    const useCasesSection = document.getElementById('useCases');
    if (useCasesSection) {
        console.log('[EMERGENCY-CLEAN] Vidage de l\'affichage des cas d\'utilisation');
        useCasesSection.innerHTML = '<p>Cas d\'utilisation supprimés. Cliquez sur "Regénérer" pour créer de nouveaux cas d\'utilisation propres.</p>';
    }
    
    console.log('[EMERGENCY-CLEAN] Nettoyage d\'urgence terminé');
    alert('Données corrompues supprimées. Cliquez sur "Regénérer" dans la section Cas d\'Utilisation pour générer de nouveaux contenus propres.');
}

// Exposer la fonction d'urgence globalement pour pouvoir l'appeler manuellement
window.emergencyCleanUseCases = emergencyCleanUseCases;

/**
 * Nettoyage des versions incorrectes d'une section
 */
window.cleanIncorrectVersions = function(sectionKey) {
    console.log('[CLEAN] Nettoyage des versions incorrectes pour:', sectionKey);
    
    if (!window.generatedContent || !window.generatedContent[sectionKey]) {
        console.log('[CLEAN] Aucun contenu à nettoyer');
        return;
    }
    
    const section = window.generatedContent[sectionKey];
    const versionsToKeep = ['version1', 'version2'];
    
    // Supprimer toutes les versions après version2
    Object.keys(section).forEach(versionKey => {
        if (!versionsToKeep.includes(versionKey)) {
            console.log('[CLEAN] Suppression de:', versionKey);
            delete section[versionKey];
        }
    });
    
    // Sauvegarder dans localStorage
    const storedContent = JSON.parse(localStorage.getItem('generatedContent') || '{}');
    storedContent[sectionKey] = section;
    localStorage.setItem('generatedContent', JSON.stringify(storedContent));
    console.log('[CLEAN] Versions nettoyées, versions restantes:', Object.keys(section));
    
    // Mettre à jour l'affichage
    updateSectionDisplay(sectionKey, section);
};

/**
 * Charge les prompts sauvegardés depuis localStorage
 */
function loadSavedPrompts() {
    const savedPrompts = JSON.parse(localStorage.getItem('prompts') || '{}');
    if (Object.keys(savedPrompts).length > 0) {
        console.log('[PROMPT-EDITOR] Prompts sauvegardés trouvés, chargement...');
        Object.keys(savedPrompts).forEach((sectionKey) => {
            if (PROMPTS[sectionKey]) {
                PROMPTS[sectionKey].prompt = savedPrompts[sectionKey].prompt;
            }
        });
    }
}

/**
 * Réinitialise tous les prompts aux valeurs par défaut
 */
window.resetPromptsToDefault = function() {
    console.log('[PROMPT-EDITOR] Réinitialisation des prompts aux valeurs par défaut...');
    
    // Supprimer les prompts sauvegardés du localStorage
    localStorage.removeItem('prompts');
    
    // Restaurer les prompts par défaut
    Object.keys(DEFAULT_PROMPTS).forEach((sectionKey) => {
        if (PROMPTS[sectionKey]) {
            PROMPTS[sectionKey].prompt = DEFAULT_PROMPTS[sectionKey].prompt;
            console.log(`[PROMPT-EDITOR] Prompt ${sectionKey} réinitialisé`);
        }
    });
    
    console.log('[PROMPT-EDITOR] Tous les prompts ont été réinitialisés aux valeurs par défaut');
    alert('Tous les prompts ont été réinitialisés aux valeurs par défaut');
}

/**
 * Fonction pour tester la génération directement
 */
window.testGeneration = async (sectionKey) => {
    console.log('[TEST-GENERATION] Test de génération pour:', sectionKey);
    
    try {
        // Utiliser un prompt simple pour tester
        const testPrompt = `Génère 3 titres de produit pour: Heating Pads. 
        Format: 
        1. Titre 1
        2. Titre 2  
        3. Titre 3`;
        
        console.log('[TEST-GENERATION] Envoi du prompt de test...');
        
        const response = await fetch('http://localhost:3000/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                temperature: 0.7,
                max_tokens: 500,
                messages: [
                    {
                        role: 'user',
                        content: testPrompt
                    }
                ]
            })
        });

        console.log('[TEST-GENERATION] Réponse reçue, status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const generatedContent = data.choices?.[0]?.message?.content || data.content || data.response || data;
        console.log('[TEST-GENERATION] Contenu généré:', generatedContent);
        
        // Afficher le résultat dans la console
        alert(`Test réussi ! Contenu généré:\n${generatedContent.substring(0, 200)}...`);
        
        return generatedContent;
        
    } catch (error) {
        console.error('[TEST-GENERATION] Erreur:', error);
        alert(`Erreur lors du test: ${error.message}`);
    }
};

/**
 * Trouver le bouton de regénération pour afficher l'état de chargement
 */
let regenerateBtn = null;
try {
    // Éviter d'utiliser le contenu du prompt dans le sélecteur - chercher juste par sectionKey
    regenerateBtn = document.querySelector(`[onclick*="regenerateContent('${sectionKey}')"]`);
} catch (e) {
    console.log('[REGENERATE-1] Erreur de sélecteur, recherche alternative...');
    // Fallback : chercher tous les boutons de regénération et trouver le bon
    const allButtons = document.querySelectorAll('[onclick*="regenerateContent"]');
    regenerateBtn = Array.from(allButtons).find(btn => btn.onclick && btn.onclick.toString().includes(sectionKey));
}

// Modification de la ligne problématique du sélecteur CSS
regenerateBtn = null;
try {
    regenerateBtn = document.querySelector(`[onclick*="regenerateContentWithOptions('${sectionKey}', {includeProductName: true, includeDeepResearch: true, includeMarketingAngle: false, includeCustomerAvatar: false})"]`);
} catch (e) {
    console.log('[REGENERATE-1] Erreur de sélecteur, recherche alternative...');
    regenerateBtn = null; // Pas grave si on ne trouve pas le bouton
}

/**
 * Met à jour le prompt en fonction des options sélectionnées
 */
function updatePromptWithOptions(sectionKey) {
    const textarea = document.getElementById('promptEditor');
    if (!textarea) return;
    
    const includeProductName = document.getElementById('includeProductName')?.checked || false;
    const includeDeepResearch = document.getElementById('includeDeepResearch')?.checked || false;
    const includeMarketingAngle = document.getElementById('includeMarketingAngle')?.checked || false;
    const includeCustomerAvatar = document.getElementById('includeCustomerAvatar')?.checked || false;
    
    const promptData = PROMPTS[sectionKey];
    if (!promptData) return;
    
    // Récupérer les données actuelles du formulaire
    const productName = document.getElementById('productName')?.value?.trim() || 'Nom du produit';
    const productDescription = document.getElementById('deepResearch')?.value?.trim() || 'Description du produit';
    
    // Récupérer l'angle marketing sélectionné
    let marketingAngle = 'Angle marketing non sélectionné';
    const selectedAngleElement = document.querySelector('.marketing-angle.selected');
    if (selectedAngleElement) {
        const angleTitle = selectedAngleElement.querySelector('.angle-title')?.textContent;
        const angleDescription = selectedAngleElement.querySelector('.angle-description')?.textContent;
        marketingAngle = `${angleTitle}: ${angleDescription}`;
    }
    
    // Récupérer l'avatar client sélectionné
    let customerAvatar = 'Avatar client non sélectionné';
    const selectedAvatarElement = document.querySelector('.avatar-card.selected');
    if (selectedAvatarElement) {
        const avatarName = selectedAvatarElement.querySelector('.avatar-name')?.textContent;
        const avatarAge = selectedAvatarElement.querySelector('.avatar-age')?.textContent;
        const avatarGender = selectedAvatarElement.querySelector('.avatar-gender')?.textContent;
        const avatarSituation = selectedAvatarElement.querySelector('.avatar-situation')?.textContent;
        const avatarFears = selectedAvatarElement.querySelector('.avatar-fears')?.textContent;
        const avatarExpectations = selectedAvatarElement.querySelector('.avatar-expectations')?.textContent;
        
        customerAvatar = `${avatarName} (${avatarAge}, ${avatarGender})
Situation familiale: ${avatarSituation}
Peurs: ${avatarFears}
Attentes du produit: ${avatarExpectations}`;
    }
    
    // Construire le prompt de base
    let customPrompt = promptData.prompt;
    
    // Construire les sections contextuelles à ajouter au début du prompt
    let contextSections = [];
    
    if (includeProductName) {
        contextSections.push(`**Produit :** ${productName}`);
    }
    
    if (includeDeepResearch) {
        contextSections.push(`**Description :** ${productDescription}`);
    }
    
    if (includeMarketingAngle) {
        contextSections.push(`**Angle marketing :** ${marketingAngle}`);
    }
    
    if (includeCustomerAvatar) {
        contextSections.push(`**Avatar client :** ${customerAvatar}`);
    }
    
    // Si des sections contextuelles sont sélectionnées, les ajouter au début du prompt
    if (contextSections.length > 0) {
        const contextBlock = contextSections.join('\n\n') + '\n\n---\n\n';
        customPrompt = contextBlock + customPrompt;
    }
    
    // Remplacer les placeholders restants dans le prompt
    customPrompt = customPrompt
        .replace(/{productName}/g, includeProductName ? productName : '[Nom du produit]')
        .replace(/{productDescription}/g, includeDeepResearch ? productDescription : '[Description du produit]')
        .replace(/{marketingAngle}/g, includeMarketingAngle ? marketingAngle : '[Angle marketing]')
        .replace(/{customerAvatar}/g, includeCustomerAvatar ? customerAvatar : '[Avatar client]');
    
    textarea.value = customPrompt;
    
    console.log('[PROMPT-UPDATE] Prompt mis à jour avec les options:', {
        includeProductName,
        includeDeepResearch,
        includeMarketingAngle,
        includeCustomerAvatar,
        contextSectionsCount: contextSections.length
    });
}

/**
 * Convertit un contenu non structuré en cas d'utilisation structurés
 */
function convertUnstructuredToUseCases(content) {
    const lines = content.split('\n').filter(line => line.trim());
    const useCases = [];
    
    let currentUseCase = null;
    
    for (const line of lines) {
        const cleanLine = line.trim();
        if (!cleanLine) continue;
        
        // Détecter un nouveau titre
        if (cleanLine.match(/^[-*•]\s*/)) {
            if (currentUseCase) {
                useCases.push(currentUseCase);
            }
            currentUseCase = {
                title: cleanLine.replace(/^[-*•]\s*/, '').trim(),
                description: ''
            };
        } else if (currentUseCase) {
            // Ajouter à la description
            currentUseCase.description += (currentUseCase.description ? ' ' : '') + cleanLine;
        }
    }
    
    if (currentUseCase) {
        useCases.push(currentUseCase);
    }
    
    return useCases;
}

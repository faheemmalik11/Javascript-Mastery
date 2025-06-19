/**
 * Script pour corriger les marges de la section avatar
 * Ce script s'exécute au chargement de la page et utilise MutationObserver
 * pour détecter quand l'élément avatarProfileSection est ajouté au DOM
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('[Fix Avatar Margin] Script de correction de marges chargé');
    
    let isFixed = false;
    
    // Fonction pour corriger les marges
    function fixAvatarMargin() {
        const avatarSection = document.getElementById('avatarProfileSection');
        if (avatarSection && !isFixed) {
            console.log('[Fix Avatar Margin] Suppression des marges supérieure et inférieure de la section avatar');
            avatarSection.style.marginBottom = '0px';
            avatarSection.style.marginTop = '0px';
            isFixed = true;
            observer.disconnect(); // Arrêter l'observation une fois la correction appliquée
        }
    }
    
    // Exécuter immédiatement au cas où l'élément existe déjà
    fixAvatarMargin();
    
    // Observer les changements du DOM pour détecter quand l'élément est ajouté
    const observer = new MutationObserver(function(mutations) {
        if (isFixed) return; // Éviter les traitements inutiles
        
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE && 
                        (node.id === 'avatarProfileSection' || 
                         node.querySelector && node.querySelector('#avatarProfileSection'))) {
                        fixAvatarMargin();
                    }
                });
            }
        });
    });
    
    // Observer seulement si la correction n'est pas encore appliquée
    if (!isFixed) {
        observer.observe(document.body, { 
            childList: true, 
            subtree: true 
        });
    }
    
    // S'assurer que la correction est appliquée même après le chargement complet
    window.addEventListener('load', fixAvatarMargin);
});

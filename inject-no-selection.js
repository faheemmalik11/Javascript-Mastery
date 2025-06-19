// Script pour supprimer la sélection grise
(function() {
    // Créer un élément style
    const style = document.createElement('style');
    style.type = 'text/css';
    
    // CSS pour supprimer la sélection grise
    const css = `
        /* Supprime la sélection grise sur toute la page */
        ::selection {
            background: transparent !important;
        }
        
        ::-moz-selection {
            background: transparent !important;
        }
        
        /* Supprime spécifiquement la sélection grise des modales Okendo */
        .okeReviews[data-oke-container] .oke-modal ::-moz-selection,
        div.okeReviews .oke-modal ::-moz-selection {
            background: transparent !important;
        }
        
        .okeReviews[data-oke-container] .oke-modal ::selection,
        div.okeReviews .oke-modal ::selection {
            background: transparent !important;
        }
        
        /* Supprime la sélection grise pour tous les éléments Okendo */
        .okeReviews[data-oke-container] ::-moz-selection,
        div.okeReviews ::-moz-selection {
            background: transparent !important;
        }
        
        .okeReviews[data-oke-container] ::selection,
        div.okeReviews ::selection {
            background: transparent !important;
        }
    `;
    
    // Ajouter le CSS à l'élément style
    if (style.styleSheet) {
        style.styleSheet.cssText = css; // IE
    } else {
        style.appendChild(document.createTextNode(css));
    }
    
    // Ajouter l'élément style au head
    document.head.appendChild(style);
})();

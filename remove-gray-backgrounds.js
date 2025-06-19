// Script pour supprimer tous les fonds gris
(function() {
    // Créer un élément style pour surcharger les fonds gris
    const style = document.createElement('style');
    style.type = 'text/css';
    
    // CSS pour supprimer tous les fonds gris
    const css = `
        /* Supprime les fonds gris des tags Okendo */
        .okeReviews[data-oke-container] .oke-tag,
        div.okeReviews .oke-tag {
            background-color: transparent !important;
        }
        
        /* Supprime les fonds gris des éléments avec #f4f4f6 */
        [style*="background-color: #f4f4f6"],
        [style*="background-color:#f4f4f6"],
        [style*="backgroundColor: #f4f4f6"],
        [style*="backgroundColor:#f4f4f6"] {
            background-color: transparent !important;
        }
        
        /* Supprime les fonds gris des éléments avec #F4F4F6 */
        [style*="background-color: #F4F4F6"],
        [style*="background-color:#F4F4F6"],
        [style*="backgroundColor: #F4F4F6"],
        [style*="backgroundColor:#F4F4F6"] {
            background-color: transparent !important;
        }
        
        /* Supprime la sélection grise */
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
    `;
    
    // Ajouter le CSS à l'élément style
    if (style.styleSheet) {
        style.styleSheet.cssText = css; // IE
    } else {
        style.appendChild(document.createTextNode(css));
    }
    
    // Ajouter l'élément style au head
    document.head.appendChild(style);
    
    // Fonction pour supprimer les fonds gris des éléments existants
    function removeGrayBackgrounds() {
        // Chercher tous les éléments avec un fond gris
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            const bgColor = computedStyle.backgroundColor;
            
            // Vérifier si l'élément a un fond gris (#f4f4f6)
            if (bgColor === 'rgb(244, 244, 246)' || 
                bgColor === '#f4f4f6' || 
                bgColor === '#F4F4F6') {
                element.style.backgroundColor = 'transparent';
            }
        });
    }
    
    // Exécuter immédiatement
    removeGrayBackgrounds();
    
    // Observer les changements dans le DOM pour les nouveaux éléments
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                removeGrayBackgrounds();
            }
        });
    });
    
    // Commencer à observer
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Exécuter aussi après le chargement complet
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeGrayBackgrounds);
    }
    
    window.addEventListener('load', removeGrayBackgrounds);
})();

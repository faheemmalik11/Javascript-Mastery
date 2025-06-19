// Script simple pour supprimer la couleur violette du titre
document.addEventListener("DOMContentLoaded", function() {
    console.log("🔧 Suppression de la couleur violette...");
    
    // Trouver tous les éléments avec la propriété --hightlight-color
    const elements = document.querySelectorAll('[style*="--hightlight-color"]');
    
    elements.forEach(element => {
        // Supprimer la propriété CSS personnalisée
        element.style.removeProperty('--hightlight-color');
        console.log("Supprimé --hightlight-color de:", element);
    });
    
    // Ajouter un CSS pour forcer la transparence
    const style = document.createElement('style');
    style.innerHTML = `
        .title-with-highlight {
            --hightlight-color: transparent !important;
            background: transparent !important;
        }
    `;
    document.head.appendChild(style);
    
    console.log("✅ Couleur violette supprimée!");
});

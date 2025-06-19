// Script pour copier le template-ro.json complet
document.addEventListener('DOMContentLoaded', function() {
    // Ajouter un bouton pour copier le contenu du template (visible uniquement pour le développeur)
    const devSection = document.createElement('div');
    devSection.style.position = 'fixed';
    devSection.style.bottom = '10px';
    devSection.style.right = '10px';
    devSection.style.zIndex = '9999';
    devSection.innerHTML = '<button id="copyTemplateBtn" style="padding: 5px; background: #f0f0f0;">Copy Template</button>';
    document.body.appendChild(devSection);
    
    // Gestionnaire de clic pour le bouton
    document.getElementById('copyTemplateBtn').addEventListener('click', function() {
        const templateContent = prompt("Collez ici le contenu complet du fichier template-ro.json:");
        if (templateContent) {
            // Stocker le template dans localStorage
            localStorage.setItem('template_ro_content', templateContent);
            alert('Template enregistré avec succès!');
        }
    });
});

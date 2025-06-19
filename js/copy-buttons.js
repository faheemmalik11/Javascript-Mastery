/**
 * Copy Buttons - Gère la fonctionnalité de copie du contenu
 */

document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour copier du texte dans le presse-papiers
    function copyToClipboard(text) {
        // Créer un élément textarea temporaire
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        
        // Sélectionner et copier le texte
        textarea.select();
        document.execCommand('copy');
        
        // Supprimer l'élément temporaire
        document.body.removeChild(textarea);
    }
    
    // Gérer les clics sur les boutons de copie
    document.addEventListener('click', function(event) {
        // Vérifier si l'élément cliqué est un bouton de copie
        if (event.target.classList.contains('btn-copy') || event.target.closest('.btn-copy')) {
            const button = event.target.classList.contains('btn-copy') ? event.target : event.target.closest('.btn-copy');
            const contentId = button.getAttribute('data-content');
            
            if (contentId) {
                const contentElement = document.getElementById(contentId);
                if (contentElement) {
                    // Extraire le texte sans le formatage HTML
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = contentElement.innerHTML;
                    const textContent = tempDiv.textContent || tempDiv.innerText || '';
                    
                    // Copier le texte
                    copyToClipboard(textContent);
                    
                    // Feedback visuel
                    const originalText = button.textContent;
                    button.innerHTML = '<i class="fas fa-check"></i> Copié!';
                    button.classList.add('copied');
                    
                    // Rétablir le texte original après un délai
                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.classList.remove('copied');
                    }, 2000);
                }
            }
        }
    });
    
    // Gérer le bouton de copie du template
    const copyTemplateBtn = document.getElementById('copyTemplateBtn');
    if (copyTemplateBtn) {
        copyTemplateBtn.addEventListener('click', function() {
            const templateContent = document.getElementById('templateContent');
            if (templateContent) {
                copyToClipboard(templateContent.textContent || templateContent.innerText);
                
                // Feedback visuel
                const originalText = copyTemplateBtn.innerHTML;
                copyTemplateBtn.innerHTML = '<i class="fas fa-check"></i> Copié!';
                copyTemplateBtn.classList.add('copied');
                
                // Rétablir le texte original après un délai
                setTimeout(() => {
                    copyTemplateBtn.innerHTML = originalText;
                    copyTemplateBtn.classList.remove('copied');
                }, 2000);
            }
        });
    }
});

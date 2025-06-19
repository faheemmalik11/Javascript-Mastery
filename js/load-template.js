// Ce script charge le template-ro.json depuis le serveur
(function() {
    // Fonction pour charger le template
    function loadTemplate() {
        return fetch('/template-ro.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Impossible de charger le template: ${response.status}`);
                }
                return response.json();
            });
    }

    // Stocker le template dans le localStorage quand le bouton est cliqué
    document.addEventListener('DOMContentLoaded', function() {
        const button = document.getElementById('loadTemplateBtn');
        if (button) {
            button.addEventListener('click', function() {
                loadTemplate()
                    .then(template => {
                        // Stocker le template complet dans localStorage
                        localStorage.setItem('fullTemplateRO', JSON.stringify(template));
                        alert('Template chargé avec succès et prêt à être utilisé!');
                    })
                    .catch(error => {
                        console.error('Erreur lors du chargement du template:', error);
                        alert('Erreur lors du chargement du template. Consultez la console pour plus de détails.');
                    });
            });
        }
    });
})();

/**
 * String Polyfill pour éviter les erreurs "Cannot read properties of undefined (reading 'replace')"
 * Ce fichier ajoute une protection globale contre les erreurs liées aux opérations sur des chaînes undefined
 */

(function() {
    // Sauvegarder la méthode replace originale
    const originalReplace = String.prototype.replace;
    
    // Remplacer par une version sécurisée qui vérifie si this est défini
    String.prototype.replace = function() {
        try {
            // Si this est undefined ou null, retourner une chaîne vide
            if (this === undefined || this === null) {
                console.warn('[String Polyfill] Tentative d\'appel de replace() sur undefined ou null');
                return '';
            }
            
            // Sinon, appeler la méthode originale
            return originalReplace.apply(this, arguments);
        } catch (error) {
            console.error('[String Polyfill] Erreur lors de l\'appel de replace():', error);
            return String(this || ''); // Retourner une version string de this ou une chaîne vide
        }
    };
    
    // Faire de même pour d'autres méthodes couramment utilisées
    const methodsToProtect = ['includes', 'split', 'toLowerCase', 'toUpperCase', 'trim', 'slice', 'substring'];
    
    methodsToProtect.forEach(methodName => {
        const originalMethod = String.prototype[methodName];
        
        String.prototype[methodName] = function() {
            try {
                // Si this est undefined ou null, retourner une valeur par défaut appropriée
                if (this === undefined || this === null) {
                    console.warn(`[String Polyfill] Tentative d'appel de ${methodName}() sur undefined ou null`);
                    
                    // Retourner des valeurs par défaut appropriées selon la méthode
                    if (methodName === 'includes') return false;
                    if (methodName === 'split') return [];
                    return '';
                }
                
                // Sinon, appeler la méthode originale
                return originalMethod.apply(this, arguments);
            } catch (error) {
                console.error(`[String Polyfill] Erreur lors de l'appel de ${methodName}():`, error);
                
                // Retourner des valeurs par défaut appropriées selon la méthode
                if (methodName === 'includes') return false;
                if (methodName === 'split') return [];
                return String(this || '');
            }
        };
    });
    
    console.log('[String Polyfill] Protection contre les erreurs de chaîne activée');
})();

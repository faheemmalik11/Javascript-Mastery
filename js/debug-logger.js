/**
 * Debug Logger - Système de logging pour debug
 * Sauvegarde automatiquement les logs dans un fichier texte
 */

// Tableau pour stocker tous les logs
window.debugLogs = [];

// Sauvegarder les références originales des fonctions console
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

// Fonction pour ajouter un log avec timestamp
function addDebugLog(level, message, data = null) {
    const timestamp = new Date().toISOString();
    
    // Sécuriser la sérialisation JSON pour éviter les références circulaires
    let serializedData = null;
    if (data) {
        try {
            serializedData = JSON.stringify(data, (key, value) => {
                // Éviter les références circulaires
                if (typeof value === 'object' && value !== null) {
                    if (value.constructor && value.constructor.name === 'Error') {
                        return {
                            name: value.name,
                            message: value.message,
                            stack: value.stack
                        };
                    }
                }
                return value;
            }, 2);
        } catch (e) {
            serializedData = `[Erreur de sérialisation: ${e.message}]`;
        }
    }
    
    const logEntry = {
        timestamp,
        level,
        message,
        data: serializedData
    };
    
    window.debugLogs.push(logEntry);
    
    // Aussi logger dans la console normale (mais éviter la récursion)
    const consoleMessage = `[${timestamp}] [${level}] ${message}`;
    if (data && level !== 'CONSOLE' && level !== 'CONSOLE-WARN' && level !== 'CONSOLE-ERROR') {
        originalConsoleLog(consoleMessage, data);
    } else if (level !== 'CONSOLE' && level !== 'CONSOLE-WARN' && level !== 'CONSOLE-ERROR') {
        originalConsoleLog(consoleMessage);
    }
    
    // Téléchargement automatique désactivé - uniquement via le bouton Debug Log
    // if (window.debugLogs.length % 10 === 0) {
    //     saveLogsToLocalFile();
    // }
}

// Fonction pour sauvegarder les logs dans un fichier local
async function saveLogsToLocalFile() {
    try {
        const logsText = window.debugLogs.map(log => {
            let logLine = `[${log.timestamp}] [${log.level}] ${log.message}`;
            if (log.data) {
                logLine += `\nData: ${log.data}`;
            }
            return logLine;
        }).join('\n\n');
        
        // Créer un blob avec le contenu
        const blob = new Blob([logsText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        // Créer un lien de téléchargement automatique
        const a = document.createElement('a');
        a.href = url;
        a.download = `debug-logs-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log(`[Debug Logger] ${window.debugLogs.length} logs téléchargés dans le fichier`);
    } catch (error) {
        // Fallback: sauvegarder en localStorage
        const logsText = window.debugLogs.map(log => {
            let logLine = `[${log.timestamp}] [${log.level}] ${log.message}`;
            if (log.data) {
                logLine += `\nData: ${log.data}`;
            }
            return logLine;
        }).join('\n\n');
        
        localStorage.setItem('debug-logs-' + Date.now(), logsText);
        console.log('[Debug Logger] Logs sauvegardés en localStorage (erreur téléchargement)');
    }
}

// Fonction pour sauvegarder manuellement
function saveLogs() {
    saveLogsToLocalFile();
}

// Fonction pour vider les logs
function clearLogs() {
    window.debugLogs = [];
    console.log('[Debug Logger] Logs vidés');
}

// Exposer les fonctions globalement
window.debugLog = {
    info: (message, data) => addDebugLog('INFO', message, data),
    warn: (message, data) => addDebugLog('WARN', message, data),
    error: (message, data) => addDebugLog('ERROR', message, data),
    debug: (message, data) => addDebugLog('DEBUG', message, data),
    save: saveLogs,
    clear: clearLogs
};

// Intercepter les console.log pour les capturer aussi
console.log = function(...args) {
    // Appeler la fonction originale
    originalConsoleLog.apply(console, args);
    
    // Capturer pour nos logs si c'est un log d'avatar
    const message = args.join(' ');
    if (message.includes('[Avatar') || message.includes('[Main]')) {
        addDebugLog('CONSOLE', message, args.length > 1 ? args.slice(1) : null);
    }
};

console.warn = function(...args) {
    originalConsoleWarn.apply(console, args);
    const message = args.join(' ');
    if (message.includes('[Avatar') || message.includes('[Main]')) {
        addDebugLog('CONSOLE-WARN', message, args.length > 1 ? args.slice(1) : null);
    }
};

console.error = function(...args) {
    originalConsoleError.apply(console, args);
    const message = args.join(' ');
    if (message.includes('[Avatar') || message.includes('[Main]')) {
        addDebugLog('CONSOLE-ERROR', message, args.length > 1 ? args.slice(1) : null);
    }
};

console.log('[Debug Logger] Système de logging initialisé');
console.log('[Debug Logger] Utilisez debugLog.save() pour télécharger les logs');
console.log('[Debug Logger] Utilisez debugLog.clear() pour vider les logs');

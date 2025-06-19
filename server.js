// Charger les variables d'environnement depuis le fichier .env
require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.'));

// Route pour servir les fichiers statiques
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route API pour la génération de contenu
app.post('/api/generate', async (req, res) => {
    try {
        console.log('[SERVER] Requête reçue:', {
            model: req.body.model,
            temperature: req.body.temperature,
            max_tokens: req.body.max_tokens,
            prompt_length: req.body.prompt ? req.body.prompt.length : 0
        });

        const { model, prompt, messages, temperature, max_tokens } = req.body;

        // Extraire le prompt depuis messages si ce format est utilisé
        let finalPrompt = prompt;
        if (!finalPrompt && messages && Array.isArray(messages)) {
            // Combiner les messages en un seul prompt
            finalPrompt = messages.map(msg => msg.content).join('\n\n');
        }

        if (!finalPrompt) {
            return res.status(400).json({
                error: 'Prompt manquant',
                message: 'Le prompt ou les messages sont requis pour générer du contenu'
            });
        }

        // Faire l'appel à l'API OpenAI
        const response = await callOpenAI(model, finalPrompt, temperature, max_tokens);
        
        console.log('[SERVER] Réponse OpenAI reçue:', response.substring(0, 200) + '...');

        // Retourner la réponse dans le format attendu par le frontend
        res.json({
            choices: [{
                message: {
                    content: response
                }
            }]
        });

    } catch (error) {
        console.error('[SERVER] Erreur:', error);
        res.status(500).json({
            error: 'Erreur lors de l\'appel à l\'API OpenAI',
            message: error.message
        });
    }
});

// Fonction pour appeler l'API OpenAI
async function callOpenAI(model, prompt, temperature = 0.7, maxTokens = 2500) {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    if (!OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY non configurée. Veuillez définir votre clé API OpenAI dans les variables d\'environnement.');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: model || 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'Vous êtes un expert en marketing et en développement de produits. Répondez exclusivement en français.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: temperature,
            max_tokens: maxTokens
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erreur API OpenAI: ${response.status} - ${errorData.error?.message || 'Erreur inconnue'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`[SERVER] Serveur démarré sur http://localhost:${PORT}`);
    console.log(`[SERVER] API disponible sur http://localhost:${PORT}/api/generate`);
    
    if (!process.env.OPENAI_API_KEY) {
        console.warn('[SERVER] ⚠️  ATTENTION: OPENAI_API_KEY non configurée!');
        console.warn('[SERVER] ⚠️  Définissez votre clé API OpenAI pour utiliser l\'application:');
        console.warn('[SERVER] ⚠️  export OPENAI_API_KEY="votre-clé-api-ici"');
    } else {
        console.log('[SERVER] ✅ OPENAI_API_KEY configurée');
    }
});

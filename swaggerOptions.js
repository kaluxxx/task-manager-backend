const config = require('./config');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express API avec Swagger',
            version: '1.0.0',
            description: 'Une API Express simple avec Swagger',
        },
        servers: [
            {
                url: `http://localhost:${config.port}`,
            },
        ],
    },
    apis: ['./src/routes/*.js', './src/models/*.js'], // Ajoutez le chemin vers vos fichiers de modèles ici
};

module.exports = options;
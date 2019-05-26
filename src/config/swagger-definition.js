const swaggerUi = require('swagger-ui-express');
const swagger = require('swagger-jsdoc');

const paths = require('./swagger/paths.json');
const definitions = require('./swagger/definitions.json');

var definition = {
	info: {
		title: 'VUTTR (Very Useful Tools to Remember) API',
		version: '1.0.0',
		description:
			'Uma API simples de usar que permite o gerenciamento de ferramentas úteis do seu dia-a-dia.',
	},
	swagger: '2.0',
	host: 'localhost:3000',
	basePath: '/api',
	securityDefinitions: {
		bearerAuth: {
			type: 'apiKey',
			name: 'Authorization',
			in: 'header',
		},
	},
	tags: [
		{
			name: 'Authentication',
			description: 'Serviços referentes a autenticação no sistema.',
		},
		{
			name: 'Tools',
			description: 'Serviços referentes as ferramentas.',
		},
	],
	schemes: ['http'],
	paths: paths,
	definitions: definitions,
};

var options = {
	swaggerDefinition: definition,
	apis: ['./../routes.js'],
};

const specs = swagger(options);

module.exports = app => {
	app.get('/swagger.json', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		res.send(specs);
	});
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};

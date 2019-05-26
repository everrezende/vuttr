const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');
const HttpResponseCode = require('../enums/HttpResponseCode');
const HttpRespondeErrorDto = require('../dto/HttpResponseErrorDto');

const publicRoutes = authConfig.publicRoutes;

/**
 * Retorna a URL base do path recebido como parametro
 */
function getBaseUrl(url) {
	var slashes = url.split('/').length;
	var baseEndpoint;

	if (slashes > 2) {
		var urlParts = url.split('/');
		baseEndpoint = urlParts[0] + urlParts[1];
	} else {
		baseEndpoint = url.split('?')[0];
	}
	return baseEndpoint;
}

/**
 * Verifica se uma rota é publica
 * @param {*} route objeto que deve conter o nome da rota e o metodo que sao publicos - {url : String , method : String}
 */
function isPublicRoute(route) {
	var baseEndpoint = getBaseUrl(route.url);

	return publicRoutes.some(publicRoute => {
		return (
			publicRoute.url.indexOf(baseEndpoint) >= 0 &&
			publicRoute.method === route.method
		);
	});
}

/**
 * Realiza as verificacoes JWT
 */
module.exports = (req, res, next) => {
	var route = { url: req.url, method: req.method };

	console.log(
		'Autenticando a requisicao em ' + route.url + ' via ' + route.method
	);

	if (isPublicRoute(route)) return next();

	var authHeader = req.headers.authorization;

	if (!authHeader) {
		return res
			.status(HttpResponseCode.FORBIDDEN.code)
			.json(
				new HttpRespondeErrorDto(
					HttpResponseCode.FORBIDDEN.code,
					HttpResponseCode.FORBIDDEN.name,
					'Token not found'
				)
			);
	}

	var tokenParts = authHeader.split(' ');

	if (!tokenParts.length === 2 || tokenParts[0] != 'Bearer') {
		return res
			.status(HttpResponseCode.BAD_REQUEST.code)
			.json(
				new HttpRespondeErrorDto(
					HttpResponseCode.BAD_REQUEST.code,
					HttpResponseCode.BAD_REQUEST.name,
					'Invalid authorization format'
				)
			);
	}

	jwt.verify(tokenParts[1], authConfig.secret, (err, decoded) => {
		if (err) {
			return res
				.status(HttpResponseCode.FORBIDDEN.code)
				.json(
					new HttpRespondeErrorDto(
						HttpResponseCode.FORBIDDEN.code,
						HttpResponseCode.FORBIDDEN.name,
						'Invalid token'
					)
				);
		} else {
			req.userId = decoded.userId;
			return next();
		}
	});
};

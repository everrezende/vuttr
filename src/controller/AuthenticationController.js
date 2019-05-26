const HttpResponseCode = require('../enums/HttpResponseCode');
const HttpRespondeErrorDto = require('../dto/HttpResponseErrorDto');
const jwt = require('jsonwebtoken');
const userSystemDao = require('../model/UserSystem');
const authConfig = require('../config/auth.json');

/**
 * Classe responsavel pelos controles de autenticacao
 */
class AuthenticationController {
	async authenticate(req, res) {
		var { secretId, secretKey } = req.query;

		console.log(`Autenticando usuario ID ${secretId} - Key: ${secretKey}`);

		var user = await userSystemDao.findOne({ secretId, secretKey });

		if (!user) {
			return res
				.status(HttpResponseCode.BAD_REQUEST.code)
				.json(
					new HttpRespondeErrorDto(
						HttpResponseCode.BAD_REQUEST.code,
						HttpResponseCode.BAD_REQUEST.name,
						'User not found'
					)
				);
		}

		var token = jwt.sign({ id: user._id }, authConfig.secret, {
			expiresIn: 86400,
		});

		return res
			.status(HttpResponseCode.OK.code)
			.json({ userId: user._id, token });
	}
}

module.exports = new AuthenticationController();

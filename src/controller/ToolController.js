const HttpResponseCode = require('../enums/HttpResponseCode');
const HttpRespondeErrorDto = require('../dto/HttpResponseErrorDto');
const toolDao = require('../model/Tool');

const resultsPerPage = 2;

/**
 * Classe responsavel pelos endpoints de /tools
 */
class ToolController {
	/**
	 * Retorna todas as ferramentas (pode-se incluir um filtro por tag enviando o atributo req.query.tag e pagina adicionando req.query.page)
	 */
	async getTools(req, res) {
		var where = {};
		if (!!req.query.tag) {
			where = { tags: req.query.tag };
		}

		var page = 0;
		var pages;
		var recordsSize = await toolDao.countDocuments(where);

		if (!!req.query.page) {
			page = resultsPerPage * (req.query.page - 1);
			pages = Math.trunc(recordsSize / resultsPerPage);
		}

		try {
			var tools = await toolDao
				.find(where)
				.limit(!!req.query.page ? resultsPerPage : recordsSize)
				.skip(page)
				.sort({ created_At: 'descending' })
				.select('-__v');

			return res.status(HttpResponseCode.OK.code).send({
				tools,
				currentPage: req.query.page,
				pages,
			});
		} catch (err) {
			console.log('Erro ao pesquisar todas as ferramentas: ' + err);
			return res
				.status(HttpResponseCode.INTERNAL_SERVER_ERROR.code)
				.json(
					new HttpRespondeErrorDto(
						HttpResponseCode.INTERNAL_SERVER_ERROR.code,
						HttpResponseCode.INTERNAL_SERVER_ERROR.name,
						'Database error, try again later.'
					)
				);
		}
	}

	/**
	 * Busca por uma ferramenta especifica
	 */
	async getToolById(req, res) {
		var { _id } = req.params;
		console.log('Pesquisando pela ferramenta ' + _id);
		try {
			var tool = await toolDao.findById({ _id }).select('-__v');
			if (!tool) {
				return res.status(HttpResponseCode.NO_CONTENT.code).json({});
			} else {
				return res.json(tool);
			}
		} catch (err) {
			console.log(`Nenhuma ferramenta de ID ${_id}`);
			if (err.name === 'CastError') {
				return res.status(HttpResponseCode.NO_CONTENT.code).json({});
			} else {
				console.log(
					`Erro ao pesquisar pela ferramenta de ID ${_id} - ${err}`
				);
				return res
					.status(HttpResponseCode.INTERNAL_SERVER_ERROR.code)
					.json(
						new HttpRespondeErrorDto(
							HttpResponseCode.INTERNAL_SERVER_ERROR.code,
							HttpResponseCode.INTERNAL_SERVER_ERROR.name,
							'Database error, try again later.'
						)
					);
			}
		}
	}

	/**
	 * Adiciona uma nova ferramenta ao banco de dados
	 */
	async includeTool(req, res) {
		req.assert('title').notEmpty();
		req.assert('description').notEmpty();
		req.assert('link').notEmpty();

		console.log('Incluindo nova ferramenta');

		if (req.validationErrors()) {
			console.log(
				'Erro no corpo da requisicao de nova ferramenta: ' +
					req.validationErrors()
			);
			return res
				.status(HttpResponseCode.BAD_REQUEST.code)
				.json(
					new HttpRespondeErrorDto(
						HttpResponseCode.BAD_REQUEST.code,
						HttpResponseCode.BAD_REQUEST.name,
						'Please, fill title, description and link and try again.'
					)
				);
		}

		try {
			var newTool = await toolDao.create(req.body);
			newTool.__v = undefined;
			newTool.created_At = undefined;

			return res.status(HttpResponseCode.CREATED.code).json(newTool);
		} catch (err) {
			console.log('Erro ao uma nova ferramenta: ' + err);
			return res
				.status(HttpResponseCode.INTERNAL_SERVER_ERROR.code)
				.json(
					new HttpRespondeErrorDto(
						HttpResponseCode.INTERNAL_SERVER_ERROR.code,
						HttpResponseCode.INTERNAL_SERVER_ERROR.name,
						'Database error, try again later.'
					)
				);
		}
	}

	/**
	 * Realiza a exclusao de uma ferramenta do banco de dados (retorna 200 para exclusao realizada com sucesso e 204 caso a ferramenta nao exista)
	 */
	async deleteTool(req, res) {
		try {
			var { _id } = req.params;
			console.log(`Excluindo ferramenta de ID ${_id}`);
			await toolDao.findByIdAndDelete({ _id });
			return await res.status(HttpResponseCode.OK.code).send();
		} catch (err) {
			return res
				.status(HttpResponseCode.INTERNAL_SERVER_ERROR.code)
				.json(
					new HttpRespondeErrorDto(
						HttpResponseCode.INTERNAL_SERVER_ERROR.code,
						HttpResponseCode.INTERNAL_SERVER_ERROR.name,
						'Database error, try again later.'
					)
				);
		}
	}
}

module.exports = new ToolController();

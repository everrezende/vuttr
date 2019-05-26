const should = require('should');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const httpRequest = require('request');
const HttpStatus = require('../src/enums/HttpResponseCode');

const jsonTestTool = require('./test-tool.json');

chai.use(chaiHttp);

const apiBasePath = 'http://localhost:3000/api';
const endpointTest = '/tools';

const testSecretId = 'idSecreto';
const testSecretKey = '123';

describe('Testes das operacoes no endpoint /tools', function() {
	/**
	 * Variavel utilizada para armazenar o ID do registro criado para testes
	 */
	var createdId;

	/**
	 * Testa execucacao do metodo GET em /tools (HTTP 200)
	 */
	it('GET em /tools deve retornar HTTP 200', function(done) {
		chai.request(apiBasePath)
			.get(endpointTest)
			.end(function(err, res) {
				expect(err).to.be.null;
				expect(res.status).to.be.equal(HttpStatus.OK.code);
				done();
			});
	});

	/**
	 * Testa resultado do metodo GET em /tools
	 */
	it('GET em /tools deve retornar o campo tools no body', function(done) {
		chai.request(apiBasePath)
			.get(endpointTest)
			.end(function(err, res) {
				expect(err).to.be.null;
				expect(res.body).to.not.equal(null);
				expect(res.body).have.property('tools');
				done();
			});
	});

	/**
	 * Testa GET em /tools com o filtro por tag
	 */
	it('GET em /tools?tag=node deve retornar o campo tools no body', function(done) {
		chai.request(apiBasePath)
			.get(endpointTest)
			.end(function(err, res) {
				expect(err).to.be.null;
				expect(res.status).to.be.equal(HttpStatus.OK.code);
				expect(res.body).to.not.equal(null);
				expect(res.body).have.property('tools');
				done();
			});
	});

	/**
	 * Testa uma requisicao POST em /tools e valida a criacao de um novo registro
	 */
	it('POST em /tools deve retornar HTTP 201 + _id do novo objeto', function(done) {
		httpRequest.get(
			`${apiBasePath}/authenticate?secretId=${testSecretId}&secretKey=${testSecretKey}`,
			{ json: true },
			(err, res, body) => {
				tokenTest = body.token;

				chai.request(apiBasePath)
					.post(endpointTest)
					.set('Authorization', 'Bearer ' + tokenTest)
					.send(jsonTestTool)
					.end(function(err, res) {
						expect(err).to.be.null;
						expect(res.status).to.be.equal(HttpStatus.CREATED.code);
						expect(res.body).to.not.equal(null);
						expect(res.body).have.property('_id');
						createdId = res.body._id;
						done();
					});
			}
		);
	});

	/**
	 * Testa o resultado do metodo GET em /tools/:_id
	 */
	it('GET em /tools/:_id deve retornar o campo tool no body', function(done) {
		chai.request(apiBasePath)
			.get(`${endpointTest}/${createdId}`)
			.end(function(err, res) {
				expect(err).to.be.null;
				expect(res.status).to.be.equal(HttpStatus.OK.code);
				expect(res.body).to.not.equal(null);
				expect(res.body).have.property('_id');
				done();
			});
	});

	/**
	 * Testa uma requisicao DELETE em /tools e valida a exclusao do registro criado no teste anterior
	 */
	it('DELETE em /tools deve retornar HTTP 200', function(done) {
		chai.request(apiBasePath)
			.delete(`${endpointTest}/${createdId}`)
			.set('Authorization', `Bearer ${tokenTest}`)
			.end(function(err, res) {
				expect(err).to.be.null;
				expect(res.status).to.be.equal(HttpStatus.OK.code);
				done();
			});
	});
});

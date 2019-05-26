const should = require('should');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const HttpStatus = require('../src/enums/HttpResponseCode');

const jsonTestTool = require('./test-tool.json');

chai.use(chaiHttp);

const apiBasePath = 'http://localhost:3000/api';
const endpointTest = '/authenticate';

const testSecretId = 'idSecreto';
const testSecretKey = '123';

describe('Testes no endpoint de autenticação', () => {
	it('GET sem informacao de usuario e senha deve retornar HTTP 400', done => {
		chai.request(apiBasePath)
			.get(endpointTest)
			.end((error, res) => {
				expect(error).to.be.null;
				expect(res.status).to.be.equal(HttpStatus.BAD_REQUEST.code);
				done();
			});
	});

	it('GET com usuario e senha valido deve retornar HTTP 200 + token no body do response', done => {
		chai.request(apiBasePath)
			.get(
				`${endpointTest}?secretId=${testSecretId}&secretKey=${testSecretKey}`
			)
			.end((error, res) => {
				expect(error).to.be.null;
				expect(res.status).to.be.equal(HttpStatus.OK.code);
				expect(res.body).have.property('token');
				done();
			});
	});
});

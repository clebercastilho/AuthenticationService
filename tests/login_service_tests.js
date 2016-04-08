var app = require('../build/index.min');
var should = require('should');
var request = require('supertest');

var id_teste = '';
var token_teste = '';

describe('Na tentativa de cadastro:', function(){
	var url = '/api/usuario/cadastrar';
	var data = {
		nome: "Teste de cadastro 1",
		email: "email1@teste.com",
		senha: "123456",
		telefone: [{ddd:11, numero:'987654321'}]
	};

	it('Ao passar todos os dados válidos', function(done){
		request(app)
			.post(url)
			.send(data)
			.expect(200)
			.end(function(error, response){
				var body = response.body;
				should(body).have.property('id').with.lengthOf(36);
				(body.token && body.token.length > 0).should.be.true();
				done();
			});
	});

	it('Ao informar um email já existente', function(done){
		request(app)
			.post(url)
			.send(data)
			.expect(400, {mensagem: "E-mail já existente"}, done)
	});
});

describe('No login do usuário:', function(){
	var url = '/api/usuario/autenticar';
	var data = {
		email: 'email1@teste.com',
		senha: '123456'
	};

	it('Com email inexistente', function(done) {
		data.email = 'email100@teste.com';
		
		request(app)
			.post(url)
			.send(data)
			.expect(401, {mensagem: "Usuário e/ou senha inválidos"}, done)
	});

	it('Com senha inválida', function(done){
		data.email = 'email1@teste.com';
		data.senha = '654321';

		request(app)
			.post(url)
			.send(data)
			.expect(401, {mensagem: "Usuário e/ou senha inválidos"}, done)
	});

	it('Ao informar email e senha corretos.', function(done){
		data.email = 'email1@teste.com';
		data.senha = '123456';
		
		request(app)
			.post(url)
			.send(data)
			.expect(200)
			.end(function(error, response){
				var body = response.body;
				should(body).have.property('id').with.lengthOf(36);
				(body.token && body.token.length > 0).should.be.true();
				token_teste = body.token;
				id_teste = body.id;
				done();
			});
	});
});

describe('Ao obter o usuário autenticado:', function() {
	var url = '/api/usuario/obter/';

	it('Sem informar um token no header', function(done) {
		request(app)
			.get(url + id_teste)
			.expect(401, {mensagem: 'Não autorizado'}, done)
	});

	it('Com ID incorreto e token válido', function(done) {
		request(app)
			.get(url + '0000')
			.set('authentication', token_teste)
			.expect(400, {mensagem: "Usuário não encontrado"}, done)
	});

	it('Com ID correto, mas token inválido', function(done) {
		request(app)
			.get(url + id_teste)
			.set('authentication', '0000')
			.expect(401, {mensagem: "Não autorizado"}, done)
	});

	it('Com ID e token corretos', function(done) {
		request(app)
			.get(url + id_teste)
			.set('authentication', token_teste)
			.expect(200)
			.end(function(err, response){
				var body = response.body;
				should(body).have.property('id').with.lengthOf(36);
				(body.token && body.token.length > 0).should.be.true();
				done();
			});
	});
});
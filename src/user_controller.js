/*
UsuarioController
*/
module.exports = (function() {
	
	//modules
	var moment = require('moment');
	var util = require('./util.min');
	var database = require('./db_model.min');
	
	
	function validarNovoUsuario(body){
		return body.nome && body.email && body.senha;
	}

	function validarAutenticacao(body){
		return body.email && body.senha;
	}

	function criarNovoUsuario(body, callbackReq){

		if(!validarNovoUsuario(body)){
			var e = util.generateErrorMessage("Há dados inválidos");
			callbackReq(util.getResponseData(400, e));
			return;
		}

		var dataAtual = moment();
		
		var novoUsuario = new UsuarioModel();
		novoUsuario.id = util.generateToken();
		novoUsuario.nome = body.nome;
		novoUsuario.email = body.email;
		novoUsuario.senha = util.generateHash(body.senha);
		novoUsuario.telefones = body.telefones || [];
		novoUsuario.dataCriacao = dataAtual;
		novoUsuario.dataAtualizacao = dataAtual;
		novoUsuario.ultimoLogin = dataAtual;
		novoUsuario.token = util.generateHash(util.generateToken());


		database.getByEmail(novoUsuario.email, function(error, user){
			if(error){
				var e = util.generateErrorMessage(database.parseError(error));
				callbackReq(util.getResponseData(400, e));
				return;
			}

			if(user && user.email === novoUsuario.email){
				var e = util.generateErrorMessage("E-mail já existente");
				callbackReq(util.getResponseData(400, e));
				return;
			}

			database.save(novoUsuario, function(error){
				if(error){
					var e = util.generateErrorMessage(database.parseError(error));
					callbackReq(util.getResponseData(400, e));
					return;
				}

				callbackReq(util.getResponseData(200, novoUsuario));
			});
		});
	}

	function obterUsuario(id, tokenReq, callbackReq) {
		database.getById(id, function(error, user){
			if(error){
				var e = util.generateErrorMessage(database.parseError(error));
				callbackReq(util.getResponseData(400, e));
				return;
			}

			if(!user){
				var e = util.generateErrorMessage("Usuário não encontrado");
				callbackReq(util.getResponseData(400, e));
				return;
			}

			if(user.token !== tokenReq){
				var e = util.generateErrorMessage("Não autorizado");
				callbackReq(util.getResponseData(401, e));
				return;
			}

			var limiteSessao = moment().subtract(30, 'minutes');
			if(limiteSessao.isAfter(user.ultimoLogin)){
				var e = util.generateErrorMessage("Sessão inválida");
				callbackReq(util.getResponseData(401, e));
				return;
			}


			callbackReq(util.getResponseData(200, user));
		});
	}

	function autenticarUsuario(body, callbackReq){
		if(!validarAutenticacao(body)){
			var e = util.generateErrorMessage("Há dados inválidos");
			callbackReq(util.getResponseData(400, e));
			return;
		}

		database.getByEmail(body.email, function(error, user){
			if(error){
				var e = util.generateErrorMessage(database.parseError(error));
				callbackReq(util.getResponseData(400, e));
				return;
			}

			var encrypted = util.generateHash(body.senha);
			if(!user || user.senha !== encrypted){
				var e = util.generateErrorMessage("Usuário e/ou senha inválidos");
				callbackReq(util.getResponseData(401, e));
				return;
			}

			user.ultimoLogin = moment();
			database.updateLoginDate(user.id, user.ultimoLogin, function(error){
				if(error){
					var e = util.generateErrorMessage(database.parseError(error));
					callbackReq(util.getResponseData(400, e));
					return;
				}

				callbackReq(util.getResponseData(200, user));
			});
		});
	}


	var UsuarioController = {
		criar: criarNovoUsuario,
		obter: obterUsuario,
		autenticar: autenticarUsuario
	};

	return UsuarioController;

})();
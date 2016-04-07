
module.exports = (function() {
	
	//modules
	var util = require('./util');
	var database = require('./dbConnection');
	var moment = require('moment');
	
	function validarNovoUsuario(body){
		return body.nome && body.email && body.senha;
	}

	function validarAutenticacao(body){
		return body.email && body.senha;
	}

	function criarNovoUsuario(body, callbackReq){

		if(!validarNovoUsuario(body)){
			callbackReq(util.generateErrorMessage("Há dados inválidos"));
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
				var obj = util.generateErrorMessage(error);
				callbackReq(obj);
				return;
			}

			if(user && user.email === novoUsuario.email){
				var obj = util.generateErrorMessage("E-mail já existente.");
				callbackReq(obj);
				return;
			}

			database.save(novoUsuario, function(error){
				if(error){
					var obj = util.generateErrorMessage(error);
					callbackReq(obj);
					return;
				}

				callbackReq(novoUsuario);
			});
		});
	}

	function obterUsuario(id, tokenReq, callbackReq) {
		database.getById(id, function(error, user){
			if(error){
				var obj = util.generateErrorMessage(error);
				callbackReq(obj);
				return;
			}

			if(!user){
				var obj = util.generateErrorMessage("Usuário não encontrado");
				callbackReq(obj);
				return;
			}

			if(user.token !== tokenReq){
				var obj = util.generateErrorMessage("Não autorizado");
				callbackReq(obj);
				return;
			}

			var limiteSessao = moment().subtract(30, 'minutes');
			if(limiteSessao.isAfter(user.ultimoLogin)){
				var obj = util.generateErrorMessage("Sessão inválida");
				callbackReq(obj);
				return;
			}


			callbackReq(user);
		});
	}

	function autenticarUsuario(body, callbackReq){
		if(!validarAutenticacao(body)){
			callbackReq(util.generateErrorMessage("Há dados inválidos"));
			return;
		}

		database.getByEmail(body.email, function(error, user){
			if(error){
				var obj = util.generateErrorMessage(error);
				callbackReq(obj);
				return;
			}

			var encrypted = util.generateHash(senha);
			if(!body.user || user.senha !== encrypted){
				var obj = util.generateErrorMessage("Usuário e/ou senha inválidos");
				callbackReq(obj);
				return;
			}

			user.ultimoLogin = moment();
			database.updateLoginDate(user.id, user.ultimoLogin, function(error){
				if(error){
					var obj = util.generateErrorMessage(error);
					callbackReq(obj);
					return;
				}

				callbackReq(user);
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
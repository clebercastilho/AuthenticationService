/*
Cria o model e controla a persistencia de dados
*/
module.exports = (function() {

	var mongoose = require('mongoose');
	var connection = require('./db_connection.min');

	function parseMongoDbError(mongoError) {
		var msg = "MongoDB: " + mongoError.message;
		return msg;
	}

	function configurarDatabase() {
		global.db = connection.getDbConnection();
		
		var userSchema = mongoose.Schema;
		var userModel = userSchema({
			id: {type: String, required: true},
			nome: {type: String, required: true},
			email: {type: String, required: true, index: {unique: true}},
			senha: {type: String, required: true},
			telefones: {type: Array, required: false},
			dataCriacao: {type: Date, required: true},
			dataAtualizacao: {type: Date, required: false},
			ultimoLogin: {type: Date, required: true},
			token: {type: String, required: true}
		});

		global.UsuarioModel = db.model('Usuarios', userModel);
	}

	function SalvarUsuario(model, callback){
		model.save(function(error){
			callback(error);
		});
	}

	function ObterUsuarioPeloId(id, callback){
		var instance = db.model('Usuarios');
		instance.findOne({"id": id}, function(error, usuario){
			callback(error, usuario);
		});
	}

	function ObterUsuarioPeloEmail(email, callback){
		var instance = db.model('Usuarios');
		instance.findOne({"email": email}, function(error, usuario){
			callback(error, usuario);
		});
	}

	function AtualizarDataUltimoLogin(id, date, callback){
		var instance = db.model('Usuarios');
		instance.findOne({"id": id}, function(error, usuario){
			if(error){
				callback(error);
				return;
			}

			usuario.update({"ultimoLogin": date}, function(error){
				callback(error);
			});
		});
	}

	return {
		save: SalvarUsuario,
		getById: ObterUsuarioPeloId,
		getByEmail: ObterUsuarioPeloEmail,
		updateLoginDate: AtualizarDataUltimoLogin,
		config: configurarDatabase,
		parseError: parseMongoDbError
	};

})();
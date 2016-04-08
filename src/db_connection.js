/*
Controla a conexão com o banco de dados MongoDB
*/
module.exports = (function(){

	var mongoose = require('mongoose');

	function ObterUrlConexaoDB(){
		var url = "mongodb://127.0.0.1:27017/AccountManager";
		return mongoose.connect(url);
	}

	return {
		getDbConnection: ObterUrlConexaoDB
	};

})();
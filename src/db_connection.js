/*
Controla a conexão com o banco de dados MongoDB
*/
module.exports = (function(){

	var mongoose = require('mongoose');

	function ObterUrlConexaoDB(){
		var url = "mongodb://localhost:27017/AccountManager";
		return mongoose.connect(url);
	}

	return {
		getDbConnection: ObterUrlConexaoDB
	};

})();
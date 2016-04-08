/*
Controla a conexão com o banco de dados MongoDB
*/
module.exports = (function(){

	var mongoose = require('mongoose');

	function ObterUrlConexaoDB(){
		var url = "mongodb://castilho:147258@ds021000.mlab.com:21000/heroku_7qhq423m";
		return mongoose.connect(url);
	}

	return {
		getDbConnection: ObterUrlConexaoDB
	};

})();
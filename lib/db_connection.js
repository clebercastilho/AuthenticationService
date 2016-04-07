
module.exports = (function(){

	var mongoose = require('mongoose');
	var url_environment = {
		"development": "mongodb://127.0.0.1:27017/AccountManager",
		"test": "mongodb://127.0.0.1:27017/AccountTests"
	};

	function ObterUrlConexaoDB(){
		var url = url_environment.development;
		return mongoose.connect(url);
	}

	return {
		getDbConnection: ObterUrlConexaoDB
	};

})();
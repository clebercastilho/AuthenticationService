
module.exports = (function() {

	//modules
	var hash = require('crypto-js');
	var guid = require('guid');
	var moment = require('moment');

	function gerarToken(){
		return guid.create();
	}

	function gerarHashMd5(data){
		var obj = hash.MD5(data);
		return obj.toString(hash.enc.Base64);
	}

	function gerarJsonErro(msg){
		var obj = {
			mensagem: msg
		};

		if(!obj.mensagem)
			obj.mensagem = "Ocorreu um erro não mapeado."
		
		return obj;
	}

	function ConverterDataIso(date){
		return moment(date).format('YYYY-MM-DD HH:mm:ss');
	}

	return {
		generateToken: gerarToken,
		generateHash: gerarHashMd5,
		generateErrorMessage: gerarJsonErro,
		convertDateToIsoFormat: ConverterDataIso
	};

})();
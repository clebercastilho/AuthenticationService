//modules
var express = require('express');
var bodyParser = require('body-parser');
var controller = require('./userController');
var database = require('./dbConnection');
var util = require('./util');

//configuration
var app = express();
app.use(bodyParser.json());
database.config();


//routes
app.get('/', function(req, res){
	//TODO: uma documentação descrevendo a API
});

app.get('/api/usuario/obter/:id', function(req, res){
	console.log(req.headers);

	if(!req.headers.authentication){
		res.send(util.generateErrorMessage("Não autorizado."));
		return;
	}

	var usuarioId = req.params.id;
	var tokenRequisicao = req.headers.authentication;

	controller.obter(usuarioId, tokenRequisicao, function(response){
		res.send(response);
	});
});

app.post('/api/usuario/cadastrar', function(req, res){
	var body = req.body;
	
	controller.criar(body, function(response){
		res.send(response);
	});
});

app.post('/api/usuario/autenticar', function(req, res){
	var body = req.body;
	controller.autenticar(body, function(response){
		res.send(response);
	});
});


app.listen(4123, function(){
	console.log("API iniciada na porta 4123, usando express.")
});
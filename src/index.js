//modules
var express = require('express');
var bodyParser = require('body-parser');
var controller = require('./user_controller.min');
var database = require('./db_model.min');
var util = require('./util.min');

//configuration
var app = express();
app.use(bodyParser.json());

//database config
database.config();


//routes
app.get('/', function(req, res){
	res.send('API Login Service');
});


app.get('/api/usuario/obter/:id', function(req, res){
	if(!req.headers.authentication){
		res.status(401).json(util.generateErrorMessage("Não autorizado"));
		return;
	}

	var usuarioId = req.params.id;
	var tokenRequisicao = req.headers.authentication;

	controller.obter(usuarioId, tokenRequisicao, function(response){
		res.status(response.status).json(response.body);
	});
});


app.post('/api/usuario/cadastrar', function(req, res){
	var body = req.body;
	
	controller.criar(body, function(response){
		res.status(response.status).json(response.body);
	});
});


app.post('/api/usuario/autenticar', function(req, res){
	var body = req.body;
	controller.autenticar(body, function(response){
		res.status(response.status).json(response.body);
	});
});


app.listen(4123, function(){
	console.log("API iniciada na porta 4123, usando express.");
});


//test
module.exports = app;
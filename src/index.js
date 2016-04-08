//modules
var express = require('express');
var bodyParser = require('body-parser');
var controller = require('./user_controller.min');
var database = require('./db_model.min');
var util = require('./util.min');

//configuration
var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

//set port for heroku
app.set('port', (process.env.PORT || 4123));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//database config
database.config();


//routes
app.get('/', function(req, res){
	res.render('pages/index');
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


app.listen(app.get('port'), function(){
	console.log("API iniciada, usando express, na porta", app.get('port'));
});


//test
module.exports = app;
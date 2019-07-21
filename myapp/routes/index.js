var express = require('express');
var bodyParser = require('body-parser');
var validator = require('node-input-validator');

var router = express.Router();

// connection 
var mysql = require('mysql');
var mysqlConnection = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'infosistemas',
	multipleStatements: true,
	debug: false
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// verifica connection bd
router.get('/connection', function(req, res, next) {
	if(mysqlConnection != null)
		res.send({status: '200', message: 'Success'});
	else
		res.status(503).send({status: '503', message: 'Fail'});
});

router.get('/api/veiculos', function(req, res, next) {
	mysqlConnection.query('SELECT * FROM veiculos', function (err, result, fields){

		if(!err)
			res.send(result);
		else
			res.status(500).send({status: '500', message: 'Fail'});
	});
});

router.get('/api/veiculos/:id', function(req, res, next) {
	mysqlConnection.query('SELECT * FROM veiculos WHERE id = ?', [req.params.id], function (err, result, fields){
		if (err)
			res.status(500).send({status: '500', message: err});
		else
			res.send(result);
	});
});

router.get('/veiculos', function(req, res, next) {
	mysqlConnection.query('SELECT * FROM veiculos', function (err, result, fields){

		if(!err)
			res.render('veiculos', { veiculos: result });
		else
			res.status(500).send({status: '500', message: 'Fail'});
	});
});

/* view insert */
router.get('/insert', function(req, res, next) {
	res.render('insert', {veiculo: {} });
});

// post insert 
router.post('/insert', function(req, res, next) {
	mysqlConnection.query('INSERT INTO veiculos SET ?', req.body, function (err, result, fields){
		if (err)
			res.status(500).send({status: '500', message: err});
		else
			res.redirect('select');
	});
});

// post insert 
router.post('/api/veiculos', function(req, res, next) {
	mysqlConnection.query('INSERT INTO veiculos SET ?', req.body, function (err, result, fields){
		if (err)
			res.status(500).send({status: '500', message: err});
		else
			res.end(JSON.stringify({status: '200', data:'Insert ID: ' + result.insertId, message: 'Success'}, null, 2));
	});
});

router.post('/api/veiculos/:id', function(req, res, next) {
	mysqlConnection.query('UPDATE veiculos SET ? WHERE id = ?', [req.body, req.params.id], function (err, result, fields){
		if (err)
			res.status(500).send({status: '500', message: err});
		else
			res.end(JSON.stringify({status: '200', data: result.message, message: 'Update'}, null, 2));
	});

});

router.get('/delete', function(req, res, next) {
	mysqlConnection.query('DELETE FROM veiculos WHERE id = ?', req.query.id, function (err, result, fields){
		if (err)
			res.status(500).send({status: '500', message: err});
		else
			res.redirect('/veiculos');
	});
});

router.post('/api/delete/:id', function(req, res, next) {
	mysqlConnection.query('DELETE FROM veiculos WHERE id = ?', [req.params.id], function (err, result, fields){
		if (err)
			res.status(500).send({status: '500', message: err});
		else
			res.end(JSON.stringify({status: '200', data: 'affectedRows: '+ result.affectedRows, message: 'Success'}, null, 2));
	});
});

router.get('/edit/', function(req, res, next) {
	mysqlConnection.query('SELECT * FROM veiculos WHERE id = ?', req.query.id, function (err, result, fields){

		if (err)
			res.status(500).send({status: '500', message: err});
		else
			res.render('insert', {veiculo: result[0]});
	});
});

router.post('/edit', function(req, res, next) {

	var param = [
		req.body, // data for update
		req.query.id // condition for update
	];

	mysqlConnection.query('UPDATE veiculos SET ? WHERE id = ?', param, function (err, result, fields){
		if (err)
			res.status(500).send({status: '500', message: err});
		else
			res.redirect('veiculos');
	});
});

module.exports = router;
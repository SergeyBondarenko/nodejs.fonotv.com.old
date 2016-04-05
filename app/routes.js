var path = require('path');
var Todo = require('./models/todo');
var Videolink = require('./models/fonotvdb');

var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

function getTodos(res){
	Todo.find(function(err, todos) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err);

			res.json(todos); // return all todos in JSON format
		});
};

// Get links
function getLinks(res){
	Videolink.find(function(err, hyperlinks) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err);

			res.json(hyperlinks); // return all todos in JSON format
		});
};

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all todos
	app.get('/api/todos', function(req, res) {

		// use mongoose to get all todos in the database
		getTodos(res);
	});

	app.get('/api/videolinks', function(req, res) {

		// use mongoose to get all todos in the database
		getLinks(res);
	});

	// delete a todo
	app.delete('/api/videolinks/:video_id', function(req, res) {
		Videolink.remove({
			_id : ObjectId(req.params.video_id)
		}, function(err, videolink) {
      console.log(req.params);
      console.log(ObjectId(req.params.video_id));
      console.log(videolink);
			if (err)
				res.send(err);

			getLinks(res);
		});
	});

	// create todo and send back all todos after creation
	app.post('/api/todos', function(req, res) {

		// create a todo, information comes from AJAX request from Angular
		Todo.create({
			text : req.body.text,
			done : false
		}, function(err, todo) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			getTodos(res);
		});

	});

	// delete a todo
	app.delete('/api/todos/:todo_id', function(req, res) {
		Todo.remove({
			_id : req.params.todo_id
		}, function(err, todo) {
			if (err)
				res.send(err);

			getTodos(res);
		});
	});

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		//res.sendFile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
		res.sendFile('index.html', {root: path.join(__dirname, './public')}); // load the single view file (angular will handle the page changes on the front-end)
	});
};

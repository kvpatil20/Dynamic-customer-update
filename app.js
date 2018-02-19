// Working with template engines- EJS (Embedded JS)

var express = require('express'); //importing 
var bodyParser = require('body-parser');
var path = require('path'); //simplifies file path. It is a core module we do not need to install it separately.  
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('mycustomers', ['users'])
var ObjectId = mongojs.ObjectId;
 
var app = express();

// View Engine (Middleware)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parseer Middleware
app.use(bodyParser.json()); //Parses json content.
app.use(bodyParser.urlencoded({extended: false}));

// Middleware for public/static folder. eg: css, jQuery etc
// Set static path
app.use(express.static(path.join(__dirname, 'public'))); // Public-index.html: Overrirdes whatever we have in our app.js

//Global Variable:
//It has it's own middleware: app.use()
app.use(function(req, res, next){

	res.locals.errors = null; //errors is the global variable
	next();
});

//Express Validator: Middleware
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.')
		, root = namespace.shift()
		, formParam = root;

		while(namespace.length)
		{
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value

		};
	}

}));




app.get('/', function(req, res){
	// find everything
	db.users.find(function (err, docs) { // docs are extracted from db
		// docs is an array of all the documents in mycollection
		console.log(docs);
		res.render('index', {
			title: 'Customer',
			users: docs
		}); // calls index.ejs
	})  
	
}); //GET Request for home page(/). 
app.post('/users/add', function(req,res){
	//Express Validator middleware called: param: first_name, msg: First Name is Required, notEmpty: value/condition.
	req.checkBody('first_name', 'First Name is Required').notEmpty();
	req.checkBody('last_name', 'Last Name is Required').notEmpty();
	req.checkBody('email', 'Email is Required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('index', {
			title: 'Customer',
			users: users,
			errors: errors
		});

	}
	else {
		var newUser = {
			first_name: req.body.first_name, // takes the input from the form 
			last_name: req.body.last_name,
			email: req.body.email 
		}
		db.users.insert(newUser, function(err, result){
			if(err){
				console.log(err);
			}
			res.redirect('/'); // if no error go back to home page.

		});
	}

	
});


app.delete('/users/delete/:id', function(req, res){
	db.users.remove({_id: ObjectId(req.params.id)}, function(err, result){
		if(err){
			console.log(err);
		}
		res.redirect('/');

	});
});

//listen on a port eg: 3000
app.listen(3000, function(){
 	console.log('Server started on port 3000... ');
}) 


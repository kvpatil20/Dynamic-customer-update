// app1.js: Tells you the basic. express, body-parser, path, middleware, nodemon(with the help of this you don't need to restart the server and excute the program again),
// .use() - middleware, .get() - GET Request, res.send(), res.json() // display on the page, app.listen()

var express = require('express'); //importing 
var bodyParser = require('body-parser');
var path = require('path'); //simplifies file path. It is a core module we do not need to install it separately.  
 
var app = express();

/*
middleware: invoked by the ExprerssJS routing before the final request handler. Order of the middleware is important. 
If it is printed after the get function it won't get displaed

var logger = function(req, res, next){
	console.log('Logging...');
	next();

}

app.use(logger);
*/

// Body Parseer Middleware
app.use(bodyParser.json()); //Parses json content.
app.use(bodyParser.urlencoded({extended: false}));

// Middleware for public/static folder. eg: css, jQuery etc
// Set static path
app.use(express.static(path.join(__dirname, 'public'))); // Public-index.html: Overrirdes whatever we have in our app.js

var person = [
	{
		name: 'Jeff',
		age: 30
	},
	{
		name: 'Sara',
		age: 25
	},
	{
		name: 'Bill',
		age: 22
	}
]


app.get('/', function(req, res){
	//res.send('Hello!');
	res.json(person);


}); //GET Request for home page(/). 

//listen on a port eg: 3000
app.listen(3000, function(){
 	console.log('Server started on port 3000... ');
}) 
//If we execute it till here... on the bash console we will get Server started on port 3000... . 
//Whereas, on the web "localhost:3000" we will get "Cannot GET /", where the / is the home page or "localhot:3000/about" will display "Cannot GET /about".


// server.js
var express = require("express");
var connect = require('connect');
var logfmt = require("logfmt");
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
var fs = require('fs');
var file = __dirname + '/itinerary.json';


app.use(logfmt.requestLogger());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cors());
app.get('/read', function(req, res) {
	fs.readFile(file, 'utf8', function(err, data) {
		if (err) {
			console.log("error: " + err);
			return;
		}
		res.send(data);
	});
});

// TODO: write file implementation
app.post('/write', function(req, res) {
	console.log(req.body);
	
	fs.writeFile(file, JSON.stringify(req.body), function(err, data) {
		if (err) {
			console.log("error: " + err);
			return;
		}
		console.log("file written");
	});
	
	
	res.send(req.body);
});
var messageFile = __dirname + '/messages.json';
app.post('/sendMessage', function(req, res) {
	console.log("writing messages.json file");
	
	fs.appendFile(messageFile, readdata + JSON.stringify(req.body), function(err, data) {
		if (err) {
			console.log("error: " + err);
			return;
		}
		console.log("message file written");
	});
	
	
	res.send("success send Message!");
});

app.get('/getMessages', function(req, res) {
	fs.readFile(messageFile, 'utf8', function(err, data) {
		if (err) {
			console.log("error: " + err);
			return;
		}
		res.send(data);
	});
});


var pg = require('pg');
var localConnection = 'postgres://hwcfxbyewaiodb:CiLoioQgw8uajKojLfU5bW1VeQ@ec2-23-23-177-33.compute-1.amazonaws.com:5432/dgpekngq9m8hd';

var connectionString = process.env.DATABASE_URL || localConnection;
var client;
var query;

pg.connect(connectionString, function(err, client, done) {
	if(err) {
		return console.error('error fetching client from pool', err);
	}
	client.query('SELECT * from messages', function(err, result) {
		//call `done()` to release the client back to the pool
	    done();

	    if(err) {
	      return console.error('error running query', err);
	    }
	    console.log(result.rows[0].number);
	});
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
	console.log("Listening on " + port);
});
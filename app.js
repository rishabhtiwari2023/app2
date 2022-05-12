var express=require("express");
var bodyParser=require("body-parser");

const mongoose = require('mongoose');var Schema = mongoose.Schema;

mongoose.connect('mongo2qow.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
	console.log("connection succeeded");
})

var app=express()


app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
	extended: true
}));
var details=new Schema({
"name": string,
		"email":string,
		"password":string,
		"phone":string});
app.get('/g',function(req,res){
	details.find({}).exec(function(err,details){
		console.log(details);
		res.json(details);
	})
})
app.post('/sign_up', function(req,res){
	var name = req.body.name;
	var email =req.body.email;
	var pass = req.body.password;
	var phone =req.body.phone;

	var data = {
		"name": name,
		"email":email,
		"password":pass,
		"phone":phone
	}
db.collection('rishabh').insertOne(data,function(err, collection){
		if (err) throw err;
		console.log("Record inserted Successfully");
			
	});
		
	return res.redirect('signup_success.html');
})


app.get('/',function(req,res){
res.set({
	'Access-control-Allow-Origin': '*'
	});
return res.redirect('public/index.js');
}).listen(3000)


console.log("server listening at port 3000");

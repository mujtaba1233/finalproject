//Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression')
var path = require('path')
var request = require('request')
require('dotenv').config()
var PORT = 3000;

// Express
const app = express();
app.use(compression())

// Middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/client/build'),{ maxAge: '5d'}));


// app.use(express.static(path.join(__dirname, 'build')));
console.log(process.env.SERVER_URL);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});
app.get('/email/confirm/:token', function (req, res) {
    console.log('user token: =>',req.params.token);
    var url = process.env.SERVER_URL + '/api/blue-sky/email-confirm/' + req.params.token
	var opt = {
		url: url
    };
    var callback = function(error, result, body){
        // if(!error)
        body = JSON.parse(body)
        console.log(error,body.code);
        if(body.code === 200){
            res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
        }else if(body.code === 400){
            res.redirect('/email/link-expire/invalid-or-already-confirmed');
        }else{
            res.redirect('/email/link-expire/404');
        }
    }
    request(opt, callback);

});
app.use(function(req, res){
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});


app.set('view engine', 'ejs');
// Start Server
app.listen(PORT, function(){
    console.log("Server started on port " + PORT);
});

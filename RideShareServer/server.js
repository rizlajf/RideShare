var http = require('http');
var express = require('express');
var bodyparser = require('body-parser');
var route = require('./routerConfig.js');
var core = require('./Core.js');

var app = new express();
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.use(core());
app.use('/users', route);

var port = process.env.port || 1337;
//http.createServer(function (req, res) {
//    res.writeHead(200, { 'Content-Type': 'text/plain' });
//    res.end('Hello World\n');
//}).listen(port);

app.get('/', function (request, response) {
    response.send("<b>This response is generated from Express router!!</b>");
});

app.listen(port);

var http = require('http');
var io = require('./socket.io');
var fs = require('fs');

var Running = {};

//by @innoying
console.log("Tilt! Server by @innoying (Luke Young).");

//Announce that the server was succesfully started.
console.log('Server Started...');

server = http.createServer(function(req, res){
    // your normal server code
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(fs.readFileSync("App.html"));
});
server.listen(1337);

// socket.io, I choose you
var socket = io.listen(server);

socket.on('connection', function(client){
    Running[client['sessionId']] = {
        Y:0,
        X:0
    };
    // new client is here!
    client.on('message', function(msgplain){
        var msg = JSON.parse(msgplain);
        Running[client['sessionId']]['X'] = msg['X'];
        Running[client['sessionId']]['Y'] = msg['Y'];
    });
    client.on('disconnect', function(){
        delete Running[client['sessionId']];
    });
});
setInterval(function(){
    socket.broadcast(Running);
},100);
var swarm = require('./swarm.js');

var node = swarm('127.0.0.1', 2120),
	numworkers = 5;

while(numworkers--)
	swarm('127.0.0.1', 2150-numworkers, '127.0.0.1', 2120);

function setupweb(){
	var express = require('express'), 
	app = express(),
	port = me[1]+10;
	app.listen(port);

	app.get('/', function(r, s){
		s.end('ok');
	})
	return 'Started on ' + port;
}

setTimeout(function(){ 
	node.work(setupweb, null, function(e, r){
		console.log(r)
	})
}, 2000);
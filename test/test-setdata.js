var swarm = require('./swarm.js');

var node = swarm('127.0.0.1', 2120);
var worker1 = swarm('127.0.0.1', 2121, '127.0.0.1', 2120);
var worker2 = swarm('127.0.0.1', 2122, '127.0.0.1', 2120);
var worker3 = swarm('127.0.0.1', 2123, '127.0.0.1', 2120);

setTimeout(function(){ 
	// set same data on all nodes
	node.setData('Hi, Im some data', function(e, r){
		if(e) throw e;
		//console.log(r);
	})
}, 1000);


var data = 'default chunk strategy';
setTimeout(function(){ 
	// set same data on all nodes
	node.chunk(data, function(e, r){
		if(e) throw e;
		console.log(r);
	})
}, 2000);

var data2 = 'New\nchunk\nstrategy';
setTimeout(function(){ 
	// set same data on all nodes
	node.chunk_strategy = function(d){
		return d.split('\n');
	}
	node.chunk(data2, function(e, r){
		if(e) throw e;
		console.log(r);
	})
}, 4000);
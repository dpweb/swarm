var swarm = require('./swarm.js');

var worker1 = swarm('127.0.0.1', 2121, '192.227.139.115', 8888);

function upper(s){
   return s.toUpperCase();
}

setTimeout(function(){ 
	// distribute work
	node.work(upper, ['this', 'is', 'some', 'stuff'], function(e, r){
		if(e) throw e;
		console.log(r);
	})
}, 1000);

setTimeout(function(){ 
	// round-robin work
	node.next(upper, 'this', function(e, r){
		if(e) throw e;
		console.log(r);	
	})
	node.next(upper, 'is', function(e, r){
		if(e) throw e;
		console.log(r);	
	})
	node.next(upper, 'some', function(e, r){
		if(e) throw e;
		console.log(r);	
	})
	node.next(upper, 'stuff', function(e, r){
		if(e) throw e;
		console.log(r);	
	})
}, 2000);
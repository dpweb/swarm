var node = require('./new.js')('127.0.0.1', 2120);
var worker1 = require('./new.js')('127.0.0.1', 2121, '127.0.0.1', 2120);
var worker2 = require('./new.js')('127.0.0.1', 2122, '127.0.0.1', 2120);
var worker3 = require('./new.js')('127.0.0.1', 2123, '127.0.0.1', 2120);


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
}, 2000);
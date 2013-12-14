var swarm = require('./swarm.js');

var node = swarm('127.0.0.1', 2120);
var worker1 = swarm('127.0.0.1', 2121, '127.0.0.1', 2120);
var worker2 = swarm('127.0.0.1', 2122, '127.0.0.1', 2120);
var worker3 = swarm('127.0.0.1', 2123, '127.0.0.1', 2120);

function setdata(data){
	this.localdata = data;
	return 'SETTING ' + this.localdata;
}
function getdata(){
	return 'GETTING ' + this.localdata;
}

setTimeout(function(){ 
	// distribute work
	node.work(setdata, ['node 1 localdata', 'node 2 localdata', 'node 3 localdata'], function(e, r){
		if(e) throw e;
		console.log(r);
	})
}, 1000);

setTimeout(function(){ 
	// round-robin work
	node.next(getdata, null, function(e, r){
		if(e) throw e;
		console.log(r);	
	})
	node.next(getdata, null, function(e, r){
		if(e) throw e;
		console.log(r);	
	})
	node.next(getdata, null, function(e, r){
		if(e) throw e;
		console.log(r);	
	})
}, 2000);
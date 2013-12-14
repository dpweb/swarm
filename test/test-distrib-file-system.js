var swarm = require('./swarm.js');

var node = swarm('127.0.0.1', 2120);
var worker1 = swarm('127.0.0.1', 2121, '127.0.0.1', 2120);
var worker2 = swarm('127.0.0.1', 2122, '127.0.0.1', 2120);
var worker3 = swarm('127.0.0.1', 2123, '127.0.0.1', 2120);

var distributed_key_values = {
	"a": "1",
	"b": "2",
	"c": "3",
	"d": "4"
}

var index = {};

function saveit(kv){
	if(!this.localdata) this.localdata = {};
	kv = kv.split(':')
	this.localdata[kv[0]] = kv[1];
	return kv[0];
}

setTimeout(function(){
	for(key in distributed_key_values){
		node.next(saveit, key + ':' + distributed_key_values[key], function(e, resp){
			resp = resp.split(' ');
			index[resp[1]] = resp[0];
		});
	}
}, 2000)

setTimeout(function(){
	console.log(index)
}, 4000)
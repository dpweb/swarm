
var swarm = require('./swarm.js');

var node = swarm('127.0.0.1', 2120);
var worker1 = swarm('127.0.0.1', 2121, '127.0.0.1', 2120);
var worker2 = swarm('127.0.0.1', 2122, '127.0.0.1', 2120);
var worker3 = swarm('127.0.0.1', 2123, '127.0.0.1', 2120);

function chunk(){
	var arr = require('fs').readFileSync('bible.txt').toString().split('\n');
	var length = Math.round(arr.length/3);
	var arr1 = arr.splice(0, length).join('');
	var arr2 = arr.splice(0, length).join('');
	var arr3 = arr.slice(0).join('');
	return [arr1, arr2, arr3];
}

function count(text){
	var obj = {};
	text.split(/\s/).forEach(function(word){
		if(obj.hasOwnProperty(word)) 
			obj[word]++;
		else
			obj[word] = 1;
	})
	return JSON.stringify(obj);
}

setTimeout(function(){ 
	node.work(count, chunk(), function(e, r){
		if(e) throw e;
		for(word in r[0]){
			if(r[1].hasOwnProperty(word))
				r[0][word] = r[0][word] + r[1][word];
			else
				r[0][word] = r[1][word];
			if(r[2].hasOwnProperty(word))
				r[0][word] = r[0][word] + r[2][word];
			else
				r[0][word] = r[2][word];
		}
		console.log(r[0]);
	})
}, 1000);


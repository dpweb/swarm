var s = require('net').Socket();
var debug = process.env.debug;

module.exports = {
                send: function(data, port, host, cb){
                        var s = require('net').Socket();
                        s.on('data', function(d){
                            cb(d.toString());
                        });

                        if(!host){
                                var host = data.match(/Host..(.*)/);
                                if(host) host = host[1];
                                var host = data.match(/(http.*?) /);
                                if(host) host = require('url').parse(host[1]).host;
                        }
                        if(debug) console.log("HOST is", host);

                        s.connect(port, host);
                        if(debug) console.log('> ', data);
                        s.write(data);
                        s.end();
                },
                server: function(port, host, cb){
                        if(!cb){ cb = host; host = null; }
                        net.createServer(function(c){
                                c.on('data', function(indata){
                                        c.write(cb(indata, c));
                                })
                        }).listen(8124, host);
                }
}

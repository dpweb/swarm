var swarm = function(myip, myport, parentip, parentport){
    var me = [myip, myport], 
        parent = null,
        current = null,
        localdata = null, 
        debug = process.env.debugswarm,
        buf = require('./buf.js');

    var o = {
        "children": [],
        "curloc": 0,
        "start": function(){
            var ch = this.children;
            buf.server(myip, myport, function(data){
                var cmd = data.slice(0, 3), sdata = data.slice(3).toString();
                if(cmd.toString() === 'NEW'){
                    ch.push(sdata)
                    console.log(me, 'children is', ch);
                }
                if(cmd.toString() === 'DOL'){
                    var arr = sdata.split('DOL');
                    var func = eval('global.f = ' + arr[0]);
                    var result = f.call(o, arr[1]);
                    return me + ' ' + result;
                }
                return 'OK';
            });
        },
        "work": function(f, d, cb){
            if(!d) d = Array(this.children.length);
            var pos = 0, ch = this.children, numwkrs = d.length, dresp = [];
            if(debug) console.log('Starting job, tasks=', d.length, ' wkrs=', ch.length);
            for(var arg=0; arg < d.length; arg++){
                var wkrnum = arg < ch.length ? arg : 0;
                var ipport = ch[wkrnum].split(',');
                if(debug) console.log(arg, 'Assigning to', wkrnum, ipport)

                buf.send(ipport[0], ipport[1], "DOL" + f.toString() + "DOL" + d[arg], function(resp){
                    dresp.push(resp.toString());
                    numwkrs--; if(!numwkrs) cb(null, dresp);
                })
            }
        },
        "next": function(f, d, cb){
            var ipport = this.children[this.curloc].split(',');
            if(debug) console.log('node.next', ipport, d)
            buf.send(ipport[0], ipport[1], "DOL" + f.toString() + "DOL" + d, function(resp){
                if(debug) console.log('returning', resp.toString());
                cb(null, resp.toString());
            })
            this.curloc++;  
            //console.log(this.curloc, this.children.length-1)  
            if(this.curloc > this.children.length-1) this.curloc = 0;
        },
        "setData": function(d, cb){
            var darr = [];
            for(var i=0; i<this.children.length; i++) darr.push(d);
            this.work(function(d){
                this.localdata = d;
                return 'SET OK';
            }, darr, cb);
        },
        "chunk": function(data, cb){
            data = this.chunk_strategy(data);
            this.work(function(d){
                this.localdata = d;
                return 'SET CHUNK OK ';
            }, data, cb);         
        },
        "chunk_strategy": function(d){
            return d.split(' ');
        }
    }
    o.start();

    if(parentip || parentport){
        parent = [parentip, parentport];
        buf.send(parentip, parentport, new Buffer('NEW' + me), function(){});
        console.log('Child Node is ONLINE', me, '=>', parent);
    } else {
        console.log('Parent Node is ONLINE', me);
    }
    return o;
}

__filename !== require.main.filename ? 
        module.exports = swarm : swarm(process.argv[2], process.argv[3], process.argv[4], process.argv[5]);

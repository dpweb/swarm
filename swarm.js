var swarm = function(myip, myport, parentip, parentport){
    var me = [myip, myport], 
        parent = null, current = null, data = null, 
        debug = process.env.debugswarm,
        command = new Buffer[0, 1, 2, 3, 4, 5];
        buf = require('./buf.js');

    function getinfo(){
        var info = {};
        for(i in os) 
            info[i] = typeof(os[i])=='function' ? os[i]():os[i];
        return info;
    }

    function resp(s){
        if(s != 'OK') throw Error(s);
    }

    var o = {
        "children": [], "curloc": 0,
        "start": function(){
            var that = this;
            buf.server(myip, myport, function(data){
                var payload = data.slice(1);
                switch(data[0]){
                    case command[1]: // new incoming from child
                        that.children.push(payload);
                        buf.send(parentip, parentport, new Buffer([1] + me), resp);
                        return 'OK';
                    case command[2]: // confirm from parent
                        console.log('child is online', o.me = [ip, port]);
                        return 'OK';
                    case command[3]: // new job from parent
                        var arr = payload.toString().split('DOL');
                        var func = eval('global.f = ' + arr[0]);
                        o.result = f.call(o, arr[1]);
                        return 'OK';
                    case command[4]: // results from job
                        send(o.result);
                        return 'OK';
                    case command[5]: // status-info
                        return 'OK';
                    case else:  // invalid command
                        return;
                }
            });
            if(parentip || parentport){
                    parent = [parentip, parentport];
                    buf.send(parentip, parentport, new Buffer([1] + me), resp);
                    console.log('Child Node is ONLINE', me, '=>', parent);
            } else {
                console.log('Parent Node is ONLINE', me);
            }
            return this;
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

    return o.start();
}

__filename !== require.main.filename ?
        module.exports = swarm : swarm.apply(null, process.argv.slice(2));

var swarm = function(myip, myport, parentip, parentport){
    var me = [myip, myport], 
        parent = null,
        current = null,
        mdata = {}, 
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
                    var result = f.call(null, arr[1]);
                    return me + ' ' + result;
                }
                return 'OK';
            });
        },
        "work": function(f, d, cb){
            var pos = 0, ch = this.children, numwkrs = d.length, dresp = [];
            for(var arg=0; arg < d.length; arg++){
                var wkrnum = arg % ((d.length-1) || 1);
                var ipport = ch[wkrnum].split(',');
                //console.log(arg, ipport)
                buf.send(ipport[0], ipport[1], "DOL" + f.toString() + "DOL" + d[arg], function(resp){
                    dresp.push(resp.toString());
                    numwkrs--; if(!numwkrs) cb(null, dresp);
                })
            }
        },
        "next": function(f, d, cb){
            var ipport = this.children[this.curloc].split(',');
            buf.send(ipport[0], ipport[1], "DOL" + f.toString() + "DOL" + d, function(resp){
                cb(null, resp.toString());
            })
            this.curloc++;    
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

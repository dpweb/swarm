var smb = require('./smb/smb.js'),
    antidb = require('anti-db')(),
    os = require('os'),
    debug = process.env.debugswarm,
    children = antidb.obj('./children.json');

var sendssh = function(ip, cmd){
    var sshcmd = 'echo "'+cmd+'" | ssh root@' + ip + ' node native';
    console.log(sshcmd)
    var ps = require('child_process').exec(sshcmd, function(e, o, r){
        console.log(e, o, r);
        process.exit(0);
    });
}

var myinfo = function(){
        var info = {};
        for(i in os) 
            info[i] = typeof(os[i])=='function' ? os[i]():os[i];
        return info;
}

var args = process.argv.slice(2);
// $ node native 123.4.5.6  # new client
if(args.length === 1){
    sendssh(args[0], smb.b64message(1, myinfo()));
}

// $ node native chunk file.txt
// $ node native work "console.log(1)"
// $ node native next "console.log(1)"

process.stdin.on('data', function(msgbuffer){
    var msgin = smb.parse(new Buffer(msgbuffer.toString(), 'base64'));
    //console.log(msgin)
    switch(msgin.command){
        case 0:  // TODO
        case 1:  // new node, in master
            var client = JSON.parse(msgin.meta);
            children[client.hostname] = client;
            break;
        case 2:  // ok, in child
            break;
        case 3:  // new job, in child
            var meta = msgin.meta;
            var func = eval('global.f = ' + meta);
            o.result = f.call(o, msgin.data);
        case 4:  // accept job, in master
            getOK(msgin);
        case 5:  // job result, in master
            // handle job result
            return 'OK';
    }
})
/*
        "work": function(f, d, cb){
            if(!d) d = Array(this.children.length);
            var pos = 0, ch = this.children, numwkrs = d.length, dresp = [];
            if(debug) console.log('Starting job, tasks=', d.length, ' wkrs=', ch.length);
            for(var arg=0; arg < d.length; arg++){
                var wkrnum = arg < ch.length ? arg : 0;
                var ipport = ch[wkrnum].split(',');
                if(debug) console.log(arg, 'Assigning to', wkrnum, ipport)

                buf.send(ipport[0], ipport[1], smb.message(1, f.toString(), d[arg]), function(resp){
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
*/
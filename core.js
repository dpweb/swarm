function handler(cmd){
   console.log('in',cmd);
}
var svr = require('./httpc.js');
svr.server(2121, handler);

module.exports = function(settings){
  return {
     hash: function(buffer){
        var h = require('crypto').createHash('md5');
        h.update(buffer);
        return h.digest('hex');
     },
     create: function(name, buffer){
        
     },
     retrieve: function(name){
        return buffer;
     },
     update: function(name, buffer, pos){
     
     },
     delete: function(name){
     
     },
     join: function(ip){
     
     },
     offline: function(){
     
     }
  }
}

// parent
var cluster = require('./core.js')({port: 2120});
cluster.create

// child
var child = require('./core.js')({parent: ':2120', port: 2121});


var fs = require('fs');
var c = require('./build/config');
var b = require('./build/build');

//read version

var version = fs.readFileSync(c.versionFile, 'utf8');
b.build(version, c.packagedesc, c.indexdesc, c.dirs, c.copyFiles);

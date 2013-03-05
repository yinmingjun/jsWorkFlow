

var configuration = require('./compile/config');
var compile = require('./compile/compile');


function main() {
    var config = configuration.config;
    compile.compile(config.destFile, config.destModule, config.requireFiles);
}

main();


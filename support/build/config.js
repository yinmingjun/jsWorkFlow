
var packagedesc = { dst: './build/jsWorkFlow/package.json',
    src: '{\n' +
  '  "name": "jsworkflow",\n' +
  '  "description": "It is a workflow engine write by javascript. Support both node and client side.",\n' +
  '  "version": "%s",\n' +
  '  "author": "Yin Mingjun <yinmingjuncn@gmail.com>",\n' +
  '  "keywords": ["javascript", "jsworkflow", "workflow"],\n' +
  '  "main": "./lib/jsworkflow.js",\n' +
  '  "dependencies": {\n' +
  '     "jsoop": ">= 0.2.6" \n' +
  '  }, \n'+
  '  "repository": {"type": "git", "url": "git://github.com/yinmingjun/jsWorkFlow"}\n' +
'}'
}

var indexdesc = { dst: './build/jsworkflow/index.js',
    src: "module.exports = require('./lib/jsworkflow');"
};

var dirs = ['./build', './build/jsworkflow', './build/jsworkflow/lib'];

var copyFiles = [{ 
    src: './README.md',
    dst: './build/jsworkflow/README.md'
}, {
    src: './prebuild/jsworkflow.js',
    dst: './build/jsworkflow/lib/jsworkflow.js'
}, {
    src: './prebuild/jsworkflow-debug.js',
    dst: './build/jsworkflow/lib/jsworkflow-debug.js'
}, {
    src: './prebuild/jsworkflow_browser.js',
    dst: './build/jsworkflow/jsworkflow_browser.js'
}];

var versionFile = './version.txt';
exports.packagedesc = packagedesc;
exports.indexdesc = indexdesc;
exports.dirs = dirs;
exports.copyFiles = copyFiles;
exports.versionFile = versionFile;

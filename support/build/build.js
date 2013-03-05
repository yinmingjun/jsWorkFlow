
/**
 * Module dependencies.
 */

var fs = require('fs');
var path = require('path');
var util = require('util');

/**
* create path.
*/

function do_create_path(dirs) {

    for (var i = 0, ilen = dirs.length; i < ilen; i++) {
        var dir = dirs[i];
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }
}


/**
* copy files.
*/

function do_copy_files(copyFiles) {

    for (var i = 0, ilen = copyFiles.length; i < ilen; i++) {
        var item = copyFiles[i];
        var src = item.src;
        var dst = item.dst;

        var js = fs.readFileSync(src, 'utf8');
        fs.writeFileSync(dst, js, 'utf8');
        console.log('  \033[90mcopy file from: \033[0m\033[36m%s\033[0m -> to: \033[0m\033[36m%s\033[0m', src, dst);
    }
}


function build(version, packagedesc, indexdesc, dirs, copyFiles) {
    //create path
    do_create_path(dirs);

    //copy files
    do_copy_files(copyFiles);

    //generate package.json
    var packagejs = util.format(packagedesc.src, version);

    fs.writeFileSync(packagedesc.dst, packagejs);

    console.log('  \033[90m create : \033[0m\033[36m%s\033[0m', packagedesc.dst);

    //generate index.js
    var indexjs = indexdesc.src;
    fs.writeFileSync(indexdesc.dst, indexjs);
    console.log('  \033[90m create : \033[0m\033[36m%s\033[0m', indexdesc.dst);

}

exports.build = build;

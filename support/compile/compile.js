
/**
 * Module dependencies.
 */

var fs = require('fs');
var path = require('path');

/**
 * main entry.
 */

function compile(dstFile, dstModule, requireFiles) {
    var files = {};
    var depend = requireFiles.length;

    for (var i = 0, ilen = requireFiles.length; i < ilen; i++) {
        var item = requireFiles[i];

        var file = item.file;
        var mod = item.mod;

        if (typeof (mod) === 'undefined') {
            mod = path.basename(file, '.js');
        }

        fs.readFile(file, 'utf8', function (err, js) {
            if (err) throw err;
            console.log('  \033[90mcompile : \033[0m\033[36m%s\033[0m', file);
            files[file] = do_parse(js);

            --depend || do_compile(dstFile, dstModule, requireFiles, files); ;

        });
    }
}

/**
 * Parse the given `js`.
 */

function do_parse(js) {
  //return parseInheritance(parseConditionals(js));
    return do_parse_conditionals(js);
}

/**
 * Parse __proto__.
 */

function do_parse_inheritance(js) {
  return js
    .replace(/^ *(\w+)\.prototype\.__proto__ * = *(\w+)\.prototype *;?/gm, function(_, child, parent){
      return child + '.prototype = new ' + parent + ';\n'
        + child + '.prototype.constructor = '+ child + ';\n';
    });
}

/**
 * Parse the given `js`, currently supporting:
 * 
 *    'if' ['node' | 'browser']
 *    'end'
 * 
 */

function do_parse_conditionals(js) {
  var lines = js.split('\n')
    , len = lines.length
    , buffer = true
    , browser = false
    , buf = []
    , line
    , cond;

  for (var i = 0; i < len; ++i) {
    line = lines[i];
    if (/^ *\/\/ *if *(node|browser)/gm.exec(line)) {
      cond = RegExp.$1;
      buffer = browser = 'browser' == cond;
    } else if (/^ *\/\/ *end/.test(line)) {
      buffer = true;
      browser = false;
    } else if (browser) {
      buf.push(line.replace(/^( *)\/\//, '$1'));
    } else if (buffer) {
      buf.push(line);
    }
  }

  return buf.join('\n');
}

/**
 * Compile the files.
 */

function do_compile(dstFile, dstModule, requireFiles, files) {
  var buf = '';
  buf += 'var '+dstModule+' = (function(){\n';
  buf += '\n// CommonJS require()\n\n';
  buf += browser.require + '\n\n';
  buf += 'require.modules = {};\n\n';
  buf += 'require.resolve = ' + browser.resolve + ';\n\n';
  buf += 'require.register = ' + browser.register + ';\n\n';
  buf += 'require.relative = ' + browser.relative + ';\n\n';

  for (var i = 0, ilen = requireFiles.length; i < ilen; i++) {
      var item = requireFiles[i];

      var file = item.file;
      var js = files[file];
      var mod = item.mod;

      if (typeof (mod) === 'undefined') {
          mod = path.basename(file, '.js');
      }

      //file = file.replace('lib/', '');
      buf += '\nrequire.register("' + mod + '", function(module, exports, require){\n';
      buf += js;
      buf += '\n}); // module: ' + mod + '\n';
  } 

  buf += '\n return require("' + dstModule + '");\n})();';
  fs.writeFile(dstFile, buf, function (err) {
    if (err) throw err;
    console.log('  \033[90m create : \033[0m\033[36m%s\033[0m', dstFile);
    console.log();
  });
}

// refactored version of weepy's
// https://github.com/weepy/brequire/blob/master/browser/brequire.js

var browser = {
  
  /**
   * Require a module.
   */
  
  require: function require(p){
    if ('fs' == p) return {};
    var path = require.resolve(p)
      , mod = require.modules[path];
    if (!mod) throw new Error('failed to require "' + p + '"');
    if (!mod.exports) {
      mod.exports = {};
      mod.call(mod.exports, mod, mod.exports, require.relative(path));
    }
    return mod.exports;
  },
  
  /**
   * Resolve module path.
   */

  resolve: function(path){
    var orig = path
      , reg = path + '.js'
      , index = path + '/index.js';
    return require.modules[reg] && reg
      || require.modules[index] && index
      || orig;
  },
  
  /**
   * Return relative require().
   */

  relative: function(parent) {
    return function(p){
      if ('.' != p.substr(0, 1)) return require(p);
      
      var path = parent.split('/')
        , segs = p.split('/');
      path.pop();
      
      for (var i = 0; i < segs.length; i++) {
        var seg = segs[i];
        if ('..' == seg) path.pop();
        else if ('.' != seg) path.push(seg);
      }

      return require(path.join('/'));
    };
  },
  
  /**
   * Register a module.
   */

  register: function(path, fn){
    require.modules[path] = fn;
  }
};

//exports
exports.compile = compile;
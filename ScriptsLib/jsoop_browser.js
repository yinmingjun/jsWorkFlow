var jsoop = (function(){

// CommonJS require()

function require(p){
    if ('fs' == p) return {};
    var path = require.resolve(p)
      , mod = require.modules[path];
    if (!mod) throw new Error('failed to require "' + p + '"');
    if (!mod.exports) {
      mod.exports = {};
      mod.call(mod.exports, mod, mod.exports, require.relative(path));
    }
    return mod.exports;
  }

require.modules = {};

require.resolve = function (path){
    var orig = path
      , reg = path + '.js'
      , index = path + '/index.js';
    return require.modules[reg] && reg
      || require.modules[index] && index
      || orig;
  };

require.register = function (path, fn){
    require.modules[path] = fn;
  };

require.relative = function (parent) {
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
  };


require.register("jsoop", function(module, exports, require){
/*
 * jsoop's core source code.
 * 2013.02.22: Create By Yin Mingjun - email: yinmingjuncn@gmail.com
 *  
 * Copyright 2013,  Yin MingJun - email: yinmingjuncn@gmail.com
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 * 
 * Project is migrated from Script# Core Runtime
 * More information at http://projects.nikhilk.net/ScriptSharp
 * 
 */





///////////////////////////////////////////////////////////////////////////////
// boot code

var jsoop = {

    isUndefined: function (o) {
        return (o === undefined);
    },

    isNull: function (o) {
        return (o === null);
    },

    isNullOrUndefined: function (o) {
        return (o === null) || (o === undefined);
    },

    isValue: function (o) {
        return (o !== null) && (o !== undefined);
    }
};

///////////////////////////////////////////////////////////////////////////////
// setup root RTTI information for exists types
Object.__typeName = 'Object';
Object.__baseType = null;
Boolean.__typeName = 'Boolean';
Number.__typeName = 'Number';
String.__typeName = 'String';
Array.__typeName = 'Array';
RegExp.__typeName = 'RegExp';
Date.__typeName = 'Date';
Error.__typeName = 'Error';


///////////////////////////////////////////////////////////////////////////////
// jsoop Type System Implementation
jsoop.__ns_root = {};
jsoop.__ns_map = {};

jsoop.__class_idtr = 0;

jsoop.__gen_unique_name = function jsoop$gen_class_name(prefix, type) {
    var idtr = jsoop.__class_idtr;
    jsoop.__class_idtr++;
    return prefix + idtr;
};


jsoop.__gen_class_name = function jsoop$gen_class_name(type) {
    return jsoop.__gen_unique_name("js_class$", type);
};

jsoop.__gen_enum_name = function jsoop$gen_class_name(type) {
    return jsoop.__gen_unique_name("js_enum$", type);
};

jsoop.__gen_interface_name = function jsoop$gen_interface_name(type) {
    return jsoop.__gen_unique_name("js_interface$", type);
};

jsoop.__gen_module_name = function jsoop$gen_module_name(type) {
    return jsoop.__gen_unique_name("js_module$", type);
};

//设置TypeName，返回thisType
jsoop.setTypeName = function jsoop$setTypeName(thisType, name) {
    thisType.__typeName = name;
    return thisType;
};

jsoop.getTypeName = function jsoop$getTypeName(thisType) {
    return thisType.__typeName;
};

jsoop.getShortTypeName = function jsoop$getShortTypeName(thisType) {
    var fullName = thisType.__typeName;
    var nsIndex = fullName.lastIndexOf('.');
    if (nsIndex > 0) {
        return fullName.substr(nsIndex + 1);
    }
    return fullName;
};

jsoop.__ns = function jsoop$__ns(name) {
    this.__typeName = name;
}

jsoop.__ns.prototype = {
    __namespace: true,
    getName: function () {
        return this.__typeName;
    }
}



//register namespace
//if check is true, throw jsoop.errorExists when namespace already exists. other, return old namespace
jsoop.registerNamespace = function jsoop$registerNamespace(name, check) {

    var root = jsoop.__ns_root;
    var retval = jsoop.__ns_map[name];

    if (retval) {
        if (!!check) {
            throw jsoop.errorExists('namespace [' + name + ']');
        }
        return retval;
    }

    var ns_itor = root;
    var nameParts = name.split('.');

    for (var i = 0; i < nameParts.length; i++) {
        var part = nameParts[i];
        var ns_next = ns_itor[part];
        if (!ns_next) {
            ns_itor[part] = ns_next = new jsoop.__ns(nameParts.slice(0, i + 1).join('.'));
        }
        else {
            if ((i == (nameParts.length - 1)) && check) {
                //if all nameParts exists, throw errorExists
                throw jsoop.errorExists('namespace [' + name + ']');
            }
        }
        ns_itor = ns_next;
    }

    jsoop.__ns_map[name] = retval = ns_itor;
    return retval;
}

//require namespace
//if check is true, throw jsoop.errorNotExists when namespace not exists. other, return undefined
jsoop.ns = jsoop.namespace = function jsoop$namespace(name, check) {
    var root = jsoop.__ns_root;
    var retval = jsoop.__ns_map[name];

    if (retval) {
        return retval;
    }

    var ns_itor = root;
    var nameParts = name.split('.');

    for (var i = 0; i < nameParts.length; i++) {
        var part = nameParts[i];
        var ns_next = ns_itor[part];
        if (!ns_next && check) {
            throw jsoop.errorNotExists('namespace [' + name + ']');
        }
        ns_itor = ns_next;
    }

    jsoop.__ns_map[name] = retval = ns_itor;

    return retval;
}

//register class
jsoop.registerClass = function jsoop$registerClass(thisType, baseType, interfaceTypes, modules) {
    thisType.prototype.constructor = thisType;
    thisType.__class = true;
    thisType.__baseType = baseType || Object;

    if (jsoop.isNullOrUndefined(thisType.__typeName)) {
        thisType.__typeName = jsoop.__gen_class_name(thisType);
    }

    if (baseType || modules) {
        thisType.__prototypePending = true;
    }

    if (interfaceTypes) {
        thisType.__interfaces = [];
        for (var i = 0; i < interfaceTypes.length; i++) {
            interfaceType = interfaceTypes[i];
            jsoop.arrayAdd(thisType.__interfaces, interfaceType);
        }
    }

    if (modules) {
        thisType.__modules = [];
        for (var i = 0; i < modules.length; i++) {
            module = modules[i];
            jsoop.arrayAdd(thisType.__modules, module);
        }
    }

    return thisType;
};

jsoop.registerInterface = function jsoop$createInterface(intfType) {
    intfType.__interface = true;

    if (jsoop.isNullOrUndefined(intfType.__typeName)) {
        intfType.__typeName = jsoop.__gen_interface_name(intfType);
    }

};

jsoop.registerModule = function jsoop$createModule(modType) {
    modType.__module = true;
    if (jsoop.isNullOrUndefined(modType.__typeName)) {
        modType.__typeName = jsoop.__gen_module_name(modType);
    }

};

jsoop.registerEnum = function jsoop$createEnum(enumType, flags) {

    if (jsoop.isNullOrUndefined(enumType.__typeName)) {
        enumType.__typeName = jsoop.__gen_enum_name(enumType);
    }

    for (var field in enumType.prototype) {
        enumType[field] = enumType.prototype[field];
    }

    enumType.__enum = true;
    if (flags) {
        enumType.__flags = true;
    }
};

jsoop.setupBase = function jsoop$setupBase(thisType) {
    if (thisType.__prototypePending) {
        var baseType = thisType.__baseType;
        if (baseType) {
            if (baseType.__prototypePending) {
                jsoop.setupBase(baseType);
            }

            for (var memberName in baseType.prototype) {
                var memberValue = baseType.prototype[memberName];
                if (!thisType.prototype[memberName]) {
                    thisType.prototype[memberName] = memberValue;
                }
            }

            if (thisType.__interfaces) {
                //do nothing
            }
        }

        if (thisType.__modules) {
            var modules = thisType.__modules;
            for (var i = 0; i < modules.length; i++) {
                var module = modules[i];

                //copy method from module
                for (var memberName in module.prototype) {
                    var memberValue = module.prototype[memberName];
                    if (!thisType.prototype[memberName]) {
                        thisType.prototype[memberName] = memberValue;
                    }
                }
            }
        }

        delete thisType.__prototypePending;
    }
};

jsoop.initializeBase = function jsoop$initializeBase(thisType, instance, args) {
    if (thisType.__prototypePending) {
        jsoop.setupBase(thisType);
    }

    if (!args) {
        thisType.__baseType.apply(instance);
    }
    else {
        thisType.__baseType.apply(instance, args);
    }
};

jsoop.callBaseMethod = function jsoop$callBaseMethod(thisType, instance, name, args) {
    var baseMethod = thisType.__baseType.prototype[name];
    if (!args) {
        return baseMethod.apply(instance);
    }
    else {
        return baseMethod.apply(instance, args);
    }
};

jsoop.getBaseType = function jsoop$getBaseType(thisType) {
    return thisType.__baseType || null;
};

jsoop.getInterfaces = function jsoop$getInterfaces(thisType) {
    return thisType.__interfaces;
};

jsoop.getModules = function jsoop$getModules(thisType) {
    return thisType.__modules;
};

jsoop.isInstanceOfType = function jsoop$isInstanceOfType(instance, type) {
    if (jsoop.isNullOrUndefined(instance)) {
        return false;
    }
    if ((type == Object) || (instance instanceof type)) {
        return true;
    }

    var fromType = jsoop.getInstanceType(instance);
    return jsoop.isAssignableFrom(type, fromType);
};

jsoop.isAssignableFrom = function jsoop$isAssignableFrom(toType, fromType) {
    if ((fromType == Object) || (toType == fromType)) {
        return true;
    }
    if (toType.__class) {
        var baseType = fromType.__baseType;
        while (baseType) {
            if (toType == baseType) {
                return true;
            }
            baseType = baseType.__baseType;
        }
    }
    else if (toType.__interface) {
        var interfaces = fromType.__interfaces;
        if (interfaces && jsoop.arrayContains(interfaces, toType)) {
            return true;
        }

        var baseType = fromType.__baseType;
        while (baseType) {
            interfaces = baseType.__interfaces;
            if (interfaces && jsoop.arrayContains(interfaces, toType)) {
                return true;
            }
            baseType = baseType.__baseType;
        }
    }
    return false;
};

///////////////////////////////////////////////////////////////////////////////
// Type System Implementation Query

jsoop.isClass = function jsoop$isClass(type) {
    return (type.__class == true);
};

jsoop.isEnum = function jsoop$isEnum(type) {
    return (type.__enum == true);
};

jsoop.isFlags = function jsoop$isFlags(type) {
    return ((type.__enum == true) && (type.__flags == true));
};

jsoop.isInterface = function jsoop$isInterface(type) {
    return (type.__interface == true);
};

jsoop.isModule = function jsoop$isModule(type) {
    return (type.__module == true);
};

jsoop.getInstanceType = function jsoop$getInstanceType(instance) {
    var ctor = null;

    // NOTE: We have to catch exceptions because the constructor
    //       cannot be looked up on native COM objects
    try {
        ctor = instance.constructor;
    }
    catch (ex) {
    }
    if (!ctor || !ctor.__typeName) {
        ctor = Object;
    }
    return ctor;
};

///////////////////////////////////////////////////////////////////////////////
//Object extention

jsoop.objectClearKeys = function jsoop$objectClearKeys(d) {
    for (var n in d) {
        delete d[n];
    }
};

jsoop.objectKeyExists = function jsoop$objectKeyExists(d, key) {
    return d[key] !== undefined;
};

jsoop.objectGetKeys = function jsoop$objectGetKeys(d) {
    var keys = [];
    for (var n in d) {
        keys.push(n);
    }
    return keys;
};

jsoop.objectGetKeyCount = function jsoop$objectGetKeyCount(d) {
    var count = 0;
    for (var n in d) {
        count++;
    }
    return count;
};

///////////////////////////////////////////////////////////////////////////////
//array extention

jsoop.arrayAdd = function jsoop$arrayAdd(array, item) {
    array[array.length] = item;
};

jsoop.arrayClone = function jsoop$arrayClone(array) {
    if (array.length === 1) {
        return [array[0]];
    }
    else {
        return Array.apply(null, array);
    }
};

jsoop.arrayClear = function jsoop$arrayClear(array) {
    array.length = 0;
};

//get and remove first item
jsoop.arrayDequeue = function jsoop$arrayDequeue(array) {
    return array.shift();
};

//put item to array end
jsoop.arrayEnqueue = function jsoop$arrayEnqueue(array, item) {
    array.push(item);
};

//get [0] item
jsoop.arrayPeek = function jsoop$arrayPeek(array) {
    if (array.length) {
        return array[0];
    }
    return null;
};

jsoop.arrayPush = function jsoop$arrayPush(array, item) {
    array.push(item);
};

jsoop.arrayPop = function jsoop$arrayPop(array) {
    var item = array.pop();
    return item;
};

jsoop.arrayIndexOf = function jsoop$arrayIndexOf(array, item, startIndex) {
    array = array || [];
    startIndex = startIndex || 0;
    var length = array.length;
    if (length) {
        for (var index = startIndex; index < length; index++) {
            if (array[index] === item) {
                return index;
            }
        }
    }
    return -1;
};

jsoop.arrayContains = function jsoop$arrayContains(array, item) {
    array = array || [];
    var index = -1;
    if (array.indexOf) {
        index = array.indexOf(item);
    }
    else {
        index = jsoop.arrayIndexOf(array, item);
    }
    return (index >= 0);
};

jsoop.arrayRemoveAt = function jsoop$arrayRemoveAt(array, index) {
    array = array || [];
    array.splice(index, 1);
};

jsoop.arrayRemove = function jsoop$arrayRemove(array, item) {
    var index = jsoop.arrayIndexOf(array, item);
    if (index >= 0) {
        array.splice(index, 1);
        return true;
    }
    return false;
};

///////////////////////////////////////////////////////////////////////////////
//string extention

jsoop.stringIsNullOrEmpty = function jsoop$stringIsNullOrEmpty(s) {
    return !s || !s.length;
};

jsoop.stringCompare = function jsoop$stringCompare(s1, s2, ignoreCase) {
    if (ignoreCase) {
        if (s1) {
            s1 = s1.toUpperCase();
        }
        if (s2) {
            s2 = s2.toUpperCase();
        }
    }

    s1 = s1 || '';
    s2 = s2 || '';

    if (s1 == s2) {
        return 0;
    }
    if (s1 < s2) {
        return -1;
    }
    return 1;
};

//join all string into one
jsoop.stringConcat = function jsoop$stringConcat() {
    if (arguments.length === 2) {
        return arguments[0] + arguments[1];
    }
    return Array.prototype.join.call(arguments, '');
};

jsoop.stringInsert = function jsoop$stringInsert(str, index, value) {
    if (!value) {
        return str;
    }
    if (!index) {
        return value + str;
    }
    var s1 = this.substr(0, index);
    var s2 = this.substr(index);
    return s1 + value + s2;
};

jsoop.stringRemove = function jsoop$stringRemove(str, index, count) {

    str = str || '';

    if (!count || ((index + count) > str.length)) {
        return str.substr(0, index);
    }
    return str.substr(0, index) + str.substr(index + count);
};

jsoop.stringReplaceAll = function jsoop$stringReplaceAll(str, oldValue, newValue) {
    str = str || '';
    newValue = newValue || '';
    return str.split(oldValue).join(newValue);
};

jsoop.stringStartsWith = function jsoop$stringStartsWith(str, prefix) {
    str = str || '';
    if (!prefix.length) {
        return true;
    }
    if (prefix.length > str.length) {
        return false;
    }
    return (str.substr(0, prefix.length) == prefix);
};

jsoop.stringEndsWith = function jsoop$stringEndsWith(str, suffix) {
    str = str || '';
    if (!suffix.length) {
        return true;
    }
    if (suffix.length > str.length) {
        return false;
    }
    return (str.substr(str.length - suffix.length) == suffix);
};


jsoop.stringTrimEnd = function jsoop$stringTrimEnd(str) {
    str = str || '';
    return str.replace(/\s*$/, '');
};

jsoop.stringTrimStart = function jsoop$stringTrimStart(str) {
    str = str || '';
    return str.replace(/^\s*/, '');
};

jsoop.stringTrim = function jsoop$stringTrim(str) {
    str = str || '';
    return jsoop.stringTrimEnd(jsoop.stringTrimStart(str));
};

jsoop.stringEquals = function jsoop$stringEquals(s1, s2, ignoreCase) {
    return jsoop.stringCompare(s1, s2, ignoreCase) == 0;
};

jsoop.stringFromChar = function jsoop$stringFromChar(ch, count) {
    var s = ch;
    for (var i = 1; i < count; i++) {
        s += ch;
    }
    return s;
};

jsoop.stringIndexOfAny = function jsoop$stringIndexOfAny(str, chars, startIndex, count) {
    str = str || '';
    var length = str.length;
    if (!length) {
        return -1;
    }

    startIndex = startIndex || 0;
    count = count || length;

    var endIndex = startIndex + count - 1;
    if (endIndex >= length) {
        endIndex = length - 1;
    }

    for (var i = startIndex; i <= endIndex; i++) {
        if (chars.indexOf(str.charAt(i)) >= 0) {
            return i;
        }
    }
    return -1;
};

jsoop.stringLastIndexOfAny = function jsoop$stringLastIndexOfAny(str, chars, startIndex, count) {
    str = str || '';
    var length = str.length;
    if (!length) {
        return -1;
    }

    startIndex = startIndex || length - 1;
    count = count || length;

    var endIndex = startIndex - count + 1;
    if (endIndex < 0) {
        endIndex = 0;
    }

    for (var i = startIndex; i >= endIndex; i--) {
        if (chars.indexOf(str.charAt(i)) >= 0) {
            return i;
        }
    }
    return -1;
};

///////////////////////////////////////////////////////////////////////////////
//Error extention
jsoop._errorCreate = function jsoop$_errorCreate(message, errorInfo) {
    var err = new Error(message);
    err.message = message;
    if (errorInfo) {
        for (var v in errorInfo) {
            err[v] = errorInfo[v];
        }
    }

    jsoop._popStackFrame(err);
    return err;
};

jsoop._popStackFrame = function jsoop$_popStackFrame(err) {
    if (jsoop.isNullOrUndefined(err.stack) ||
        jsoop.isNullOrUndefined(err.fileName) ||
        jsoop.isNullOrUndefined(err.lineNumber)) {
        return;
    }

    var stackFrames = err.stack.split('\n');
    var currentFrame = stackFrames[0];
    var pattern = err.fileName + ':' + err.lineNumber;
    while (!jsoop.isNullOrUndefined(currentFrame) &&
           currentFrame.indexOf(pattern) === -1) {
        stackFrames.shift();
        currentFrame = stackFrames[0];
    }

    var nextFrame = stackFrames[1];
    if (isNullOrUndefined(nextFrame)) {
        return;
    }

    var nextFrameParts = nextFrame.match(/@(.*):(\d+)$/);
    if (jsoop.isNullOrUndefined(nextFrameParts)) {
        return;
    }

    stackFrames.shift();
    err.stack = stackFrames.join("\n");
    err.fileName = nextFrameParts[1];
    err.lineNumber = parseInt(nextFrameParts[2]);
};

jsoop.errorArgument = function jsoop$errorArgument(paramName, message) {
    var displayMessage = "jsoop.errorArgument: " + (message ? message : "");
    if (paramName) {
        displayMessage += "\nparamName:" + paramName;
    }
    var err = jsoop._errorCreate(displayMessage, { name: "jsoop.errorArgument", paramName: paramName });
    jsoop._popStackFrame(err);
    return err;
};

jsoop.errorArgumentNull = function jsoop$errorArgumentNull(paramName, message) {

    var displayMessage = "jsoop.errorArgumentNull: " + (message ? message : "");
    if (paramName) {
        displayMessage += "\nparamName:" + paramName;
    }
    var err = jsoop._errorCreate(displayMessage, { name: "jsoop.errorArgumentNull", paramName: paramName });
    jsoop._popStackFrame(err);
    return err;
};

jsoop.errorArgumentOutOfRange = function jsoop$errorArgumentOutOfRange(paramName, actualValue, message) {
    var displayMessage = "jsoop.errorArgumentOutOfRange: " + (message ? message : "");
    if (paramName) {
        displayMessage += "\nparamName:" + paramName;
    }
    if (typeof (actualValue) !== "undefined" && actualValue !== null) {
        displayMessage += "\nactualValue:" + actualValue;
    }
    var err = jsoop._errorCreate(displayMessage, {
        name: "jsoop.errorArgumentOutOfRange",
        paramName: paramName,
        actualValue: actualValue
    });
    jsoop._popStackFrame(err);
    return err;
};

jsoop.errorArgumentType = function jsoop$errorArgumentType(paramName, actualType, expectedType, message) {
    var displayMessage = "jsoop.errorArgumentType: ";
    if (message) {
        displayMessage += message;
    }
    else if (actualType && expectedType) {
        displayMessage += 'actualType:[' + jsoop.getTypeName(actualType) + ']'
            + ' expectedType:[' + jsoop.getTypeName(expectedType) + ']';
    }
    else {
        displayMessage += 'Object cannot be converted!';
    }
    if (paramName) {
        displayMessage += "\nparamName:" + paramName;
    }
    var err = jsoop._errorCreate(displayMessage, {
        name: "Sys.ArgumentTypeException",
        paramName: paramName,
        actualType: actualType,
        expectedType: expectedType
    });
    jsoop._popStackFrame(err);
    return err;
};

jsoop.errorArgumentUndefined = function jsoop$errorArgumentUndefined(paramName, message) {
    var displayMessage = "jsoop.errorArgumentUndefined: " + (message ? message : "");
    if (paramName) {
        displayMessage += "\nparamName:" + paramName;
    }
    var err = jsoop._errorCreate(displayMessage, { name: "jsoop.errorArgumentUndefined", paramName: paramName });
    jsoop._popStackFrame(err);
    return err;
};

jsoop.errorFormat = function jsoop$errorFormat(message) {
    var displayMessage = "jsoop.errorFormat: " + (message ? message : "");
    var err = jsoop._errorCreate(displayMessage, { name: 'jsoop.errorFormat' });
    jsoop._popStackFrame(err);
    return err;
};

jsoop.errorInvalidOperation = function jsoop$errorInvalidOperation(message) {
    var displayMessage = "jsoop.errorInvalidOperation: " + (message ? message : '');
    var err = jsoop._errorCreate(displayMessage, { name: 'jsoop.errorInvalidOperation' });
    jsoop._popStackFrame(err);
    return err;
};

jsoop.errorNotImplemented = function jsoop$errorNotImplemented(message) {
    var displayMessage = "jsoop.errorNotImplemented: " + (message ? message : '');
    var err = jsoop._errorCreate(displayMessage, { name: 'jsoop.errorNotImplemented' });
    jsoop._popStackFrame(err);
    return err;
};

jsoop.errorParameterCount = function jsoop$errorParameterCount(message) {
    var displayMessage = "jsoop.errorParameterCount: " + (message ? message : '');
    var err = jsoop._errorCreate(displayMessage, { name: 'jsoop.errorParameterCount' });
    jsoop._popStackFrame(err);
    return err;
};

jsoop.errorExists = function jsoop$errorExists(message) {
    var displayMessage = "jsoop.errorExists: " + (message ? message : '');
    var err = jsoop._errorCreate(displayMessage, { name: 'jsoop.errorExists' });
    jsoop._popStackFrame(err);
    return err;
};

jsoop.errorNotExists = function jsoop$errorNotExists(message) {
    var displayMessage = "jsoop.errorNotExists: " + (message ? message : '');
    var err = jsoop._errorCreate(displayMessage, { name: 'jsoop.errorNotExists' });
    jsoop._popStackFrame(err);
    return err;
};


///////////////////////////////////////////////////////////////////////////////
//createDelegate
//bind class instance and class method
jsoop.createDelegate = function jsoop$createDelegate(instance, method) {
    return function () {
        return method.apply(instance, arguments);
    }
};

///////////////////////////////////////////////////////////////////////////////
//EventArgs class
jsoop.EventArgs = function jsoop_EventArgs() { };

jsoop.registerClass(jsoop.setTypeName(jsoop.EventArgs, 'jsoop.EventArgs'));

jsoop.EventArgs.Empty = new jsoop.EventArgs();


///////////////////////////////////////////////////////////////////////////////
//EventHandlerList class
jsoop.EventHandlerList = function jsoop_EventHandlerList() {
    this._list = {};
};

function jsoop_EventHandlerList$_addHandler(id, handler) {
    jsoop.arrayAdd(this._getEvent(id, true), handler);
}

function jsoop_EventHandlerList$addHandler(id, handler) {
    this._addHandler(id, handler);
}

function jsoop_EventHandlerList$_removeHandler(id, handler) {
    var evt = this._getEvent(id);
    if (!evt) return;
    jsoop.arrayRemove(evt, handler);
}

function jsoop_EventHandlerList$removeHandler(id, handler) {
    this._removeHandler(id, handler);
}

function jsoop_EventHandlerList$getHandler(id) {
    var evt = this._getEvent(id);
    if (!evt || (evt.length === 0)) return null;
    evt = jsoop.arrayClone(evt);
    return function (source, args) {
        for (var i = 0, l = evt.length; i < l; i++) {
            evt[i](source, args);
        }
    };
}

function jsoop_EventHandlerList$_getEvent(id, create) {
    if (!this._list[id]) {
        if (!create) return null;
        this._list[id] = [];
    }
    return this._list[id];
}

function jsoop_EventHandlerList$raiseEvent(id, source, args) {
    var handler = this.getHandler(id);

    if (handler) {
        handler(source, args);
    }
}

jsoop.EventHandlerList.prototype = {
    _addHandler: jsoop_EventHandlerList$_addHandler,
    addHandler: jsoop_EventHandlerList$addHandler,
    _removeHandler: jsoop_EventHandlerList$_removeHandler,
    removeHandler: jsoop_EventHandlerList$removeHandler,
    getHandler: jsoop_EventHandlerList$getHandler,
    _getEvent: jsoop_EventHandlerList$_getEvent,
    raiseEvent: jsoop_EventHandlerList$raiseEvent
};

jsoop.registerClass(jsoop.setTypeName(jsoop.EventHandlerList, 'jsoop.EventHandlerList'));

///////////////////////////////////////////////////////////////////////////////
//exports function
//ignore all member start with "_"
jsoop.Exports = function jsoop$Exports(dict, exports) {
    for (var key in jsoop) {
        if (!jsoop.hasOwnProperty(key)) {
            continue;
        }

        if (jsoop.stringStartsWith(key, "_")) {
            continue;
        }

        exports[key] = jsoop[key];
    }

};

//exports module symbols
jsoop.Exports(jsoop, exports);



}); // module: jsoop

 return require("jsoop");
})();
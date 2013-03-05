/*
* jsWorkFlow's core source code.
* 2013.01.17: Create By Yin Mingjun - email: yinmingjuncn@gmail.com
* 
* Copyright 2012,  Yin MingJun - email: yinmingjuncn@gmail.com
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
*/

//require namsepace
var jsWorkFlow = jso.registerNamespace('jsWorkFlow');

//////////////////////////////////////////////////////////////////////////////////////////
//NullLogger，提供jsWorkFlow的默认的LOG
//
jsWorkFlow.NullLogger = function jsWorkFlow_NullLogger() {
};

//提供一个空实现，什么都不做
function jsWorkFlow_NullLogger$dummy() {
}

jsWorkFlow.NullLogger.prototype = {
    trace: jsWorkFlow_NullLogger$dummy,
    debug: jsWorkFlow_NullLogger$dummy,
    info: jsWorkFlow_NullLogger$dummy,
    warn: jsWorkFlow_NullLogger$dummy,
    error: jsWorkFlow_NullLogger$dummy,
    fatal: jsWorkFlow_NullLogger$dummy
};

jso.registerClass(jso.setTypeName(jsWorkFlow.NullLogger, 'jsWorkFlow.NullLogger'));

//////////////////////////////////////////////////////////////////////////////////////////
//ConsoleLogger，提供jsWorkFlow的默认的LOG
//
jsWorkFlow.ConsoleLogger = function jsWorkFlow_ConsoleLogger() {
};

function jsWorkFlow_ConsoleLogger$_log(level, message) {
    console.log('[' + level + ']+%s', message);
}

function jsWorkFlow_ConsoleLogger$trace(message) {
    this._log('trace', message);
}
function jsWorkFlow_ConsoleLogger$debug(message) {
    this._log('debug', message);
}
function jsWorkFlow_ConsoleLogger$info(message) {
    this._log('info', message);
}
function jsWorkFlow_ConsoleLogger$warn(message) {
    this._log('warn', message);
}
function jsWorkFlow_ConsoleLogger$error(message) {
    this._log('error', message);
}
function jsWorkFlow_ConsoleLogger$fatal(message) {
    this._log('fatal', message);
}

jsWorkFlow.ConsoleLogger.prototype = {
    _log: jsWorkFlow_ConsoleLogger$_log,
    trace: jsWorkFlow_ConsoleLogger$trace,
    debug: jsWorkFlow_ConsoleLogger$debug,
    info: jsWorkFlow_ConsoleLogger$info,
    warn: jsWorkFlow_ConsoleLogger$warn,
    error: jsWorkFlow_ConsoleLogger$error,
    fatal: jsWorkFlow_ConsoleLogger$fatal
};

jso.registerClass(jso.setTypeName(jsWorkFlow.ConsoleLogger, 'jsWorkFlow.ConsoleLogger'));


//////////////////////////////////////////////////////////////////////////////////////////
//jsWorkFlow的LOG的适配
//
//TO 开发者：
//    LOG类用于适配jsWorkFlow对外部LOG体系的依赖，并对内提供LOG的基础API
//
var _jwf$logger = null;

function _jwf$config_log() {
    var log = null;

    //log4javascript的适配
    if (typeof (log4javascript) !== "undefined") {
        var log = log4javascript.getLogger();

        var popUpAppender = new log4javascript.PopUpAppender();
        var popUpLayout = new log4javascript.PatternLayout("%d{HH:mm:ss} %-5p - %m%n");
        popUpAppender.setLayout(popUpLayout);
        log.addAppender(popUpAppender);

    }
//    else if ((typeof (console) != 'undefined') && (typeof (console.log) != 'undefined')) {
//        log = new jsWorkFlow.ConsoleLogger();
//    }
    else {
        //如果没有log4javascript，使用NullLogger来替换
        log = new jsWorkFlow.NullLogger();
    }

    _jwf$logger = log;
}

//取全局的LOG
function jwf$getLogger() {
    return _jwf$logger;
}

//config log here
_jwf$config_log();


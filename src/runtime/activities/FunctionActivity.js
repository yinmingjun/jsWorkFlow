/*
* jsWorkFlow's core source code.
* 2012.03.22: Create By Yin Mingjun - email: yinmingjuncn@gmail.com
* 
* Copyright 2012,  Yin MingJun - email: yinmingjuncn@gmail.com
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
*/

Type.registerNamespace('jsWorkFlow.Activities');

//////////////////////////////////////////////////////////////////////////////////////////
//FunctionActivityEventArgs，提供jsWorkFlow的FunctionActivity的事件响应参数
//
// TO 开发者：
//
jsWorkFlow.Activities.FunctionActivityEventArgs = function jsWorkFlow_Activities_FunctionActivityEventArgs(context, callbackData) {
    jsWorkFlow.Activities.FunctionActivityEventArgs.initializeBase(this, [context, callbackData]);
};

function jsWorkFlow_Activities_FunctionActivityEventArgs$dispose() {
    jsWorkFlow.Activities.FunctionActivityEventArgs.callBaseMethod(this, 'dispose');
}

function jsWorkFlow_Activities_FunctionActivityEventArgs$get_callbackData() {
    return this.get_data();
}

jsWorkFlow.Activities.FunctionActivityEventArgs.prototype = {
    dispose: jsWorkFlow_Activities_FunctionActivityEventArgs$dispose,
    //property
    get_callbackData: jsWorkFlow_Activities_FunctionActivityEventArgs$get_callbackData
};

jsWorkFlow.Activities.FunctionActivityEventArgs.registerClass('jsWorkFlow.Activities.FunctionActivityEventArgs', jsWorkFlow.ActivityEventArgs);


//////////////////////////////////////////////////////////////////////////////////////////
//FunctionActivity，将function call封装到一个activity之中
//
//TO 开发者：
//    function的调用形式为function fun(FunctionActivityEventArgs) { ... }。
//    load & save SerializeContext目前只支持具名函数的序列化&恢复
//
jsWorkFlow.Activities.FunctionActivity = function jsWorkFlow_Activities_FunctionActivity(func, callbackData) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.FunctionActivity create!");

    this._func = func;
    this._callbackData = callbackData;
    jsWorkFlow.Activities.FunctionActivity.initializeBase(this);
};

function jsWorkFlow_Activities_FunctionActivity$dispose() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.FunctionActivity dispose!");

    jsWorkFlow.Activities.FunctionActivity.callBaseMethod(this, 'dispose');
}

function jsWorkFlow_Activities_FunctionActivity$get_func() {
    return this._func;
}

function jsWorkFlow_Activities_FunctionActivity$set_func(value) {
    this._func = value;
}

//activity的恢复****目前只支持具名函数的序列化&恢复****
function jsWorkFlow_Activities_FunctionActivity$loadSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.FunctionActivity loadSerializeContext!");


    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== this.getType().getName()) {
        throw Error.invalidOperation("loadSerializeContext missmatch type!");
    }

    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jsWorkFlow.Activities.FunctionActivity.callBaseMethod(this, 'loadSerializeContext', [baseSerializeContext]);

    //恢复自身
    this.set_func(eval(serializeContext['func']));
}

//activity的序列化****目前只支持具名函数的序列化&恢复****
function jsWorkFlow_Activities_FunctionActivity$saveSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.FunctionActivity saveSerializeContext!");


    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = this.getType().getName();

    //保存自身
    var func = this.get_func();
    var funcName = "";

    if (func) {
        var funcBody = func.toString();
        funcName = funcBody.substring(funcBody.indexOf("function")+8, funcBody.indexOf("("));
    }
    serializeContext['func'] = funcName;

    //保存base
    var baseSerializeContext = {};

    jsWorkFlow.Activities.FunctionActivity.callBaseMethod(this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}

//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_FunctionActivity$execute(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.FunctionActivity execute!");

    //执行基类execute方法，会进入start状态
    jsWorkFlow.Activities.FunctionActivity.callBaseMethod(this, 'execute', [context]);

    //同步执行function
    var eventArgs = new jsWorkFlow.Activities.FunctionActivityEventArgs(context, this._callbackData);

    var result = this._func(eventArgs);

    //将执行结果放到context之中
    context.set_result(result);

    //执行完毕，结束activity
    $jwf.endActivity(context);
}

jsWorkFlow.Activities.FunctionActivity.prototype = {
    _func: null,
    _callbackData: null,
    dispose: jsWorkFlow_Activities_FunctionActivity$dispose,
    //property
    get_func: jsWorkFlow_Activities_FunctionActivity$get_func,
    set_func: jsWorkFlow_Activities_FunctionActivity$set_func,
    //method
    execute: jsWorkFlow_Activities_FunctionActivity$execute
};

jsWorkFlow.Activities.FunctionActivity.registerClass('jsWorkFlow.Activities.FunctionActivity', jsWorkFlow.Activity);



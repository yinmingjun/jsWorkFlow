/*
* jsWorkFlow's core source code.
* 2012.03.30: Create By Yin Mingjun - email: yinmingjuncn@gmail.com
* 
* Copyright 2012,  Yin MingJun - email: yinmingjuncn@gmail.com
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
*/

//require namsepace
//jsWorkFlow.Activities namespace registed at core
jsoop.ns('jsWorkFlow.Activities', true);
var jsWorkFlow = jsoop.ns('jsWorkFlow');

//////////////////////////////////////////////////////////////////////////////////////////
//EvalExprActivity
//
//TO 开发者：
//    执行一个字符串表示的javascript表达式，并返回其执行结果。
//    对于动态语言，天然存在的表达式的执行eval是其自然的优势，将其引入到activity之中会丰富
//workflow的表达能力。
//
jsWorkFlow.Activities.EvalExprActivity = function jsWorkFlow_Activities_EvalExprActivity(expr) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.EvalExprActivity create!");

    jsoop.initializeBase(jsWorkFlow.Activities.EvalExprActivity, this);

    this.set_expr(expr);
};

function jsWorkFlow_Activities_EvalExprActivity$dispose() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.EvalExprActivity dispose!");

    jsoop.callBaseMethod(jsWorkFlow.Activities.EvalExprActivity, this, 'dispose');
}

function jsWorkFlow_Activities_EvalExprActivity$get_expr() {
    return this._expr;
}

function jsWorkFlow_Activities_EvalExprActivity$set_expr(value) {
    if (typeof (value) === "string") {
        this._expr = value;
    } else {
        if ((typeof (value) === "undefined") || (value === null)) {
            this._expr = "";
        }
        else {
            throw jsoop.errorInvalidOperation();
        }
    }
}

//activity的恢复
function jsWorkFlow_Activities_EvalExprActivity$loadSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.EvalExprActivity loadSerializeContext!");


    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== 'jsWorkFlow.Activities.EvalExprActivity') {
        throw jsoop.errorInvalidOperation("loadSerializeContext missmatch type!");
    }

    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jsoop.callBaseMethod(jsWorkFlow.Activities.EvalExprActivity, this, 'loadSerializeContext', [baseSerializeContext]);

    //恢复自身
    this.set_expr(serializeContext['expr']);
}

//activity的序列化
function jsWorkFlow_Activities_EvalExprActivity$saveSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.EvalExprActivity saveSerializeContext!");


    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = 'jsWorkFlow.Activities.EvalExprActivity';

    //保存自身
    serializeContext['expr'] = this.get_expr();

    //保存base
    var baseSerializeContext = {};

    jsoop.callBaseMethod(jsWorkFlow.Activities.EvalExprActivity, this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}

//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_EvalExprActivity$execute(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.EvalExprActivity execute!");


    jsoop.callBaseMethod(jsWorkFlow.Activities.EvalExprActivity, this, 'execute', [context]);

    //如果有表达式，执行，并将结果保存到context之中
    if (this._expr.length > 0) {
        var result = eval(this._expr);

        context.set_result(result);
    }

    //执行完毕，结束activity
    $jwf.endActivity(context);
}

jsWorkFlow.Activities.EvalExprActivity.prototype = {
    _expr: null,
    dispose: jsWorkFlow_Activities_EvalExprActivity$dispose,
    //property
    get_expr: jsWorkFlow_Activities_EvalExprActivity$get_expr,
    set_expr: jsWorkFlow_Activities_EvalExprActivity$set_expr,
    //method
    loadSerializeContext: jsWorkFlow_Activities_EvalExprActivity$loadSerializeContext,
    saveSerializeContext: jsWorkFlow_Activities_EvalExprActivity$saveSerializeContext,
    execute: jsWorkFlow_Activities_EvalExprActivity$execute
};

jsoop.registerClass(
    jsoop.setTypeName(jsWorkFlow.Activities.EvalExprActivity, 'jsWorkFlow.Activities.EvalExprActivity'), 
    jsWorkFlow.Activity);



/*
* jsWorkFlow's core source code.
* 2013.01.07: Create By Yin Mingjun - email: yinmingjuncn@gmail.com
* 
* Copyright 2013,  Yin MingJun - email: yinmingjuncn@gmail.com
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
*/

//require namsepace
//jsWorkFlow.Activities namespace registed at core
jso.ns('jsWorkFlow.Activities', true);
var jsWorkFlow = jso.ns('jsWorkFlow');


//////////////////////////////////////////////////////////////////////////////////////////
//RaiseExceptionActivity
//
//TO 开发者：
//    一个RaiseExceptionActivity，用于发布一个异常，发布的异常可以通过TryCatchActivity拦截。
//
jsWorkFlow.Activities.RaiseExceptionActivity = function jsWorkFlow_Activities_RaiseExceptionActivity(exceptionActivity) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.RaiseExceptionActivity create!");


    jso.initializeBase(jsWorkFlow.Activities.RaiseExceptionActivity, this);

    this._exceptionActivity = exceptionActivity;
    this._doEvalExceptionActivityCompleteHandler = jso.createDelegate(this, this.doEvalExceptionActivityCompleteHandler);

};

function jsWorkFlow_Activities_RaiseExceptionActivity$dispose() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.RaiseExceptionActivity dispose!");

    jso.callBaseMethod(jsWorkFlow.Activities.RaiseExceptionActivity, this, 'dispose');
}

function jsWorkFlow_Activities_RaiseExceptionActivity$get_exceptionActivity() {
    return this._exceptionActivity;
}

function jsWorkFlow_Activities_RaiseExceptionActivity$set_exceptionActivity(value) {
    this._exceptionActivity = value;
}

//activity的恢复
function jsWorkFlow_Activities_RaiseExceptionActivity$loadSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.RaiseExceptionActivity loadSerializeContext!");

    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== 'jsWorkFlow.Activities.RaiseExceptionActivity') {
        throw jso.errorInvalidOperation("loadSerializeContext missmatch type!");
    }


    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jso.callBaseMethod(jsWorkFlow.Activities.RaiseExceptionActivity, this, 'loadSerializeContext', [baseSerializeContext]);

    //恢复自身
    var exceptionActivitySC = serializeContext["exceptionActivity"];
    var exceptionActivity = $jwf.loadActivity(exceptionActivitySC);
    this.set_exceptionActivity(exceptionActivity);
}

//activity的序列化
function jsWorkFlow_Activities_RaiseExceptionActivity$saveSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.RaiseExceptionActivity saveSerializeContext!");

    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = 'jsWorkFlow.Activities.RaiseExceptionActivity';

    //保存自身
    var exceptionActivity = this.get_exceptionActivity();
    serializeContext["exceptionActivity"] = $jwf.saveActivity(exceptionActivity);

    //保存base
    var baseSerializeContext = {};

    jso.callBaseMethod(jsWorkFlow.Activities.RaiseExceptionActivity, this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}

function jsWorkFlow_Activities_RaiseExceptionActivity$doEvalExceptionActivity(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.RaiseExceptionActivity doEvalExceptionActivity!");


    //如果没有设置条件，取值为null
    var activity = this._exceptionActivity;

    if (!activity) {
        //使用null来驱动doRaiseException执行
        this.doRaiseException(context, null, 0);
        return;
    }

    var application = context.get_application();
    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, activity, context);

    activityExecutor.add_postComplete(this._doEvalExceptionActivityCompleteHandler);

    //OK, kick activityExecutor to run!
    activityExecutor.execute();
}

function jsWorkFlow_Activities_SwitchActivity$doEvalExceptionActivityCompleteHandler(sender, eventArgs) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.RaiseExceptionActivity doEvalExceptionActivityCompleteHandler!");

    var context = eventArgs.get_context();
    var executor = context.get_executor();
    var parentContext = executor.get_parentContext();

    //从context取执行结果
    var exceptionResult = context.get_result();

    log.debug("exceptionResult is:[" + exceptionResult + "]");

    //将condition传递给doEvalCaseCondition继续执行
    this.doRaiseException(parentContext, exceptionResult, 0);
}

function jsWorkFlow_Activities_SwitchActivity$doRaiseException(context, exceptionResult) {
    //结束context的执行，并引发异常
    //直接抛出异常，异常产生的源不一定会在正确的context上，因此需要使用$jwf.raiseError
    $jwf.raiseError(context, exceptionResult);

}

//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_RaiseExceptionActivity$execute(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.RaiseExceptionActivity execute!");

    jso.callBaseMethod(jsWorkFlow.Activities.RaiseExceptionActivity, this, 'execute', [context]);

    //获取异常信息，并抛出异常
    this.doEvalExceptionActivity(context);

    //会使当前的activity进入到error状态
}

jsWorkFlow.Activities.RaiseExceptionActivity.prototype = {
    _exceptionActivity: null,
    _doEvalExceptionActivityCompleteHandler: null,
    dispose: jsWorkFlow_Activities_RaiseExceptionActivity$dispose,
    //property
    get_exceptionActivity: jsWorkFlow_Activities_RaiseExceptionActivity$get_exceptionActivity,
    set_exceptionActivity: jsWorkFlow_Activities_RaiseExceptionActivity$set_exceptionActivity,
    //method
    loadSerializeContext: jsWorkFlow_Activities_RaiseExceptionActivity$loadSerializeContext,
    saveSerializeContext: jsWorkFlow_Activities_RaiseExceptionActivity$saveSerializeContext,
    doEvalExceptionActivity: jsWorkFlow_Activities_RaiseExceptionActivity$doEvalExceptionActivity,
    doEvalExceptionActivityCompleteHandler: jsWorkFlow_Activities_SwitchActivity$doEvalExceptionActivityCompleteHandler,
    doRaiseException: jsWorkFlow_Activities_SwitchActivity$doRaiseException,
    execute: jsWorkFlow_Activities_RaiseExceptionActivity$execute
};

jso.registerClass(
    jso.setTypeName(jsWorkFlow.Activities.RaiseExceptionActivity, 'jsWorkFlow.Activities.RaiseExceptionActivity'), 
    jsWorkFlow.Activity);


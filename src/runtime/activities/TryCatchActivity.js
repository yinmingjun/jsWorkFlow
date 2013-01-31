/*
* jsWorkFlow's core source code.
* 2013.01.07: Create By Yin Mingjun - email: yinmingjuncn@gmail.com
* 
* Copyright 2013,  Yin MingJun - email: yinmingjuncn@gmail.com
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
*/

Type.registerNamespace('jsWorkFlow.Activities');

//TODO;
//    Catch exception of activity
//////////////////////////////////////////////////////////////////////////////////////////
//TryCatchActivity
//
//TO 开发者：
//    TryCatchActivity，用于俘获运行期的异常，可以结合RaiseExceptionActivity使用。
//
jsWorkFlow.Activities.TryCatchActivity = function jsWorkFlow_Activities_TryCatchActivity(tryActivity, catchActivity) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.TryCatchActivity create!");


    jsWorkFlow.Activities.TryCatchActivity.initializeBase(this);

    this._tryActivity = tryActivity;
    this._catchActivity = catchActivity;

    this._doEvalTryCompleteHandler = Function.createDelegate(this, this.doEvalTryCompleteHandler);
    this._doEvalTryErrorHandler = Function.createDelegate(this, this.doEvalTryErrorHandler);
    this._doEvalTryErrorCompleteHandler = Function.createDelegate(this, this.doEvalTryErrorCompleteHandler);
    this._doEvalCatchCompleteHandler = Function.createDelegate(this, this.doEvalCatchCompleteHandler);

};

function jsWorkFlow_Activities_TryCatchActivity$dispose() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.TryCatchActivity dispose!");

    jsWorkFlow.Activities.TryCatchActivity.callBaseMethod(this, 'dispose');
}


function jsWorkFlow_Activities_TryCatchActivity$get_tryActivity() {
    return this._tryActivity;
}

function jsWorkFlow_Activities_TryCatchActivity$set_tryActivity(value) {
    this._tryActivity = value;
}

function jsWorkFlow_Activities_TryCatchActivity$get_catchActivity() {
    return this._catchActivity;
}

function jsWorkFlow_Activities_TryCatchActivity$set_catchActivity(value) {
    this._catchActivity = value;
}

//activity的恢复
function jsWorkFlow_Activities_TryCatchActivity$loadSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.TryCatchActivity loadSerializeContext!");

    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== this.getType().getName()) {
        throw Error.invalidOperation("loadSerializeContext missmatch type!");
    }


    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jsWorkFlow.Activities.TryCatchActivity.callBaseMethod(this, 'loadSerializeContext', [baseSerializeContext]);

    //恢复自身
    var tryActivitySC = serializeContext["tryActivity"];
    var tryActivity = $jwf.loadActivity(tryActivitySC);
    this.set_tryActivity(tryActivity);

    var catchActivitySC = serializeContext["catchActivity"];
    var catchActivity = $jwf.loadActivity(catchActivitySC);
    this.set_catchActivity(catchActivity);
}

//activity的序列化
function jsWorkFlow_Activities_TryCatchActivity$saveSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.TryCatchActivity saveSerializeContext!");

    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = this.getType().getName();

    //保存自身
    serializeContext['tryActivity'] = $jwf.saveActivity(this.get_tryActivity());
    serializeContext['catchActivity'] = $jwf.saveActivity(this.get_catchActivity());

    //保存base
    var baseSerializeContext = {};

    jsWorkFlow.Activities.TryCatchActivity.callBaseMethod(this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}

//执行try block
function jsWorkFlow_Activities_TryCatchActivity$doEvalTry(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.TryCatchActivity doEvalTry!");

    //如果没有设置条件，认为为false，执行else分支
    var activity = this._tryActivity;

    if (!activity) {
        //没有try activity，结束执行
        $jwf.endActivity(context);
        return;
    }

    var application = context.get_application();
    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, activity, context);

    activityExecutor.add_postComplete(this._doEvalTryCompleteHandler);
    activityExecutor.add_error(this._doEvalTryErrorHandler);
    activityExecutor.add_errorComplete(this._doEvalTryErrorCompleteHandler);

    //OK, kick activityExecutor to run!
    activityExecutor.execute();
}

function jsWorkFlow_Activities_TryCatchActivity$doEvalTryCompleteHandler(sender, eventArgs) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.TryCatchActivity doEvalTryCompleteHandler!");

    var context = eventArgs.get_context();
    var executor = context.get_executor();
    var parentContext = executor.get_parentContext();

    //运行到complete，表示正常运行没有出现错误，可以正常结束TryCatchActivity
    $jwf.endActivity(parentContext);
}

function jsWorkFlow_Activities_TryCatchActivity$doEvalTryErrorHandler(sender, eventArgs) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.TryCatchActivity doEvalTryErrorHandler!");

    //try activity
    var context = eventArgs.get_context();
    var executor = context.get_executor();
    //tryCatchActivity
    var parentContext = executor.get_parentContext();

    //运行到error handler，表示发现runtime异常，需要执行catch activity

    //首先，通过设置executor的deliverError属性为false，阻断异常的向上传递
    executor.set_deliverError(false);

    this.doEvalCatch(context);


}


function jsWorkFlow_Activities_TryCatchActivity$doEvalTryErrorCompleteHandler(sender, eventArgs) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.TryCatchActivity doEvalTryErrorCompleteHandler!");

    //try activity
    var context = eventArgs.get_context();
    var executor = context.get_executor();
    //tryCatchActivity
    var parentContext = executor.get_parentContext();

    //恢复executor对异常的传递，errorComplete事件中已经完成了error的deliver，后面是对catch的错误的deliver
    executor.set_deliverError(true);

    //可以将error的handler去掉，这样如果在catch activity再发生异常，就可以继续向上传递了
    executor.remove_error(this._doEvalTryErrorHandler);
    executor.remove_errorComplete(this._doEvalTryErrorCompleteHandler);

}

function jsWorkFlow_Activities_TryCatchActivity$doEvalCatch(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.TryCatchActivity doEvalCatch!");

    var activity = this._catchActivity;

    if (!activity) {
        //如果没有catch activity，就简单的压制异常，然后结束parentContext
        $jwf.endActivity(parentContext);
    }

    //以错误的context作为parent，运行catch activity，这样可以获取到异常的错误码
    //这样，TryCatchActivity实际上是context的parentContext
    var application = context.get_application();
    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, activity, context);

    activityExecutor.add_postComplete(this._doEvalCatchCompleteHandler);

    //OK, kick activityExecutor to run!
    activityExecutor.execute();
}

function jsWorkFlow_Activities_TryCatchActivity$doEvalCatchCompleteHandler(sender, eventArgs) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.TryCatchActivity doEvalCatchCompleteHandler!");

    var context = eventArgs.get_context();
    var executor = context.get_executor();
    var parentContext = executor.get_parentContext();
    var ppContext = parentContext.get_parentContext();

    //结束TryCatchActivity
    $jwf.endActivity(ppContext);

}


//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_TryCatchActivity$execute(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.TryCatchActivity execute!");

    jsWorkFlow.Activities.TryCatchActivity.callBaseMethod(this, 'execute', [context]);

    this.doEvalTry(context);

}

jsWorkFlow.Activities.TryCatchActivity.prototype = {
    _tryActivity: null,
    _catchActivity: null,
    _doEvalTryCompleteHandler: null,
    _doEvalTryErrorHandler: null,
    _doEvalTryErrorCompleteHandler: null,
    _doEvalCatchCompleteHandler: null,
    dispose: jsWorkFlow_Activities_TryCatchActivity$dispose,
    //property
    get_tryActivity: jsWorkFlow_Activities_TryCatchActivity$get_tryActivity,
    set_tryActivity: jsWorkFlow_Activities_TryCatchActivity$set_tryActivity,
    get_catchActivity: jsWorkFlow_Activities_TryCatchActivity$get_catchActivity,
    set_catchActivity: jsWorkFlow_Activities_TryCatchActivity$set_catchActivity,
    //method
    loadSerializeContext: jsWorkFlow_Activities_TryCatchActivity$loadSerializeContext,
    saveSerializeContext: jsWorkFlow_Activities_TryCatchActivity$saveSerializeContext,
    doEvalTry: jsWorkFlow_Activities_TryCatchActivity$doEvalTry,
    doEvalTryCompleteHandler: jsWorkFlow_Activities_TryCatchActivity$doEvalTryCompleteHandler,
    doEvalTryErrorHandler: jsWorkFlow_Activities_TryCatchActivity$doEvalTryErrorHandler,
    doEvalTryErrorCompleteHandler: jsWorkFlow_Activities_TryCatchActivity$doEvalTryErrorCompleteHandler,
    doEvalCatch: jsWorkFlow_Activities_TryCatchActivity$doEvalCatch,
    doEvalCatchCompleteHandler: jsWorkFlow_Activities_TryCatchActivity$doEvalCatchCompleteHandler,
    execute: jsWorkFlow_Activities_TryCatchActivity$execute
};

jsWorkFlow.Activities.TryCatchActivity.registerClass('jsWorkFlow.Activities.TryCatchActivity', jsWorkFlow.Activity);



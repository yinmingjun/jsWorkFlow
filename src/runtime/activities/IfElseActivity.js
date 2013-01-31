/*
* jsWorkFlow's core source code.
* 2012.03.29: Create By Yin Mingjun - email: yinmingjuncn@gmail.com
* 
* Copyright 2012,  Yin MingJun - email: yinmingjuncn@gmail.com
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
*/

Type.registerNamespace('jsWorkFlow.Activities');

//////////////////////////////////////////////////////////////////////////////////////////
//IfElseActivity
//
//TO 开发者：
//    IfElseActivity是一个if...then...else分支的activity，包含3个部分，conditionActivity、
//thenActivity和elseActivity，conditionActivity提供if所需要的分支条件，如果分支条件返回结果
//评估是true，执行thenActivity，否则执行elseActivity。
//    conditionActivity、thenActivity和elseActivity都可以为空。
//    IfElseActivity将执行的activity(thenActivity或elseActivity)作为自己的返回值。
jsWorkFlow.Activities.IfElseActivity = function jsWorkFlow_Activities_IfElseActivity(conditionActivity, thenActivity, elseActivity) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.IfElseActivity create!");

    jsWorkFlow.Activities.IfElseActivity.initializeBase(this);

    this.set_conditionActivity(conditionActivity);
    this.set_thenActivity(thenActivity);
    this.set_elseActivity(elseActivity);

    this._doEvalConditionCompleteHandler = Function.createDelegate(this, this.doEvalConditionCompleteHandler);
    this._doExecuteBodyCompleteHandler = Function.createDelegate(this, this.doExecuteBodyCompleteHandler);
};

function jsWorkFlow_Activities_IfElseActivity$dispose() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.IfElseActivity dispose!");

    this._conditionActivity = null;
    this._elseActivity = null;
    this._thenActivity = null;
    jsWorkFlow.Activities.IfElseActivity.callBaseMethod(this, 'dispose');
}

function jsWorkFlow_Activities_IfElseActivity$get_conditionActivity() {
    return this._conditionActivity;
}

function jsWorkFlow_Activities_IfElseActivity$set_conditionActivity(value) {
    this._conditionActivity = value;
}

function jsWorkFlow_Activities_IfElseActivity$get_thenActivity() {
    return this._thenActivity;
}

function jsWorkFlow_Activities_IfElseActivity$set_thenActivity(value) {
    this._thenActivity = value;
}

function jsWorkFlow_Activities_IfElseActivity$get_elseActivity() {
    return this._elseActivity;
}

function jsWorkFlow_Activities_IfElseActivity$set_elseActivity(value) {
    this._elseActivity = value;
}

//activity的恢复
function jsWorkFlow_Activities_IfElseActivity$loadSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.IfElseActivity loadSerializeContext!");

    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== this.getType().getName()) {
        throw Error.invalidOperation("loadSerializeContext missmatch type!");
    }

    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jsWorkFlow.Activities.IfElseActivity.callBaseMethod(this, 'loadSerializeContext', [baseSerializeContext]);


    //恢复自身
    var conditionActivitySC = serializeContext['conditionActivity'];
    var conditionActivity = $jwf.loadActivity(conditionActivitySC);
    this.set_conditionActivity(conditionActivity);

    var thenActivitySC = serializeContext['thenActivity'];
    var thenActivity = $jwf.loadActivity(thenActivitySC);
    this.set_thenActivity(thenActivity);

    var elseActivitySC = serializeContext['elseActivity'];
    var elseActivity = $jwf.loadActivity(elseActivitySC);
    this.set_elseActivity(elseActivity);

}

//activity的序列化
function jsWorkFlow_Activities_IfElseActivity$saveSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.IfElseActivity saveSerializeContext!");


    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = this.getType().getName();

    //保存自身
    serializeContext['conditionActivity'] = $jwf.saveActivity(this.get_conditionActivity());
    serializeContext['thenActivity'] = $jwf.saveActivity(this.get_thenActivity());
    serializeContext['elseActivity'] = $jwf.saveActivity(this.get_elseActivity());

    //保存base
    var baseSerializeContext = {};

    jsWorkFlow.Activities.IfElseActivity.callBaseMethod(this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}


function jsWorkFlow_Activities_IfElseActivity$doEvalCondition(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.IfElseActivity doEvalCondition!");

    //如果没有设置条件，认为为false，执行else分支
    var activity = this._conditionActivity;

    if (!activity) {
        this.doExecuteBody(context, false);
        return;
    }

    var application = context.get_application();
    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, activity, context);

    activityExecutor.add_postComplete(this._doEvalConditionCompleteHandler);

    //OK, kick activityExecutor to run!
    activityExecutor.execute();
}

function jsWorkFlow_Activities_IfElseActivity$doEvalConditionCompleteHandler(sender, eventArgs) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.IfElseActivity doEvalConditionCompleteHandler!");

    var context = eventArgs.get_context();
    var executor = context.get_executor();
    var parentContext = executor.get_parentContext();

    //从context取执行结果
    var condition = context.get_result();

    //将condition传递给doExecuteBody继续执行
    this.doExecuteBody(parentContext, condition);
}

function jsWorkFlow_Activities_IfElseActivity$doExecuteBody(context, condition) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.IfElseActivity doExecuteBody!");

    //如果没有设置条件，认为为false，执行else分支
    var activity = (condition)? this._thenActivity: this._elseActivity;

    log.debug("condition is:[" + !!condition + "!");


    if (!activity) {
        //没有activity，结束执行
        $jwf.endActivity(context);
        return;
    }

    var application = context.get_application();
    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, activity, context);

    activityExecutor.add_postComplete(this._doExecuteBodyCompleteHandler);

    //OK, kick activityExecutor to run!
    activityExecutor.execute();
}

function jsWorkFlow_Activities_IfElseActivity$doExecuteBodyCompleteHandler(sender, eventArgs) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.IfElseActivity doExecuteBodyCompleteHandler!");

    var context = eventArgs.get_context();
    var executor = context.get_executor();
    var parentContext = executor.get_parentContext();

    //将activity的最后的执行结果作为当前activity的执行结果
    var result = context.get_result();
    parentContext.set_result(result);

    //结束activity的执行
    $jwf.endActivity(parentContext);
    return;
}


//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_IfElseActivity$execute(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.IfElseActivity execute!");

    jsWorkFlow.Activities.IfElseActivity.callBaseMethod(this, 'execute', [context]);

    //从执行条件开始kick out
    this.doEvalCondition(context);
}

jsWorkFlow.Activities.IfElseActivity.prototype = {
    _conditionActivity: null,
    _thenActivity: null,
    _elseActivity: null,
    _doEvalConditionCompleteHandler: null,
    _doExecuteBodyCompleteHandler: null,
    dispose: jsWorkFlow_Activities_IfElseActivity$dispose,
    //property
    get_conditionActivity: jsWorkFlow_Activities_IfElseActivity$get_conditionActivity,
    set_conditionActivity: jsWorkFlow_Activities_IfElseActivity$set_conditionActivity,
    get_thenActivity: jsWorkFlow_Activities_IfElseActivity$get_thenActivity,
    set_thenActivity: jsWorkFlow_Activities_IfElseActivity$set_thenActivity,
    get_elseActivity: jsWorkFlow_Activities_IfElseActivity$get_elseActivity,
    set_elseActivity: jsWorkFlow_Activities_IfElseActivity$set_elseActivity,
    //method
    loadSerializeContext: jsWorkFlow_Activities_IfElseActivity$loadSerializeContext,
    saveSerializeContext: jsWorkFlow_Activities_IfElseActivity$saveSerializeContext,
    doEvalCondition: jsWorkFlow_Activities_IfElseActivity$doEvalCondition,
    doEvalConditionCompleteHandler: jsWorkFlow_Activities_IfElseActivity$doEvalConditionCompleteHandler,
    doExecuteBody: jsWorkFlow_Activities_IfElseActivity$doExecuteBody,
    doExecuteBodyCompleteHandler: jsWorkFlow_Activities_IfElseActivity$doExecuteBodyCompleteHandler,
    execute: jsWorkFlow_Activities_IfElseActivity$execute
};

jsWorkFlow.Activities.IfElseActivity.registerClass('jsWorkFlow.Activities.IfElseActivity', jsWorkFlow.Activity);



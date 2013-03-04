/*
* jsWorkFlow's core source code.
* 2012.03.29: Create By Yin Mingjun - email: yinmingjuncn@gmail.com
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
//WhileActivity
//
//TO 开发者：
//    WhileActivity提供一个循环的执行体，通过conditionActivity来控制执行的循环条件，
// bodyActivity提供循环的执行体。
//    conditionActivity和bodyActivity都可以为空。
//
jsWorkFlow.Activities.WhileActivity = function jsWorkFlow_Activities_WhileActivity(conditionActivity, bodyActivity) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.WhileActivity create!");

    jsoop.initializeBase(jsWorkFlow.Activities.WhileActivity, this);

    this.set_conditionActivity(conditionActivity);
    this.set_bodyActivity(bodyActivity);

    this._doEvalConditionCompleteHandler = jsoop.createDelegate(this, this.doEvalConditionCompleteHandler);
    this._doExecuteBodyCompleteHandler = jsoop.createDelegate(this, this.doExecuteBodyCompleteHandler);

};

function jsWorkFlow_Activities_WhileActivity$dispose() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.WhileActivity dispose!");

    jsoop.callBaseMethod(jsWorkFlow.Activities.WhileActivity, this, 'dispose');
}

function jsWorkFlow_Activities_WhileActivity$get_conditionActivity() {
    return this._conditionActivity;
}

function jsWorkFlow_Activities_WhileActivity$set_conditionActivity(value) {
    this._conditionActivity = value;
}

function jsWorkFlow_Activities_WhileActivity$get_bodyActivity() {
    return this._bodyActivity;
}

function jsWorkFlow_Activities_WhileActivity$set_bodyActivity(value) {
    this._bodyActivity = value;
}

//activity的恢复
function jsWorkFlow_Activities_WhileActivity$loadSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.WhileActivity loadSerializeContext!");

    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== 'jsWorkFlow.Activities.WhileActivity') {
        throw jsoop.errorInvalidOperation("loadSerializeContext missmatch type!");
    }

    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jsoop.callBaseMethod(jsWorkFlow.Activities.WhileActivity, this, 'loadSerializeContext', [baseSerializeContext]);

    //恢复自身
    this.set_conditionActivity($jwf.loadActivity(serializeContext['conditionActivity']));
    this.set_bodyActivity($jwf.loadActivity(serializeContext['bodyActivity']));
}

//activity的序列化
function jsWorkFlow_Activities_WhileActivity$saveSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.WhileActivity saveSerializeContext!");

    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = 'jsWorkFlow.Activities.WhileActivity';

    //保存自身
    serializeContext['conditionActivity'] = $jwf.saveActivity(this.get_conditionActivity());
    serializeContext['bodyActivity'] = $jwf.saveActivity(this.get_bodyActivity());


    //保存base
    var baseSerializeContext = {};

    jsoop.callBaseMethod(jsWorkFlow.Activities.WhileActivity, this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}

function jsWorkFlow_Activities_WhileActivity$doEvalCondition(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.WhileActivity doEvalCondition!");

    //如果没有设置条件，认为为false
    var activity = this._conditionActivity;

    if (!activity) {
        this.doExecuteBody(context, false);
        return;
    }

    //构造ActivityExecutor执行conditionActivity
    var application = context.get_application();
    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, activity, context);

    activityExecutor.add_postComplete(this._doEvalConditionCompleteHandler);

    //OK, kick activityExecutor to run!
    activityExecutor.execute();
}

function jsWorkFlow_Activities_WhileActivity$doEvalConditionCompleteHandler(sender, eventArgs) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.WhileActivity doEvalConditionCompleteHandler!");

    //根据condition的执行结果，来执行
    var context = eventArgs.get_context();
    var executor = context.get_executor();
    var parentContext = executor.get_parentContext();

    //从context取执行结果
    var condition = context.get_result();
    log.debug("condition is:[" + condition + "]");

    //将condition传递给doExecuteBody继续执行
    this.doExecuteBody(parentContext, condition);

}

function jsWorkFlow_Activities_WhileActivity$doExecuteBody(context, condition) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.WhileActivity doExecuteBody!");

    if (!condition) {
        //循环条件为false，结束while的执行
        $jwf.endActivity(context);
        return;
    }

    //true，执行bodyActivity
    var activity = this._bodyActivity;

    if (!activity) {
        //没有activity，跳过，回到while的条件检查
        this.doEvalCondition(context);
        return;
    }

    var application = context.get_application();
    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, activity, context);

    activityExecutor.add_postComplete(this._doExecuteBodyCompleteHandler);

    //OK, kick activityExecutor to run!
    activityExecutor.execute();
}

function jsWorkFlow_Activities_WhileActivity$doExecuteBodyCompleteHandler(sender, eventArgs) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.WhileActivity doExecuteBodyCompleteHandler!");

    var context = eventArgs.get_context();
    var executor = context.get_executor();
    var parentContext = executor.get_parentContext();

    //将activity的执行解结果作为自身的结果
    var result = context.get_result();
    parentContext.set_result(result);

    //继续回到条件的检查点执行
    this.doEvalCondition(parentContext);
}

//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_WhileActivity$execute(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.WhileActivity execute!");

    jsoop.callBaseMethod(jsWorkFlow.Activities.WhileActivity, this, 'execute', [context]);

    //从条件检查开始执行
    this.doEvalCondition(context);

}

jsWorkFlow.Activities.WhileActivity.prototype = {
    _conditionActivity: null,
    _bodyActivity: null,
    _doEvalConditionCompleteHandler: null,
    _doExecuteBodyCompleteHandler: null,
    //
    dispose: jsWorkFlow_Activities_WhileActivity$dispose,
    //property
    get_conditionActivity: jsWorkFlow_Activities_WhileActivity$get_conditionActivity,
    set_conditionActivity: jsWorkFlow_Activities_WhileActivity$set_conditionActivity,
    get_bodyActivity: jsWorkFlow_Activities_WhileActivity$get_bodyActivity,
    set_bodyActivity: jsWorkFlow_Activities_WhileActivity$set_bodyActivity,
    //method
    loadSerializeContext: jsWorkFlow_Activities_WhileActivity$loadSerializeContext,
    saveSerializeContext: jsWorkFlow_Activities_WhileActivity$saveSerializeContext,
    doEvalCondition: jsWorkFlow_Activities_WhileActivity$doEvalCondition,
    doEvalConditionCompleteHandler: jsWorkFlow_Activities_WhileActivity$doEvalConditionCompleteHandler,
    doExecuteBody: jsWorkFlow_Activities_WhileActivity$doExecuteBody,
    doExecuteBodyCompleteHandler: jsWorkFlow_Activities_WhileActivity$doExecuteBodyCompleteHandler,
    execute: jsWorkFlow_Activities_WhileActivity$execute
};

jsoop.registerClass(jsoop.setTypeName(jsWorkFlow.Activities.WhileActivity, 'jsWorkFlow.Activities.WhileActivity'), jsWorkFlow.Activity);


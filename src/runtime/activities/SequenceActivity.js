/*
* jsWorkFlow's core source code.
* 2012.03.22: Create By Yin Mingjun - email: yinmingjuncn@gmail.com
* 
* Copyright 2012,  Yin MingJun - email: yinmingjuncn@gmail.com
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
*/

//require namsepace
//jsWorkFlow.Activities namespace registed at core
jso.ns('jsWorkFlow.Activities', true);
var jsWorkFlow = jso.ns('jsWorkFlow');



//////////////////////////////////////////////////////////////////////////////////////////
//SequenceActivity，包装基本的activity队列，按次序执行
//
//TO 开发者：
//    是一个activity的容器，允许将多个activity放到SequenceActivity中按加入的次序顺序执行。
//SequenceActivity将其执行的最后一个activity作为自己的返回值携带回来。
//
jsWorkFlow.Activities.SequenceActivity = function jsWorkFlow_Activities_SequenceActivity(activities) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.SequenceActivity create!");

    jso.initializeBase(jsWorkFlow.Activities.SequenceActivity, this);

    if (!activities) {
        activities = [];
    }

    this._activities = activities;
    this._doActivityCompleteHandler = jso.createDelegate(this, this.doActivityCompleteHandler);
};

function jsWorkFlow_Activities_SequenceActivity$dispose() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.SequenceActivity dispose!");

    jso.callBaseMethod(jsWorkFlow.Activities.SequenceActivity, this, 'dispose');

    this._activities = null;
    this._doActivityCompleteHandler = null;
}

function jsWorkFlow_Activities_SequenceActivity$get_activities() {
    return this._activities;
}

function jsWorkFlow_Activities_SequenceActivity$set_activities(value) {
    this._activities = value;
}

//activity的恢复
function jsWorkFlow_Activities_SequenceActivity$loadSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.SequenceActivity loadSerializeContext!");

    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== 'jsWorkFlow.Activities.SequenceActivity') {
        throw jso.errorInvalidOperation("loadSerializeContext missmatch type!");
    }

    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jso.callBaseMethod(jsWorkFlow.Activities.SequenceActivity, this, 'loadSerializeContext', [baseSerializeContext]);

    //恢复自身
    var activitiesSC = serializeContext['activities'];
    var activities = [];

    if (activitiesSC && (activitiesSC.length > 0)) {
        for (var i = 0, ilen = activitiesSC.length; i < ilen; i++) {
            var activity = $jwf.loadActivity(activitiesSC[i]);
            jso.arrayAdd(activities, activity);
        }
    }

    this.set_activities(activities);
}

//activity的序列化
function jsWorkFlow_Activities_SequenceActivity$saveSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.SequenceActivity saveSerializeContext!");


    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = 'jsWorkFlow.Activities.SequenceActivity';

    //保存自身
    var activitiesSC = [];
    var activities = this.get_activities();

    if (activities && (activities.length > 0)) {
        for (var i = 0, ilen = activities.length; i < ilen; i++) {
            var activitySC = $jwf.saveActivity(activities[i]);
            jso.arrayAdd(activitiesSC, activitySC); 
        }
    }

    serializeContext['activities'] = activitiesSC;

    //保存base
    var baseSerializeContext = {};

    jso.callBaseMethod(jsWorkFlow.Activities.SequenceActivity, this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}


//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_SequenceActivity$execute(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.SequenceActivity execute!");

    jso.callBaseMethod(jsWorkFlow.Activities.SequenceActivity, this, 'execute', [context]);

    //从索引0开始依次执行
    this.doExecActivity(context, 0);
}

function jsWorkFlow_Activities_SequenceActivity$addActivity(activity) {
    jso.arrayAdd(this._activities, activity);
}

function jsWorkFlow_Activities_SequenceActivity$doExecActivity(context, index) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.SequenceActivity doExecActivity!");

    if (index >= this._activities.length) {
        //OK，所有activity都执行完毕了，结束当前的活动
        $jwf.endActivity(context);
        return;
    }

    //选择activity，并执行
    var application = context.get_application();
    var activity = this._activities[index];
    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, activity, context);

    //将上下文的数据存放在activityExecutor之中
    activityExecutor.currentIndex = index;

    activityExecutor.add_postComplete(this._doActivityCompleteHandler);

    //OK, kick activityExecutor to run!
    activityExecutor.execute();

}

function jsWorkFlow_Activities_SequenceActivity$doActivityCompleteHandler(sender, eventArgs) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.SequenceActivity doActivityCompleteHandler!");


    //post complete事件
    var context = eventArgs.get_context();
    var executor = context.get_executor();
    var parentContext = executor.get_parentContext();
    var currentIndex = executor.currentIndex;

    //cleanup old executor
    executor.remove_postComplete(this._doActivityCompleteHandler);

    //set last context's result as current context's result
    var lastResult = context.get_result();
    parentContext.set_result(lastResult);

    //执行下一个迭代
    currentIndex++;
    this.doExecActivity(parentContext, currentIndex);
}

jsWorkFlow.Activities.SequenceActivity.prototype = {
    _activities: null,
    _doActivityCompleteHandler: null,
    dispose: jsWorkFlow_Activities_SequenceActivity$dispose,
    //property
    get_activities: jsWorkFlow_Activities_SequenceActivity$get_activities,
    set_activities: jsWorkFlow_Activities_SequenceActivity$set_activities,
    //method
    loadSerializeContext: jsWorkFlow_Activities_SequenceActivity$loadSerializeContext,
    saveSerializeContext: jsWorkFlow_Activities_SequenceActivity$saveSerializeContext,
    execute: jsWorkFlow_Activities_SequenceActivity$execute,
    addActivity: jsWorkFlow_Activities_SequenceActivity$addActivity,
    //执行activity，并挂接ActivityExecutor的postComplete事件
    doExecActivity: jsWorkFlow_Activities_SequenceActivity$doExecActivity,
    //ActivityExecutor的postComplete的handler
    doActivityCompleteHandler: jsWorkFlow_Activities_SequenceActivity$doActivityCompleteHandler

};

jso.registerClass(
    jso.setTypeName(jsWorkFlow.Activities.SequenceActivity, 'jsWorkFlow.Activities.SequenceActivity'), 
    jsWorkFlow.Activity);



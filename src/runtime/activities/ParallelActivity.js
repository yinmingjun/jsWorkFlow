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
jso.ns('jsWorkFlow.Activities', true);
var jsWorkFlow = jso.ns('jsWorkFlow');


//////////////////////////////////////////////////////////////////////////////////////////
//ParallelActivity
//
//TO 开发者：
//    提供同时执行activity的运行环境。在javascript中实际上是不存在并行的运行环境，不过存在异步
//的处理模式，ParallelActivity并不担保会让所有的activity并行执行，只是会尽量提前activity的执行
//时机。
//
jsWorkFlow.Activities.ParallelActivity = function jsWorkFlow_Activities_ParallelActivity(activities) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.ParallelActivity create!");

    jso.initializeBase(jsWorkFlow.Activities.ParallelActivity, this);

    this._activities = activities;
    this._doExecuteItemCompleteHandler = jso.createDelegate(this, this.doExecuteItemCompleteHandler);
};

function jsWorkFlow_Activities_ParallelActivity$dispose() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.ParallelActivity dispose!");

    jso.callBaseMethod(jsWorkFlow.Activities.ParallelActivity, this, 'dispose');
}

function jsWorkFlow_Activities_ParallelActivity$get_activities() {
    return this._activities;
}

function jsWorkFlow_Activities_ParallelActivity$set_activities(activities) {
    if(!activities) {
        activities = [];
    }

    this._activities = activities;
}

function jsWorkFlow_Activities_ParallelActivity$addActivity(activity) {
    var activities = this.get_activities();
    jso.arrayAdd(activities, activity);
}

function jsWorkFlow_Activities_ParallelActivity$removeActivity(activity) {
    var activities = this.get_activities();
    Array.remove(activities, activity);
}

function jsWorkFlow_Activities_ParallelActivity$removeActivityAt(index) {
    var activities = this.get_activities();
    Array.removeAt(activities, index);
}

function jsWorkFlow_Activities_ParallelActivity$clearActivity() {
    var activities = this.get_activities();
    Array.clear(activities);
}

//activity的恢复
function jsWorkFlow_Activities_ParallelActivity$loadSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.ParallelActivity loadSerializeContext!");

    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== 'jsWorkFlow.Activities.ParallelActivity') {
        throw jso.errorInvalidOperation("loadSerializeContext missmatch type!");
    }

    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    //恢复自身
    jso.callBaseMethod(jsWorkFlow.Activities.ParallelActivity, this, 'loadSerializeContext', [baseSerializeContext]);

    var activities = [];
    var activitiesSC = serializeContext["activities"];

    if (activitiesSC && (activitiesSC.length > 0)) {
        for (var i = 0, ilen = activitiesSC.length; i < ilen; i++) {
            var item = $jwf.loadActivity(activitiesSC[i]);
            jso.arrayAdd(activities, item);
        }
    }

    //恢复activities
    this.set_activities(activities);

}

//activity的序列化
function jsWorkFlow_Activities_ParallelActivity$saveSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.ParallelActivity saveSerializeContext!");


    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = 'jsWorkFlow.Activities.ParallelActivity';

    var activities = this.get_activities();
    var activitiesSC = [];

    if (activities && (activities.length > 0)) {
        for (var i = 0, ilen = activities.length; i < ilen; i++) {
            var itemSC = $jwf.saveActivity(activities[i]);
            jso.arrayAdd(activitiesSC, itemSC);
        }
    }

    //保存activities
    serializeContext["activities"] = activitiesSC; 

    //保存base
    var baseSerializeContext = {};

    jso.callBaseMethod(jsWorkFlow.Activities.ParallelActivity, this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}

function jsWorkFlow_Activities_ParallelActivity$doExecuteItem(context, activity) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.ParallelActivity doExecuteItem!");

    
    //取activity
    if (!activity) {
        context.completeCount++;
        if (context.completeCount == context.totalActivity) {
            $jwf.endActivity(context);
        }
        return;
    }

    var application = context.get_application();
    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, activity, context);

    activityExecutor.add_postComplete(this._doExecuteItemCompleteHandler);

    //OK, kick activityExecutor to run!
    activityExecutor.execute();
}

function jsWorkFlow_Activities_ParallelActivity$doExecuteItemCompleteHandler(sender, eventArgs) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.ParallelActivity doExecuteItemCompleteHandler!");

    var context = eventArgs.get_context();
    var executor = context.get_executor();
    var parentContext = executor.get_parentContext();

    //从context取执行结果
    var condition = context.get_result();

    parentContext.completeCount++;
    if (parentContext.completeCount == parentContext.totalActivity) {
        $jwf.endActivity(parentContext);
    }
    return;

}

//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_ParallelActivity$execute(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.ParallelActivity execute!");

    jso.callBaseMethod(jsWorkFlow.Activities.ParallelActivity, this, 'execute', [context]);

    //因为每个activity都是通过job来执行，本身就是异步的。循环执行activityExecutor就可以。

    var activities = this.get_activities();

    if(!activities || (activities.length == 0)) {
        //空activity列表，可以直接结束了
        $jwf.endActivity(context);
        return;
    }

    context.totalActivity = activities.length;
    context.completeCount = 0;

    for(var i = 0,ilen=activities.length;i<ilen;i++) {
        var activity = activities[i];
        this.doExecuteItem(context,activity); 
    }
}

jsWorkFlow.Activities.ParallelActivity.prototype = {
    _activities: null,
    _doExecuteItemCompleteHandler: null,
    dispose: jsWorkFlow_Activities_ParallelActivity$dispose,
    //property
    get_activities: jsWorkFlow_Activities_ParallelActivity$get_activities,
    set_activities: jsWorkFlow_Activities_ParallelActivity$set_activities,
    addActivity: jsWorkFlow_Activities_ParallelActivity$addActivity,
    removeActivity: jsWorkFlow_Activities_ParallelActivity$removeActivity,
    removeActivityAt: jsWorkFlow_Activities_ParallelActivity$removeActivityAt,
    clearActivity: jsWorkFlow_Activities_ParallelActivity$clearActivity,

    //method
    loadSerializeContext: jsWorkFlow_Activities_ParallelActivity$loadSerializeContext,
    saveSerializeContext: jsWorkFlow_Activities_ParallelActivity$saveSerializeContext,
    doExecuteItem: jsWorkFlow_Activities_ParallelActivity$doExecuteItem,
    doExecuteItemCompleteHandler: jsWorkFlow_Activities_ParallelActivity$doExecuteItemCompleteHandler,
    execute: jsWorkFlow_Activities_ParallelActivity$execute
};

jso.registerClass(
    jso.setTypeName(jsWorkFlow.Activities.ParallelActivity, 'jsWorkFlow.Activities.ParallelActivity'), 
    jsWorkFlow.Activity);


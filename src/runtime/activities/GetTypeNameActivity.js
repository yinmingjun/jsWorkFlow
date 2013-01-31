/*
* jsWorkFlow's core source code.
* 2012.01.31: Create By Yin Mingjun - email: yinmingjuncn@gmail.com
* 
* Copyright 2012,  Yin MingJun - email: yinmingjuncn@gmail.com
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
*/

Type.registerNamespace('jsWorkFlow.Activities');

//////////////////////////////////////////////////////////////////////////////////////////
//GetTypeNameActivity
//
//TO 开发者：
//    获取给出的activity的运行结果的数据类型。
//
jsWorkFlow.Activities.GetTypeNameActivity = function jsWorkFlow_Activities_GetTypeNameActivity(objActivity) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.GetTypeNameActivity create!");

    jsWorkFlow.Activities.GetTypeNameActivity.initializeBase(this);

    this._objActivity = objActivity;
    this._doEvalObjActivityCompleteHandler = Function.createDelegate(this, this.doEvalObjActivityCompleteHandler);

};

function jsWorkFlow_Activities_GetTypeNameActivity$dispose() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.GetTypeNameActivity dispose!");

    jsWorkFlow.Activities.GetTypeNameActivity.callBaseMethod(this, 'dispose');
}


function jsWorkFlow_Activities_GetTypeNameActivity$get_objActivity() {
    return this._objActivity;
}

function jsWorkFlow_Activities_GetTypeNameActivity$set_objActivity(value) {
    this._objActivity = value;
}


//activity的恢复
function jsWorkFlow_Activities_GetTypeNameActivity$loadSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.GetTypeNameActivity loadSerializeContext!");

    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== this.getType().getName()) {
        throw Error.invalidOperation("loadSerializeContext missmatch type!");
    }


    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jsWorkFlow.Activities.GetTypeNameActivity.callBaseMethod(this, 'loadSerializeContext', [baseSerializeContext]);

    //恢复自身
    var objActivitySC = serializeContext["objActivity"];
    var objActivity = $jwf.loadActivity(objActivitySC);
    this.set_objActivity(objActivity);
}

//activity的序列化
function jsWorkFlow_Activities_GetTypeNameActivity$saveSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.GetTypeNameActivity saveSerializeContext!");

    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = this.getType().getName();

    //保存自身
    serializeContext['objActivity'] = $jwf.saveActivity(this.get_objActivity());

    //保存base
    var baseSerializeContext = {};

    jsWorkFlow.Activities.GetTypeNameActivity.callBaseMethod(this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}

function jsWorkFlow_Activities_GetTypeNameActivity$doEvalObjActivity(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.GetTypeNameActivity doEvalObjActivity!");

    //如果没有设置条件，认为为false，执行else分支
    var activity = this._objActivity;

    if (!activity) {
        //如果没有定义activity，使用null替代
        this.doGetObjTypeName(context, null);
        return;
    }

    var application = context.get_application();
    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, activity, context);

    activityExecutor.add_postComplete(this._doEvalObjActivityCompleteHandler);

    //OK, kick activityExecutor to run!
    activityExecutor.execute();

}

function jsWorkFlow_Activities_GetTypeNameActivity$doEvalObjActivityCompleteHandler(sender, eventArgs) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.GetTypeNameActivity doEvalObjActivityCompleteHandler!");

    var context = eventArgs.get_context();
    var executor = context.get_executor();
    var parentContext = executor.get_parentContext();

    //从context取执行结果
    var obj = context.get_result();

    //将condition传递给doExecuteBody继续执行
    this.doGetObjTypeName(parentContext, obj);
    
}

function jsWorkFlow_Activities_GetTypeNameActivity$doGetObjTypeName(context, obj) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.GetTypeNameActivity doGetObjTypeName!");

    //获取obj的typeName
    var typeName = "";

    if ((typeof (obj) !== "undefined") && (obj !== null)) {
        typeName = Object.getTypeName(obj);
    }

    //见TypeName放到activity的执行结果中
    context.set_result(typeName);

    //执行完毕，结束activity
    $jwf.endActivity(context);

}

//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_GetTypeNameActivity$execute(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.GetTypeNameActivity execute!");

    jsWorkFlow.Activities.GetTypeNameActivity.callBaseMethod(this, 'execute', [context]);

    this.doEvalObjActivity(context);

}

jsWorkFlow.Activities.GetTypeNameActivity.prototype = {
    _objActivity: null,
    _doEvalObjActivityCompleteHandler: null,
    dispose: jsWorkFlow_Activities_GetTypeNameActivity$dispose,
    //property
    get_objActivity: jsWorkFlow_Activities_GetTypeNameActivity$get_objActivity,
    set_objActivity: jsWorkFlow_Activities_GetTypeNameActivity$set_objActivity,
    //method
    loadSerializeContext: jsWorkFlow_Activities_GetTypeNameActivity$loadSerializeContext,
    saveSerializeContext: jsWorkFlow_Activities_GetTypeNameActivity$saveSerializeContext,
    doEvalObjActivity: jsWorkFlow_Activities_GetTypeNameActivity$doEvalObjActivity,
    doEvalObjActivityCompleteHandler: jsWorkFlow_Activities_GetTypeNameActivity$doEvalObjActivityCompleteHandler,
    doGetObjTypeName: jsWorkFlow_Activities_GetTypeNameActivity$doGetObjTypeName,
    execute: jsWorkFlow_Activities_GetTypeNameActivity$execute
};

jsWorkFlow.Activities.GetTypeNameActivity.registerClass('jsWorkFlow.Activities.GetTypeNameActivity', jsWorkFlow.Activity);



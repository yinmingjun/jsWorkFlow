
/*
* jsWorkFlow's core source code.
* 2012.11.06: Create By Yin Mingjun - email: yinmingjuncn@gmail.com
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
//CompareActivity
//
//TO 开发者：
//    一个执行 相等性判断 操作的activity。
//    如果activity为null，其result被作为null处理。
//    内部先进行equals比较，如果不相等，lha > rha，返回1；如果lha < rha，返回-1；如果相等，返回0
//
jsWorkFlow.Activities.CompareActivity = function jsWorkFlow_Activities_CompareActivity(leftHandActivity, rightHandActivity, strict) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.CompareActivity create!");

    jsoop.initializeBase(jsWorkFlow.Activities.CompareActivity, this);
    this.set_leftHandActivity(leftHandActivity);
    this.set_rightHandActivity(rightHandActivity);
    this.set_strict(strict);

    this._doExecLhaCompleteHandler = jsoop.createDelegate(this, this.doExecLhaCompleteHandler);
    this._doExecRhaCompleteHandler = jsoop.createDelegate(this, this.doExecRhaCompleteHandler);
};

function jsWorkFlow_Activities_CompareActivity$dispose() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.CompareActivity dispose!");

    jsoop.callBaseMethod(jsWorkFlow.Activities.CompareActivity, this, 'dispose');
}


function jsWorkFlow_Activities_CompareActivity$get_leftHandActivity() {
    return this._leftHandActivity;
}

function jsWorkFlow_Activities_CompareActivity$set_leftHandActivity(value) {
    this._leftHandActivity = value;
}

function jsWorkFlow_Activities_CompareActivity$get_rightHandActivity() {
    return this._rightHandActivity;
}

function jsWorkFlow_Activities_CompareActivity$set_rightHandActivity(value) {
    this._rightHandActivity = value;
}

function jsWorkFlow_Activities_CompareActivity$get_strict() {
    return this._strict;
}

function jsWorkFlow_Activities_CompareActivity$set_strict(value) {
    this._strict = value;
}

//activity的恢复
function jsWorkFlow_Activities_CompareActivity$loadSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.CompareActivity loadSerializeContext!");


    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== 'jsWorkFlow.Activities.CompareActivity') {
        throw jsoop.errorInvalidOperation("loadSerializeContext missmatch type!");
    }


    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jsoop.callBaseMethod(jsWorkFlow.Activities.CompareActivity, this, 'loadSerializeContext', [baseSerializeContext]);

    //恢复自身
    var leftHandActivitySC = serializeContext['leftHandActivity'];
    var leftHandActivity = $jwf.loadActivity(leftHandActivitySC);
    this.set_leftHandActivity(leftHandActivity);

    var rightHandActivitySC = serializeContext['rightHandActivity'];
    var rightHandActivity = $jwf.loadActivity(rightHandActivitySC);
    this.set_rightHandActivity(rightHandActivity);

    var strict = serializeContext['strict'];
    this.set_strict(strict);
}

//activity的序列化
function jsWorkFlow_Activities_CompareActivity$saveSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.CompareActivity saveSerializeContext!");

    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = 'jsWorkFlow.Activities.CompareActivity';

    //保存自身
    serializeContext['leftHandActivity'] = $jwf.saveActivity(this.get_leftHandActivity());
    serializeContext['rightHandActivity'] = $jwf.saveActivity(this.get_rightHandActivity());
    serializeContext['strict'] = this.get_strict();

    //保存base
    var baseSerializeContext = {};

    jsoop.callBaseMethod(jsWorkFlow.Activities.CompareActivity, this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}

function jsWorkFlow_Activities_CompareActivity$doExecLha(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.CompareActivity doExecLha!");

    //开始执行lha
    //如果没有设置条件，认为为false，执行else分支
    var lhaActivity = this._leftHandActivity;

    if (!lhaActivity) {
        this.doExecRha(context, null);
        return;
    }

    var application = context.get_application();
    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, lhaActivity, context);

    activityExecutor.add_postComplete(this._doExecLhaCompleteHandler);

    //OK, kick activityExecutor to run!
    activityExecutor.execute();

}

function jsWorkFlow_Activities_CompareActivity$doExecLhaCompleteHandler(sender, eventArgs) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.CompareActivity doExecLhaCompleteHandler!");

    var context = eventArgs.get_context();
    var executor = context.get_executor();
    var parentContext = executor.get_parentContext();

    //获取activity的最后的执行结果，作为doExecRha的输入
    var lhaResult = context.get_result();

    //执行Rha
    this.doExecRha(parentContext, lhaResult);

    return;
}

function jsWorkFlow_Activities_CompareActivity$doExecCompare(lhaResult, rhaResult) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.CompareActivity doExecCompare!");

    var strict = this._strict;
    var isEquals = (lhaResult == rhaResult);
    var result = 0;

    if (strict) {
        isEquals = (lhaResult === rhaResult);
    }

    if (!isEquals) {
        if (lhaResult > rhaResult) {
            result = 1;
        }
        else {
            result = -1;
        }
    }

    return result;
}

function jsWorkFlow_Activities_CompareActivity$doExecRha(context, lhaResult) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.CompareActivity doExecRha!");

    //开始执行lha
    //如果没有设置条件，认为为false，执行else分支
    var rhaActivity = this._rightHandActivity;

    if (!rhaActivity) {
        //结束activity的执行，并设置执行结果
        var result = this.doExecCompare(lhaResult, null);
        context.set_result(result);
        $jwf.endActivity(context);
        return;
    }

    //调度执行rha
    var application = context.get_application();
    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, rhaActivity, context);

    //将上下文的数据存放在activityExecutor之中
    activityExecutor.lhaResult = lhaResult;

    activityExecutor.add_postComplete(this._doExecRhaCompleteHandler);

    //OK, kick activityExecutor to run!
    activityExecutor.execute();
}

function jsWorkFlow_Activities_CompareActivity$doExecRhaCompleteHandler(sender, eventArgs) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.CompareActivity doExecRhaCompleteHandler!");

    var context = eventArgs.get_context();
    var executor = context.get_executor();
    var parentContext = executor.get_parentContext();
    var lhaResult = executor.lhaResult;

    var rhaResult = context.get_result();
    var result = this.doExecCompare(lhaResult, rhaResult);
    parentContext.set_result(result);

    //结束activity的执行
    $jwf.endActivity(parentContext);
    return;
}


//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_CompareActivity$execute(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.CompareActivity execute!");

    jsoop.callBaseMethod(jsWorkFlow.Activities.CompareActivity, this, 'execute', [context]);

    this.doExecLha(context);
}

jsWorkFlow.Activities.CompareActivity.prototype = {
    _leftHandActivity: null,
    _rightHandActivity: null,
    _doExecLhaCompleteHandler: null,
    _doExecRhaCompleteHandler: null,
    _strict: false,
    dispose: jsWorkFlow_Activities_CompareActivity$dispose,
    //property
    get_leftHandActivity: jsWorkFlow_Activities_CompareActivity$get_leftHandActivity,
    set_leftHandActivity: jsWorkFlow_Activities_CompareActivity$set_leftHandActivity,
    get_rightHandActivity: jsWorkFlow_Activities_CompareActivity$get_rightHandActivity,
    set_rightHandActivity: jsWorkFlow_Activities_CompareActivity$set_rightHandActivity,
    get_strict: jsWorkFlow_Activities_CompareActivity$get_strict,
    set_strict: jsWorkFlow_Activities_CompareActivity$set_strict,

    //method
    loadSerializeContext: jsWorkFlow_Activities_CompareActivity$loadSerializeContext,
    saveSerializeContext: jsWorkFlow_Activities_CompareActivity$saveSerializeContext,
    doExecLha: jsWorkFlow_Activities_CompareActivity$doExecLha,
    doExecLhaCompleteHandler: jsWorkFlow_Activities_CompareActivity$doExecLhaCompleteHandler,
    doExecCompare: jsWorkFlow_Activities_CompareActivity$doExecCompare,
    doExecRha: jsWorkFlow_Activities_CompareActivity$doExecRha,
    doExecRhaCompleteHandler: jsWorkFlow_Activities_CompareActivity$doExecRhaCompleteHandler,
    execute: jsWorkFlow_Activities_CompareActivity$execute
};

jsoop.registerClass(
    jsoop.setTypeName(jsWorkFlow.Activities.CompareActivity, 'jsWorkFlow.Activities.CompareActivity'),
    jsWorkFlow.Activity);

//////////////////////////////////////////////////////////////////////////////////////////
//IsEqualsActivity
//
//TO 开发者：
//    一个执行 相等性判断 操作的activity。
//    如果activity为null，其result被作为null处理。
//    进行equals比较，如果相等，返回true
//
jsWorkFlow.Activities.IsEqualsActivity = function jsWorkFlow_Activities_IsEqualsActivity(leftHandActivity, rightHandActivity, strict) {
    jsoop.initializeBase(jsWorkFlow.Activities.IsEqualsActivity, this, [leftHandActivity, rightHandActivity, strict]);
};

function jsWorkFlow_Activities_IsEqualsActivity$dispose() {
    jsoop.callBaseMethod(jsWorkFlow.Activities.IsEqualsActivity, this, 'dispose');
}



//activity的恢复
function jsWorkFlow_Activities_IsEqualsActivity$loadSerializeContext(serializeContext) {
    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== 'jsWorkFlow.Activities.IsEqualsActivity') {
        throw jsoop.errorInvalidOperation("loadSerializeContext missmatch type!");
    }


    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jsoop.callBaseMethod(jsWorkFlow.Activities.IsEqualsActivity, this, 'loadSerializeContext', [baseSerializeContext]);

    //恢复自身
}

//activity的序列化
function jsWorkFlow_Activities_IsEqualsActivity$saveSerializeContext(serializeContext) {

    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = 'jsWorkFlow.Activities.IsEqualsActivity';

    //保存自身

    //保存base
    var baseSerializeContext = {};

    jsoop.callBaseMethod(jsWorkFlow.Activities.IsEqualsActivity, this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}

function jsWorkFlow_Activities_IsEqualsActivity$doExecCompare(lhaResult, rhaResult) {
    var strict = this._strict;
    var isEquals = (lhaResult == rhaResult);
    if (strict) {
        isEquals = (lhaResult === rhaResult);
    }

    return isEquals;
}


//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_IsEqualsActivity$execute(context) {
    jsWorkFlow.Activities.IsEqualsActivity.callBaseMethod(this, 'execute', [context]);
}

jsWorkFlow.Activities.IsEqualsActivity.prototype = {
    dispose: jsWorkFlow_Activities_IsEqualsActivity$dispose,
    //property

    //method
    doExecCompare: jsWorkFlow_Activities_IsEqualsActivity$doExecCompare,
    execute: jsWorkFlow_Activities_IsEqualsActivity$execute
};

jsoop.registerClass(
    jsoop.setTypeName(jsWorkFlow.Activities.IsEqualsActivity, 'jsWorkFlow.Activities.IsEqualsActivity'), 
    jsWorkFlow.Activities.CompareActivity);


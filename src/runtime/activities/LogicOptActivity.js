/*
* jsWorkFlow's core source code.
* 2012.11.06: Create By Yin Mingjun - email: yinmingjuncn@gmail.com
* 
* Copyright 2012,  Yin MingJun - email: yinmingjuncn@gmail.com
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
*/

Type.registerNamespace('jsWorkFlow.Activities');

//////////////////////////////////////////////////////////////////////////////////////////
//LogicAndActivity
//
//TO 开发者：
//    一个执行AND操作的activity。
//    对于非bool值向bool转换的规则，同javascript默认处理方式。undefined，null，0和""作为false。
//    遵循短路算法的逻辑。如果lha是false，那么rha将不会被execute。
//    如果activity为null，作为false处理。
//
jsWorkFlow.Activities.LogicAndActivity = function jsWorkFlow_Activities_LogicAndActivity(leftHandActivity, rightHandActivity) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicAndActivity create!");

    jsWorkFlow.Activities.LogicAndActivity.initializeBase(this);
    this.set_leftHandActivity(leftHandActivity);
    this.set_rightHandActivity(rightHandActivity);

    this._doExecLhaCompleteHandler = Function.createDelegate(this, this.doExecLhaCompleteHandler);
    this._doExecRhaCompleteHandler = Function.createDelegate(this, this.doExecRhaCompleteHandler);
};

function jsWorkFlow_Activities_LogicAndActivity$dispose() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicAndActivity dispose!");

    jsWorkFlow.Activities.LogicAndActivity.callBaseMethod(this, 'dispose');
}


function jsWorkFlow_Activities_LogicAndActivity$get_leftHandActivity() {
    return this._leftHandActivity;
}

function jsWorkFlow_Activities_LogicAndActivity$set_leftHandActivity(value) {
    this._leftHandActivity = value;
}

function jsWorkFlow_Activities_LogicAndActivity$get_rightHandActivity() {
    return this._rightHandActivity;
}

function jsWorkFlow_Activities_LogicAndActivity$set_rightHandActivity(value) {
    this._rightHandActivity = value;
}

//activity的恢复
function jsWorkFlow_Activities_LogicAndActivity$loadSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicAndActivity loadSerializeContext!");

    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== this.getType().getName()) {
        throw Error.invalidOperation("loadSerializeContext missmatch type!");
    }


    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jsWorkFlow.Activities.LogicAndActivity.callBaseMethod(this, 'loadSerializeContext', [baseSerializeContext]);

    //恢复自身
    var leftHandActivitySC = serializeContext['leftHandActivity'];
    var leftHandActivity = $jwf.loadActivity(leftHandActivitySC);
    this.set_leftHandActivity(leftHandActivity);

    var rightHandActivitySC = serializeContext['rightHandActivity'];
    var rightHandActivity = $jwf.loadActivity(rightHandActivitySC);
    this.set_rightHandActivity(rightHandActivity);
}

//activity的序列化
function jsWorkFlow_Activities_LogicAndActivity$saveSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicAndActivity saveSerializeContext!");


    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = this.getType().getName();

    //保存自身
    serializeContext['leftHandActivity'] = $jwf.saveActivity(this.get_leftHandActivity());
    serializeContext['rightHandActivity'] = $jwf.saveActivity(this.get_rightHandActivity());

    //保存base
    var baseSerializeContext = {};

    jsWorkFlow.Activities.LogicAndActivity.callBaseMethod(this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}

function jsWorkFlow_Activities_LogicAndActivity$doExecLha(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicAndActivity doExecLha!");

    //开始执行lha
    //如果没有设置条件，认为为false，执行else分支
    var lhaActivity = this._leftHandActivity;

    if (!lhaActivity) {
        this.doExecRha(context, false);
        return;
    }

    var application = context.get_application();
    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, lhaActivity);

    //将上下文的数据存放在activityExecutor之中
    activityExecutor.parentContext = context;

    activityExecutor.add_postComplete(this._doExecLhaCompleteHandler);

    //OK, kick activityExecutor to run!
    activityExecutor.execute();

}

function jsWorkFlow_Activities_LogicAndActivity$doExecLhaCompleteHandler(sender, eventArgs) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicAndActivity doExecLhaCompleteHandler!");

    var context = eventArgs.get_context();
    var executor = context.get_executor();
    var parentContext = executor.parentContext;

    //获取activity的最后的执行结果，作为doExecRha的输入
    var lhaResult = context.get_result();

    //执行Rha
    this.doExecRha(parentContext, lhaResult);

    return;
}

function jsWorkFlow_Activities_LogicAndActivity$doExecRha(context, lhaResult) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicAndActivity doExecRha!");


    //执行短路逻辑，如果为false，后面的不用执行了。
    if (!lhaResult) {
        //结束activity的执行，并设置执行结果
        context.set_result(lhaResult);
        $jwf.endActivity(context);
        return;
    }

    //开始执行lha
    //如果没有设置条件，认为为false，执行else分支
    var rhaActivity = this._rightHandActivity;

    if (!rhaActivity) {
        //结束activity的执行，并设置执行结果
        context.set_result(false);
        $jwf.endActivity(context);
        return;
    }

    //调度执行rha
    var application = context.get_application();
    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, rhaActivity);

    //将上下文的数据存放在activityExecutor之中
    activityExecutor.parentContext = context;

    activityExecutor.add_postComplete(this._doExecRhaCompleteHandler);

    //OK, kick activityExecutor to run!
    activityExecutor.execute();
}

function jsWorkFlow_Activities_LogicAndActivity$doExecRhaCompleteHandler(sender, eventArgs) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicAndActivity doExecRhaCompleteHandler!");

    var context = eventArgs.get_context();
    var executor = context.get_executor();
    var parentContext = executor.parentContext;

    //将activity的最后的执行结果作为当前activity的执行结果
    //因为既然调度rha执行，说明lha的执行结果一定是true，可以忽略lha，直接写入rha的执行结果。
    var result = context.get_result();
    parentContext.set_result(!!result);

    //结束activity的执行
    $jwf.endActivity(parentContext);
    return;
}


//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_LogicAndActivity$execute(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicAndActivity execute!");

    jsWorkFlow.Activities.LogicAndActivity.callBaseMethod(this, 'execute', [context]);

    this.doExecLha(context);
}

jsWorkFlow.Activities.LogicAndActivity.prototype = {
    _leftHandActivity: null,
    _rightHandActivity: null,
    _doExecLhaCompleteHandler: null,
    _doExecRhaCompleteHandler: null,
    dispose: jsWorkFlow_Activities_LogicAndActivity$dispose,
    //property
    get_leftHandActivity: jsWorkFlow_Activities_LogicAndActivity$get_leftHandActivity,
    set_leftHandActivity: jsWorkFlow_Activities_LogicAndActivity$set_leftHandActivity,
    get_rightHandActivity: jsWorkFlow_Activities_LogicAndActivity$get_rightHandActivity,
    set_rightHandActivity: jsWorkFlow_Activities_LogicAndActivity$set_rightHandActivity,
    //method
    loadSerializeContext: jsWorkFlow_Activities_LogicAndActivity$loadSerializeContext,
    saveSerializeContext: jsWorkFlow_Activities_LogicAndActivity$saveSerializeContext,
    doExecLha: jsWorkFlow_Activities_LogicAndActivity$doExecLha,
    doExecLhaCompleteHandler: jsWorkFlow_Activities_LogicAndActivity$doExecLhaCompleteHandler,
    doExecRha: jsWorkFlow_Activities_LogicAndActivity$doExecRha,
    doExecRhaCompleteHandler: jsWorkFlow_Activities_LogicAndActivity$doExecRhaCompleteHandler,
    execute: jsWorkFlow_Activities_LogicAndActivity$execute
};

jsWorkFlow.Activities.LogicAndActivity.registerClass('jsWorkFlow.Activities.LogicAndActivity', jsWorkFlow.Activity);


//////////////////////////////////////////////////////////////////////////////////////////
//LogicOrActivity
//
//TO 开发者：
//    一个执行OR操作的activity。
//    对于非bool值向bool转换的规则，同javascript默认处理方式。undefined，null，0和""作为false。
//    遵循短路算法的逻辑。如果lha是true，那么rha将不会被execute。
//    如果activity为null，作为false处理。
//
jsWorkFlow.Activities.LogicOrActivity = function jsWorkFlow_Activities_LogicOrActivity(leftHandActivity, rightHandActivity) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicOrActivity create!");

    jsWorkFlow.Activities.LogicOrActivity.initializeBase(this);
    this.set_leftHandActivity(leftHandActivity);
    this.set_rightHandActivity(rightHandActivity);

    this._doExecLhaCompleteHandler = Function.createDelegate(this, this.doExecLhaCompleteHandler);
    this._doExecRhaCompleteHandler = Function.createDelegate(this, this.doExecRhaCompleteHandler);
};

function jsWorkFlow_Activities_LogicOrActivity$dispose() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicOrActivity dispose!");

    jsWorkFlow.Activities.LogicOrActivity.callBaseMethod(this, 'dispose');
}


function jsWorkFlow_Activities_LogicOrActivity$get_leftHandActivity() {
    return this._leftHandActivity;
}

function jsWorkFlow_Activities_LogicOrActivity$set_leftHandActivity(value) {
    this._leftHandActivity = value;
}

function jsWorkFlow_Activities_LogicOrActivity$get_rightHandActivity() {
    return this._rightHandActivity;
}

function jsWorkFlow_Activities_LogicOrActivity$set_rightHandActivity(value) {
    this._rightHandActivity = value;
}

//activity的恢复
function jsWorkFlow_Activities_LogicOrActivity$loadSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicOrActivity loadSerializeContext!");

    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== this.getType().getName()) {
        throw Error.invalidOperation("loadSerializeContext missmatch type!");
    }


    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jsWorkFlow.Activities.LogicOrActivity.callBaseMethod(this, 'loadSerializeContext', [baseSerializeContext]);

    //恢复自身
    var leftHandActivitySC = serializeContext['leftHandActivity'];
    var leftHandActivity = $jwf.loadActivity(leftHandActivitySC);
    this.set_leftHandActivity(leftHandActivity);

    var rightHandActivitySC = serializeContext['rightHandActivity'];
    var rightHandActivity = $jwf.loadActivity(rightHandActivitySC);
    this.set_rightHandActivity(rightHandActivity);
}

//activity的序列化
function jsWorkFlow_Activities_LogicOrActivity$saveSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicOrActivity saveSerializeContext!");


    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = this.getType().getName();

    //保存自身
    serializeContext['leftHandActivity'] = $jwf.saveActivity(this.get_leftHandActivity());
    serializeContext['rightHandActivity'] = $jwf.saveActivity(this.get_rightHandActivity());

    //保存base
    var baseSerializeContext = {};

    jsWorkFlow.Activities.LogicOrActivity.callBaseMethod(this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}

function jsWorkFlow_Activities_LogicOrActivity$doExecLha(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicOrActivity doExecLha!");

    //开始执行lha
    //如果没有设置条件，认为为false，执行else分支
    var lhaActivity = this._leftHandActivity;

    if (!lhaActivity) {
        this.doExecRha(context, false);
        return;
    }

    var application = context.get_application();
    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, lhaActivity);

    //将上下文的数据存放在activityExecutor之中
    activityExecutor.parentContext = context;

    activityExecutor.add_postComplete(this._doExecLhaCompleteHandler);

    //OK, kick activityExecutor to run!
    activityExecutor.execute();

}

function jsWorkFlow_Activities_LogicOrActivity$doExecLhaCompleteHandler(sender, eventArgs) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicOrActivity doExecLhaCompleteHandler!");

    var context = eventArgs.get_context();
    var executor = context.get_executor();
    var parentContext = executor.parentContext;

    //获取activity的最后的执行结果，作为doExecRha的输入
    var lhaResult = context.get_result();

    //执行Rha
    this.doExecRha(parentContext, lhaResult);

    return;
}

function jsWorkFlow_Activities_LogicOrActivity$doExecRha(context, lhaResult) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicOrActivity doExecRha!");


    //执行短路逻辑，如果为true，后面的不用执行了。
    if (lhaResult) {
        //结束activity的执行，并设置执行结果
        context.set_result(lhaResult);
        $jwf.endActivity(context);
        return;
    }

    //开始执行lha
    //如果没有设置条件，认为为false，执行else分支
    var rhaActivity = this._rightHandActivity;

    if (!rhaActivity) {
        //结束activity的执行，并设置执行结果
        context.set_result(false);
        $jwf.endActivity(context);
        return;
    }

    //调度执行rha
    var application = context.get_application();
    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, rhaActivity);

    //将上下文的数据存放在activityExecutor之中
    activityExecutor.parentContext = context;

    activityExecutor.add_postComplete(this._doExecRhaCompleteHandler);

    //OK, kick activityExecutor to run!
    activityExecutor.execute();
}

function jsWorkFlow_Activities_LogicOrActivity$doExecRhaCompleteHandler(sender, eventArgs) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicOrActivity doExecRhaCompleteHandler!");

    var context = eventArgs.get_context();
    var executor = context.get_executor();
    var parentContext = executor.parentContext;

    //将activity的最后的执行结果作为当前activity的执行结果
    //因为既然调度rha执行，说明lha的执行结果一定是false，可以忽略lha，直接写入rha的执行结果。
    var result = context.get_result();
    parentContext.set_result(!!result);

    //结束activity的执行
    $jwf.endActivity(parentContext);
    return;
}


//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_LogicOrActivity$execute(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicOrActivity execute!");

    jsWorkFlow.Activities.LogicOrActivity.callBaseMethod(this, 'execute', [context]);

    this.doExecLha(context);
}

jsWorkFlow.Activities.LogicOrActivity.prototype = {
    _leftHandActivity: null,
    _rightHandActivity: null,
    _doExecLhaCompleteHandler: null,
    _doExecRhaCompleteHandler: null,
    dispose: jsWorkFlow_Activities_LogicOrActivity$dispose,
    //property
    get_leftHandActivity: jsWorkFlow_Activities_LogicOrActivity$get_leftHandActivity,
    set_leftHandActivity: jsWorkFlow_Activities_LogicOrActivity$set_leftHandActivity,
    get_rightHandActivity: jsWorkFlow_Activities_LogicOrActivity$get_rightHandActivity,
    set_rightHandActivity: jsWorkFlow_Activities_LogicOrActivity$set_rightHandActivity,
    //method
    loadSerializeContext: jsWorkFlow_Activities_LogicOrActivity$loadSerializeContext,
    saveSerializeContext: jsWorkFlow_Activities_LogicOrActivity$saveSerializeContext,
    doExecLha: jsWorkFlow_Activities_LogicOrActivity$doExecLha,
    doExecLhaCompleteHandler: jsWorkFlow_Activities_LogicOrActivity$doExecLhaCompleteHandler,
    doExecRha: jsWorkFlow_Activities_LogicOrActivity$doExecRha,
    doExecRhaCompleteHandler: jsWorkFlow_Activities_LogicOrActivity$doExecRhaCompleteHandler,
    execute: jsWorkFlow_Activities_LogicOrActivity$execute
};

jsWorkFlow.Activities.LogicOrActivity.registerClass('jsWorkFlow.Activities.LogicOrActivity', jsWorkFlow.Activity);


//////////////////////////////////////////////////////////////////////////////////////////
//LogicXorActivity
//
//TO 开发者：
//    一个执行XOR操作的activity。
//    对于非bool值向bool转换的规则，同javascript默认处理方式。undefined，null，0和""作为false。
//    如果activity为null，作为false处理。
//
jsWorkFlow.Activities.LogicXorActivity = function jsWorkFlow_Activities_LogicXorActivity(leftHandActivity, rightHandActivity) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicXorActivity create!");

    jsWorkFlow.Activities.LogicXorActivity.initializeBase(this);
    this.set_leftHandActivity(leftHandActivity);
    this.set_rightHandActivity(rightHandActivity);

    this._doExecLhaCompleteHandler = Function.createDelegate(this, this.doExecLhaCompleteHandler);
    this._doExecRhaCompleteHandler = Function.createDelegate(this, this.doExecRhaCompleteHandler);
};

function jsWorkFlow_Activities_LogicXorActivity$dispose() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicXorActivity dispose!");

    jsWorkFlow.Activities.LogicXorActivity.callBaseMethod(this, 'dispose');
}


function jsWorkFlow_Activities_LogicXorActivity$get_leftHandActivity() {
    return this._leftHandActivity;
}

function jsWorkFlow_Activities_LogicXorActivity$set_leftHandActivity(value) {
    this._leftHandActivity = value;
}

function jsWorkFlow_Activities_LogicXorActivity$get_rightHandActivity() {
    return this._rightHandActivity;
}

function jsWorkFlow_Activities_LogicXorActivity$set_rightHandActivity(value) {
    this._rightHandActivity = value;
}

//activity的恢复
function jsWorkFlow_Activities_LogicXorActivity$loadSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicXorActivity loadSerializeContext!");

    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== this.getType().getName()) {
        throw Error.invalidOperation("loadSerializeContext missmatch type!");
    }


    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jsWorkFlow.Activities.LogicXorActivity.callBaseMethod(this, 'loadSerializeContext', [baseSerializeContext]);

    //恢复自身
    var leftHandActivitySC = serializeContext['leftHandActivity'];
    var leftHandActivity = $jwf.loadActivity(leftHandActivitySC);
    this.set_leftHandActivity(leftHandActivity);

    var rightHandActivitySC = serializeContext['rightHandActivity'];
    var rightHandActivity = $jwf.loadActivity(rightHandActivitySC);
    this.set_rightHandActivity(rightHandActivity);
}

//activity的序列化
function jsWorkFlow_Activities_LogicXorActivity$saveSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicXorActivity saveSerializeContext!");


    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = this.getType().getName();

    //保存自身
    serializeContext['leftHandActivity'] = $jwf.saveActivity(this.get_leftHandActivity());
    serializeContext['rightHandActivity'] = $jwf.saveActivity(this.get_rightHandActivity());

    //保存base
    var baseSerializeContext = {};

    jsWorkFlow.Activities.LogicXorActivity.callBaseMethod(this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}

function jsWorkFlow_Activities_LogicXorActivity$doExecLha(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicXorActivity doExecLha!");

    //开始执行lha
    //如果没有设置条件，认为为false，执行else分支
    var lhaActivity = this._leftHandActivity;

    if (!lhaActivity) {
        this.doExecRha(context, false);
        return;
    }

    var application = context.get_application();
    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, lhaActivity);

    //将上下文的数据存放在activityExecutor之中
    activityExecutor.parentContext = context;

    activityExecutor.add_postComplete(this._doExecLhaCompleteHandler);

    //OK, kick activityExecutor to run!
    activityExecutor.execute();

}

function jsWorkFlow_Activities_LogicXorActivity$doExecLhaCompleteHandler(sender, eventArgs) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicXorActivity doExecLhaCompleteHandler!");


    var context = eventArgs.get_context();
    var executor = context.get_executor();
    var parentContext = executor.parentContext;

    //获取activity的最后的执行结果，作为doExecRha的输入
    var lhaResult = context.get_result();

    //执行Rha
    this.doExecRha(parentContext, lhaResult);

    return;
}

function jsWorkFlow_Activities_LogicXorActivity$doEvalXor(lhaResult, rhaResult) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicXorActivity doEvalXor!");


    var lhaBit = 0;
    var rhaBit = 0;

    if (!!lhaResult) {
        lhaBit = 1;
    }

    if (!!rhaResult) {
        rhaBit = 1;
    }

    var result = lhaBit ^ rhaBit;

    return !!result;

}

function jsWorkFlow_Activities_LogicXorActivity$doExecRha(context, lhaResult) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicXorActivity doExecRha!");

    //开始执行lha
    //如果没有设置条件，认为为false，执行else分支
    var rhaActivity = this._rightHandActivity;

    if (!rhaActivity) {
        var result = this.doEvalXor(lhaResult, false);
        //结束activity的执行，并设置执行结果
        context.set_result(result);
        $jwf.endActivity(context);
        return;
    }

    //调度执行rha
    var application = context.get_application();
    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, rhaActivity);

    //将上下文的数据存放在activityExecutor之中
    activityExecutor.parentContext = context;
    activityExecutor.lhaResult = lhaResult;

    activityExecutor.add_postComplete(this._doExecRhaCompleteHandler);

    //OK, kick activityExecutor to run!
    activityExecutor.execute();
}

function jsWorkFlow_Activities_LogicXorActivity$doExecRhaCompleteHandler(sender, eventArgs) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicXorActivity doExecRhaCompleteHandler!");

    var context = eventArgs.get_context();
    var executor = context.get_executor();
    var parentContext = executor.parentContext;
    var lhaResult = executor.lhaResult;

    //结束activity的执行，并设置执行结果
    var rhaResult = context.get_result();
    var result = this.doEvalXor(lhaResult, rhaResult);
    parentContext.set_result(!!result);

    //结束activity的执行
    $jwf.endActivity(parentContext);
    return;
}


//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_LogicXorActivity$execute(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicXorActivity execute!");

    jsWorkFlow.Activities.LogicXorActivity.callBaseMethod(this, 'execute', [context]);

    this.doExecLha(context);
}

jsWorkFlow.Activities.LogicXorActivity.prototype = {
    _leftHandActivity: null,
    _rightHandActivity: null,
    _doExecLhaCompleteHandler: null,
    _doExecRhaCompleteHandler: null,
    dispose: jsWorkFlow_Activities_LogicXorActivity$dispose,
    //property
    get_leftHandActivity: jsWorkFlow_Activities_LogicXorActivity$get_leftHandActivity,
    set_leftHandActivity: jsWorkFlow_Activities_LogicXorActivity$set_leftHandActivity,
    get_rightHandActivity: jsWorkFlow_Activities_LogicXorActivity$get_rightHandActivity,
    set_rightHandActivity: jsWorkFlow_Activities_LogicXorActivity$set_rightHandActivity,
    //method
    loadSerializeContext: jsWorkFlow_Activities_LogicXorActivity$loadSerializeContext,
    saveSerializeContext: jsWorkFlow_Activities_LogicXorActivity$saveSerializeContext,
    doExecLha: jsWorkFlow_Activities_LogicXorActivity$doExecLha,
    doExecLhaCompleteHandler: jsWorkFlow_Activities_LogicXorActivity$doExecLhaCompleteHandler,
    doEvalXor: jsWorkFlow_Activities_LogicXorActivity$doEvalXor,
    doExecRha: jsWorkFlow_Activities_LogicXorActivity$doExecRha,
    doExecRhaCompleteHandler: jsWorkFlow_Activities_LogicXorActivity$doExecRhaCompleteHandler,
    execute: jsWorkFlow_Activities_LogicXorActivity$execute
};

jsWorkFlow.Activities.LogicXorActivity.registerClass('jsWorkFlow.Activities.LogicXorActivity', jsWorkFlow.Activity);


//////////////////////////////////////////////////////////////////////////////////////////
//LogicNotActivity
//
//TO 开发者：
//    一个执行NOT操作的activity。
//    对于非bool值向bool转换的规则，同javascript默认处理方式。undefined，null，0和""作为false。
//    如果activity为null，作为false处理。
//
jsWorkFlow.Activities.LogicNotActivity = function jsWorkFlow_Activities_LogicNotActivity(activity) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicNotActivity create!");

    jsWorkFlow.Activities.LogicNotActivity.initializeBase(this);
    this.set_activity(activity);

    this._doExecActivityCompleteHandler = Function.createDelegate(this, this.doExecActivityCompleteHandler);
};

function jsWorkFlow_Activities_LogicNotActivity$dispose() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicNotActivity dispose!");

    jsWorkFlow.Activities.LogicNotActivity.callBaseMethod(this, 'dispose');
}


function jsWorkFlow_Activities_LogicNotActivity$get_activity() {
    return this._activity;
}

function jsWorkFlow_Activities_LogicNotActivity$set_activity(value) {
    this._activity = value;
}

//activity的恢复
function jsWorkFlow_Activities_LogicNotActivity$loadSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicNotActivity loadSerializeContext!");


    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== this.getType().getName()) {
        throw Error.invalidOperation("loadSerializeContext missmatch type!");
    }


    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jsWorkFlow.Activities.LogicNotActivity.callBaseMethod(this, 'loadSerializeContext', [baseSerializeContext]);

    //恢复自身
    var activitySC = serializeContext['activity'];
    var activity = $jwf.loadActivity(activitySC);
    this.set_activity(activity);

}

//activity的序列化
function jsWorkFlow_Activities_LogicNotActivity$saveSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicNotActivity saveSerializeContext!");


    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = this.getType().getName();

    //保存自身
    serializeContext['activity'] = $jwf.saveActivity(this.get_activity());

    //保存base
    var baseSerializeContext = {};

    jsWorkFlow.Activities.LogicNotActivity.callBaseMethod(this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}

function jsWorkFlow_Activities_LogicNotActivity$doExecActivity(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicNotActivity doExecActivity!");


    //开始执行lha
    //如果没有设置条件，认为为false，执行else分支
    var activity = this._activity;

    if (!activity) {
        context.set_result(true);
        $jwf.endActivity(context);
        return;
    }

    var application = context.get_application();
    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, activity);

    //将上下文的数据存放在activityExecutor之中
    activityExecutor.parentContext = context;

    activityExecutor.add_postComplete(this._doExecActivityCompleteHandler);

    //OK, kick activityExecutor to run!
    activityExecutor.execute();

}

function jsWorkFlow_Activities_LogicNotActivity$doExecActivityCompleteHandler(sender, eventArgs) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicNotActivity doExecActivityCompleteHandler!");

    var context = eventArgs.get_context();
    var executor = context.get_executor();
    var parentContext = executor.parentContext;

    //获取activity的最后的执行结果
    var result = context.get_result();

    //结束activity的执行，并设置执行结果
    parentContext.set_result(!result);
    $jwf.endActivity(parentContext);
    return;
}

//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_LogicNotActivity$execute(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.LogicNotActivity execute!");

    jsWorkFlow.Activities.LogicNotActivity.callBaseMethod(this, 'execute', [context]);

    this.doExecActivity(context);
}

jsWorkFlow.Activities.LogicNotActivity.prototype = {
    _activity: null,
    _doExecActivityCompleteHandler: null,
    dispose: jsWorkFlow_Activities_LogicNotActivity$dispose,
    //property
    get_activity: jsWorkFlow_Activities_LogicNotActivity$get_activity,
    set_activity: jsWorkFlow_Activities_LogicNotActivity$set_activity,
    //method
    loadSerializeContext: jsWorkFlow_Activities_LogicNotActivity$loadSerializeContext,
    saveSerializeContext: jsWorkFlow_Activities_LogicNotActivity$saveSerializeContext,
    doExecActivity: jsWorkFlow_Activities_LogicNotActivity$doExecActivity,
    doExecActivityCompleteHandler: jsWorkFlow_Activities_LogicNotActivity$doExecActivityCompleteHandler,
    execute: jsWorkFlow_Activities_LogicNotActivity$execute
};

jsWorkFlow.Activities.LogicNotActivity.registerClass('jsWorkFlow.Activities.LogicNotActivity', jsWorkFlow.Activity);



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
//StateMachineActivity
//
//TO 开发者：
//    提供一个状态机。允许注册有限个状态，并可以驱动当前的状态机变更状态，通过状态的变更
//驱动关联的activity的执行，并通过执行的activity继续驱动状态变更；
//    StateMachineActivity的目标不是设计状态迁移图，而是提供有限状态机的执行载体，并允许
//将整个状态机作为一个活动放置到workflow之中。
//    允许注册有限个状态，none、start、end、error是系统预定义的状态，其它的状态自己指定。
//状态定义完整了就可以启动状态机了。
//    状态机启动就是start状态，结束的状态可以是end或error，通过将状态设置成end或error来结束
//状态机的执行。（error状态比较特殊，可以从error状态恢复，也可以直接结束状态机）
//    在外部通过将activity注册到关注的目标状态或状态迁移来执行activity。
//
jsWorkFlow.Activities.StateMachineActivity = function jsWorkFlow_Activities_StateMachineActivity(executeActivity) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.StateMachineActivity create!");


    jso.initializeBase(jsWorkFlow.Activities.StateMachineActivity, this);

    this._executeActivity = executeActivity;
};

function jsWorkFlow_Activities_StateMachineActivity$dispose() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.StateMachineActivity dispose!");

    jso.callBaseMethod(jsWorkFlow.Activities.StateMachineActivity, this, 'dispose');
    this._executeActivity = null;
}

function jsWorkFlow_Activities_StateMachineActivity$get_executeActivity() {
    return this._executeActivity;
}

function jsWorkFlow_Activities_StateMachineActivity$set_executeActivity(value) {
    this._executeActivity = value;
}

function jsWorkFlow_Activities_StateMachineActivity$notifyStateChanged(context, oldState, curState) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.StateMachineActivity notifyStateChanged!");

    log.debug("oldState:[" + oldState + "]!");
    log.debug("curState:[" + curState + "]!");

    //先执行基类的notifyStateChanged
    jso.callBaseMethod(jsWorkFlow.Activities.StateMachineActivity, this, 'notifyStateChanged', [context, oldState, curState]);

    //如果状态不是end or error，通知状态变更，执行executeActivity
    if ((jsWorkFlow.ActivityState.end === curState) || (jsWorkFlow.ActivityState.error === curState)) {
        return;
    }

    //如果executeActivity不存在，意味着状态机是空的，没有必要等待
    executeActivity = this.get_executeActivity();

    if (!executeActivity) {
        //结束activity
        $jwf.endActivity(context);
        return;
    }

    //执行executeActivity，一般在executeActivity的执行过程中，会驱动状态发送变更，再次进入notifyStateChanged，或结束状态机的执行。
    var application = context.get_application();
    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, executeActivity, context);
    //OK, kick activityExecutor to run!
    activityExecutor.execute();

}

//activity的恢复
function jsWorkFlow_Activities_StateMachineActivity$loadSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.StateMachineActivity loadSerializeContext!");

    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== 'jsWorkFlow.Activities.StateMachineActivity') {
        throw jso.errorInvalidOperation("loadSerializeContext missmatch type!");
    }

    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jso.callBaseMethod(jsWorkFlow.Activities.StateMachineActivity, this, 'loadSerializeContext', [baseSerializeContext]);

    //恢复自身
    var executeActivitySC = serializeContext["executeActivity"];
    var executeActivity = $jwf.loadActivity(executeActivitySC);
    this.set_executeActivity(executeActivity);

}

//activity的序列化
function jsWorkFlow_Activities_StateMachineActivity$saveSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.StateMachineActivity saveSerializeContext!");

    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = 'jsWorkFlow.Activities.StateMachineActivity';

    //保存自身
    var executeActivity = this.get_executeActivity();
    serializeContext["executeActivity"] = $jwf.saveActivity(executeActivity);

    //保存base
    var baseSerializeContext = {};

    jso.callBaseMethod(jsWorkFlow.Activities.StateMachineActivity, this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}

//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_StateMachineActivity$execute(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.StateMachineActivity execute!");

    jso.callBaseMethod(jsWorkFlow.Activities.StateMachineActivity, this, 'execute', [context]);

    //TODO:
    //    LOG noop message!

    //StateMachine的状态变更是通过活动来驱动的，也就是说，通过外部对ActivityContext中的状态的变更来驱动状态机的执行，
    //状态机的结束也是通过状态驱动来完成的。
    
    //状态机的状态变更驱动Activity的执行，Activity通过其Context获取状态机的Context，并设置状态

    //执行完毕，结束activity
    //$jwf.endActivity(context);
}

jsWorkFlow.Activities.StateMachineActivity.prototype = {
    _executeActivity: null,
    dispose: jsWorkFlow_Activities_StateMachineActivity$dispose,
    //property
    get_executeActivity: jsWorkFlow_Activities_StateMachineActivity$get_executeActivity,
    set_executeActivity: jsWorkFlow_Activities_StateMachineActivity$set_executeActivity,
    //method
    notifyStateChanged: jsWorkFlow_Activities_StateMachineActivity$notifyStateChanged,
    execute: jsWorkFlow_Activities_StateMachineActivity$execute
};

jso.registerClass(
    jso.setTypeName(jsWorkFlow.Activities.StateMachineActivity, 'jsWorkFlow.Activities.StateMachineActivity'), 
    jsWorkFlow.Activity);

//根据context搜索StateMachine的context
function $jwf$sm$findStateMachineContext(context) {
    var retval = null;

    if (!context) {
        return retval;
    }

    var app = context.get_application();

    if (!app) {
        return retval;
    }

    //根据contextStack进行搜索
    var contextStack = app._contextStack;

    for (var i = 0, ilen = contextStack.length; i < ilen; i++) {
        var contextItem = contextStack[ilen - i - 1];

        var contextItemAct = contextItem.get_activity();

        //
        if (jso.isInstanceOfType(contextItemAct, jsWorkFlow.Activities.StateMachineActivity)) {
            //OK, find it!
            return contextItem;
        }
    }

    return retval;
}

//////////////////////////////////////////////////////////////////////////////////////////
//GetStateMachineStateActivity
//
//TO 开发者：
//    根据所在的状态机，获取状态机的状态，并将结果放置于Context的result之中
//
jsWorkFlow.Activities.GetStateMachineStateActivity = function jsWorkFlow_Activities_GetStateMachineStateActivity() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.GetStateMachineStateActivity create!");

    jso.initializeBase(jsWorkFlow.Activities.GetStateMachineStateActivity, this);

};

function jsWorkFlow_Activities_GetStateMachineStateActivity$dispose() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.GetStateMachineStateActivity dispose!");

    jso.callBaseMethod(jsWorkFlow.Activities.GetStateMachineStateActivity, this, 'dispose');
}


//activity的恢复
function jsWorkFlow_Activities_GetStateMachineStateActivity$loadSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.GetStateMachineStateActivity loadSerializeContext!");


    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== 'jsWorkFlow.Activities.GetStateMachineStateActivity') {
        throw jso.errorInvalidOperation("loadSerializeContext missmatch type!");
    }


    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jso.callBaseMethod(jsWorkFlow.Activities.GetStateMachineStateActivity, this, 'loadSerializeContext', [baseSerializeContext]);

    //恢复自身

}

//activity的序列化
function jsWorkFlow_Activities_GetStateMachineStateActivity$saveSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.GetStateMachineStateActivity saveSerializeContext!");


    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = 'jsWorkFlow.Activities.GetStateMachineStateActivity';

    //保存自身

    //保存base
    var baseSerializeContext = {};

    jso.callBaseMethod(jsWorkFlow.Activities.GetStateMachineStateActivity, this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}

//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_GetStateMachineStateActivity$execute(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.GetStateMachineStateActivity execute!");

    jso.callBaseMethod(jsWorkFlow.Activities.GetStateMachineStateActivity, this, 'execute', [context]);

    var smContext = $jwf$sm$findStateMachineContext(context);
    var smState = jsWorkFlow.ActivityState.none;

    if (smContext) {
        smState = smContext.get_activityState();
    }

    //将状态机的状态传递到context的result中，然后结束
    context.set_result(smState);

    //TODO:
    //    LOG noop message!

    //执行完毕，结束activity
    $jwf.endActivity(context);
}

jsWorkFlow.Activities.GetStateMachineStateActivity.prototype = {
    dispose: jsWorkFlow_Activities_GetStateMachineStateActivity$dispose,
    //property
    //method
    loadSerializeContext: jsWorkFlow_Activities_GetStateMachineStateActivity$loadSerializeContext,
    saveSerializeContext: jsWorkFlow_Activities_GetStateMachineStateActivity$saveSerializeContext,
    execute: jsWorkFlow_Activities_GetStateMachineStateActivity$execute
};

jso.registerClass(
    jso.setTypeName(jsWorkFlow.Activities.GetStateMachineStateActivity, 'jsWorkFlow.Activities.GetStateMachineStateActivity'), 
    jsWorkFlow.Activity);



//////////////////////////////////////////////////////////////////////////////////////////
//SetStateMachineStateActivity
//
//TO 开发者：
//    根据所在的状态机，设置状态机的状态，并将状态机之前的状态放置于Context的result之中。
//结束状态机通过设置状态为：jsWorkFlow.ActivityState.end
//
jsWorkFlow.Activities.SetStateMachineStateActivity = function jsWorkFlow_Activities_SetStateMachineStateActivity(stateActivity) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.SetStateMachineStateActivity create!");

    jso.initializeBase(jsWorkFlow.Activities.SetStateMachineStateActivity, this);

    this._stateActivity = stateActivity;
    this._doStateActivityCompleteHandler = jso.createDelegate(this, this.doStateActivityCompleteHandler);

};

function jsWorkFlow_Activities_SetStateMachineStateActivity$dispose() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.SetStateMachineStateActivity dispose!");

    jso.callBaseMethod(jsWorkFlow.Activities.SetStateMachineStateActivity, this, 'dispose');

    this._stateActivity = null;
    this._doStateActivityCompleteHandler = null;
}

//需设置的状态，通过activity的执行结果来获取
function jsWorkFlow_Activities_SetStateMachineStateActivity$get_stateActivity() {
    return this._stateActivity;
}

function jsWorkFlow_Activities_SetStateMachineStateActivity$set_stateActivity(value) {
    this._stateActivity = value;
}

//activity的恢复
function jsWorkFlow_Activities_SetStateMachineStateActivity$loadSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.SetStateMachineStateActivity loadSerializeContext!");


    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== this.getType().getName()) {
        throw jso.errorInvalidOperation("loadSerializeContext missmatch type!");
    }

    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jso.callBaseMethod(jsWorkFlow.Activities.SetStateMachineStateActivity, this, 'loadSerializeContext', [baseSerializeContext]);

    //恢复自身
    var stateActivitySC = serializeContext["stateActivity"];
    var stateActivity = $jwf.loadActivity(stateActivitySC);
    this.set_stateActivity(stateActivity);

}

//activity的序列化
function jsWorkFlow_Activities_SetStateMachineStateActivity$saveSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.SetStateMachineStateActivity saveSerializeContext!");


    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = 'jsWorkFlow.Activities.SetStateMachineStateActivity';

    //保存自身
    var stateActivity = this.get_stateActivity();
    serializeContext["stateActivity"] = $jwf.saveActivity(stateActivity);

    //保存base
    var baseSerializeContext = {};

    jso.callBaseMethod(jsWorkFlow.Activities.SetStateMachineStateActivity, this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}

function jsWorkFlow_Activities_SetStateMachineStateActivity$doStateActivityCompleteHandler(sender, eventArgs) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.SetStateMachineStateActivity doStateActivityCompleteHandler!");

    var context = eventArgs.get_context();
    var executor = context.get_executor();
    var parentContext = executor.get_parentContext();

    //取执行结果
    var curState = context.get_result();

    //获取StateMachine的context
    var smContext = $jwf$sm$findStateMachineContext(context);
    var oldState = jsWorkFlow.ActivityState.none;

    if (smContext) {
        oldState = smContext.get_activityState();
        smContext.set_activityState(curState);
        //将状态机的旧状态传递到parentContext的result中
        parentContext.set_result(oldState);
    }
    else {
        //不可能发生的情况！
        //LOG ERROR!
    }

    //结束parentContext的执行
    $jwf.endActivity(parentContext);
}


//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_SetStateMachineStateActivity$execute(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.SetStateMachineStateActivity execute!");

    jso.callBaseMethod(jsWorkFlow.Activities.SetStateMachineStateActivity, this, 'execute', [context]);

    //如果存在stateActivity，执行其，并获取最新的状态
    var stateActivity = this.get_stateActivity();
    if (!stateActivity) {
        //执行完毕，结束activity
        $jwf.endActivity(context);
        return;
    }

    //执行stateActivity获取新状态
    var application = context.get_application();
    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, stateActivity, context);

    activityExecutor.add_postComplete(this._doStateActivityCompleteHandler);

    //OK, kick activityExecutor to run!
    activityExecutor.execute();


    //TODO:
    //    LOG noop message!

    ////执行完毕，结束activity
    //$jwf.endActivity(context);
}

jsWorkFlow.Activities.SetStateMachineStateActivity.prototype = {
    _stateActivity: null,
    _doStateActivityCompleteHandler: null,
    dispose: jsWorkFlow_Activities_SetStateMachineStateActivity$dispose,
    //property
    get_stateActivity: jsWorkFlow_Activities_SetStateMachineStateActivity$get_stateActivity,
    set_stateActivity: jsWorkFlow_Activities_SetStateMachineStateActivity$set_stateActivity,
    //method
    loadSerializeContext: jsWorkFlow_Activities_SetStateMachineStateActivity$loadSerializeContext,
    saveSerializeContext: jsWorkFlow_Activities_SetStateMachineStateActivity$saveSerializeContext,
    doStateActivityCompleteHandler: jsWorkFlow_Activities_SetStateMachineStateActivity$doStateActivityCompleteHandler,
    execute: jsWorkFlow_Activities_SetStateMachineStateActivity$execute
};

jso.registerClass(
    jso.setTypeName(jsWorkFlow.Activities.SetStateMachineStateActivity, 'jsWorkFlow.Activities.SetStateMachineStateActivity'), 
    jsWorkFlow.Activity);


//////////////////////////////////////////////////////////////////////////////////////////
//EndStateMachineActivity
//
//TO 开发者：
//    用于结束一个StateMachine的执行，使其进入结束状态。
//
jsWorkFlow.Activities.EndStateMachineActivity = function jsWorkFlow_Activities_EndStateMachineActivity() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.EndStateMachineActivity create!");

    jso.initializeBase(jsWorkFlow.Activities.EndStateMachineActivity, this);

};

function jsWorkFlow_Activities_EndStateMachineActivity$dispose() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.EndStateMachineActivity dispose!");

    jso.callBaseMethod(jsWorkFlow.Activities.EndStateMachineActivity, this, 'dispose');
}


//activity的恢复
function jsWorkFlow_Activities_EndStateMachineActivity$loadSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.EndStateMachineActivity loadSerializeContext!");

    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== 'jsWorkFlow.Activities.EndStateMachineActivity') {
        throw jso.errorInvalidOperation("loadSerializeContext missmatch type!");
    }


    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jso.callBaseMethod(jsWorkFlow.Activities.EndStateMachineActivity, this, 'loadSerializeContext', [baseSerializeContext]);

    //恢复自身

}

//activity的序列化
function jsWorkFlow_Activities_EndStateMachineActivity$saveSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.EndStateMachineActivity saveSerializeContext!");


    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = 'jsWorkFlow.Activities.EndStateMachineActivity';

    //保存自身

    //保存base
    var baseSerializeContext = {};

    jso.callBaseMethod(jsWorkFlow.Activities.EndStateMachineActivity, this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}

//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_EndStateMachineActivity$execute(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.EndStateMachineActivity execute!");


    jso.callBaseMethod(jsWorkFlow.Activities.EndStateMachineActivity, this, 'execute', [context]);

    //获取StateMachine的context
    var smContext = $jwf$sm$findStateMachineContext(context);
    var oldState = jsWorkFlow.ActivityState.none;

    if (smContext) {
        oldState = smContext.get_activityState();
        //结束smContext的执行
        $jwf.endActivity(smContext);
        //将oldState作为activity的执行结果
        context.set_result(oldState);
    }
    else {
        //不可能发生的情况！
        //LOG ERROR!
    }

    //TODO:
    //    LOG noop message!

    //执行完毕，结束activity
    $jwf.endActivity(context);
}

jsWorkFlow.Activities.EndStateMachineActivity.prototype = {
    dispose: jsWorkFlow_Activities_EndStateMachineActivity$dispose,
    //property
    //method
    loadSerializeContext: jsWorkFlow_Activities_EndStateMachineActivity$loadSerializeContext,
    saveSerializeContext: jsWorkFlow_Activities_EndStateMachineActivity$saveSerializeContext,
    execute: jsWorkFlow_Activities_EndStateMachineActivity$execute
};

jso.registerClass(
    jso.setTypeName(jsWorkFlow.Activities.EndStateMachineActivity, 'jsWorkFlow.Activities.EndStateMachineActivity'), 
    jsWorkFlow.Activity);


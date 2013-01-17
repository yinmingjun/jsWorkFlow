/*
* jsWorkFlow's core source code.
* 2012.03.22: Create By Yin Mingjun - email: yinmingjuncn@gmail.com
* 
* Copyright 2012,  Yin MingJun - email: yinmingjuncn@gmail.com
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
*/

Type.registerNamespace('jsWorkFlow.Activities');

//////////////////////////////////////////////////////////////////////////////////////////
//NoopActivity
//
//TO 开发者：
//    一个空操作(noop)的activity，仅用于展示activity得到基本控制流程，可以当成activity的占位
//符使用。
//
jsWorkFlow.Activities.NoopActivity = function jsWorkFlow_Activities_NoopActivity() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.NoopActivity create!");


    jsWorkFlow.Activities.NoopActivity.initializeBase(this);

};

function jsWorkFlow_Activities_NoopActivity$dispose() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.NoopActivity dispose!");

    jsWorkFlow.Activities.NoopActivity.callBaseMethod(this, 'dispose');
}


//activity的恢复
function jsWorkFlow_Activities_NoopActivity$loadSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.NoopActivity loadSerializeContext!");

    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== this.getType().getName()) {
        throw Error.invalidOperation("loadSerializeContext missmatch type!");
    }


    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jsWorkFlow.Activities.NoopActivity.callBaseMethod(this, 'loadSerializeContext', [baseSerializeContext]);

    //恢复自身

}

//activity的序列化
function jsWorkFlow_Activities_NoopActivity$saveSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.NoopActivity saveSerializeContext!");

    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = this.getType().getName();

    //保存自身

    //保存base
    var baseSerializeContext = {};

    jsWorkFlow.Activities.NoopActivity.callBaseMethod(this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}

//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_NoopActivity$execute(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.NoopActivity execute!");

    jsWorkFlow.Activities.NoopActivity.callBaseMethod(this, 'execute', [context]);

    //TODO:
    //    LOG noop message!

    //执行完毕，结束activity
    $jwf.endActivity(context);
}

jsWorkFlow.Activities.NoopActivity.prototype = {
    dispose: jsWorkFlow_Activities_NoopActivity$dispose,
    //property
    //method
    loadSerializeContext: jsWorkFlow_Activities_NoopActivity$loadSerializeContext,
    saveSerializeContext: jsWorkFlow_Activities_NoopActivity$saveSerializeContext,
    execute: jsWorkFlow_Activities_NoopActivity$execute
};

jsWorkFlow.Activities.NoopActivity.registerClass('jsWorkFlow.Activities.NoopActivity', jsWorkFlow.Activity);



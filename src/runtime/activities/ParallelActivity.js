/*
* jsWorkFlow's core source code.
* 2012.03.30: Create By Yin Mingjun - email: yinmingjuncn@gmail.com
* 
* Copyright 2012,  Yin MingJun - email: yinmingjuncn@gmail.com
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
*/

Type.registerNamespace('jsWorkFlow.Activities');

//////////////////////////////////////////////////////////////////////////////////////////
//ParallelActivity
//
//TO 开发者：
//    提供同时执行activity的运行环境。在javascript中实际上是不存在并行的运行环境，不过存在异步
//的处理模式，ParallelActivity并不担保会让所有的activity并行执行，只是会尽量提前activity的执行
//时机。
//
jsWorkFlow.Activities.ParallelActivity = function jsWorkFlow_Activities_ParallelActivity() {
    jsWorkFlow.Activities.ParallelActivity.initializeBase(this);

};

function jsWorkFlow_Activities_ParallelActivity$dispose() {
    jsWorkFlow.Activities.ParallelActivity.callBaseMethod(this, 'dispose');
}

//activity的恢复
function jsWorkFlow_Activities_ParallelActivity$loadSerializeContext(serializeContext) {
    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== this.getType().getName()) {
        throw Error.invalidOperation("loadSerializeContext missmatch type!");
    }

    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jsWorkFlow.Activities.ParallelActivity.callBaseMethod(this, 'loadSerializeContext', [baseSerializeContext]);

}

//activity的序列化
function jsWorkFlow_Activities_ParallelActivity$saveSerializeContext(serializeContext) {

    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = this.getType().getName();

    //保存base
    var baseSerializeContext = {};

    jsWorkFlow.Activities.ParallelActivity.callBaseMethod(this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}

//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_ParallelActivity$execute(context) {
    jsWorkFlow.Activities.ParallelActivity.callBaseMethod(this, 'execute', [context]);

    //TODO:
    //    LOG noop message!

    //执行完毕，结束activity
    $jwf.endActivity(context);
}

jsWorkFlow.Activities.ParallelActivity.prototype = {
    dispose: jsWorkFlow_Activities_ParallelActivity$dispose,
    //property
    //method
    loadSerializeContext: jsWorkFlow_Activities_ParallelActivity$loadSerializeContext,
    saveSerializeContext: jsWorkFlow_Activities_ParallelActivity$saveSerializeContext,
    execute: jsWorkFlow_Activities_ParallelActivity$execute
};

jsWorkFlow.Activities.ParallelActivity.registerClass('jsWorkFlow.Activities.ParallelActivity', jsWorkFlow.Activity);



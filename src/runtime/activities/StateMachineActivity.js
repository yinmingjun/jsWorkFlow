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
jsWorkFlow.Activities.StateMachineActivity = function jsWorkFlow_Activities_StateMachineActivity() {
    jsWorkFlow.Activities.StateMachineActivity.initializeBase(this);

};

function jsWorkFlow_Activities_StateMachineActivity$dispose() {
    jsWorkFlow.Activities.StateMachineActivity.callBaseMethod(this, 'dispose');
}

//activity的恢复
function jsWorkFlow_Activities_StateMachineActivity$loadSerializeContext(serializeContext) {
    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== this.getType().getName()) {
        throw Error.invalidOperation("loadSerializeContext missmatch type!");
    }

    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jsWorkFlow.Activities.StateMachineActivity.callBaseMethod(this, 'loadSerializeContext', [baseSerializeContext]);

    //恢复自身
}

//activity的序列化
function jsWorkFlow_Activities_StateMachineActivity$saveSerializeContext(serializeContext) {

    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = this.getType().getName();

    //保存自身

    //保存base
    var baseSerializeContext = {};

    jsWorkFlow.Activities.StateMachineActivity.callBaseMethod(this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}

//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_StateMachineActivity$execute(context) {
    jsWorkFlow.Activities.StateMachineActivity.callBaseMethod(this, 'execute', [context]);

    //TODO:
    //    LOG noop message!

    //执行完毕，结束activity
    $jwf.endActivity(context);
}

jsWorkFlow.Activities.StateMachineActivity.prototype = {
    dispose: jsWorkFlow_Activities_StateMachineActivity$dispose,
    //property
    //method
    execute: jsWorkFlow_Activities_StateMachineActivity$execute
};

jsWorkFlow.Activities.StateMachineActivity.registerClass('jsWorkFlow.Activities.StateMachineActivity', jsWorkFlow.Activity);



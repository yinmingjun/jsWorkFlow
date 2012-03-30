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
    jsWorkFlow.Activities.NoopActivity.initializeBase(this);

};

function jsWorkFlow_Activities_NoopActivity$dispose() {
    jsWorkFlow.Activities.NoopActivity.callBaseMethod(this, 'dispose');
}

//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_NoopActivity$execute(context) {
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
    execute: jsWorkFlow_Activities_NoopActivity$execute
};

jsWorkFlow.Activities.NoopActivity.registerClass('jsWorkFlow.Activities.NoopActivity', jsWorkFlow.Activity);



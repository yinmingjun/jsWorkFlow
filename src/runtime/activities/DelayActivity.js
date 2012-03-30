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
//DelayActivity，延迟执行时间
//
//TO 开发者：
//    DelayActivity延迟（推迟）执行的时间，单位是ms。
jsWorkFlow.Activities.DelayActivity = function jsWorkFlow_Activities_DelayActivity(delayTime) {
    jsWorkFlow.Activities.DelayActivity.initializeBase(this);
    this._delayTime = delayTime;
};

function jsWorkFlow_Activities_DelayActivity$dispose() {
    jsWorkFlow.Activities.DelayActivity.callBaseMethod(this, 'dispose');
}

//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_DelayActivity$execute(context) {
    jsWorkFlow.Activities.DelayActivity.callBaseMethod(this, 'execute', [context]);

    var doDelay = Function.createDelegate(this, this.doDelay);

    //通过lamda设置回调
    jsWorkFlow.setTimeout(function () {
        //LOG 
        $jwf.endActivity(context);
    }, this._delayTime);
}

jsWorkFlow.Activities.DelayActivity.prototype = {
    _delayTime: null,
    dispose: jsWorkFlow_Activities_DelayActivity$dispose,
    //property
    //method
    execute: jsWorkFlow_Activities_DelayActivity$execute

};

jsWorkFlow.Activities.DelayActivity.registerClass('jsWorkFlow.Activities.DelayActivity', jsWorkFlow.Activity);



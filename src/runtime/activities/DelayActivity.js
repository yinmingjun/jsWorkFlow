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

function jsWorkFlow_Activities_DelayActivity$get_delayTime() {
    return this._delayTime;
}

function jsWorkFlow_Activities_DelayActivity$set_delayTime(value) {
    this._delayTime = value;
}

//activity的恢复
function jsWorkFlow_Activities_DelayActivity$loadSerializeContext(serializeContext) {
    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== this.getType().getName()) {
        throw Error.invalidOperation("loadSerializeContext missmatch type!");
    }

    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jsWorkFlow.Activities.DelayActivity.callBaseMethod(this, 'loadSerializeContext', [baseSerializeContext]);

    //恢复自身
    this.set_delayTime(serializeContext['delayTime']);

}

//activity的序列化
function jsWorkFlow_Activities_DelayActivity$saveSerializeContext(serializeContext) {

    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = this.getType().getName();

    //保存自身
    serializeContext['delayTime'] = this.get_delayTime();

    //保存base
    var baseSerializeContext = {};

    jsWorkFlow.Activities.DelayActivity.callBaseMethod(this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}


//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_DelayActivity$execute(context) {
    jsWorkFlow.Activities.DelayActivity.callBaseMethod(this, 'execute', [context]);

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
    get_delayTime: jsWorkFlow_Activities_DelayActivity$get_delayTime,
    set_delayTime: jsWorkFlow_Activities_DelayActivity$set_delayTime,
    //method
    loadSerializeContext: jsWorkFlow_Activities_DelayActivity$loadSerializeContext,
    saveSerializeContext: jsWorkFlow_Activities_DelayActivity$saveSerializeContext,
    execute: jsWorkFlow_Activities_DelayActivity$execute

};

jsWorkFlow.Activities.DelayActivity.registerClass('jsWorkFlow.Activities.DelayActivity', jsWorkFlow.Activity);



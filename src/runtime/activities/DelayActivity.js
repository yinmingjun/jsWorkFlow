/*
* jsWorkFlow's core source code.
* 2012.03.22: Create By Yin Mingjun - email: yinmingjuncn@gmail.com
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
//DelayActivity，延迟执行时间
//
//TO 开发者：
//    DelayActivity延迟（推迟）执行的时间，单位是ms。
jsWorkFlow.Activities.DelayActivity = function jsWorkFlow_Activities_DelayActivity(delayTime) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.DelayActivity create!");

    jsoop.initializeBase(jsWorkFlow.Activities.DelayActivity, this);
    this._delayTime = delayTime;
};

function jsWorkFlow_Activities_DelayActivity$dispose() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.DelayActivity dispose!");

    jsoop.callBaseMethod(jsWorkFlow.Activities.DelayActivity, this, 'dispose');
}

function jsWorkFlow_Activities_DelayActivity$get_delayTime() {
    return this._delayTime;
}

function jsWorkFlow_Activities_DelayActivity$set_delayTime(value) {
    this._delayTime = value;
}

//activity的恢复
function jsWorkFlow_Activities_DelayActivity$loadSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.DelayActivity loadSerializeContext!");

    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== 'jsWorkFlow.Activities.DelayActivity') {
        throw jsoop.errorInvalidOperation("loadSerializeContext missmatch type!");
    }

    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jsoop.callBaseMethod(jsWorkFlow.Activities.DelayActivity, this, 'loadSerializeContext', [baseSerializeContext]);

    //恢复自身
    this.set_delayTime(serializeContext['delayTime']);

}

//activity的序列化
function jsWorkFlow_Activities_DelayActivity$saveSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.DelayActivity saveSerializeContext!");


    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = 'jsWorkFlow.Activities.DelayActivity';

    //保存自身
    serializeContext['delayTime'] = this.get_delayTime();

    //保存base
    var baseSerializeContext = {};

    jsoop.callBaseMethod(jsWorkFlow.Activities.DelayActivity, this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}


//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_DelayActivity$execute(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.DelayActivity execute!");

    jsoop.callBaseMethod(jsWorkFlow.Activities.DelayActivity, this, 'execute', [context]);

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

jsoop.registerClass(jsoop.setTypeName(jsWorkFlow.Activities.DelayActivity, 'jsWorkFlow.Activities.DelayActivity'), jsWorkFlow.Activity);


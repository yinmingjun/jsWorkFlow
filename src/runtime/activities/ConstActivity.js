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
//ConstActivity
//
//TO 开发者：
//    定义包装常量的activity，仅用于展示activity得到基本控制流程，可以当成activity的占位
//符使用。
//
jsWorkFlow.Activities.ConstActivity = function jsWorkFlow_Activities_ConstActivity(constValue) {
    jsWorkFlow.Activities.ConstActivity.initializeBase(this);

    this.set_constValue(constValue);
};

function jsWorkFlow_Activities_ConstActivity$dispose() {
    jsWorkFlow.Activities.ConstActivity.callBaseMethod(this, 'dispose');
}

function jsWorkFlow_Activities_ConstActivity$get_constValue() {
    return this._constValue;
}

function jsWorkFlow_Activities_ConstActivity$set_constValue(value) {
    this._constValue = value;
}

//activity的恢复
function jsWorkFlow_Activities_ConstActivity$loadSerializeContext(serializeContext) {
    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== this.getType().getName()) {
        throw Error.invalidOperation("loadSerializeContext missmatch type!");
    }


    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jsWorkFlow.Activities.ConstActivity.callBaseMethod(this, 'loadSerializeContext', [baseSerializeContext]);

    //恢复自身
    var constValue = serializeContext["constValue"];
    this.set_constValue(constValue);
}

//activity的序列化
function jsWorkFlow_Activities_ConstActivity$saveSerializeContext(serializeContext) {

    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = this.getType().getName();

    //保存自身
    serializeContext["constValue"] = this.get_constValue();

    //保存base
    var baseSerializeContext = {};

    jsWorkFlow.Activities.ConstActivity.callBaseMethod(this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}

//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_ConstActivity$execute(context) {
    jsWorkFlow.Activities.ConstActivity.callBaseMethod(this, 'execute', [context]);

    //将constValue放到activity的result之中
    var constValue = this.get_constValue();

    context.set_result(constValue);

    //执行完毕，结束activity
    $jwf.endActivity(context);
}

jsWorkFlow.Activities.ConstActivity.prototype = {
    _constValue: null,
    dispose: jsWorkFlow_Activities_ConstActivity$dispose,
    //property
    get_constValue: jsWorkFlow_Activities_ConstActivity$get_constValue,
    set_constValue: jsWorkFlow_Activities_ConstActivity$set_constValue,
    //method
    loadSerializeContext: jsWorkFlow_Activities_ConstActivity$loadSerializeContext,
    saveSerializeContext: jsWorkFlow_Activities_ConstActivity$saveSerializeContext,
    execute: jsWorkFlow_Activities_ConstActivity$execute
};

jsWorkFlow.Activities.ConstActivity.registerClass('jsWorkFlow.Activities.ConstActivity', jsWorkFlow.Activity);



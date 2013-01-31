/*
* jsWorkFlow's core source code.
* 2012.01.31: Create By Yin Mingjun - email: yinmingjuncn@gmail.com
* 
* Copyright 2012,  Yin MingJun - email: yinmingjuncn@gmail.com
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
*/

Type.registerNamespace('jsWorkFlow.Activities');

//////////////////////////////////////////////////////////////////////////////////////////
//GetExceptionActivity
//
//TO 开发者：
//    GetExceptionActivity用于在tryCatch的Catch中获取异常的activity，可以根据异常信息进行分类处理，
//或重新的发布异常。
//    GetExceptionActivity从当前context向上搜索，查找状态是error的context，并返回其errorInfo中的，
//exception属性。
//

jsWorkFlow.Activities.GetExceptionActivity = function jsWorkFlow_Activities_GetExceptionActivity() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.GetExceptionActivity create!");


    jsWorkFlow.Activities.GetExceptionActivity.initializeBase(this);

};

function jsWorkFlow_Activities_GetExceptionActivity$dispose() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.GetExceptionActivity dispose!");

    jsWorkFlow.Activities.GetExceptionActivity.callBaseMethod(this, 'dispose');
}


//activity的恢复
function jsWorkFlow_Activities_GetExceptionActivity$loadSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.GetExceptionActivity loadSerializeContext!");

    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== this.getType().getName()) {
        throw Error.invalidOperation("loadSerializeContext missmatch type!");
    }


    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jsWorkFlow.Activities.GetExceptionActivity.callBaseMethod(this, 'loadSerializeContext', [baseSerializeContext]);

    //恢复自身

}

//activity的序列化
function jsWorkFlow_Activities_GetExceptionActivity$saveSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.GetExceptionActivity saveSerializeContext!");

    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = this.getType().getName();

    //保存自身

    //保存base
    var baseSerializeContext = {};

    jsWorkFlow.Activities.GetExceptionActivity.callBaseMethod(this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}

//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_GetExceptionActivity$execute(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.GetExceptionActivity execute!");

    jsWorkFlow.Activities.GetExceptionActivity.callBaseMethod(this, 'execute', [context]);

    //获取error信息
    var exception = null;
    var errorInfo = $jwf._getErrorInfo(context);
    if (errorInfo) {
        exception = errorInfo.get_exception();
    }

    //将exception信息放置到context
    context.set_result(exception);

    //执行完毕，结束activity
    $jwf.endActivity(context);
}

jsWorkFlow.Activities.GetExceptionActivity.prototype = {
    dispose: jsWorkFlow_Activities_GetExceptionActivity$dispose,
    //property
    //method
    loadSerializeContext: jsWorkFlow_Activities_GetExceptionActivity$loadSerializeContext,
    saveSerializeContext: jsWorkFlow_Activities_GetExceptionActivity$saveSerializeContext,
    execute: jsWorkFlow_Activities_GetExceptionActivity$execute
};

jsWorkFlow.Activities.GetExceptionActivity.registerClass('jsWorkFlow.Activities.GetExceptionActivity', jsWorkFlow.Activity);



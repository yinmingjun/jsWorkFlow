/*
* jsWorkFlow's core source code.
* 2012.08.16: Create By Yin Mingjun - email: yinmingjuncn@gmail.com
* 
* Copyright 2012,  Yin MingJun - email: yinmingjuncn@gmail.com
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
*/

Type.registerNamespace('jsWorkFlow.Activities');

//////////////////////////////////////////////////////////////////////////////////////////
//DataContextLayer枚举，表示可以定义的数据层
jsWorkFlow.DataContextLayer = function jsWorkFlow_DataContextLayer() {
    throw new Error.notImplemented();
};

//系统默认的activity的状态
jsWorkFlow.DataContextLayer.prototype = {
    auto: 0,          //自动，定义等同于activity，获取会搜索
    local: 0,         //只在当前的activity层级上定义和搜索
    application: 1,   //APP的范围内共享
    global: 2         //全局，跨APP
};

jsWorkFlow.DataContextLayer.registerEnum('jsWorkFlow.DataContextLayer');


//////////////////////////////////////////////////////////////////////////////////////////
//DefineContextDataActivity
//
//TO 开发者：
//    是定义ContextData的activity，用于定义数据，类似变量，存储activity执行期间的数据。
//    DefineContextDataActivity的定义选择中，dataKey属性只支持常量，否则会将复杂性带入到工作流
//之中，不利于上下游在数据层面协同工作。dataValueActivity属性是activity类型，支持数据根据上下文
//做初始化。dataContextLayer和isPrivate是数据定义层面的选项。
//    注意，DefineContextDataActivity的执行结果是要将数据存放在parent的context之中。
//
jsWorkFlow.Activities.DefineContextDataActivity = function jsWorkFlow_Activities_DefineContextDataActivity(dataKey, dataValueActivity, isPrivate, dataContextLayer) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.DefineContextDataActivity execute!");

    jsWorkFlow.Activities.DefineContextDataActivity.initializeBase(this);

    if (typeof (dataContextLayer) === "undefined") {
        //默认数据存储在activity层级上
        dataContextLayer = jsWorkFlow.DataContextLayer.auto;
    }

    this._dataKey = dataKey;
    this._dataValueActivity = dataValueActivity;
    this._dataContextLayer = dataContextLayer;
    this._isPrivate = !!isPrivate;

    this._doEvalDataValueActivityCompleteHandler = Function.createDelegate(this, this.doEvalDataValueActivityCompleteHandler);

};

function jsWorkFlow_Activities_DefineContextDataActivity$dispose() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.DefineContextDataActivity dispose!");

    jsWorkFlow.Activities.DefineContextDataActivity.callBaseMethod(this, 'dispose');

    this._dataKey = null;
    this._dataValueActivity = null;
}

function jsWorkFlow_Activities_DefineContextDataActivity$get_dataKey() {
    return this._dataKey;
}

function jsWorkFlow_Activities_DefineContextDataActivity$set_dataKey(value) {
    this._dataKey = value;
}

function jsWorkFlow_Activities_DefineContextDataActivity$get_dataValueActivity() {
    return this._dataValueActivity;
}

function jsWorkFlow_Activities_DefineContextDataActivity$set_dataValueActivity(value) {
    this._dataValueActivity = value;
}

function jsWorkFlow_Activities_DefineContextDataActivity$get_dataContextLayer() {
    return this._dataContextLayer;
}

function jsWorkFlow_Activities_DefineContextDataActivity$set_dataContextLayer(value) {
    this._dataContextLayer = value;
}

function jsWorkFlow_Activities_DefineContextDataActivity$get_isPrivate() {
    return this._isPrivate;
}

function jsWorkFlow_Activities_DefineContextDataActivity$set_isPrivate(value) {
    this._isPrivate = !!value;
}

//activity的恢复
function jsWorkFlow_Activities_DefineContextDataActivity$loadSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.DefineContextDataActivity loadSerializeContext!");

    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== this.getType().getName()) {
        throw Error.invalidOperation("loadSerializeContext missmatch type!");
    }

    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jsWorkFlow.Activities.DefineContextDataActivity.callBaseMethod(this, 'loadSerializeContext', [baseSerializeContext]);

    //恢复自身
    //dataKey
    var dataKey = serializeContext["dataKey"];
    this.set_dataKey(dataKey);
    //dataValueActivity
    var dataValueActivitySC = serializeContext["dataValueActivity"];
    var dataValueActivity = $jwf.loadActivity(dataValueActivitySC);
    this.set_dataValueActivity(dataValueActivity);
    //dataContextLayer
    var dataContextLayer = serializeContext["dataContextLayer"];
    this.set_dataContextLayer(dataContextLayer);
    //isPrivate
    var isPrivate = serializeContext["isPrivate"];
    this.set_isPrivate(isPrivate);
}

//activity的序列化
function jsWorkFlow_Activities_DefineContextDataActivity$saveSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.DefineContextDataActivity saveSerializeContext!");

    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = this.getType().getName();

    //保存自身
    //dataKey
    serializeContext["dataKey"] = this.get_dataKey();
    //dataValueActivity
    var dataValueActivity = this.get_dataValueActivity();
    serializeContext["dataValueActivity"] = $jwf.saveActivity(dataValueActivity);
    //dataContextLayer
    serializeContext["dataContextLayer"] = this.get_dataContextLayer();
    //isPrivate
    serializeContext["isPrivate"] = this.get_isPrivate();

    //保存base
    var baseSerializeContext = {};

    jsWorkFlow.Activities.DefineContextDataActivity.callBaseMethod(this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}

function jsWorkFlow_Activities_DefineContextDataActivity$doInitContextDataValue(application, value) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.DefineContextDataActivity doInitContextDataValue!");

    //使用给出的值来初始化contextData
    var dataContextLayer = this._dataContextLayer;
    var dataKey  = this._dataKey;
    var isPrivate  = this._isPrivate;
    var dataContext = null;

    //根据dataContextLayer来初始化数据项
    if ((jsWorkFlow.DataContextLayer.auto === dataContextLayer) ||
    (jsWorkFlow.DataContextLayer.local === dataContextLayer)) {
        //activity层级的数据定义，要跳过当前（DefineContextDataActivity）层，将数据存放上一层之中
        dataContext = application.internalContextAt(1);
    }
    else if (jsWorkFlow.DataContextLayer.application === dataContextLayer) {
        //app层级
        dataContext = application.get_appContext();
    }
    else if (jsWorkFlow.DataContextLayer.global === dataContextLayer) {
        //global层级
        dataContext = application.get_globalContext();
    }
    else {
        //LOG Here!
        throw Error.invalidOperation("Unknown dataContextLayer value [" + dataContextLayer + "]!");
    }
    //根据
    var isPublic = !isPrivate;
    var switchVisiblity = (dataContext.get_defaultVisibilityIsPublic() === isPublic) ? false : true;
    dataContext.setData(dataKey, value, switchVisiblity);
}

function jsWorkFlow_Activities_DefineContextDataActivity$doEvalDataValueActivityCompleteHandler(sender, eventArgs) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.DefineContextDataActivity doEvalDataValueActivityCompleteHandler!");
    //post complete事件
    var context = eventArgs.get_context();
    var executor = context.get_executor();
    var parentContext = executor.get_parentContext();
    var application = parentContext.get_application();

    //默认值是null
    var result = null;

    //cleanup old executor
    executor.remove_postComplete(this._doEvalDataValueActivityCompleteHandler);

    //set last context's result as current context's result
    result = context.get_result();

    //将parent的result设置为求值的结果
    parentContext.set_result(result);

    //设置ContextData的值
    this.doInitContextDataValue(application, result);

    //执行完毕，结束activity
    $jwf.endActivity(parentContext);

}

//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_DefineContextDataActivity$execute(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.DefineContextDataActivity execute!");

    jsWorkFlow.Activities.DefineContextDataActivity.callBaseMethod(this, 'execute', [context]);

    //对dataValueActivity求值
    //将值放到dataKey之中

    //选择activity，并执行
    var activity = this._dataValueActivity;
    var application = context.get_application();

    if (!activity) {
        //空的activity，认为是null值
        this.doInitContextDataValue(application, null);
        //执行完毕，结束activity
        $jwf.endActivity(context);
        return;
    }

    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, activity, context);

    activityExecutor.add_postComplete(this._doEvalDataValueActivityCompleteHandler);

    //OK, kick activityExecutor to run!
    activityExecutor.execute();

}

jsWorkFlow.Activities.DefineContextDataActivity.prototype = {
    _dataKey: null,
    _dataValueActivity: null,
    _dataContextLayer: 0,
    _isPrivate: false,
    dispose: jsWorkFlow_Activities_DefineContextDataActivity$dispose,
    //property
    get_dataKey: jsWorkFlow_Activities_DefineContextDataActivity$get_dataKey,
    set_dataKey: jsWorkFlow_Activities_DefineContextDataActivity$set_dataKey,
    get_dataValueActivity: jsWorkFlow_Activities_DefineContextDataActivity$get_dataValueActivity,
    set_dataValueActivity: jsWorkFlow_Activities_DefineContextDataActivity$set_dataValueActivity,
    get_dataContextLayer: jsWorkFlow_Activities_DefineContextDataActivity$get_dataContextLayer,
    set_dataContextLayer: jsWorkFlow_Activities_DefineContextDataActivity$set_dataContextLayer,
    get_isPrivate: jsWorkFlow_Activities_DefineContextDataActivity$get_isPrivate,
    set_isPrivate: jsWorkFlow_Activities_DefineContextDataActivity$set_isPrivate,
    //method
    loadSerializeContext: jsWorkFlow_Activities_DefineContextDataActivity$loadSerializeContext,
    saveSerializeContext: jsWorkFlow_Activities_DefineContextDataActivity$saveSerializeContext,
    doInitContextDataValue: jsWorkFlow_Activities_DefineContextDataActivity$doInitContextDataValue,
    doEvalDataValueActivityCompleteHandler: jsWorkFlow_Activities_DefineContextDataActivity$doEvalDataValueActivityCompleteHandler,
    execute: jsWorkFlow_Activities_DefineContextDataActivity$execute

};

jsWorkFlow.Activities.DefineContextDataActivity.registerClass('jsWorkFlow.Activities.DefineContextDataActivity', jsWorkFlow.Activity);

//////////////////////////////////////////////////////////////////////////////////////////
//GetContextDataActivity
//
//TO 开发者：
//    获取Context中数据相值的activity。对于指定auto类型的数据获取，只能访问public的数据；对于其他的类型，
//只访问指定的数据容器，可以看到私有的数据项。
//
jsWorkFlow.Activities.GetContextDataActivity = function jsWorkFlow_Activities_GetContextDataActivity(dataKey, dataContextLayer) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.GetContextDataActivity execute!");

    jsWorkFlow.Activities.GetContextDataActivity.initializeBase(this);

    if (typeof (dataContextLayer) === "undefined") {
        dataContextLayer = jsWorkFlow.DataContextLayer.auto;
    }

    this._dataKey = dataKey;
    this._dataContextLayer = dataContextLayer;
};

function jsWorkFlow_Activities_GetContextDataActivity$dispose() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.GetContextDataActivity dispose!");

    jsWorkFlow.Activities.GetContextDataActivity.callBaseMethod(this, 'dispose');
}

function jsWorkFlow_Activities_GetContextDataActivity$get_dataKey() {
    return this._dataKey;
}
function jsWorkFlow_Activities_GetContextDataActivity$set_dataKey(value) {
    this._dataKey = value;
}

function jsWorkFlow_Activities_GetContextDataActivity$get_dataContextLayer() {
    return this._dataContextLayer;
}
function jsWorkFlow_Activities_GetContextDataActivity$set_dataContextLayer(value) {
    this._dataContextLayer = value;
}


//activity的恢复
function jsWorkFlow_Activities_GetContextDataActivity$loadSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.GetContextDataActivity loadSerializeContext!");

    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== this.getType().getName()) {
        throw Error.invalidOperation("loadSerializeContext missmatch type!");
    }

    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jsWorkFlow.Activities.GetContextDataActivity.callBaseMethod(this, 'loadSerializeContext', [baseSerializeContext]);

    //恢复自身
    var dataKey = serializeContext["dataKey"];
    this.set_dataKey(dataKey);

    var dataContextLayer = serializeContext["dataContextLayer"];
    this.set_dataContextLayer(dataContextLayer);
}

//activity的序列化
function jsWorkFlow_Activities_GetContextDataActivity$saveSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.GetContextDataActivity saveSerializeContext!");


    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = this.getType().getName();

    //保存自身
    serializeContext["dataKey"] = this.get_dataKey();
    serializeContext["dataContextLayer"] = this.get_dataContextLayer();

    //保存base
    var baseSerializeContext = {};

    jsWorkFlow.Activities.GetContextDataActivity.callBaseMethod(this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}

//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_GetContextDataActivity$execute(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.GetContextDataActivity execute!");

    jsWorkFlow.Activities.GetContextDataActivity.callBaseMethod(this, 'execute', [context]);

    var application = context.get_application();
    //根据指定的dataContextLayer获取数据，并存放于result之中
    var dataKey = this.get_dataKey();
    var dataContextLayer = this.get_dataContextLayer();
    var result = null;

    if (jsWorkFlow.DataContextLayer.auto === dataContextLayer) {
        //自动确定遍历的所在
        //数据加载以夫的context作为local的定义context，可以检索到private数据
        result = application.getData(dataKey, 1);
    }
    else {
        //
        var dataContext = null;
        if (jsWorkFlow.DataContextLayer.local === dataContextLayer) {
            //当前层是GetContextDataActivity，访问上一层
            dataContext = application.internalContextAt(1);

        }
        else if (jsWorkFlow.DataContextLayer.application === dataContextLayer) {
            //app层级
            dataContext = application.get_appContext();
        }
        else if (jsWorkFlow.DataContextLayer.global === dataContextLayer) {
            //global层级
            dataContext = application.get_globalContext();
        }
        else {
            //LOG Here!
            throw Error.invalidOperation("Unknown dataContextLayer value [" + dataContextLayer + "]!");
        }

        result = dataContext.getData(dataKey);
    }

    //设置运行结果到context的result
    context.set_result(result);

    //TODO:
    //    LOG noop message!

    //执行完毕，结束activity
    $jwf.endActivity(context);
}

jsWorkFlow.Activities.GetContextDataActivity.prototype = {
    _dataKey: null,
    _dataContextLayer: 0,
    dispose: jsWorkFlow_Activities_GetContextDataActivity$dispose,
    //property
    get_dataKey: jsWorkFlow_Activities_GetContextDataActivity$get_dataKey,
    set_dataKey: jsWorkFlow_Activities_GetContextDataActivity$set_dataKey,
    get_dataContextLayer: jsWorkFlow_Activities_GetContextDataActivity$get_dataContextLayer,
    set_dataContextLayer: jsWorkFlow_Activities_GetContextDataActivity$set_dataContextLayer,
    //method
    loadSerializeContext: jsWorkFlow_Activities_GetContextDataActivity$loadSerializeContext,
    saveSerializeContext: jsWorkFlow_Activities_GetContextDataActivity$saveSerializeContext,
    execute: jsWorkFlow_Activities_GetContextDataActivity$execute
};

jsWorkFlow.Activities.GetContextDataActivity.registerClass('jsWorkFlow.Activities.GetContextDataActivity', jsWorkFlow.Activity);



//////////////////////////////////////////////////////////////////////////////////////////
//SetContextDataActivity
//
//TO 开发者：
//    是设置ContextData的activity，用于设置数据。
//    和DefineContextDataActivity功能类似，但是不同于DefineContextDataActivity，SetContextDataActivity
//并不产生新的数据定义。如果设置成功，activity的结果是true；如果没有找到数据定义，返回false。
//    另外一个和DefineContextDataActivity不同的地方，SetContextDataActivity并不允许指定isPrivate，
//因为本身是数据的消费者。
//
jsWorkFlow.Activities.SetContextDataActivity = function jsWorkFlow_Activities_SetContextDataActivity(dataKey, dataValueActivity, dataContextLayer) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.SetContextDataActivity execute!");


    jsWorkFlow.Activities.SetContextDataActivity.initializeBase(this);

    if (typeof (dataContextLayer) === "undefined") {
        //默认数据存储在activity层级上
        dataContextLayer = jsWorkFlow.DataContextLayer.auto;
    }

    this._dataKey = dataKey;
    this._dataValueActivity = dataValueActivity;
    this._dataContextLayer = dataContextLayer;

    this._doEvalDataValueActivityCompleteHandler = Function.createDelegate(this, this.doEvalDataValueActivityCompleteHandler);

};

function jsWorkFlow_Activities_SetContextDataActivity$dispose() {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.SetContextDataActivity dispose!");

    jsWorkFlow.Activities.SetContextDataActivity.callBaseMethod(this, 'dispose');

    this._dataKey = null;
    this._dataValueActivity = null;
}

function jsWorkFlow_Activities_SetContextDataActivity$get_dataKey() {
    return this._dataKey;
}

function jsWorkFlow_Activities_SetContextDataActivity$set_dataKey(value) {
    this._dataKey = value;
}

function jsWorkFlow_Activities_SetContextDataActivity$get_dataValueActivity() {
    return this._dataValueActivity;
}

function jsWorkFlow_Activities_SetContextDataActivity$set_dataValueActivity(value) {
    this._dataValueActivity = value;
}

function jsWorkFlow_Activities_SetContextDataActivity$get_dataContextLayer() {
    return this._dataContextLayer;
}

function jsWorkFlow_Activities_SetContextDataActivity$set_dataContextLayer(value) {
    this._dataContextLayer = value;
}

//activity的恢复
function jsWorkFlow_Activities_SetContextDataActivity$loadSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.SetContextDataActivity loadSerializeContext!");

    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== this.getType().getName()) {
        throw Error.invalidOperation("loadSerializeContext missmatch type!");
    }

    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jsWorkFlow.Activities.SetContextDataActivity.callBaseMethod(this, 'loadSerializeContext', [baseSerializeContext]);

    //恢复自身
    //dataKey
    var dataKey = serializeContext["dataKey"];
    this.set_dataKey(dataKey);
    //dataValueActivity
    var dataValueActivitySC = serializeContext["dataValueActivity"];
    var dataValueActivity = $jwf.loadActivity(dataValueActivitySC);
    this.set_dataValueActivity(dataValueActivity);
    //dataContextLayer
    var dataContextLayer = serializeContext["dataContextLayer"];
    this.set_dataContextLayer(dataContextLayer);
    //isPrivate
    var isPrivate = serializeContext["isPrivate"];
}

//activity的序列化
function jsWorkFlow_Activities_SetContextDataActivity$saveSerializeContext(serializeContext) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.SetContextDataActivity saveSerializeContext!");


    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = this.getType().getName();

    //保存自身
    //dataKey
    serializeContext["dataKey"] = this.get_dataKey();
    //dataValueActivity
    var dataValueActivity = this.get_dataValueActivity();
    serializeContext["dataValueActivity"] = $jwf.saveActivity(dataValueActivity);
    //dataContextLayer
    serializeContext["dataContextLayer"] = this.get_dataContextLayer();

    //保存base
    var baseSerializeContext = {};

    jsWorkFlow.Activities.SetContextDataActivity.callBaseMethod(this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}

function jsWorkFlow_Activities_SetContextDataActivity$doSetContextDataValue(application, value) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.SetContextDataActivity doSetContextDataValue!");

    //使用给出的值来初始化contextData
    var dataContextLayer = this._dataContextLayer;
    var dataKey = this._dataKey;
    var result = false;

    //根据dataContextLayer来初始化数据项
    if (jsWorkFlow.DataContextLayer.auto === dataContextLayer) {
        //自动确定遍历的所在
        //数据加载以夫的context作为local的定义context，可以检索到private数据
        var dataItem = application.getDataItem(dataKey, 1);
        if (dataItem) {
            dataItem.value = value;
            result = true;
        }
    }
    else {
        if (jsWorkFlow.DataContextLayer.local === dataContextLayer) {
            //activity层级的数据定义，要跳过当前（SetContextDataActivity）层，将数据存放上一层之中
            dataContext = application.internalContextAt(1);
        }
        else if (jsWorkFlow.DataContextLayer.application === dataContextLayer) {
            //app层级
            dataContext = application.get_appContext();
        }
        else if (jsWorkFlow.DataContextLayer.global === dataContextLayer) {
            //global层级
            dataContext = application.get_globalContext();
        }
        else {
            //LOG Here!
            throw Error.invalidOperation("Unknown dataContextLayer value [" + dataContextLayer + "]!");
        }

        var dataItem = dataContext.getDataItem(dataKey);

        if (dataItem) {
            dataItem.value = value;
            result = true;
        }
    }

    return result;
}

function jsWorkFlow_Activities_SetContextDataActivity$doEvalDataValueActivityCompleteHandler(sender, eventArgs) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.SetContextDataActivity doEvalDataValueActivityCompleteHandler!");

    //post complete事件
    var context = eventArgs.get_context();
    var executor = context.get_executor();
    var parentContext = executor.get_parentContext();
    var application = parentContext.get_application();

    //默认值是null
    var dataValue = null;
    var result = false;

    //cleanup old executor
    executor.remove_postComplete(this._doEvalDataValueActivityCompleteHandler);

    //取求值结果
    dataValue = context.get_result();

    //设置ContextData的值
    result = this.doSetContextDataValue(application, dataValue);

    //将parent的result设置为doSetContextDataValue的结果
    parentContext.set_result(result);

    //执行完毕，结束activity
    $jwf.endActivity(parentContext);
}

//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_SetContextDataActivity$execute(context) {
    var log = jwf$getLogger();
    log.debug("jsWorkFlow.Activities.SetContextDataActivity execute!");

    jsWorkFlow.Activities.SetContextDataActivity.callBaseMethod(this, 'execute', [context]);

    //对dataValueActivity求值
    //将值放到dataKey之中

    //选择activity，并执行
    var activity = this._dataValueActivity;
    var application = context.get_application();
    var result = false;

    if (!activity) {
        //空的activity，认为是null值
        result = this.doSetContextDataValue(application, null);
        context.set_result(result);
        //执行完毕，结束activity
        $jwf.endActivity(context);
        return;
    }

    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, activity, context);

    activityExecutor.add_postComplete(this._doEvalDataValueActivityCompleteHandler);

    //OK, kick activityExecutor to run!
    activityExecutor.execute();

}

jsWorkFlow.Activities.SetContextDataActivity.prototype = {
    _dataKey: null,
    _dataValueActivity: null,
    _dataContextLayer: 0,
    dispose: jsWorkFlow_Activities_SetContextDataActivity$dispose,
    //property
    get_dataKey: jsWorkFlow_Activities_SetContextDataActivity$get_dataKey,
    set_dataKey: jsWorkFlow_Activities_SetContextDataActivity$set_dataKey,
    get_dataValueActivity: jsWorkFlow_Activities_SetContextDataActivity$get_dataValueActivity,
    set_dataValueActivity: jsWorkFlow_Activities_SetContextDataActivity$set_dataValueActivity,
    get_dataContextLayer: jsWorkFlow_Activities_SetContextDataActivity$get_dataContextLayer,
    set_dataContextLayer: jsWorkFlow_Activities_SetContextDataActivity$set_dataContextLayer,
    //method
    loadSerializeContext: jsWorkFlow_Activities_SetContextDataActivity$loadSerializeContext,
    saveSerializeContext: jsWorkFlow_Activities_SetContextDataActivity$saveSerializeContext,
    doSetContextDataValue: jsWorkFlow_Activities_SetContextDataActivity$doSetContextDataValue,
    doEvalDataValueActivityCompleteHandler: jsWorkFlow_Activities_SetContextDataActivity$doEvalDataValueActivityCompleteHandler,
    execute: jsWorkFlow_Activities_SetContextDataActivity$execute

};

jsWorkFlow.Activities.SetContextDataActivity.registerClass('jsWorkFlow.Activities.SetContextDataActivity', jsWorkFlow.Activity);

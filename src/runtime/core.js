
/*
 * jsWorkFlow's core source code.
 * 2012.03.06: Create By Yin Mingjun - email: yinmingjuncn@gmail.com
 * 
 * Copyright 2012,  Yin MingJun - email: yinmingjuncn@gmail.com
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 */

 /*
  * Depends on M$ AJAX javascripts lib's feature list:
  *    1. class inheritance(register class, interface, enum) ==> into a  js oop library?
  *    2. Function.createDelegate
  *    3. Sys.EventHandlerList
  *    4. Error.notImplemented() and Error.invalidOperation()
  *    5. Array.add
  *    
  */

Type.registerNamespace('jsWorkFlow');

//////////////////////////////////////////////////////////////////////////////////////////
//
// Low level API
//
jsWorkFlow.setInterval = setInterval;
jsWorkFlow.setTimeout = setTimeout;

//////////////////////////////////////////////////////////////////////////////////////////
//ActivityState，表示一个jsWorkFlow活动的运行状态

jsWorkFlow.ActivityState = function jsWorkFlow_ActivityState() {
    throw new Error.notImplemented();
};

//系统默认的activity的状态
jsWorkFlow.ActivityState.prototype = {
    none: 0,
    start: 1,
    stop: 2
};

//global 数值
//100以内是系统保留的activity状态值，以外的状态通过类的继承关系来确定
jsWorkFlow.ActivityState.min_value = 100;

jsWorkFlow.ActivityState.registerEnum('jsWorkFlow.ActivityState');



//////////////////////////////////////////////////////////////////////////////////////////
//ActivityExecuteStrategy，表示activity运行期错误的容错类型

jsWorkFlow.ActivityExecuteStrategy = function jsWorkFlow_ActivityExecuteStrategy() {
    throw new Error.notImplemented();
};

//系统默认的activity的状态
jsWorkFlow.ActivityExecuteStrategy.prototype = {
    none: 0,        //没设置，会使用系统的默认错误回复机制
    exception: 1,   //通过抛出异常来处理，为系统默认的异常处理方式
    ignore: 2,      //拦截并忽略
    stop: 3         //停止整个workflow的执行
};

jsWorkFlow.ActivityExecuteStrategy.registerEnum('jsWorkFlow.ActivityExecuteStrategy');




//////////////////////////////////////////////////////////////////////////////////////////
//Events，提供jsWorkFlow中事件的管理
//
//TO 开发者：
//    事件机制是jsWorkFlow的基础，因此将事件的触发、执行和管理集中到Events类中。
//
jsWorkFlow.Events = function jsWorkFlow_Events(owner) {
    this._owner = owner;
    this._events = new Sys.EventHandlerList();
};

function jsWorkFlow_Events$dispose() {
    this._owner = null;
    this._events = null;
}

function jsWorkFlow_Events$get_events() {
    return this._events;
}

function jsWorkFlow_Events$addHandler(eventName, handler) {
    this._events.addHandler(eventName, handler);
}

function jsWorkFlow_Events$removeHandler(eventName, handler) {
    this._events.removeHandler(eventName, handler);
}

//触发事件
function jsWorkFlow_Events$raiseEvent(eventName, eventArgs) {
    var handler = this._events.getHandler(eventName);

    if (handler) {
        handler(this._owner, eventArgs);
    }
}

jsWorkFlow.Events.prototype = {
    _owner: null,
    _events: null,
    dispose: jsWorkFlow_Events$dispose,
    //property
    get_events: jsWorkFlow_Events$get_events,
    //method
    addHandler: jsWorkFlow_Events$addHandler,
    removeHandler: jsWorkFlow_Events$removeHandler,
    raiseEvent: jsWorkFlow_Events$raiseEvent
};

jsWorkFlow.Events.registerClass('jsWorkFlow.Events');


//////////////////////////////////////////////////////////////////////////////////////////
//Application，表示一个jsWorkFlow的应用运行环境
//
//TO 开发者：
//    Applcation代表一个独立的运行环境，在概念上对应一个传统的进程，可以在这个观察点上关注APP的状态的变化，
//并获取对应的APP事件通知。
//    每个Application都包含一个Scheduler，用于调度job的运行，而activity本身会作为job的内容被调度到Scheduler中
//执行。
//    dataContext是传递给APP的启动参数，字典形式。必须是plane data object。APP会克隆后加入到applicationContext之中。
//
// TODO:
//    Add LOG support.
//
jsWorkFlow.Application = function jsWorkFlow_Application(instance, dataContext) {
    //事件属于装配件，需一直存在
    this._events = new jsWorkFlow.Events(this);

    this._instance = instance;
    if (!dataContext) {
        dataContext = {};
    }
    this._dataContext = dataContext;

    //调度器属于APP的固定组成部分，activity只是使用者之一，一直可用
    this._scheduler = new jsWorkFlow.Scheduler();
};

function jsWorkFlow_Application$get_scheduler() {
    return this._scheduler;
}

function jsWorkFlow_Application$get_globalContext() {
    var ins = jsWorkFlow.GlobalContext.getInstance();
    return ins;
}

function jsWorkFlow_Application$get_appContext() {
    return this._appContext;
}

function jsWorkFlow_Application$get_instance() {
    return this._instance;
}

function jsWorkFlow_Application$get_currentContext() {
    //return stack top
    var contextStack = this._contextStack;
    var context = contextStack[contextStack.length - 1];

    return context;
}

function jsWorkFlow_Application$get_errorStrategy() {
    return this._errorStrategy;
}

function jsWorkFlow_Application$set_errorStrategy(value) {
    this._errorStrategy = value;
}



function jsWorkFlow_Application$run() {
    //应用的上下文，运行期间可用
    this._appContext = new jsWorkFlow.ApplicationContext();

    //将dataContext放置到appContext之中
    if(this._dataContext) {
        var dst = this._appContext;

        jQuery.each(this._dataContext, function (key, value) {
            dst.setData(key, value);
        }); 
    }

    //activityContext栈，运行期间可用
    this._contextStack = [];

    //启动scheduler
    this._scheduler.start();

    //通过instance的execute开始执行
    this._instance.execute(this);
}

//强制停止
function jsWorkFlow_Application$forceStop() {
    //forceStop
    //clean all jobs.
    var jobQueue = this._jobQueue;

    for (var i = 0, ilen = jobQueue.length; i < ilen; i++) {

        var job = jobQueue.shift();

        try {
            //释放job
            job.dispose();
        } catch (e) {
            //TODO:
            //    log error here!
        }
    }

    //设置运行状态为stop
    this._isRunning = false;

    this._events.raiseEvent('stop', Sys.EventArgs.Empty);

}

function jsWorkFlow_Application$dispose() {
    this._events.dispose();
    this._instance.dispose();
    this._scheduler.dispose();
    this._appContext.dispose();

    this._events = null;
    this._instance = null;
    this._scheduler = null;
    this._appContext = null;
    this._contextStack = null;
}


//ActivityContext栈维护
function jsWorkFlow_Application$pushContextStack(activityContext) {
    //将activityContext入栈
    this._contextStack.push(activityContext);
}

function jsWorkFlow_Application$popContextStack() {
    //将栈顶的activityContext出栈，并返回
    var activityContext = this._contextStack.pop();
    return activityContext;
}

//取跳过指定次序的栈顶的context
//index从0开始
function jsWorkFlow_Application$internalContextAt(index) {
    var contextStack = this._contextStack;
    var activityContext = contextStack[contextStack.length - 1 - index];
    return activityContext;
}

//localContextIndex指定不受可见性控制的top stack context
function jsWorkFlow_Application$getDataItem(key, localContextIndex) {
    //根据key值在activityContext栈中查找value，并返回
    //注意：除顶层外，其他层受可见性控制

    if (typeof (localContextIndex) === "undefined") {
        localContextIndex = 0;
    }

    var dataItem = null;

    //try contextStack
    var contextStack = this._contextStack;

    for (var i = contextStack.length - 1; i >= 0; i--) {
        var context = contextStack[i];

        dataItem = context.getDataItem(key);

        //顶层不受可见性的控制
        if (dataItem && (i >= (contextStack.length - localContextIndex - 1))) {
            return dataItem;
        }

        //其他层受可见性的约束
        if (dataItem && dataItem.isPublic) {
            return dataItem;
        }
    }

    //try appContext
    dataItem = this._appContext.getDataItem(key);

    if (dataItem && dataItem.isPublic) {
        return dataItem;
    }

    //try globalContext
    var globalContext = this.get_globalContext();

    dataItem = globalContext.getDataItem(key);
    if (dataItem && dataItem.isPublic) {
        return dataItem;
    }

    return null;
}

//APP级别的数据维护接口
function jsWorkFlow_Application$getData(key, localContextIndex) {
    var dataItem = this.getDataItem(key, localContextIndex);

    if (dataItem) {
        return dataItem.value;
    }

    return null;
}

//如果不存在已经定义的数据项，数据保存在currentContext之中
function jsWorkFlow_Application$setData(key, value, localContextIndex) {
    var dataItem = this.getDataItem(key, localContextIndex);

    if (dataItem) {
        dataItem.value = value;
        return;
    }

    //找不到，在指定的层上创建key、value
    //var context = this.get_currentContext();
    var context = this.internalContextAt(localContextIndex);
    context.setData(key, value);
}


jsWorkFlow.Application.prototype = {
    _instance: null,
    _dataContext: null,
    _appContext: null,
    _contextStack: null,
    _events: null,
    _scheduler: null,
    _errorStrategy: jsWorkFlow.ActivityExecuteStrategy.none, //默认无定义
    //property
    get_scheduler: jsWorkFlow_Application$get_scheduler,
    get_globalContext: jsWorkFlow_Application$get_globalContext,
    get_appContext: jsWorkFlow_Application$get_appContext,
    get_instance: jsWorkFlow_Application$get_instance,
    get_currentContext: jsWorkFlow_Application$get_currentContext,
    //应用级的错误处理策略
    get_errorStrategy: jsWorkFlow_Application$get_errorStrategy,
    set_errorStrategy: jsWorkFlow_Application$set_errorStrategy,

    //method
    run: jsWorkFlow_Application$run,
    forceStop: jsWorkFlow_Application$forceStop,
    dispose: jsWorkFlow_Application$dispose,
    //ActivityContext栈维护
    pushContextStack: jsWorkFlow_Application$pushContextStack,
    popContextStack: jsWorkFlow_Application$popContextStack,
    internalContextAt: jsWorkFlow_Application$internalContextAt,
    //APP级别的数据维护接口
    getDataItem: jsWorkFlow_Application$getDataItem,
    getData: jsWorkFlow_Application$getData,
    setData: jsWorkFlow_Application$setData
};

jsWorkFlow.Application.registerClass('jsWorkFlow.Application');

//////////////////////////////////////////////////////////////////////////////////////////
//Instance，表示一个jsWorkFlow的activity组合的运行载体，主要包含rootActivity
//
//TO 开发者：
//    用来表示activity组装的最终结果，于activity本身并无太大的差别。
//    Instance主要的任务是面向装配的，即如何从文档中解析和加载一个描述的Activity。
//    Instance的执行是初始化ActivityContext的栈的数据结构，并将rootActivity调度执行。
//
jsWorkFlow.Instance = function jsWorkFlow_Instance() {
    this._events = new jsWorkFlow.Events(this);
};

function jsWorkFlow_Instance$dispose() {
    if (this._rootActivity) {
        this._rootActivity.dispose();
        this._rootActivity = null;
    }

     this._events.dispose();

      this._events = null;
}

//rootActivity属性
function jsWorkFlow_Instance$get_rootActivity() {
    return this._rootActivity;
}

function jsWorkFlow_Instance$set_rootActivity(value) {
    this._rootActivity = value;
}

//加载一个activity描述，并解析，并放置到rootActivity之中
function jsWorkFlow_Instance$loadFromXML(xml) {
}

//清除rootActivity，并清除相关的加载的数据
function jsWorkFlow_Instance$unload() {
}

//开始在APP中运行
function jsWorkFlow_Instance$execute(application) {

    //TODO:
    //检查application参数和rootActivity
    
    //Create ActivityExecutor，执行rootActivity
    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, this._rootActivity);

    //创建delegates
    this._initEventHandler = Function.createDelegate(this, this.initEventHandler);
    this._completeEventHandler = Function.createDelegate(this, this.completeEventHandler);

    //attacth delegate to events
    activityExecutor.add_init(this._initEventHandler);
    activityExecutor.add_complete(this._completeEventHandler);

    //OK, kick activityExecutor to run!
    activityExecutor.execute();

}


//执行init相关操作
function jsWorkFlow_Instance$doInit(eventArgs) {
    //TODO:
    //init instance
}

//执行complete相关操作
function jsWorkFlow_Instance$doComplete(eventArgs) {
    //TODO:
    //clear instance
}

function jsWorkFlow_Instance$initEventHandler(eventArgs) {
    //先执行自身init相关逻辑
    this.doInit(eventArgs);

    //触发注册的init事件
    this._events.raiseEvent('init', eventArgs);
}

function jsWorkFlow_Instance$add_init(handler) {
    this._events.addHandler('init', handler);
}

function jsWorkFlow_Instance$remove_init(handler) {
    this._events.removeHandler('init', handler);
}

function jsWorkFlow_Instance$completeEventHandler(eventArgs) {
    //触发注册的complete事件
    this._events.raiseEvent('complete', eventArgs);

    //执行自身complete相关逻辑
    this.doComplete(eventArgs);
}

function jsWorkFlow_Instance$add_complete(handler) {
    this._events.addHandler('complete', handler);
}

function jsWorkFlow_Instance$remove_complete(handler) {
    this._events.removeHandler('complete', handler);
}


jsWorkFlow.Instance.prototype = {
    _rootActivity: null,
    _events: null,
    _initEventHandler: null,
    _completeEventHandler:null,
    dispose: jsWorkFlow_Instance$dispose,
    //property
    get_rootActivity: jsWorkFlow_Instance$get_rootActivity,
    set_rootActivity: jsWorkFlow_Instance$set_rootActivity,
    //method
    loadFromXML: jsWorkFlow_Instance$loadFromXML,
    unload: jsWorkFlow_Instance$unload,
    execute: jsWorkFlow_Instance$execute,
    //执行init相关操作
    doInit: jsWorkFlow_Instance$doInit,
    //执行complete相关操作
    doComplete: jsWorkFlow_Instance$doComplete,
    //events
    //init事件，做activity执行前的准备工作
    initEventHandler: jsWorkFlow_Instance$initEventHandler,
    add_init: jsWorkFlow_Instance$add_init,
    remove_init: jsWorkFlow_Instance$remove_init,
    //complete事件，做activity执行结束后的清理工作
    completeEventHandler: jsWorkFlow_Instance$completeEventHandler,
    add_complete: jsWorkFlow_Instance$add_complete,
    remove_complete: jsWorkFlow_Instance$remove_complete

};

jsWorkFlow.Instance.registerClass('jsWorkFlow.Instance');


//////////////////////////////////////////////////////////////////////////////////////////
//ActivityEventArgs，提供jsWorkFlow的Activity的事件响应参数
//
// TO 开发者：
//    activity相关的事件handler中传递的参数，主要是携带context参数。
//    data是可选的参数，看事件上下文是否需要携带额外的数据
//
jsWorkFlow.ActivityEventArgs = function jsWorkFlow_ActivityEventArgs(context, data) {
    this._context = context;
    this._data = data;
};

function jsWorkFlow_ActivityEventArgs$dispose() {
    this._context = null;
}

function jsWorkFlow_ActivityEventArgs$get_context() {
    return this._context;
}

function jsWorkFlow_ActivityEventArgs$get_data() {
    return this._data;
}

jsWorkFlow.ActivityEventArgs.prototype = {
    _context: null,
    _data: null,
    dispose: jsWorkFlow_ActivityEventArgs$dispose,
    //property
    get_context: jsWorkFlow_ActivityEventArgs$get_context,
    get_data: jsWorkFlow_ActivityEventArgs$get_data
};

jsWorkFlow.ActivityEventArgs.registerClass('jsWorkFlow.ActivityEventArgs', Sys.EventArgs);

//////////////////////////////////////////////////////////////////////////////////////////
//ActivityCustomErrorEventArgs，提供jsWorkFlow的error的事件响应函数的参数，默认是exception
//
// TO 开发者：
//    activity相关的事件handler中传递的参数，主要是携带context参数。
//    data是可选的参数，看事件上下文是否需要携带额外的数据
//
jsWorkFlow.ActivityCustomErrorEventArgs = function jsWorkFlow_ActivityCustomErrorEventArgs(context, exception) {
    jsWorkFlow.ActivityCustomErrorEventArgs.initializeBase(this, [context, null]);
    this._exception = exception;
};

function jsWorkFlow_ActivityCustomErrorEventArgs$dispose() {
    jsWorkFlow.ActivityCustomErrorEventArgs.callBaseMethod(this, 'dispose');
}

function jsWorkFlow_ActivityCustomErrorEventArgs$get_errorStrategy() {
    return this._errorStrategy;
}

function jsWorkFlow_ActivityCustomErrorEventArgs$set_errorStrategy(value) {
    this._errorStrategy = value;
}

function jsWorkFlow_ActivityCustomErrorEventArgs$get_exception() {
    return this._exception;
}

jsWorkFlow.ActivityCustomErrorEventArgs.prototype = {
    _errorStrategy: jsWorkFlow.ActivityExecuteStrategy.none, //默认无定义
    _exception: null,
    dispose: jsWorkFlow_ActivityCustomErrorEventArgs$dispose,
    //property
    get_errorStrategy: jsWorkFlow_ActivityCustomErrorEventArgs$get_errorStrategy,
    set_errorStrategy: jsWorkFlow_ActivityCustomErrorEventArgs$set_errorStrategy,
    get_exception: jsWorkFlow_ActivityCustomErrorEventArgs$get_exception
};

jsWorkFlow.ActivityCustomErrorEventArgs.registerClass('jsWorkFlow.ActivityCustomErrorEventArgs', jsWorkFlow.ActivityEventArgs);


//////////////////////////////////////////////////////////////////////////////////////////
//ActivityHelper，提供activity帮助方法
//
// TO 开发者：
//    每个activity都是一个状态机，通过变更状态来驱动事件，通过事件来驱动状态变更。
//    ActivityHelper提供activity的公共方法，$jwf是其简写名称。
//
jsWorkFlow.ActivityHelper = function jsWorkFlow_ActivityHelper() {
    throw Error.notImplemented();
};

jsWorkFlow.ActivityHelper.prototype = {
};

//静态的方法
jsWorkFlow.ActivityHelper.startActivity = function jsWorkFlow_ActivityHelper$startActivity(context) {
    //使activity进入start状态
    context.set_activityState(jsWorkFlow.ActivityState.start);
}

jsWorkFlow.ActivityHelper.endActivity = function jsWorkFlow_ActivityHelper$endActivity(context) {
    //使activity进入start状态
    context.set_activityState(jsWorkFlow.ActivityState.end);
}

//查找Local数据项helper
jsWorkFlow.ActivityHelper.getLocalDataItem = function jsWorkFlow_ActivityHelper$getLocalDataItem(context, key) {
    var retval = context.getDataItem();
    return retval;
}

jsWorkFlow.ActivityHelper.getLocalData = function jsWorkFlow_ActivityHelper$getLocalData(context, key) {

    var retval = context.getData(key);
    return retval;
}

jsWorkFlow.ActivityHelper.setAppData = function jsWorkFlow_ActivityHelper$setAppData(context, key, value) {
    context.setData(key, value);
}

//通用查找数据项helper方法(含contextStack)
jsWorkFlow.ActivityHelper.getDataItem = function jsWorkFlow_ActivityHelper$getDataItem(context, key) {

    //检查是否有本地数据
    var retval = jsWorkFlow.ActivityHelper.getLocalDataItem(context, key);
    if (retval) {
        return retval;
    }

    //检查contextStack
    var app = context.get_application();
    retval = app.getDataItem();
    return retval;
}

jsWorkFlow.ActivityHelper.getData = function jsWorkFlow_ActivityHelper$getData(context, key) {
    var dataItem = jsWorkFlow.ActivityHelper.getDataItem(context, key);

    var retval = null;
    if (dataItem) {
        retval = dataItem.value;
    }

    return retval;
}

jsWorkFlow.ActivityHelper.setData = function jsWorkFlow_ActivityHelper$setData(context, key, value) {
    var dataItem = jsWorkFlow.ActivityHelper.getDataItem(context, key);

    if (dataItem) {
        dataItem.value = value;
        return;
    }

    context.setData(key, value);
}


//查找APP数据项helper
jsWorkFlow.ActivityHelper.getAppDataItem = function jsWorkFlow_ActivityHelper$getAppDataItem(context, key) {

    var app = context.get_application();
    var appContext = app.get_appContext();

    var retval = appContext.getDataItem();
    return retval;
}

jsWorkFlow.ActivityHelper.getAppData = function jsWorkFlow_ActivityHelper$getAppData(context, key) {
    var dataItem = jsWorkFlow.ActivityHelper.getAppDataItem(context, key);

    var retval = null;
    if (dataItem) {
        retval = dataItem.value;
    }

    return retval;
}

jsWorkFlow.ActivityHelper.setAppData = function jsWorkFlow_ActivityHelper$setAppData(context, key, value) {
    var app = context.get_application();
    var appContext = app.get_appContext();

    appContext.setData(key, value);
}

//查找Global数据项helper
jsWorkFlow.ActivityHelper.getGlobalDataItem = function jsWorkFlow_ActivityHelper$getGlobalDataItem(context, key) {

    var app = context.get_application();
    var globalContext = app.get_globalContext();

    var retval = globalContext.getDataItem();
    return retval;
}

jsWorkFlow.ActivityHelper.getGlobalData = function jsWorkFlow_ActivityHelper$getGlobalData(context, key) {
    var dataItem = jsWorkFlow.ActivityHelper.getGlobalDataItem(context, key);

    var retval = null;
    if (dataItem) {
        retval = dataItem.value;
    }

    return retval;
}

jsWorkFlow.ActivityHelper.setGlobalData = function jsWorkFlow_ActivityHelper$setGlobalData(context, key, value) {
    var app = context.get_application();
    var globalContext = app.get_globalContext();

    globalContext.setData(key, value);
}

//通过activity的serializeContext来恢复activity
jsWorkFlow.ActivityHelper.loadActivity = function jsWorkFlow_ActivityHelper$loadActivity(serializeContext) {

    var activity = null;

    if (serializeContext) {
        var activityType = eval(serializeContext['_@_activityType']);

        //
        activity = new activityType();
        activity.loadSerializeContext(serializeContext);
    }

    return activity;
}

jsWorkFlow.ActivityHelper.saveActivity = function jsWorkFlow_ActivityHelper$saveActivity(activity) {

    var serializeContext = null;

    if (activity) {
        serializeContext = {};
        activity.saveSerializeContext(serializeContext);
    }

    return serializeContext;
}

//activity的注册数据库
jsWorkFlow.ActivityHelper._activityRegistry = {};

//register activity，其参数如下。
//activityType, activity的类型（function type）
//activityInfo，activity信息，是一个字典，其成员如下：
//       .catalog           -->  activity在设计器中对应的分类
//       .description       -->  对应的描述
//       .supportInstance   -->  是否允许实例化
//       .designerRuntimeProps  -->  传递给activity设计器的运行期属性设置，是key-value的map
//propertyInfoList，activity的属性设计信息列表，是一个数组，其每个元素是一个字典，结构如下：
//       .propName          --> 属性名称
//       .propDesignerName  --> 对应的属性设计器的名称
//       .description       -->  对应的描述
//       .designerRuntimeProps  --> 传递给属性设计器附加的属性值（构造之后设置）,是key-value的map

jsWorkFlow.ActivityHelper.registerActivity = function jsWorkFlow_ActivityHelper$registerActivity(activityType, activityInfo, propertyInfoList) {
    var activityRegistry = {
        activityInfo: activityInfo,
        propertyInfoList: propertyInfoList
    };

    jsWorkFlow.ActivityHelper._activityRegistry[activityType] = activityRegistry;

    return activityRegistry;
};


//获取activity的设计器信息
jsWorkFlow.ActivityHelper.loadActivityRegistry = function jsWorkFlow_ActivityHelper$loadActivityRegistry(activityType) {
    var activityRegistry = jsWorkFlow.ActivityHelper._activityRegistry[activityType];

    return activityRegistry;
};

//设计器使用的API，获取合并后的activity的注册信息的完整集合，包含继承链上的所有注册。
//为了保持javascript的动态的特性，buildActivityRegistry会动态的计算其注册信息，保证任何的动态更新都能在第一时间获取到。
jsWorkFlow.ActivityHelper.buildActivityRegistry = function jsWorkFlow_ActivityHelper$buildActivityRegistry(activityType) {
    //TODO: 获得activity的继承链，并按从父到子的次序合并设计器信息
    var activityRegistry = null;
    return activityRegistry;
};




jsWorkFlow.ActivityHelper.registerClass('jsWorkFlow.ActivityHelper');

//make a shortcut for ActivityHelper
var $jwf = jsWorkFlow.ActivityHelper;

//////////////////////////////////////////////////////////////////////////////////////////
//Activity，表示一个jsWorkFlow活动
//每个activity都是一个状态机，通过变更状态来驱动事件，通过事件来驱动状态变更。
// 
// TODO:
//    Add support of designer.
//
// to 开发者：
//    activity的是一个装配装置，和我们书写一个函数类似，装配是描述一个activity提供的功能。
//activity中的事件也是为这个目标服务，对activity的事件的设置可以看成是一个装配的过程，装配
//好的activity可以组装到多个activity中使用。
//    activity的运行期的数据，存储在activity context之中。
//    Activity类是一个抽象基类，本身只提供对activity公用数据、方法的封装，不能作为activity来运行。
//    activity的序列化通过loadSerializeContext和saveSerializeContext来执行，传入的serializeContext是
//序列化数据的载体，要求是基本的数据类型(Primary Data Type)，每个activity里面存放自身的数据，其中有
//两个特殊的数据项，"_@_activityType"用于存放activity类型的full name，"_@_base"用于存放父类的
//serializeContext。
//
jsWorkFlow.Activity = function jsWorkFlow_Activity() {
    this._events = new jsWorkFlow.Events(this);
};

function jsWorkFlow_Activity$dispose() {
    this._events.dispose();
    this._events = null;
}

function jsWorkFlow_Activity$getType() {
    return Object.getType(this);
}

function jsWorkFlow_Activity$get_name() {
    return this._name;
}

function jsWorkFlow_Activity$set_name(value) {
    this._name = value;
}

function jsWorkFlow_Activity$get_errorStrategy() {
    return this._errorStrategy;
}

function jsWorkFlow_Activity$set_errorStrategy(value) {
    this._errorStrategy = value;
}

//activity的恢复
function jsWorkFlow_Activity$loadSerializeContext(serializeContext) {

    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== this.getType().getName()) {
        throw Error.invalidOperation("loadSerializeContext missmatch type!");
    }

    //恢复name & errorStrategy属性
    this.set_name(serializeContext['name']);
    this.set_errorStrategy(serializeContext['errorStrategy']);
}

//activity的序列化
function jsWorkFlow_Activity$saveSerializeContext(serializeContext) {

    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = this.getType().getName();
    
    //保存name & errorStrategy属性
    serializeContext['name'] = this.get_name();
    serializeContext['errorStrategy'] = this.get_errorStrategy();
}

//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activity$execute(context) {
    //context必须是jsWorkFlow.ActivityContext类型
    var e = Function._validateParams(arguments, [
        { name: "context", type: jsWorkFlow.ActivityContext }
    ]);

    //使activity进入start状态
    $jwf.startActivity(context);

    //由于通过事件来驱动，所以要在什么地方来设置activity的结束状态
    //通过$jwf.endActivity(context);
}

//通知状态变更，触发自己关心的事件变更
function jsWorkFlow_Activity$notifyStateChanged(context, oldState, curState) {
    var eventArgs = new jsWorkFlow.ActivityEventArgs(context);

    if (curState == jsWorkFlow.ActivityState.start) {
        //状态迁移到start，触发start事件
        this._events.raiseEvent('start', eventArgs);
    }
    else if (curState == jsWorkFlow.ActivityState.end) {
        this._events.raiseEvent('end', eventArgs);
    }

    //ignore other state value
}

function jsWorkFlow_Activity$notifyError(eventArgs) {
    this._events.raiseEvent('error', eventArgs);
}

//events
function jsWorkFlow_Activity$add_start(handler) {
    this._events.addHandler('start', handler);
}

function jsWorkFlow_Activity$remove_start(handler) {
    this._events.removeHandler('start', handler);
}

function jsWorkFlow_Activity$add_stop(handler) {
    this._events.addHandler('stop', handler);
}

function jsWorkFlow_Activity$remove_stop(handler) {
    this._events.removeHandler('stop', handler);
}

function jsWorkFlow_Activity$add_error(handler) {
    this._events.addHandler('error', handler);
}

function jsWorkFlow_Activity$remove_error(handler) {
    this._events.removeHandler('error', handler);
}

jsWorkFlow.Activity.prototype = {
    _name: null,
    _events: null,
    _errorStrategy: jsWorkFlow.ActivityExecuteStrategy.none, //默认无定义
    dispose: jsWorkFlow_Activity$dispose,
    //property
    //name，只是一个标识
    get_name: jsWorkFlow_Activity$get_name,
    set_name: jsWorkFlow_Activity$set_name,
    //errorStrategy,容错策略
    get_errorStrategy: jsWorkFlow_Activity$get_errorStrategy,
    set_errorStrategy: jsWorkFlow_Activity$set_errorStrategy,

    //method
    loadSerializeContext: jsWorkFlow_Activity$loadSerializeContext,
    saveSerializeContext: jsWorkFlow_Activity$saveSerializeContext,
    execute: jsWorkFlow_Activity$execute,
    notifyStateChanged: jsWorkFlow_Activity$notifyStateChanged,
    notifyError: jsWorkFlow_Activity$notifyError,
    //event handler
    //基类关注的activity的状态只有start和stop，其它状态由派生类来扩展
    //start 事件
    add_start: jsWorkFlow_Activity$add_start,
    remove_start: jsWorkFlow_Activity$remove_start,
    //stop 事件
    add_stop: jsWorkFlow_Activity$add_stop,
    remove_stop: jsWorkFlow_Activity$remove_stop,
    //error 事件
    add_error: jsWorkFlow_Activity$add_error,
    remove_error: jsWorkFlow_Activity$remove_error

};

jsWorkFlow.Activity.registerClass('jsWorkFlow.Activity');

//////////////////////////////////////////////////////////////////////////////////////////
//DesignerSiteInfo，表示一个designer的设计器于展示相关的信息
//
// To 开发者：
//    designer是抽象模型是基于div的输出模式，div提供客户端的呈现的客户端的尺寸，designer在div提供的呈现空间
//内交互，我们将客户端的呈现相关的信息称为：DesignerSiteInfo
//
jsWorkFlow.DesignerSiteInfo = function jsWorkFlow_DesignerSiteInfo(site) {
    this._site = site;
};

function jsWorkFlow_DesignerSiteInfo$dispose() {
    this._site = null;
}

//site尺寸发生变化的事件
function jsWorkFlow_DesignerSiteInfo$add_resized(handler) {
}

function jsWorkFlow_DesignerSiteInfo$remove_resized(handler) {
}

//clicl事件
function jsWorkFlow_DesignerSiteInfo$add_click(handler) {
}

function jsWorkFlow_DesignerSiteInfo$remove_click(handler) {
}


//提供designer所在的div
function jsWorkFlow_DesignerSiteInfo$get_site() {
    return this._site;
}

jsWorkFlow.DesignerSiteInfo.prototype = {
    _indent: 0, //缩进
    _seperateLine: 0, //分割行
    _site: null,
    dispose: jsWorkFlow_DesignerSiteInfo$dispose,
    //event
    //resized
    add_resized: jsWorkFlow_DesignerSiteInfo$add_resized,
    remove_resized: jsWorkFlow_DesignerSiteInfo$remove_resized,
    //click
    add_click: jsWorkFlow_DesignerSiteInfo$add_click,
    remove_click: jsWorkFlow_DesignerSiteInfo$remove_click,
    //property
    get_site: jsWorkFlow_DesignerSiteInfo$get_site

};

jsWorkFlow.DesignerSiteInfo.registerClass('jsWorkFlow.DesignerSiteInfo');

//缩进为20px
jsWorkFlow.DesignerSiteInfo.indentWidth = 20;
//行高
jsWorkFlow.DesignerSiteInfo.rowHeight = 20;

//////////////////////////////////////////////////////////////////////////////////////////
//PropertyDesignerBase，表示一个jsWorkFlow的编辑器中的一个属性的基类
//
// To 开发者：
//    PropertyDesignerBase是所有designer的抽象基类，用于提供activity的状态和设计期，输出结果到JSON对象。
//    designer是抽象模型是基于div的输出模式，div提供客户端的呈现的客户端的尺寸，designer在div提供的呈现空间
//内交互，我们将客户端的呈现相关的信息称为：siteInfo
//    一个designer通过active来激活；通过deactive来关闭；通过document来打开或保存记录的信息。
//  
//    activity设计器UI
//     ------------------------------------------
//    |>>| Activity    | IfActivity(if1)       |A|  显示activity的类型和名称（如果有），重新选择activity置空内部的文档
//    |  |---------------------------------------   \
//    |  |  | Name     |  if1                |str|   |
//    |  |---------------------------------------   /
//    |  |>>| IfCond   | ExprActivity(expr1)   |A|
//    |     |------------------------------------
//    |[id] |  | Name  | expr1               |str|
//    |     |------------------------------------
//    |     |  | Expr  | xxxx                |str|
//    |     |------------------------------------
//    |  |>>| IfBody   | ExprActivity(expr2)   |A|
//    |     |------------------------------------
//    |     |  | Name  | expr2               |str|
//    |     |------------------------------------
//    |     |  | Expr  | xxxx                |str|
//    |     |-------------------------------------
//    |  |>>| ElseBody | ExprActivity(expr3)   |A|
//    |     |------------------------------------
//    |     |  | Name  | expr3               |str|
//    |     |------------------------------------
//    |     |  | Expr  | xxxx                |str|
//     ------------------------------------------
//    ^     ^          ^                         ^end line, can be moved.
//    |     |          |seperate line, can be moved.
//    |     |indent start
//    |site left side             site right side^
//

jsWorkFlow.PropertyDesignerBase = function jsWorkFlow_PropertyDesignerBase() {
};

function jsWorkFlow_PropertyDesignerBase$dispose() {
}

//提供PropertyDesignerBase对应的类型名
function jsWorkFlow_PropertyDesignerBase$get_siteInfo() {
    throw Error.notImplemented();
}

//显示编辑页面，开始编辑activity
function jsWorkFlow_PropertyDesignerBase$active(siteInfo, document) {
    //siteInfo是designer的工作场所，
    //document是传递给designer的文档，用于存储activity的编辑结果
    this._siteInfo = siteInfo;
    this._document = document;
}

function jsWorkFlow_PropertyDesignerBase$deactive() {
    this._siteInfo = null;
    this._document = null;
}

jsWorkFlow.PropertyDesignerBase.prototype = {
    _siteInfo: null,
    _document: null,
    dispose: jsWorkFlow_PropertyDesignerBase$dispose,
    //property
    get_siteInfo: jsWorkFlow_PropertyDesignerBase$get_siteInfo,
    //method
    active: jsWorkFlow_PropertyDesignerBase$active,
    deactive: jsWorkFlow_PropertyDesignerBase$deactive
};

jsWorkFlow.PropertyDesignerBase.registerClass('jsWorkFlow.PropertyDesignerBase');



//////////////////////////////////////////////////////////////////////////////////////////
//ContextBase，context的基础类，提供一致的数据管理方法
//
//to 开发者：
//    默认数据私有。
//    可以根据defaultVisibilityIsPublic的true、false改变缺省的可见性
//    提供基础getDataItem、getData、setData和copyFrom方法
//
jsWorkFlow.ContextBase = function jsWorkFlow_ContextBase(defaultVisibilityIsPublic) {
    this._defaultVisibilityIsPublic = !!defaultVisibilityIsPublic;
    this._data = {};
};

function jsWorkFlow_ContextBase$dispose() {
    this._data = null;
}

//默认的可见性
function jsWorkFlow_ContextBase$get_defaultVisibilityIsPublic() {
    return this._defaultVisibilityIsPublic;
}

function jsWorkFlow_ContextBase$clear() {
    this._data = {};
}

//是否包含key
function jsWorkFlow_ContextBase$containKey(key) {
    return this._data.hasOwnProperty(key);
}

//获取&设置context中的数据
function jsWorkFlow_ContextBase$getDataItem(key) {
    var item = null;

    if (this._data.hasOwnProperty(key)) {
        item = this._data[key];
    }

    return item;
}

function jsWorkFlow_ContextBase$getData(key) {

    var retval = null;
    var item = this.getDataItem(key);

    if (item) {
        retval = item.value;
    }

    return retval;
}

//visibilitySwitch是可见性的切换开关，如果为false，表示不切换，如果为true，表示切换到和默认不同的可见性
function jsWorkFlow_ContextBase$setData(key, value, visibilitySwitch) {
    var isPublic = (!!visibilitySwitch) ? !this._defaultVisibilityIsPublic : this._defaultVisibilityIsPublic;

    var item = { key: key,
        value: value,
        isPublic: isPublic
    };

    this._data[key] = item;
}

//从源字典中复制数据
function jsWorkFlow_ContextBase$copyFrom(srcDict, deepClone) {
    //depend on JQuery
    jQuery.extend.extend(!!deepClone, this._data, srcDict); 
}


jsWorkFlow.ContextBase.prototype = {
    _defaultVisibilityIsPublic: false,
    _data: null,
    dispose: jsWorkFlow_ContextBase$dispose,
    get_defaultVisibilityIsPublic: jsWorkFlow_ContextBase$get_defaultVisibilityIsPublic,
    //method
    //获取&设置context中的数据
    clear: jsWorkFlow_ContextBase$clear,
    containKey: jsWorkFlow_ContextBase$containKey,
    getDataItem: jsWorkFlow_ContextBase$getDataItem,
    getData: jsWorkFlow_ContextBase$getData,
    setData: jsWorkFlow_ContextBase$setData,
    copyFrom: jsWorkFlow_ContextBase$copyFrom
    //property
};

jsWorkFlow.ContextBase.registerClass('jsWorkFlow.ContextBase');


//////////////////////////////////////////////////////////////////////////////////////////
//GlobalContext，表示一个jsWorkFlow活动全局的运行上下文的运行环境，数据的生命周期可以跨instance
//
//to 开发者：
//    GlobalContext提供全局共享的数据，和javascript引擎是相同的生命周期，为所有application共享的数据。
//    默认可见性为public。
jsWorkFlow.GlobalContext = function jsWorkFlow_GlobalContext() {
    jsWorkFlow.GlobalContext.initializeBase(this, [true]);
};

function jsWorkFlow_GlobalContext$dispose() {
    jsWorkFlow.GlobalContext.callBaseMethod(this, 'dispose');
}

jsWorkFlow.GlobalContext.prototype = {
    dispose: jsWorkFlow_GlobalContext$dispose
    //property
};

jsWorkFlow.GlobalContext.registerClass('jsWorkFlow.GlobalContext', jsWorkFlow.ContextBase);

jsWorkFlow.GlobalContext._instance = new jsWorkFlow.GlobalContext();

jsWorkFlow.GlobalContext.getInstance = function jsWorkFlow_GlobalContext$getInstance() {
    return jsWorkFlow.GlobalContext._instance;
};


//////////////////////////////////////////////////////////////////////////////////////////
//ApplicationContext，应用级别的上下文，数据的生命周期可以跨Activity
//
//to 开发者：
//    ApplicationContext表示应用程序的运行上下文环境，用于管理应用级别共享的数据，于ActivityContext不同，
//    默认可见性为public，ApplicationContext中的数据默认是对包含的activity开放的。
//
jsWorkFlow.ApplicationContext = function jsWorkFlow_ApplicationContext() {
    jsWorkFlow.ApplicationContext.initializeBase(this, [true]);
};

function jsWorkFlow_ApplicationContext$dispose() {
    jsWorkFlow.ApplicationContext.callBaseMethod(this, 'dispose');
}

jsWorkFlow.ApplicationContext.prototype = {
    dispose: jsWorkFlow_ApplicationContext$dispose
    //property
    //method
};

jsWorkFlow.ApplicationContext.registerClass('jsWorkFlow.ApplicationContext', jsWorkFlow.ContextBase);


//////////////////////////////////////////////////////////////////////////////////////////
//ActivityContext，表示一个jsWorkFlow活动的运行上下文,数据依附于所在的活动
//
//to 开发者：
//    ActivityContext是Activity运行数据的载体，会存储Activity的数据和运行状态，以及获取Activity运行开始、结束的通知。
//ActivityContext中的数据通过字典来管理，使用简单的key-value对，在数据的可见性上，默认是私有（不能跨层级访问），也可
//以设置为public（自己包含的那些activity能访问这些数据）。
//    在应用程序的级别通过ActivityContext栈管理ActivityContext。
//    Activity的执行结果放置到ActivityContext的result属性上，可以由上级的执行者来获取。
//
jsWorkFlow.ActivityContext = function jsWorkFlow_ActivityContext(application, activity, executor) {
    jsWorkFlow.ActivityContext.initializeBase(this);

    this._application = application;
    this._executor = executor;
    this._activity = activity;
    this._activityState = jsWorkFlow.ActivityState.none;
    this._args = {};
    this._result = null;

};

function jsWorkFlow_ActivityContext$dispose() {
    this._application = null;
    this._executor = null;
    this._activity = null;
    this._args = null;
    this._result = null;

    jsWorkFlow.ActivityContext.callBaseMethod(this, 'dispose');
}

//获取传递给activity的参数
function jsWorkFlow_ActivityContext$getParam(name) {
    return this._args[name];
}

//和activityContext关联的application
function jsWorkFlow_ActivityContext$get_application() {
    return this._application;
}

//和activityContext关联的activity
function jsWorkFlow_ActivityContext$get_activity() {
    return this._activity;
}

//executor
function jsWorkFlow_ActivityContext$get_executor() {
    return this._executor;
}

//获取&设置activity的状态
function jsWorkFlow_ActivityContext$get_activityState() {
    return this._activityState;
}

function jsWorkFlow_ActivityContext$set_activityState(value) {
    var oldState = this._activityState;

    //状态相同不触发状态变更
    if (oldState == value) {
        return;
    }

    this._activityState = value;

    //通知activity状态变更，activity得到基类会处理jsWorkFlow.ActivityState.start和jsWorkFlow.ActivityState.end
    this._activity.notifyStateChanged(this, oldState, value);

    //如果activity的当前状态为jsWorkFlow.ActivityState.end，表示活动以及结束，触发activityExecutor的complete事件
    if (value == jsWorkFlow.ActivityState.end) {
        var eventArgs = new jsWorkFlow.ActivityEventArgs(this);
        this._executor.raiseCompleteEvent(eventArgs);
    }
}

//获取&设置activity的返回值
function jsWorkFlow_ActivityContext$get_result() {
    return this._result;
}

function jsWorkFlow_ActivityContext$set_result(value) {
    this._result = value;
}


jsWorkFlow.ActivityContext.prototype = {
    _application: null,
    _activity: null,
    _executor: null,
    _activityState: jsWorkFlow.ActivityState.none,
    _args: null,
    _result: null,
    dispose: jsWorkFlow_ActivityContext$dispose,
    //method
    //获取传递给activity的参数
    getParam: jsWorkFlow_ActivityContext$getParam,

    //property
    //和activityContext关联的application
    get_application: jsWorkFlow_ActivityContext$get_application,
    //和activityContext关联的activity
    get_activity: jsWorkFlow_ActivityContext$get_activity,
    //executor
    get_executor: jsWorkFlow_ActivityContext$get_executor,

    //获取&设置activity的状态
    get_activityState: jsWorkFlow_ActivityContext$get_activityState,
    set_activityState: jsWorkFlow_ActivityContext$set_activityState,
    //获取&设置activity的返回值
    get_result: jsWorkFlow_ActivityContext$get_result,
    set_result: jsWorkFlow_ActivityContext$set_result


};

jsWorkFlow.ActivityContext.registerClass('jsWorkFlow.ActivityContext', jsWorkFlow.ContextBase);

//////////////////////////////////////////////////////////////////////////////////////////
//ActivityExecutor，表示一个jsWorkFlow的Activity的执行器，提供activity的执行上下文
//
// TO 开发者：
//    ActivityExecutor表示activity的运行的上下文，包含运行activity所需的所有运行期的
//支撑组件，包括application，当前的activity，以及对activity运行状态的初始化和complete事件。
//ActivityExecutor是对activity运行期的支持类，activity组件的作者使用。
//    ActivityExecutor的事件面向activity的作者，提供了preInit, init, complete, postComplete
//几个事件，事件参数都是ActivityEventArgs类型，携带当前的Activity对应的ActivityContext。
//    事件的触发时机如下：
//    (1) preInit发生在doInit之前，也就是ActivityContext还没进入到contextStack。
//    (2) init发生在doInit之后，执行环境已经准备就绪。
//    (3) complete发生在doComplete之前，执行环境还在。
//    (4) postComplete发生在doComplete之后，执行环境以及完全清除。
//
jsWorkFlow.ActivityExecutor = function jsWorkFlow_ActivityExecutor(application, activity) {
    this._application = application;
    this._activity = activity;
    this._activityContext = null;
    this._events = new jsWorkFlow.Events(this);
};

function jsWorkFlow_ActivityExecutor$dispose() {
    this._activityContext.dispose();
    this._events.dispose();

    this._application = null;
    this._activity = null;
    this._activityContext = null;
    this._events = null;
}

function jsWorkFlow_ActivityExecutor$get_activityContext() {
    return this._activityContext;
}

function _jwf$ae$run_and_check(activityContext, callback, callbackContext) {

    var activity = activityContext.get_activity();
    var application = activityContext.get_application();

    var errorStrategy = activity.get_errorStrategy();

    if (errorStrategy === jsWorkFlow.ActivityExecuteStrategy.none) {
        //使用应用级别的错误处理定义
        errorStrategy = application.get_errorStrategy();
    }

    try {
        //执行callback
        callback(callbackContext);
    } catch (e) {
        //运行出现异常
        //看activity中是否会做错误的修正
        var eventArgs = new jsWorkFlow.ActivityCustomErrorEventArgs(activityContext, e);
        activity.notifyError(eventArgs);

        //如果eventArgs中包含了不同的错误定义，优先使用这个
        var curErrorStrategy = eventArgs.get_errorStrategy();

        if (curErrorStrategy !== jsWorkFlow.ActivityExecuteStrategy.none) {
            errorStrategy = curErrorStrategy;
        }

        switch (errorStrategy) {
            case jsWorkFlow.ActivityExecuteStrategy.ignore:
                {
                    //ignore，workflow会处于一种不稳定的状态

                    //因为已经出现异常了，如果忽略，强制设置当前的activity为结束状态，尽量驱动后续的activity继续执行
                    //activity的状态驱动的机制可以保证驱动相同的状态不会触发状态变更
                    $jwf.endActivity(activityContext);
                    return;
                }
            case jsWorkFlow.ActivityExecuteStrategy.stop:
                {
                    //强制application结束
                    application.forceStop();
                    return;
                }
            case jsWorkFlow.ActivityExecuteStrategy.exception:
            case jsWorkFlow.ActivityExecuteStrategy.none:
            default:
                {
                    //直接抛出异常，由上层的程序来处理
                    throw e;
                }
        }
    }
} 

//内部使用，job的callback的handler
function jsWorkFlow_ActivityExecutor$doJobCallback(jobItem) {

    //构造lamda上下文
    var activityExecutor = this;
    var activity = this._activity;
    var application = this._application;
    var activityContext = this._activityContext;

    //执行
    jsWorkFlow.ActivityExecutor.run_and_check(this._activityContext, function () {
        var eventArgs = new jsWorkFlow.ActivityEventArgs(activityContext);
        //执行前先触发executor的init事件，用于准备activity的执行环境
        activityExecutor.raiseInitEvent(eventArgs);

        //执行activity
        activity.execute(activityContext);

    }, null);
    

    //进入事件通知的状态。

    //job的执行结束
}

//executor的执行入口点
function jsWorkFlow_ActivityExecutor$execute() {
    var activityExecutor = this;
    var activity = this._activity;
    var application = this._application;
    var activityContext = this._activityContext;

    //创建activity的context
    this._activityContext = new jsWorkFlow.ActivityContext(application, activity, this);

    //将activity的执行做成一个job，放到scheduler中执行。
    var callback = Function.createDelegate(this, this.doJobCallback);

    var scheduler = this._application.get_scheduler();

    //创建job对象
    var job = new jsWorkFlow.Job(callback, null);

    //将job放到scheduler中执行
    scheduler.scheduleJob(job);
}

//执行init相关操作
function jsWorkFlow_ActivityExecutor$doInit(eventArgs) {
    //push activity context
    this._application.pushContextStack(this._activityContext);

    //TODO:
    //    Binding params here!
}

//执行complete相关操作
function jsWorkFlow_ActivityExecutor$doComplete(eventArgs) {
    //TODO:
    //    put result here!

    //pop activity context
    this._application.popContextStack();

}

//触发init相关事件
function jsWorkFlow_ActivityExecutor$raiseInitEvent(eventArgs) {
    //触发注册的preInit事件
    this._events.raiseEvent('preInit', eventArgs);

    //先执行自身init相关逻辑
    this.doInit(eventArgs);

    //触发注册的init事件
    this._events.raiseEvent('init', eventArgs);
}

//触发complete相关事件
function jsWorkFlow_ActivityExecutor$raiseCompleteEvent(eventArgs) {
    //触发注册的complete事件
    this._events.raiseEvent('complete', eventArgs);

    //执行自身complete相关逻辑
    this.doComplete(eventArgs);

    //触发注册的postComplete事件
    this._events.raiseEvent('postComplete', eventArgs);
}



function jsWorkFlow_ActivityExecutor$add_preInit(handler) {
    this._events.addHandler('preInit', handler);
}

function jsWorkFlow_ActivityExecutor$remove_preInit(handler) {
    this._events.removeHandler('preInit', handler);
}

function jsWorkFlow_ActivityExecutor$add_init(handler) {
    this._events.addHandler('init', handler);
}

function jsWorkFlow_ActivityExecutor$remove_init(handler) {
    this._events.removeHandler('init', handler);
}

function jsWorkFlow_ActivityExecutor$add_complete(handler) {
    this._events.addHandler('complete', handler);
}

function jsWorkFlow_ActivityExecutor$remove_complete(handler) {
    this._events.removeHandler('complete', handler);
}

function jsWorkFlow_ActivityExecutor$add_postComplete(handler) {
    this._events.addHandler('postComplete', handler);
}

function jsWorkFlow_ActivityExecutor$remove_postComplete(handler) {
    this._events.removeHandler('postComplete', handler);
}

jsWorkFlow.ActivityExecutor.prototype = {
    _application: null,
    _activity: null,
    _activityContext: null,
    _events: null,
    //应该包含activity，提供activity的执行的上下文环境
    dispose: jsWorkFlow_ActivityExecutor$dispose,

    //property
    get_activityContext: jsWorkFlow_ActivityExecutor$get_activityContext,
    //method
    //内部使用，job的callback的handler
    doJobCallback: jsWorkFlow_ActivityExecutor$doJobCallback,
    //executor的执行入口点
    execute: jsWorkFlow_ActivityExecutor$execute,
    //执行init相关操作
    doInit: jsWorkFlow_ActivityExecutor$doInit,
    //执行complete相关操作
    doComplete: jsWorkFlow_ActivityExecutor$doComplete,
    //events
    //事件触发
    raiseInitEvent: jsWorkFlow_ActivityExecutor$raiseInitEvent,
    raiseCompleteEvent: jsWorkFlow_ActivityExecutor$raiseCompleteEvent,
    //preInit事件，做activity执行前的准备工作
    add_preInit: jsWorkFlow_ActivityExecutor$add_preInit,
    remove_preInit: jsWorkFlow_ActivityExecutor$remove_preInit,
    //init事件，做activity执行前的准备工作
    add_init: jsWorkFlow_ActivityExecutor$add_init,
    remove_init: jsWorkFlow_ActivityExecutor$remove_init,
    //complete事件，做activity执行结束后的清理工作
    add_complete: jsWorkFlow_ActivityExecutor$add_complete,
    remove_complete: jsWorkFlow_ActivityExecutor$remove_complete,
    //postComplete事件，做activity执行结束后的清理工作
    add_postComplete: jsWorkFlow_ActivityExecutor$add_postComplete,
    remove_postComplete: jsWorkFlow_ActivityExecutor$remove_postComplete
};

//class method
jsWorkFlow.ActivityExecutor.run_and_check = _jwf$ae$run_and_check;

jsWorkFlow.ActivityExecutor.registerClass('jsWorkFlow.ActivityExecutor');

//////////////////////////////////////////////////////////////////////////////////////////
//Job，提供jsWorkFlow的Scheduler的执行项目
//
//to 开发者：
//    Job代表一个需要运行调度的作业，描述执行体包含的内容。
//    其构造参数包含callback和context，表示需要执行的方法和传递给方法的参数。
jsWorkFlow.Job = function jsWorkFlow_Job(callback, context) {

    this._callback = callback;
    this._context = context;
};

function jsWorkFlow_Job$dispose() {
}

function jsWorkFlow_Job$get_context() {
    return this._context;
}

function jsWorkFlow_Job$get_result() {
    return this._result;
}

function jsWorkFlow_Job$set_result(value) {
    this._result = value;
}

function jsWorkFlow_Job$execute() {
    //执行工作项目
    if (this._callback) {
        this._callback(this);
    }
}

jsWorkFlow.Job.prototype = {
    //work item中应该包含ActivityExecutor，Job通过它来执行activity
    _callback: null,
    _context: null,
    _result: null,
    dispose: jsWorkFlow_Job$dispose,
    get_context: jsWorkFlow_Job$get_context,
    get_result: jsWorkFlow_Job$get_result,
    set_result: jsWorkFlow_Job$set_result,
    execute: jsWorkFlow_Job$execute
    //property
};

jsWorkFlow.Job.registerClass('jsWorkFlow.Job');

//////////////////////////////////////////////////////////////////////////////////////////
//Scheduler，提供jsWorkFlow的Instance的调度器
//
//to 开发者：
//    Scheduler是workflow的任务的执行引擎，驱动job的执行。
//    Scheduler在application中启动和初始化，可以通过事件关注其状态的变化，可以在外部控制其启动、停止、暂停等。
jsWorkFlow.Scheduler = function jsWorkFlow_Scheduler() {
    this._events = new jsWorkFlow.Events(this);
};

//const
//调度每100 ms执行一次
jsWorkFlow.Scheduler.interval_timer = 100;


function jsWorkFlow_Scheduler$get_isRunning() {
    return this._isRunning;
}

function jsWorkFlow_Scheduler$get_isStopPending() {
    return this._isStopPending;
}

function jsWorkFlow_Scheduler$get_isPausing() {
    return this._isPausing;
}

function jsWorkFlow_Scheduler$dispose() {

    if (this._isRunning) {
        this.stop(true);
    }

    this._events.dispose();
    this._events = null;
}

//将job放到运行队列
function jsWorkFlow_Scheduler$scheduleJob(job) {
    //Job必须是jsWorkFlow.Job类型
    var e = Function._validateParams(arguments, [
        { name: "job", type: jsWorkFlow.Job }
    ]);

    //运行状态（含pausing）下可以将job加入到执行队列
    if (!this._isRunning || this._isStopPending) {
        throw Error.invalidOperation("Scheduler not running!");
    }

    Array.add(this._jobQueue, job);
}

//run job的时间片的执行函数
function jsWorkFlow_Scheduler$doExecJobInterval() {
    if (this._isPausing) {
        return;
    }

    var jobQueue = this._jobQueue;

    var startTime = (new Date()).getTime();

    for (var i = 0, ilen = jobQueue.length; i < ilen; i++) {

        var job = jobQueue.shift();

        try {
            //执行job
            job.execute();

            //job已经执行完，释放
            job.dispose();
        } catch (e) {
            //TODO:
            //    log error here!
        }

        //检查运行时间
        var curTime = (new Date()).getTime();

        if ((curTime - startTime) > jsWorkFlow.Scheduler.interval_timer) {
            //运行时间过长了！需要终止运行，给其他操作让出CPU资源。
            break;
        }
    }

    //如果是stopPending，并且队列执行完闭，升级状态为stop
    if (this._isStopPending) {
        if (jobQueue.length == 0) {
            this.stop(true);
        }
    }

}

//默认start直接进入运行状态，如果isPausing为true，表示启动后处于暂停状态
function jsWorkFlow_Scheduler$start(isPausing) {
    if (this._isRunning) {
        throw Error.invalidOperation("Scheduler is already running!");
    }

    //start schedule engine
    var handler = Function.createDelegate(this, this.doExecJobInterval);
    this._intervalID = jsWorkFlow.setInterval(handler, jsWorkFlow.Scheduler.interval_timer);

    this._isRunning = true;
    this._isStopPending = false;
    this._isPausing = !!isPausing;
    this._jobQueue = [];

    this._events.raiseEvent('start', Sys.EventArgs.Empty);

}

function jsWorkFlow_Scheduler$pause() {

    //如果没运行，或正在停止，不允许设置为暂停
    if (!this._isRunning || this._isStopPending) {
        throw Error.invalidOperation("Scheduler is not running!");
        return;
    }

    this._isPausing = true;

    this._events.raiseEvent('pause', Sys.EventArgs.Empty);
}

function jsWorkFlow_Scheduler$resume() {

    if (!this._isRunning || this._isStopPending) {
        throw Error.invalidOperation("Scheduler is not running!");
    }

    this._isPausing = false;
    this._events.raiseEvent('resume', Sys.EventArgs.Empty);
}

//forceStopNow参数如果为true，表示是强制停止，不管是否有正在运行的任务。
function jsWorkFlow_Scheduler$stop(forceStopNow) {
    if (!this._isRunning) {
        throw Error.invalidOperation("Scheduler is not running!");
        return;
    }

    if (!forceStopNow) {
        //对于暂停的状态，如果通过stoppending的方式停止，会进入假死的状态。
        if (this._isPausing) {
            throw Error.invalidOperation("Scheduler is pausing, can't put into stoppending state! please resume it first.");
            return;
        }

        this._isStopPending = true;
        return;
    }

    //forceStop
    this.forceStop();

}

//events
function jsWorkFlow_Scheduler$add_start(handler) {
    this._events.addHandler('start', handler);
}

function jsWorkFlow_Scheduler$remove_start(handler) {
    this._events.removeHandler('start', handler);
}

function jsWorkFlow_Scheduler$add_pause(handler) {
    this._events.addHandler('pause', handler);
}

function jsWorkFlow_Scheduler$remove_pause(handler) {
    this._events.removeHandler('pause', handler);
}

function jsWorkFlow_Scheduler$add_resume(handler) {
    this._events.addHandler('resume', handler);
}

function jsWorkFlow_Scheduler$remove_resume(handler) {
    this._events.removeHandler('resume', handler);
}

function jsWorkFlow_Scheduler$add_stop(handler) {
    this._events.addHandler('stop', handler);
}

function jsWorkFlow_Scheduler$remove_stop(handler) {
    this._events.removeHandler('stop', handler);
}

jsWorkFlow.Scheduler.prototype = {
    _events: null,
    _isRunning: false,
    _isStopPending: false,
    _isPausing: false,
    _jobQueue: null,
    _intervalID: -1,
    //property
    get_isRunning: jsWorkFlow_Scheduler$get_isRunning,
    get_isStopPending: jsWorkFlow_Scheduler$get_isStopPending,
    get_isPausing: jsWorkFlow_Scheduler$get_isPausing,
    //method
    dispose: jsWorkFlow_Scheduler$dispose,
    scheduleJob: jsWorkFlow_Scheduler$scheduleJob,
    //内部执行
    doExecJobInterval: jsWorkFlow_Scheduler$doExecJobInterval,
    //运行状态控制
    start: jsWorkFlow_Scheduler$start,
    pause: jsWorkFlow_Scheduler$pause,
    resume: jsWorkFlow_Scheduler$resume,
    stop: jsWorkFlow_Scheduler$stop,
    //event
    add_start: jsWorkFlow_Scheduler$add_start,
    remove_start: jsWorkFlow_Scheduler$remove_start,
    add_pause: jsWorkFlow_Scheduler$add_pause,
    remove_pause: jsWorkFlow_Scheduler$remove_pause,
    add_resume: jsWorkFlow_Scheduler$add_resume,
    remove_resume: jsWorkFlow_Scheduler$remove_resume,
    add_stop: jsWorkFlow_Scheduler$add_stop,
    remove_stop: jsWorkFlow_Scheduler$remove_stop
};


jsWorkFlow.Scheduler.registerClass('jsWorkFlow.Scheduler');


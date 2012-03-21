
/*
 * jWorkFlow's core source code.
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
Type.registerNamespace('jWorkFlow');

//////////////////////////////////////////////////////////////////////////////////////////
//Events，提供jWorkFlow中事件的管理
//
//TO 开发者：
//    事件机制是jWorkFlow的基础，因此将事件的触发、执行和管理集中到Events类中。
//
jWorkFlow.Events = function jWorkFlow_Events(owner) {
    this._owner = owner;
    this._events = new Sys.EventHandlerList();
};

function jWorkFlow_Events$dispose() {
    this._owner = null;
    this._events = null;
}

function jWorkFlow_Events$get_events() {
    return this._events;
}

function jWorkFlow_Events$addHandler(eventName, handler) {
    this._events.addHandler(eventName, handler);
}

function jWorkFlow_Events$removeHandler(eventName, handler) {
    this._events.removeHandler(eventName, handler);
}

//触发事件
function jWorkFlow_Events$raiseEvent(eventName, eventArgs) {
    var handler = this._events.getHandler(eventName);

    if (handler) {
        handler(this._owner, eventArgs);
    }
}

jWorkFlow.Events.prototype = {
    _owner: null,
    _events: null,
    dispose: jWorkFlow_Events$dispose,
    //property
    get_events: jWorkFlow_Events$get_events,
    //method
    addHandler: jWorkFlow_Events$addHandler,
    removeHandler: jWorkFlow_Events$removeHandler,
    raiseEvent: jWorkFlow_Events$raiseEvent
};

jWorkFlow.Events.registerClass('jWorkFlow.Events');


//////////////////////////////////////////////////////////////////////////////////////////
//Application，表示一个jWorkFlow的应用运行环境
//
//TO 开发者：
//    Applcation代表一个独立的运行环境，在概念上对应一个传统的进程，可以在这个观察点上关注APP的状态的变化，
//并获取对应的APP事件通知。
//    每个Application都包含一个Scheduler，用于调度job的运行，而activity本身会作为job的内容被调度到Scheduler中
//执行。
//    dataContext是传递给APP的启动参数，字典形式。必须是plane data object。APP会克隆后加入到applicationContext之中。
//
jWorkFlow.Application = function jWorkFlow_Application(instance, dataContext) {
    //事件属于装配件，需一直存在
    this._events = new jWorkFlow.Events(this);

    //调度器属于APP的固定组成部分，activity只是使用者之一，一直可用
    this._scheduler = new jWorkFlow.Scheduler();
};

function jWorkFlow_Application$get_scheduler() {
    return this._scheduler;
}

function jWorkFlow_Application$get_globalContext() {
    var ins = jWorkFlow.GlobalContext.getInstance();
    return ins;
}

function jWorkFlow_Application$get_appContext() {
    return this._appContext;
}

function jWorkFlow_Application$get_instance() {
    return this._instance;
}

function jWorkFlow_Application$get_currentContext() {
    //return stack top
    var contextStack = this._contextStack;
    var context = contextStack[contextStack.length - 1];

    return context;
}

function jWorkFlow_Application$run() {
    //应用的上下文，运行期间可用
    this._appContext = new jWorkFlow.ApplicationContext();
    //将dataContext放置到appContext之中
    this._appContext.copyFrom(dataContext);
    //activityContext栈，运行期间可用
    this._contextStack = [];

    //通过instance的execute开始执行
    this._instance.execute(this);
}

function jWorkFlow_Application$dispose() {
    this._events.dispose();
    this._scheduler.dispose();
    this._appContext.dispose();

    this._events = null;
    this._scheduler = null;
    this._appContext = null;
    this._contextStack = null;
}


//ActivityContext栈维护
function jWorkFlow_Application$pushContextStack(activityContext) {
    //将activityContext入栈
    this._contextStack.push(activityContext);
}

function jWorkFlow_Application$popContextStack() {
    //将栈顶的activityContext出栈，并返回
    var activityContext = this._contextStack.pop();
    return activityContext;
}

function jWorkFlow_Application$getValueItem(key) {
    //根据key值在activityContext栈中查找value，并返回
    //注意：除顶层外，其他层受可见性控制

    var dataItem = null;

    //try contextStack
    var contextStack = this._contextStack;

    for (var i = contextStack.length - 1; i >= 0; i--) {
        var context = contextStack[i];

        dataItem = context.getDataItem(key);

        //顶层不受可见性的控制
        if (dataItem && i == contextStack.length - 1) {
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
function jWorkFlow_Application$getValue(key) {
    var dataItem = this.getValueItem(key);

    if (dataItem) {
        return dataItem.value;
    }

    return null;
}

function jWorkFlow_Application$setValue(key, value) {
    var dataItem = this.getValueItem(key);

    if (dataItem) {
        dataItem.value = value;
        return;
    }

    //找不到，在当前层上创建key、value
    var context = this.get_currentContext();
    context.setData(key, value);
}


jWorkFlow.Application.prototype = {
    _instance: null,
    _dataContext: null,
    _appContext: null,
    _contextStack: null,
    _events: null,
    _scheduler: null,
    //property
    get_scheduler: jWorkFlow_Application$get_scheduler,
    get_globalContext: jWorkFlow_Application$get_globalContext,
    get_appContext: jWorkFlow_Application$get_appContext,
    get_instance: jWorkFlow_Application$get_instance, 
    get_currentContext: jWorkFlow_Application$get_currentContext,
    //method
    run: jWorkFlow_Application$run,
    dispose: jWorkFlow_Application$dispose,
    //ActivityContext栈维护
    pushContextStack: jWorkFlow_Application$pushContextStack,
    popContextStack: jWorkFlow_Application$popContextStack,
    //APP级别的数据维护接口
    getValueItem: jWorkFlow_Application$getValueItem,
    getValue: jWorkFlow_Application$getValue,
    setValue: jWorkFlow_Application$setValue
};

jWorkFlow.Application.registerClass('jWorkFlow.Application');

//////////////////////////////////////////////////////////////////////////////////////////
//Instance，表示一个jWorkFlow的activity组合的运行载体，主要包含rootActivity
//
//TO 开发者：
//    用来表示activity组装的最终结果，于activity本身并无太大的差别。
//    Instance主要的任务是面向装配的，即如何从文档中解析和加载一个描述的Activity。
//    Instance的执行是初始化ActivityContext的栈的数据结构，并将rootActivity调度执行。
//
jWorkFlow.Instance = function jWorkFlow_Instance() {
    this._events = new jWorkFlow.Events(this);
};

function jWorkFlow_Instance$dispose() {
    if (this._rootActivity) {
        this._rootActivity.dispose();
        this._rootActivity = null;
    }

     this._events.dispose();

      this._events = null;
}

//rootActivity属性
function jWorkFlow_Instance$get_rootActivity() {
    return this._rootActivity;
}

function jWorkFlow_Instance$set_rootActivity(value) {
    this._rootActivity = value;
}

//加载一个activity描述，并解析，并放置到rootActivity之中
function jWorkFlow_Instance$loadFromXML(xml) {
}

//清除rootActivity，并清除相关的加载的数据
function jWorkFlow_Instance$unload() {
}

//开始在APP中运行
function jWorkFlow_Instance$execute(application) {

    //TODO:
    //检查application参数和rootActivity
    
    //Create ActivityExecutor，执行rootActivity
    var activityExecutor = new jWorkFlow.ActivityExecutor(application, this._rootActivity);

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
function jWorkFlow_Instance$doInit() {
    //TODO:
    //init instance
}

//执行complete相关操作
function jWorkFlow_Instance$doComplete() {
    //TODO:
    //clear instance
}

function jWorkFlow_Instance$initEventHandler(eventArgs) {
    //先执行自身init相关逻辑
    this.doInit();

    //触发注册的init事件
    this._events.raiseEvent('init', eventArgs);
}

function jWorkFlow_Instance$add_init(handler) {
    this._events.addHandler('init', handler);
}

function jWorkFlow_Instance$remove_init(handler) {
    this._events.removeHandler('init', handler);
}

function jWorkFlow_Instance$completeEventHandler(eventArgs) {
    //触发注册的complete事件
    this._events.raiseEvent('complete', eventArgs);

    //执行自身complete相关逻辑
    this.doComplete();
}

function jWorkFlow_Instance$add_complete(handler) {
    this._events.addHandler('complete', handler);
}

function jWorkFlow_Instance$remove_complete(handler) {
    this._events.removeHandler('complete', handler);
}


jWorkFlow.Instance.prototype = {
    _rootActivity: null,
    _events: null,
    _initEventHandler: null,
    _completeEventHandler:null,
    dispose: jWorkFlow_Instance$dispose,
    //property
    get_rootActivity: jWorkFlow_Instance$get_rootActivity,
    set_rootActivity: jWorkFlow_Instance$set_rootActivity,
    //method
    loadFromXML: jWorkFlow_Instance$loadFromXML,
    unload: jWorkFlow_Instance$unload,
    execute: jWorkFlow_Instance$execute,
    //执行init相关操作
    doInit: jWorkFlow_Instance$doInit,
    //执行complete相关操作
    doComplete: jWorkFlow_Instance$doComplete,
    //events
    //init事件，做activity执行前的准备工作
    initEventHandler: jWorkFlow_Instance$initEventHandler,
    add_init: jWorkFlow_Instance$add_init,
    remove_init: jWorkFlow_Instance$remove_init,
    //complete事件，做activity执行结束后的清理工作
    completeEventHandler: jWorkFlow_Instance$completeEventHandler,
    add_complete: jWorkFlow_Instance$add_complete,
    remove_complete: jWorkFlow_Instance$remove_complete

};

jWorkFlow.Instance.registerClass('jWorkFlow.Instance');


//////////////////////////////////////////////////////////////////////////////////////////
//ActivityState，表示一个jWorkFlow活动的运行状态

jWorkFlow.ActivityState = function jWorkFlow_ActivityState() {
    throw new Error.notImplemented();
};

//系统默认的activity的状态
jWorkFlow.ActivityState.prototype = {
    none: 0,
    start: 1,
    stop: 2
};

//global 数值
//系统保留的activity状态值
jWorkFlow.ActivityState.min_value = 100;

jWorkFlow.ActivityState.registerEnum('jWorkFlow.ActivityState');

//////////////////////////////////////////////////////////////////////////////////////////
//ActivityEventArgs，提供jWorkFlow的Activity的事件响应参数
jWorkFlow.ActivityEventArgs = function jWorkFlow_ActivityEventArgs(context) {
    this._context = context;
};

function jWorkFlow_ActivityEventArgs$dispose() {
    this._context = null;
}

function jWorkFlow_ActivityEventArgs$get_context() {
    return this._context;
}

jWorkFlow.ActivityEventArgs.prototype = {
    _context: null,
    dispose: jWorkFlow_ActivityEventArgs$dispose,
    //property
    get_context: jWorkFlow_ActivityEventArgs$get_context
};

jWorkFlow.ActivityEventArgs.registerClass('jWorkFlow.ActivityEventArgs', Sys.EventArgs);


//////////////////////////////////////////////////////////////////////////////////////////
//ActivityUtilities，提供activity帮助方法
//每个activity都是一个状态机，通过变更状态来驱动事件，通过事件来驱动状态变更。
jWorkFlow.ActivityUtilities = function jWorkFlow_ActivityUtilities() {
    throw Error.notImplemented();
};

jWorkFlow.ActivityUtilities.prototype = {
};

//静态的方法
jWorkFlow.ActivityUtilities.startActivity = function jWorkFlow_ActivityUtilities$startActivity(context) {
    //使activity进入start状态
    context.set_activityState(jWorkFlow.ActivityState.start);
}

jWorkFlow.ActivityUtilities.endActivity = function jWorkFlow_ActivityUtilities$endActivity(context) {
    //使activity进入start状态
    context.set_activityState(jWorkFlow.ActivityState.end);
}

jWorkFlow.ActivityUtilities.registerClass('jWorkFlow.ActivityUtilities');

//////////////////////////////////////////////////////////////////////////////////////////
//Activity，表示一个jWorkFlow活动
//每个activity都是一个状态机，通过变更状态来驱动事件，通过事件来驱动状态变更。
//
//to 开发者：
//    activity的是一个装配装置，和我们书写一个函数类似，装配是描述一个activity提供的功能。
//activity中的事件也是为这个目标服务，对activity的事件的设置可以看成是一个装配的过程，装配
//好的activity可以组装到多个activity中使用。
//    activity的运行期的数据，存储在activity context之中。
//
jWorkFlow.Activity = function jWorkFlow_Activity() {
    this._events = new jWorkFlow.Events(this);
};

function jWorkFlow_Activity$dispose() {
    this._events.dispose();
    this._events = null;
}

function jWorkFlow_Activity$get_name() {
    return this._name;
}

function jWorkFlow_Activity$set_name(value) {
    this._name = value;
}

//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jWorkFlow_Activity$execute(context) {
    //context必须是jWorkFlow.ActivityContext类型
    var e = Function._validateParams(arguments, [
        { name: "context", type: jWorkFlow.ActivityContext }
    ]);

    //使activity进入start状态
    jWorkFlow.ActivityUtilities.startActivity(context);

    //由于通过事件来驱动，所以要在什么地方来设置activity的结束状态
    //通过jWorkFlow.ActivityUtilities.endActivity(context);
}

//通知状态变更，触发自己关心的事件变更
function jWorkFlow_Activity$notifyStateChanged(context, oldState, curState) {
    var eventArgs = new jWorkFlow.ActivityEventArgs(context);

    if (curState == jWorkFlow.ActivityState.start) {
        //状态迁移到start，触发start事件
        this._events.raiseEvent('start', eventArgs);
    }
    else if (curState == jWorkFlow.ActivityState.end) {
        this._events.raiseEvent('end', eventArgs);
    }

    //ignore other state value
}

//events
function jWorkFlow_Activity$add_start(handler) {
    this._events.addHandler('start', handler);
}

function jWorkFlow_Activity$remove_start(handler) {
    this._events.removeHandler('start', handler);
}

function jWorkFlow_Activity$add_stop(handler) {
    this._events.addHandler('stop', handler);
}

function jWorkFlow_Activity$remove_stop(handler) {
    this._events.removeHandler('stop', handler);
}

jWorkFlow.Activity.prototype = {
    _name: null,
    _events: null,
    dispose: jWorkFlow_Activity$dispose,
    //property
    //name，只是一个标识
    get_name: jWorkFlow_Activity$get_name,
    set_name: jWorkFlow_Activity$set_name,
    //method
    execute: jWorkFlow_Activity$execute,
    notifyStateChanged: jWorkFlow_Activity$notifyStateChanged,
    //event handler
    //基类关注的activity的状态只有start和stop，其它状态由派生类来扩展
    //start 事件
    add_start: jWorkFlow_Activity$add_start,
    remove_start: jWorkFlow_Activity$remove_start,
    //stop 事件
    add_stop: jWorkFlow_Activity$add_stop,
    remove_stop: jWorkFlow_Activity$remove_stop
};

jWorkFlow.Activity.registerClass('jWorkFlow.Activity');

//////////////////////////////////////////////////////////////////////////////////////////
//ContextBase，context的基础类，提供一致的数据管理方法
//
//to 开发者：
//    默认数据私有。
//    可以根据defaultVisibilityIsPublic的true、false改变缺省的可见性
//    提供基础getDataItem、getData、setData和copyFrom方法
//
jWorkFlow.ContextBase = function jWorkFlow_ContextBase(defaultVisibilityIsPublic) {
    this._defaultVisibilityIsPublic = !!defaultVisibilityIsPublic;
};

function jWorkFlow_ContextBase$dispose() {
    this._data = null;
}

//获取&设置context中的数据
function jWorkFlow_ContextBase$getDataItem(key) {
    var item = null;

    if (this._data.hasOwnProperty(key)) {
        item = this._data[key];
    }

    return item;
}

function jWorkFlow_ContextBase$getData(key) {

    var retval = null;
    var item = this.getDataItem(key);

    if (item) {
        retval = item.value;
    }

    return retval;
}

//visibilitySwitch是可见性的切换开关，如果为false，表示不切换，如果为true，表示切换到和默认不同的可见性
function jWorkFlow_ContextBase$setData(key, value, visibilitySwitch) {
    var isPublic = (!!visibilitySwitch) ? !this._defaultVisibilityIsPublic : this._defaultVisibilityIsPublic;

    var item = { key: key,
        value: data,
        isPublic: isPublic
    };

    this._data[key] = item;
}

//从源字典中复制数据
function jWorkFlow_ContextBase$copyFrom(srcDict, deepClone) {
    //depend on JQuery
    jQuery.extend.extend(!!deepClone, this._data, srcDict); 
}


jWorkFlow.ContextBase.prototype = {
    _defaultVisibilityIsPublic: false,
    _data: null,
    dispose: jWorkFlow_ContextBase$dispose,
    //method
    //获取&设置context中的数据
    getDataItem: jWorkFlow_ContextBase$getDataItem,
    getData: jWorkFlow_ContextBase$getData,
    setData: jWorkFlow_ContextBase$setData,
    copyFrom: jWorkFlow_ContextBase$copyFrom
    //property
};

jWorkFlow.ContextBase.registerClass('jWorkFlow.ContextBase');


//////////////////////////////////////////////////////////////////////////////////////////
//GlobalContext，表示一个jWorkFlow活动全局的运行上下文的运行环境，数据的生命周期可以跨instance
//
//to 开发者：
//    GlobalContext提供全局共享的数据，和javascript引擎是相同的生命周期，为所有application共享的数据。
//    默认可见性为public。
jWorkFlow.GlobalContext = function jWorkFlow_GlobalContext() {
    jWorkFlow.GlobalContext.initializeBase(this, [true]);
};

function jWorkFlow_GlobalContext$dispose() {
    jWorkFlow.GlobalContext.callBaseMethod(this, 'dispose');
}

jWorkFlow.GlobalContext.prototype = {
    dispose: jWorkFlow_GlobalContext$dispose
    //property
};

jWorkFlow.GlobalContext._instance = new jWorkFlow.GlobalContext();

jWorkFlow.GlobalContext.getInstance = function jWorkFlow_GlobalContext$getInstance() {
    return jWorkFlow.GlobalContext._instance;
};

jWorkFlow.GlobalContext.registerClass('jWorkFlow.GlobalContext', jWorkFlow.ContextBase);

//////////////////////////////////////////////////////////////////////////////////////////
//ApplicationContext，应用级别的上下文，数据的生命周期可以跨Activity
//
//to 开发者：
//    ApplicationContext表示应用程序的运行上下文环境，用于管理应用级别共享的数据，于ActivityContext不同，
//ApplicationContext中的数据默认是对包含的activity开放的。
//
jWorkFlow.ApplicationContext = function jWorkFlow_ApplicationContext() {
    jWorkFlow.ApplicationContext.initializeBase(this, [true]);
};

function jWorkFlow_ApplicationContext$dispose() {
    jWorkFlow.ApplicationContext.callBaseMethod(this, 'dispose');
}

jWorkFlow.ApplicationContext.prototype = {
    dispose: jWorkFlow_ApplicationContext$dispose
    //property
    //method
};

jWorkFlow.ApplicationContext.registerClass('jWorkFlow.ApplicationContext', jWorkFlow.ContextBase);


//////////////////////////////////////////////////////////////////////////////////////////
//ActivityContext，表示一个jWorkFlow活动的运行上下文,数据依附于所在的活动
//
//to 开发者：
//    ActivityContext是Activity运行数据的载体，会存储Activity的数据和运行状态，以及获取Activity运行开始、结束的通知。
//ActivityContext中的数据通过字典来管理，使用简单的key-value对，在数据的可见性上，默认是私有（不能跨层级访问），也可
//以设置为public（自己包含的那些activity能访问这些数据）。
//    在应用程序的级别通过ActivityContext栈管理ActivityContext。
//
jWorkFlow.ActivityContext = function jWorkFlow_ActivityContext(application, activity, executor) {
    jWorkFlow.ActivityContext.initializeBase(this);

    this._application = application;
    this._executor = executor;
    this._activity = activity;
    this._activityState = jWorkFlow.ActivityState.none;
    this._args = {};
    this._result = null;

};

function jWorkFlow_ActivityContext$dispose() {
    this._application = null;
    this._executor = null;
    this._activity = null;
    this._args = null;
    this._result = null;

    jWorkFlow.ActivityContext.callBaseMethod(this, 'dispose');
}

//获取传递给activity的参数
function jWorkFlow_ActivityContext$getParam(name) {
    return this._args[name];
}

//和activityContext关联的application
function jWorkFlow_ActivityContext$get_application() {
    return this._application;
}

//和activityContext关联的activity
function jWorkFlow_ActivityContext$get_activity() {
    return this._activity;
}

//获取&设置activity的状态
function jWorkFlow_ActivityContext$get_activityState() {
    return this._activityState;
}

function jWorkFlow_ActivityContext$set_activityState(value) {
    var oldState = this._activityState;

    //状态相同不触发状态变更
    if (oldState == value) {
        return;
    }

    this._activityState = value;

    //通知activity状态变更，activity得到基类会处理jWorkFlow.ActivityState.start和jWorkFlow.ActivityState.end
    this._activity.notifyStateChanged(this, oldState, value);

    //如果activity的当前状态为jWorkFlow.ActivityState.end，表示活动以及结束，触发activityExecutor的complete事件
    if (value == jWorkFlow.ActivityState.end) {
        var eventArgs = new jWorkFlow.ActivityEventArgs(this);
        this._executor.raiseCompleteEvent(eventArgs);
    }
}

//获取&设置activity的返回值
function jWorkFlow_ActivityContext$get_result() {
    return this._result;
}

function jWorkFlow_ActivityContext$set_result(value) {
    this._result = value;
}


jWorkFlow.ActivityContext.prototype = {
    _application: null,
    _activity: null,
    _executor: null,
    _activityState: jWorkFlow.ActivityState.none,
    _args: null,
    _result: null,
    dispose: jWorkFlow_ActivityContext$dispose,
    //method
    //获取传递给activity的参数
    getParam: jWorkFlow_ActivityContext$getParam,

    //property
    //和activityContext关联的application
    get_application: jWorkFlow_ActivityContext$get_application,
    //和activityContext关联的activity
    get_activity: jWorkFlow_ActivityContext$get_activity,
    //获取&设置activity的状态
    get_activityState: jWorkFlow_ActivityContext$get_activityState,
    set_activityState: jWorkFlow_ActivityContext$set_activityState,
    //获取&设置activity的返回值
    get_result: jWorkFlow_ActivityContext$get_result,
    set_result: jWorkFlow_ActivityContext$set_result


};

jWorkFlow.ActivityContext.registerClass('jWorkFlow.ActivityContext', jWorkFlow.ContextBase);

//////////////////////////////////////////////////////////////////////////////////////////
//ActivityExecutor，表示一个jWorkFlow的Activity的执行器，提供activity的执行上下文
//
// TO 开发者：
//    ActivityExecutor表示activity的运行的上下文，包含运行activity所需的所有运行期的
//支撑组件，包括application，当前的activity，以及对activity运行状态的初始化和complete事件。
//ActivityExecutor是对activity运行期的支持类，activity组件的作者使用。
//
jWorkFlow.ActivityExecutor = function jWorkFlow_ActivityExecutor(application, activity) {
    this._application = application;
    this._activity = activity;
    this._activityContext = null;
    this._events = new jWorkFlow.Events(this);
};

function jWorkFlow_ActivityExecutor$dispose() {
    this._activityContext.dispose();
    this._events.dispose();

    this._application = null;
    this._activity = null;
    this._activityContext = null;
    this._events = null;
}

//内部使用，job的callback的handler
function jWorkFlow_ActivityExecutor$doJobCallback(jobItem) {
    var eventArgs = new jWorkFlow.ActivityEventArgs(this._activityContext);

    //执行前先触发executor的init事件，用于准备activity的执行环境
    this.raiseInitEvent(eventArgs);
    
    //执行activity
    this._activity.execute(this._activityContext);

    //进入事件通知的状态。

    //job的执行结束
}

//executor的执行入口点
function jWorkFlow_ActivityExecutor$execute() {
    //创建activity的context
    this._activityContext = new jWorkFlow.ActivityContext(application, activity, this);

    //将activity的执行做成一个job，放到scheduler中执行。
    var callback = Function.createDelegate(this, this.doJobCallback);

    var scheduler = this._application.get_scheduler();

    //创建job对象
    var job = new jWorkFlow.Job(callback, null);

    //将job放到scheduler中执行
    scheduler.scheduleJob(job);
}

//执行init相关操作
function jWorkFlow_ActivityExecutor$doInit() {
    //TODO:
    //push activity context
}

//执行complete相关操作
function jWorkFlow_ActivityExecutor$doComplete() {
    //TODO:
    //pop activity context
}

function jWorkFlow_ActivityExecutor$raiseInitEvent(eventArgs) {
    //先执行自身init相关逻辑
    this.doInit();

    //触发注册的init事件
    this._events.raiseEvent('init', eventArgs);
}

function jWorkFlow_ActivityExecutor$add_init(handler) {
    this._events.addHandler('init', handler);
}

function jWorkFlow_ActivityExecutor$remove_init(handler) {
    this._events.removeHandler('init', handler);
}

function jWorkFlow_ActivityExecutor$raiseCompleteEvent(eventArgs) {
    //触发注册的complete事件
    this._events.raiseEvent('complete', eventArgs);

    //执行自身complete相关逻辑
    this.doComplete();
}

function jWorkFlow_ActivityExecutor$add_complete(handler) {
    this._events.addHandler('complete', handler);
}

function jWorkFlow_ActivityExecutor$remove_complete(handler) {
    this._events.removeHandler('complete', handler);
}


jWorkFlow.ActivityExecutor.prototype = {
    _application: null,
    _activity: null,
    _activityContext: null,
    _events: null,
    //应该包含activity，提供activity的执行的上下文环境
    dispose: jWorkFlow_ActivityExecutor$dispose,

    //property
    //method
    //内部使用，job的callback的handler
    doJobCallback: jWorkFlow_ActivityExecutor$doJobCallback,
    //executor的执行入口点
    execute: jWorkFlow_ActivityExecutor$execute,
    //执行init相关操作
    doInit: jWorkFlow_ActivityExecutor$doInit,
    //执行complete相关操作
    doComplete: jWorkFlow_ActivityExecutor$doComplete,
    //events
    //init事件，做activity执行前的准备工作
    raiseInitEvent: jWorkFlow_ActivityExecutor$raiseInitEvent,
    add_init: jWorkFlow_ActivityExecutor$add_init,
    remove_init: jWorkFlow_ActivityExecutor$remove_init,
    //complete事件，做activity执行结束后的清理工作
    raiseCompleteEvent: jWorkFlow_ActivityExecutor$raiseCompleteEvent,
    add_complete: jWorkFlow_ActivityExecutor$add_complete,
    remove_complete: jWorkFlow_ActivityExecutor$remove_complete
};

jWorkFlow.ActivityExecutor.registerClass('jWorkFlow.ActivityExecutor');

//////////////////////////////////////////////////////////////////////////////////////////
//Job，提供jWorkFlow的Scheduler的执行项目
//
//to 开发者：
//    Job代表一个需要运行调度的作业，描述执行体包含的内容。
//    其构造参数包含callback和context，表示需要执行的方法和传递给方法的参数。
jWorkFlow.Job = function jWorkFlow_Job(callback, context) {

    this._callback = callback;
    this._context = context;
};

function jWorkFlow_Job$dispose() {
}

function jWorkFlow_Job$get_context() {
    return this._context;
}

function jWorkFlow_Job$get_result() {
    return this._result;
}

function jWorkFlow_Job$set_result(value) {
    this._result = value;
}

function jWorkFlow_Job$execute() {
    //执行工作项目
    if (this._callback) {
        this._callback(this);
    }
}

jWorkFlow.Job.prototype = {
    //work item中应该包含ActivityExecutor，Job通过它来执行activity
    _callback: null,
    _context: null,
    _result: null,
    dispose: jWorkFlow_Job$dispose,
    get_context: jWorkFlow_Job$get_context,
    get_result: jWorkFlow_Job$get_result,
    set_result: jWorkFlow_Job$set_result,
    execute: jWorkFlow_Job$execute
    //property
};

jWorkFlow.Job.registerClass('jWorkFlow.Job');

//////////////////////////////////////////////////////////////////////////////////////////
//Scheduler，提供jWorkFlow的Instance的调度器
//
//to 开发者：
//    Scheduler是workflow的任务的执行引擎，驱动job的执行。
//    Scheduler在application中启动和初始化，可以通过事件关注其状态的变化，可以在外部控制其启动、停止、暂停等。
jWorkFlow.Scheduler = function jWorkFlow_Scheduler() {
    this._events = new jWorkFlow.Events(this);
};

//const
//调度每100 ms执行一次
jWorkFlow.Scheduler.interval_timer = 100;


function jWorkFlow_Scheduler$get_isRunning() {
    return this._isRunning;
}

function jWorkFlow_Scheduler$get_isStopPending() {
    return this._isStopPending;
}

function jWorkFlow_Scheduler$get_isPausing() {
    return this._isPausing;
}

function jWorkFlow_Scheduler$dispose() {

    if (this._isRunning) {
        this.stop(true);
    }

    this._events.dispose();
    this._events = null;
}

//将job放到运行队列
function jWorkFlow_Scheduler$scheduleJob(job) {
    //Job必须是jWorkFlow.Job类型
    var e = Function._validateParams(arguments, [
        { name: "job", type: jWorkFlow.Job }
    ]);

    //运行状态（含pausing）下可以将job加入到执行队列
    if (!this._isRunning || this._isStopPending) {
        throw Error.invalidOperation("Scheduler not running!");
    }

    Array.add(this._jobQueue, job);
}

//run job的时间片的执行函数
function jWorkFlow_Scheduler$doExecJobInterval() {
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

        if ((curTime - startTime) > jWorkFlow.Scheduler.interval_timer) {
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
function jWorkFlow_Scheduler$start(isPausing) {
    if (this._isRunning) {
        throw Error.invalidOperation("Scheduler is already running!");
    }

    //start schedule engine
    var handler = Function.createDelegate(this, this.doExecJobInterval);
    this._intervalID = setInterval(handler, jWorkFlow.Scheduler.interval_timer);

    this._isRunning = true;
    this._isStopPending = false;
    this._isPausing = !!isPausing;
    this._jobQueue = [];

    this._events.raiseEvent('start', Sys.EventArgs.Empty);

}

function jWorkFlow_Scheduler$pause() {

    //如果没运行，或正在停止，不允许设置为暂停
    if (!this._isRunning || this._isStopPending) {
        throw Error.invalidOperation("Scheduler is not running!");
        return;
    }

    this._isPausing = true;

    this._events.raiseEvent('pause', Sys.EventArgs.Empty);
}

function jWorkFlow_Scheduler$resume() {

    if (!this._isRunning || this._isStopPending) {
        throw Error.invalidOperation("Scheduler is not running!");
    }

    this._isPausing = false;
    this._events.raiseEvent('resume', Sys.EventArgs.Empty);
}

//forceStopNow参数如果为true，表示是强制停止，不管是否有正在运行的任务。
function jWorkFlow_Scheduler$stop(forceStopNow) {
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

    //forceStopNow
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

//events
function jWorkFlow_Scheduler$add_start(handler) {
    this._events.addHandler('start', handler);
}

function jWorkFlow_Scheduler$remove_start(handler) {
    this._events.removeHandler('start', handler);
}

function jWorkFlow_Scheduler$add_pause(handler) {
    this._events.addHandler('pause', handler);
}

function jWorkFlow_Scheduler$remove_pause(handler) {
    this._events.removeHandler('pause', handler);
}

function jWorkFlow_Scheduler$add_resume(handler) {
    this._events.addHandler('resume', handler);
}

function jWorkFlow_Scheduler$remove_resume(handler) {
    this._events.removeHandler('resume', handler);
}

function jWorkFlow_Scheduler$add_stop(handler) {
    this._events.addHandler('stop', handler);
}

function jWorkFlow_Scheduler$remove_stop(handler) {
    this._events.removeHandler('stop', handler);
}

jWorkFlow.Scheduler.prototype = {
    _events: null,
    _isRunning: false,
    _isStopPending: false,
    _isPausing: false,
    _jobQueue: null,
    _intervalID: -1,
    //property
    get_isRunning: jWorkFlow_Scheduler$get_isRunning,
    get_isStopPending: jWorkFlow_Scheduler$get_isStopPending,
    get_isPausing: jWorkFlow_Scheduler$get_isPausing,
    //method
    dispose: jWorkFlow_Scheduler$dispose,
    scheduleJob: jWorkFlow_Scheduler$scheduleJob,
    //内部执行
    doExecJobInterval: jWorkFlow_Scheduler$doExecJobInterval,
    //运行状态控制
    start: jWorkFlow_Scheduler$start,
    pause: jWorkFlow_Scheduler$pause,
    resume: jWorkFlow_Scheduler$resume,
    stop: jWorkFlow_Scheduler$stop,
    //event
    add_start: jWorkFlow_Scheduler$add_start,
    remove_start: jWorkFlow_Scheduler$remove_start,
    add_pause: jWorkFlow_Scheduler$add_pause,
    remove_pause: jWorkFlow_Scheduler$remove_pause,
    add_resume: jWorkFlow_Scheduler$add_resume,
    remove_resume: jWorkFlow_Scheduler$remove_resume,
    add_stop: jWorkFlow_Scheduler$add_stop,
    remove_stop: jWorkFlow_Scheduler$remove_stop
};


jWorkFlow.Scheduler.registerClass('jWorkFlow.Scheduler');


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
//SwitchActivity
//
//TO 开发者：
//    SwitchActivity用于处理多路分派的情况。可以处理Condition，并和特定的Activity的值来比较，
//并执行匹配的分支。
//    elseActivity对应没有匹配的Case的情况，这种情况下执行elseActivity。
//
jsWorkFlow.Activities.SwitchActivity = function jsWorkFlow_Activities_SwitchActivity(conditionActivity, elseActivity, allCase) {
    jsWorkFlow.Activities.SwitchActivity.initializeBase(this);

    this._conditionActivity = conditionActivity ? conditionActivity : null;
    this._elseActivity = elseActivity ? elseActivity : null;
    this._allCase = allCase ? allCase : [];

    this._doEvalConditionCompleteHandler = Function.createDeledate(this, this.doEvalConditionCompleteHandler);
    this._doEvalCaseConditionCompleteHandler = Function.createDeledate(this, this.doEvalCaseConditionCompleteHandler);
    this._doExecuteCaseBodyCompleteHandler = Function.createDeledate(this, this.doExecuteCaseBodyCompleteHandler);
    this._doExecuteElseCaseCompleteHandler = Function.createDeledate(this, this.doExecuteElseCaseCompleteHandler);

};

function jsWorkFlow_Activities_SwitchActivity$dispose() {
    this._conditionActivity = null;
    this._elseActivity = null;
    this._allCase = [];

    jsWorkFlow.Activities.SwitchActivity.callBaseMethod(this, 'dispose');
}


function jsWorkFlow_Activities_SwitchActivity$get_conditionActivity() {
    return this._conditionActivity;
}

function jsWorkFlow_Activities_SwitchActivity$set_conditionActivity(value) {
    this._conditionActivity = value;
}

function jsWorkFlow_Activities_SwitchActivity$get_elseActivity() {
    return this._elseActivity;
}

function jsWorkFlow_Activities_SwitchActivity$set_elseActivity(value) {
    this._elseActivity = value;
}

function jsWorkFlow_Activities_SwitchActivity$get_allCase() {
    return this._allCase;
}

function jsWorkFlow_Activities_SwitchActivity$set_allCase(value) {
    this._allCase = value;
}


//activity的恢复
function jsWorkFlow_Activities_SwitchActivity$loadSerializeContext(serializeContext) {
    //检查类型 ===> 这是规范
    if (serializeContext['_@_activityType'] !== this.getType().getName()) {
        throw Error.invalidOperation("loadSerializeContext missmatch type!");
    }


    //恢复base
    var baseSerializeContext = serializeContext['_@_base'];

    jsWorkFlow.Activities.SwitchActivity.callBaseMethod(this, 'loadSerializeContext', [baseSerializeContext]);

    //恢复自身
    var conditionActivitySC = serializeContext["conditionActivity"];
    var conditionActivity = $jwf.loadActivity(conditionActivitySC);
    this.set_conditionActivity(conditionActivity);

    var elseActivitySC = serializeContext["elseActivity"];
    var elseActivity = $jwf.loadActivity(elseActivitySC);
    this.set_elseActivity(elseActivity);

    var allCase = [];
    var allCaseSC = serializeContext['allCase'];
    if (allCaseSC && (allCaseSC.length > 0)) {
        for (var i = 0, ilen = allCaseSC.length; i < ilen; i++) {
            var caseItemSC = allCaseSC[i];
            var caseItem = {};

            caseItem["key"] = $jwf.loadActivity(caseItemSC["key"]);
            caseItem["value"] = $jwf.loadActivity(caseItemSC["value"]);

            Array.add(allCase, caseItem);
        }
    }

    this.set_allCase(allCase);
}

//activity的序列化
function jsWorkFlow_Activities_SwitchActivity$saveSerializeContext(serializeContext) {

    //保存类型 ===> 这是规范
    serializeContext['_@_activityType'] = this.getType().getName();

    //保存自身
    var conditionActivity = this.get_conditionActivity();
    serializeContext["conditionActivity"] = $jwf.saveActivity(conditionActivity);

    var elseActivity = this.get_elseActivity();
    serializeContext["elseActivity"] = $jwf.saveActivity(elseActivity);

    var allCase = this.get_allCase();
    var allCaseSC = [];
    if (allCase && (allCase.length > 0)) {
        for (var i = 0, ilen = allCase.length; i < ilen; i++) {
            var caseItem = allCase[i];
            var caseItemSC = {};

            caseItemSC["key"] = $jwf.saveActivity(caseItem["key"]);
            caseItemSC["value"] = $jwf.saveActivity(caseItem["value"]);

            Array.add(allCaseSC, caseItemSC);
        }
    }

    serializeContext['allCase'] = allCaseSC;

    //保存base
    var baseSerializeContext = {};

    jsWorkFlow.Activities.SwitchActivity.callBaseMethod(this, 'saveSerializeContext', [baseSerializeContext]);

    serializeContext['_@_base'] = baseSerializeContext;
}

function jsWorkFlow_Activities_SwitchActivity$addCase(caseConditionActivity, caseBodyActivity) {
    var caseItem = {};
    caseItem["key"] = caseConditionActivity;
    caseItem["value"] = caseBodyActivity;

    this.addCaseItem(caseItem);
}

function jsWorkFlow_Activities_SwitchActivity$addCaseItem(caseItem) {
    var allCase = this.get_allCase();
    Array.add(allCase, caseItem);
}

function jsWorkFlow_Activities_SwitchActivity$getCaseCount() {
    var allCase = this.get_allCase();
    return allCase.length;
}

function jsWorkFlow_Activities_SwitchActivity$getCaseItemByIndex(index) {
    var allCase = this.get_allCase();
    var caseItem = allCase[index];

    return caseItem;
}

function jsWorkFlow_Activities_SwitchActivity$removeCaseItemByIndex(index) {
    var allCase = this.get_allCase();
    var caseItem = allCase[index];
    Array.removeAt(index);

    return caseItem;
}

function jsWorkFlow_Activities_SwitchActivity$clearAllCase() {
    var allCase = this.get_allCase();

    this.set_allCase([]);
    return allCase;
}

//执行switch的条件，并返回值
function jsWorkFlow_Activities_SwitchActivity$doEvalCondition(context) {
    //如果没有设置条件，取值为null
    var activity = this._conditionActivity;

    if (!activity) {
        //使用null来驱动doEvalCaseCondition执行
        this.doEvalCaseCondition(context, null, 0);
        return;
    }

    var application = context.get_application();
    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, activity);

    //将上下文的数据存放在activityExecutor之中
    activityExecutor.parentContext = context;

    activityExecutor.add_postComplete(this._doEvalConditionCompleteHandler);

    //OK, kick activityExecutor to run!
    activityExecutor.execute();
}

function jsWorkFlow_Activities_SwitchActivity$doEvalConditionCompleteHandler(eventArgs) {
    var context = eventArgs.get_context();
    var executor = context.get_executor();
    var parentContext = executor.parentContext;

    //从context取执行结果
    var condition = context.get_result();

    //将condition传递给doEvalCaseCondition继续执行
    this.doEvalCaseCondition(parentContext, condition, 0);
}

function jsWorkFlow_Activities_SwitchActivity$doEvalCaseCondition(context, condition, index) {
    var allCase = this.get_allCase();

    if (index >= allCase.length) {
        //OK，已经执行完毕所有的CASE
        //准备执行elseActivity
        this.doExecuteElseCase(context);
        return;
    }

    //取caseItem，准备匹配条件，执行caseBody
    var caseItem = this.getCaseItemByIndex(index);
    

    //如果没有设置条件，取值为null
    var activity = caseItem["key"];

    if (!activity) {
        if (condition === null) {
            //设置匹配的标记
            context.runCase = true;
            //执行对应的activity
            this.doExecuteCaseBody(context, index);
        }
        return;
    }

    var application = context.get_application();
    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, activity);

    //将上下文的数据存放在activityExecutor之中
    activityExecutor.parentContext = context;
    activityExecutor.condition = condition;
    activityExecutor.currentIndex = index;

    activityExecutor.add_postComplete(this._doEvalCaseConditionCompleteHandler);

    //OK, kick activityExecutor to run!
    activityExecutor.execute();
}

function jsWorkFlow_Activities_SwitchActivity$doEvalCaseConditionCompleteHandler(eventArgs) {
    var context = eventArgs.get_context();
    var executor = context.get_executor();
    var parentContext = executor.parentContext;
    var condition = executor.condition;
    var index = executor.currentIndex;

    //从context取执行结果
    var caseCondition = context.get_result();

    if (condition === caseCondition) {
        //有匹配的case, 设置runCase标记
        parentContext.runCase = true;
        //执行对应的Body
        this.doExecuteCaseBody(parentContext, index);
        return;
    }

    //没有匹配，递增index并评估下一个Case条件
    this.doEvalCaseCondition(parentContext, condition, index+1);
}


function jsWorkFlow_Activities_SwitchActivity$doExecuteCaseBody(context, index) {
    //执行对应的caseBody

    //取caseItem
    var caseItem = this.getCaseItemByIndex(index);

    var activity = caseItem["value"];

    if (!activity) {
        //没有activity，继续到评估条件处执行
        //$jwf.endActivity(context);

        return;
    }

    var application = context.get_application();
    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, activity);

    //将上下文的数据存放在activityExecutor之中
    activityExecutor.parentContext = context;

    activityExecutor.add_postComplete(this._doExecuteBodyCompleteHandler);

    //OK, kick activityExecutor to run!
    activityExecutor.execute();
}

function jsWorkFlow_Activities_SwitchActivity$doExecuteCaseBodyCompleteHandler(eventArgs) {
    var context = eventArgs.get_context();
    var executor = context.get_executor();
    var parentContext = executor.parentContext;

}

function jsWorkFlow_Activities_SwitchActivity$doExecuteElseCase(context) {

    var activity = this._elseActivity;

    //检查是否需要执行elseAvtivity
    if (context.runCase || !activity) {
        //不需要，那么结束activity的执行
        $jwf.endActivity(context);
        return;
    }

    //执行对应的activity

    var application = context.get_application();
    var activityExecutor = new jsWorkFlow.ActivityExecutor(application, activity);

    //将上下文的数据存放在activityExecutor之中
    activityExecutor.parentContext = context;

    activityExecutor.add_postComplete(this._doExecuteElseCaseCompleteHandler);

    //OK, kick activityExecutor to run!
    activityExecutor.execute();
}

function jsWorkFlow_Activities_SwitchActivity$doExecuteElseCaseCompleteHandler(eventArgs) {
    var context = eventArgs.get_context();
    var executor = context.get_executor();
    var parentContext = executor.parentContext;

    //结束parentActivity的执行
    $jwf.endActivity(parentContext);

}

//activity的状态机的启动入口，自动驱动activity的状态机进入运行状态。
function jsWorkFlow_Activities_SwitchActivity$execute(context) {
    jsWorkFlow.Activities.SwitchActivity.callBaseMethod(this, 'execute', [context]);

    //初始化是否执行case的标记
    context.runCase = false;

    //TODO:
    //    LOG noop message!

    //执行完毕，结束activity
    $jwf.endActivity(context);
}

jsWorkFlow.Activities.SwitchActivity.prototype = {
    _conditionActivity: null,
    _elseActivity: null,
    _allCase: null,
    _doEvalConditionCompleteHandler: null,
    _doEvalCaseConditionCompleteHandler: null,
    _doExecuteCaseBodyCompleteHandler: null,
    _doExecuteElseCaseCompleteHandler: null,
    dispose: jsWorkFlow_Activities_SwitchActivity$dispose,
    //property
    get_conditionActivity: jsWorkFlow_Activities_SwitchActivity$get_conditionActivity,
    set_conditionActivity: jsWorkFlow_Activities_SwitchActivity$set_conditionActivity,
    get_elseActivity: jsWorkFlow_Activities_SwitchActivity$get_elseActivity,
    set_elseActivity: jsWorkFlow_Activities_SwitchActivity$set_elseActivity,
    get_allCase: jsWorkFlow_Activities_SwitchActivity$get_allCase,
    set_allCase: jsWorkFlow_Activities_SwitchActivity$set_allCase,

    //method
    loadSerializeContext: jsWorkFlow_Activities_SwitchActivity$loadSerializeContext,
    saveSerializeContext: jsWorkFlow_Activities_SwitchActivity$saveSerializeContext,
    addCase: jsWorkFlow_Activities_SwitchActivity$addCase,
    addCaseItem: jsWorkFlow_Activities_SwitchActivity$addCaseItem,
    getCaseCount: jsWorkFlow_Activities_SwitchActivity$getCaseCount,
    getCaseItemByIndex: jsWorkFlow_Activities_SwitchActivity$getCaseItemByIndex,
    removeCaseItemByIndex: jsWorkFlow_Activities_SwitchActivity$removeCaseItemByIndex,
    clearAllCase: jsWorkFlow_Activities_SwitchActivity$clearAllCase,
    //workflow method
    doEvalCondition: jsWorkFlow_Activities_SwitchActivity$doEvalCondition,
    doEvalConditionCompleteHandler: jsWorkFlow_Activities_SwitchActivity$doEvalConditionCompleteHandler,
    doEvalCaseCondition: jsWorkFlow_Activities_SwitchActivity$doEvalCaseCondition,
    doEvalCaseConditionCompleteHandler: jsWorkFlow_Activities_SwitchActivity$doEvalCaseConditionCompleteHandler,
    doExecuteCaseBody: jsWorkFlow_Activities_SwitchActivity$doExecuteCaseBody,
    doExecuteCaseBodyCompleteHandler: jsWorkFlow_Activities_SwitchActivity$doExecuteCaseBodyCompleteHandler,
    doExecuteElseCase: jsWorkFlow_Activities_SwitchActivity$doExecuteElseCase,
    doExecuteElseCaseCompleteHandler: jsWorkFlow_Activities_SwitchActivity$doExecuteElseCaseCompleteHandler,
    execute: jsWorkFlow_Activities_SwitchActivity$execute
};

jsWorkFlow.Activities.SwitchActivity.registerClass('jsWorkFlow.Activities.SwitchActivity', jsWorkFlow.Activity);



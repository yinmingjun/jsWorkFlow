
//使用while做5次循环，每次匹配不同的项目

var _s$varWhileCond = 0;

//jsWorkFlow.Activities.SwitchActivity

function _s$buildSwitchActivity() {
    //build switch
    var cAct = new jsWorkFlow.Activities.EvalExprActivity("'t'+_s$varWhileCond;");
    var eAct = new jsWorkFlow.Activities.EvalExprActivity("test('testSwitch [t1~4,e] else', function () { ok(true, 'Passed!'); });");
    var allCase = [
            { key: new jsWorkFlow.Activities.EvalExprActivity("'t1'"),
                value: new jsWorkFlow.Activities.EvalExprActivity("test('testSwitch [t1~4,e] t1', function () { ok(true, 'Passed!'); });")
            },
            { key: new jsWorkFlow.Activities.EvalExprActivity("'t2'"),
                value: new jsWorkFlow.Activities.EvalExprActivity("test('testSwitch [t1~4,e] t2', function () { ok(true, 'Passed!'); });")
            },
            { key: new jsWorkFlow.Activities.EvalExprActivity("'t3'"),
                value: new jsWorkFlow.Activities.EvalExprActivity("test('testSwitch [t1~4,e] t3', function () { ok(true, 'Passed!'); });")
            },
            { key: new jsWorkFlow.Activities.EvalExprActivity("'t4'"),
                value: new jsWorkFlow.Activities.EvalExprActivity("test('testSwitch [t1~4,e] t4', function () { ok(true, 'Passed!'); });")
            }];

    var swth = new jsWorkFlow.Activities.SwitchActivity(cAct, eAct, allCase);
    return swth;
}

function testSwitch() {

    _s$varWhileCond = 0;

    var wCond = new jsWorkFlow.Activities.EvalExprActivity("_s$varWhileCond++ < 5");

    var swth = _s$buildSwitchActivity();
    var wAct = new jsWorkFlow.Activities.WhileActivity(wCond, swth);

    testEngine(wAct);


}

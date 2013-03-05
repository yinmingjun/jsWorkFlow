




//jsWorkFlow.Activities.StateMachineActivity
//jsWorkFlow.Activities.GetStateMachineStateActivity
//jsWorkFlow.Activities.SetStateMachineStateActivity
//jsWorkFlow.Activities.EndStateMachineActivity

function testStateMachineEmpty() {

    var stateMachine = new jsWorkFlow.Activities.StateMachineActivity();
    stateMachine.add_end(function () {
        unitTestFW.test("testStateMachineEmpty", function () { unitTestFW.ok(true, "Passed!"); });
    });

    testEngine(stateMachine);
}

function testStateMachineEnd() {
    var smSeq = new jsWorkFlow.Activities.SequenceActivity();
    var endSM = new jsWorkFlow.Activities.EndStateMachineActivity();

    smSeq.addActivity(endSM);

    var stateMachine = new jsWorkFlow.Activities.StateMachineActivity(smSeq);
    stateMachine.add_end(function () {
        unitTestFW.test("testStateMachineEnd", function () { unitTestFW.ok(true, "Passed!"); });
    });

    testEngine(stateMachine);
}

//定义状态
var S1 = jsWorkFlow.ActivityState.min_value + 1;
var S2 = jsWorkFlow.ActivityState.min_value + 2;
var S3 = jsWorkFlow.ActivityState.min_value + 3;

function _sm$buildSwitchActivity() {
    //build switch
    var cAct = new jsWorkFlow.Activities.GetStateMachineStateActivity();
    var eAct = null;
    var allCase = [
        //start -> S1
        {
        key: new jsWorkFlow.Activities.EvalExprActivity("jsWorkFlow.ActivityState.start;"),
        value: new jsWorkFlow.Activities.SetStateMachineStateActivity(new jsWorkFlow.Activities.EvalExprActivity("S1;"))
        },
        //S1 -> S2
        {
        key: new jsWorkFlow.Activities.EvalExprActivity("S1;"),
        value: new jsWorkFlow.Activities.SetStateMachineStateActivity(new jsWorkFlow.Activities.EvalExprActivity("S2;"))
        },
        //S2 -> S3
        {
        key: new jsWorkFlow.Activities.EvalExprActivity("S2;"),
        value: new jsWorkFlow.Activities.SetStateMachineStateActivity(new jsWorkFlow.Activities.EvalExprActivity("S3;"))
        },
        //S3 -> end
        {
        key: new jsWorkFlow.Activities.EvalExprActivity("S3;"),
        value: new jsWorkFlow.Activities.EndStateMachineActivity()
        }];

    var swth = new jsWorkFlow.Activities.SwitchActivity(cAct, eAct, allCase);
    return swth;
}



function testStateMachineFlow() {
    //start -> S1 -> S2 -> S3 ->end
    var smSeq = new jsWorkFlow.Activities.SequenceActivity();
    var execAct = _sm$buildSwitchActivity();

    smSeq.addActivity(execAct);

    var stateMachine = new jsWorkFlow.Activities.StateMachineActivity(smSeq);
    stateMachine.add_end(function () {
        unitTestFW.test("testStateMachineFlow", function () { unitTestFW.ok(true, "Passed!"); });
    });


    testEngine(stateMachine);
}

function testStateMachine() {
    testStateMachineEmpty();
    testStateMachineEnd();
    testStateMachineFlow();
}

if (typeof (exports) !== 'undefined') {
    exports.testStateMachine = testStateMachine;
}
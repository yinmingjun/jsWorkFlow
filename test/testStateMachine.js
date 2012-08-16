




//jsWorkFlow.Activities.StateMachineActivity
//jsWorkFlow.Activities.GetStateMachineStateActivity
//jsWorkFlow.Activities.SetStateMachineStateActivity
//jsWorkFlow.Activities.EndStateMachineActivity

function testStateMachineEmpty() {
    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test Empty StateMachine');");

    var stateMachine = new jsWorkFlow.Activities.StateMachineActivity();
    var seq = new jsWorkFlow.Activities.SequenceActivity();

    seq.addActivity(expr);
    seq.addActivity(stateMachine);

    testEngine(seq);
}

function testStateMachineEnd() {
    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test End StateMachine');");

    var smSeq = new jsWorkFlow.Activities.SequenceActivity();
    var endSM = new jsWorkFlow.Activities.EndStateMachineActivity();

    smSeq.addActivity(endSM);

    var stateMachine = new jsWorkFlow.Activities.StateMachineActivity(smSeq);
    var seq = new jsWorkFlow.Activities.SequenceActivity();

    seq.addActivity(expr);
    seq.addActivity(stateMachine);

    testEngine(seq);
}

//定义状态
var S1 = jsWorkFlow.ActivityState.min_value + 1;
var S2 = jsWorkFlow.ActivityState.min_value + 2;
var S3 = jsWorkFlow.ActivityState.min_value + 3;

function _sm$caseCallback(args) {
    var callbackData = args.get_callbackData();
    window.alert("in _sm$caseCallback function, callbackData is [" + callbackData + "].");
    return callbackData;
}

function _sm$buildSwitchActivity() {
    //build switch
    var cAct = new jsWorkFlow.Activities.GetStateMachineStateActivity();
    var eAct = null;
    var allCase = [
        //start -> S1
        {
            key: new jsWorkFlow.Activities.FunctionActivity(_sm$caseCallback, jsWorkFlow.ActivityState.start),
            value: new jsWorkFlow.Activities.SetStateMachineStateActivity(new jsWorkFlow.Activities.FunctionActivity(_sm$caseCallback, S1))
        },
        //S1 -> S2
        {
            key: new jsWorkFlow.Activities.FunctionActivity(_sm$caseCallback, S1),
            value: new jsWorkFlow.Activities.SetStateMachineStateActivity(new jsWorkFlow.Activities.FunctionActivity(_sm$caseCallback, S2))
        },
        //S2 -> S3
        {
            key: new jsWorkFlow.Activities.FunctionActivity(_sm$caseCallback, S2),
            value: new jsWorkFlow.Activities.SetStateMachineStateActivity(new jsWorkFlow.Activities.FunctionActivity(_sm$caseCallback, S3))
        },
        //S3 -> end
        {
            key: new jsWorkFlow.Activities.FunctionActivity(_sm$caseCallback, S3),
            value: new jsWorkFlow.Activities.EndStateMachineActivity()
        }];

    var swth = new jsWorkFlow.Activities.SwitchActivity(cAct, eAct, allCase);
    return swth;
}



function testStateMachineFlow() {
    //start -> S1 -> S2 -> S3 ->end
    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test StateMachine Flow');");

    var smSeq = new jsWorkFlow.Activities.SequenceActivity();
    var execAct = _sm$buildSwitchActivity();

    smSeq.addActivity(execAct);

    var stateMachine = new jsWorkFlow.Activities.StateMachineActivity(smSeq);
    var seq = new jsWorkFlow.Activities.SequenceActivity();

    seq.addActivity(expr);
    seq.addActivity(stateMachine);

    testEngine(seq);
}

function testStateMachine() {
    testStateMachineEmpty();
    testStateMachineEnd();
    testStateMachineFlow();
}

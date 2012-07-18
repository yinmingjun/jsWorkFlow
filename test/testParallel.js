
function _p$itemCallback(args) {
    var callbackData = args.get_callbackData();
    window.alert("in _p$itemCallback function, callbackData is [" + callbackData + "].");
    return;
}

//jsWorkFlow.Activities.ParallelActivity
function testParallel() {
    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test Parallel, 5 activities');");

    var activites = [
            new jsWorkFlow.Activities.FunctionActivity(_p$itemCallback, "t1"),
            new jsWorkFlow.Activities.FunctionActivity(_p$itemCallback, "t2"),
            new jsWorkFlow.Activities.FunctionActivity(_p$itemCallback, "t3"),
            new jsWorkFlow.Activities.FunctionActivity(_p$itemCallback, "t4"),
            new jsWorkFlow.Activities.FunctionActivity(_p$itemCallback, "t5")];

    var pAct = new jsWorkFlow.Activities.ParallelActivity(activites);
    var seq = new jsWorkFlow.Activities.SequenceActivity();

    seq.addActivity(expr);
    seq.addActivity(pAct);

    testEngine(seq);
}


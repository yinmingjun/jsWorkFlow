
function funcCallback(args) {
    window.alert("in callback function.");
}

//jsWorkFlow.Activities.FunctionActivity
function testFunc() {
    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test Function');");
    var func = new jsWorkFlow.Activities.FunctionActivity(funcCallback);
    var seq = new jsWorkFlow.Activities.SequenceActivity();

    seq.addActivity(expr);
    seq.addActivity(func);

    testEngine(seq);
}
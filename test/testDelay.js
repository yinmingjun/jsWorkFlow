

//jsWorkFlow.Activities.DelayActivity
function testDelay() {
    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('Delay 2000 ms');");
    var delay = new jsWorkFlow.Activities.DelayActivity(2000);
    var seq = new jsWorkFlow.Activities.SequenceActivity();

    seq.addActivity(expr);
    seq.addActivity(delay);

    testEngine(seq);
}
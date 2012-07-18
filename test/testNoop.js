


//jsWorkFlow.Activities.NoopActivity
function testNoop() {
    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test Noop');");

    var noop = new jsWorkFlow.Activities.NoopActivity();
    var seq = new jsWorkFlow.Activities.SequenceActivity();

    seq.addActivity(expr);
    seq.addActivity(noop);

    testEngine(seq);
}
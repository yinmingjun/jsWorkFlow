

//jsWorkFlow.Activities.DelayActivity
function testDelay() {
    var expr = new jsWorkFlow.Activities.EvalExprActivity("test('testDelay', function () { ok(true, 'Passed!'); });");
    var delay = new jsWorkFlow.Activities.DelayActivity(2000);
    var seq = new jsWorkFlow.Activities.SequenceActivity();

    seq.addActivity(delay);
    seq.addActivity(expr);

    testEngine(seq);

}

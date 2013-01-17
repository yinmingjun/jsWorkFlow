


//jsWorkFlow.Activities.NoopActivity
function testNoop() {

    var noop = new jsWorkFlow.Activities.NoopActivity();
    var expr = new jsWorkFlow.Activities.EvalExprActivity("test('testNoop', function () { ok(true, 'Passed!'); });");
    var seq = new jsWorkFlow.Activities.SequenceActivity();

    seq.addActivity(noop);
    seq.addActivity(expr);

    testEngine(seq);
}


function testSequence() {
    var expr1 = new jsWorkFlow.Activities.EvalExprActivity("test('testSequence 3-1', function () { ok(true, 'Passed!'); });");
    var expr2 = new jsWorkFlow.Activities.EvalExprActivity("test('testSequence 3-2', function () { ok(true, 'Passed!'); });");
    var expr3 = new jsWorkFlow.Activities.EvalExprActivity("test('testSequence 3-3', function () { ok(true, 'Passed!'); });");
    var seq = new jsWorkFlow.Activities.SequenceActivity();

    seq.addActivity(expr1);
    seq.addActivity(expr2);
    seq.addActivity(expr3);

    testEngine(seq);
}
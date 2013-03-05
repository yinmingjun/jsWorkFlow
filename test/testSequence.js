

function testSequence() {
    var expr1 = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testSequence 3-1', function () { unitTestFW.ok(true, 'Passed!'); });");
    var expr2 = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testSequence 3-2', function () { unitTestFW.ok(true, 'Passed!'); });");
    var expr3 = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testSequence 3-3', function () { unitTestFW.ok(true, 'Passed!'); });");
    var seq = new jsWorkFlow.Activities.SequenceActivity();

    seq.addActivity(expr1);
    seq.addActivity(expr2);
    seq.addActivity(expr3);

    testEngine(seq);
}

if (typeof (exports) !== 'undefined') {
    exports.testSequence = testSequence;
}
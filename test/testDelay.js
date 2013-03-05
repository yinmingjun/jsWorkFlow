

//jsWorkFlow.Activities.DelayActivity
function testDelay() {
    var expr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testDelay', function () { unitTestFW.ok(true, 'Passed!'); });");
    var delay = new jsWorkFlow.Activities.DelayActivity(2000);
    var seq = new jsWorkFlow.Activities.SequenceActivity();

    seq.addActivity(delay);
    seq.addActivity(expr);

    testEngine(seq);

}

if (typeof (exports) !== 'undefined') {
    exports.testDelay = testDelay;
}

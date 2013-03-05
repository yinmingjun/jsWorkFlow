
//jsWorkFlow.Activities.ParallelActivity
function testParallel() {
    
    var activites = [
            new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testParallel 5-1', function () { unitTestFW.ok(true, 'Passed!'); });"),
            new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testParallel 5-2', function () { unitTestFW.ok(true, 'Passed!'); });"),
            new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testParallel 5-3', function () { unitTestFW.ok(true, 'Passed!'); });"),
            new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testParallel 5-4', function () { unitTestFW.ok(true, 'Passed!'); });"),
            new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testParallel 5-5', function () { unitTestFW.ok(true, 'Passed!'); });")];

    var pAct = new jsWorkFlow.Activities.ParallelActivity(activites);
    var seq = new jsWorkFlow.Activities.SequenceActivity();

    seq.addActivity(pAct);

    testEngine(seq);
}

if (typeof (exports) !== 'undefined') {
    exports.testParallel = testParallel;
}
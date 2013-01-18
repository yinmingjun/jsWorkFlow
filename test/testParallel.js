
//jsWorkFlow.Activities.ParallelActivity
function testParallel() {
    
    var activites = [
            new jsWorkFlow.Activities.EvalExprActivity("test('testParallel 5-1', function () { ok(true, 'Passed!'); });"),
            new jsWorkFlow.Activities.EvalExprActivity("test('testParallel 5-2', function () { ok(true, 'Passed!'); });"),
            new jsWorkFlow.Activities.EvalExprActivity("test('testParallel 5-3', function () { ok(true, 'Passed!'); });"),
            new jsWorkFlow.Activities.EvalExprActivity("test('testParallel 5-4', function () { ok(true, 'Passed!'); });"),
            new jsWorkFlow.Activities.EvalExprActivity("test('testParallel 5-5', function () { ok(true, 'Passed!'); });")];

    var pAct = new jsWorkFlow.Activities.ParallelActivity(activites);
    var seq = new jsWorkFlow.Activities.SequenceActivity();

    seq.addActivity(pAct);

    testEngine(seq);
}


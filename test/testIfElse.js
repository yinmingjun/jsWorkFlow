

//
function testIfElse() {
    var cond1 = new jsWorkFlow.Activities.EvalExprActivity("true;");
    var thenActivity1 = new jsWorkFlow.Activities.EvalExprActivity("test('testIfElse, true', function () { ok(true, 'Passed!'); });");
    var elseAvtivity1 = new jsWorkFlow.Activities.EvalExprActivity("test('testIfElse, true', function () { ok(false, 'Passed!'); });");
    var ifTrue = new jsWorkFlow.Activities.IfElseActivity(cond1, thenActivity1, elseAvtivity1);

    var cond2 = new jsWorkFlow.Activities.EvalExprActivity("false;");
    var thenActivity2 = new jsWorkFlow.Activities.EvalExprActivity("test('testIfElse, false', function () { ok(false, 'Passed!'); });");
    var elseAvtivity2 = new jsWorkFlow.Activities.EvalExprActivity("test('testIfElse, false', function () { ok(true, 'Passed!'); });");
    var ifFalse = new jsWorkFlow.Activities.IfElseActivity(cond2, thenActivity2, elseAvtivity2);

    var seq = new jsWorkFlow.Activities.SequenceActivity();
    seq.addActivity(ifTrue);
    seq.addActivity(ifFalse);


    testEngine(seq);
}
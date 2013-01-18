
var _w$varWhileCond = 0;

//jsWorkFlow.Activities.WhileActivity
function testWhile() {
    _w$varWhileCond = 0;
    var wCond = new jsWorkFlow.Activities.EvalExprActivity("_w$varWhileCond++ < 5");
    var wBody = new jsWorkFlow.Activities.EvalExprActivity("test('testWhile 5-'+_w$varWhileCond, function () { ok(true, 'Passed!'); });");
    var wAct = new jsWorkFlow.Activities.WhileActivity(wCond, wBody);

    var seq = new jsWorkFlow.Activities.SequenceActivity();

    seq.addActivity(wAct);

    testEngine(seq);
}
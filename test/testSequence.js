

function testSequence() {
    var expr1 = new jsWorkFlow.Activities.EvalExprActivity("window.alert('testSequence step1');");
    var expr2 = new jsWorkFlow.Activities.EvalExprActivity("window.alert('testSequence step2');");
    var expr3 = new jsWorkFlow.Activities.EvalExprActivity("window.alert('testSequence step3');");
    var seq = new jsWorkFlow.Activities.SequenceActivity();

    seq.addActivity(expr1);
    seq.addActivity(expr2);
    seq.addActivity(expr3);

    testEngine(seq);
}
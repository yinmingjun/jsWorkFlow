

//
function testIfElse() {
    var cond1 = new jsWorkFlow.Activities.EvalExprActivity("window.alert('evalue condition, return true'); true;");
    var thenActivity1 = new jsWorkFlow.Activities.EvalExprActivity("window.alert('run thenActivity');");
    var elseAvtivity1 = new jsWorkFlow.Activities.EvalExprActivity("window.alert('run elseAvtivity');");
    var ifTrue = new jsWorkFlow.Activities.IfElseActivity(cond1, thenActivity1, elseAvtivity1);

    var cond2 = new jsWorkFlow.Activities.EvalExprActivity("window.alert('evalue condition, return false'); false;");
    var thenActivity2 = new jsWorkFlow.Activities.EvalExprActivity("window.alert('run thenActivity');");
    var elseAvtivity2 = new jsWorkFlow.Activities.EvalExprActivity("window.alert('run elseAvtivity');");
    var ifFalse = new jsWorkFlow.Activities.IfElseActivity(cond2, thenActivity2, elseAvtivity2);

    var seq = new jsWorkFlow.Activities.SequenceActivity();
    seq.addActivity(ifTrue);
    seq.addActivity(ifFalse);


    testEngine(seq);
}
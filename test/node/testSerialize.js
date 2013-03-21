
var jsoop = require('jsoop');
var wf = require('../../build/jsworkflow');
//require namsepace
var jsWorkFlow = jsoop.ns('jsWorkFlow');

var cond1 = new jsWorkFlow.Activities.EvalExprActivity("true;");
var thenActivity1 = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testIfElse, true', function () { unitTestFW.ok(true, 'Passed!'); });");
var elseAvtivity1 = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testIfElse, true', function () { unitTestFW.ok(false, 'Passed!'); });");
var ifTrue = new jsWorkFlow.Activities.IfElseActivity(cond1, thenActivity1, elseAvtivity1);

var cond2 = new jsWorkFlow.Activities.EvalExprActivity("false;");
var thenActivity2 = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testIfElse, false', function () { unitTestFW.ok(false, 'Passed!'); });");
var elseAvtivity2 = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testIfElse, false', function () { unitTestFW.ok(true, 'Passed!'); });");
var ifFalse = new jsWorkFlow.Activities.IfElseActivity(cond2, thenActivity2, elseAvtivity2);

var seq = new jsWorkFlow.Activities.SequenceActivity();
seq.addActivity(ifTrue);
seq.addActivity(ifFalse);


//serialize 
var sc = {};
seq.saveSerializeContext(sc);

var json = JSON.stringify(sc);

var seq2 = jsWorkFlow.ActivityHelper.loadActivity(sc);

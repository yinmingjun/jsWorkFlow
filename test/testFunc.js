
//jsWorkFlow.Activities.FunctionActivity
function testFunc() {
    var func = new jsWorkFlow.Activities.FunctionActivity(function (args) {
        test("testFunc", function () { ok(true, "Passed!"); });
    });
    var seq = new jsWorkFlow.Activities.SequenceActivity();

    seq.addActivity(func);

    testEngine(seq);
}

//jsWorkFlow.Activities.FunctionActivity
function testFunc() {
    var func = new jsWorkFlow.Activities.FunctionActivity(function (args) {
        unitTestFW.test("testFunc", function () { unitTestFW.ok(true, "Passed!"); });
    });
    var seq = new jsWorkFlow.Activities.SequenceActivity();

    seq.addActivity(func);

    testEngine(seq);
}

if (typeof (exports) !== 'undefined') {
    exports.testFunc = testFunc;
}
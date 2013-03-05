
//jsWorkFlow.Activities.TryCatchActivity

//一层的try catch
function testTryCacheL1() {
    var raiseA = new jsWorkFlow.Activities.RaiseExceptionActivity(new jsWorkFlow.Activities.ConstActivity("test"));
    var errorA = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testTryCatch - testTryCacheL1', function () { unitTestFW.ok(false, 'Passed!'); });");
    var okA = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testTryCatch - testTryCacheL1', function () { unitTestFW.ok(true, 'Passed!'); });");

    var tryA = new jsWorkFlow.Activities.SequenceActivity();
    tryA.addActivity(raiseA);
    tryA.addActivity(errorA);

    var tryCatchA = new jsWorkFlow.Activities.TryCatchActivity(tryA, okA);

    testEngine(tryCatchA);
}

//两层的try catch
function testTryCacheL2() {
    var raise1A = new jsWorkFlow.Activities.RaiseExceptionActivity(new jsWorkFlow.Activities.ConstActivity("test1"));
    var raise2A = new jsWorkFlow.Activities.RaiseExceptionActivity(new jsWorkFlow.Activities.ConstActivity("test2"));
    var errorA = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testTryCatch - testTryCacheL2', function () { unitTestFW.ok(false, 'Passed!'); });");
    var okA = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testTryCatch - testTryCacheL2', function () { unitTestFW.ok(true, 'Passed!'); });");
    raise1A.set_name("raise1A");
    raise2A.set_name("raise2A");
    errorA.set_name("errorA");
    okA.set_name("okA");

    var try1A = new jsWorkFlow.Activities.SequenceActivity();
    try1A.addActivity(raise1A);
    try1A.addActivity(errorA);
    try1A.set_name("try1A");

    var tryCatch1A = new jsWorkFlow.Activities.TryCatchActivity(try1A, raise2A);
    tryCatch1A.set_name("tryCatch1A");

    var try2A = new jsWorkFlow.Activities.SequenceActivity();
    try2A.addActivity(tryCatch1A);
    try2A.addActivity(errorA);
    try2A.set_name("try2A");

    var tryCatch2A = new jsWorkFlow.Activities.TryCatchActivity(try2A, okA);
    tryCatch2A.set_name("tryCatch2A");
    testEngine(tryCatch2A);
}

function testTryCatchGetException() {
    var raiseA = new jsWorkFlow.Activities.RaiseExceptionActivity(new jsWorkFlow.Activities.ConstActivity("test"));
    var getEA = new jsWorkFlow.Activities.GetExceptionActivity();
    var constA = new jsWorkFlow.Activities.ConstActivity("test");
    var isEA = new jsWorkFlow.Activities.IsEqualsActivity(constA, getEA);
    var errorA = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testTryCatch - testTryCatchGetException', function () { unitTestFW.ok(false, 'Passed!'); });");
    var okA = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testTryCatch - testTryCatchGetException', function () { unitTestFW.ok(true, 'Passed!'); });");
    var ifA = new jsWorkFlow.Activities.IfElseActivity(isEA, okA, errorA);

    var tryA = new jsWorkFlow.Activities.SequenceActivity();
    tryA.addActivity(raiseA);

    var tryCatchA = new jsWorkFlow.Activities.TryCatchActivity(tryA, ifA);

    testEngine(tryCatchA);
}

function testTryCatch() {
    testTryCacheL1();
    testTryCacheL2();
    testTryCatchGetException();
}

if (typeof (exports) !== 'undefined') {
    exports.testTryCatch = testTryCatch;
}


//case1, test true and true
function testLogicalOpt_true_and_true() {

    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalAnd = new jsWorkFlow.Activities.LogicAndActivity(valTrue, valTrue);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_true_and_true', function () { unitTestFW.ok(true, 'Passed!'); });");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_true_and_true', function () { unitTestFW.ok(false, 'Passed!'); });");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalAnd, trueExpr, falseExpr);

    testEngine(ifAct);
}

//case2, test true and false
function testLogicalOpt_true_and_false() {
    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalAnd = new jsWorkFlow.Activities.LogicAndActivity(valTrue, valFalse);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_true_and_false', function () { unitTestFW.ok(false, 'Passed!'); });");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_true_and_false', function () { unitTestFW.ok(true, 'Passed!'); });");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalAnd, trueExpr, falseExpr);

    testEngine(ifAct);
}

//case3, test false and true
function testLogicalOpt_false_and_true() {
    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalAnd = new jsWorkFlow.Activities.LogicAndActivity(valFalse, valTrue);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_false_and_true', function () { unitTestFW.ok(false, 'Passed!'); });");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_false_and_true', function () { unitTestFW.ok(true, 'Passed!'); });");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalAnd, trueExpr, falseExpr);

    testEngine(ifAct);
}

//case4, test false and false
function testLogicalOpt_false_and_false() {
    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalAnd = new jsWorkFlow.Activities.LogicAndActivity(valFalse, valFalse);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_false_and_false', function () { unitTestFW.ok(false, 'Passed!'); });");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_false_and_false', function () { unitTestFW.ok(true, 'Passed!'); });");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalAnd, trueExpr, falseExpr);

    testEngine(ifAct);
}

//case5, test true or true
function testLogicalOpt_true_or_true() {
    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalOr = new jsWorkFlow.Activities.LogicOrActivity(valTrue, valTrue);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_true_or_true', function () { unitTestFW.ok(true, 'Passed!'); });");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_true_or_true', function () { unitTestFW.ok(false, 'Passed!'); });");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalOr, trueExpr, falseExpr);

    testEngine(ifAct);
}

//case6, test true or false
function testLogicalOpt_true_or_false() {
    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalOr = new jsWorkFlow.Activities.LogicOrActivity(valTrue, valFalse);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_true_or_false', function () { unitTestFW.ok(true, 'Passed!'); });");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_true_or_false', function () { unitTestFW.ok(false, 'Passed!'); });");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalOr, trueExpr, falseExpr);


    testEngine(ifAct);
}

//case7, test false or true
function testLogicalOpt_false_or_true() {

    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalOr = new jsWorkFlow.Activities.LogicOrActivity(valFalse, valTrue);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_true_or_false', function () { unitTestFW.ok(true, 'Passed!'); });");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_true_or_false', function () { unitTestFW.ok(false, 'Passed!'); });");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalOr, trueExpr, falseExpr);

    testEngine(ifAct);
}

//case8, test false or false
function testLogicalOpt_false_or_false() {
    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalOr = new jsWorkFlow.Activities.LogicOrActivity(valFalse, valFalse);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_false_or_false', function () { unitTestFW.ok(false, 'Passed!'); });");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_false_or_false', function () { unitTestFW.ok(true, 'Passed!'); });");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalOr, trueExpr, falseExpr);

    testEngine(ifAct);
}

//case9, test not true
function testLogicalOpt_not_true() {
    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalNot = new jsWorkFlow.Activities.LogicNotActivity(valTrue);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_not_true', function () { unitTestFW.ok(false, 'Passed!'); });");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_not_true', function () { unitTestFW.ok(true, 'Passed!'); });");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalNot, trueExpr, falseExpr);

    testEngine(ifAct);
}

//case10, test not false
function testLogicalOpt_not_false() {
    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalNot = new jsWorkFlow.Activities.LogicNotActivity(valFalse);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_not_false', function () { unitTestFW.ok(true, 'Passed!'); });");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_not_false', function () { unitTestFW.ok(false, 'Passed!'); });");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalNot, trueExpr, falseExpr);

    testEngine(ifAct);
}

//case11, test true xor true
function testLogicalOpt_true_xor_true() {
    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalXor = new jsWorkFlow.Activities.LogicXorActivity(valTrue, valTrue);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_true_xor_true', function () { unitTestFW.ok(false, 'Passed!'); });");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_true_xor_true', function () { unitTestFW.ok(true, 'Passed!'); });");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalXor, trueExpr, falseExpr);

    testEngine(ifAct);
}

//case12, test true xor false
function testLogicalOpt_true_xor_false() {
    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalXor = new jsWorkFlow.Activities.LogicXorActivity(valTrue, valFalse);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_true_xor_false', function () { unitTestFW.ok(true, 'Passed!'); });");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_true_xor_false', function () { unitTestFW.ok(false, 'Passed!'); });");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalXor, trueExpr, falseExpr);

    testEngine(ifAct);
}

//case13, test false xor true
function testLogicalOpt_false_xor_true() {
    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalXor = new jsWorkFlow.Activities.LogicXorActivity(valFalse, valTrue);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_false_xor_true', function () { unitTestFW.ok(true, 'Passed!'); });");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_false_xor_true', function () { unitTestFW.ok(false, 'Passed!'); });");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalXor, trueExpr, falseExpr);

    testEngine(ifAct);
}

//case14, test false xor false
function testLogicalOpt_false_xor_false() {
    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalXor = new jsWorkFlow.Activities.LogicXorActivity(valFalse, valFalse);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_false_xor_false', function () { unitTestFW.ok(false, 'Passed!'); });");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testLogicalOpt_false_xor_false', function () { unitTestFW.ok(true, 'Passed!'); });");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalXor, trueExpr, falseExpr);

    testEngine(ifAct);
}

//测试短路算法
function testLogicalOpt() {
    testLogicalOpt_true_and_true();
    testLogicalOpt_true_and_false();
    testLogicalOpt_false_and_true();
    testLogicalOpt_false_and_false();
    testLogicalOpt_true_or_true();
    testLogicalOpt_true_or_false();
    testLogicalOpt_false_or_true();
    testLogicalOpt_false_or_false();
    testLogicalOpt_not_true();
    testLogicalOpt_not_false();
    testLogicalOpt_true_xor_true();
    testLogicalOpt_true_xor_false();
    testLogicalOpt_false_xor_true();
    testLogicalOpt_false_xor_false();
}
if (typeof (exports) !== 'undefined') {
    exports.testLogicalOpt = testLogicalOpt;
}
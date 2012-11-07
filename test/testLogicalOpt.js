

//case1, test true and true
function testLogicalOpt_case1() {
    var seq = new jsWorkFlow.Activities.SequenceActivity();
    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test testLogicalOpt [true and true]');");

    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalAnd = new jsWorkFlow.Activities.LogicAndActivity(valTrue, valTrue);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is true');");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is false');");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalAnd, trueExpr, falseExpr);

    seq.addActivity(expr);
    seq.addActivity(ifAct);


    testEngine(seq);
}

//case2, test true and false
function testLogicalOpt_case2() {
    var seq = new jsWorkFlow.Activities.SequenceActivity();
    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test testLogicalOpt [true and false]');");

    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalAnd = new jsWorkFlow.Activities.LogicAndActivity(valTrue, valFalse);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is true');");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is false');");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalAnd, trueExpr, falseExpr);

    seq.addActivity(expr);
    seq.addActivity(ifAct);


    testEngine(seq);
}

//case3, test false and true
function testLogicalOpt_case3() {
    var seq = new jsWorkFlow.Activities.SequenceActivity();
    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test testLogicalOpt [false and true]');");

    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalAnd = new jsWorkFlow.Activities.LogicAndActivity(valFalse, valTrue);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is true');");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is false');");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalAnd, trueExpr, falseExpr);

    seq.addActivity(expr);
    seq.addActivity(ifAct);


    testEngine(seq);
}

//case4, test false and false
function testLogicalOpt_case4() {
    var seq = new jsWorkFlow.Activities.SequenceActivity();
    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test testLogicalOpt [false and false]');");

    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalAnd = new jsWorkFlow.Activities.LogicAndActivity(valFalse, valFalse);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is true');");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is false');");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalAnd, trueExpr, falseExpr);

    seq.addActivity(expr);
    seq.addActivity(ifAct);


    testEngine(seq);
}

//case5, test true or true
function testLogicalOpt_case5() {
    var seq = new jsWorkFlow.Activities.SequenceActivity();
    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test testLogicalOpt [true or true]');");

    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalOr = new jsWorkFlow.Activities.LogicOrActivity(valTrue, valTrue);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is true');");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is false');");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalOr, trueExpr, falseExpr);

    seq.addActivity(expr);
    seq.addActivity(ifAct);


    testEngine(seq);
}

//case6, test true or false
function testLogicalOpt_case6() {
    var seq = new jsWorkFlow.Activities.SequenceActivity();
    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test testLogicalOpt [true or false]');");

    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalOr = new jsWorkFlow.Activities.LogicOrActivity(valTrue, valFalse);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is true');");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is false');");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalOr, trueExpr, falseExpr);

    seq.addActivity(expr);
    seq.addActivity(ifAct);


    testEngine(seq);
}

//case7, test false or true
function testLogicalOpt_case7() {
    var seq = new jsWorkFlow.Activities.SequenceActivity();
    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test testLogicalOpt [false or true]');");

    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalOr = new jsWorkFlow.Activities.LogicOrActivity(valFalse, valTrue);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is true');");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is false');");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalOr, trueExpr, falseExpr);

    seq.addActivity(expr);
    seq.addActivity(ifAct);


    testEngine(seq);
}

//case8, test false or false
function testLogicalOpt_case8() {
    var seq = new jsWorkFlow.Activities.SequenceActivity();
    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test testLogicalOpt [false or false]');");

    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalOr = new jsWorkFlow.Activities.LogicOrActivity(valFalse, valFalse);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is true');");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is false');");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalOr, trueExpr, falseExpr);

    seq.addActivity(expr);
    seq.addActivity(ifAct);


    testEngine(seq);
}

//case9, test not true
function testLogicalOpt_case9() {
    var seq = new jsWorkFlow.Activities.SequenceActivity();
    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test testLogicalOpt [not true]');");

    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalNot = new jsWorkFlow.Activities.LogicNotActivity(valTrue);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is true');");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is false');");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalNot, trueExpr, falseExpr);

    seq.addActivity(expr);
    seq.addActivity(ifAct);


    testEngine(seq);
}

//case10, test not false
function testLogicalOpt_case10() {
    var seq = new jsWorkFlow.Activities.SequenceActivity();
    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test testLogicalOpt [not false]');");

    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalNot = new jsWorkFlow.Activities.LogicNotActivity(valFalse);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is true');");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is false');");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalNot, trueExpr, falseExpr);

    seq.addActivity(expr);
    seq.addActivity(ifAct);


    testEngine(seq);
}

//case11, test true xor true
function testLogicalOpt_case11() {
    var seq = new jsWorkFlow.Activities.SequenceActivity();
    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test testLogicalOpt [true xor true]');");

    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalXor = new jsWorkFlow.Activities.LogicXorActivity(valTrue, valTrue);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is true');");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is false');");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalXor, trueExpr, falseExpr);

    seq.addActivity(expr);
    seq.addActivity(ifAct);


    testEngine(seq);
}

//case12, test true xor false
function testLogicalOpt_case12() {
    var seq = new jsWorkFlow.Activities.SequenceActivity();
    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test testLogicalOpt [true xor false]');");

    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalXor = new jsWorkFlow.Activities.LogicXorActivity(valTrue, valFalse);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is true');");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is false');");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalXor, trueExpr, falseExpr);

    seq.addActivity(expr);
    seq.addActivity(ifAct);


    testEngine(seq);
}

//case13, test false xor true
function testLogicalOpt_case13() {
    var seq = new jsWorkFlow.Activities.SequenceActivity();
    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test testLogicalOpt [false xor true]');");

    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalXor = new jsWorkFlow.Activities.LogicXorActivity(valFalse, valTrue);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is true');");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is false');");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalXor, trueExpr, falseExpr);

    seq.addActivity(expr);
    seq.addActivity(ifAct);


    testEngine(seq);
}

//case14, test false xor false
function testLogicalOpt_case14() {
    var seq = new jsWorkFlow.Activities.SequenceActivity();
    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test testLogicalOpt [false xor false]');");

    var valTrue = new jsWorkFlow.Activities.ConstActivity(true);
    var valFalse = new jsWorkFlow.Activities.ConstActivity(false);

    //比较global
    var logicalXor = new jsWorkFlow.Activities.LogicXorActivity(valFalse, valFalse);
    var trueExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is true');");
    var falseExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('result is false');");
    var ifAct = new jsWorkFlow.Activities.IfElseActivity(logicalXor, trueExpr, falseExpr);

    seq.addActivity(expr);
    seq.addActivity(ifAct);


    testEngine(seq);
}
//测试短路算法
function testLogicalOpt() {
    testLogicalOpt_case1();
    testLogicalOpt_case2();
    testLogicalOpt_case3();
    testLogicalOpt_case4();
    testLogicalOpt_case5();
    testLogicalOpt_case6();
    testLogicalOpt_case7();
    testLogicalOpt_case8();
    testLogicalOpt_case9();
    testLogicalOpt_case10();
    testLogicalOpt_case11();
    testLogicalOpt_case12();
    testLogicalOpt_case13();
    testLogicalOpt_case14();
}

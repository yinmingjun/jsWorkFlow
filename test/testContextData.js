



//jsWorkFlow.Activities.DefineContextDataActivity
//jsWorkFlow.Activities.GetContextDataActivity
//jsWorkFlow.Activities.SetContextDataActivity

//1.在sequence中定义一个local的数据，取数OK；改值，然后取数OK
function testContextData_local_public() {

    var seq = new jsWorkFlow.Activities.SequenceActivity();

    //常量val1和val2
    var val1 = new jsWorkFlow.Activities.ConstActivity(100);
    var val2 = new jsWorkFlow.Activities.ConstActivity(200);

    //local
    //DefineContextDataActivity(dataKey, dataValueActivity, isPrivate, dataContextLayer)
    //dataContextLayer's defalut value is jsWorkFlow.DataContextLayer.auto
    var def = new jsWorkFlow.Activities.DefineContextDataActivity("tlp_val", val1);
    var get = new jsWorkFlow.Activities.GetContextDataActivity("tlp_val");

    //比较
    var isEqual = new jsWorkFlow.Activities.IsEqualsActivity(get, val1);
    var okExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_local_public get value', function () { unitTestFW.ok(true, 'Passed!'); });");
    var errorExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_local_public  get value', function () { unitTestFW.ok(false, 'Passed!'); });");

    var ifAct = new jsWorkFlow.Activities.IfElseActivity(isEqual, okExpr, errorExpr);

    var set = new jsWorkFlow.Activities.SetContextDataActivity("tlp_val", val2);

    var isEqual2 = new jsWorkFlow.Activities.IsEqualsActivity(get, val2);
    var okExpr2 = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_local_public set value', function () { unitTestFW.ok(true, 'Passed!'); });");
    var errorExpr2 = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_local_public set value', function () { unitTestFW.ok(false, 'Passed!'); });");

    var ifAct2 = new jsWorkFlow.Activities.IfElseActivity(isEqual2, okExpr2, errorExpr2);

    seq.addActivity(def);
    seq.addActivity(ifAct);
    seq.addActivity(set);
    seq.addActivity(ifAct2);


    testEngine(seq);
}

//2.在sequence中定义一个global，public的，然后通过auto取数OK，通过auto改值，然后取数OK
function testContextData_global_public() {

    var seq = new jsWorkFlow.Activities.SequenceActivity();

    var val1 = new jsWorkFlow.Activities.ConstActivity(100);
    var val2 = new jsWorkFlow.Activities.ConstActivity(200);

    //global
    //DefineContextDataActivity(dataKey, dataValueActivity, isPrivate, dataContextLayer)
    //dataContextLayer's defalut value is jsWorkFlow.DataContextLayer.auto
    var def = new jsWorkFlow.Activities.DefineContextDataActivity("tgp_val", val1, false, jsWorkFlow.DataContextLayer.global);
    var get = new jsWorkFlow.Activities.GetContextDataActivity("tgp_val", jsWorkFlow.DataContextLayer.auto);

    //比较
    var isEqual = new jsWorkFlow.Activities.IsEqualsActivity(get, val1);
    var okExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_global_public get value', function () { unitTestFW.ok(true, 'Passed!'); });");
    var errorExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_global_public get value', function () { unitTestFW.ok(false, 'Passed!'); });");

    var ifAct = new jsWorkFlow.Activities.IfElseActivity(isEqual, okExpr, errorExpr);

    var set = new jsWorkFlow.Activities.SetContextDataActivity("tgp_val", val2, jsWorkFlow.DataContextLayer.auto);

    var isEqual2 = new jsWorkFlow.Activities.IsEqualsActivity(get, val2);
    var okExpr2 = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_global_public set value', function () { unitTestFW.ok(true, 'Passed!'); });");
    var errorExpr2 = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_global_public set value', function () { unitTestFW.ok(false, 'Passed!'); });");

    var ifAct2 = new jsWorkFlow.Activities.IfElseActivity(isEqual2, okExpr2, errorExpr2);

    seq.addActivity(def);
    seq.addActivity(ifAct);
    seq.addActivity(set);
    seq.addActivity(ifAct2);


    testEngine(seq);
}


//3.在sequence中定义一个app，public的，然后通过auto取数OK，通过auto改值，然后取数OK
function testContextData_app_public() {

    var seq = new jsWorkFlow.Activities.SequenceActivity();

    var val1 = new jsWorkFlow.Activities.ConstActivity(100);
    var val2 = new jsWorkFlow.Activities.ConstActivity(200);

    //global
    var def = new jsWorkFlow.Activities.DefineContextDataActivity("tap_val", val1, false, jsWorkFlow.DataContextLayer.application);
    var get = new jsWorkFlow.Activities.GetContextDataActivity("tap_val", jsWorkFlow.DataContextLayer.auto);

    //比较
    var isEqual = new jsWorkFlow.Activities.IsEqualsActivity(get, val1);
    var okExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_app_public get value', function () { unitTestFW.ok(true, 'Passed!'); });");
    var errorExpr = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_app_public get value', function () { unitTestFW.ok(false, 'Passed!'); });");

    var ifAct = new jsWorkFlow.Activities.IfElseActivity(isEqual, okExpr, errorExpr);

    var set = new jsWorkFlow.Activities.SetContextDataActivity("tap_val", val2, jsWorkFlow.DataContextLayer.auto);

    var isEqual2 = new jsWorkFlow.Activities.IsEqualsActivity(get, val2);
    var okExpr2 = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_app_public auto_set value', function () { unitTestFW.ok(true, 'Passed!'); });");
    var errorExpr2 = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_app_public auto_set value', function () { unitTestFW.ok(false, 'Passed!'); });");

    var ifAct2 = new jsWorkFlow.Activities.IfElseActivity(isEqual2, okExpr2, errorExpr2);

    seq.addActivity(def);
    seq.addActivity(ifAct);
    seq.addActivity(set);
    seq.addActivity(ifAct2);


    testEngine(seq);
}

//4.在sequence中定义同名的local、app和global，值不同，然后通过local、app、global和auto取值，OK
function testContextData_local_app_global_public_mix() {

    var seq = new jsWorkFlow.Activities.SequenceActivity();

    var val1 = new jsWorkFlow.Activities.ConstActivity(100);
    var val2 = new jsWorkFlow.Activities.ConstActivity(200);
    var val3 = new jsWorkFlow.Activities.ConstActivity(300);

    //global,app,local
    var defGlobal = new jsWorkFlow.Activities.DefineContextDataActivity("taam1_val", val1, false, jsWorkFlow.DataContextLayer.global);
    var defApp = new jsWorkFlow.Activities.DefineContextDataActivity("taam1_val", val2, false, jsWorkFlow.DataContextLayer.application);
    var defLocal = new jsWorkFlow.Activities.DefineContextDataActivity("taam1_val", val3, false, jsWorkFlow.DataContextLayer.local);
    var getGlobal = new jsWorkFlow.Activities.GetContextDataActivity("taam1_val", jsWorkFlow.DataContextLayer.global);
    var getApp = new jsWorkFlow.Activities.GetContextDataActivity("taam1_val", jsWorkFlow.DataContextLayer.application);
    var getLocal = new jsWorkFlow.Activities.GetContextDataActivity("taam1_val", jsWorkFlow.DataContextLayer.local);
    var getAuto = new jsWorkFlow.Activities.GetContextDataActivity("taam1_val", jsWorkFlow.DataContextLayer.auto);

    //比较global
    var isEqualG = new jsWorkFlow.Activities.IsEqualsActivity(getGlobal, val1);
    var okExprG = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_local_app_global_public_mix get global value', function () { unitTestFW.ok(true, 'Passed!'); });");
    var errorExprG = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_local_app_global_public_mix get global value', function () { unitTestFW.ok(false, 'Passed!'); });");
    var ifActG = new jsWorkFlow.Activities.IfElseActivity(isEqualG, okExprG, errorExprG);

    //比较application
    var isEqualA = new jsWorkFlow.Activities.IsEqualsActivity(getApp, val2);
    var okExprA = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_local_app_global_public_mix get app value', function () { unitTestFW.ok(true, 'Passed!'); });");
    var errorExprA = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_local_app_global_public_mix get app value', function () { unitTestFW.ok(false, 'Passed!'); });");
    var ifActA = new jsWorkFlow.Activities.IfElseActivity(isEqualA, okExprA, errorExprA);

    //比较local
    var isEqualL = new jsWorkFlow.Activities.IsEqualsActivity(getLocal, val3);
    var okExprL = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_local_app_global_public_mix get local value', function () { unitTestFW.ok(true, 'Passed!'); });");
    var errorExprL = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_local_app_global_public_mix get local value', function () { unitTestFW.ok(false, 'Passed!'); });");
    var ifActL = new jsWorkFlow.Activities.IfElseActivity(isEqualL, okExprL, errorExprL);

    //比较auto，取出的值应该与local相同
    var isEqualAuto = new jsWorkFlow.Activities.IsEqualsActivity(getAuto, val3);
    var okExprAuto = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_local_app_global_public_mix get auto value', function () { unitTestFW.ok(true, 'Passed!'); });");
    var errorExprAuto = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_local_app_global_public_mix get auto value', function () { unitTestFW.ok(false, 'Passed!'); });");
    var ifActAuto = new jsWorkFlow.Activities.IfElseActivity(isEqualAuto, okExprAuto, errorExprAuto);

    seq.addActivity(defGlobal);
    seq.addActivity(defApp);
    seq.addActivity(defLocal);
    seq.addActivity(ifActG);
    seq.addActivity(ifActA);
    seq.addActivity(ifActL);
    seq.addActivity(ifActAuto);


    testEngine(seq);
}

//5.同上，但是global和app是private的。
function testContextData_local_app_global_private_mix() {

    var seq = new jsWorkFlow.Activities.SequenceActivity();

    var val1 = new jsWorkFlow.Activities.ConstActivity(100);
    var val2 = new jsWorkFlow.Activities.ConstActivity(200);
    var val3 = new jsWorkFlow.Activities.ConstActivity(300);

    //global,app,local
    var defGlobal = new jsWorkFlow.Activities.DefineContextDataActivity("taam2_val", val1, true, jsWorkFlow.DataContextLayer.global);
    var defApp = new jsWorkFlow.Activities.DefineContextDataActivity("taam2_val", val2, true, jsWorkFlow.DataContextLayer.application);
    var defLocal = new jsWorkFlow.Activities.DefineContextDataActivity("taam2_val", val3, false, jsWorkFlow.DataContextLayer.local);
    var getGlobal = new jsWorkFlow.Activities.GetContextDataActivity("taam2_val", jsWorkFlow.DataContextLayer.global);
    var getApp = new jsWorkFlow.Activities.GetContextDataActivity("taam2_val", jsWorkFlow.DataContextLayer.application);
    var getLocal = new jsWorkFlow.Activities.GetContextDataActivity("taam2_val", jsWorkFlow.DataContextLayer.local);
    var getAuto = new jsWorkFlow.Activities.GetContextDataActivity("taam2_val", jsWorkFlow.DataContextLayer.auto);

    //比较global
    var isEqualG = new jsWorkFlow.Activities.IsEqualsActivity(getGlobal, val1);
    var okExprG = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_local_app_global_private_mix get global value', function () { unitTestFW.ok(true, 'Passed!'); });");
    var errorExprG = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_local_app_global_private_mix get global value', function () { unitTestFW.ok(false, 'Passed!'); });");
    var ifActG = new jsWorkFlow.Activities.IfElseActivity(isEqualG, okExprG, errorExprG);

    //比较application
    var isEqualA = new jsWorkFlow.Activities.IsEqualsActivity(getApp, val2);
    var okExprA = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_local_app_global_private_mix get app value', function () { unitTestFW.ok(true, 'Passed!'); });");
    var errorExprA = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_local_app_global_private_mix get app value', function () { unitTestFW.ok(false, 'Passed!'); });");
    var ifActA = new jsWorkFlow.Activities.IfElseActivity(isEqualA, okExprA, errorExprA);

    //比较application
    var isEqualL = new jsWorkFlow.Activities.IsEqualsActivity(getLocal, val3);
    var okExprL = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_local_app_global_private_mix get local value', function () { unitTestFW.ok(true, 'Passed!'); });");
    var errorExprL = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_local_app_global_private_mix get local value', function () { unitTestFW.ok(false, 'Passed!'); });");
    var ifActL = new jsWorkFlow.Activities.IfElseActivity(isEqualL, okExprL, errorExprL);

    //比较auto，取出的值应该与local相同
    var isEqualAuto = new jsWorkFlow.Activities.IsEqualsActivity(getAuto, val3);
    var okExprAuto = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_local_app_global_private_mix get auto value', function () { unitTestFW.ok(true, 'Passed!'); });");
    var errorExprAuto = new jsWorkFlow.Activities.EvalExprActivity("unitTestFW.test('testContextData_local_app_global_private_mix get auto value', function () { unitTestFW.ok(false, 'Passed!'); });");
    var ifActAuto = new jsWorkFlow.Activities.IfElseActivity(isEqualAuto, okExprAuto, errorExprAuto);

    seq.addActivity(defGlobal);
    seq.addActivity(defApp);
    seq.addActivity(defLocal);
    seq.addActivity(ifActG);
    seq.addActivity(ifActA);
    seq.addActivity(ifActL);
    seq.addActivity(ifActAuto);


    testEngine(seq);
}

function testContextData() {
    testContextData_local_public();
    testContextData_global_public();
    testContextData_app_public();
    testContextData_local_app_global_public_mix();
    testContextData_local_app_global_private_mix();
}

if (typeof (exports) !== 'undefined') {
    exports.testContextData = testContextData;
}
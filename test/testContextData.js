



//jsWorkFlow.Activities.DefineContextDataActivity
//jsWorkFlow.Activities.GetContextDataActivity
//jsWorkFlow.Activities.SetContextDataActivity

//1.在sequence中定义一个local的数据，取数OK；改值，然后取数OK
function testContextData_case1() {

    var seq = new jsWorkFlow.Activities.SequenceActivity();
    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test ContextData [local]');");

    var val1 = new jsWorkFlow.Activities.ConstActivity(100);
    var val2 = new jsWorkFlow.Activities.ConstActivity(200);

    //local
    var def = new jsWorkFlow.Activities.DefineContextDataActivity("val1", val1);
    var get = new jsWorkFlow.Activities.GetContextDataActivity("val1");

    //比较
    var isEqual = new jsWorkFlow.Activities.IsEqualsActivity(get, val1);
    var okExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test get data OK');");
    var errorExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test get data Error');");

    var ifAct = new jsWorkFlow.Activities.IfElseActivity(isEqual, okExpr, errorExpr);

    var set = new jsWorkFlow.Activities.SetContextDataActivity("val1", val2);

    var isEqual2 = new jsWorkFlow.Activities.IsEqualsActivity(get, val2);
    var okExpr2 = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test set data OK');");
    var errorExpr2 = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test set data Error');");

    var ifAct2 = new jsWorkFlow.Activities.IfElseActivity(isEqual2, okExpr2, errorExpr2);

    seq.addActivity(expr);
    seq.addActivity(def);
    seq.addActivity(ifAct);
    seq.addActivity(set);
    seq.addActivity(ifAct2);


    testEngine(seq);
}

//2.在sequence中定义一个global，public的，然后通过auto取数OK，通过auto改值，然后取数OK
function testContextData_case2() {

    var seq = new jsWorkFlow.Activities.SequenceActivity();
    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test ContextData [global+auto]');");

    var val1 = new jsWorkFlow.Activities.ConstActivity(100);
    var val2 = new jsWorkFlow.Activities.ConstActivity(200);

    //global
    var def = new jsWorkFlow.Activities.DefineContextDataActivity("val1", val1, false, jsWorkFlow.DataContextLayer.global);
    var get = new jsWorkFlow.Activities.GetContextDataActivity("val1", jsWorkFlow.DataContextLayer.auto);

    //比较
    var isEqual = new jsWorkFlow.Activities.IsEqualsActivity(get, val1);
    var okExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test get data OK');");
    var errorExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test get data Error');");

    var ifAct = new jsWorkFlow.Activities.IfElseActivity(isEqual, okExpr, errorExpr);

    var set = new jsWorkFlow.Activities.SetContextDataActivity("val1", val2, jsWorkFlow.DataContextLayer.auto);

    var isEqual2 = new jsWorkFlow.Activities.IsEqualsActivity(get, val2);
    var okExpr2 = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test set data OK');");
    var errorExpr2 = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test set data Error');");

    var ifAct2 = new jsWorkFlow.Activities.IfElseActivity(isEqual2, okExpr2, errorExpr2);

    seq.addActivity(expr);
    seq.addActivity(def);
    seq.addActivity(ifAct);
    seq.addActivity(set);
    seq.addActivity(ifAct2);


    testEngine(seq);
}


//3.在sequence中定义一个app，public的，然后通过auto取数OK，通过auto改值，然后取数OK
function testContextData_case3() {

    var seq = new jsWorkFlow.Activities.SequenceActivity();
    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test ContextData [application+auto]');");

    var val1 = new jsWorkFlow.Activities.ConstActivity(100);
    var val2 = new jsWorkFlow.Activities.ConstActivity(200);

    //global
    var def = new jsWorkFlow.Activities.DefineContextDataActivity("val1", val1, false, jsWorkFlow.DataContextLayer.application);
    var get = new jsWorkFlow.Activities.GetContextDataActivity("val1", jsWorkFlow.DataContextLayer.auto);

    //比较
    var isEqual = new jsWorkFlow.Activities.IsEqualsActivity(get, val1);
    var okExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test get data OK');");
    var errorExpr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test get data Error');");

    var ifAct = new jsWorkFlow.Activities.IfElseActivity(isEqual, okExpr, errorExpr);

    var set = new jsWorkFlow.Activities.SetContextDataActivity("val1", val2, jsWorkFlow.DataContextLayer.auto);

    var isEqual2 = new jsWorkFlow.Activities.IsEqualsActivity(get, val2);
    var okExpr2 = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test set data OK');");
    var errorExpr2 = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test set data Error');");

    var ifAct2 = new jsWorkFlow.Activities.IfElseActivity(isEqual2, okExpr2, errorExpr2);

    seq.addActivity(expr);
    seq.addActivity(def);
    seq.addActivity(ifAct);
    seq.addActivity(set);
    seq.addActivity(ifAct2);


    testEngine(seq);
}

//4.在sequence中定义同名的local、app和global，值不同，然后通过local、app、global和auto取值，OK
function testContextData_case4() {

    var seq = new jsWorkFlow.Activities.SequenceActivity();
    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test ContextData [global,application,local+auto]');");

    var val1 = new jsWorkFlow.Activities.ConstActivity(100);
    var val2 = new jsWorkFlow.Activities.ConstActivity(200);
    var val3 = new jsWorkFlow.Activities.ConstActivity(300);

    //global,app,local
    var defGlobal = new jsWorkFlow.Activities.DefineContextDataActivity("val1", val1, false, jsWorkFlow.DataContextLayer.global);
    var defApp = new jsWorkFlow.Activities.DefineContextDataActivity("val1", val2, false, jsWorkFlow.DataContextLayer.application);
    var defLocal = new jsWorkFlow.Activities.DefineContextDataActivity("val1", val3, false, jsWorkFlow.DataContextLayer.local);
    var getGlobal = new jsWorkFlow.Activities.GetContextDataActivity("val1", jsWorkFlow.DataContextLayer.global);
    var getApp = new jsWorkFlow.Activities.GetContextDataActivity("val1", jsWorkFlow.DataContextLayer.application);
    var getLocal = new jsWorkFlow.Activities.GetContextDataActivity("val1", jsWorkFlow.DataContextLayer.local);
    var getAuto = new jsWorkFlow.Activities.GetContextDataActivity("val1", jsWorkFlow.DataContextLayer.auto);

    //比较global
    var isEqualG = new jsWorkFlow.Activities.IsEqualsActivity(getGlobal, val1);
    var okExprG = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test get global data OK');");
    var errorExprG = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test get data Error');");
    var ifActG = new jsWorkFlow.Activities.IfElseActivity(isEqualG, okExprG, errorExprG);

    //比较application
    var isEqualA = new jsWorkFlow.Activities.IsEqualsActivity(getApp, val2);
    var okExprA = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test get application data OK');");
    var errorExprA = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test get application data Error');");
    var ifActA = new jsWorkFlow.Activities.IfElseActivity(isEqualA, okExprA, errorExprA);

    //比较application
    var isEqualL = new jsWorkFlow.Activities.IsEqualsActivity(getLocal, val3);
    var okExprL = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test get local data OK');");
    var errorExprL = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test get local data Error');");
    var ifActL = new jsWorkFlow.Activities.IfElseActivity(isEqualL, okExprL, errorExprL);

    //比较auto，取出的值应该与local相同
    var isEqualAuto = new jsWorkFlow.Activities.IsEqualsActivity(getAuto, val3);
    var okExprAuto = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test get auto data OK');");
    var errorExprAuto = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test get auto data Error');");
    var ifActAuto = new jsWorkFlow.Activities.IfElseActivity(isEqualAuto, okExprAuto, errorExprAuto);

    seq.addActivity(expr);
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
function testContextData_case5() {

    var seq = new jsWorkFlow.Activities.SequenceActivity();
    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test ContextData [private global,application, public local+auto]');");

    var val1 = new jsWorkFlow.Activities.ConstActivity(100);
    var val2 = new jsWorkFlow.Activities.ConstActivity(200);
    var val3 = new jsWorkFlow.Activities.ConstActivity(300);

    //global,app,local
    var defGlobal = new jsWorkFlow.Activities.DefineContextDataActivity("val1", val1, true, jsWorkFlow.DataContextLayer.global);
    var defApp = new jsWorkFlow.Activities.DefineContextDataActivity("val1", val2, true, jsWorkFlow.DataContextLayer.application);
    var defLocal = new jsWorkFlow.Activities.DefineContextDataActivity("val1", val3, false, jsWorkFlow.DataContextLayer.local);
    var getGlobal = new jsWorkFlow.Activities.GetContextDataActivity("val1", jsWorkFlow.DataContextLayer.global);
    var getApp = new jsWorkFlow.Activities.GetContextDataActivity("val1", jsWorkFlow.DataContextLayer.application);
    var getLocal = new jsWorkFlow.Activities.GetContextDataActivity("val1", jsWorkFlow.DataContextLayer.local);
    var getAuto = new jsWorkFlow.Activities.GetContextDataActivity("val1", jsWorkFlow.DataContextLayer.auto);

    //比较global
    var isEqualG = new jsWorkFlow.Activities.IsEqualsActivity(getGlobal, val1);
    var okExprG = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test get global data OK');");
    var errorExprG = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test get data Error');");
    var ifActG = new jsWorkFlow.Activities.IfElseActivity(isEqualG, okExprG, errorExprG);

    //比较application
    var isEqualA = new jsWorkFlow.Activities.IsEqualsActivity(getApp, val2);
    var okExprA = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test get application data OK');");
    var errorExprA = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test get application data Error');");
    var ifActA = new jsWorkFlow.Activities.IfElseActivity(isEqualA, okExprA, errorExprA);

    //比较application
    var isEqualL = new jsWorkFlow.Activities.IsEqualsActivity(getLocal, val3);
    var okExprL = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test get local data OK');");
    var errorExprL = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test get local data Error');");
    var ifActL = new jsWorkFlow.Activities.IfElseActivity(isEqualL, okExprL, errorExprL);

    //比较auto，取出的值应该与local相同
    var isEqualAuto = new jsWorkFlow.Activities.IsEqualsActivity(getAuto, val3);
    var okExprAuto = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test get auto data OK');");
    var errorExprAuto = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test get auto data Error');");
    var ifActAuto = new jsWorkFlow.Activities.IfElseActivity(isEqualAuto, okExprAuto, errorExprAuto);

    seq.addActivity(expr);
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
    testContextData_case1();
    testContextData_case2();
    testContextData_case3();
    testContextData_case4();
    testContextData_case5();
}

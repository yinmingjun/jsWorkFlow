
//使用while做5次循环，每次匹配不同的项目

var _s$varWhileCond = 0;

function _s$whileCondCallback(args) {
    _s$varWhileCond++;
    if (_s$varWhileCond > 5) {
        return false;
    }
    return true;
}

function _s$switchTestProlog(args) {
    window.alert('test No: [' + _s$varWhileCond + ']');
}

//function whileBodyCallback(args) {
//    window.alert("in callback function, time[" + _s$varWhileCond + "].");
//}

var _s$varSwitchCond = ["t1", "t5", "t2", "t3", "t4"];

//switch的条件，每次循环给不同的返回值
function _s$switchCond(args) {
    var cond = _s$varSwitchCond[_s$varWhileCond - 1];
    window.alert("switch condition is:[" + cond + "].");

    return cond;
}

function _s$elseActivityCallback(args) {
    window.alert("in _s$elseActivityCallback function.");
}

function _s$caseCondCallback(args) {
    var callbackData = args.get_callbackData();
    window.alert("in _s$caseCondCallback function, condition is [" + callbackData + "].");
    return callbackData;
}

function _s$caseBodyCallback(args) {
    var callbackData = args.get_callbackData();
    window.alert("in _s$caseBodyCallback function, condition is [" + callbackData + "].");
    return callbackData;
}

//jsWorkFlow.Activities.SwitchActivity

function _s$buildSwitchActivity() {
    //build switch
    var cAct = new jsWorkFlow.Activities.FunctionActivity(_s$switchCond);
    var eAct = new jsWorkFlow.Activities.FunctionActivity(_s$elseActivityCallback);
    var allCase = [
            { key: new jsWorkFlow.Activities.FunctionActivity(_s$caseCondCallback, "t1"),
                value: new jsWorkFlow.Activities.FunctionActivity(_s$caseBodyCallback, "t1")
            },
            { key: new jsWorkFlow.Activities.FunctionActivity(_s$caseCondCallback, "t2"),
                value: new jsWorkFlow.Activities.FunctionActivity(_s$caseBodyCallback, "t2")
            },
            { key: new jsWorkFlow.Activities.FunctionActivity(_s$caseCondCallback, "t3"),
                value: new jsWorkFlow.Activities.FunctionActivity(_s$caseBodyCallback, "t3")
            },
            { key: new jsWorkFlow.Activities.FunctionActivity(_s$caseCondCallback, "t4"),
                value: new jsWorkFlow.Activities.FunctionActivity(_s$caseBodyCallback, "t4")
            }];

    var swth = new jsWorkFlow.Activities.SwitchActivity(cAct, eAct, allCase);
    return swth;
}

function testSwitch() {

    _s$varWhileCond = 0;

    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test Switch, test 5 times');");
    var wCond = new jsWorkFlow.Activities.FunctionActivity(_s$whileCondCallback);

    var expr2 = new jsWorkFlow.Activities.FunctionActivity(_s$switchTestProlog);
    var swth = _s$buildSwitchActivity();
    var seq2 = new jsWorkFlow.Activities.SequenceActivity();
    seq2.addActivity(expr2);
    seq2.addActivity(swth);

    var wAct = new jsWorkFlow.Activities.WhileActivity(wCond, seq2);

    var seq = new jsWorkFlow.Activities.SequenceActivity();

    seq.addActivity(expr);
    seq.addActivity(wAct);

    testEngine(seq);


}

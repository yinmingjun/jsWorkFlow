
var _w$varWhileCond = 0;

function _w$whileCondCallback(args) {
    _w$varWhileCond++;
    if (_w$varWhileCond > 5) {
        return false;
    }
    return true;
} 

function _w$whileBodyCallback(args) {
    window.alert("in callback function, time["+_w$varWhileCond+"].");
}


//jsWorkFlow.Activities.WhileActivity
function testWhile() {
    _w$varWhileCond = 0;
    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test While, 5 times');");
    var wCond = new jsWorkFlow.Activities.FunctionActivity(_w$whileCondCallback);
    var wBody = new jsWorkFlow.Activities.FunctionActivity(_w$whileBodyCallback);
    var wAct = new jsWorkFlow.Activities.WhileActivity(wCond, wBody);

    var seq = new jsWorkFlow.Activities.SequenceActivity();

    seq.addActivity(expr);
    seq.addActivity(wAct);

    testEngine(seq);
}

//测试Engine和EvalExprActivity 

function testEngine(rootActivity) {

    var expr = new jsWorkFlow.Activities.EvalExprActivity("window.alert('test engine OK!');");
    var ins = new jsWorkFlow.Instance();

    ins.add_complete(function () {
        window.alert("test engine complete!");
    });

    if (!rootActivity) {
        rootActivity = expr;
    }

    ins.set_rootActivity(rootActivity);
    var app = new jsWorkFlow.Application(ins);

    app.run();
}

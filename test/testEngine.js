
var jso = jsoop;

//require namsepace
var jsWorkFlow = jso.ns('jsWorkFlow');

//测试Engine和EvalExprActivity
//如果有rootActivity，表示使用testEngine建立测试框架，并不是运行该测试案例
function testEngine(rootActivity) {

    var ins = new jsWorkFlow.Instance();

    if (!rootActivity) {
        var noop = new jsWorkFlow.Activities.NoopActivity();
        rootActivity = noop;

        ins.add_complete(function () {
            unitTestFW.test("testEngine", function () { unitTestFW.ok(true, "Passed!"); });
        });

    }

    ins.set_rootActivity(rootActivity);
    var app = new jsWorkFlow.Application(ins);

    app.run();
}

if (typeof (exports) !== 'undefined') {
    exports.testEngine = testEngine;
}
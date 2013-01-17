
//测试Engine和EvalExprActivity
//如果有rootActivity，表示使用testEngine建立测试框架，并不是运行该测试案例
function testEngine(rootActivity) {

    var noop = new jsWorkFlow.Activities.NoopActivity();
    var ins = new jsWorkFlow.Instance();

    if (!rootActivity) {
        rootActivity = noop;

        ins.add_complete(function () {
            var log = jwf$getLogger();
            log.debug("test engine complete!");

            test("testEngine", function () { ok(true, "Passed!"); });
        });

    }

    ins.set_rootActivity(rootActivity);
    var app = new jsWorkFlow.Application(ins);

    app.run();
}

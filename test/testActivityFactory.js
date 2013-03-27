


function testActivityFactory_loadTemplateSimple() {
    var jsDoc = {
        id: "noop1",
        type: "jsWorkFlow.Activities.NoopActivity"
    };

    var factory = new jsWorkFlow.ActivityFactory();

    factory.registerTemplate(jsDoc);
    var obj = factory.getObject("noop1");

    unitTestFW.test("testActivityFactory_loadTemplateSimple_1", function () { unitTestFW.ok(obj, "Passed!"); });
    unitTestFW.test("testActivityFactory_loadTemplateSimple_2", function () { unitTestFW.ok(jso.getTypeName(jso.getInstanceType(obj)) === "jsWorkFlow.Activities.NoopActivity", "Passed!"); });
}

//create EvalExprActivity by constructor, and run it
function testActivityFactory_loadTemplateEval_by_constructor() {
    var jsDoc = {
        id: "eval1",
        type: "jsWorkFlow.Activities.EvalExprActivity",
        constructors: ["unitTestFW.test('testActivityFactory_loadTemplateEval_by_constructor_innerCase_C', function () { unitTestFW.ok(true, 'Passed!'); });"]
    };

    var factory = new jsWorkFlow.ActivityFactory();

    factory.registerTemplate(jsDoc);
    var obj = factory.getObject("eval1");

    unitTestFW.test("testActivityFactory_loadTemplateEval_by_constructor_OuterCase", function () { unitTestFW.ok(obj, "Passed!"); });
    testEngine(obj);
}

//create EvalExprActivity by property, and run it
function testActivityFactory_loadTemplateEval_by_prop() {
    var jsDoc = {
        id: "eval1",
        type: "jsWorkFlow.Activities.EvalExprActivity",
        properties: {
            expr: "unitTestFW.test('testActivityFactory_loadTemplateEval_by_prop_innerCase_P', function () { unitTestFW.ok(true, 'Passed!'); });"
        }
    };

    var factory = new jsWorkFlow.ActivityFactory();

    factory.registerTemplate(jsDoc);
    var obj = factory.getObject("eval1");

    unitTestFW.test("testActivityFactory_loadTemplateEval_by_prop_OuterCase", function () { unitTestFW.ok(obj, "Passed!"); });
    testEngine(obj);
}

//create a sequence, run three step.
function testActivityFactory_loadTemplateSeq() {
    var jsDoc = [{
        id: "eval1",
        type: "jsWorkFlow.Activities.EvalExprActivity",
        properties: {
            expr: "unitTestFW.test('testActivityFactory_loadTemplateSeq_innerCase_1', function () { unitTestFW.ok(true, 'Passed!'); });"
        }
    },
    {
        id: "eval2",
        type: "jsWorkFlow.Activities.EvalExprActivity",
        properties: {
            expr: "unitTestFW.test('testActivityFactory_loadTemplateSeq_innerCase_2', function () { unitTestFW.ok(true, 'Passed!'); });"
        }
    },
    {
        id: "eval3",
        type: "jsWorkFlow.Activities.EvalExprActivity",
        properties: {
            expr: "unitTestFW.test('testActivityFactory_loadTemplateSeq_innerCase_3', function () { unitTestFW.ok(true, 'Passed!'); });"
        }
    },
    {
        id: "seq",
        type: "jsWorkFlow.Activities.SequenceActivity",
        properties: {
            activities: ["eval1", "eval2", "eval3"]
        }
    }];

    var factory = new jsWorkFlow.ActivityFactory();

    factory.registerTemplate(jsDoc);
    var obj = factory.getObject("seq");
    testEngine(obj);
}

//create a sequence, run three step.
function testActivityFactory_loadTemplateSeqObjDesc() {
    var jsDoc = [{
        id: "eval1",
        type: "jsWorkFlow.Activities.EvalExprActivity",
        properties: {
            expr: { '__v': true, 'val': "unitTestFW.test('testActivityFactory_loadTemplateSeqObjDesc_innerCase_1', function () { unitTestFW.ok(true, 'Passed!'); });" }
        }
    },
    {
        id: "eval2",
        type: "jsWorkFlow.Activities.EvalExprActivity",
        properties: {
            expr: { '__v': true, 'val': "unitTestFW.test('testActivityFactory_loadTemplateSeqObjDesc_innerCase_2', function () { unitTestFW.ok(true, 'Passed!'); });" }
        }
    },
    {
        id: "eval3",
        type: "jsWorkFlow.Activities.EvalExprActivity",
        properties: {
            expr: { '__v': true, 'val': "unitTestFW.test('testActivityFactory_loadTemplateSeqObjDesc_innerCase_3', function () { unitTestFW.ok(true, 'Passed!'); });" }
        }
    },
    {
        id: "seq",
        type: "jsWorkFlow.Activities.SequenceActivity",
        properties: {
            activities: [
            { '__v': true, 'ref': "eval1" },
            { '__v': true, 'ref': "eval2" }, 
            { '__v': true, 'ref': "eval3"}]
        }
    }];

    var factory = new jsWorkFlow.ActivityFactory();

    factory.registerTemplate(jsDoc);
    var obj = factory.getObject("seq");
    testEngine(obj);
}


function testActivityFactory() {
    testActivityFactory_loadTemplateSimple();
    testActivityFactory_loadTemplateEval_by_constructor();
    testActivityFactory_loadTemplateEval_by_prop();
    testActivityFactory_loadTemplateSeq();
    testActivityFactory_loadTemplateSeqObjDesc();
}

if (typeof (exports) !== 'undefined') {
    exports.testActivityFactory = testActivityFactory;
}
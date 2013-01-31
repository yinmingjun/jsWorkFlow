
//jsWorkFlow.Activities.GetTypeNameActivity
function testGetTypeName() {
    function testGetObjType(obj, typeName, testCaseName) {
        var objConstA = new jsWorkFlow.Activities.ConstActivity(obj);
        var constExptSA = new jsWorkFlow.Activities.ConstActivity(typeName);
        var getTypeA = new jsWorkFlow.Activities.GetTypeNameActivity(objConstA);
        var isEA = new jsWorkFlow.Activities.IsEqualsActivity(constExptSA, getTypeA);

        var okA = new jsWorkFlow.Activities.EvalExprActivity("test('testGetTypeName - " + testCaseName + "', function () { ok(true, 'Passed!'); });");
        var errorA = new jsWorkFlow.Activities.EvalExprActivity("test('testGetTypeName - " + testCaseName + "', function () { ok(false, 'Passed!'); });");

        var ifA = new jsWorkFlow.Activities.IfElseActivity(isEA, okA, errorA);

        testEngine(ifA);
    }


    testGetObjType(null, "", "null");
    testGetObjType("test", "String", "String");
    testGetObjType(123, "Number", "Number");
    testGetObjType(new Date(), "Date", "Date");
    testGetObjType(testGetTypeName, "Function", "Function");
    testGetObjType(new jsWorkFlow.Activities.ConstActivity(null), "jsWorkFlow.Activities.ConstActivity", "Class");
}

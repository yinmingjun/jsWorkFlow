
var jsoop = require('jsoop');
var wf = require('../../build/jsworkflow');
var testLib = require('../../prebuild/test-debug');

testLib.testEngine();
testLib.testNoop();
testLib.testSequence();
testLib.testDelay();
testLib.testFunc();
testLib.testIfElse();
testLib.testParallel();
testLib.testWhile();
testLib.testSwitch();
testLib.testContextData();
testLib.testLogicalOpt();
testLib.testStateMachine();
testLib.testTryCatch();
testLib.testGetTypeName();
testLib.testActivityFactory();
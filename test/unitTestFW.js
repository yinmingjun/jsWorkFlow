
var unitTestFW = {};

function unitTestFW$test(title, callback) {
    console.log(title);
    callback();
}

function unitTestFW$ok(val, msg) {
    var title = "[ok   ]  ";
    if (!val) {
        title = '[error]  '
    }

    console.log(title + '%s', msg);
}

if (typeof (test) !== 'undefined') {
    unitTestFW.test = test;
}
else {
    unitTestFW.test = unitTestFW$test;
}

if (typeof (ok) !== 'undefined') {
    unitTestFW.ok = ok;
}
else {
    unitTestFW.ok = unitTestFW$ok;
}

//publish to global
if (typeof(global) !== 'undefined') {
    global.unitTestFW = unitTestFW;
}
else {
    window.unitTestFW = unitTestFW;
}

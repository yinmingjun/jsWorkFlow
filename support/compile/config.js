
var config = {
    destFile: './prebuild/jsworkflow_browser.js',
    destModule: 'jsworkflowlib',
    requireFiles: [{
        file: './prebuild/jsworkflow-debug.js',
        mod: 'jsworkflowlib'
    }]
};

exports.config = config;

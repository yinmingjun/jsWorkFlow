
var config = {
    destFile: './prebuild/jsworkflow_browser.js',
    destModule: 'jsworkflowns',
    requireFiles: [{
        file: './prebuild/jsworkflow-debug.js',
        mod: 'jsworkflowns'
    }]
};

exports.config = config;

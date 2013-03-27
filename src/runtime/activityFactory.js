
/*
* jsWorkFlow's activity factory source code.
* 2013.03.26: Create By Yin Mingjun - email: yinmingjuncn@gmail.com
* 
* Copyright 2013,  Yin MingJun - email: yinmingjuncn@gmail.com
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
*/

//find root ns
var jsWorkFlow = jso.ns('jsWorkFlow');

//  provide the activity that use by other user.
//  main API:
//      registerTemplate(jsDoc)  --> register activity template
//      getTemplate(id)            --> get activity template
//      clearTemplates()           --> clear templates
//      registerObject(id, obj)    --> register object single instance
//      clearObjects()             --> clear activity registry
//      *tryGetObject(id)          --> from registry, or create from template and add to activity registry 
//      *getObject(id)             --> from registry, or create from template and add to activity registry 
//      *tryCreateObject(id)       --> from template, and don't add to activity registry
//      *createObject(id)          --> from template, and don't add to activity registry
//
//[
//{
//    //document of descript an activity
//    'id': 'xxxx',               //>>>> is the uniqueName in activity factory
//    'type': 'jsWorkFlow.Activities.SequenceActivity',
//    'properties':{
//    	'name': 'xxxx',		//>>>> the display name of activity
//        'activities': [value1, value1, value1], //should use the name of activity
//        'other_prop': 'xxx'
//    }
//	'constructors':[value1, value2, value3],
//},
//{
//    //document of descript an instance
//    'id': 'xxxx',               //>>>> is the uniqueName in activity factory
//    'type': 'jsWorkFlow.Instance',
//    'properties':{
//    	'name': 'xxxx',		//>>>> the display name of activity
//      'activities': ['activity1', 'activity1', 'activity1'], //should use the name of activity
//      'other_prop': 'xxx'
//    }
//},
//{
//    //document of descript an application
//    'id': 'xxxx',               //>>>> is the uniqueName in activity factory
//    'type': 'jsWorkFlow.Application',
//    'properties':{
//    	'name': 'xxxx',		//>>>> the display name of activity
//        'activities': ['activity1', 'activity1', 'activity1'], //should use the name of activity
//        'other_prop': 'xxx'
//    }
//}
//]
//
//value description:
//  "string", 123, Date, Number, Array, Object are all simple value.
//  if object has __v propery with false boolean value, is a simple value.
//  if object has __v propery with true boolean value, see follow:
//	    1. with ref property with string value, is activity instance reference.
//	    2. with val property with json value, the val is simple value

jsWorkFlow.ActivityFactory = function jsWorkFlow_ActivityFactory() {
    this._templates = {};
    this._registry = {};
};

function jsWorkFlow_ActivityFactory$dispose() {
    this._templates = {};
    this._registry = {};
}

function _jsw_af$verifyTemplate(jsDoc) {
    if (!jsDoc) {
        throw jso.errorInvalidOperation("invalid template");
    }

    if (!jsDoc["id"] || !jsDoc["type"]) {
        throw jso.errorInvalidOperation("invalid template");
    }

    //add other rule here
}

function jsWorkFlow_ActivityFactory$registerTemplate(jsDoc) {
    if(!jsDoc) {
        throw jso.errorArgument("jsDoc", "undefined");
    }

    if(!jso.isArray(jsDoc)) {
        jsDoc = [jsDoc];
    }

    for(var i=0, ilen=jsDoc.length; i<ilen;i++) {
        var curDoc = jsDoc[i];

        _jsw_af$verifyTemplate(curDoc);
        this._templates[curDoc.id] = curDoc;

    }
    
    //OK
}

function jsWorkFlow_ActivityFactory$getTemplate(id) {
    return this._templates[id];
}

function jsWorkFlow_ActivityFactory$clearTemplates() {
    this._templates = {};
}

function jsWorkFlow_ActivityFactory$registerObject(id, obj) {
    this._registry[id] = obj;
}

function jsWorkFlow_ActivityFactory$clearObjects() {
    this._registry = {};
}

//from registry, or create from template and add to activity registry
function jsWorkFlow_ActivityFactory$tryGetObject(id) {
    var obj = this._registry[id];

    if (!obj) {
        obj = this.tryCreateObject(id);
        if (obj) {
            this._registry[id] = obj;
        }
    }

    return obj;

}

//from registry, or create from template and add to activity registry
function jsWorkFlow_ActivityFactory$getObject(id) {
    var obj = this._registry[id];

    if (!obj) {
        obj = this.createObject(id);
        if (obj) {
            this._registry[id] = obj;
        }
    }

    return obj;

}

//process ref and val property
function _jsw_af$createValueByDesc(valueDesc, objFactory) {
    var retval = null;

    if (valueDesc.ref) {
        //get object instance from factory
        retval = objFactory.getObject(valueDesc.ref);
    }
    else if (valueDesc.val) {
        retval = valueDesc.val;
    }

    return retval;
}

//process array, object and pure value
//value description:
//  "string", 123, Date, Number, Array, Object are all simple value.
//      1. when is not strict mode, string value may is a ID of object.
//  if object has __v propery with false boolean value, is a simple value.
//  if object has __v propery with true boolean value, see follow:
//	    1. with ref property with string value, is activity instance reference.
//	    2. with val property with json value, the val is simple value
function _jsw_af$createValue(valueDesc, objFactory, strict) {
    var retval = null;

    if(!valueDesc) {
        return retval;
    }

    if (jso.isArray(valueDesc)) {
        //build array value 
        retval = [];
        for (var i = 0, ilen = valueDesc.length; i < ilen; i++) {
            //consider every element is a value descriptor
            var curValDesc = valueDesc[i];
            var curVal = _jsw_af$createValue(curValDesc, objFactory, strict);
            jso.arrayAdd(retval, curVal);
        }
    } else if (jso.isPureObject(valueDesc)) {
        if (!!valueDesc['__v']) {
            //is a value descriptor
            retval = _jsw_af$createValueByDesc(valueDesc, objFactory);
        }
        else {
            //is a simple value object 
            //build object value 
            retval = {};
            for (var key in valueDesc) {
                if (key === '__v') {
                    //ignore the value descriptor flag.
                    continue;
                }
                //consider every key is a value descriptor
                var curValDesc = valueDesc[key];
                var curVal = _jsw_af$createValue(curValDesc, objFactory, strict);
                retval[key] = curVal;
            }
        }
    } else {
        //string value may represent a object reference when is not strict mode
        if (jso.isString(valueDesc) && !strict) {
            //try get object from factory
            var obj = objFactory.tryGetObject(valueDesc);

            if (obj) {
                retval = obj;
            }
            else {
                retval = valueDesc;
            }
        }
        else {
            //simple value, just return it
            retval = valueDesc;
        }
    }

    return retval;

}

function _jsw_af$applyProperties(ins, props) {
    for (var prop in props) {
        var setProp = "set_"+prop;
        var method = ins[setProp];
        var propValue = props[prop];

        if (!method) {
            throw jso.errorNotExists("property:[" + setProp + "]");
        }

        //set property value
        method.apply(ins, [propValue]);
    }
}

//create a object instance of a type.
function _jsw_af$createObject(jsDoc, objFactory) {

    //first of all, get type from jsDoc
    var typeName = jsDoc['type'];
    var strict = !!jsDoc['strict'];

    //get constructor params of doc
    var constructorsDesc = jsDoc['constructors'];

    //properties of doc
    var propertiesDesc = jsDoc['properties'];

    var type = jso.getType(typeName);

    if (!type) {
        throw jso.errorNotExists("type:[" + typeName + "]");
    }

    //build constructor
    var constrctors = _jsw_af$createValue(constructorsDesc, objFactory, strict);

    //build properties
    var properties = {};
    for (var key in propertiesDesc) {
        var curPropValueDesc = propertiesDesc[key];
        var curPropValue = _jsw_af$createValue(curPropValueDesc, objFactory, strict);
        properties[key] = curPropValue;
    }

    //create object and set properties
    var instance = jso.createInstance(type, constrctors);

    //apply properties
    _jsw_af$applyProperties(instance, properties);

    return instance;
}

function jsWorkFlow_ActivityFactory$tryCreateObject(id) {
    var jsDoc = this.getTemplate(id);

    if (!jsDoc) {
        return null;
    }

    //create activity by template
    var obj = _jsw_af$createObject(jsDoc, this);

    return obj;
}


//from template, and don't add to activity registry
function jsWorkFlow_ActivityFactory$createObject(id) {
    var jsDoc = this.getTemplate(id);

    if (!jsDoc) {
        throw jso.errorNotExists("id:[" + id + "]");
    }

    //create activity by template
    var obj = _jsw_af$createObject(jsDoc, this);

    return obj;
}

jsWorkFlow.ActivityFactory.prototype = {
    _templates: null,
    _registry: null,
    //method
    dispose: jsWorkFlow_ActivityFactory$dispose,
    registerTemplate: jsWorkFlow_ActivityFactory$registerTemplate,
    getTemplate: jsWorkFlow_ActivityFactory$getTemplate,
    clearTemplates: jsWorkFlow_ActivityFactory$clearTemplates,
    registerObject: jsWorkFlow_ActivityFactory$registerObject,
    clearObjects: jsWorkFlow_ActivityFactory$clearObjects,
    tryGetObject: jsWorkFlow_ActivityFactory$tryGetObject,
    getObject: jsWorkFlow_ActivityFactory$getObject,
    tryCreateObject: jsWorkFlow_ActivityFactory$tryCreateObject,
    createObject: jsWorkFlow_ActivityFactory$createObject
};

jso.registerClass(jso.setTypeName(jsWorkFlow.ActivityFactory, 'jsWorkFlow.ActivityFactory'));

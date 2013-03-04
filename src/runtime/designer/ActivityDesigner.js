/*
* jsWorkFlow's general activity designer.
* 2012.09.19: Create By Yin Mingjun - email: yinmingjuncn@gmail.com
* 
* Copyright 2012,  Yin MingJun - email: yinmingjuncn@gmail.com
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
*/

//require namsepace
//jsWorkFlow.Activities namespace registed at core
jsoop.ns('jsWorkFlow.Activities', true);
var jsWorkFlow = jsoop.ns('jsWorkFlow');



//////////////////////////////////////////////////////////////////////////////////////////
//ActivityDesigner，表示一个jsWorkFlow Activity的通用的activity的property designer
//
// To 开发者：
//    根据activity的注册信息，展示activity的编辑器，并将编辑结果同步到文档。
//
jsWorkFlow.Designer.ActivityDesigner = function jsWorkFlow_Designer_ActivityDesigner() {
    jsoop.initializeBase(jsWorkFlow.Designer.ActivityDesigner, this);
};

function jsWorkFlow_Designer_ActivityDesigner$dispose() {
    jsoop.callBaseMethod(jsWorkFlow.Designer.ActivityDesigner, this, 'dispose');
}

//提供ActivityDesigner对应activity的名字，字符串类型
function jsWorkFlow_Designer_ActivityDesigner$get_activityTypeName() {
}

function jsWorkFlow_Designer_ActivityDesigner$set_activityTypeName(value) {
}

//TODO:
//根据选择的activity的名字加载activity的designer info，展开设计器，进行设计属性的收集

jsWorkFlow.Designer.ActivityDesigner.prototype = {
    dispose: jsWorkFlow_Designer_ActivityDesigner$dispose,
    //property
    get_activityTypeName: jsWorkFlow_Designer_ActivityDesigner$get_activityTypeName,
    set_activityTypeName: jsWorkFlow_Designer_ActivityDesigner$set_activityTypeName
};

jsoop.registerClass(
    jsoop.setTypeName(jsWorkFlow.Designer.ActivityDesigner, 'jsWorkFlow.Designer.ActivityDesigner'), 
    jsWorkFlow.PropertyDesignerBase);

////////////////////////////////////////////////////////////////////////////
//内部的设计器的名称

//TODO
//注册core.js中的activity
$jwf.registerActivity(
    //注册的activity
    jsWorkFlow.Activity,
    //activityInfo
    {
        catalog: "",
        description: "",
        supportInstance: false, //仅可以通过派生类获取设计器信息，不允许通过设计器实例化
        designerRuntimeProps: null
    },
    //activity的属性设计信息列表
    [{ propName: "name",
        propDesignerName: "jsWorkFlow.Designer.StringValueDesigner",  //string designer
        description: "The activity's name, should be unique!",
        designerRuntimeProps: null
    },
     { propName: "errorStrategy",
         propDesignerName: "jsWorkFlow.Designer.EnumValueDesigner",
         description: "errorStrategy",
         designerRuntimeProps: { enumType: "jsWorkFlow.ActivityExecuteStrategy" }
     }
    ]);


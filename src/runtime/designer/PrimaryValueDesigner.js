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
//PrimaryValueDesignerBase，表示基本数值的designer基类
//
// To 开发者：
//    提供基本数值的编辑功能，对应的编辑对象是一个小div的区域，是在seperate line和end line之间的区域。
//    包含：一个文本框
//
jsWorkFlow.Designer.PrimaryValueDesignerBase = function jsWorkFlow_Designer_PrimaryValueDesignerBase() {
    jsoop.initializeBase(jsWorkFlow.Designer.PrimaryValueDesignerBase, this);
};

function jsWorkFlow_Designer_PrimaryValueDesignerBase$dispose() {
    jsoop.callBaseMethod(jsWorkFlow.Designer.PrimaryValueDesignerBase, this, 'dispose');
}

function jsWorkFlow_Designer_PrimaryValueDesignerBase$add_valueChanged(handler) {
    throw jsoop.errorNotImplemented();
    //TODO:
    // add handler    
}

function jsWorkFlow_Designer_PrimaryValueDesignerBase$remove_valueChanged(handler) {
    throw jsoop.errorNotImplemented();
    //TODO:
    // remove handler    
}


//value property
function jsWorkFlow_Designer_PrimaryValueDesignerBase$get_value() {
    throw jsoop.errorNotImplemented();
    //TODO:
    // get value
}

//value property
function jsWorkFlow_Designer_PrimaryValueDesignerBase$set_value(value) {
    throw jsoop.errorNotImplemented();
    //TODO:
    // set value
}


//显示编辑页面，开始编辑值
function jsWorkFlow_Designer_PrimaryValueDesignerBase$execute(serializeContext) {
    throw jsoop.errorNotImplemented();

    //serializeContext是传递给designer的文档，用于初始化可编辑的activity
    //最终serializeContext也可以传递给activity的构造器，可以创建出activity的活动树

}

jsWorkFlow.Designer.PrimaryValueDesignerBase.prototype = {
    dispose: jsWorkFlow_Designer_PrimaryValueDesignerBase$dispose,
    //events
    add_valueChanged: jsWorkFlow_Designer_PrimaryValueDesignerBase$add_valueChanged,
    remove_valueChanged: jsWorkFlow_Designer_PrimaryValueDesignerBase$remove_valueChanged,
    //property
    get_value: jsWorkFlow_Designer_PrimaryValueDesignerBase$get_value,
    set_value: jsWorkFlow_Designer_PrimaryValueDesignerBase$set_value

    //from PropertyDesignerBase class:
    //method
    //get_siteInfo: jsWorkFlow_PropertyDesignerBase$get_siteInfo,
    //method
    //active: jsWorkFlow_PropertyDesignerBase$active,
    //deactive: jsWorkFlow_PropertyDesignerBase$deactive
};

jsoop.registerClass(
    jsoop.setTypeName(jsWorkFlow.Designer.PrimaryValueDesignerBase, 'jsWorkFlow.Designer.PrimaryValueDesignerBase'),
    jsWorkFlow.PropertyDesignerBase);

//////////////////////////////////////////////////////////////////////
//下面是各种简单属性值的编辑器
//TODO:
//  实现下面的基本属性编辑器

//////////////////////////////////////////////////////////////////////
//jsWorkFlow.Designer.StringValueDesigner

//////////////////////////////////////////////////////////////////////
//jsWorkFlow.Designer.NumberValueDesigner

//////////////////////////////////////////////////////////////////////
//jsWorkFlow.Designer.IntValueDesigner，jsWorkFlow.Designer.NumberValueDesigner的特化

//////////////////////////////////////////////////////////////////////
//jsWorkFlow.Designer.FloatValueDesigner，jsWorkFlow.Designer.NumberValueDesigner的特化

//////////////////////////////////////////////////////////////////////
//jsWorkFlow.Designer.BooleanValueDesigner

//////////////////////////////////////////////////////////////////////
//jsWorkFlow.Designer.DateTimeValueDesigner

//////////////////////////////////////////////////////////////////////
//jsWorkFlow.Designer.DateValueDesigner，jsWorkFlow.Designer.DateTimeValueDesigner的特化

//////////////////////////////////////////////////////////////////////
//jsWorkFlow.Designer.TimeValueDesigner，jsWorkFlow.Designer.DateTimeValueDesigner的特化

//////////////////////////////////////////////////////////////////////
//jsWorkFlow.Designer.StringEnumValueDesigner,对应string的可枚举值的设计器

//////////////////////////////////////////////////////////////////////
//jsWorkFlow.Designer.EnumValueDesigner,对应枚举类型的设计器


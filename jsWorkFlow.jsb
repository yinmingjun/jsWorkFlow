<?xml version="1.0" encoding="utf-8"?>
<project path="" name="jsWorkFlow" author="Yin Mingjun" version="0.5" copyright="  $projectName&#xD;&#xA;  Copyright(c) 2012, $author.&#xD;&#xA;&#xD;&#xA; jsWorkFlow's Project&#xD;&#xA;     2012.03.06: Create By Yin Mingjun - email: yinmingjuncn@gmail.com&#xD;&#xA;  &#xD;&#xA;  Copyright 2012,  Yin MingJun - email: yinmingjuncn@gmail.com&#xD;&#xA;  Dual licensed under the MIT or GPL Version 2 licenses.&#xD;&#xA;  http://jquery.org/license&#xD;&#xA; " output="$project\build" source="True" source-dir="$output\source" minify="true" min-dir="$output\build" doc="False" doc-dir="$output\docs" master="true" master-file="$output\yui-ext.js" zip="true" zip-file="$output\yuo-ext.$version.zip">
  <directory name="src" />
  <file name="src\runtime\activities\DelayActivity.js" path="runtime\activities" />
  <file name="src\runtime\activities\EvalExprActivity.js" path="runtime\activities" />
  <file name="src\runtime\activities\FunctionActivity.js" path="runtime\activities" />
  <file name="src\runtime\activities\IfElseActivity.js" path="runtime\activities" />
  <file name="src\runtime\activities\NoopActivity.js" path="runtime\activities" />
  <file name="src\runtime\activities\ParallelActivity.js" path="runtime\activities" />
  <file name="src\runtime\activities\SequenceActivity.js" path="runtime\activities" />
  <file name="src\runtime\activities\StateMachineActivity.js" path="runtime\activities" />
  <file name="src\runtime\activities\SwitchActivity.js" path="runtime\activities" />
  <file name="src\runtime\activities\WhileActivity.js" path="runtime\activities" />
  <file name="src\runtime\core.js" path="runtime" />
  <target name="jsWorkFlow debug" file="$output\jsWorkFlow.js" debug="True" shorthand="False" shorthand-list="YAHOO.util.Dom.setStyle&#xD;&#xA;YAHOO.util.Dom.getStyle&#xD;&#xA;YAHOO.util.Dom.getRegion&#xD;&#xA;YAHOO.util.Dom.getViewportHeight&#xD;&#xA;YAHOO.util.Dom.getViewportWidth&#xD;&#xA;YAHOO.util.Dom.get&#xD;&#xA;YAHOO.util.Dom.getXY&#xD;&#xA;YAHOO.util.Dom.setXY&#xD;&#xA;YAHOO.util.CustomEvent&#xD;&#xA;YAHOO.util.Event.addListener&#xD;&#xA;YAHOO.util.Event.getEvent&#xD;&#xA;YAHOO.util.Event.getTarget&#xD;&#xA;YAHOO.util.Event.preventDefault&#xD;&#xA;YAHOO.util.Event.stopEvent&#xD;&#xA;YAHOO.util.Event.stopPropagation&#xD;&#xA;YAHOO.util.Event.stopEvent&#xD;&#xA;YAHOO.util.Anim&#xD;&#xA;YAHOO.util.Motion&#xD;&#xA;YAHOO.util.Connect.asyncRequest&#xD;&#xA;YAHOO.util.Connect.setForm&#xD;&#xA;YAHOO.util.Dom&#xD;&#xA;YAHOO.util.Event">
    <include name="src\runtime\core.js" />
    <include name="src\runtime\log.js" />
    <include name="src\runtime\activities\DelayActivity.js" />
    <include name="src\runtime\activities\EvalExprActivity.js" />
    <include name="src\runtime\activities\FunctionActivity.js" />
    <include name="src\runtime\activities\IfElseActivity.js" />
    <include name="src\runtime\activities\NoopActivity.js" />
    <include name="src\runtime\activities\GetExceptionActivity.js" />
    <include name="src\runtime\activities\ContextDataActivity.js" />
    <include name="src\runtime\activities\ParallelActivity.js" />
    <include name="src\runtime\activities\SequenceActivity.js" />
    <include name="src\runtime\activities\StateMachineActivity.js" />
    <include name="src\runtime\activities\SwitchActivity.js" />
    <include name="src\runtime\activities\WhileActivity.js" />
    <include name="src\runtime\activities\LogicOptActivity.js" />
    <include name="src\runtime\activities\ConstActivity.js" />
    <include name="src\runtime\activities\CompareActivity.js" />
    <include name="src\runtime\designer\PrimaryValueDesigner.js" />
    <include name="src\runtime\designer\ActivityDesigner.js" />
    <include name="src\runtime\activities\TryCatchActivity.js" />
    <include name="src\runtime\activities\RaiseExceptionActivity.js" />
    <include name="src\runtime\activities\GetTypeNameActivity.js" />
  </target>
  <file name="src\runtime\designer\ActivityDesigner.js" path="runtime\designer" />
  <file name="src\runtime\designer\PrimaryValueDesigner.js" path="runtime\designer" />
  <file name="src\runtime\activities\ContextDataActivity.js" path="runtime\activities" />
  <file name="src\runtime\activities\CompareActivity.js" path="runtime\activities" />
  <file name="src\runtime\activities\ConstActivity.js" path="runtime\activities" />
  <file name="src\runtime\activities\IsEqualsActivity.js" path="runtime\activities" />
  <file name="src\runtime\activities\LogicOptActivity.js" path="runtime\activities" />
  <file name="src\runtime\activities\RaiseExceptionActivity.js" path="runtime\activities" />
  <file name="src\runtime\activities\TryCatchActivity.js" path="runtime\activities" />
  <file name="src\runtime\log.js" path="runtime" />
  <file name="src\runtime\activities\GetExceptionActivity.js" path="runtime\activities" />
  <file name="src\runtime\activities\GetTypeNameActivity.js" path="runtime\activities" />
</project>
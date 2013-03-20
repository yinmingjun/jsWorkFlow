
# jsWorkFlow
============

It's a workflow engine write by javascript. jsWorkFlow let you execute javascript
code in order. jsWorkFlow Support both node and client side.

## Introduction
---------------
There are all kinds of asynchronous operation in javascript. We offen provide
closure to this situation. The weakness of it is we can't write code by function.
Workflow can avoid this defect. If there are a designer's support, we can do
things in order easily.

Also, Model-Driven Developement(MDD) is very important foundation tool to moden 
applications runtime environment. We need workflow engine that can support business 
application. 

I search the open-source javascript workflow engine, most of them like just toys. 
I hope this one can be rigorous. Otherwise I prefer just eval some code directly.
I write this jsWorkFlow support both client side and node. I hope jsWorkFlow can 
become the foundation of javascript MDD.

## Features
-----------
  * Supports node.js
  * Supports client side
  * Depend on jsoop project
  * Event Driven Model.


## Goal of Design 
-----------------

### Basic Description
I design jsWorkFlow based on following key-feature:
  * State Machine
  * Event Driven
  * Context Aware

One activity has finite state. Some activiy state is predefined by jsWorkFlow.
  * jsWorkFlow.ActivityState.none
  * jsWorkFlow.ActivityState.start
  * jsWorkFlow.ActivityState.end
  * jsWorkFlow.ActivityState.error
  * jsWorkFlow.ActivityState.min_value

jsWorkFlow.ActivityState.none is the initial state of activity, and state transition
can transfer from none to other, and can't transfer to none.  
  1.jsWorkFlow.ActivityState.start represent the activity is already running.  
  2.jsWorkFlow.ActivityState.end represent the activity is already end.  
  3.jsWorkFlow.ActivityState.error represent the activity is running into an error state.  
  4.jsWorkFlow.ActivityState.min_value is the minimum value that can be used by user.  

When the activity state is changed, then trigger it event, and the following code
is run.

### How Write an Acrivity

There are some key classes for activities writers.
  * jsWorkFlow.Activity
  * jsWorkFlow.ActivityExecutor
  * jsWorkFlow.ActivityContext


#### jsWorkFlow.Activity

jsWorkFlow.Activity is base class of all activities. It provide the main framework of
activities.

One activity is running by jsWorkFlow.ActivityExecutor, executor will call it's execute
method, and pass the ActivityContext as it's context parameter.

An activity dosn't maintain any activity runtime data, and all it's runtime information
is stored into ActivityContext.

Activity is a main-frame of events. An instance of an activity can be used any times in
a workflow application. 

#### jsWorkFlow.ActivityExecutor

ActivityExecutor wrapper a running activity into a job item, and schedule it into the job
queue of application.

ActivityExecutor create ActivityContext, and catch the runtime exception of running of
activity, and watch the change of ActivityContext, trigger corresponding events.

### jsWorkFlow.ActivityContext
ActivityContext is the runtime data container of the running of activity. It represent the
running instance of activity. We can find nearly all the information of the running activity.
We also put user data into ActivityContext.

All ActivityContext is maintion in a stack.

When we run an activity, this activity is automatically transfer into 'start' state. When 
this activity is finish, the activity writer should call '$jwf.endActivity(context);' finish
it.

### Example of Write Activity

View the code in activies folder for detail intormation.

## Running in Client Side
  * Include the "jsoop.js" into html file. 
  * Include the "jsworkflow_browser.js" into html file.
  * Access 'jsWorkFlow' namespace by 'jsoop.ns('jsWorkFlow')

You can find "jsoop.js" file in npm 'jsoop' module.

## Using Samples
----------------

### Run jsWorkFlow Application

    var ins = new jsWorkFlow.Instance();
	var rootActivity = new jsWorkFlow.Activities.NoopActivity();

	//add complete event
    ins.add_complete(function () {
		alert('testEngine OK!');
    });

	//set root activity of instance
    ins.set_rootActivity(rootActivity);

    var app = new jsWorkFlow.Application(ins);

    app.run();


## About Licence
----------------

**Licence:**
Copyright 2012,  Yin MingJun - email: yinmingjuncn@gmail.com
Dual licensed under the MIT or GPL Version 2 licenses.
http://jquery.org/license


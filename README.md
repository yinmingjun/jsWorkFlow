
# jsWorkFlow
It's a workflow engine write by javascript. Support both node and client side.

## Introduction
Model-Driven Developement(MDD) is very important foundation tool to moden application 
runtime environment. I want a workflow that can support business application. But
I search the open-source javascript workflow engine, most of them like toys. So I
write this jsWorkFlow, and support client side. I hope I can bring MDD that based 
on workflow into node and client.

## Features
  * Supports node.js
  * Supports client side
  * Depend on jsoop project
  * Event Driven Model.

## How it work

### About events & property
Events of activities are designed to be used by activity's writer, and it's 
content's (handler) will not be seralized by serialize context. So, all contents 
used by end-user should build them workflow by activities. 

### About serialize a running activity
Activity serialize context dosn't support serialize a running activity. And this
requirement will not be consider in the nearly future. End-user who have this requirements
should consider how restart them activities by serialized data and activities. This meen
jsWorkFlow would like use retry instead searialize a running activity.


## Samples
pending....  

## licence

licence:
Copyright 2012,  Yin MingJun - email: yinmingjuncn@gmail.com
Dual licensed under the MIT or GPL Version 2 licenses.
http://jquery.org/license


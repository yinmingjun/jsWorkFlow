

#The jsWorkFlow.ActivityFactory's Template Document Description

Describe the template document of activity factory. Include two main part: Document Hierachy, 
and value description. 

## Template Document Hierachy

### Fields Description
*id* field:  
id field give it's unique name in activity factory.  

*type* field:
type field give it's full type in jsoop registry. activity factory will get this type
later in jsoop type registry, and create it's instance.  

*strict* field:  
strict feild can be omitted. it's default value is false.  
when strict is true, mean all string value is just string value.  
when strict is false, mean all string value may be regarded as a object id, when this id exists.  

*properties* field:  
properties field is a object type, each entry of it is a property's name-value pair. In this name-value pair, 
name represent a property name of object, this mean that must exist a "set_propName" method in this object. 
value represent the value that will send into the "set_propName" method.  

*constructors* field:  
constructors field is array type, include all parameters that will send into the object's constructor.

### Combine Templete Document 
A template document can just is a object that include id, type, properties and constructor fields. Or we can put
all document into a array. Each element of this array is a single template document.

### Document Sample

Single document sample:
-----------------------
	{
		'id': 'demo1',
		'type': 'jsWorkFlow.Activities.SequenceActivity',
		'properties':{ 
    		'name': 'demo1'
		}
	}

Combine document sample:
------------------------
    [{
        id: "eval1",
        type: "jsWorkFlow.Activities.EvalExprActivity",
        properties: {
            expr: "console.log('testActivityFactory_loadTemplateSeq_innerCase_1');"
        }
    },
    {
        id: "eval2",
        type: "jsWorkFlow.Activities.EvalExprActivity",
        properties: {
            expr: "console.log('testActivityFactory_loadTemplateSeq_innerCase_2');"
        }
    },
    {
        id: "eval3",
        type: "jsWorkFlow.Activities.EvalExprActivity",
        properties: {
            expr: "console.log('testActivityFactory_loadTemplateSeq_innerCase_3');"
        }
    },
    {
        id: "seq",
        type: "jsWorkFlow.Activities.SequenceActivity",
        properties: {
            activities: ["eval1", "eval2", "eval3"]
        }
    }]


## Value Description

The value is mean the value in properties or constructors. Each value can be simple value like
string, number, etc. Some time the value can reference other object that is already defined in 
activityFactory.  

The value map mechanism is walk through pure object and array, map each element of them to real
value. If the document's strict is false or undefined, the string value may regard as a id of a 
object, and the real value may be replace as the object instance in object factory if this id
exists.

If the value isn't pure object or array, and is not string id(only document's strict is false or 
undefined), this value will be regard as real value of this value description.

If the value is a pure object, and with '__v' field with value true, this pure object represend 
as a value descriptor. Otherwise, a pure object with '__v' field with value false, mean this pure
object isn't a value descriptor, just a pure object. 

### Value Descriptor Fields
There are two type of value descriptor, one with 'ref' field, other with 'val' field.

*ref* field:  
ref field take the id of other object in activityFactory. This value descriptor represent a object
reference.  

*val* field:  
val field take the value of this value descriptor. We just take the val field value, and regard it 
as the real value of this value descriptor, and no longer walk through it's inner hierachy.

### Value Descriptor Samples

Sample1: Reference to activity1
	{
		'__v': true,
		'ref': 'activity1'
	}

Sample2: With value of object descriptor
	{
		'__v': true,
		'val': {'__v':true, 'ref': 'activity1'}
	}


# DISCLAIMER
The implementation is quite shitty and full of bugs. 

It was mostly created to test the approach, not to be used in prod.

Current approach for prod is to generate text description for DB schema graph and build it using something like Mermaid.


# Basic info
Extension provides tools for DB schema browse.
It uses NS_DB ('Table:')  namespace and semantic mediawiki subobject which looks like:

{{#if:{{{LinksTo|}}}|{{#subobject:link#{{{Name}}}
 |linkTarget={{{LinksTo}}}
 |linkType={{#if:{{{KeyType|}}}|{{{KeyType}}}}}
 |linkSourceColumn={{{Name}}}
}}}}

to do the job

## To include
//Semantic graph
require_once "$IP/extensions/DbSchemaGraph/DbSchemaGraph.php";

Use 
{{#tag:DbSchemaFull||height="450px"|rootpage=MyPage}}

or

{{#tag:DbSchemaFull||height="450px"|rootcategory=MyCategory}}

to include the extension


## Create wikitables
To be able to use it you should first add DB tables as wiki pages:

LocalSettings.php:

define("NS_DB", 3010); // This MUST be even.
define("NS_DB_TALK", 3011); // This MUST be the following odd integer.
$wgExtraNamespaces[NS_DB] = "Table";
$wgExtraNamespaces[NS_DB_TALK] = "Table_talk";

Add template:

---Template:Table
<noinclude>
Template to be used for DB tables
</noinclude><includeonly>{{#default_form:{{#if:{{{DefaultForm|}}}|{{{DefaultForm}}}|Table}}}}</includeonly>{{#if:{{{Version|}}}|:''Product/version: '''{{{Version}}}'''''
}}{{#if:{{{Main|}}}|:''Main article: '''[[{{{Main}}}]]'''''
}}
{{#if:{{{Description|}}}|{{{Description}}}}}<div class="noexcerpt">
==Other tables relations==
{{#tag:DbSchemaFull||height="450px"|rootpage={{FULLPAGENAME}}}}
== Columns  ==
</div>{{#arraymap:{{{categories|}}}|,|x|[[Category:x]]|&#32;}} __NOEDITSECTION__ {{#if:{{{ProductDbCategory|}}}|[[Category:{{{ProductDbCategory}}}]]}}[[Category:Database Tables]]


---Template:DatabaseTableField:
<noinclude>
Template to be used for DB tables columns
[[Êàòåãîðèÿ:Database_Tables]]
</noinclude><div class="noexcerpt">
==={{{Name}}}===
{{#if:{{{Version|}}}|:''Version: '''{{{Version}}}'''''}}
{{#if:{{{KeyType|}}}|:''Key type: '''{{{KeyType}}}'''''}}
{{#if:{{{LinksTo|}}}|:''Links to: [[LinksTo::{{{LinksTo}}}]]''}}
{{#if:{{{Description|}}}|{{{Description}}}}}{{#if:{{{LinksTo|}}}|{{#subobject:link#{{{Name}}}
 |linkTarget={{{LinksTo}}}
 |linkType={{#if:{{{KeyType|}}}|{{{KeyType}}}}}
 |linkSourceColumn={{{Name}}}
}}}}</div>

---Form:Table
<noinclude>
DB table creation form

== Enter table name ==
Please enter the table name below
{{#forminput:form=Table|size=40|button text=Create or edit database table|autocomplete on category=Database Tables|namespace=Table}}
[[Category:Database_Tables]]
</noinclude><includeonly>
{{{info|add title=Add datdabase table|edit title=Edit database table|page name=Table:[name]}}}
{{{for template|Table}}}
{| class="formtable"
! Table name:
| {{{field|name|mandatory|size=150|default={{PAGENAME}}|placeholder=Èìÿ òàáëèöû.}}}
|-
! Product version:
| {{{field|Version|input type=tokens|values=1,1.1,2,3}}}
|-
! Functionality tree:
| {{{field|categories|input type=tree|list|mandatory|hideroot|top category=Categories(DB)|width=290|height=400|depth=1}}}
|-
! Main article:
| {{{field|Main|size=150|placeholder=Ñòàòüÿ, â êîòîðîé îïèñàí ôóíêöèîíàë ýòîé òàáëèöû (íåîáÿçàòåëüíîå ïîëå).|values from category=Knowledgebase}}}
|-
! Description:
| {{{field|Description|input type=textarea|editor=wikieditor|mandatory}}}
|}
{{{end template}}}

{{{for template|DatabaseTableField|label=Columns of this table|multiple|minimum instances=0|add button text=Add column}}}
'''Column:''' {{{field|Name|mandatory}}}

'''Key type:'''{{{field|KeyType|input type=checkboxes|values=PK, FK}}}

'''Links to:''' {{{field|LinksTo|input type=dropdown|values from category=Database_Tables}}}

'''Version:''' {{{field|Version|input type=tokens|values=1.0,1.5,2.0}}}

'''Description:''' {{{field|Description|input type=textarea}}}

{{{end template}}}

{{{standard input|summary}}}

{{{standard input|minor edit}}} {{{standard input|watch}}}

{{{standard input|save}}} {{{standard input|preview}}} {{{standard input|changes}}} {{{standard input|cancel}}}
</includeonly>


++Create category tree for your tables.

Let Category:Categories(DB) be the root category and create child categories for it. 


After that you should be able to use the extension

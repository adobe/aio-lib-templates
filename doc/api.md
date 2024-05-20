## Classes

<dl>
<dt><a href="#TemplateRegistryAPI">TemplateRegistryAPI</a></dt>
<dd><p>This class provides methods to call Template Registry APIs.
If you are going to add or delete a template, please provide a valid IMS access token
during an object initialization:
{
  &quot;auth&quot;: {
    &quot;token&quot;: &quot;<ims-access-token>&quot;
  }
}</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#init">init(config)</a> ⇒ <code><a href="#TemplateRegistryAPI">TemplateRegistryAPI</a></code></dt>
<dd><p>Returns a new TemplateRegistryAPI object.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Auth">Auth</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Server">Server</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Configuration">Configuration</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Links">Links</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Extension">Extension</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#API">API</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Event">Event</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Consumer">Consumer</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Provider">Provider</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Template">Template</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="TemplateRegistryAPI"></a>

## TemplateRegistryAPI
This class provides methods to call Template Registry APIs.
If you are going to add or delete a template, please provide a valid IMS access token
during an object initialization:
{
  "auth": {
    "token": "<ims-access-token>"
  }
}

**Kind**: global class  

* [TemplateRegistryAPI](#TemplateRegistryAPI)
    * [new TemplateRegistryAPI(config)](#new_TemplateRegistryAPI_new)
    * [.getTemplate(templateName)](#TemplateRegistryAPI+getTemplate) ⇒ [<code>Promise.&lt;Template&gt;</code>](#Template)
    * [.getTemplates(searchCriteria, orderByCriteria, size)](#TemplateRegistryAPI+getTemplates) ⇒ <code>AsyncGenerator</code>
    * [.addTemplate(templateName, githubRepoUrl)](#TemplateRegistryAPI+addTemplate) ⇒ [<code>Promise.&lt;Template&gt;</code>](#Template)
    * [.deleteTemplate(templateName)](#TemplateRegistryAPI+deleteTemplate) ⇒ <code>Promise.&lt;undefined&gt;</code>
    * [.installTemplate(templateId, templateInstallRequestBody)](#TemplateRegistryAPI+installTemplate) ⇒ [<code>Promise.&lt;ResponseObject&gt;</code>

<a name="new_TemplateRegistryAPI_new"></a>

### new TemplateRegistryAPI(config)
Initializes a TemplateRegistryAPI object.


| Param | Type | Description |
| --- | --- | --- |
| config | [<code>Configuration</code>](#Configuration) | Optional configuration parameters. |

<a name="TemplateRegistryAPI+getTemplate"></a>

### templateRegistryAPI.getTemplate(templateName) ⇒ [<code>Promise.&lt;Template&gt;</code>](#Template)
Gets a template data stored in Template Registry by a template name.

**Kind**: instance method of [<code>TemplateRegistryAPI</code>](#TemplateRegistryAPI)  

| Param | Type | Description |
| --- | --- | --- |
| templateName | <code>String</code> | A template name (an NPM package name). |

<a name="TemplateRegistryAPI+getTemplates"></a>

### templateRegistryAPI.getTemplates(searchCriteria, orderByCriteria, size) ⇒ <code>AsyncGenerator</code>
Gets template data objects stored in Template Registry satisfying the provided Search criteria and ordered by fields provided in the Order By criteria.
It allows to paginate over the results. By default 50 template data objects are yielded.

**Kind**: instance method of [<code>TemplateRegistryAPI</code>](#TemplateRegistryAPI)  
**Returns**: <code>AsyncGenerator</code> - The yielded value is an array of template data objects.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| searchCriteria | <code>Object</code> |  | A Search criteria object. |
| orderByCriteria | <code>Object</code> |  | An Order By criteria object. |
| size | <code>Number</code> | <code>50</code> | How many template data objects to yield. |

<a name="TemplateRegistryAPI+addTemplate"></a>

### templateRegistryAPI.addTemplate(templateName, githubRepoUrl) ⇒ [<code>Promise.&lt;Template&gt;</code>](#Template)
Adds a template to Template Registry.

**Kind**: instance method of [<code>TemplateRegistryAPI</code>](#TemplateRegistryAPI)  
**Returns**: [<code>Promise.&lt;Template&gt;</code>](#Template) - A template data object added to Template Registry.  

| Param | Type | Description |
| --- | --- | --- |
| templateName | <code>String</code> | A template name (an NPM package name). |
| githubRepoUrl | <code>String</code> | A Github repo URL that holds a template's source code. |

<a name="TemplateRegistryAPI+deleteTemplate"></a>

### templateRegistryAPI.deleteTemplate(templateName) ⇒ <code>Promise.&lt;undefined&gt;</code>
Deletes a template from Template Registry.

**Kind**: instance method of [<code>TemplateRegistryAPI</code>](#TemplateRegistryAPI)  

| Param | Type | Description |
| --- | --- | --- |
| templateName | <code>String</code> | A template name (an NPM package name). |

<a name="TemplateRegistryAPI+installTemplate"></a>

### templateRegistryAPI.installTemplate(templateId, templateInstallRequestBody) ⇒ [<code>Promise.&lt;ResponseObject&gt;</code>]
Installs a given template.

**Kind**: instance method of [<code>TemplateRegistryAPI</code>](#TemplateRegistryAPI)
**Returns**: [<code>Promise.&lt;ResponseObject&gt;</code>] - A response object containing details of new project created with the given template.

| Param      | Type | Description |
|------------| --- |-------------|
| templateId | <code>String</code> | Template Id |
| templateInstallRequestBody | <code>Object</code> | Template Install Request Body |

<a name="init"></a>

## init(config) ⇒ [<code>TemplateRegistryAPI</code>](#TemplateRegistryAPI)
Returns a new TemplateRegistryAPI object.

**Kind**: global function  
**Returns**: [<code>TemplateRegistryAPI</code>](#TemplateRegistryAPI) - A new TemplateRegistryAPI object.  

| Param | Type | Description |
| --- | --- | --- |
| config | [<code>Configuration</code>](#Configuration) | Optional configuration parameters. |

<a name="Auth"></a>

## Auth : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | IMS access token |

<a name="Server"></a>

## Server : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | API Server Url address |
| version | <code>String</code> | API version |

<a name="Configuration"></a>

## Configuration : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| auth | [<code>Auth</code>](#Auth) | Auth object |
| server | [<code>Server</code>](#Server) | Server object |

<a name="Links"></a>

## Links : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| npm | <code>String</code> | A link to the template on npmjs.com |
| github | <code>String</code> | A link to the Github repository containing the template's source code. |

<a name="Extension"></a>

## Extension : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| extensionPointId | <code>String</code> | Extension Point Id |

<a name="API"></a>

## API : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| code | <code>String</code> | The sdk code of the service. |

<a name="Event"></a>

## Event : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| consumer | [<code>Consumer</code>](#Consumer) | Consumer |
| provider | [<code>Provider</code>](#Provider) | Provider |

<a name="Consumer"></a>

## Consumer : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | Type |
| provider | <code>Array.&lt;String&gt;</code> | A list of providers. |

<a name="Provider"></a>

## Provider : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Name |
| description | <code>String</code> | Description |
| "event-types" | <code>Array.&lt;String&gt;</code> | A list of events. |

<a name="Template"></a>

## Template : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | The unique identifier of the template in the UUID format. |
| author | <code>String</code> | The name of the template's author on npmjs.com Applicable for "Approved" templates only. |
| name | <code>String</code> | The name of the template on npmjs.com |
| status | <code>String</code> | A status of a template in Template Registry. One of "InVerification", "Approved", "Rejected". |
| description | <code>String</code> | A description of the template. Applicable for "Approved" templates only. |
| latestVersion | <code>String</code> | The version of the template in the semver format. Applicable for "Approved" templates only. |
| publishDate | <code>Date</code> | The date the template was published. Applicable for "Approved" templates only. |
| adobeRecommended | <code>Boolean</code> | Whether the template is recommended by Adobe. Applicable for "Approved" templates only. |
| keywords | <code>Array.&lt;String&gt;</code> | A list of keywords specified in the packages.json file. Applicable for "Approved" templates only. |
| links | [<code>Links</code>](#Links) | A list of locations where the template's code can be found. |
| categories | <code>Array.&lt;String&gt;</code> | A list of categories the template belongs to. Applicable for "Approved" templates only. |
| runtime | <code>Boolean</code> | FALSE by default. Declares if Runtime should be added to namespaces. Applicable for "Approved" templates only. |
| extensions | [<code>Array.&lt;Extension&gt;</code>](#Extension) | Optional. Extension points that a template implements. Applicable for "Approved" templates only. |
| apis | [<code>Array.&lt;API&gt;</code>](#API) | Optional. A list of Adobe APIs required by the template. Applicable for "Approved" templates only. |
| event | [<code>Event</code>](#Event) | Optional. The event config for the template. Applicable for "Approved" templates only. |
| reviewLink | <code>String</code> | A link to "Template Review Request" Github Issue. Applicable for "InVerification" and "Rejected" templates only. |

<a name = "TemplateInstallRequestBody"></a>

## TemplateInstallRequestBody : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type                       | Description |
| --- |----------------------------| --- |
| OrgId | <code>String</code>        | The organization id |
| projectName | <code>String</code>        | The name of the project |
| description | <code>String</code>        | The description of the project |
| metadata | <code>Object</code>        | Key value pairs of credential metadata like allowed domains, redirect uris etc |
| apis | <code>Array<Object></code> | Optional field to include license configs to be assigned to a technical account for an individual API |


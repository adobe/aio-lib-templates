<!--
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
-->

## Adobe App Builder Templates Library

This is a helper library that is to be used in the Adobe I/O CLI and SDKs to communicate with [Adobe App Builder Template Registry](https://github.com/adobe/aio-template-submission) through its REST APIs.

### Installing

```bash
$ npm install @adobe/aio-lib-templates
```

### Usage

#### Search Adobe App Builder templates
Search Adobe App Builder templates in [Adobe App Builder Template Registry](https://github.com/adobe/aio-template-submission) and paginate through results.
```javascript
const sdk = require('@adobe/aio-lib-templates');

async function sdkTest() {
    const templateRegistryClient = sdk.init();
    // an optional Search Criteria object
    // without Search Criteria the following code will paginate through all Adobe App Builder templates
    const searchCriteria = {
        [sdk.SEARCH_CRITERIA_CATEGORIES]: ['action', sdk.SEARCH_CRITERIA_FILTER_NOT + 'ui', sdk.SEARCH_CRITERIA_FILTER_OR + 'runtime'],
        [sdk.SEARCH_CRITERIA_STATUSES]: [sdk.TEMPLATE_STATUS_APPROVED],
        [sdk.SEARCH_CRITERIA_ADOBE_RECOMMENDED]: true
    };
    // an optional OrderBy Criteria object
    const orderByCriteria = {
        [sdk.ORDER_BY_CRITERIA_NAMES]: sdk.ORDER_BY_CRITERIA_SORT_DESC
    };
    for await (const templates of templateRegistryClient.getTemplates(searchCriteria, orderByCriteria)) {
        for (const template of templates) {
            console.log(template);
        }
    }
}
```

##### Supported **Search Criteria** properties
| Key                | Value                      | SDK Constant                      | Description                                                                                                        |
| ------------------ | -------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `names`            | list of strings            | SEARCH_CRITERIA_NAMES             | Filter by template names.                                                                                          |
| `categories`       | list of strings            | SEARCH_CRITERIA_CATEGORIES        | Filter by template categories.                                                                                     |
| `statuses`         | list of strings            | SEARCH_CRITERIA_STATUSES          | Filter by template statuses (TEMPLATE_STATUS_IN_VERIFICATION, TEMPLATE_STATUS_APPROVED, TEMPLATE_STATUS_REJECTED). |
| `apis`             | list of strings            | SEARCH_CRITERIA_APIS              | Filter by template APIs. Supports EMPTY and ANY filters.                                                           |
| `extensions`       | list of strings            | SEARCH_CRITERIA_EXTENSIONS        | Filter by template extension points. Supports EMPTY and ANY filters.                                               |
| `events`           | EMPTY and ANY filters only | SEARCH_CRITERIA_EVENTS            | Filter by template events. For now supports EMPTY and ANY filters only.                                            |
| `runtime`          | boolean                    | SEARCH_CRITERIA_RUNTIME           | Is Adobe I/O Runtime required or not? Supports EMPTY and ANY filters.                                              |
| `adobeRecommended` | boolean                    | SEARCH_CRITERIA_ADOBE_RECOMMENDED | Indicates templates featured by Adobe.                                                                             |

###### Filter Operators
| Filter Type  | Value                 | SDK Constant                | Description                                           |
| ------------ | --------------------- | --------------------------- | ----------------------------------------------------- |
| EMPTY (NONE) | '', an empty string   | SEARCH_CRITERIA_FILTER_NONE | Returns all templates that don't have a property set. |
| ANY          | *, an asterisk symbol | SEARCH_CRITERIA_FILTER_ANY  | Returns all templates that have a property set.       |
| NOT          | !, an exclamation point symbol | SEARCH_CRITERIA_FILTER_NOT  | Excludes all templates which contain the negated query parameter value.|
| OR          | \|, a pipe symbol | SEARCH_CRITERIA_FILTER_OR  | Array filters, e.g.: `categories`, default to returning the intersection (AND) of all matching templates. This filter operator adds the ability to specify a logical "OR" for individual values. |

##### Supported **OrderBy Criteria** properties
| Key                | Value               | SDK Constant                        | Description                           |
| ------------------ | ------------------- | ----------------------------------- | ------------------------------------- |
| `names`            | string, desc or asc | ORDER_BY_CRITERIA_NAMES             | Sort by template names.               |
| `statuses`         | string, desc or asc | ORDER_BY_CRITERIA_STATUSES          | Sort by template statuses.            |
| `adobeRecommended` | string, desc or asc | ORDER_BY_CRITERIA_ADOBE_RECOMMENDED | Sort by the "Adobe Recommended" flag. |
| `publishDate`      | string, desc or asc | ORDER_BY_CRITERIA_PUBLISH_DATE      | Sort by a publish date.               |

#### Get a template from Adobe App Builder Template Registry
Get a template from [Adobe App Builder Template Registry](https://github.com/adobe/aio-template-submission).
```javascript
const sdk = require('@adobe/aio-lib-templates');

async function sdkTest() {
    const templateRegistryClient = sdk.init();
    const templateName = '@author/app-builder-template';
    try {
        const template = await templateRegistryClient.getTemplate(templateName);
        console.log(template);
    } catch (error) {
        console.log(error.toString());
    }
}
```

#### Add a new template to Adobe App Builder Template Registry
Add a new template to [Adobe App Builder Template Registry](https://github.com/adobe/aio-template-submission).
```javascript
const sdk = require('@adobe/aio-lib-templates');

async function sdkTest() {
    const templateRegistryClient = sdk.init({
        'auth': {
            'token': '<IMS_ACCESS_TOKEN>'
        }
    });
    const templateName = '@author/app-builder-template';
    const githubRepoUrl = 'https://github.com/author/app-builder-template';
    try {
        const template = await templateRegistryClient.addTemplate(templateName, githubRepoUrl);
        console.log(`A new template "${template.name}" has been successfully added to Adobe App Builder Template Registry.`);
        console.log(`Its status is "${sdk.TEMPLATE_STATUS_IN_VERIFICATION}". Please use the "${template.reviewLink}" link to check the verification status.`);
    } catch (error) {
        console.log(error.toString());
    }
}
```

#### Updates a template to Adobe App Builder Template Registry
Updates a template to [Adobe App Builder Template Registry](https://github.com/adobe/aio-template-submission).

**Note: It's only accessible with an IMS service token**

```javascript
const sdk = require('@adobe/aio-lib-templates');

async function sdkTest() {
    const templateRegistryClient = sdk.init({
        'auth': {
            'token': '<IMS_ACCESS_TOKEN>'
        }
    });
    const templateId = '66431bb2f682a35bf4b1b002';
    const githubRepoUrl = 'https://github.com/author/app-builder-template';
    try {
        const template = await templateRegistryClient.updateTemplate(templateId, githubRepoUrl);
        console.log(`template with Id "${template.templateId}" has been successfully updated to Adobe App Builder Template Registry.`);
    } catch (error) {
        console.log(error.toString());
    }
}
```

#### Delete a template from Adobe App Builder Template Registry
Delete a template from [Adobe App Builder Template Registry](https://github.com/adobe/aio-template-submission).
```javascript
const sdk = require('@adobe/aio-lib-templates');

async function sdkTest() {
    const templateRegistryClient = sdk.init({
        'auth': {
            'token': '<IMS_ACCESS_TOKEN>'
        }
    });
    const templateName = '@author/app-builder-template';
    try {
        await templateRegistryClient.deleteTemplate(templateName);
        console.log(`"${templateName}" has been successfully deleted from Adobe App Builder Template Registry.`);
    } catch (error) {
        console.log(error.toString());
    }
}
```

#### Install a template 
Install a template from Developer Console

**Note: It's only accessible with an IMS service token**
```javascript
const sdk = require('@adobe/aio-lib-templates');

async function sdkTest() {
    const templateRegistryClient = sdk.init({
        'auth': {
            'token': '<IMS_ACCESS_TOKEN>'
        }
    });
    const templateId = '<valid templateId>';
    const templateInstallRequestBody = {
        orgId: '<valid orgId>',
        projectName: '<projectName>',
        description: '<description>',
        metadata: {
            domain : '<domain>',
            defaultRedirectUri: '<defaultRedirectUri>'
        },
        apis: [
            {
                code: 'SDKCode',
                credentialType: 'valid credentialType',
                flowType: 'valid flowType',
                licenseConfigs: [
                    {
                        id: 'valid id',
                        productId: 'valid productId',
                        op: 'valid op',
                    }
                ]
            }
        ]
    }
    try {
        await templateRegistryClient.installTemplate(templateId, templateInstallRequestBody);
        console.log(`Template with id "${templateId}" has been successfully installed.`);
    } catch (error) {
        console.log(error.toString());
    }
}
```

### Explore

`goto` [API](./doc/api.md)

### Contributing

Contributions are welcome! Read the [Contributing Guide](./CONTRIBUTING.md) for more information.

### Licensing

This project is licensed under the Apache V2 License. See [LICENSE](./LICENSE) for more information.

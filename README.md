<!--
Copyright 2022 Adobe. All rights reserved.
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
        'categories': ['action', 'ui'],
        'statuses': ['Approved'],
        'adobeRecommended': true
    };
    // an optional OrderBy Criteria object
    const orderByCriteria = {
        'names': 'desc'
    };
    for await (const templates of templateRegistryClient.getTemplates(searchCriteria, orderByCriteria)) {
        for (const template of templates) {
            console.log(template);
        }
    }
}
```

##### Supported **Search Criteria** properties
| Key                | Value                      | Description                                                             |
| ------------------ | -------------------------- | ----------------------------------------------------------------------- |
| `names`            | list of strings            | Filter by template names.                                               |
| `categories`       | list of strings            | Filter by template categories.                                          |
| `statuses`         | list of strings            | Filter by template statuses ("InVerification", "Approved", "Rejected"). |
| `apis`             | list of strings            | Filter by template APIs. Supports EMPTY and ANY filters.                |
| `extensions`       | list of strings            | Filter by template extension points. Supports EMPTY and ANY filters.    |
| `events`           | EMPTY and ANY filters only | Filter by template events. For now supports EMPTY and ANY filters only. |
| `runtime`          | boolean                    | Is Adobe I/O Runtime required or not? Supports EMPTY and ANY filters.   |
| `adobeRecommended` | boolean                    | Indicates templates featured by Adobe.                                  |

###### EMPTY and ANY filters
| Filter Type  | Value                  | Description                                           |
| ------------ | ---------------------- | ----------------------------------------------------- |
| EMPTY (NONE) | '' (an empty string)   | Returns all templates that don't have a property set. |
| ANY          | * (an asterisk symbol) | Returns all templates that have a property set.       |

##### Supported **OrderBy Criteria** properties
| Key                | Value               | Description                           |
| ------------------ | ------------------- | ------------------------------------- |
| `names`            | string, desc or asc | Sort by template names.               |
| `statuses`         | string, desc or asc | Sort by template statuses.            |
| `adobeRecommended` | string, desc or asc | Sort by the "Adobe Recommended" flag. |
| `publishDate`      | string, desc or asc | Sort by a publish date.               |

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
        console.log(`Its status is "InVerification". Please use the "${template.reviewLink}" link to check the verification status.`);
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

### Explore

`goto` [API](./doc/api.md)

### Contributing

Contributions are welcome! Read the [Contributing Guide](./CONTRIBUTING.md) for more information.

### Licensing

This project is licensed under the Apache V2 License. See [LICENSE](./LICENSE) for more information.
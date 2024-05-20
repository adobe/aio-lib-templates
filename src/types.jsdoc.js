/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/**
 * @typedef {Object} Auth
 * @property {String} token IMS access token
 */
/**
 * @typedef {Object} Server
 * @property {String} url API Server Url address
 * @property {String} version API version
 */
/**
 * @typedef {Object} Configuration
 * @property {Auth} auth Auth object
 * @property {Server} server Server object
 */
/**
 * @typedef {Object} Links
 * @property {String} npm A link to the template on npmjs.com
 * @property {String} github A link to the Github repository containing the template's source code.
 */
/**
 * @typedef {Object} Extension
 * @property {String} extensionPointId Extension Point Id
 */
/**
 * @typedef {Object} API
 * @property {String} code The sdk code of the service.
 */
/**
 * @typedef {Object} Event
 * @property {Consumer} consumer Consumer
 * @property {Provider} provider Provider
 */
/**
 * @typedef {Object} Consumer
 * @property {String} type Type
 * @property {Array.<String>} provider A list of providers.
 */
/**
 * @typedef {Object} Provider
 * @property {String} name Name
 * @property {String} description Description
 * @property {Array.<String>} "event-types" A list of events.
 */
/**
 * @typedef {Object} Template
 * @property {String} id The unique identifier of the template in the UUID format.
 * @property {String} author The name of the template's author on npmjs.com Applicable for "Approved" templates only.
 * @property {String} name The name of the template on npmjs.com
 * @property {String} status A status of a template in Template Registry. One of "InVerification", "Approved", "Rejected".
 * @property {String} description A description of the template. Applicable for "Approved" templates only.
 * @property {String} latestVersion The version of the template in the semver format. Applicable for "Approved" templates only.
 * @property {Date} publishDate The date the template was published. Applicable for "Approved" templates only.
 * @property {Boolean} adobeRecommended Whether the template is recommended by Adobe. Applicable for "Approved" templates only.
 * @property {Array.<String>} keywords A list of keywords specified in the packages.json file. Applicable for "Approved" templates only.
 * @property {Links} links A list of locations where the template's code can be found.
 * @property {Array.<String>} categories A list of categories the template belongs to. Applicable for "Approved" templates only.
 * @property {Boolean} runtime FALSE by default. Declares if Runtime should be added to namespaces. Applicable for "Approved" templates only.
 * @property {Array.<Extension>} extensions Optional. Extension points that a template implements. Applicable for "Approved" templates only.
 * @property {Array.<API>} apis Optional. A list of Adobe APIs required by the template. Applicable for "Approved" templates only.
 * @property {Event} event Optional. The event config for the template. Applicable for "Approved" templates only.
 * @property {String} reviewLink A link to "Template Review Request" Github Issue. Applicable for "InVerification" and "Rejected" templates only.
 */
/**
 * @typedef {Object} TemplateInstallRequestBody
 * @property {String} orgId - The organization id
 * @property {String} projectName - The name of the project
 * @property {String} description - The description of the project
 * @property {Object} metadata - Key value pairs of credential metadata like allowed domains, redirect uris etc
 * @property {Array<Object>} apis - Optional field to include license configs to be assigned to a technical account for an individual API
 */

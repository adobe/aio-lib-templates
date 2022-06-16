/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/**
 * Initializes a TemplateRegistryAPI object.
 * @param config - Optional configuration parameters.
 */
declare class TemplateRegistryAPI {
    constructor(config: Configuration);
    /**
     * Gets a template data stored in Template Registry by a template name.
     * @param templateName - A template name (an NPM package name).
     */
    getTemplate(templateName: string): Promise<Template>;
    /**
     * Gets template data objects stored in Template Registry satisfying the provided Search criteria and ordered by fields provided in the Order By criteria.
     * It allows to paginate over the results. By default 50 template data objects are yielded.
     * @param searchCriteria - A Search criteria object.
     * @param orderByCriteria - An Order By criteria object.
     * @param size - How many template data objects to yield.
     * @returns The yielded value is an array of template data objects.
     */
    getTemplates(searchCriteria: any, orderByCriteria: any, size?: number): AsyncGenerator;
    /**
     * Adds a template to Template Registry.
     * @param templateName - A template name (an NPM package name).
     * @param githubRepoUrl - A Github repo URL that holds a template's source code.
     * @returns A template data object added to Template Registry.
     */
    addTemplate(templateName: string, githubRepoUrl: string): Promise<Template>;
    /**
     * Deletes a template from Template Registry.
     * @param templateName - A template name (an NPM package name).
     */
    deleteTemplate(templateName: string): Promise<undefined>;
}

/**
 * Returns a new TemplateRegistryAPI object.
 * @param config - Optional configuration parameters.
 * @returns A new TemplateRegistryAPI object.
 */
declare function init(config: Configuration): TemplateRegistryAPI;

/**
 * @property token - IMS access token
 */
declare type Auth = {
    token: string;
};

/**
 * @property url - API Server Url address
 * @property version - API version
 */
declare type Server = {
    url: string;
    version: string;
};

/**
 * @property auth - Auth object
 * @property server - Server object
 */
declare type Configuration = {
    auth: Auth;
    server: Server;
};

/**
 * @property npm - A link to the template on npmjs.com
 * @property github - A link to the Github repository containing the template's source code.
 */
declare type Links = {
    npm: string;
    github: string;
};

/**
 * @property serviceCode - Service Code
 */
declare type Extension = {
    serviceCode: string;
};

/**
 * @property code - The sdk code of the service.
 */
declare type API = {
    code: string;
};

/**
 * @property consumer - Consumer
 * @property provider - Provider
 */
declare type Event = {
    consumer: Consumer;
    provider: Provider;
};

/**
 * @property type - Type
 * @property provider - A list of providers.
 */
declare type Consumer = {
    type: string;
    provider: String[];
};

/**
 * @property name - Name
 * @property description - Description
 * @property "event-types" - A list of events.
 */
declare type Provider = {
    name: string;
    description: string;
    "event-types": String[];
};

/**
 * @property id - The unique identifier of the template in the UUID format.
 * @property author - The name of the template's author on npmjs.com Applicable for "Approved" templates only.
 * @property name - The name of the template on npmjs.com
 * @property status - A status of a template in Template Registry. One of "InVerification", "Approved", "Rejected".
 * @property description - A description of the template. Applicable for "Approved" templates only.
 * @property latestVersion - The version of the template in the semver format. Applicable for "Approved" templates only.
 * @property publishDate - The date the template was published. Applicable for "Approved" templates only.
 * @property adobeRecommended - Whether the template is recommended by Adobe. Applicable for "Approved" templates only.
 * @property keywords - A list of keywords specified in the packages.json file. Applicable for "Approved" templates only.
 * @property links - A list of locations where the template's code can be found.
 * @property categories - A list of categories the template belongs to. Applicable for "Approved" templates only.
 * @property runtime - FALSE by default. Declares if Runtime should be added to namespaces. Applicable for "Approved" templates only.
 * @property extension - Optional. It contains the extension metadata if the template implements an extension point. Applicable for "Approved" templates only.
 * @property apis - Optional. A list of Adobe APIs required by the template. Applicable for "Approved" templates only.
 * @property event - Optional. The event config for the template. Applicable for "Approved" templates only.
 * @property reviewLink - A link to "Template Review Request" Github Issue. Applicable for "InVerification" and "Rejected" templates only.
 */
declare type Template = {
    id: string;
    author: string;
    name: string;
    status: string;
    description: string;
    latestVersion: string;
    publishDate: Date;
    adobeRecommended: boolean;
    keywords: String[];
    links: Links;
    categories: String[];
    runtime: boolean;
    extension: Extension;
    apis: API[];
    event: Event;
    reviewLink: string;
};


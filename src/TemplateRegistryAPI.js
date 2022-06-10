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

const axios = require('axios');
const logger = require('@adobe/aio-lib-core-logging')('@adobe/aio-lib-templates:TemplateRegistry', { 'level': process.env.LOG_LEVEL });
const { codes } = require('./SDKErrors');

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
 * @property {String} serviceCode Service Code
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
 * @property {Extension} extension Optional. It contains the extension metadata if the template implements an extension point. Applicable for "Approved" templates only.
 * @property {Array.<API>} apis Optional. A list of Adobe APIs required by the template. Applicable for "Approved" templates only.
 * @property {Event} event Optional. The event config for the template. Applicable for "Approved" templates only.
 * @property {String} reviewLink A link to "Template Review Request" Github Issue. Applicable for "InVerification" and "Rejected" templates only.
 */

/**
 * This class provides methods to call Template Registry APIs.
 * If you are going to add or delete a template, please provide a valid IMS access token
 * during an object initialization:
 * {
 *   "auth": {
 *     "token": "<ims-access-token>"
 *   }
 * }
 *
 */
class TemplateRegistryAPI {
    /**
     * Initializes a TemplateRegistryAPI object.
     * @param {Configuration} config Optional configuration parameters.
     */
    constructor(config = {}) {
        this.server = {
            'url': 'https://360030-templateregistryapi.adobeioruntime.net',
            'version': 'v1',
        };
        this.auth = {};

        if (config.server?.url || config.server?.version) {
            this.server = { ...this.server, ...config.server };
        }
        if (config.auth?.token) {
            this.auth = config.auth;
        }
    }

    /**
     * Gets a template data stored in Template Registry by a template name.
     *
     * @param {String} templateName A template name (an NPM package name).
     * @returns {Promise<Template>}
     */
    async getTemplate(templateName) {
        const url = `${this._getServerApiUrl()}/${templateName}`;
        const response = await this._makeGetRequest(url);
        return this._toTemplate(response);
    }

    /**
     * Gets template data objects stored in Template Registry satisfying the provided Search criteria and ordered by fields provided in the Order By criteria.
     * It allows to paginate over the results. By default 50 template data objects are yielded.
     *
     * @param {Object} searchCriteria A Search criteria object.
     * @param {Object} orderByCriteria An Order By criteria object.
     * @param {Number} size How many template data objects to yield.
     * @returns {AsyncGenerator} The yielded value is an array of template data objects.
     */
    async *getTemplates(searchCriteria = {}, orderByCriteria = {}, size = 50) {
        const url = this._getServerApiUrl();
        let params = {
            'size': size
        };
        if (Object.keys(searchCriteria).length) {
            Object.keys(searchCriteria).forEach(key => {
                if (Array.isArray(searchCriteria[key])) {
                    searchCriteria[key] = searchCriteria[key].join(',');
                }
            });
            params = { ...params, ...searchCriteria };
        }
        if (Object.keys(orderByCriteria).length) {
            let orderBy = '';
            for (const [field, direction] of Object.entries(orderByCriteria)) {
                orderBy += `${field} ${direction}`;
            }
            params = { ...params, 'orderBy': orderBy };
        }
        const result = this._pageThroughResource(url, params);
        for await (const items of result) {
            const templates = items.map(item => this._toTemplate(item));
            yield templates;
        }
    }

    /**
     * Adds a template to Template Registry.
     *
     * @param {String} templateName A template name (an NPM package name).
     * @param {String} githubRepoUrl A Github repo URL that holds a template's source code.
     * @returns {Promise<Template>} A template data object added to Template Registry.
     */
    async addTemplate(templateName, githubRepoUrl) {
        const url = this._getServerApiUrl();
        const response = await this._makePostRequest(url, {
            'name': templateName,
            'links': {
                'github': githubRepoUrl
            }
        });
        return this._toTemplate(response);
    }

    /**
     * Deletes a template from Template Registry.
     *
     * @param {String} templateName A template name (an NPM package name).
     * @returns {Promise<undefined>}
     */
    async deleteTemplate(templateName) {
        const url = `${this._getServerApiUrl()}/${templateName}`;
        await this._makeDeleteRequest(url);
    }

    /**
     * For the internal use only. It is not supposed to be used outside of the class.
     *
     * @param {String} url Template Registry API Endpoint URL
     * @param {Object} params Optional request parameters.
     * @returns {AsyncGenerator}
     * @private
     */
    async *_pageThroughResource(url, params = {}) {
        const response = await this._makeGetRequest(url, params);
        yield response.items;
        if (response._links.next) {
            yield* this._pageThroughResource(response._links.next);
        }
    }

    /**
     * For the internal use only. It is not supposed to be used outside of the class.
     *
     * @param {String} url Template Registry API Endpoint URL
     * @param {Object} params Optional request parameters.
     * @returns {Promise<Object>}
     * @private
     */
    async _makeGetRequest(url, params = {}) {
        logger.debug(`Calling "${axios.getUri({ url, params })}" ...`);
        try {
            const response = await axios.get(url, { 'params': params });
            if (response.status === 200) {
                return response.data;
            } else {
                const error = `Error fetching "${url}". Response code is ${response.status}.`;
                logger.warn(error);
                throw new codes.ERROR_UNEXPECTED_ERROR({ 'messageValues': 'An unexpected error happened. Please check logs or try again later.' });
            }
        } catch (e) {
            const error = `Error fetching "${url}". ${e.toString()}`;
            logger.warn(error);
            const exception = this._processResponseException(e);
            throw exception;
        }
    }

    /**
     * For the internal use only. It is not supposed to be used outside of the class.
     *
     * @param {String} url Template Registry API Endpoint URL
     * @param {Object} payload A request payload.
     * @returns {Promise<Object>}
     * @private
     */
    async _makePostRequest(url, payload) {
        if (!this.auth.token) {
            throw new codes.ERROR_SDK_INITIALIZATION({
                'messageValues': 'In order to add a template to Template Registry, please provide IMS Access Token during the initialization.'
            });
        }
        try {
            const response = await axios.post(url, payload, {
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.auth.token}`
                }
            });
            if (response.status === 200) {
                return response.data;
            } else {
                const error = `Error posting to API "${url}". Response code is ${response.status}.`;
                logger.warn(error);
                throw new codes.ERROR_UNEXPECTED_ERROR({ 'messageValues': 'An unexpected error happened. Please check logs or try again later.' });
            }
        } catch (e) {
            const error = `Error posting to API "${url}". ${e.toString()}`;
            logger.warn(error);
            const exception = this._processResponseException(e);
            throw exception;
        }
    }

    /**
     * For the internal use only. It is not supposed to be used outside of the class.
     *
     * @param {String} url Template Registry API Endpoint URL
     * @returns {Promise<undefined>}
     * @private
     */
    async _makeDeleteRequest(url) {
        if (!this.auth.token) {
            throw new codes.ERROR_SDK_INITIALIZATION({
                'messageValues': 'In order to delete a template from Template Registry, please provide IMS Access Token during the initialization.'
            });
        }
        try {
            const response = await axios.delete(url, {
                'headers': {
                    'Authorization': `Bearer ${this.auth.token}`
                }
            });
            if (response.status === 200) {
                return;
            } else {
                const error = `Error deleting "${url}". Response code is ${response.status}.`;
                logger.warn(error);
                throw new codes.ERROR_UNEXPECTED_ERROR({ 'messageValues': 'An unexpected error happened. Please check logs or try again later.' });
            }
        } catch (e) {
            const error = `Error deleting "${url}". ${e.toString()}`;
            logger.warn(error);
            const exception = this._processResponseException(e);
            throw exception;
        }
    }

    /**
     * For the internal use only. It is not supposed to be used outside of the class.
     *
     * @param {Array} errors An array of error objects.
     * @returns {String}
     * @private
     */
    _errorsToString(errors) {
        if (!errors) {
            return '';
        }
        let messages = [];
        for (const error of errors) {
            messages.push(error.message);
        }
        return messages.join(' ');
    }

    /**
     * For the internal use only. It is not supposed to be used outside of the class.
     *
     * @param {Error} exception
     * @returns {Error}
     * @private
     */
    _processResponseException(exception) {
        if (exception.response.status === 401) {
            const errMsg = this._errorsToString(exception.response.data.errors);
            logger.warn(errMsg);
            return new codes.ERROR_INVALID_IMS_ACCESS_TOKEN({ 'messageValues': errMsg });
        } else if (exception.response.status === 403) {
            const errMsg = this._errorsToString(exception.response.data.errors);
            logger.warn(errMsg);
            return new codes.ERROR_PERMISSION_DENIED({ 'messageValues': errMsg });
        } else if (exception.response.status === 404) {
            return new codes.ERROR_TEMPLATE_NOT_FOUND({ 'messageValues': 'The provided template does not exist in Template Registry.' });
        } else if (exception.response.status === 409) {
            return new codes.ERROR_TEMPLATE_ALREADY_EXISTS({ 'messageValues': 'The provided template already exists in Template Registry.' });
        } else {
            return new codes.ERROR_UNEXPECTED_ERROR({ 'messageValues': 'An unexpected error happened. Please check logs or try again later.' });
        }
    }

    /**
     * For the internal use only. It is not supposed to be used outside of the class.
     *
     * @returns {String}
     * @private
     */
    _getServerApiUrl() {
        return `${this.server.url}/apis/${this.server.version}/templates`;
    }

    /**
     * For the internal use only. It is not supposed to be used outside of the class.
     *
     * @param {Object} response An API response object.
     * @returns {Template}
     * @private
     */
    _toTemplate(response) {
        return {
            'id': response.id,
            'author': response?.author,
            'name': response.name,
            'status': response.status,
            'description': response?.description,
            'latestVersion': response?.latestVersion,
            'publishDate': response?.publishDate ? new Date(response.publishDate) : undefined,
            'adobeRecommended': response?.adobeRecommended,
            'keywords': response?.keywords,
            'links': response.links,
            'categories': response?.categories,
            'runtime': (response.status === 'Approved') ? !!response?.runtime : undefined,
            'extension': response?.extension,
            'apis': response?.apis,
            'event': response?.event,
            'reviewLink': response._links?.review?.href
        };
    }
}

module.exports = TemplateRegistryAPI;

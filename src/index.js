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

require('./types.jsdoc'); // for VS Code autocomplete

const logger = require('@adobe/aio-lib-core-logging')('@adobe/aio-lib-templates:index', { 'level': process.env.LOG_LEVEL });
const TemplateRegistryAPI = require('./TemplateRegistryAPI');

const SEARCH_CRITERIA_NAMES = 'names';
const SEARCH_CRITERIA_CATEGORIES = 'categories';
const SEARCH_CRITERIA_STATUSES = 'statuses';
const SEARCH_CRITERIA_APIS = 'apis';
const SEARCH_CRITERIA_EXTENSIONS = 'extensions';
const SEARCH_CRITERIA_EVENTS = 'events';
const SEARCH_CRITERIA_RUNTIME = 'runtime';
const SEARCH_CRITERIA_ADOBE_RECOMMENDED = 'adobeRecommended';

const SEARCH_CRITERIA_FILTER_ANY = '*';
const SEARCH_CRITERIA_FILTER_NONE = '';
const SEARCH_CRITERIA_FILTER_NOT = '!';

const ORDER_BY_CRITERIA_NAMES = 'names';
const ORDER_BY_CRITERIA_STATUSES = 'statuses';
const ORDER_BY_CRITERIA_ADOBE_RECOMMENDED = 'adobeRecommended';
const ORDER_BY_CRITERIA_PUBLISH_DATE = 'publishDate';

const ORDER_BY_CRITERIA_SORT_DESC = 'desc';
const ORDER_BY_CRITERIA_SORT_ASC = 'asc';

const TEMPLATE_STATUS_IN_VERIFICATION = 'InVerification';
const TEMPLATE_STATUS_APPROVED = 'Approved';
const TEMPLATE_STATUS_REJECTED = 'Rejected';

/**
 * Returns a new TemplateRegistryAPI object.
 *
 * @param {Configuration} config Optional configuration parameters.
 * @returns {TemplateRegistryAPI} A new TemplateRegistryAPI object.
 */
function init(config = {}) {
    logger.debug('Initializing a new TemplateRegistryAPI object.');
    return new TemplateRegistryAPI(config);
}

module.exports = {
    SEARCH_CRITERIA_NAMES,
    SEARCH_CRITERIA_CATEGORIES,
    SEARCH_CRITERIA_STATUSES,
    SEARCH_CRITERIA_APIS,
    SEARCH_CRITERIA_EXTENSIONS,
    SEARCH_CRITERIA_EVENTS,
    SEARCH_CRITERIA_RUNTIME,
    SEARCH_CRITERIA_ADOBE_RECOMMENDED,
    SEARCH_CRITERIA_FILTER_ANY,
    SEARCH_CRITERIA_FILTER_NONE,
    SEARCH_CRITERIA_FILTER_NOT,
    ORDER_BY_CRITERIA_NAMES,
    ORDER_BY_CRITERIA_STATUSES,
    ORDER_BY_CRITERIA_ADOBE_RECOMMENDED,
    ORDER_BY_CRITERIA_PUBLISH_DATE,
    ORDER_BY_CRITERIA_SORT_DESC,
    ORDER_BY_CRITERIA_SORT_ASC,
    TEMPLATE_STATUS_IN_VERIFICATION,
    TEMPLATE_STATUS_APPROVED,
    TEMPLATE_STATUS_REJECTED,
    init
};

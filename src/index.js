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
    init
};

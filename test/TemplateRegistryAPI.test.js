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

const { expect, describe, test, beforeEach } = require('@jest/globals');
const fs = require('fs');
const nock = require('nock');
const { codes } = require('../src/SDKErrors');
const TemplateRegistryAPI = require('../src/TemplateRegistryAPI');

const TEMPLATE_REGISTRY_API_SERVER_URL = 'https://template-registry-api.adobe.tbd';
const TEMPLATE_REGISTRY_API_VERSION = 'v1.0.0';
const IMS_ACCESS_TOKEN = 'ims-access-token';

beforeEach(() => {
    jest.clearAllMocks();
});

describe('TemplateRegistryAPI', () => {

    test('Successfully get a template by a template name', async () => {
        const templateRegistryAPI = new TemplateRegistryAPI({
            'server': {
                'url': TEMPLATE_REGISTRY_API_SERVER_URL,
                'version': TEMPLATE_REGISTRY_API_VERSION
            }
        });

        // "Approved" template
        const response1 = JSON.parse(fs.readFileSync(__dirname + '/fixtures/response.approved-template.json'));
        const templateName1 = '@author/app-builder-template-1';
        const template1 = _getTemplateObject(templateName1);
        nock(TEMPLATE_REGISTRY_API_SERVER_URL)
            .get(`/apis/${TEMPLATE_REGISTRY_API_VERSION}/templates/${templateName1}`)
            .times(1)
            .reply(200, response1);
        const result1 = await templateRegistryAPI.getTemplate(templateName1);
        expect(result1).toEqual(template1);

        // "InVerification" template, it has the "review" link
        const response2 = JSON.parse(fs.readFileSync(__dirname + '/fixtures/response.in-verification-template.json'));
        const templateName2 = '@author/app-builder-template-2';
        const template2 = _getTemplateObject(templateName2);
        nock(TEMPLATE_REGISTRY_API_SERVER_URL)
            .get(`/apis/${TEMPLATE_REGISTRY_API_VERSION}/templates/${templateName2}`)
            .times(1)
            .reply(200, response2);
        const result2 = await templateRegistryAPI.getTemplate(templateName2);
        expect(result2).toEqual(template2);
    });

    test('Successfully get templates from Template Registry', async () => {
        const templateRegistryAPI = new TemplateRegistryAPI({
            'server': {
                'url': TEMPLATE_REGISTRY_API_SERVER_URL,
                'version': TEMPLATE_REGISTRY_API_VERSION
            }
        });

        const response = JSON.parse(fs.readFileSync(__dirname + '/fixtures/response.templates.json'));
        const templates = [];
        templates.push(_getTemplateObject('@author/app-builder-template-1'));
        templates.push(_getTemplateObject('@author/app-builder-template-2'));
        templates.push(_getTemplateObject('@author/app-builder-template-3'));
        templates.push(_getTemplateObject('@author/app-builder-template-4'));
        nock(TEMPLATE_REGISTRY_API_SERVER_URL)
            .get(`/apis/${TEMPLATE_REGISTRY_API_VERSION}/templates`)
            .query({
                'size': 50
            })
            .times(1)
            .reply(200, response);
        for await (const yieldedTemplates of templateRegistryAPI.getTemplates()) {
            expect(yieldedTemplates).toEqual(templates);
        }
    });

    test('Successfully search templates', async () => {
        const templateRegistryAPI = new TemplateRegistryAPI({
            'server': {
                'url': TEMPLATE_REGISTRY_API_SERVER_URL,
                'version': TEMPLATE_REGISTRY_API_VERSION
            }
        });

        const response = JSON.parse(fs.readFileSync(__dirname + '/fixtures/response.approved-only-templates.json'));
        const templates = [];
        templates.push(_getTemplateObject('@author/app-builder-template-1'));
        templates.push(_getTemplateObject('@author/app-builder-template-4'));
        nock(TEMPLATE_REGISTRY_API_SERVER_URL)
            .get(`/apis/${TEMPLATE_REGISTRY_API_VERSION}/templates`)
            .query({
                'size': 50,
                'categories': 'action,ui',
                'statuses': 'Approved',
                'adobeRecommended': true,
                'orderBy': 'names desc'
            })
            .times(1)
            .reply(200, response);
        const searchCriteria = {
            'categories': ['action', 'ui'],
            'statuses': ['Approved'],
            'adobeRecommended': true
        };
        const orderByCriteria = {
            'names': 'desc'
        };
        for await (const yieldedTemplates of templateRegistryAPI.getTemplates(searchCriteria, orderByCriteria)) {
            expect(yieldedTemplates).toEqual(templates);
        }
    });

    test('Successfully add a template to Template Registry', async () => {
        const templateRegistryAPI = new TemplateRegistryAPI({
            'auth': {
                'token': IMS_ACCESS_TOKEN
            },
            'server': {
                'url': TEMPLATE_REGISTRY_API_SERVER_URL,
                'version': TEMPLATE_REGISTRY_API_VERSION
            }
        });

        const response = JSON.parse(fs.readFileSync(__dirname + '/fixtures/response.in-verification-template.json'));
        const templateName = '@author/app-builder-template-2';
        const template = _getTemplateObject(templateName);
        const githubRepoUrl = template.links.github;
        nock(TEMPLATE_REGISTRY_API_SERVER_URL)
            .post(`/apis/${TEMPLATE_REGISTRY_API_VERSION}/templates`, {
                'name': templateName,
                'links': {
                    'github': githubRepoUrl
                }
            })
            .times(1)
            .reply(200, response);
        const result = await templateRegistryAPI.addTemplate(templateName, githubRepoUrl);
        expect(result).toEqual(template);
    });

    test('Successfully updates a template to Template Registry', async () => {
        const templateRegistryAPI = new TemplateRegistryAPI({
            'auth': {
                'token': IMS_ACCESS_TOKEN
            },
            'server': {
                'url': TEMPLATE_REGISTRY_API_SERVER_URL,
                'version': TEMPLATE_REGISTRY_API_VERSION
            }
        });

        const response = JSON.parse(fs.readFileSync(__dirname + '/fixtures/response.in-verification-template.json'));
        const templateName = '@author/app-builder-template-2';
        const template = _getTemplateObject(templateName);
        const githubRepoUrl = template.links.github;
        const templateId = template.id;
        nock(TEMPLATE_REGISTRY_API_SERVER_URL)
            .put(`/apis/${TEMPLATE_REGISTRY_API_VERSION}/templates/${templateId}`, {
                'links': {
                    'github': githubRepoUrl
                }
            })
            .times(1)
            .reply(200, response);
        const result = await templateRegistryAPI.updateTemplate(templateId, githubRepoUrl);
        expect(result).toEqual(template);
    });

    test('No IMS Access Token provided for the add template operation', async () => {
        const templateRegistryAPI = new TemplateRegistryAPI();
        const templateName = '@author/app-builder-template';
        const githubRepoUrl = 'https://github.com/author/app-builder-template';
        expect(templateRegistryAPI.addTemplate(templateName, githubRepoUrl)).rejects.toEqual(
            new codes.ERROR_SDK_INITIALIZATION({
                'messageValues': 'In order to add a template to Template Registry, please provide IMS Access Token during the initialization.'
            })
        );
    });

    test('Invalid IMS Access Token provided for the add template operation', async () => {
        const templateRegistryAPI = new TemplateRegistryAPI({
            'auth': {
                'token': 'invalid-token'
            },
            'server': {
                'url': TEMPLATE_REGISTRY_API_SERVER_URL,
                'version': TEMPLATE_REGISTRY_API_VERSION
            }
        });

        const templateName = '@author/app-builder-template';
        const githubRepoUrl = 'https://github.com/author/app-builder-template';
        nock(TEMPLATE_REGISTRY_API_SERVER_URL)
            .post(`/apis/${TEMPLATE_REGISTRY_API_VERSION}/templates`, {
                'name': templateName,
                'links': {
                    'github': githubRepoUrl
                }
            })
            .times(1)
            .reply(401);
        await expect(templateRegistryAPI.addTemplate(templateName, githubRepoUrl))
            .rejects.toThrow('ERROR_INVALID_IMS_ACCESS_TOKEN');
    });

    test('Not enough permissions to add a template', async () => {
        const templateRegistryAPI = new TemplateRegistryAPI({
            'auth': {
                'token': IMS_ACCESS_TOKEN
            },
            'server': {
                'url': TEMPLATE_REGISTRY_API_SERVER_URL,
                'version': TEMPLATE_REGISTRY_API_VERSION
            }
        });

        const templateName = '@author/app-builder-template';
        const githubRepoUrl = 'https://github.com/author/app-builder-template';
        nock(TEMPLATE_REGISTRY_API_SERVER_URL)
            .post(`/apis/${TEMPLATE_REGISTRY_API_VERSION}/templates`, {
                'name': templateName,
                'links': {
                    'github': githubRepoUrl
                }
            })
            .times(1)
            .reply(403);
        await expect(templateRegistryAPI.addTemplate(templateName, githubRepoUrl))
            .rejects.toThrow('ERROR_PERMISSION_DENIED');
    });

    test('Template not found, add operation', async () => {
        const templateRegistryAPI = new TemplateRegistryAPI({
            'auth': {
                'token': IMS_ACCESS_TOKEN
            },
            'server': {
                'url': TEMPLATE_REGISTRY_API_SERVER_URL,
                'version': TEMPLATE_REGISTRY_API_VERSION
            }
        });

        const templateName = '@author/app-builder-template';
        const githubRepoUrl = 'https://github.com/author/app-builder-template';
        nock(TEMPLATE_REGISTRY_API_SERVER_URL)
            .post(`/apis/${TEMPLATE_REGISTRY_API_VERSION}/templates`, {
                'name': templateName,
                'links': {
                    'github': githubRepoUrl
                }
            })
            .times(1)
            .reply(404);
        await expect(templateRegistryAPI.addTemplate(templateName, githubRepoUrl))
            .rejects.toThrow('ERROR_TEMPLATE_NOT_FOUND');
    });

    test('Template already exists', async () => {
        const templateRegistryAPI = new TemplateRegistryAPI({
            'auth': {
                'token': IMS_ACCESS_TOKEN
            },
            'server': {
                'url': TEMPLATE_REGISTRY_API_SERVER_URL,
                'version': TEMPLATE_REGISTRY_API_VERSION
            }
        });

        const templateName = '@author/app-builder-template';
        const githubRepoUrl = 'https://github.com/author/app-builder-template';
        nock(TEMPLATE_REGISTRY_API_SERVER_URL)
            .post(`/apis/${TEMPLATE_REGISTRY_API_VERSION}/templates`, {
                'name': templateName,
                'links': {
                    'github': githubRepoUrl
                }
            })
            .times(1)
            .reply(409);
        await expect(templateRegistryAPI.addTemplate(templateName, githubRepoUrl))
            .rejects.toThrow('ERROR_TEMPLATE_ALREADY_EXISTS');
    });

    test('Successfully delete a template from Template Registry', async () => {
        const templateRegistryAPI = new TemplateRegistryAPI({
            'auth': {
                'token': IMS_ACCESS_TOKEN
            },
            'server': {
                'url': TEMPLATE_REGISTRY_API_SERVER_URL,
                'version': TEMPLATE_REGISTRY_API_VERSION
            }
        });

        const templateName = '@author/app-builder-template';
        nock(TEMPLATE_REGISTRY_API_SERVER_URL)
            .delete(`/apis/${TEMPLATE_REGISTRY_API_VERSION}/templates/${templateName}`)
            .times(1)
            .reply(200);
        const response = await templateRegistryAPI.deleteTemplate(templateName);
        expect(response).toBeUndefined();
    });

    test('No IMS Access Token provided for the delete template operation', async () => {
        const templateRegistryAPI = new TemplateRegistryAPI();
        const templateName = '@author/app-builder-template';
        expect(templateRegistryAPI.deleteTemplate(templateName)).rejects.toEqual(
            new codes.ERROR_SDK_INITIALIZATION({
                'messageValues': 'In order to delete a template from Template Registry, please provide IMS Access Token during the initialization.'
            })
        );
    });

    test('Invalid IMS Access Token provided for the delete template operation', async () => {
        const templateRegistryAPI = new TemplateRegistryAPI({
            'auth': {
                'token': 'invalid-token'
            },
            'server': {
                'url': TEMPLATE_REGISTRY_API_SERVER_URL,
                'version': TEMPLATE_REGISTRY_API_VERSION
            }
        });

        const templateName = '@author/app-builder-template';
        nock(TEMPLATE_REGISTRY_API_SERVER_URL)
            .delete(`/apis/${TEMPLATE_REGISTRY_API_VERSION}/templates/${templateName}`)
            .times(1)
            .reply(401);
        await expect(templateRegistryAPI.deleteTemplate(templateName))
            .rejects.toThrow('ERROR_INVALID_IMS_ACCESS_TOKEN');
    });

    test('Not enough permissions to delete a template', async () => {
        const templateRegistryAPI = new TemplateRegistryAPI({
            'auth': {
                'token': IMS_ACCESS_TOKEN
            },
            'server': {
                'url': TEMPLATE_REGISTRY_API_SERVER_URL,
                'version': TEMPLATE_REGISTRY_API_VERSION
            }
        });

        const templateName = '@author/app-builder-template';
        nock(TEMPLATE_REGISTRY_API_SERVER_URL)
            .delete(`/apis/${TEMPLATE_REGISTRY_API_VERSION}/templates/${templateName}`)
            .times(1)
            .reply(403);
        await expect(templateRegistryAPI.deleteTemplate(templateName))
            .rejects.toThrow('ERROR_PERMISSION_DENIED');
    });

    test('Template not found, delete operation', async () => {
        const templateRegistryAPI = new TemplateRegistryAPI({
            'auth': {
                'token': IMS_ACCESS_TOKEN
            },
            'server': {
                'url': TEMPLATE_REGISTRY_API_SERVER_URL,
                'version': TEMPLATE_REGISTRY_API_VERSION
            }
        });

        const templateName = '@author/app-builder-template';
        nock(TEMPLATE_REGISTRY_API_SERVER_URL)
            .delete(`/apis/${TEMPLATE_REGISTRY_API_VERSION}/templates/${templateName}`)
            .times(1)
            .reply(404);
        await expect(templateRegistryAPI.deleteTemplate(templateName))
            .rejects.toThrow('ERROR_TEMPLATE_NOT_FOUND');
    });

    function _getTemplateObject(templateName) {
        switch (templateName) {
        case '@author/app-builder-template-1': {
            const response = JSON.parse(fs.readFileSync(__dirname + '/fixtures/response.approved-template.json'));
            return {
                'id': response.id,
                'author': response.author,
                'name': response.name,
                'status': response.status,
                'description': response.description,
                'latestVersion': response.latestVersion,
                'publishDate': new Date(response.publishDate),
                'adobeRecommended': response.adobeRecommended,
                'keywords': response.keywords,
                'links': response.links,
                'categories': response.categories,
                'runtime': false,
                'extensions': response.extensions,
                'apis': response.apis,
                'event': undefined,
                'reviewLink': undefined
            };
        }
        case '@author/app-builder-template-2': {
            const response = JSON.parse(fs.readFileSync(__dirname + '/fixtures/response.in-verification-template.json'));
            return {
                'id': response.id,
                'author': undefined,
                'name': response.name,
                'status': response.status,
                'description': undefined,
                'latestVersion': undefined,
                'publishDate': undefined,
                'adobeRecommended': undefined,
                'keywords': undefined,
                'links': response.links,
                'categories': undefined,
                'runtime': undefined,
                'extensions': undefined,
                'apis': undefined,
                'event': undefined,
                'reviewLink': response._links.review.href
            };
        }
        case '@author/app-builder-template-3': {
            return {
                'id': 'd1dc1000-f32e-4172-a0ec-9b2f3ef6cc48',
                'author': undefined,
                'name': '@author/app-builder-template-3',
                'status': 'Rejected',
                'description': undefined,
                'latestVersion': undefined,
                'publishDate': undefined,
                'adobeRecommended': undefined,
                'keywords': undefined,
                'links': {
                    'npm': 'https://www.npmjs.com/package/@author/app-builder-template-3',
                    'github': 'https://github.com/author/app-builder-template-3'
                },
                'categories': undefined,
                'runtime': undefined,
                'extensions': undefined,
                'apis': undefined,
                'event': undefined,
                'reviewLink': 'https://github.com/adobe/aio-template-submission/issues/xxx-3'
            };
        }
        case '@author/app-builder-template-4': {
            return {
                'id': 'd1ac1000-f12e-4172-a0ec-9b2f3ef6ac62',
                'author': 'Adobe Inc.',
                'name': '@author/app-builder-template-4',
                'status': 'Approved',
                'description': 'A template for testing purposes',
                'latestVersion': '2.1.0',
                'publishDate': new Date('2022-05-17T02:44:39.658Z'),
                'adobeRecommended': true,
                'keywords': [
                    'aio',
                    'adobeio',
                    'app',
                    'templates',
                    'aio-app-builder-template'
                ],
                'links': {
                    'npm': 'https://www.npmjs.com/package/@author/app-builder-template-4',
                    'github': 'https://github.com/author/app-builder-template-4'
                },
                'categories': [
                    'action',
                    'ui'
                ],
                'runtime': true,
                'extensions': undefined,
                'apis': [
                    {
                        'code': 'AnalyticsSDK',
                        'credentials': 'OAuth'
                    },
                    {
                        'code': 'Mesh',
                        'endpoints': [
                            {
                                'my-action': 'https://some-action.com/action'
                            }
                        ]
                    }
                ],
                'event': undefined,
                'reviewLink': undefined
            };
        }
        }
    }
});

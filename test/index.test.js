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

const { expect, describe, test } = require('@jest/globals');
const sdk = require('../src');

const TEMPLATE_REGISTRY_API_SERVER_URL = 'https://template-registry-api.adobe.tbd';
const TEMPLATE_REGISTRY_API_VERSION = 'v1.0.0';
const IMS_ACCESS_TOKEN = 'ims-access-token';

describe('SDK Init', () => {
    test('sdk init test, default configuration', () => {
        const sdkClient = sdk.init();
        expect(Object.keys(sdkClient)).toEqual(expect.arrayContaining(['server', 'auth']));
        expect(sdkClient['auth']).toEqual({});
    });

    test('sdk init test, Auth configuration', () => {
        const auth = {
            'token': IMS_ACCESS_TOKEN
        };
        const sdkClient = sdk.init({
            'auth': auth
        });
        expect(Object.keys(sdkClient)).toEqual(expect.arrayContaining(['server', 'auth']));
        expect(sdkClient['auth']).toEqual(auth);
    });

    test('sdk init test, Server configuration', () => {
        const server = {
            'url': TEMPLATE_REGISTRY_API_SERVER_URL,
            'version': TEMPLATE_REGISTRY_API_VERSION
        };
        const sdkClient = sdk.init({
            'server': server
        });
        expect(Object.keys(sdkClient)).toEqual(expect.arrayContaining(['server', 'auth']));
        expect(sdkClient['server']).toEqual(server);
    });

    test('sdk init test, Auth, Server configuration', () => {
        const auth = {
            'token': IMS_ACCESS_TOKEN
        };
        const server = {
            'url': TEMPLATE_REGISTRY_API_SERVER_URL,
            'version': TEMPLATE_REGISTRY_API_VERSION
        };
        const sdkClient = sdk.init({
            'auth': auth,
            'server': server
        });
        expect(Object.keys(sdkClient)).toEqual(expect.arrayContaining(['server', 'auth']));
        expect(sdkClient['auth']).toEqual(auth);
        expect(sdkClient['server']).toEqual(server);
    });
});

/*!
 * Copyright (c) 2019-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

// Required to correctly polyfill React-Native

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

global.XMLHttpRequest = jest.fn();
global.fetch = jest.fn();

if (typeof window !== 'object') {
  global.window = global;
  global.window.navigator = {};
}

import * as ReactNative from "react-native";

jest.doMock('react-native', () => {
  // Extend ReactNative
  return Object.setPrototypeOf(
      {
        NativeModules: {
          ...ReactNative.NativeModules,
          OktaSdkBridge: {
            createConfig: jest.fn(),
            signIn: jest.fn(),
            signOut: jest.fn(),
            getAccessToken: jest.fn(),
            getIdToken: jest.fn(),
            getUser: jest.fn(),
            isAuthenticated: jest.fn(),
            revokeAccessToken: jest.fn(),
            revokeIdToken: jest.fn(),
            revokeRefreshToken: jest.fn(),
            introspectAccessToken: jest.fn(),
            introspectIdToken: jest.fn(),
            introspectRefreshToken: jest.fn(),
            refreshTokens: jest.fn(),
          },
        },
      },
      ReactNative,
  );
});

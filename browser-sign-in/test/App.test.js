/*
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

import React from 'react';
import App from '../App';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { waitForState } from 'enzyme-async-helpers';

import { NativeEventEmitter } from 'react-native';

jest.mock(
  '../node_modules/react-native/Libraries/EventEmitter/NativeEventEmitter',
);

const nativeEmitter = new NativeEventEmitter();

jest
  .mock(
    '../node_modules/react-native/Libraries/Components/StatusBar/StatusBar',
    () => 'StatusBar',
  )
  .mock(
    '../node_modules/react-native/Libraries/Components/ScrollView/ScrollView',
    () => 'ScrollView',
  );

global.fetch = jest
  .fn()
  .mockImplementation(() => {
    const promise = new Promise((resolve, _reject) => {
      resolve({
        json: () => {
          return {
            user: [{ foo: 'foo', bar: 'bar' }],
          };
        },
        ok: true,
      });
    });
    return promise;
  })
  .mockImplementationOnce(() => {
    const promise = new Promise((resolve, _reject) => {
      resolve({
        json: () => {
          return {
            // eslint-disable-next-line camelcase
            userinfo_endpoint: 'dummy_endpoint',
          };
        },
        ok: true,
      });
    });
    return promise;
  });

describe('app setup', () => {
  it('should render without crashing', () => {
    const rendered = renderer.create(<App />).toJSON();
    expect(rendered).toBeTruthy();
  });

  it('should render correctly', () => {
    const rendered = renderer.create(<App />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should initialize with default state', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.state().authenticated).toBe(false);
    expect(wrapper.state().context).toBe(null);
  });

  it('should render login button if not authenticated', () => {
    const wrapper = shallow(<App />);
    const loginButton = wrapper.find('Button').get(0);
    expect(loginButton.props.title).toBe('Login');
  });

  it('should render logout and get user info buttons if authenticated', () => {
    const wrapper = shallow(<App />);
    wrapper.setState({authenticated: true});
    const logoutButton = wrapper.find('Button').get(0);
    const getUserFromIdButton = wrapper.find('Button').get(1);
    const getUserButton = wrapper.find('Button').get(2);
    const getUserFromTokenButton = wrapper.find('Button').get(3);
    const refreshMyTokensButton = wrapper.find('Button').get(4);
    expect(logoutButton.props.title).toBe('Logout');
    expect(getUserFromIdButton.props.title).toBe('Get User From Id Token');
    expect(getUserButton.props.title).toBe('Get User From Request');
    expect(getUserFromTokenButton.props.title).toBe('Get User From Access Token');
    expect(refreshMyTokensButton.props.title).toBe('Refresh Tokens');
  });

  it('should not render login button if authenticated', () => {
    const wrapper = shallow(<App />);
    wrapper.setState({authenticated: true});
    const loginButton = wrapper.find('Button').get(0);
    expect(loginButton.props.title).not.toBe('Login');
  });

  it('should not render logout and get user info buttons if not authenticated', () => {
    const wrapper = shallow(<App />);
    const logoutButton = wrapper.find('Button').get(0);
    const getUserFromIdButton = wrapper.find('Button').get(1);
    const getUserButton = wrapper.find('Button').get(2);
    const getUserFromTokenButton = wrapper.find('Button').get(3);
    const refreshMyTokensButton = wrapper.find('Button').get(4);
    expect(logoutButton.props.title).not.toBe('Logout');
    expect(getUserFromIdButton).toBe(undefined);
    expect(getUserButton).toBe(undefined);
    expect(getUserFromTokenButton).toBe(undefined);
    expect(refreshMyTokensButton).toBe(undefined);
  });
});

describe('authentication flow', () => {
  it('should detect when the user has logged in', async () => {
    const wrapper = shallow(<App />);
    const loginButton = wrapper.find('Button').get(0);
    await loginButton.props.onPress();
    expect(loginButton.props.title).toBe('Login');
    nativeEmitter.emit('signInSuccess');
    expect(wrapper.state().authenticated).toBe(true);
    expect(wrapper.state().context).toBe('Logged in!');
  });

  it('should detect when the user has signed out', async () => {
    const wrapper = shallow(<App />);
    wrapper.setState({authenticated: true});
    const logoutButton = wrapper.find('Button').get(0);
    await logoutButton.props.onPress();
    expect(logoutButton.props.title).toBe('Logout');
    nativeEmitter.emit('signOutSuccess');
    expect(wrapper.state().authenticated).toBe(false);
    expect(wrapper.state().context).toBe('Logged out!');
  });

  it('should return user profile information from id token' , async () => {
    const mockGetIdToken = require('react-native').NativeModules.OktaSdkBridge.getIdToken;
    mockGetIdToken.mockImplementationOnce(() => {
      // id_token returns { a: 'b' }
      return {'id_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhIjoiYiJ9.jiMyrsmD8AoHWeQgmxZ5yq8z0lXS67_QGs52AzC8Ru8'};
    });
    const wrapper = shallow(<App />);
    wrapper.setState({authenticated: true});
    const profileButton = wrapper.find('Button').get(1);
    await profileButton.props.onPress();
    await waitForState(wrapper, state => state.context !== null);
    expect(profileButton.props.title).toBe('Get User From Id Token');
    expect(wrapper.state().context).toContain('User Profile');
  });

  it('should return user profile information from getUser method' , async () => {
    const mockGetUser = require('react-native').NativeModules.OktaSdkBridge.getUser;
    mockGetUser.mockResolvedValue({ 'name': 'fake name' });
    const wrapper = shallow(<App />);
    wrapper.setState({authenticated: true});
    const profileButton = wrapper.find('Button').get(2);
    await profileButton.props.onPress();
    await waitForState(wrapper, state => state.context !== null);
    expect(profileButton.props.title).toBe('Get User From Request');
    expect(wrapper.state().context).toContain('User Profile');
  });

  it('should return user profile information from fetch method' , async () => {
    const mockGetAccessToken = require('react-native').NativeModules.OktaSdkBridge.getAccessToken;
    mockGetAccessToken.mockImplementation(() => {
      return {'access_token': 'dummy_access_token'};
    });
    const wrapper = shallow(<App />);
    wrapper.setState({authenticated: true});
    const profileButton = wrapper.find('Button').get(3);
    await profileButton.props.onPress();
    await waitForState(wrapper, state => state.context !== null);
    expect(profileButton.props.title).toBe('Get User From Access Token');
    expect(wrapper.state().context).toContain('foo');
  });

  it('should return new accessToken, idToken and refreshToken' , async () => {
    const mockRefreshTokens = require('react-native').NativeModules.OktaSdkBridge.refreshTokens;
    mockRefreshTokens.mockImplementation(() => {
      return {'access_token': 'dummy_accessToken',
              'id_token': 'dummy_idToken',
            'refresh_token': 'dummy_refreshToken'};
    });
    const wrapper = shallow(<App />);
    wrapper.setState({authenticated: true});
    const profileButton = wrapper.find('Button').get(4);
    await profileButton.props.onPress();
    await waitForState(wrapper, state => state.context !== null);
    expect(profileButton.props.title).toBe('Refresh Tokens');
    expect(wrapper.state().context).toContain('Successfully refreshed tokens: ');
  });
});

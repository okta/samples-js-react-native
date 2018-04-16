/*
 * Copyright (c) 2018, Okta, Inc. and/or its affiliates. All rights reserved.
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
import App from './App';

import { shallow, render } from 'enzyme';

import renderer from 'react-test-renderer';

import TokenClient from '@okta/okta-react-native'

jest.mock('@okta/okta-react-native');

global.fetch = jest
  .fn()
  .mockImplementationOnce(() => {
    const promise = new Promise((resolve, reject) => {
      resolve({
        json: () => {
          return {
            messages: [{ foo: 'foo', bar: 'bar' }]
          }
        }
      });
    });
    return promise;
  })
  .mockImplementationOnce(() => {
    const promise = new Promise((resolve, reject) => {
      console.warn('error');
      reject();
    });
    return promise;
  });

global.console = {
  warn: jest.fn().mockImplementationOnce(() => {
    return 'error';
  })
}

it('renders without crashing', () => {
  const rendered = renderer.create(<App />).toJSON();
  expect.assertions(1);
  expect(rendered).toBeTruthy();
});

it('renders correctly', () => {
  const rendered = renderer.create(<App />).toJSON();
  expect.assertions(1);
  expect(rendered).toMatchSnapshot();
});

it('should initialize with default state', () => {
  const wrapper = shallow(<App />);
  expect.assertions(2);
  expect(wrapper.state().authenticated).toBe(false);
  expect(wrapper.state().context).toBe(null);
});

it('should click login', async () => {
  const wrapper = shallow(<App />);
  const loginButton = wrapper.find('Button').get(0);
  await loginButton.props.onPress();
  expect.assertions(2);
  expect(loginButton.props.title).toBe('Login');
  expect(wrapper.state().context).toBe('Logged in!');
});

it('should click logout', async () => {
  const wrapper = shallow(<App />);
  wrapper.setState({authenticated: true});
  const logoutButton = wrapper.find('Button').get(0);
  await logoutButton.props.onPress();
  expect.assertions(2);
  expect(logoutButton.props.title).toBe('Logout');
  expect(wrapper.state().context).toBe('');
});

it('should click profile and fail', async () => {
  const wrapper = shallow(<App />);
  const profileButton = wrapper.find('Button').get(1);
  profileButton.props.onPress();
  expect.assertions(2);
  expect(profileButton.props.title).toBe('Profile');
  expect(wrapper.state().context).toBe('User has not logged in.');
});

it('should click profile and succeed', async () => {
  const wrapper = shallow(<App />);
  wrapper.setState({authenticated: true});
  const profileButton = wrapper.find('Button').get(1);
  await profileButton.props.onPress();
  expect.assertions(2);
  expect(profileButton.props.title).toBe('Profile');
  expect(wrapper.state().context).toContain('User Profile');
});

it('should click messages and fail', async () => {
  const wrapper = shallow(<App />);
  const messagesButton = wrapper.find('Button').get(2);
  await messagesButton.props.onPress();
  expect.assertions(2);
  expect(messagesButton.props.title).toBe('Messages');
  expect(wrapper.state().context).toBe('User has not logged in.');
});

it('should click messages and succeed', async () => {
  const wrapper = shallow(<App />);
  wrapper.setState({authenticated: true});
  const messagesButton = wrapper.find('Button').get(2);
  await messagesButton.props.onPress();
  expect.assertions(2);
  expect(messagesButton.props.title).toBe('Messages');
  const messages = wrapper.state().context;
  expect(messages).toEqual([{ foo: 'foo', bar: 'bar' }]);
});

it('should click messages and fail API call', async () => {
  const wrapper = shallow(<App />);
  wrapper.setState({authenticated: true});
  const messagesButton = wrapper.find('Button').get(2);
  await messagesButton.props.onPress();
  expect.assertions(2);
  expect(messagesButton.props.title).toBe('Messages');
  expect(console.warn).toHaveBeenCalled();
});

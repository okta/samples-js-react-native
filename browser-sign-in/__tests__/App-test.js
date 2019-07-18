/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

import { shallow, render } from 'enzyme';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
// import { 
// 	createConfig, 
//   signIn, 
//   signOut, 
//   getAccessToken, 
//   isAuthenticated,
//   getUser,
//   getUserFromIdToken
// } from '@okta/okta-react-native';

// jest.mock('@okta/okta-react-native', () => {
// 	// const EventEmitter = {
// 	// 	addEventListener: jest.fn((event, cb) => {
// 	// 		cb();
// 	// 	})
// 	// };
//   return { 
// 		createConfig: jest.fn(),
// 		signIn: jest.fn(),
// 		signOut: jest.fn(),
// 		getAccessToken: jest.fn(),
// 		isAuthenticated: jest.fn(),
// 		getUser: jest.fn(),
// 		getUserFromIdToken: jest.fn(),
// 		//EventEmitter
//   };
// });

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

describe('app setup', () => {
  it('should render without crashing', () => {
    const rendered = renderer.create(<App />).toJSON();
    expect.assertions(1);
    expect(rendered).toBeTruthy();
  });

  // it('should render correctly', () => {
  //   const rendered = renderer.create(<App />).toJSON();
  //   expect.assertions(1);
  //   expect(rendered).toMatchSnapshot();
  // });

  // it('should initialize with default state', () => {
  //   const wrapper = shallow(<App />);
  //   expect.assertions(2);
  //   expect(wrapper.state().authenticated).toBe(false);
  //   expect(wrapper.state().context).toBe(null);
	// });
})





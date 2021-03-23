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

import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaView } from 'react-native';
import { isAuthenticated } from '@okta/okta-react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './app/LoginScreen.js';
import ProfileScreen from './app/ProfileScreen.js';
import { createConfig } from '@okta/okta-react-native';
import configFile from './samples.config';
import Spinner from 'react-native-loading-spinner-overlay';

const Stack = createStackNavigator();

export default class App extends React.Component {

  constructor() {
    super();

    this.state = {
      progress: true,
      authenticated: false,
    };
    
    this.checkAuthentication = this.checkAuthentication.bind(this);
  }

  async checkAuthentication() {
    const result = await isAuthenticated();

    this.setState({
      authenticated: result.authenticated, 
      progress: false
    });
  }

  async componentDidMount() {
    await createConfig({
      clientId: configFile.oidc.clientId,
      redirectUri: configFile.oidc.redirectUri,
      endSessionRedirectUri: configFile.oidc.endSessionRedirectUri,
      discoveryUri: configFile.oidc.discoveryUri,
      scopes: configFile.oidc.scopes,
      requireHardwareBackedKeyStore:
        configFile.oidc.requireHardwareBackedKeyStore,
    });
    

    await this.checkAuthentication();
  }

  render() {
    if (this.state.progress) {
      return (
        <SafeAreaView>
          <Spinner visible={true} />
        </SafeAreaView>
      );
    }
  
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={this.state.authenticated ? 'Profile' : 'Login'}>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ title: 'Login', headerLeft: null }} 
          />
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen} 
            options={{ title: 'User Profile'}} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

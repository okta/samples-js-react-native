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

import { Button, StyleSheet, Text, View } from 'react-native';
import { 
  createConfig, 
  signIn, 
  signOut, 
  getAccessToken, 
  isAuthenticated,
  getUser,
  getUserFromIdToken,
  EventEmitter,
 } from '@okta/okta-react-native';
 import configFile from './samples.config';

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      authenticated: false,
      context: null
    }
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.getMyUserThroughAccessToken = this.getMyUserThroughAccessToken.bind(this);
  }
  
  async componentDidMount() {
    let that = this;
    EventEmitter.addListener('signInSuccess', function(e: Event) {
      that.setState({ authenticated: true });
      that.setContext('Logged in!');
    });
    EventEmitter.addListener('signOutSuccess', function(e: Event) {
      that.setState({ authenticated: false });
      that.setContext('Logged out!');
    });
    EventEmitter.addListener('onError', function(e: Event) {
      console.warn(e);
      that.setContext(e.error_message);
    });
    EventEmitter.addListener('onCancelled', function(e: Event) {
      console.warn(e);
    });
    await createConfig({
      clientId: configFile.oidc.clientId,
      redirectUri: configFile.oidc.redirectUri,
      endSessionRedirectUri: configFile.oidc.endSessionRedirectUri,
      discoveryUri: configFile.oidc.discoveryUri,
      scopes: configFile.oidc.scopes,
      requireHardwareBackedKeyStore: configFile.oidc.requireHardwareBackedKeyStore
    });
    this.checkAuthentication();
  }
  
  componentWillUnmount() {
    EventEmitter.removeAllListeners();
  }

  async componentDidUpdate() {
    this.checkAuthentication();
  }

  async checkAuthentication() {
    const result = await isAuthenticated();
    if (result.authenticated !== this.state.authenticated) {
      this.setState({ authenticated: result.authenticated });
    }
  }

  async login() {
    signIn();
  }

  async logout() {
    signOut();
  }

  async getUserIdToken() {
    let user = await getUserFromIdToken();
    this.setContext(`
      User Profile:
      ${JSON.stringify(user, null, 4)}
    `);
  }
  
  async getMyUser() {
    let user = await getUser();
    this.setContext(`
      User Profile:
      ${user}
    `);
  }

  async getMyUserThroughAccessToken() {
    const accessToken = await getAccessToken();

    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    if (accessToken) {
      try {
        const wellKnown = await fetch(`${configFile.oidc.discoveryUri}/.well-known/openid-configuration`, {
          method: 'GET',
          headers: headers,
        });
        if (!wellKnown.ok) {
          throw Error(wellKnown.status);
        }
        let json = await wellKnown.json();
        headers['Authorization'] = `Bearer ${accessToken.access_token}`;
        const userInfo = await fetch(`${json.userinfo_endpoint}`, {
          method: 'GET',
          headers: headers
        });
        if (!userInfo.ok) {
          throw Error(userInfo.status);
        }
        json = await userInfo.json();
        this.setContext(JSON.stringify(json));
      } catch(e) {
        const message = 'Failed to fetch messages. Make sure you have logged in and access token is valid. Status Code: ' + e;
        console.warn(message);
        this.setContext(message);
      }
    } else {
      const message = 'There is no access token available!';
      console.warn(message);
      this.setContext(message);
    }
  }

  setContext = (message) => {
    this.setState({
      context: message
    });
  }
  
  renderButtons() {
    if (this.state.authenticated) {
      return (
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button
            onPress={ async () => { this.getUserIdToken() } }
            title="Get User From Id Token"
          />
        </View>
        <View style={styles.button}>
          <Button
            onPress={ async () => { this.getMyUser() } }
            title="Get User From Request"
          />
        </View>
        <View style={styles.button}>
          <Button
            onPress={ async () => { this.getMyUserThroughAccessToken() } }
            title="Get User From Access Token"
          />
        </View>
      </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Okta + React Native</Text>
        <View style={styles.button}>
          {this.state.authenticated ?
            <Button
              onPress={ async () => { this.logout() } }
              title="Logout"
            /> :
            <Button
              onPress={ async () => { this.login() } }
              title="Login"
            />
          }
        </View>
        {this.renderButtons()}
        <Text>{this.state.context}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 20
  },
  button: {
    borderRadius: 40,
    width: 200,
    height: 40,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 10
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0066cc'
  }
});

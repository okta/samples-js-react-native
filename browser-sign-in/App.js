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

import React, {Fragment} from 'react';

import {
  SafeAreaView,
  ScrollView,
  Button,
  StyleSheet,
  Text,
  View,
  StatusBar,
} from 'react-native';
import {
  createConfig,
  signInWithBrowser,
  signOut,
  getAccessToken,
  isAuthenticated,
  getUser,
  getUserFromIdToken,
  refreshTokens,
  EventEmitter,
} from '@okta/okta-react-native';

import configFile from './samples.config';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      authenticated: false,
      context: null,
    };
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.getMyUserThroughAccessToken = this.getMyUserThroughAccessToken.bind(
      this,
    );
  }

  async componentDidMount() {
    let that = this;
    EventEmitter.addListener('signInSuccess', function (error) {
      if (error) {
        console.warn(error);
        that.setContext(error.error_message);
        return;
      }

      that.setState({authenticated: true});
      that.setContext('Logged in!');
    });
    
    EventEmitter.addListener('signOutSuccess', function (error) {
      if (error) {
        console.warn(error);
        that.setContext(error.error_message);
        return; 
      }

      that.setState({authenticated: false});
      that.setContext('Logged out!');
    });

    EventEmitter.addListener('onError', function (error) {
      console.warn(error);
      that.setContext(error.error_message);
    });

    EventEmitter.addListener('onCancelled', function (error) {
      console.warn(error);
    });

    await createConfig({
      clientId: configFile.oidc.clientId,
      redirectUri: configFile.oidc.redirectUri,
      endSessionRedirectUri: configFile.oidc.endSessionRedirectUri,
      discoveryUri: configFile.oidc.discoveryUri,
      scopes: configFile.oidc.scopes,
      requireHardwareBackedKeyStore:
        configFile.oidc.requireHardwareBackedKeyStore,
    });
    this.checkAuthentication();
  }

  componentWillUnmount() {
    EventEmitter.removeAllListeners('signInSuccess');
    EventEmitter.removeAllListeners('signOutSuccess');
    EventEmitter.removeAllListeners('onError');
    EventEmitter.removeAllListeners('onCancelled');
  }

  async componentDidUpdate() {
    this.checkAuthentication();
  }

  async checkAuthentication() {
    const result = await isAuthenticated();
    if (result.authenticated !== this.state.authenticated) {
      this.setState({authenticated: result.authenticated});
    }
  }

  async login() {
    signInWithBrowser();
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
      ${JSON.stringify(user, null, 4)}
    `);
  }

  async getMyUserThroughAccessToken() {
    const accessToken = await getAccessToken();

    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      try {
        const wellKnown = await fetch(
          `${configFile.oidc.discoveryUri}/.well-known/openid-configuration`,
          {
            method: 'GET',
            headers: headers,
          },
        );
        if (!wellKnown.ok) {
          throw Error(wellKnown.status);
        }
        let json = await wellKnown.json();
        headers.Authorization = `Bearer ${accessToken.access_token}`;
        const userInfo = await fetch(`${json.userinfo_endpoint}`, {
          method: 'GET',
          headers: headers,
        });
        if (!userInfo.ok) {
          throw Error(userInfo.status);
        }
        json = await userInfo.json();
        this.setContext(JSON.stringify(json));
      } catch (e) {
        const message =
          'Failed to fetch user. Make sure you have logged in and access token is valid. Status Code: ' +
          e;
        console.warn(message);
        this.setContext(message);
      }
    } else {
      const message = 'There is no access token available!';
      console.warn(message);
      this.setContext(message);
    }
  }

  async refreshMyTokens() {
    let newTokens = await refreshTokens().catch(e => {console.log(e)});
    if (newTokens) {
    const message = ("Successfully refreshed tokens: " + JSON.stringify(newTokens));
    console.log(message);
    this.setContext(message);
    } 
    else {
     const message = ("Failed to refresh tokens: Be sure Refresh Token grant type is enabled in your app in Okta, as well as the offline_access scope in samples.config.js")
     this.setContext(message)
    }
  }

  setContext = (message) => {
    this.setState({
      context: message,
    });
  };

  renderButtons() {
    if (this.state.authenticated) {
      return (
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button
              testID="getUserFromIdToken"
              onPress={async () => {
                this.getUserIdToken();
              }}
              title="Get User From Id Token"
            />
          </View>
          <View style={styles.button}>
            <Button
              testID="getUserFromRequest"
              onPress={async () => {
                this.getMyUser();
              }}
              title="Get User From Request"
            />
          </View>
          <View style={styles.button}>
            <Button
              testID="getMyUserFromAccessToken"
              onPress={async () => {
                this.getMyUserThroughAccessToken();
              }}
              title="Get User From Access Token"
            />
          </View>
          <View style={styles.button}>
            <Button
              testID="refreshMyTokens"
              onPress={async () => {
                this.refreshMyTokens();
              }}
              title="Refresh Tokens"
            />
          </View>
          <View style={styles.button}>
            <Button
              testID="clearButton"
              onPress={async () => {
                this.setContext('');
              }}
              title="Clear Text"
            />
          </View>
        </View>
      );
    }
  }

  render() {
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <Text testID="titleLabel" style={styles.title}>Okta + React Native</Text>
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              {this.state.authenticated ? (
                <Button
                  style={styles.button}
                  testID="logoutButton"
                  onPress={async () => {
                    this.logout();
                  }}
                  title="Logout"
                />
              ) : (
                <Button
                  style={styles.button}
                  testID="loginButton"
                  onPress={async () => {
                    this.login();
                  }}
                  title="Login"
                />
              )}
            </View>
          </View>
          {this.renderButtons()}
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.context}>
            <Text testID="descriptionBox">{this.state.context}</Text>
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    borderRadius: 40,
    height: 40,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  context: {
    marginTop: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0066cc',
    paddingTop: 40,
    textAlign: 'center',
  },
});

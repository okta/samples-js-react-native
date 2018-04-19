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
import TokenClient from '@okta/okta-react-native';
import config from './.samples.config';

const tokenClient = new TokenClient({
  issuer: config.oidc.issuer,
  client_id: config.oidc.clientId,
  scope: config.oidc.scope,
  redirect_uri: config.oidc.redirectUri
});

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      authenticated: false,
      context: null
    }
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.getUser = this.getUser.bind(this);
    this.getMessages = this.getMessages.bind(this);
  }

  async componentDidUpdate() {
    this.checkAuthentication();
  }

  async componentDidMount() {
    await this.checkAuthentication();
  }

  async checkAuthentication() {
    const authenticated = await tokenClient.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated: authenticated });
    }
  }

  async login() {
    await tokenClient.signInWithRedirect();
    this.setContext('Logged in!');
  }

  async logout() {
    await tokenClient.signOut();
    this.setState({context: '' });
  }

  async getUser() {
    if (!this.state.authenticated) {
      this.setContext('User has not logged in.');
      return;
    }
    const user = await tokenClient.getUser();
    this.setContext(`
      User Profile:
      ${JSON.stringify(user, null, 4)}
    `);
  }

  async getMessages() {
    if (!this.state.authenticated) {
      this.setContext('User has not logged in.');
      return;
    }

    await fetch(config.resourceServer.messagesUrl, {  
      method: 'GET',
      headers: {
        Authorization: `Bearer ${await tokenClient.getAccessToken()}`,
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(json => {
      this.setContext(JSON.stringify(json.messages, null, 4));
    })
    .catch((err) => {
      console.warn(err);
      const error = `
      Failed to fetch messages. Please verify the following:

      - You've downloaded one of our resource server examples, and it's running on port 8000.

      - Your resource server example is using the same Okta authorization server (issuer) that you have configured this application to use.
      `
      console.warn(error);
      this.setContext('Failed to fetch messages.');
    });
  }

  setContext = (message) => {
    this.setState({
      context: message
    });
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
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button
              onPress={ async () => { this.getUser() } }
              title="Profile"
            />
          </View>
          <View style={styles.button}>
            <Button
              onPress={ async () => { this.getMessages() } }
              title="Messages"
            />
          </View>
        </View>
        <Text>{this.state.context}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 15,
    width: '40%',
    height: 40,
    marginTop: 10,
    marginBottom: 10
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

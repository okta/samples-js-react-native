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

  async componentDidMount() {
    await this.checkAuthentication();
  }

  async checkAuthentication() {
    const authenticated = await tokenClient.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated: authenticated });
    }
  }

  login = async () => {
    await tokenClient.signInWithRedirect();
    this.checkAuthentication();
  }

  logout = async () => {
    await tokenClient.signOut();
    this.checkAuthentication();
    this.setState({context: '' });
  }

  getUser = async () => {
    if (!this.state.authenticated) {
      this.setContext('User has not logged in.');
      return;
    }
    const user = await tokenClient.getUser();
    this.setContext(JSON.stringify(user, null, 4));
  }

  getMessages = async () => {
    fetch(config.resourceServer.messagesUrl, {  
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
    .catch(() => {
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

/*
 * Copyright (c) 2019, Okta, Inc. and/or its affiliates. All rights reserved.
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
  Button,
  StyleSheet,
  Text,
  View,
  StatusBar,
} from 'react-native';
import {
  createConfig,
  authenticate,
  getAccessToken,
  EventEmitter,
} from '@okta/okta-react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import configFile from './../samples.config';

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'User Profile',
  };

  constructor() {
    super();
    this.state = {
      authenticated: false,
      accessToken: null,
      progress: false,
    };
  }

  async componentDidMount() {
    let self = this;
    EventEmitter.addListener('signInSuccess', function(e: Event) {
      self.getAccessToken();
    });
    EventEmitter.addListener('onError', function(e: Event) {
      console.warn(e);
      self.setState({progress: false});
    });
    EventEmitter.addListener('onCancelled', function(e: Event) {
      console.warn(e);
      self.setState({progress: false});
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
  }

  componentWillUnmount() {
    EventEmitter.removeAllListeners('signInSuccess');
    EventEmitter.removeAllListeners('onError');
    EventEmitter.removeAllListeners('onCancelled');
  }

  async getAccessToken() {
    const promise = await getAccessToken();
    this.setState({accessToken: promise.access_token});
    this.setState({authenticated: true});
    this.setState({progress: false});
  }

  async exchangeSessionToken({sessionToken}) {
    this.setState({progress: true});
    authenticate({sessionToken});
  }

  render() {
    const {navigation} = this.props;
    const transaction = navigation.getParam('transaction', 'NO-ID');
    const userProfile = transaction.data._embedded.user.profile;
    let accessTokenArea;
    if (this.state.authenticated) {
      accessTokenArea = (
        <View style={{marginTop: 60, height: 140}}>
          <Text>Access Token:</Text>
          <Text style={{marginTop: 20}}>{this.state.accessToken}</Text>
        </View>
      );
    } else {
      accessTokenArea = (
        <View style={{marginTop: 60, height: 40}}>
          <Button
            testID="getAccessTokenButton"
            onPress={async () => {
              this.exchangeSessionToken({
                sessionToken: transaction.sessionToken,
              });
            }}
            title="Get Access Token"
          />
        </View>
      );
    }
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <Spinner
            visible={this.state.progress}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
          <Text style={styles.titleHello}>
            Hello {userProfile.firstName} {userProfile.lastName}
          </Text>
          <Text style={styles.titleDetails}>Login: {userProfile.login}</Text>
          <Text style={styles.titleDetails}>
            Session expires: {transaction.expiresAt}
          </Text>
          {accessTokenArea}
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF',
  },
  button: {
    borderRadius: 40,
    width: 200,
    height: 40,
    marginTop: 40,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  titleHello: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066cc',
    paddingTop: 40,
    textAlign: 'center',
  },
  titleDetails: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingTop: 15,
    textAlign: 'center',
  },
});

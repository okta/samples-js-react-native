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
  ScrollView,
  Button,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  ActivityIndicator,
} from 'react-native';

import {createAppContainer} from 'react-navigation';

import {createStackNavigator} from 'react-navigation-stack';

class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Details',
  };
  render() {
    const {navigation} = this.props;
    const transaction = navigation.getParam('transaction', 'NO-ID');
    //const name = ((user || {}).personalInfo || {}).name;
    const login = transaction.data._embedded.user.id;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
        <Text>{login}</Text>
        </SafeAreaView>
      </Fragment>
    );
  }
}

class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login',
  };

  constructor() {
    super();
    this.state = {
      userName: '',
      password: '',
      progress: false,
    };
    var OktaAuth = require('@okta/okta-auth-js');
    var config = {
      url: 'https://sdk-test.trexcloud.com',
      redirectUri: 'com.okta.example:/callback',
      clientId: '0oa2p7eq7uDmZY4sJ0g7',
      issuer: 'https://sdk-test.trexcloud.com/oauth2/default',
   };

    this.authClient = new OktaAuth(config);
  }

  async login() {
    let self = this;
    this.authClient
      .signIn({
        username: this.state.userName,
        password: this.state.password,
    })
    .then(function(transaction) {
      if (transaction.status === 'SUCCESS') {
        //authClient.session.setCookieAndRedirect(transaction.sessionToken); // Sets a cookie on redirect
        /*self.setContext(`
          User Profile:
          ${transaction.sessionToken}
    `   );*/
        const {navigate} = self.props.navigation;
        navigate('Profile', {transaction: transaction});
      } else {
        throw 'We cannot handle the ' + transaction.status + ' status';
      }
    })
    .fail(function(err) {
      console.error(err);
    });
  }

  showProgress() {
    if (this.state.progress) {
      return (
        <View>
           <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
  }

  render() {
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>Native Sign-In</Text>
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
            <TextInput
                style={styles.textInput}
                placeholder="Login"
                onChangeText={text => (this.state.userName = text)}
            />
            <TextInput
                style={styles.textInput}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={text => (this.state.password = text)}
            />
            <View style={{marginTop: 40, height: 40}}>
              <Button
                  testID="loginButton"
                  onPress={async () => {
                    this.state.progress = true;
                    this.login();
                  }}
                  title="Login"
                />
            </View>
            </View>
            {this.showProgress()}
          </View>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.context}>
            <Text>{this.state.context}</Text>
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const MainNavigator = createStackNavigator({
  LoginScreen: {screen: LoginScreen},
  Profile: {screen: ProfileScreen},
});

const App = createAppContainer(MainNavigator);

export default App;

const styles = StyleSheet.create({
  textInput: {
    marginTop: 10,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 10,
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
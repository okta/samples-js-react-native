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
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

export default class LoginScreen extends React.Component {
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
    };

    this.authClient = new OktaAuth(config);
  }

  async login() {
    let self = this;
    this.setState({progress: true});
    this.authClient
      .signIn({
        username: this.state.userName,
        password: this.state.password,
      })
      .then(function(transaction) {
        self.setState({progress: false});
        if (transaction.status === 'SUCCESS') {
          const {navigate} = self.props.navigation;
          navigate('Profile', {transaction: transaction});
        } else {
          throw 'We cannot handle the ' + transaction.status + ' status';
        }
      })
      .fail(function(err) {
        console.error(err);
        self.setState({progress: false});
      });
  }

  render() {
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <Spinner
            visible={this.state.progress}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
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

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
  },
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

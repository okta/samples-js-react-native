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

import React from 'react';
import {
  SafeAreaView,
  Button,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
} from 'react-native';
import { signIn } from '@okta/okta-react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Error from './components/Error';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      progress: false,
      username: '',
      password: '',
      error: '',
    };

    this.login = this.login.bind(this);
    this.reset = this.reset.bind(this);
  }

  reset() {
    this.setState({ 
      progress: false, 
      username: '', 
      password: '',
      error: '' 
    });
  }

  login() {
    if (this.state.progress == true) {
      return;
    }

    this.setState({ progress: true });

    const { username, password } = this.state;
    const { navigation } = this.props;
    
    signIn({ username, password })
      .then(_token => {
        this.setState({ 
          progress: false, 
          username: '', 
          password: '',
          error: '' 
        }, () => navigation.navigate('Profile'));
      })
      .catch(error => {
        this.setState({
          progress: false,
          username: '', 
          password: '', 
          error: error.message 
        });
      });
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <Spinner
            testID="spinner"
            visible={this.state.progress}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
          <Text style={styles.title} testID="titleBox">Native Sign-In</Text>
          <Error error={this.state.error} />
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <TextInput
                value={this.state.username}
                style={styles.textInput}
                placeholder="User Name"
                onChangeText={username => this.setState({ username: username })}
                testID="usernameTextInput"
              />
              <TextInput
                style={styles.textInput}
                value={this.state.password}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={password => this.setState({ password: password })}
                testID="passwordTextInput"
              />
              <View style={{marginTop: 40, height: 40}}>
                <Button
                  onPress={this.login}
                  title="Login"
                  testID="loginButton"
                />
              </View>
              <View style={{marginTop: 40, height: 40}}>
                <Button
                  onPress={this.reset}
                  title="Reset"
                  testID="resetButton"
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </>
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
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0066cc',
    paddingTop: 40,
    textAlign: 'center',
  }
});

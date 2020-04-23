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
      username: '',
      password: '',
      progress: false,
      error: '',
    };

    this.login = this.login.bind(this);
  }

  login() {
    this.setState({ progress: true });

    const { username, password } = this.state;
    const { navigation } = this.props;
    signIn({ username, password })
      .then(token => {
        this.setState({ 
          progress: false, 
          username: '', 
          password: '', 
          error: '' 
        }, () => navigation.navigate('Profile'));
      })
      .catch(e => {
        this.setState({ progress: false, error: e.message });
      });
  }

  render() {
    const { progress, error } = this.state;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <Spinner
            visible={progress}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
          <Text style={styles.title}>Native Sign-In</Text>
          <Error error={error} />
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <TextInput
                style={styles.textInput}
                placeholder="User Name"
                onChangeText={username => this.setState({ username })}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={password => this.setState({ password })}
              />
              <View style={{marginTop: 40, height: 40}}>
                <Button
                  testID="loginButton"
                  onPress={this.login}
                  title="Login"
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

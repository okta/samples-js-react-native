/**
 * @format
 */

import {AppRegistry} from 'react-native';
import { createConfig } from '@okta/okta-react-native';
import App from './App';
import {name as appName} from './app.json';
import configFile from './samples.config'

createConfig({
  clientId: configFile.oidc.clientId,
  redirectUri: configFile.oidc.redirectUri,
  endSessionRedirectUri: configFile.oidc.endSessionRedirectUri,
  discoveryUri: configFile.oidc.discoveryUri,
  scopes: configFile.oidc.scopes,
  requireHardwareBackedKeyStore:
    configFile.oidc.requireHardwareBackedKeyStore,
});

AppRegistry.registerComponent(appName, () => App);

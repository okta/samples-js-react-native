[![CI Status](https://travis-ci.com/okta/samples-js-react-native.svg?branch=master)](https://travis-ci.com/github/okta/samples-js-react-native)

# React Native Sample Applications for Okta

This repository contains several sample applications that demonstrate various Okta use-cases in your React Native application.

Each sample makes use of the [Okta React Native Library](https://github.com/okta/okta-react-native).

## Supported Platforms
- iOS 11+ [Okta OIDC iOS Supported Platforms](https://github.com/okta/okta-oidc-ios#supported-platforms)
- Android API 21+ [Okta OIDC Android MinSDK Requirements](https://github.com/okta/okta-oidc-android#requirements)

## Prerequisites

Before running the samples, you will need the following:

* An Okta Developer Account, you can sign up for one at <https://developer.okta.com/signup/>.
* An Okta Application, configured for Native mode. This is done from the Okta Developer Console. After login, from the Admin dashboard, navigate to `Applications → Add Application`. Choose Native as the platform. Populate your new Native OpenID Connect application with values similar to:
  * **Application Name** 
    * Native OpenId Connect App (must be unique)
  * **Login redirect URIs**
    * `com.okta.example:/callback`
  * **Logout redirect URIs**
    * `com.okta.example:/logoutCallback`
  * **Grant type allowed**
    * Authorization Code
    * Refresh Token
* If you are developing with an Android device emulator, make sure to check out the [React Native - Android Development](https://facebook.github.io/react-native/docs/getting-started.html#android-development-environment) setup instructions.

## Configuration

For each sample, you will need to gather the following information from the Okta Developer Console:

* **Client ID** - The client ID of the Native application that you created earlier. This can be found on the "General" tab of an application, or the list of applications.  This identifies the application that tokens will be minted for.
* **Issuer/Discovery URI** - This is the URL of the authorization server that will perform authentication.  All Developer Accounts have a "default" authorization server.  The issuer is a combination of your Org URL (found in the upper right of the console home page) and `/oauth2/default`. For example, `https://dev-1234.oktapreview.com/oauth2/default`.

Now place these values into the file `samples.config.js` located under each sample folder, here let's use `dev-1234.oktapreview.com` as the okta domain:

```javascript
export default {
  oidc: {
    clientId: CLIENT_ID, // a1234abcdEf8gH1234mnIKS40
    discoveryUri: ISSUER, // https://dev-1234.oktapreview.com/oauth2/default
    redirectUri: REDIRECT_URI, // com.oktapreview.dev-1234:/callback
    endSessionRedirectUri: 'com.okta.{example}:/logoutCallback', // com.oktapreview.dev-1234:/logoutCallback
    scope: ["openid", "profile", "offline_access"],
    requireHardwareBackedKeyStore: false
  }
};
```

## Samples

Please find the sample that fits your use-case from the table below.

| Sample | Description |
|--------|-------------|
| [Browser Sign In](/browser-sign-in) | A React Native application that will redirect the user to the Okta browser login page of your Org for authentication.  The user is redirected back to the React Native application after authenticating. |
| [Custom Sign In](/custom-sign-in) | A React Native application that adopts native authorization to take control over authorization flow and/or provide custom UI. |

[Okta React Native Library]: https://github.com/okta/okta-oidc-js/tree/master/packages/okta-react-native

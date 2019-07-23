# Okta React Native + Browser Sign In Example

This example shows you how to use the [Okta React Native Library](https://github.com/okta/okta-oidc-js/tree/master/packages/okta-react-native) to login a user to a React Native application.  The login is achieved through the Auth Code Flow + PKCE, where the user is redirected to the Okta browser login page. After the user authenticates they are redirected back to the application with an Authorization Code, which is exchanged for an ID token and access token.

## Prerequisites

Before running this sample, you will need the following:

* An Okta Developer Account, you can sign up for one at <https://developer.okta.com/signup/>.
* An Okta Application, configured for Native mode. This is done from the Okta Developer Console. After login, from the Admin dashboard, navigate to `Applications → Add Application`. Choose Native as the platform. Populate your new Native OpenID Connect application with values similar to:
  * **Application Name** 
    * Native OpenId Connect App (must be unique)
  * **Login redirect URIs**
    * `com.sampleapplication:/`
  * **End Session URIs**
    * `com.sampleapplication:/`
  * **Grant type allowed**
    * Authorization Code
    * Refresh Token
* If you are developing with an Android device emulator, make sure to check out the [React Native - Android Development](https://facebook.github.io/react-native/docs/getting-started.html#android-development-environment) setup instructions.

## Running This Example

To run this application, you first need to clone this repo and then enter into this directory:

```bash
git clone git@github.com:okta/samples-js-react-native.git
cd samples-js-react-native/browser-sign-in
```

Then install dependencies:

```bash
npm install

cd ios
pod install
```

After that, you will need to link the native modules. If you're still in the ios folder, return to the root folder.

```bash
react-native link @okta/okta-react-native
```

If linking did not work properly, you will need to manually link according to the instructions [here](https://github.com/okta/okta-oidc-js/tree/master/packages/okta-react-native#manual-installation-optional).

Now you need to gather the following information from the Okta Developer Console:

* **Client Id** - The client ID of the Native application that you created earlier. This can be found on the "General" tab of an application, or the list of applications.  This identifies the application that tokens will be minted for.
* **Issuer/Discovery Uri** - This is the URL of the authorization server that will perform authentication.  All Developer Accounts have a "default" authorization server.  The issuer is a combination of your Org URL (found in the upper right of the console home page) and `/oauth2/default`. For example, `https://dev-1234.oktapreview.com/oauth2/default`.

Now place these values into the file `samples.config.js` that was created for you in this project:

```javascript
export default {
  oidc: {
    clientId: '{clientId}',
    discoveryUri: 'https://{yourOktaDomain}.com/oauth2/default',
    redirectUri: 'com.sampleapplication:/',
    endSessionRedirectUri: 'com.sampleapplication:/',
    scope: ["openid", "profile", "offline_access"],
    requireHardwareBackedKeyStore: false
  }
};
```

Now start the app server:

```bash
react-native start
```

As an alternative, you can launch an Android Emulator or iOS Simulator:

```bash
# Android
react-native run-android

# iOS
react-native run-ios
```

If you see a home page that prompts you to login, then things are working!  Clicking the **Log in** button will redirect you to the Okta browser sign-in page.

You can login with the same account that you created when signing up for your Developer Org, or you can use a known username and password from your Okta Directory.

## Methods
In this sample application, once the user logs in, there will be three methods that each shows a different way to get user info. 

### Get User From ID Token ###
This method calls `getUserFromIdToken()` to retrieve user info from decoding the ID Token claims.

### Get User From Request ###
This method calls `getUser()` to retrieve user info by passing in the access token, and making a request to the user info endpoint. It is done on the native modules. 

### Get User From Access Token ###
This method shows you how to use the access token from `getAccessToken()` to exchange user information. It shows how to make a fetch request to the user info endpoint with access token as the header.
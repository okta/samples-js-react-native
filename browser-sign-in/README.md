# Okta React Native + Browser Sign In Example

This example shows you how to use the [Okta React Native Library](https://github.com/okta/okta-react-native) to login a user to a React Native application.  The login is achieved through the Auth Code Flow + PKCE, where the user is redirected to the Okta browser login page. After the user authenticates they are redirected back to the application with an Authorization Code, which is exchanged for an ID token and access token.

## Running This Example

To run this application, you first need to clone this repo and then enter into this directory:

```bash
git clone git@github.com:okta/samples-js-react-native.git
cd samples-js-react-native/browser-sign-in
```

Then install dependencies:

```bash
npm ci
```

Install dependecies for iOS.

```ruby
cd ios
pod install
```

For **Android** development, please make sure `redirect schema` is properly added by following [Add redirect schema](https://github.com/okta/okta-react-native#add-redirect-scheme) section from [Okta React Native](https://github.com/okta/okta-react-native#okta-react-native) README.

Now start the app server:

```bash
npm start
```

As an alternative, you can launch an Android Emulator or iOS Simulator:

```bash
# Android
npm run android

# iOS
npm run ios
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

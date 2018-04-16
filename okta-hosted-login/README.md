# Okta React Native + Okta Hosted Login Example

This example shows you how to use the [Okta React Native Library][] to login a user to a React Native application.  The login is achieved through the [Auth Code Flow + PKCE][], where the user is redirected to the Okta-Hosted login page.  After the user authenticates they are redirected back to the application with an Authorization Code, which is exchanged for an ID token and access token.

This example is built with [Create React Native App][].

## Prerequisites

Before running this sample, you will need the following:

* An Okta Developer Account, you can sign up for one at <https://developer.okta.com/signup/>.
* An Okta Application, configured for Native mode. This is done from the Okta Developer Console and you can find [OIDC Native App Setup Instructions][].  When following the wizard, update the following values:
  * **Login redirect URIs**
    * `exp://localhost:19000/+expo-auth-session`
  * **Grant type allowed**
    * Authorization Code
    * Refresh Token

## Running This Example

To run this application, you first need to clone this repo and then enter into this directory:

```bash
git clone git@github.com:okta/samples-js-react-native.git
cd samples-js-react-native/okta-hosted-login
```

Then install dependencies:

```bash
npm install
```

Now you need to gather the following information from the Okta Developer Console:

* **Client Id** - The client ID of the Native application that you created earlier. This can be found on the "General" tab of an application, or the list of applications.  This identifies the application that tokens will be minted for.
* **Issuer** - This is the URL of the authorization server that will perform authentication.  All Developer Accounts have a "default" authorization server.  The issuer is a combination of your Org URL (found in the upper right of the console home page) and `/oauth2/default`. For example, `https://dev-1234.oktapreview.com/oauth2/default`.

Now place these values into the file `.samples.config.js` that was created for you in this project:

```javascript
export default {
  oidc: {
    clientId: '{clientId}',
    issuer: 'https://{yourOktaDomain}.com/oauth2/default',
    redirectUri: 'exp://localhost:19000/+expo-auth-session',
    scope: 'openid profile email',
  },
  resourceServer: {
    messagesUrl: 'http://localhost:8000/api/messages',
  },
};
```

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

If you see a home page that prompts you to login, then things are working!  Clicking the **Log in** button will redirect you to the Okta hosted sign-in page.

You can login with the same account that you created when signing up for your Developer Org, or you can use a known username and password from your Okta Directory.

## Integrating The Resource Server

If you were able to successfully login in the previous section you can continue with the resource server example.  Please download and run one of these sample applications in another terminal:

* [Node/Express Resource Server Example](https://github.com/okta/samples-nodejs-express-4/tree/master/resource-server)
* [Java/Spring MVC Resource Server Example](https://github.com/okta/samples-java-spring-mvc/tree/master/resource-server)

Once you have the resource server running (it will run on port 8000) you can select the `Messages` button within the React Native application to see the authentication flow.  The React Native application will use its stored access token to authenticate itself with the resource server, you will see this as the `Authorization: Bearer <access_token>` header on the request if you inspect the network traffic.

> **Note:** You may need to proxy the `localhost:8080` instance through a tunnel like [ngrok](https://ngrok.com/) in order for it to be used on an emulator.

[Create React Native App]: https://github.com/react-community/create-react-native-app
[Auth Code Flow + PKCE]: https://developer.okta.com/authentication-guide/implementing-authentication/auth-code-pkce
[Okta React Native Library]: https://github.com/okta/okta-oidc-js/tree/master/packages/okta-react-native
[OIDC Native App Setup Instructions]: https://developer.okta.com/authentication-guide/implementing-authentication/auth-code-pkce#1-setting-up-your-application

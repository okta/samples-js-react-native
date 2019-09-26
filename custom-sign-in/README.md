# Okta iOS Custom Sign In Example

This example shows you how to use the [Okta Auth JS](https://github.com/okta/okta-auth-js) to adopt Okta Authentication flow in your app.

## Prerequisites

Before running this sample, you will need the following:

* An Okta Developer Account, you can sign up for one at https://developer.okta.com/signup/.

## Running This Example

To run this application, you first need to clone this repo and then enter into this directory:

```bash
git clone git@github.com:okta/samples-js-react-native.git
cd samples-js-react-native/custom-sign-in
```

Assign your Org URL to `url` parameter in `app/LoginScreen.js` file (line #37):

```javascript
var config = {
  url: 'https://{yourOktaDomain}',
};
```

Now complete instructions from [Browser Sign In Example](https://github.com/okta/samples-js-react-native/tree/master/browser-sign-in) page.

## Using This Example

Enter your credentials and tap the **Login** button. You can login with the same account that you created when signing up for your Developer Org, or you can use a known username and password from your Okta Directory.

After you complete the login flow, you will be able to see the details of user's account. Tap **Get Access Token** button to excahnge session token to access token via OIDC SDK.

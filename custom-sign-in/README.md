# Okta React Native Custom Sign In Example

This example shows you how to use the [Okta React Native SDK](https://github.com/okta/okta-react-native) to adopt Okta Authentication flow in your app.

## Clone repo
To run this application, you first need to clone this repo and then enter into this directory:

```bash
git clone git@github.com:okta/samples-js-react-native.git
cd samples-js-react-native/custom-sign-in
```

## Install dependencies

### Install JS dependencies
Install dependencies based on package-lock.json
```bash
npm ci
```

### Install CocoaPods dependencies
CocoaPods dependencies are needed for ios development
```bash
cd ios && pod install && cd ..
```

## Run sample

Start app server:
```bash
npm start
```

Launch an Android Emulator or iOS Simulator, then
```bash
# Android
npm run android

# iOS
npm run ios
```

## Using This Example

Enter your credentials and tap the **Login** button. You can login with the same account that you created when signing up for your Developer Org, or you can use a known username and password from your Okta Directory.

After you complete the login flow, you will be able to see the details of user's account. Tap **Get Access Token** button to excahnge session token to access token via OIDC SDK.


## Update react-native and expo

Modify `package.json` with latest versions you want to use.

```sh
yarn clean
yarn

# optional
yarn fix-deps
yarn deduplicate
yarn doctor
yarn expo-doctor

# regenerate native dirs
rm -rf ./android && rm -rf ./ios
npx expo prebuild
```

Open `./android/app/build.gradle` and add to `android.defaultConfig`:
```
    // after versionName "1.0.0"

    manifestPlaceholders = [
            appAuthRedirectScheme: 'com.okta.example'
    ]
```
(replace `com.okta.example` with your redirect scheme used in Okta app configuration if it differs)

```sh
npx react-native build-android

yarn pod-install
npx react-native build-ios
```

Then you can run `yarn start` (`yarn android` and `yarn ios`) to check how it works on Android and iOS devices.

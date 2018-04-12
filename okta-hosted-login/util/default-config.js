export default {
  oidc: {
    clientId: '{clientId}',
    issuer: 'https://{yourOktaDomain}.com/oauth2/default',
    redirectUri: 'exp://localhost:19000/+expo-auth-session',
    scope: 'openid profile email'
  },
  resourceServer: {
    messagesUrl: 'http://localhost:8000/api/messages',
  }
};

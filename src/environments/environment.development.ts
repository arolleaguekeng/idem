export const environment = {
  environment: 'prod',
  firebase: {
    apiKey: '[YOUR API KEY]',
    authDomain: '[YOUR AUTH DOMAIN]',
    projectId: '[YOUR PROJECT ID]',
    storageBucket: '[YOUR STORAGE BUCKET]',
    messagingSenderId: '[YOUR MESSAGING SENDER ID]',
    appId: '[YOUR APP ID]',
  },
  services: {
    api: {
      url: '[YOUR API URL]',
      version: 'v1',
      llmModel: 'gpt-3.5-turbo',
    },
    webgen: {
      url: '[YOUR WEBGEN URL]',
    },
    diagen: {
      url: '[YOUR DIAGEN URL]',
    },
  },
};


module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          alias: {
            '@app': './src/app',
            '@features': './src/features',
            '@components': './src/components',
            '@theme': './src/app/theme',
            '@i18n': './src/i18n'
          }
        }
      ]
    ]
  };
};



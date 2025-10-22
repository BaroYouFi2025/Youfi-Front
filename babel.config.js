module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
          alias: {
            '@': './',
            '@app': './app',
            '@assets': './assets',
            '@components': './components',
            '@constants': './constants',
            '@hooks': './hooks',
            '@screens': './screens',
            '@services': './services',
            '@styles': './styles',
            '@types': './types',
            '@utils': './utils',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};

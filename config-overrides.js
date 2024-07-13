const FilterWarningsPlugin = require("webpack-filter-warnings-plugin");
const webpack = require('webpack');

module.exports = function override(config) {
  // Add polyfills for Node.js core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
  };

  // Add plugins to provide Node.js core modules
  config.plugins = [
    ...config.plugins,
    new FilterWarningsPlugin({
        exclude:
          /mini-css-extract-plugin[^]*Conflicting order. Following module has been added:/,
      }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser.js',
    }),
  ];

  return config;
};

const webpack = require('webpack')
const merge = require('webpack-merge');
const { common: webpackCommon, PATHS, rules } = require('./webpack.common');

const mergeRules = merge.smart({
  loaders: [
    {
      test: /\.(le|c)ss$/,
      use: [
        {
          loader: 'style-loader'
        }
      ]
    }
  ]
}, {
    loaders: rules
}).loaders;

module.exports = function (env, ...args) {
  const mode = env.production ? 'production' : 'development';

  let plugins = [
    new webpack.HotModuleReplacementPlugin(),
  ];
  const host = '127.0.0.1';
  const port = '8008';

  return merge(webpackCommon(env, ...args), {
    mode,
    context: PATHS.cwd,
    devtool: 'cheap-module-eval-source-map',

    plugins,

    module: {
      rules: mergeRules
    },

    watchOptions: {
      ignored: /node_modules/
    },

  })
}

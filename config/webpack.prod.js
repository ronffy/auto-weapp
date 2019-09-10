
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const merge = require('webpack-merge');
const { common: webpackCommon, PATHS, rules } = require('./webpack.common');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function (env, ...args) {
  const mode = env.production ? 'production' : 'development';
  const publicPath = env.publicPath;
  const analyzer = env.analyzer;

  let plugins = [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css',
    }),
    new webpack.HashedModuleIdsPlugin(), // 解决 不论是否添加任何新的本地依赖，对于前后两次构建内容未变化的，vendor hash 都应该保持一致
  ];

  if (analyzer) {
    plugins.push(
      // 分析打包文件的工具
      new BundleAnalyzerPlugin({
        analyzerMode: 'static'
      })
    )
  }

  const mergeRules = merge.smart(
    {
      loaders: [
        {
          test: /\.(le|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: publicPath || `${PATHS.dist}`,
                hmr: false,
              }
            }
          ]
        },
      ]
    },
    {
      loaders: rules
    }).loaders;

  return merge(webpackCommon(env, ...args), {
    mode,
    context: PATHS.cwd,

    module: {
      rules: mergeRules
    },

    devtool: 'source-map',

    plugins,

    performance: {
      hints: 'warning',
      maxAssetSize: 200000,
      maxEntrypointSize: 400000
    },
  })
}
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const cwd = process.cwd();
const PATHS = {
  cwd,
  src: path.resolve(cwd, 'src'),
  dist: path.resolve(cwd, 'dist'),
}
module.exports.PATHS = PATHS;

const rules = [
  {
    test: /\.(le|c)ss$/,
    include: [
      PATHS.src
    ],
    use: [
      {
        loader: 'css-loader',
        options: {
          modules: {
            mode: 'local',
            localIdentName: '[name][local]--[hash:base64:5]',
            context: path.resolve(__dirname, 'src'),
          },
        },
      },
      {
        loader: 'postcss-loader'
      },
      {
        loader: 'less-loader'
      }
    ]
  },
  {
    test: /\.[jt]sx?$/,
    include: [
      PATHS.src
    ],
    use: [
      {
        loader: 'babel-loader',
      },
    ],
    exclude: /node_modules/,
  },
  {
    test: /\.(png|jpg|jpeg|gif)$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[hash].[ext]',
          outputPath: './image/'
        }
      },
    ]
  },
]

module.exports.rules = rules;

module.exports.common = function (env) {
  const isProduction = env.production;
  const publicPath = env.publicPath;

  const startTime = +new Date();
  const plugins = [
    new HtmlWebpackPlugin({
      hash: true,
      minify: true,
      title: 'Sanji 小程序自动预览、部署系统',
      template: path.resolve(PATHS.src, './index.html')
    }),
  ];

  return {
    context: PATHS.src,
    entry: {
      index: 'index.tsx',
    },
    output: {
      path: PATHS.dist,
      filename: 'js/[name].[hash:8].js',
      chunkFilename: 'js/[name].[contenthash:8].js',
      publicPath: isProduction ? publicPath : '/',
      sourceMapFilename: 'souremaps/[file].map'
    },

    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      },
      runtimeChunk: 'single', // 将 runtime 代码拆分为一个单独的 chunk
    },

    plugins,

    stats: 'errors-only', // 只在发生错误时输出信息

    resolve: {
      modules: [
        PATHS.src,
        'node_modules'
      ],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        utils: path.resolve(PATHS.src, './utils')
      }
    },

  }
}

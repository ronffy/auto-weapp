
// 先执行 plugins，后执行 presets
// plugins 的执行顺序是从前往后
// presets 的执行顺序是从后往前

module.exports = function (api) {
  const isDevelopment = api.env(['development', 'test']);
  api.cache.using(() => isDevelopment)

  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        },
        useBuiltIns: 'usage',
        modules: false, // 是否启用将ES6模块语法转换为其他模块类型（如果想要 tree shaking，此处必须为false）
        corejs: {
          version: 2, 
          proposals: true
        }
      }
    ],
    [
      '@babel/preset-react',
      {
        development: isDevelopment
      }
    ],
    [
      '@babel/preset-typescript',
    ],

  ];

  const plugins = [
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true
      }
    ],
    [
      '@babel/plugin-proposal-class-properties',
      {
        loose: true
      }
    ],
    [
      '@babel/plugin-transform-runtime',
    ],
    [
      'babel-plugin-dynamic-import-webpack'
    ]
  ]

  const ignore = [
    './public',
    './assets'
  ]


  return {
    presets,
    plugins,
    ignore,
  }
}
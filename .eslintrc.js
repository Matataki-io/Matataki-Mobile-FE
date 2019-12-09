// module.exports = {
//   root: true,
//   env: {
//     node: true
//   },
//   extends: [
//     'plugin:vue/essential',
//     '@vue/airbnb',
//     'plugin:vue/recommended',
//     'eslint:recommended',
//     'prettier/vue',
//     'plugin:prettier/recommended'
//   ],
//   rules: {
//     'vue/component-name-in-template-casing': ['error', 'PascalCase'],
//     'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
//     'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
//     'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
//     'max-len': ['error', { code: 160 }], // 最大长度
//     // 关闭冲突规则
//     'prettier/prettier': [
//       'error',
//       {
//         singleQuote: true,
//         semi: false
//       }
//     ]
//   },
//   parserOptions: {
//     parser: 'babel-eslint'
//   }
// }

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'prettier',
    'prettier/vue'
  ],
  // https://github.com/ElemeFE/eslint-config-elemefe/blob/master/rules.js
  rules: {
    // "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    // "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
    quotes: [2, 'single'], // https://eslint.org/docs/2.0.0/rules/quotes
    semi: [2, 'never'] // https://eslint.org/docs/2.0.0/rules/semi
  },
  parserOptions: {
    // parser: "babel-eslint"
  }
}

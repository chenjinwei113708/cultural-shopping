/*
 * @Author: chen
 * @Date: 2021-11-28 22:29:58
 * @LastEditTime: 2021-12-14 10:35:05
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \frontend-boblog\.eslintrc.js
 * 
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'prettier'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {}
}

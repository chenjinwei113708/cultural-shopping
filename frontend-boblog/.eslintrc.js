/*
 * @Author: chen
 * @Date: 2021-11-28 22:29:58
 * @LastEditTime: 2021-12-31 17:07:32
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
  rules: {
    camelcase: 'off',
    '@typescript-eslint/camelcase': 0,
  },
  globals: {
    BMap: true,
    BMAP_ANCHOR_TOP_RIGHT: true,
    BMAP_ANCHOR_BOTTOM_LEFT: true,
    BMAP_NAVIGATION_CONTROL_SMALL: true,
    BMAP_STATUS_SUCCESS: true
  },
}

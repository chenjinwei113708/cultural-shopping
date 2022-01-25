/*
 * @Author: chen
 * @Date: 2022-01-18 12:28:23
 * @LastEditTime: 2022-01-18 13:46:07
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\_test\test.test.js
 * 
 */
const sum = require('../app/dao/test');

test('adds 1 + 2 to equal 3', () => {
  expect(sum("chen")).toBe("chen");
});
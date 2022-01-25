/*
 * @Author: chen
 * @Date: 2021-12-24 15:13:42
 * @LastEditTime: 2022-01-18 13:55:47
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\_test\dao\admindao.test.js
 * 
 */
const { AdminDao } = require('../../app/dao/admin')
const {nickname, email, password} = require('../utils')

test('创建管理员模型，按正常的参数传入，应该创建成功', async () => {
  const admin = await AdminDao.create({
    nickname,
    email,
    password
  })
  expect(admin[1].nickname).toBe(nickname)
  expect(admin[1].email).toBe(email)
})

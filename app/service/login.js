/*
 * @Author: chen
 * @Date: 2021-12-24 15:13:42
 * @LastEditTime: 2021-12-24 20:56:53
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\app\service\login.js
 * 
 */
const { AdminDao } = require('@dao/admin')
const { UserDao } = require('@dao/user')
const { generateToken } = require('@core/util')
const { Auth } = require('@middlewares/auth')


class LoginManager {
  // 管理员登录
  static async adminLogin(params) {
    const { email, password } = params
    // 验证账号密码是否正确
    const [err, admin] = await AdminDao.verify(email, password);
    if (!err) {
      return [null, generateToken(admin.id, Auth.ADMIN)]
    } else {
      return [err, null]
    }
  }

  // 用户登录
  static async userLogin(params) {
    const { email, password } = params
    // 验证账号密码是否正确
    const [err, user] = await UserDao.verify(email, password);
    if (!err) {
      return [null, generateToken(user.user_id, Auth.USER), user.user_id]
    } else {
      return [err, null]
    }
  }
}

module.exports = {
  LoginManager
}

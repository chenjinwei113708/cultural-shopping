/*
 * @Author: chen
 * @Date: 2021-12-24 15:13:42
 * @LastEditTime: 2022-01-03 22:24:11
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \frontend-boblog\request\api\user.js
 * 
 */
import { GET, POST, PUT} from '../http.js'
import user from '../urls/user'

// 用户登录
export function login(data) {
  return POST({
    url: user.login,
    data
  })
}

// 用户注册
export function register(data) {
  return POST({
    url: user.register,
    data
  })
}
// 用户信息
export function info(data) {
  return GET({
    url: user.auth,
    data
  })
}

// 更新用户信息
export function update(data) {
  return PUT({
    url: user.update + '/' + data.user_id,
    data
  })
}
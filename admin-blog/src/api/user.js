/*
 * @Author: chen
 * @Date: 2021-11-28 22:29:58
 * @LastEditTime: 2021-12-27 21:40:39
 * @LastEditors: chen
 * @Description:
 * @FilePath: \admin-blog\src\api\user.js
 *
 */
import request from '@/utils/request'

// 获取用户列表
export function getUserList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}
// 获取删除用户
export function deleteUser(data) {
  return request({
    url: '/user/delete/' + data.user_id,
    method: 'delete',
    data
  })
}

// 更新用户信息
export function updateUser(data) {
  return request({
    url: '/user/update/' + data.user_id,
    method: 'put',
    data
  })
}

// 获取用户信息
export function userInfo(data) {
  return request({
    url: '/user/detail/' + data.user_id,
    method: 'get',
    data
  })
}

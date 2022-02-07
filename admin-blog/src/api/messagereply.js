/*
 * @Author: chen
 * @Date: 2022-02-03 22:00:47
 * @LastEditTime: 2022-02-03 22:03:43
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\admin-blog\src\api\messagereply.js
 * 
 */
import request from '@/utils/request'

// 回复列表
export function list(params) {
  return request({
    url: '/messagereply',
    method: 'get',
    params
  })
}

// 创建回复
export function create(data) {
  return request({
    url: '/messagereply',
    method: 'post',
    data
  })
}

// 评论详情
export function detail(data) {
  return request({
    url: '/messagereply/' + data.id,
    method: 'get',
    data
  })
}
// 更新回复
export function update(data) {
  return request({
    url: '/messagereply/' + data.id,
    method: 'put',
    data
  })
}
// 删除回复
export function detele(data) {
  return request({
    url: '/messagereply/' + data.id,
    method: 'delete',
    data
  })
}

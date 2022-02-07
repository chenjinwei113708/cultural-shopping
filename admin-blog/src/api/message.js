/*
 * @Author: chen
 * @Date: 2022-02-03 17:14:21
 * @LastEditTime: 2022-02-03 17:15:08
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\admin-blog\src\api\message.js
 * 
 */
import request from '@/utils/request'

// 获取评论列表
export function list(params) {
  return request({
    url: '/message',
    method: 'get',
    params
  })
}

// 创建评论
export function create(data) {
  return request({
    url: '/message',
    method: 'post',
    data
  })
}

// 评论详情
export function detail(data) {
  return request({
    url: '/message/' + data.id,
    method: 'get',
    data
  })
}

// 更新详情
export function update(data) {
  return request({
    url: '/message/' + data.id,
    method: 'put',
    data
  })
}

// 删除评论
export function detele(data) {
  return request({
    url: '/message/' + data.id,
    method: 'delete',
    data
  })
}

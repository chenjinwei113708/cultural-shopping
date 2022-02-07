/*
 * @Author: chen
 * @Date: 2022-01-29 12:14:31
 * @LastEditTime: 2022-01-29 12:36:35
 * @LastEditors: chen
 * @Description:
 * @FilePath: \cultural-shopping\admin-blog\src\api\goodcomment.js
 *
 */
import request from '@/utils/request'

// 获取评论列表
export function list(params) {
  return request({
    url: '/goodcomment',
    method: 'get',
    params
  })
}

// 创建评论
export function create(data) {
  return request({
    url: '/goodcomment',
    method: 'post',
    data
  })
}

// 评论详情
export function detail(data) {
  return request({
    url: '/goodcomment/' + data.id,
    method: 'get',
    data
  })
}

// 更新详情
export function update(data) {
  return request({
    url: '/goodcomment/' + data.id,
    method: 'put',
    data
  })
}

// 删除评论
export function detele(data) {
  return request({
    url: '/goodcomment/' + data.id,
    method: 'delete',
    data
  })
}

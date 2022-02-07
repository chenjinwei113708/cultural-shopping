/*
 * @Author: chen
 * @Date: 2022-01-25 12:02:34
 * @LastEditTime: 2022-01-25 16:16:41
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\admin-blog\src\api\order.js
 * 
 */
import request from '@/utils/request'

// 获取订单列表
export function list(params) {
  return request({
    url: '/order',
    method: 'get',
    params
  })
}
// 创建订单
export function create(data) {
  return request({
    url: '/order',
    method: 'post',
    data
  })
}
// 获取订单详情
export function detail(data) {
  return request({
    url: '/order/' + data.id,
    method: 'get',
    data
  })
}

// 更新订单
export function update(data) {
  return request({
    url: '/order/' + data.id,
    method: 'put',
    data
  })
}

// 删除订单
export function detele(data) {
  return request({
    url: '/order/' + data.id,
    method: 'delete',
    data
  })
}
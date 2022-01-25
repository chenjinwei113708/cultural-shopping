/*
 * @Author: chen
 * @Date: 2022-01-20 22:36:51
 * @LastEditTime: 2022-01-22 15:23:03
 * @LastEditors: chen
 * @Description:
 * @FilePath: \cultural-shopping\admin-blog\src\api\good.js
 *
 */
import request from '@/utils/request'

// 获取商品列表
export function list(params) {
  return request({
    url: '/good',
    method: 'get',
    params
  })
}
// 创建商品
export function create(data) {
  return request({
    url: '/good',
    method: 'post',
    data
  })
}
// 获取商品详情
export function detail(data) {
  return request({
    url: '/good/' + data.id,
    method: 'get',
    data
  })
}

// 更新商品
export function update(data) {
  return request({
    url: '/good/' + data.id,
    method: 'put',
    data
  })
}

// 删除商品
export function detele(data) {
  return request({
    url: '/good/' + data.id,
    method: 'delete',
    data
  })
}

// 创建商品规格
export function createSpec(data) {
  return request({
    url: '/good/gooddetail',
    method: 'post',
    data
  })
}

// 删除商品规格
export function deteleSpec(data) {
  return request({
    url: '/good/gooddetail/' + data.id,
    method: 'delete',
    data
  })
}

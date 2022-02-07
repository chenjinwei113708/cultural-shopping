/*
 * @Author: chen
 * @Date: 2021-12-24 15:13:42
 * @LastEditTime: 2022-01-28 00:26:12
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\frontend-boblog\request\api\order.js
 * 
 */
import { GET, PUT, POST, DELETE} from '../http.js'
import order from '../urls/order'

// 获取商品详情
export function getOrderDetail(params) {
  return GET({
    url: order.detail + '/' + params.id,
    params
  })
}

// 获取商品列表
export function getOrderList(params) {
  return GET({
    url: order.list,
    params
  })
}

// 更新商品
export function updateOrder(data) {
  return PUT({
    url: order.update + '/' + data.id,
    data
  })
}

export function createOrder(data) {
  return POST({
    url: order.create,
    data
  })
}

// 删除商品
export function deleteOrder(data) {
  return DELETE({
    url: order.delete + '/' + data.id,
    data
  })
}
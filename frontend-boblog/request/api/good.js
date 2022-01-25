/*
 * @Author: chen
 * @Date: 2021-12-24 15:13:42
 * @LastEditTime: 2022-01-22 01:32:14
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\frontend-boblog\request\api\good.js
 * 
 */
import { GET, PUT } from '../http.js'
import good from '../urls/good'

// 获取商品详情
export function getGoodDetail(params) {
  return GET({
    url: good.detail + '/' + params.id,
    params
  })
}

// 获取商品列表
export function getGoodList(params) {
  return GET({
    url: good.list,
    params
  })
}

// 更新商品
export function updateGood(data) {
  return PUT({
    url: good.update + '/' + data.id,
    data
  })
}
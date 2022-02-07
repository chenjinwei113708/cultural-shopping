/*
 * @Author: chen
 * @Date: 2022-01-29 11:44:00
 * @LastEditTime: 2022-01-30 15:36:44
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\frontend-boblog\request\api\goodcomment.js
 * 
 */
import { GET, PUT, POST, DELETE} from '../http.js'
import goodcomment from '../urls/goodcomment'

// 获取商品评论详情
export function getGoodCommentDetail(params) {
  return GET({
    url: goodcomment.detail + '/' + params.id,
    params
  })
}

// 获取商品评论列表
export function getGoodCommentList(params) {
  return GET({
    url: goodcomment.list,
    params
  })
}

// 更新商品评论
export function updateGoodComment(data) {
  return PUT({
    url: goodcomment.update + '/' + data.id,
    data
  })
}

export function createGoodComment(data) {
  return POST({
    url: goodcomment.create,
    data
  })
}

// 删除商品评论
export function deleteGoodComment(data) {
  return DELETE({
    url: goodcomment.delete + '/' + data.id,
    data
  })
}
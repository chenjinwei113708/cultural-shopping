/*
 * @Author: chen
 * @Date: 2021-12-24 15:13:42
 * @LastEditTime: 2022-01-03 14:53:43
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \frontend-boblog\request\api\article.js
 * 
 */
import { GET, PUT } from '../http.js'
import article from '../urls/article'

// 获取文章详情
export function getArticleDetail(params) {
  return GET({
    url: article.detail + '/' + params.id,
    params
  })
}

// 获取文章列表
export function getArticleList(params) {
  return GET({
    url: article.list,
    params
  })
}

// 更新文章
export function updateArticle(data) {
  return PUT({
    url: article.update + '/' + data.id,
    data
  })
}
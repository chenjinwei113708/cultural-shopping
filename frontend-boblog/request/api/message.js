/*
 * @Author: chen
 * @Date: 2022-02-04 16:05:48
 * @LastEditTime: 2022-02-04 16:35:32
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\frontend-boblog\request\api\message.js
 * 
 */
import { GET, POST } from '../http.js'
import message from '../urls/message'

export function createMessage(data) {
  return POST({
    url: message.create,
    data
  })
}
export function getMessagelist(params) {
  return GET({
    url: message.list,
    params
  })
}

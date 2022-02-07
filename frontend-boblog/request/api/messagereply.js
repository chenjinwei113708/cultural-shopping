/*
 * @Author: chen
 * @Date: 2022-02-05 13:19:33
 * @LastEditTime: 2022-02-05 13:20:45
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\frontend-boblog\request\api\messagereply.js
 * 
 */
import { POST } from '../http.js'
import messagereply from '../urls/messagereply'

// 创建回复
export function createMessageReply(data) {
  return POST({
    url: messagereply.create,
    data
  })
}

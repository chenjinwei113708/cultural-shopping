/*
 * @Author: chen
 * @Date: 2022-02-03 20:20:05
 * @LastEditTime: 2022-02-03 20:25:38
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\app\validators\messagereply.js
 * 
 */
const {
  Rule,
  LinValidator
} = require('@core/lin-validator-v2')

class MessageReplyValidator extends LinValidator {
  constructor() {
    super()
    this.content = [
      new Rule("isLength", "content 不能为空", { min: 1 })
    ]
    this.message_id = [
      new Rule("isLength", "message_id 不能为空", { min: 1 })
    ]
  }
}

class PositiveMessageReplyIdParamsValidator extends LinValidator {
  constructor() {
    super();
    this.id = [
      new Rule('isInt', '评论ID需要正整数', { min: 1 })
    ]
  }
}

module.exports = {
  MessageReplyValidator,
  PositiveMessageReplyIdParamsValidator
}

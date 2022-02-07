/*
 * @Author: chen
 * @Date: 2022-02-03 11:26:55
 * @LastEditTime: 2022-02-03 11:28:05
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\app\validators\message.js
 * 
 */
const {
  Rule,
  LinValidator
} = require('@core/lin-validator-v2')

class MessageValidator extends LinValidator {
  constructor() {
    super()

    this.content = [
      new Rule("isLength", "content 不能为空", { min: 1 })
    ]

    // this.user_id = [
    //   new Rule("isLength", "user_id 不能为空", { min: 1 })
    // ]

    this.good_id = [
      new Rule("isLength", "good_id 不能为空", { min: 1 })
    ]
  }
}

class PositiveGoodIdParamsValidator extends LinValidator {
  constructor() {
    super();
    this.id = [
      new Rule('isInt', '评论ID需要正整数', { min: 1 })
    ]
  }
}

module.exports = {
  MessageValidator,
  PositiveGoodIdParamsValidator
}

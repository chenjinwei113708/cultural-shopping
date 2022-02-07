/*
 * @Author: chen
 * @Date: 2022-01-28 22:28:40
 * @LastEditTime: 2022-01-30 15:48:41
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\app\validators\goodcomment.js
 * 
 */
const {
  Rule,
  LinValidator
} = require('@core/lin-validator-v2')


class GoodCommentValidator extends LinValidator {
  constructor() {
    super();
    this.content = [new Rule("isLength","评论内容 内容不能为空", {min: 1})];
    // '评论状态：0-审核中,1-审核通过,2-审核不通过'
    this.good_id = [new Rule("isLength", "评论商品ID ID不能为空", {min: 1})];
    this.user_id = [new Rule("isLength", "评论用户ID ID不能为空", {min: 1})];
    this.gooddetail_id = [new Rule("isLength", "评论商品规格 规格不能为空", {min: 1})];
    this.email = [new Rule("isLength", "评论者邮箱 邮箱不能为空", {min: 1})];
    this.order_id = [new Rule("isLength", "订单ID ID不能为空", {min: 1})];
    this.score = [new Rule("isLength", "评价分数 分数不能为空", {min: 1})];
  }
}

class PositiveIdParamsValidator extends LinValidator {
  constructor() {
    super();
    this.id = [
      new Rule('isInt', 'ID需要正整数', { min: 1 })
    ]
  }
}

module.exports = {
  GoodCommentValidator,
  PositiveIdParamsValidator
}
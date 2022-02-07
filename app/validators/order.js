/*
 * @Author: chen
 * @Date: 2022-01-24 15:49:47
 * @LastEditTime: 2022-01-26 17:20:08
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\app\validators\order.js
 * order 订单的验证规则
 */
const {
  Rule,
  LinValidator
} = require('@core/lin-validator-v2')


class OrderValidator extends LinValidator {
  constructor() {
    super();
    this.img_url = [new Rule("isLength","商品图片 图片不能为空", {min: 1})];
    this.user_id = [new Rule("isLength","用户id user_id不能为空", {min: 1})];
    this.gooddetail_id = [new Rule("isLength","商品规格id gooddetail_id不能为空", {min: 1})];
    this.good_num = [new Rule("isLength","商品规格数量 good_num不能为空", {min: 1})];
    this.amount = [new Rule("isLength","订单金额 amount不能为空", {min: 1})];
    // this.status = [new Rule("isLength", "订单状态 state不能为空", { min: 1 })];
  }
}

class PositiveIdParamsValidator extends LinValidator {
  constructor() {
    super();
    this.id = [
      new Rule('isInt', '订单ID需要正整数', { min: 1 })
    ]
  }
}

module.exports = {
  OrderValidator,
  PositiveIdParamsValidator
}
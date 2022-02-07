/*
 * @Author: chen
 * @Date: 2022-01-18 15:13:05
 * @LastEditTime: 2022-01-26 16:53:54
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\app\validators\good.js
 * good 商品的验证规则
 */
const {
  Rule,
  LinValidator
} = require('@core/lin-validator-v2')

const { Good } = require('@models/good')

class GoodValidator extends LinValidator {
  constructor() {
    super();
    this.name = [new Rule("isLength","商品名称 name不能为空", {min: 1})];
    this.article_id = [new Rule("isLength","商品对应文章 article_id不能为空", {min: 1})];
    this.img_url = [new Rule("isLength","商品封面 img_url不能为空", {min: 1})];
    this.desc = [new Rule("isLength","商品描述 desc不能为空", {min: 1})];
    this.admin_id = [new Rule("isLength", "admin_id 不能为空", { min: 1 })];
  }
}

class GoodDetailValidator extends LinValidator {
  constructor() {
    super();
    this.good_id = [new Rule("isLength","商品id good_id不能为空", {min: 1})];
    this.spec_name = [new Rule("isLength","商品规格名称 spec_name不能为空", {min: 1})];
    this.stock_num = [new Rule("isLength","商品规格库 stock_num不能为空", {min: 1})];
    this.price = [new Rule("isLength","商品规格价格 price不能为空", {min: 1})];
  }
}

class PositiveIdParamsValidator extends LinValidator {
  constructor() {
    super();
    this.id = [
      new Rule('isInt', '商品ID需要正整数', { min: 1 })
    ]
  }
}

module.exports = {
  GoodValidator,
  GoodDetailValidator,
  PositiveIdParamsValidator
}
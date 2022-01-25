/*
 * @Author: chen
 * @Date: 2021-11-28 22:29:58
 * @LastEditTime: 2022-01-24 17:40:28
 * @LastEditors: chen
 * @Description: 商品表模型
 * @FilePath: \cultural-shopping\app\models\order.js
 * 
 */

const moment = require('moment');
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('@core/db');

class Order extends Model {

}
Order.init({
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    comment: '订单id'
  },
  user_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    comment: '用户id'
  },
  gooddetail_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '商品规格id'
  },
  good_num: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    comment: '商品规格数量'
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: '付款金额'
  },
  // 0：未付款，1：已付款未发货，2：已发货未确认收货，3：确认收货订单完成
  status: {
    type: DataTypes.INTEGER,
    defaultValue: -1,
    allowNull: false
  },
  // 创建时间
  created_at: {
    type: DataTypes.DATE,
    get() {
      return moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss');
    }
  }
}, {
  sequelize,
  tableName: 'order',
  modelName: 'order'
})


module.exports = {
  Order
}

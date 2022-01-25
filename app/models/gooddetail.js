/*
 * @Author: chen
 * @Date: 2021-11-28 22:29:58
 * @LastEditTime: 2022-01-18 17:27:12
 * @LastEditors: chen
 * @Description: 商品详情表模型
 * @FilePath: \cultural-shopping\app\models\goodDetail.js
 * 
 */

const moment = require('moment');
const { DataTypes, Model } = require('sequelize');
// const { sequelize } = require('@core/db');
const { sequelize } = require('../../core/db');

class GoodDetail extends Model {

}
GoodDetail.init({
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    comment: '商品型号id'
  },
  good_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    comment: '商品型号id'
  },
  spec_name: {
    type: DataTypes.STRING(128),
    allowNull: false,
    comment: '商品型号名称'
  },
  stock_num: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    comment: '商品型号库存'
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: '商品型号价格'
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
  tableName: 'gooddetail',
  modelName: 'gooddetail'
})


module.exports = {
  GoodDetail
}

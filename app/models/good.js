/*
 * @Author: chen
 * @Date: 2021-11-28 22:29:58
 * @LastEditTime: 2022-01-24 17:06:00
 * @LastEditors: chen
 * @Description: 商品表模型
 * @FilePath: \cultural-shopping\app\models\good.js
 * 
 */

const moment = require('moment');
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('@core/db');
// const { sequelize } = require('../../core/db');

class Good extends Model {

}
Good.init({
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    comment: '商品id'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '商品名称'
  },
  article_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    comment: '文章id'
  },
  img_url: {
    type: DataTypes.STRING(128),
    allowNull: false,
    comment: '商品图片'
  },
  desc: {
    type: DataTypes.STRING(128),
    allowNull: false,
    comment: '商品描述'
  },
  admin_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    comment: '发布商品的管理员id'
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: true,
    defaultValue: 1,
    comment: '商品展示状态：0-隐藏；1-正常'
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
  tableName: 'good',
  modelName: 'good'
})


module.exports = {
  Good
}

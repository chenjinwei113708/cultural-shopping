/*
 * @Author: chen
 * @Date: 2022-01-28 21:02:11
 * @LastEditTime: 2022-01-30 13:47:09
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\app\models\goodcomment.js
 * 
 */
const moment = require('moment');

const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('@core/db')

class GoodComment extends Model {

}

GoodComment.init({
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '评论内容'
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: true,
    defaultValue: 0,
    comment: '评论状态：0-审核中,1-审核通过,2-审核不通过'
  },
  good_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    comment: '关联的评论商品id'
  },
  gooddetail_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    comment: '商品规格id'
  },
  user_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    comment: '用户id'
  },
  order_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    comment: '订单id'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 0,
    comment: '匿名评论时，填的联系邮箱'
  },
  score:{
		type: DataTypes.TINYINT,
		allowNull: false,
    comment: "分数，一颗星20分，最高100分"
	},
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    get() {
      return moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss');
    }
  }
}, {
  sequelize,
  modelName: 'goodcomment',
  tableName: 'goodcomment'
})
// GoodComment.sync({alter: true})
module.exports = {
  GoodComment
}

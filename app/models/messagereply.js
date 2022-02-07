/*
 * @Author: chen
 * @Date: 2022-01-30 21:20:15
 * @LastEditTime: 2022-01-30 22:18:42
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\app\models\messagereply.js
 * 
 */

const moment = require('moment');
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('@core/db');
const { Message } = require('@models/message')

class MessageReply extends Model {

}

MessageReply.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '回复id'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '回复内容'
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: true,
    defaultValue: 0,
    comment: '回复状态：0-审核中,1-审核通过,2-审核不通过'
  },
  message_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    comment: '关联的评论id'
  },
  good_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    comment: '关联的商品id'
  },
  user_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: true,
    defaultValue: 0,
    comment: '回复用户id,0-代表匿名回复'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 0,
    comment: '匿名评论时，填的联系邮箱'
  },
  reply_user_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: true,
    defaultValue: 0,
    comment: '回复对象id,0-代表匿名回复'
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
  tableName: 'messagereply',
  modelName: 'messagereply'
})

// 一对多：评论表下拥有多个评论

Message.hasMany(MessageReply, {
  foreignKey: 'message_id',
  sourceKey: 'id',
  as: 'messagereply'
})

MessageReply.belongsTo(Message, {
  foreignKey: 'message_id',
  targetKey: 'id',
  as: 'message'
})

// MessageReply.sync({alert: true})

module.exports = {
  MessageReply
}

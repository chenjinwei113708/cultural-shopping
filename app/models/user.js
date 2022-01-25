/*
 * @Author: chen
 * @Date: 2021-11-28 22:29:58
 * @LastEditTime: 2022-01-25 10:49:55
 * @LastEditors: chen
 * @Description: 用户表模型
 * @FilePath: \cultural-shopping\app\models\user.js
 * 
 */
const moment = require('moment');
const bcrypt = require('bcryptjs');
const { sequelize } = require('@core/db');
const { DataTypes, Model } = require('sequelize');

// 定义用户模型
class User extends Model {

}

// 初始用户模型
User.init({
    user_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: '用户昵称'
    },
    recipient_name: {
        type: DataTypes.STRING(64),
        allowNull: true,
        comment: '收件人姓名'
    },
    address: {
        type: DataTypes.STRING(128),
        allowNull: true,
        comment: '收件人地址'
    },
    phone: {
        type: DataTypes.STRING(64),
        allowNull: true,
        comment: '收件人电话'
    },
    email: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: 'user_email_unique',
        comment: '登录邮箱'
    },
    password: {
        type: DataTypes.STRING,
        set(val) {
            // 加密
            const salt = bcrypt.genSaltSync(10);
            // 生成加密密码
            const psw = bcrypt.hashSync(val, salt);
            this.setDataValue("password", psw);
        },
        allowNull: false,
        comment: '登录密码'
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 1,
        comment: '用户状态：0-禁用,1-正常'
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            return moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss');
        }
    },
    star: {
        type: DataTypes.STRING(128),
        allowNull: true,
        defaultValue: '0',
        comment: '收藏'
    },
    like: {
        type: DataTypes.STRING(128),
        allowNull: true,
        defaultValue: '0',
        comment: '点赞/喜欢'
    }
}, {
    sequelize,
    modelName: 'user',
    tableName: 'user'
})
User.sync({alter: true})

module.exports = {
    User
}
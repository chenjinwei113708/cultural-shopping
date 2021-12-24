/*
 * @Author: chen
 * @Date: 2021-11-28 22:29:58
 * @LastEditTime: 2021-12-23 22:19:57
 * @LastEditors: chen
 * @Description: 数据库管理
 * @FilePath: \nodejs-koa-blog\core\db.js
 * 
 */
const Sequelize = require('sequelize');

const {
  dbName,
  host,
  port,
  user,
  password
} = require('../config/config').database;

const sequelize = new Sequelize(dbName, user, password, {
  // 声明数据库类型 
  dialect: 'mysql',
  host,
  port,
  logging: false,
  timezone: '+08:00',
  define: {
    // create_time && update_time
    timestamps: true,
    // paranoid 告知删除记录时不会真正删除它的表，
    // 反而一个名为 deleteAt 的特殊列会将其值设置为该删除请求的时间表
    paranoid: true,
    // created_at updated_at deleted_at 自动更新时间戳
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    // 把驼峰命名转换为下划线
    // 不会覆盖已定义的字段选项属性
    underscored: true,
    scopes: {
      bh: {
        attributes: {
          exclude: ['password', 'updated_at', 'deleted_at', 'created_at']
        }
      },
      iv: {
        attributes: {
          exclude: ['content', 'password', 'updated_at', 'deleted_at']
        }
      }
    }
  }
});

// 创建模型-如果表存在，先删除再创建
sequelize.sync({ force: false });

// 使用 .authenticate() 函数测试连接是否正常
sequelize.authenticate().then( res => {
  console.log('Connection has been established successfully.');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

module.exports = {
  sequelize
};
/*
 * @Author: chen
 * @Date: 2022-01-30 21:58:39
 * @LastEditTime: 2022-02-04 14:36:05
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\app\dao\messagereply.js
 * 
 */
const xss = require('xss')
const { Op, ConnectionTimedOutError, where } = require('sequelize')

const { isArray, unique } = require('@lib/utils')
const { User } = require('@models/user')
const { Good } = require('@models/good')
const { Message }  = require('@models/message');
const { MessageReply }  = require('@models/messagereply');

class MessageReplyDao {
  
   // 添加用户信息
   static async _handleUser(data, ids) {
    const finner = {
      where: {
        user_id: {}
      },
      attributes: ['user_id', 'email', 'username']
    }

    if (isArray(ids)) {
      finner.where.user_id = {
        [Op.in]: ids
      }
    } else {
      finner.where.user_id = ids
    }

    try {
      if (isArray(ids)) {
        const res = await User.findAll(finner)
        let user = {}
        res.forEach(item => {
          user[item.user_id] = item
        });
        data.forEach(item => {
          item.setDataValue('user_info', user[item.user_id] || null)
        })

      } else {
        const res = await User.findOne(finner)
        data.setDataValue('user_info',res) 
      }
      return [null, data]
    } catch (err) {
      return [err, null]
    }
  }

  // 处理商品信息
  static async _handleGood(data, ids) {
    const finner = {
      where: {
        id: {}
      },
      attributes: ['id', 'name']
    }
    if (isArray(ids)) {
      finner.where.id = {
        [Op.in]: ids
      }
    } else {
      finner.where.id = ids
    }
    try {
      if (isArray(ids)) {
        const res = await Good.findAll(finner)
        let good = {}
        res.forEach(item => {
          good[item.id] = item
        })

        data.forEach(item => {
          item.setDataValue('good_info', good[item.good_id] || null)
        })
      } else {
        const res = await Good.findOne(finner)
        data.setDataValue('good_info', res)
      }
      return [null, data]
    } catch (err) {
      return [err, null]
    }
  }

  

  // 创建回复
  static async create(v) {
    // 查询评论
    const hasComment = await Message.findByPk(v.get('body.message_id'));
    if (!hasComment) {
      throw new global.errs.NotFound('没有找到相关评论');
    }
    try {
      const res = await MessageReply.create({
        content: xss(v.get('body.content')),
        message_id: v.get('body.message_id'),
        good_id: v.get('body.good_id'),
        user_id: v.get('body.user_id'),
        email: v.get('body.email'),
        reply_user_id: v.get('body.reply_user_id'),
      })
      return [null, res]
    } catch(err) {
      return [err, null]
    }
  }
  
  // 删除回复
  static async destroy(id) {
    const messagereply = await MessageReply.findOne({
      where: {
        id,
        deleted_at: null
      }
    });
    if (!messagereply) {
      throw new global.errs.NotFound('没有找到相关回复');
    }

    try {
      const res = await messagereply.destroy()
      return [null, res]
    } catch (err) {
      return [err, null]
    }
  }

  // 获取回复详情
  static async detail(id) {
    try {
      const reply = await MessageReply.findOne({
        where: {
          id,
          deleted_at: null
        },
        attributes: {
          exclude: ['email', 'updated_at']
        }
      });
      if (!reply) {
        throw new global.errs.NotFound('没有找到相关回复信息');
      }
      // 添加对应用户信息
      await MessageReplyDao._handleUser(reply, reply.user_id);

      // 添加对应商品信息
      await MessageReplyDao._handleGood(reply, reply.good_id);

      return [null, reply]
    } catch (err) {
      return [err, null]
    }
  }

  // 更新回复
  static async update(id, v) {
    const messagereply = await MessageReply.findByPk(id);
    if(!messagereply) {
      throw new global.errs.NotFound('没有找到相关回复信息')
    }
    const status = v.get('body.status')
    const content = v.get('body.content')
    if (status) {
      messagereply.status = v.get('body.status');
    }
    if (content) {
      messagereply.content = xss(v.get('body.content'));
    }

    try {
      const res = await messagereply.save();
      return [null, res]
    } catch (err) {
      return [err, null]
    }
  }

  // 获取回复列表
  static async list(query) {
    try {
      const {page = 1, content, message_id, id, status, good_id, user_id} = query

      let finner = {}

      if (id) {
        finner.id = id
      }
      if (good_id) {
        finner.good_id = good_id
      }
      if (user_id) {
        finner.user_id = user_id
      }
      if (message_id) {
        finner.message_id = message_id
      }
      if (status) {
        finner.status = status
      }

      if (content) {
        finner.content = {
          [Op.like]: `%${content}%`
        }
      }

      const res = await MessageReply.findAndCountAll({
        where: finner,
        order: [
          ['created_at', 'DESC']
        ]
      });
      let rows = res.rows

      // 添加对应用户信息
      const userIds = unique(rows.map(item => item.user_id))
      await MessageReplyDao._handleUser(rows, userIds)

      // 添加对应商品信息
      const goodIds = unique(rows.map(item => item.good_id))
      await MessageReplyDao._handleGood(rows, goodIds)
      
      const data = {
        data: rows,
        meta: {
          current_page: parseInt(page),
          per_page: 10,
          count: res.count,
          total: res.count,
          total_pages: Math.ceil(res.count / 10),
        }
      };
      return [null, data]

    } catch (err) {
      console.log(err)
      return [err, null]
    }
  }
}
module.exports = {
  MessageReplyDao
}
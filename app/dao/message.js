/*
 * @Author: chen
 * @Date: 2022-01-30 21:25:11
 * @LastEditTime: 2022-02-05 14:09:34
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\app\dao\message.js
 * 
 */
const xss = require('xss')

const { Op, ConnectionTimedOutError, where } = require('sequelize')
const { isArray, unique } = require('@lib/utils')
const { User } = require('@models/user')
const { GoodDetail } = require('@models/gooddetail')
const { Good } = require('@models/good')
const { GoodComment } = require('@models/goodcomment');
const { Message }  = require('@models/message');
const { MessageReply }  = require('@models/messagereply');

class MessageDao {

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

  // 处理回复信息
  static async _handleReply(data) {
    const finner = {
      where: {
        message_id: {}
      },
      attributes: ['id', 'content', 'email', 'user_id','created_at']
    }
    try {
      if(data.length) {
        for(let i=0;i<data.length;i++) {
          finner.where.message_id = data[i].id
          const res = await MessageReply.findAll(finner)

          // 添加对应用户信息
          const userIds = unique(res.map(item => item.user_id))
          await MessageDao._handleUser(res, userIds)
          
          data[i].setDataValue('reply_info', res)
        }
      } else {
        finner.where.message_id = data.id
        const res = await MessageReply.findAll(finner)

        // 添加对应用户信息
        const userIds = unique(res.map(item => item.user_id))
        await MessageDao._handleUser(res, userIds)

        data.setDataValue('reply_info', res)
      }
      return [null, data]
    } catch(err) {
      return [err, null]
    }
  } 
  // 创建商品评论
  static async create(v) { 
    try {
      const res = await Message.create({
        good_id: v.get('body.good_id'),
        user_id: v.get('body.user_id'),
        email: v.get('body.email'),
        content: xss(v.get('body.content'))
      });
      return [null, res]
    } catch(err) {
      return [err, null]
    }
  }

  // 删除商品评论
  static async destroy(id) {
    const message = await Message.findOne({
      where: {
        id,
        deleted_at: null
      }
    });
    if(!message) {
      throw new global.errs.NotFound('没有找到相关评论')
    }
    try {
      const res = await message.destroy()
      return [null, res]
    } catch(err) {
      return [err, null]
    }
  }

  // 获取评论详情
  static async detail(id, query) {
    try {
      let message = await Message.scope('bh').findOne({
        where: {
          id,
          deleted_at: null
        },
        attributes: {
          exclude: ['updated_at']
        }
      });
      if(!message) {
        throw new global.errs.NotFound('没有找到相关评论信息')
      }
      // 添加用户信息
      await MessageDao._handleUser(message, message.user_id)

      // 添加商品信息
      await MessageDao._handleGood(message, message.good_id)

      // 添加回复信息
      await MessageDao._handleReply(message)

      return [null, message]
    } catch(err) {
      return [err, null]
    }
  }
  
  // 获取评论列表
  static async list(query) {
    const { id, page = 1, content, status, good_id} = query

    try {
      // 筛选条件
      const finner = {
        deleted_at: null
      }
      if(id) {
        finner.id = id
      }
      if(good_id) {
        finner.good_id = good_id
      }
      if(status) {
        finner.status = status
      }
      if(content) {
        finner.content = {
          [Op.like]:`%${content}%`
        }
      }
      const pageSize = 10
      const message = await Message.findAndCountAll({
        limit: pageSize,
        offset: (page -1) * pageSize,
        where: finner,
        order: [
          ['created_at','DESC']
        ],
        attributes: {
          exclude: ['updated_at']
        }
      })

      let rows = message.rows

      // 添加对应用户信息
      const userIds = unique(rows.map(item => item.user_id))
      await MessageDao._handleUser(rows, userIds)
      
      // 添加对应商品信息
      const goodIds = unique(rows.map(item => item.good_id))
      await MessageDao._handleGood(rows, goodIds)
      
      // 添加回复信息
      await MessageDao._handleReply(rows)

      const data = {
        data: rows,
        meta: {
          current_page: parseInt(page),
          per_page: 10,
          count: message.count,
          total: message.count,
          total_pages: Math.ceil(message.count / 10),
        }
      };
      return [null, data]
    } catch(err) {
      return [err, null]
    }
  }

  // 更新评论
  static async update(id, v) {
    const message = await Message.findByPk(id);
    if(!message) {
      throw new global.errs.NotFound('没有找到相关评论信息')
    }
    try {
      let content = v.get('body.content')
      let res = ''
      if(content) {
          res = await Message.update(
          {
            status: v.get('body.status'),
            content: xss(v.get('body.content'))
          },
          {
            where: {
              id
            }
          }
        )
      } else {
          res = await Message.update(
          {
            status: v.get('body.status'),
          },
          {
            where: {
              id
            }
          }
        )
      }
      return [null, res]
    } catch(err) {
      return [err, null]
    }
  }
}

module.exports = {
  MessageDao
}
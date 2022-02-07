/*
 * @Author: chen
 * @Date: 2022-01-28 21:43:26
 * @LastEditTime: 2022-02-03 13:50:50
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\app\dao\goodcomment.js
 * 
 */
const { Op, ConnectionTimedOutError, where } = require('sequelize')

const { isArray, unique } = require('@lib/utils')
const { User } = require('@models/user')
const { GoodDetail } = require('@models/gooddetail')
const { GoodComment } = require('@models/goodcomment');
const { MessageReply } = require('@models/messagereply');
class GoodCommentDao {
  // 创建订单评价
  static async create(v) {
    try {
      const res = GoodComment.create({
        content: v.get('body.content'),
        // '评论状态：0-审核中,1-审核通过,2-审核不通过'
        status: v.get('body.status'),
        order_id: v.get('body.order_id'),
        good_id: v.get('body.good_id'),
        user_id: v.get('body.user_id'),
        gooddetail_id:v.get('body.gooddetail_id'),
        email: v.get('body.email'),
        score: v.get('body.score')
      })
      return [null, res]
    } catch(err) {
      return [err, null]
    }
  }

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

  //处理规格信息
  static async _handleSpec(data,ids) {
    const finner = {
      where: {
        id: {}
      },
      attributes: ['id','good_id', 'spec_name', 'stock_num','price']
    }

    if (isArray(ids)) {
      finner.where.id = {
        [Op.in]: ids
      }
    } else {
      finner.where.id = finner.ids
    }
    try {
      if (isArray(ids)) {
        const res = await GoodDetail.findAll(finner)
        let goodSpec = {}
        res.forEach(item => {
          goodSpec[item.id] = item
        });
        // console.log('res--',res)
        data.forEach(item => {
          item.setDataValue('spec_info', goodSpec[item.gooddetail_id] || null)
        })
      } else {
        const res = await GoodDetail.findByPk(ids)
        data.setDataValue('spec_info',res)
      }
      return [null, data]
    } catch (err) {
      return [err, null]
    }
  }

  // 删除订单评论
  static async destroy(id) {
    const ordercomment  = await GoodComment.findOne({
      where: {
        id,
        deleted_at:null
      }
    });
    if(!ordercomment) {
      throw new global.errs.NotFound('没有找到相关订单');
    }
    try {
      // 软删除订单
      const res = ordercomment.destroy()
      return [null, res];
    } catch(err) {
      return [err, null];
    }
  }

  // 获取订单评价列表
  static async list(params = {}) {
    const { id, user_id, good_id, content, page_size = 10, page = 1, status = '' } = params;
    let filter = {
      deleted_at: null
    };
    // 筛选方式，存在用户id
    if (id) {
      filter.id = id;
    }
    if (user_id) {
      filter.user_id = user_id;
    }
    if (good_id) {
      filter.good_id = good_id;
    }
    // 如果要获取全部的订单，就不用传status就可以
    if(status != '') {
      filter.status = status;
    }
    if (content) {
      filter.content = {
        [Op.like]: `%${content}%`
      };
    }
    try {
      const order = await GoodComment.findAndCountAll({
        offset: (page -1) * page_size,
        where: filter,
        order: [
          ['created_at', 'DESC']
        ]
      });
      let rows = order.rows;

      // 添加用户信息
      const userIds = unique(rows.map(item => item.user_id))
      const [userError, dataAndUser] = await GoodCommentDao._handleUser(rows, userIds)
      if (!userError) {
        rows = dataAndUser
      }

      // 添加商品信息
      const goodDetailIds = unique(rows.map(item => item.gooddetail_id))
      const [goodDetailError, dataAndGoodDetail] = await GoodCommentDao._handleSpec(rows, goodDetailIds)
      if (!goodDetailError) {
        rows = dataAndGoodDetail
      }

      const data = {
        data: rows,
        // 分页
        meta: {
          current_page: parseInt(page),
          per_page: 10,
          count: order.count,
          total: order.count,
          total_pages: Math.ceil(order.count / 10),
        }
      }
      return [null, data]
    } catch (err) {
      return [err, null]
    }
  }

  // 更新订单评价
  static async update(id, v) {
    const order = await GoodComment.findByPk(id);
    if(!order) {
      throw new global.errs.NotFound('没有找到相关商品');
    }
    try {
      let content = v.get('body.content')
      let res = ''
      if(content) {
          res = await GoodComment.update(
          {
            status: v.get('body.status'),
            content: v.get('body.content')
          },
          {
            where: {
              id
            }
          }
        )
      } else {
          res = await GoodComment.update(
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

  // 获取订单评价详情
  static async detail(id) {
    try {
      let filter = {
        id,
        deleted_at: null
      }
      let order = await GoodComment.findOne({
        where: filter
      })
      // 添加用户信息
      const [userError, dataAndUser] = await GoodCommentDao._handleUser(order, order.user_id)
      if (!userError) { 
        order = dataAndUser
      }

      // 添加商品信息
      const [goodDetailError, dataAndGoodDetail] = await GoodCommentDao._handleSpec(order, order.gooddetail_id)
      if (!goodDetailError) {
        order = dataAndGoodDetail
      }
      return [null, order]
    } catch (err) {
      return [err, null]
    }
  }
}

module.exports = {
  GoodCommentDao
}
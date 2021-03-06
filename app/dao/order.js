/*
 * @Author: chen
 * @Date: 2022-01-24 13:41:58
 * @LastEditTime: 2022-01-29 21:14:19
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\app\dao\order.js
 * 
 */
const { Op, ConnectionTimedOutError, where } = require('sequelize')

const { Order }  = require('@models/order');
const { isArray, unique } = require('@lib/utils')
const { User } = require('@models/user')
const { GoodDetail } = require('@models/gooddetail')
const { Good } = require('@models/Good')
const { Category } = require('@models/category');

class OrderDao {
  // 创建订单
  static async create(v) {
    try {
      const res = Order.create({
        img_url: v.get('body.img_url'),
        user_id: v.get('body.user_id'),
        gooddetail_id:v.get('body.gooddetail_id'),
        good_num:v.get('body.good_num'),
        amount:v.get('body.amount'),
        status:v.get('body.status'),
      })
      if(v.get('body.status') === 1) {
        const gooddetail_id = v.get('body.gooddetail_id');
        const spec = await GoodDetail.findOne({
          where: {
            id:gooddetail_id,
            deleted_at:null
          },
          attributes: ['stock_num']
        });
        let newstock = spec.stock_num - v.get('body.good_num');
        await GoodDetail.update({
          stock_num: newstock
        },
        {
          where: {
            id:gooddetail_id
          }
        });
      }
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
      finner.where.id = finner.where
    }
    try {
      if (isArray(ids)) {
        const res = await GoodDetail.findAll(finner)
        let goodSpec = {}
        res.forEach(item => {
          goodSpec[item.id] = item
        });
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

  // 删除订单
  static async destroy(id) {
    const order  = await Order.findOne({
      where: {
        id,
        deleted_at:null
      }
    });
    if(!order) {
      throw new global.errs.NotFound('没有找到相关订单');
    }
    try {
      // 软删除订单
      const res = order.destroy()
      return [null, res];
    } catch(err) {
      return [err, null];
    }
  }

  // 获取订单列表
  static async list(params = {}) {
    const { user_id, gooddetail_id, page_size = 10, page = 1, status = '' } = params;
    let filter = {
      deleted_at: null
    };
    // 筛选方式，存在用户id
    if (user_id) {
      filter.user_id = user_id;
    }
    if (gooddetail_id) {
      filter.gooddetail_id = gooddetail_id;
    }
    // 如果要获取全部的订单，就不用传status就可以
    if(status != '') {
      filter.status = status;
    }
    try {
      const order = await Order.scope('iv').findAndCountAll({
        offset: (page -1) * page_size,
        where: filter,
        order: [
          ['created_at', 'DESC']
        ]
      });
      let rows = order.rows;

      // 添加用户信息
      const userIds = unique(rows.map(item => item.user_id))
      const [userError, dataAndUser] = await OrderDao._handleUser(rows, userIds)
      if (!userError) {
        rows = dataAndUser
      }

      // 添加商品信息
      const goodDetailIds = unique(rows.map(item => item.gooddetail_id))
      const [goodDetailError, dataAndGoodDetail] = await OrderDao._handleSpec(rows, goodDetailIds)
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

  // 更新订单
  static async update(id, v) {
    const order = await Order.findByPk(id);
    if(!order) {
      throw new global.errs.NotFound('没有找到相关商品');
    }
    try {
      const res = await Order.update(
        {
          status: v.get('body.status'),
          amount: v.get('body.amount'),
          good_num: v.get('body.good_num'),
          hascomment: v.get('body.good_num') || 0
        },
        {
          where: {
            id
          }
        }
      )
      return [null, res]
    } catch(err) {
      return [err, null]
    }
  }

  // 获取订单详情
  static async detail(id) {
    try {
      let filter = {
        id,
        deleted_at: null
      }
      let order = await Order.findOne({
        where: filter
      })
      // 添加用户信息
      const [userError, dataAndUser] = await OrderDao._handleUser(order, order.user_id)
      if (!userError) {
        order = dataAndUser
      }

      // 添加商品信息
      const [goodDetailError, dataAndGoodDetail] = await OrderDao._handleSpec(order, order.gooddetail_id)
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
  OrderDao
}
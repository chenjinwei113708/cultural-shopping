/*
 * @Author: chen
 * @Date: 2022-01-17 16:34:13
 * @LastEditTime: 2022-02-04 13:46:24
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\app\dao\good.js
 * 
 */
const { Op } = require('sequelize')

const { Good }  = require('@models/good');
const { GoodDetail } =  require('@models/gooddetail')
const { isArray, unique } = require('@lib/utils')
const { Admin } = require('@models/admin')
const { Category } = require('@models/category')
const { Article } = require('@models/article')

// 创建商品模型
class GoodDao {

  // 创建商品
  static async create(v) {
    // 检测是否存在商品
    const name  = v.get('body.name');
    const hasGood = await Good.findOne({
      where: {
        name,
        deleted_at:null
      }
    });
    
    // 如果存在，抛出存在信息
    if(hasGood) {
      throw new global.TextEncoderStream.Existing('商品已存在');
    }
    // 获取型号列表
    const specList = v.get('body.specList')
    try {
      const good = await Good.create({
        name: v.get('body.name'),
        article_id: v.get('body.article_id'),
        img_url: v.get('body.img_url'),
        desc: v.get('body.desc'),
        status: v.get('body.status') || 1,
        admin_id: v.get('body.admin_id')
      });
      // 创建不同型号商品
      let arrList = [];
      for(let item of specList) {
        const spec = await GoodDetail.create({
          good_id: good.id,
          spec_name: item.spec_name,
          stock_num: item.stock_num,
          price: item.price
        })
        arrList.push(spec);
      }
      // 这里的res 包含了本商品和它的型号集合
      const res = [good, arrList];
      return [null, res];
    } catch (err) {
      console.log(err);
      return [err, null];
    }
  }
  // 处理创建者信息
  static async _handleAdmin(data, ids) {
    const finner = {
      where: {
        id: {}
      },
      attributes: ['id', 'email', 'nickname']
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
        const res = await Admin.findAll(finner)
        let admin = {}
        res.forEach(item => {
          admin[item.id] = item
        })

        data.forEach(item => {
          item.setDataValue('admin_info', admin[item.admin_id] || null)
        })
      } else {
        const res = await Admin.findOne(finner)
        data.setDataValue('admin_info', res)
      }
      return [null, data]
    } catch (err) {
      return [err, null]
    }
  }
  //处理文章信息
  static async _handleArticle(data, ids) {
    const finner = {
      where: {
        id: {}
      },
      attributes: ['id', 'title']
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
        const res = await Article.findAll(finner)
        let article = {}
        res.forEach(item => {
          article[item.id] = item
        })

        data.forEach(item => {
          item.setDataValue('article_info', article[item.article_id] || null)
        })
      } else {
        const res = await Article.findOne(finner)
        data.setDataValue('article_info', res)
      }
      return [null, data]
    } catch (err) {
      return [err, null]
    }
  }
  //处理规格信息
  static async _handleSpec(data) {
    const finner = {
      where: {
        good_id: {}
      },
      attributes: ['id', 'spec_name', 'stock_num', 'price']
    }
    try {
      if(data.length) {
        for(let i=0;i<data.length;i++) {
          finner.where.good_id = data[i].id
          const res = await GoodDetail.findAll(finner)
          data[i].setDataValue('spec_info', res)
        }
      }
      else {
        finner.where.good_id = data.id
        const res = await GoodDetail.findAll(finner)
        data.setDataValue('spec_info', res)
      }
      return [null, data]
    } catch(err) {
      return [err, null]
    }
  }

 // 获取商品列表
  static async list(params = {}) {
    const { id, name, article_id, page_size = 10, status, page = 1 } = params;
    
    // 筛选方式
    let filter = {
      deleted_at: null
    };

    // 筛选方式：存在商品ID
    if (id) {
      filter.id = id;
    }

    // 筛选方式，存在搜索关键字
    if (name) {
      filter.name = {
        [Op.like]: `%${name}%`
      };
    }

    if(status) {
      filter.status = status
    }
    if(article_id) {
      filter.article_id = article_id
    }
    try {
      const good = await Good.scope('iv').findAndCountAll({
        offset: (page -1) * page_size,
        where: filter,
        order: [
          ['created_at', 'DESC']
        ]
      });
      let rows = good.rows;

      // 添加创建者信息
      const adminIds = unique(rows.map(item => item.admin_id))
      const [userError, dataAndAdmin] = await GoodDao._handleAdmin(rows, adminIds)
      if (!userError) {
        rows = dataAndAdmin
      }

      // 添加对应文章信息
      const articleIds = unique(rows.map(item => item.article_id))
      const [articleError, dataAndArticle] = await GoodDao._handleArticle(rows, articleIds)
      if (!articleError) {
        rows = dataAndArticle
      }

      //  添加规格信息
      const [goodDetailError, dataAndGoodDetail] = await GoodDao._handleSpec(rows)
      if (!goodDetailError) {
        rows = dataAndGoodDetail
      }

      const data = {
        data: rows,
        meta: {
          current_page: parseInt(page),
          per_page: 10,
          count: good.count,
          total: good.count,
          total_pages: Math.ceil(good.count / 10),
        }
      }
      return [null, data];
    } catch(err) {
      return [err, null];
    }
  }

  // 删除商品
  static async destroy(id) {
    // 检测是否存在商品
    const good = await Good.findOne({
      where: {
        id,
        deleted_at: null
      }
    });
    // 不存在则抛出错误
    if(!good) {
      throw new global.errs.NotFound('没有找到相关商品');
    }

    try {
      // 软删除商品
      const res = await good.destroy()
      return [null, res];
    } catch(err) {
      return [err, null];
    }
  }

  // 更新商品
  static async update(id, v) {
    // 查询商品
    const good  = await Good.findByPk(id);
    if(!good) {
      throw new global.errs.NotFound('没有找到相关商品');
    }

    // 获取型号列表
    const specList = v.get('body.specList')

    try {
      const good = await Good.update(
        {
        name: v.get('body.name'),
        article_id: v.get('body.article_id'),
        img_url: v.get('body.img_url'),
        desc: v.get('body.desc'),
        status: v.get('body.status') || 1,
        admin_id: v.get('body.admin_id')
        },
        {
          where: {
            id:id
          }
        }
      );
      // 创建不同型号商品
      let arrList = [];
      for(let item of specList) {
        const spec = await GoodDetail.update(
          {
            spec_name: item.spec_name,
            stock_num: item.stock_num,
            price: item.price
          },
          {
            where: {
              id: item.id
            }
          }
        );
        arrList.push(spec);
      }
      // 这里的res 包含了更新结果
      const res = [good, arrList];
      return [null, res];
    } catch(err) {
      console.log(err);
      return [err, null];
    }
  }

  // 查询商品详情
  static async detail(id, query) {
    const { keyword } = query;
    try {
      let filter = {
        id,
        deleted_at: null
      };

      let good = await Good.findOne({
        where: filter
      });
      if(!good) {
        throw new global.errs.NotFound('没有找到相关商品');
      }

      // 添加创建人信息
      const [userError, dataAndAdmin] = await GoodDao._handleAdmin(good, good.admin_id)
      if (!userError) {
        good = dataAndAdmin
      }

      // 添加文章信息
      const [articleError, dataAndArticle] = await GoodDao._handleArticle(good, good.article_id)
      if (!articleError) {
        good = dataAndArticle
      }

      // 添加规格信息
      const [goodDetailError, dataAndGoodDetail] = await GoodDao._handleSpec(good)
      if (!goodDetailError) {
        good = dataAndGoodDetail
      }

      return [null, good];
    } catch(err) {
      return [err, null];
    }
  }

  //新建商品规格
  static async createGoodDetail(v) {
    // 检测是否存在此规格
    const spec_name = v.get('body.spec_name');
    const good_id = v.get('body.good_id');
    const hasGoodDetail = await GoodDetail.findOne({
      where: {
        good_id,
        spec_name,
        deleted_at: null
      }
    });
    // 如果存在，抛出存在信息
    if(hasGoodDetail) {
      throw new global.errs.Existing('此商品规格已存在');
    }

     try {
       const spec = await GoodDetail.create({
        good_id: v.get('body.good_id'),
        spec_name: v.get('body.spec_name'),
        stock_num: v.get('body.stock_num'),
        price: v.get('body.price')
       })
       const res = spec;
       return [null, res];
     } catch(err) {
        return [err, null];
     }
  }

  // 删除商品规格
  static async deleteGoodDetail(id) {
    // 检测是否存在商品规格
    const goodDetail = await GoodDetail.findOne({
      where: {
        id,
        deleted_at: null
      }
    });
    // 不存在排除错误
    if(!goodDetail) {
      throw new global.errs.NotFound('没有找到相关规格');
    }

    try {
      // 软删除商品规格
      const res= await goodDetail.destroy();
      return [null, res];
    } catch(err) {
      return [err, null];
    }
  }
}
module.exports = {
  GoodDao
}

const xss = require('xss')

const {Comment} = require('@models/comment')
const {Article} = require('@models/article')
const {User} = require('@models/user')
const {Reply} = require('@models/reply')
const {isArray, unique} = require('@lib/utils')
// const {sequelize} = require('@core/db')
const {Sequelize, Op} = require('sequelize')

class CommentDao {
  // 创建评论
  static async create(v) {
    const comment = new Comment();
    comment.article_id = v.get('body.article_id');
    comment.user_id = v.get('body.user_id');
    comment.content = xss(v.get('body.content'));

    try {
      const res = await comment.save();
      return [null, res]

    }catch (err) {
      return  [err, null]
    }
  }

  // 删除评论
  static async destroy(id) {
    const comment = await Comment.findOne({
      where: {
        id,
        deleted_at: null
      }
    });
    if (!comment) {
      throw new global.errs.NotFound('没有找到相关评论');

    }
    try {
      const res = await comment.destroy()
      return [null, res]
    }catch (err) {
      return [err, null]
    }
  }

  // 获取评论详情
  static async detail(id, query) {
    const { is_replay = 0, is_article = 0, is_user = 0} = query
    try {
      let comment = await Comment.scope('iv').findOne({
        where: {
          id,
          deleted_at: null
        },
        attributes: {
          exclude: ['updated_at']
        },
        // include: [{
        //   association: Comment.hasMany(Reply, {
        //       foreignKey: 'comment_id',
        //       sourceKey: 'id',
        //   }),
        //   as: 'reply',
        //   // required: false,
        //   attributes: {
        //     exclude: ['comment_id','commentId' ,'updated_at', 'deleted_at']
        //   }
        // }]

      });
      if (!comment) {
        throw new global.errs.NotFound('没有找到相关评论信息');
      }

      // 查询评论
      if(parseInt(is_replay, 10) === 1) {
        comment = await CommentDao._handleReply(comment)
      }

      // 查询文章
      if(parseInt(is_article, 10) === 1) {
        comment = await CommentDao._handleArticle(comment)
      }

      // 查询用户
      if(parseInt(is_user, 10) === 1) {
        comment = await CommentDao._handleUser(comment)
      }

      return  [null, comment]

    } catch (err) {
      return  [err, null]
    }
  }

  // 更新评论
  static async update(id, v) {
    const comment = await Comment.findByPk(id);
    if (!comment) {
      throw new global.errs.NotFound('没有找到相关评论信息');
    }

    comment.article_id = v.get('body.article_id');
    comment.user_id = v.get('body.user_id');
    comment.status = v.get('body.status');
    comment.content = xss(v.get('body.content'));

    try {
      const res =  await comment.save();
      return [null, res]

    } catch (err) {
      return [err, null]
    }
  }


  // 评论列表
  static async list(query) {
    const {page = 1, is_replay = 0, is_article = 0} = query
    console.log(is_replay,page,is_article)

    try {
      // const records = await sequelize.query(`select comment.*,reply.* from comment,reply where comment.id = reply.comment_id;`, {
      //   type: Sequelize.SELECT
      // });
      const pageSize = 10;
      const comment = await Comment.scope('bh').findAndCountAll({
        // 每页10条
        limit: pageSize,
        offset: (page - 1) * pageSize,
        where: {
          deleted_at: null
        },
        order: [
          ['created_at', 'DESC']
        ],
        attributes: {
          exclude: ['updated_at']
        },
        // include: [{
        //   association: Comment.hasOne(Reply, {
        //
        //   }),
        //   as: 'reply',
        //   required: false,
        //   attributes: {
        //     exclude: ['updated_at', 'deleted_at']
        //   }
        // }]
      })

      let rows = comment.rows


      // 查询评论
      if(parseInt(is_replay, 10) === 1) {
        rows = await CommentDao._handleReply(rows)
      }

      // 查询文章
      if(parseInt(is_article, 10) === 1) {
        rows = await CommentDao._handleArticle(rows)
      }

      // 查询用户
      if(parseInt(is_user, 10) === 1) {
        rows = await CommentDao._handleUser(rows)
      }

      const data = {
        data: rows,
        meta: {
          current_page: parseInt(page),
          per_page: 10,
          count: comment.count,
          total: comment.count,
          total_pages: Math.ceil(comment.count / 10),
        }
      };
      return  [null, data]

    } catch (err) {
      return  [err, null]
    }
  }

  // 关联目标下的评论
  static async targetComment(params = {}) {
    try {
      const {
        article_id,
        is_replay = 0,
        is_article = 0,
        is_user = 0,
        page = 1,
        desc = 'created_at'
      } = params;

      if (!article_id) {
        throw new global.errs.NotFound('必须传入article id');
      }

      const pageSize = 10;
      const comment = await Comment.findAndCountAll({
        where: {
          article_id,
          deleted_at: null
        },
        // 每页10条
        limit: pageSize,
        offset: (page - 1) * pageSize,
        order: [
          [desc, 'DESC']
        ],
        attributes: {
          exclude: ['updated_at']
        },
        // include: [{
        //   association: Comment.hasMany(Reply, {}),
        //   as: 'reply',
        //   attributes: {
        //     exclude: ['updated_at', 'deleted_at']
        //   }
        // }]
      })

      let rows = comment.rows
      // 查询评论
      if(parseInt(is_replay, 10) === 1) {
        rows = await CommentDao._handleReply(rows)
      }

      // 查询文章
      if(parseInt(is_article, 10) === 1) {
          rows = await CommentDao._handleArticle(rows)
      }
      // 用户
      if(parseInt(is_user, 10) === 1) {
          rows = await CommentDao._handleUser(rows)
      }

      const data = {
        data: rows,
        // 分页
        meta: {
          current_page: parseInt(page),
          per_page: 10,
          count: comment.count,
          total: comment.count,
          total_pages: Math.ceil(comment.count / 10),
        }
      }
      return [null, data]

    }catch (err) {
      return  [err, null]
    }
  }

  /**
   * 查询回复id，且处理数据为 key-value 形式
   * @param ids 评论id | Array | Object
   * @returns 根据传入的ids查询出来的回复数据
   */
  static async getReplyData(ids) {
    const scope = 'bh'
    const finner = {
      where: {},
      attributes: ['id', 'content', 'comment_id']
    }
    const isArrayIds = isArray(ids)

    if (isArrayIds) {
      finner.where.comment_id ={
        [Op.in]: ids
      }
    } else if(ids) {
      finner.where.comment_id = ids
    }

    try {
      const fn = isArrayIds ? 'findAll' : 'findOne'
      const res = await Reply.scope(scope)[fn](finner)

      if (isArrayIds) {
        let reply = {}
        // 进行数组拆分成 Map 结构
        // 目的：为了下次[ _setCommentByDataValue 函数]拼接时，算法复杂度 由 O(n²) 降为 0(n)
        res.forEach(item => {
          // 如果有重复的map key 则直接装进去
          if (reply[item.comment_id]) {
            reply[item.comment_id].push(item)
          } else {
            // 反之，初始化数组
            reply[item.comment_id] = [item]
          }
        })
        return [null, reply]
      }

      return [null, res]

    } catch (err) {
      return [err, null]
    }
  }


  /**
   * 查询文章id，且处理数据为 key-value 形式
   * @param ids 文章id | Array | Object
   * @returns 根据传入的ids查询出来的文章数据
   */
  static async getArticleData(ids) {
    const scope = 'bh'
    const finner = {
      where: {},
      attributes: ['id', 'title']
    }
    const isArrayIds = isArray(ids)
    // 如果ids是数组，则使用 Op.in 查询
    if (isArrayIds) {
      finner.where.id ={
        [Op.in]: ids
      }
    } else if (ids) {
      // 反之id索引查询
      finner.where.id = ids
    }

    try {
      // 如果ids是数组，则使用 Op.in 查询，反之id索引查询
      const fn = isArrayIds ? 'findAll' : 'findOne'
      const res = await Article.scope(scope)[fn](finner)

      if (isArrayIds) {
        const article = {}
        res.forEach(item => {
          // 如果有重复的map key 则直接装进去
          if (article[item.id]) {
            article[item.id].push(item)
          } else {
            // 反之，初始化数组
            article[item.id] = [item]
          }
        })
        return [null, article]
      }

      return [null, res]

    } catch (err) {
      return  [err, null]
    }
  }
  /**
   * 查询用户id，且处理数据为 key-value 形式
   * @param ids 用户id | Array | Object
   * @returns 根据传入的ids查询出来的用户数据
   */
  static async getUserData(ids) {
    const scope = 'bh'
    const finner = {
      where: {}
      // attributes: ['id', 'title']
    }
    const isArrayIds = isArray(ids)
    // 如果ids是数组，则使用 Op.in 查询
    if (isArrayIds) {
      finner.where.id ={
        [Op.in]: ids
      }
    } else if (ids) {
      // 反之id索引查询
      finner.where.id = ids
    }

    try {
      // 如果ids是数组，则使用 Op.in 查询，反之id索引查询
      const fn = isArrayIds ? 'findAll' : 'findOne'
      const res = await User.scope(scope)[fn](finner)

      if (isArrayIds) {
        const user = {}
        res.forEach(item => {
          // 如果有重复的map key 则直接装进去
          if (user[item.id]) {
            user[item.id].push(item)
          } else {
            // 反之，初始化数组
            user[item.id] = [item]
          }
        })

        return [null, user]
      }

      return [null, res]

    } catch (err) {
      return  [err, null]
    }
  }

  /**
   * 新增设置评论下的属性
   *
   * @param comment 评论数据
   * @param data 需要设置的数据
   * @param id 评论表和设置数据的关联id
   * @param key 新增设置评论下的属性 key
   * @returns 新的评论数据
   * @private
   */
  static _setCommentByDataValue(comment, data, id = 'id', key = 'key') {
    // 处理数组和对象的情况
    if(isArray(comment)) {
      // 查询数据列表的id是否有匹配的 map key: 如 reply[commentItem.id]
      // 有直接赋值，反之默认数组
      comment.forEach(commentItem => {
        commentItem.setDataValue(key, data[commentItem[id]] || [])
      })
    } else {
      comment.setDataValue(key, data)
    }

    return comment
  }

  /**
   * 处理评论下的回复
   * @param comment 评论数据 Array | Object
   * @returns 新的评论数据
   * @private
   */
  static async _handleReply(comment) {
    const isArrayData = isArray(comment)
    const commentIds = isArrayData ? unique(comment.map(c => c.id)) : comment.id
    const [replyErr, replyData] = await CommentDao.getReplyData(commentIds)

    if(!replyErr) {
      return CommentDao._setCommentByDataValue(comment, replyData, 'id', 'reply_list')
    } else {
      throw new global.errs.Existing(JSON.stringify(replyErr));
    }
  }

  /**
   * 处理评论下的管理文章
   * @param comment 评论数据 Array | Object
   * @returns 新的评论数据
   * @private
   */
  static async _handleArticle(comment) {
    // 判断评论数据是否是数组或者对象
    // 如果是数组，遍历去到评论下的文章id列表
    // 如果是对象，直接取该评论的id
    const isArrayData = isArray(comment)
    const articleIds = isArrayData ? unique(comment.map(c => c.article_id)) : comment.id

    // 进行查询
    const [articleErr, articleData] = await CommentDao.getArticleData(articleIds)

    if(!articleErr) {
      return CommentDao._setCommentByDataValue(comment, articleData, 'article_id', 'article')
    } else {
      throw new global.errs.Existing(JSON.stringify(articleErr));
    }
  }
  /**
   * 处理评论下的用户
   * @param comment 评论数据 Array | Object
   * @returns 新的评论数据
   * @private
   */
  static async _handleUser(comment) {
    // 判断评论数据是否是数组或者对象
    // 如果是数组，遍历去到评论下的文章id列表
    // 如果是对象，直接取该评论的id
    const isArrayData = isArray(comment)
    const userIds = isArrayData ? unique(comment.map(c => c.user_id)) : comment.user_id
    // 进行查询
    const [userErr, userData] = await CommentDao.getUserData(userIds)

    if(!userErr) {
      console.log('userData', userData)
      return CommentDao._setCommentByDataValue(comment, userData, 'user_id', 'user_info')

    } else {
      throw new global.errs.Existing(JSON.stringify(userErr));
    }
  }
}

module.exports = {
  CommentDao
}
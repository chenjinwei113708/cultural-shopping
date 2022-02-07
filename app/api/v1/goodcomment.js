/*
 * @Author: chen
 * @Date: 2022-01-28 22:17:30
 * @LastEditTime: 2022-01-29 12:12:34
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\app\api\v1\goodcomment.js
 * 
 */
const Router = require('koa-router')

const { GoodCommentDao } = require('@dao/goodcomment')
const { GoodCommentValidator, PositiveIdParamsValidator } = require('@validators/goodcomment')
const { Auth } = require('@middlewares/auth');

const { Resolve } = require('@lib/helper');
const res = new Resolve();

const AUTH_ADMIN = 16;

const router = new Router({
  prefix: '/api/v1'
})

// 创建评论
router.post('/goodcomment', async (ctx) => {
  // 通过验证器校验参数是否通过
  const v = await new GoodCommentValidator().validate(ctx);
  // console.log('v---', v)
  const [err, data] = await GoodCommentDao.create(v);
  if (!err) {
    ctx.response.status = 200;
    ctx.body = res.success('创建评论成功');
  } else {
    ctx.body = res.fail(err);
  }
})

// 删除评论
router.delete('/goodcomment/:id', async (ctx) => {

  // 通过验证器校验参数是否通过
  const v = await new PositiveIdParamsValidator().validate(ctx);

  // 获取分类ID参数
  const id = v.get('path.id');
  const [err, data] = await GoodCommentDao.destroy(id);
  if (!err) {
    // 返回结果
    ctx.response.status = 200;
    ctx.body = res.success('删除评论成功')
  } else {
    ctx.body = res.fail(err)
  }
})

// 修改评论
router.put('/goodcomment/:id', async (ctx) => {
  // 通过验证器校验参数是否通过
  const v = await new PositiveIdParamsValidator().validate(ctx);

  // 获取分类ID参数
  const id = v.get('path.id');
  const [err, data] = await GoodCommentDao.update(id, v);
  if (!err) {
    // 返回结果
    ctx.response.status = 200;
    ctx.body = res.success('更新评论成功')
  } else {
    ctx.body = res.fail(err)
  }
})

// 获取评论列表
router.get('/goodcomment', async (ctx) => {
  let [err, data] = await GoodCommentDao.list(ctx.query);
  if (!err) {
    ctx.response.status = 200;
    ctx.body = res.json(data);
  } else {
    ctx.body = res.fail(err);
  }
})

// 获取评论详情
router.get('/goodcomment/:id', async (ctx) => {
  // 通过验证器校验参数是否通过
  const v = await new PositiveIdParamsValidator().validate(ctx);

  // 获取分类ID参数
  const id = v.get('path.id');
  const [err, data] = await GoodCommentDao.detail(id, ctx.query)
  // 返回结果
  if (!err) {
    ctx.response.status = 200;
    ctx.body = res.json(data);
  } else {
    ctx.body = res.fail(err);
  }
})

// // 获取关联目标下的评论列表
// router.get('/comment/target/list', async (ctx) => {
//   const [err, data] = await GoodCommentDao.targetComment(ctx.query)
//   if (!err) {
//     // 返回结果
//     ctx.response.status = 200;
//     ctx.body = res.json(data);
//   } else {
//     ctx.body = res.fail(err);
//   }

// })

module.exports = router

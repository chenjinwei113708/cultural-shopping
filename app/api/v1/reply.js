/*
 * @Author: chen
 * @Date: 2021-12-24 15:13:42
 * @LastEditTime: 2021-12-25 10:44:55
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\app\api\v1\reply.js
 * 
 */
const Router = require('koa-router')

const { ReplyDao } = require('@dao/reply')
const { ReplyValidator, PositiveArticleIdParamsValidator } = require('@validators/reply')
const { Auth } = require('@middlewares/auth');

const { Resolve } = require('@lib/helper');
const res = new Resolve();

const AUTH_ADMIN = 16;

const router = new Router({
  prefix: '/api/v1'
})

// 创建回复
router.post('/reply', async (ctx) => {
  // 通过验证器校验参数是否通过
  const v = await new ReplyValidator().validate(ctx);
  // 创建回复
  const [err, data] = await ReplyDao.create(v);

  if (!err) {
    // 返回结果
    ctx.response.status = 200;
    ctx.body = res.success('回复成功');
  } else {
    ctx.body = res.fail(err);
  }

})

// 删除回复
router.delete('/reply/:user_id', new Auth(AUTH_ADMIN).m, async (ctx) => {
  // 通过验证器校验参数是否通过
  const v = await new PositiveArticleIdParamsValidator().validate(ctx);

  // 获取分类ID参数
  const user_id = v.get('path.user_id');
  const [err, data] = await ReplyDao.destroy(user_id);
  if (!err) {
    // 返回结果
    ctx.response.status = 200;
    ctx.body = res.success('删除回复回复成功')
  } else {
    ctx.body = res.fail(err)
  }
})

// 修改回复
router.put('/reply/:id', new Auth(AUTH_ADMIN).m, async (ctx) => {
  // 通过验证器校验参数是否通过
  const v = await new PositiveArticleIdParamsValidator().validate(ctx);

  // 获取分类ID参数
  const id = v.get('path.id');
  const [err, data] = await ReplyDao.update(id, v);
  if (!err) {
    // 返回结果
    ctx.response.status = 200;
    ctx.body = res.success('更新回复成功')

  } else {
    ctx.body = res.fail(err)
  }

})

// 获取回复列表
router.get('/reply', async (ctx) => {
  const [err, data] = await ReplyDao.list(ctx.query);
  if (!err) {
    ctx.response.status = 200;
    ctx.body = res.json(data);
  } else {
    ctx.body = res.fail(err);
  }
})

// 获取回复详情
router.get('/reply/:user_id', async (ctx) => {
  // 通过验证器校验参数是否通过
  const v = await new PositiveArticleIdParamsValidator().validate(ctx);

  // 获取分类ID参数
  const user_id = v.get('path.user_id');
  const [err, data] = await ReplyDao.detail(user_id)

  if (!err) {
    // 返回结果
    ctx.response.status = 200;
    ctx.body = res.json(data);
  } else {
    ctx.body = res.fail(err)
  }
})

module.exports = router

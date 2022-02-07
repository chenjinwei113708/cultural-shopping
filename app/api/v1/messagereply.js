/*
 * @Author: chen
 * @Date: 2021-12-24 15:13:42
 * @LastEditTime: 2022-02-03 21:45:17
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\app\api\v1\messagereply.js
 * 
 */
const Router = require('koa-router')

const { MessageReplyDao } = require('@dao/messagereply')
const { MessageReplyValidator, PositiveMessageReplyIdParamsValidator } = require('@validators/messagereply')
const { Auth } = require('@middlewares/auth');

const { Resolve } = require('@lib/helper');
const res = new Resolve();

const AUTH_ADMIN = 16;

const router = new Router({
  prefix: '/api/v1'
})

// 创建回复
router.post('/messagereply', async (ctx) => {
  console.log('1111')
  // 通过验证器校验参数是否通过
  const v = await new MessageReplyValidator().validate(ctx);
  // 创建回复
  const [err, data] = await MessageReplyDao.create(v);

  if (!err) {
    // 返回结果
    ctx.response.status = 200;
    ctx.body = res.success('回复成功');
  } else {
    ctx.body = res.fail(err);
  }

})

// 删除回复
router.delete('/messagereply/:id', async (ctx) => {
  // 通过验证器校验参数是否通过
  const v = await new PositiveMessageReplyIdParamsValidator().validate(ctx);

  // 获取分类ID参数
  const id = v.get('path.id');
  const [err, data] = await MessageReplyDao.destroy(id);
  if (!err) {
    // 返回结果
    ctx.response.status = 200;
    ctx.body = res.success('删除回复回复成功')
  } else {
    ctx.body = res.fail(err)
  }
})

// 更新回复
router.put('/messagereply/:id', async (ctx) => {
  // 通过验证器校验参数是否通过
  const v = await new PositiveMessageReplyIdParamsValidator().validate(ctx);

  // 获取分类ID参数
  const id = v.get('path.id');
  const [err, data] = await MessageReplyDao.update(id, v);
  if (!err) {
    // 返回结果
    ctx.response.status = 200;
    ctx.body = res.success('更新回复成功')

  } else {
    ctx.body = res.fail(err)
  }
})

// 获取回复列表
router.get('/messagereply', async (ctx) => {
  const [err, data] = await MessageReplyDao.list(ctx.query);
  if (!err) {
    ctx.response.status = 200;
    ctx.body = res.json(data);
  } else {
    ctx.body = res.fail(err);
  }
})

// 获取回复详情
router.get('/messagereply/:id', async (ctx) => {
  // 通过验证器校验参数是否通过
  const v = await new PositiveMessageReplyIdParamsValidator().validate(ctx);

  // 获取分类ID参数
  const id = v.get('path.id');
  const [err, data] = await MessageReplyDao.detail(id)

  if (!err) {
    // 返回结果
    ctx.response.status = 200;
    ctx.body = res.json(data);
  } else {
    ctx.body = res.fail(err)
  }
})

module.exports = router

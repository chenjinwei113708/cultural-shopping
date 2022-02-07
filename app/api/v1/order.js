/*
 * @Author: chen
 * @Date: 2022-01-24 14:11:12
 * @LastEditTime: 2022-01-27 16:24:46
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\app\api\v1\order.js
 * 
 */
const Router = require('koa-router');

const {
  OrderValidator,
  PositiveIdParamsValidator
} = require('@validators/order');

const { Auth } = require('@middlewares/auth');
const { OrderDao } =  require('@dao/order');

const { Resolve } = require('@lib/helper');
const { GoodDao } = require('../../dao/good');
const res = new Resolve();

const AUTH_ADMIN = 16;

const router = new Router({
  prefix: '/api/v1'
})

/**
 * 创建订单
 */
router.post('/order', async(ctx) => {
  const v = await new OrderValidator().validate(ctx);
  // 创建订单
  const [err, data] = await OrderDao.create(v);
  if(!err) {
    ctx.response.status = 200;
    ctx.body = res.success('创建订单成功');
  } else {
    ctx.body = res.fail(err);
  }
})
/**
 * 删除订单
 */
router.delete('/order/:id', async (ctx) => {
  // 通过验证检验参数是否通过
  const v = await new PositiveIdParamsValidator().validate(ctx);

  // 获取订单ID参数
  const id = v.get('path.id')
  // 删除订单
  const [err, data] = await OrderDao.destroy(id);
  if(!err) {
    ctx.response.status = 200;
    ctx.body = res.success('删除订单成功');
  } else {
    ctx.body = res.fail(err);
  }
})

/**
 * 获取订单列表
 */
router.get('/order',async (ctx) => {
  const { page = 1 } = ctx.query;
  const [err, data] = await OrderDao.list(ctx.query);
  if(!err) {
    ctx.response.status = 200;
    ctx.body = res.json(data);
  } else {
    ctx.body = res.fail(err);
  }
});

/**
 * 获取订单详情
 */
router.get('/order/:id', async (ctx) => {
  // 通过校验器校验参数是否通过
  const v = await new PositiveIdParamsValidator().validate(ctx);
  // 获取商品ID参数
  const id = v.get('path.id');
  // 查询商品
  const [err, data] = await OrderDao.detail(id);
  if(!err) {
    ctx.response.status = 200;
    ctx.body = res.json(data);
  } else {
    ctx.body = res.fail(err);
  }
})
/**
 * 更新订单（主要更新订单状态）
 */
router.put('/order/:id', async (ctx) => {
  // 通过验证器校验参数是否通过
  const v = await new PositiveIdParamsValidator().validate(ctx);

  // 获取商品ID参数
  const id = v.get('path.id');
  // 更新商品
  const [err, data] = await OrderDao.update(id, v);
  if(!err) {
    ctx.response.status = 200;
    ctx.body = res.success('更新订单成功');
  } else {
    ctx.body = res.fail(err);
  }
})
module.exports = router
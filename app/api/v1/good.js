/*
 * @Author: chen
 * @Date: 2022-01-18 15:10:06
 * @LastEditTime: 2022-01-19 23:13:44
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\app\api\v1\good.js
 * 
 */
const Router = require('koa-router');

const {
  GoodValidator,
  GoodDetailValidator,
  PositiveIdParamsValidator
} = require('@validators/good');

const { Auth } = require('@middlewares/auth');
const { GoodDao } =  require('@dao/good');

const { Resolve } = require('@lib/helper');
const { GoodDetail } = require('../../models/goodDetail');
const res = new Resolve();

const AUTH_ADMIN = 16;

const router = new Router({
  prefix: '/api/v1'
})

/**
 * 创建商品
 */
router.post('/good', async(ctx) => {
  const v = await new GoodValidator().validate(ctx);

  // 创建商品
  const [err, data] = await GoodDao.create(v);
  if(!err) {
    ctx.response.status = 200;
    ctx.body = res.success('创建商品成功');
  } else {
    ctx.body = res.fail(err);
  }
}) 

/**
 * 删除商品
 */
router.delete('/good/:id', async (ctx) => {
  
  // 通过验证检验参数是否通过
  const v = await new PositiveIdParamsValidator().validate(ctx);

  // 获取商品ID参数
  const id = v.get('path.id');
  // 删除商品
  const [err, data] = await GoodDao.destroy(id);
  if(!err) {
    ctx.response.status = 200;
    ctx.body = res.success('删除商品成功');
  } else {
    ctx.body = res.fail(err);
  }
})

/**
 * 更新商品
 */
router.put('/good/:id', async (ctx) => {
  // 通过验证器校验参数是否通过
  const v = await new PositiveIdParamsValidator().validate(ctx);

  // 获取商品ID参数
  const id = v.get('path.id');
  // 更新商品
  const [err, data] = await GoodDao.update(id, v);
  if(!err) {
    ctx.response.status = 200;
    ctx.body = res.success('更新商品成功');
  } else {
    ctx.body = res.fail(err);
  }
})
/**
 * 获取商品列表
 */
router.get('/good', async (ctx) => {
  const { category_id = 0, page = 1 } = ctx.query;

  // 没有缓存，这读取数据库
  const [err, data] = await GoodDao.list(ctx.query);
  if(!err) {
    ctx.response.status = 200;
    ctx.body = res.json(data);
  } else {
    ctx.body = res.fail(err);
  }
});

/**
 * 获取商品详情
 */
router.get('/good/:id', async (ctx) => {
  // 通过校验器校验参数是否通过
  const v = await new PositiveIdParamsValidator().validate(ctx);
  // 获取商品ID参数
  const id = v.get('path.id');
  // 查询商品
  const [err, data] = await GoodDao.detail(id, ctx.query);
  if(!err) {
    ctx.response.status = 200;
    ctx.body = res.json(data);
  } else {
    ctx.body = res.fail(err);
  }
})

/**
 * 新建商品规格
 */
router.post('/good/gooddetail', async (ctx) => {
  const v = await new GoodDetailValidator().validate(ctx);
  
  // 创建商品规格
  const [err, data] = await GoodDao.createGoodDetail(v);
  if(!err) {
    ctx.response.status = 200;
    ctx.body = res.success('添加商品规格成功');
  } else {
    ctx.body = res.fail(err);
  }
})

/**
 * 删除商品规格
 */
 router.delete('/good/gooddetail/:id', async (ctx) => {
  // 通过验证检验参数是否通过
  const v = await new PositiveIdParamsValidator().validate(ctx);

  // 获取商品ID参数
  const id = v.get('path.id');
  const [err, data] = await GoodDao.deleteGoodDetail(id);
  if(!err) {
    ctx.response.status = 200;
    ctx.body = res.success('删除商品规格成功');
  } else {
    ctx.body = res.fail(err);
  }
})
module.exports = router
/*
 * @Author: chen
 * @Date: 2022-01-18 17:07:34
 * @LastEditTime: 2022-01-18 17:28:49
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\_test\dao\good.test.js
 * 
 */
const { GoodDao } = require('../../app/dao/good')

let data = {
  name: '小米电视',
  category_id: 1,
  img_url: '111111111111111',
  desc: '便宜，高清',
  status: 1,
  specList: [
      {
          spec_name: "16g",
          stock_num: 10000,
          price: 3000
      },
      {
        spec_name: "32g",
        stock_num: 10000,
        price: 5000
    }
  ]
}
test('创建商品测试', async () => {
  const good = await GoodDao.create(data)
  console.log('good_test------------')
})
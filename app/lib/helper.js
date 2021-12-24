/*
 * @Author: chen
 * @Date: 2021-11-28 22:29:58
 * @LastEditTime: 2021-12-23 11:08:52
 * @LastEditors: chen
 * @Description: 用于返回状态码
 * @FilePath: \nodejs-koa-blog\app\lib\helper.js
 * 
 */

class Resolve {
  fail(err = {}, msg = '操作失败', errorCode = 10001) {
    return {
      msg,
      err,
      errorCode
    }
  }

  success(msg = 'success', errorCode = 0, code = 200) {
    return {
      msg,
      code,
      errorCode
    }
  }

  json(data, msg = 'success', errorCode = 0, code = 200) {
    return {
      code,
      msg,
      errorCode,
      data
    }
  }
}

module.exports = {
  Resolve
}

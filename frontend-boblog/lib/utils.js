/*
 * @Author: chen
 * @Date: 2021-12-24 15:13:42
 * @LastEditTime: 2021-12-29 20:40:16
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \frontend-boblog\lib\utils.js
 * 
 */

/**
 * 验证邮箱
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/
  return reg.test(email)
}

/**
 * 验证密码
 * @param {string} email
 * @returns {Boolean}
 */
export function validPassword(email) {
  const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]/
  return reg.test(email)
}

/**
 * 判断是否是数组
 * @param arr
 * @returns {boolean}
 */
export function isArray(arr) {
  return Array.isArray(arr) && arr.length > 0
}

/**
 * 动态加载百度地图 API 函数
 * @param {*} ak 百度地图key 
 * @returns 
 */
export function loadBMap(ak) {
  return new Promise(function(resolve, reject) {
    if (typeof window.BMap !== 'undefined') {
      resolve(window.BMap)
      return true
    }
    window.onBMapCallback = function() {
      resolve(window.BMap)
    }
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'http://api.map.baidu.com/api?v=3.0&ak=' + ak + '&callback=onBMapCallback'
    script.onerror = reject
    document.head.appendChild(script)
  })
}
/*
 * @Author: chen
 * @Date: 2021-12-28 22:37:16
 * @LastEditTime: 2021-12-28 23:57:35
 * @LastEditors: chen
 * @Description: 动态加载百度地图 API 函数
 * @FilePath: \admin-blog\src\utils\loadBMap.js
 *
 */
export default function loadBMap(ak) {
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

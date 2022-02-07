/*
 * @Author: chen
 * @Date: 2022-01-28 00:24:25
 * @LastEditTime: 2022-01-28 13:39:29
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\frontend-boblog\store\order.js
 * 
 */

import { getOrderList } from '@/request/api/order'

const state = () => ({
  status: -1,
  orderList: []
})

const mutations = {
  SET_STATUS(state, data) {
    state.status = data
  },
  SET_ORDERLIST(state, data) {
    state.orderList = data
  }
}

const actions = {
  async getOrderListaa({ state, commit }, params = {}) {
    const { status } = params
    const [err, res] = await getOrderList(params)
    if (!err) {
      const list = res.data.data.data
      commit('SET_STATUS', status)
      commit('SET_ORDERLIST', list)
      return [null, list]
    } else {
      return [err, null]
    }
  },
}

export default {
  namespace: true,
  state,
  actions,
  mutations
}

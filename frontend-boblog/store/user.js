/*
 * @Author: chen
 * @Date: 2021-12-24 15:13:42
 * @LastEditTime: 2022-01-04 10:29:45
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \frontend-boblog\store\user.js
 * 
 */
import { login, register, info, update } from '@/request/api/user'
import { setToken } from "@/lib/auth";

const state = () => ({
  userInfo: null,
  isLoginStatus: false,
  isLike: false,
  isStar: false
})

const mutations = {
  SET_USERINFO(state, data) {
    state.userInfo = data
  },
  SET_LOGIN_STATUS(state, data) {
    state.isLoginStatus = data
  },
  SET_USER_STAR(state, data) {
    state.isStar = data
  },
  SET_USER_LIKE(state, data) {
    state.isLike = data
  }
}

const actions = {
  async userLogin({ state, commit }, params = {}) {
    const [err, res] = await login(params)
    if (!err) {
      const user = res.data.data
      commit('SET_USERINFO', {
        id: user.user_id,
        username: user.username,
        email: user.email,
        star: user.star,
        like: user.like
      })
      commit('SET_LOGIN_STATUS', true)
      setToken(user.token)
      return [null, user]
    } else {
      return [err, null]
    }
  },
  async userRegister({ state, commit }, params = {}) {
    const [err, res] = await register(params)
    if (!err) {
      const user = res.data.data
      commit('SET_USERINFO', {
        id: user.user_id,
        username: user.username,
        email: user.email,
        star: user.star,
        like: user.like
      })
      commit('SET_LOGIN_STATUS', true)
      setToken(user.token)
      return [null, user]
    } else {
      return [err, null]
    }

  },
  async userInfo({ state, commit }, params = {}) {
    if (state.isLoginStatus && state.userInfo) {
      return state.userInfo
    }

    const [err, res] = await info(params)
    if (!err) {
      const user = res.data.data
      commit('SET_USERINFO', {
        id: user.user_id,
        username: user.username,
        email: user.email,
        star: user.star,
        like: user.like
      })
      commit('SET_LOGIN_STATUS', true)
      return [null, user]
    } else {
      return [err, null]
    }
  },
  async userUpdate({state, commit}, params = {}) {
    const [err, res] = await update(params)
    if (!err) {
      const user = res.data.data
      commit('SET_USERINFO', {
        id: user.user_id,
        username: user.username,
        email: user.email,
        star: user.star,
        like: user.like
      })
      commit('SET_LOGIN_STATUS', true)
      return [null, user]
    } else {
      return [err, null]
    }
  }
}

export default {
  namespace: true,
  state,
  actions,
  mutations
}

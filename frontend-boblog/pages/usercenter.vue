<!--
 * @Author: chen
 * @Date: 2022-01-26 10:53:39
 * @LastEditTime: 2022-01-28 13:56:57
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\frontend-boblog\pages\usercenter.vue
 * 
-->
<template>
  <div class="container">
    <div v-if="isLoginStatus" class="usercenter-container">
      <div class="left">
        <nuxt-link :class="{link: true, selected:curPath==='/usercenter/cart'}" to='/usercenter/cart'>购物车</nuxt-link>
        <nuxt-link :class="{link: true, selected:curPath==='/usercenter/order'}" to='/usercenter/order'>订单中心</nuxt-link>
        <nuxt-link :class="{link: true, selected:curPath==='/usercenter/user'}" to='/usercenter/user'>个人中心</nuxt-link>
      </div>
      <div class="right">
        <nuxt-child></nuxt-child>
      </div>
    </div>
    <div v-else>
      <el-dialog
        :visible.sync="isLogin"
        width="880px"
        top="0"
        :lock-scroll="true"
        :before-close="handleClose"
      >
        <LoginForm @on-success="loginFormSuccess" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/common/LoginForm'
import { mapState } from 'vuex'

export default {
  name: 'Usercenter',
  components: {
    LoginForm
  },
  data() {
    return {
      isLogin: false
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      isLoginStatus: (state) => state.user.isLoginStatus,
    }),
    curPath() {
      return this.$route.path
    }
  },

  // eslint-disable-next-line vue/order-in-components
  head() {
    return {
      title: '民俗文化 - 在线购物  - 个人中心',
      meta: [
        {
          name: 'keywords',
          content:
            '民俗，文化，文化推广,文创商品，民俗文化',
        },
        {
          name: 'description',
          content: '民俗文化推荐网站，支持评论，在线购物',
        },
      ],
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if(!this.isLoginStatus) {
        this.isLogin = true
      } else {
        this.isLogin = false
      }
    },
    handleClose() {
      this.isLogin = false
    },
    loginFormSuccess() {
      this.isLogin = false
    }
  },
}
</script>

<style scoped lang="scss">
.container {
  margin-bottom: 200px;
}
.usercenter-container {
  margin: 32px auto 60px;
  width: 1280px;
  height: 700px;
  box-sizing: border-box;

  .left {
    float:left;
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    width: 200px;
    height: 160px;
    // border: 1px solid #cacacc;
  }

  .right {
    box-sizing: border-box;
    flex: 1;
    margin-left: 220px;
    height: 100%;
    // border: 1px solid #cacacc;
  }
}
.link {
  margin: auto auto;
  padding: 0 35px;
  border-left: 4px solid transparent;
  width: 120px;
  // height: 47.63px;
  // line-height: 47.63px;
  height: 30px;
  line-height: 30px;
  font-size: 20px;
  font-weight: 700;
  color: #7d7d7d;
  text-align: left;
  text-decoration-line: none;
}
.selected{
  border-left: 4px solid #b4a078;
  color:#b4a078;
}

/deep/ .el-dialog__header {
  padding: 0;
}
/deep/ .el-dialog__body {
  padding: 0;
}
/deep/ .el-dialog {
  margin: 0;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>


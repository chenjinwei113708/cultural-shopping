<template>
  <div>
    <div class="header">
      <div class="logo" @click="jumpURL('/')">
        <img src="@/static/logo.png" alt="logo" />
      </div>
      <div class="nav">
        <div
          v-for="(item, index) in nav"
          :key="index"
          class="nav-item"
          @click="jumpURL(item.router)"
        >
          {{ item.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'VHeader',
  props: {
    isCategory: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      nav: [
        {
          title: '首页',
          router: '/',
        },
        // {
        //   title: '分类',
        //   router: '/category',
        // },
        // {
        //   title: '关于',
        //   router: '/about',
        // },
      ],
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      isLoginStatus: (state) => state.user.isLoginStatus,
    }),
  },
  watch: {
    isLoginStatus: {
      handler() {
        this.handleNav()
      },
    },
  },
  mounted() {
    this.handleNav()
  },
  methods: {
    // 动态增加/减少个人中心
    handleNav() {
      if (this.isLoginStatus) {
        this.nav.splice(2, 0, {
          title: '个人中心',
          router: '/usercenter',
        })
      } else {
        const index = this.nav.findIndex(
          (item) => item.router === '/usercenter'
        )
        if (index !== -1) {
          this.nav.splice(index, 1)
        }
      }
    },
    // 返回首页
    goHome() {
      window.location.href = '/'
    },
    // 跳转URL
    jumpURL(router) {
      this.$router.push(router)
    },
  },
}
</script>

<style scoped lang="scss">
.header {
  margin: 0 auto;
  width: 1280px;
  height: 120px;
  display: flex;
  align-items: center;
}
.logo {
  width: 154px;
}
.logo img {
  width: 100%;
}
.nav {
  flex: 1;
  margin-left: 102px;
  display: flex;
  align-items: center;
}
.nav-item {
  cursor: pointer;
  display: block;
  text-align: center;
  margin-left: 120px;
  font-size: 16px;
  color: #222222;
  text-decoration: none;

  &:hover {
    color: #2d8cf0;
    text-decoration: underline;
  }
}
</style>

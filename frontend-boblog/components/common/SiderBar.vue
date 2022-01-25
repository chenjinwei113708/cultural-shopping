<template>
  <div>
    <div class="siderbar">
      <div class="search" @click="showSearch = true">
        <img src="http://124.71.112.249/images/2022/01/06/search.png" alt="search" />
      </div>
    </div>
    <div v-if="showSearch" class="search-fixed">
      <div class="search-fixed-inner">
        <form class="search-fixed-form" action="/">
          <input
            name="keyword"
            type="text"
            class="search-fixed-search"
            placeholder="搜索"
          />
        </form>
        <div class="search-fixed-search-icon" @click="closeSearch">
          <img
            width="20px"
            src="http://124.71.112.249/images/2022/01/06/cancel.png"
            alt="search"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SiderBar',
  props: {
    isCategory: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      showSearch: false,
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
    closeSearch() {
      this.keyword = ''
      this.showSearch = false
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

.search {
  width: 28px;
  cursor: pointer;
}
.search img {
  width: 100%;
}

.search-fixed {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
}
.search-fixed-inner {
  position: fixed;
  width: 1280px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.search-fixed-form {
  flex: 1;
}
.search-fixed-search {
  width: 100%;
  border: none;
  outline: none;
  border-bottom: 1px solid #ccc;
  height: 36px;
  line-height: 36px;
  font-size: 26px;
  font-weight: 600;
  color: #404040;
  text-align: center;

  &::placeholder {
    color: #999999;
  }
}
.search-fixed-search-icon {
  cursor: pointer;
  width: 20px;
}
</style>

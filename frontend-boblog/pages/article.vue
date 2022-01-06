<template>
  <client-only>
    <div>
      <div class="container">
        <div class="article">
          <h1 class="title">
            {{ article.title }}
          </h1>
          <div class="info">
            <span class="author"> By {{ article.admin_info.nickname }} </span>
            <span v-if="article.category_info" class="category">
              文章分类：{{ article.category_info.name }}
            </span>
            <span class="browse">
              文章浏览量：{{ article.browse }}
            </span>
            <span class="created-at">{{ article.created_at }}</span>
          </div>
          <div class="article-content" v-html="article.content"></div>
          <div id="map-container" class="article-map" style="width:100%;height:500px; "></div>
          <div v-if="isLoginStatus" class="article-favorite-star">
            <div class="fixed-star">
              <div v-if="!isStar" class="fixed-star-off">
                <i class="iconfont" title="收藏" @click="setStar()">&#xe661;</i>
              </div>
              <div v-else class="fixed-star-on" style="color:red">
                <i class="iconfont" title="取消收藏" @click="setStar()" >&#xe662;</i>
              </div>
            </div>
            <div class="fixed-favorite">
              <div v-if="!isLike" class="fixed-favorite-off">
                <i class="iconfont" title="点赞" @click="setLike()">&#xe8ab;</i>
              </div>
              <div v-else class="fixed-favorite-on" style="color:red">
                <i class="iconfont" title="取消点赞" @click="setLike()">&#xe8c3;</i>
              </div>
            </div>
          </div>
        </div>
        <div class="fixed-sidebar">
          <div class="fixed-scroll-top">
            <i class="el-icon-top" title="回到顶部" @click="scrollTop"></i>
          </div>
        </div>
      </div>
      <div ref="comment">
        <vue-lazy-component >
          <ArticleComment class="container"/>
        <img
          width="0"
          height="0"
          style="display: none"
          src="https://cdn.boblog.com/login-bg.png"
          alt="preload"
        />
      </vue-lazy-component>
      </div>
    </div>
  </client-only>
</template>
<script>
import { getArticleDetail, updateArticle} from '@/request/api/article'
import ArticleComment from '@/components/article/ArticleComment'
import { mapState } from 'vuex'
import { component as VueLazyComponent } from '@xunlei/vue-lazy-component'
import { loadBMap } from '@/lib/utils'

export default {
  name: 'ArticleDetail',
  components: {
    ArticleComment,
    VueLazyComponent,
  },
  async asyncData(context) {
    const { id } = context.query
    const params = {
      id,
      is_markdown: true,
    }
    const [err, res] = await getArticleDetail(params)
    if (!err) {
      return {
        article: res.data.data,
        id
      }
    }
  },
  data() {
    return {
      isLogin: false
    }
  },
  async fetch({ store }) {
    await store.dispatch('category/getCategoryData')
  },
  head() {
    const article = this.article || {}
    return {
      title: article.title,
      meta: [
        { name: 'keywords', content: article.seo_keyword },
        { name: 'description', content: article.description },
      ],
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      isLoginStatus: (state) => state.user.isLoginStatus,
      isLike: (state) => state.user.isLike,
      isStar: (state) => state.user.isStar
    }),
  },
  mounted() {
    // eslint-disable-next-line no-console
    console.log(this.article)
    this.setBMap()
    this.initUserInfo()
  },
  methods: {
    // 回到顶部
    scrollTop() {
      this.$scrollTo(0)
    },
    // 加载BMap
    async setBMap() {
      await loadBMap('Q0Hozuj64PoL9QKqBLc7qjYLdlL4IC6l') // 加载引入BMap
      this.initMap()
    },
    initMap() {
      // 挂载地图 enableMapClick:禁用地图默认点击弹框
      const lng = Number(this.article.address_point.split(':')[0])
      const lat = Number(this.article.address_point.split(':')[1])
      this.map = new BMap.Map('map-container')
      const point = new BMap.Point(lng, lat)
      // 初始化地图（设置进度），如果center类型为 Point 时，zoom必须赋值，范围为3-19级
      this.map.centerAndZoom(point, 19)
      // 设置图像标注并绑定拖拽标注结束后事件
      this.mk = new BMap.Marker(point, { enableDragging: false })
      // 将覆盖物添加到地图上
      this.map.addOverlay(this.mk)
    },
    initUserInfo() {
      if(this.isLoginStatus) {
        const search = '' + this.article.id
        // 初始化收藏
        if(!this.userInfo.star) {
          this.$store.commit('user/SET_USER_STAR', false)
        } else {
          const starList = this.userInfo.star.split(";")
          this.$store.commit('user/SET_USER_STAR', starList.includes(search))
        }
        // 初始化点赞
        if(!this.userInfo.like) {
          this.$store.commit('user/SET_USER_LIKE', false)
        } else {
          const likeList = this.userInfo.like.split(";")
          this.$store.commit('user/SET_USER_LIKE', likeList.includes(search))
        }
      }
    },
    // 点击收藏
    async setStar() {
      let starStr = ''
      if(!this.isStar) {
        // 收藏数 + 1
        this.article.star_num++
        // 更改状态
        this.$store.commit('user/SET_USER_STAR', true)
        starStr = this.userInfo.star + ';' + this.id
        starStr = Array.from(new Set(starStr.split(";"))).join(';')
      } else {
        // 收藏数 - 1
        this.article.star_num--
        // 更改状态
        this.$store.commit('user/SET_USER_STAR', false)
        const starArr = this.userInfo.star.split(";")
        const index = starArr.indexOf(''+this.id)
        if(index !== -1) {
          starArr.splice(index,1)
        }
        starStr = starArr.join(";")
      }

      // 状态更新 
      const userdata = {
        user_id: this.userInfo.id,
        star: starStr
      }

      const params = {
        id: this.id,
        star_num: this.article.star_num
      }

      if(this.isStar) {
        await this.$store.dispatch('user/userUpdate', userdata)
        await updateArticle(params)
        .then(res => {
          this.$message({
            message: '收藏成功',
            type: 'success'
          });
        })
      } else {
        await this.$store.dispatch('user/userUpdate', userdata)
        await updateArticle(params)
        .then(res => {
          this.$message({
            message: '取消收藏',
            type: 'warning'
          });
        })
      }
    },
    // 点击点赞
    async setLike() {
      let likeStr = ''
      if(!this.isLike) {
        // 点赞数 + 1
        this.article.like_num++
        // 更改状态
        this.$store.commit('user/SET_USER_LIKE', true)
        likeStr = this.userInfo.like + ';' + this.id
        likeStr = Array.from(new Set(likeStr.split(";"))).join(';')
      } else {
        // 点赞数 - 1
        this.article.like_num--
        // 更改状态
        this.$store.commit('user/SET_USER_LIKE', false)
        const likeArr = this.userInfo.like.split(";")
        const index = likeArr.indexOf(''+this.id)
        if(index !== -1) {
          likeArr.splice(index,1)
        }
        likeStr = likeArr.join(";")
      }

      // 状态更新 
      const userdata = {
        user_id: this.userInfo.id,
        like: likeStr
      }
      await this.$store.dispatch('user/userUpdate', userdata)
      const params = {
        id: this.id,
        like_num: this.article.like_num
      }
      if(this.isLike) {
        await updateArticle(params)
        .then(res => {
          this.$message({
            message: '点赞成功',
            type: 'success'
          });
        })
      } else {
        await updateArticle(params)
        .then(res => {
          this.$message({
            message: '取消点赞',
            type: 'warning'
          });
        })
      }
    },
  }
}
</script>

<style scoped lang="scss">
@font-face {
  font-family: 'iconfont';  /* Project id 3062722 */
  src: url('//at.alicdn.com/t/font_3062722_tw5uxbep16j.woff2?t=1640874708920') format('woff2'),
       url('//at.alicdn.com/t/font_3062722_tw5uxbep16j.woff?t=1640874708920') format('woff'),
       url('//at.alicdn.com/t/font_3062722_tw5uxbep16j.ttf?t=1640874708920') format('truetype');
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 40px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.article-map {
  margin-top: 50px;
  margin-bottom: 50px;
}
.bm-view {
  width: 880px;
  height: 500px;
}
.container {
  box-sizing: border-box;
  width: 880px;
  margin: 0 auto;
}
.article {
  box-sizing: border-box;
  width: 100%;
  margin: 80px auto 0;
  padding-bottom: 80px;
  border-bottom: 1px solid #e8e8e8;
}

.title {
  height: 42px;
  font-size: 36px;
  font-weight: 600;
  color: #222222;
  line-height: 42px;
  text-align: center;
}

.info {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 22px 0 48px;
}

.info span {
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
  margin-right: 65px;

  &:last-child {
    margin-right: 0;
  }
}
.fixed-sidebar {
  cursor: pointer;
  position: fixed;
  bottom: 32px;
  right: 32px;
  font-size: 30px;
}
.article-favorite-star {
  cursor: pointer;
  display: flex;
  justify-content: center;
  width: 100%;
}
.fixed-star {
  width: 60px;
  flex-shrink: 0;
}
.fixed-favorite {
  width: 60px;
  flex-shrink: 0;
}
</style>


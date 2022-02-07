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
      <div class="sidebar">
        <div class="sidebar_container">
          <div class="side-avatar">
          <img class="side-avatar-img" src="http://124.71.112.249/images/2022/01/06/avatar.jpg" alt="side-avatar.png" border="0">
          <div class="side-avatar-info">
            <span class="side-avatar-info-nickname">
              {{article.admin_info.nickname}}
            </span>
            <div class="side-avatar-info-email">
              E-mail: {{article.admin_info.email}}
            </div>
          </div>
        </div>
        <div class="side-search" @click="showSearch = true">
          <div class="side-search-pic">
            <img src="http://124.71.112.249/images/2022/01/06/search.jpg" alt="search.jpg" border="0" />
          </div>
          <div class="side-search-form">
            <form action="/">
              <input
                name="keyword"
                type="text"
                class="side-search-input"
                placeholder="请输入您要搜索的文章关键词"
              />
              <button class="side-search-button" type="submit">
                <i class="iconfont" title="button">&#xe61d;</i>
              </button>
            </form> 
          </div>
        </div>
        <div class="side-new-article">
          <span class="side-article-head">最新文章</span>
          <div
            :key="newArticle.id"
            class="side-article-item"
            @click="jumpURL(newArticle.id)"
          >
            <div class="side-article-intro">
              <h1 class="side-article-title">
                {{ newArticle.title }}
              </h1>
              <div class="side-article-create-browse">
                <div class="side-article-create">
                  {{ newArticle.created_at }}
                </div>
                <div class="side-article-browse">
                  阅读({{ newArticle.browse }})
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="articleHotList.length>1" class="side-hot-article">
          <span class="side-article-head">热门文章</span>
          <div
            v-for="item in articleHotList"
            :key="item.id"
            class="side-article-item"
            @click="jumpURL(item.id)"
          >
            <div class="side-article-intro">
              <h1 class="side-article-title">
                {{ item.title }}
              </h1>
              <div class="side-article-create-browse">
                <div class="side-article-create">
                  {{ item.created_at }}
                </div>
                <div class="side-article-browse">
                  阅读({{ item.browse }})
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      <div class="fixed">
        <i class="el-icon-top" title="回到顶部" @click="scrollTop"></i>
      </div>
    </div>
    <div class="good">
      <swiper class="swiper" :options="swiperOption">
        <swiper-slide v-for="good in goodList" :key="good.id">
          <div class="img-box">
            <img :src="good.img_url" alt="商品图片" @click="jumpURLToGood(good.id)">
          </div>
          <div class="goodsInfo">
            <span class="goodsName ellipsis" @click="jumpURLToGood(good.id)">{{good.name}}</span>
            <span class="price">{{'¥'+good.spec_info[0].price}}</span>
          </div>
        </swiper-slide>
        <div slot="pagination" class="swiper-pagination"></div>
        <div v-if="goodList.length>=3" slot="button-prev" class="swiper-button-prev"></div>
        <div v-if="goodList.length>=3" slot="button-next" class="swiper-button-next"></div>
      </swiper>
    </div>
      <div ref="comment">
        <vue-lazy-component >
          <ArticleComment class="comment_container"/>
        <img
          width="0"
          height="0"
          style="display: none"
          src="http://124.71.112.249/images/2022/01/06/avatar.png"
          alt="preload"
        />
        </vue-lazy-component>
      </div>
    </div>
  </client-only>
</template>
<script>
import { getArticleList, getArticleDetail, updateArticle} from '@/request/api/article'
import ArticleComment from '@/components/article/ArticleComment'
import { mapState } from 'vuex'
import { component as VueLazyComponent } from '@xunlei/vue-lazy-component'
import { loadBMap } from '@/lib/utils'
import { getGoodList } from '@/request/api/good'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'

import 'swiper/css/swiper.css'
import '@/assets/css/side.scss'

export default {
  name: 'ArticleDetail',
  components: {
    ArticleComment,
    VueLazyComponent,
    Swiper,
    SwiperSlide
  },
  async asyncData(context) {
    // 获取单篇文章进行展示
    const { id } = context.query
    const params = {
      id,
      is_markdown: true,
    }
    // 获取文章
    const [err, res] = await getArticleDetail(params)
    // 获取商品
    const article_id = id
    const [err1, res1] = await getGoodList({
      article_id
    })
    if (!err && !err1) {
      return {
        article: res.data.data,
        id,
        goodList: res1.data.data.data
      }
    }
  },
  data() {
    return {
      isLogin: false,
      showSearch: false,
      articleHotList: [],
      newArticle: {},
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 30,
        slidesPerGroup: 3,
        loop: true,
        loopFillGroupWithBlank: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
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
  watch: {'$route' (to, from) {
      this.$router.go(0);
    }
  },
  mounted() {
    this.setBMap()
    this.initUserInfo()
    this.getHotArticleList()
    this.getNewArticle()
    // eslint-disable-next-line no-console
    console.log('article',this.article)
  },
  methods: {
    // 回到顶部
    scrollTop() {
      this.$scrollTo(180)
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
    // 获取当前URL参数的方法
    getUrlPara() {
      const id = document.location.toString().split('?')[1].split('=')[1];
      return Number(id)
    },
    // 获取热点文章 最多只获取4篇
    async getHotArticleList () {
      // eslint-disable-next-line camelcase
      const [err, res] = await getArticleList({
        is_category: 1,
        is_admin: 1,
      })
      if (!err) {
        const temp = res.data.data.data
        let flag = 1;
        temp.forEach(item => {
            if(item.star_num >= 10 && flag < 5) {
              this.articleHotList.push(item)
              flag++;
            }
        });
      }
    },
    // 获取最新文章
    async getNewArticle () {
      const [err, res] = await getArticleList({
        is_category: 1,
        is_admin: 1,
      })
      if (!err) {
        const temp = res.data.data.data
        const newArticle = temp.sort((a,b) => new Date(a) - new Date(b))
        this.newArticle = newArticle[0];
      }
    },
    // 页面跳转
    jumpURL(id) {
      const paraid = this.getUrlPara();
      if(id === paraid) {
        this.$message({
            message: '本篇文章已经打开！',
            type: 'success'
          });
      }
      this.$router.push('?id=' + id)
    },
    jumpURLToGood(id) {
      this.$router.push('/good?id=' + id)
    }
  }
}
</script>

<style scoped lang="scss">
.article-map {
  margin-top: 50px;
  margin-bottom: 50px;
}
.container {
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  width: 1280px;
  margin: 0 auto;
}
.sidebar_container {
  position: sticky;
  top: 32px;
  right: 32px;
}
.article {
  box-sizing: border-box;
  width: 880px;
  margin: 80px auto 0;
  padding: 0 30px 80px;
  border-bottom: 1px solid #e8e8e8;
  // background: #FDF7F2; //珍珠白
  background: #fff;
  box-shadow: -2px 2px 7px rgba(0, 0, 0, 0.3);
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
.fixed {
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
.comment_container {
  box-sizing: border-box;
  width: 100%;
  margin: 30px auto;
}
.swiper {
  height: 300px;
  width: 100%;
  .swiper-slide {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    text-align: center;
    overflow: hidden;
    width: 400px;
    font-weight: bold;
    font-size: 30px;
    background-color: white;
    &:hover{
      img{
        transform:scale(1.05);
      }
    }
    .img-box{
      position: relative;
      width: 100%;
      height: 230px;
      overflow: hidden;
      img{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        height: 210px;
        cursor: pointer;
        transition:transform 0.5s;
      }
    }
  }
}
.good {
  display: flex;
  justify-content: center;
  width: 1280px;
  height: 300px;
  margin: 30px auto;
}
.goodsInfo{
    width: 100%;
    height: 100px;
    font-size: 14px;
    .goodsName{
      display: block;
      text-align: center;
      cursor: pointer;
      margin-top: 20px;
      margin-bottom: 10px;
      font-weight: 600;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &:hover{
        color:rgb(37, 34, 34);
      }
    }
    .price{
      display: block;
      text-align: center;
      color:rgb(214, 25, 25);
    }
  }
</style>


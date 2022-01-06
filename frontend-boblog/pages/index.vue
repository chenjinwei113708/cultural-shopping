<template>
  <div>
    <div v-if="isClear" class="clear-refresh">
      <a href="/">清空搜索条件</a>
    </div>
    <div v-if="article" class="article">
      <div
        v-for="item in article.data"
        :key="item.id"
        class="article-item"
        @click="jumpURL(item.id)"
      >
        <div class="article-image">
          <img :src="item.img_url" :alt="item.title" />
        </div>
        <div class="article-intro">
          <h1 class="article-title">
            {{ item.title }}
          </h1>
          <div class="article-create-browse">
            <div class="article-create">
              {{ item.created_at }}
            </div>
            <div class="article-browse">
              阅读({{ item.browse }})
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoad" class="more" @click="loadMore">
      <div class="more-text">点击加载更多</div>
      <div class="more-arrow">
        <img src="https://cdn.boblog.com/arrow.png" alt="" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { getArticleList } from '@/request/api/article'

export default {
  async asyncData(context) {
    // eslint-disable-next-line camelcase
    const { id, keyword, category_id, page = 1 } = context.query
    const [err, res] = await getArticleList({
      id,
      category_id,
      keyword,
      page,
      is_category: 1,
      is_admin: 1,
    })
    if (!err) {
      const isLoad = res.data.data.meta.total_pages > page
      return {
        isClear: !!keyword,
        page,
        isLoad,
        categoryId: category_id,
        article: res.data.data,
      }
    }
  },
  async fetch({ store }) {
    await store.dispatch('category/getCategoryData')
  },
  head() {
    return {
      title: '民俗文化 - 在线购物',
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
  computed: {
    ...mapState({
      categoryList: (state) => state.category.categoryList
    }),
    // 是否为空数据
    isEmptyData() {
      return (
        this.article &&
        Array.isArray(this.article.data) &&
        this.article.data.length === 0
      )
    },
  },
  methods: {
    ...mapActions(['getArticleListData']),
    // 获取新数据
    async fetchData(id) {
      const [err, res] = await getArticleList({
        category_id: id,
        is_category: 1,
        is_admin: 1,
        page: this.page,
      });
      if (!err) {
        this.categoryId = id
        this.article.push(...res.data.data)
        this.isLoad = res.data.data.meta.total_pages > this.page
      }
    },
    // 加载更多分页
    loadMore() {
      this.page++
      this.fetchData()
    },
    // 跳转URL
    jumpURL(id) {
      this.$router.push('/article?id=' + id)
    },
  },
}
</script>

<style scoped lang="scss">
@font-face {
  font-family: 'iconfont';  /* Project id 3062722 */
  src: url('//at.alicdn.com/t/font_3062722_5pyyp0e4yuf.woff2?t=1640788190437') format('woff2'),
       url('//at.alicdn.com/t/font_3062722_5pyyp0e4yuf.woff?t=1640788190437') format('woff'),
       url('//at.alicdn.com/t/font_3062722_5pyyp0e4yuf.ttf?t=1640788190437') format('truetype');
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 30px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.clear-refresh {
  margin-top: 16px;
  text-align: center;
}
.article {
  box-sizing: border-box;
  width: 1280px;
  margin: 32px auto;
  display: flex;
  flex-wrap: wrap;
}

.article-item {
  cursor: pointer;
  overflow: hidden;
  box-sizing: border-box;
  display: inline-block;
  margin-right: 40px;
  margin-bottom: 40px;
  width: 400px;
  height: 280px;
  background: #ffffff;
  box-shadow: 2px 4px 24px 0 rgba(0, 0, 0, 0.06);
}
.article-item:nth-child(3n) {
  margin-right: 0;
}

.article-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}
.article-image img {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.article-intro {
  box-sizing: border-box;
  padding: 16px;
}
.article-title {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  height: 22px;
  font-size: 16px;
  font-weight: 400;
  color: #222222;
  line-height: 22px;
}
// .article-create {
  
// }
.article-create-browse {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
  margin-top: 8px;
}
.article-browse:before {
    content: "\e63a";
    font-family: "iconfont";
}
.more {
  cursor: pointer;
  width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.more-text {
  font-size: 16px;
  font-weight: 400;
  color: #222222;
  line-height: 22px;
}
.more-arrow {
  width: 16px;
  margin-top: 24px;
}
.more-arrow img {
  width: 100%;
}
</style>

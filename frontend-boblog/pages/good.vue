<!--
 * @Author: chen
 * @Date: 2022-01-22 22:41:06
 * @LastEditTime: 2022-02-05 13:43:32
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\frontend-boblog\pages\good.vue
 * 
-->
<template>
  <client-only>
    <div>
      <div class="container">
        <div class="content">
          <div class="goodsInfo">
            <img class="infoLeft" :src="good.img_url" alt="商品图片" />
            <div class="infoRight infoBox">
              <div class="infoBox">
                <h3 class="name">{{good.name}}</h3>
              </div>
              <div class="infoBox">
                <p>{{good.desc}}</p>
              </div>
              <div class="infoBox">
                <h3 class="price">{{'¥'+goodPrice}}</h3>
              </div>
              <div class="good-spec">
                <span>规格：</span>
                <el-radio-group v-model="temSpecId" class="good-spec-detail">
                  <el-radio  v-for="item in goodList" :key="item.key" :label="item.id" border class="detail-radio">{{item.spec_name + '还剩 ' + item.stock_num +' 件'}}</el-radio>
                </el-radio-group>
              </div>
              <div class="good-number">
                <span>数量：</span>
                <div class="good-number-ipnut">
                  <span :class="['minus',{ban:inputNum<=min}]" @click="minus">-</span>
                  <input 
                    v-model="inputNum"
                    type="number"
                    :min="min" :max="goodStock"
                    oninput="if(Number(value) < Number(this.min)) value=Number(this.min);if(Number(value)>Number(this.max)) value= Number(this.max)" 
                    onkeypress="return event.charCode >= 48" 
                  />
                  <span :class="['add',{ban:inputNum>=max}]" @click="add">+</span>
                </div>
              </div>
              <button :style="stock_num < 0 ? {'cursor': 'not-allowed'} : {}" :disabled="stock_num < 0" class="buyBtn" @click="buy">立即购买</button>
              <button
                :style="stock_num < 1 ? {'cursor': 'not-allowed'} : {}"
                :disabled="stock_num < 1"
                @click="addToCart">加入购物车
              </button>
            </div>
          </div>
        </div>
        <div class="fixed">
          <i class="el-icon-top" title="回到顶部" @click="scrollTop"></i>
        </div>
      </div>
      <div class="comment-ask">
        <el-tabs
          v-model="activeName"
          @tab-click="handleClick"
        >
          <el-tab-pane name="0">
            <span slot="label"><i class="el-icon-goods"></i> 全部评价</span>
            <div class="comment-body">
              <div v-if="commentList.length>0">
                <div class="rateBox">
                  <span>好评率</span>
                  <span class="rate">{{rate*100+'%'}}</span>
                </div>
                <ul class="commentList">
                  <li v-for="(item,index) in commentList" :key="'comment'+index">
                    <div class="userInfo">
                      <img src="http://124.71.112.249/images/2022/01/06/avatar.jpg" alt="side-avatar.png" border="0"/>
                      <span>{{item.user_info.username}}</span>
                    </div>
                    <div class="commentInfo">
                      <div class="starList">
                        <i
                          v-for="(star, index1) in item.score" 
                          :key="item.id+''+index1"
                          class="el-icon-star-on"
                        />
                      </div>
                      <p class="specName">{{item.spec_info.spec_name}}</p>
                      <p class="comment">{{item.content}}</p>
                      <p class="time">{{item.created_at}}</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div v-else>
                <el-empty description="该暂时没有评论，欢迎您的评论！"></el-empty>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane name="1">
            <span slot="label"><i class="el-icon-goods"></i> 全部问答</span>
            <div class="ask-body">
              <div ref="comment">
                <vue-lazy-component >
                  <GoodMessage class="comment_container"/>
                  </vue-lazy-component>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-if="!isLoginStatus" class="login">
        <el-dialog
          :visible.sync="isLogin"
          width="880px"
          height="300px"
          top="0"
          :lock-scroll="true"
          :before-close="handleClose"
        >
          <LoginForm @on-success="loginFormSuccess" />
        </el-dialog>
      </div>
    </div>
  </client-only>
</template>

<script>
import LoginForm from '@/components/common/LoginForm'
import GoodMessage from '@/components/good/GoodMessage'
import { component as VueLazyComponent } from '@xunlei/vue-lazy-component'
import { getGoodDetail } from '@/request/api/good'
import { getGoodCommentList } from '@/request/api/goodcomment'
import { createOrder } from '@/request/api/order'
import { mapState } from 'vuex'
import { getMessagelist } from '@/request/api/message'
import { isArray } from '@/lib/utils'
import '@/assets/css/good.scss'
export default {
  name: 'GoodDetail',
  components: {
    LoginForm,
    GoodMessage,
    VueLazyComponent
  },
  async asyncData(context) {
    const { id } = context.query

    // 获取商品详情
    const params = {
      id
    }
    const [err , res] = await getGoodDetail(params)

    // 获取评价列表
    const params1 = {
      good_id: id
    }
    const [err1,res1] = await getGoodCommentList(params1)
    
    if(!err && !err1) {
      return {
        good: res.data.data,
        commentList: res1.data.data.data,
        id,
        activeName: 0
      }
    }
  },
  data() {
    return {
      temSpecId: 0,
      goodList: [],
      messageList: [],
      inputNum: 1,
      price: 0,
      stock_num: 0,
      min:1,
      max:100,
      isLogin: false,
      rate: '',
      page: 1,
      count: 0,
      isLoad: true
    }
  },
  head() {
    const good = this.good || {}
    return {
      title: good.spec_name,
      meta: [
        { name: 'keywords', content: good.spec_name },
        { name: 'description', content: good.desc },
      ],
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      isLoginStatus: (state) => state.user.isLoginStatus,
    }),
    goodPrice(){
      this.goodList.forEach(item => {
        if(item.id === this.temSpecId) {
          this.price = item.price
        }
      })
      return this.inputNum*this.price
    },
    goodStock() {
      this.goodList.forEach(item => {
        if(item.id === this.temSpecId) {
          this.stock_num = Number(item.stock_num)
          this.max = Number(item.stock_num)
          this.inputNum = 1
        }
      })
      return this.stock_num
    }
  },
  mounted() {
    this.init()
    this.getMessage()
  },
  methods: {
    // 初始化
    init() {
      // 初始化选中规格
      this.temSpecId = this.good.spec_info[0].id
      // 初始化规格列表
      this.goodList = this.good.spec_info
      
      // 获取好评率 
      if(this.commentList.length > 0) {
        let temp = 0
        this.commentList.forEach(item => {
          temp +=item.score
        })
        this.rate = temp/(this.commentList.length*5)
      }
    },
    handleClick(tab, event) {
      // eslint-disable-next-line no-console
      console.log(tab, event);
    },
    handleClose() {
      this.isLogin = false
    },
    loginFormSuccess() {
      this.isLogin = false
    },
    // 减少商品
    minus() {
      if (this.inputNum <= this.min) {
        return
      }
      this.inputNum = Number(this.inputNum) - 1
    },

    // 增加商品
    add() {
      if (this.inputNum >= this.max) {
        return
      }
      this.inputNum = Number(this.inputNum) + 1
    },

    // 回到顶部
    scrollTop() {
      this.$scrollTo(0)
    },

    // 立即购买
    async buy() {
      if(!this.isLoginStatus) {
        this.isLogin = true
      } else if (this.stock_num < 1) {
        this.$message.warning('库存小于1不能购买')
         
      } else {
        const data = {
          img_url: this.good.img_url,
          user_id: this.userInfo.id,
          gooddetail_id: this.temSpecId,
          good_num: this.inputNum,
          amount: this.goodPrice,
          status: 1
        }
        const [err] = await createOrder(data)
        if(!err) {
          this.$message.success('自动付款成功！请耐心等待包裹派送~')
        }
        this.goodList.forEach(item => {
          if(item.id === this.temSpecId) {
            item.stock_num = this.stock_num - this.inputNum
          }
        })
      }
    },

    // 加入购物车
    async addToCart() {
      if(!this.isLoginStatus) {
        this.isLogin = true
      } else if (this.stock_num < 1) {
        this.$message.warning('库存小于1不能添加')
      } else {
        const data = {
          img_url: this.good.img_url,
          user_id: this.userInfo.id,
          gooddetail_id: this.temSpecId,
          good_num: this.inputNum,
          amount: this.goodPrice,
          status: 0
        }
        const [err] = await createOrder(data)
        if(!err) {
          this.$message.success('加入购物车成功！请前往 个人中心->购物车 结算')
        }
      }
    },

    // 获取问答数据
    async getMessage() {
      const [err, res] = await getMessagelist({
        good_id: this.$route.query.id,
        status:1,
        page: this.page
      })
      if(!err) {
        const meta = res.data.data.meta
        const data = res.data.data.data

        if (isArray(data) && meta) {
          data.forEach((item) => {
            item.is_show_reply = false
            item.reply_content = ''
          })
          this.messageList.push(...data)
          this.count = meta.count
          this.isLoad = meta.total_pages > this.page
        }
      }
    },

    // 加载更多
    loadMore() {
      this.page++
      this.getMessage()
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  width: 1280px;
  height: 450px;
  background-color: #fff;
  margin: 0 auto;
}
.comment-ask {
  display: flex;
  justify-content: flex-start;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 25px;
  width: 1280px;
  background-color: #fff;
}
.fixed {
  cursor: pointer;
  position: fixed;
  bottom: 32px;
  right: 32px;
  font-size: 30px;
}
.good-spec {
  display: flex;
  justify-content: flex-start;
  span {
    width: 50px;
    height: 40px;
    line-height: 40px;
    color:#7d7d7d;
    font-size: 13px;
  }
}
.good-spec-detail {
  display: flex;
  justify-content: space-between;// space-between：两端对齐，子元素间隔相等 space-around：子元素两侧的间隔相等。
  flex-wrap: wrap; //  wrap（向下换）
  width: 500px;
}
.detail-radio {
  margin-bottom: 10px;
  width: 230px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.el-radio.is-bordered+.el-radio.is-bordered {
  margin: 0;
}
.good-number {
  display: flex;
  justify-content: flex-start;
  height: 40px;
  margin-top: 10px;
  margin-bottom: 10px;
  span {
    width: 50px;
    height: 40px;
    line-height: 40px;
    color:#7d7d7d;
    font-size: 13px;
  }
}
.good-number-ipnut {
  display: inline-block;
  border: 1px solid #e6e8eb;
  width: 166px;
  height: 40px;
  user-select: none;
  span{
    display: inline-block;
    width: 40px;
    cursor: pointer;
    text-align: center;
    color:#263238;
    font-size: 26px;
  }
  input{
    border: none;
    display: inline-block;
    width: 70px;
    height: 33px;
    text-align: center;
    border-left: 1px solid #e6e8eb;
    border-right: 1px solid #e6e8eb;
  }
  .ban{
    cursor: not-allowed;
  }
}
.comment-body{
  padding: 20px;
  min-height: 300px;
  .rateBox{
    margin-bottom: 10px;
    span{
      color:#7d7d7d;
      display: inline-block;
      margin-right: 10px;
    }
    .rate{
      color:#be4141;
      font-weight: 600;
      font-size: 30px;
    }
  }
  .commentList{
    width: 100%;
    li{
      width: 100%;
      display: block;
      margin: 0 auto;
      border-bottom:1px solid #e6e8eb;
      padding: 20px 0;
      .userInfo{
        width: 80px;
        display: inline-block;
        text-align: center;
        img{
          margin: auto;
          display: block;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-bottom: 6px;
        }
        span{
          font-size: 13px;
          color:#7d7d7d;
        }
      }
      .commentInfo{
        display: inline-block;
        vertical-align: top;
        .starList{
          i{
            color:#f9bd4f;
          }
        }
        .specName,.time{
          color:#7d7d7d;
          font-size: 13px;
          margin-top: 10px;
        }
        .comment{
          margin-top: 10px;
        }
      }
    }
  }
  .noComment{
    width: 100%;
    text-align: center;
    color:#b4a078;
    padding-top: 30px;
  }
}
.ask-body {
  width: 1230px;
}
// 处理登录页面头部
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

//设置tab标签
::v-deep .el-tabs__content {
    overflow: visible;
  }  
  ::v-deep .el-tabs__item {
    font-size: 18px;
    font-weight: 700;
    color: #000;
  }
  ::v-deep .el-tabs__active-bar {
    height: 3px;
    font-size: 18px;
    font-weight: 700;
    color: #b4a078;
  }
  ::v-deep .el-icon-arrow-left {
    color: #b4a078;
  }
  ::v-deep .el-icon-arrow-right {
    color: #b4a078;
  }
  ::v-deep .el-tabs__nav-wrap::after {
    height: 0;
  }
  ::v-deep .el-tabs__active-bar {
    background-color: #b4a078;
  }
</style>

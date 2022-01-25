<!--
 * @Author: chen
 * @Date: 2022-01-22 22:41:06
 * @LastEditTime: 2022-01-24 13:39:30
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
                  <el-radio  v-for="item in goodList" :key="item.key" :label="item.id" border class="detail-radio">{{item.spec_name + ' 还剩 ' + item.stock_num + ' 件'}}</el-radio>
                </el-radio-group>
              </div>
              <div class="good-number">
                <span>数量：</span>
                <div class="good-number-ipnut">
                  <span :class="['minus',{ban:inputNum<=min}]" @click="minus">-</span>
                  <input v-model="inputNum" type="number" :min="min" :max="goodStock" oninput="if(value<this.min) value=this.min;if(value>this.max) value=this.max" onkeypress="return event.charCode >= 48" />
                  <span :class="['add',{ban:inputNum>=max}]" @click="add">+</span>
                </div>
              </div>
              <!-- <button :style="temSpecIdStockNum < 1 ? {'cursor': 'not-allowed'} : {}" :disabled="temSpecIdStockNum < 1" class="buyBtn" @click="buy">立即购买</button>
              <button
                :style="temSpecIdStockNum < 1 ? {'cursor': 'not-allowed'} : {}"
                :disabled="temSpecIdStockNum < 1"
                @click="addToCart">加入购物车
              </button> -->
              <button class="buyBtn">立即购买</button>
              <button @click="isLogin = true">加入购物车 </button>
            </div>
          </div>
        </div>
        <div class="fixed">
          <i class="el-icon-top" title="回到顶部" @click="scrollTop"></i>
        </div>
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
import { getGoodDetail } from '@/request/api/good'
import LoginForm from '@/components/common/LoginForm'
import { mapState } from 'vuex'

import '@/assets/css/good.scss'
export default {
  name: 'GoodDetail',
  components: {
    LoginForm
  },
  async asyncData(context) {
    const { id } = context.query
    const params = {
      id
    }
    // 获取商品
    const [err , res] = await getGoodDetail(params)
    if(!err) {
      return {
        good: res.data.data,
        id
      }
    }
  },
  data() {
    return {
      temSpecId: 0,
      goodList: [],
      inputNum: 1,
      price: 0,
      stock_num: 0,
      min:1,
      max:100,
      isLogin: false
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
        }
      })
      return this.stock_num
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    handleClose() {
      this.isLogin = false
    },
    loginFormSuccess() {
      this.isLogin = false
    },
    test() {
      // eslint-disable-next-line no-console
      console.log(this.good);
    },
    // 初始化
    init() {
      // 初始化选中规格
      this.temSpecId = this.good.spec_info[0].id
      // 初始化规格列表
      this.goodList = this.good.spec_info
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
</style>

<!--
 * @Author: chen
 * @Date: 2022-01-27 21:40:54
 * @LastEditTime: 2022-01-30 21:01:49
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\frontend-boblog\components\order\OrderShow.vue
 * 
-->
<template>
  <div v-if="orderList.length" class="order-box">
    <el-table
      :data="orderList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      max-height="573"
      :header-cell-style="{backgroundColor:'#e6e8eb'}"
    >
      <el-table-column label="ID"  width="60" align="center">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="商品信息" width="260" align="center">
        <template slot-scope="scope">
          <div class="info">
            <img :src="scope.row.img_url" width="80" height="80" alt="">
            <span>{{ scope.row.spec_info.spec_name  }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180" align="center">
        <template slot-scope="scope">
          <span class="el-icon-time">
            {{ scope.row.created_at }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="单价"  width="150" align="center">
        <template slot-scope="scope">
          <el-tag size="medium">{{"￥ " + scope.row.spec_info.price }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="商品数量" align="center">
        <template slot-scope="scope">
          {{ scope.row.good_num }}
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column label="交易操作" width="140" align="left">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 0">
            <el-button
              size="mini"
              type="warning"
              @click="pay(scope.row.id)"
            >确认付款</el-button>
            <el-tag size="medium" type="danger" class="el-icon-close delete-tag" @click="deleteOrder(scope.row.id)"></el-tag>
            <!-- <span class="deleteBtn" @click="deleteOrder(scope.row.id)"><i class="el-icon-close" /></span> -->
          </div>
          <span v-else-if="scope.row.status === 1">待发货，请耐心等待</span>
          <el-button
            v-else-if="scope.row.status === 2"
            size="mini"
            type="warning"
            @click="confirm(scope.row.id)"
          >确认收货</el-button>
          <el-button
            v-else-if="scope.row.status === 3 && scope.row.hascomment === 0"
            size="mini"
            type="warning"
            @click="comment(scope.row.id)"
          >评价商品</el-button>
          <span v-else>已评价</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="centerDialogVisible"
      width="35%"
      center>
      <div slot="title" class="header-title" :style="{'background': '#333333', 'color': 'white'}">
           <div style="padding:20px 20px;">商品评论</div>
       </div>
      <div class="comment-dialog">
        <div class="comment-body">
          <span class="tips">评分：</span>
          <i
            v-for="(item,index) in 5"
            :key="'star'+index"
            class="el-icon-star-on"
            :style="{color:(index+1)<=commentForm.score?'#f9bd4f':'white'}"
            @mouseover="setCurStar(index+1)"
            @mouseout="setCurStar(0)"
            @click="confirmStar(index+1)">
          </i>
        </div>
        <textarea v-model="commentForm.content" cols="20" rows="10" placeholder="请输入评论内容" required></textarea>
        <div slot="footer" class="comment-footer" append-to-body>
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="comfirmComment">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
  <el-empty v-else description="暂无数据"></el-empty>
</template>
<script>
import { deleteOrder, getOrderDetail, updateOrder } from '@/request/api/order'
import { createGoodComment } from '@/request/api/goodcomment'
import { mapState } from 'vuex'

export default {
  name: 'OrderShow',
  data() {
    return {
      tagList:['全部订单','待付款','待发货','已发货','已完成'],
      // 控制评论弹框是否弹出
      centerDialogVisible: false,
      hasClickStar:false,
      orderDetail: {},
      commentForm: {
        content: '',
        score: 0,
        good_id: 0,
        gooddetail_id: 0,
        user_id: 0,
        order_id:0,
        email: ''
      }
    }
  },
  computed:{
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      orderList: (state) => state.order.orderList,
      status: (state) => state.order.status
    })
  },
  mounted() {
  },
  methods: {
    setCurStar(star){
      if(this.hasClickStar){
        return;
      }
      this.commentForm.score = star;
    },
    confirmStar(star){
      this.commentForm.score = star;
      this.hasClickStar = true;
    },
    // 跳转页面
    jumpURLToGood(id) {
      this.$router.push('/good?id=' + id)
    },

    // 获取订单列表
    async getOrderList() {
      const params = {
        user_id: this.userInfo.id,
        status: this.status
      }
      // 获取和初始化数据
      await this.$store.dispatch('order/getOrderListaa', params)
    },

    // 删除订单
    deleteOrder(id) {
      try {
        this.$msgbox
          .confirm('确定需要删除这个订单吗', '提示', {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'error'
          })
          .then(async() => {
            await deleteOrder({ id })
            this.getOrderList()
          })
      } catch (err) {
        this.$message.error(err)
      }
    },

    // 下单支付
    pay(id) {
      try {
        this.$msgbox
          .confirm('确定付款吗', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
          })
          .then(async() => {
            // 获取商品
            const [err , res] = await getOrderDetail({id})
            if(!err) {
              const orderDetail = res.data.data
              // 1 代表付款完成 转入待发货阶段
              this.updateOrder(orderDetail,1)
            }
            this.getOrderList()
          })
      } catch (err) {
        this.$message.error(err)
      }
    },

    // 确认收货
    confirm(id) {
      try {
        this.$msgbox
          .confirm('确定收货吗', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
          })
          .then(async() => {
            // 获取商品
            const [err , res] = await getOrderDetail({id})
            if(!err) {
              const orderDetail = res.data.data
              // 1 代表付款完成 转入待发货阶段
              this.updateOrder(orderDetail,3)
            }
            this.getOrderList()
          })
      } catch (err) {
        this.$message.error(err)
      }
    },

    // 评论 
    async comment(id) {
      this.centerDialogVisible = true
      const [err , res] = await getOrderDetail({id})
      if(!err) {
        this.orderDetail = res.data.data
        // 初始化评论表
        this.commentForm.good_id = this.orderDetail.spec_info.good_id
        this.commentForm.gooddetail_id = this.orderDetail.gooddetail_id
        this.commentForm.user_id = this.orderDetail.user_info.user_id
        this.commentForm.order_id = this.orderDetail.id
        this.commentForm.email = this.orderDetail.user_info.email
        console.log(this.orderDetail)
      }
    },
    // 提交评论
    async comfirmComment() {
      this.centerDialogVisible = false
      this.orderDetail.hascomment = 1
      await createGoodComment(this.commentForm)
      await updateOrder(this.orderDetail)
    },
    // 更新订单
    async updateOrder(order,temp) {
      const data = {
          id: order.id,
          amount: order.amount,
          good_num: order.good_num,
          status: temp
        }
        await updateOrder(data)
        this.getOrderList()
    }
  }
}
</script>
<style scoped lang="scss">
.el-dialog__header {
  background-color: #000;
}
.comment-dialog {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px;
  .comment-body {
    width: 100%;
    .tips{
      font-size: 15px;
      vertical-align: middle;
      display: inline-block;
    }
    i{
      cursor: pointer;
      vertical-align: middle;
      display: inline-block;
      font-size: 25px;
      margin-right: 5px;
      -webkit-text-stroke: 1px #f9bd4f;
    }
  }
  textarea {
    resize: none;
    margin-top: 10px;
    width: 95%;
  }
  .comment-footer {
    margin: 10px auto;
  }
}

.delete-tag {
  cursor: pointer; 
}
.info {
  display: flex;
  justify-content: flex-start;
  padding-left: 10px;
  img {
    height: 80px;
    width: 80px;
  }
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
    height: 80px;
    line-height: 80px;
    padding-left: 15px;
    white-space: nowrap;
  }
}
.order-box{
    width: 100%;
    margin-top: 20px;
    .orderTableHeader{
      width: 100%;
      height: 40px;
      background-color: #f5f5f5;
      border: 1px solid #e6e8eb;
      color: #7d7d7d;
      font-size: 14px;
      line-height: 40px;
      span{
        display: inline-block;
        width: 14%;
        &:first-child{
          width:40%;
          text-align: center;
        }
      }
    }
    .orderList{
      width: 100%;
      li{
        border: 1px solid #e6e8eb;
        font-size: 13px;
        list-style: none;
        margin-top: 10px;
        .orderHeader{
          background-color: #f1f1f1;
          height: 40px;
          line-height: 40px;
          padding: 0 5px;
          .orderTime{
            font-weight: 600;
          }
          .orderId,.state{
            margin-left: 10px;
          }
          .deleteBtn{
            float: right;
            cursor: pointer;
            i{

            }
          }
        }
        .orderDetail{
          width: 100%;
          padding: 10px;
          position: relative;
          overflow: hidden;
          img{
            width: 84px;
            height: 84px;
            display: inline-block;
          }
          .goodsName{
            display: inline-block;
            margin-left: 5px;
            width: 230px;
            vertical-align: top;
            p{
              cursor: pointer;
              line-height: 20px;
              &:hover{
                text-decoration:underline;
              }
            }
            span{
              color:#7d7d7d;
              display: block;
              margin-top: 10px;
            }
          }
          .unitPrice,.num,.amount,.hasComment{
            display: inline-block;
            vertical-align: top;
            width: 15%;
            height: 85px;
            line-height: 85px;
            text-align: center;
          }
          button{
            position: absolute;
            right: 90px;
            bottom: 40px;
            width: 70px;
            height: 30px;
            border-radius: 3px;
            background-color: #b4a078;
            color:white;
            border: none;
          }
        }
      }
    }
  }
</style>
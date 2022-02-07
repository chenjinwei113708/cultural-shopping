<!--
 * @Author: chen
 * @Date: 2022-01-26 10:56:03
 * @LastEditTime: 2022-01-28 14:07:03
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\frontend-boblog\pages\usercenter\cart.vue
 * 
-->
<template>
  <div class="cart-container">
    <el-table
      :data="orderList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      max-height="573"
      :header-cell-style="{backgroundColor:'#e6e8eb'}"
    >

      <el-table-column label="商品信息" width="260" align="center">
        <template slot-scope="scope">
          <div class="info">
            <img :src="scope.row.img_url" width="80" height="80" alt="">
            <span>{{ scope.row.spec_info.spec_name  }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="单价"  width="120" align="center">
        <template slot-scope="scope">
          {{ "￥ " + scope.row.spec_info.price }}
        </template>
      </el-table-column>
      <el-table-column label="商品数量" align="center">
        <template slot-scope="scope">
          <!-- {{ scope.row.good_num }} -->
          <input
              v-model="scope.row.good_num"
              type="number"
              :min="min" :max="scope.row.spec_info.stock_num"
              oninput="if(Number(value) < Number(this.min)) value=Number(this.min);if(Number(value)>Number(this.max)) value= Number(this.max)" 
              onkeypress="return event.charCode >= 48"
              @change="handleChange(scope.row.id)"
            />
        </template>
      </el-table-column>
      <el-table-column label="小计" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column label="交易操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="warning"
            @click="handleDelete(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="cart-footer">
      <span>应付金额：</span>
      <span class="total">{{'￥'+totalAmount}}</span>
      <button @click="addOrders">下单</button>
    </div>
  </div>

</template>

<script>
import { getOrderList, deleteOrder, updateOrder } from '@/request/api/order'
import { mapState } from 'vuex'
export default {
  name: 'Cart',
  // async asyncData(context) {
  //   const status = 0;
  //   const [err, res] = await getOrderList({status});
  //   if(!err) {
  //     return {
  //       orderList: res.data.data.data
  //     }
  //   }
  // },
  data() {
    return {
      orderList: [],
      min:1,
      // 最大值，随便设置的，使用时再初始化
      max:11
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
    totalAmount() {
      let amount = 0;
      this.orderList.forEach(item => {
        amount += item.amount
      })
      return amount
    }
  },
  mounted() {
    this.getOrderList11()
  },
  methods: {
    // 获取购物车列表
    async getOrderList11() {
      try {
        const params = {
          user_id: this.userInfo.id,
          status: 0
        }
        const [err, res] = await getOrderList(params)
        if(!err) {
          const temp = res.data.data.data
          temp.forEach(item => {
            this.orderList.push(item)
          });
        }
        // this.orderList = res.data.data.data
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err)
      }
    },
    handleDelete(id) {
      try {
        this.$msgbox
          .confirm('确定需要删除这个订单吗', '提示', {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'error'
          })
          .then(async() => {
            await deleteOrder({ id })
            this.orderList = []
            await this.getOrderList11()
          })
      } catch (err) {
        this.$message.error(err)
      }
    },
    addOrders() {
      this.orderList.forEach(async item => {
        console.log('创建订单')
        const data = {
          id: item.id,
          status: 1,
          amount: item.amount,
          good_num: item.good_num
        }
        await updateOrder(data)
      })
      this.$message({
        message: '下单成功！请到订单中心查看',
        type: 'success'
      });
    },
    // 处理商品数量改变事件
    handleChange(id) {
      this.orderList.forEach((item,index)=>{
        if(id === item.id){
          item.amount = item.good_num*item.spec_info.price;
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.cart-container {
  height: 140px;
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
    padding: 15px;
  }
}
.cart-footer {
  width: 100%;
    position: relative;
    box-sizing: border-box;
    border: 1px solid #e6e8eb;
    border-top: none;
    padding: 0 10px;
    height: 50px;
    line-height: 50px;
    background-color: #f5f5f5;
    span{
      display: inline-block;
      vertical-align: top;
      color: #7d7d7d;
    }
    .total{
      color:#be4141;
      font-size: 25px;
      font-weight: 600;
    }
    button{
      position: absolute;
      right: 0;
      top: 0;
      width: 100px;
      height: 100%;
      background-color: #b4a078;
      border: none;
      color:white;
      font-size: 20px;
    }
}
input{
  border: none;
  display: inline-block;
  width: 120px;
  height: 33px;
  text-align: center;
  border-left: 1px solid #e6e8eb;
  border-right: 1px solid #e6e8eb;
}
</style>

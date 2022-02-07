<!--
 * @Author: chen
 * @Date: 2022-01-26 10:56:03
 * @LastEditTime: 2022-01-29 21:24:05
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\frontend-boblog\pages\usercenter\order.vue
 * 
-->
<template>
  <div class="order-container">
    <el-tabs 
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane name='0'>
        <span slot="label"><i class="el-icon-goods"></i> 全部订单</span>
        <OrderShow></OrderShow>
      </el-tab-pane>
      <el-tab-pane name='1'>
        <span slot="label"><i class="el-icon-shopping-bag-1"></i> 待付款</span>
        <OrderShow></OrderShow>
      </el-tab-pane>
      <el-tab-pane name='2'>
        <span slot="label"><i class="el-icon-present"></i> 待发货</span>
        <OrderShow></OrderShow>
      </el-tab-pane>
      <el-tab-pane name='3'>
        <span slot="label"><i class="el-icon-film"></i> 已发货</span>
        <OrderShow></OrderShow>
      </el-tab-pane>
      <el-tab-pane name='4'>
        <span slot="label"><i class="el-icon-receiving"></i> 已完成</span>
        <OrderShow></OrderShow>
      </el-tab-pane>
    </el-tabs>
    
  </div>
</template>
<script>
import { mapState } from 'vuex'
import OrderShow from '@/components/order/OrderShow'

export default {
  name: 'Order',
  components:{
    OrderShow,
  },
  data() {
    return {
      // 设置默认的选中tab
      activeName: '1',
      // 订单状态
      status: '',
      // '':表示全部订单，0:表示加入购物车未付款订单，1:表示已付款待发货订单，2:已发货，3:已完成
      statusList:['', 0, 1, 2, 3],
      centerDialogVisible: true
    }
  },
  computed:{
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      orderList: (state) => state.order.orderList
    })
  },
  mounted() {
    this.getOrderList()
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
      this.getOrderList()
    },
    // 获取和更新数据
    async getOrderList() {
      this.status = this.statusList[Number(this.activeName)]
      const params = {
        user_id: this.userInfo.id,
        status: this.status
      }
      // 获取和初始化数据
      await this.$store.dispatch('order/getOrderListaa', params)
    }
  }
}
</script>
<style scoped lang="scss">
.order-container {
  width: 100%;
  height: 100%;
}
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

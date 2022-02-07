<template>
  <div class="category">
    <div class="search">
      <el-form
        ref="searchForm"
        v-loading="listLoading"
        :model="searchForm"
        inline
      >
        <el-form-item label="用户ID" prop="user_id">
          <el-input
            v-model.trim="searchForm.user_id"
            placeholder="用户ID"
            class="input"
            clearable
          />
        </el-form-item>
        <el-form-item label="商品规格ID" prop="gooddetail_id">
          <el-input
            v-model.trim="searchForm.gooddetail_id"
            placeholder="商品规格ID"
            class="input"
            clearable
          />
        </el-form-item>
        <el-form-item label="订单状态：" prop="status">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
          >
            <el-option label="未付款" value="0" />
            <el-option label="已付款未发货" value="1" />
            <el-option label="已发货未确认收到" value="2" />
            <el-option label="确认到货订单完成" value="3" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="medium" @click="searchData">
            搜索
          </el-button>
          <el-button type="primary" size="medium" @click="resetSearchData">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="ID" width="80" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="订单用户" width="150" align="center">
          <template slot-scope="scope">
            {{ scope.row.user_info.username }}
          </template>
        </el-table-column>
        <el-table-column label="商品图片" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.img_url" width="80" height="80" alt="">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            {{ scope.row.spec_info.spec_name }}
          </template>
        </el-table-column>
        <el-table-column label="商品数量" align="center">
          <template slot-scope="scope">
            {{ scope.row.good_num }}
          </template>
        </el-table-column>
        <el-table-column label="订单金额" align="center">
          <template slot-scope="scope">
            {{ scope.row.amount }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.created_at }}
          </template>
        </el-table-column>

        <el-table-column class-name="status-col" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{
              scope.row.status | statusFilterText
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="180" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          background
          :current-page.sync="searchForm.page"
          layout="total, prev, pager, next"
          :total="count"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { list, detele } from '@/api/order'
import { list as getCategoryList } from '@/api/category'

export default {
  name: 'OrderList',
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'info',
        1: '',
        2: 'warning',
        3: 'success'
      }
      return statusMap[status]
    },
    statusFilterText(status) {
      const statusMap = {
        0: '未付款',
        1: '已付款未发货',
        2: '已发货',
        3: '订单完成'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      categoryList: [],
      list: null,
      listLoading: true,
      count: 0,
      searchForm: {
        user_id: '',
        gooddetail_id: '',
        status: '',
        page: 1
      }
    }
  },
  mounted() {
    this.getOrderList()
    this.getCategoryList()
  },
  methods: {
    // 获取分类列表
    async getCategoryList() {
      try {
        this.listLoading = true
        const res = await getCategoryList()
        this.categoryList = res.data.data
      } catch (err) {
        console.log(err)
      } finally {
        this.listLoading = false
      }
    },
    // 获取订单列表
    async getOrderList() {
      try {
        this.listLoading = true
        const res = await list(this.searchForm)
        this.list = res.data.data
        this.count = res.data.meta.count
      } catch (err) {
        console.log(err)
      } finally {
        this.listLoading = false
      }
    },
    // 订单编辑
    handleEdit(id) {
      this.$router.push('/good/orderedit?id=' + id)
    },
    // 删除订单
    handleDelete(id) {
      try {
        this.$msgbox
          .confirm('确定需要删除这个订单吗', '提示', {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'error'
          })
          .then(async() => {
            await detele({ id })
            await this.getOrderList()
          })
      } catch (err) {
        this.$message.error(err)
      }
    },
    // 搜索
    searchData() {
      this.searchForm.page = 1
      this.getOrderList()
    },
    // 点击页码
    handleCurrentChange(page) {
      this.searchForm.page = page
      this.getOrderList()
    },
    // 重置表单
    resetSearchData() {
      this.$refs['searchForm'].resetFields()
      this.getOrderList()
    }
  }
}
</script>

<style scoped lang="scss">
.category {
  box-sizing: border-box;
  margin: 24px;
}
.search {
  box-sizing: border-box;
  border-bottom: 1px solid #f0f0f0;
}
.pagination {
  display: flex;
  justify-content: center;
  margin: 24px 0;
}
status-col {
  overflow: none;
  text-overflow: none;

}
</style>

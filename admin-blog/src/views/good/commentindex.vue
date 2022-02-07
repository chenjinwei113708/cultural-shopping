<!--
 * @Author: chen
 * @Date: 2022-01-29 12:00:24
 * @LastEditTime: 2022-01-29 20:43:00
 * @LastEditors: chen
 * @Description:
 * @FilePath: \cultural-shopping\admin-blog\src\views\good\commentindex.vue
 *
-->
<template>
  <div class="category">
    <div class="search">
      <el-form
        ref="searchForm"
        v-loading="listLoading"
        :model="searchForm"
        inline
      >
        <el-form-item label="评论ID" prop="id">
          <el-input
            v-model.trim="searchForm.id"
            placeholder="评论ID"
            class="input"
            clearable
          />
        </el-form-item>
        <el-form-item label="商品ID" prop="good_id">
          <el-input
            v-model.trim="searchForm.good_id"
            placeholder="商品ID"
            class="input"
            clearable
          />
        </el-form-item>

        <el-form-item label="状态：" prop="status">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
          >
            <el-option label="审核中" value="0" />
            <el-option label="审核通过" value="1" />
            <el-option label="审核不通过" value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="评论内容" prop="content">
          <el-input
            v-model.trim="searchForm.content"
            placeholder="评论内容"
            class="input"
            clearable
          />
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
        <el-table-column label="评论内容">
          <template slot-scope="scope">
            <div v-html="mdRender(scope.row.content)" />
          </template>
        </el-table-column>
        <el-table-column label="评论人信息" align="center">
          <template slot-scope="scope">
            {{ scope.row.user_info || "匿名" }}
          </template>
        </el-table-column>
        <el-table-column label="评论商品" align="center">
          <template slot-scope="scope">
            {{ "id：" + scope.row.good_id }}  规格：
            {{ scope.row.spec_info && scope.row.spec_info.spec_name }}
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">
              {{ scope.row.status | statusFilterText }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="350" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="changeStatus(scope.row.id, 1)"
            >
              审核通过
            </el-button>
            <el-button
              size="mini"
              type="warning"
              @click="changeStatus(scope.row.id, 2)"
            >
              审核不通过
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.row.id)"
            >编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- <div class="pagination">
        <el-pagination
          background
          :current-page.sync="searchForm.page"
          layout="total, prev, pager, next"
          :total="count"
          @current-change="handleCurrentChange"
        />
      </div> -->
    </div>
  </div>
</template>

<script>
import { list, detele, update } from '@/api/goodcomment'

const hljs = require('highlight.js')
const md = require('markdown-it')({
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          hljs.highlight(str, {
            language: lang,
            ignoreIllegals: true
          }).value +
          '</code></pre>'
        )
      } catch (__) {
        console.log(__)
      }
    }
    return ('<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>')
  }
})

export default {
  name: 'GoodCommentIndex',
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'danger',
        1: 'success',
        2: 'warning'
      }
      return statusMap[status]
    },
    // 评论状态：0-审核中,1-审核通过,2-审核不通过
    statusFilterText(status) {
      const statusMap = {
        0: '待审核',
        1: '审核通过',
        2: '审核不通过'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      count: 0,
      searchForm: {
        id: '',
        good_id: '',
        content: '',
        status: '',
        page: 1
      }
    }
  },
  mounted() {
    this.getGoodComment()
  },
  methods: {
    // 获取商品评论列表
    async getGoodComment() {
      try {
        this.listLoading = true
        const res = await list(this.searchForm)
        this.list = res.data.data
        this.count = res.data.meta.count
        console.log('list---', this.list)
      } catch (err) {
        console.log(err)
      } finally {
        this.listLoading = false
      }
    },
    // Markdown 语法转换
    mdRender(content) {
      return md.render(content)
    },
    // 搜索
    searchData() {
      this.searchForm.page = 1
      this.getGoodComment()
    },
    // 点击页码
    handleCurrentChange(page) {
      this.searchForm.page = page
      this.getGoodComment()
    },
    // 重置表单
    resetSearchData() {
      this.$refs['searchForm'].resetFields()
      this.getGoodComment()
    },
    // 更新-审核状态
    async changeStatus(id, status) {
      await update({
        id: id,
        status
      })
      await this.getGoodComment()
      this.$message.success('更新成功')
    },

    // 跳转编辑分类
    handleEdit(id) {
      this.$router.push('/good/commentedit?id=' + id)
      console.log('评论编辑')
    },

    // 删除评论
    handleDelete(id) {
      try {
        this.$msgbox
          .confirm('确定需要删除这个评论吗', '提示', {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'error'
          })
          .then(async() => {
            const r = await detele({ id })
            this.$message.success(r.msg)
            await this.getGoodComment()
          })
      } catch (err) {
        this.$message.error(err)
      }
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
</style>

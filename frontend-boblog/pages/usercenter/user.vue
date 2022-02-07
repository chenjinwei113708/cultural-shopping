<!--
 * @Author: chen
 * @Date: 2022-01-26 10:56:03
 * @LastEditTime: 2022-02-05 15:06:24
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\frontend-boblog\pages\usercenter\user.vue
 * 
-->
<template>
  <!-- <div>
    <div v-if="userInfo" class="userinfo">
      <p>昵称：{{ userInfo.username }}</p>
      <p>邮箱：{{ userInfo.email }}</p>
      <p style="text-indent: 2em">
        —— 生活就像海洋，只有意志坚强的人，才能到达彼岸。 
      </p>
      <el-button @click="logout"> 退出登录 </el-button>

      <div
        v-if="Array.isArray(commentList) && commentList.length > 0"
        class="comment"
      >
        <h2>评论列表：</h2>
        <ul class="comment-list">
          <li v-for="item in commentList" :key="item.id" class="comment-item">
            <p>文章：{{ item.article.title }}</p>
            <p>评论内容：{{ item.content }}</p>
            <p>评论时间：{{ item.created_at }}</p>
            <p>回复：{{ item.reply_list || '无' }}</p>
          </li>
        </ul>
        <div class="pagination">
          <el-pagination
            background
            :current-page.sync="page"
            layout="total, prev, pager, next"
            :total="count"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div> -->
  <section class="wrap">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="80px"
      class="demo-ruleForm"
    >
      <el-form-item  class="item" label="用户昵称" prop="username">
        <el-input v-model="ruleForm.username" />
      </el-form-item>
      <el-form-item  class="item" label="用户邮箱" prop="email">
        <el-input v-model="ruleForm.email" />
      </el-form-item>
      <el-form-item  class="item" label="收件姓名" prop="recipient_name">
        <el-input v-model="ruleForm.recipient_name" />
      </el-form-item>
      <el-form-item  class="item" label="电话号码" prop="phone">
        <el-input v-model="ruleForm.phone" />
      </el-form-item>
      <el-form-item  class="item" label="收件地址" prop="address">
        <el-input v-model="ruleForm.address" />
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('ruleForm')">
          重置
        </el-button>
        <el-button
          type="primary"
          @click="updateConfirm('ruleForm')"
        >
          立即更新
        </el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { getCommentTarget } from '@/request/api/comment'
import { removeToken } from '@/lib/auth'

import '@/assets/css/element-ui.scss' 
export default {
  name: 'User',
  data() {
    return {
      page: 1,
      count: 0,
      commentList: [],
      ruleForm: {
        user_id: '',
        username: '',
        email: 1,
        phone: '',
        recipient_name: '',
        address: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
  },
  // eslint-disable-next-line vue/order-in-components
  async fetch({ store }) {
    await store.dispatch('category/getCategoryData')
  },
  // eslint-disable-next-line vue/order-in-components
  head() {
    return {
      title: '民俗文化 - 在线购物 - 个人中心',
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
  mounted() {
    this.getComment()
    this.init()
  },
  methods: {
    init() {
      this.ruleForm.user_id = this.userInfo.id
      this.ruleForm.username = this.userInfo.username
      this.ruleForm.email = this.userInfo.email
      this.ruleForm.phone = this.userInfo.phone
      this.ruleForm.address = this.userInfo.address
      this.ruleForm.recipient_name = this.userInfo.recipient_name
    },
    // 退出登录
    logout() {
      removeToken()
      this.$store.commit('user/SET_LOGIN_STATUS', false)
      this.$store.commit('user/SET_USERINFO', null)
      this.$router.push('/')
    },
    async getComment() {
      const uid = this.userInfo && this.userInfo.id
      const [err, res] = await getCommentTarget({
        user_id: uid,
        is_replay: 1,
        is_article: 1,
        page: this.page,
      })
      if (!err) {
        this.isLoad = true
        this.commentList = res.data.data.data
        this.count = res.data.data.meta.count
      }
    },
    // 点击数字
    async handleCurrentChange(page) {
      this.page = page
      await this.getComment()
      this.$scrollTo(0)
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.init()
    },
    async updateConfirm() {
      await this.$store.dispatch('user/userUpdate', this.ruleForm)
      .then(res => {
          this.$message({
            message: '更新用户信息成功',
            type: 'success'
          });
        })
    }
  },
}
</script>

<style scoped lang="scss">
.userinfo {
  // width: 1024px;
  width: 100%;
  // margin: 32px auto;
  font-size: 14px;
}
.comment-item {
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}
.item {
  height: 50px;
}
</style>


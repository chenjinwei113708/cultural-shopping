<template>
  <section class="wrap">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="订单 ID" prop="title">
        <span class="ban">{{ ruleForm.id }}</span>
      </el-form-item>
      <el-form-item label="用户 ID" prop="user_id">
        <span class="ban">{{ ruleForm.user_id }}</span>
      </el-form-item>
      <el-form-item label="订单状态" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio :label="0" border>未付款</el-radio>
          <el-radio :label="1" border>已付款未发货</el-radio>
          <el-radio :label="2" border>已发货未确认收到</el-radio>
          <el-radio :label="3" border>确认到货订单完成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品数量" prop="good_num">
        <el-input v-model="ruleForm.good_num" type="number" :min="min" :max="max" oninput="if(value<this.min) value=this.min;if(value>this.max) value=this.max" onkeypress="return event.charCode >= 48" />
        <span>{{ "   （本商品库存目前为: " + max + " 件）" }}</span>
      </el-form-item>
      <el-form-item label="金额金额" prop="amount">
        <span class="ban">{{ goodPrice }}</span>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >立即更新</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { detail, update } from '@/api/order'
import { list } from '@/api/category'
import { getToken } from '@/api/upload'
import axios from 'axios'

export default {
  name: 'CategoryCreate',
  data() {
    return {
      token: '',
      categoryList: [],
      min: 1,
      max: 1,
      ruleForm: {
        id: this.$route.query.id,
        user_id: '',
        gooddetail_id: '',
        status: '',
        good_num: 0,
        amount: 0,
        admin_id: '',
        spec_info: {}
      },
      rules: {
        id: [{ required: true, message: '请输入订单id', trigger: 'blur' }],
        good_num: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请输入展示状态', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      adminInfo: (state) => state.admin.adminInfo
    }),
    goodPrice() {
      if (this.ruleForm.good_num > this.max) {
        this.$message.warning('超过商品库存，自动设置最大值')
        this.ruleForm.good_num = this.max
      }
      this.ruleForm.amount = this.ruleForm.good_num * this.ruleForm.spec_info.price
      return this.ruleForm.amount
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.$axios = axios.create({ withCredentials: false })
      this.getOrderDetail()
      this.getUploadToken()
      this.getCategoryList()
    },
    // 获取用户信息
    async getUploadToken() {
      try {
        const res = await getToken()
        this.token = res.data.token
      } catch (err) {
        console.log(err)
      }
    },
    // 获取订单详情
    async getOrderDetail() {
      try {
        const res = await detail({
          id: this.$route.query.id,
          is_markdown: false
        })
        this.ruleForm.user_id = res.data.user_id
        this.ruleForm.gooddetail_id = res.data.gooddetail_id
        this.ruleForm.status = res.data.status
        this.ruleForm.good_num = res.data.good_num
        this.ruleForm.amount = res.data.amount
        this.ruleForm.admin_id =
          (this.adminInfo && this.adminInfo.id) || res.data.adminInfo.id
        this.ruleForm.spec_info = res.data.spec_info
        this.max = res.data.spec_info.stock_num
        switch (this.ruleForm.status) {
          case 0:
            this.status
            break
          default:
            break
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 图片上传成功回调
    upload(params) {
      const data = new FormData()
      data.append('source', params.file)
      this.$axios({
        url: 'http://124.71.112.249/api/1/upload/?key=a3d2f4bb1d05dfdcca756f61535d7dc5',
        method: 'post',
        data,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(res => {
        this.$message.success('图片上传成功')
        this.ruleForm.img_url = res.data.image.url
      }).catch(err => {
        console.log('图片上传失败', err)
      })
    },
    handleUploadError(err) {
      console.log('error', err)
    },
    // 获取分类列表
    async getCategoryList() {
      try {
        this.listLoading = true
        const res = await list()
        this.categoryList = res.data.data
      } catch (err) {
        console.log(err)
      } finally {
        this.listLoading = false
      }
    },
    // 提交表单
    submitForm(formName) {
      // 发布者id
      if (this.adminInfo) {
        this.ruleForm.admin_id = this.adminInfo.id
      }
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.updateOrder()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 更新订单
    async updateOrder() {
      try {
        const res = await update(this.ruleForm)
        if (res.code === 200) {
          this.$msgbox
            .confirm('更新成功，是否退出更新订单页面', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            })
            .then(() => {
              this.$router.push('/good/orderindex')
            })
        }
      } catch (err) {
        this.$message.error(err)
      }
    },
    onSubmit() {
      console.log(this.ruleForm)
    }
  }
}
</script>

<style scoped lang="scss">
.wrap {
  box-sizing: border-box;
  margin: 24px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.ban{
  width: auto;
  font-weight: 500;
  font-size: 14px;
  color:#263238;
}
.el-input {
  width: 50%;
}
</style>

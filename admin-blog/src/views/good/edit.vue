<template>
  <section class="wrap">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input v-model="ruleForm.desc" />
      </el-form-item>
      <el-form-item label="图片" prop="img_url">
        <el-input v-model="ruleForm.img_url" />
      </el-form-item>
      <el-form-item label="图片" prop="img_url">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :http-request="upload"
        >
          <img
            v-if="ruleForm.img_url"
            width="80"
            height="80"
            :src="ruleForm.img_url"
            class="avatar"
          >
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item label="展示" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="0">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="文章" prop="article_id">
        <el-select v-model="ruleForm.article_id" placeholder="请选择对应文章">
          <el-option
            v-for="item in articleList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="规格" prop="specList">
        <el-tag
          v-for="tag in ruleForm.specList"
          :key="tag.spec_name"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
          @click="handleEdit(tag)"
        >
          {{ tag.spec_name }}
        </el-tag>
        <el-dialog
          title="编辑规格"
          :visible.sync="dialogVisibleEdit"
          width="30%"
        >
          <el-form ref="specForm" :model="specForm" label-width="80px">
            <el-form-item label="规格名称">
              <el-input ref="spec_name" v-model="specForm.spec_name" />
            </el-form-item>
            <el-form-item label="库存">
              <el-input v-model="specForm.stock_num" />
            </el-form-item>
            <el-form-item label="价格">
              <el-input v-model="specForm.price" />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleEdit = false">取 消</el-button>
            <el-button type="primary" @click="handleInputConfirm">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="添加规格"
          :visible.sync="dialogVisibleNew"
          width="30%"
        >
          <el-form ref="specForm" :model="specForm" label-width="80px">
            <el-form-item label="规格名称">
              <el-input ref="spec_name" v-model="specForm.spec_name" />
            </el-form-item>
            <el-form-item label="库存">
              <el-input v-model="specForm.stock_num" />
            </el-form-item>
            <el-form-item label="价格">
              <el-input v-model="specForm.price" />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleNew = false">取 消</el-button>
            <el-button type="primary" @click="handleAddSpec">确 定</el-button>
          </span>
        </el-dialog>
        <el-button class="button-new-tag" size="small" @click="dialogVisibleNew=true">添加</el-button>

      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
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
import { detail, update, createSpec, deteleSpec } from '@/api/good'
import { list } from '@/api/article'
import { getToken } from '@/api/upload'
import axios from 'axios'

export default {
  name: 'CategoryCreate',
  data() {
    return {
      token: '',
      articleList: [],
      ruleForm: {
        id: this.$route.query.id,
        name: '',
        desc: '',
        img_url: '',
        status: 1,
        admin_id: '',
        specList: []
      },
      dialogVisibleEdit: false,
      dialogVisibleNew: false,
      specForm: {
        spec_name: '1',
        stock_num: 0,
        price: 0,
        id: -1
      },
      rules: {
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        desc: [
          { required: true, message: '请输入商品描述', trigger: 'blur' }
        ],
        img_url: [
          { required: true, message: '请输入图片链接', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请输入展示状态', trigger: 'blur' }
        ],

        specList: [
          { required: true, message: '请创建规格', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      adminInfo: (state) => state.admin.adminInfo
    })
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.$axios = axios.create({ withCredentials: false })
      this.getGoodDetail()
      this.getUploadToken()
      this.getArticleList()
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
    // 获取商品详情
    async getGoodDetail() {
      try {
        const res = await detail({
          id: this.$route.query.id,
          is_markdown: false
        })
        this.ruleForm.name = res.data.name
        this.ruleForm.desc = res.data.desc
        this.ruleForm.img_url = res.data.img_url
        this.ruleForm.content = res.data.content
        this.ruleForm.status = res.data.status
        this.ruleForm.admin_id =
          (this.adminInfo && this.adminInfo.id) || res.data.adminInfo.id
        this.ruleForm.specList = res.data.spec_info
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
    // 获取文章列表
    async getArticleList() {
      try {
        this.listLoading = true
        const res = await list()
        this.articleList = res.data.data
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
          this.updateGood()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 更新商品
    async updateGood() {
      try {
        const res = await update(this.ruleForm)
        if (res.code === 200) {
          this.$msgbox
            .confirm('更新成功，是否退出更新商品页面', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            })
            .then(() => {
              this.$router.push('/good/index')
            })
        }
      } catch (err) {
        this.$message.error(err)
      }
    },
    // 关闭规格标签
    handleClose(tag) {
      this.deleteSpec(tag)
    },
    // 处理编辑事件
    handleEdit(tag) {
      this.dialogVisibleEdit = true
      this.specForm.spec_name = tag.spec_name
      this.specForm.stock_num = tag.stock_num
      this.specForm.price = tag.price
      this.specForm.id = tag.id
    },
    // 处理规格添加弹框
    handleInputConfirm() {
      try {
        const specForm = this.specForm
        this.ruleForm.specList.forEach(item => {
          if (item.id === specForm.id) {
            item.spec_name = specForm.spec_name
            item.stock_num = specForm.stock_num
            item.price = specForm.price
          }
        })
        this.$message.success('规格 ' + specForm.spec_name + ' 编辑成功')
        this.specForm = {
          spec_name: '',
          stock_num: 0,
          price: 0,
          id: -1
        }
        this.dialogVisibleEdit = false
      } catch (err) {
        this.$message.error(err)
      }
      console.log(this.ruleForm.specList)
    },
    handleAddSpec() {
      this.createSpec()
    },
    async deleteSpec(tag) {
      const spec_name = tag.spec_name
      const res = await deteleSpec(tag)
      if (res) {
        this.$message.success('规格 ' + spec_name + ' 删除成功')
        this.getGoodDetail()
      }
    },
    async createSpec() {
      try {
        const specForm = this.specForm
        let flag = 1
        if (specForm) {
          this.ruleForm.specList.forEach(item => {
            if (specForm.spec_name === item.spec_name) {
              this.$message.error('此规格已存在，请更换其他名称')
              flag = 0
              return
            }
          })
          if (flag) {
            this.specForm.good_id = this.ruleForm.id
            const res = await createSpec(this.specForm)
            if (res) {
              this.$message.success('规格 ' + specForm.spec_name + ' 创建成功')
              this.getGoodDetail()
            }
          }
        }
        this.specForm = {
          spec_name: '',
          stock_num: 0,
          price: 0,
          id: -1
        }
        this.dialogVisibleNew = false
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
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
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
</style>

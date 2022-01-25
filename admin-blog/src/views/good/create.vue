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
        <el-upload
          class="avatar-uploader"
          action=""
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
          title="创建新的规格"
          :visible.sync="dialogVisible"
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
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleInputConfirm">确 定</el-button>
          </span>
        </el-dialog>
        <el-button class="button-new-tag" size="small" @click="dialogVisible = true">添加</el-button>

      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >立即创建</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { create } from '@/api/good'
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
        name: '',
        desc: '',
        img_url: '',
        status: 1,
        admin_id: '',
        article_id: '',
        specList: []
      },
      dialogVisible: false,
      specForm: {
        spec_name: '',
        stock_num: 0,
        price: 0
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
        article_id: [
          { required: true, message: '请选择对应文章', trigger: 'blur' }
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
    this.$axios = axios.create({ withCredentials: false })
    this.getUploadToken()
    this.getArticleList()
  },
  methods: {
    // 获取上传token
    async getUploadToken() {
      try {
        const res = await getToken()
        this.token = res.data.token
      } catch (err) {
        console.log(err)
      }
    },
    upload(params) {
      const data = new FormData()
      data.append('source', params.file)
      this.$axios({
        url: 'http://124.71.112.249/api/1/upload/?key=a3d2f4bb1d05dfdcca756f61535d7dc5',
        method: 'post',
        data,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(res => {
        console.log('上传图片成功', res)
        this.ruleForm.img_url = res.data.image.url
        this.$message.success('上传成功!')
      }).catch(err => {
        console.log('图片上传失败', err)
      })
    },
    handleUploadError(err) {
      console.log('error', err)
    },
    // 获取分类列表
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
    // 关闭规格标签
    handleClose(tag) {
      this.ruleForm.specList.splice(this.ruleForm.specList.indexOf(tag), 1)
    },
    // 处理规格添加弹框
    handleInputConfirm() {
      this.$nextTick(_ => {
        this.$refs.spec_name.$refs.input.focus()
      })
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
            this.ruleForm.specList.push({
              spec_name: specForm.spec_name,
              stock_num: specForm.stock_num,
              price: specForm.price
            })
            this.$message.success('规格 ' + specForm.spec_name + ' 创建成功')
          }
        }
        this.specForm = {
          spec_name: '',
          stock_num: 0,
          price: 0
        }
        this.dialogVisible = false
      } catch (err) {
        this.$message.error(err)
      }
    },
    // 提交表单
    submitForm(formName) {
      if (this.adminInfo) {
        this.ruleForm.admin_id = this.adminInfo.id
      }

      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.createGood()
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
    // 创建商品
    async createGood() {
      try {
        const res = await create(this.ruleForm)
        if (res.code === 200) {
          this.$msgbox
            .confirm('创建成功，是否退出创建商品页面', '提示', {
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
    }
  }
}
</script>

<style scoped lang="scss">
.wrap {
  box-sizing: border-box;
  margin: 24px;
}
.autoAddressClass{
    li {
      i.el-icon-search {margin-top:11px;}
      .mgr10 {margin-right: 10px;}
      .title {
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .address {
        line-height: 1;
        font-size: 12px;
        color: #b4b4b4;
        margin-bottom: 5px;
      }
    }
  }
</style>
<style>

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
</style>

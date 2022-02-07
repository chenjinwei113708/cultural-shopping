<template>
  <section class="wrap">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="80px"
      class="demo-ruleForm"
    >
      <el-form-item label="ID" prop="id">
        <span> {{ ruleForm.id }} </span>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input v-model="ruleForm.content" />
      </el-form-item>
      <el-form-item label="审核">
        <el-radio-group v-model="ruleForm.status">
          <el-radio :label="1">审核通过</el-radio>
          <el-radio :label="2">审核不通过</el-radio>
        </el-radio-group>
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
import { detail, update } from '@/api/reply'

export default {
  name: 'ReplyEdit',
  data() {
    return {
      ruleForm: {
        id: '',
        content: '',
        status: 0
      },
      rules: {
        content: [
          { required: true, message: '请输入评论内容', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getReply()
  },
  methods: {
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.updateUser()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取评论信息
    async getReply() {
      try {
        const res = await detail({
          id: this.$route.query.id
        })
        this.ruleForm.id = res.data.id
        this.ruleForm.content = res.data.content
        this.ruleForm.status = res.data.status
      } catch (err) {
        console.log(err)
      }
    },
    // 更新评论再次确认
    updateConfirm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.$msgbox
            .confirm('确定需要更新信息吗', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error'
            })
            .then(async() => {
              this.update('ruleForm')
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 更新评论信息
    async update() {
      try {
        const res = await update(this.ruleForm)
        if (res.code === 200) {
          this.$msgbox
            .confirm('更新成功，是否退出更新页面', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            })
            .then(() => {
              this.$router.push('/article/replyindex')
            })
        }
      } catch (err) {
        this.$message.error(err)
      }
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getMessage()
    }
  }
}
</script>

<style scoped lang="scss">
.wrap {
  box-sizing: border-box;
  margin: 24px;
}
</style>

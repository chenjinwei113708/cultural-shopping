<template>
  <section class="wrap">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="ruleForm.title" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="ruleForm.description" />
      </el-form-item>
      <el-form-item label="SEO关键字" prop="seo_keyword">
        <el-input v-model="ruleForm.seo_keyword" />
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
      <el-form-item label="分类" prop="category_id">
        <el-select v-model="ruleForm.category_id" placeholder="请选择分类">
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="sort_order">
        <el-input v-model="ruleForm.sort_order" />
      </el-form-item>
      <el-form-item label="详细地址：" prop="address">
        <el-autocomplete
          v-model="ruleForm.address"
          style="width:100%;"
          popper-class="autoAddressClass"
          :fetch-suggestions="querySearchAsync"
          :trigger-on-focus="false"
          placeholder="详细地址"
          clearable
          @select="handleSelect"
        >
          <template slot-scope="{ item }">
            <i class="el-icon-search fl mgr10" />
            <div style="overflow:hidden;">
              <div class="title">{{ item.title }}</div>
              <span class="address ellipsis">{{ item.address }}</span>
            </div>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="地图定位：">
        <div id="map-container" style="width:100%;height:500px; " />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button>取消</el-button>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <mavon-editor
          ref="md"
          v-model="ruleForm.content"
          code-style="atom-one-dark"
          @imgAdd="$imgAdd"
          @imgDel="$imgDel"
        />
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
import { create } from '@/api/article'
import { list } from '@/api/category'
import { getToken } from '@/api/upload'
import axios from 'axios'
import loadBMap from '@/utils/loadBMap.js'

export default {
  name: 'CategoryCreate',
  data() {
    return {
      token: '',
      categoryList: [],
      map: '', // 地图实例
      mk: '', // Maker实例
      locationPoint: null,
      ruleForm: {
        title: '',
        description: '',
        img_url: '',
        seo_keyword: '',
        status: 1,
        sort_order: 1,
        admin_id: '',
        category_id: '',
        content: '',
        address: '', // 详细地址
        addrPoint: { // 详细经纬度
          lng: 0,
          lat: 0
        },
        address_point: '' // 用来拼接addrPoint并存入数据库
      },
      rules: {
        title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
        description: [
          { required: true, message: '请输入文章描述', trigger: 'blur' }
        ],
        img_url: [
          { required: true, message: '请输入图片链接', trigger: 'blur' }
        ],
        seo_keyword: [
          { required: true, message: '请输入 SEO 关键字', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请输入展示状态', trigger: 'blur' }
        ],
        sort_order: [
          { required: true, message: '请输入文章排序', trigger: 'blur' }
        ],
        category_id: [
          { required: true, message: '请选择分类', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
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
    this.$scrollTo(10)
    this.$axios = axios.create({ withCredentials: false })
    this.getUploadToken()
    this.getCategoryList()
    this.setBMap()
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
        this.$message.success('图片上传成功')
        this.ruleForm.img_url = res.data.image.url
      }).catch(err => {
        console.log('图片上传失败', err)
      })
    },
    handleUploadError(err) {
      console.log('error', err)
    },
    // 编辑器删除图片回调
    $imgDel(pos, $file) {
      console.log(pos, $file)
    },
    // 编辑器新增上传图片回调
    $imgAdd(pos, $file) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      // 第一步.将图片上传到服务器.
      const formdata = new FormData()
      formdata.append('source', $file)
      this.$axios({
        url: 'http://124.71.112.249/api/1/upload/?key=a3d2f4bb1d05dfdcca756f61535d7dc5',
        method: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then((res) => {
        const img_url = res.data.image.url
        this.$refs.md.$img2Url(pos, img_url)
        loading.close()
      }).catch(err => {
        console.log(err)
        loading.close()
      })
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
      if (this.adminInfo) {
        this.ruleForm.admin_id = this.adminInfo.id
        this.ruleForm.address_point = this.ruleForm.addrPoint.lng + ':' + this.ruleForm.addrPoint.lat
      }

      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.createArticle()
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
    // 创建文章
    async createArticle() {
      try {
        const res = await create(this.ruleForm)
        if (res.code === 200) {
          this.$msgbox
            .confirm('创建成功，是否退出创建文章页面', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            })
            .then(() => {
              this.$router.push('/article/index')
            })
        }
      } catch (err) {
        this.$message.error(err)
      }
    },
    // 加载BMap
    async setBMap() {
      await loadBMap('Q0Hozuj64PoL9QKqBLc7qjYLdlL4IC6l') // 加载引入BMap
      this.initMap()
    },
    // 初始化地图
    initMap() {
      var that = this
      // 挂载地图 { enableMapClick: false }禁用地图默认点击弹框
      this.map = new BMap.Map('map-container')
      var point = new BMap.Point(113.37709276138025, 23.159672359942505)
      that.locationPoint = new BMap.Point(113.37709276138025, 23.159672359942505)
      // 初始化地图（设置进度），如果center类型为 Point 时，zoom必须赋值，范围为3-19级
      this.map.centerAndZoom(point, 19)
      // 设置图像标注并绑定拖拽标注结束后事件
      this.mk = new BMap.Marker(point, { enableDragging: true })
      // 将覆盖物添加到地图上
      this.map.addOverlay(this.mk)
      this.mk.addEventListener('dragend', function(e) {
        that.getAddrByPoint(e.point)
      })
      // 添加（右上角）平移缩放控件
      this.map.addControl(new BMap.NavigationControl({ anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL }))

      // 绑定点击地图任意点事件
      this.map.addEventListener('click', function(e) {
        that.getAddrByPoint(e.point)
      })
    },
    // 获取两点间的距离
    getDistancs(pointA, pointB) {
      return this.map.getDistance(pointA, pointB).toFixed(2)
    },

    // 逆地址解析函数
    getAddrByPoint(point) {
      var that = this
      var geco = new BMap.Geocoder({ extensions_town: true })
      //  将地理坐标(经纬度)转换成地址
      geco.getLocation(point, function(res) {
        console.log('test', res)
        that.mk.setPosition(point)
        that.map.panTo(point)
        that.ruleForm.address = res.address
        that.ruleForm.addrPoint = point
      }, { poiRadius: 5, numPois: 1 })
    },
    // 地址搜索
    querySearchAsync(str, cb) {
      var options = {
        onSearchComplete: function(res) {
          var s = []
          if (local.getStatus() === BMAP_STATUS_SUCCESS) {
            for (var i = 0; i < res.getCurrentNumPois(); i++) {
              s.push(res.getPoi(i))
            }
            cb(s)
          } else {
            cb(s)
          }
        }
      }
      var local = new BMap.LocalSearch(this.map, options)
      local.search(str)
    },
    handleSelect(item) {
      this.ruleForm.address = item.address + item.title
      this.ruleForm.addrPoint = item.point
      this.map.clearOverlays()
      this.mk = new BMap.Marker(item.point)
      this.map.addOverlay(this.mk)
      this.map.panTo(item.point)
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
</style>

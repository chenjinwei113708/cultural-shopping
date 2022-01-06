<!--
 * @Author: chen
 * @Date: 2021-11-28 22:29:58
 * @LastEditTime: 2022-01-06 11:05:36
 * @LastEditors: chen
 * @Description: footer
 * @FilePath: \frontend-boblog\components\common\Footer.vue
 * 
-->
<template>
  <div class="footer">
    <div class="site">
      <span>南风社区</span>
      <span>nangfengcloud.xyz</span>
    </div>
    <div class="copyright">
      <a
        class="copyright-link"
        href="https://beian.miit.gov.cn"
        target="_blank"
      >
        粤ICP备2022000180号
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
}
</script>

<style scoped lang="scss">
.footer {
  width: 1280px;
  display: flex;
  justify-content: space-between;
  margin: 120px auto 64px;
}
.site {
  font-size: 14px;
  color: #666666;
}
.site span {
  margin-right: 24px;
}
.copyright {
  &-link {
    font-size: 14px;
    color: #666666;
    text-decoration: none;
  }
}
</style>

<!--
 * @Author: chen
 * @Date: 2021-12-24 15:13:42
 * @LastEditTime: 2022-01-06 15:01:28
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \frontend-boblog\layouts\default.vue
 * 
-->
<template>
  <div class="view">
    <client-only>
      <Header />
      <Nuxt />
      <Footer />
    </client-only>
  </div>
</template>
<script>
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
export default {
  components: {
    Header,
    Footer,
  },
}
</script>
<style lang="scss" scoped>
.view {
  background: #f4f5f5;
}
</style>

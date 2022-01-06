<!--
 * @Author: chen
 * @Date: 2021-12-24 15:13:42
 * @LastEditTime: 2022-01-02 17:00:08
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \frontend-boblog\layouts\default.vue
 * 
-->
<template>
  <div>
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
</style>

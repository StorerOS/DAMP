<!--
 * @Author: 
 * @Date: 2021-11-11 16:54:48
 * @LastEditors: 
 * @LastEditTime: 2021-11-17 14:41:44
 * @FilePath: \\src\components\EquipmentInput\index.vue
 * @Description: 设备选择组件（单选、搜索）
-->

<template>
  <search-input v-bind="$attrs" :request-options="searchOptions" :response-callback="responseCallback" v-on="$listeners">
    <slot />
  </search-input>
</template>

<script>
import SearchInput from '@/components/SearchInput'

export default {
  name: 'EquipmentInput',
  components: {
    SearchInput
  },
  computed: {
    searchOptions() {
      return {
        url: '/device/query',
        method: 'post',
        data: {
          name: this.$attrs.value
        }
      }
    }
  },
  methods: {
    responseCallback({ data }) {
      return data.result
    }
  }
}
</script>

<style>

</style>

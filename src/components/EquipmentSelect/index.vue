<!--
 * @Author: 
 * @Date: 2021-11-05 15:30:47
 * @LastEditors: 
 * @LastEditTime: 2021-11-17 14:41:40
 * @FilePath: \\src\components\EquipmentSelect\index.vue
 * @Description: 设备选择组件（多选、搜索）
-->

<template>
  <multiple-input v-bind="$attrs" :request-options-callback="requestCallback" :response-callback="responseCallback" v-on="$listeners">
    <slot />
  </multiple-input>
</template>

<script>
import MultipleInput from '@/components/MultipleInput'

export default {
  name: 'EquipmentSelect',
  components: {
    MultipleInput
  },
  methods: {
    requestCallback(val) {
      return {
        url: '/device/query',
        method: 'post',
        data: {
          device_id: val
        }
      }
    },
    responseCallback({ data }) {
      return data.result
    }
  }
}
</script>

<style>

</style>

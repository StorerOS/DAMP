<!--
 * @Author:
 * @Date: 2021-11-11 16:41:41
 * @LastEditors:
 * @LastEditTime: 2021-11-17 14:38:48
 * @FilePath: \\src\components\EquipmentTypeSelect\index.vue
 * @Description: 设备类型选择组件
-->

<template>
  <el-select v-bind="$attrs" clearable v-on="$listeners">
    <el-option v-for="value in list" :key="value" :label="value" :value="value" />
  </el-select>
</template>

<script>
import { getEquipmentTypeList } from '@/api/common'

export default {
  name: 'EquipmentTypeSelect',
  data() {
    return {
      list: []
    }
  },
  created() {
    this.initEquipmentTypeList()
  },

  methods: {
    async initEquipmentTypeList() {
      const { data } = await getEquipmentTypeList()
      this.list = data.type_list
    }
  }
}
</script>

<style>

</style>


<!--
 * @Author: 
 * @Date: 2021-11-11 16:34:40
 * @LastEditors: 
 * @LastEditTime: 2021-11-17 18:07:29
 * @FilePath: \\src\components\AreaSelect\index.vue
 * @Description: 区域选择组件（单选）
-->

<template>
  <el-cascader
    v-bind="$attrs"
    :options="regionOptions"
    :props="areaProps"
    clearable
    v-on="$listeners"
  >
    <slot />
  </el-cascader>
</template>

<script>
import { getAreaList } from '@/api/common'
import { filterAreaList } from '@/utils'

export default {
  name: 'AreaSelect',
  data() {
    return {
      regionOptions: [],
      areaProps: { children: 'spaces', label: 'space_name', value: 'space_name', checkStrictly: true }
    }
  },
  created() {
    this.initAreaList()
  },
  methods: {
    async initAreaList() {
      const { data } = await getAreaList()
      const devicePath = data.device_path
      const devicePathList = devicePath && devicePath.space_name === '/' && devicePath.spaces || [data.device_path] || []
      this.regionOptions = filterAreaList(devicePathList)
    }
  }
}
</script>

<style>

</style>


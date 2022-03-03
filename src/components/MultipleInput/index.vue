<!--
 * @Author: 
 * @Date: 2021-11-05 09:41:54
 * @LastEditors: 
 * @LastEditTime: 2021-11-17 14:42:27
 * @FilePath: \\src\components\MultipleInput\index.vue
 * @Description: 多选搜索文本输入组件
-->

<template>
  <div class="multiple-input">
    <search-input
      v-model="inputValue"
      v-bind="$attrs"
      :request-options="searchInputOptions"
      :response-callback="responseCallback"
      :value-key="valueKey"
      v-on="listenersAttrs"
      @select="selectOperation"
      @blur="blur"
    >
      <slot />
    </search-input>
    <div class="input-list">
      <el-tag
        v-for="item in selectList"
        :key="item[valueKey] ? item[valueKey] : item"
        closable
        type="info"
        size="small"
        @close="itemClose(item)"
      >
        {{ item[labelKay] ? item[labelKay] : item }}
      </el-tag>
    </div>
  </div>
</template>

<script>
import SearchInput from '@/components/SearchInput/index'

export default {
  name: 'MultipleInput',
  components: {
    SearchInput
  },
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    labelKay: {
      type: String,
      default: 'label'
    },
    requestOptionsCallback: {
      type: Function,
      required: true
    },
    responseCallback: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      inputValue: '',
      selectList: []
    }
  },
  computed: {
    modelValue() {
      return this[this.searchName]
    },
    searchInputOptions() {
      return this.requestOptionsCallback(this.inputValue)
    },
    listenersAttrs() {
      // eslint-disable-next-line no-unused-vars
      const { input, select, change, ...attrs } = this.$listeners
      return attrs
    }
  },
  watch: {
    value: {
      handler(newVal) {
        this.selectList = newVal || []
      },
      immediate: true
    },
    selectList(newVal) {
      this.$emit('input', newVal)
    }
  },
  methods: {
    selectOperation(info) {
      const { selectList, valueKey } = this
      const isMatch = selectList.some(item => {
        return info[valueKey] ? item[valueKey] === info[valueKey] : item === info
      })
      if (!isMatch) {
        selectList.push(info)
      }
      this.inputValue = ''
      this.$emit('change', info, selectList)
    },
    itemClose(info) {
      const { selectList, valueKey } = this
      const findIndex = selectList.findIndex(item => {
        return info[valueKey] ? item[valueKey] === info[valueKey] : item === info
      })
      selectList.splice(findIndex, 1)

      this.$emit('change', info, selectList)
      this.$emit('itemRemove', info, selectList)
    },
    blur() {
      window.setTimeout(() => {
        this.inputValue = ''
      }, 200)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.multiple-input {
  .el-autocomplete {
    width: 100%;
  }
  .input-list {
    margin-top: 5px;
    ::v-deep .el-tag {
      margin-bottom: 5px;
      margin-right: 5px;
      .el-tag__close {
        background-color: $colorTextPlaceholder;
        top: 0;
        flex-shrink: 0;
        color: #fff;
        &:hover {
          background-color: $backgroundColorlighter;
          color: #fff;

        }
      }
    }
  }
}
</style>

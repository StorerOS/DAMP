<template>
  <div class="tag_box">
    <el-tag v-for="(item,index) in tagList" :key="item" size="small" effect="dark" closable @close="handleDeleteTag(index)">{{ item }}</el-tag>
    <el-input v-model="tag" placeholder="输入标签，回车以添加" size="small" @keyup.enter.native="handleAddTag()" />
  </div>
</template>

<script>
export default {
  name: 'TagInput',
  model: {
    prop: 'tagList',
    event: 'tagChange'
  },
  props: {
    tagList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      tag: '',
      list: ''
    }
  },
  created() {
  },
  methods: {
    handleAddTag() {
      if (this.tag) {
        this.tagList.push(this.tag)
        this.tag = ''
        // this.$meit('tagChange', this.tagList)
      }
    },
    handleDeleteTag(idx) {
      this.tagList.splice(idx, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
    .tag_box{
        border: 1px solid #DCDFE6;
        padding:5px;
    }
    .el-tag{
        margin:3px 3px;
    }
    .el-input{
        width:200px;
    }
    ::v-deep .el-input__inner{
        border:0;
    }
</style>

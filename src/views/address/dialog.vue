
<template>
  <div>
    <el-dialog
      :title="titleType+'地址'"
      :visible.sync="visible"
      :close-on-click-modal="false"
      width="40%"
      @close="handleCloseForm"
    >
      <el-form ref="ruleForm" :model="formData" :rules="dialogRules" label-width="120px">
        <el-form-item prop="address" label="地址：">
          <el-input v-model="formData.address" :disabled="type === 'edit'" placeholder="请输入您要收藏的地址" />
        </el-form-item>
        <el-form-item prop="tag_name" label="标签：">
          <el-input v-model="formData.tag_name" placeholder="请输入自定义标签" />
        </el-form-item>
        <el-form-item prop="remark" label="备注：">
          <el-input v-model="formData.remark" type="textarea" show-word-limit maxlength="200" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleCloseForm">取消</el-button>
        <el-button type="primary" @click="handleSubmitForm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addAddress, editAddress } from '@/api/address'
import _ from 'lodash'
export default {
  name: 'AddDialog',
  props: {
    type: {
      type: String,
      default: 'add'
    },
    info: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      formData: {
        address: '',
        tag_name: '',
        remark: ''
      },
      visible: false,
      dialogRules: {
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    titleType: function() {
      return this.type === 'add' ? '新增' : '修改'
    }
  },
  watch: {
    info: function(val) {
      this.formData = _.cloneDeep(val)
    }
  },
  methods: {
    handleCloseForm() {
      this.visible = false
      this.$refs.ruleForm.resetFields()
    },
    handleSubmitForm() {
      const { titleType } = this
      const func = this.type === 'add' ? addAddress : editAddress
      this.$refs.ruleForm.validate().then(() => {
        func({ chain_type: 'FIL', ...this.formData }).then(res => {
          this.$refs.ruleForm.resetFields()
          this.$message.success(`${titleType}成功`)
          this.visible = false
          this.$emit('success')
        })
      })
    }
  }
}
</script>

<style>
</style>

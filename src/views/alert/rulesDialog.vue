
<template>
  <div>
    <el-dialog
      title="修改规则"
      :visible.sync="visible"
      :close-on-click-modal="false"
      width="40%"
      @close="handleCloseForm"
    >

      <el-form ref="ruleForm" :model="form" :rules="dialogRules" label-width="120px">
        <el-form-item label="预警账户" prop="address" size="normal">
          <el-select v-model="form.address" :disabled="type==='edit'">
            <el-option
              v-for="(item,idx) in observeList"
              :key="idx"
              :label="item.address"
              :value="item.address"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属代币" prop="project" size="normal">
          <el-select v-model="form.project" :disabled="type==='edit'">
            <el-option
              v-for="(item,idx) in projectList"
              :key="idx"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="type==='add'" label="类型" prop="id" size="normal">
          <el-select v-model="form.id" :disabled="type==='edit'" @change="handleChangeRule">
            <el-option
              v-for="(item,idx) in predefRuleList"
              :key="idx"
              :label="item.rule_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="type === 'add'" label="   " prop="amount" size="normal">
          <el-input v-if="rule && rule.have_amount" v-model.number="form.amount" placeholder="请填写预警值" />
        </el-form-item>
        <el-form-item v-if="type === 'edit'" label="   " size="normal">
          <el-input v-if="form.have_amount" v-model.number="form.amount" placeholder="请填写预警值" />
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="handleCloseForm">取消</el-button>
        <el-button type="primary" @click="handleSubmitForm">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { getChainList, getPredefRuleList, addAlertRule, editAlertRule } from '@/api/chain'
import { observeList } from '@/api/common'
import _ from 'lodash'
export default {
  name: 'RulesDialog',
  props: {
    type: {
      type: String,
      default: 'add'
    },
    data: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },

  data() {
    return {
      projectList: [],
      observeList: [],
      predefRuleList: [],
      rule: null,
      form: {
        id: '',
        rule: '',
        project: 'FIL',
        address: '',
        amount: 0
      },
      visible: false,
      dialogRules: {
        address: [{
          required: true, message: '预警账户不能为空', trigger: 'blur'
        }],
        project: [{
          required: true, message: '代币不能为空', trigger: 'blur'
        }],
        id: [{
          required: true, message: '类型不能为空', trigger: 'blur'
        }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'chainType'
    ])
  },
  watch: {
    data(val) {
      const { type } = this
      if (type === 'edit') {
        this.form = _.cloneDeep(val)
        // this.handleChangeRule(this.data.id)
      }
    }
  },
  mounted() {
    const { chainType } = this
    const params = { chain_type: chainType }
    getChainList(params).then(res => {
      this.projectList = res.data.list
      this.project = res.data.list[0]
    })
    observeList(params).then(res => {
      this.observeList = res.data.list
    })
    getPredefRuleList().then(res => {
      this.predefRuleList = res.data.list
    })
  },
  methods: {
    handleChangeRule(id) {
      this.rule = this.predefRuleList.find(item => item.id === id)
    },
    handleCloseForm() {
      this.$refs.ruleForm.resetFields()
      this.visible = false
    },
    handleSubmitForm() {
      const { form, chainType, type } = this
      const { amount, id } = this.form
      switch (type) {
        case 'add':
          this.$refs.ruleForm.validate().then((valid) => {
            if (valid) {
              addAlertRule({ chain_type: chainType, ...form }).then(res => {
                this.$message.success('添加成功！')
                this.handleCloseForm()
                this.$emit('success')
              })
            }
          })
          break
        case 'edit':
          editAlertRule({ amount, id }).then(res => {
            this.$message.success('修改成功！')
            this.handleCloseForm()
            this.$emit('success')
          })
      }
    }

  }
}
</script>

<style scoped lang="scss">

.el-select,.el-input{
    width: 90%!important;
    margin-bottom: 10px;
}
.add_btn{
    border:1px solid #c0c0c0;
    height: 30px;
    width:80px;
    line-height: 30px;
    text-align: center;
    border-radius: 4px;
}
.del{
    border:1px solid #e72b2b;
    color: #e72b2b;
}
.content{
    display: flex;
}
</style>

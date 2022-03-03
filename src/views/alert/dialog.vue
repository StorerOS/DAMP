
<template>
  <div>
    <el-dialog
      title="修改规则"
      :visible.sync="visible"
      :close-on-click-modal="false"
      width="40%"
      @close="handleCloseForm"
    >

      <el-form ref="ruleForm" :rules="dialogRules" label-width="120px">
        <div v-for="(rlues,idx) in rules_list" :key="idx">
          <el-form-item prop="address" label="类型：">
            <div class="content">
              <div>
                <el-select v-model="rules_list[idx].rule_id">
                  <el-option
                    v-for="item in ruleTypeList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  />
                </el-select>
                <el-input v-model.number="rlues.amount" placeholder="请填写预警值" />
              </div>
              <div v-if="idx == 0" class="add_btn" @click="handleaddRules">新增规则</div>
              <div v-else class="add_btn del" @click="handledelRules(idx)">删除规则</div>
            </div>
          </el-form-item>
        </div>
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

import { addAlertRule, getAlertRuleList } from '@/api/chain'
import _ from 'lodash'
const initRules = {
  rule_type: '',
  rule_id: '',
  amount: '',
  operator: ''
}
export default {
  name: 'RulesDialog',
  props: {
    project: {
      type: String,
      default: 'FIL'
    }
  },

  data() {
    return {
      test: '',
      id: 0,
      rules_list: [
        {
          rule_type: '',
          amount: '',
          rule_id: '',
          operator: ''
        }
      ],
      ruleTypeList: [
        { id: 1, label: '余额高于XX通知', rule_type: 'balance', operator: '>=' },
        { id: 2, label: '余额低于XX通知', rule_type: 'balance', operator: '<=' },
        { id: 3, label: '大额转账', rule_type: 'send', operator: '>=' }
      ],
      visible: false,
      dialogRules: {

      }
    }
  },
  computed: {
    ...mapGetters([
      'chainType'
    ])
  },
  watch: {
    visible: function(val) {
      const { chainType, project, ruleTypeList } = this
      if (val) {
        getAlertRuleList({
          chain_type: chainType,
          project
        }).then(res => {
          const ruleList = res.data.rule_list
          if (ruleList.length === 0) {
            this.rules_list = [_.cloneDeep(initRules)]
            return
          }
          this.id = res.data.id
          this.rules_list = ruleList.map(rule => {
            const type = ruleTypeList.find(ruleType => rule.rule_type + rule.operator === ruleType.rule_type + ruleType.operator)
            if (type) {
              rule.rule_id = type.id
            }
            return rule
          })
        })
      }
    }
  },
  methods: {
    handleCloseForm() {
      this.visible = false
      this.$refs.ruleForm.resetFields()
    },
    handleaddRules() {
      if (this.rules_list.length > 2) {
        return
      }
      this.rules_list.push(_.cloneDeep(initRules))
    },
    handledelRules(idx) {
      this.rules_list.splice(idx, 1)
    },
    handleSubmitForm() {
      const { rules_list, chainType, project, ruleTypeList, id } = this
      const endRulesList = rules_list.map(rules => {
        const rulesType = ruleTypeList.find(item => item.id === rules.rule_id)
        if (rulesType) {
          rules.rule_type = rulesType.rule_type
          rules.operator = rulesType.operator
        }
        return rules
      })
      const params = {
        project,
        id,
        chain_type: chainType,
        rule_list: endRulesList
      }

      addAlertRule(params).then(res => {
        // this.$refs.ruleForm.resetFields()
        this.$message.success(`成功`)
        this.visible = false
        this.$emit('success')
      })
    //   const func = this.type === 'add' ? addAddress : addAddress
    //   this.$refs.ruleForm.validate().then(() => {
    //     addAlertRule(params).then(res => {
    //       this.$refs.ruleForm.resetFields()
    //       this.$message.success(`成功`)
    //       this.visible = false
    //       this.$emit('success')
    //     })
    //   })
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

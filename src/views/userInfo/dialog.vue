
<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      :close-on-click-modal="false"
      width="40%"
      @close="handleCloseForm"
    >
      <el-form v-if="type == 'password'" ref="passwordFormData" :rules="rules" :model="passwordFormData" label-width="120px">
        <el-form-item label="旧密码：" prop="old_password">
          <div class="content">
            <el-input v-model="passwordFormData.old_password" show-password placeholder="" />
          </div>
        </el-form-item>
        <el-form-item label="新密码：" prop="new_password">
          <div class="content">
            <el-input v-model="passwordFormData.new_password" show-password placeholder="" />
          </div>
        </el-form-item>
        <el-form-item label="确认密码：" prop="repectPassword">
          <div class="content">
            <el-input v-model="passwordFormData.repectPassword" show-password placeholder="" />
          </div>
        </el-form-item>
      </el-form>
      <el-form v-if="type == 'email'" ref="emailFormData" :rules="rules" :model="emailFormData" label-width="120px">
        <el-form-item label="旧邮箱：">
          <div class="content">
            <el-input v-model="info.email" disabled />
          </div>
        </el-form-item>
        <el-form-item label="验证码：" prop="old_code">
          <div class="content">
            <el-input v-model="emailFormData.old_code" placeholder="" />
            <get-code class="show-pwd col_blue" :data="info.email" />
          </div>
        </el-form-item>
        <el-form-item label="新邮箱：" prop="new_email">
          <div class="content">
            <el-input v-model="emailFormData.new_email" placeholder="" />
          </div>
        </el-form-item>
        <el-form-item label="验证码：" prop="new_code">
          <div class="content">
            <el-input v-model="emailFormData.new_code" placeholder="" />
            <get-code class="show-pwd col_blue" :data="emailFormData.new_email" />
          </div>
        </el-form-item>
      </el-form>
      <el-form v-if="type == 'phone'" ref="phoneFormData" :rules="rules" :model="phoneFormData" label-width="120px">
        <el-form-item label="手机号：" prop="phone_number">
          <div class="content">
            <el-input v-model="phoneFormData.phone_number" placeholder="" />
          </div>
        </el-form-item>
        <el-form-item label="验证码：" prop="code">
          <div class="content">
            <el-input v-model="phoneFormData.code" placeholder="" />
            <get-code class="show-pwd col_blue" :data="phoneFormData.phone_number" type="phone" />
          </div>
        </el-form-item>
      </el-form>
      <el-form v-if="type == 'did'" ref="didFormData" :rules="rules" :model="didFormData" label-width="120px">
        <el-form-item label="邮箱：">
          <div class="content">
            <el-input v-model="info.email" disabled />
          </div>
        </el-form-item>
        <el-form-item label="验证码：" prop="code">
          <div class="content">
            <el-input v-model="didFormData.code" placeholder="" />
            <get-code class="show-pwd col_blue" :data="info.email" />
          </div>
        </el-form-item>
        <el-form-item label="DID：" prop="user_did">
          <div class="content">
            <el-input v-model="didFormData.user_did" placeholder="" />
          </div>
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
import { changePassword, changeEmail, changePhone, changeDid } from '@/api/user'
import { mapGetters } from 'vuex'
import getCode from './code.vue'
import md5 from 'js-md5'
import rules from './rules'

export default {
  name: 'EditUserInfoDialog',
  components: {
    getCode
  },
  props: {
    type: {
      type: String,
      default: 'email'
    }
  },
  data() {
    return {
      visible: false,
      countdown: 0,
      passwordFormData: {
        repectPassword: '',
        old_password: '',
        new_password: ''
      },
      didFormData: {
        code: '',
        user_did: ''
      },
      emailFormData: {
        old_code: '',
        new_email: '',
        new_code: ''
      },
      phoneFormData: {
        phone_number: '',
        code: ''
      },
      rules
    }
  },
  computed: {
    ...mapGetters([
      'info'
    ]),
    title() {
      const { type } = this
      let content = ''
      switch (type) {
        case 'email':
          content = '修改邮箱'
          break
        case 'did':
          content = '修改DID'
          break
        case 'phone':
          content = '修改手机号'
          break
        case 'password':
          content = '修改密码'
          break
      }
      return content
    }
  },
  methods: {
    handleCloseForm() {
      this.visible = false
    },
    handleSubmitForm() {
      switch (this.type) {
        case 'email':
          this.handleChangeOtherInfo('emailFormData', changeEmail)
          break
        case 'did':
          this.handleChangeOtherInfo('didFormData', changeDid)
          break
        case 'phone':
          this.handleChangeOtherInfo('phoneFormData', changePhone)
          break
        case 'password':
          this.handleChangePassword()
          break
      }
    },
    handleChangeOtherInfo(formData, func) {
      this.$refs[formData].validate(valid => {
        if (valid) {
          func(this[formData]).then(res => {
            this.$message.success('修改成功')
            this.$emit('success')
            this.handleCloseForm()
          })
        }
      })
    },
    handleChangePassword() {
      const { new_password, old_password, repectPassword } = this.formData
      if (new_password !== repectPassword) {
        this.$message.error('两次密码输入不一致')
        return
      }
      const params = {
        new_password: md5(new_password),
        old_password: md5(old_password)
      }
      changePassword(params).then(async(res) => {
        this.$message.success('更改密码成功!')
        await this.$store.dispatch('user/logout')
        // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        this.$router.push('/login')
      })
    }

  }

}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.show-pwd {
    position: absolute;
    right: 10px;
    top: 8px;
    font-size: 16px;
    color: $colorTextSecondary;
    cursor: pointer;
    user-select: none;
  }
.col_blue{
    color: $colorPrimary;
    cursor: pointer;
  }
.content{
  position: relative;
  .flex_box{
    position:absolute;
    right: 20px;
    top: 10px;
    font-size: 20px;
    .svg-icon{
      margin-left: 20px;
    }
  }
}

</style>

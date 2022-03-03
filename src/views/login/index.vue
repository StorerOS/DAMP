<template>
  <div class="login-container">
    <div v-if="formType == 'login'" class="login-container__body">
      <span class="login-container__switch" @click="isAccountLogin = !isAccountLogin">
        <el-link :underline="false">{{ loginMethodsText }}</el-link>
      </span>
      <div class="login-container__head">
        <h4 class="login-container__title">{{ Setting.title }}</h4>
      </div>
      <div class="login-container__methods">
        <div v-show="isAccountLogin" class="methods__item">
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
            <el-form-item prop="email">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                ref="email"
                v-model="loginForm.email"
                placeholder="请输入邮箱"
                name="email"
                type="text"
                tabindex="1"
                auto-complete="on"
              />
            </el-form-item>
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="请输入登录密码"
                name="password"
                tabindex="2"
                auto-complete="on"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
            <div class="col_blue forget" @click="switchFormType('forget')">忘记密码</div>
            <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
            <div class="col_blue" @click="switchFormType('register')">注册新账号</div>
          </el-form>
        </div>
        <div v-show="!isAccountLogin" class="methods__item">
          <div v-if="isConnect" class="login-container__logged">
            <div class="login-container__logged__title">账号已登录</div>
            <el-link class="login-container__logged__btn" type="primary" :underline="false" @click="againQRCodeLogin">重新扫码登录</el-link>
          </div>
          <div v-else class="login-container__qrcode">
            <div ref="QRCode" />
            <div class="login-container__qrcode__title">打开数据App扫码登录</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="login-container__body">
      <div class="login-container__head">
        <h4 class="login-container__title">{{ formType == 'register' ? '注册新账号':'忘记密码' }}</h4>
      </div>
      <div class="login-container__methods">
        <div class="methods__item">
          <el-form ref="otherForm" :model="otherForm" :rules="otherRules" class="login-form" auto-complete="on" label-position="left">
            <el-form-item prop="email">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                ref="email"
                v-model="otherForm.email"
                placeholder="请输入邮箱号码"
                name="email"
                type="text"
                tabindex="1"
                auto-complete="on"
              />
            </el-form-item>
            <el-form-item prop="code">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                ref="code"
                v-model="otherForm.code"
                placeholder="请输入验证码"
                name="code"
                type="text"
                tabindex="1"
                auto-complete="on"
              />
              <span class="show-pwd col_blue" @click="getCode">
                {{ countdown == 0?'获取验证码':countdown+'s' }}
              </span>
              <!-- <get-code class="show-pwd col_blue" :data="emailFormData.new_email" /> -->
            </el-form-item>
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="otherForm.password"
                :type="passwordType"
                placeholder="密码"
                name="password"
                tabindex="2"
                auto-complete="on"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password_2"
                v-model="otherForm.password_2"
                :type="passwordType"
                placeholder="请确定密码"
                name="password_2"
                tabindex="2"
                auto-complete="on"
                @keyup.enter.native="handleRegisterOrForget"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
            <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleRegisterOrForget">登录</el-button>
            <div v-if="formType == 'register'" class="col_blue" @click="switchFormType('login')">已有账号,去登陆</div>
            <div v-else class="col_blue" @click="switchFormType('login')">去登陆</div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import md5 from 'js-md5'
import WalletConnect from '@walletconnect/client'
import { mapActions } from 'vuex'
import Setting from '@/settings'
import { sendEmailCode, forgetAcount, registerAccount } from '@/api/user'
let connector = null
let countdownInterval = null
export default {
  name: 'Login',
  data() {
    return {
      formType: 'login',
      countdown: 0,
      loginForm: {
        email: '',
        password: ''
      },
      otherForm: {
        email: '',
        code: '',
        password: ''
      },
      otherRules: {
        email: [{ required: true, message: '请输入正确的邮箱格式', type: 'email', trigger: 'blur' }],
        code: [{ required: true, trigger: 'blur', message: '验证码不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }]
      },
      loginRules: {
        email: [{ required: true, message: '请输入正确的邮箱格式', type: 'email', trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      isAccountLogin: true,
      isConnect: false,
      Setting
    }
  },
  computed: {
    loginMethodsText() {
      return this.isAccountLogin ? '使用扫码登录' : '使用账号登录'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.createWalletConnect()
  },
  methods: {
    ...mapActions({
      resetToken: 'user/resetToken'
    }),
    switchFormType(type = 'login') {
      this.formType = type
    },
    showPwd() {
      this.passwordType = this.passwordType === 'password' ? '' : 'password'
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    getCode() {
      const { countdown } = this
      const { email } = this.otherForm
      if (countdown === 0) {
        sendEmailCode({ email }).then(res => {
          this.countdown = 60
          countdownInterval = setInterval(() => {
            if (this.countdown <= 0) {
              this.countdown = 0
              clearInterval(countdownInterval)
              return
            }
            this.countdown -= 1
          }, 1000)
        })
      }
    },
    handleRegisterOrForget() {
      const { password, password_2 } = this.otherForm
      const { formType, otherForm } = this
      const getDataMethods = formType === 'register' ? registerAccount : forgetAcount
      debugger
      if (password !== password_2) {
        this.$message.error('两次密码输入不一致！')
      }
      this.$refs.otherForm.validate(valid => {
        if (valid) {
          this.loading = true
          const params = {
            ...otherForm,
            password: md5(password)
          }
          getDataMethods(params).then(res => {
            this.$message.success(formType === 'register' ? '创建成功' : '修改密码成功')
            this.formType = 'login'
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const queryParams = {
            ...this.loginForm,
            password: md5(this.loginForm.password)
          }
          this.$store.dispatch('user/login', queryParams).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.error('error submit!!')
          return false
        }
      })
    },
    againQRCodeLogin() {
      this.resetToken()
      this.createWalletConnect()
    },
    async createWalletConnect() {
      connector = new WalletConnect({
        bridge: 'https://bridge.walletconnect.org'
      })
      this.isConnect = connector.connected
      if (!this.isConnect) {
        // create new session
        await connector.createSession()
        // get uri for QR Code modal
        const uri = connector.uri
        this.generateQRCode(uri)
      }
      connector.on('connect', (error, payload) => {
        this.isConnect = connector.connected
        if (error) {
          throw error
        }
      })
      connector.on('call_request', (error, payload) => {
        if (error) {
          throw error
        }
        const { result } = payload
        const parseResult = JSON.parse(result) || null
        if (parseResult) {
          const queryParams = {
            user_did: parseResult.userDID,
            public_key: parseResult.publicKey
          }
          this.handlerQrcodeLogin(queryParams)
        }
      })
      connector.on('disconnect', (error, payload) => {
        this.isConnect = connector.connected
        if (error) {
          throw error
        }
        this.$message.closeAll()
        this.$message.error('会话已断开连接')
        window.setTimeout(() => { // 延迟执行，防止当前事件连续调用多次
          this.createWalletConnect()
        }, 0)
      })
    },
    handlerQrcodeLogin(queryParams) {
      this.$store.dispatch('user/qrcodeLogin', queryParams).then(() => {
        this.$message.success('登录成功')
        this.$router.push({ path: this.redirect || '/' })
        this.loading = false
      }).catch(() => {
        this.$message.error('登录失败')
        window.localStorage.clear()
        this.createWalletConnect()
        this.loading = false
      })
    },
    generateQRCode(uri) {
      const QRCodeContainer = this.$refs.QRCode
      if (!QRCodeContainer) return

      QRCodeContainer.innerHTML = ''
      new QRCode(QRCodeContainer, {
        text: uri,
        colorDark: '#000000',
        colorLight: '#ffffff'
      })
    }
  }
}
</script>

<style lang="scss">
@import "~@/styles/variables.scss";
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

@supports (-webkit-mask: none) and (not (cater-color: $colorTextRegular)) {
  .login-container .el-input input {
    color: $colorTextRegular;
  }
}

.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-image: linear-gradient(180deg, $colorPrimary 50%, #ffffff 50%);
  &__body {
    height: 540px;
    padding: 30px 18px 0;
    display: inline-block;
    background-color: #ffffff;
    box-shadow: 0px 0px 10px rgb(153, 153, 153, .35);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    text-align: center;
    position: relative;
  }
  &__logo {
    width: 74px;
    margin: 40px auto 0;
  }
  &__title {
    font-size: 26px;
    color: $colorPrimary;
    margin: 40px 0px;
    font-weight: 700;
  }
  &__switch {
    position: absolute;
    right: 18px;
    color: $colorTextPrimary;
    cursor: pointer;
  }
  &__methods {
    width: 380px;
    min-height: 230px;
    padding: 0px 40px;
    box-sizing: border-box;
  }
  &__footer {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 10vh;
    font-size: $fontSizeExtraSmall;
    text-align: center;
    color: $colorTextSecondary;
  }
  &__qrcode {
    display: inline-block;
    position: relative;
    top: -15px;
    &__title {
      color: $colorTextSecondary;
      margin-top: 10px;
    }
  }
  &__logged {
    &__title {
      font-size: $fontSizeLarge;
      margin-bottom: 20px;
    }
  }
  .login-form {
    position: relative;
    margin: 0 auto;
    overflow: hidden;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $colorTextSecondary;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $colorTextSecondary;
    cursor: pointer;
    user-select: none;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $colorTextRegular;
      height: 47px;
      caret-color: $colorTextRegular;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #ffffff inset !important;
        -webkit-text-fill-color: $colorTextRegular !important;
      }
    }
  }
  /* reset element-ui css */
  .el-form-item {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    color: $colorTextRegular;
  }
  .col_blue{
    color: $colorPrimary;
    cursor: pointer;
  }
  .forget{
    float:right;
    margin:0 0 20px 0;
  }
  .copyright {
    margin-right: 10px;
  }
}
</style>

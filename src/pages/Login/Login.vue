<template>
  <div class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <div class="login_header_title">
          <a href="javascript:;"
             :class="{on: loginWay}"
             @click="loginWay=true"
          >短信登录</a>
          <a href="javascript:;"
             :class="{on: !loginWay}"
             @click="loginWay=false"
          >密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form>
          <div :class="{on: loginWay}">
            <section class="login_message">
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
              <button
                :disabled="computeTime>0"
                class="get_verification"
                :class="{right_phone: isRightPhone  && (computeTime === 0)}"
                @click.prevent="sendCode"
              >{{computeTime ? `已发送(${computeTime})s` : '获取验证码'}}
              </button>
            </section>
            <section class="login_verification">
              <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
            </section>
            <section class="login_hint">
              温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div :class="{on: !loginWay}">
            <section>
              <section class="login_message">
                <input type="tel" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
              </section>
              <section class="login_verification">
                <input :type="isShowPwd ? 'text' : 'password'" maxlength="8" placeholder="密码" v-model="pwd">
                <div
                  class="switch_button"
                  :class="isShowPwd? 'on':'off'"
                  @click="isShowPwd = !isShowPwd"
                >
                  <div class="switch_circle" :class="{right: isShowPwd}"></div>
                  <span class="switch_text">{{isShowPwd ? 'abc' : ''}}</span>
                </div>
              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                <img
                  ref="captcha"
                  class="get_verification"
                  src="http://localhost:4000/captcha" alt="captcha"
                  @click="updateCaptcha">
              </section>
            </section>
          </div>
          <button class="login_submit" @click.prevent="login">登录</button>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <span href="javascript:" class="go_back" @click="$router.back()">
        <i class="iconfont icon-jiantou2"></i>
      </span>
    </div>
  </div>
</template>

<script>
  /*在login组件中发送ajax请求后台获取图形验证码*/
  import {reqSendCode, reqLoginPwd, reqLoginSms} from '../../api'
  import {Toast, MessageBox} from 'mint-ui'
  export default {
    data() {
      return {
        loginWay: false,  // 默认true，true表示短信登录，false代表密码登录
        phone: '',  // 输入框手机号（11位的1开头数字字符串为正确值，定义正则判断）
        code: '',  // 短信验证码
        computeTime: 0,  // 倒计时时间
        name: '', // 用户名
        pwd: '', // 用户密码
        captcha: '', // 图形验证码
        isShowPwd: false,  // 默认false，false表示隐藏密码，true表示显示密码
      }
    },
    computed: {
      isRightPhone() {
        return /^[1][3,4,5,7,8]\d{9}$/.test(this.phone)  // 定义正则，返回测试的布尔值
      }
    },
    methods: {
      // 弹出提示框函数
      showAlert (msg) {
        MessageBox(msg, '提示')
      },

      // 登陆请求
      async login () {
        // 取出2种登陆方式所需的数据
        const {phone, code, name, pwd, captcha} = this
      //  定义result变量，用来保存两种登陆的结果
        let result
        // 1. 前台表单验证
        if (this.loginWay) {  // 短信登陆
          if (!this.isRightPhone) {
            this.showAlert('请输入正确的手机号')
            return
          } else if (!/^\d{6}$/.test(code)) {   // 定义验证码正则，6位数
            this.showAlert('请输入正确的验证码')
            return
          }
        //  2. 发送登陆请求
          result = await reqLoginSms(phone, code)
        } else {  //密码登陆
          if (!name) {
            this.showAlert('请输入用户名')
            return
          }else if (!pwd) {
            this.showAlert('请输入密码')
            return
          }else if (!captcha) {
            this.showAlert('请输入验证码')
            return
          }
        // 2. 发送登陆请求
          result = await reqLoginPwd({name, pwd, captcha})
        }
      //  3. 根据结果不同做出不同的响应
        if (result.code === 0) {  // 成功
          const user = result.data;   // 取出用户，稍后保存到state
          this.$store.dispatch('saveUser', user);
        //  成功之后，跳转路由，到个人中心 /profile
          this.$router.replace('/profile')
        } else {  // 失败
        //  弹出提示
          this.showAlert(result.msg)
        //  清除定时器
          this.computeTime = 0
        //  更新图形验证码(如果是密码登陆)
          !this.loginWay && this.updateCaptcha()
        }
      },

      async sendCode() {
        if (!this.isRightPhone) {
          alert('手机号码错误，请输入手机号')
          return
        }
        // 1. 倒计时功能
        // 点击发送之后，切换成已发送，并且不能点击，30s之后才能再次操作
        // disabled属性动态修改
        //  阻止默认发送的行为 @click.prevent
        this.computeTime = 30;
        // 移除类名right_phone
        this.$refs.captcha && (this.$refs.captcha.className = 'get_verification')
        // 循环定时器
        const intervalId = setInterval(() => {
          this.computeTime--
          if (this.computeTime <= 0) {
            // 清除定时器
            clearInterval(intervalId)
            // 初始化操作
            this.computeTime = 0
            this.$refs.captcha && (this.$refs.captcha.className += ' right_phone')
          }
        }, 1000)

        //  2. 发送ajax请求
        const result = await reqSendCode(this.phone)
        if (result.code === 0) {
          Toast({
            message: '发送成功',
          });
        } else {
          MessageBox.alert(result.msg, '提示')
        //  停止计时
          this.computeTime = 0  //前提是定时器的判断<=0，进入自动停止
        }
      },
      // 获取更新的图形验证码
      updateCaptcha () {
        // event.target.src = 'http://localhost:4000/captcha'  // 如果这个指定的src与原src相同，则不会再次发送请求
        // event.target.src = 'http://localhost:4000/captcha?time=' + Date.now()
        this.$refs.captcha.src = 'http://localhost:4000/captcha?time=' + Date.now()
      }
    }

  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          > a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        > form
          > div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.right_phone
                  color: #000
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s, border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #02a774
                > .switch_circle
                  //transform translateX(27px)
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0, 0, 0, .1)
                  transition transform .3s
                  &.right
                    transform translateX(26px)
            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              > a
                color #02a774
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        > .iconfont
          font-size 20px
          color #999
</style>

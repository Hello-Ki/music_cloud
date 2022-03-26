<template>
  <div class="home_container">
    <header class="home_header">
      <div class="header_fr">
        <a href="/#"></a>
      </div>
      <el-menu v-model="activePath" :default-active="activePath" class="el-menu-demo" router mode="horizontal" background-color="#242424" text-color="#ffffff" active-text-color="#ffffff">
        <el-menu-item :index="item.path" v-for="item in homeData" :key="item.index">
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </el-menu>
      <div class="hot"></div>
      <div class="header_right">
        <el-input :placeholder="headerFocus ? '' : '音乐/视频/电台/用户'" class="right_input" prefix-icon="el-icon-search" v-model="headerInput" @focus="headerFocus = true" @blur="headerFocus = false"></el-input>
        <el-button class="right_btn" round>创作者中心</el-button>
        <el-button class="login_btn" type="text" @click="login">登录</el-button>
        <el-dialog :visible.sync="dialogVisible">
          <div class="dialog_title" slot="title">{{ title }}</div>
          <div v-if="loginType == 1" class="login1">
            <div class="dialog_body">
              <div class="body_left">
                <img class="l_img" src="../assets/imgs/qr_guide.png" />
              </div>
              <div class="body_right">
                <div class="title">扫码登录</div>
                <qrcode-vue class="alt" :value="loginMessage.qrurl" size="120"></qrcode-vue>
                <div class="text">
                  使用
                  <a class="download" @click="router.push({ name: 'download' })">网易云音乐APP</a>
                  扫码登录
                </div>
              </div>
            </div>
            <div class="dialog_btn">
              <el-button round @click="loginType = 2">选择其它登录模式</el-button>
            </div>
          </div>
          <div v-else-if="loginType == 2" class="login2">
            <div class="dialog_body">
              <div class="body_left">
                <img class="l_img" src="../assets/imgs/platform.png" />
                <div class="btn1" @click="changeLogin(2, 3)">
                  <a href="javascript:;">
                    <span>手机号登录</span>
                  </a>
                </div>
                <div class="btn2" @click="changeLogin(2, 4)">
                  <a href="javascript:;">
                    <span>注册</span>
                  </a>
                </div>
              </div>
              <ul class="body_right">
                <li>
                  <a href="javascript:;">
                    <label for="span1" id="label1"></label>
                    <span id="span1">微信登录</span>
                  </a>
                </li>
                <li>
                  <a href="javascript:;">
                    <label for="span2" id="label2"></label>
                    <span id="span2">QQ登录</span>
                  </a>
                </li>
                <li>
                  <a href="javascript:;">
                    <label for="span3" id="label3"></label>
                    <span id="span3">微博登录</span>
                  </a>
                </li>
                <li>
                  <a href="javascript:;">
                    <label for="span4" id="label4"></label>
                    <span id="span4">网易云邮箱账号登录</span>
                  </a>
                </li>
              </ul>
              <div class="body_check">
                <input type="checkbox" id="check_message" v-model="loginInfo2.checked" />
                <label for="check_message" class="label_check">同意</label>
                <a href="javascript:;">《服务条款》</a>
                <a href="javascript:;">《隐私政策》</a>
                <a href="javascript:;">《儿童隐私条款》</a>
              </div>
            </div>
            <div class="dialog_btn">
              <qrcode-vue :value="loginMessage.qrurl" size="52"> </qrcode-vue>
            </div>
            <div class="mask" @click="changeLogin(2, 1)"></div>
          </div>
          <div v-else-if="loginType == 3" class="login3">
            <div class="dialog_body">
              <el-form :model="login3Form" :rules="login3FormRules" ref="login3FormRef">
                <el-form-item prop="phone">
                  <el-input v-model="login3Form.phone" placeholder="请输入手机号" class="input-with-select">
                    <el-select v-model="login3Form.countryCode" slot="prepend" placeholder="+86" size="small" :style="select3Width">
                      <el-option v-for="item in countryInfo" :key="item.index" :label="'+' + item.code" :value="item.code" style="width: 222px">
                        <span style="float: left">{{ item.zh }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">+{{ item.code }}</span>
                      </el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
                <el-form-item v-if="loginInfo3.verifyType === 1">
                  <el-input placeholder="请输入密码" v-model="login3Form.password">
                    <template slot="suffix">
                      <a href="javascript:;" @click="changeLogin(3, 5)">忘记密码?</a>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item v-else>
                  <el-input placeholder="请输入验证码" class="type2" v-model="login3Form.textCode">
                    <template slot="append">
                      <span>获取验证码</span>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <a href="javascript:;" @click="changeVerifyType">{{ loginInfo3.loginType[loginInfo3.verifyType] }}</a>
                  <div class="right">
                    <input type="checkbox" v-model="loginInfo3.autoCheck" id="checkbox3" />
                    <label for="checkbox3" id="label3">自动登录</label>
                  </div>
                </el-form-item>
                <el-form-item class="item5">
                  <div class="login3_btn" @click="loginValid('login3FormRef')">
                    <span>登录</span>
                  </div>
                </el-form-item>
              </el-form>
            </div>
            <div class="dialog_btn">
              <a href="javascript:;" @click="changeLogin(3, 2)">&lt;&nbsp;&nbsp;其它登录方式</a>
              <a class="a1" href="javascript:;" @click="changeLogin(3, 4)">没有账号?&nbsp;&nbsp;免费注册&nbsp;&nbsp;&gt;</a>
            </div>
          </div>
          <div v-else-if="loginType == 4" class="login4">
            <div class="dialog_body">
              <el-form :model="login4Form" :rules="login4FormRules" ref="login4FormRef">
                <el-form-item>手机号:</el-form-item>
                <el-form-item prop="phone">
                  <el-input v-model="login4Form.phone" placeholder="请输入手机号" class="input-with-select">
                    <el-select v-model="login4Form.countryCode" slot="prepend" placeholder="+86" size="small" :style="select4Width" class="login4_select">
                      <el-option v-for="item in countryInfo" :key="item.index" :label="'+' + item.code" :value="item.code" style="width: 222px">
                        <span style="float: left">{{ item.zh }}</span>
                        <span style="float: right; color: #8492a6; font-size: 12px">+{{ item.code }}</span>
                      </el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
                <el-form-item>密码:</el-form-item>
                <el-form-item>
                  <el-input v-model="login4Form.password" placeholder="设置登录密码,不少于8位"> </el-input>
                </el-form-item>
                <el-form-item class="item5">
                  <a class="login4_btn" href="javascript:;">下一步</a>
                </el-form-item>
              </el-form>
            </div>
            <div class="dialog_btn">
              <a href="javascript:;" @click="changeLogin(4, 2)">&lt;&nbsp;&nbsp;返回登录</a>
            </div>
          </div>
          <div v-else-if="loginType == 5" class="login4">
            <div class="dialog_body">
              <el-form :model="login5Form" :rules="login5FormRules" ref="login5FormRef">
                <el-form-item>手机号:</el-form-item>
                <el-form-item prop="phone">
                  <el-input v-model="login5Form.phone" placeholder="请输入手机号" class="input-with-select">
                    <el-select v-model="login5Form.countryCode" slot="prepend" placeholder="+86" size="small" :style="select5Width">
                      <el-option v-for="item in countryInfo" :key="item.index" :label="'+' + item.code" :value="item.code" style="width: 222px">
                        <span style="float: left">{{ item.zh }}</span>
                        <span style="float: right; color: #8492a6; font-size: 12px">+{{ item.code }}</span>
                      </el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
                <el-form-item>密码:</el-form-item>
                <el-form-item>
                  <el-input v-model="login5Form.password" placeholder="设置登录密码,不少于8位"> </el-input>
                </el-form-item>
                <el-form-item class="item5">
                  <a class="login4_btn" href="javascript:;">下一步</a>
                </el-form-item>
              </el-form>
            </div>
            <div class="dialog_btn">
              <a href="javascript:;" @click="changeLogin(5, 2)">&lt;&nbsp;&nbsp;返回登录</a>
            </div>
          </div>
        </el-dialog>
      </div>
    </header>
    <main class="home_main">
      <router-view></router-view>
    </main>
    <!-- <footer class="home_footer">
      <ul>
        <li v-for="(item, id) in footerData" :key="item.index">
          <a :href="item.url">{{item.title}}</a>
          <span v-if="id !== footerData.length-1">|</span>
        </li>
      </ul>
    </footer> -->
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
export default {
  name: 'Home',
  created() {
    document.title = '网易云音乐'
    this.getCountryCodeList()
  },
  data() {
    return {
      activePath: 'discover',
      headerInput: '',
      headerFocus: false,
      dialogVisible: false,
      title: '登录',
      loginType: 1,
      // 生成登录二维码
      loginMessage: {},
      // 国家编码信息
      countryInfo: [],
      // 各种登录方式所需信息
      loginInfo1: {},
      loginInfo2: {
        checked: false,
      },
      loginInfo3: {
        verifyType: 1,
        autoCheck: true,
        loginType: { 1: '短信登录', 2: '密码登录' },
        phone: '',
        password: '',
        textCode: '',
      },
      loginInfo4: {
        phone: '',
      },
      loginInfo5: {
        phone: '',
      },
      // 登录方式为3, 表单验证
      login3Form: {
        countryCode: '',
        phone: '',
        password: '',
        textCode: '',
      },
      login3FormRules: {
        phone: [
          { require: true, message: '请输入手机号!', trigger: 'blur' },
          { validator: this.validatePhone, trigger: 'blur' },
        ],
        password: [
          { require: true, message: '请输入密码!', trigger: 'blur' },
          { validator: this.validatePassword, trigger: 'blur' },
        ],
        textCode: [
          { require: true, message: '请输入验证码!', trigger: 'blur' },
          { validator: this.validateTextCode, trigger: 'blur' },
        ],
      },
      // 登录方式为4或5, 表单验证
      login4Form: {
        countryCode: '',
        phone: '',
        password: '',
      },
      login4FormRules: {
        phone: [{ validator: this.validatePhone, trigger: 'blur' }],
      },
      login5Form: {
        countryCode: '',
        phone: '',
        password: '',
      },
      login5FormRules: {
        phone: [{ validator: this.validatePhone, trigger: 'blur' }],
      },
      homeData: [
        {
          id: 1,
          name: '发现音乐',
          path: '/discover',
        },
        {
          id: 2,
          name: '我的音乐',
          path: '/my',
        },
        {
          id: 3,
          name: '关注',
          path: '/friend',
        },
        {
          id: 4,
          name: '商城',
          path: '/store',
        },
        {
          id: 5,
          name: '音乐人',
          path: '/musician',
        },
        {
          id: 6,
          name: '下载客户端',
          path: '/download',
        },
      ],
      footerData: [
        { title: '服务条款', url: 'https://st.music.163.com/official-terms/service' },
        { title: '隐私政策', url: 'https://st.music.163.com/official-terms/privacy' },
        { title: '儿童隐私政策', url: 'https://st.music.163.com/official-terms/children' },
        { title: '版权投诉指引', url: 'https://music.163.com/st/staticdeal/complaints.html' },
        { title: '意见反馈', url: 'https://st.music.163.com/#' },
        { title: '广告合作', url: 'mailto:yyyx@list.nie.netease.com' },
      ],
      selectTest: '12',
    }
  },
  components: {
    QrcodeVue,
  },
  computed: {
    select3Width() {
      return {
        '--select-width3': `${25 + (this.login3Form.countryCode.length || 2) * 8}px`,
        // '--input-width3': `${175 - (this.login3Form.countryCode.length || 2) * 9}px`,
      }
    },
    select4Width() {
      return {
        '--select-width4': `${25 + (this.login4Form.countryCode.length || 2) * 8}px`,
      }
    },
    select5Width() {
      return {
        '--select-width5': `${25 + (this.login5Form.countryCode.length || 2) * 8}px`,
      }
    },
  },
  methods: {
    saveNavState(path) {
      console.log(path)
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    },
    // 获取登录二维码key参数
    async getLoginKey() {
      const {
        data: { code, unikey },
      } = await this.$http.get('/login/qr/key')
      if (code !== 200) return this.$message.error('获取登录二维码key参数失败!')
      return unikey
    },
    // 获取登录二维码扫码状态参数
    async getLoginScanState(value) {
      const { data: res } = await this.$http.get(`/login/qr/check?key=${value}`)
      return res
    },
    // 获取登录二维码
    async getLoginImage() {
      const key = await this.getLoginKey()
      const {
        data: { code, data: qrData },
      } = await this.$http.get(`/login/qr/create?key=${key}`)
      if (code !== 200) return this.$message.error('获取登录二维码信息失败!')
      const state = await this.getLoginScanState(key)
      const res = { ...qrData, ...state }
      return res
    },
    // 手机登录
    // 检测手机号是否注册
    async getPhoneMessage() {
      const {
        data: { code, ...phoneMessage },
      } = await this.$http.get(`/cellphone/existence/check?phone=${this.loginInfo3.phone}`)
      if (code !== 200) return this.$message.error('手机号注册信息获取失败!')
      return phoneMessage
    },
    async login() {
      this.loginMessage = await this.getLoginImage()
      this.dialogVisible = true
    },
    changeLogin(oldType, newType) {
      if (this.loginInfo2.checked === true) {
        this.loginType = newType
        const info = {
          phone: '',
          countryCode: '',
          password: '',
          textCode: '',
        }
        switch (newType) {
          case 1:
          case 2:
            this.title = '登录'
            this.login3Form = { ...info }
            this.login4Form = { ...info }
            this.login5Form = { ...info }
            this.loginInfo3.phone = ''
            break
          case 3:
            this.title = '手机号登录'
            this.login4Form = { ...info }
            this.login5Form = { ...info }
            break
          case 4:
            this.title = '手机号注册'
            break
          case 5:
            this.title = '重设密码'
            this.login5Form.countryCode = this.login3Form.countryCode
            this.login5Form.phone = this.login3Form.phone
            break
        }
        // this.login3Form = { ...info }
        // this.login4Form = { ...info }
        // this.login5Form = { ...info }
      } else {
        this.$message('请先勾选同意《服务条款》、《隐私政策》、《儿童隐私条款》')
        this.loginType = oldType
      }
    },
    // 定义表单手机号验证规则
    async validatePhone(rule, value, callback) {
      if (value === '') {
        callback(new Error('手机号不能为空!'))
      } else {
        if (/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value)) {
          // 检测手机号是否注册
          const phoneMessage = await this.getPhoneMessage()
          console.log(phoneMessage)
          if (phoneMessage.exist) {
            callback()
          } else {
            this.loginType = 4
          }
        } else callback(new Error('请输入正确的手机号'))
        // var pattern = /^1\d{10}$/
        // if (!pattern.test(value)) {
        //   callback(new Error('请输入正确的手机号!'))
        // } else {
        //   console.log(rule)
        //   this.loginInfo3.phone = value
        //   // 检测手机号是否注册
        //   const phoneMessage = await this.getPhoneMessage()
        //   console.log(phoneMessage)
        //   if (phoneMessage.exist) {
        //     console.log('手机号已注册!')
        //   } else {
        //     console.log('手机号未注册!')
        //   }
        //   callback()
        // }
      }
    },
    // 定义密码验证规则
    validatePassword(rule, value, callback) {
      if (this.loginInfo3.verifyType === 1) {
        if (this.loginInfo3.password !== '') {
          if (value.length < 8 || value.length > 15) {
            callback(new Error('密码长度在8到15个字符!'))
          } else {
            if (value !== this.loginInfo3.password) {
              callback(new Error('密码错误!'))
            } else {
              callback()
            }
          }
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    validateTextCode(rule, value, callback) {
      if (this.loginInfo3.verifyType === 2) {
        if (this.loginInfo3.textCode !== '') {
          if (value !== this.loginInfo3.textCode) {
            callback(new Error('手机验证码错误!'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    // 点击登录按钮, 验证所有登录信息是否正确
    loginValid(refName) {
      // this.$refs[refName].validate((valid) => {
      //   if (valid) {
      //     this.$message.success('登录成功!')
      //   } else {
      //     this.$message.error('登录失败!信息填写错误!')
      //     return false
      //   }
      // })
      this.$refs[refName]
        .validate()
        .then((res) => {
          console.log(res, '验证成功!')
        })
        .catch((error) => {
          console.log(error, '验证失败!')
        })
    },
    // 获取国家编码列表
    async getCountryCodeList() {
      const {
        data: { code, data: countryCodeList },
      } = await this.$http.get('/countries/code/list')
      if (code !== 200) return this.$message.info('获取国家编码列表失败!')
      this.countryInfo = countryCodeList.reduce((pre, cur) => {
        pre.push(...cur.countryList)
        return pre
      }, [])
      console.log(this.countryInfo, 'aaa')
    },
    changeVerifyType() {
      if (this.loginInfo3.verifyType === 1) {
        this.loginInfo3.verifyType = 2
      } else {
        this.loginInfo3.verifyType = 1
      }
    },
  },
}
</script>

<style lang="less" scoped>
.home_container {
  position: relative;
  height: 100%;
  width: 100%;
  background-color: #f5f5f5;
  .home_header {
    width: 100%;
    height: 70px;
    background-color: #242424;
    padding: 0 83px;
    border-bottom: 1px solid #000000;
    box-sizing: border-box;
    .header_fr {
      float: left;
      width: 175px;
      height: 70px;
      line-height: 70px;
      box-sizing: border-box;
      a {
        display: block;
        width: 100%;
        height: 70px;
        line-height: 70px;
        color: #fff;
      }
      a::before {
        content: '';
        display: inline-block;
        width: 100%;
        height: 100%;
        background: url('../assets/imgs/topbar.png') no-repeat;
      }
    }
    .el-menu {
      float: left;
      height: 70px;
      border: none !important;
      .el-menu-item {
        height: 100%;
        border: none !important;
        span {
          display: block;
          width: 100%;
          height: 70px;
          line-height: 70px;
        }
      }
      .el-menu-item:hover {
        background-color: #000000 !important;
      }
      .el-menu-item {
        border: none !important;
      }
      .is-active {
        background-color: #000000 !important;
      }
    }
    .hot {
      position: absolute;
      top: 20px;
      left: 772px;
      width: 26px;
      height: 13px;
      background: url('../assets/imgs/topbar.png') no-repeat -192px 0;
    }
    .header_right {
      float: right;
      width: 300px;
      height: 32px;
      margin-top: 19px;
      /deep/.right_input {
        height: 100%;
        width: 158px;
        line-height: 32px;
        font-size: 12px;
        .el-input__inner {
          height: 100%;
          border-radius: 32px;
        }
        .el-input__prefix {
          height: 32px;
          .el-input__icon {
            line-height: 32px;
          }
        }
      }
      .right_btn {
        margin-left: 12px;
        padding-left: 16px;
        width: 90px;
        height: 32px;
        line-height: 1px;
        font-size: 12px;
        color: #ccc;
        background-color: transparent;
        border: 1px solid #4f4f4f;
        &:hover {
          border: 1px solid #eee;
        }
      }
      .login_btn {
        margin-left: 12px;
        margin-top: -3px;
        color: #999;
        font-size: 12px;
        &:hover {
          color: #eee;
        }
      }
      /deep/.el-dialog {
        width: 530px;
        border: 1px solid #ccc;
        border-radius: 5px;
        a {
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
        .el-dialog__header {
          border-radius: 5px 5px 0 0;
          color: #fff;
          background-color: #242424;
        }
        .el-dialog__body {
          padding: 0;
          padding-top: 38px;
          .login1,
          .login2 {
            .dialog_body {
              height: 220px;
              .body_left,
              .body_right {
                display: inline-block;
                vertical-align: top;
                height: 100%;
              }
              .body_left {
                margin-left: 80px;
                .l_img {
                  width: 125px;
                }
              }
              .body_right {
                margin-left: 50px;
                width: 200px;
                text-align: center;
                box-sizing: border-box;
                .title {
                  margin-bottom: 20px;
                  color: #333;
                  font-size: 18px;
                }
                .alt {
                  margin: auto;
                }
                .text {
                  margin-top: 20px;
                  font-size: 12px;
                  color: rgba(0, 0, 0, 0.4);
                  .download {
                    color: #0c73c2;
                  }
                }
              }
            }
            .dialog_btn {
              width: 100%;
              padding: 20px 0 20px 0;
              text-align: center;
            }
          }
          .login2 {
            position: relative;
            .dialog_body {
              height: auto;
              .body_left,
              .body_right {
                height: 205px;
              }
              .body_left {
                margin: 0;
                padding: 0 35px 0 40px;
                border-right: 1px dotted #999;
                .l_img {
                  width: 224px;
                  height: 120px;
                }
                .btn1,
                .btn2 {
                  width: 224px;
                  height: 31px;
                  background-image: url('../assets/imgs/button2.png');
                  cursor: pointer;
                  text-align: center;
                  a {
                    &:hover {
                      text-decoration: none;
                    }
                    span {
                      line-height: 31px;
                      font-size: 12px;
                      color: #fff;
                    }
                  }
                }
                .btn1 {
                  position: relative;
                  margin: 10px 0 10px 0;
                  background-position: 0 -3460px;
                  &::after {
                    position: absolute;
                    right: -7px;
                    content: '';
                    width: 8px;
                    height: 31px;
                    background: url('../assets/imgs/button2.png') -244px -3500px;
                  }
                  &:hover {
                    background-position: 0 -3540px;
                    &::after {
                      position: absolute;
                      right: -7px;
                      content: '';
                      width: 8px;
                      height: 31px;
                      background: url('../assets/imgs/button2.png') -244px -3580px;
                    }
                  }
                }
                .btn2 {
                  position: relative;
                  background-position: 0 -3620px;
                  &::after {
                    position: absolute;
                    right: -7px;
                    content: '';
                    width: 8px;
                    height: 31px;
                    background: url('../assets/imgs/button2.png') -246px -3660px;
                  }
                  &:hover {
                    background-position: 0 -3700px;
                    &::after {
                      position: absolute;
                      right: -7px;
                      content: '';
                      width: 8px;
                      height: 31px;
                      background-image: url('../assets/imgs/button2.png') -246px -3740px;
                    }
                  }
                  a {
                    span {
                      color: #333;
                      letter-spacing: 8px;
                    }
                  }
                }
              }
              .body_right {
                margin-left: 20px;
                width: 168px;
                list-style: none;
                li {
                  height: 48px;
                  line-height: 48px;
                  text-align: left;
                  a {
                    font-size: 12px;
                    color: #333;
                    #label1,
                    #label2,
                    #label3,
                    #label4 {
                      display: inline-block;
                      vertical-align: middle;
                      margin-right: 20px;
                      width: 39px;
                      height: 39px;
                      background-image: url('../assets/imgs/logo1.png');
                      background-position-y: -670px;
                      cursor: pointer;
                    }
                    #label1 {
                      background-position-x: -150px;
                    }
                    #label2 {
                      background-position-x: -190px;
                    }
                    #label3 {
                      background-position-x: -230px;
                    }
                    #label4 {
                      background-position-x: -270px;
                    }
                  }
                }
              }
              .body_check {
                margin-top: 20px;
                padding-left: 40px;
                font-size: 12px;
                text-align: left;
                .label_check {
                  color: #999;
                }
                a {
                  color: #507daf;
                }
              }
            }
            .dialog_btn {
              position: relative;
              padding: 0;
              text-align: right;
            }
            .mask {
              position: absolute;
              bottom: 5px;
              right: 0;
              content: '';
              width: 0;
              height: 0;
              border-color: transparent transparent transparent #fff;
              border-width: 0 0 52px 52px;
              border-style: solid;
              cursor: pointer;
            }
          }
          .login3,
          .login4 {
            .dialog_body {
              width: 220px;
              padding-left: 154px;
              .el-form {
                width: 220px;
                padding-bottom: 40px;
                .el-form-item {
                  margin-bottom: 10px;
                  height: 30px;
                  .el-form-item__content {
                    height: 30px;
                    line-height: 30px;
                    margin-left: 0 !important;
                    .el-input {
                      width: 100%;
                      .el-input__inner {
                        border-radius: 3px;
                        height: 30px;
                        line-height: 30px;
                        font-size: 12px;
                      }
                    }
                    .input-with-select {
                      line-height: 28px;
                      .el-input-group__prepend {
                        .el-select {
                          width: var(--select-width5);
                          .el-input {
                            .el-input__inner {
                              height: 27px;
                              line-height: 27px;
                              padding: 0;
                              padding-left: 5px;
                            }
                            .el-input__suffix {
                              right: -5px;
                              .el-input__suffix-inner {
                                width: 20px;
                                .el-input__icon {
                                  line-height: 28px;
                                }
                              }
                            }
                          }
                        }
                        .login4_select {
                          width: var(--select-width4);
                        }
                      }
                      .el-input__inner {
                        border-radius: 0 3px 3px 0;
                      }
                    }
                    .el-input--suffix {
                      background-color: #fff;
                    }
                    .type2 {
                      height: 30px;
                      line-height: 30px;
                      cursor: pointer;
                      .el-input__inner {
                        width: 140px;
                      }
                      .el-input-group__append {
                        line-height: 28px;
                        padding: 0 10px;
                        font-size: 12px;
                      }
                    }
                    a,
                    .right {
                      font-size: 12px;
                      color: #666;
                    }
                    .right {
                      float: right;
                    }
                  }
                }
                .item1 {
                  .el-form-item__content {
                    .input-with-select {
                      .el-input--suffix {
                        width: var(--select-width3);
                      }
                      .el-input__inner {
                        width: var(--input-width3);
                      }
                    }
                  }
                }
                .item5 {
                  .el-form-item__content {
                    text-align: center;
                  }
                }
              }
            }
            .dialog_btn {
              width: 100%;
              height: 50px;
              line-height: 50px;
              font-size: 12px;
              border-top: 1px solid #ccc;
              a {
                color: #0c73c2;
                cursor: pointer;
                margin-left: 10px;
                &:hover {
                  text-decoration: none;
                }
              }
              .a1 {
                float: right;
                margin-right: 10px;
                color: #999;
              }
            }
          }
          .login3 {
            .dialog_body {
              .el-form {
                .el-form-item {
                  .el-form-item__content {
                    .input-with-select {
                      line-height: 28px;
                      .el-input-group__prepend {
                        .el-select {
                          width: var(--select-width3);
                        }
                      }
                    }
                    .login3_btn {
                      width: 216px;
                      height: 30px;
                      background-image: url('../assets/imgs/button2.png');
                      background-position: 0 -387px;
                      color: #fff;
                      &::after {
                        position: absolute;
                        right: 0;
                        content: '';
                        width: 6px;
                        height: 30px;
                        background: url('../assets/imgs/button2.png') -244px -428px;
                      }
                      &:hover {
                        background-position: 0 -469px;
                        &::after {
                          position: absolute;
                          right: 0;
                          content: '';
                          width: 6px;
                          height: 30px;
                          background: url('../assets/imgs/button2.png') -244px -510px;
                        }
                      }
                    }
                  }
                }
                .item5 {
                  cursor: pointer;
                  .el-form-item__content {
                    color: #fff;
                  }
                }
              }
            }
          }
          .login4 {
            .dialog_body {
              .el-form {
                .el-form-item {
                  margin-bottom: 0;
                  .el-form-item__content {
                    .login4_btn {
                      display: block;
                      width: 216px;
                      height: 30px;
                      margin-top: 10px;
                      background-image: url('../assets/imgs/button2.png');
                      background-position: 0 -305px;
                      cursor: default;
                      text-decoration: none;
                      &::after {
                        position: absolute;
                        right: 0;
                        content: '';
                        width: 6px;
                        height: 30px;
                        background: url('../assets/imgs/button2.png') -244px -346px;
                      }
                    }
                  }
                }
                .item5 {
                  .el-form-item__content {
                    color: #ccc;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .home_main {
    position: absolute;
    top: 70px;
    left: 0px;
    width: 100%;
    margin: 0 auto;
    background-color: #f5f5f5;
  }
  .home_footer {
    position: absolute;
    bottom: 0;
    height: 200px;
    width: 100%;
    ul {
      li {
        float: left;
        a,
        span {
          display: inline-block;
          vertical-align: middle;
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
}
</style>

<template>
  <div id="login">
    <div class="container">
      <div style="display:flex;align-items:center;margin-bottom:30px">
        <h3 class="header-title">飞车出行车辆管理系统</h3>
        <!-- <el-carousel indicator-position="outside" :height="height+'px'" id="el-carousel">
          <el-carousel-item v-for="item in 4" :key="item">
            <img :src=" 'http://192.168.1.123:81/image/home/banner' +item+'.png' " />
          </el-carousel-item>
        </el-carousel>-->
      </div>
      <div class="login-container">
        <div class="swiper">
          <img :src="swiperImg" alt class="swiper-img" />
        </div>
        <div
          style="flex:1;margin:40px 40px 0 40px;display: flex;flex-direction: column;align-items: center;"
        >
          <ul class="login_tab" v-if="activeTab=='login'||activeTab=='register'">
            <li
              @click="checkTab('login')"
              :style="activeTab=='login'?'border-bottom:2px solid #1890ff;color:#1890ff':''"
            >立即登录</li>
            <li
              @click="checkTab('register')"
              :style="activeTab=='register'?'border-bottom:2px solid #1890ff;color:#1890ff':''"
            >立即注册</li>
          </ul>
          <div class="forgetPsw" v-else>
            <span>忘记密码</span>
            <el-button
              size="mini"
              style="width:78px;height:30px;background:#1890ff;color:#fff;padding:0"
              type="primary"
              icon="el-icon-back"
              @click="checkTab('login')"
            >返回</el-button>
          </div>
          <!-- 登录 -->
          <el-form
            key="login"
            v-if="activeTab=='login'"
            :model="loginForm"
            :rules="loginRule"
            ref="loginForm"
            label-position="left"
            label-width="0px"
            class="demo-ruleForm"
          >
            <el-form-item prop="account">
              <!-- <i class="el-icon-mobile-phone"></i> -->
              <el-input type="text" v-model="loginForm.account" size="mini" placeholder="请输入手机号">
                <i slot="prefix" class="el-input__icon el-icon-mobile-phone"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <!-- <i class="el-icon-lock"></i> -->
              <el-input
                type="password"
                size="mini"
                v-model="loginForm.password"
                auto-complete="off"
                placeholder="密码"
              >
                <i slot="prefix" class="el-input__icon el-icon-lock"></i>
              </el-input>
            </el-form-item>
            <el-form-item style="display: flex;justify-content: flex-end;margin-bottom:0;">
              <span
                style="color:#1890ff;font-size:12px;cursor: pointer;"
                @click="checkTab('forgetPsw')"
              >忘记密码?</span>
            </el-form-item>
            <el-form-item style="width:100%;">
              <el-button class="btn" @click.native.prevent="login" :loading="logining">登 录</el-button>
              <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
            </el-form-item>
          </el-form>
          <!-- 注册界面 -->
          <el-form
          key="register"
            v-if="activeTab=='register'"
            :model="loginForm"
            :rules="loginRule"
            ref="loginForm"
            label-position="left"
            label-width="0px"
            class="reg-ruleForm"
          >
            <el-form-item prop="companyName">
              <el-input type="text" v-model="loginForm.companyName" size="mini" placeholder="公司名称"></el-input>
            </el-form-item>
            <el-form-item prop="mobile">
              <el-input
                size="mini"
                v-model="loginForm.mobile"
                auto-complete="off"
                placeholder="请输入手机号"
              ></el-input>
            </el-form-item>
            <el-form-item
              prop="smsCode"
              style="display:flex;align-items:center;justify-content:space-between;"
            >
              <el-input
                size="mini"
                v-model="loginForm.smsCode"
                auto-complete="off"
                placeholder="请输入验证码"
                style="flex:1"
              ></el-input>
              <el-button
                style="width:108px;height:32px;margin-left:16px;background:#1890ff;color:#fff;padding:0"
                @click="getCode"
              >获取验证码</el-button>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                size="mini"
                v-model="loginForm.password"
                auto-complete="off"
                placeholder="请设置登录密码"
              ></el-input>
            </el-form-item>
            <el-form-item style="width:100%;">
              <el-button class="btn" @click.native.prevent="register" :loading="logining">注 册</el-button>
              <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
            </el-form-item>
          </el-form>
          <!-- 忘记密码 -->
          <el-form
            v-if="activeTab=='forgetPsw'"
            :model="loginForm"
            :rules="loginRule"
            ref="loginForm"
            label-position="left"
            label-width="0px"
            class="reg-ruleForm"
          >
            <el-form-item prop="mobile">
              <el-input
                size="mini"
                v-model="loginForm.mobile"
                auto-complete="off"
                placeholder="请输入手机号"
              ></el-input>
            </el-form-item>
            <el-form-item
              prop="card"
              style="display:flex;align-items:center;justify-content:space-between;"
            >
              <el-input
                type="password"
                size="mini"
                v-model="loginForm.mobile"
                auto-complete="off"
                placeholder="请输入验证码"
                style="flex:1"
              ></el-input>
              <el-button
                style="width:108px;height:32px;margin-left:16px;background:#1890ff;color:#fff;padding:0"
              >获取验证码</el-button>
            </el-form-item>
            <el-form-item prop="passsword1">
              <el-input
                size="mini"
                v-model="loginForm.passsword1"
                auto-complete="off"
                placeholder="请设置登录密码"
              ></el-input>
            </el-form-item>
            <el-form-item style="width:100%;">
              <el-button class="btn" @click.native.prevent="login">重置</el-button>
              <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="copyright">
      <p>Copyright © 2019 Corozon. All Rights Reserved.</p>
      <p>象牙果科技版权所有</p>
    </div>
  </div>
</template>
<script>
import http from "@/api/login";
import { mapState, mapMutations } from "vuex";
import swiperImg from '../../assets/images/ic_login_image.png'
export default {
  name: `login`,
  data() {
    return {
      loginForm: {
        account: ``,
        password: ``,
        companyName: "",
        mobile: "",
        smsCode: "",
        codeId: ""
        // company: ``
      },
      swiperImg,
      registerForm: {
        companyName: "",
        mobile: "",
        smsCode: "",
        password: "",
        codeId: ""
      },
      activeTab: "login",
      checked: false,
      logining: false,
      loginRule: {
        account: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        companyName: [
          { required: true, message: "请输入公司名", trigger: "blur" }
        ],
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        smsCode: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      },
      // registerRule: {
      //   companyName: [
      //     { required: true, message: "请输入公司名", trigger: "blur" }
      //   ],
      //   mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
      //   smsCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      //   password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      // },
      height: 0,
      bannerHeight: 700,
      screenWidth: 1920
    };
  },
  beforeMount: function() {
    this.height = (document.body.clientWidth * 664) / 1920 + "px";
  },
  computed: {},
  mounted() {},
  methods: {
    login() {
      let that = this;
      let params = this.loginForm;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.logining = true;
          var loginParams = {
            account: this.loginForm.account,
            password: this.loginForm.password
          };
          http.getUserInfo(loginParams).then(data => {
            console.log(data);
            that.logining = false;
            if (data.code == 0) {
              console.log(data.data.claims.userinfo.company.tenantId)
              this.$message(data.desc);
              this.setToken(data.data.access_token);
              this.setUserInfo(JSON.stringify(data.data.claims.userinfo));
              this.setTenantId(data.data.claims.userinfo.company.tenantId)
              this.$router.replace({ name: "HelloWorld" }); //正常登录流程进入的页面
            } else {
              this.$message(data.desc);
            }
          });
        } else {
          this.$message(`请输入账号或密码`);
          return false;
        }
      });
    },
    //获取验证码
    getCode() {
      if (!this.loginForm.mobile) {
        this.$message(`请输入您的手机号`);
        return;
      }
      let params = { mobile: this.loginForm.mobile };
      http.getCode(params).then(data => {
        if (data.code == 0) {
          this.$message(data.desc);
          this.loginForm.codeId = data.data.codeId;
        }
      });
    },
    register() {
      let that = this;
      let params = this.loginForm;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.logining = true;
          var loginParams = {
            companyName: params.companyName,
            mobile: params.mobile,
            smsCode: params.smsCode,
            password: params.password,
            codeId: params.codeId
          };
          http.register(params).then(data => {
            console.log(data);
            that.logining = false;
            if (data.code == 0) {
              this.$message(data.desc);
              this.activeTab = "login";
            } else {
              this.$message(data.desc);
            }
          });
        } else {
          this.$message(`请输入您的注册信息`);
          return false;
        }
      });
    },
    checkTab(tab) {
      this.activeTab = tab;
    },
    memberPass(value) {
      console.log(value);
    },
    ...mapMutations(`user`, [
      `setToken`,
      `setUserInfo`,
      `setRoleInfoList`,
      `setRole`,
      `setTenantId`
    ])
  }
};
</script>
<style lang="stylus">
#login {
  width: 100%;
  height: 100%;
  background-image: url('../../assets/images/ic_login_bg.png');
  background-size: cover;
  background-repeat: no-repeat;
  position: fixed;
  top: 0;
  left: 0;

  .el-carousel {
    height: 100%;
    overflow-y: hidden;
    // margin:10px 0;
  }

  .el-carousel__container {
    height: 95% !important;
  }

  .login_tab {
    list-style: none;
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;

    li {
      // border-bottom: 2px solid #ededed;
      padding: 0 8px 8px 8px;
      font-size: 16px;
      color: #333;
      margin-right: 40px;
      cursor: pointer;

      &:nth-child(2) {
        margin-right: 0px;
      }
    }
  }

  // img {
  // display: inline-block;
  // height: auto;
  // max-width: 100%;
  // }
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 100px;
  }

  .travel-logo {
    width: 88px;
    height: 40px;
    background: #ededed;
  }

  .header-title {
    color: #fff;
    margin: 0;
    margin-left: 12px;
    font-size: 33px;
  }

  .login_title {
    font-size: 13px;
    color: #333;
    display: block;
    margin-bottom: 20px;
  }

  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    width: 960px;
    // padding: 35px 35px 15px 35px;
    background: #fff;
    // border: 1px solid #eaeaea;
    // box-shadow: 0 0 6px #cac6c6;
    flex: 1;
    height: 440px;
    display: flex;
  }

  .swiper {
    width: 441px;
    height: 441px;
    // background: #eaeaea;
  }
  .swiper-img{
    width:100%;
    height:100%;
  }

  .el-form {
    // flex: 1;
    // margin: 0 80px;
  }

  .el-form-item__content {
    display: flex;
    align-items: center;
    line-height: normal;
  }

  .el-input input {
    // border: 0;
    // border-bottom: 1px solid #bbb;
    width: 360px;
    height: 32px;
    border-radius: 4px;
  }

  .el-form-item:nth-child(3) {
    .el-input input {
      width: 236px;
    }
  }

  .title {
    margin: 10px auto 40px auto;
    // text-align: center;
    color: #333;
  }

  .remember {
    // margin: 0px 0px 10px 0px;
  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }

  // .el-carousel__item:nth-child(2n) {
  // background-color: #99a9bf;
  // }

  // .el-carousel__item:nth-child(2n+1) {
  // background-color: #d3dce6;
  // }
  .demo-ruleForm {
    margin-top: 68px;
  }

  .reg-ruleForm {
    margin-top: 33px;

    .el-form-item {
      margin-bottom: 16px;

      &:nth-child(5) {
        margin-bottom: 0;
      }
    }
  }

  .btn {
    width: 100%;
    height: 32px;
    background: #1890ff;
    font-size: 14px;
    color: #fff;
    // line-height:32px;
    padding: 0;
    margin-top: 30px;
  }

  .forgetPsw {
    width: 360px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .copyright {
    position: fixed;
    bottom: 40px;
    // left: 50%;
    width: 100%;
    color: #fff;
    font-size: 14px;
    text-align: center;

    p {
      padding: 0;
      margin: 0;

      &:nth-child(1) {
        margin-bottom: 13px;
      }
    }
  }
}
</style>
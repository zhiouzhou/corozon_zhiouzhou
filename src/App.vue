<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <el-container :style="contentStyleObj" v-if="isLogin">
      <el-container :class="isCollapse?'aside-navs-shrink':'aside-nav-expand'">
        <el-header class="header-wrap">
          <div style="display: flex;align-items:center;">
            <!-- <i class="travelLogo"></i> -->
            <img :src="travelLogo" alt style="width:34px;height:34px;" />
            <!-- <div class="menu-header">飞车出行车辆管理系统</div> -->
          </div>
        </el-header>
        <el-aside :class="isCollapse?'menuwrap-hide':'menu-wrap'">
          <el-menu
            :collapse="isCollapse"
            :default-active="activeIndex2"
            menu-trigger="click"
            background-color="#101834"
            text-color="#fff"
            active-text-color="#fff"
            :router="true"
            mode="vertical"
            :unique-opened="true"
          >
            <template>
              <div v-for="item in roleInfoList" :key="item.id">
                <el-submenu :index="item.id+''" v-if="item.children">
                  <template slot="title">
                    <!-- <i class="el-icon-menu"></i> -->
                    <img :src="getImageUrl(item.icon)" class="icon_img" />
                    <!-- <img :src="logo" alt /> -->
                    <!-- <span>{{item.name}}</span> -->
                  </template>
                  <el-menu-item-group v-for="itemNav in item.children" :key="itemNav.id">
                    <el-menu-item
                      :index="itemNav.id+''"
                      :route="{name:itemNav.eleId}"
                      @click="handleMenuClick(itemNav)"
                    >
                      <!-- <i class="el-icon-menu"></i> -->
                      {{itemNav.name}}
                    </el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-menu-item
                  index="2"
                  :route="{name:item.eleId}"
                  @click="handleMenuClick(item)"
                  v-else
                >
                  <img :src="getImageUrl(item.icon)" class="icon_img" />
                  <!-- <i class="el-icon-menu"></i> -->
                  <!-- <span slot="title">{{item.name}}</span> -->
                </el-menu-item>
              </div>
            </template>

            <!-- </div> -->
          </el-menu>
        </el-aside>
      </el-container>
      <el-container :class="isCollapse?'main-contents-expand':'main-contents-shrink'">
        <el-header class="contail-header-wrap">
          <!-- <i :class="!isCollapse?'el-icon-s-fold':'el-icon-s-unfold'" @click="asideStatus"></i> -->
          <!-- <img
            :src="!isCollapse?fold:unfold"
            @click="asideStatus"
            alt
            style="width:32px;height:32px"
          />-->
          <div class="menu-header">飞车出行车辆管理系统</div>
          <div class="userInfo">
            <i class="messageICon"></i>
            <i class="helpICon"></i>
            <i></i>
            <el-dropdown @command="handleCommand">
              <span>
                北京象牙果科技有限公司管理员，杨文浩
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <div class="userCenter">
              <img :src="defaultHeadPic?defaultHeadPic:''" alt />
            </div>
          </div>
        </el-header>
        <el-main>
          <el-tabs
            v-model="editableTabsValue"
            closable
            type="card"
            @edit="handleTabsEdit"
            @tab-click="handleTabsClick"
          >
            <el-tab-pane
              :key="item.name"
              v-for="(item) in editableTabs"
              :label="item.title"
              :name="item.name"
            ></el-tab-pane>
          </el-tabs>
          <transition>
            <keep-alive v-if="isRouterAlive">
              <router-view v-if="$route.meta.keepalive"></router-view>
            </keep-alive>
          </transition>
        </el-main>
      </el-container>
    </el-container>
    <!--登录页面  根据是否有token来判断是哪个页面 -->
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import workBenchIcon from "./assets/images/gongzuotai.svg";
import customerIcon from "./assets/images/kehu.svg";
import contractIcon from "./assets/images/hetong.svg";
import saleIcon from "./assets/images/xiaoshou.svg";
import carIcon from "./assets/images/cheliang.svg";
import deployIcon from "./assets/images/peizhi.svg";
import financeIcon from "./assets/images/caiwu.svg";
import riskIcon from "./assets/images/fengkong.svg";
import defaultHeadPic from "./assets/images/headPic.png";
import fold from "./assets/images/ic_fold@2x.png";
import unfold from "./assets/images/ic_unfold@2x.png";
import travelLogo from "./assets/images/logo.svg";
import logo from "./assets/images/work1.svg";
// import helpIcon from "./assets/images/ic_help@2x.png";
// import messageIcon from "./assets/images/ic_message@2x.png";

export default {
  name: "App",
  provide: function() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true,
      contentStyleObj: {
        // height: "500px",
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        width: "100%",
        background: "#f1f4fb",
        display: "flex",
        flex: 1
      },
      isCollapse: true,
      activeIndex: "1",
      activeIndex2: "1",
      workBenchIcon,
      customerIcon,
      contractIcon,
      saleIcon,
      carIcon,
      deployIcon,
      financeIcon,
      riskIcon,
      defaultHeadPic,
      fold,
      unfold,
      travelLogo,
      logo,
      roleInfoList: [
        {
          id: 2,
          parentId: null,
          name: "工作台",
          link: null,
          type: "MENU",
          eleId: "HelloWorld",
          sort: 1,
          icon: "workBenchIcon"
        },
        {
          id: 9,
          parentId: null,
          name: "客户管理",
          link: null,
          type: "MENU",
          eleId: "customerManage",
          sort: 1,
          icon: "customerIcon"
        },
        {
          id: 4,
          parentId: null,
          name: "合同管理",
          link: null,
          type: "MENU",
          eleId: "contractManage",
          sort: 2,
          icon: "contractIcon"
        },
        {
          id: 7,
          parentId: null,
          name: "销售管理",
          link: null,
          type: "MENU",
          eleId: "saleManage",
          sort: 1,
          icon: "saleIcon"
        },
        {
          id: 10,
          parentId: null,
          name: "车辆管理",
          link: null,
          type: "MENU",
          eleId: "carManage",
          sort: 1,
          icon: "carIcon"
        },
        {
          id: 12,
          parentId: null,
          name: "财务管理",
          link: null,
          type: "MENU",
          eleId: "financeManage",
          sort: 1,
          icon: "financeIcon"
        },
        {
          id: 18,
          parentId: null,
          name: "风控管理",
          link: null,
          type: "MENU",
          eleId: "riskManagement",
          sort: 1,
          icon: "riskIcon"
        },
        {
          id: 14,
          parentId: null,
          name: "配置管理",
          link: null,
          type: "MENU",
          eleId: "DeployManage",
          sort: 1,
          icon: "deployIcon",
          children: [
            {
              id: 15,
              parentId: null,
              name: "公司配置",
              link: null,
              icon: null,
              type: "MENU",
              eleId: "companyDeploy",
              sort: 1,
              children: []
            },
            {
              id: 16,
              parentId: null,
              name: "员工管理",
              link: null,
              icon: null,
              type: "MENU",
              eleId: "staffManage",
              sort: 1,
              children: []
            },
            {
              id: 17,
              parentId: null,
              name: "车型管理",
              link: null,
              icon: null,
              type: "MENU",
              eleId: "vehicleType",
              sort: 1,
              children: []
            },
            {
              id: 18,
              parentId: null,
              name: "合同模板",
              link: null,
              icon: null,
              type: "MENU",
              eleId: "contractTemplete",
              sort: 1,
              children: []
            }
          ]
        }
      ],
      editableTabsValue: `HelloWorld`,
      editableTabs: [
        {
          title: "工作台",
          name: "HelloWorld"
        }
      ],
      tabIndex: 1
    };
  },
  computed: {
    isLogin() {
      return !!this.access_token;
    },
    ...mapState(`user`, [`access_token`])
  },
  methods: {
    // getHeight() {
    //   this.contentStyleObj.height = window.innerHeight + "px";
    // },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    },
    getImageUrl(imgName) {
      let imageSrc = this[imgName];
      return imageSrc;
    },
    handleSelect(index, indexPath) {
      console.log("index", index);
      console.log("indexPath", indexPath);
    },
    openMenu(index, indexPath) {
      console.log("index", index);
      console.log("indexPath", indexPath);
      this.$router.push({ name: index });
    },
    asideStatus() {
      this.isCollapse = !this.isCollapse;
    },
    handleMenuClick(itemNav) {
      //切换选中的标签页
      //先看已打开的标签页中有没有
      let index = this.editableTabs.findIndex(
        item => item.name === itemNav.eleId
      );
      //有的话切换
      if (index !== -1) {
        this.editableTabsValue = itemNav.eleId;
      } else {
        //判断当前所在页面是不是空页面(空页面的title属性都是“新标签页”,name属性都是数字加“空页面”)
        //如果是空页面直接替换当前页面
        let isAtEmptyPage = this.editableTabsValue.indexOf(`工作台`) !== -1;
        if (isAtEmptyPage) {
          let currentIndex = this.editableTabs.findIndex(
            item => item.name === this.editableTabsValue
          );
          this.editableTabs[currentIndex] = {
            title: itemNav.name,
            name: itemNav.eleId
          };
        } else {
          this.editableTabs.push({
            title: itemNav.name,
            name: itemNav.eleId
          });
        }
        this.editableTabsValue = itemNav.eleId;
      }
    },
    //添加或者删除标签页
    handleTabsEdit(targetName, action) {
      if (action === "add") {
        let newTabName = ++this.tabIndex + "空页面";
        this.editableTabs.push({
          title: "新标签页",
          name: newTabName
        });
        this.editableTabsValue = newTabName;
      }
      if (action === "remove") {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        console.log(activeName);
        this.$router.push({ name: activeName });
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }
    },
    handleTabsClick(tab, event) {
      console.log("tab", tab);
      console.log("event", event);
      this.$router.push({ name: tab.name });
    },
    handleCommand(common) {
      console.log(common);
      if (common == "loginOut") {
        this.$router.push({ path: "/login" });
        this.clearToken();
      }
    },
    ...mapMutations(`user`, [`clearToken`])
  }
};
</script>

<style lang="stylus">
#app {
  font-family: 'pingFangSC-Medium', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  height: 100%;

  /* margin-top: 60px; */
  .header-wrap {
    /* max-height: 50px; */
    height: 60px !important;
    line-height: 60px;
    overflow: hidden;
    background-color: #06223e;
    color: #fff;
    font-size: 14px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  // .travelLogo{
  // display: inline-block;
  // width: 34px;
  // height: 34px;
  // background-image: url('./assets/images/chuxingLogo.png');
  // background-size: cover;
  // background-repeat: no-repeat;
  // }
  .helpICon {
    display: inline-block;
    width: 32px;
    height: 32px;
    background-image: url('./assets/images/ic_help@2x.png');
    background-size: cover;
    background-repeat: no-repeat;
  }

  .messageICon {
    display: inline-block;
    width: 32px;
    height: 32px;
    background-image: url('./assets/images/ic_message@2x.png');
    background-size: cover;
    background-repeat: no-repeat;
  }

  .aside-nav-expand {
    width: 292px;
    z-index: 2;
    box-shadow: 1px 0 5px rgba(3, 22, 38, 0.8);
    transition: all 0.2s;
  }

  .aside-navs-shrink {
    width: 64px;
    z-index: 2;
    box-shadow: 1px 0 5px rgba(3, 22, 38, 0.8);
    transition: all 0.2s;
    flex: none;
  }

  .main-contents-shrink {
    width: calc(100% - 292px);
    // flex:none;
  }

  .icon_img {
    // width: 44px;
    // height: 44px;
  }

  .main-contents-expand {
    width: calc(100% - 64px);
    background-color: #f0f2f5;
    transition: all 0.2s;
  }

  .header-menu {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 60px 0 20px;
    height: 60px;
  }

  .menu-header {
    height: 55px;
    color: #fff;
    font-size: 18px;
    text-align: center;
    line-height: 55px;
    font-family: pingFangSC-Medium, sans-serif;
  }

  .breadcrumb {
    flex: 1;
    width: 100%;
    padding: 12px 0 12px 36px;
    background: #fff;
  }

  .title {
    // margin-right: 20px;
  }

  .line {
    display: block;
    width: 2px;
    height: 22px;
    background: #777878;
  }

  .account-icon i {
    margin-left: 18px;
  }

  .account-icon span {
    margin-left: 12px;
  }

  .el-main {
    padding: 0;
    overflow: auto !important;
  }

  .menu-wrap {
    width: 100% !important;
    // min-height: 100vh;
    font-family: 'pingFangSC-Regular', sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    background: #101834;
  }

  .menuwrap-hide {
    width: 64px !important;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    // min-height: 100vh;
    background: #101834;
    // height: 100%;
    flex: 1;
    overflow auto;
    overflow-x:hidden;
    scrollbar-width:none;
    

    .el-submenu__title {
      padding: 0 !important;
      text-align: center;
    }
  }

  .el-submenu__title i {
    display: none !important;
  }

  .contail-header-wrap {
    height: 60px;
    background: #050d26;
    // line-height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .userInfo {
      display: flex;
      align-items: center;

      i {
        font-size: 20px;
        color: #fff;
        // display:inline-block;
        margin-right: 20px;

        &:nth-child(3) {
          display: inline-block;
          width: 1px;
          height: 26px;
          background: #fff;
        }
      }

      span {
        font-size: 14px;
        color: #fff;
        padding-right: 11px;
      }

      .userCenter {
        width: 30px;
        height: 30px;
        border-radius: 50px;

        img {
          width: 100%;
          line-height: 0;
        }

        .top {
          position: absolute;
          top: 21px;
          left: 2px;
        }

        .top:before, .top:after {
          position: absolute;
          content: '';
          border-top: 10px transparent dashed;
          border-left: 10px transparent dashed;
          border-right: 10px transparent dashed;
          border-bottom: 10px #fff solid;
        }

        .top:before {
          border-bottom: 10px #0099CC solid;
        }

        .top:after {
          top: 1px; /* 覆盖并错开1px */
          border-bottom: 10px #fff solid;
        }
      }
    }
  }

  .el-menu {
    // width: 100%;
    border-right: 0;
    // margin-top:12px;
  }

  .el-submenu {
    margin-top: 12px;
  }

  .el-submenu.is-opened .el-menu-item {
    background-color: #010c16 !important;
  }

  .el-menu--popup .el-menu-item.is-active, .el-submenu.is-active .el-menu-item.is-active, .el-submenu.is-opened .el-menu-item.is-active {
    background-color: #1890ff !important;
  }

  .el-icon-s-fold, .el-icon-s-unfold {
    font-size: 28px;
    color: #fff;
    margin-right: 5px;
  }

  .el-icon-platform-eleme {
    display: inline-block;
    font-size: 34px;
    margin-right: 15px;
    position: relative;
    right: 4px;
  }

  .el-menu-item {
    // padding-left: 56px !important;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 12px;
    padding:0 !important;
  }

  .el-menu-item-group {
    .el-menu-item-group__title {
      padding: 0 !important;
      line-height: normal;
      font-size: 12px;
      color: #909399;
    }
  }

  .el-menu-item:hover, .el-submenu__title:hover {
    background: #3c4875 !important;
  }

  .el-tabs {
    background: #fff;
  }

  .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
    background: rgb(241, 244, 251);
    border: 0;
  }

  .el-tabs__nav {
    margin-left: 20px;
  }

  .el-tabs__header {
    margin: 0;
  }

  .el-menu .el-menu--popup .el-menu--popup-right-start .el-menu-item-group >.el-menu-item-group__title {
    padding: 0px 0 0px 14px !important;
  }

  /* 设置滚动条的样式 */
  ::-webkit-scrollbar {
    width:0px;
    // background-color: aqua;
  }

  /* 滚动槽 */
  ::-webkit-scrollbar-track {
    border-radius: 10px;
  }

  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #fff;
  }
}
</style>

<template>
  <div id="hello">
    <!-- <h1 class="helloTitle">欢迎使用出行管理系统</h1>
    <img class="bgImg" :src="bgImage" alt />-->
    <div class="welcome">
      <p>您好，杨文浩，欢迎登录飞车出行车辆管理系统</p>
      <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <div class="workbench">
      <!-- 左侧展示内容 -->
      <div class="workbeach_left">
        <!-- 快捷菜单 -->
        <div class="shortcutMenu">
          <p class="title">
            <i></i>
            <span>快捷菜单</span>
          </p>
          <div class="menu_list">
            <div
              v-for="item in menuList"
              :key="item.id"
              class="menu_ball"
              @click="$router.push({name:item.path,query:{pageType:'add'}})"
            >
              <img :src="item.icon" alt />
              <span>{{item.menu}}</span>
            </div>
          </div>
        </div>
        <!-- 统计 -->
        <div class="statistics">
          <div class="statistics_left">
            <p class="title">
              <i></i>
              <span>数据统计</span>
            </p>
            <div class="statistics_left_list">
              <p v-for="(item) in statisticInfo.customer" :key="item.name">
                <span style="color:#333;float:left;">{{item.desc}}</span>
                <span style="color:#1890FF;float:right;">{{item.value}}</span>
              </p>
              <p v-for="(item) in statisticInfo.finance" :key="item.name">
                <span style="color:#333;float:left;">{{item.desc}}</span>
                <span style="color:#1890FF;float:right;">{{item.value}}</span>
              </p>
              <p v-for="(item) in statisticInfo.member" :key="item.name">
                <span style="color:#333;float:left;">{{item.desc}}</span>
                <span style="color:#1890FF;float:right;">{{item.value}}</span>
              </p>
              <p v-for="(item) in statisticInfo.motor" :key="item.name">
                <span style="color:#333;float:left;">{{item.desc}}</span>
                <span style="color:#1890FF;float:right;">{{item.value}}</span>
              </p>
              <p v-for="(item) in statisticInfo.risk" :key="item.name">
                <span style="color:#333;float:left;">{{item.desc}}</span>
                <span style="color:#1890FF;float:right;">{{item.value}}</span>
              </p>
              <p v-for="(item) in statisticInfo.sales" :key="item.name">
                <span style="color:#333;float:left;">{{item.desc}}</span>
                <span style="color:#1890FF;float:right;">{{item.value}}</span>
              </p>
            </div>
          </div>
          <div class="statistics_right">
            <p class="title">
              <i></i>
              <span>统计图表</span>
            </p>
            <div id="saleEcharts" style="height:278px;margin-top:20px;width:100%;"></div>
            <div id="moneyEcharts" style="height:278px;"></div>
          </div>
        </div>
      </div>
      <!-- 右侧展示内容 -->
      <div class="workbeach_right">
        <!-- <div class="weather"> -->
        <div id="weather-view-he" style="width:100%;"></div>
        <!-- </div> -->
        <div class="bulletin_board">
          <p class="title">
            <i></i>
            <span>公告栏</span>
          </p>
          <div class="notice_list">
            <div v-for="(item,index) in boardList" :key="index" class="notice">
              <span>{{item.date}}</span>
              <p>{{item.notice}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import addCarIcon from "../assets/images/ic_xinzengcheliang.svg";
import checkCarIcon from "../assets/images/ic_yanche.svg";
import changeCarIcon from "../assets/images/ic_huanche.svg";
import addSignIcon from "../assets/images/ic_xinzengdaiqianyue.svg";
import addRenewalIcon from "../assets/images/ic_xinzengxuzu.svg";
import addCustomerIcon from "../assets/images/ic_xinzengkehu.svg";
import addExchangeRecordsIcon from "../assets/images/ic_xinzengjiaoliujilu.svg";
import addSignReceiptsIcon from "../assets/images/ic_qianyueshoukuan.svg";
import rentCollectionIcon from "../assets/images/ic_shouzujin.svg";
import returnDepositIcon from "../assets/images/ic_tuiyajin.svg";
import weaherIcon from "../assets/images/ic_duoyun.png";
import http from "@/api/workbenchApi";
import { mapState } from "vuex";

export default {
  name: "HelloWorld",
  inject: ["reload"],
  data() {
    return {
      msg: "出行后台管理系统",
      addCarIcon,
      checkCarIcon,
      changeCarIcon,
      addSignIcon,
      addRenewalIcon,
      addCustomerIcon,
      addExchangeRecordsIcon,
      addSignReceiptsIcon,
      rentCollectionIcon,
      returnDepositIcon,
      weaherIcon,
      // WIDGET: null,
      statisticInfo: {},
      menuList: [
        { id: 0, menu: "新增车辆", icon: addCarIcon, path: "addCar" },
        { id: 1, menu: "验车", icon: checkCarIcon, path: "addCheckCar" },
        { id: 2, menu: "换车", icon: changeCarIcon, path: "addChangeCar" },
        { id: 3, menu: "新增待签约", icon: addSignIcon, path: "addSign" },
        { id: 4, menu: "新增续租", icon: addRenewalIcon, path: "addCar" },
        { id: 5, menu: "新增客户", icon: addCustomerIcon, path: "addCustomer" },
        {
          id: 6,
          menu: "新增沟通记录",
          icon: addExchangeRecordsIcon,
          path: "addExchangeRecords"
        },
        {
          id: 7,
          menu: "签约收款",
          icon: addSignReceiptsIcon,
          path: "addSignReceipts"
        },
        {
          id: 8,
          menu: "收租金",
          icon: rentCollectionIcon,
          path: "rentCollection"
        },
        {
          id: 9,
          menu: "退押金",
          icon: returnDepositIcon,
          path: "returnDeposit"
        }
      ],
      statisticList: [
        { label: "全部车辆", num: "236" },
        { label: "已租车辆", num: "111" },
        { label: "待租车辆", num: "12" },
        { label: "全部客户", num: "456" }
      ],
      boardList: [
        {
          date: "2019.10.14 09:14",
          notice:
            "行驶证、驾驶证识别能力升级，识别成功率提升至95%，识别时间缩短到1秒！！欢迎通过网页端和APP免费使用，快速输入车辆和司机信息。"
        },
        {
          date: "2019.10.14 09:14",
          notice:
            "行驶证、驾驶证识别能力升级，识别成功率提升至95%，识别时间缩短到1秒！！欢迎通过网页端和APP免费使用，快速输入车辆和司机信息。"
        },
        {
          date: "2019.10.14 09:14",
          notice:
            "行驶证、驾驶证识别能力升级，识别成功率提升至95%，识别时间缩短到1秒！！欢迎通过网页端和APP免费使用，快速输入车辆和司机信息。"
        },
        {
          date: "2019.10.14 09:14",
          notice:
            "行驶证、驾驶证识别能力升级，识别成功率提升至95%，识别时间缩短到1秒！！欢迎通过网页端和APP免费使用，快速输入车辆和司机信息。"
        },
        {
          date: "2019.10.14 09:14",
          notice:
            "行驶证、驾驶证识别能力升级，识别成功率提升至95%，识别时间缩短到1秒！！欢迎通过网页端和APP免费使用，快速输入车辆和司机信息。"
        },
        {
          date: "2019.10.14 09:14",
          notice:
            "行驶证、驾驶证识别能力升级，识别成功率提升至95%，识别时间缩短到1秒！！欢迎通过网页端和APP免费使用，快速输入车辆和司机信息。"
        },
        {
          date: "2019.10.14 09:14",
          notice:
            "行驶证、驾驶证识别能力升级，识别成功率提升至95%，识别时间缩短到1秒！！欢迎通过网页端和APP免费使用，快速输入车辆和司机信息。"
        }
      ]
    };
  },
  computed: {
    ...mapState(`user`, [`tenantId`])
  },
  activated() {
    this.getStatics();
    this.drawLine();
    this.moneyDraw();
  },
  mounted() {
    const a = document.createElement("script");
    a.innerText = `WIDGET = {ID: 'SynYlSEon4'};`;
    document.body.appendChild(a);
    const s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://apip.weatherdt.com/view/static/js/r.js?v=1111";
    document.body.appendChild(s);
  },
  methods: {
    getStatics() {
      let tenantId = this.tenantId;
      http.getStatics(tenantId).then(data => {
        if (data.code == 0) {
          this.statisticInfo = data.data;
        }
      });
    },
    refresh() {
      this.reload();
      console.log(`组件刷新了`);
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("saleEcharts"));
      let that = this;
      myChart.setOption({
        title: { text: `当日租车趋势`, textStyle: { fontSize: 14 }, left: 20 },
        tooltip: {
          trigger: "axis"
        },
        color: ["#1890FF", "#F56C6C"],
        legend: {
          orient: "horizontal", // 'vertical'
          x: "center", // 'center' | 'left' | {number},
          y: "top", // 'center' | 'bottom' | {number},
          data: ["出租车辆", "退租车辆"]
        },
        toolbox: {
          show: true,
          borderColor: "#eaeaea",
          borderWidth: 0,
          padding: 10,
          itemGap: 12,
          color: ["#1e90ff", "#22bb22", "#4b0082", "#d2691e"],
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              title: {
                line: "类型切换-折线图",
                bar: "类型切换-柱形图"
              },
              type: ["line", "bar"]
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        grid: {
          borderColor: "red"
        },
        xAxis: [
          {
            type: "category",
            boundaryGap:true,
            show: true,
            data: ["8月", "9月", "10月", "11月", "12月"]
          }
        ],
        yAxis: [
          {
            type: "value",
            show: true,
            splitLine: {
              lineStyle: {
                color: ["#ccc"],
                width: 1
              }
            },
            axisLine: {
              lineStyle: {
                width: 1,
                color: "#ccc"
              }
            },
            axisLabel: {
              textStyle: {
                color: "#999"
              }
            }
          }
        ],
        series: [
          {
            name: "出租车辆",
            type: "line",
            stack: "总量",
            data: [120, 132, 101, 134, 90]
          },
          {
            name: "退租车辆",
            type: "line",
            stack: "总量",
            data: [220, 182, 191, 234, 290]
          }
        ]
      });
    },
    moneyDraw() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("moneyEcharts"));
      let that = this;
      myChart.setOption({
        title: { text: `当日收支统计`, textStyle: { fontSize: 14 }, left: 20 },
        tooltip: {
          trigger: "axis"
        },
        color: ["#2FC25B", "#FEA0A0"],
        legend: {
          show: true,
          orient: "horizontal", // 'vertical'
          x: "center", // 'center' | 'left' | {number},
          y: "top", // 'center' | 'bottom' | {number},
          data: ["收入", "支出"]
        },
        toolbox: {
          show: true,
          borderColor: "#eaeaea",
          borderWidth: 0,
          padding: 10,
          itemGap: 12,
          color: ["#1e90ff", "#22bb22", "#4b0082", "#d2691e"],
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              title: {
                line: "类型切换-折线图",
                bar: "类型切换-柱形图"
              },
              type: ["line", "bar"]
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        grid: {
          borderColor: "red"
        },
        xAxis: [
          {
            type: "category",
            boundaryGap:true,
            show: true,
            data: ["8月", "9月", "10月", "11月", "12月"]
          }
        ],
        yAxis: [
          {
            type: "value",
            show: true,
            splitLine: {
              lineStyle: {
                color: ["#ccc"],
                width: 1
              }
            },
            axisLine: {
              lineStyle: {
                width: 1,
                color: "#ccc"
              }
            },
            axisLabel: {
              textStyle: {
                color: "#999"
              }
            }
          }
        ],
        series: [
          {
            name: "收入",
            type: "bar",
            data: [120, 132, 101, 134, 90]
          },
          {
            name: "支出",
            type: "bar",
            barWidth: "26px",
            barGap: "0%",
            data: [220, 182, 191, 234, 290]
          }
        ]
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
p, h3 {
  margin: 0;
}

#weather-view-he {
  width: 100% !important;
  background-size: cover !important;
}

#hello {
  margin: 0 20px 20px;

  .welcome {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 21px;

    p {
      margin: 0;
      padding: 20px 0;
      font-size: 16px;
    }
  }

  .workbench {
    display: flex;
    justify-content: space-between;

    .workbeach_left {
      width: 66%;

      .shortcutMenu {
        background: #fff;
        height: 200px;
        border-radius:4px;
      }

      .title {
        border-bottom: 1px solid #ededed;
        padding: 10px 20px;
        display: flex;
        align-items: center;
        margin: 0;
        font-size: 16px;
        color: #333;

        // box-sizing: border-box;
        i {
          width: 2px;
          height: 16px;
          background: #1890FF;
          display: inline-block;
          margin-right: 10px;
        }
      }

      .menu_list {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 38px 0;

        .menu_ball {
          flex: 1;
          display: flex;
          align-items: center;
          flex-direction: column;
          cursor: pointer;

          img {
            width: 60px;
            height: 60px;
            padding-bottom: 16px;
          }

          span {
            font-size: 14px;
          }
        }
      }

      .statistics {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;

        .statistics_left {
          background: #fff;
          width: 35%;
          border-radius:4px;
          // overflow: auto;
        }

        .statistics_left_list {
          display: flex;
          padding: 0 20px;
          flex-direction: column;
          height: 580px;
          overflow: auto;
          overflow-x:hidden;
          // scrollbar-width:none;

          p {
            // display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #eaeaea;
            padding: 10px 20px 10px 20px;
            font-size: 16px;
          }
        }

        .statistics_right {
          background: #fff;
          width: 63%;
          border-radius:4px;
        }
      }
    }

    .workbeach_right {
      width: 32.45%;

      .title {
        border-bottom: 1px solid #ededed;
        padding: 10px 20px;
        display: flex;
        align-items: center;
        margin: 0;
        font-size: 16px;
        color: #333;

        // box-sizing: border-box;
        i {
          width: 2px;
          height: 16px;
          background: #1890FF;
          display: inline-block;
          margin-right: 10px;
        }
      }

      .weather {
        background: linear-gradient(90deg, rgba(24, 144, 255, 1) 0%, rgba(31, 57, 252, 1) 100%);
        display: flex;
        justify-content: space-between;
        padding: 0 30px 0 50px;
        height: 200px;

        .date_week {
          display: flex;
          align-items: center;
          flex-direction: column;
          // padding-left: 24px;
          padding-top: 28px;
          width: 114px;
          // height: 157px;
          background: url('../assets/images/ic_riqibg.png') no-repeat;
          // background-size: cover;
          background-position: center;

          span {
            &:nth-child(1) {
              font-size: 70px;
              color: #fff;
              display: block;
              font-family: DIN;
            }

            font-size: 24px;
            color: #fff;
          }
        }

        .weather_tem {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          margin-top: 32px;

          .weather_tem_show {
            display: flex;
            align-items: center;

            .weather_img {
              margin-right: 16px;
            }

            .date {
              display: flex;
              flex-direction: column;
              align-items: flex-end;

              span {
                color: #fff;
                font-size: 20px;
              }
            }
          }

          p {
            font-size: 40px;
            color: #fff;
            margin-top: 26px;
          }
        }
      }

      .bulletin_board {
        background: #fff;
        margin-top: 20px;
        border-radius:4px;
        // height: 634px;
        // overflow: auto;
      }

      .notice_list {
        padding: 0 24px;
        height: 580px;
        overflow: auto;

        .notice {
          padding: 24px 0;
          border-bottom: 1px solid #eaeaea;

          &:nth-last-child(1) {
            border-bottom: 0;
          }

          span {
            font-size: 16px;
            color: #7D7D7D;
          }

          p {
            color: #333;
            font-size: 16px;
          }
        }
      }
    }
  }

  /* 设置滚动条的样式 */
  ::-webkit-scrollbar {
    width: 6px;
    // background-color: aqua;
  }

  /* 滚动槽 */
  ::-webkit-scrollbar-track {
    border-radius: 10px;
  }

  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #c9cbd6;
  }
}
</style>

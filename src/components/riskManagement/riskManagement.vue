<template>
  <div id="riskManagement">
    <div>
      <p class="overview_title">
        <i></i>
        <span>数据概览</span>
      </p>
      <div class="check_content">
        <div
          class="check-item"
          v-for="(item,index) in riskStatus"
          :key="index"
          @click="selectList(item)"
          :style="item.id==selectId?'color:#256fff':''"
        >
          <div class="overview-icon">
            <img
              :src="item.id==0?dainianjian:item.id==1?daixubao:item.id==2?gaofengxian:item.id==3?sijizheng:item.id==4?yuqi:item.id==5?lichengyichang:item.id==6?GPSlixian:item.id==7?GPSdili:item.id==8?GPSOther:''"
              alt
            />
          </div>
          <div class="overview-content">
            <span>{{item.id==0?staticInfo.motNum:item.id==1?staticInfo.insuranceNum:item.id==2?staticInfo.breakRuleNum:item.id==3?staticInfo.licenseOverdueNum:item.id==4?staticInfo.contractOverdueNum:item.id==5?staticInfo.abnormalMileageNum:item.id==6?staticInfo.gpsOffline:item.id==7?staticInfo.gpsLbs:item.id==8?staticInfo.gpsAlert:''}}</span>
            <p>{{item.label}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="nav">
      <div class="overview_title">
        <i></i>
        <span>操作栏</span>
      </div>
      <div class="operate_button">
        <el-button type="primary" size="mini" @click="navigatePage('addSign','add')">新增收车</el-button>
        <el-button type="primary" size="mini" @click="navigatePage('addRenewal','')">失信查询</el-button>
        <el-button type="primary" size="mini" @click="navigatePage('addRenewal','')">违章查询</el-button>
        <el-button type="primary" size="mini" @click="navigatePage('addPolicy','add')">新增保单</el-button>
        <el-button type="primary" size="mini" @click="navigatePage('addMot','add')">新增年检</el-button>
        <el-button type="primary" size="mini" @click="navigatePage('addRenewal','')">司机核查</el-button>
        <el-button type="primary" size="mini" @click="navigatePage('addRenewal','')">车辆核查</el-button>
        <el-button type="primary" size="mini" @click="navigatePage('addRenewal','')">设置里程</el-button>
      </div>
    </div>
    <!-- *************************************待年检车辆******************** -->
    <div class="customer_list" v-show="activeName=='motVehicle'">
      <div class="search">
        <div>
          <span style="font-size:12px;">待签约</span>
          <!--动态变化的值-->
          <el-input placeholder="请输入车牌/公司/品牌车型" v-model="searchContent" size="mini"></el-input>
          <el-button size="mini" type="primary" icon="el-icon-search" @click="getMotRecord">搜索</el-button>
        </div>
        <el-button size="mini" type="primary" icon="el-icon-search" style="margin-right:20px;">导出</el-button>
      </div>
      <el-table
        :data="motVehicleList"
        style="width: 98%"
        :header-cell-style="{'background':'#f1f4fb','text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
        :cell-style="{'text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
      >
        <el-table-column prop="licensePlate" label="车牌号"></el-table-column>
        <el-table-column prop="holderCompany.companyName" label="公司名"></el-table-column>
        <el-table-column label="品牌车型">
          <template slot-scope="scope">
            <span>{{scope.row.vehicleModel.brand}}-{{scope.row.vehicleModel.model}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="expireDate" label="年检到期时间"></el-table-column>
        <el-table-column label="年检剩余天数">
          <template slot-scope="scope">
            <span>{{scope.row.expireStatus==0?'剩余'+scope.row.remainDays:'已逾期'+scope.row.remainDays}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span
              style="font-size:14px;color:#256fff;cursor:pointer"
              @click="gotoMotRecord(scope.row)"
            >查看</span>
            <!-- <i class="splitLine"></i> -->
            <!-- <span
              style="font-size:14px;color:#e53935;cursor:pointer"
              @click="deleteMot(scope.row)"
            >删除</span>-->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <span>共{{total}}条数据</span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="size"
          layout=" prev, pager, next, sizes,jumper"
          :total="total"
          background
        ></el-pagination>
      </div>
    </div>
    <!-- *********************其他类型列表********************8 -->
    <keep-alive>
      <component :is="selectView" v-show="activeName!=`motVehicle`"></component>
    </keep-alive>
  </div>
</template>
<script>
import { mapState } from "vuex";
import http from "@/api/riskManagementApi";
import renewalVehicle from "@/components/riskManageComponents/renewalVehicle";
import dainianjian from "../../assets/images/fengkong/ic_fengkong_dainianjian.svg";
import daixubao from "../../assets/images/fengkong/ic_fengkong_daixubao.svg";
import sijizheng from "../../assets/images/fengkong/ic_fengkong_sijizhengjiandaoqi.svg";
import gaofengxian from "../../assets/images/fengkong/ic_fengkong_weizhang.svg";
import yuqi from "../../assets/images/fengkong/ic_fengkong_yuqi.svg";
import lichengyichang from "../../assets/images/fengkong/ic_fengkong_lichengyichang.svg";
import GPSlixian from "../../assets/images/fengkong/ic_fengkong_gps_lixian.svg";
import GPSdili from "../../assets/images/fengkong/ic_fengkong_gps_diliweilan.svg";
import GPSOther from "../../assets/images/fengkong/ic_fengkong_gps_qitagaojing.svg";
export default {
  name: `customerManage`,
  data() {
    return {
      dainianjian,
      daixubao,
      sijizheng,
      yuqi,
      lichengyichang,
      GPSlixian,
      GPSdili,
      GPSOther,
      gaofengxian,
      motVehicleList: [],
      page: 1,
      size: 10,
      total: 0,
      staticInfo: {},
      searchContent: ``,
      riskStatus: [
        { label: "待年检车辆", id: 0 },
        { label: "待续保车辆", id: 1 },
        { label: "高风险违章车辆", id: 2 },
        { label: "司机证到期", id: 3 },
        { label: "逾期客户", id: 4 },
        { label: "里程异常车辆", id: 5 },
        { label: "GPS离线车辆", id: 6 },
        { label: "GPS地理围栏", id: 7 },
        { label: "GPS其他警告", id: 8 }
      ],
      activeName: "motVehicle",
      selectId: 0
    };
  },
  computed: {
    ...mapState(`user`, [`tenantId`]),
    selectView() {
      return this.activeName == "renewalVehicle" ? "renewalVehicle" : "";
    }
  },
  components: {
    renewalVehicle
  },
  activated() {
    this.getMotRecord();
    this.getStatics();
  },
  methods: {
    getStatics() {
      let tenantId = this.tenantId;
      http.getRiskStatics(tenantId).then(data => {
        if (data.code == 0) {
          this.staticInfo = data.data;
        }
      });
    },
    handleSizeChange() {},
    handleCurrentChange() {},
    navigatePage(page, pageType) {
      this.$router.push({ name: page, query: { pageType } });
    },
    gotoMotRecord(row) {
      console.log(row);
      this.$router.push({
        name: `motRecord`,
        query: { licensePlate: row.licensePlate }
      });
    },
    indexMethods(index) {
      // return (this.activeForm.page - 1) * this.activeForm.size + index + 1;
    },
    //查询车辆年检记录
    getMotRecord() {
      let params = {
        searchContent: this.searchContent,
        size: this.size,
        page: this.page
      };
      let tenantId = this.tenantId;
      http.getVehicleMots(params, tenantId).then(data => {
        console.log(data);
        if (data.code == 0) {
          this.motVehicleList = data.data;
          this.total = data.total;
        }
      });
    },
    selectList(item) {
      this.activeName =
        item.label == "待年检车辆" ? "motVehicle" : "renewalVehicle";
      this.selectId = item.id;
      if (item.label == "待年检车辆") {
        this.getMotRecord();
      }
    },
    // 删除
    deleteSign(row) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
<style lang="stylus" scoped>
#riskManagement {
  margin: 12px;

  .check_content {
    // padding: 20px;
    background: #fff;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .check-item {
    // flex: 1;
    display: flex;
    align-items: center;
    padding: 20px 0 20px 20px;
    cursor: pointer;

    &:hover {
      // background:red
      color: #1890ff;
    }

    span {
      font-size: 12px;
    }

    p {
      font-size: 16px;
      font-weight: bold;
      padding: 0;
      margin: 0;
      margin-top: 18px;
    }

    &:nth-last-child(1) {
      .overview-content {
        border: 0;
      }
    }
  }

  .nav {
    margin-top: 8px;
    // padding: 12px;
    background: #fff;
  }

  .customer_list {
    background: #fff;
    margin-top: 12px;
    // padding-bottom: 12px;
  }

  .el-button--primary {
    color: #FFF;
    background-color: #1890ff;
    border-color: #1890ff;
  }

  .search {
    display: flex;
    align-items: center;
    padding: 8px 12px 8px 12px;
    border-bottom: 1px solid #eee;
    justify-content: space-between;
    // width 100%;
    background: #fff;
  }

  .el-input {
    width: 220px;
    margin: 0 12px;
  }

  .el-table {
    margin: 0 auto;
    width: 98%;
  }

  .el-pagination {
    // margin-top: 12px;
    // padding-left: 12px;
  }

  .overview_title {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #dcdfe6;
    padding: 10px;
    margin: 0;
    background: #fff;

    i {
      display: inline-block;
      width: 2px;
      height: 16px;
      background: #256fff;
      margin-right: 12px;
    }

    span {
      font-size: 16px;
    }
  }

  .overview-icon {
    width: 59px;
    height: 59px;
    border-radius: 50px;
    margin-right: 15px;
  }

  .overview-content {
    display: flex;
    align-items: center;
    flex-direction: column;
    border-right: 1px solid #dcdfe6;
    padding-right: 20px;

    span {
      font-size: 28px;
    }

    p {
      font-size: 14px;
    }
  }

  .operate_button {
    padding: 20px;
  }

  .pagination {
    // width: 100%
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 40px;

    span {
      font-size: 12px;
    }
  }

  .splitLine {
    display: inline-block;
    height: 14px;
    width: 1px;
    background: #e4e7ed;
    margin: 0 12px;
  }
}
</style>